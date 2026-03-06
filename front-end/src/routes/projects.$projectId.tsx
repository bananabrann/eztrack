import { useParams } from "react-router";
import ProjectDetails from "../features/projects/ProjectDetails";

export default function ProjectDetailsRoute() {
	const { projectId } = useParams();

	if (!projectId) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				Project ID is missing.
			</div>
		);
	}

	return (
		<main className="flex-1 max-w-7xl mx-auto px-6 py-16">
			<ProjectDetails projectId={projectId} />
		</main>
	);
}
