import { cn } from "../lib/utils";

export default function Logo({ className, compact = false, dark = false }) {
  return (
    <div className={cn("flex select-none items-center", className)}>
      <img
        src="/trafalgar-logo.png"
        alt="Trafalgar"
        width="324"
        height="88"
        className={cn("block h-auto object-contain", compact ? "w-24" : "w-40", dark && "ring-1 ring-white/20")}
      />
    </div>
  );
}
