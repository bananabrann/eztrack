import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import type { Tool, ToolStatus } from "../../api/tools-api";
import { Button } from "../../components/Button";
import { getProjects } from "../../api/projects-api";
import type { Project } from "../../types/projects";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (tool: Tool) => void;
	initialData?: Tool | null;
};

type FormState = {
	id?: string;
	name: string;
	status: ToolStatus;
	project_id: string;
};

const createEmptyForm = (): FormState => ({
	name: "",
	status: "AVAILABLE",
	project_id: "",
});

function toFormState(tool: Tool): FormState {
	return {
		id: tool.id,
		name: tool.name,
		status: tool.status,
		project_id: tool.project_id || "",
	};
}

function toPayload(form: FormState): {
	name: string;
	status: ToolStatus;
	project_id: string;
} {
	return {
		name: form.name.trim(),
		status: form.status,
		project_id: form.project_id,
	};
}

export default function ToolsFormModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}: Props) {
	const [form, setForm] = useState<FormState>(createEmptyForm());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		if (!isOpen) return;
		setError(null);
		setLoading(false);
		if (initialData) setForm(toFormState(initialData));
		else setForm(createEmptyForm());

		getProjects("ACTIVE")
			.then(res => setProjects(res.data))
			.catch(err => console.error("Failed to fetch projects", err));
	}, [isOpen, initialData]);

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!form.name.trim()) {
			setError("Tool name is required.");
			setLoading(false);
			return;
		}

		if (!form.project_id) {
			setError("Project selection is required.");
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

					<form onSubmit={handleSubmit} className="space-y-6">
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
								className="input input-bordered w-full px-4 border-2 bg-base-50 focus:bg-base-100 focus:border-primary focus:outline-none transition-all"
								placeholder="Enter tool name..."
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
								className="select select-bordered w-full px-4 border-2 bg-base-50 focus:bg-base-100 focus:border-primary focus:outline-none transition-all font-medium"
							>
								<option value="AVAILABLE">Available</option>
								<option value="CHECKEDOUT">Checked Out</option>
								<option value="ARCHIVE">Archived</option>
							</select>
						</div>

						<div>
							<label className="label" htmlFor="tool-project">
								<span className="label-text text-base font-semibold">
									Project
								</span>
							</label>
							<select
								id="tool-project"
								value={form.project_id}
								onChange={e => update("project_id", e.target.value)}
								className="select select-bordered w-full px-4 border-2 bg-base-50 focus:bg-base-100 focus:border-primary focus:outline-none transition-all font-medium"
							>
								<option value="" disabled>
									Select a project
								</option>
								{projects.map(project => (
									<option key={project.id} value={project.id}>
										{project.project_name}
									</option>
								))}
							</select>
						</div>

						<div className="modal-action pt-4 border-t border-base-300">
							{loading ? (
								<div className="flex justify-center w-full">
									<span className="loading loading-spinner loading-md"></span>
								</div>
							) : (
								<div className="flex justify-center gap-4 w-full">
									<Button label="Cancel" variant="blue" onClick={onClose} />
									<Button
										label={form.id ? "Save" : "Submit"}
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
