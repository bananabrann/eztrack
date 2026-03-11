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
		<div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-box border border-base-content/5 bg-base-100 w-full max-w-full md:max-w-3xl mt-6 mb-6">
			<table className="table table-zebra">
				<thead className="sticky top-0 z-10 bg-base-200/80 backdrop-blur-sm">
					<tr className="border-b border-base-content/10">
						<th className="text-tertiary text-lg0">#</th>
						<th className="text-tertiary text-lg">Project Name</th>
						<th className="text-tertiary text-lg">Status</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project, index) => (
						<tr
							key={project.id}
							className="hover:bg-base-200/50 transition-all duration-200 ease-in-out border-b border-base-content/5 last:border-0"
						>
							<td className="text-gray-500">{index + 1}</td>
							<td className="flex items-center gap-3">
								<Link
									to={`/projects/${project.id}`}
									className="text-primary hover:text-primary-focus underline decoration-primary/30 decoration-1 underline-offset-4 hover:decoration-primary hover:decoration-2 font-medium transition-all duration-200 cursor-pointer hover:translate-x-0.5 inline-block"
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
