/**
 * Crea una cuadrícula vacía de N×N celdas inicializadas a 0.
 */
export function createEmptyGrid(size) {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(0))
}
