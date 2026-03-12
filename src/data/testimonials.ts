import type { ImageMetadata } from "astro";
import danielAvatar from "../assets/testimonials/daniel.jpeg";
import gaborAvatar from "../assets/testimonials/gabor.jpeg";

export interface Testimonial {
	name: string;
	role: string;
	feedback: string;
	avatar: ImageMetadata;
	date: string;
	context: string;
}

export const testimonials: Testimonial[] = [
	{
		name: "Daniel Jansson",
		role: "Senior Software Engineer | Frontend-focused Full-stack | React, TypeScript, .NET",
		feedback:
			"I had the pleasure of working with Rohan. He approached every task with enthusiasm and commitment to quality. I strongly recommend Rohan to anyone looking for a dedicated and realizable team member.",
		avatar: danielAvatar,
		date: "December 4, 2025",
		context: "Worked with Rohan on the same team",
	},
	{
		name: "Gabor Velancsics",
		role: "Senior Software Engineer | .NET, Flutter, Azure",
		feedback:
			"Rohan is a strong React developer, highly proactive, and great to work with in a team. He loves adopting new technologies and consistently brings valuable ideas to the project.",
		avatar: gaborAvatar,
		date: "December 3, 2025",
		context: "Worked with Rohan on the same team",
	},
];
