import profilePhoto from "../assets/profile/profile-photo.png";
import { PUBLIC_SITE_URL } from "astro:env/client";

function stripOuterQuotes(value: string | undefined) {
	if (!value) {
		return "";
	}

	return value.trim().replace(/^(['"])(.*)\1$/, "$2");
}

function resolveSiteUrl() {
	const raw = stripOuterQuotes(PUBLIC_SITE_URL);

	if (!raw) {
		return "https://yourusername.github.io";
	}

	const candidate = /^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`;

	try {
		return new URL(candidate).toString().replace(/\/$/, "");
	} catch {
		return "https://yourusername.github.io";
	}
}

const siteUrl = resolveSiteUrl();
const basePath =
	import.meta.env.BASE_URL === "/"
		? ""
		: import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBasePath(path: string) {
	if (!path.startsWith("/")) {
		return path;
	}

	if (!basePath) {
		return path;
	}

	return path === "/" ? `${basePath}/` : `${basePath}${path}`;
}

const homeUrl = new URL(withBasePath("/"), siteUrl).toString();

export const site = {
	name: "M Rohan Pradev",
	title: "M Rohan Pradev | Senior Full-Stack Engineer",
	description:
		"Senior full-stack engineer in Bengaluru building fast, secure, and maintainable product systems with React, TypeScript, Node.js, Redis, Azure, and AI-assisted workflows.",
	shortDescription:
		"Portfolio focused on enterprise product engineering, frontend architecture, and AI-enabled workflow design.",
	url: siteUrl,
	author: "M Rohan Pradev",
	role: "Senior Full-Stack Engineer",
	headline:
		"Senior full-stack engineer for enterprise web platforms, secure integrations, and AI-assisted product experiences.",
	location: "Bengaluru, Karnataka, India",
	email: "rohanpradev@hotmail.com",
	availability:
		"Open to senior full-stack, frontend architecture, and AI product roles.",
	basePath,
	homeUrl,
	ogImage: withBasePath("/og-cover.png"),
	ogImageWidth: 1200,
	ogImageHeight: 630,
	profilePhoto,
	expertise: [
		"React architecture",
		"TypeScript application design",
		"Node.js services",
		"Redis caching",
		"Azure-aligned delivery",
		"OpenAI integrations",
		"Retrieval-augmented generation",
		"Frontend performance",
		"Secure API integration",
	],
	nav: [
		{ label: "Home", href: withBasePath("/") },
		{ label: "Projects", href: withBasePath("/projects") },
		{ label: "About", href: withBasePath("/about") },
		{ label: "Contact", href: withBasePath("/contact") },
	],
	social: {
		github: "https://github.com/rohanpradev",
		linkedin: "https://www.linkedin.com/in/rohan-pradev",
	},
};
