import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/projects",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			seoTitle: z.string().optional(),
			seoDescription: z.string().optional(),
			order: z.number().default(0),
			featured: z.boolean().default(false),
			company: z.string(),
			role: z.string(),
			duration: z.string(),
			engagement: z.string(),
			publishedDate: z.date(),
			updatedDate: z.date(),
			tech: z.array(z.string()).min(1),
			services: z.array(z.string()).default([]),
			outcomes: z
				.array(
					z.object({
						value: z.string(),
						label: z.string(),
					}),
				)
				.min(1),
			cover: image(),
			coverAlt: z.string(),
			gallery: z
				.array(
					z.object({
						src: image(),
						alt: z.string(),
						caption: z.string().optional(),
					}),
				)
				.min(1),
		}),
});

export const collections = {
	projects,
};
