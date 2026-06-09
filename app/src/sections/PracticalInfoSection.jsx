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
    <section id="info" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy-800 px-6 py-16 text-white shadow-2xl shadow-navy-900/30 sm:px-12 lg:px-16">
          {/* Decorative texture + floating glow */}
          <div
            aria-hidden="true"
            className="bg-dot-grid pointer-events-none absolute inset-0 opacity-70"
          />
          <div
            aria-hidden="true"
            className="animate-float-slow pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="animate-float pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
          />

          <div className="relative flex flex-col gap-10">
            <Reveal>
              <div className="flex max-w-2xl flex-col items-start gap-4 text-left">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-white/15">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-gold-400"
                  />
                  Praktisk info
                </span>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                  Nyttig å vite før du kommer
                </h2>
                <p className="text-base leading-relaxed text-brand-100 sm:text-lg">
                  Det viktigste du trenger å vite om registrering, nettverk,
                  oppmøte og utstyr.
                </p>
              </div>
            </Reveal>

            {/* Atmosphere image from a previous IT event */}
            <Reveal className="overflow-hidden rounded-3xl shadow-2xl shadow-navy-900/40 ring-1 ring-white/10">
              <img
                src="/images/it-event.jpg"
                alt="Publikum samlet under et IT-arrangement"
                loading="lazy"
                className="h-56 w-full object-cover sm:h-72"
              />
            </Reveal>

            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {infoCards.map((card, index) => (
                <Reveal as="li" key={card.title} delay={index * 80}>
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12]">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400/20 text-2xl ring-1 ring-gold-400/30"
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

            <Reveal className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
              <p className="text-base font-medium text-white">
                Klar for festivaldagen?
              </p>
              <a href="#pamelding" className="btn-primary">
                Meld meg på
              </a>
              <a href="#program" className="btn-light">
                Se programmet
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PracticalInfoSection
