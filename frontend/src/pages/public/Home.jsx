import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ArrowDown } from "lucide-react";

const IMG = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const FEATURED = {
  n: "01",
  name: "Santorini",
  country: "Greece",
  coord: "36.39°N  25.46°E",
  price: 92,
  blurb:
    "Whitewashed villages spill down volcanic cliffs above a flooded caldera. Stay for the light — it turns the whole island molten at dusk.",
  id: "photo-1570077188670-e3a8d69ac5ff",
};

const ATLAS = [
  { n: "02", name: "Maldives", country: "Indian Ocean", coord: "3.20°N 73.22°E", price: 78, id: "photo-1514282401047-d79a71a590e8", span: "lg:col-span-7" },
  { n: "03", name: "Kyoto", country: "Japan", coord: "35.01°N 135.77°E", price: 64, id: "photo-1493976040374-85c8e12f0c0e", span: "lg:col-span-5" },
  { n: "04", name: "Zermatt", country: "Switzerland", coord: "46.02°N 7.75°E", price: 88, id: "photo-1531366936337-7c912a4589a7", span: "lg:col-span-4" },
  { n: "05", name: "Ubud", country: "Bali", coord: "8.51°S 115.26°E", price: 73, id: "photo-1537996194471-e657df975ab4", span: "lg:col-span-4" },
  { n: "06", name: "Venice", country: "Italy", coord: "45.44°N 12.32°E", price: 60, id: "photo-1523906834658-6e24ef2386f9", span: "lg:col-span-4" },
];

const LOGBOOK = ["50 destinations", "18,000 travelers", "4.9 average rating", "Rewards on every trek"];

const ITINERARY = [
  { tag: "Depart", title: "Join the club", text: "Sign up with a referral and open your traveler logbook. Two minutes, no fuss." },
  { tag: "Explore", title: "Collect your treks", text: "Receive a curated set of destinations and complete them, one place at a time." },
  { tag: "Return", title: "Earn & withdraw", text: "Commission lands on every trek. Cash out to your own wallet, whenever you like." },
];

function MonoLabel({ children, className = "" }) {
  return (
    <span className={`font-mono text-xs uppercase tracking-[0.18em] ${className}`}>{children}</span>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-clip">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-ink-950" />
        <img
          src={IMG("photo-1507525428034-b723cf961d3e", 2000)}
          alt="A calm turquoise shoreline at golden hour"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 to-transparent" />

        <div className="container-x relative z-10 flex min-h-screen flex-col justify-end pb-20 pt-32">
          <div className="max-w-3xl animate-fade-up">
            <MonoLabel className="text-sand-300">The world, curated · Nº 001</MonoLabel>
            <h1 className="mt-6 font-display text-5xl font-700 leading-[1.02] text-white sm:text-7xl lg:text-[5.5rem]">
              The most beautiful<br />
              places on earth,<br />
              <span className="italic font-500 text-sand-200">charted into one atlas.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
              Fifty hand-picked destinations. Complete your treks, collect rewards on every one, and
              let the journey pay you back.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/login" className="btn-primary btn-lg">
                Start exploring <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#atlas" className="inline-flex items-center gap-2 text-sm font-600 text-white hover:text-sand-200">
                Browse the atlas <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* field-note footer */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15">
          <div className="container-x flex items-center justify-between py-4">
            <MonoLabel className="text-white/70">Now featured — {FEATURED.name}, {FEATURED.country}</MonoLabel>
            <MonoLabel className="hidden text-white/70 sm:block">{FEATURED.coord}</MonoLabel>
          </div>
        </div>
      </section>

      {/* ── LOGBOOK STRIP ────────────────────────────────── */}
      <section className="border-b border-ocean-100 bg-white">
        <div className="container-x grid grid-cols-2 divide-ocean-100 md:grid-cols-4 md:divide-x">
          {LOGBOOK.map((item, i) => (
            <div key={item} className={`py-6 ${i % 2 === 0 ? "pr-4" : "pl-4"} md:px-8`}>
              <MonoLabel className="text-ocean-600">{String(i + 1).padStart(2, "0")}</MonoLabel>
              <p className="mt-1.5 font-display text-lg text-sky-950">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED DESTINATION ─────────────────────────── */}
      <section className="section container-x">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-7xl font-700 leading-none text-ocean-100">{FEATURED.n}</span>
              <MonoLabel className="text-ocean-600">Featured trek</MonoLabel>
            </div>
            <h2 className="mt-6 font-display text-5xl font-700 text-sky-950 sm:text-6xl">{FEATURED.name}</h2>
            <MonoLabel className="mt-2 block text-sky-900/50">
              {FEATURED.country} — {FEATURED.coord}
            </MonoLabel>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-sky-900/70">{FEATURED.blurb}</p>
            <div className="mt-8 flex items-center gap-6">
              <Link to="/login" className="btn-iris">
                Add to itinerary <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="font-mono text-sm text-sky-900/60">
                from <span className="text-lg font-600 text-sand-600">${FEATURED.price}</span>
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-ocean-900 shadow-card sm:h-[520px]">
              <img
                src={IMG(FEATURED.id, 1400)}
                alt={`${FEATURED.name}, ${FEATURED.country}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur">
                <MonoLabel className="text-sky-950">{FEATURED.coord}</MonoLabel>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ATLAS GRID ───────────────────────────────────── */}
      <section id="atlas" className="section bg-white">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ocean-100 pb-8">
            <div>
              <MonoLabel className="text-ocean-600">The atlas · 50 places worth the journey</MonoLabel>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-700 text-sky-950 sm:text-5xl">
                Pick a coordinate. We'll do the rest.
              </h2>
            </div>
            <Link to="/login" className="btn-ghost">
              See all 50 <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-12">
            {ATLAS.map((d) => (
              <Link
                to="/login"
                key={d.n}
                className={`group relative block h-72 overflow-hidden rounded-2xl bg-ink-900 sm:h-80 ${d.span}`}
              >
                <img
                  src={IMG(d.id, 1000)}
                  alt={`${d.name}, ${d.country}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-ink-950/20" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                  <span className="font-display text-3xl font-700 text-white/90">{d.n}</span>
                  <MonoLabel className="text-white/70">{d.coord}</MonoLabel>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <MonoLabel className="text-sand-200">{d.country}</MonoLabel>
                    <h3 className="mt-1 font-display text-3xl font-700 text-white">{d.name}</h3>
                  </div>
                  <span className="rounded-full bg-white/90 px-3 py-1 font-mono text-xs font-600 text-sky-950">
                    ${d.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ITINERARY (route) ────────────────────────────── */}
      <section className="section container-x">
        <div className="max-w-xl">
          <MonoLabel className="text-ocean-600">The itinerary</MonoLabel>
          <h2 className="mt-4 font-display text-4xl font-700 text-sky-950 sm:text-5xl">
            Three legs to your reward
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-3 hidden border-t border-dashed border-ocean-300 md:block" />
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {ITINERARY.map((s, i) => (
              <div key={s.tag} className="relative">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 h-6 w-6 rounded-full border-2 border-ocean-500 bg-white" />
                  <MonoLabel className="text-ocean-600">
                    {String(i + 1).padStart(2, "0")} / {s.tag}
                  </MonoLabel>
                </div>
                <h3 className="mt-5 font-display text-2xl font-600 text-sky-950">{s.title}</h3>
                <p className="mt-2 text-sky-900/65">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────── */}
      <section className="bg-ink-900">
        <div className="container-x py-24 sm:py-32">
          <MonoLabel className="text-sand-300">From the logbook</MonoLabel>
          <blockquote className="mt-8 max-w-4xl font-display text-3xl font-400 italic leading-snug text-white sm:text-5xl sm:leading-[1.15]">
            "The most beautiful way I've found to plan a trip — and somehow it pays me back while I
            dream up the next one."
          </blockquote>
          <div className="mt-10 flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/96?img=5"
              alt="Amara Okafor"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
              loading="lazy"
            />
            <div>
              <p className="font-600 text-white">Amara Okafor</p>
              <MonoLabel className="text-white/55">Traveler · Lagos, Nigeria</MonoLabel>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────── */}
      <section className="section container-x">
        <div className="relative overflow-hidden rounded-[2.5rem]">
          <img
            src={IMG("photo-1501785888041-af3ef285b470", 1800)}
            alt="Mountains under a clear sky"
            className="h-[440px] w-full object-cover sm:h-[520px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/85 via-ink-950/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-16">
            <MonoLabel className="text-sand-200">Your next coordinate is waiting</MonoLabel>
            <h2 className="mt-5 max-w-2xl font-display text-4xl font-700 leading-tight text-white sm:text-6xl">
              Somewhere on this map<br />is your next chapter.
            </h2>
            <Link to="/login" className="btn-primary btn-lg mt-9 w-fit">
              Start your logbook <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
