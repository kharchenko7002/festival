import Badge from '../components/Badge.jsx'
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

// Hero / landing section: SaaS-style split layout with festival key facts and
// calls to action on the left, and a decorative dashboard mockup on the right.
function HeroSection() {
  const festival = getFestival()
  const stats = getFestivalStats()

  return (
    <section
      id="festival"
      className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 text-white"
    >
      {/* Decorative floating background shapes */}
      <div
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_55%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        {/* Left: title, facts and actions */}
        <div className="animate-fade-up flex flex-col gap-6">
          <Badge
            variant="accent"
            className="w-fit bg-white/15 text-white ring-1 ring-white/20"
          >
            <span aria-hidden="true">📅</span>
            {formatNorwegianDate(festival.dato)}
          </Badge>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {festival.navn}
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-brand-100">
            {festival.beskrivelse} Møt bedrifter, opplev foredrag og prøv
            teknologi i praksis – alt på én dag.
          </p>

          {/* Key facts */}
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-100">
            <div className="flex items-center gap-2">
              <span aria-hidden="true">🕒</span>
              <dt className="sr-only">Tidspunkt</dt>
              <dd>
                {festival.startTid}–{festival.sluttTid}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true">📍</span>
              <dt className="sr-only">Sted</dt>
              <dd>{festival.sted}</dd>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true">🏢</span>
              <dt className="sr-only">Bygning</dt>
              <dd>{festival.bygning}</dd>
            </div>
          </dl>

          {/* Calls to action */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#program"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-navy-900/30 transition hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-xl"
            >
              Se program
            </a>
            <a
              href="#bedrifter"
              className="rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Utforsk bedrifter
            </a>
          </div>
        </div>

        {/* Right: decorative dashboard mockup with stat cards */}
        <div className="animate-fade-up relative" style={{ animationDelay: '0.15s' }}>
          {/* Floating accent badge */}
          <div
            aria-hidden="true"
            className="animate-float absolute -left-4 top-8 z-10 hidden rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-xl sm:block"
          >
            <p className="text-xs font-medium text-slate-500">I dag</p>
            <p className="text-sm font-bold">
              {festival.startTid}–{festival.sluttTid}
            </p>
          </div>

          {/* Dashboard card */}
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-navy-900/40 backdrop-blur-md sm:p-6">
            {/* Mock window top bar */}
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-300/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs font-medium text-brand-100">
                festival.local/oversikt
              </span>
            </div>

            {/* Stat cards summarising the festival */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard value={stats.bedrifter} label="Bedrifter" icon="🏢" />
              <StatCard value={stats.foredrag} label="Foredrag" icon="🎤" />
              <StatCard value={stats.workshops} label="Workshops" icon="🛠️" />
              <StatCard value={stats.rom} label="Rom" icon="🚪" />
            </div>

            {/* Mock progress / schedule preview */}
            <div className="mt-4 rounded-2xl bg-white/90 p-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Dagens program</span>
                <span className="text-brand-600">
                  {festival.startTid}–{festival.sluttTid}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2.5 w-full rounded-full bg-brand-100">
                  <div className="h-2.5 w-4/5 rounded-full bg-brand-500" />
                </div>
                <div className="h-2.5 w-full rounded-full bg-brand-100">
                  <div className="h-2.5 w-3/5 rounded-full bg-accent-400" />
                </div>
                <div className="h-2.5 w-full rounded-full bg-brand-100">
                  <div className="h-2.5 w-2/3 rounded-full bg-brand-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave separating the hero from the next section */}
      <div aria-hidden="true" className="relative">
        <svg
          className="block h-12 w-full text-white sm:h-16"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0 80 L0 40 C 240 80 480 80 720 50 C 960 20 1200 20 1440 45 L1440 80 Z" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
