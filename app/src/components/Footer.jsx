// Site footer with festival name, a short note and quick navigation links.
function Footer({ festival }) {
  const year = new Date().getFullYear()
  const navn = festival?.navn ?? '2INF Festival'

  return (
    <footer className="border-t border-navy-800 bg-navy-900 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2.5 text-lg font-bold text-white">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-gold-400"
            >
              2i
            </span>
            {navn}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Karriere- og teknologifestival arrangert av VG2 Informasjonsteknologi
            ved {festival?.sted ?? 'Hamar katedralskole'}.
          </p>
        </div>

        <nav aria-label="Bunnmeny">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <li><a href="#program" className="transition hover:text-gold-300">Program</a></li>
            <li><a href="#bedrifter" className="transition hover:text-gold-300">Bedrifter</a></li>
            <li><a href="#workshops" className="transition hover:text-gold-300">Workshops</a></li>
            <li><a href="#rom" className="transition hover:text-gold-300">Rom</a></li>
            <li><a href="#info" className="transition hover:text-gold-300">Info</a></li>
            <li><a href="#kontakt" className="transition hover:text-gold-300">Kontakt</a></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-navy-800">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
          © {year} {navn} · Laget av elever ved 2INF
        </p>
      </div>
    </footer>
  )
}

export default Footer
