import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Cursor } from './components/Cursor'
import { EasterEgg } from './components/EasterEgg'
import { Grain } from './components/Grain'
import { Loader } from './components/Loader'
import { TapSplatter } from './components/TapSplatter'
import { Thread } from './components/Thread'
import { TopBar } from './components/TopBar'
import { useNow } from './hooks/useNow'
import { useTabTitle } from './hooks/useTabTitle'
import { setSound } from './lib/audio'
import { isReleased } from './lib/time'
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
  useTabTitle()

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
        <Hero now={now} entered={entered} released={isReleased(now)} />
        <Thread />
        <CameraRoll />
        <Thread />
        <div className="duo">
          <NowPlaying />
          <Thread className="thread--mobile-only" />
          <Album now={now} />
        </div>
        <Thread />
      </main>
      <Footer now={now} />
      <EasterEgg now={now} enabled={entered} />
      <TapSplatter />
      <Cursor />
      <Grain />
    </MotionConfig>
  )
}
