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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-40 transition-all duration-300", solid ? "border-b border-ocean-100 bg-white/85 shadow-sm backdrop-blur-md" : "bg-transparent")}>
        <nav className="container-x flex h-16 items-center justify-between sm:h-20">
          <Link to="/" aria-label="Travel Leaders home"><Logo dark={!solid} /></Link>
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => cn("text-sm font-medium transition-colors", solid ? "text-sky-900/70 hover:text-ocean-700" : "text-white/85 hover:text-white", isActive && (solid ? "text-ocean-700" : "text-white"))}>{link.label}</NavLink>)}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className={cn("text-sm font-semibold transition-colors", solid ? "text-sky-900 hover:text-ocean-700" : "text-white hover:text-white/80")}>Sign in</Link>
            <Link to="/login" className="btn-primary">Get started</Link>
          </div>
          <button onClick={() => setOpen(true)} className={cn("rounded-lg p-2 md:hidden", solid ? "text-sky-900" : "text-white")} aria-label="Open menu" aria-expanded={open}><Menu className="h-6 w-6" /></button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button className="absolute inset-0 h-full w-full bg-sky-950/55 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="absolute right-0 top-0 flex h-[100dvh] w-[min(86vw,22rem)] flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><Logo /><button onClick={() => setOpen(false)} className="rounded-lg p-2 text-sky-900 hover:bg-ocean-50" aria-label="Close menu"><X className="h-6 w-6" /></button></div>
            <nav className="mt-10 flex flex-col gap-2">
              {LINKS.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className={({ isActive }) => cn("rounded-xl px-4 py-3 text-base font-600 transition", isActive ? "bg-ocean-100 text-ocean-800" : "text-sky-900 hover:bg-ocean-50")}>{link.label}</NavLink>)}
            </nav>
            <div className="mt-auto space-y-3 border-t border-ocean-100 pt-6">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost w-full justify-center">Sign in</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">Get started</Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}