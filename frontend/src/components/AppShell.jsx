import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet as WalletIcon,
  Users,
  UserCog,
  Banknote,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { cn, money, initials } from "../lib/utils";

const NAV = {
  user: [
    { to: "/app", end: true, label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/treks", label: "My Treks", icon: Map },
    { to: "/app/deposit", label: "Deposit", icon: ArrowDownToLine },
    { to: "/app/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
    { to: "/app/wallet", label: "Wallet", icon: WalletIcon },
  ],
  admin: [
    { to: "/admin", end: true, label: "Overview", icon: LayoutDashboard },
    { to: "/admin/funds", label: "Deposits", icon: Banknote },
    { to: "/admin/treks", label: "Treks", icon: Map },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/managers", label: "Managers", icon: UserCog },
  ],
  manager: [{ to: "/manager", end: true, label: "Dashboard", icon: LayoutDashboard }],
};

export default function AppShell() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = NAV[role] || [];

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const SideContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-ocean-100 text-ocean-900 ring-1 ring-ocean-200"
                  : "text-sky-900/58 hover:bg-ocean-50 hover:text-ocean-900"
              )
            }
          >
            <it.icon className="h-[18px] w-[18px]" />
            {it.label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-2xl border border-ocean-100 bg-white/80 p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-iris font-display text-sm font-700 text-white">
            {initials(user?.userName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-700 text-sky-950">{user?.userName}</p>
            <p className="truncate text-xs capitalize text-sky-900/50">{role}</p>
          </div>
          <button
            onClick={onLogout}
            className="cursor-pointer rounded-lg p-2 text-sky-900/45 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label="Log out"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ocean-50 lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-ocean-100 bg-white/78 backdrop-blur-xl lg:block">
        <SideContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-sky-950/25 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-ocean-100 bg-white">
            <SideContent />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ocean-100 bg-white/82 px-4 py-3 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer rounded-lg p-2 text-sky-900 hover:bg-ocean-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="ml-auto flex items-center gap-3">
            {role === "user" && (
              <div className="chip border-sand-200 bg-sand-50 text-sand-700">
                <span className="text-sky-900/45">Balance</span>
                <span className="font-700 text-sand-600">{money(user?.totalBalance)}</span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="hidden cursor-pointer items-center gap-2 rounded-full border border-ocean-200 bg-white px-3 py-1.5 text-sm font-600 text-sky-900/65 transition hover:bg-ocean-50 sm:inline-flex"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
