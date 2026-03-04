import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../../api/api";
import type { Materials } from "../../types/materials";
import type { Project } from "../../types/projects";

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

type ProjectMaterialRow = {
	id: string;
	name: string;
	price: number;
	quantityAvailable: number;
	quantityUsed: number;
};

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [rows, setRows] = useState<ProjectMaterialRow[]>([]);
	const [projectName, setProjectName] = useState("");

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
						apiFetch<MaterialCostResponse>(`/projects/${projectId}/material-cost`),
					]);

				const currentProject = projectsResponse.data.find(
					project => project.id === projectId,
				);
				setProjectName(currentProject?.project_name ?? "");

				const quantityUsedByMaterial = materialCostResponse.data.materials.reduce<
					Record<string, number>
				>((acc, item) => {
					acc[item.material_id] = (acc[item.material_id] ?? 0) + item.quantity_used;
					return acc;
				}, {});

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

	const totalUsed = useMemo(
		() => rows.reduce((sum, row) => sum + row.quantityUsed, 0),
		[rows],
	);

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
		<div className="p-6">
			<h1 className="text-2xl text-center font-bold mt-8 mb-2">Project Details</h1>
			<p className="text-lg text-primary text-center mb-4">
				{projectName || projectId}
			</p>

			{rows.length === 0 ? (
				<div className="text-gray-500">No materials found for this project.</div>
			) : (
				<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-4xl mx-auto">
					<table className="table table-zebra">
						<thead>
							<tr>
								<th>Material</th>
								<th>Price</th>
								<th>Quantity Available</th>
								<th>Quantity Used</th>
							</tr>
						</thead>
						<tbody>
							{rows.map(row => (
								<tr key={row.id}>
									<td>{row.name}</td>
									<td>${row.price.toFixed(2)}</td>
									<td>{row.quantityAvailable}</td>
									<td>{row.quantityUsed}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<th>Total</th>
								<th>-</th>
								<th>-</th>
								<th>{totalUsed}</th>
							</tr>
						</tfoot>
					</table>
				</div>
			)}
		</div>
	);
}
