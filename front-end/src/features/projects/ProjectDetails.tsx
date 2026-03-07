import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../../api/api";
import { updateProject } from "../../api/projects-api";

import type { Materials } from "../../types/materials";
import type { Project } from "../../types/projects";
import type { Tool } from "../../api/tools-api";
import ProjectCost from "./ProjectCost";
import ProjectDetailsTable, {
	type ProjectMaterialRow,
} from "./ProjectDetailsTable";
import { Button } from "../../components/Button";
import { FilterBar } from "../../components/FilterBar";
import { Building2, Hammer, Package } from "lucide-react";
import ProjectToolsTable from "./ProjectToolsTable";

type ProjectDetailsProps = {
	projectId: string;
};

type MaterialCostRow = {
	material_id: string;
	quantity_used: number;
};

type MaterialCostResponse = {
	message: string;
	data: {
		project_id: string;
		total_cost: number;
		materials: MaterialCostRow[];
	};
};

function calculateTotalPrice(rows: ProjectMaterialRow[]): number {
	return rows.reduce((sum, row) => sum + row.price, 0);
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [rows, setRows] = useState<ProjectMaterialRow[]>([]);
	const [projectName, setProjectName] = useState("");
	const [projectStatus, setProjectStatus] = useState<Project["status"] | null>(
		null,
	);
	const [totalCost, setTotalCost] = useState(0);
	const [isCompleting, setIsCompleting] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [tools, setTools] = useState<Tool[]>([]);
	const [viewType, setViewType] = useState<"" | "materials" | "tools">("");
	const [showCheckoutErrorModal, setShowCheckoutErrorModal] = useState(false);
	const [showCheckoutMessageModal, setShowCheckoutMessageModal] = useState("");

	useEffect(() => {
		const fetchProjectMaterials = async () => {
			try {
				setLoading(true);
				setError(null);

				const [
					projectsResponse,
					materialsResponse,
					materialCostResponse,
					toolsResponse,
				] = await Promise.all([
					apiFetch<{ message: string; data: Project[] }>("/projects"),
					apiFetch<{ message: string; data: Materials[] }>(
						`/materials?project_id=${encodeURIComponent(projectId)}`,
					),
					apiFetch<MaterialCostResponse>(
						`/projects/${projectId}/material-cost`,
					),
					apiFetch<{ message: string; data: Tool[] }>(
						`/tools?project_id=${encodeURIComponent(projectId)}`,
					),
				]);

				const currentProject = projectsResponse.data.find(
					project => project.id === projectId,
				);
				setProjectName(currentProject?.project_name ?? "");
				setProjectStatus(currentProject?.status ?? null);

				const quantityUsedByMaterial =
					materialCostResponse.data.materials.reduce<Record<string, number>>(
						(acc, item) => {
							acc[item.material_id] =
								(acc[item.material_id] ?? 0) + item.quantity_used;
							return acc;
						},
						{},
					);
				setTotalCost(Number(materialCostResponse.data.total_cost) || 0);

				const mappedRows = materialsResponse.data.map(material => ({
					id: material.id,
					name: material.name,
					price: Number(material.unit_cost) || 0,
					quantityAvailable: Number(material.unit_qty) || 0,
					quantityUsed: quantityUsedByMaterial[material.id] ?? 0,
				}));

				setRows(mappedRows);
				setTools(toolsResponse.data);
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "Failed to load project material details.";
				if (message.toLowerCase().includes("unauthorized")) {
					navigate("/login", { replace: true });
					return;
				}
				setError(message);
			} finally {
				setLoading(false);
			}
		};

		fetchProjectMaterials();
	}, [navigate, projectId]);

	/**
	 * Handle the button click for complete project
	 */
	const handleCompleteClick = () => {
		const checkedOut = tools.filter(t => t.status === "CHECKEDOUT");
		if (checkedOut.length > 0) {
			const toolNames = checkedOut.map(t => t.name).join(", ");
			setShowCheckoutMessageModal(
				`Cannot complete project. The following tools are still checked out: ${toolNames}. Please return them first.`,
			);
			setShowCheckoutErrorModal(true);
			return;
		}
		setIsConfirmModalOpen(true);
	};

	const handleCompleteProject = async () => {
		try {
			setIsCompleting(true);
			setError(null);
			await updateProject(projectId, { status: "COMPLETED" });
			setProjectStatus("COMPLETED");
			setIsConfirmModalOpen(false);
			navigate("/projects");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to complete project.";
			if (message.toLowerCase().includes("unauthorized")) {
				navigate("/login", { replace: true });
				return;
			}
			setError(message);
		} finally {
			setIsCompleting(false);
		}
	};

	const viewOptions = [
		{ value: "materials", label: "Materials" },
		{ value: "tools", label: "Tools" },
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading project details...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				{error}
			</div>
		);
	}

	return (
		<div className="p-6 min-h-screen">
			<div className="max-w-4xl mx-auto flex items-center justify-between mt-8 mb-4">
				<div>
					<h1 className="text-2xl font-bold">Project Details</h1>
					<p className="text-lg text-primary">{projectName || projectId}</p>
				</div>

				<div className="flex items-center gap-3">
					<span
						className={`px-2 py-1 rounded text-sm font-medium ${projectStatus === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
					>
						{projectStatus ?? "Unknown"}
					</span>

					<Button
						label={
							projectStatus === "COMPLETED"
								? "Project Completed"
								: "Complete Project"
						}
						variant="orange"
						size="sm"
						disabled={isCompleting || projectStatus === "COMPLETED"}
						onClick={handleCompleteClick}
						aria-disabled={isCompleting || projectStatus === "COMPLETED"}
						aria-label="Mark project as completed"
					/>
				</div>
			</div>

			<div className="max-w-4xl mx-auto mb-6">
				<FilterBar
					value={viewType}
					onChange={value => setViewType(value as "" | "materials" | "tools")}
					options={viewOptions}
					label="Select view"
					containerClassName="w-80"
				/>
			</div>

			{viewType === "" ? (
				<div className="flex justify-center mt-16">
					<div className="card bg-base-100 w-full max-w-sm shadow-sm p-8">
						<div className="text-center">
							<Building2
								size={64}
								className="mx-auto mb-4 text-tertiary opacity-50"
							/>
							<h3 className="text-lg font-semibold text-primary mb-2">
								Select what to view
							</h3>
							<p className="text-tertiary mb-6">
								Use the dropdown above to view materials or tools for this
								project.
							</p>
						</div>
					</div>
				</div>
			) : viewType === "materials" ? (
				<>
					{/* Empty State for materials  */}
					{rows.length === 0 ? (
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
										Add a material to get started with this project.
									</p>
								</div>
							</div>
						</div>
					) : (
						<ProjectDetailsTable
							rows={rows}
							totalPrice={calculateTotalPrice(rows)}
						/>
					)}
					<ProjectCost totalCost={totalCost} />
				</>
			) : (
				<>
					{tools.length === 0 ? (
						<div className="flex justify-center mt-16">
							<div className="card bg-base-100 w-full max-w-sm shadow-sm p-8">
								<div className="text-center">
									<Hammer
										size={64}
										className="mx-auto mb-4 text-tertiary opacity-50"
									/>
									<h3 className="text-lg font-semibold text-primary mb-2">
										No tools yet
									</h3>
									<p className="text-tertiary mb-6">
										Add a tools to get started with this project.
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="overflow-x-auto">
							<ProjectToolsTable tools={tools} />
						</div>
					)}
				</>
			)}

			{/* Checkout Error Modal */}
			{showCheckoutErrorModal && (
				<div className="modal modal-open modal-middle">
					<div className="modal-box max-w-2xl bg-base-100 shadow-2xl">
						<div className="flex items-center justify-between pb-4 border-b border-base-300">
							<h3 className="text-2xl font-bold text-primary">
								Cannot Complete Project
							</h3>
							<button
								type="button"
								className="btn btn-sm btn-circle btn-ghost"
								onClick={() => setShowCheckoutErrorModal(false)}
							>
								✕
							</button>
						</div>

						<div className="py-6">
							<p className="text-base text-base-content">
								{showCheckoutMessageModal}
							</p>
							<div className="modal-action pt-6 border-t border-base-300">
								<Button
									label="OK"
									variant="blue"
									size="sm"
									onClick={() => setShowCheckoutErrorModal(false)}
								/>
							</div>
						</div>
					</div>

					<form method="dialog" className="modal-backdrop">
						<button onClick={() => setShowCheckoutErrorModal(false)}>
							close
						</button>
					</form>
				</div>
			)}

			{isConfirmModalOpen && (
				<div className="modal modal-open modal-middle">
					<div className="modal-box max-w-2xl bg-base-100 shadow-2xl">
						<div className="flex items-center justify-between pb-4 border-b border-base-300">
							<h3 className="text-2xl font-bold text-primary">
								Complete Project
							</h3>
							<button
								type="button"
								className="btn btn-sm btn-circle btn-ghost"
								onClick={() => setIsConfirmModalOpen(false)}
							>
								✕
							</button>
						</div>

						<div className="py-6">
							<p className="text-base text-base-content">
								Are you sure you want to mark this project as completed?
							</p>
							<div className="modal-action pt-4 border-t border-base-300">
								<Button
									label="No, Keep Editing"
									variant="orange"
									onClick={() => setIsConfirmModalOpen(false)}
								/>
								<Button
									label={isCompleting ? "Saving..." : "Yes, Complete Project"}
									variant="blue"
									disabled={isCompleting}
									onClick={handleCompleteProject}
								/>
							</div>
						</div>
					</div>

					<form method="dialog" className="modal-backdrop">
						<button onClick={() => setIsConfirmModalOpen(false)}>close</button>
					</form>
				</div>
			)}
		</div>
	);
}
