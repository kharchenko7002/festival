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

// Hero / landing section with festival key facts, calls to action and stats.
function HeroSection() {
  const festival = getFestival()
  const stats = getFestivalStats()

  return (
    <section
      id="festival"
      className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 text-white"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        {/* Left: title, facts and actions */}
        <div className="flex flex-col gap-6">
          <Badge variant="accent" className="w-fit bg-white/15 text-white">
            {formatNorwegianDate(festival.dato)}
          </Badge>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {festival.navn}
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-brand-100">
            {festival.beskrivelse}
          </p>

          {/* Key facts */}
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
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
            <div className="flex items-center gap-2">
              <span aria-hidden="true">✉️</span>
              <dt className="sr-only">Kontakt</dt>
              <dd>
                <a
                  href={`mailto:${festival.kontaktEpost}`}
                  className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                  {festival.kontaktEpost}
                </a>
              </dd>
            </div>
          </dl>

          {/* Calls to action */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#program"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-brand-900/20 transition hover:bg-brand-50"
            >
              Se program
            </a>
            <a
              href="#bedrifter"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Utforsk bedrifter
            </a>
          </div>
        </div>

        {/* Right: summary statistics */}
        <div className="grid grid-cols-2 gap-4">
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
