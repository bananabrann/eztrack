import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toolsApi, Tool, ToolStatus } from "../../api/tools-api";
import { Button } from "../../components/Button";
import ToolsFormModal from "./ToolsFormModal";
import { SquarePlus } from "lucide-react";

interface ToolsManagementProps {
	search?: string;
	filter?: { status?: ToolStatus; project_id?: string };
}

export default function ToolsManagement({
	search = "",
	filter,
}: ToolsManagementProps) {
	const [tools, setTools] = useState<Tool[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		fetchTools();
	}, [filter?.status, filter?.project_id]);

	const fetchTools = async () => {
		try {
			setLoading(true);
			const response = await toolsApi.getAll(filter);

			const sortedTools = response.data.sort((a, b) => {
				if (a.status === "AVAILABLE" && b.status !== "AVAILABLE") return -1;
				if (b.status === "AVAILABLE" && a.status !== "AVAILABLE") return 1;
				return 0;
			});
			setTools(sortedTools);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const filteredTools = tools.filter(tool => {
		const matchesSearch = tool.name
			.toLowerCase()
			.includes(search.toLowerCase());
		const hideArchived =
			filter?.status !== "ARCHIVE" ? tool.status !== "ARCHIVE" : true;
		return matchesSearch && hideArchived;
	});

	const handleAddTool = () => {
		setIsModalOpen(true);
	};

	const handleToolSubmit = (tool: Tool) => {
		setTools(prev => [tool, ...prev]);
		setIsModalOpen(false);
		setSuccessMessage("Tool saved successfully!");
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

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
			{successMessage && (
				<div className="alert alert-success mb-6 shadow-lg">
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
			)}
			<div className="border-tertiary border rounded p-10">
				{filteredTools.length === 0 ? (
					<div className="text-center text-gray-500">No tools found</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredTools.map(tool => (
							<div
								key={tool.id}
								onClick={() => navigate(`/tools/${tool.id}`)}
								className="card bg-base-100 border border-outline shadow-sm hover:shadow-md active:shadow-sm hover:border-tertiary active:border-tertiary transition cursor-pointer"
							>
								<div className="card-body flex flex-col items-center text-center p-6">
									<h2 className="text-xl font-bold text-[--primary-text-color] mb-2">
										{tool.name}
									</h2>
									<span
										className={`w-fit px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${
											tool.status === "AVAILABLE"
												? "bg-green-50 text-green-700 border-green-200"
												: tool.status === "CHECKEDOUT"
													? "bg-orange-50 text-secondary border-orange-200"
													: "bg-slate-50 text-tertiary border-slate-200"
										}`}
									>
										{tool.status === "AVAILABLE"
											? "Available"
											: tool.status === "CHECKEDOUT"
												? "Checked Out"
												: "Archived"}
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
			<div className="mb-4 flex justify-center mt-8">
				<Button
					label="Create Tool"
					variant="orange"
					onClick={handleAddTool}
					icon={<SquarePlus className="w-5 h-5" aria-hidden="true" />}
				/>
			</div>
			<ToolsFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleToolSubmit}
			/>
		</section>
	);
}
