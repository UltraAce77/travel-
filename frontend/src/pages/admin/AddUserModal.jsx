import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/Toast";
import { api, isOk } from "../../lib/api";

const EMPTY_FORM = {
  userName: "",
  email: "",
  password: "",
  withdrawCode: "",
  managerID: "",
  initialBalance: "0",
};

export default function AddUserModal({ open, onClose, onDone }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [managers, setManagers] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    api("get", "/manager/fetch").then((res) => setManagers(res?.data || []));
  }, [open]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    const res = await api("post", "/user/create", {
      ...form,
      initialBalance: Number(form.initialBalance || 0),
      managerID: form.managerID || null,
    });
    setBusy(false);
    if (!isOk(res)) return toast.error(res?.message || "Could not create user");
    toast.success("User created successfully");
    setForm(EMPTY_FORM);
    onDone?.();
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add user">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="new-user-name">Username</label>
          <input id="new-user-name" required className="input" value={form.userName} onChange={update("userName")} />
        </div>
        <div>
          <label className="label" htmlFor="new-user-email">Email</label>
          <input id="new-user-email" type="email" required className="input" value={form.email} onChange={update("email")} />
        </div>
        <div>
          <label className="label" htmlFor="new-user-password">Temporary password</label>
          <input id="new-user-password" type="password" minLength="8" required className="input" value={form.password} onChange={update("password")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="new-user-balance">Initial balance</label>
            <input id="new-user-balance" type="number" min="0" step="0.01" className="input" value={form.initialBalance} onChange={update("initialBalance")} />
          </div>
          <div>
            <label className="label" htmlFor="new-user-withdraw">Withdraw code</label>
            <input id="new-user-withdraw" className="input" value={form.withdrawCode} onChange={update("withdrawCode")} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="new-user-manager">Manager (optional)</label>
          <select id="new-user-manager" className="input" value={form.managerID} onChange={update("managerID")}>
            <option value="">No manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>{manager.userName}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? <Spinner /> : <><UserPlus className="h-4 w-4" /> Create user</>}
        </button>
      </form>
    </Modal>
  );
}
