import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { RELEASE } from '../config'
import { CircleLink } from '../components/CircleLink'
import { Odometer } from '../components/Odometer'
import { Scribble } from '../components/Scribble'
import { SectionHead } from '../components/SectionHead'
import { Splatter } from '../components/Splatter'
import { ARROW_CURVE } from '../lib/scribbles'
import type { ReleaseState } from '../hooks/useRelease'
import { duration } from '../lib/album'
import { clockDigits, pad } from '../lib/time'
import './Album.css'

const EASE = [0.22, 1, 0.36, 1] as const

// Avant la sortie, aucun titre n'est affiché : seulement des barres floues.
function HiddenRow({ n, width }: { n: number; width: number }) {
  const [peek, setPeek] = useState(0)
  return (
    <motion.li
      className="track"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: n * 0.05, ease: EASE }}
    >
      <button
        className="track__btn"
        onClick={() => setPeek((p) => p + 1)}
        onPointerLeave={() => setPeek(0)}
        aria-label={`track ${n}, revealed ${RELEASE.shortDate}`}
      >
        <span className="mono ash track__n">{pad(n)}</span>
        <motion.span
          className="track__bar"
          style={{ width }}
          animate={{ filter: peek ? 'blur(1px)' : 'blur(3px)', opacity: peek ? 0.85 : 0.55 }}
          transition={{ duration: 0.25 }}
        />
        <span className="mono ash track__time">{peek ? 'soon' : '?:??'}</span>
        {peek > 0 && <Splatter key={peek} seed={peek + n} count={7} className="track__splat" play />}
      </button>
    </motion.li>
  )
}

export function Album({ now, release }: { now: Date; release: ReleaseState }) {
  const { released, tracks, trackCount } = release
  const widths = useMemo(() => Array.from({ length: trackCount }, (_, i) => 110 + ((i * 73) % 130)), [trackCount])

  return (
    <section className="album" id="album" aria-label={`the album ${RELEASE.title}`}>
      <SectionHead label="04 / the album" />
      <h2 className="album__title">
        <Odometer from={clockDigits(now)} to={RELEASE.title} />
      </h2>
      <span className="label">
        {RELEASE.dateLabel} — {tracks ? `${tracks.length} tracks` : `tracklist revealed ${RELEASE.shortDate}`}
      </span>

      <ol className="album__list">
        {tracks
          ? tracks.map((t, i) => (
              <motion.li
                key={t.n}
                className="track"
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                {t.url ? (
                  <a className="track__btn track--revealed" href={t.url} target="_blank" rel="noopener noreferrer">
                    <span className="mono ash track__n">{pad(t.n)}</span>
                    <span className="track__name">{t.name}</span>
                    <span className="mono ash track__time">{duration(t.ms)}</span>
                  </a>
                ) : (
                  <span className="track__btn track--revealed">
                    <span className="mono ash track__n">{pad(t.n)}</span>
                    <span className="track__name">{t.name}</span>
                  </span>
                )}
              </motion.li>
            ))
          : widths.map((w, i) => <HiddenRow key={i} n={i + 1} width={w} />)}
      </ol>

      {!tracks && (
        <div className="album__note" aria-hidden>
          <Scribble shape={ARROW_CURVE} strokeWidth={3} offset={[2, 2]} className="album__arrow" />
          <span className="hand blue">revealed {RELEASE.shortDate}</span>
        </div>
      )}

      <div className="album__cta">
        <CircleLink href={released ? RELEASE.listenUrl : RELEASE.presaveUrl}>{released ? 'listen' : 'pre-save'}</CircleLink>
      </div>
    </section>
  )
}
