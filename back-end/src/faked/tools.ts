export type Tool = {
	id: string;
	name: string;
	status: "AVAILABLE" | "CHECKEDOUT";
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
	{
		id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
		name: "Cordless Drill",
		status: "CHECKEDOUT",
		qty: 0,
	},
	{
		id: "7b2e9a1c-d4f3-4e8b-9a1c-5f6d7e8a9b0c",
		name: "Claw Hammer",
		status: "AVAILABLE",
		qty: 12,
	},
	{
		id: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
		name: "Circular Saw",
		status: "AVAILABLE",
		qty: 2,
	},
	{
		id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2g3h4i5j",
		name: "Adjustable Wrench",
		status: "CHECKEDOUT",
		qty: 1,
	},
];
