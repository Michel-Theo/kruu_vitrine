import { useEffect, useState } from 'react'

// Heure courante, rafraîchie chaque seconde (calée sur le changement de seconde).
export function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let id: number
    const tick = () => {
      setNow(new Date())
      id = window.setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    id = window.setTimeout(tick, 1000 - (Date.now() % 1000))
    return () => window.clearTimeout(id)
  }, [])
  return now
}
