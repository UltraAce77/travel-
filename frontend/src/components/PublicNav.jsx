import { Link, NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { cn } from "../lib/utils";

export default function PublicNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/82 px-4 py-3 shadow-card backdrop-blur-xl sm:px-5">
        <Link to="/" aria-label="Travel Leaders home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About us" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-600 transition-colors",
                  isActive ? "bg-ocean-100 text-ocean-900" : "text-sky-900/65 hover:bg-ocean-50 hover:text-ocean-900"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/login" className="btn-primary rounded-full px-4 py-2">
          Member login <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
