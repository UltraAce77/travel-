import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Layers,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Skeleton from "../../components/ui/Skeleton";

import TravelScene from "../../components/TravelScene";
import { useUserData } from "../../hooks/useUserData";
import { api } from "../../lib/api";
import { money } from "../../lib/utils";

const PARTNERS = [
  { name: "AeroTrust", icon: Plane },
  { name: "GlobeStay", icon: MapPin },
  { name: "SecurePay", icon: ShieldCheck },
  { name: "Verified+", icon: BadgeCheck },
];

const SCENES = ["coast", "island", "sunset", "alpine"];

export default function UserDashboard() {
  const { record, treks, loading } = useUserData();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api("get", "/treks/getTreks");
      setDestinations((res?.data || []).slice(0, 8));
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-60 w-full rounded-[2rem]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const total = treks?.length || 0;
  const done = treks?.filter((t) => t.status === "completed").length || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] p-8 shadow-card sm:p-10">
        <TravelScene variant="coast" className="absolute inset-0" label="Ocean coastline travel scene" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/78 via-sky-950/28 to-transparent" />
        <div className="relative max-w-xl text-gray-950">
          <p className="text-sm font-700 uppercase tracking-[0.2em] text-sand-200">Elevate your travel journey</p>
          <h1 className="mt-3 font-display text-4xl font-700 leading-tight sm:text-5xl">
            Travel with care, explore with confidence.
          </h1>
          <p className="mt-4 leading-7 text-white/82">
            Curated journeys to global destinations, member rewards, and a private wallet experience.
          </p>
          <button onClick={() => navigate("/app/treks")} className="btn-primary mt-6 rounded-full px-6">
            {total > 0 ? "Continue treks" : "Start a trek set"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Balance" value={money(record?.totalBalance)} icon={Wallet} accent="gold" />
        <StatCard label="Commission earned" value={money(record?.commission)} icon={TrendingUp} accent="iris" />
        <StatCard label="Treks completed" value={record?.completedTreks ?? 0} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Travel sets" value={record?.completedTravel ?? 0} icon={Layers} accent="slate" />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-ocean-100 p-5">
          <h2 className="text-lg font-800 text-sky-950">Current trek set</h2>
        </div>
        {total > 0 ? (
          <div className="p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-sky-900/58">{done} of {total} completed</span>
              <span className="font-800 text-sand-600">{pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-ocean-100">
              <div className="h-full rounded-full bg-gold-iris transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <button onClick={() => navigate("/app/treks")} className="btn-ghost mt-5 rounded-full">
              Open trek board <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ocean-100 text-ocean-700">
              <Sparkles className="h-7 w-7" />
            </span>
            <p className="max-w-sm text-sm leading-6 text-sky-900/62">
              You need a balance of at least <span className="font-800 text-sand-600">$100</span> to begin a set of 30 treks.
            </p>
            <button onClick={() => navigate("/app/treks")} className="btn-primary mt-1 rounded-full">
              Start a trek set <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {destinations.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-800 text-sky-950">Popular destinations</h2>
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {destinations.map((d, i) => (
              <div key={d.trekID} className="w-60 shrink-0 overflow-hidden rounded-3xl bg-white shadow-card">
                <div className="relative h-36">
                  {d.picture ? (
                    <img src={`data:image/jpeg;base64,${d.picture}`} alt={d.title} className="h-full w-full object-cover" />
                  ) : (
                    <TravelScene variant={SCENES[i % SCENES.length]} label={d.title} className="absolute inset-0" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/65 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="line-clamp-1 text-sm font-800 text-sky-950">{d.title}</p>
                  <p className="mt-1 text-xs font-700 text-sand-600">from {money(d.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-800 text-sky-950">Trusted partners</h2>
        <div className="card flex flex-wrap items-center justify-around gap-4 p-5">
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex items-center gap-2 text-sky-900/58">
              <p.icon className="h-5 w-5 text-ocean-600" />
              <span className="font-800">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}
