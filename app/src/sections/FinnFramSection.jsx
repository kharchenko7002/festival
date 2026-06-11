import { useMemo, useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'

// Wayfinding data for the festival. This is physical location info (not part of
// datasett.json), used to help visitors find their way around the venue.
const steder = [
  {
    id: 'auditorium-a',
    navn: 'Auditorium A',
    type: 'Foredrag',
    ikon: '🎤',
    bruk: 'Brukes til foredrag fra bedriftene gjennom hele dagen.',
    beliggenhet: 'Hovedbygget, første etasje.',
    veibeskrivelse:
      'Følg skilting fra hovedinngangen rett fram til auditoriefløyen.',
    info: 'Storskjerm, lydanlegg og mikrofon. Kom i god tid til populære foredrag.',
  },
  {
    id: 'auditorium-b',
    navn: 'Auditorium B',
    type: 'Foredrag',
    ikon: '🎤',
    bruk: 'Det andre foredragsrommet, kjøres parallelt med Auditorium A.',
    beliggenhet: 'Hovedbygget, ved siden av Auditorium A.',
    veibeskrivelse:
      'Gå mot Auditorium A fra hovedinngangen; Auditorium B ligger like ved.',
    info: 'Storskjerm og lydanlegg. Sjekk programmet for hvilket foredrag som går her.',
  },
  {
    id: 'toaletter',
    navn: 'Toaletter',
    type: 'Fasiliteter',
    ikon: '🚻',
    bruk: 'Toalettfasiliteter for besøkende.',
    beliggenhet: 'Ved hovedinngangen og ved spiseområdet.',
    veibeskrivelse:
      'Nærmeste toalett finner du rett innenfor hovedinngangen, og et sett til ved kantinen.',
    info: 'Universelt utformet toalett finnes ved hovedinngangen.',
  },
  {
    id: 'spiseomrade',
    navn: 'Spiseområde',
    type: 'Mat',
    ikon: '🍽️',
    bruk: 'Område for mat, drikke og pauser.',
    beliggenhet: 'Kantinen i fellesarealet.',
    veibeskrivelse:
      'Følg skilting mot «Kantine/Fellesareal» fra hovedinngangen.',
    info: 'Sitteplasser, mat og drikke. Et naturlig møtepunkt mellom foredragene.',
  },
  {
    id: 'bedriftsstands',
    navn: 'Bedriftsstands',
    type: 'Stands',
    ikon: '🏷️',
    bruk: 'Bedriftene har stands der du kan snakke med dem om jobb og lærlingplass.',
    beliggenhet: 'Standområdet i fellesarealet, nær spiseområdet.',
    veibeskrivelse:
      'Standene er nummerert (B01–B20). Bruk standnummeret fra bedriftsoversikten.',
    info: 'Ta med spørsmål – mange bedrifter deler ut info om sommerjobb og lærlingplass.',
  },
  {
    id: 'informasjonspunkt',
    navn: 'Informasjonspunkt',
    type: 'Info',
    ikon: 'ℹ️',
    bruk: 'Her får du hjelp, svar på spørsmål og oversikt over dagen.',
    beliggenhet: 'Rett innenfor hovedinngangen.',
    veibeskrivelse: 'Det første du møter når du kommer inn hovedinngangen.',
    info: 'Spør vertskapet (elever fra 2INF) hvis du lurer på noe.',
  },
  {
    id: 'workshoprom',
    navn: 'Workshoprom',
    type: 'Workshop',
    ikon: '💻',
    bruk: 'Rom for praktiske workshops med begrenset antall plasser.',
    beliggenhet: 'Teknologibygget og Mediebygget.',
    veibeskrivelse:
      'Følg skilting til Teknologibygget. Rommet for din workshop står i workshop-oversikten.',
    info: 'Meld deg på i forkant – plassene er begrenset.',
  },
]

// Filter categories, "Alle" first.
const kategorier = ['Alle', ...new Set(steder.map((sted) => sted.type))]

// "Finn fram" section: an interactive internal map/overview that helps
// visitors locate rooms, toilets, the food area and other places.
function FinnFramSection() {
  const [filter, setFilter] = useState('Alle')
  const [valgtId, setValgtId] = useState(steder[0].id)

  const synlige = useMemo(
    () =>
      filter === 'Alle'
        ? steder
        : steder.filter((sted) => sted.type === filter),
    [filter],
  )

  const valgt = steder.find((sted) => sted.id === valgtId) ?? null

  return (
    <section id="finn-fram" className="bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionTitle
            eyebrow="Finn fram"
            title="Slik finner du fram på festivalen"
            subtitle="Velg et sted for å se hva det brukes til, hvor det ligger og hvordan du kommer dit. Filtrer på type for å finne det du leter etter raskt."
          />
        </Reveal>

        {/* Type filter */}
        <Reveal className="flex flex-wrap gap-2">
          {kategorier.map((kategori) => {
            const aktiv = filter === kategori
            return (
              <button
                key={kategori}
                type="button"
                onClick={() => setFilter(kategori)}
                aria-pressed={aktiv}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  aktiv
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:text-brand-700'
                }`}
              >
                {kategori}
              </button>
            )
          })}
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Place cards */}
          <ul className="grid gap-4 sm:grid-cols-2">
            {synlige.map((sted) => {
              const aktiv = sted.id === valgtId
              return (
                <li key={sted.id}>
                  <button
                    type="button"
                    onClick={() => setValgtId(sted.id)}
                    aria-pressed={aktiv}
                    className={`card-lift flex h-full w-full flex-col gap-3 p-5 text-left transition ${
                      aktiv
                        ? 'ring-2 ring-brand-500'
                        : 'ring-1 ring-slate-100 hover:ring-brand-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl"
                      >
                        {sted.ikon}
                      </span>
                      <Badge variant={aktiv ? 'brand' : 'neutral'}>
                        {sted.type}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-navy-900">
                      {sted.navn}
                    </h3>
                    <p className="text-sm text-slate-500">{sted.beliggenhet}</p>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Detail panel for the selected place */}
          <Reveal
            as="aside"
            aria-live="polite"
            className="h-fit lg:sticky lg:top-28"
          >
            {valgt && (
              <div className="card-lift flex flex-col gap-5 p-6 ring-1 ring-brand-100">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-2xl"
                  >
                    {valgt.ikon}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-navy-900">
                      {valgt.navn}
                    </h3>
                    <Badge variant="brand">{valgt.type}</Badge>
                  </div>
                </div>

                <dl className="flex flex-col gap-4 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-700">
                      Hva brukes det til?
                    </dt>
                    <dd className="mt-1 text-slate-600">{valgt.bruk}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Hvor ligger det?</dt>
                    <dd className="mt-1 text-slate-600">{valgt.beliggenhet}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Veibeskrivelse</dt>
                    <dd className="mt-1 text-slate-600">{valgt.veibeskrivelse}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Nyttig å vite</dt>
                    <dd className="mt-1 text-slate-600">{valgt.info}</dd>
                  </div>
                </dl>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default FinnFramSection
