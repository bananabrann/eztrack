import { useEffect, useState } from "react";
import { FolderOpen, Search, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import ProjectsTable from "../features/projects/ProjectsTable";
import ProjectFormModal from "../features/projects/ProjectFormModal";
import { createProject, getProjects } from "../api/projects-api";
import type { CreateProjectInput, Project } from "../types/projects";
import { FilterBar } from "../components/FilterBar";
import { SearchBar } from "../components/SearchBar";

export default function Projects() {
	const navigate = useNavigate();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [search, setSearch] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

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
			setSuccessMessage("Project created successfully!");
			setTimeout(() => setSuccessMessage(""), 3000);
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

	// Filter by status and search
	const filteredProjects = projects.filter(project => {
		const matchesStatus = statusFilter ? project.status === statusFilter : true;
		const matchesSearch = search
			? project.project_name.toLowerCase().includes(search.toLowerCase())
			: true;
		return matchesStatus && matchesSearch;
	});

	return (
		<main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
			<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl mb-6 flex items-center justify-center">
				Project Management
			</h1>

			{/* Load projects */}
			{projects.length === 0 ? (
				<div className="flex justify-center mt-16">
					<div className="card bg-base-100 w-full max-w-sm shadow-sm p-8">
						<div className="text-center">
							<FolderOpen
								size={64}
								className="mx-auto mb-4 text-tertiary opacity-50"
							/>
							<h3 className="text-lg font-semibold text-primary mb-2">
								No projects yet
							</h3>
							<p className="text-tertiary mb-6">
								Create a new project to get started.
							</p>
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-3xl mx-auto">
						<div className="flex-1">
							<SearchBar
								value={search}
								onChange={setSearch}
								placeholder="Search project..."
							/>
						</div>
						<div className="flex-1">
							<FilterBar
								value={statusFilter}
								onChange={setStatusFilter}
								label="All"
								options={[
									{ value: "ACTIVE", label: "Active" },
									{ value: "COMPLETED", label: "Completed" },
								]}
							/>
						</div>
					</div>
					{/* Create New Project */}
					<div className="flex justify-center">
						<Button
							label="Create New Project"
							variant="orange"
							icon={<SquarePlus className="w-5 h-5" aria-hidden="true" />}
							onClick={() => setIsProjectModalOpen(true)}
						/>
					</div>

					{/* ADD THIS SUCCESS MESSAGE BLOCK */}
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

					{filteredProjects.length === 0 ? (
						<div className="flex justify-center mt-16">
							<div className="card bg-base-100 w-full max-w-sm shadow-sm p-8">
								<div className="text-center">
									<Search
										size={64}
										className="mx-auto mb-4 text-tertiary opacity-50"
									/>
									<h3 className="text-lg font-semibold text-primary mb-2">
										No projects match
									</h3>
									<p className="text-tertiary mb-6">
										Try adjusting your search or filter criteria.
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="flex justify-center">
							<ProjectsTable projects={filteredProjects} />
						</div>
					)}
				</>
			)}
			<ProjectFormModal
				isOpen={isProjectModalOpen}
				onClose={() => setIsProjectModalOpen(false)}
				onSave={handleCreateProject}
			/>
		</main>
	);
}
