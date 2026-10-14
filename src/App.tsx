import { MotionConfig } from 'motion/react'
import { Grain } from './components/Grain'
import { RELEASE } from './config'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center' }}>
        <h1 className="mono offset" style={{ fontSize: 'clamp(72px, 22vw, 240px)', fontWeight: 200 }}>
          {RELEASE.title}
        </h1>
      </main>
      <Grain />
    </MotionConfig>
  )
}
