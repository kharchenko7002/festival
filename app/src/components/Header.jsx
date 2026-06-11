import { useEffect, useState } from 'react'

// Navigation links. `href` points to the matching section id in App.jsx.
const navLinks = [
  { label: 'Festival', href: '#festival' },
  { label: 'Program', href: '#program' },
  { label: 'Bedrifter', href: '#bedrifter' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Rom', href: '#rom' },
  { label: 'Info', href: '#info' },
  { label: 'Påmelding', href: '#pamelding' },
  { label: 'Kontakt', href: '#kontakt' },
]

// Sticky, responsive SaaS-style header with a collapsible mobile menu.
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add a subtle shadow once the user scrolls away from the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu after a link is tapped
  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-shadow ${
        scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a
          href="#festival"
          onClick={closeMenu}
          className="text-xl font-extrabold tracking-tight text-navy-900 sm:text-2xl"
        >
          2INF&nbsp;<span className="text-brand-600">Festival</span>
        </a>

        {/* Desktop navigation */}
        <nav aria-label="Hovedmeny" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
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

        {/* Desktop calls to action */}
        <div className="hidden items-center gap-2 lg:flex">
          <a href="#program" className="btn-ghost !px-5 !py-2.5 !text-sm">
            Se program
          </a>
          <a href="#pamelding" className="btn-blue !px-5 !py-2.5 !text-sm">
            Meld meg på
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 transition hover:border-brand-400 hover:text-brand-700 lg:hidden"
        >
          <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobilmeny"
          className="border-t border-slate-200 bg-white lg:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
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
            <li className="flex flex-col gap-2 px-1 py-2">
              <a
                href="#program"
                onClick={closeMenu}
                className="btn-ghost w-full"
              >
                Se program
              </a>
              <a
                href="#pamelding"
                onClick={closeMenu}
                className="btn-blue w-full"
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
