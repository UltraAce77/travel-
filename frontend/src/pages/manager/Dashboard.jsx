import { useState, useEffect } from "react";
import { Users, Wallet, Copy, Check, Share2 } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import DataTable, { EmptyState } from "../../components/ui/DataTable";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { money } from "../../lib/utils";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [me, setMe] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const [managers, users] = await Promise.all([
        api("get", "/manager/fetch"),
        api("get", "/user/fetch"),
      ]);
      const mine = (managers?.data || []).find((m) => m.id === user.id) || null;
      setMe(mine);
      setTeam((users?.data || []).filter((u) => u.ReferredByManager === user.userName));
      setLoading(false);
    })();
  }, [user.id, user.userName]);

  if (loading) {
    return (
      <div className="grid h-64 place-items-center">
        <Spinner className="h-8 w-8 text-ocean-600" />
      </div>
    );
  }

  const code = me?.referralCode;

  const columns = [
    {
      key: "user",
      header: "User",
      cell: (r) => (
        <div>
          <p className="font-600 text-sky-950">{r.UserName}</p>
          <p className="text-xs text-sky-900/50">{r.Email}</p>
        </div>
      ),
    },
    { key: "TotalBalance", header: "Balance", cell: (r) => <span className="text-sand-600">{money(r.TotalBalance)}</span> },
    { key: "Commission", header: "Commission", cell: (r) => <span className="text-ocean-600">{money(r.Commission)}</span> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-sky-900/60">Manager workspace</p>
        <h1 className="font-display text-2xl font-700 text-sky-950">{user.userName}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Team members" value={team.length} icon={Users} accent="iris" />
        <StatCard label="Team balance" value={money(me?.totalBalance)} icon={Wallet} accent="gold" />
        <div className="card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-sky-900/60">Referral code</p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 rounded-lg border border-ocean-300 bg-ocean-100 px-3 py-2 font-mono text-sm text-ocean-700">
              {code || "—"}
            </code>
            {code && (
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="btn-ghost px-3 py-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-sky-900/50">
            <Share2 className="h-3 w-3" /> Share to onboard new users
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-600 text-sky-950">Your team</h2>
        <DataTable
          columns={columns}
          rows={team}
          rowKey={(r) => r.id}
          empty={<EmptyState icon={Users} title="No team members yet" text="Share your referral code to onboard users." />}
        />
      </div>
    </div>
  );
}
