import { useState, type ReactNode } from 'react'
import { CIRCLE } from '../lib/scribbles'
import { Scribble } from './Scribble'

// Lien CTA entouré d'un cercle dessiné, qui se redessine au survol / toucher.
export function CircleLink({
  href,
  children,
  play,
  delay = 0,
  className = '',
}: {
  href: string
  children: ReactNode
  play?: boolean
  delay?: number
  className?: string
}) {
  const [round, setRound] = useState(0)
  const redraw = () => setRound((r) => r + 1)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`circle-btn ${className}`}
      onPointerEnter={redraw}
      onFocus={redraw}
      data-magnetic
    >
      <Scribble
        key={round}
        shape={CIRCLE}
        strokeWidth={3}
        offset={[3, 2]}
        className="circle-btn__ring"
        play={play}
        delay={round === 0 ? delay : 0}
        duration={round === 0 ? 0.7 : 0.45}
        stretch
      />
      <span>{children}</span>
    </a>
  )
}
