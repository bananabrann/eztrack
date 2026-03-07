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

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);

	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-full md:max-w-3xl mt-6 mb-6">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th className="text-tertiary text-lg">Material</th>
						<th className="text-tertiary text-lg">Cost</th>
						<th className="text-tertiary text-lg">Quantity Used</th>
						<th className="text-tertiary text-lg">Quantity Available</th>
					</tr>
				</thead>
				<tbody>
					{rows.map(row => (
						<tr key={row.id}>
							<td>{row.name}</td>
							<td>{formatCurrency(row.price)}</td>
							<td>{row.quantityUsed}</td>
							<td>{row.quantityAvailable}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export type { ProjectMaterialRow };
