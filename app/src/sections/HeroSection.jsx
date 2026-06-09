import StatCard from '../components/StatCard.jsx'
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

// Hero / landing section. Light, editorial split layout inspired by modern
// SaaS landing pages: large type and a date label on the left, a clean
// dashboard mockup on the right, and a key-figures strip underneath.
function HeroSection() {
  const festival = getFestival()
  const stats = getFestivalStats()

  return (
    <section
      id="festival"
      className="relative overflow-hidden border-b border-slate-100 bg-white"
    >
      {/* Soft decorative background: dotted grid + floating colour blobs */}
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-60"
      />
      <div
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-accent-300/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          {/* Left: date label, headline, facts and actions */}
          <div className="animate-fade-up flex flex-col gap-6">
            <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              <span className="animate-pulse-soft inline-block h-2 w-2 rounded-full bg-accent-500" />
              {formatNorwegianDate(festival.dato)}
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              {festival.sted}
            </p>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              {festival.navn.replace(/\s+\S+$/, '')}{' '}
              <span className="text-gradient">
                {festival.navn.split(' ').slice(-1)}
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              {festival.beskrivelse} Møt bedrifter, opplev foredrag og prøv
              teknologi i praksis – alt på én dag.
            </p>

            {/* Key facts */}
            <dl className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">🕒</span>
                <dt className="sr-only">Tidspunkt</dt>
                <dd>
                  {festival.startTid}–{festival.sluttTid}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden="true">🏢</span>
                <dt className="sr-only">Bygning</dt>
                <dd>{festival.bygning}</dd>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden="true">📍</span>
                <dt className="sr-only">Sted</dt>
                <dd>{festival.sted}</dd>
              </div>
            </dl>

            {/* Calls to action */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#program"
                className="rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl"
              >
                Se program
              </a>
              <a
                href="#bedrifter"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
              >
                Utforsk bedrifter
              </a>
            </div>

            <p className="text-sm text-slate-500">
              Spørsmål?{' '}
              <a
                href={`mailto:${festival.kontaktEpost}`}
                className="font-medium text-brand-600 underline-offset-4 hover:underline"
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
            {/* Floating mini badge */}
            <div className="animate-float absolute -left-3 top-10 z-10 hidden rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl sm:block">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Åpningstid
              </p>
              <p className="text-sm font-bold text-slate-900">
                {festival.startTid}–{festival.sluttTid}
              </p>
            </div>

            {/* Dashboard card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-300/40 sm:p-6">
              {/* Mock window top bar */}
              <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                <span className="h-3 w-3 rounded-full bg-red-300" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
                <span className="ml-3 text-xs font-medium text-slate-400">
                  festival.local/oversikt
                </span>
              </div>

              {/* Schedule preview rows */}
              <div className="space-y-3">
                {[
                  { tid: festival.startTid, w: 'w-5/6', c: 'bg-brand-500' },
                  { tid: '10:30', w: 'w-2/3', c: 'bg-accent-400' },
                  { tid: '12:00', w: 'w-3/4', c: 'bg-brand-400' },
                  { tid: '13:30', w: 'w-1/2', c: 'bg-accent-500' },
                ].map((row) => (
                  <div key={row.tid} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-xs font-semibold text-slate-500">
                      {row.tid}
                    </span>
                    <div className="h-8 flex-1 rounded-lg bg-slate-50">
                      <div
                        className={`flex h-8 items-center rounded-lg ${row.w} ${row.c} px-3`}
                      >
                        <span className="h-1.5 w-full rounded-full bg-white/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key figures strip */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 py-10 lg:grid-cols-4">
          <StatCard value={stats.bedrifter} label="Bedrifter" icon="🏢" />
          <StatCard value={stats.foredrag} label="Foredrag" icon="🎤" />
          <StatCard value={stats.workshops} label="Workshops" icon="🛠️" />
          <StatCard value={stats.rom} label="Rom" icon="🚪" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
