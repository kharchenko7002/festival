import { useMemo, useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  getLectures,
  getLectureCategories,
  getCompanyName,
  sortByStartTime,
} from '../utils/dataHelpers.js'

// Program section: lists lectures (foredrag) with search, category filter
// and sorting by start time.
function ProgramSection() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Alle')
  const [sortAsc, setSortAsc] = useState(true)

  const categories = getLectureCategories()

  // Filter by search text + category, then sort by start time
  const lectures = useMemo(() => {
    const text = query.trim().toLowerCase()

    const filtered = getLectures().filter((lecture) => {
      const company = getCompanyName(lecture.holderBedriftId)
      const matchesText =
        text === '' ||
        lecture.tittel.toLowerCase().includes(text) ||
        company.toLowerCase().includes(text) ||
        lecture.kategori.toLowerCase().includes(text)
      const matchesCategory =
        category === 'Alle' || lecture.kategori === category
      return matchesText && matchesCategory
    })

    const sorted = sortByStartTime(filtered)
    return sortAsc ? sorted : sorted.reverse()
  }, [query, category, sortAsc])

  return (
    <section id="program" className="bg-brand-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <SectionTitle
            eyebrow="Program"
            title="Foredrag gjennom dagen"
            subtitle="Søk, filtrer på kategori og sorter etter starttidspunkt for å finne foredragene som passer deg."
          />
        </Reveal>

        {/* Controls */}
        <div className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <SearchInput
            id="program-sok"
            label="Søk i program"
            value={query}
            onChange={setQuery}
            placeholder="Søk på tittel, bedrift eller kategori …"
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="program-kategori"
              className="text-sm font-medium text-slate-700"
            >
              Kategori
            </label>
            <select
              id="program-kategori"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="Alle">Alle kategorier</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setSortAsc((asc) => !asc)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
          >
            Tid {sortAsc ? '↑' : '↓'}
          </button>
        </div>

        {/* Result count */}
        <p className="text-sm text-slate-500" aria-live="polite">
          Viser {lectures.length} av {getLectures().length} foredrag
        </p>

        {/* Lecture cards */}
        {lectures.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Ingen foredrag passer med søket ditt.
          </p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {lectures.map((lecture) => (
              <li
                key={lecture.id}
                className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700">
                    <span aria-hidden="true">🕒</span>
                    {lecture.startTid}–{lecture.sluttTid}
                  </span>
                  <Badge variant="brand">{lecture.kategori}</Badge>
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  {lecture.tittel}
                </h3>

                <dl className="mt-auto flex flex-col gap-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-400">Bedrift:</dt>
                    <dd>{getCompanyName(lecture.holderBedriftId)}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-400">Rom:</dt>
                    <dd>{lecture.rom}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-400">Maks plasser:</dt>
                    <dd>{lecture.maksPlasser}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default ProgramSection
