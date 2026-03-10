import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import ProjectsTable from "../features/projects/ProjectsTable";
import ProjectFormModal from "../features/projects/ProjectFormModal";
import { createProject, getProjects } from "../api/projects-api";
import type { CreateProjectInput, Project } from "../types/projects";
import { FilterBar } from "../components/FilterBar";

export default function Projects() {
	const navigate = useNavigate();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("");

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await getProjects();
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

	const handleCreateProject = async (project: CreateProjectInput) => {
		try {
			const response = await createProject(project);
			setProjects(prev => [response.data, ...prev]);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to create project.";
			if (message.toLowerCase().includes("unauthorized")) {
				navigate("/login", { replace: true });
				return;
			}
			throw err;
		}
	};

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

	// Filter
	const filteredProjects = projects.filter(project =>
		statusFilter ? project.status === statusFilter : true,
	);

	return (
		<main className="flex-1 max-w-7xl mx-auto px-6 py-16 min-h-screen">
			<div className="flex flex-col gap-4 items-center">
				<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl flex items-center justify-center">
					Project Management
				</h1>

				{/* Load projects */}
				{projects.length === 0 ? (
					<div className="text-gray-500">
						No projects found. Please create a new project.
					</div>
				) : (
					<>
						<FilterBar
							value={statusFilter}
							onChange={setStatusFilter}
							label="All"
							options={[
								{ value: "ACTIVE", label: "Active" },
								{ value: "COMPLETED", label: "Completed" },
							]}
							containerClassName="w-80 max-w-md"
						/>

						{/* Create New Project */}
						<Button
							label="Create New Project"
							variant="orange"
							icon={<SquarePlus className="w-5 h-5" aria-hidden="true" />}
							onClick={() => setIsProjectModalOpen(true)}
						/>

						{filteredProjects.length === 0 ? (
							<div className="text-gray-500">
								No projects match the selected filter.
							</div>
						) : (
							<ProjectsTable projects={filteredProjects} />
						)}
					</>
				)}
				<ProjectFormModal
					isOpen={isProjectModalOpen}
					onClose={() => setIsProjectModalOpen(false)}
					onSave={handleCreateProject}
				/>
			</div>
		</main>
	);
}
