/**
 * Types interface for the materials
 */
export interface Materials {
	id: string;
	name: string;
	unit_qty: number;
	unit_cost: number;
	low_stock_threshold: number;
	project_id: string;
	isLowStock?: boolean;
}

/**
 * Types interface for the material usage
 */
export interface MaterialUsage {
	id: string;
	material_id: string;
	project_id: string;
	quantity_used: number;
	total_cost: number;
}
