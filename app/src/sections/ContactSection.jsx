import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
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
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6">
        <SectionTitle
          eyebrow="Kontakt"
          title="Ta kontakt med oss"
          subtitle="Har du spørsmål om festivalen? Send oss en e-post, eller kontakt en av de ansvarlige direkte."
        />

        {/* General contact */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-600 p-8 text-white">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-100">
            Generell henvendelse
          </p>
          <a
            href={`mailto:${festival.kontaktEpost}`}
            className="mt-2 inline-block text-2xl font-bold underline decoration-white/40 underline-offset-4 hover:decoration-white sm:text-3xl"
          >
            {festival.kontaktEpost}
          </a>
        </div>

        {/* Responsible teachers */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher) => (
            <li
              key={teacher.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <Badge variant="brand" className="w-fit">
                {teacher.ansvarsomraade}
              </Badge>
              <h3 className="text-base font-semibold text-slate-900">
                {teacher.navn}
              </h3>
              <dl className="mt-auto flex flex-col gap-1 text-sm text-slate-600">
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ContactSection
