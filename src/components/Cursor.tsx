import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { HEART } from '../lib/scribbles'
import { useMediaQuery } from '../hooks/useMediaQuery'

const MAGNET_RADIUS = 90
const MAGNET_PULL = 10

// Desktop : petit cœur qui suit la souris avec inertie, et CTA « magnétiques » ([data-magnetic]).
export function Cursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fine || reduce) return
    const el = ref.current!
    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let scale = 1
    let targetScale = 1
    let raf = 0
    const magnets = new Map<HTMLElement, { x: number; y: number }>()

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      const hit = (e.target as Element | null)?.closest?.('a, button, [role="button"], canvas')
      targetScale = hit ? 1.6 : 1

      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((m) => {
        const r = m.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        const reach = Math.max(r.width, r.height) / 2 + MAGNET_RADIUS
        const k = dist < reach ? 1 - dist / reach : 0
        magnets.set(m, { x: (dx / reach) * MAGNET_PULL * 2 * k, y: (dy / reach) * MAGNET_PULL * 2 * k })
      })
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      x += (tx - x) * 0.15
      y += (ty - y) * 0.15
      scale += (targetScale - scale) * 0.2
      el.style.transform = `translate3d(${x - 9}px, ${y - 9}px, 0) scale(${scale})`
      magnets.forEach((v, m) => {
        m.style.transform = `translate3d(${v.x.toFixed(2)}px, ${v.y.toFixed(2)}px, 0)`
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      magnets.forEach((_, m) => (m.style.transform = ''))
    }
  }, [fine, reduce])

  if (!fine || reduce) return null
  return (
    <div ref={ref} className="cursor" aria-hidden>
      <svg viewBox={HEART.viewBox}>
        <path d={HEART.d} fill="var(--blue)" transform="translate(8 7)" />
        <path d={HEART.d} fill="var(--paper)" />
      </svg>
    </div>
  )
}
