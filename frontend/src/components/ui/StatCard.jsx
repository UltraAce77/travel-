import { cn } from "../../lib/utils";

const ACCENTS = {
  gold: "text-sand-600 bg-sand-100 ring-sand-200",
  iris: "text-ocean-700 bg-ocean-100 ring-ocean-200",
  emerald: "text-emerald-700 bg-emerald-50 ring-emerald-100",
  slate: "text-sky-800 bg-sky-50 ring-sky-100",
};

export default function StatCard({ label, value, icon: Icon, accent = "gold", sub, className }) {
  return (
    <div className={cn("card p-5 animate-fade-up", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-700 uppercase tracking-wider text-sky-900/50">{label}</p>
          <p className="mt-2 truncate font-display text-2xl font-700 text-sky-950">{value}</p>
          {sub && <p className="mt-1 text-xs text-sky-900/50">{sub}</p>}
        </div>
        {Icon && (
          <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1", ACCENTS[accent])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
