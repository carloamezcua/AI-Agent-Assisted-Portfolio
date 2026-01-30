import { AUTOMATA } from '../automata'
import './ProjectMenu.css'

function ProjectMenu({ onSelect }) {
  return (
    <div className="project-menu">
      <h2 className="project-menu-title">Colección de Algoritmos</h2>
      <p className="project-menu-subtitle">Elige un autómata celular para explorar</p>
      <div className="project-menu-grid">
        {AUTOMATA.map((automaton) => (
            <div
              key={automaton.id}
              className="project-menu-card"
              onClick={() => onSelect(automaton.id)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(automaton.id)}
              role="button"
              tabIndex={0}
            >
              <h3 className="project-menu-card-title">{automaton.name}</h3>
              <p className="project-menu-card-desc">{automaton.description}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectMenu
