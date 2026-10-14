import { countdownParts, pad } from '../lib/time'
import './Countdown.css'

export function Countdown({ now, released }: { now: Date; released: boolean }) {
  if (released) {
    return (
      <div className="countdown countdown--out mono blue">
        <span className="dot" aria-hidden />
        out now
      </div>
    )
  }
  const parts = countdownParts(now)
  return (
    <div className="countdown mono" role="timer" aria-label={parts.map((p) => `${p.value}${p.unit}`).join(' ')}>
      {parts.map((p) => (
        <span key={p.unit} className="countdown__cell" aria-hidden>
          {pad(p.value)}
          <span className="countdown__unit ash"> {p.unit}</span>
        </span>
      ))}
    </div>
  )
}
