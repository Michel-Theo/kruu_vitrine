import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RELEASE } from '../config'
import { hasAudio, setSound, useSound } from '../lib/audio'
import { clock12 } from '../lib/time'
import './TopBar.css'

export const HANDOFF_EVENT = 'kruu:handoff'

export function TopBar({ now, visible }: { now: Date; visible: boolean }) {
  const sound = useSound()
  // quand le grand « 11:34 » du hero quitte l'écran, l'horloge l'affiche 2 s
  const [handoff, setHandoff] = useState(false)

  useEffect(() => {
    let id = 0
    const on = () => {
      setHandoff(true)
      window.clearTimeout(id)
      id = window.setTimeout(() => setHandoff(false), 2200)
    }
    window.addEventListener(HANDOFF_EVENT, on)
    return () => {
      window.removeEventListener(HANDOFF_EVENT, on)
      window.clearTimeout(id)
    }
  }, [])

  const text = handoff ? RELEASE.title : clock12(now)

  return (
    <motion.header
      className="topbar"
      initial={{ opacity: 0, y: -8 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <a href="#top" className="topbar__logo">
        kruu
      </a>
      <nav className="topbar__nav" aria-label="sections">
        <a href="#album">{RELEASE.title}</a>
        <a href="#camera-roll">camera roll</a>
        <a href="#now-playing">now playing</a>
        <a href="#links">links</a>
      </nav>
      <div className="topbar__right mono">
        {hasAudio && (
          <button className="topbar__sound" onClick={() => setSound(!sound)} aria-pressed={sound}>
            sound {sound ? 'on' : 'off'}
          </button>
        )}
        <span className="topbar__clock">
          <span className="dot" aria-hidden />
          <AnimatePresence mode="wait" initial={false}>
            <motion.time
              key={handoff ? 'h' : 'c'}
              className={handoff ? 'topbar__time--handoff' : undefined}
              initial={{ opacity: 0, y: handoff ? 10 : -6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
            >
              {text}
            </motion.time>
          </AnimatePresence>
        </span>
      </div>
    </motion.header>
  )
}
