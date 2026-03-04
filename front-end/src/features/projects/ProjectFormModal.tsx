import { useEffect, useState } from "react";
import { Button } from "../../components/Button";

type ProjectFormModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSave?: (project: {
		project_name: string;
		start_date: string;
		end_date: string;
	}) => void;
};

export default function ProjectFormModal({
	isOpen,
	onClose,
	onSave,
}: ProjectFormModalProps) {
	const [newProjectName, setNewProjectName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	useEffect(() => {
		if (!isOpen) return;
		setNewProjectName("");
		setStartDate("");
		setEndDate("");
	}, [isOpen]);

	if (!isOpen) return null;

	const handleSave = () => {
		onSave?.({
			project_name: newProjectName.trim(),
			start_date: startDate,
			end_date: endDate,
		});
		onClose();
	};

	return (
		<div className="modal modal-open modal-bottom sm:modal-middle">
			<div className="modal-box">
				<h3 className="font-bold text-lg">Create New Project</h3>
				<div className="modal-action">
					<form method="dialog" className="w-full">
						<input
							type="text"
							placeholder="Project Name"
							className="input input-bordered w-full mb-4"
							value={newProjectName}
							onChange={event => setNewProjectName(event.target.value)}
						/>
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
								value={endDate}
								onChange={event => setEndDate(event.target.value)}
							/>
						</div>
						<div className="mt-4 mb-4 grid grid-cols-2 gap-3 w-full">
							<Button label="Cancel" variant="orange" onClick={onClose} />
							<Button
								label="Save Project"
								variant="blue"
								type="submit"
								onClick={handleSave}
							/>
						</div>
						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							onClick={onClose}
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
