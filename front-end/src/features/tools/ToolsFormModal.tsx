import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import type { Tool, ToolStatus } from "../../api/tools-api";
import { Button } from "../../components/Button";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (tool: Tool) => void;
	initialData?: Tool | null;
};

type FormState = {
	id?: string;
	name: string;
	status: ToolStatus | "";
};

const createEmptyForm = (): FormState => ({
	name: "",
	status: "AVAILABLE",
});

function toFormState(tool: Tool): FormState {
	return {
		id: tool.id,
		name: tool.name,
		status: (tool.status as ToolStatus) ?? "AVAILABLE",
	};
}

function toPayload(
	form: FormState,
): Omit<Tool, "id" | "created_at"> & { status?: ToolStatus } {
	return {
		name: form.name.trim(),
		status: (form.status || undefined) as ToolStatus | undefined,
	} as any;
}

export default function ToolsFormModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}: Props) {
	/** Forms state */
	const [form, setForm] = useState<FormState>(createEmptyForm());
	/** Loading indicator state */
	const [loading, setLoading] = useState(false);
	/** Error state */
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		setError(null);
		if (initialData) setForm(toFormState(initialData));
		else setForm(createEmptyForm());
	}, [isOpen, initialData]);

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!form.name.trim()) {
			setError("Name is required");
			setLoading(false);
			return;
		}

		const payload = toPayload(form);

		try {
			if (form.id) {
				const res = await apiFetch<{ data: Tool; message: string }>(
					`/tools/${form.id}`,
					{
						method: "PATCH",
						body: JSON.stringify(payload),
					},
				);
				onSubmit?.(res.data);
			} else {
				const res = await apiFetch<{ data: Tool; message: string }>(`/tools`, {
					method: "POST",
					body: JSON.stringify(payload),
				});
				onSubmit?.(res.data);
			}

			onClose();
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Failed to save tool";
			setError(msg);
		} finally {
			setLoading(false);
		}
	}

	if (!isOpen) return null;

	return (
		<div className="modal modal-open modal-middle">
			<div className="modal-box max-w-lg bg-base-100 shadow-2xl">
				<div className="flex items-center justify-between pb-4 border-b border-base-300">
					<h3 className="text-2xl font-bold text-primary">
						{form.id ? "Edit Tool" : "Add Tool"}
					</h3>
					<button
						type="button"
						className="btn btn-sm btn-circle btn-ghost"
						onClick={onClose}
					>
						✕
					</button>
				</div>

				<div className="py-6">
					{error && (
						<div className="alert alert-error mb-4">
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="label" htmlFor="tool-name">
								<span className="label-text text-base font-semibold">
									Tool Name
								</span>
							</label>
							<input
								id="tool-name"
								type="text"
								value={form.name}
								onChange={e => update("name", e.target.value)}
								aria-invalid={!form.name.trim()}
								className="input input-bordered input-lg w-full"
								required
							/>
						</div>

						<div>
							<label className="label" htmlFor="tool-status">
								<span className="label-text text-base font-semibold">
									Status
								</span>
							</label>
							<select
								id="tool-status"
								value={form.status}
								onChange={e => update("status", e.target.value as ToolStatus)}
								className="select select-bordered select-lg w-full"
							>
								<option value="AVAILABLE">AVAILABLE</option>
								<option value="CHECKEDOUT">CHECKEDOUT</option>
								<option value="ARCHIVE">ARCHIVE</option>
							</select>
						</div>

						<div className="modal-action pt-4 border-t border-base-300">
							<Button label="Cancel" variant="orange" onClick={onClose} />
							{loading ? (
								<span className="loading loading-spinner loading-md"></span>
							) : (
								<Button
									label={form.id ? "Save" : "Submit"}
									variant="blue"
									type="submit"
									onClick={() => {}}
								/>
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
