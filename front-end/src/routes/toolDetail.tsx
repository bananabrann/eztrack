import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { Pencil } from "lucide-react";
import { toolsApi, Tool } from "../api/tools-api";
import { Button } from "../components/Button";
import ToolsFormModal from "../features/tools/ToolsFormModal";

export default function ToolDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [tool, setTool] = useState<Tool | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const outletContext = useOutletContext<{ role: string | null } | undefined>();
	const role = outletContext?.role ?? null;
	const isForeman = role === "FOREMAN";

	useEffect(() => {
		void fetchTool();
	}, [id]);

	const fetchTool = async () => {
		try {
			setLoading(true);
			setError("");
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

	const handleCheckout = async () => {
		if (!tool) return;
		try {
			setError("");
			await toolsApi.checkout(tool.id);
			await fetchTool();
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleReturn = async () => {
		if (!tool) return;
		try {
			setError("");
			await toolsApi.return(tool.id);
			await fetchTool();
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleToolSubmit = (_updatedTool: Tool) => {
		setIsModalOpen(false);
		void fetchTool();
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

	const statusDotColor =
		tool.status === "AVAILABLE"
			? "bg-green-500"
			: tool.status === "CHECKEDOUT"
				? "bg-yellow-500"
				: "bg-gray-500";

	const statusLabel =
		tool.status === "AVAILABLE"
			? "Available"
			: tool.status === "CHECKEDOUT"
				? "Checked Out"
				: "Archived";

	const checkedOutByCurrentUser = Boolean(tool.checked_out_by_me);

	return (
		<main className="min-h-screen bg-background px-6 py-10">
			<div className="mx-auto w-full max-w-2xl">
					<button
						onClick={() => navigate("/toolsManagement")}
						className="mb-6 text-tertiary hover:text-secondary transition-colors"
					>
						{"<- Back to Tools"}
					</button>

				<div className="card bg-base-100 border border-outline shadow-md">
					<div className="card-body items-center gap-8 text-center py-10">
						<div className="flex w-full items-start justify-between">
							<h1 className="text-3xl font-bold text-primary">Tool Checkout</h1>
							{isForeman ? (
								<button
									onClick={() => setIsModalOpen(true)}
									className="rounded-md p-2 transition hover:bg-base-200"
									aria-label="Edit tool"
								>
									<Pencil className="h-5 w-5 text-tertiary" />
								</button>
							) : (
								<span className="h-9 w-9" aria-hidden="true" />
							)}
						</div>

						<div className="relative">
							<div className="card w-60 bg-base-100 border border-base-300 shadow">
								<div className="card-body items-center p-4">
									<div className="w-full rounded-md bg-primary py-2 px-3 text-sm font-semibold text-white">
										{tool.name}
									</div>
								</div>
							</div>
							<span
								className={`absolute right-0 top-12 h-4 w-4 translate-x-1/2 rounded-full border-2 border-white ${statusDotColor}`}
								aria-label={`Status: ${statusLabel}`}
								title={`Status: ${statusLabel}`}
							/>
						</div>

						<p className="text-lg text-tertiary">
							{tool.name} {statusLabel}
						</p>

						{isForeman && tool.status === "CHECKEDOUT" ? (
							<p className="text-sm text-gray-600">
								Checked out by {tool.checked_out_by ?? "Unknown"}
							</p>
						) : null}

						<div className="w-full max-w-[420px] space-y-6">
							{tool.status === "AVAILABLE" ? (
								<Button
									label="Check Out"
									variant="blue"
									onClick={handleCheckout}
								/>
							) : null}

							{tool.status === "CHECKEDOUT" && checkedOutByCurrentUser ? (
								<Button
									label="Check In"
									variant="orange"
									onClick={handleReturn}
								/>
							) : null}

							{tool.status === "CHECKEDOUT" && !checkedOutByCurrentUser ? (
								<Button
									label="Checked out"
									variant="orange"
									onClick={() => undefined}
									disabled
								/>
							) : null}
						</div>
					</div>
				</div>
			</div>

			{isForeman ? (
				<ToolsFormModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleToolSubmit}
					initialData={tool}
				/>
			) : null}
		</main>
	);
}
