import { useMemo } from 'react'
import { motion } from 'motion/react'
import { splatterDots } from '../lib/scribbles'

// Éclaboussure : les gouttes jaillissent du centre ; `breathing` les fait flotter doucement.
export function Splatter({
  seed,
  count = 18,
  className,
  play,
  breathing = false,
  delay = 0,
}: {
  seed: number
  count?: number
  className?: string
  play?: boolean
  breathing?: boolean
  delay?: number
}) {
  const dots = useMemo(() => splatterDots(seed, count), [seed, count])
  const trigger =
    play === undefined
      ? { whileInView: 'in', viewport: { once: true, margin: '0px 0px -10% 0px' } }
      : { animate: play ? 'in' : 'out' }
  return (
    <motion.svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }} initial="out" {...trigger} aria-hidden>
      {dots.map((d, i) => (
        <motion.g
          key={i}
          animate={breathing ? { y: [0, (i % 2 ? 1 : -1) * (1 + (i % 3)), 0] } : { y: 0 }}
          transition={breathing ? { duration: 4, repeat: Infinity, ease: [0.65, 0, 0.35, 1], delay: (i % 5) * 0.3 } : { duration: 0.6 }}
        >
          <motion.circle
            fill={d.blue ? 'var(--blue)' : 'var(--paper)'}
            variants={{
              out: { cx: 50, cy: 50, r: 0 },
              in: { cx: d.x, cy: d.y, r: d.r / 4 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: delay + d.delay }}
          />
        </motion.g>
      ))}
    </motion.svg>
  )
}
