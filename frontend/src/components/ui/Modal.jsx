import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-sky-950/35 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn("card relative z-10 w-full max-w-lg p-6 animate-fade-up", className)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-700 text-sky-950">{title}</h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-sky-900/45 transition hover:bg-ocean-50 hover:text-sky-950"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
