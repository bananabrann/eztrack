export type MaterialUsage = {
	id: string;
	materialId: string;
	projectId: string;
	quantityUsed: number;
	totalCost: number;
};

export const materialUsage: MaterialUsage[] = [];
