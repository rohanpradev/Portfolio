import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://yourdomain.com";

export default defineConfig({
	site: siteUrl,
	adapter: node({ mode: "standalone" }),
	devToolbar: { placement: "bottom-left" },
	env: {
		schema: {
			PUBLIC_SITE_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
				default: siteUrl,
			}),
			POSTMARK_SERVER_TOKEN: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
			POSTMARK_FROM_EMAIL: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
			POSTMARK_TO_EMAIL: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
			POSTMARK_MESSAGE_STREAM: envField.string({
				context: "server",
				access: "secret",
				optional: true,
				default: "outbound",
			}),
		},
	},
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
			config: { kernel: "mks2021" },
		},
	},
});
