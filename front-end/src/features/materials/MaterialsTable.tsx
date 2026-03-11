import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { Materials } from "../../types/materials";
import type { Project } from "../../types/projects";
import { apiFetch } from "../../api/api";
import MaterialModalForm from "./MaterialFormModal";
import { FilterBar } from "../../components/FilterBar";
import { Button } from "../../components/Button";
import {
	TriangleAlert,
	Package,
	Building,
	SquarePlus,
	Pencil,
	MinusCircle,
} from "lucide-react";
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
	// Params Modal
	const [searchParams] = useSearchParams();
	// Success messages
	const [successMessage, setSuccessMessage] = useState("");
	const [usageSuccessMessage, setUsageSuccessMessage] = useState("");

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
		const projectIdFromQuery = searchParams.get("projectId");
		if (projectIdFromQuery) {
			setSelectedProjectId(projectIdFromQuery);
		}
	}, [searchParams]);

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
			setSuccessMessage("Material updated successfully!");
		} else {
			setMaterials(prev => [...prev, sanitizedMaterial]);
			setSuccessMessage("Material created successfully!");
		}
		setTimeout(() => setSuccessMessage(""), 3000);
		fetchMaterials();
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
		setUsageSuccessMessage("Usage recorded successfully!");
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

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);

	return (
		<div>
			{/* Project Selection using FilterBar */}
			<FilterBar
				value={selectedProjectId}
				onChange={value => setSelectedProjectId(value)}
				options={projectOptions}
				label="Select Project"
				containerClassName="w-80"
			/>

			{/* Add Material Button using Button component */}
			{selectedProjectId && (
				<div className="mb-6 flex justify-center mt-8">
					<Button
						label="Create Material"
						variant="orange"
						icon={<SquarePlus className="w-5 h-5" aria-hidden="true" />}
						onClick={handleAddMaterial}
					/>
				</div>
			)}

			{/* CREATE MATERIAL SUCCESS MESSAGE */}
			{successMessage && (
				<div className="flex justify-center mt-6">
					<div className="alert alert-success mb-6 shadow-lg w-full max-w-3xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{successMessage}</span>
					</div>
				</div>
			)}

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
					{!loading && !error && materials.length > 0 && (
						<div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-box border border-base-content/5 bg-base-100 w-full max-w-full md:max-w-3xl mx-auto">
							<table className="table table-zebra">
								<thead className="sticky top-0 z-10 bg-base-200/80 backdrop-blur-sm">
									<tr className="border-b border-base-content/10">
										<th className="text-tertiary text-lg">Name</th>
										<th className="text-tertiary text-lg">Quantity</th>
										<th className="text-tertiary text-lg">Unit Cost</th>
										<th className="text-tertiary text-lg">
											Low Stock Threshold
										</th>
										<th className="text-tertiary text-lg">Actions</th>
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
											<td>{formatCurrency(material.unit_cost ?? 0)}</td>
											<td>{material.low_stock_threshold}</td>
											<td className="flex gap-2">
												<button
													onClick={() => handleEditMaterial(material)}
													className="p-2 text-tertiary hover:text-secondary hover:bg-secondary/10 rounded transition"
													aria-label="Edit material"
													title="Edit"
												>
													<Pencil size={18} />
												</button>
												<button
													onClick={() => handleRecordUsage(material)}
													className="p-2 text-tertiary hover:text-secondary hover:bg-secondary/10 rounded transition"
													aria-label="Record usage"
													title="Record Usage"
												>
													<MinusCircle size={18} />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Empty State Message - No Materials */}
					{!loading && !error && materials.length === 0 && (
						<div className="flex justify-center mt-16">
							<div className="card bg-base-100 w-full max-w-sm shadow-sm p-8">
								<div className="text-center">
									<Package
										size={64}
										className="mx-auto mb-4 text-tertiary opacity-50"
									/>
									<h3 className="text-lg font-semibold text-primary mb-2">
										No materials yet
									</h3>
									<p className="text-tertiary mb-6">
										Add a material to this project to get started.
									</p>
								</div>
							</div>
						</div>
					)}
				</>
			) : (
				<div className="flex justify-center mt-16">
					<div className="card bg-base-100 w-full max-w-sm shadow-sm p-8">
						<div className="text-center">
							<Building
								size={64}
								className="mx-auto mb-4 text-tertiary opacity-50"
							/>
							<h3 className="text-lg font-semibold text-primary mb-2">
								Select a Project
							</h3>
							<p className="text-tertiary mb-6">
								Choose a project from the dropdown above to view and manage its
								materials.
							</p>
						</div>
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
