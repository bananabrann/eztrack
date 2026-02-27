import { ApiTestComponent } from "../../src/features/materials/test";

export default function Materials() {
	return (
		<div className="flex flex-col gap-6 items-center mt-8">
			<h1 className="text-2xl font-bold">Materials</h1>
			<div className="flex w-52 flex-col gap-4">
				<div className="skeleton h-32 w-full"></div>
				<div className="skeleton h-4 w-28"></div>
				<div className="skeleton h-4 w-full"></div>
				<div className="skeleton h-4 w-full"></div>
			</div>
			<ApiTestComponent />
		</div>
	);
}
