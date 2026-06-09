import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
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
    <section id="workshops" className="bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6">
        <SectionTitle
          eyebrow="Workshops"
          title="Praktiske workshops"
          subtitle="Meld deg på en av de praktiske øktene der du får prøve teknologien selv. Sjekk forkunnskapene før du velger."
        />

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop) => (
            <li
              key={workshop.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-brand-700">
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

              <div className="mt-auto rounded-xl bg-slate-50 p-3 text-sm">
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
