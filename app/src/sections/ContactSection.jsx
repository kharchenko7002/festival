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
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionTitle
            eyebrow="Kontakt"
            title="Ta kontakt med oss"
            subtitle="Har du spørsmål om festivalen? Send oss en e-post, eller kontakt en av de ansvarlige direkte."
          />
        </Reveal>

        {/* Networking image */}
        <Reveal className="overflow-hidden rounded-3xl shadow-xl shadow-navy-900/10 ring-1 ring-slate-100">
          <img
            src="/images/networking.jpg"
            alt="Mennesker som nettverker og snakker sammen på et arrangement"
            loading="lazy"
            className="h-56 w-full object-cover sm:h-72"
          />
        </Reveal>

        {/* General contact – final CTA card */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy-800 p-8 text-white shadow-2xl shadow-navy-900/30 sm:p-12">
            <div
              aria-hidden="true"
              className="bg-dot-grid pointer-events-none absolute inset-0 opacity-70"
            />
            <div
              aria-hidden="true"
              className="animate-float pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold-400/20 blur-2xl"
            />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold-300">
                  Generell henvendelse
                </p>
                <a
                  href={`mailto:${festival.kontaktEpost}`}
                  className="mt-2 inline-block text-2xl font-bold underline decoration-gold-400/50 underline-offset-4 transition hover:decoration-gold-400 sm:text-3xl"
                >
                  {festival.kontaktEpost}
                </a>
              </div>
              <a
                href={`mailto:${festival.kontaktEpost}`}
                className="btn-primary shrink-0"
              >
                Send e-post
              </a>
            </div>
          </div>
        </Reveal>

        {/* Responsible teachers */}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <Reveal as="li" key={teacher.id} delay={index * 90}>
              <div className="card-lift flex h-full flex-col gap-3 p-6 ring-1 ring-slate-100">
                <Badge variant="brand" className="w-fit">
                  {teacher.ansvarsomraade}
                </Badge>
                <h3 className="text-base font-semibold text-navy-900">
                  {teacher.navn}
                </h3>
                <dl className="mt-auto flex flex-col gap-1 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex flex-col">
                    <dt className="sr-only">E-post</dt>
                    <dd>
                      <a
                        href={`mailto:${teacher.epost}`}
                        className="break-all font-medium text-brand-600 underline-offset-4 hover:underline"
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
