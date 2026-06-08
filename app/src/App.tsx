import './App.css'

const sections = [
  {
    title: 'Program',
    text: 'Oversikt over foredrag, workshops og aktiviteter under 2INF Festival.',
  },
  {
    title: 'Bedrifter',
    text: 'Informasjon om bedrifter som deltar på festivalen.',
  },
  {
    title: 'Workshops',
    text: 'Praktiske økter der deltakere kan lære og teste teknologi.',
  },
  {
    title: 'Rom',
    text: 'Romoversikt for foredrag, stands og workshops.',
  },
  {
    title: 'Praktisk informasjon',
    text: 'Tidspunkt, sted, nettverk, servere og annen nyttig informasjon.',
  },
  {
    title: 'Kontakt',
    text: 'Kontaktinformasjon for arrangører og teknisk ansvarlige.',
  },
]

function App() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">2INF prosjekt</p>
        <h1>2INF Festival</h1>
        <p className="lead">
          En enkel webapplikasjon for program, bedrifter, workshops, rom og praktisk informasjon.
        </p>
      </header>

      <section className="grid" aria-label="Festivalinformasjon">
        {sections.map((section) => (
          <article className="card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
