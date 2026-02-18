export type Material = {
	id: string;
	name: string;
	unitQty: number;
	unitCost: number;
	lowStockThreshold: number;
	projectId: string;
};

export const materials: Material[] = [
	{
		id: "478a6bab-f8c7-4aae-af56-828e828b1928",
		name: "Nails",
		unitQty: 300,
		unitCost: 10.5,
		lowStockThreshold: 20,
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
	},
	{
		id: "26f7d10b-896e-49fb-853e-053907cfb7a1",
		name: "2x4",
		unitQty: 47,
		unitCost: 5,
		lowStockThreshold: 15,
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
	},
	{
		id: "e1cef280-dc1c-4fdd-ace6-0074f8e34d51",
		name: "2x6",
		unitQty: 22,
		unitCost: 7,
		lowStockThreshold: 15,
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
	},
	{
		id: "cdbb0154-f36b-4cef-9207-2b9afe00ae53",
		name: "Drywall Sheet",
		unitQty: 75,
		unitCost: 15,
		lowStockThreshold: 15,
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
	},
	{
		id: "39f4d773-88f3-49df-8949-04de1fd19efa",
		name: "Screws",
		unitQty: 650,
		unitCost: 12,
		lowStockThreshold: 20,
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
	},
	{
		id: "3f5c0e42-e347-4381-9117-562d07e4ac4a",
		name: "Roof Shingles",
		unitQty: 5,
		unitCost: 45,
		lowStockThreshold: 10,
		projectId: "2b7d9af6-01a5-4192-8ba2-7a5fc65d7a54",
	},
];
