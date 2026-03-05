import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Tool, ToolStatus, toolsApi } from "../../api/tools-api";

type ToolsFormModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (tool: Tool) => void;
	initialData: Tool;
};

export default function ToolsFormModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}: ToolsFormModalProps) {
	const [name, setName] = useState("");
	const [status, setStatus] = useState<ToolStatus>("AVAILABLE");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		setName(initialData.name);
		setStatus(initialData.status);
		setError(null);
		setLoading(false);
	}, [isOpen, initialData]);

	if (!isOpen) return null;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError("Tool name is required.");
			return;
		}

		setLoading(true);
		try {
			const response = await toolsApi.update(initialData.id, {
				name: name.trim(),
				status,
			});
			onSubmit(response.data);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update tool.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="modal modal-open modal-middle">
			<div className="modal-box max-w-xl">
				<h3 className="text-2xl font-bold text-primary">Edit Tool</h3>
				<form onSubmit={handleSubmit} className="mt-6 space-y-5">
					<div className="form-control">
						<label className="label" htmlFor="tool-name">
							<span className="label-text font-semibold">Tool Name</span>
						</label>
						<input
							id="tool-name"
							type="text"
							className="input input-bordered w-full"
							value={name}
							onChange={event => setName(event.target.value)}
						/>
					</div>

					<div className="form-control">
						<label className="label" htmlFor="tool-status">
							<span className="label-text font-semibold">Status</span>
						</label>
						<select
							id="tool-status"
							className="select select-bordered w-full"
							value={status}
							onChange={event => setStatus(event.target.value as ToolStatus)}
						>
							<option value="AVAILABLE">AVAILABLE</option>
							<option value="CHECKEDOUT">CHECKEDOUT</option>
							<option value="ARCHIVE">ARCHIVE</option>
						</select>
					</div>

					{error ? <p className="text-sm text-red-600">{error}</p> : null}

					<div className="modal-action">
						<Button
							label="Cancel"
							variant="orange"
							onClick={onClose}
							disabled={loading}
						/>
						<Button
							label={loading ? "Saving..." : "Save"}
							variant="blue"
							type="submit"
							onClick={() => undefined}
							disabled={loading}
						/>
					</div>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>close</button>
			</form>
		</div>
	);
}
