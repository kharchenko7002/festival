import StatCard from '../components/StatCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { getFestival, getFestivalStats } from '../utils/dataHelpers.js'

// Format an ISO date string (YYYY-MM-DD) as a readable Norwegian date
function formatNorwegianDate(isoDate) {
  try {
    return new Intl.DateTimeFormat('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(isoDate))
  } catch {
    return isoDate
  }
}

// Hero / landing section. A deep navy block with a large headline and key
// facts on the left, and a Tailwind-built dashboard mockup on the right –
// the main visual anchor of the page, in the style of a modern SaaS landing.
function HeroSection() {
  const festival = getFestival()
  const stats = getFestivalStats()

  // Key facts rendered as small cards in the info row
  const facts = [
    { icon: '📅', label: 'Dato', value: formatNorwegianDate(festival.dato) },
    {
      icon: '🕒',
      label: 'Tid',
      value: `${festival.startTid}–${festival.sluttTid}`,
    },
    { icon: '📍', label: 'Sted', value: festival.bygning },
  ]

  // Mock schedule rows for the dashboard illustration (decorative only)
  const mockRows = [
    { tid: '09:00', w: 'w-11/12', c: 'bg-brand-400' },
    { tid: '10:30', w: 'w-3/4', c: 'bg-accent-400' },
    { tid: '12:00', w: 'w-5/6', c: 'bg-brand-300' },
    { tid: '13:30', w: 'w-2/3', c: 'bg-gold-400' },
  ]

  return (
    <section id="festival" className="relative bg-white">
      {/* Deep navy hero block */}
      <div className="relative overflow-hidden bg-navy-800 text-white">
        {/* Decorative background: dotted grid + floating colour blobs */}
        <div
          aria-hidden="true"
          className="bg-dot-grid pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="animate-float pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-14 pb-32 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-40 lg:pt-28">
            {/* Left: eyebrow, headline, facts and actions */}
            <div className="animate-fade-up flex flex-col gap-7">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-white/15">
                <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-gold-400" />
                {festival.navn}
              </span>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.75rem]">
                Der elever møter{' '}
                <span className="text-highlight">IT-bransjen</span> i praksis
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-brand-100">
                {festival.beskrivelse} Møt bedrifter, opplev foredrag og prøv
                teknologi selv – alt på én dag.
              </p>

              {/* Key facts as compact cards */}
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-brand-100">
                      <span aria-hidden="true">{fact.icon}</span>
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-white">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Calls to action */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="#program" className="btn-primary">
                  Se program
                </a>
                <a href="#bedrifter" className="btn-light">
                  Utforsk bedrifter
                </a>
              </div>

              <p className="text-sm text-brand-100">
                Spørsmål?{' '}
                <a
                  href={`mailto:${festival.kontaktEpost}`}
                  className="font-medium text-gold-300 underline-offset-4 hover:underline"
                >
                  {festival.kontaktEpost}
                </a>
              </p>
            </div>

            {/* Right: decorative dashboard mockup (hidden from assistive tech) */}
            <div
              aria-hidden="true"
              className="animate-fade-up relative"
              style={{ animationDelay: '0.15s' }}
            >
              {/* Floating mini badge – top left */}
              <div className="animate-float absolute -left-4 top-8 z-20 hidden rounded-2xl bg-white px-4 py-3 shadow-2xl sm:block">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Åpningstid
                </p>
                <p className="text-sm font-bold text-navy-900">
                  {festival.startTid}–{festival.sluttTid}
                </p>
              </div>

              {/* Floating mini badge – bottom right */}
              <div className="animate-float-slow absolute -bottom-5 -right-3 z-20 hidden items-center gap-2 rounded-2xl bg-navy-900 px-4 py-3 shadow-2xl ring-1 ring-white/10 sm:flex">
                <span className="h-2.5 w-2.5 animate-pulse-soft rounded-full bg-gold-400" />
                <p className="text-sm font-semibold text-white">
                  Live program
                </p>
              </div>

              {/* Dashboard card */}
              <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-navy-900/40 sm:p-6">
                {/* Mock window top bar */}
                <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <span className="h-3 w-3 rounded-full bg-red-300" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-300" />
                  <span className="ml-3 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-400">
                    festival.local/program
                  </span>
                </div>

                {/* Schedule preview rows */}
                <div className="space-y-3">
                  {mockRows.map((row) => (
                    <div key={row.tid} className="flex items-center gap-3">
                      <span className="w-12 shrink-0 text-xs font-semibold text-slate-400">
                        {row.tid}
                      </span>
                      <div className="h-8 flex-1 rounded-lg bg-slate-50">
                        <div
                          className={`flex h-8 items-center rounded-lg ${row.w} ${row.c} px-3`}
                        >
                          <span className="h-1.5 w-2/3 rounded-full bg-white/60" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini bar chart footer */}
                <div className="mt-5 flex items-end justify-between gap-2 border-t border-slate-100 pt-5">
                  {['h-8', 'h-12', 'h-7', 'h-16', 'h-10', 'h-14', 'h-9'].map(
                    (h, i) => (
                      <div
                        key={i}
                        className={`animate-grow-up w-full rounded-md ${h} ${
                          i % 3 === 0 ? 'bg-brand-500' : 'bg-brand-100'
                        }`}
                        style={{ animationDelay: `${i * 90}ms` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key figures strip – pulled up to overlap the navy block */}
      <div className="relative mx-auto -mt-20 max-w-6xl px-4 sm:px-6 lg:-mt-28">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          <Reveal delay={0}>
            <StatCard value={stats.bedrifter} label="Bedrifter" icon="🏢" />
          </Reveal>
          <Reveal delay={90}>
            <StatCard value={stats.foredrag} label="Foredrag" icon="🎤" />
          </Reveal>
          <Reveal delay={180}>
            <StatCard value={stats.workshops} label="Workshops" icon="🛠️" />
          </Reveal>
          <Reveal delay={270}>
            <StatCard value={stats.rom} label="Rom" icon="🚪" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
