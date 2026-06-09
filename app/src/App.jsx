import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HeroSection from './sections/HeroSection.jsx'
import AboutSection from './sections/AboutSection.jsx'
import ProgramSection from './sections/ProgramSection.jsx'
import { getFestival } from './utils/dataHelpers.js'

// Root component. Sections are assembled here in display order.
function App() {
  const festival = getFestival()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProgramSection />
      </main>

      <Footer festival={festival} />
    </div>
  )
}

export default App
