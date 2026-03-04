import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toolsApi, Tool } from "../api/tools-api";

export default function ToolDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [tool, setTool] = useState<Tool | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchTool();
	}, [id]);

	const fetchTool = async () => {
		try {
			setLoading(true);
			const response = await toolsApi.getAll();
			const foundTool = response.data.find(t => t.id === id);
			if (foundTool) {
				setTool(foundTool);
			} else {
				setError("Tool not found");
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen text-[--tertiary-color]">
				Loading tool details...
			</div>
		);

	if (error || !tool)
		return (
			<div className="flex justify-center items-center h-screen text-[--secondary-color]">
				{error || "Tool not found"}
			</div>
		);

	return (
		<main className="max-w-4xl mx-auto px-6 py-16">
			<button
				onClick={() => navigate("/toolsManagement")}
				className="mb-6 text-[--tertiary-color] hover:text-[--secondary-color] transition-colors"
			>
				← Back to Tools
			</button>

			<div className="bg-white rounded-lg border-2 border-[--disabled-color] p-8 shadow-md">
				<h1 className="text-3xl font-bold text-[--primary-text-color] mb-4">
					{tool.name}
				</h1>

				<div className="mb-6">
					<span
						className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
							tool.status === "AVAILABLE"
								? "bg-green-100 text-green-800"
								: tool.status === "CHECKEDOUT"
									? "bg-yellow-100 text-yellow-800"
									: "bg-gray-100 text-gray-800"
						}`}
					>
						{tool.status}
					</span>
				</div>

				<div className="space-y-4 text-[--tertiary-color]">
					<div>
						<span className="font-semibold">Tool ID:</span> {tool.id}
					</div>
				</div>

				<div className="mt-8 p-4 bg-[--background-color] rounded-lg">
					<p className="text-[--tertiary-color] text-sm">
						Tool checkout button
					</p>
				</div>
			</div>
		</main>
	);
}
