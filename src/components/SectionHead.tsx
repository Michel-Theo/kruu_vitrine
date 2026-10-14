import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import './SectionHead.css'

const EASE = [0.22, 1, 0.36, 1] as const

// Label mono tapé caractère par caractère, avec un curseur qui clignote deux fois.
export function TypeLine({ text, className = '', speed = 30 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [typed, setN] = useState(0)
  const n = reduce ? text.length : typed
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    if (n < text.length) return
    const id = setTimeout(() => setSettled(true), 2000)
    return () => clearTimeout(id)
  }, [n, text.length])
  useEffect(() => {
    if (!inView || reduce) return
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), speed)
    return () => clearInterval(id)
  }, [inView, reduce, text, speed])
  const typing = inView && !settled
  return (
    <span ref={ref} className={`typeline ${className}`} aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      {typing && !reduce && (
        <span className="typeline__caret" aria-hidden>
          ▍
        </span>
      )}
    </span>
  )
}

// Titre qui passe du flou au net, mot par mot.
export function BlurWords({ text, className = '', as = 'h2' }: { text: string; className?: string; as?: 'h2' | 'p' | 'span' }) {
  const Tag = motion[as]
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          initial={{ filter: 'blur(12px)', opacity: 0, y: 12 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.08 }}
        >
          {w + (i < text.split(' ').length - 1 ? ' ' : '')}
        </motion.span>
      ))}
    </Tag>
  )
}

export function SectionHead({ label, title, aside }: { label: string; title?: string; aside?: ReactNode }) {
  return (
    <header className="section-head">
      <TypeLine text={label} className="label" />
      {title && (
        <div className="section-head__row">
          <BlurWords text={title} className="section-head__title" />
          {aside}
        </div>
      )}
    </header>
  )
}
