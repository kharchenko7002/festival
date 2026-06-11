import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Desktop center nav: only the most important sections
const desktopNavLinks = [
  { label: 'Festival', href: '#festival' },
  { label: 'Program', href: '#program' },
  { label: 'Bedrifter', href: '#bedrifter' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Finn fram', href: '#finn-fram' },
]

// Mobile menu shows all sections
const mobileNavLinks = [
  { label: 'Festival', href: '#festival' },
  { label: 'Program', href: '#program' },
  { label: 'Bedrifter', href: '#bedrifter' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Rom', href: '#rom' },
  { label: 'Finn fram', href: '#finn-fram' },
  { label: 'Info', href: '#info' },
  { label: 'Påmelding', href: '#pamelding' },
  { label: 'Kontakt', href: '#kontakt' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-shadow ${
        scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Logo */}
        <a
          href="#festival"
          onClick={closeMenu}
          className="shrink-0 text-xl font-extrabold tracking-tight text-navy-900"
        >
          2INF&nbsp;<span className="text-brand-600">Festival</span>
        </a>

        {/* Desktop center nav (xl+) */}
        <nav aria-label="Hovedmeny" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {desktopNavLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop right actions (xl+) */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Link
            to="/admin"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            Festivalsjef
          </Link>
          <a
            href="#pamelding"
            className="btn-blue whitespace-nowrap !px-4 !py-2 !text-sm"
          >
            Meld meg på
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 transition hover:border-brand-400 hover:text-brand-700 xl:hidden"
        >
          <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobilmeny"
          className="border-t border-slate-200 bg-white xl:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {mobileNavLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/admin"
                onClick={closeMenu}
                className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                Festivalsjef
              </Link>
            </li>
            <li className="px-1 py-2">
              <a
                href="#pamelding"
                onClick={closeMenu}
                className="btn-blue block w-full text-center"
              >
                Meld meg på
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
