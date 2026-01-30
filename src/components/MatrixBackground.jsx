import { useEffect, useRef } from 'react'
import './MatrixBackground.css'

// Caracteres estilo Matrix: katakana, números y símbolos
const MATRIX_CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|'
  .split('')

function MatrixBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initColumns()
    }

    const fontSize = 14
    let columns = []
    let columnCount = 0

    const initColumns = () => {
      columnCount = Math.floor(canvas.width / fontSize)
      columns = []
      for (let i = 0; i < columnCount; i++) {
        columns[i] = {
          y: Math.random() * canvas.height,
          speed: 0.5 + Math.random() * 1.5,
          length: 8 + Math.floor(Math.random() * 20),
        }
      }
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px "Share Tech Mono", monospace`

      for (let i = 0; i < columnCount; i++) {
        const col = columns[i]
        const x = i * fontSize

        // Carácter principal (el más brillante)
        const mainChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ctx.fillStyle = '#0aff0a'
        ctx.shadowColor = '#0aff0a'
        ctx.shadowBlur = 10
        ctx.fillText(mainChar, x, col.y)

        ctx.shadowBlur = 0

        // Estela (caracteres que se desvanecen)
        for (let j = 1; j < col.length; j++) {
          const trailY = col.y - j * fontSize
          const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
          const alpha = 1 - j / col.length
          ctx.fillStyle = `rgba(10, 255, 10, ${alpha * 0.4})`
          ctx.fillText(char, x, trailY)
        }

        col.y += col.speed * 3

        if (col.y > canvas.height + col.length * fontSize) {
          col.y = -col.length * fontSize
          col.speed = 0.5 + Math.random() * 1.5
          col.length = 8 + Math.floor(Math.random() * 20)
        }
      }
    }

    const animate = () => {
      draw()
      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="matrix-background" />
}

export default MatrixBackground
