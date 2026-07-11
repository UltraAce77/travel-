import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { api, isOk } from "../../lib/api";
import { useToast } from "../../components/Toast";

export default function AddFundsModal({ open, onClose, onDone }) {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [userID, setUserID] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await api("get", "/user/fetch");
      setUsers(res?.data || []);
    })();
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    if (!userID) return toast.error("Select a user");
    if (!amount || Number(amount) <= 0) return toast.error("Enter an amount");
    setBusy(true);
    const res = await api("post", "/funds/add", { userID: Number(userID), amount: Number(amount) });
    setBusy(false);
    if (isOk(res)) {
      toast.success("Funds added (pending approval)");
      setUserID("");
      setAmount("");
      onDone?.();
      onClose();
    } else {
      toast.error(res?.message || "Failed to add funds");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add funds to a user">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="af-user">User</label>
          <select
            id="af-user"
            className="input"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          >
            <option value="">Select a user…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.UserName} — {u.Email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="af-amt">Amount (USD)</label>
          <input
            id="af-amt"
            type="number"
            step="any"
            className="input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? <Spinner /> : "Add funds"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
