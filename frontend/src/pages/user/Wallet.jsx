import { useState, useEffect } from "react";
import { Wallet as WalletIcon, Save, Copy, Check } from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import { useUserData } from "../../hooks/useUserData";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { api, isOk } from "../../lib/api";
import { shortAddr } from "../../lib/utils";

export default function Wallet() {
  const { user } = useAuth();
  const { record, loading, reload } = useUserData();
  const toast = useToast();
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (record?.cryptoAddress) setAddress(record.cryptoAddress);
  }, [record?.cryptoAddress]);

  const save = async (e) => {
    e.preventDefault();
    if (!address.trim()) return toast.error("Enter a wallet address");
    setBusy(true);
    const res = await api("put", "/user/addWallet", { userID: user.id, cryptoAddress: address.trim() });
    setBusy(false);
    if (isOk(res)) {
      toast.success("Wallet address saved");
      reload();
    } else {
      toast.error(res?.message || "Could not save wallet");
    }
  };

  const copy = async () => {
    if (!record?.cryptoAddress) return;
    await navigator.clipboard.writeText(record.cryptoAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
        <h1 className="font-display text-2xl font-700 text-sky-950">Crypto wallet</h1>
        <p className="text-sm text-sky-900/60">Where your withdrawals are sent.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="bg-gold-iris p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-600 text-ink-950">
              <WalletIcon className="h-4 w-4" /> Saved address
            </span>
            {record?.cryptoAddress && (
              <button
                onClick={copy}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink-950/20 px-2.5 py-1 text-xs font-600 text-ink-950 transition hover:bg-ink-950/30"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <p className="mt-3 break-all font-mono text-sm text-ink-950/90">
            {record?.cryptoAddress ? shortAddr(record.cryptoAddress) : "No wallet linked yet"}
          </p>
        </div>

        <form onSubmit={save} className="space-y-4 p-5">
          <div>
            <label className="label" htmlFor="addr">Wallet address</label>
            <input
              id="addr"
              className="input font-mono text-sm"
              placeholder="0x… / BTC / USDT (TRC20) address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button type="submit" disabled={busy} className="btn-iris w-full">
            {busy ? <Spinner /> : <><Save className="h-4 w-4" /> Save wallet</>}
          </button>
        </form>
      </div>
    </div>
  );
}
