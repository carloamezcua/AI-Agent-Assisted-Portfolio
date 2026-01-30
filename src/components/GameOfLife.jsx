import { useRef, useEffect, useState } from 'react'
import { getCellFromMouse } from '../utils/canvasUtils'
import { createEmptyGrid } from '../utils/gridUtils'
import './GameOfLife.css'

const CANVAS_SIZE = 600
const MAX_AGE = 50

/** Interpola suavemente de verde neón a cyan según la edad de la célula */
function ageToColor(age) {
  const t = Math.min(age, MAX_AGE) / MAX_AGE
  const r = 10
  const g = Math.round(255 - 55 * t)
  const b = Math.round(10 + 245 * t)
  return `rgb(${r}, ${g}, ${b})`
}

function GameOfLife() {
  const canvasRef = useRef(null)
  const gridRef = useRef(null)
  const rafRef = useRef(null)
  const isDrawingRef = useRef(false)
  const drawModeRef = useRef(true) // true = alive, false = erase
  const [isRunning, setIsRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [gridSize, setGridSize] = useState(100)
  const [stepsPerFrame, setStepsPerFrame] = useState(5)

  const cellSize = CANVAS_SIZE / gridSize

  const initSimulation = () => {
    gridRef.current = createEmptyGrid(gridSize)
    setGeneration(0)
  }

  const countNeighbors = (grid, x, y) => {
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const nx = (x + dx + gridSize) % gridSize
        const ny = (y + dy + gridSize) % gridSize
        count += grid[ny][nx] > 0 ? 1 : 0
      }
    }
    return count
  }

  const nextGeneration = () => {
    const grid = gridRef.current
    if (!grid) return

    const next = createEmptyGrid(gridSize)
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const neighbors = countNeighbors(grid, x, y)
        const isAlive = grid[y][x] > 0
        const age = grid[y][x]

        if (isAlive) {
          // Soledad: < 2 vecinos → muere
          // Sobrepoblación: > 3 vecinos → muere
          // Supervivencia: 2 o 3 vecinos → vive (incrementa edad)
          next[y][x] = neighbors === 2 || neighbors === 3 ? age + 1 : 0
        } else {
          // Reproducción: exactamente 3 vecinos → nace (edad 1)
          next[y][x] = neighbors === 3 ? 1 : 0
        }
      }
    }
    gridRef.current = next
    setGeneration((g) => g + 1)
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const grid = gridRef.current
    if (!grid) return

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const age = grid[y][x]
        if (age > 0) {
          ctx.fillStyle = ageToColor(age)
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }
  }

  const getCell = (e) =>
    getCellFromMouse(e, {
      canvas: canvasRef.current,
      cellSize,
      gridSize,
    })

  const handleCellPaint = (cell, alive) => {
    if (!cell || isRunning) return
    const grid = gridRef.current
    if (!grid) return
    grid[cell.y][cell.x] = alive ? 1 : 0  // 1 = recién nacida (edad 1)
    draw()
  }

  const handleMouseDown = (e) => {
    if (isRunning) return
    const cell = getCell(e)
    if (cell) {
      isDrawingRef.current = true
      drawModeRef.current = gridRef.current[cell.y][cell.x] === 0  // 0 = muerta
      handleCellPaint(cell, drawModeRef.current)
    }
  }

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current || isRunning) return
    const cell = getCell(e)
    if (cell) handleCellPaint(cell, drawModeRef.current)
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
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
          nextGeneration()
        }
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

  const handleClear = () => {
    setIsRunning(false)
    gridRef.current = createEmptyGrid(gridSize)
    setGeneration(0)
    draw()
  }

  return (
    <div className="game-of-life">
      <div className="gol-header">
        <h3>Juego de la Vida de Conway</h3>
        <p className="gol-desc">
          Dibuja células con el mouse. Reglas: soledad (&lt;2), sobrepoblación
          (&gt;3), reproducción (=3).
        </p>
        <div className="gol-controls">
          <button
            className="gol-btn"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button className="gol-btn" onClick={handleReset}>
            Reiniciar
          </button>
          <button className="gol-btn" onClick={handleClear}>
            Limpiar
          </button>
          <span className="gol-gen">Generación: {generation}</span>
        </div>
        <div className="gol-options">
          <div className="gol-option">
            <label>Velocidad: {stepsPerFrame} gen/frame</label>
            <input
              type="range"
              min="1"
              max="30"
              value={stepsPerFrame}
              onChange={(e) => setStepsPerFrame(Number(e.target.value))}
              className="gol-slider"
            />
          </div>
          <div className="gol-option">
            <label>Cuadrícula: {gridSize}×{gridSize}</label>
            <input
              type="range"
              min="50"
              max="150"
              step="10"
              value={gridSize}
              onChange={(e) => {
                setGridSize(Number(e.target.value))
                setIsRunning(false)
              }}
              className="gol-slider"
            />
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="gol-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ cursor: isRunning ? 'default' : 'crosshair' }}
      />
      {!isRunning && (
        <p className="gol-hint">Arrastra el mouse sobre el canvas para dibujar células</p>
      )}
    </div>
  )
}

export default GameOfLife
