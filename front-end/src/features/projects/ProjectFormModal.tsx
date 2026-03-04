import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import type { CreateProjectInput } from "../../types/projects";

type ProjectFormModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSave: (project: CreateProjectInput) => Promise<void>;
};

export default function ProjectFormModal({
	isOpen,
	onClose,
	onSave,
}: ProjectFormModalProps) {
	const [newProjectName, setNewProjectName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		setNewProjectName("");
		setStartDate("");
		setEndDate("");
		setError(null);
		setIsSaving(false);
	}, [isOpen]);

	if (!isOpen) return null;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (!newProjectName.trim() || !startDate || !endDate) {
			setError("Project name, start date, and end date are required.");
			return;
		}

		const startDateValue = new Date(startDate);
		const endDateValue = new Date(endDate);
		if (Number.isNaN(startDateValue.getTime())) {
			setError("Start date must be a valid date.");
			return;
		}
		if (Number.isNaN(endDateValue.getTime())) {
			setError("End date must be a valid date.");
			return;
		}
		if (endDateValue < startDateValue) {
			setError("End date cannot be earlier than start date.");
			return;
		}

		setIsSaving(true);
		try {
			await onSave({
				project_name: newProjectName.trim(),
				start_date: startDate,
				end_date: endDate,
			});
			onClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create project.",
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="modal modal-open modal-bottom sm:modal-middle">
			<div className="modal-box">
				<h3 className="font-bold text-lg">Create New Project</h3>
				<div className="modal-action">
					<form onSubmit={handleSubmit} className="w-full">
						<input
							type="text"
							placeholder="Project Name"
							className="input input-bordered w-full mb-4"
							value={newProjectName}
							onChange={event => setNewProjectName(event.target.value)}
						/>
						{error ? (
							<p className="text-sm text-red-600 mb-4">{error}</p>
						) : null}
						<div className="form-control mb-6">
							<label className="label" htmlFor="project-start-date">
								<span className="label-text">Start Date</span>
							</label>
							<input
								id="project-start-date"
								type="date"
								className="input input-bordered w-full"
								placeholder="Start Date"
								value={startDate}
								onChange={event => setStartDate(event.target.value)}
							/>
						</div>
						<div className="form-control mb-6">
							<label className="label" htmlFor="project-end-date">
								<span className="label-text">End Date</span>
							</label>
							<input
								id="project-end-date"
								type="date"
								className="input input-bordered w-full"
								min={startDate || undefined}
								value={endDate}
								onChange={event => setEndDate(event.target.value)}
							/>
						</div>
						<div className="mt-4 mb-4 grid grid-cols-2 gap-3 w-full">
							<Button
								label="Cancel"
								variant="orange"
								onClick={onClose}
								disabled={isSaving}
							/>
							<Button
								label={isSaving ? "Saving..." : "Save Project"}
								variant="blue"
								type="submit"
								onClick={() => undefined}
								disabled={isSaving}
							/>
						</div>
						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							onClick={onClose}
							disabled={isSaving}
						>
							✕
						</button>
					</form>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose}>close</button>
			</form>
		</div>
	);
}
