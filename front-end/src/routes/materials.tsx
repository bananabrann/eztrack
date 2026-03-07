import { MaterialsTable } from "../../src/features/materials/MaterialsTable";

export default function Materials() {
	return (
		<main className="min-h-screen max-w-7xl mx-auto px-6 py-16">
			<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl mb-6 flex items-center justify-center">
				Materials Management
			</h1>
			<MaterialsTable />
		</main>
	);
}
