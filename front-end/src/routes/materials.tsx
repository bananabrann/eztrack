import { LowStockSection } from "../components/LowStockSection";
import { MaterialsTable } from "../../src/features/materials/MaterialsTable";

export default function Materials() {
	return (
		<div className="flex flex-col gap-6 items-center mt-8">
			<h1 className="text-2xl font-bold">Materials Lists</h1>
			<LowStockSection />
			<MaterialsTable />
		</div>
	);
}
