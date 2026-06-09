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

// Bullet points highlighted next to the illustration
const points = [
  'Arrangert av elevene i VG2 Informasjonsteknologi',
  'Foredrag, workshops og utstillinger på ett sted',
  'Realistisk innblikk i arbeidslivet innen IT',
]

// "About" section explaining the purpose of the 2INF Festival.
// Two-column intro (text + Tailwind illustration) followed by feature cards.
function AboutSection() {
  return (
    <section id="om" className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-24 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: heading, text and key points */}
          <Reveal className="flex flex-col gap-6">
            <SectionTitle
              eyebrow="Om festivalen"
              title="Hva er 2INF Festival?"
              subtitle="En karriere- og teknologifestival der elever, bedrifter og fagmiljøer møtes gjennom foredrag, workshops og utstillinger."
            />
            <ul className="flex flex-col gap-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 ring-1 ring-brand-100"
                  >
                    ✓
                  </span>
                  <span className="text-base leading-relaxed text-slate-600">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <a href="#program" className="btn-blue w-fit">
              Se hele programmet
            </a>
          </Reveal>

          {/* Right: Tailwind illustration card (decorative) */}
          <Reveal delay={120} className="relative">
            {/* Soft glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-100 to-accent-300/40 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-navy-900/10"
            >
              {/* Mock "festivaldag" overview */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-navy-900">
                  Festivaldagen
                </p>
                <span className="rounded-full bg-gold-300 px-2.5 py-1 text-[11px] font-bold text-navy-900">
                  09:00–15:00
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { t: 'Foredrag', c: 'bg-brand-500', w: 'w-5/6' },
                  { t: 'Workshops', c: 'bg-accent-400', w: 'w-2/3' },
                  { t: 'Stands', c: 'bg-gold-400', w: 'w-3/4' },
                ].map((row) => (
                  <div key={row.t}>
                    <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
                      <span>{row.t}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className={`h-3 rounded-full ${row.c} ${row.w}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Avatar row + count */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <div className="flex -space-x-2">
                  {['bg-brand-400', 'bg-accent-400', 'bg-navy-700', 'bg-gold-400'].map(
                    (c, i) => (
                      <span
                        key={i}
                        className={`h-8 w-8 rounded-full ${c} ring-2 ring-white`}
                      />
                    ),
                  )}
                </div>
                <p className="text-sm font-semibold text-navy-900">
                  20 bedrifter deltar
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal as="article" key={feature.title} delay={index * 120}>
              <div className="card-lift flex h-full flex-col gap-4 p-7 ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl ring-1 ring-brand-100"
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
                <h3 className="text-lg font-semibold text-navy-900">
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
