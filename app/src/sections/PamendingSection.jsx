import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import {
  getCompanyOptions,
  getWorkshopOptions,
  getAvailableTimeSlots,
  getWorkshopDetails,
  getCompanyDetails,
} from '../utils/dataHelpers.js'

// Shared styling for the form controls so every field looks consistent.
const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200'
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700'

// The empty form state, reused when the visitor wants to register again.
const emptyForm = {
  navn: '',
  klasse: '',
  epost: '',
  bedrift: '',
  workshop: '',
  tidspunkt: '',
  kommentar: '',
}

// Front-end-only registration ("Påmelding") section.
// This is a prototype: nothing is sent to a server. On submit we simply show
// a confirmation message. The dropdowns are populated from the festival data.
function PamendingSection() {
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  // Dropdown options sourced from datasett.json via the data helpers
  const companyOptions = getCompanyOptions()
  const workshopOptions = getWorkshopOptions()
  const timeSlots = getAvailableTimeSlots()

  // Live summaries for the current selection (null when nothing is chosen)
  const workshopDetails = form.workshop ? getWorkshopDetails(form.workshop) : null
  const companyDetails = form.bedrift ? getCompanyDetails(form.bedrift) : null

  // Update a single field by name
  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  // Prototype submit: no network request, just show the confirmation
  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  // Reset the form so the visitor can register another person
  const handleReset = () => {
    setForm(emptyForm)
    setSubmitted(false)
  }

  return (
    <section id="pamelding" className="relative overflow-hidden bg-navy-800 text-white">
      {/* Decorative texture + floating glow, matching the other navy blocks */}
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        {/* Heading + short explanation */}
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-white/15">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Påmelding
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Meld deg på festivalen
            </h2>
            <p className="text-base leading-relaxed text-brand-100 sm:text-lg">
              Sikre deg plass på foredrag og workshops. Fyll ut skjemaet under,
              så er du klar for festivaldagen. Dette er en prototype – ingen data
              sendes til en server.
            </p>
          </div>
        </Reveal>

        {/* White card holding the form */}
        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-white p-6 text-slate-800 shadow-2xl shadow-navy-900/40 sm:p-10">
            {submitted ? (
              // Confirmation shown after a prototype submit
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl ring-1 ring-emerald-100"
                >
                  ✓
                </span>
                <h3 className="text-2xl font-bold text-navy-900">
                  Takk! Din påmelding er registrert i prototypen.
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-slate-600">
                  Dette er kun en demonstrasjon, så ingenting er lagret eller
                  sendt videre. Du kan melde på en til om du ønsker.
                </p>
                <button type="button" onClick={handleReset} className="btn-blue mt-2">
                  Meld på en til
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Navn */}
                  <div>
                    <label htmlFor="navn" className={labelClass}>
                      Navn
                    </label>
                    <input
                      id="navn"
                      name="navn"
                      type="text"
                      required
                      value={form.navn}
                      onChange={handleChange}
                      placeholder="For- og etternavn"
                      className={fieldClass}
                    />
                  </div>

                  {/* Klasse */}
                  <div>
                    <label htmlFor="klasse" className={labelClass}>
                      Klasse
                    </label>
                    <input
                      id="klasse"
                      name="klasse"
                      type="text"
                      required
                      value={form.klasse}
                      onChange={handleChange}
                      placeholder="F.eks. 2INF"
                      className={fieldClass}
                    />
                  </div>

                  {/* E-post */}
                  <div className="sm:col-span-2">
                    <label htmlFor="epost" className={labelClass}>
                      E-post
                    </label>
                    <input
                      id="epost"
                      name="epost"
                      type="email"
                      required
                      value={form.epost}
                      onChange={handleChange}
                      placeholder="navn@eksempel.no"
                      className={fieldClass}
                    />
                  </div>

                  {/* Velg bedrift */}
                  <div>
                    <label htmlFor="bedrift" className={labelClass}>
                      Velg bedrift
                    </label>
                    <select
                      id="bedrift"
                      name="bedrift"
                      value={form.bedrift}
                      onChange={handleChange}
                      className={fieldClass}
                    >
                      <option value="">– Velg bedrift –</option>
                      {companyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Velg workshop */}
                  <div>
                    <label htmlFor="workshop" className={labelClass}>
                      Velg workshop
                    </label>
                    <select
                      id="workshop"
                      name="workshop"
                      value={form.workshop}
                      onChange={handleChange}
                      className={fieldClass}
                    >
                      <option value="">– Velg workshop –</option>
                      {workshopOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ønsket tidspunkt */}
                  <div className="sm:col-span-2">
                    <label htmlFor="tidspunkt" className={labelClass}>
                      Ønsket tidspunkt
                    </label>
                    <select
                      id="tidspunkt"
                      name="tidspunkt"
                      value={form.tidspunkt}
                      onChange={handleChange}
                      className={fieldClass}
                    >
                      <option value="">– Velg tidspunkt –</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Kommentar / behov */}
                  <div className="sm:col-span-2">
                    <label htmlFor="kommentar" className={labelClass}>
                      Kommentar / behov
                    </label>
                    <textarea
                      id="kommentar"
                      name="kommentar"
                      rows={4}
                      value={form.kommentar}
                      onChange={handleChange}
                      placeholder="Har du spesielle behov eller spørsmål? Skriv det her."
                      className={`${fieldClass} resize-y`}
                    />
                  </div>
                </div>

                {/* Live summaries based on the current selection */}
                {(workshopDetails || companyDetails) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {workshopDetails && (
                      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-700">
                          Valgt workshop
                        </p>
                        <h4 className="text-base font-semibold text-navy-900">
                          {workshopDetails.tittel}
                        </h4>
                        <dl className="mt-3 flex flex-col gap-1.5 text-sm text-slate-600">
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-400">Bedrift</dt>
                            <dd className="text-right font-medium text-slate-700">
                              {workshopDetails.bedrift}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-400">Rom</dt>
                            <dd className="text-right">{workshopDetails.rom}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-400">Tid</dt>
                            <dd className="text-right">{workshopDetails.tid}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-400">Maks deltakere</dt>
                            <dd className="text-right">
                              {workshopDetails.maksPlasser}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-400">Forkunnskaper</dt>
                            <dd className="text-right">
                              {workshopDetails.forkunnskaper}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {companyDetails && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-700">
                          Valgt bedrift
                        </p>
                        <h4 className="text-base font-semibold text-navy-900">
                          {companyDetails.navn}
                        </h4>
                        <dl className="mt-3 flex flex-col gap-1.5 text-sm text-slate-600">
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-400">Bransje</dt>
                            <dd className="text-right font-medium text-slate-700">
                              {companyDetails.bransje}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-400">Standnummer</dt>
                            <dd className="text-right">
                              {companyDetails.standnummer}
                            </dd>
                          </div>
                          {companyDetails.nettside && (
                            <div className="flex justify-between gap-3">
                              <dt className="text-slate-400">Nettside</dt>
                              <dd className="text-right">
                                <a
                                  href={companyDetails.nettside}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="break-all font-medium text-brand-600 underline-offset-4 hover:underline"
                                >
                                  Besøk nettside
                                </a>
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" className="btn-blue w-full sm:w-fit sm:self-start">
                  Send påmelding
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default PamendingSection
