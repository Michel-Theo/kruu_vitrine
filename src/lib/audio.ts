import { useSyncExternalStore } from 'react'
import { AMBIENT_AUDIO } from '../config'

// Ambiance sonore optionnelle : rien ne se passe tant que AMBIENT_AUDIO vaut null.
let el: HTMLAudioElement | null = null
let playing = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function audio() {
  if (!AMBIENT_AUDIO) return null
  if (!el) {
    el = new Audio(AMBIENT_AUDIO)
    el.loop = true
    el.volume = 0.5
  }
  return el
}

export const hasAudio = AMBIENT_AUDIO !== null

export async function setSound(on: boolean) {
  const a = audio()
  if (!a) return
  try {
    if (on) await a.play()
    else a.pause()
    playing = on
  } catch {
    playing = false
  }
  emit()
}

export function useSound() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => playing,
  )
}
