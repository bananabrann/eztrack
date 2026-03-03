import React, { useState } from "react";
import { Button } from "../../src/components/Button";
import MaterialFormModal from "../../src/features/materials/MaterialFormModal";
import type { Materials } from "../../src/types/materials";

export default function Materials() {
	const [open, setOpen] = useState(false);
	const [materials, setMaterials] = useState<Materials[]>([]);

	function handleSaved(m: Materials) {
		setMaterials(prev => [m, ...prev]);
	}

	return (
		<div className="flex flex-col gap-6 items-center mt-8">
			<h1 className="text-2xl font-bold">Materials</h1>
			<div className="flex w-52 flex-col gap-4">
				<div className="skeleton h-32 w-full"></div>
				<div className="skeleton h-4 w-28"></div>
				<div className="skeleton h-4 w-full"></div>
				<div className="skeleton h-4 w-full"></div>
			</div>
			<div className="w-52">
				<Button
					label="Add Material"
					variant="blue"
					onClick={() => setOpen(true)}
				/>
			</div>

			<MaterialFormModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onSubmit={handleSaved}
        projectId=""
			/>
		</div>
	);
}
