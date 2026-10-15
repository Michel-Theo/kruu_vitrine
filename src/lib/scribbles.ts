// Tracés « dessinés à la main » du site.
// Chaque entrée : viewBox + chemin. Le composant <Scribble> ajoute le double bleu décalé.

export type ScribbleShape = { viewBox: string; d: string; fill?: boolean }

export const HEART: ScribbleShape = {
  viewBox: '0 0 108 100',
  d: 'M50 88 C 14 64, 2 36, 20 18 C 34 5, 48 14, 50 30 C 53 13, 68 4, 81 15 C 99 32, 88 62, 50 88 Z',
  fill: true,
}

export const CIRCLE: ScribbleShape = {
  viewBox: '0 0 240 86',
  d: 'M24 45 C 19 10, 192 2, 223 34 C 240 60, 158 82, 96 79 C 29 76, 0 53, 29 28 C 53 12, 106 7, 149 9',
}

export const UNDERLINE: ScribbleShape = {
  viewBox: '0 0 220 20',
  d: 'M4 12 C 44 2, 88 19, 132 9 S 198 4, 216 11',
}

export const ARROW_DOWN: ScribbleShape = {
  viewBox: '0 0 40 80',
  d: 'M20 5 C 23 30, 17 50, 20 72 M8 58 L20 74 L33 57',
}

export const ARROW_CURVE: ScribbleShape = {
  viewBox: '0 0 90 70',
  d: 'M6 10 C 30 0, 70 10, 74 52 M60 42 L74 56 L86 40',
}

export const BRACKET_L: ScribbleShape = {
  viewBox: '0 0 80 310',
  d: 'M62 8 C 30 60, 14 150, 22 230 C 26 268, 40 292, 52 300',
}

export const KR: ScribbleShape = {
  viewBox: '0 0 110 96',
  d: 'M14 10 C 13 30, 12 55, 11 82 M11 56 C 22 46, 34 36, 44 26 M18 50 C 28 60, 38 72, 50 84 M64 84 C 64 70, 65 58, 66 46 M66 60 C 72 46, 84 40, 96 46',
}

// Ligne de progression ondulée (loader, galerie desktop)
export function wavyLine(width: number, height = 16, waves = 24): ScribbleShape {
  const pts: string[] = []
  for (let i = 0; i <= waves; i++) {
    const x = 4 + ((width - 8) * i) / waves
    const y = height / 2 + (i % 2 ? 2.2 : -2.2)
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return { viewBox: `0 0 ${width} ${height}`, d: 'M' + pts.join(' L') }
}

// Gouttes d'éclaboussure, déterministes pour un seed donné
export function splatterDots(seed: number, count: number) {
  let s = seed * 9301 + 49297
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5
  const sizes = [2, 3, 4, 6, 9, 13, 18]
  return Array.from({ length: count }, () => ({
    x: 50 + gauss() * 40,
    y: 50 + gauss() * 40,
    r: sizes[Math.floor(rnd() * sizes.length)] * (0.7 + rnd() * 0.5),
    blue: rnd() < 0.65,
    delay: rnd() * 0.15,
  }))
}
