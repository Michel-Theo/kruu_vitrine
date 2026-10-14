import { useEffect, useState } from 'react'
import { RELEASE } from '../config'
import { fetchAlbum, type AlbumInfo, type Track } from '../lib/album'
import { isReleased, RELEASE_TIME } from '../lib/time'

// ?released force l'état « après la sortie » (pour tester)
const FORCE = new URLSearchParams(window.location.search).has('released')
const RETRY_MS = 2 * 60 * 1000

export type ReleaseState = {
  released: boolean
  // tracklist (null tant que l'album n'est pas sorti, ou si l'API ne répond pas)
  tracks: Track[] | null
  trackCount: number
}

// L'album est « sorti » quand la date est passée OU quand Apple le rend écoutable.
export function useRelease(now: Date): ReleaseState {
  const [album, setAlbum] = useState<AlbumInfo | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    let id = 0
    const load = async () => {
      const data = await fetchAlbum(ctrl.signal)
      if (data) setAlbum(data)
      // autour de la sortie, on revérifie régulièrement pour basculer sans recharger la page
      const nearRelease = Math.abs(Date.now() - RELEASE_TIME) < 36 * 3600 * 1000
      if (nearRelease && !data?.streamable) id = window.setTimeout(load, RETRY_MS)
    }
    load()
    return () => {
      ctrl.abort()
      window.clearTimeout(id)
    }
  }, [])

  const released = FORCE || isReleased(now) || !!album?.streamable
  const fallback = RELEASE.tracks?.map((name, i) => ({ n: i + 1, name, ms: null, url: null })) ?? null
  return {
    released,
    tracks: released ? (album?.tracks ?? fallback) : null,
    trackCount: album?.tracks.length ?? RELEASE.trackCount,
  }
}
