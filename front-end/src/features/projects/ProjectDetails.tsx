import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../../api/api";
import { updateProject } from "../../api/projects-api";

import type { Materials } from "../../types/materials";
import type { Project } from "../../types/projects";
import ProjectCost from "./ProjectCost";
import ProjectDetailsTable, {
	type ProjectMaterialRow,
} from "./ProjectDetailsTable";

import { Button } from "../../components/Button";

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

	useEffect(() => {
		const fetchProjectMaterials = async () => {
			try {
				setLoading(true);
				setError(null);

				const [projectsResponse, materialsResponse, materialCostResponse] =
					await Promise.all([
						apiFetch<{ message: string; data: Project[] }>("/projects"),
						apiFetch<{ message: string; data: Materials[] }>(
							`/materials?project_id=${encodeURIComponent(projectId)}`,
						),
						apiFetch<MaterialCostResponse>(
							`/projects/${projectId}/material-cost`,
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
			<h1 className="text-2xl text-center font-bold mt-8 mb-2">
				Project Details
			</h1>
			<p className="text-lg text-primary text-center mb-4">
				{projectName || projectId}
			</p>
			<div className="max-w-4xl mx-auto flex justify-end mb-4">
				<Button
					label={
						projectStatus === "COMPLETED"
							? "Project Completed"
							: "Complete Project"
					}
					variant="orange"
					size="sm"
					disabled={isCompleting || projectStatus === "COMPLETED"}
					onClick={() => setIsConfirmModalOpen(true)}
				/>
			</div>

			{rows.length === 0 ? (
				<div className="text-gray-500">
					No materials found for this project.
				</div>
			) : (
				<ProjectDetailsTable
					rows={rows}
					totalPrice={calculateTotalPrice(rows)}
				/>
			)}
			<ProjectCost totalCost={totalCost} />

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
