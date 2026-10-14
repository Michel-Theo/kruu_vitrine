import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useIsDesktop } from '../hooks/useMediaQuery'

const WAVES = 5
const AMPLITUDE = 14 // px

// Le fil (maquette, motion 05) : dans l'espace entre deux sections, un trait ondulé descend au centre
// au rythme du défilement, puis tourne vers le label de la section suivante.
export function Thread({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const desktop = useIsDesktop()
  const [size, setSize] = useState({ w: 0, h: 0 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 40%'] })
  const length = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // tracé en pixels réels (pas de SVG étiré : l'animation du trait reste continue)
  const { w, h } = size
  const cx = w / 2
  const end = desktop ? cx : 4
  const body = h * 0.8
  const seg = body / WAVES
  let d = `M${cx} 0`
  for (let i = 0; i < WAVES; i++) {
    d += ` Q ${cx + (i % 2 ? AMPLITUDE : -AMPLITUDE)} ${seg * i + seg / 2}, ${cx} ${seg * (i + 1)}`
  }
  d += ` C ${cx} ${h * 0.93}, ${end} ${h * 0.88}, ${end} ${h}`

  const paint = { d, fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round' as const, style: { pathLength: length } }
  return (
    <div ref={ref} className={`thread ${className}`} aria-hidden>
      {w > 0 && (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
          <motion.path {...paint} stroke="var(--blue)" transform="translate(2 2)" />
          <motion.path {...paint} stroke="var(--paper)" />
        </svg>
      )}
    </div>
  )
}
