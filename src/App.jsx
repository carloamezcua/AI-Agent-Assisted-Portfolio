import { useState } from 'react'
import MatrixBackground from './components/MatrixBackground'
import ProjectMenu from './components/ProjectMenu'
import { AUTOMATA } from './automata'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [selectedAutomaton, setSelectedAutomaton] = useState(null)

  const cards = [
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'sobre-mi', label: 'Sobre mí' },
    { id: 'contacto', label: 'Contacto' },
  ]

  const handleCardClick = (id) => {
    setActiveSection(id)
    if (id === 'proyectos') setSelectedAutomaton(null)
  }

  const handleBackFromProjects = () => {
    selectedAutomaton ? setSelectedAutomaton(null) : setActiveSection('home')
  }

  const handleBackToHome = () => {
    setActiveSection('home')
  }

  const SelectedComponent = selectedAutomaton
    ? AUTOMATA.find((a) => a.id === selectedAutomaton)?.component
    : null

  // Sección Proyectos
  if (activeSection === 'proyectos') {
    return (
      <>
        <MatrixBackground />
        <div className="portfolio">
          <button className="back-btn" onClick={handleBackFromProjects}>
            ← {selectedAutomaton ? 'Volver al menú' : 'Volver'}
          </button>
          <section className="projects-section">
            {selectedAutomaton ? (
              <div className="project-card project-card-featured">
                <SelectedComponent />
              </div>
            ) : (
              <ProjectMenu onSelect={setSelectedAutomaton} />
            )}
          </section>
        </div>
      </>
    )
  }

  // Sección Sobre Mí
  if (activeSection === 'sobre-mi') {
    return (
      <>
        <MatrixBackground />
        <div className="portfolio">
          <button className="back-btn" onClick={handleBackToHome}>
            ← Volver
          </button>
          <section className="content-section">
            <h2 className="section-title">SOBRE MÍ</h2>
            <div className="content-box">
              <p className="content-text">
                [Placeholder: Cuéntanos sobre ti, tu background, tus intereses en desarrollo y tecnología]
              </p>
              <p className="content-text">
                [Placeholder: Tecnologías que dominas, proyectos en los que has trabajado]
              </p>
              <p className="content-text">
                [Placeholder: Tus objetivos profesionales y qué te apasiona del desarrollo]
              </p>
            </div>
          </section>
        </div>
      </>
    )
  }

  // Sección Contacto
  if (activeSection === 'contacto') {
    return (
      <>
        <MatrixBackground />
        <div className="portfolio">
          <button className="back-btn" onClick={handleBackToHome}>
            ← Volver
          </button>
          <section className="content-section">
            <h2 className="section-title">CONTACTO</h2>
            <div className="content-box">
              <div className="contact-links">
                <a href="https://github.com/carloamezcua" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-icon">▸</span> GitHub
                </a>
                <a href="mailto:tu-email@ejemplo.com" className="contact-link">
                  <span className="contact-icon">▸</span> Email
                </a>
                <a href="https://linkedin.com/in/tu-perfil" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-icon">▸</span> LinkedIn
                </a>
                <a href="https://twitter.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-icon">▸</span> Twitter/X
                </a>
              </div>
            </div>
          </section>
        </div>
      </>
    )
  }

  // Home
  return (
    <>
      <MatrixBackground />
      <div className="portfolio">
        <header className="hero">
          <h1 className="title">HOLA, SOY CARLO</h1>
          <p className="subtitle">[Tu título profesional aquí]</p>
        </header>

        <section className="cards">
          {cards.map((card) => (
            <div
              key={card.id}
              className="card"
              onClick={() => handleCardClick(card.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(card.id)}
              role="button"
              tabIndex={0}
            >
              <span className="card-label">{card.label}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}

export default App
