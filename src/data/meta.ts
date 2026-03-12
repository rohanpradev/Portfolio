function stripOuterQuotes(value: string | undefined) {
	if (!value) {
		return "";
	}

	return value.trim().replace(/^(['"])(.*)\1$/, "$2");
}

function resolveSiteUrl() {
	const raw = stripOuterQuotes(import.meta.env.PUBLIC_SITE_URL);

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
		"Senior Full-Stack Engineer with 9+ years of experience delivering scalable, secure, and high-performance web applications with React, TypeScript, Node.js, PostgreSQL, MongoDB, Azure, and generative AI integrations.",
	shortDescription:
		"Enterprise-grade full-stack engineering for high-performance products, secure integrations, and AI-powered workflows.",
	url: siteUrl,
	author: "M Rohan Pradev",
	role: "Senior Full-Stack Engineer",
	location: "Bengaluru, Karnataka, India",
	email: "rohanpradev@hotmail.com",
	availability:
		"Open to senior full-stack, frontend architecture, and AI product roles.",
	basePath,
	homeUrl,
	ogImage: withBasePath("/og-cover.svg"),
	keywords: [
		"Senior full-stack engineer",
		"React engineer",
		"TypeScript engineer",
		"Node.js engineer",
		"Next.js developer",
		"Azure engineer",
		"PostgreSQL developer",
		"MongoDB developer",
		"OpenAI API integration",
		"RAG applications",
		"Astro portfolio",
		"Frontend architecture",
		"Microservices",
		"Web performance",
	],
	nav: [
		{ label: "Work", href: withBasePath("/#projects") },
		{ label: "Experience", href: withBasePath("/#experience") },
		{ label: "About", href: withBasePath("/about") },
		{ label: "Contact", href: withBasePath("/contact") },
	],
	social: {
		github: "https://github.com/rohanpradev",
		linkedin: "https://www.linkedin.com/in/rohan-pradev",
	},
};
