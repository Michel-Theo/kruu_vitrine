import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { ROLL } from '../config'
import { Scribble } from '../components/Scribble'
import { SectionHead, TypeLine } from '../components/SectionHead'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { HEART, wavyLine } from '../lib/scribbles'
import { pad } from '../lib/time'
import './CameraRoll.css'

const EASE = [0.22, 1, 0.36, 1] as const
const ROT = [-3, 4, -1, 3, -4, 2]

// Une photo :
// - entrée : elle tombe sur la page en tournant, comme un tirage jeté sur un lit ;
// - au défilement : plus elle approche du centre de l'écran, plus elle se redresse, grandit et devient nette ;
// - au centre la première fois : flash blanc + horodatage tapé.
function Photo({ i, distance, className }: { i: number; distance: MotionValue<number>; className?: string }) {
  const blur = useTransform(distance, [0, 0.4, 1], [0, 1, 3])
  const filter = useMotionTemplate`blur(${blur}px) grayscale(1)`
  const opacity = useTransform(distance, [0, 1], [1, 0.82])
  const base = ROT[i % ROT.length]
  const rotate = useTransform(distance, [0, 1], [base * 0.25, base * 1.6])
  const scale = useTransform(distance, [0, 1], [1.03, 0.92])
  const [focused, setFocused] = useState(false)
  useMotionValueEvent(distance, 'change', (d) => {
    if (d < 0.18 && !focused) setFocused(true)
  })
  const photo = ROLL[i]
  return (
    <motion.figure
      className={`roll-photo ${className ?? ''}`}
      style={{ aspectRatio: photo.ratio }}
      initial={{ y: -180, rotate: base * 5, scale: 1.1, opacity: 0 }}
      whileInView={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.97 }}
      viewport={{ once: true, margin: '0px 0px -25% 0px' }}
      transition={{ duration: 1, ease: EASE, delay: (i % 2) * 0.12 }}
    >
      <motion.div className="roll-photo__inner" style={{ rotate, scale }}>
        <motion.img src={photo.src} alt="" loading="lazy" style={{ filter, opacity }} draggable={false} />
        {focused && (
          <motion.span
            className="roll-photo__flash"
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            aria-hidden
          />
        )}
        <figcaption className="roll-photo__stamp mono">
          {focused ? <TypeLine text={photo.stamp} /> : ' '}
        </figcaption>
      </motion.div>
    </motion.figure>
  )
}

// mobile : la distance vient de la position verticale de la photo dans l'écran
function ScrollPhoto({ i, className }: { i: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const distance = useTransform(scrollYProgress, (p) => Math.min(1, Math.abs(p - 0.5) * 2.4))
  return (
    <div ref={ref} className={`roll-slot roll-slot--${i}`}>
      <Photo i={i} distance={distance} className={className} />
    </div>
  )
}

function MobileRoll() {
  return (
    <div className="roll-mobile">
      {ROLL.map((_, i) => (
        <ScrollPhoto key={i} i={i} />
      ))}
      <Scribble shape={HEART} className="roll-mobile__heart" />
    </div>
  )
}

// desktop : section épinglée, le scroll vertical fait défiler la bande horizontalement
function DesktopPhoto({ i, x, slot }: { i: number; x: MotionValue<number>; slot: { left: number; width: number } }) {
  const distance = useTransform(x, (v) => {
    const center = slot.left + slot.width / 2 + v
    return Math.min(1, Math.abs(center - window.innerWidth / 2) / (window.innerWidth * 0.45))
  })
  return <Photo i={i} distance={distance} />
}

function DesktopRoll() {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [slots, setSlots] = useState<{ left: number; width: number }[]>([])
  const [travel, setTravel] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])
  const [index, setIndex] = useState(1)
  useMotionValueEvent(scrollYProgress, 'change', (p) => setIndex(1 + Math.round(p * (ROLL.length - 1))))

  useLayoutEffect(() => {
    const measure = () => {
      const t = track.current
      if (!t) return
      const kids = [...t.children] as HTMLElement[]
      setSlots(kids.map((k) => ({ left: k.offsetLeft, width: k.offsetWidth })))
      setTravel(Math.max(0, t.scrollWidth - window.innerWidth + window.innerWidth * 0.3))
    }
    measure()
    // re-mesure si la bande change de taille (polices, images, redimensionnement)
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [])

  const line = wavyLine(400, 18)
  return (
    <div ref={section} className="roll-desktop">
      <div className="roll-desktop__sticky">
        <div className="roll-desktop__head">
          <SectionHead label="02 / camera roll" title="the archive" aside={<span className="hand blue roll__aside">(11pm photos)</span>} />
        </div>
        <motion.div ref={track} className="roll-desktop__track" style={{ x }}>
          {ROLL.map((_, i) => (
            <div key={i} className={`roll-desktop__slot roll-desktop__slot--${i % 3}`} style={{ aspectRatio: ROLL[i].ratio }}>
              {slots[i] && <DesktopPhoto i={i} x={x} slot={slots[i]} />}
            </div>
          ))}
        </motion.div>
        <div className="roll-desktop__progress">
          <svg viewBox={line.viewBox} aria-hidden>
            <path d="M4 9 L396 9" stroke="var(--paper)" strokeOpacity={0.12} />
            <motion.path d={line.d} fill="none" stroke="var(--paper)" strokeWidth={3} strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
          </svg>
          <span className="label">
            {pad(index)} / {pad(ROLL.length)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function CameraRoll() {
  const desktop = useIsDesktop()
  return (
    <section className="roll" id="camera-roll" aria-label="camera roll">
      {desktop ? (
        <DesktopRoll />
      ) : (
        <>
          <SectionHead label="02 / camera roll" title="the archive" aside={<span className="hand blue roll__aside">(11pm photos)</span>} />
          <MobileRoll />
        </>
      )}
    </section>
  )
}
