import { Link } from "react-router";
import type { Project } from "../../types/projects";

function formatProjectStatus(status: Project["status"]): string {
	return status.charAt(0) + status.slice(1).toLowerCase();
}

type ProjectsTableProps = {
	projects: Project[];
};

export default function ProjectsTable({ projects }: ProjectsTableProps) {
	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-3xl mt-6 mb-6">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th className="w-16"></th>
						<th>Project Name</th>
						<th>Project Status</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project, index) => (
						<tr key={project.id}>
							<td className="text-gray-500">{index + 1}</td>
							<td className="flex items-center gap-3">
								<Link
									to={`/projects/${project.id}`}
									className="link link-hover"
									aria-label={`View details for ${project.project_name}`}
								>
									{project.project_name}
								</Link>
							</td>
							<td className="text-gray-500">
								{formatProjectStatus(project.status)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
