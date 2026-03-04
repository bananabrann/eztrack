import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router";

import { Button } from "../components/Button";

type Project = {
	id: string | number;
	project_name: string;
};

export default function Projects() {
	const navigate = useNavigate();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [newProjectName, setNewProjectName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await apiFetch<{ data: Project[] }>("/projects", {
					method: "GET",
				});
				setProjects(response.data);
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "Failed to load projects. Please try again later.";
				if (message.toLowerCase().includes("unauthorized")) {
					navigate("/login", { replace: true });
					return;
				}
				setError(message);
				console.error("Error fetching projects:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();
	}, [navigate]);

	// show loading state
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading projects...
			</div>
		);
	}

	/// show error state
	if (error) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				{error}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 items-center mt-8">
			<h1 className="text-2xl font-bold mb-8">Project Management</h1>

			{/* Load projects */}
			{projects.length === 0 ? (
				<div className="text-gray-500">
					No projects found. Please create a new project.
				</div>
			) : (
				<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-3xl mt-6 mb-6">
					<table className="table table-zebra">
						<thead>
							<tr>
								<th className="w-16">#</th>
								<th>Project Name</th>
							</tr>
						</thead>
						<tbody>
							{projects.map((project, index) => (
								<tr key={project.id}>
									<td className="text-gray-500">{index + 1}</td>
									<td className="flex items-center gap-3">
										<span>{project.project_name}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Create New Project */}
			<Button
				label="Create New Project"
				variant="orange"
				icon={<SquarePlus className="w-5 h-5" aria-hidden="true" />}
				onClick={() => {
					const modal = document.getElementById(
						"new_project_modal",
					) as HTMLDialogElement | null;
					modal?.showModal();
				}}
			/>
			<dialog id="new_project_modal" className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Create New Project</h3>
					<div className="modal-action">
						<form method="dialog" className="ml-5">
							{/* Project Name */}
							<input
								type="text"
								placeholder="Project Name"
								className="input input-bordered w-full max-w-xs mb-4"
								value={newProjectName}
								onChange={event => setNewProjectName(event.target.value)}
							/>
							{/* Start Date */}
							<label className="input">
								<span className="label">Start Date</span>
								<input
									type="date"
									className="input input-bordered mt-4 mb-5"
									placeholder="Start Date"
									value={startDate}
									onChange={event => setStartDate(event.target.value)}
								/>
							</label>
							{/* End Date */}
							<label className="input">
								<span className="label">End Date</span>
								<input
									type="date"
									className="input input-bordered mt-4 mb-5"
									value={endDate}
									onChange={event => setEndDate(event.target.value)}
								/>
							</label>
							<div className="mt-4 mb-4">
								<Button 
									label="Cancel" 	
									variant="orange" />
								<Button
									label="Save Project"
									variant="blue"
									type="submit"
									onClick={() => {
										//save form
									}} />
							</div>
							<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
						</form>
					</div>
				</div>
			</dialog>

		</div>
	);
}
