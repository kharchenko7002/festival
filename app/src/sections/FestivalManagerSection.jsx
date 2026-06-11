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
  hasRoomTimeConflict,
} from '../utils/dataHelpers.js'
import {
  apiLogin,
  apiGetOverrides,
  apiSaveOverride,
  apiResetOverrides,
  getToken,
  setToken,
  clearToken,
  notifyOverridesChanged,
  OVERRIDES_EVENT,
} from '../utils/apiClient.js'

// Shared field styling, matching the registration form.
const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700'

// Festival manager ("Festivalsjef") section.
// The festival manager logs in, assigns lectures (foredrag) to Auditorium A/B
// and a time slot, and the changes are stored server-side via the API. The
// backend is the authoritative source and validates against double-booking.
function FestivalManagerSection() {
  // Static options sourced from datasett.json via the data helpers.
  const companies = getLectureCompanies()
  const rooms = getAuditoriumRooms()
  const timeSlots = getProgramTimeSlots()

  // Auth state.
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getToken()))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Program-change form state.
  const [companyId, setCompanyId] = useState('')
  const [lectureId, setLectureId] = useState('')
  const [rom, setRom] = useState('')
  const [tidspunkt, setTidspunkt] = useState('') // value = startTid of the slot
  const [feedback, setFeedback] = useState(null) // { type, text }
  const [saving, setSaving] = useState(false)

  // Overrides loaded from the backend.
  const [overrides, setOverrides] = useState({})
  const [backendOk, setBackendOk] = useState(true)

  // Load overrides from the backend (and refresh on change events).
  useEffect(() => {
    let active = true
    const load = async () => {
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
    load()
    window.addEventListener(OVERRIDES_EVENT, load)
    return () => {
      active = false
      window.removeEventListener(OVERRIDES_EVENT, load)
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

  const hasOverrides = Object.keys(overrides).length > 0

  // --- Auth handlers --------------------------------------------------------

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      const { token } = await apiLogin(username.trim(), password)
      setToken(token)
      setLoggedIn(true)
      setPassword('')
    } catch (error) {
      setLoginError(
        error.status === 401
          ? 'Feil brukernavn eller passord.'
          : 'Innlogging feilet. Sjekk at serveren svarer.',
      )
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = () => {
    clearToken()
    setLoggedIn(false)
    setCompanyId('')
    setLectureId('')
    setRom('')
    setTidspunkt('')
    setFeedback(null)
    setUsername('')
  }

  // --- Program-change handlers ---------------------------------------------

  const handleCompanyChange = (event) => {
    setCompanyId(event.target.value)
    setLectureId('')
    setRom('')
    setTidspunkt('')
    setFeedback(null)
  }

  const handleLectureChange = (event) => {
    const id = event.target.value
    setLectureId(id)
    setFeedback(null)
    const lecture = program.find((item) => item.id === Number(id))
    setRom(lecture?.rom ?? '')
    setTidspunkt(lecture?.startTid ?? '')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!lectureId || !rom || !tidspunkt) return

    const slot = timeSlots.find((item) => item.startTid === tidspunkt)
    if (!slot) return

    // Optimistic frontend conflict check for quick feedback. The backend runs
    // the authoritative check as well.
    if (hasRoomTimeConflict(rom, slot.startTid, lectureId, overrides)) {
      setFeedback({
        type: 'error',
        text: 'Dette tidspunktet er allerede opptatt i valgt rom.',
      })
      return
    }

    setSaving(true)
    try {
      const updated = await apiSaveOverride({
        lectureId: Number(lectureId),
        rom,
        startTid: slot.startTid,
        sluttTid: slot.sluttTid,
      })
      setOverrides(updated || {})
      setBackendOk(true)
      notifyOverridesChanged()
      setFeedback({
        type: 'success',
        text: `Lagret: «${selectedLecture?.tittel}» er satt til ${rom} kl. ${slot.startTid}–${slot.sluttTid}.`,
      })
    } catch (error) {
      if (error.status === 401) {
        clearToken()
        setLoggedIn(false)
        setFeedback({ type: 'error', text: 'Økten er utløpt. Logg inn på nytt.' })
      } else {
        setFeedback({ type: 'error', text: error.message })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    try {
      await apiResetOverrides()
      setOverrides({})
      notifyOverridesChanged()
      setFeedback({ type: 'info', text: 'Alle endringer er tilbakestilt.' })
    } catch (error) {
      if (error.status === 401) {
        clearToken()
        setLoggedIn(false)
        setFeedback({ type: 'error', text: 'Økten er utløpt. Logg inn på nytt.' })
      } else {
        setFeedback({ type: 'error', text: error.message })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section id="festivalsjef" className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionTitle
            eyebrow="Festivalsjef"
            title="Sett opp foredragsprogrammet"
            subtitle="Som festivalsjef kan du koble bedrifter med foredrag til Auditorium A eller Auditorium B og velge tidspunkt. Endringene lagres på serveren og vises automatisk i programmet."
          />
        </Reveal>

        {!backendOk && (
          <Reveal>
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 ring-1 ring-amber-100">
              Serveren svarer ikke akkurat nå. Endringer kan ikke lagres før
              backend er tilgjengelig.
            </p>
          </Reveal>
        )}

        {!loggedIn ? (
          // Locked state with login form for the festival manager.
          <Reveal className="mx-auto w-full max-w-md">
            <div className="card-lift flex flex-col gap-6 p-6 ring-1 ring-slate-100 sm:p-8">
              <div className="flex flex-col gap-2 text-center">
                <span
                  aria-hidden="true"
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl"
                >
                  🔒
                </span>
                <h3 className="text-lg font-semibold text-navy-900">
                  Kun for festivalsjef
                </h3>
                <p className="text-sm text-slate-600">
                  Logg inn for å endre rom og tidspunkt i programmet.
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="fs-brukernavn" className={labelClass}>
                    Brukernavn
                  </label>
                  <input
                    id="fs-brukernavn"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="fs-passord" className={labelClass}>
                    Passord
                  </label>
                  <input
                    id="fs-passord"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={fieldClass}
                  />
                </div>

                {loginError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100"
                  >
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loggingIn || !username || !password}
                  className="btn-blue w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loggingIn ? 'Logger inn …' : 'Logg inn'}
                </button>
              </form>
            </div>
          </Reveal>
        ) : (
          // Logged-in state: status bar, change form and updated program.
          <>
            <Reveal className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-emerald-500"
                />
                Innlogget som festivalsjef
              </span>
              <button type="button" onClick={handleLogout} className="btn-ghost !py-2">
                Logg ut
              </button>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {/* Change form */}
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
                        {companyId
                          ? '– Velg foredrag –'
                          : '– Velg bedrift først –'}
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
                          : feedback.type === 'error'
                            ? 'bg-red-50 text-red-700 ring-1 ring-red-100'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                      }`}
                    >
                      {feedback.text}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving || !lectureId || !rom || !tidspunkt}
                      className="btn-blue disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? 'Lagrer …' : 'Lagre endring'}
                    </button>
                    {hasOverrides && (
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={saving}
                        className="btn-ghost disabled:opacity-50"
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
                          className={
                            lecture.endret ? 'bg-emerald-50/60' : 'bg-white'
                          }
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
                  Endringer markeres som «Endret» og vises også i
                  program-seksjonen.
                </p>
              </Reveal>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default FestivalManagerSection
