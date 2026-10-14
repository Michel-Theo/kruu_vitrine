import { useState, type ReactNode } from 'react'
import { UNDERLINE } from '../lib/scribbles'
import { Scribble } from './Scribble'

// Lien dont le soulignement se dessine au survol.
export function DrawnLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const [hover, setHover] = useState(0)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`drawn-link ${className}`}
      onPointerEnter={() => setHover((h) => h + 1)}
      onPointerLeave={() => setHover((h) => -Math.abs(h))}
      onFocus={() => setHover((h) => Math.abs(h) + 1)}
      onBlur={() => setHover((h) => -Math.abs(h))}
    >
      {children}
      <Scribble
        key={Math.abs(hover)}
        shape={UNDERLINE}
        strokeWidth={2.5}
        offset={[2, 2]}
        className="drawn-link__line"
        play={hover > 0}
        duration={0.35}
        stretch
      />
    </a>
  )
}
