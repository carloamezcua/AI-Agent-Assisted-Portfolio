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

  const SelectedComponent = selectedAutomaton
    ? AUTOMATA.find((a) => a.id === selectedAutomaton)?.component
    : null

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

  return (
    <>
      <MatrixBackground />
      <div className="portfolio">
        <header className="hero">
          <h1 className="title">HOLA, SOY CARLO</h1>
          <p className="subtitle">Data Science | AI Enthusiast | Vibecoder</p>
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
