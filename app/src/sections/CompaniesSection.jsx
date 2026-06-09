import { useMemo, useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import { getCompanies } from '../utils/dataHelpers.js'

// Build a short monogram (max two letters) from a company name for the logo tile
function getMonogram(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// Companies section: grid of exhibitors with search by name or industry.
function CompaniesSection() {
  const [query, setQuery] = useState('')

  const companies = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (text === '') return getCompanies()
    return getCompanies().filter(
      (company) =>
        company.navn.toLowerCase().includes(text) ||
        company.bransje.toLowerCase().includes(text),
    )
  }, [query])

  return (
    <section id="bedrifter" className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <SectionTitle
            eyebrow="Bedrifter"
            title="Bedrifter på festivalen"
            subtitle="Bli kjent med IT-bedriftene som stiller med stand. Søk på navn eller bransje for å finne dem du vil møte."
          />
        </Reveal>

        <div className="max-w-md">
          <SearchInput
            id="bedrift-sok"
            label="Søk etter bedrift"
            value={query}
            onChange={setQuery}
            placeholder="Søk på navn eller bransje …"
          />
        </div>

        <p className="text-sm text-slate-500" aria-live="polite">
          Viser {companies.length} av {getCompanies().length} bedrifter
        </p>

        {companies.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-brand-50 p-8 text-center text-slate-500">
            Ingen bedrifter passer med søket ditt.
          </p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <li
                key={company.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-base font-bold text-white shadow-sm"
                    >
                      {getMonogram(company.navn)}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {company.navn}
                      </h3>
                      <p className="text-sm text-slate-500">{company.bransje}</p>
                    </div>
                  </div>
                  <Badge variant="neutral">Stand {company.standnummer}</Badge>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  {company.beskrivelse}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  {company.harForedrag ? (
                    <Badge variant="success">Holder foredrag</Badge>
                  ) : (
                    <Badge variant="neutral">Kun stand</Badge>
                  )}
                  <a
                    href={company.nettside}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-sm font-medium text-brand-600 underline-offset-4 hover:underline"
                  >
                    Nettside ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default CompaniesSection
