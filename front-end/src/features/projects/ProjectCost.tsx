type ProjectCostProps = {
	totalCost: number;
};

export default function ProjectCost({ totalCost }: ProjectCostProps) {
	return (
		<div className="mt-6 text-center">
			<h2 className="text-xl font-semibold text-secondary">Total Project Cost</h2>
			<p className="text-2xl font-bold text-secondary">
				${totalCost.toFixed(2)}
			</p>
		</div>
	);
}
