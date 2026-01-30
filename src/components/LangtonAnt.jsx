import { useRef, useEffect, useState } from 'react'
import { getCellFromMouse } from '../utils/canvasUtils'
import { createEmptyGrid } from '../utils/gridUtils'
import './LangtonAnt.css'

const CANVAS_SIZE = 600

// Direcciones: 0=arriba, 1=derecha, 2=abajo, 3=izquierda
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

const PRESET_COLORS = [
  '#0aff0a', // neon green
  '#00ffff', // cyan
  '#ff00ff', // magenta
  '#ffff00', // yellow
  '#ff6600', // orange
  '#ff3366', // pink
]

function LangtonAnt() {
  const canvasRef = useRef(null)
  const gridRef = useRef(null)
  const antsRef = useRef(null)
  const stepsRef = useRef(0)
  const rafRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const [gridSize, setGridSize] = useState(150)
  const [antColors, setAntColors] = useState(['#0aff0a'])
  const [stepsPerFrame, setStepsPerFrame] = useState(50)

  const cellSize = CANVAS_SIZE / gridSize

  const initSimulation = () => {
    gridRef.current = createEmptyGrid(gridSize)
    antsRef.current = []
    setAntColors([])
    stepsRef.current = 0
    setStepCount(0)
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const grid = gridRef.current
    const ants = antsRef.current

    if (!grid || !ants) return

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Celdas activas (cada una con su color)
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = grid[y][x]
        if (cell !== 0) {
          ctx.fillStyle = cell
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }

    // Hormigas (brillo más intenso)
    ants.forEach((ant) => {
      ctx.fillStyle = ant.color
      ctx.shadowColor = ant.color
      ctx.shadowBlur = 8
      ctx.fillRect(
        ant.x * cellSize,
        ant.y * cellSize,
        cellSize,
        cellSize
      )
    })
    ctx.shadowBlur = 0
  }

  const step = () => {
    const grid = gridRef.current
    const ants = antsRef.current
    if (!grid || !ants) return

    ants.forEach((ant) => {
      const { x, y, dir } = ant

      if (grid[y][x] === 0) {
        ant.dir = (dir + 1) % 4
        grid[y][x] = ant.color
      } else {
        ant.dir = (dir + 3) % 4
        grid[y][x] = 0
      }

      ant.x = (x + DX[ant.dir] + gridSize) % gridSize
      ant.y = (y + DY[ant.dir] + gridSize) % gridSize
    })

    stepsRef.current++
  }

  useEffect(() => {
    initSimulation()
    draw()
  }, [gridSize])

  useEffect(() => {
    if (!isRunning) return

    let lastTime = 0

    const animate = (timestamp) => {
      const delta = timestamp - lastTime
      if (delta > 16) {
        for (let i = 0; i < stepsPerFrame; i++) {
          step()
        }
        setStepCount(stepsRef.current)
        draw()
        lastTime = timestamp
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isRunning, gridSize, stepsPerFrame])

  const handleReset = () => {
    setIsRunning(false)
    initSimulation()
    draw()
  }

  const handleCanvasClick = (e) => {
    if (isRunning || antColors.length >= 6) return
    const cell = getCellFromMouse(e, {
      canvas: canvasRef.current,
      cellSize,
      gridSize,
    })
    if (!cell) return
    const newColor = PRESET_COLORS[antColors.length % PRESET_COLORS.length]
    const newAnt = { ...cell, dir: 0, color: newColor }
    antsRef.current.push(newAnt)
    setAntColors([...antColors, newColor])
    draw()
  }

  const removeLastAnt = () => {
    if (antsRef.current.length === 0) return
    setIsRunning(false)
    antsRef.current.pop()
    setAntColors(antColors.slice(0, -1))
    draw()
  }

  const updateAntColor = (index, color) => {
    const updated = [...antColors]
    updated[index] = color
    setAntColors(updated)
  }

  return (
    <div className="langton-ant">
      <div className="langton-header">
        <h3>Hormiga de Langton</h3>
        <p className="langton-desc">
          Autómata celular: en blanco gira derecha, en negro gira izquierda.
        </p>
        <div className="langton-controls">
          <button
            className="langton-btn"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button className="langton-btn" onClick={handleReset}>
            Reiniciar
          </button>
          <span className="langton-steps">
            Pasos: {stepCount.toLocaleString()}
          </span>
        </div>

        <div className="langton-options">
          <div className="langton-option">
            <label>Cuadrícula: {gridSize}×{gridSize}</label>
            <input
              type="range"
              min="50"
              max="250"
              step="25"
              value={gridSize}
              onChange={(e) => {
                setGridSize(Number(e.target.value))
                setIsRunning(false)
              }}
              className="langton-slider"
            />
          </div>

          <div className="langton-option">
            <label>Hormigas: {antColors.length} (clic en cuadrícula para añadir)</label>
            <button
              className="langton-btn-small"
              onClick={removeLastAnt}
              disabled={antColors.length === 0}
              title="Quitar última hormiga"
            >
              − Quitar última hormiga
            </button>
          </div>

          <div className="langton-option">
            <label>Velocidad: {stepsPerFrame} pasos/frame</label>
            <input
              type="range"
              min="1"
              max="200"
              value={stepsPerFrame}
              onChange={(e) => setStepsPerFrame(Number(e.target.value))}
              className="langton-slider"
            />
          </div>

          <div className="langton-option langton-colors">
            <label>Color de hormigas:</label>
            <div className="langton-color-picker">
              {antColors.map((color, i) => (
                <div key={i} className="langton-color-item">
                  <span className="langton-color-label">H{i + 1}</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateAntColor(i, e.target.value)}
                    className="langton-color-input"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="langton-canvas"
        onClick={handleCanvasClick}
        style={{ cursor: isRunning ? 'default' : 'crosshair' }}
        title={!isRunning ? 'Clic para colocar una hormiga' : ''}
      />
      {!isRunning && (
        <p className="langton-hint">
          Haz clic en la cuadrícula para colocar hormigas (máx. 6)
        </p>
      )}
    </div>
  )
}

export default LangtonAnt
