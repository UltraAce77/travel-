import { Twitter, Instagram, Facebook } from "lucide-react";
import Logo from "../Logo";

const COLS = [
  { title: "Explore", links: ["Destinations", "Treks", "Rewards", "How it works"] },
  { title: "Company", links: ["About us", "Careers", "Press", "Contact"] },
  { title: "Support", links: ["Help center", "Safety", "Terms", "Privacy"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-ocean-100 bg-white">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sky-900/60">
              Curated journeys to 50+ destinations, with rewards every step of the way.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-ocean-200 text-sky-900/70 transition hover:bg-ocean-50 hover:text-ocean-700"
                  aria-label="social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-base font-600 text-sky-950">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-sky-900/60 transition hover:text-ocean-700">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ocean-100 pt-6 text-xs text-sky-900/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Travel Leaders. Demo environment — sample data only.</p>
          <p>Built for a security-awareness expo.</p>
        </div>
      </div>
    </footer>
  );
}
