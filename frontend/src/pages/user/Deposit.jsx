import { useState } from "react";
import { ArrowDownToLine, Info } from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { api, isOk } from "../../lib/api";
import { money, cn } from "../../lib/utils";

const PRESETS = [50, 100, 250, 500];

export default function Deposit() {
  const { user } = useAuth();
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value < 10) return toast.error("Deposit request must be $10 or more");
    setBusy(true);
    const res = await api("post", "/funds/add", { userID: user.id, amount: value });
    setBusy(false);
    if (isOk(res)) {
      toast.success("Deposit submitted — pending admin approval");
      setAmount("");
    } else {
      toast.error(res?.message || "Deposit failed");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 text-sky-950">Deposit funds</h1>
        <p className="text-sm text-sky-900/60">Add balance to unlock and complete trek sets.</p>
      </div>

      <form onSubmit={submit} className="card space-y-5 p-6">
        <div>
          <label className="label" htmlFor="amt">Amount (USD) — minimum $10</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-900/50">$</span>
            <input
              id="amt"
              type="number"
              min="1"
              step="any"
              className="input pl-8 text-lg"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={cn(
                "cursor-pointer rounded-xl border px-2 py-2 text-sm font-600 transition",
                Number(amount) === p
                  ? "border-sand-300 bg-sand-50 text-sand-700"
                  : "border-line bg-white/75 text-sky-900/60 hover:text-sky-900"
              )}
            >
              {money(p)}
            </button>
          ))}
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? <Spinner /> : <><ArrowDownToLine className="h-4 w-4" /> Submit deposit</>}
        </button>

        <div className="flex items-start gap-2.5 rounded-xl border border-iris-500/20 bg-ocean-50 p-3 text-xs text-sky-900/60">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" />
          Deposits are reviewed by an administrator before they're credited to your balance. You'll
          see your balance update once approved.
        </div>
      </form>
    </div>
  );
}
