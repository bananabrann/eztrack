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

	return <ProjectDetails projectId={projectId} />;
}
