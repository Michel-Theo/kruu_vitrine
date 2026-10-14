import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

// réglages : plus FPS est bas et MAX_ALPHA faible, plus le grain est doux pour les yeux
const FPS = 8
const TILE = 256
const FRAMES = 6
// chaque pixel est blanc ou noir, avec une opacité aléatoire de 0 à ~13 %
const MAX_ALPHA = 34

function makeTile() {
  const c = document.createElement('canvas')
  c.width = TILE
  c.height = TILE
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(TILE, TILE)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() < 0.5 ? 255 : 0
    d[i] = d[i + 1] = d[i + 2] = v
    d[i + 3] = Math.random() * MAX_ALPHA
  }
  ctx.putImageData(img, 0, 0)
  return c
}

// Bruit fin plein écran (1 grain = 1 pixel CSS), rejoué 8 fois par seconde.
export function Grain() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const patterns = Array.from({ length: FRAMES }, () => ctx.createPattern(makeTile(), 'repeat')!)

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }
    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      // décalage aléatoire : les tuiles ne se répètent jamais au même endroit
      ctx.translate(-Math.random() * TILE, -Math.random() * TILE)
      ctx.fillStyle = patterns[frame++ % FRAMES]
      ctx.fillRect(0, 0, canvas.width + TILE, canvas.height + TILE)
      ctx.restore()
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduce) return () => window.removeEventListener('resize', resize)
    let raf = 0
    let last = 0
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 1000 / FPS) return
      last = t
      draw()
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 100 }}
    />
  )
}
