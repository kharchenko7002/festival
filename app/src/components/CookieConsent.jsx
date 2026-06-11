import { useState } from 'react'

// Key used to remember the visitor's cookie choice between visits
const STORAGE_KEY = '2inf-informasjonskapsler-samtykke'

// Read any previously saved choice. Returns true when the banner should show
// (no choice made yet). Safe if localStorage is unavailable.
function skalVises() {
  if (typeof window === 'undefined') return false
  try {
    return !window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return true
  }
}

// Cookie consent banner. Shows once until the visitor accepts or declines,
// then stores the choice in localStorage so it does not appear again.
// Styled to match the SaaS landing design (navy/blue with a gold accent).
function CookieConsent() {
  // Decide visibility once, from the stored choice
  const [visible, setVisible] = useState(skalVises)

  // Persist the choice and hide the banner
  const settValg = (valg) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, valg)
    } catch {
      // Ignore storage errors – the banner still closes for this visit
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-tittel"
      aria-describedby="cookie-tekst"
      className="animate-fade-up fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl shadow-navy-900/25 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl ring-1 ring-brand-100"
        >
          🍪
        </span>

        <div className="flex-1">
          <h2
            id="cookie-tittel"
            className="text-base font-semibold text-navy-900"
          >
            Vi bruker informasjonskapsler
          </h2>
          <p id="cookie-tekst" className="mt-1 text-sm leading-relaxed text-slate-600">
            Vi bruker informasjonskapsler for å huske valgene dine og forbedre
            opplevelsen på nettsiden. Du kan godta eller avslå.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => settValg('avslatt')}
            className="btn-ghost !py-2.5 !text-sm"
          >
            Avslå
          </button>
          <button
            type="button"
            onClick={() => settValg('godtatt')}
            className="btn-primary !py-2.5 !text-sm"
          >
            Godta
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
