import type { ImageMetadata } from "astro";
import planVsOutput from "../assets/projects/plan-vs-output.png";

export interface Project {
	title: string;
	description: string;
	tech: string[];
	image: ImageMetadata;
	alt: string;
}

export const projects: Project[] = [
	{
		title: "Smart Manufacturing and Office Experience",
		description:
			"Built React-based product surfaces with Hono, Express, Node.js, Redis, and Azure for smart manufacturing and workplace operations, including live office occupancy with Redis caching, Eat and Drink data flows, web jobs that synced external data, and an office chatbot powered by the Vercel AI SDK.",
		tech: ["React", "Hono", "Redis", "Azure", "Express", "Vercel AI SDK"],
		image: planVsOutput,
		alt: "Screenshot representing the smart manufacturing and office experience project",
	},
];
