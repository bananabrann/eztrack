import { NavLink } from "react-router";
import { Logo } from "./Logo";
import { LogOut } from "lucide-react";

export default function Header() {
	return (
		<header className="bg-tertiary shadow-sm px-6">
			<div className="mx-auto flex min-h-16 w-full items-center justify-between gap-4">
			{/* LEFT: Logo */}
			<div className="flex shrink-0 items-center">
				<NavLink
					to="/"
					className="flex items-center"
					aria-label="Go to Home Page"
				>
					<Logo size="sm" />
				</NavLink>
			</div>

			{/* CENTER: Links */}
			<div className="hidden flex-1 justify-center md:flex">
				<nav className="flex items-center gap-6">
					<NavLink
						to="/"
						className="whitespace-nowrap"
						aria-label="Go to Home Page"
					>
						Home
					</NavLink>
					<NavLink
						to="/"
						className="whitespace-nowrap"
						aria-label="Go to Tools Management"
					>
						Tools Management
					</NavLink>
					<NavLink
						to="/"
						className="whitespace-nowrap"
						aria-label="Go to Materials Management"
					>
						Materials Management
					</NavLink>
					<NavLink
						to="/"
						className="whitespace-nowrap"
						aria-label="Go to Project Management"
					>
						Project Management
					</NavLink>
				</nav>
			</div>

			{/* RIGHT: User Logout */}
			<div className="flex shrink-0 items-center">
				<button
					className="inline-flex items-center rounded-md border border-current px-3 py-1.5 text-sm leading-none hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
					aria-label="Log Out"
				>
					<LogOut className="w-8 h-8 mr-2" />
				</button>
			</div>
			</div>
		</header>
	);
}
