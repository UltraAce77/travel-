import { useState, useEffect } from "react";
import { UserCog, RefreshCw, Copy, Check } from "lucide-react";
import DataTable, { EmptyState } from "../../components/ui/DataTable";
import Spinner from "../../components/ui/Spinner";
import { api } from "../../lib/api";
import { money } from "../../lib/utils";

function CopyCode({ code }) {
  const [copied, setCopied] = useState(false);
  if (!code) return <span className="text-sky-900/35">—</span>;
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="chip cursor-pointer border-ocean-300 bg-ocean-100 font-mono text-ocean-700 transition hover:bg-ocean-100"
    >
      {code} {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export default function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api("get", "/manager/fetch");
    setManagers(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      key: "manager",
      header: "Manager",
      cell: (r) => (
        <div>
          <p className="font-600 text-sky-950">{r.userName}</p>
          <p className="text-xs text-sky-900/50">{r.email}</p>
        </div>
      ),
    },
    { key: "referralCode", header: "Referral code", cell: (r) => <CopyCode code={r.referralCode} /> },
    {
      key: "totalBalance",
      header: "Team balance",
      cell: (r) => <span className="text-sand-600">{money(r.totalBalance)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-sky-950">Managers</h1>
          <p className="text-sm text-sky-900/60">{managers.length} managers · share codes to onboard users.</p>
        </div>
        <button onClick={load} className="btn-ghost">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid h-48 place-items-center">
          <Spinner className="h-8 w-8 text-ocean-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={managers}
          rowKey={(r) => r.id}
          empty={<EmptyState icon={UserCog} title="No managers yet" />}
        />
      )}
    </div>
  );
}
