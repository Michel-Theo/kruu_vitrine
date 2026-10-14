import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Grain } from './components/Grain'
import { Loader } from './components/Loader'
import { Thread } from './components/Thread'
import { TopBar } from './components/TopBar'
import { useNow } from './hooks/useNow'
import { setSound } from './lib/audio'
import { Album } from './sections/Album'
import { CameraRoll } from './sections/CameraRoll'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { NowPlaying } from './sections/NowPlaying'
import './App.css'

// ?skip saute le loader (pratique en dev et pour les captures)
const SKIP_LOADER = new URLSearchParams(window.location.search).has('skip')

export function App() {
  const now = useNow()
  const [entered, setEntered] = useState(SKIP_LOADER)
  const chapters = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.toggle('is-locked', !entered)
  }, [entered])

  const enter = (withSound: boolean) => {
    if (withSound) setSound(true)
    window.scrollTo(0, 0)
    setEntered(true)
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!entered && <Loader key="loader" onEnter={enter} />}</AnimatePresence>
      <TopBar now={now} visible={entered} />
      <main>
        <Hero now={now} entered={entered} />
        <div ref={chapters} className="chapters">
          <Thread container={chapters} />
          <CameraRoll />
          <NowPlaying />
          <Album now={now} />
        </div>
      </main>
      <Footer now={now} />
      <Grain />
    </MotionConfig>
  )
}
