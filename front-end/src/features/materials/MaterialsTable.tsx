import { useEffect, useState } from "react";
import { Materials } from "../../types/materials";
// import {apiFetch} form "../../types/"

export function MaterialsTable() {
	const [materials, setMaterials] = useState<Materials[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiFetch<Materials[]>("/materials")
			.then(data => {
				setMaterials(data);
				setLoading(false);
			})
			.catch(error => {
				setError(error.message || "Failed to fetch materials.");
				setLoading(false);
			});
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Quantity (unit_qty)</th>
					<th>Unit Cost (unit_cost)</th>
					<th>Low Stock Threshold (low_stock_threshold)</th>
				</tr>
			</thead>
			<tbody>
				{materials.map(material => (
					<tr key={material.id}>
						<td>{material.name}</td>
						<td>{material.unit_qty}</td>
						<td>{material.unit_cost}</td>
						<td>{material.low_stock_threshold}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
