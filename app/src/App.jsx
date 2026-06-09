import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HeroSection from './sections/HeroSection.jsx'
import AboutSection from './sections/AboutSection.jsx'
import ProgramSection from './sections/ProgramSection.jsx'
import CompaniesSection from './sections/CompaniesSection.jsx'
import WorkshopsSection from './sections/WorkshopsSection.jsx'
import RoomsSection from './sections/RoomsSection.jsx'
import PracticalInfoSection from './sections/PracticalInfoSection.jsx'
import ContactSection from './sections/ContactSection.jsx'
import { getFestival } from './utils/dataHelpers.js'

// Root component. Sections are assembled here in display order.
function App() {
  const festival = getFestival()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Accessibility: let keyboard users jump past the navigation */}
      <a
        href="#hovedinnhold"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow-lg"
      >
        Hopp til innhold
      </a>

      <Header />

      <main id="hovedinnhold" className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProgramSection />
        <CompaniesSection />
        <WorkshopsSection />
        <RoomsSection />
        <PracticalInfoSection />
        <ContactSection />
      </main>

      <Footer festival={festival} />
    </div>
  )
}

export default App
