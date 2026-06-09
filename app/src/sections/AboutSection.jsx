import SectionTitle from '../components/SectionTitle.jsx'
import Reveal from '../components/Reveal.jsx'

// Short, informative cards describing what the festival offers.
const features = [
  {
    icon: '🎤',
    title: 'Foredrag fra bransjen',
    text: 'Fagfolk fra ledende IT-bedrifter deler erfaringer om utvikling, drift, sikkerhet og karriere.',
  },
  {
    icon: '🛠️',
    title: 'Praktiske workshops',
    text: 'Test teknologi i praksis – fra React og Docker til nettverk, databaser og versjonskontroll.',
  },
  {
    icon: '🤝',
    title: 'Møt bedriftene',
    text: 'Besøk stands, still spørsmål og bli kjent med mulige lærling- og jobbmuligheter i regionen.',
  },
]

// "About" section explaining the purpose of the 2INF Festival.
function AboutSection() {
  return (
    <section id="om" className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <SectionTitle
            eyebrow="Om festivalen"
            title="Hva er 2INF Festival?"
            subtitle="2INF Festival er en karriere- og teknologifestival arrangert av elevene i VG2 Informasjonsteknologi. Målet er å koble elever, bedrifter og fagmiljøer sammen gjennom foredrag, workshops og utstillinger – og gi et realistisk innblikk i arbeidslivet innen IT."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal as="article" key={feature.title} delay={index * 120}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl"
                  >
                    {feature.icon}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-sm font-bold tracking-widest text-slate-200"
                  >
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {feature.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
