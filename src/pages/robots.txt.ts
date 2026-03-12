import { site, withBasePath } from "../data/meta";

export function GET() {
	const sitemapUrl = new URL(
		withBasePath("/sitemap-index.xml"),
		site.url,
	).toString();

	return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}
