export default function Header() {
	return (
		<header className="w-full border-b">
			<nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4"				
				aria-label="Main Nav"
			>
				{/*Logo*/}
				<div>
					<img className="h-8 w-auto"
						src="/eztrack-logo.png"
						alt="EZTrack Company Logo"
					/>
				</div>

				{/*Nav Links*/}
				<ul className="flex space-x-8">
					<li>
						<a className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
							href="/"
							aria-label="Go to homepage"
						>
							Home
						</a>
					</li>

					<li>
						<a className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
							href="/"
							aria-label="Go to Services page"
						>
							Services
						</a>
					</li>

					<li>
						<a className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
							href="/"
							aria-label="Go to pages"
						>
							Pages
						</a>
					</li>

					<li>
						<a className="hover:text-[#EA5C1F] focus:outline-none focus:ring-2 focus:ring-[#EA5C1F] rounded"
							href="/"
							aria-label="Go to contact page"
						>
							Contact
						</a>
					</li>
				</ul>
			</nav>
		</header>
	);
}
