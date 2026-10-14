import { useCallback, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { RELEASE } from '../config'
import { CircleLink } from '../components/CircleLink'
import { Countdown } from '../components/Countdown'
import { DrawLayer } from '../components/DrawLayer'
import { Scribble } from '../components/Scribble'
import { HANDOFF_EVENT } from '../components/TopBar'
import { ARROW_DOWN, HEART } from '../lib/scribbles'
import { isReleased } from '../lib/time'
import './Hero.css'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero({ now, entered }: { now: Date; entered: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const released = isReleased(now)
  const [drew, setDrew] = useState(false)
  const onFirstDraw = useCallback(() => setDrew(true), [])

  // sortie : la pochette recule dans le flou, « 11:34 » rétrécit vers la barre du haut
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const coverScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.86])
  const coverBlur = useTransform(scrollYProgress, [0, 0.7], [0, 8])
  const coverOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])
  const coverFilter = useMotionTemplate`blur(${coverBlur}px)`
  const titleScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.4])
  const titleY = useTransform(scrollYProgress, [0, 0.55], ['0vh', '-28vh'])
  const titleOpacity = useTransform(scrollYProgress, [0.35, 0.55], [1, 0])

  const handedOff = useRef(false)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p > 0.55 && !handedOff.current) {
      handedOff.current = true
      window.dispatchEvent(new Event(HANDOFF_EVENT))
    } else if (p < 0.4) {
      handedOff.current = false
    }
  })

  const show = entered ? 'shown' : 'hidden'

  return (
    <section ref={ref} className="hero" id="top" aria-label={`kruu — ${RELEASE.title}`}>
      <div className="hero__bg" style={{ backgroundImage: `url(${RELEASE.cover})` }} aria-hidden />

      <motion.div className="hero__cover-wrap" style={{ scale: coverScale, opacity: coverOpacity, filter: coverFilter }}>
        <motion.div
          className="hero__cover"
          initial={{ filter: 'blur(40px)', opacity: 0, scale: 1.04 }}
          animate={entered ? { filter: 'blur(0px)', opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        >
          <img src={RELEASE.cover} alt={`${RELEASE.title} album cover`} width={800} height={800} />
          <DrawLayer onFirstDraw={onFirstDraw} />
        </motion.div>
        <Scribble shape={HEART} className="hero__heart" play={entered} delay={1.1} />
        <motion.span
          className="hand blue hero__hint"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          {drew ? 'again ♡' : 'draw on it ↑'}
        </motion.span>
      </motion.div>

      <div className="hero__text">
        <motion.h1
          className="mono offset hero__title"
          style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
          aria-label={RELEASE.title}
        >
          {RELEASE.title.split('').map((c, i) => (
            <motion.span
              key={i}
              aria-hidden
              variants={{ hidden: { y: '45%', opacity: 0 }, shown: { y: '0%', opacity: 1 } }}
              initial="hidden"
              animate={show}
              transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.06 }}
            >
              {c}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className="hero__meta"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="hero__row">
            <span className="hero__kicker">{released ? 'out now' : 'new album'}</span>
            <span className="mono ash">{RELEASE.dateLabel}</span>
          </div>
          <Countdown now={now} />
        </motion.div>

        <div className="hero__cta">
          <CircleLink href={released ? RELEASE.listenUrl : RELEASE.presaveUrl} play={entered} delay={1.3}>
            {released ? 'listen' : 'pre-save'}
          </CircleLink>
          <motion.span
            className="label"
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : undefined}
            transition={{ delay: 1.8 }}
          >
            spotify · apple music · deezer · +
          </motion.span>
        </div>
      </div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1, y: [0, 6, 0] } : undefined}
        transition={{ opacity: { delay: 2.2 }, y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 2.2 } }}
        aria-hidden
      >
        <Scribble shape={ARROW_DOWN} strokeWidth={3} offset={[2, 2]} play={entered} delay={2.2} />
      </motion.div>
    </section>
  )
}
