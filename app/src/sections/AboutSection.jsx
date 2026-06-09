import SectionTitle from '../components/SectionTitle.jsx'

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
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
        <SectionTitle
          eyebrow="Om festivalen"
          title="Hva er 2INF Festival?"
          subtitle="2INF Festival er en karriere- og teknologifestival arrangert av elevene i VG2 Informasjonsteknologi. Målet er å koble elever, bedrifter og fagmiljøer sammen gjennom foredrag, workshops og utstillinger – og gi et realistisk innblikk i arbeidslivet innen IT."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-brand-200 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
