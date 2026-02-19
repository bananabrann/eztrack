import { Link } from "react-router-dom";

export default function ToolsManagement() {
	return (
		<main className="max-w-7xl mx-auto px-6 py-16">
			{/* Page Title */}
			<h1 className="text-[#4F5D75] text-3xl font-bold mb-6 flex items-center justify-center">
				Tools Management
			</h1>

			{/* Search Bar Placeholder */}
			<div className="w-11/12 max-w-md mx-auto mb-6 flex items-center justify-center">
				<input
					type="text"
					placeholder="Search tool..."
					className="w-full border-[#4F5D75] border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#EA5C1F]"
				/>
			</div>
			<div className=" w-48 max-w-md mx-auto mb-6 flex items-center justify-center">
				<input
					type="text"
					placeholder="Filter..."
					className="w-full border-[#4F5D75] border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#EA5C1F]"
				/>
			</div>

			{/* Tools Placeholder Section */}
			<section className="w-10/12 md:w-3/4  max-w-7xl min-w-0 mx-auto">
				<div className="border-[#4F5D75] border rounded p-10 text-center text-gray-500">
					<div className="grid grid-cols-2 grid-rows-3 gap-y-8 gap-x-8">
						{/* <!-- Box 1 --> */}
						<Link
							to="/tools-check"
							state={{ toolName: "Hammer", toolDescription: "7 Hammers" }}
							className="block max-w-md justify-self-end w-full bg-gray-100
									rounded border-2 border-transparent hover:border-[#4F5D75]
									transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]
									flex flex-col justify-end px-12 h-80"
						>
							<div className="text-center text-[#EA5C1F] bg-[#212431] px-4 py-1 max-w-max mx-auto rounded">
								Hammer
							</div>
						</Link>

						{/* <!-- Box 2 --> */}
						<Link
							to="/tools-check"
							state={{
								toolName: "Cordless Drill",
								toolDescription: "12 Cordless Drills Available",
							}}
							className="block max-w-md justify-self-end w-full bg-gray-100
									rounded border-2 border-transparent hover:border-[#4F5D75]
									transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]
									flex flex-col justify-end px-12 h-80"
						>
							<div className="text-center text-[#EA5C1F] bg-[#212431] px-4 py-1 max-w-max mx-auto rounded">
								Cordless Drill
							</div>
						</Link>

						{/* <!-- Box 3 --> */}
						<Link
							to="/tools-check"
							state={{
								toolName: "Circular Saw",
								toolDescription: "3 Circular Saws",
							}}
							className="block max-w-md justify-self-end w-full bg-gray-100
									rounded border-2 border-transparent hover:border-[#4F5D75]
									transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]
									flex flex-col justify-end px-12 h-80"
						>
							<div className="text-center text-[#EA5C1F] bg-[#212431] px-4 py-1 max-w-max mx-auto rounded">
								Circular Saw
							</div>
						</Link>

						{/* <!-- Box 4 --> */}
						<Link
							to="/tools-check"
							state={{
								toolName: "Tool Belt",
								toolDescription: "15 Tool Belts",
							}}
							className="block max-w-md justify-self-end w-full bg-gray-100
									rounded border-2 border-transparent hover:border-[#4F5D75]
									transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]
									flex flex-col justify-end px-12 h-80"
						>
							<div className="text-center text-[#EA5C1F] bg-[#212431] px-4 py-1 max-w-max mx-auto rounded">
								Tool Belt
							</div>
						</Link>

						{/* <!-- Box 5 --> */}
						<Link
							to="/tools-check"
							state={{ toolName: "Table Saw", toolDescription: "2 Table Saws" }}
							className="block max-w-md justify-self-end w-full bg-gray-100
									rounded border-2 border-transparent hover:border-[#4F5D75]
									transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]
									flex flex-col justify-end px-12 h-80"
						>
							<div className="text-center text-[#EA5C1F] bg-[#212431] px-4 py-1 max-w-max mx-auto rounded">
								Table Saw
							</div>
						</Link>

						{/* <!-- Box 6 --> */}
						<Link
							to="/tools-check"
							state={{ toolName: "Sander", toolDescription: "5 Sanders" }}
							className="block max-w-md justify-self-end w-full bg-gray-100
									rounded border-2 border-transparent hover:border-[#4F5D75]
									transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]
									flex flex-col justify-end px-12 h-80"
						>
							<div className="text-center text-[#EA5C1F] bg-[#212431] px-4 py-1 max-w-max mx-auto rounded">
								Sander
							</div>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
