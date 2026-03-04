type ProjectMaterialRow = {
	id: string;
	name: string;
	price: number;
	quantityAvailable: number;
	quantityUsed: number;
};

type ProjectDetailsTableProps = {
	rows: ProjectMaterialRow[];
};

export default function ProjectDetailsTable({ rows }: ProjectDetailsTableProps) {
	const totalUsed = rows.reduce((sum, row) => sum + row.quantityUsed, 0);

	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-4xl mx-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>Material</th>
						<th>Price</th>
						<th>Quantity Available</th>
						<th>Quantity Used</th>
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
				<tfoot>
					<tr>
						<th>Total</th>
						<th>-</th>
						<th>-</th>
						<th>{totalUsed}</th>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

export type { ProjectMaterialRow };
