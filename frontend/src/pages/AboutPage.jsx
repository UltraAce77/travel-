import { Link } from "react-router-dom";
import { ArrowRight, Building2, Globe2, LockKeyhole, Route, SearchCheck, Users } from "lucide-react";
import PublicNav from "../components/PublicNav";
import TravelScene from "../components/TravelScene";

const VALUES = [
  { icon: Globe2, title: "Global travel facade", text: "Luxury destinations, trusted partners, and reward copy mirror the surface pattern used to win trust." },
  { icon: LockKeyhole, title: "Payment pressure", text: "Deposits, locked withdrawals, and balance gates are reproduced for education and red-team discussion." },
  { icon: SearchCheck, title: "Awareness-first build", text: "Presenter notes identify red flags without removing the actual behavior being demonstrated." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ocean-50">
      <PublicNav />

      <main className="pt-28">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-700 uppercase tracking-[0.22em] text-sand-600">About us</p>
            <h1 className="mt-3 font-display text-5xl font-700 leading-tight text-sky-950">
              A travel brand built to expose a real online deception pattern.
            </h1>
            <p className="mt-5 text-lg leading-8 text-sky-900/68">
              Travel Leaders is presented as a premium travel membership platform for the expo. Behind the polished tourism interface, the system demonstrates how task-reward scams use travel imagery, referral codes, wallet deposits, and withdrawal friction.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/login" className="btn-primary rounded-full px-6">
                Open member portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/" className="btn-ghost rounded-full px-6">
                View home
              </Link>
            </div>
          </div>

          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] shadow-card">
            <TravelScene variant="alpine" className="absolute inset-0" label="Mountain lake travel scene" />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/20 bg-white/15 p-5 text-white backdrop-blur-md">
              <p className="font-display text-2xl font-700">Designed for a live cybersecurity walkthrough</p>
              <p className="mt-2 text-sm leading-6 text-white/78">
                The clean travel experience makes the trap understandable to non-technical audiences.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.title} className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sand-100 text-sand-600">
                  <value.icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-lg font-800 text-sky-950">{value.title}</h2>
                <p className="mt-2 text-sm leading-6 text-sky-900/65">{value.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white p-6 shadow-card md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Route, number: "50", label: "seeded destination treks" },
                { icon: Users, number: "3", label: "demo roles: admin, manager, user" },
                { icon: Building2, number: "1", label: "complete awareness scenario" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-3xl bg-ocean-50 p-5">
                  <metric.icon className="h-6 w-6 text-ocean-700" />
                  <p className="mt-4 font-display text-4xl font-700 text-sky-950">{metric.number}</p>
                  <p className="mt-1 text-sm font-600 text-sky-900/62">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
