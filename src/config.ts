// Tout ce qui change d'une semaine à l'autre est ici : dates, liens, contenus.
// ⚠️ = à confirmer ou à fournir par l'équipe de l'artiste.

export const RELEASE = {
  title: '11:34',
  // ⚠️ fuseau à confirmer (ici minuit, heure de New York ; Apple indique minuit heure du Pacifique).
  // Le site bascule aussi tout seul dès qu'Apple rend l'album écoutable (voir appleAlbumId).
  date: '2026-11-06T00:00:00-05:00',
  dateLabel: 'nov 6, 2026',
  shortDate: '11/6',
  presaveUrl: 'https://hallwood.lnk.to/kruu-1134',
  // utilisé après la sortie, à la place du pré-save
  listenUrl: 'https://www.fvr.fan/kruu/1134',
  cover: '/img/cover-1134.webp',
  // Album sur Apple Music : la tracklist et l'état « écoutable » sont récupérés automatiquement
  appleAlbumId: '6817764595',
  // secours si l'API d'Apple ne répond pas : titres affichés après la sortie
  tracks: null as string[] | null,
  trackCount: 12,
}

export const SINGLE = {
  title: 'false sense of an ego',
  dateLabel: 'oct 2, 2026',
  cover: '/img/cover-false-sense-of-an-ego.webp',
  spotifyTrackId: '5oeUQveNCzLPTKgXbVCyf1',
  links: [
    { label: 'spotify', href: 'https://open.spotify.com/track/5oeUQveNCzLPTKgXbVCyf1' },
    { label: 'apple music', href: 'https://music.apple.com/us/artist/kruu/1725901483' },
    { label: 'youtube', href: 'https://www.youtube.com/channel/UC9Ze9kfl5XAPp-ukwEB2PPw' },
  ],
}

export const OTHER_RELEASES = [
  { title: 'DEMAND', href: 'https://open.spotify.com/track/02jHrxlIWXJKQmPHNfUX8z', image: '/img/roll-2.webp' },
  { title: 'i was uninspired', href: 'https://open.spotify.com/artist/64YoasRU8YcyBAbNRmCEiI', image: '/img/roll-4.webp' },
  { title: 'uh oh', href: 'https://open.spotify.com/artist/64YoasRU8YcyBAbNRmCEiI', image: '/img/roll-6.webp' },
  { title: 'with u', href: 'https://open.spotify.com/artist/64YoasRU8YcyBAbNRmCEiI', image: '/img/roll-0.webp' },
]

// ⚠️ placeholders : recadrages des pochettes, à remplacer par les photos de « the archive »
export const ROLL = [
  { src: '/img/roll-0.webp', stamp: '23:34' },
  { src: '/img/roll-1.webp', stamp: '02:11' },
  { src: '/img/roll-5.webp', stamp: "'26 11 06  23:34" },
  { src: '/img/roll-3.webp', stamp: '04:56' },
  { src: '/img/roll-4.webp', stamp: '01:17' },
  { src: '/img/roll-6.webp', stamp: '00:48' },
]

export const LINKS = [
  { label: 'instagram', handle: '@kruu575', href: 'https://www.instagram.com/kruu575/' },
  { label: 'the archive', handle: '@kruu.png', href: 'https://www.instagram.com/kruu.png' },
  { label: 'tiktok', handle: '@kruu575', href: 'https://www.tiktok.com/@kruu575' },
  { label: 'youtube', handle: 'kruu', href: 'https://www.youtube.com/channel/UC9Ze9kfl5XAPp-ukwEB2PPw' },
  { label: 'twitch', handle: 'kruu575', href: 'https://www.twitch.tv/kruu575' },
  // ⚠️ invitation temporaire, demander un lien permanent
  { label: 'discord', handle: 'server', href: 'https://discord.gg/nBQPCQsb' },
  { label: 'spotify', handle: '↗', href: 'https://open.spotify.com/artist/64YoasRU8YcyBAbNRmCEiI' },
  { label: 'apple music', handle: '↗', href: 'https://music.apple.com/us/artist/kruu/1725901483' },
]

export const EASTER_EGG = {
  // heure locale du visiteur, format 12 h : 11:34 am et 11:34 pm
  hour12: 11,
  minute: 34,
  // ⚠️ message à écrire par l'artiste
  message: ["you're still up?", 'me too.'],
}

// ⚠️ extrait audio autorisé à fournir (ex. '/audio/ambient.mp3'). null = pas de choix du son au loader.
export const AMBIENT_AUDIO: string | null = null

// ⚠️ à compléter avec l'éditeur du site
export const LEGAL = {
  publisher: '⚠️ name of the site publisher',
  contact: '⚠️ contact email',
  host: 'Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, USA',
}
