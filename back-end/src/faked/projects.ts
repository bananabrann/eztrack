export type Project = {
	id: string;
	projectName: string;
	status: "ACTIVE" | "COMPLETED";
	startDate: string;
	endDate: string;
};

// fake projects
export const projects: Project[] = [
	{
		id: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
		projectName: "Glass Half Full Pub",
		status: "ACTIVE",
		startDate: "2026-02-11",
		endDate: "2026-06-11",
	},
	{
		id: "9d7aca13-0490-4dd7-9e23-d56d4eb64a1c",
		projectName: "Dirty Laundry: Laundromat",
		status: "ACTIVE",
		startDate: "2026-02-11",
		endDate: "2026-08-01",
	},
	{
		id: "f8e3d076-6691-4c12-92b5-54ba66a759fa",
		projectName: "Smallville Airport",
		status: "COMPLETED",
		startDate: "2025-07-15",
		endDate: "2026-1-17",
	},
	{
		id: "ef13a938-63fb-4b50-baa3-debe1da92178",
		projectName: "Avg Joe's Gym",
		status: "ACTIVE",
		startDate: "2026-02-11",
		endDate: "2026-06-04",
	},
	{
		id: "34469918-140f-4ec1-8751-428e39b7ae00",
		projectName: "I don't like this at all",
		status: "ACTIVE",
		startDate: "2026-02-11",
		endDate: "2026-03-11",
	},
	{
		id: "4869b574-bab3-42f3-a512-7aaa6a0d2a90",
		projectName: "Blockbuster Museum",
		status: "ACTIVE",
		startDate: "2026-02-11",
		endDate: "2026-6-17",
	},
];
