# kruu — 11:34

Site vitrine immersif pour l'annonce de l'album **11:34** de kruu (sortie le 6 novembre 2026).

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
