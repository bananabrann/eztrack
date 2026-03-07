import type { Tool } from "../../api/tools-api";

type Props = {
	tools: Tool[];
};

export default function ProjectToolsTable({ tools }: Props) {
	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full max-w-4xl mx-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th className="text-tertiary text-lg">Name</th>
						<th className="text-tertiary text-lg">Status</th>
						<th className="text-tertiary text-lg">Checked Out By</th>
					</tr>
				</thead>
				<tbody>
					{tools.map(tool => (
						<tr key={tool.id}>
							<td>{tool.name}</td>
							<td>{tool.status}</td>
							<td>{(tool as any).checked_out_by ?? ""}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
