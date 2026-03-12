import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://yourusername.github.io";
const basePath = process.env.PUBLIC_BASE_PATH?.trim();

export default defineConfig({
	site: siteUrl,
	...(basePath ? { base: basePath } : {}),
	devToolbar: { placement: "bottom-left" },
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
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
