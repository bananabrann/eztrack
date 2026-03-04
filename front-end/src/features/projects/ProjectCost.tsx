type ProjectCostProps = {
	totalCost: number;
};

export default function ProjectCost({ totalCost }: ProjectCostProps) {
	return (
		<div className="card bg-primary text-center text-primary-content w-100 max-w-4xl mx-auto mb-6 mt-8">
			<div className="card-body">
				<h2 className="text-xl font-bold text-secondary">
					Total Project Cost: ${totalCost.toFixed(2)}
				</h2>
			</div>
		</div>
	);
}
