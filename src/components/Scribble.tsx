import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { ScribbleShape } from '../lib/scribbles'

type Props = {
  shape: ScribbleShape
  className?: string
  style?: CSSProperties
  strokeWidth?: number
  // décalage de l'ombre bleue, en unités du viewBox
  offset?: [number, number]
  color?: string
  shadow?: string
  // undefined = dessiné au premier passage dans l'écran ; true/false = piloté par le parent
  play?: boolean
  delay?: number
  duration?: number
  // étire le tracé à la taille du conteneur (cercles autour des boutons)
  stretch?: boolean
}

const EASE = [0.22, 1, 0.36, 1] as const

// Trait blanc + double bleu décalé, qui se dessine (ou « pop » pour les formes pleines).
export function Scribble({
  shape,
  className,
  style,
  strokeWidth = 6,
  offset = [4, 3],
  color = 'var(--paper)',
  shadow = 'var(--blue)',
  play,
  delay = 0,
  duration = 0.7,
  stretch = false,
}: Props) {
  const drawn = shape.fill
    ? { scale: 1, opacity: 1 }
    : { pathLength: 1, opacity: 1 }
  const hidden = shape.fill ? { scale: 0.4, opacity: 0 } : { pathLength: 0, opacity: 0 }
  const trigger =
    play === undefined
      ? { initial: hidden, whileInView: drawn, viewport: { once: true, margin: '0px 0px -10% 0px' } }
      : { initial: hidden, animate: play ? drawn : hidden }

  const paint = (c: string) =>
    shape.fill
      ? { fill: c, stroke: 'none' }
      : {
          fill: 'none',
          stroke: c,
          strokeWidth,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
          vectorEffect: stretch ? ('non-scaling-stroke' as const) : undefined,
        }

  return (
    <svg
      viewBox={shape.viewBox}
      preserveAspectRatio={stretch ? 'none' : undefined}
      className={className}
      style={{ overflow: 'visible', ...style }}
      aria-hidden
    >
      <g transform={`translate(${offset[0]} ${offset[1]})`}>
        <motion.path
          d={shape.d}
          {...paint(shadow)}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          {...trigger}
          transition={{ duration, delay: delay + 0.06, ease: EASE }}
        />
      </g>
      <motion.path
        d={shape.d}
        {...paint(color)}
        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        {...trigger}
        transition={{ duration, delay, ease: EASE }}
      />
    </svg>
  )
}
