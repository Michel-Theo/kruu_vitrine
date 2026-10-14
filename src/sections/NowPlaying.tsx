import { useState } from 'react'
import { motion } from 'motion/react'
import { OTHER_RELEASES, SINGLE } from '../config'
import { DrawnLink } from '../components/DrawnLink'
import { BlurWords, SectionHead } from '../components/SectionHead'
import { Splatter } from '../components/Splatter'
import './NowPlaying.css'

const EASE = [0.22, 1, 0.36, 1] as const

function Player({ onPlay }: { onPlay: () => void }) {
  const [loaded, setLoaded] = useState(false)
  if (loaded) {
    return (
      <iframe
        className="player__embed"
        title={`${SINGLE.title} on Spotify`}
        src={`https://open.spotify.com/embed/track/${SINGLE.spotifyTrackId}?utm_source=generator&theme=0`}
        height={80}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    )
  }
  // l'embed (et ses cookies) n'est chargé qu'au clic
  return (
    <button
      className="player"
      onClick={() => {
        setLoaded(true)
        onPlay()
      }}
    >
      <img src={SINGLE.cover} alt="" className="player__thumb" />
      <span className="player__text">
        <span className="player__title">{SINGLE.title}</span>
        <span className="mono ash player__sub">kruu · play on spotify</span>
      </span>
      <span className="player__play" aria-hidden>
        <svg viewBox="0 0 12 14" width="12" height="14">
          <path d="M1 1 L11 7 L1 13 Z" fill="var(--ink)" />
        </svg>
      </span>
    </button>
  )
}

export function NowPlaying() {
  const [playing, setPlaying] = useState(false)
  return (
    <section className="now" id="now-playing" aria-label="now playing">
      <SectionHead label="03 / now playing" />
      <div className="now__grid">
        <div className="now__cover-wrap">
          <motion.img
            src={SINGLE.cover}
            alt={`${SINGLE.title} single cover`}
            className="now__cover"
            loading="lazy"
            initial={{ filter: 'blur(20px)', scale: 1.04, opacity: 0.6 }}
            whileInView={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
          />
          <Splatter seed={3} count={16} className="now__splat now__splat--a" breathing={playing} delay={0.5} />
          <Splatter seed={11} count={14} className="now__splat now__splat--b" breathing={playing} delay={0.6} />
        </div>

        <div className="now__info">
          <BlurWords text={SINGLE.title} className="now__title" />
          <span className="label">single — {SINGLE.dateLabel}</span>
          <Player onPlay={() => setPlaying(true)} />
          <nav className="now__links" aria-label="listen">
            {SINGLE.links.map((l) => (
              <DrawnLink key={l.label} href={l.href}>
                {l.label}
              </DrawnLink>
            ))}
          </nav>

          <div className="now__more">
            <span className="label">also in 2026</span>
            <ul className="now__thumbs">
              {OTHER_RELEASES.map((r, i) => (
                <motion.li
                  key={r.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                >
                  <a href={r.href} target="_blank" rel="noopener noreferrer">
                    <img src={r.image} alt="" loading="lazy" />
                    <span className="mono ash">{r.title}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
