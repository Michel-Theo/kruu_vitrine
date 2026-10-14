import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { RELEASE, ROLL, SINGLE } from '../config'
import { hasAudio } from '../lib/audio'
import { CIRCLE, HEART, UNDERLINE, wavyLine } from '../lib/scribbles'
import { pad } from '../lib/time'
import { Scribble } from './Scribble'
import './Loader.css'

const TARGET_MINUTES = 11 * 60 + 34
const VISITED_KEY = 'kruu:visited'
const FLASHES = [0.22, 0.48, 0.74]
const LINE = wavyLine(240)

function preload(onProgress: (p: number) => void) {
  const urls = [RELEASE.cover, SINGLE.cover, ...ROLL.slice(0, 3).map((r) => r.src)]
  const jobs: Promise<unknown>[] = [
    ...urls.map(
      (src) =>
        new Promise((res) => {
          const img = new Image()
          img.onload = img.onerror = res
          img.src = src
        }),
    ),
    document.fonts.ready,
  ]
  let done = 0
  jobs.forEach((j) => j.then(() => onProgress(++done / jobs.length)))
}

function visitedBefore() {
  try {
    const v = localStorage.getItem(VISITED_KEY)
    localStorage.setItem(VISITED_KEY, '1')
    return v === '1'
  } catch {
    return false
  }
}

export function Loader({ onEnter }: { onEnter: (withSound: boolean) => void }) {
  const reduce = useReducedMotion()
  const minDuration = useMemo(() => (visitedBefore() ? 0.9 : 2.4), [])
  const progress = useMotionValue(0)
  const [minutes, setMinutes] = useState(0)
  const [ready, setReady] = useState(false)
  const [flash, setFlash] = useState<number | null>(null)
  const lastFlash = useRef(-1)

  // Le compteur suit le vrai chargement, mais jamais plus vite que minDuration.
  useEffect(() => {
    let real = 0
    const start = performance.now()
    preload((p) => (real = p))
    let raf = 0
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000
      const target = Math.min(real, elapsed / minDuration)
      const current = progress.get()
      progress.set(current + (target - current) * 0.12)
      if (target >= 1 && current > 0.995) {
        progress.set(1)
        setReady(true)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [minDuration, progress])

  useMotionValueEvent(progress, 'change', (p) => {
    setMinutes(Math.round(p * TARGET_MINUTES))
    if (reduce) return
    const i = FLASHES.findIndex((f, k) => p >= f && (FLASHES[k + 1] ?? 2) > p)
    if (i > lastFlash.current) {
      lastFlash.current = i
      setFlash(i)
    }
  })

  // le flash ne dure qu'un instant
  useEffect(() => {
    if (flash === null) return
    const id = setTimeout(() => setFlash(-1), 140)
    return () => clearTimeout(id)
  }, [flash])

  const digits = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
  const percent = String(Math.round((minutes / TARGET_MINUTES) * 100)).padStart(3, '0')

  return (
    <motion.div
      className="loader"
      exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.2 } }}
      role="dialog"
      aria-label="loading"
    >
      <div className="loader__top label">
        <span>kruu — {RELEASE.title}</span>
        <span>out {RELEASE.shortDate}</span>
      </div>

      <AnimatePresence>
        {flash !== null && flash >= 0 && (
          <motion.div
            key={flash}
            className="loader__flash"
            style={{ backgroundImage: `url(${ROLL[flash].src})`, rotate: [4, -6, 3][flash] }}
            initial={{ opacity: 0.32 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="loader__center"
        exit={{ filter: 'blur(14px)', opacity: 0, scale: 1.04, transition: { duration: 0.5 } }}
      >
        <div className="loader__clock">
          <span
            className={`mono loader__digits ${ready ? 'offset' : ''}`}
            style={{ opacity: 0.35 + 0.65 * Math.min(1, minutes / 120) }}
            aria-live="off"
          >
            {digits}
          </span>
          {ready && <Scribble shape={HEART} className="loader__heart" delay={0.25} />}
        </div>

        <div className="loader__line">
          {ready ? (
            <Scribble shape={UNDERLINE} strokeWidth={3} offset={[2, 2]} delay={0.1} className="loader__underline" />
          ) : (
            <svg viewBox={LINE.viewBox} aria-hidden>
              <path d={`M4 8 L236 8`} stroke="var(--paper)" strokeOpacity={0.12} strokeWidth={1} />
              <motion.path d={LINE.d} fill="none" stroke="var(--blue)" strokeWidth={3} strokeLinecap="round" transform="translate(2 2)" style={{ pathLength: progress }} />
              <motion.path d={LINE.d} fill="none" stroke="var(--paper)" strokeWidth={3} strokeLinecap="round" style={{ pathLength: progress }} />
            </svg>
          )}
        </div>

        <div className="label loader__status">{ready ? ' ' : `${percent} % — loading the night…`}</div>

        <AnimatePresence>
          {ready && (
            <motion.div
              className="loader__actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="circle-btn" onClick={() => onEnter(hasAudio)}>
                <Scribble shape={CIRCLE} strokeWidth={3} offset={[3, 2]} className="circle-btn__ring" delay={0.6} stretch />
                <span>{hasAudio ? 'enter with sound' : 'enter'}</span>
              </button>
              {hasAudio && (
                <button className="label loader__nosound" onClick={() => onEnter(false)}>
                  or without sound
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="loader__bottom">
        {ready && hasAudio ? <span className="label">headphones on</span> : <span className="hand loader__hand">wait for me</span>}
      </div>
    </motion.div>
  )
}
