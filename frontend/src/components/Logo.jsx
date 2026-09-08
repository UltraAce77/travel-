import { cn } from "../lib/utils";

export default function Logo({ className, compact = false, dark = false }) {
  return (
    <div className={cn("flex select-none items-center", className)}>
      <img
        src={dark ? "/tauck-logo-white.png" : "/tauck-logo.png"}
        alt="Tauck"
        width="320"
        height="76"
        className={cn("block h-auto object-contain", compact ? "w-24" : "w-40")}
      />
    </div>
  );
}
