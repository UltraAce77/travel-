import { useState } from "react";
import { ArrowUpFromLine, Lock, Clock, Wallet as WalletIcon } from "lucide-react";
import Spinner from "../../components/ui/Spinner";

import { useUserData } from "../../hooks/useUserData";
import { useToast } from "../../components/Toast";
import { money } from "../../lib/utils";

// Fixed platform payout address (operator-controlled) — straight from the original app.
const PLATFORM_WALLET = "0xDE3a7d87Bd3E55F820D6Fd9e1fEc1b5479B481e7";

export default function Withdraw() {
  const { record, loading } = useUserData();
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Faithful to the original: the amount you can actually withdraw is always $0.00,
  // even though the dashboard shows a balance and "rewards".
  const withdrawable = 0;
  const balance = Number(record?.totalBalance ?? 0);
  const rewards = Number(record?.commission ?? 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount");
    if (!password) return toast.error("Enter your withdrawal password");
    setBusy(true);
    // No withdrawal endpoint exists — the request simply hangs in "processing" forever.
    await new Promise((r) => setTimeout(r, 800));
    setBusy(false);
    setSubmitted(true);
    setAmount("");
    setPassword("");
  };

  if (loading) {
    return (
      <div className="grid h-64 place-items-center">
        <Spinner className="h-8 w-8 text-ocean-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 text-sky-950">Withdraw</h1>
        <p className="text-sm text-sky-900/60">Transfer your rewards to your crypto wallet.</p>
      </div>

      <div className="card space-y-5 p-6">
        {/* Processing promise */}
        <div className="flex items-center gap-2 rounded-xl border border-gold-500/20 bg-sand-50 px-3 py-2.5 text-xs text-sand-700/90">
          <Clock className="h-4 w-4 shrink-0 text-sand-500" />
          Please be patient — your withdrawal will be processed within one hour.
        </div>

        {/* Withdrawable balance — always $0.00 */}
        <div className="rounded-xl bg-ocean-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sky-900/60">Available to withdraw</span>
            <span className="font-display text-2xl font-700 text-sky-950">{money(withdrawable)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-sky-900/50">
            <span>Account balance {money(balance)}</span>
            <span>Rewards {money(rewards)}</span>
          </div>
        </div>

        {/* Withdrawal method */}
        <div>
          <p className="label">Withdrawal method</p>
          <div className="rounded-xl border border-line bg-white/75 p-3">
            <div className="flex items-center gap-2 text-sm font-600 text-sky-900">
              <WalletIcon className="h-4 w-4 text-ocean-600" /> Transfer to Crypto Wallet
              <span className="chip ml-auto border-ocean-300 bg-ocean-100 text-ocean-700">ERC20</span>
            </div>
            <p className="mt-2 break-all font-mono text-xs text-sand-600">{PLATFORM_WALLET}</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="wamt">Amount</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-900/50">$</span>
              <input
                id="wamt"
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
          <div>
            <label className="label" htmlFor="wpw">Withdrawal password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-900/50" />
              <input
                id="wpw"
                type="password"
                className="input pl-10"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <Spinner /> : <><ArrowUpFromLine className="h-4 w-4" /> Submit</>}
          </button>
        </form>

        {submitted && (
          <div className="flex items-center gap-2 rounded-xl border border-iris-500/25 bg-ocean-50 px-3 py-2.5 text-xs text-sky-900/80">
            <Spinner className="h-4 w-4 text-ocean-600" />
            Your withdrawal is processing. This can take up to an hour — please check back later.
          </div>
        )}

      </div>
    </div>
  );
}
