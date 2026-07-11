import { useState, useEffect, useCallback } from "react";
import { Check, X, Banknote, RefreshCw, Plus } from "lucide-react";
import DataTable, { EmptyState } from "../../components/ui/DataTable";
import Spinner from "../../components/ui/Spinner";
import AddFundsModal from "./AddFundsModal";
import { api, isOk } from "../../lib/api";
import { money, cn } from "../../lib/utils";
import { useToast } from "../../components/Toast";

const STATUS_STYLES = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  pending: "border-sand-200 bg-sand-50 text-sand-700",
};

export default function AdminFunds() {
  const toast = useToast();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api("get", "/funds/fetch");
    setFunds(Array.isArray(res?.data) ? res.data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (fundID, status) => {
    setBusyId(fundID);
    const res = await api("put", `/funds/update/${fundID}`, { status });
    setBusyId(null);
    if (isOk(res)) {
      toast.success(status === "approved" ? "Deposit approved & credited" : "Deposit rejected");
      load();
    } else {
      toast.error(res?.message || "Update failed");
    }
  };

  const columns = [
    {
      key: "user",
      header: "User",
      cell: (r) => (
        <div>
          <p className="font-600 text-sky-950">{r.userName || "—"}</p>
          <p className="text-xs text-sky-900/50">{r.email}</p>
        </div>
      ),
    },
    { key: "balance", header: "Amount", cell: (r) => <span className="font-600 text-sand-600">{money(r.balance)}</span> },
    { key: "created_at", header: "Date", cell: (r) => <span className="text-sky-900/60">{r.created_at}</span> },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <span className={cn("chip capitalize", STATUS_STYLES[r.status] || STATUS_STYLES.pending)}>{r.status}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (r) =>
        r.status === "pending" ? (
          <div className="flex justify-end gap-2">
            <button
              disabled={busyId === r.fundID}
              onClick={() => setStatus(r.fundID, "approved")}
              className="btn-primary px-3 py-1.5 text-xs"
            >
              {busyId === r.fundID ? <Spinner className="h-4 w-4" /> : <><Check className="h-3.5 w-3.5" /> Approve</>}
            </button>
            <button
              disabled={busyId === r.fundID}
              onClick={() => setStatus(r.fundID, "rejected")}
              className="btn-ghost px-3 py-1.5 text-xs"
            >
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-sky-900/35">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-sky-950">Deposits</h1>
          <p className="text-sm text-sky-900/60">Approve deposits to credit user balances.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add funds
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid h-48 place-items-center">
          <Spinner className="h-8 w-8 text-ocean-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={funds}
          rowKey={(r) => r.fundID}
          empty={<EmptyState icon={Banknote} title="No deposits yet" text="Deposits submitted by users will appear here for review." />}
        />
      )}

      <AddFundsModal open={addOpen} onClose={() => setAddOpen(false)} onDone={load} />
    </div>
  );
}
