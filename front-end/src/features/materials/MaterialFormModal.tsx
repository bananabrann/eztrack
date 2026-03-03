import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import type { Materials } from "../../types/materials";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (materials: Materials) => void;
	initialData?: Materials | null;
	projectId: string;
};

const emptyForm = (projectId: string): Omit<Materials, "id"> => ({
	name: "",
	unit_qty: 0,
	unit_cost: 0,
	low_stock_threshold: 0,
	project_id: projectId,
});

export default function MaterialModalForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	projectId,
}: Props) {
	const [form, setForm] = useState<
		Materials | (Omit<Materials, "id"> & { id?: string })
	>(initialData ?? emptyForm(projectId));

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			setError(null);
			setForm(initialData ?? emptyForm(projectId));
		}
	}, [isOpen, initialData, projectId]);

	if (!isOpen) return null;

	function update<K extends keyof typeof form>(key: K, value: any) {
		setForm(prev => ({ ...(prev as any), [key]: value }));
	}

	async function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault();
		setLoading(true);
		setError(null);

		// Build payload (exclude id when creating)
		const payload: any = {
			name: (form as any).name,
			unit_qty: Number((form as any).unit_qty) || 0,
			unit_cost: Number((form as any).unit_cost) || 0,
			low_stock_threshold: Number((form as any).low_stock_threshold) || 0,
		};

		try {
			if ((form as any).id) {
				// Update existing material
				await apiFetch<void>(
					`/materials/${encodeURIComponent(String((form as any).id))}?project_id=${encodeURIComponent(projectId)}`,
					{
						method: "PUT",
						body: JSON.stringify(payload),
					},
				);

				const updated = { ...(form as any), ...payload } as Materials;
				onSubmit?.(updated);
			} else {
				// Creating new material
				const created = await apiFetch<Materials>(
					`/materials?project_id=${encodeURIComponent(projectId)}`,
					{
						method: "POST",
						body: JSON.stringify(payload),
					},
				);
				onSubmit?.(created);
			}
			onClose();
		} catch (err: any) {
			setError(err?.message || "Failed to save material");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={`modal ${isOpen ? "modal-open" : ""}`}>
			<div className="modal-box">
				<h3 className="font-bold text-lg">
					{(form as any).id ? "Edit" : "Add"} Material
				</h3>

				{error && <div className="alert alert-error mt-4">{error}</div>}

				<form onSubmit={handleSubmit} className="mt-4">
					<div className="form-control">
						<label className="label" htmlFor="material-name">
							<span className="label-text">Name</span>
						</label>
						<input
							id="material-name"
							type="text"
							className="input input-bordered"
							value={(form as any).name}
							onChange={e => update("name", e.target.value)}
							required
						/>
					</div>

					<div className="form-control mt-4">
						<label className="label" htmlFor="material-unit-qty">
							<span className="label-text">Unit Qty</span>
						</label>
						<input
							id="material-unit-qty"
							type="number"
							className="input input-bordered"
							placeholder="Unit Qty"
							value={(form as any).unit_qty}
							onChange={e => update("unit_qty", Number(e.target.value))}
							min={0}
							step={1}
						/>
					</div>

					<div className="form-control mt-4">
						<label className="label" htmlFor="material-unit-cost">
							<span className="label-text">Unit Cost</span>
						</label>
						<input
							id="material-unit-cost"
							type="number"
							className="input input-bordered"
							placeholder="Unit Cost"
							value={(form as any).unit_cost}
							onChange={e => update("unit_cost", Number(e.target.value))}
							min={0}
							step={0.01}
						/>
					</div>

					<div className="form-control mt-4">
						<label className="label" htmlFor="material-low-stock-threshold">
							<span className="label-text">Low Stock Threshold</span>
						</label>
						<input
							id="material-low-stock-threshold"
							type="number"
							className="input input-bordered"
							placeholder="Low Stock Threshold"
							value={(form as any).low_stock_threshold}
							onChange={e =>
								update("low_stock_threshold", Number(e.target.value))
							}
							min={0}
							step={1}
						/>
					</div>

					<div className="modal-action">
						<button
							type="button"
							className="btn"
							onClick={onClose}
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}
						>
							{loading ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : (
								"Save"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
