import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Grain } from './components/Grain'
import { Loader } from './components/Loader'
import { TopBar } from './components/TopBar'
import { useNow } from './hooks/useNow'
import { setSound } from './lib/audio'
import { Hero } from './sections/Hero'

// ?skip saute le loader (pratique en dev et pour les captures)
const SKIP_LOADER = new URLSearchParams(window.location.search).has('skip')

export function App() {
  const now = useNow()
  const [entered, setEntered] = useState(SKIP_LOADER)

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
      </main>
      <Grain />
    </MotionConfig>
  )
}
