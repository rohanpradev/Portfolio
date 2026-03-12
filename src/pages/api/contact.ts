import {
	POSTMARK_FROM_EMAIL,
	POSTMARK_MESSAGE_STREAM,
	POSTMARK_SERVER_TOKEN,
	POSTMARK_TO_EMAIL,
} from "astro:env/server";
import type { APIRoute } from "astro";
import { site } from "../../data/meta";

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function jsonResponse(status: number, body: Record<string, unknown>) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

function redirectTo(
	request: Request,
	path: string,
	params: Record<string, string>,
) {
	const url = new URL(path, request.url);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}

	return Response.redirect(url, 303);
}

async function readPayload(request: Request) {
	const formData = await request.formData();

	return {
		name: String(formData.get("name") ?? "").trim(),
		email: String(formData.get("email") ?? "").trim(),
		company: String(formData.get("company") ?? "").trim(),
		engagement: String(formData.get("engagement") ?? "").trim(),
		message: String(formData.get("message") ?? "").trim(),
		redirectTarget:
			String(formData.get("redirectTo") ?? "/contact").trim() || "/contact",
		website: String(formData.get("website") ?? "").trim(),
	};
}

export const POST: APIRoute = async ({ request }) => {
	const acceptsJson =
		request.headers.get("accept")?.includes("application/json") ?? false;
	const payload = await readPayload(request);

	if (payload.website) {
		return acceptsJson
			? jsonResponse(200, { ok: true, message: "Message accepted." })
			: redirectTo(request, payload.redirectTarget, { sent: "1" });
	}

	const isValid =
		payload.name.length >= 2 &&
		EMAIL_PATTERN.test(payload.email) &&
		payload.message.length >= 20;

	if (!isValid) {
		return acceptsJson
			? jsonResponse(422, {
					ok: false,
					message: "Validation failed.",
					code: "validation",
				})
			: redirectTo(request, payload.redirectTarget, { error: "validation" });
	}

	if (!POSTMARK_SERVER_TOKEN || !POSTMARK_FROM_EMAIL) {
		return acceptsJson
			? jsonResponse(503, {
					ok: false,
					message: "Email service unavailable.",
					code: "unavailable",
				})
			: redirectTo(request, payload.redirectTarget, { error: "unavailable" });
	}

	const to = POSTMARK_TO_EMAIL ?? site.email;
	const subject = `Portfolio inquiry: ${payload.engagement || "General"} - ${payload.name}`;
	const textBody = [
		`Name: ${payload.name}`,
		`Email: ${payload.email}`,
		`Company: ${payload.company || "Not provided"}`,
		`Engagement: ${payload.engagement || "Not provided"}`,
		"",
		"Project brief:",
		payload.message,
	].join("\n");

	const htmlBody = `
		<html>
			<body style="font-family: Arial, sans-serif; color: #0f172a;">
				<h2 style="margin-bottom: 12px;">Portfolio inquiry</h2>
				<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
				<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
				<p><strong>Company:</strong> ${escapeHtml(payload.company || "Not provided")}</p>
				<p><strong>Engagement:</strong> ${escapeHtml(payload.engagement || "Not provided")}</p>
				<p><strong>Project brief:</strong></p>
				<p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
			</body>
		</html>
	`;

	try {
		const response = await fetch("https://api.postmarkapp.com/email", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
			},
			body: JSON.stringify({
				From: POSTMARK_FROM_EMAIL,
				To: to,
				Subject: subject,
				TextBody: textBody,
				HtmlBody: htmlBody,
				ReplyTo: payload.email,
				Tag: "portfolio-contact",
				MessageStream: POSTMARK_MESSAGE_STREAM ?? "outbound",
				Metadata: {
					source: "portfolio",
					engagement: payload.engagement || "general",
				},
			}),
		});

		const result = await response.json().catch(() => null);
		const hasError =
			!response.ok ||
			(result &&
				typeof result === "object" &&
				"ErrorCode" in result &&
				result.ErrorCode !== 0);

		if (hasError) {
			return acceptsJson
				? jsonResponse(502, {
						ok: false,
						message: "Provider rejected the message.",
						code: "provider",
					})
				: redirectTo(request, payload.redirectTarget, { error: "provider" });
		}

		return acceptsJson
			? jsonResponse(200, { ok: true, message: "Message sent successfully." })
			: redirectTo(request, payload.redirectTarget, { sent: "1" });
	} catch {
		return acceptsJson
			? jsonResponse(502, {
					ok: false,
					message: "Network error while sending.",
					code: "network",
				})
			: redirectTo(request, payload.redirectTarget, { error: "network" });
	}
};
