type ProjectMaterialRow = {
	id: string;
	name: string;
	price: number;
	quantityAvailable: number;
	quantityUsed: number;
};

type ProjectDetailsTableProps = {
	rows: ProjectMaterialRow[];
	totalPrice: number;
};

export default function ProjectDetailsTable({
	rows,
	totalPrice,
}: ProjectDetailsTableProps) {
	// totalUsed may be useful for future features, such as showing a progress bar of materials used vs available
	// const totalUsed = rows.reduce((sum, row) => sum + row.quantityUsed, 0);

	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-4xl mx-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th className="text-tertiary text-lg">Material</th>
						<th className="text-tertiary text-lg">Cost</th>
						<th className="text-tertiary text-lg">Quantity Available</th>
						<th className="text-tertiary text-lg">Quantity Used</th>
					</tr>
				</thead>
				<tbody>
					{rows.map(row => (
						<tr key={row.id}>
							<td>{row.name}</td>
							<td>${row.price.toFixed(2)}</td>
							<td>{row.quantityAvailable}</td>
							<td>{row.quantityUsed}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export type { ProjectMaterialRow };
