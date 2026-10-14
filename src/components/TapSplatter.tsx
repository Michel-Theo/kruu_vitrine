import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Splatter } from './Splatter'

type Tap = { id: number; x: number; y: number }

// Au toucher, n'importe où : une petite éclaboussure (sauf sur la pochette, qui a la sienne).
export function TapSplatter() {
  const reduce = useReducedMotion()
  const [taps, setTaps] = useState<Tap[]>([])

  useEffect(() => {
    if (reduce) return
    let id = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      if ((e.target as Element | null)?.closest?.('[data-no-splat], dialog')) return
      const tap = { id: ++id, x: e.clientX, y: e.clientY }
      setTaps((t) => [...t.slice(-4), tap])
      setTimeout(() => setTaps((t) => t.filter((v) => v.id !== tap.id)), 1300)
    }
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => window.removeEventListener('pointerdown', onDown)
  }, [reduce])

  return (
    <div className="taps" aria-hidden>
      <AnimatePresence>
        {taps.map((t) => (
          <motion.div
            key={t.id}
            className="taps__one"
            style={{ left: t.x, top: t.y }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <Splatter seed={t.id * 7} count={6} play />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
