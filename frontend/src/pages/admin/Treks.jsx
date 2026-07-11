import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, MapPin, Coins, RefreshCw, Upload } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/DataTable";
import { api, http, isOk } from "../../lib/api";
import { money, cn } from "../../lib/utils";
import { useToast } from "../../components/Toast";

const GRADIENTS = [
  "from-iris-600/40 to-ink-800",
  "from-gold-600/40 to-ink-800",
  "from-emerald-600/30 to-ink-800",
  "from-sky-600/30 to-ink-800",
];

export default function AdminTreks() {
  const toast = useToast();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", commission: "", file: null });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api("get", "/treks/getTreks");
    setTreks(res?.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.commission) return toast.error("Fill all fields");
    if (!form.file) return toast.error("A JPG image is required");
    setBusy(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("price", form.price);
    fd.append("commission", form.commission);
    fd.append("picture", form.file);
    try {
      const res = await http.post("/treks/upload", fd, { headers: { "Content-Type": undefined } });
      if (isOk(res.data)) {
        toast.success("Trek added");
        setOpen(false);
        setForm({ title: "", price: "", commission: "", file: null });
        load();
      } else {
        toast.error(res.data?.message || "Upload failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (trekID) => {
    setBusyId(trekID);
    const res = await api("delete", `/treks/delete/${trekID}`);
    setBusyId(null);
    if (isOk(res)) {
      toast.success("Trek deleted");
      setTreks((t) => t.filter((x) => x.trekID !== trekID));
    } else {
      toast.error(res?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-sky-950">Treks</h1>
          <p className="text-sm text-sky-900/60">{treks.length} destinations in the catalog.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add trek
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid h-48 place-items-center">
          <Spinner className="h-8 w-8 text-ocean-600" />
        </div>
      ) : treks.length === 0 ? (
        <EmptyState icon={MapPin} title="No treks yet" text="Add your first destination to the catalog." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {treks.map((t) => (
            <div key={t.trekID} className="card overflow-hidden">
              <div className={cn("relative h-24 bg-gradient-to-br", GRADIENTS[t.trekID % GRADIENTS.length])}>
                {t.picture ? (
                  <img src={`data:image/jpeg;base64,${t.picture}`} alt={t.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <MapPin className="h-6 w-6 text-white/40" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-sm font-600 text-sky-950">{t.title}</h3>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-sky-900/60">{money(t.price)}</span>
                  <span className="inline-flex items-center gap-1 text-sand-600">
                    <Coins className="h-3.5 w-3.5" /> {money(t.commission)}
                  </span>
                </div>
                <button
                  onClick={() => remove(t.trekID)}
                  disabled={busyId === t.trekID}
                  className="btn-ghost mt-3 w-full text-rose-600 hover:bg-rose-50"
                >
                  {busyId === t.trekID ? <Spinner className="h-4 w-4" /> : <><Trash2 className="h-3.5 w-3.5" /> Delete</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add a trek">
        <form onSubmit={create} className="space-y-4">
          <div>
            <label className="label" htmlFor="t-title">Title</label>
            <input id="t-title" className="input" placeholder="Bali Tropical Beach Twilight"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="t-price">Price (USD)</label>
              <input id="t-price" type="number" step="any" className="input" placeholder="75"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="t-comm">Commission (USD)</label>
              <input id="t-comm" type="number" step="any" className="input" placeholder="0.60"
                value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Image (JPG)</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line bg-white/75 px-4 py-3 text-sm text-sky-900/60 transition hover:border-iris-500/40">
              <Upload className="h-4 w-4" />
              {form.file ? form.file.name : "Choose a .jpg file"}
              <input type="file" accept="image/jpeg,image/jpg" className="hidden"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} />
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? <Spinner /> : "Add trek"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
