import SectionTitle from '../components/SectionTitle.jsx'
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
    <section id="info" className="bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6">
        <SectionTitle
          eyebrow="Praktisk info"
          title="Nyttig å vite før du kommer"
          subtitle="Det viktigste du trenger å vite om registrering, nettverk, oppmøte og utstyr."
        />

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {infoCards.map((card) => (
            <li
              key={card.title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {card.icon}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {card.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default PracticalInfoSection
