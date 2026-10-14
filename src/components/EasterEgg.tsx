import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASTER_EGG, RELEASE } from '../config'
import { HEART } from '../lib/scribbles'
import { isSecretMinute, pad } from '../lib/time'
import { Scribble } from './Scribble'
import './EasterEgg.css'

// ?egg dans l'URL pour le prévisualiser à n'importe quelle heure
const FORCE = new URLSearchParams(window.location.search).has('egg')

// À 11:34 (am et pm, heure locale) : le site « s'allume » pendant une minute.
export function EasterEgg({ now, enabled }: { now: Date; enabled: boolean }) {
  const minuteKey = `${now.toDateString()} ${now.getHours()}:${now.getMinutes()}`
  const [dismissed, setDismissed] = useState<string | null>(null)
  const active = enabled && (FORCE || isSecretMinute(now)) && dismissed !== minuteKey
  const nextMinute = `${pad(EASTER_EGG.hour12)}:${pad(EASTER_EGG.minute + 1)}`

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="egg"
          role="dialog"
          aria-label="a message from kruu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          {/* flash blanc */}
          <motion.div className="egg__flash" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.18 }} aria-hidden />
          <button className="egg__close mono" onClick={() => setDismissed(minuteKey)} aria-label="close">
            ✕
          </button>
          <span className="mono egg__time offset">{RELEASE.title}</span>
          <div className="egg__cover">
            <img src={RELEASE.cover} alt="" />
            <Scribble shape={HEART} className="egg__heart" color="var(--blue)" shadow="var(--ink)" play delay={0.8} />
          </div>
          <motion.p
            className="hand egg__message"
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {EASTER_EGG.message.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </motion.p>
          <span className="label egg__note">this message disappears at {nextMinute}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
