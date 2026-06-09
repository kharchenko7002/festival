import Reveal from '../components/Reveal.jsx'
import { getFestival } from '../utils/dataHelpers.js'

// Practical information for visitors: registration, Wi-Fi, meeting point,
// what to bring and how to reach festival staff.
function PracticalInfoSection() {
  const festival = getFestival()

  const infoCards = [
    {
      icon: '📝',
      title: 'Registrering',
      text: 'Registrer deg i resepsjonen ved inngangen når du ankommer. Du får et navnskilt og et program for dagen.',
    },
    {
      icon: '📶',
      title: 'Wi-Fi',
      text: 'Gratis gjeste-Wi-Fi er tilgjengelig i alle bygg. Nettverksnavn og passord henger oppe i hvert rom.',
    },
    {
      icon: '📍',
      title: 'Oppmøte',
      text: `Vi møtes ved hovedinngangen til ${festival.bygning} på ${festival.sted}. Følg skilting til riktig område.`,
    },
    {
      icon: '💻',
      title: 'Ta med PC',
      text: 'Til workshops anbefaler vi at du tar med egen bærbar PC. Noen rom har PC-er, men antallet er begrenset.',
    },
    {
      icon: '🕒',
      title: 'Åpningstider',
      text: `Festivalen er åpen fra ${festival.startTid} til ${festival.sluttTid}. Foredrag og workshops starter til faste klokkeslett.`,
    },
    {
      icon: '🙋',
      title: 'Kontakt festivalstaben',
      text: 'Elever med navnskilt og festivalstab står klare i fellesarealet og hjelper deg å finne fram.',
    },
  ]

  return (
    <section
      id="info"
      className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 text-white"
    >
      {/* Decorative floating glow */}
      <div
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-accent-400/15 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <div className="flex max-w-2xl flex-col items-start gap-4 text-left">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-400" />
              Praktisk info
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Nyttig å vite før du kommer
            </h2>
            <p className="text-base leading-relaxed text-brand-100 sm:text-lg">
              Det viktigste du trenger å vite om registrering, nettverk, oppmøte
              og utstyr.
            </p>
          </div>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {infoCards.map((card, index) => (
            <Reveal as="li" key={card.title} delay={index * 80}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl"
                >
                  {card.icon}
                </span>
                <h3 className="text-lg font-semibold text-white">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-100">
                  {card.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default PracticalInfoSection
