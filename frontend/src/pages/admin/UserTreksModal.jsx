import { useState, useEffect, useCallback } from "react";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";

import { api, isOk } from "../../lib/api";
import { money, cn } from "../../lib/utils";
import { useToast } from "../../components/Toast";

/**
 * Operator tool: view a user's assigned treks and edit the price of upcoming
 * (non-current) pending treks. Mirrors the original `treks/updatePrice` flow,
 * where commission is auto-set to 20% of the price.
 */
export default function UserTreksModal({ user, open, onClose }) {
  const toast = useToast();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await api("get", `/treks/records/${user.id}`);
    const rows = Array.isArray(res?.data) ? res.data : [];
    setTreks(rows);
    const seed = {};
    rows.forEach((t) => (seed[t.assignmentID] = t.price));
    setEdit(seed);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const firstPendingId = treks.find((t) => t.status === "pending")?.assignmentID;

  const save = async (assignmentID) => {
    const price = parseFloat(edit[assignmentID]);
    if (!price || price <= 0) return toast.error("Enter a valid price");
    setSavingId(assignmentID);
    const res = await api("put", "/treks/updatePrice", {
      id: user.id,
      assignmentID,
      price,
      commission: +(price * 0.2).toFixed(2),
    });
    setSavingId(null);
    if (isOk(res)) {
      toast.success("Trek price updated");
      load();
    } else {
      toast.error(res?.message || "Update failed");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Rig treks · ${user?.UserName || ""}`} className="max-w-2xl">
   

      {loading ? (
        <div className="grid h-32 place-items-center">
          <Spinner className="h-7 w-7 text-ocean-600" />
        </div>
      ) : treks.length === 0 ? (
        <p className="py-8 text-center text-sm text-sky-900/50">No treks assigned to this user.</p>
      ) : (
        <div className="max-h-[55vh] overflow-x-auto overflow-y-auto pr-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-sky-900/50">
                <th className="px-2 py-2 font-medium">Trek</th>
                <th className="px-2 py-2 font-medium">Price</th>
                <th className="px-2 py-2 font-medium">Commission</th>
                <th className="px-2 py-2 font-medium">Status</th>
                <th className="px-2 py-2 font-medium">Rating</th>
                <th className="px-2 py-2 font-medium">Description</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {treks.map((t) => {
                const editable = !t.archived && t.status === "pending" && t.assignmentID !== firstPendingId;
                const previewComm = +(parseFloat(edit[t.assignmentID] || 0) * 0.2).toFixed(2);
                return (
                  <tr key={t.assignmentID} className="border-t border-line/60">
                    <td className="px-2 py-2 text-sky-900">{t.title}</td>
                    <td className="px-2 py-2">
                      {editable ? (
                        <input
                          type="number"
                          step="any"
                          className="input h-9 w-24 px-2 py-1"
                          value={edit[t.assignmentID] ?? ""}
                          onChange={(e) => setEdit((p) => ({ ...p, [t.assignmentID]: e.target.value }))}
                        />
                      ) : (
                        <span className="text-sky-900/60">{money(t.price)}</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-sand-600">
                      {editable ? money(previewComm) : money(t.commission)}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={cn(
                          "chip capitalize",
                          t.status === "completed"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-sand-200 bg-sand-50 text-sand-600"
                        )}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 font-600 text-sand-600">
                      {t.rating ? `${t.rating}/5` : <span className="text-sky-900/30">Not rated</span>}
                    </td>
                    <td className="max-w-52 px-2 py-2 text-xs text-sky-900/60">
                      <span className="line-clamp-2">{t.description || "No description"}</span>
                    </td>
                    <td className="px-2 py-2 text-right">
                      {editable ? (
                        <button
                          onClick={() => save(t.assignmentID)}
                          disabled={savingId === t.assignmentID}
                          className="btn-iris px-3 py-1.5 text-xs"
                        >
                          {savingId === t.assignmentID ? <Spinner className="h-4 w-4" /> : "Update"}
                        </button>
                      ) : (
                        <span className="text-xs text-sky-900/35">
                          {t.status === "completed" ? "Completed" : "Locked"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
