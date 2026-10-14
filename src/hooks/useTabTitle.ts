import { useEffect } from 'react'
import { RELEASE } from '../config'

// Onglet en arrière-plan : « come back… ♡ », puis « 11:34 » au retour.
export function useTabTitle() {
  useEffect(() => {
    const base = document.title
    let id = 0
    const onChange = () => {
      window.clearTimeout(id)
      if (document.hidden) {
        document.title = 'come back… ♡'
      } else {
        document.title = RELEASE.title
        id = window.setTimeout(() => (document.title = base), 2000)
      }
    }
    document.addEventListener('visibilitychange', onChange)
    return () => {
      document.removeEventListener('visibilitychange', onChange)
      window.clearTimeout(id)
      document.title = base
    }
  }, [])
}
