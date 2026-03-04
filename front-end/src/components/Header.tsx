import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Logo } from "./Logo";
import { LogOut } from "lucide-react";

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();

	// Logout handler
	const handleLogout = () => {
		localStorage.removeItem("token"); // example auth cleanup
		navigate("/login");
	};

	return (
		<header className="navbar bg-tertiary shadow-sm px-6 text-white relative">
			{/* LEFT: Logo */}
			<div className="navbar-start">
				<NavLink
					to="/"
					className="flex items-center"
					aria-label="Go to Home Page"
				>
					<Logo size="sm" />
				</NavLink>
			</div>

			{/* CENTER: Links for desktop */}
			<div className="navbar-center hidden md:flex">
				<nav className="flex items-center gap-6">
					<NavLink
						to="/"
						className="whitespace-nowrap"
						aria-label="Go to Home Page"
					>
						Home
					</NavLink>
					<NavLink
						to="/toolsManagement"
						className="whitespace-nowrap"
						aria-label="Go to Tools Management"
					>
						Tools Management
					</NavLink>
					<NavLink
						to="/materials"
						className="whitespace-nowrap"
						aria-label="Go to Materials Management"
					>
						Materials Management
					</NavLink>
					<NavLink
						to="/projects"
						className="whitespace-nowrap"
						aria-label="Go to Project Management"
					>
						Project Management
					</NavLink>
				</nav>
			</div>

			{/* RIGHT: Logout + Hamburger */}
			<div className="navbar-end flex items-center gap-4">
				{/* Mobile Hamburger */}
				<label className="swap swap-rotate md:hidden">
					<input
						type="checkbox"
						checked={menuOpen}
						onChange={() => setMenuOpen(!menuOpen)}
					/>
					{/* Hamburger icon */}
					<svg
						className="swap-off w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
					{/* Close icon */}
					<svg
						className="swap-on w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</label>

				{/* Logout button */}
				<button
					onClick={handleLogout}
					className="inline-flex items-center rounded-md border border-current px-3 py-1.5 text-sm leading-none hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
					aria-label="Log Out"
				>
					<LogOut className="w-8 h-8 mr-2" />
					<span className="hidden md:inline">Log Out</span>
				</button>
			</div>

			{/* Mobile dropdown menu */}
			<div
				className={`absolute top-full left-0 w-full bg-tertiary md:hidden shadow-md z-50 overflow-hidden transition-all duration-300 ease-in-out ${
					menuOpen ? "max-h-96 p-4" : "max-h-0 p-0"
				}`}
			>
				<nav className="flex flex-col items-start gap-4">
					<NavLink to="/" onClick={() => setMenuOpen(false)}>
						Home
					</NavLink>
					<NavLink to="/toolsManagement" onClick={() => setMenuOpen(false)}>
						Tools Management
					</NavLink>
					<NavLink to="/materials" onClick={() => setMenuOpen(false)}>
						Materials Management
					</NavLink>
					<NavLink to="/projects" onClick={() => setMenuOpen(false)}>
						Project Management
					</NavLink>
				</nav>
			</div>
		</header>
	);
}
