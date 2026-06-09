import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  getWorkshops,
  getCompanyName,
  getRoomName,
  sortByStartTime,
} from '../utils/dataHelpers.js'

// Split a free-text prerequisite string into short chips
function toChips(text) {
  return text
    .split(/,|\sog\s/i)
    .map((part) => part.trim())
    .filter(Boolean)
}

// Workshops section: practical sessions with company, room and prerequisites.
// Company is resolved via holderBedriftId, room via romId. Visually distinct
// from the program: cards with a blue side rail and prerequisite chips.
function WorkshopsSection() {
  const workshops = sortByStartTime(getWorkshops())

  return (
    <section id="workshops" className="bg-brand-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionTitle
            eyebrow="Workshops"
            title="Praktiske workshops"
            subtitle="Meld deg på en av de praktiske øktene der du får prøve teknologien selv. Sjekk forkunnskapene før du velger."
          />
        </Reveal>

        {/* Wide banner image setting the scene for the workshops */}
        <Reveal className="overflow-hidden rounded-3xl shadow-xl shadow-navy-900/10 ring-1 ring-brand-100">
          <img
            src="/images/server-infra.jpg"
            alt="Servere og nettverksutstyr i et datarom"
            loading="lazy"
            className="h-52 w-full object-cover sm:h-64 lg:h-72"
          />
        </Reveal>

        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop, index) => (
            <Reveal
              as="li"
              key={workshop.id}
              delay={(index % 3) * 90}
              className="card-lift group relative flex flex-col gap-4 overflow-hidden p-6 pl-7 ring-1 ring-brand-100"
            >
              {/* Blue side rail marks workshops apart from lectures */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-brand-500 to-accent-400"
              />

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white">
                  <span aria-hidden="true">🛠️</span>
                  {workshop.startTid}–{workshop.sluttTid}
                </span>
                <Badge variant="accent">Maks {workshop.maksPlasser}</Badge>
              </div>

              <h3 className="text-lg font-semibold leading-snug text-navy-900">
                {workshop.tittel}
              </h3>

              <dl className="flex flex-col gap-1.5 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <dt className="text-slate-400">Bedrift:</dt>
                  <dd className="font-medium text-slate-700">
                    {getCompanyName(workshop.holderBedriftId)}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-slate-400">Rom:</dt>
                  <dd>{getRoomName(workshop.romId)}</dd>
                </div>
              </dl>

              <div className="mt-auto border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Forkunnskaper
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {toChips(workshop.forkunnskaper).map((chip) => (
                    <span
                      key={chip}
                      className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default WorkshopsSection
