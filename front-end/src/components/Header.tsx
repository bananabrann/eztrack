import { NavLink } from "react-router";
import { Logo } from "./Logo";
import { LogOut } from "lucide-react";

export default function Header() {
	return (
		<header className="navbar bg-tertiary shadow-sm px-6">
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

			{/* CENTER: Links */}
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
						to="/tools"
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

			{/* RIGHT: User Logout */}
			<div className="navbar-end">
				<button
					className="inline-flex items-center rounded-md border border-current px-3 py-1.5 text-sm leading-none hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
					aria-label="Log Out"
				>
					<LogOut className="w-8 h-8 mr-2" />
				</button>
			</div>
		</header>
	);
}
