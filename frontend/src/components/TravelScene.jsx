import { cn } from "../lib/utils";

const SKY = {
  coast: "from-sky-300 via-cyan-100 to-orange-100",
  alpine: "from-sky-200 via-blue-50 to-emerald-50",
  sunset: "from-orange-200 via-rose-100 to-sky-200",
  island: "from-cyan-200 via-sky-100 to-amber-100",
};

export default function TravelScene({ variant = "coast", className, label = "Scenic travel destination" }) {
  const sky = SKY[variant] || SKY.coast;

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative overflow-hidden bg-gradient-to-b", sky, className)}
    >
      <div className="absolute left-[12%] top-[16%] h-20 w-20 rounded-full bg-white/85 shadow-[0_0_50px_rgba(255,255,255,0.85)]" />
      <div className="absolute left-[8%] top-[34%] h-10 w-36 rounded-full bg-white/55 blur-sm" />
      <div className="absolute right-[14%] top-[22%] h-12 w-44 rounded-full bg-white/50 blur-sm" />

      <div className="absolute bottom-[38%] left-[-10%] h-[34%] w-[64%] rotate-[-5deg] rounded-t-[80%] bg-sky-900/18" />
      <div className="absolute bottom-[34%] right-[-12%] h-[40%] w-[70%] rotate-[5deg] rounded-t-[80%] bg-sky-950/18" />
      <div className="absolute bottom-[30%] left-[18%] h-[34%] w-[58%] rounded-t-[80%] bg-emerald-700/24" />

      <div className="absolute bottom-0 left-0 right-0 h-[37%] bg-gradient-to-b from-cyan-500/55 via-ocean-500/70 to-ocean-700/85" />
      <div className="absolute bottom-[29%] left-0 right-0 h-7 bg-white/55 blur-sm" />
      <div className="absolute bottom-[22%] left-[12%] h-1.5 w-[32%] rounded-full bg-white/65" />
      <div className="absolute bottom-[16%] right-[10%] h-1.5 w-[42%] rounded-full bg-white/55" />
      <div className="absolute bottom-0 left-0 right-0 h-[13%] bg-gradient-to-r from-sand-200 via-sand-100 to-sand-200" />
    </div>
  );
}
