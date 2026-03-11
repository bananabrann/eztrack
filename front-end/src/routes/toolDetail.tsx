import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { Link } from "react-router-dom";
import { Pencil, ArrowLeft } from "lucide-react";
import { toolsApi, Tool } from "../api/tools-api";
import { getProjects } from "../api/projects-api";
import { Project } from "../types/projects";
import { Button } from "../components/Button";
import ToolsFormModal from "../features/tools/ToolsFormModal";

export default function ToolDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [tool, setTool] = useState<Tool | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [project, setProject] = useState<Project | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const outletContext = useOutletContext<{ role: string | null } | undefined>();
	const role = outletContext?.role ?? null;
	const isForeman = role === "FOREMAN";

	useEffect(() => {
		void fetchTool();
	}, [id]);

	const fetchTool = async () => {
		try {
			setLoading(true);
			setError("");
			const response = await toolsApi.getAll();
			const foundTool = response.data.find(t => t.id === id);
			if (foundTool) {
				setTool(foundTool);
				if (foundTool.project_id) {
					const projRes = await getProjects();
					const foundProject = projRes.data.find(
						p => p.id === foundTool.project_id,
					);
					setProject(foundProject || null);
				} else {
					setProject(null);
				}
			} else {
				setError("Tool not found");
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCheckout = async () => {
		if (!tool) return;
		try {
			setError("");
			await toolsApi.checkout(tool.id);
			await fetchTool();
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleReturn = async () => {
		if (!tool) return;
		try {
			setError("");
			await toolsApi.return(tool.id);
			await fetchTool();
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleToolSubmit = (_updatedTool: Tool) => {
		setIsModalOpen(false);
		void fetchTool();
	};

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen text-[--tertiary-color]">
				Loading tool details...
			</div>
		);

	if (error || !tool)
		return (
			<div className="flex justify-center items-center h-screen text-[--secondary-color]">
				{error || "Tool not found"}
			</div>
		);

	const statusBadgeStyle =
		tool.status === "AVAILABLE"
			? "bg-green-100 text-green-800"
			: tool.status === "CHECKEDOUT"
				? "bg-amber-100 text-amber-800"
				: "bg-gray-100 text-gray-800";

	const statusLabel =
		tool.status === "AVAILABLE"
			? "Available"
			: tool.status === "CHECKEDOUT"
				? "Checked Out"
				: "Archived";

	const checkedOutByCurrentUser = Boolean(tool.checked_out_by_me);

	return (
		<main className="min-h-screen bg-background px-6 py-10">
			<div className="mx-auto w-full max-w-2xl flex flex-col gap-6">
				<button
					onClick={() => navigate("/toolsManagement")}
					className="w-fit flex items-center gap-2 text-sm font-semibold text-tertiary hover:text-secondary transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>Back to Tools</span>
				</button>

				<div className="bg-base-100 border border-outline rounded-xl p-8 flex flex-col gap-8">
					<div className="flex w-full items-start justify-between">
						<div className="flex flex-col gap-2">
							<h1 className="text-3xl font-bold text-primary">{tool.name}</h1>
							<div className="flex items-center gap-3">
								<span
									className={`px-3 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${statusBadgeStyle}`}
								>
									{statusLabel}
								</span>
							</div>
						</div>
						{isForeman ? (
							<button
								onClick={() => setIsModalOpen(true)}
								className="btn btn-sm btn-outline btn-ghost rounded-md px-3 py-2 transition hover:bg-secondary/10 hover:text-secondary flex gap-2 items-center"
								aria-label="Edit tool"
							>
								<Pencil className="h-4 w-4" />
							</button>
						) : null}
					</div>

					{/* Project Context */}
					<div className="flex flex-col gap-2">
						<span className="text-sm font-semibold text-tertiary uppercase tracking-wider">
							Assigned Project
						</span>
						<div className="flex flex-wrap items-center gap-4">
							{tool.project_id ? (
								<>
									<span className="text-lg text-primary font-medium">
										{project?.project_name || "Loading..."}
									</span>
									{isForeman && project && (
										<Link
											to={`/projects/${tool.project_id}`}
											className="text-secondary hover:text-secondary/80 text-sm font-medium underline underline-offset-2 transition-colors"
										>
											View Project
										</Link>
									)}
								</>
							) : (
								<span className="text-lg text-tertiary">Unassigned</span>
							)}
						</div>
					</div>

					{/* Metadata mapping checkout */}
					{tool.status === "CHECKEDOUT" ? (
						<div className="flex flex-col gap-2 border-t border-outline/50 pt-6 mt-2">
							<span className="text-sm font-semibold text-tertiary uppercase tracking-wider">
								Checked Out By
							</span>
							<span className="text-lg text-primary font-medium">
								{tool.checked_out_by ?? "Unknown"}
							</span>
						</div>
					) : null}

					{/* Actions */}
					<div className="w-full pt-4 flex justify-center gap-4">
						{tool.status === "AVAILABLE" ? (
							<Button
								label="Check Out"
								variant="blue"
								onClick={handleCheckout}
							/>
						) : null}

						{tool.status === "CHECKEDOUT" && checkedOutByCurrentUser ? (
							<Button
								label="Check In"
								variant="orange"
								onClick={handleReturn}
							/>
						) : null}

						{tool.status === "CHECKEDOUT" && !checkedOutByCurrentUser ? (
							<Button
								label="Checked out"
								variant="orange"
								onClick={() => undefined}
								disabled
							/>
						) : null}
					</div>
				</div>
			</div>

			{isForeman ? (
				<ToolsFormModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleToolSubmit}
					initialData={tool}
				/>
			) : null}
		</main>
	);
}
