import { useRef, useState } from 'react'
import { animate, AnimatePresence, motion, useReducedMotion, useScroll, useTransform, useMotionTemplate } from 'motion/react'
import { LINKS, RELEASE } from '../config'
import { LegalNotice } from '../components/LegalNotice'
import { Scribble } from '../components/Scribble'
import { KR } from '../lib/scribbles'
import { clock12, clockDigits, pad } from '../lib/time'
import './Footer.css'

const EASE = [0.22, 1, 0.36, 1] as const

// « rembobiner » : l'horloge revient de l'heure actuelle à 11:34, puis retour en haut
function useRewind(now: Date) {
  const reduce = useReducedMotion()
  const [digits, setDigits] = useState<string | null>(null)
  const run = () => {
    if (reduce) {
      window.scrollTo({ top: 0 })
      return
    }
    const [h, m] = clockDigits(now).split(':').map(Number)
    const from = h * 60 + m
    const to = 11 * 60 + 34
    // on recule toujours (en passant par minuit si besoin)
    const span = (from - to + 720) % 720 || 720
    setDigits(clockDigits(now))
    animate(0, 1, {
      duration: 1.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (p) => {
        const t = (((from - Math.round(span * p)) % 720) + 720) % 720
        setDigits(`${pad(Math.floor(t / 60) || 12)}:${pad(t % 60)}`)
      },
      onComplete: () => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        setTimeout(() => setDigits(null), 350)
      },
    })
  }
  return { digits, run }
}

export function Footer({ now }: { now: Date }) {
  const legal = useRef<HTMLDialogElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const { digits, run } = useRewind(now)

  // « on éteint la lumière » : le vignettage se referme sur les derniers écrans
  const { scrollYProgress } = useScroll({ target: end, offset: ['start end', 'end end'] })
  const radius = useTransform(scrollYProgress, [0, 1], [110, 18])
  const vignette = useMotionTemplate`radial-gradient(circle at 50% 50%, rgba(10,10,10,0) ${radius}%, #000 calc(${radius}% + 30%))`
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1])

  return (
    <footer className="footer" aria-label="links">
      <div className="footer__inner">
        <Scribble shape={KR} className="footer__kr" duration={1.2} />
        <ul className="footer__links">
          {LINKS.map((l, i) => (
            <motion.li
              key={l.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: EASE }}
            >
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="footer__link">
                <span>{l.label}</span>
                <span className="mono ash">{l.handle}</span>
              </a>
            </motion.li>
          ))}
        </ul>
        <span className="hand blue footer__back">
          come back at {RELEASE.title}
        </span>
        <div className="footer__meta label">
          <span>it's {clock12(now)} where you are</span>
          <span>
            © 2026 kruu ·{' '}
            <button className="footer__legal" onClick={() => legal.current?.showModal()}>
              legal notice
            </button>
          </span>
        </div>
      </div>

      <div ref={end} className="footer__end">
        <div className="footer__end-sticky">
          <motion.div className="footer__vignette" style={{ background: vignette }} aria-hidden />
          <motion.div className="footer__night" style={{ opacity: textOpacity }}>
            <span className="hand footer__goodnight">good night.</span>
            <span className="label">{clock12(now)}</span>
            <button className="label footer__rewind" onClick={run}>
              ◂◂ rewind
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {digits && (
          <motion.div
            className="rewind"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden
          >
            <span className={`mono rewind__digits ${digits === RELEASE.title ? 'offset' : ''}`}>{digits}</span>
            <span className="label">◂◂ rewinding</span>
          </motion.div>
        )}
      </AnimatePresence>

      <LegalNotice ref={legal} />
    </footer>
  )
}
