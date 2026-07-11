import { cn } from "../../lib/utils";

/** Shimmering placeholder used while async content loads (reserves layout space). */
export default function Skeleton({ className }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl border border-ocean-100 bg-white/70", className)}
      aria-hidden="true"
    />
  );
}
