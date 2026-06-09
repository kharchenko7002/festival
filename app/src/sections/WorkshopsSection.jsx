import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  getWorkshops,
  getCompanyName,
  getRoomName,
  sortByStartTime,
} from '../utils/dataHelpers.js'

// Workshops section: practical sessions with company, room and prerequisites.
// Company is resolved via holderBedriftId, room via romId.
function WorkshopsSection() {
  const workshops = sortByStartTime(getWorkshops())

  return (
    <section id="workshops" className="bg-brand-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <SectionTitle
            eyebrow="Workshops"
            title="Praktiske workshops"
            subtitle="Meld deg på en av de praktiske øktene der du får prøve teknologien selv. Sjekk forkunnskapene før du velger."
          />
        </Reveal>

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop) => (
            <li
              key={workshop.id}
              className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-accent-400 hover:shadow-xl"
            >
              {/* Accent top stripe marks workshops apart from lectures */}
              <span
                aria-hidden="true"
                className="h-1.5 w-12 rounded-full bg-gradient-to-r from-accent-500 to-brand-500"
              />

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-400/15 px-2.5 py-1 text-sm font-semibold text-accent-500">
                  <span aria-hidden="true">🛠️</span>
                  {workshop.startTid}–{workshop.sluttTid}
                </span>
                <Badge variant="accent">Maks {workshop.maksPlasser}</Badge>
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                {workshop.tittel}
              </h3>

              <dl className="flex flex-col gap-1 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <dt className="text-slate-400">Bedrift:</dt>
                  <dd>{getCompanyName(workshop.holderBedriftId)}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-slate-400">Rom:</dt>
                  <dd>{getRoomName(workshop.romId)}</dd>
                </div>
              </dl>

              <div className="mt-auto rounded-xl bg-brand-50 p-3 text-sm">
                <p className="font-medium text-slate-700">Forkunnskaper</p>
                <p className="text-slate-500">{workshop.forkunnskaper}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default WorkshopsSection
