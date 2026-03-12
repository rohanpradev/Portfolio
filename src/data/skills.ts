export interface SkillGroup {
	title: string;
	description: string;
	items: string[];
}

export const skillGroups: SkillGroup[] = [
	{
		title: "Languages and Markup",
		description:
			"Strong fundamentals across modern web languages with an emphasis on maintainable, production-grade frontend code.",
		items: ["JavaScript", "TypeScript", "HTML", "CSS", "SCSS"],
	},
	{
		title: "Frontend Systems",
		description:
			"Component-driven product interfaces built for scale, data-heavy flows, and enterprise usability requirements.",
		items: ["React.js", "Next.js", "React Query", "React Router", "Formik"],
	},
	{
		title: "Backend and APIs",
		description:
			"Secure service development with modern auth patterns, API contracts, and high-confidence integration layers.",
		items: [
			"Node.js",
			"Bun.js",
			"REST APIs",
			"Passport.js",
			"OAuth 2.0",
			"Azure AD",
		],
	},
	{
		title: "Data and Persistence",
		description:
			"Relational and document data layers designed for clear models, fast queries, and maintainable application boundaries.",
		items: ["PostgreSQL", "MongoDB", "Prisma", "Drizzle ORM"],
	},
	{
		title: "Cloud, Messaging, and Delivery",
		description:
			"Cloud-native services, containerization, and event-driven infrastructure that keep enterprise apps resilient in production.",
		items: ["Microsoft Azure", "Docker", "Kafka", "RabbitMQ", "CI/CD"],
	},
	{
		title: "Architecture, Quality, and AI",
		description:
			"System design, testing, and AI integration capabilities used to ship more capable products without sacrificing reliability.",
		items: [
			"Cypress",
			"Jest",
			"System Design",
			"Swagger/OpenAPI",
			"OpenAI APIs",
			"RAG",
			"Vercel AI SDK",
		],
	},
];
