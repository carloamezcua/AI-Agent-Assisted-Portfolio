/**
 * Índice de autómatas celulares.
 * Para añadir uno nuevo: importa el componente y agrega un objeto al array.
 */
import LangtonAnt from '../components/LangtonAnt'
import GameOfLife from '../components/GameOfLife'

export const AUTOMATA = [
  {
    id: 'langton',
    name: 'Hormiga de Langton',
    description: 'Autómata con hormigas que giran y pintan. Emergencia del caos.',
    component: LangtonAnt,
  },
  {
    id: 'conway',
    name: 'Juego de la Vida de Conway',
    description: 'Simula vida: soledad, sobrepoblación y reproducción.',
    component: GameOfLife,
  },
]
