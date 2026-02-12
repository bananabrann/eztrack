export default function Header() {
	return (
		<header className="w-full border-b">
			<nav
				aria-label="Main Nav"
				className="max-w-7x1 mx-auto flex items-center justify-between px-6 py-4"
			>
				{/*Logo*/}
				<div>
					<img
						src="/eztrack-logo.png"
						alt="EZTrack Company Logo"
						className="h-8 w-auto"
					/>
				</div>

				{/*Nav Links*/}
				<ul className="flex space-x-8">
					<li>
						<a
							href="/"
							aria-label="Go to homepage"
							className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
						>
							Home
						</a>
					</li>

					<li>
						<a
							href="/"
							aria-label="Go to homepage"
							className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
						>
							Services
						</a>
					</li>

					<li>
						<a
							href="/"
							aria-label="Go to homepage"
							className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
						>
							Pages
						</a>
					</li>

					<li>
						<a
							href="/"
							aria-label="Go to homepage"
							className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
						>
							Contact
						</a>
					</li>
				</ul>
			</nav>
		</header>
	);
}
