import { useEffect, useState } from 'react'
import {
  apiGetRegistrations,
  apiDeleteRegistration,
  apiClearRegistrations,
  clearToken,
} from '../utils/apiClient.js'

function formatDate(iso) {
  if (!iso) return '–'
  const d = new Date(iso)
  return d.toLocaleString('nb-NO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function RegistrationsList({ onLogout }) {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [deleting, setDeleting] = useState(null)
  // Increment to trigger a re-fetch without useCallback/setState-in-effect
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await apiGetRegistrations()
        if (!active) return
        setRegistrations(data || [])
      } catch (err) {
        if (!active) return
        if (err.status === 401) {
          clearToken()
          onLogout()
        } else {
          setError('Kunne ikke hente påmeldinger. Prøv igjen.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [onLogout, refreshKey])

  const handleRefresh = () => {
    setConfirmClearAll(false)
    setRefreshKey((k) => k + 1)
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await apiDeleteRegistration(id)
      setRegistrations((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      if (err.status === 401) {
        clearToken()
        onLogout()
      } else {
        setError('Kunne ikke slette påmelding.')
      }
    } finally {
      setDeleting(null)
    }
  }

  const handleClearAll = async () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true)
      return
    }
    try {
      await apiClearRegistrations()
      setRegistrations([])
      setConfirmClearAll(false)
    } catch (err) {
      if (err.status === 401) {
        clearToken()
        onLogout()
      } else {
        setError('Kunne ikke slette alle påmeldinger.')
      }
    }
  }

  const searchLower = search.toLowerCase()
  const filtered = registrations.filter((r) => {
    if (!searchLower) return true
    return (
      r.navn?.toLowerCase().includes(searchLower) ||
      r.epost?.toLowerCase().includes(searchLower) ||
      r.klasse?.toLowerCase().includes(searchLower) ||
      r.bedriftNavn?.toLowerCase().includes(searchLower) ||
      r.workshopTittel?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">Påmeldinger</h3>
          <p className="text-sm text-slate-500">
            Totalt antall påmeldinger:{' '}
            <span className="font-semibold text-slate-700">{registrations.length}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="btn-ghost !py-2 !text-sm disabled:opacity-50"
          >
            {loading ? 'Laster …' : 'Oppdater liste'}
          </button>
          {registrations.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className={`!py-2 !text-sm rounded-xl px-4 font-semibold transition ${
                confirmClearAll
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 ring-1 ring-red-200'
              }`}
            >
              {confirmClearAll ? 'Bekreft: slett alle' : 'Slett alle'}
            </button>
          )}
          {confirmClearAll && (
            <button
              type="button"
              onClick={() => setConfirmClearAll(false)}
              className="!py-2 !text-sm btn-ghost"
            >
              Avbryt
            </button>
          )}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100"
        >
          {error}
        </p>
      )}

      {/* Search */}
      <div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Søk etter navn, e-post, klasse, bedrift …"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:max-w-sm"
        />
        {search && (
          <p className="mt-1.5 text-xs text-slate-500">
            {filtered.length} av {registrations.length} treff
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Henter påmeldinger …</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">
          {registrations.length === 0
            ? 'Ingen påmeldinger er registrert ennå.'
            : 'Ingen treff på søket.'}
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Tidspunkt</th>
                  <th className="px-4 py-3">Navn</th>
                  <th className="px-4 py-3">Klasse</th>
                  <th className="px-4 py-3">E-post</th>
                  <th className="px-4 py-3">Bedrift</th>
                  <th className="px-4 py-3">Workshop</th>
                  <th className="px-4 py-3">Ønsket tid</th>
                  <th className="px-4 py-3">Kvittering</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-navy-900">{r.navn}</td>
                    <td className="px-4 py-3">{r.klasse}</td>
                    <td className="px-4 py-3 text-brand-600">{r.epost}</td>
                    <td className="px-4 py-3">{r.bedriftNavn}</td>
                    <td className="px-4 py-3">{r.workshopTittel}</td>
                    <td className="whitespace-nowrap px-4 py-3">{r.tidspunkt}</td>
                    <td className="px-4 py-3">
                      {r.emailSent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                          ✓ Sendt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          Ikke sendt
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === r.id ? '…' : 'Slett'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-4 lg:hidden">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy-900">{r.navn}</p>
                    <p className="text-xs text-slate-500">{r.klasse} · {formatDate(r.createdAt)}</p>
                  </div>
                  {r.emailSent ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      ✓ Kvittering sendt
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      Ikke sendt
                    </span>
                  )}
                </div>
                <dl className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400">E-post</dt>
                    <dd className="text-right text-brand-600">{r.epost}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400">Bedrift</dt>
                    <dd className="text-right font-medium">{r.bedriftNavn}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400">Workshop</dt>
                    <dd className="text-right">{r.workshopTittel}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400">Ønsket tidspunkt</dt>
                    <dd className="text-right">{r.tidspunkt}</dd>
                  </div>
                  {r.kommentar && (
                    <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      <span className="font-semibold">Kommentar:</span> {r.kommentar}
                    </div>
                  )}
                </dl>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="mt-4 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === r.id ? 'Sletter …' : 'Slett påmelding'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RegistrationsList
