import { useState } from "react";
import { Lock, CheckCircle2, Coins, Sparkles, RefreshCw, Star } from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import Skeleton from "../../components/ui/Skeleton";

import { useUserData } from "../../hooks/useUserData";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { api, isOk } from "../../lib/api";
import { money, cn } from "../../lib/utils";
import { trekImage, fallbackOnImageError } from "../../lib/trekImage";

const GRADIENTS = [
  "from-iris-600/40 to-ink-800",
  "from-gold-600/40 to-ink-800",
  "from-emerald-600/30 to-ink-800",
  "from-sky-600/30 to-ink-800",
  "from-rose-600/30 to-ink-800",
];

function TrekCard({ trek, index, onComplete, busy, locked }) {
  const done = trek.status === "completed";
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const g = GRADIENTS[index % GRADIENTS.length];
  return (
    <div className={cn("card overflow-hidden transition", done && "opacity-60")}>
      <div className={cn("relative h-28 bg-gradient-to-br", g)}>
        <img
          src={trekImage(trek, index)} onError={fallbackOnImageError(index)}
          alt={trek.title} className="h-full w-full object-cover"
        />
        <span
          className={cn(
            "chip absolute right-2 top-2 backdrop-blur",
            done
              ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-200"
              : "border-sand-300 bg-white/70 text-sand-700"
          )}
        >
          {done ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-600 text-sky-950">{trek.title}</h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-sky-900/60">{money(trek.price)}</span>
          <span className="inline-flex items-center gap-1 font-600 text-sand-600">
            <Coins className="h-3.5 w-3.5" /> +{money(trek.commission)}
          </span>
        </div>
        <div className="mt-5">
          <p className="text-xs font-600 text-sky-900/70">Rate this trek <span className="text-rose-500">required</span></p>
          <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Trek rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                onClick={() => setRating(value)}
                className="cursor-pointer rounded-lg p-1 transition hover:bg-sand-50"
              >
                <Star className={cn("h-6 w-6 text-sand-400", rating >= value && "fill-sand-400")} />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-600 text-sky-900/70" htmlFor={`trek-note-${trek.assignmentID}`}>Description <span className="font-normal text-sky-900/45">optional</span></label>
          <textarea
            id={`trek-note-${trek.assignmentID}`}
            maxLength={1000}
            rows={3}
            className="input mt-2 resize-none"
            placeholder="Share anything about this trek..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <button
          type="button"
          disabled={done || busy || locked || rating === 0}
          onClick={() => onComplete(trek, { rating, description })}
          className={cn("mt-4 w-full", done ? "btn-ghost" : "btn-iris")}
        >
          {busy ? (
            <Spinner />
          ) : done ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Done
            </>
          ) : locked ? (
            <>
              <Lock className="h-3.5 w-3.5" /> Locked
            </>
          ) : (
            rating ? "Complete trek" : "Choose a rating"
          )}
        </button>
      </div>
    </div>
  );
}

export default function UserTreks() {
  const { user } = useAuth();
  const { record, treks, loading, reload } = useUserData();
  const toast = useToast();
  const [starting, setStarting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const balance = Number(record?.totalBalance ?? 0);
  const canStart = balance >= 100;
  const locked = balance <= 0;
  const total = treks?.length || 0;
  const done = treks?.filter((t) => t.status === "completed").length || 0;
  const currentTrek = treks?.find((trek) => trek.status === "pending") || null;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const startSet = async () => {
    setStarting(true);
    const res = await api("get", `/treks/initiate/${user.id}`);
    setStarting(false);
    if (isOk(res)) {
      toast.success("30 treks assigned — start completing them to earn");
      reload();
    } else {
      toast.error(res?.message || "Could not start a trek set");
    }
  };

  const complete = async (trek, review) => {
    if (locked) {
      toast.error("Your balance is depleted — deposit funds to continue");
      return;
    }
    setBusyId(trek.assignmentID);
    const res = await api("post", "/treks/approveTrek", {
      id: user.id,
      assignmentID: trek.assignmentID,
      rating: review.rating,
      description: review.description,
    });
    setBusyId(null);
    if (isOk(res)) {
      toast.success(`+${money(trek.commission)} commission earned`);
      reload();
    } else {
      toast.error(res?.message || "Could not complete this trek");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  // No active set
  if (total === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card p-8 text-center animate-fade-up">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-iris shadow-glow">
            <Sparkles className="h-7 w-7 text-ink-950" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-700 text-sky-950">Start a new trek set</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-sky-900/60">
            You'll be assigned 30 curated treks. Complete each one to earn commission. A minimum
            balance of <span className="font-600 text-sand-600">$100</span> is required to begin.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <span className="text-sky-900/60">Your balance:</span>
            <span className={cn("font-600", canStart ? "text-emerald-600" : "text-rose-600")}>
              {money(balance)}
            </span>
          </div>

          {canStart ? (
            <button onClick={startSet} disabled={starting} className="btn-primary mt-6 w-full sm:w-auto sm:px-10">
              {starting ? <Spinner /> : "Assign my treks"}
            </button>
          ) : (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <Lock className="h-4 w-4" /> Deposit at least {money(100 - balance)} more to unlock.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active set
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-sky-950">My treks</h1>
          <p className="text-sm text-sky-900/60">
            {done} of {total} completed · {pct}% · balance{" "}
            <span className={cn("font-600", locked ? "text-rose-600" : "text-sand-600")}>
              {money(balance)}
            </span>
          </p>
        </div>
        <button onClick={reload} className="btn-ghost">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-ocean-100">
        <div className="h-full rounded-full bg-gold-iris transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {locked && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
            <div>
              <p className="font-600">Your balance is depleted.</p>
              <p className="text-rose-700/80">
                You can't complete any more treks until you deposit funds to restore a positive
                balance.
              </p>
            </div>
          </div>
      
        </div>
      )}

      <div className="mx-auto grid max-w-md gap-4">
        {currentTrek && (
          <TrekCard
            key={currentTrek.assignmentID}
            trek={currentTrek}
            index={done}
            onComplete={complete}
            busy={busyId === currentTrek.assignmentID}
            locked={locked}
          />
        )}
      </div>
    </div>
  );
}
