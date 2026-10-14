import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ALBUM_SINGLES, RELEASE, spotifyTrackUrl, YOUTUBE_URL, type AlbumSingle } from '../config'
import { DrawnLink } from '../components/DrawnLink'
import { BlurWords, SectionHead } from '../components/SectionHead'
import { Splatter } from '../components/Splatter'
import { setSound } from '../lib/audio'
import { pad } from '../lib/time'
import './NowPlaying.css'

const EASE = [0.22, 1, 0.36, 1] as const

function Player({ track, loaded, onLoad }: { track: AlbumSingle; loaded: boolean; onLoad: () => void }) {
  if (loaded) {
    return (
      <iframe
        key={track.spotifyTrackId}
        className="player__embed"
        title={`${track.title} on Spotify`}
        src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}?utm_source=generator&theme=0`}
        height={80}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    )
  }
  // l'embed (et ses cookies) n'est chargé qu'au clic
  return (
    <button className="player" onClick={onLoad}>
      <img src={track.cover} alt="" className="player__thumb" />
      <span className="player__text">
        <span className="player__title">{track.title}</span>
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
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Un clic dans l'iframe Spotify n'est pas visible par la page, mais la fenêtre perd le focus
  // au profit de l'iframe : on s'en sert pour couper le son de fond quand on lance un titre.
  useEffect(() => {
    if (!loaded) return
    const onBlur = () => {
      setTimeout(() => {
        if (document.activeElement?.classList.contains('player__embed')) setSound(false)
      })
    }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [loaded])

  const loadPlayer = () => {
    // le lecteur Spotify remplace le son de fond
    setSound(false)
    setLoaded(true)
  }
  const coverRef = useRef<HTMLDivElement>(null)
  const track = ALBUM_SINGLES[current]

  const pick = (i: number) => {
    if (i === current) return
    setCurrent(i)
    // sur mobile la pochette peut être au-dessus de l'écran : on remonte pour voir le changement
    const top = coverRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) document.getElementById('now-playing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="now" id="now-playing" aria-label="now playing">
      <SectionHead label="03 / now playing" />
      <div className="now__grid">
        <div ref={coverRef} className="now__cover-wrap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={track.cover}
              src={track.cover}
              alt={`${track.title} cover`}
              className="now__cover"
              loading="lazy"
              initial={{ filter: 'blur(20px)', scale: 1.04, opacity: 0.6 }}
              whileInView={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
              exit={{ filter: 'blur(16px)', scale: 0.97, opacity: 0, transition: { duration: 0.3 } }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </AnimatePresence>
          <Splatter key={`a${current}`} seed={3 + current * 5} count={16} className="now__splat now__splat--a" breathing={loaded} delay={0.5} />
          <Splatter key={`b${current}`} seed={11 + current * 5} count={14} className="now__splat now__splat--b" breathing={loaded} delay={0.6} />
        </div>

        <div className="now__info">
          <BlurWords key={track.title} text={track.title} className="now__title" />
          <span className="label">
            track {pad(track.n)} on {RELEASE.title} · single — {track.dateLabel}
          </span>
          <Player track={track} loaded={loaded} onLoad={loadPlayer} />
          <nav className="now__links" aria-label="listen">
            <DrawnLink href={spotifyTrackUrl(track.spotifyTrackId)}>spotify</DrawnLink>
            <DrawnLink href={track.appleUrl}>apple music</DrawnLink>
            <DrawnLink href={YOUTUBE_URL}>youtube</DrawnLink>
          </nav>

          <div className="now__more">
            <span className="label">already out from {RELEASE.title}</span>
            <ul className="now__thumbs">
              {ALBUM_SINGLES.map((s, i) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                >
                  <button
                    className={`now__thumb ${i === current ? 'is-current' : ''}`}
                    onClick={() => pick(i)}
                    aria-pressed={i === current}
                    aria-label={`play ${s.title}`}
                  >
                    <img src={s.cover} alt="" loading="lazy" />
                    <span className="mono">
                      {pad(s.n)} · {s.title}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
