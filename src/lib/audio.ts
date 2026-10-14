import { useSyncExternalStore } from 'react'
import { AMBIENT_AUDIO } from '../config'

// Son de fond. Si AMBIENT_AUDIO est renseigné et que le fichier existe, on le joue en boucle.
// Sinon, une ambiance « chambre la nuit » est générée dans le navigateur :
// souffle grave, nappe douce qui respire, craquements de vinyle.

const listeners = new Set<() => void>()
let playing = false
const emit = () => listeners.forEach((l) => l())

let ctx: AudioContext | null = null
let master: GainNode | null = null
let usingFile = false

const FILE_VOLUME = 0.45
const AMBIENT_VOLUME = 0.6

function noiseBuffer(ac: AudioContext, seconds: number, brown: boolean) {
  const buf = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    if (brown) {
      last = (last + 0.02 * w) / 1.02
      d[i] = last * 3.5
    } else {
      d[i] = w
    }
  }
  return buf
}

function setupContext() {
  const ac = new AudioContext()
  const out = ac.createGain()
  out.gain.value = 0
  out.connect(ac.destination)
  ctx = ac
  master = out
  return { ac, out }
}

// le fichier passe par Web Audio pour pouvoir faire des fondus propres
async function tryFile(): Promise<boolean> {
  if (!AMBIENT_AUDIO) return false
  const { ac, out } = setupContext()
  const el = new Audio(AMBIENT_AUDIO)
  el.loop = true
  el.crossOrigin = 'anonymous'
  // branché avant la lecture : le son démarre à volume 0, puis fondu
  ac.createMediaElementSource(el).connect(out)
  try {
    await el.play()
  } catch {
    // fichier absent ou illisible : on referme ce contexte et on passe à l'ambiance générée
    await ac.close()
    ctx = null
    master = null
    return false
  }
  usingFile = true
  return true
}

function buildAmbient() {
  const { ac, out } = setupContext()

  // souffle de la pièce
  const room = ac.createBufferSource()
  room.buffer = noiseBuffer(ac, 4, true)
  room.loop = true
  const roomLp = ac.createBiquadFilter()
  roomLp.type = 'lowpass'
  roomLp.frequency.value = 420
  const roomGain = ac.createGain()
  roomGain.gain.value = 0.22
  room.connect(roomLp).connect(roomGain).connect(out)
  room.start()

  // nappe : quinte grave légèrement désaccordée, qui respire (LFO lent sur le volume)
  const pad = ac.createGain()
  pad.gain.value = 0.05
  const padLp = ac.createBiquadFilter()
  padLp.type = 'lowpass'
  padLp.frequency.value = 900
  pad.connect(padLp).connect(out)
  for (const f of [110, 110.6, 164.8, 220.4]) {
    const o = ac.createOscillator()
    o.type = 'triangle'
    o.frequency.value = f
    o.connect(pad)
    o.start()
  }
  const lfo = ac.createOscillator()
  lfo.frequency.value = 0.07
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.03
  lfo.connect(lfoGain).connect(pad.gain)
  lfo.start()

  // craquements de vinyle : de petites impulsions aléatoires
  const crackle = ac.createBufferSource()
  const cb = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate)
  const cd = cb.getChannelData(0)
  for (let i = 0; i < cd.length; i++) if (Math.random() < 0.0004) cd[i] = (Math.random() * 2 - 1) * 0.8
  crackle.buffer = cb
  crackle.loop = true
  const crackleHp = ac.createBiquadFilter()
  crackleHp.type = 'highpass'
  crackleHp.frequency.value = 1800
  const crackleGain = ac.createGain()
  crackleGain.gain.value = 0.35
  crackle.connect(crackleHp).connect(crackleGain).connect(out)
  crackle.start()
}

export const hasAudio = true

export async function setSound(on: boolean) {
  try {
    if (on && !ctx && !(await tryFile())) buildAmbient()
    if (ctx && master) {
      if (on) await ctx.resume()
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      // fondu d'entrée 2 s, de sortie 0,6 s
      master.gain.linearRampToValueAtTime(on ? (usingFile ? FILE_VOLUME : AMBIENT_VOLUME) : 0, now + (on ? 2 : 0.6))
    }
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
