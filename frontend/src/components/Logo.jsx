import { cn } from "../lib/utils";

// Original stylised gull-in-flight mark for Travel Leaders.
const BIRD =
  "M50 52C45 43 39 34 32 29C23 22 13 17 4 14C12 23 24 33 36 37C41 39 46 42 50 49C54 42 59 39 64 37C76 33 88 23 96 14C87 17 77 22 68 29C61 34 55 43 50 52Z";

export function BirdMark({ className }) {
  return (
    <svg viewBox="0 8 100 48" className={className} role="img" aria-label="Travel Leaders">
      <defs>
        <linearGradient id="tlbird" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0284C7" />
          <stop offset="0.55" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <path d={BIRD} fill="url(#tlbird)" />
    </svg>
  );
}

export default function Logo({ className, compact = false, dark = false }) {
  return (
    <div className={cn("flex select-none items-center gap-2.5", className)}>
      <BirdMark className="h-7 w-auto" />
      {!compact && (
        <span
          className={cn(
            "font-display text-lg font-700 tracking-tight",
            dark ? "text-white" : "text-sky-950"
          )}
        >
          Travel<span className="text-sand-500"> Leaders</span>
        </span>
      )}
    </div>
  );
}
