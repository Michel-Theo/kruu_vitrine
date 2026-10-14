# kruu — 11:34

Site de fan **non officiel**, immersif, pour l'annonce de l'album **11:34** de kruu (sortie le 6 novembre 2026). Projet gratuit, non commercial.

Site 100 % statique, sans backend, en React.

- Brief artistique et technique : [`docs/brief.md`](docs/brief.md)
- Maquettes Figma : https://www.figma.com/design/CHDMA1KAAmgAP47GBPFx1z

## Workflow Git

- `main` : version en ligne
- `develop` : intégration
- `feature/*` : une branche par fonctionnalité, partie de `develop`, fusionnée par pull request

## Développement

Prérequis : Node 22+.

```sh
npm install
npm run dev      # serveur de dev
npm run build    # build statique dans dist/
npm run preview  # sert dist/ en local
npm run lint
```

Tout ce qui change (dates, liens, contenus) se trouve dans [`src/config.ts`](src/config.ts).

Paramètres utiles en dev : `?skip` saute l'écran de chargement, `?egg` affiche l'easter egg de 11:34.

## Déploiement (Cloudflare Pages, gratuit)

Le site est 100 % statique : pas de serveur, pas de Docker, pas de VPS. Le build produit un dossier `dist/` que Cloudflare sert sur son CDN.

1. Créer un compte gratuit sur https://dash.cloudflare.com
2. **Workers & Pages → Create → Pages → Connect to Git**, choisir le repo `kruu_vitrine`
3. Réglages du build :
   - Production branch : `main`
   - Framework preset : `Vite` (ou aucun)
   - Build command : `npm run build`
   - Build output directory : `dist`
   - Variable d'environnement : `SITE_URL` = l'URL finale (ex. `https://kruu-1134.pages.dev`, ou le domaine perso)
4. Chaque merge sur `main` met le site en ligne. Chaque PR obtient une URL de prévisualisation.

Le site est alors accessible sur `https://<nom-du-projet>.pages.dev`.

Projet actuel : **kruu-1134**
- production (branche `main`) : https://kruu-1134.pages.dev
- prévisualisation de `develop` : https://develop.kruu-1134.pages.dev (accessible à qui a le lien)

### Domaine perso (optionnel)

Un domaine s'achète **à l'année** (pas au mois). Le désactiver du renouvellement automatique si le site est jetable.
Une fois acheté : **projet Pages → Custom domains → Set up a domain**, puis mettre à jour `SITE_URL`.

## Avant la mise en ligne

Remplacer les placeholders ⚠️ de `src/config.ts` : heure et fuseau de sortie, message de l'easter egg, email de contact des mentions légales, lien Discord permanent.

Droits : la musique (`public/audio/`), les pochettes et les visuels appartiennent à kruu / Hallwood Media. Sans leur accord, retirer le MP3 avant la mise en ligne (le site génère alors une ambiance sonore à la place).
