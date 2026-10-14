import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import './Odometer.css'

const DIGITS = '0123456789'

// Rouleaux de chiffres : de `from` (ex. l'heure du visiteur) jusqu'à `to` (« 11:34 »).
export function Odometer({ from, to, className = '' }: { from: string; to: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduce = useReducedMotion()
  // `from` est figé au premier affichage
  const [start] = useState(from)
  const [landed, setLanded] = useState(false)
  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => setLanded(true), reduce ? 0 : 1500)
    return () => clearTimeout(id)
  }, [inView, reduce])

  let reel = 0
  return (
    <span ref={ref} className={`odometer mono ${landed ? 'offset' : ''} ${className}`} aria-label={to}>
      {to.split('').map((ch, i) => {
        if (!DIGITS.includes(ch)) {
          return (
            <span key={i} className="odometer__static" aria-hidden>
              {ch}
            </span>
          )
        }
        const k = reel++
        const a = Number(start[i] ?? 0)
        const b = Number(ch)
        // chaque rouleau fait 1 ou 2 tours de plus que le précédent : ils ne s'arrêtent pas en même temps
        const end = 10 * (1 + (k % 2)) + b
        return (
          <span key={i} className="odometer__window" aria-hidden>
            <motion.span
              className="odometer__reel"
              initial={{ y: `-${a}em`, filter: 'blur(0px)' }}
              animate={inView ? { y: `-${end}em`, filter: ['blur(0px)', 'blur(3px)', 'blur(0px)'] } : undefined}
              transition={{ duration: reduce ? 0 : 0.9 + k * 0.13, ease: [0.22, 1, 0.36, 1] }}
            >
              {Array.from({ length: 30 }, (_, n) => (
                <span key={n}>{n % 10}</span>
              ))}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
