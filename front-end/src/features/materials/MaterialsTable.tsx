import { useEffect, useState } from "react";
import type { Materials } from "../../types/materials";
import type { Project } from "../../types/projects";
import { apiFetch } from "../../api/api";
import MaterialModalForm from "./MaterialFormModal";
import { Button } from "../../components/Button";

type Props = {
	projectId: string;
};

export function MaterialsTable({ projectId }: Props) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const [materials, setMaterials] = useState<Materials[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingMaterial, setEditingMaterial] = useState<Materials | null>(
		null,
	);

	/**
	 * Fetch projects
	 */
	const fetchProjects = () => {
		apiFetch<{ data: Project[]; message: string }>("/projects")
			.then(({ data: projectsArray = [] }) => {
				setProjects(projectsArray);
			})
			.catch((error: unknown) => {
				const message =
					error instanceof Error ? error.message : "Failed to fetch projects.";
				setError(message);
			});
	};

	/**
	 * Fetching the API - filtered by projectId
	 */
	const fetchMaterials = () => {
		if (!selectedProjectId || selectedProjectId.trim() === "") {
			setMaterials([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		apiFetch<{ data: Materials[]; message: string }>(
			`/materials?project_id=${encodeURIComponent(selectedProjectId)}`,
		)
			.then(({ data: materialsArray = [] }) => {
				setMaterials(materialsArray);
				setLoading(false);
			})
			.catch((error: unknown) => {
				const message =
					error instanceof Error ? error.message : "Failed to fetch materials.";
				setError(message);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	useEffect(() => {
		fetchMaterials();
	}, [selectedProjectId]);

	// Handle opening modal for new material
	const handleAddMaterial = () => {
		setEditingMaterial(null);
		setIsModalOpen(true);
	};

	// Handle opening modal for editing material
	const handleEditMaterial = (material: Materials) => {
		setEditingMaterial(material);
		setIsModalOpen(true);
	};

	// Handle material submission (add or edit)
	const handleMaterialSubmit = (material: Materials) => {
		if (editingMaterial) {
			// Update existing material in list
			setMaterials(prev =>
				prev.map(m => (m.id === material.id ? material : m)),
			);
		} else {
			// Add new material to list
			setMaterials(prev => [...prev, material]);
		}
	};

	// Handle closing modal
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingMaterial(null);
	};

	// Handle project selection
	const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedProjectId(e.target.value);
	};

	return (
		<div>
			{/* Project Selection */}
			<div className="mb-4">
				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">Select Project</span>
					</div>
					<select
						value={selectedProjectId}
						onChange={handleProjectChange}
						className="select select-bordered"
					>
						<option value="">Select a project...</option>
						{projects.map(project => (
							<option key={project.id} value={project.id}>
								{project.project_name}
							</option>
						))}
					</select>
				</label>
			</div>

			{/* Show materials only if project is selected */}
			{selectedProjectId ? (
				<>
					{/* Add Material Button */}
					{/* Add Material Button */}
					<div className="mb-4 flex justify-end">
						<Button
							label="Add Material"
							variant="blue"
							onClick={handleAddMaterial}
						/>
					</div>

					{/* Loading indicator */}
					{loading && (
						<div className="loading loading-spinner loading-md"></div>
					)}

					{/* Error indicator */}
					{error && <div className="alert alert-error">{error}</div>}

					{/* Materials Table */}
					{!loading && !error && (
						<div className="overflow-x-auto">
							<table className="table table-zebra">
								<thead>
									<tr>
										<th>Name</th>
										<th>Quantity</th>
										<th>Unit Cost</th>
										<th>Low Stock Threshold</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{materials.map(material => (
										<tr key={material.id}>
											<td className="font-medium">{material.name}</td>
											<td>{material.unit_qty}</td>
											<td>${material.unit_cost.toFixed(2)}</td>
											<td>{material.low_stock_threshold}</td>
											<td>
												<button
													onClick={() => handleEditMaterial(material)}
													className="btn btn-sm btn-outline"
												>
													Edit
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</>
			) : (
				<div className="alert alert-warning">
					Please select a project to view and manage materials.
				</div>
			)}

			{/* Material Modal Form */}
			<MaterialModalForm
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleMaterialSubmit}
				initialData={editingMaterial}
				projectId={selectedProjectId}
			/>
		</div>
	);
}
