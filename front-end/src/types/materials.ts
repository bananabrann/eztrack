export interface Material {
	id: string;
	name: string;
	unitQty: number;
	unitCost: number;
	lowStockThreshold: number;
	projectId: string;
}
