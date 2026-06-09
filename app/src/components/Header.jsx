import { useState } from 'react'

// Navigation links. `href` points to the matching section id in App.jsx.
const navLinks = [
  { label: 'Festival', href: '#festival' },
  { label: 'Program', href: '#program' },
  { label: 'Bedrifter', href: '#bedrifter' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Rom', href: '#rom' },
  { label: 'Info', href: '#info' },
  { label: 'Kontakt', href: '#kontakt' },
]

// Sticky, responsive site header with a collapsible mobile menu.
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu after a link is tapped
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#festival"
          onClick={closeMenu}
          className="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-bold text-white">
            2i
          </span>
          2INF Festival
        </a>

        {/* Desktop navigation */}
        <nav aria-label="Hovedmeny" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Åpne meny"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 md:hidden"
        >
          <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobilmeny"
          className="border-t border-slate-200 bg-white md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
