import type { Tool, ToolStatus } from "../../api/tools-api";

type Props = {
	tools: Tool[];
};

function getStatusDisplay(status: ToolStatus): {
	label: string;
	className: string;
} {
	switch (status) {
		case "AVAILABLE":
			return {
				label: "Available",
				className: "bg-green-50 text-green-700 border-green-200",
			};
		case "CHECKEDOUT":
			return {
				label: "Checked Out",
				className: "bg-orange-50 text-secondary border-orange-200",
			};
		case "ARCHIVE":
			return {
				label: "Archived",
				className: "bg-slate-50 text-tertiary border-slate-200",
			};
		default:
			return {
				label: status,
				className: "bg-slate-50 text-tertiary border-slate-200",
			};
	}
}

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
					{tools.map(tool => {
						const statusDisplay = getStatusDisplay(tool.status);
						return (
							<tr key={tool.id}>
								<td>{tool.name}</td>
								<td>
									<span
										className={`w-fit px-2 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${statusDisplay.className}`}
									>
										{statusDisplay.label}
									</span>
								</td>
								<td>
									{(tool as any).checked_out_by ? (
										(tool as any).checked_out_by
									) : (
										<span className="text-xs text-gray-400 font-medium">
											Not checked out
										</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
