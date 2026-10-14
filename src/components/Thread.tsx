import { useEffect, useState, type RefObject } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

// Le fil : un trait dessiné qui relie les sections, tracé au rythme du défilement.
export function Thread({ container }: { container: RefObject<HTMLElement | null> }) {
  const [h, setH] = useState(0)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start 70%', 'end end'] })
  const length = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const el = container.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [container])

  if (!h) return null
  // une ondulation douce toutes les ~420 px
  const waves = Math.max(2, Math.round(h / 420))
  const seg = h / waves
  let d = 'M20 0'
  for (let i = 0; i < waves; i++) {
    d += ` Q ${i % 2 ? 34 : 6} ${seg * i + seg / 2}, 20 ${seg * (i + 1)}`
  }

  const common = {
    d,
    fill: 'none',
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
    style: { pathLength: length },
  }
  return (
    <svg className="thread" viewBox={`0 0 40 ${h}`} preserveAspectRatio="none" style={{ height: h }} aria-hidden>
      <motion.path {...common} stroke="var(--blue)" transform="translate(2 2)" />
      <motion.path {...common} stroke="var(--paper)" />
    </svg>
  )
}
