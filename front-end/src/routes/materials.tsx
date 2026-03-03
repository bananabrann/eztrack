import { MaterialsTable } from "../../src/features/materials/MaterialsTable";

export default function Materials() {
	return (
		<main className="max-w-7xl mx-auto px-6 py-16">
			<h1 className="text-[--tertiary-color] text-3xl font-bold mb-6 flex items-center justify-center">
				Materials Management
			</h1>
			<MaterialsTable />
		</main>
	);
}
