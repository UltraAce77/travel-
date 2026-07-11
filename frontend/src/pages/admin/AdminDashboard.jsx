import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserCog, Map, Banknote, ArrowRight } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import { api } from "../../lib/api";
import { money } from "../../lib/utils";

export default function AdminDashboard() {
  const [state, setState] = useState({ users: [], managers: [], treks: [], funds: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [users, managers, treks, funds] = await Promise.all([
        api("get", "/user/fetch"),
        api("get", "/manager/fetch"),
        api("get", "/treks/getTreks"),
        api("get", "/funds/fetch"),
      ]);
      setState({
        users: users?.data || [],
        managers: managers?.data || [],
        treks: treks?.data || [],
        funds: funds?.data || [],
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid h-64 place-items-center">
        <Spinner className="h-8 w-8 text-ocean-600" />
      </div>
    );
  }

  const pending = state.funds.filter((f) => f.status === "pending");
  const pendingTotal = pending.reduce((s, f) => s + Number(f.balance || 0), 0);

  const links = [
    { to: "/admin/funds", label: "Review deposits", icon: Banknote },
    { to: "/admin/treks", label: "Manage treks", icon: Map },
    { to: "/admin/users", label: "View users", icon: Users },
    { to: "/admin/managers", label: "View managers", icon: UserCog },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-700 text-sky-950">Admin overview</h1>
        <p className="text-sm text-sky-900/60">Platform activity at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={state.users.length} icon={Users} accent="iris" />
        <StatCard label="Managers" value={state.managers.length} icon={UserCog} accent="gold" />
        <StatCard label="Treks" value={state.treks.length} icon={Map} accent="emerald" />
        <StatCard
          label="Pending deposits"
          value={pending.length}
          sub={pending.length ? `${money(pendingTotal)} awaiting review` : "All clear"}
          icon={Banknote}
          accent="slate"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="card group flex items-center justify-between gap-3 p-5 transition hover:border-ocean-300"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ocean-100 ring-1 ring-line">
                <l.icon className="h-5 w-5 text-ocean-600" />
              </span>
              <span className="text-sm font-600 text-sky-900">{l.label}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-sky-900/50 transition group-hover:translate-x-0.5 group-hover:text-ocean-600" />
          </Link>
        ))}
      </div>
    </div>
  );
}
