import { useEffect, useMemo, useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  getLectureCompanies,
  getLectureOptions,
  getAuditoriumRooms,
  getProgramTimeSlots,
  getCompanyName,
  mergeProgramWithOverrides,
  saveProgramOverride,
  clearProgramOverrides,
  loadProgramOverrides,
  PROGRAM_OVERRIDES_EVENT,
} from '../utils/dataHelpers.js'

// Shared field styling, matching the registration form.
const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700'

// Festival manager ("Festivalsjef") section.
// Frontend-only prototype: the festival manager assigns lectures (foredrag)
// to Auditorium A / B and a time slot. Changes are stored in localStorage and
// merged into the program. No backend, no database.
function FestivalManagerSection() {
  // Static options sourced from datasett.json via the data helpers.
  const companies = getLectureCompanies()
  const rooms = getAuditoriumRooms()
  const timeSlots = getProgramTimeSlots()

  // Form state.
  const [companyId, setCompanyId] = useState('')
  const [lectureId, setLectureId] = useState('')
  const [rom, setRom] = useState('')
  const [tidspunkt, setTidspunkt] = useState('') // value = startTid of the slot
  const [feedback, setFeedback] = useState(null) // { type, text }

  // Saved overrides, kept in state so the section re-renders on every change
  // (also when the change comes from another tab via the storage event).
  const [overrides, setOverrides] = useState(() => loadProgramOverrides())

  useEffect(() => {
    const refresh = () => setOverrides(loadProgramOverrides())
    window.addEventListener(PROGRAM_OVERRIDES_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(PROGRAM_OVERRIDES_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  // The full program with overrides applied, sorted by start time.
  const program = useMemo(() => {
    const merged = mergeProgramWithOverrides(overrides)
    return [...merged].sort((a, b) => a.startTid.localeCompare(b.startTid))
  }, [overrides])

  // Lecture options for the chosen company.
  const lectureOptions = useMemo(
    () => (companyId ? getLectureOptions(companyId) : []),
    [companyId],
  )

  // The currently selected lecture (with any override already applied).
  const selectedLecture = useMemo(
    () => program.find((lecture) => lecture.id === Number(lectureId)) ?? null,
    [program, lectureId],
  )

  // When the company changes, reset the lecture and downstream fields.
  const handleCompanyChange = (event) => {
    setCompanyId(event.target.value)
    setLectureId('')
    setRom('')
    setTidspunkt('')
    setFeedback(null)
  }

  // When a lecture is chosen, prefill room/time with its current values so the
  // manager edits from the existing assignment.
  const handleLectureChange = (event) => {
    const id = event.target.value
    setLectureId(id)
    setFeedback(null)
    const lecture = program.find((item) => item.id === Number(id))
    setRom(lecture?.rom ?? '')
    setTidspunkt(lecture?.startTid ?? '')
  }

  // Save the new room/time assignment for the selected lecture.
  const handleSave = (event) => {
    event.preventDefault()
    if (!lectureId || !rom || !tidspunkt) return

    const slot = timeSlots.find((item) => item.startTid === tidspunkt)
    if (!slot) return

    saveProgramOverride(lectureId, {
      rom,
      startTid: slot.startTid,
      sluttTid: slot.sluttTid,
    })

    setFeedback({
      type: 'success',
      text: `Lagret: «${selectedLecture?.tittel}» er satt til ${rom} kl. ${slot.startTid}–${slot.sluttTid}.`,
    })
  }

  // Remove all saved changes and return to the original program.
  const handleReset = () => {
    clearProgramOverrides()
    setFeedback({ type: 'info', text: 'Alle endringer er tilbakestilt.' })
  }

  const hasOverrides = Object.keys(overrides).length > 0

  return (
    <section id="festivalsjef" className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionTitle
            eyebrow="Festivalsjef"
            title="Sett opp foredragsprogrammet"
            subtitle="Som festivalsjef kan du koble bedrifter med foredrag til Auditorium A eller Auditorium B og velge tidspunkt. Endringene vises automatisk i programmet. Dette er en prototype – valgene lagres lokalt i nettleseren."
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Form card */}
          <Reveal className="card-lift flex flex-col gap-6 p-6 ring-1 ring-slate-100 sm:p-8">
            <h3 className="text-lg font-semibold text-navy-900">
              Tildel rom og tidspunkt
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              {/* Company */}
              <div>
                <label htmlFor="fs-bedrift" className={labelClass}>
                  Bedrift med foredrag
                </label>
                <select
                  id="fs-bedrift"
                  value={companyId}
                  onChange={handleCompanyChange}
                  className={fieldClass}
                >
                  <option value="">– Velg bedrift –</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.navn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lecture */}
              <div>
                <label htmlFor="fs-foredrag" className={labelClass}>
                  Foredrag
                </label>
                <select
                  id="fs-foredrag"
                  value={lectureId}
                  onChange={handleLectureChange}
                  disabled={!companyId}
                  className={fieldClass}
                >
                  <option value="">
                    {companyId ? '– Velg foredrag –' : '– Velg bedrift først –'}
                  </option>
                  {lectureOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label htmlFor="fs-rom" className={labelClass}>
                  Rom
                </label>
                <select
                  id="fs-rom"
                  value={rom}
                  onChange={(event) => {
                    setRom(event.target.value)
                    setFeedback(null)
                  }}
                  disabled={!lectureId}
                  className={fieldClass}
                >
                  <option value="">– Velg rom –</option>
                  {rooms.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time slot */}
              <div>
                <label htmlFor="fs-tid" className={labelClass}>
                  Tidspunkt
                </label>
                <select
                  id="fs-tid"
                  value={tidspunkt}
                  onChange={(event) => {
                    setTidspunkt(event.target.value)
                    setFeedback(null)
                  }}
                  disabled={!lectureId}
                  className={fieldClass}
                >
                  <option value="">– Velg tidspunkt –</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.startTid} value={slot.startTid}>
                      {slot.startTid}–{slot.sluttTid}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback message */}
              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                  }`}
                >
                  {feedback.text}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={!lectureId || !rom || !tidspunkt}
                  className="btn-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Lagre endring
                </button>
                {hasOverrides && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-ghost"
                  >
                    Tilbakestill endringer
                  </button>
                )}
              </div>
            </form>

            {/* Preview of the selected lecture */}
            {selectedLecture && (
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Forhåndsvisning av valgt foredrag
                </p>
                <h4 className="text-base font-semibold text-navy-900">
                  {selectedLecture.tittel}
                </h4>
                <dl className="mt-3 flex flex-col gap-1.5 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Bedrift</dt>
                    <dd className="text-right font-medium text-slate-700">
                      {getCompanyName(selectedLecture.holderBedriftId)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Nåværende plassering</dt>
                    <dd className="text-right">
                      {selectedLecture.rom} · {selectedLecture.startTid}–
                      {selectedLecture.sluttTid}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Ny plassering</dt>
                    <dd className="text-right font-medium text-brand-700">
                      {rom || '—'}
                      {tidspunkt ? ` · ${tidspunkt}` : ''}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </Reveal>

          {/* Updated program overview */}
          <Reveal delay={120} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-navy-900">
                Oppdatert program
              </h3>
              {hasOverrides && (
                <Badge variant="success">
                  {Object.keys(overrides).length} endring(er)
                </Badge>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-100">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-semibold">Tidspunkt</th>
                    <th className="px-4 py-3 font-semibold">Rom</th>
                    <th className="px-4 py-3 font-semibold">Bedrift</th>
                    <th className="px-4 py-3 font-semibold">Foredrag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {program.map((lecture) => (
                    <tr
                      key={lecture.id}
                      className={lecture.endret ? 'bg-emerald-50/60' : 'bg-white'}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-navy-900">
                        {lecture.startTid}–{lecture.sluttTid}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {lecture.rom}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {getCompanyName(lecture.holderBedriftId)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="flex items-center gap-2">
                          {lecture.tittel}
                          {lecture.endret && (
                            <Badge variant="success">Endret</Badge>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400">
              Endringer markeres som «Endret» og vises også i program-seksjonen.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default FestivalManagerSection
