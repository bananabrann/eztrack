import { useLocation } from "react-router-dom";

export default function ToolsCheck() {
	const location = useLocation();
	const { toolName, toolDescription } = location.state || {
		toolName: "Unknown Tool",
		toolDescription: "",
	};

	const buttonStyles =
		"bg-[#212431] hover:bg-[#EA5C1F] focus:bg-[#4F5D75] active:bg-[#4F5D75] focus-visible:bg-[#4F5D75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA5C1F] focus-visible:ring-offset-2 text-white font-bold py-2 px-4 rounded w-full max-w-sm";

	return (
		<main className="max-w-3xl mx-auto px-6 py-16">
			{/* Page Title */}
			<h1 className="text-[#4F5D75] text-3xl font-bold mb-1 flex items-center justify-center">
				Tool Check Out
			</h1>

			{/* Tools Placeholder Section */}
			<section className="w-10/12 md:w-3/4  max-w-7xl min-w-0 mx-auto">
				<div className="border-[#4F5D75] p-4 text-center text-gray-500">
					<div className="grid grid-cols-1 grid-rows-1">
						{/* <!-- Box/Image Placeholder --> */}
						<div
							className="block max-w-md justify-self-center w-full bg-gray-100
								rounded border-2 border-transparent hover:border-[#4F5D75]
								transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]
								flex flex-col justify-end px-12 h-80"
						>
							<div className="text-center text-[#EA5C1F] bg-[#212431] px-4 py-1 max-w-max mx-auto rounded">
								{toolName}
							</div>
						</div>

						<h4 className="text-[#4F5D75] text-1xl mt-4">{toolDescription}</h4>
					</div>
				</div>

				{/* <!-- Buttons --> */}
				<div className="flex flex-col items-center mt-6 space-y-4">
					<button className={buttonStyles}>Check Out</button>
					<button className={buttonStyles}>Check In</button>
				</div>
			</section>
		</main>
	);
}
