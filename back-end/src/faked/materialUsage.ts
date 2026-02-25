export type MaterialUsage = {
	id: string;
	materialId: string;
	projectId: string;
	quantityUsed: number;
	totalCost: number;
};

export const materialUsage: MaterialUsage[] = [
	{
		id: "7c3b8c4e-2f4a-4c8d-9c3e-1a2b4f6d9e01",
		materialId: "478a6bab-f8c7-4aae-af56-828e828b1928", // Nails
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
		quantityUsed: 120,
		totalCost: 1260,
	},
	{
		id: "b1f2d3c4-5e6f-7a89-b0c1-d2e3f4a5b6c7",
		materialId: "26f7d10b-896e-49fb-853e-053907cfb7a1", // 2x4
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
		quantityUsed: 18,
		totalCost: 90,
	},
	{
		id: "c9d8e7f6-a5b4-3c2d-1e0f-9a8b7c6d5e4f",
		materialId: "e1cef280-dc1c-4fdd-ace6-0074f8e34d51", // 2x6
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
		quantityUsed: 9,
		totalCost: 63,
	},
	{
		id: "f1234567-89ab-4cde-b012-3456789abcde",
		materialId: "cdbb0154-f36b-4cef-9207-2b9afe00ae53", // Drywall Sheet
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
		quantityUsed: 12,
		totalCost: 180,
	},
	{
		id: "0abc1234-def5-6789-abcd-ef0123456789",
		materialId: "39f4d773-88f3-49df-8949-04de1fd19efa", // Screws
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
		quantityUsed: 300,
		totalCost: 3600,
	},
	{
		id: "9f8e7d6c-5b4a-3c2d-1e0f-a9b8c7d6e5f4",
		materialId: "3f5c0e42-e347-4381-9117-562d07e4ac4a", // Roof Shingles
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
		quantityUsed: 3,
		totalCost: 135,
	},
];
