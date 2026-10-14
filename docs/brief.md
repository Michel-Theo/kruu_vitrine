# kruu — « 11:34 » : concept et brief du site d'annonce

Site vitrine **jetable** pour annoncer l'album **11:34** de **kruu**, qui sort le **6 novembre 2026**.
Le site est **100 % statique** : en React, sans backend, sans base de données et sans formulaire. Il sert jusqu'à la sortie, puis quelques semaines après.

> **✅** = vérifié sur les profils officiels le 14/10/2026. **⚠️** = à confirmer par l'artiste ou son équipe.
> Les visuels de référence sont dans `reference/`.
> **Maquettes Figma** (DA, motion, mobile, desktop) : https://www.figma.com/design/CHDMA1KAAmgAP47GBPFx1z

---

## 1. Infos de la sortie

| Élément | Valeur | Statut |
|---|---|---|
| Album | **11:34** | ✅ |
| Sortie | **6 novembre 2026** (« out 11/6 » dans la bio) | ✅ |
| Heure et fuseau de la sortie | 00:00, fuseau à définir | ⚠️ |
| Pré-save | https://hallwood.lnk.to/kruu-1134 | ✅ |
| Smartlink FVR | https://www.fvr.fan/kruu/1134 | ✅ |
| Dernier single | *false sense of an ego* (2 oct. 2026). Smartlink : https://www.fvr.fan/kruu/falsesenseofanego | ✅ |
| Pochette | `reference/cover_1134.png` (récupérée sur la page FVR « 11:34 », en 800 px) | ⚠️ Il faut confirmer que c'est bien la pochette finale et obtenir la version HD |

**Liens ✅ :**
* [Spotify](https://open.spotify.com/artist/64YoasRU8YcyBAbNRmCEiI)
* [Apple Music](https://music.apple.com/us/artist/kruu/1725901483)
* [YouTube](https://www.youtube.com/channel/UC9Ze9kfl5XAPp-ukwEB2PPw)
* [Instagram @kruu575](https://www.instagram.com/kruu575/)
* [Instagram @kruu.png, « the archive »](https://www.instagram.com/kruu.png)
* [TikTok](https://www.tiktok.com/@kruu575)
* [Twitch](https://www.twitch.tv/kruu575)
* [Discord](https://discord.gg/nBQPCQsb) (invitation temporaire, demander un lien permanent ⚠️)
* [Linktree](https://linktr.ee/kruu575)

---

## 2. Ce que disent les visuels (la vraie DA)

L'analyse porte sur la pochette de 11:34 et sur celle de *false sense of an ego* :

| Ce qu'on voit | Ce que ça donne pour le site |
|---|---|
| Photos **noir et blanc**, contraste fort, noirs écrasés | Tout le site est en niveaux de gris. Pas de néon, pas de dégradés colorés. |
| **Flou de mouvement** : elle est de dos, en train de bouger, le visage jamais net | Le flou est un matériau. Les images arrivent floues et ne se précisent qu'à moitié. |
| **Grain** très marqué (surtout sur le single) | Grain animé sur toute la page, en permanence. |
| **Chambre la nuit** : posters, *La Nuit étoilée*, déco kawaii en arrière-plan | Intime, « bedroom », amateur assumé : une photo de téléphone prise à 23h34. |
| **Traits dessinés à la main**, blancs avec une **ombre bleu bébé décalée** | Signature graphique du site : tous les encadrés, soulignés et boutons sont « dessinés ». |
| **Cœurs** blancs pleins, dessinés à la main | Pictos et micro-interactions. |
| **Éclaboussures** blanches et bleues (single) | Effet au tap et au clic. |
| Signature **« kr »** manuscrite en bas à droite | Logo et favicon du site. |

**En une phrase :** *une photo floue prise à 23h34 dans sa chambre, sur laquelle elle a gribouillé au doigt.*

### Palette (tirée des pochettes)

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0A0A0A` | Fond |
| `--night` | `#121212` / `#1C1C1C` | Surfaces, cartes |
| `--ash` | `#7B7B7B` | Texte secondaire, timestamps |
| `--paper` | `#F2F2F2` | Texte, traits dessinés, cœurs |
| `--blue` | `#C0D8F8` | **La seule couleur.** Ombre des traits, éclaboussures, état actif, CTA |

Règle : le bleu ne sert jamais de grand aplat. Il apparaît toujours **sous** ou **à côté** du blanc, comme sur la pochette.

### Typographie
* **Langue : anglais.** kruu n'est pas francophone : tous les textes du site (boutons, labels, messages) sont en anglais. Seule la documentation interne reste en français.
* **Tout en minuscules**, comme le nom « kruu » et les titres (*false sense of an ego*, *i was uninspired*).
* **Heure au format 12 h** (public anglophone) : l'horloge affiche `11:34 pm`, c'est-à-dire exactement le titre de l'album. Dates sans ambiguïté : `nov 6, 2026`, ou `11/6` comme dans sa bio.
* **Texte :** une sans-serif neutre et discrète (*Inter* ou *Geist*). Ce sont les photos qui parlent.
* **Chiffres et horodatages :** une monospace fine (*Geist Mono* ou *JetBrains Mono*), qui rappelle l'heure d'un écran de verrouillage ou un horodatage d'appareil photo.
* **Écriture manuscrite :** **pas de police « handwriting » générique.** Faire écrire et dessiner l'artiste sur tablette ou téléphone (« 11:34 », « kr », cœurs, flèches, cercles), puis vectoriser en SVG ⚠️. C'est ce qui rendra le site crédible.

---

## 3. Le concept : « 11:34 pm »

Le site n'est pas une landing page. **C'est un instant : 11:34 pm, la nuit, dans sa chambre.** On ouvre son téléphone, on tombe sur ses photos et ses gribouillis, et on attend avec elle.

### Trois idées fortes

1. **L'horloge vivante.** L'heure locale du visiteur est toujours affichée, en petit, façon écran de verrouillage. **Chaque jour à 11:34 am et 11:34 pm**, le site « s'allume » pendant une minute : le grain se calme, une photo se met au net, un message manuscrit caché apparaît. C'est un easter egg pour les fans, qui se partage sur TikTok (« go to the site at 11:34 pm ») et ne demande aucun backend.
2. **Dessiner sur la pochette.** Au doigt ou à la souris, on laisse un trait blanc avec son ombre bleue décalée, exactement comme sur la pochette. Le trait s'efface doucement au bout de quelques secondes. Un tap fait une éclaboussure, comme sur le single.
3. **Le flou comme suspense.** Avant la sortie, les images sont floues. Plus la date approche, moins elles le sont : le flou est calculé à partir du nombre de jours restants. Le 6 novembre, tout est net.

---

## 4. Déroulé de la page (mobile d'abord)

### 0. Loader (écrans M01 à M03 du Figma)
* Écran noir, grain. Un compteur en mono part de `00:00` et monte jusqu'à `11:34` **en suivant la vraie progression du chargement** (images, polices, son). Ce n'est pas un faux délai.
* Pendant le chargement, des fragments de photos floues flashent derrière le compteur. Le trait de progression est dessiné à la main, avec son ombre bleue.
* À `11:34` : les chiffres prennent l'ombre bleue, un cœur se dessine, puis le choix **« enter with sound / or without sound »** apparaît. Ce tap débloque l'audio sur mobile, pour une ambiance sonore (⚠️ extrait audio autorisé à fournir).
* Au retour sur le site (visite suivante), le loader est raccourci.

### 1. Hero : la pochette
* Pochette en plein écran (format carré centré sur mobile), avec du grain animé par-dessus.
* Les **traits blancs et bleus de la pochette se dessinent** à l'écran (animation du tracé SVG), puis les cœurs apparaissent.
* Sous la pochette, en minuscules : `kruu — 11:34` et `nov 6, 2026`.
* **Compte à rebours** discret en mono : `22 d 04 h 26 m 09 s`. Pas de gros compteur de site e-commerce.
* **CTA :** `pre-save` est entouré d'un cercle dessiné à la main, avec l'ombre bleue. Le cercle se redessine au survol ou au toucher. Il pointe vers le lien Hallwood.
* La zone de dessin au doigt est active sur la pochette, avec un petit indice manuscrit : « draw on it ».

### 2. « camera roll » : la galerie
* Défilement vertical de photos noir et blanc (sélection de « the archive » / @kruu.png ⚠️ à fournir), mises en page comme un vrai rouleau de photos : tailles irrégulières, légèrement de travers.
* Chaque photo porte un **horodatage** (`23:34`, `02:11`, `04:56`…) et parfois un gribouillis.
* La photo **au centre de l'écran se met au net**, les autres restent floues.
* Option : une ou deux vidéos courtes (5 s, muettes, en boucle) au milieu des photos.

### 3. « now playing » : le single
* Pochette de *false sense of an ego* avec des éclaboussures bleues animées.
* Le **lecteur Spotify officiel** (iframe), en thème sombre, chargé uniquement au tap.
* Liens : Spotify, Apple Music, visualizer YouTube.
* Option : les autres sorties 2026 en petites vignettes noir et blanc.

### 4. « 11:34 » : l'album
* Gros `11:34` en mono, avec la date.
* Tracklist si elle est fournie ⚠️. Les titres peuvent rester flous ou barrés jusqu'à la sortie, et se révéler le jour J.
* Rappel du CTA `pre-save`.

### 5. Footer : « kr »
* Signature « kr » manuscrite.
* Icônes des réseaux : Instagram ×2, TikTok, YouTube, Twitch, Discord, Spotify, Apple Music.
* `© 2026 kruu` et un lien `legal notice` (mentions légales : une simple modale, obligatoire si l'éditeur du site est en France, même sans backend).

### Le jour de la sortie
Tout bascule selon la date, sans redéploiement :
* `pre-save` devient `listen`, qui pointe vers le smartlink de l'album.
* Le compte à rebours devient `out now`.
* Le flou disparaît partout.
* La tracklist se révèle.

---

## 5. Motion et interactions

| Élément | Comportement |
|---|---|
| Grain | Bruit animé en plein écran, lent (environ 12 images/s, pas 60) |
| Traits dessinés | Tracé SVG révélé au chargement ou à l'apparition à l'écran, ombre bleue décalée de quelques pixels avec un léger retard |
| Dessin libre | Canvas : trait blanc, puis le même trait en bleu décalé derrière, qui disparaît en 3–4 s |
| Éclaboussures | Au tap, 3 à 6 taches blanches ou bleues de tailles variées |
| Mise au net | Le flou diminue à mesure que l'élément arrive au centre de l'écran |
| Transitions | Lentes et douces (400–800 ms). Pas de rebond, pas d'effet « tech » |
| Curseur (desktop) | Petit cœur blanc, ou point avec une ombre bleue |

### Motion par section (page « 02 · motion » du Figma)

Le mouvement n'est pas réservé au hero : chaque section a son entrée, son interaction et sa sortie.

| Section | Entrée | Interaction / sortie |
|---|---|---|
| **Le fil** (entre les sections) | Un trait dessiné relie toutes les sections et se dessine au rythme du scroll. Les labels (`02 / camera roll`) s'écrivent caractère par caractère. Les titres passent du flou au net, mot par mot. | — |
| **Hero** | Pochette : flou 40 → 0 px. `11:34` monte chiffre par chiffre. Les gribouillis se dessinent. | En descendant, la pochette recule dans le flou et le grand `11:34` rétrécit jusqu'à devenir l'horloge de la barre du haut (élément partagé). |
| **Camera roll** | Les photos tombent comme des tirages jetés sur un lit (rotation ±12°, en cascade). | La photo au centre : flash blanc 120 ms, elle devient nette, l'horodatage s'imprime. Sur desktop, section épinglée avec défilement horizontal. |
| **Now playing** | Pochette floue → nette, puis éclaboussure : les gouttes jaillissent du centre. Titre mot par mot. | Pendant la lecture, les gouttes « respirent ». Les soulignements des liens se dessinent au survol. |
| **Album** | Les chiffres défilent comme un compteur mécanique, de l'heure du visiteur jusqu'à `11:34`. La tracklist floutée apparaît ligne par ligne. | Au toucher, un titre se dé-floute à moitié puis se re-floute. Le jour J, tout se révèle en cascade. |
| **Footer** | La signature « kr » se dessine, les liens arrivent en cascade. | Tout en bas, l'écran s'assombrit (« good night. »). Un geste de plus : l'horloge rembobine et ramène en haut. |
| **Partout** | Curseur cœur avec inertie, CTA magnétiques, mini éclaboussure à chaque tap, titre d'onglet « come back… ♡ » quand on quitte l'onglet. | — |

Tokens : durées 180 / 400 / 800 ms (700 ms pour un tracé), easing par défaut `cubic-bezier(.22,1,.36,1)`, ombre bleue en retard de 60 ms sur le trait blanc, grain à 12 i/s.

**Accessibilité du mouvement :** avec `prefers-reduced-motion`, le grain devient fixe, les traits s'affichent directement sans animation, et les images sont nettes. Pas de clignotement rapide.

---

## 6. Technique

### Stack
* **Vite + React + TypeScript**, export statique.
* **Motion** (`motion/react`, l'ancien Framer Motion) pour les animations au défilement et les transitions.
* **Lenis** (optionnel) pour un défilement fluide sur desktop. Le désactiver sur mobile.
* **CSS Modules** ou Tailwind compilé. Pas de Tailwind via le CDN.
* **Canvas 2D** pour le grain et le dessin libre. Pas besoin de Three.js ni de WebGL.
* **Icônes :** les logos des marques viennent de [Simple Icons](https://simpleicons.org) en SVG inline. Le reste est dessiné à la main par l'artiste.
* **Hébergement :** Vercel, Netlify ou Cloudflare Pages, gratuits. Domaine ⚠️ à choisir.

### Fichier de config unique
Tout ce qui change se trouve dans un seul fichier, pour pouvoir modifier le site sans toucher au code :

```ts
// src/config.ts
export const RELEASE = {
  title: "11:34",
  date: "2026-11-06T00:00:00-05:00", // ⚠️ fuseau à confirmer
  presaveUrl: "https://hallwood.lnk.to/kruu-1134",
  listenUrl: "https://www.fvr.fan/kruu/1134", // utilisé après la sortie
  secretTimes: ["11:34", "23:34"],
};
export const SINGLE = {
  title: "false sense of an ego",
  spotifyEmbed: "", // ⚠️ ID du titre à récupérer
  url: "https://www.fvr.fan/kruu/falsesenseofanego",
};
export const LINKS = { /* réseaux */ };
```

### Arborescence suggérée
```
src/
  config.ts
  components/
    Grain.tsx           // bruit animé plein écran (canvas)
    Scribble.tsx        // SVG manuscrit + ombre bleue + animation du tracé
    DrawLayer.tsx       // dessin libre au doigt
    Splatter.tsx        // éclaboussures au tap
    Clock.tsx           // heure locale + easter egg 11:34 / 23:34
    Countdown.tsx
    FocusImage.tsx      // flou qui diminue selon la position à l'écran et les jours restants
    SpotifyEmbed.tsx    // chargé au tap
  sections/
    Intro.tsx  Hero.tsx  CameraRoll.tsx  NowPlaying.tsx  Album.tsx  Footer.tsx
  hooks/
    useReleaseState.ts  // "avant" | "jour J" | "après"
    useReducedMotion.ts
public/
  scribbles/  photos/  og-image.jpg
```

### Points d'attention
* **Navigateurs intégrés d'Instagram et TikTok :** c'est par là qu'arrivera la majorité du trafic. Il faut tester le dessin au doigt (sans bloquer le défilement : dessin seulement sur la pochette, avec `touch-action` géré), la lecture automatique de la vidéo (`muted playsinline`) et les performances du canvas.
* **Performance :** photos en WebP ou AVIF, environ 1200 px maximum, en lazy-load. Objectif : moins de 1,5 Mo au premier affichage.
* **Aperçu de lien :** balises Open Graph et Twitter Card avec la pochette, plus un favicon « kr ».
* **Statistiques (optionnel) :** Plausible ou Umami, sans cookies, donc sans bannière de consentement.
* **Pas de formulaire et pas de données personnelles collectées :** il suffit de mentions légales minimales.

---

## 7. À demander à l'artiste

- [ ] Confirmer que `reference/cover_1134.png` est la pochette finale, et l'envoyer en HD (3000 px)
- [ ] Heure et fuseau exacts de la sortie
- [ ] **Gribouillis manuscrits** : « 11:34 », « kr », « pre-save », « draw on it », « good night », cœurs, cercles, flèches. Sur fond transparent ou blanc, on vectorise ensuite.
- [ ] 10 à 20 photos noir et blanc pour la galerie « camera roll », avec leur heure si possible
- [ ] 1 à 3 vidéos courtes (optionnel)
- [ ] Tracklist (et si on la révèle avant ou le jour J)
- [ ] Message caché pour l'easter egg 11:34
- [ ] Lien Discord permanent
- [ ] Nom de domaine
- [ ] Infos pour les mentions légales
