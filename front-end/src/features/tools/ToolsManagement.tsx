import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toolsApi, Tool } from "../../api/tools-api";

interface ToolsManagementProps {
	search?: string;
	filter?: string;
}

export default function ToolsManagement({
	search = "",
	filter = "",
}: ToolsManagementProps) {
	const [tools, setTools] = useState<Tool[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetchTools();
	}, [filter]);

	const fetchTools = async () => {
		try {
			setLoading(true);
			const response = await toolsApi.getAll(filter as any);
			setTools(response.data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const filteredTools = tools.filter(tool =>
		tool.name.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading)
		return (
			<div className="text-center py-8 text-[--tertiary-color]">
				Loading tools...
			</div>
		);
	if (error)
		return (
			<div className="text-center py-8 text-[--secondary-color]">{error}</div>
		);

	return (
		<section className="w-10/12 md:w-3/4 max-w-7xl min-w-0 mx-auto">
			<div className="border-tertiary border rounded p-10">
				{filteredTools.length === 0 ? (
					<div className="text-center text-gray-500">No tools found</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredTools.map(tool => (
							<div
								key={tool.id}
								onClick={() => navigate(`/tools/${tool.id}`)}
								className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
							>
								<div className="card-body">
									<h2 className="text-xl font-bold text-[--primary-text-color] mb-1">
										{tool.name}
									</h2>
									<span
										className={`w-fit px-4 py-2 rounded-full text-sm font-medium ${
											tool.status === "AVAILABLE"
												? "bg-green-50 text-green-800"
												: tool.status === "CHECKEDOUT"
													? "bg-yellow-50 text-yellow-800"
													: "bg-gray-50 text-gray-800"
										}`}
									>
										{tool.status}
									</span>
									{tool.checked_out_by && (
										<p className="text-sm text-gray-600 mt-2">
											Checked out by: {tool.checked_out_by}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
