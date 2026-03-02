import { LowStockSection } from "../components/LowStockSection";

export default function Materials() {
	return (
		<div className="flex flex-col gap-6 items-center mt-8">
			<h1 className="text-2xl font-bold">Materials</h1>
			<LowStockSection />
		</div>
	);
}