import { useEffect, useState } from "react";
import { Headphones, UserPlus, Power, ExternalLink } from "lucide-react";
import { api, isOk } from "../../lib/api";
import { useToast } from "../../components/Toast";
import Spinner from "../../components/ui/Spinner";

export default function SupportAgents() {
  const toast = useToast();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const load = async () => { setLoading(true); const res = await api("get", "/support/agents"); setAgents(res?.data || []); setLoading(false); };
  useEffect(() => { load(); }, []);
  const submit = async (e) => { e.preventDefault(); setSaving(true); const res = await api("post", "/support/agents", form); setSaving(false); if (isOk(res)) { toast.success("Support account created. Invite the same email in Tawk.to."); setForm({ userName: "", email: "", password: "" }); load(); } else toast.error(res?.message || "Could not create support account"); };
  const toggle = async (agent) => { const res = await api("patch", `/support/agents/${agent.id}/status`, { active: !agent.active }); if (isOk(res)) { toast.success(res.message); load(); } else toast.error(res?.message || "Could not update agent"); };

  return <div className="space-y-6">
    <div><h1 className="font-display text-2xl font-700 text-sky-950">Customer support agents</h1><p className="text-sm text-sky-900/60">Create application accounts here, then invite the same email as an Agent in Tawk.to.</p></div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-700 text-sky-950">Support team</h2><a className="btn-ghost text-sm" href="https://dashboard.tawk.to" target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Tawk.to dashboard</a></div>
        {loading ? <div className="grid h-32 place-items-center"><Spinner className="h-7 w-7 text-ocean-600" /></div> : agents.length ? <div className="space-y-3">{agents.map(agent => <div key={agent.id} className="flex items-center gap-3 rounded-xl border border-ocean-100 p-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-ocean-100"><Headphones className="h-5 w-5 text-ocean-700" /></span><div className="min-w-0 flex-1"><p className="font-600 text-sky-950">{agent.userName}</p><p className="truncate text-xs text-sky-900/55">{agent.email}</p></div><button className={agent.active ? "btn-ghost text-xs" : "btn-primary text-xs"} onClick={() => toggle(agent)}><Power className="h-3.5 w-3.5" /> {agent.active ? "Disable" : "Enable"}</button></div>)}</div> : <p className="py-10 text-center text-sm text-sky-900/50">No support agents yet.</p>}
      </div>
      <form onSubmit={submit} className="card space-y-4 p-5"><div><h2 className="font-700 text-sky-950">Create support account</h2><p className="text-xs text-sky-900/55">Use the agent's real Tawk.to invitation email.</p></div><label className="block text-sm font-600 text-sky-900">Name<input className="input mt-1 w-full" required value={form.userName} onChange={e=>setForm({...form,userName:e.target.value})} /></label><label className="block text-sm font-600 text-sky-900">Email<input className="input mt-1 w-full" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></label><label className="block text-sm font-600 text-sky-900">Temporary password<input className="input mt-1 w-full" type="password" minLength="10" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></label><button disabled={saving} className="btn-primary w-full"><UserPlus className="h-4 w-4" /> {saving ? "Creating..." : "Create support agent"}</button></form>
    </div>
  </div>;
}