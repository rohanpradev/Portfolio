export interface Experience {
	company: string;
	role: string;
	logo: "optum" | "ericsson" | "mindtree" | "cognizant" | "techm";
	start: string;
	end: string;
	stack: string[];
	points: string[];
}

export const experiences: Experience[] = [
	{
		company: "Optum",
		role: "Lead Full Stack Engineer",
		logo: "optum",
		start: "Mar 2026",
		end: "Present",
		stack: ["Agentic AI", "Python", "Node.js", "React", "TypeScript"],
		points: [
			"Leading full-stack delivery for agentic AI capabilities, connecting Python-based AI services with Node.js APIs and modern frontend experiences.",
			"Building end-to-end product features across React and TypeScript interfaces, Node.js backend services, and Python agent workflows.",
			"Shaping maintainable service boundaries and integration patterns for production-focused AI and full-stack engineering.",
		],
	},
	{
		company: "Ericsson India Global Services Pvt. Ltd",
		role: "Senior Software Engineer",
		logo: "ericsson",
		start: "May 2022",
		end: "Mar 2026",
		stack: ["React", "Hono", "Redis", "Azure", "Node.js", "Vercel AI SDK"],
		points: [
			"Owned end-to-end delivery for enterprise web modules across React-led product surfaces and Node.js services.",
			"Designed responsive data experiences with Redis-backed caching and maintainable backend orchestration.",
			"Implemented backend sync jobs to pull and normalize external data while keeping frontend data flow responsive and predictable.",
			"Built AI-assisted internal workflows with the Vercel AI SDK and secure Azure-aligned integration patterns.",
		],
	},
	{
		company: "Mindtree Ltd.",
		role: "Module Lead",
		logo: "mindtree",
		start: "Dec 2020",
		end: "May 2022",
		stack: ["React", "TypeScript", "Storybook", "React Hook Form"],
		points: [
			"Led frontend delivery for Link Group beneficiary and pension workflows using React, TypeScript, and Storybook-based component patterns.",
			"Built balance-check and pension-management journeys with advanced react-hook-form handling for dynamic validation and dependent field behavior.",
			"Implemented reactive forms that calculated multiple pension outputs based on payment frequency while autopopulating connected fields accurately.",
			"Acted as Module Lead across design reviews, PR reviews, mentoring, and frontend architecture decisions for maintainable enterprise delivery.",
		],
	},
	{
		company: "Cognizant Technology Solutions",
		role: "Associate Software Engineer",
		logo: "cognizant",
		start: "Aug 2019",
		end: "Dec 2020",
		stack: ["React", "react-hook-form", "Jest", "Reusable Components"],
		points: [
			"Developed Front Desk applications for IHG Hotels using React, supporting hotel operations and guest management workflows.",
			"Implemented advanced search and form flows with react-hook-form, improving performance and usability on complex screens.",
			"Built reusable components, centralized error handling, and unit tests with Jest to improve stability and maintainability.",
		],
	},
	{
		company: "Tech Mahindra Ltd.",
		role: "Software Engineer",
		logo: "techm",
		start: "Dec 2016",
		end: "Aug 2019",
		stack: ["Angular", "Node.js", "Express", "MongoDB", "AWS S3"],
		points: [
			"Contributed to enterprise application delivery aligned with Tech Mahindra's New Age Delivery model across full-stack web workflows.",
			"Built applications with Angular, Node.js, Express, and MongoDB for enterprise clients with delivery discipline suited to large programs.",
			"Integrated AWS S3 pre-signed uploads and voice-enabled features, while delivering RESTful backend services for business-critical systems.",
		],
	},
];
