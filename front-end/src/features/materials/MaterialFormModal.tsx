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

const emptyForm = (): Omit<Materials, "id"> => ({
	name: "",
	unit_qty: 0,
	unit_cost: 0,
	low_stock_threshold: 0,
	project_id: materials.project_id,
});

export default function MaterialModalForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}: Props) {
	const [form, setForm] = useState<
		Materials | (Omit<Materials, "id"> & { id?: string })
	>(initialData ?? emptyForm());

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			setError(null);
			setForm(initialData ?? emptyForm());
		}
	}, [isOpen, initialData]);

	if (!isOpen) return null;

	function update<K extends keyof typeof form>(key: K, value: any) {
		setForm(prev => ({ ...(prev as any), [key]: value }));
	}

	async function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault();
		setLoading(true);
		setError(null);

		const projectId = (form as any).project_id;

		// Build payload (exclude id when creating)
		const payload: any = {
			name: (form as any).name,
			unit_qty: Number((form as any).unit_qty) || 0,
			unit_cost: Number((form as any).unit_cost) || 0,
			low_stock_threshold: Number((form as any).low_stock_threshold) || 0,
		};

		try {
			if ((form as any).id) {
				// Update existing material — include project_id as query param per backend requirement
				if (!projectId || String(projectId).trim() === "") {
					throw new Error("Validation: project_id is required");
				}

				await apiFetch<void>(
					`/materials/${encodeURIComponent(String((form as any).id))}?project_id=${encodeURIComponent(
						String(projectId),
					)}`,
					{
						method: "PUT",
						body: JSON.stringify(payload),
					},
				);

				const updated = { ...(form as any), ...payload } as Materials;
				onSubmit?.(form as Materials);
			} else {
				// Creating new material: require projectId as query param
				if (!projectId || String(projectId).trim() === "") {
					throw new Error("Validation: project_id is required");
				}

				const created = await apiFetch<Materials>(
					`/materials?project_id=${encodeURIComponent(String(projectId))}`,
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
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
			<form
				onSubmit={handleSubmit}
				className="relative z-10 w-full max-w-lg rounded bg-white p-6 shadow-lg"
			>
				<h2 className="mb-4 text-lg font-medium">
					{(form as any).id ? "Edit" : "Add"} Material
				</h2>

				{error && <div className="mb-3 text-sm text-red-600">{error}</div>}

				<label className="mb-2 block">
					<div className="text-sm">Name</div>
					<input
						className="w-full rounded border px-3 py-2"
						value={(form as any).name}
						onChange={e => update("name", e.target.value)}
						required
					/>
				</label>

				<div className="flex gap-3">
					<label className="flex-1">
						<div className="text-sm">Unit Qty</div>
						<input
							type="number"
							className="w-full rounded border px-3 py-2"
							value={(form as any).unit_qty}
							onChange={e => update("unit_qty", Number(e.target.value))}
							min={0}
							step={1}
						/>
					</label>

					<label className="flex-1">
						<div className="text-sm">Unit Cost</div>
						<input
							type="number"
							className="w-full rounded border px-3 py-2"
							value={(form as any).unit_cost}
							onChange={e => update("unit_cost", Number(e.target.value))}
							min={0}
							step={0.01}
						/>
					</label>
				</div>

				<label className="mb-2 block mt-3">
					<div className="text-sm">Low Stock Threshold</div>
					<input
						type="number"
						className="w-full rounded border px-3 py-2"
						value={(form as any).low_stock_threshold}
						onChange={e =>
							update("low_stock_threshold", Number(e.target.value))
						}
						min={0}
						step={1}
					/>
				</label>

				<label className="mb-4 block">
					<div className="text-sm">Project ID</div>
					<input
						className="w-full rounded border px-3 py-2"
						value={(form as any).project_id}
						onChange={e => update("project_id", e.target.value)}
					/>
				</label>

				<div className="mt-4 flex justify-end gap-3">
					<button
						type="button"
						className="rounded border px-4 py-2"
						onClick={onClose}
						disabled={loading}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
						disabled={loading}
					>
						{loading ? "Saving..." : "Save"}
					</button>
				</div>
			</form>
		</div>
	);
}
