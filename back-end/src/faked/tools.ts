export type Tool = {
	id: string;
	name: string;
	status: "AVAILABLE" | "UNAVAILABLE";
	qty: number;
};

export const tools: Tool[] = [
	{
		id: "5af7f611-b39c-48d4-9188-f6ac1b332eb5",
		name: "Hammer",
		status: "AVAILABLE",
		qty: 1,
	},
	{
		id: "d1c9e5b8-9a3e-4c2f-8b6a-2f7e5d9a1c3f",
		name: "Screwdriver",
		status: "AVAILABLE",
		qty: 1,
	},
];
