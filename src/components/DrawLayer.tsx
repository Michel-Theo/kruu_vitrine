import { useEffect, useRef } from 'react'
import { splatterDots } from '../lib/scribbles'

type Pt = { x: number; y: number }
type Stroke = { pts: Pt[]; end: number | null }
type Splat = { x: number; y: number; born: number; dots: ReturnType<typeof splatterDots> }

const HOLD = 2500
const FADE = 1000
const BLUE = '#c0d8f8'
const PAPER = '#f2f2f2'

// Canvas posé sur la pochette : on dessine au doigt / à la souris, un tap fait une éclaboussure.
export function DrawLayer({ onFirstDraw }: { onFirstDraw?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const strokes: Stroke[] = []
    const splats: Splat[] = []
    let current: Stroke | null = null
    let down: Pt | null = null
    let moved = false
    let raf = 0
    let seed = 1
    let notified = false

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * dpr()
      canvas.height = r.height * dpr()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const pos = (e: PointerEvent): Pt => {
      const r = canvas.getBoundingClientRect()
      return { x: (e.clientX - r.left) * dpr(), y: (e.clientY - r.top) * dpr() }
    }

    const path = (pts: Pt[], dx: number, dy: number) => {
      ctx.beginPath()
      ctx.moveTo(pts[0].x + dx, pts[0].y + dy)
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2
        const my = (pts[i].y + pts[i + 1].y) / 2
        ctx.quadraticCurveTo(pts[i].x + dx, pts[i].y + dy, mx + dx, my + dy)
      }
      const last = pts[pts.length - 1]
      ctx.lineTo(last.x + dx, last.y + dy)
    }

    const render = () => {
      raf = 0
      const now = performance.now()
      const unit = canvas.width / 400
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 7 * unit

      for (let i = strokes.length - 1; i >= 0; i--) {
        const s = strokes[i]
        const age = s.end === null ? 0 : now - s.end
        const alpha = 1 - Math.min(1, Math.max(0, (age - HOLD) / FADE))
        if (alpha <= 0) {
          strokes.splice(i, 1)
          continue
        }
        if (s.pts.length < 2) continue
        ctx.globalAlpha = alpha
        ctx.strokeStyle = BLUE
        path(s.pts, 5 * unit, 4 * unit)
        ctx.stroke()
        ctx.strokeStyle = PAPER
        path(s.pts, 0, 0)
        ctx.stroke()
      }

      for (let i = splats.length - 1; i >= 0; i--) {
        const sp = splats[i]
        const age = (now - sp.born) / 1000
        if (age > 1.6) {
          splats.splice(i, 1)
          continue
        }
        const grow = Math.min(1, age / 0.18)
        ctx.globalAlpha = age < 0.4 ? 1 : 1 - (age - 0.4) / 1.2
        for (const d of sp.dots) {
          ctx.fillStyle = d.blue ? BLUE : PAPER
          ctx.beginPath()
          ctx.arc(sp.x + (d.x - 50) * 1.6 * unit * grow, sp.y + (d.y - 50) * 1.6 * unit * grow, d.r * unit * grow, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      if (strokes.length || splats.length) raf = requestAnimationFrame(render)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      down = pos(e)
      moved = false
      current = { pts: [down], end: null }
      strokes.push(current)
      if (!notified) {
        notified = true
        onFirstDraw?.()
      }
      schedule()
    }
    const onMove = (e: PointerEvent) => {
      if (!current || !down) return
      const p = pos(e)
      const last = current.pts[current.pts.length - 1]
      if (Math.hypot(p.x - last.x, p.y - last.y) < 2) return
      if (Math.hypot(p.x - down.x, p.y - down.y) > 8) moved = true
      current.pts.push(p)
      schedule()
    }
    const onUp = () => {
      if (!current || !down) return
      current.end = performance.now()
      if (!moved) {
        strokes.pop()
        splats.push({ x: down.x, y: down.y, born: performance.now(), dots: splatterDots(seed++, 16 + (seed % 10)) })
      }
      current = null
      down = null
      schedule()
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [onFirstDraw])

  return (
    <canvas
      ref={ref}
      aria-label="draw on the cover"
      data-no-splat
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }}
    />
  )
}
