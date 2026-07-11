import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { api, isOk } from "../../lib/api";
import { useToast } from "../../components/Toast";

export default function EditUserModal({ user, open, onClose, onDone }) {
  const toast = useToast();
  const [form, setForm] = useState({ userName: "", email: "", referralCode: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        userName: user.UserName || "",
        email: user.Email || "",
        referralCode: user.referralCode || "",
        password: "",
      });
    }
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      userName: form.userName,
      email: form.email,
      referralCode: form.referralCode,
    };
    if (form.password) payload.password = form.password;
    const res = await api("put", `/user/update/${user.id}`, payload);
    setBusy(false);
    if (isOk(res)) {
      toast.success("User updated");
      onDone?.();
      onClose();
    } else {
      toast.error(res?.message || "Update failed");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Edit · ${user?.UserName || ""}`}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="eu-name">Username</label>
          <input id="eu-name" className="input" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="eu-email">Email</label>
          <input id="eu-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="eu-ref">Referral code</label>
          <input id="eu-ref" className="input" value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="eu-pw">New password <span className="lowercase text-sky-900/50">(blank = keep)</span></label>
          <input id="eu-pw" type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={busy} className="btn-iris">
            {busy ? <Spinner /> : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
