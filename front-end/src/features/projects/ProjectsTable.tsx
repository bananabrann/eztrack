import { Link } from "react-router";

type Project = {
	id: string | number;
	project_name: string;
};

type ProjectsTableProps = {
	projects: Project[];
};

export default function ProjectsTable({ projects }: ProjectsTableProps) {
	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-3xl mt-6 mb-6">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th className="w-16">#</th>
						<th>Project Name</th>
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
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
