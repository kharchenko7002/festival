import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import { getFestival, getTeachersByAreas } from '../utils/dataHelpers.js'

// Responsibility areas to highlight as festival contacts, in display order.
const contactAreas = [
  'Festivalansvarlig',
  'Teknisk ansvarlig',
  'Programansvarlig',
  'Rom og logistikk',
]

// Contact section: general festival email and the most relevant teachers.
function ContactSection() {
  const festival = getFestival()
  const teachers = getTeachersByAreas(contactAreas)

  return (
    <section id="kontakt" className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <SectionTitle
            eyebrow="Kontakt"
            title="Ta kontakt med oss"
            subtitle="Har du spørsmål om festivalen? Send oss en e-post, eller kontakt en av de ansvarlige direkte."
          />
        </Reveal>

        {/* General contact */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 p-8 text-white shadow-xl sm:p-10">
            <div
              aria-hidden="true"
              className="animate-float pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-400/20 blur-2xl"
            />
            <div className="relative">
              <p className="text-sm font-medium uppercase tracking-widest text-accent-300">
                Generell henvendelse
              </p>
              <a
                href={`mailto:${festival.kontaktEpost}`}
                className="mt-2 inline-block text-2xl font-bold underline decoration-white/40 underline-offset-4 transition hover:decoration-white sm:text-3xl"
              >
                {festival.kontaktEpost}
              </a>
            </div>
          </div>
        </Reveal>

        {/* Responsible teachers */}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <Reveal as="li" key={teacher.id} delay={index * 90}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl">
                <Badge variant="brand" className="w-fit">
                  {teacher.ansvarsomraade}
                </Badge>
                <h3 className="text-base font-semibold text-slate-900">
                  {teacher.navn}
                </h3>
                <dl className="mt-auto flex flex-col gap-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
                  <div className="flex flex-col">
                    <dt className="sr-only">E-post</dt>
                    <dd>
                      <a
                        href={`mailto:${teacher.epost}`}
                        className="break-all text-brand-600 underline-offset-4 hover:underline"
                      >
                        {teacher.epost}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-slate-400">Tlf:</dt>
                    <dd>{teacher.telefon}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ContactSection
