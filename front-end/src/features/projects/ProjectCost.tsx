import { DollarSign } from "lucide-react";

type ProjectCostProps = {
	totalCost: number;
};

export default function ProjectCost({ totalCost }: ProjectCostProps) {
	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);

	return (
		<div className="max-w-4xl mx-auto mb-8 mt-8">
			<div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary rounded-lg p-8 shadow-md">
				<div className="flex items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<div className="bg-primary rounded-full p-3">
							<DollarSign className="text-primary-content" size={32} />
						</div>
						<div>
							<h2 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide">
								Total Project Cost
							</h2>
							<p className="text-xs text-base-content/50 mt-1">
								Cumulative material expense
							</p>
						</div>
					</div>
					<div className="text-right">
						<div className="text-4xl font-bold text-primary">
							{formatCurrency(totalCost)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
