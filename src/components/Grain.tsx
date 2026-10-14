import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

const FPS = 12
const SIZE = 192

// Bruit plein écran : une petite texture régénérée 12 fois par seconde, étirée en CSS.
export function Grain({ opacity = 0.09 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.width = SIZE
    canvas.height = SIZE
    const frame = ctx.createImageData(SIZE, SIZE)
    const data = new Uint32Array(frame.data.buffer)

    const draw = () => {
      for (let i = 0; i < data.length; i++) {
        const v = (Math.random() * 255) | 0
        data[i] = (255 << 24) | (v << 16) | (v << 8) | v
      }
      ctx.putImageData(frame, 0, 0)
    }

    draw()
    if (reduce) return
    let raf = 0
    let last = 0
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 1000 / FPS) return
      last = t
      draw()
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100lvh',
        pointerEvents: 'none',
        zIndex: 100,
        opacity,
        mixBlendMode: 'overlay',
        imageRendering: 'pixelated',
      }}
    />
  )
}
