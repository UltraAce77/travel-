import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../Logo";
import { cn } from "../../lib/utils";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
];

export default function PublicNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "border-b border-ocean-100 bg-white/85 shadow-sm backdrop-blur-md" : "bg-transparent"
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between sm:h-20">
        <Link to="/" aria-label="Travel Leaders home">
          <Logo dark={!solid} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors",
                  solid ? "text-sky-900/70 hover:text-ocean-700" : "text-white/85 hover:text-white",
                  isActive && (solid ? "text-ocean-700" : "text-white")
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className={cn(
              "text-sm font-semibold transition-colors",
              solid ? "text-sky-900 hover:text-ocean-700" : "text-white hover:text-white/80"
            )}
          >
            Sign in
          </Link>
          <Link to="/login" className="btn-primary">
            Get started
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          className={cn("md:hidden", solid ? "text-sky-900" : "text-white")}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-sky-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6 text-sky-900" />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-sky-900"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost mt-2">
                Sign in
              </Link>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary">
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
