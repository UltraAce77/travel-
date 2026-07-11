import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, Plane, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import PublicNav from "../components/PublicNav";
import TravelScene from "../components/TravelScene";

const DESTINATIONS = [
  {
    title: "Maldives Coral Atolls",
    tag: "Island escape",
    variant: "island",
  },
  {
    title: "Cappadocia Sunrise",
    tag: "Balloon route",
    variant: "sunset",
  },
  {
    title: "Swiss Alpine Valleys",
    tag: "Mountain trek",
    variant: "alpine",
  },
];

const STEPS = [
  { icon: MapPin, title: "Choose a route", text: "Browse curated travel sets inspired by global destinations." },
  { icon: BadgeCheck, title: "Complete treks", text: "Review each assigned destination and confirm progress through the set." },
  { icon: WalletCards, title: "Track rewards", text: "Balances and commissions are shown inside the member dashboard." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ocean-50">
      <PublicNav />

      <main>
        <section className="relative min-h-[92vh] overflow-hidden">
          <TravelScene variant="coast" className="absolute inset-0" label="Ocean coastline travel scene" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/78 via-sky-950/26 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ocean-50" />
          <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-end px-4 pb-20 pt-32 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-sm font-600 backdrop-blur">
                <Sparkles className="h-4 w-4 text-sand-200" />
                Private travel rewards club
              </div>
              <h1 className="font-display text-5xl font-700 leading-[0.96] sm:text-6xl lg:text-7xl">
                Explore the world with curated travel leaders.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88">
                A destination-led travel platform presenting hand-picked trek collections, account rewards, and crypto wallet settlement for members.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="btn-primary rounded-full px-6 py-3">
                  Access member portal <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/about" className="btn rounded-full border border-white/40 bg-white/15 px-6 py-3 text-white backdrop-blur hover:bg-white/25">
                  About Travel Leaders
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-700 uppercase tracking-[0.22em] text-sand-600">Featured routes</p>
              <h2 className="mt-2 font-display text-4xl font-700 text-sky-950">Destinations that sell the dream</h2>
            </div>
            <p className="max-w-xl text-sky-900/65">
              The interface intentionally looks like a polished travel agency because that is how this class of scheme earns trust in the real world.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {DESTINATIONS.map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-3xl bg-white shadow-card">
                <div className="relative h-72 overflow-hidden">
                  <TravelScene
                    variant={item.variant}
                    label={item.title}
                    className="absolute inset-0 transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-sm font-600 text-sand-200">{item.tag}</p>
                    <h3 className="mt-1 font-display text-2xl font-700">{item.title}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white/70 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-700 uppercase tracking-[0.22em] text-ocean-700">Member journey</p>
              <h2 className="mt-2 font-display text-4xl font-700 text-sky-950">A beautiful flow with a dangerous mechanic underneath.</h2>
              <p className="mt-4 leading-7 text-sky-900/65">
                For the cybersecurity expo, the public website stays realistic: aspirational travel copy, destination visuals, reward language, and a member dashboard that reproduces the trap.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.title} className="card p-5">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocean-100 text-ocean-700">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-base font-700 text-sky-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-sky-900/62">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-[2rem] bg-sky-950 p-6 text-white shadow-card md:grid-cols-3 md:p-8">
            {[
              { icon: Plane, label: "50+ curated treks" },
              { icon: ShieldCheck, label: "Cybersecurity awareness demo" },
              { icon: CalendarDays, label: "Ready for live expo walkthroughs" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4">
                <item.icon className="h-6 w-6 text-sand-300" />
                <span className="font-700">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
