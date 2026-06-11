import { useEffect, useMemo, useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  getLectureCategories,
  getCompanyName,
  sortByStartTime,
  mergeProgramWithOverrides,
} from '../utils/dataHelpers.js'
import { apiGetOverrides, OVERRIDES_EVENT } from '../utils/apiClient.js'

// Program section: lists lectures (foredrag) with search, category filter
// and sorting by start time. The program reflects any room/time changes the
// festival manager has saved (overrides fetched from the backend).
function ProgramSection() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Alle')
  const [sortAsc, setSortAsc] = useState(true)

  // Festival-manager overrides fetched from the backend. Kept in state so the
  // program updates when the manager saves a change (via OVERRIDES_EVENT).
  // `backendOk` is false when the API cannot be reached.
  const [overrides, setOverrides] = useState({})
  const [backendOk, setBackendOk] = useState(true)

  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const data = await apiGetOverrides()
        if (!active) return
        setOverrides(data || {})
        setBackendOk(true)
      } catch {
        if (!active) return
        setBackendOk(false)
      }
    }
    refresh()
    window.addEventListener(OVERRIDES_EVENT, refresh)
    return () => {
      active = false
      window.removeEventListener(OVERRIDES_EVENT, refresh)
    }
  }, [])

  const categories = getLectureCategories()

  // The program with overrides applied (original data + manager's changes).
  const program = useMemo(
    () => mergeProgramWithOverrides(overrides),
    [overrides],
  )

  // Filter by search text + category, then sort by start time
  const lectures = useMemo(() => {
    const text = query.trim().toLowerCase()

    const filtered = program.filter((lecture) => {
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
  }, [program, query, category, sortAsc])

  return (
    <section id="program" className="bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionTitle
            eyebrow="Program"
            title="Foredrag gjennom dagen"
            subtitle="Søk, filtrer på kategori og sorter etter starttidspunkt for å finne foredragene som passer deg."
          />
        </Reveal>

        {!backendOk && (
          <Reveal>
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 ring-1 ring-amber-100">
              Programmet vises uten serverendringer fordi backend ikke svarer.
            </p>
          </Reveal>
        )}

        {/* Controls */}
        <Reveal className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-navy-900/5 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1fr_auto_auto] lg:items-end">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700"
          >
            Sorter tid {sortAsc ? '↑' : '↓'}
          </button>
        </Reveal>

        {/* Result count */}
        <p className="text-sm text-slate-500" aria-live="polite">
          Viser {lectures.length} av {program.length} foredrag
        </p>

        {/* Lecture cards */}
        {lectures.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Ingen foredrag passer med søket ditt.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {lectures.map((lecture) => (
              <li
                key={lecture.id}
                className="card-lift group flex flex-col gap-4 p-6 ring-1 ring-slate-100"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-navy-800 px-3 py-1.5 text-sm font-semibold text-white">
                    <span aria-hidden="true">🕒</span>
                    {lecture.startTid}–{lecture.sluttTid}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {lecture.endret && <Badge variant="success">Endret</Badge>}
                    <Badge variant="brand">{lecture.kategori}</Badge>
                  </div>
                </div>

                <h3 className="text-lg font-semibold leading-snug text-navy-900">
                  {lecture.tittel}
                </h3>

                <dl className="mt-auto flex flex-col gap-1.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-400">Bedrift:</dt>
                    <dd className="font-medium text-slate-700">
                      {getCompanyName(lecture.holderBedriftId)}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-400">Rom:</dt>
                    <dd>{lecture.rom}</dd>
                  </div>
                  {lecture.ledigePlasser !== undefined ? (
                    <div className="flex items-center gap-2">
                      <dt className="text-slate-400">Ledige plasser:</dt>
                      <dd className="font-medium text-emerald-700">
                        {lecture.ledigePlasser} av {lecture.maksPlasser} ledige
                      </dd>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <dt className="text-slate-400">Maks plasser:</dt>
                      <dd>{lecture.maksPlasser}</dd>
                    </div>
                  )}
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
