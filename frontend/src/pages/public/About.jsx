import { Link } from "react-router-dom";
import { ArrowRight, Globe2, Heart, Sparkles, ShieldCheck } from "lucide-react";

const IMG = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const VALUES = [
  { icon: Globe2, title: "Explore boldly", text: "We believe the world is meant to be seen — and that discovery should feel effortless and inspiring." },
  { icon: Heart, title: "People first", text: "Every journey is personal. We design around real travelers, not spreadsheets." },
  { icon: ShieldCheck, title: "Trust by design", text: "Security and transparency are built into everything we do, from payouts to privacy." },
  { icon: Sparkles, title: "Reward the journey", text: "Exploration should give back. We turn wanderlust into real, tangible rewards." },
];

const TEAM = [
  { name: "Sofia Marchetti", role: "Founder & CEO", img: 47 },
  { name: "Kwame Mensah", role: "Head of Experience", img: 15 },
  { name: "Lena Novak", role: "Chief Concierge", img: 20 },
  { name: "Arjun Patel", role: "Head of Trust & Safety", img: 60 },
];

const STATS = [
  { v: "2019", l: "Founded" },
  { v: "50+", l: "Countries" },
  { v: "18k", l: "Travelers" },
  { v: "4.9★", l: "Rating" },
];

export default function About() {
  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <div className="absolute inset-0 bg-ink-900" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65"
          style={{ backgroundImage: `url(${IMG("photo-1469854523086-cc02fe5d8800", 2000)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-ink-950/50" />
        <div className="container-x relative z-10 pb-16 pt-28">
          <span className="eyebrow border-white/25 bg-white/10 text-white/90 backdrop-blur">Our story</span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-700 leading-[1.05] text-white sm:text-6xl">
            We're on a mission to make the world feel closer.
          </h1>
        </div>
      </section>

      {/* MISSION */}
      <section className="section container-x">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-5 font-display text-4xl font-700 leading-tight text-sky-950 sm:text-[2.75rem]">
              Travel Leaders began with a simple belief — that exploring the world should be{" "}
              <span className="gradient-text">beautiful, effortless, and rewarding</span>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-sky-900/65">
              We started in 2019 with a small team of travelers and builders who were tired of clunky
              booking sites and hidden fees. Today we curate journeys to over 50 destinations and
              reward our community for every step they take.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-sky-900/65">
              From overwater villas in the Maldives to alpine trails in Switzerland, we obsess over
              the details so you can focus on the wonder.
            </p>
            <Link to="/login" className="btn-iris btn-lg mt-8">
              Join the journey <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMG("photo-1517760444937-f6397edcbbcd", 700)} alt="" className="h-64 w-full rounded-3xl object-cover shadow-card" loading="lazy" />
            <img src={IMG("photo-1476514525535-07fb3b4ae5f1", 700)} alt="" className="mt-8 h-64 w-full rounded-3xl object-cover shadow-card" loading="lazy" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white">
        <div className="container-x grid grid-cols-2 gap-8 py-16 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-4xl font-700 text-ocean-700 sm:text-5xl">{s.v}</p>
              <p className="mt-1 text-sm uppercase tracking-wider text-sky-900/55">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="section container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">What we value</span>
          <h2 className="mt-5 font-display text-4xl font-700 text-sky-950 sm:text-5xl">
            The principles behind every trip
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sand-50 text-sand-600 ring-1 ring-sand-200">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-600 text-sky-950">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sky-900/60">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">The people</span>
            <h2 className="mt-5 font-display text-4xl font-700 text-sky-950 sm:text-5xl">
              Meet the team
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="text-center">
                <img
                  src={`https://i.pravatar.cc/240?img=${m.img}`}
                  alt={m.name}
                  className="mx-auto h-40 w-40 rounded-3xl object-cover shadow-card"
                  loading="lazy"
                />
                <h3 className="mt-4 font-display text-lg font-600 text-sky-950">{m.name}</h3>
                <p className="text-sm text-sky-900/55">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
