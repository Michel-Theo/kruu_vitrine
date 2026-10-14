import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// URL publique du site : les aperçus de lien (Instagram, Discord, iMessage…) exigent une URL absolue pour og:image.
// À changer via la variable d'environnement SITE_URL quand le domaine est choisi.
const RAW_URL = (process.env.SITE_URL || 'https://kruu-1134.pages.dev').trim().replace(/\/$/, '')
// les aperçus de lien exigent une URL absolue : on ajoute https:// s'il a été oublié
const SITE_URL = /^https?:\/\//.test(RAW_URL) ? RAW_URL : `https://${RAW_URL}`

function siteUrl(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
  }
}

export default defineConfig({
  plugins: [react(), siteUrl()],
})
