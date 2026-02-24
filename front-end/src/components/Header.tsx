import { NavLink } from "react-router";
import { Logo } from "./Logo";
import { LogOut } from "lucide-react";

export default function Header() {

  return (
    <header className="navbar bg-tertiary shadow-sm px-6">
      {/* LEFT: Logo */}
      <div className="navbar-start">
        <NavLink to="/" className="flex items-center">
          <Logo size="md" />
        </NavLink>
      </div>

      {/* CENTER: Links */}
      <div className="navbar-center hidden md:flex">
        <nav className="flex items-center gap-6">
            <NavLink to="/" className="whitespace-nowrap">
              Home
            </NavLink>

            <NavLink to="/" className="whitespace-nowrap">
              Tools Management
            </NavLink>

            <NavLink to="/" className="whitespace-nowrap">
              Materials Management
            </NavLink>

            <NavLink to="/" className="whitespace-nowrap">
              Project Management
            </NavLink>
        </nav>
      </div>

      {/* RIGHT: User Logout */}
      <div className="navbar-end">
        <button
          className="btn btn-sm btn-outline"
        >
          <LogOut className="w-8 h-8 mr-2" />
        </button>
      </div>
    </header>
  );
}
