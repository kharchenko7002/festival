import { useEffect, useMemo, useState } from 'react'
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
  apiGetOverrides,
  apiSaveOverride,
  apiResetOverrides,
  clearToken,
  notifyOverridesChanged,
} from '../utils/apiClient.js'
import AdminProgramTable from './AdminProgramTable.jsx'
import AdminStatusCard from './AdminStatusCard.jsx'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700'

function ProgramEditor({ onLogout }) {
  const companies = getLectureCompanies()
  const rooms = getAuditoriumRooms()
  const timeSlots = getProgramTimeSlots()

  const [companyId, setCompanyId] = useState('')
  const [lectureId, setLectureId] = useState('')
  const [rom, setRom] = useState('')
  const [tidspunkt, setTidspunkt] = useState('')
  const [ledigePlasser, setLedigePlasser] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [saving, setSaving] = useState(false)
  const [overrides, setOverrides] = useState({})
  const [backendOk, setBackendOk] = useState(true)

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
    return () => {
      active = false
    }
  }, [])

  const program = useMemo(() => {
    const merged = mergeProgramWithOverrides(overrides)
    return [...merged].sort((a, b) => a.startTid.localeCompare(b.startTid))
  }, [overrides])

  const lectureOptions = useMemo(
    () => (companyId ? getLectureOptions(companyId) : []),
    [companyId],
  )

  const selectedLecture = useMemo(
    () => program.find((l) => l.id === Number(lectureId)) ?? null,
    [program, lectureId],
  )

  const hasOverrides = Object.keys(overrides).length > 0

  const handleCompanyChange = (e) => {
    setCompanyId(e.target.value)
    setLectureId('')
    setRom('')
    setTidspunkt('')
    setLedigePlasser('')
    setFeedback(null)
  }

  const handleLectureChange = (e) => {
    const id = e.target.value
    setLectureId(id)
    setFeedback(null)
    const lecture = program.find((l) => l.id === Number(id))
    setRom(lecture?.rom ?? '')
    setTidspunkt(lecture?.startTid ?? '')
    setLedigePlasser(
      lecture?.ledigePlasser !== undefined ? String(lecture.ledigePlasser) : '',
    )
  }

  const validateLedigePlasser = () => {
    if (ledigePlasser === '') return null
    const val = Number(ledigePlasser)
    if (!Number.isInteger(val) || isNaN(val)) return 'Ledige plasser må være et tall.'
    if (val < 0 || (selectedLecture && val > selectedLecture.maksPlasser))
      return 'Ledige plasser kan ikke være lavere enn 0 eller høyere enn maks kapasitet.'
    return null
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!lectureId || !rom || !tidspunkt) return

    const lpError = validateLedigePlasser()
    if (lpError) {
      setFeedback({ type: 'error', text: lpError })
      return
    }

    const slot = timeSlots.find((s) => s.startTid === tidspunkt)
    if (!slot) return

    if (hasRoomTimeConflict(rom, slot.startTid, lectureId, overrides)) {
      setFeedback({
        type: 'error',
        text: 'Dette tidspunktet er allerede opptatt i valgt rom.',
      })
      return
    }

    setSaving(true)
    try {
      const payload = {
        lectureId: Number(lectureId),
        rom,
        startTid: slot.startTid,
        sluttTid: slot.sluttTid,
      }
      if (ledigePlasser !== '') payload.ledigePlasser = Number(ledigePlasser)

      const updated = await apiSaveOverride(payload)
      setOverrides(updated || {})
      setBackendOk(true)
      notifyOverridesChanged()
      setFeedback({
        type: 'success',
        text: `Lagret: «${selectedLecture?.tittel}» er satt til ${rom} kl. ${slot.startTid}–${slot.sluttTid}.`,
      })
    } catch (err) {
      if (err.status === 401) {
        clearToken()
        onLogout()
      } else {
        setFeedback({ type: 'error', text: err.message })
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
    } catch (err) {
      if (err.status === 401) {
        clearToken()
        onLogout()
      } else {
        setFeedback({ type: 'error', text: err.message })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminStatusCard
        overridesCount={Object.keys(overrides).length}
        onLogout={onLogout}
      />

      {!backendOk && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 ring-1 ring-amber-100">
          Serveren svarer ikke akkurat nå. Endringer kan ikke lagres.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-5 text-lg font-semibold text-navy-900">
            Tildel rom, tidspunkt og ledige plasser
          </h3>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label htmlFor="pe-bedrift" className={labelClass}>
                Velg bedrift
              </label>
              <select
                id="pe-bedrift"
                value={companyId}
                onChange={handleCompanyChange}
                className={fieldClass}
              >
                <option value="">– Velg bedrift –</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.navn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pe-foredrag" className={labelClass}>
                Velg foredrag
              </label>
              <select
                id="pe-foredrag"
                value={lectureId}
                onChange={handleLectureChange}
                disabled={!companyId}
                className={fieldClass}
              >
                <option value="">
                  {companyId ? '– Velg foredrag –' : '– Velg bedrift først –'}
                </option>
                {lectureOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pe-rom" className={labelClass}>
                Velg rom
              </label>
              <select
                id="pe-rom"
                value={rom}
                onChange={(e) => {
                  setRom(e.target.value)
                  setFeedback(null)
                }}
                disabled={!lectureId}
                className={fieldClass}
              >
                <option value="">– Velg rom –</option>
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pe-tid" className={labelClass}>
                Velg tidspunkt
              </label>
              <select
                id="pe-tid"
                value={tidspunkt}
                onChange={(e) => {
                  setTidspunkt(e.target.value)
                  setFeedback(null)
                }}
                disabled={!lectureId}
                className={fieldClass}
              >
                <option value="">– Velg tidspunkt –</option>
                {timeSlots.map((s) => (
                  <option key={s.startTid} value={s.startTid}>
                    {s.startTid}–{s.sluttTid}
                  </option>
                ))}
              </select>
            </div>

            {selectedLecture && (
              <div>
                <label htmlFor="pe-ledige" className={labelClass}>
                  Ledige plasser
                  <span className="ml-2 font-normal text-slate-400">
                    (maks {selectedLecture.maksPlasser})
                  </span>
                </label>
                <input
                  id="pe-ledige"
                  type="number"
                  min="0"
                  max={selectedLecture.maksPlasser}
                  value={ledigePlasser}
                  onChange={(e) => {
                    setLedigePlasser(e.target.value)
                    setFeedback(null)
                  }}
                  placeholder={`0 – ${selectedLecture.maksPlasser}`}
                  className={fieldClass}
                />
              </div>
            )}

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

          {selectedLecture && (
            <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
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
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Maks kapasitet</dt>
                  <dd>{selectedLecture.maksPlasser}</dd>
                </div>
                {ledigePlasser !== '' && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Ledige plasser</dt>
                    <dd className="font-medium text-brand-700">
                      {ledigePlasser} av {selectedLecture.maksPlasser} ledige
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        <AdminProgramTable program={program} />
      </div>
    </div>
  )
}

export default ProgramEditor
