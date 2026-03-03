import { useEffect, useState } from "react";
import type { Materials } from "../../types/materials";
import { apiFetch } from "../../api/api";
import { TriangleAlert } from "lucide-react";

export function MaterialsTable() {
	const [materials, setMaterials] = useState<Materials[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Fetching the API
	 */
	useEffect(() => {
		apiFetch<{ data: Materials[]; message: string }>("/materials")
			.then(({ data: materialsArray = [] }) => {
				setMaterials(materialsArray);
				setLoading(false);
			})
			.catch((error: unknown) => {
				const message =
					error instanceof Error ? error.message : "Failed to fetch materials.";
				setError(message);
				setLoading(false);
			});
	}, []);

	// Loading indicator
	if (loading) return <div>Loading...</div>;
	// Error indicator
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>Name</th>
						<th>Quantity</th>
						<th>Unit Cost</th>
						<th>Low Stock Threshold</th>
					</tr>
				</thead>
				<tbody>
					{materials.map(material => (
						<tr key={material.id} className="hover">
							<td className="font-medium">
								<span className="flex items-center gap-2">
									{material.name}
									{material.unit_qty < material.low_stock_threshold && (
										<TriangleAlert size={16} className="text-warning" />
									)}
								</span>
							</td>
							<td>{material.unit_qty}</td>
							<td>${material.unit_cost.toFixed(2)}</td>
							<td>{material.low_stock_threshold}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
