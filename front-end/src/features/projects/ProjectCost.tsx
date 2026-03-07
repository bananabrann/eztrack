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
		<div className="w-full px-4 mb-8 mt-8">
			<div className="max-w-full md:max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary rounded-lg p-4 md:p-8 shadow-md">
				<div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 md:gap-6">
					<div className="flex items-center gap-4">
						<div className="bg-primary rounded-full p-2 md:p-3">
							<DollarSign
								className="text-primary-content w-6 h-6 md:w-8 md:h-8"
								size={32}
							/>
						</div>
						<div className="text-center md:text-left">
							<h2 className="text-xs md:text-sm font-semibold text-base-content/70 uppercase tracking-wide">
								Total Project Cost
							</h2>
							<p className="text-xs text-base-content/50 mt-1">
								Cumulative material expense
							</p>
						</div>
					</div>
					<div className="text-center md:text-right">
						<div className="text-2xl md:text-4xl font-bold text-primary">
							{formatCurrency(totalCost)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
