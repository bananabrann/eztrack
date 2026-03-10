import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import type { Materials } from "../../types/materials";
import { Button } from "../../components/Button";

/*
 * Props for the modal
 */

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (materials: Materials) => void;
	initialData?: Materials | null;
	projectId: string;
};

// UI Form Model (strings for inputs)
type MaterialFormState = {
	id?: string;
	name: string;
	unit_qty: string;
	unit_cost: string;
	low_stock_threshold: string;
};

const createEmptyForm = (): MaterialFormState => ({
	name: "",
	unit_qty: "",
	unit_cost: "",
	low_stock_threshold: "",
});

// Convert domain model → form model (for editing)
function toFormState(material: Materials): MaterialFormState {
	return {
		id: material.id,
		name: material.name,
		unit_qty: String(material.unit_qty),
		unit_cost: String(material.unit_cost),
		low_stock_threshold: String(material.low_stock_threshold),
	};
}

// Convert form model → domain payload (safe numeric conversion)
function toPayload(
	form: MaterialFormState,
	projectId: string,
): Omit<Materials, "id"> {
	return {
		name: form.name.trim(),
		unit_qty: Number(form.unit_qty) || 0,
		unit_cost: Number(form.unit_cost) || 0,
		low_stock_threshold: Number(form.low_stock_threshold) || 0,
		project_id: projectId,
	};
}

export default function MaterialModalForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	projectId,
}: Props) {
	const [form, setForm] = useState<MaterialFormState>(createEmptyForm());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Sync form when modal opens or editing data changes
	useEffect(() => {
		if (!isOpen) return;

		setError(null);

		if (initialData) {
			setForm(toFormState(initialData));
		} else {
			setForm(createEmptyForm());
		}
	}, [isOpen, initialData]);

	function update<K extends keyof MaterialFormState>(
		key: K,
		value: MaterialFormState[K],
	) {
		setForm(prev => ({ ...prev, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!projectId.trim()) {
			setError("Project is required to save the material.");
			setLoading(false);
			return;
		}

		const payload = toPayload(form, projectId);

		try {
			if (form.id) {
				// Update existing materials
				const response = await apiFetch<{ data: Materials; message: string }>(
					`/materials/${form.id}?project_id=${encodeURIComponent(projectId)}`,
					{
						method: "PATCH",
						body: JSON.stringify(payload),
					},
				);

				onSubmit?.(response.data);
			} else {
				// Create new material
				const response = await apiFetch<{ data: Materials; message: string }>(
					`/materials?project_id=${encodeURIComponent(projectId)}`,
					{
						method: "POST",
						body: JSON.stringify(payload),
					},
				);

				onSubmit?.(response.data);
			}

			onClose();
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to save material";
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	if (!isOpen) return null;

	return (
		<div className="modal modal-open modal-middle">
			<div className="modal-box max-w-2xl bg-base-100 shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between pb-4 border-b border-base-300">
					<h3 className="text-2xl font-bold text-primary">
						{form.id ? "Edit Material" : "Add Material"}
					</h3>
					<button
						type="button"
						className="btn btn-sm btn-circle btn-ghost"
						onClick={onClose}
					>
						✕
					</button>
				</div>
				{/* Body */}
				<div className="py-6">
					{error && (
						<div className="alert alert-error mb-6">
							<span>{error}</span>
						</div>
					)}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control w-full">
							<label className="label" htmlFor="material-name">
								<span className="label-text text-base font-semibold">
									Material Name
								</span>
							</label>
							<input
								id="material-name"
								type="text"
								className="input input-bordered w-full px-4 border-2 bg-base-50 focus:bg-base-100 focus:border-primary focus:outline-none transition-all"
								value={form.name}
								onChange={e => update("name", e.target.value)}
								required
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="form-control w-full">
								<label className="label" htmlFor="unit-quantity">
									<span className="label-text text-base font-semibold">
										Unit Quantity
									</span>
								</label>
								<input
									id="unit-quantity"
									type="number"
									min={0}
									step={1}
									className="input input-bordered w-full px-4 border-2 bg-base-50 focus:bg-base-100 focus:border-primary focus:outline-none transition-all"
									value={form.unit_qty}
									onChange={e => update("unit_qty", e.target.value)}
								/>
							</div>

							<div className="form-control w-full">
								<label className="label" htmlFor="unit-cost">
									<span className="label-text text-base font-semibold">
										Unit Cost (USD)
									</span>
								</label>
								<input
									id="unit-cost"
									type="number"
									min={0}
									step={0.01}
									placeholder="0.00"
									className="input input-bordered w-full px-4 border-2 bg-base-50 focus:bg-base-100 focus:border-primary focus:outline-none transition-all"
									value={form.unit_cost}
									onChange={e => update("unit_cost", e.target.value)}
								/>
							</div>
						</div>

						<div className="form-control w-full">
							<label className="label" htmlFor="low-stock-threshold">
								<span className="label-text text-base font-semibold">
									Low Stock Threshold
								</span>
							</label>
							<input
								id="low-stock-threshold"
								type="number"
								min={0}
								step={1}
								className="input input-bordered w-full px-4 border-2 bg-base-50 focus:bg-base-100 focus:border-primary focus:outline-none transition-all"
								value={form.low_stock_threshold}
								onChange={e => update("low_stock_threshold", e.target.value)}
							/>
						</div>

						{/* Actions */}
						<div className="modal-action pt-4 border-t border-base-300">
							{loading ? (
								<div className="flex justify-center w-full">
									<span className="loading loading-spinner loading-md"></span>
								</div>
							) : (
								<div className="flex justify-center gap-4 w-full">
									<Button label="Cancel" variant="blue" onClick={onClose} />
									<Button
										label="Save"
										variant="orange"
										type="submit"
										onClick={() => undefined}
									/>
								</div>
							)}
						</div>
					</form>
				</div>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>close</button>
			</form>
		</div>
	);
}
