import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header className="min-w-full inline-block bg-[#4F5D75] text-white border-b">
			<div className="max-w-7xl mx-auto px-6">
				<nav
					className="flex flex-col md:grid md:grid-cols-3 gap-4 items-center py-6"
					aria-label="Main Nav"
				>
					{/* Column 1: Empty placeholder (or your Logo) */}
					<div className="hidden md:flex justify-start">
						{/* If you have a Logo, put it here. Otherwise, leave empty */}
					</div>

					{/* Column 2: Centered Links */}
					<ul className="flex gap-4 md:gap-16 justify-center">
						<li>
							<Link
								to="/"
								className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] px-2 py-1 rounded"
							>
								Home
							</Link>
						</li>
						<li>
							<Link
								to="/dashboard"
								className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] px-2 py-1 rounded"
							>
								Dashboard
							</Link>
						</li>
						<li>
							<Link
								to="/tools-management"
								className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] px-2 py-1 rounded"
							>
								Tools
							</Link>
						</li>
						<li>
							<Link
								to="/materials"
								className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] px-2 py-1 rounded"
							>
								Materials
							</Link>
						</li>
						<li>
							<Link
								to="/projects"
								className="relative z-10 hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] px-2 py-1 rounded"
							>
								Projects
							</Link>
						</li>
					</ul>

					{/* Column 3: Right Aligned Logout */}
					<div className="flex justify-end pr-10">
						<Link
							to="/"
							className="hover:text-[#EA5C1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] px-2 py-1 rounded"
						>
							Logout
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
