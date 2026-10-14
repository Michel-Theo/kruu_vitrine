import { EASTER_EGG, RELEASE } from '../config'

export const RELEASE_TIME = new Date(RELEASE.date).getTime()

export function isReleased(now: Date) {
  return now.getTime() >= RELEASE_TIME
}

export function daysLeft(now: Date) {
  return Math.max(0, (RELEASE_TIME - now.getTime()) / 86_400_000)
}

export function countdownParts(now: Date) {
  let s = Math.max(0, Math.floor((RELEASE_TIME - now.getTime()) / 1000))
  const d = Math.floor(s / 86400)
  s -= d * 86400
  const h = Math.floor(s / 3600)
  s -= h * 3600
  const m = Math.floor(s / 60)
  s -= m * 60
  return [
    { value: d, unit: 'd' },
    { value: h, unit: 'h' },
    { value: m, unit: 'm' },
    { value: s, unit: 's' },
  ]
}

export const pad = (n: number) => String(n).padStart(2, '0')

// « 11:34 pm »
export function clock12(now: Date) {
  const h = now.getHours() % 12 || 12
  return `${pad(h)}:${pad(now.getMinutes())} ${now.getHours() < 12 ? 'am' : 'pm'}`
}

// « 11:34 » sans am/pm, pour les gros chiffres
export function clockDigits(now: Date) {
  const h = now.getHours() % 12 || 12
  return `${pad(h)}:${pad(now.getMinutes())}`
}

export function isSecretMinute(now: Date) {
  return (now.getHours() % 12 || 12) === EASTER_EGG.hour12 && now.getMinutes() === EASTER_EGG.minute
}
