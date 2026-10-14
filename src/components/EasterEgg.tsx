import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASTER_EGG, RELEASE } from '../config'
import { useSound } from '../lib/audio'
import { HEART, UNDERLINE } from '../lib/scribbles'
import { clock12, isSecretMinute, pad } from '../lib/time'
import { Scribble } from './Scribble'
import './EasterEgg.css'

// ?egg dans l'URL pour le prévisualiser à n'importe quelle heure
const FORCE = new URLSearchParams(window.location.search).has('egg')

// À 11:34 (am et pm, heure locale) : le site « s'allume » pendant une minute.
export function EasterEgg({ now, enabled }: { now: Date; enabled: boolean }) {
  const minuteKey = `${now.toDateString()} ${now.getHours()}:${now.getMinutes()}`
  const [dismissed, setDismissed] = useState<string | null>(null)
  const sound = useSound()
  const close = () => setDismissed(minuteKey)
  const active = enabled && (FORCE || isSecretMinute(now)) && dismissed !== minuteKey
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDismissed(minuteKey)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, minuteKey])
  const nextMinute = `${pad(EASTER_EGG.hour12)}:${pad(EASTER_EGG.minute + 1)}`

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="egg"
          role="dialog"
          aria-label="a message from kruu"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          {/* flash blanc */}
          <motion.div className="egg__flash" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.18 }} aria-hidden />
          <div className="egg__top">
            <span className="egg__logo">kruu</span>
            <span className="mono egg__clock">
              <span>sound {sound ? 'on' : 'off'}</span>
              <span className="egg__dot" aria-hidden />
              {clock12(now)}
            </span>
          </div>
          <button className="sr-only" onClick={close}>
            close
          </button>
          <span className="mono egg__time">{RELEASE.title}</span>
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
          <Scribble shape={UNDERLINE} className="egg__underline" color="var(--ink)" shadow="var(--blue)" strokeWidth={3} offset={[2, 2]} play delay={1.6} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
