import { RELEASE } from '../config'

export type Track = { n: number; name: string; ms: number | null; url: string | null }
export type AlbumInfo = { streamable: boolean; tracks: Track[]; url: string | null }

const CACHE_KEY = 'kruu:album'
const CACHE_MS = 10 * 60 * 1000

type ItunesResult = {
  wrapperType: string
  kind?: string
  trackNumber?: number
  trackName?: string
  trackTimeMillis?: number
  trackViewUrl?: string
  collectionViewUrl?: string
  isStreamable?: boolean
}

// API publique d'Apple (iTunes Lookup) : pas de clé, CORS ouvert.
// Elle donne la tracklist de la précommande et `isStreamable`, qui passe à true à la sortie.
export async function fetchAlbum(signal?: AbortSignal): Promise<AlbumInfo | null> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { at, data } = JSON.parse(cached) as { at: number; data: AlbumInfo }
      if (Date.now() - at < CACHE_MS) return data
    }
  } catch {
    // stockage indisponible (navigation privée…) : on interroge l'API
  }

  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${RELEASE.appleAlbumId}&entity=song&country=us`, { signal })
    if (!res.ok) return null
    const json = (await res.json()) as { results: ItunesResult[] }
    const collection = json.results.find((r) => r.wrapperType === 'collection')
    const songs = json.results.filter((r) => r.wrapperType === 'track' && r.kind === 'song')
    if (!songs.length) return null
    const data: AlbumInfo = {
      streamable: songs.some((s) => s.isStreamable),
      url: collection?.collectionViewUrl?.replace(/[?&]uo=\d+/, '') ?? null,
      tracks: songs
        .sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0))
        .map((s) => ({
          n: s.trackNumber ?? 0,
          name: s.trackName ?? '',
          ms: s.trackTimeMillis ?? null,
          url: s.trackViewUrl?.replace(/[?&]uo=\d+/, '') ?? null,
        })),
    }
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
    } catch {
      // pas grave
    }
    return data
  } catch {
    return null
  }
}

export function duration(ms: number | null) {
  if (!ms) return ''
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
