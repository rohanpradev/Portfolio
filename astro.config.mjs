import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";

function stripOuterQuotes(value) {
	if (!value) {
		return "";
	}

	return value.trim().replace(/^(['"])(.*)\1$/, "$2");
}

function resolveSiteUrl() {
	const repoOwner = stripOuterQuotes(process.env.GITHUB_REPOSITORY_OWNER);
	const fallback = repoOwner
		? `https://${repoOwner}.github.io`
		: "https://yourusername.github.io";
	const raw = stripOuterQuotes(process.env.PUBLIC_SITE_URL);

	if (!raw) {
		return fallback;
	}

	const candidate = /^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`;

	try {
		return new URL(candidate).toString().replace(/\/$/, "");
	} catch {
		return fallback;
	}
}

function resolveBasePath() {
	const raw = stripOuterQuotes(process.env.PUBLIC_BASE_PATH);

	if (raw) {
		const normalized = raw.startsWith("/") ? raw : `/${raw}`;
		return normalized === "/" ? undefined : normalized.replace(/\/$/, "");
	}

	const repoOwner = stripOuterQuotes(process.env.GITHUB_REPOSITORY_OWNER);
	const repoName = stripOuterQuotes(process.env.GITHUB_REPOSITORY)?.split("/")[1];

	if (!repoOwner || !repoName || repoName === `${repoOwner}.github.io`) {
		return undefined;
	}

	return `/${repoName}`;
}

const siteUrl = resolveSiteUrl();
const basePath = resolveBasePath();

export default defineConfig({
	site: siteUrl,
	...(basePath ? { base: basePath } : {}),
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover",
	},
	env: {
		schema: {
			PUBLIC_SITE_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
				default: siteUrl,
			}),
			PUBLIC_BASE_PATH: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
			PUBLIC_RESUME_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
		},
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Geist Sans",
			cssVariable: "--font-geist-sans",
			weights: [400, 500, 600, 700, 800, 900],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["Inter", "system-ui", "sans-serif"],
		},
		{
			provider: fontProviders.fontsource(),
			name: "Geist Mono",
			cssVariable: "--font-geist-mono",
			weights: [400, 500, 700],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["monospace"],
		},
	],
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
