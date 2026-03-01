import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import type { Materials } from "../../types/materials";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (materials: Materials) => void;
	initialData?: Materials | null;
};

const emptyForm = (): Omit<Materials, "id"> => ({
	name: "",
	unit_qty: 0,
	unit_cost: 0,
	low_stock_threshold: 0,
	project_id: "",
});

export function MaterialModalForm({
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

		// Build payload (exclude id when creating)
		const payload: any = {
			name: (form as any).name,
			unit_qty: Number((form as any).unit_qty) || 0,
			unit_cost: Number((form as any).unit_cost) || 0,
			low_stock_threshold: Number((form as any).low_stock_threshold) || 0,
			project_id: (form as any).project_id || null,
		};

		try {
			if ((form as any).id) {
				await apiFetch<void>(`/materials/${(form as any).id}`, {
					method: "PUT",
					body: JSON.stringify(payload),
				});
				onSubmit?.(form as Materials);
			} else {
				const created = await apiFetch<Materials>(`/materials`, {
					method: "POST",
					body: JSON.stringify(payload),
				});
				onSubmit?.(created);
			}
			onClose();
		} catch (err: any) {
			setError(err?.message || "Failed to save material");
		} finally {
			setLoading(false);
		}
	}
}
