import { useEffect, useState } from "react";
import type { Materials } from "../../types/materials";
import type { Project } from "../../types/projects";
import { apiFetch } from "../../api/api";
import MaterialModalForm from "./MaterialFormModal";
import { FilterBar } from "../../components/FilterBar";
import { Button } from "../../components/Button";
import { TriangleAlert } from "lucide-react";
import RecordUsageModal from "./RecordUsageModal";

export function MaterialsTable() {
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
	// Usage Modal state
	const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
	const [usageMaterial, setUsageMaterial] = useState<Materials | null>(null);
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
	 * Fetching the API - filtered by selectedProjectId
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
				// Ensure numeric fields are numbers, defaulting to 0 if null/undefined
				const sanitizedMaterials = materialsArray.map(material => ({
					...material,
					unit_qty: Number(material.unit_qty) || 0,
					unit_cost: Number(material.unit_cost) || 0,
					low_stock_threshold: Number(material.low_stock_threshold) || 0,
				}));
				setMaterials(sanitizedMaterials);
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

	/**
	 * Handle opening modal for new material
	 */
	const handleAddMaterial = () => {
		setEditingMaterial(null);
		setIsModalOpen(true);
	};

	/**
	 * Handle opening modal for editing material
	 */
	const handleEditMaterial = (material: Materials) => {
		setEditingMaterial(material);
		setIsModalOpen(true);
	};

	/**
	 * Handle material submission (add or edit)
	 */
	const handleMaterialSubmit = (material: Materials) => {
		const sanitizedMaterial = {
			...material,
			unit_qty: Number(material.unit_qty) || 0,
			unit_cost: Number(material.unit_cost) || 0,
			low_stock_threshold: Number(material.low_stock_threshold) || 0,
		};

		if (editingMaterial) {
			setMaterials(prev =>
				prev.map(m => (m.id === sanitizedMaterial.id ? sanitizedMaterial : m)),
			);
		} else {
			setMaterials(prev => [...prev, sanitizedMaterial]);
		}
	};

	/**
	 * Handle closing modal
	 */
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingMaterial(null);
	};

	/**
	 * Handle opening usage modal
	 */
	const handleRecordUsage = (material: Materials) => {
		setUsageMaterial(material);
		setIsUsageModalOpen(true);
	};

	/**
	 * Handle usage submission
	 */
	const handleUsageSubmit = () => {
		fetchMaterials();
	};

	/**
	 * Handle closing usage modal
	 */
	const handleCloseUsageModal = () => {
		setIsUsageModalOpen(false);
		setUsageMaterial(null);
	};

	const projectOptions = projects.map(project => ({
		value: project.id,
		label: project.project_name,
	}));

	return (
		<div>
			{/* Project Selection using FilterBar */}
			<FilterBar
				value={selectedProjectId}
				onChange={value => setSelectedProjectId(value)}
				options={projectOptions}
				label="Select Project"
			/>

			{/* Show materials only if project is selected */}
			{selectedProjectId ? (
				<>
					{/* Loading indicator */}
					{loading && (
						<div className="flex justify-center">
							<div className="loading loading-spinner loading-md"></div>
						</div>
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
											<td className="font-medium">
												<span className="flex items-center gap-2">
													{material.name}
													{material.isLowStock && (
														<TriangleAlert size={16} className="text-warning" />
													)}
												</span>
											</td>
											<td>{material.unit_qty}</td>
											<td>{`$${(material.unit_cost ?? 0).toFixed(2)}`}</td>
											<td>{material.low_stock_threshold}</td>
											<td>
												<button
													onClick={() => handleEditMaterial(material)}
													className="btn btn-sm btn-outline"
												>
													Edit
												</button>
												<button
													onClick={() => handleRecordUsage(material)}
													className="btn btn-sm btn-outline ml-2"
												>
													Use
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
				<div className="alert alert-info w-fit mx-auto text-center">
					Please select a project to view and manage materials.
				</div>
			)}

			{/* Add Material Button using Button component */}
			{selectedProjectId && (
				<div className="mb-4 flex justify-center mt-8">
					<div className="btn-wide">
						<Button
							label="Add Material"
							variant="blue"
							onClick={handleAddMaterial}
						/>
					</div>
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

			{/* Record Usage Modal */}
			<RecordUsageModal
				isOpen={isUsageModalOpen}
				onClose={handleCloseUsageModal}
				onSubmit={handleUsageSubmit}
				material={usageMaterial}
				projectId={selectedProjectId}
			/>
		</div>
	);
}
