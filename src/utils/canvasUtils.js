/**
 * Obtiene la celda (x, y) del grid bajo el cursor del mouse.
 * @returns {{ x: number, y: number } | null}
 */
export function getCellFromMouse(e, { canvas, cellSize, gridSize }) {
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  const x = Math.floor(((e.clientX - rect.left) * scaleX) / cellSize)
  const y = Math.floor(((e.clientY - rect.top) * scaleY) / cellSize)
  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) return { x, y }
  return null
}
