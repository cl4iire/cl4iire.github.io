# Portfolio - Claire Buhaceanu Laborde

Site portfolio de Claire Buhaceanu Laborde. 
Construit avec React, Vite et Tailwind CSS v4.

## Lancer le projet en local

**Prérequis :** Node.js

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
3. Ouvrir `http://localhost:3000/`

Site en ligne : **https://cl4iire.github.io/** (dépôt GitHub `cl4iire/cl4iire.github.io`).

## Structure du projet

Le site auto-découvre les médias (photos, stills) depuis les dossiers `src/assets/projects/**` et assemble le contenu à partir de fichiers TypeScript dans `src/data/projects/**`.

### Dossiers principaux

**Médias (auto-scannés)**
- Films : `src/assets/projects/films/<projectId>/`
  - Coulisses (optionnel) : `src/assets/projects/films/<projectId>/<projectId>BehindScenes/`
- Documentaires : `src/assets/projects/documentaries/<projectId>/`
  - Documentation PDF (optionnel) : `src/assets/projects/documentaries/<projectId>/documentation/`
- Expériences professionnelles (stages) : `src/assets/projects/experiences/<projectId>/`
- Photographies : `src/assets/projects/photographies/` - 3 albums thématiques, chaque sous-dossier (un lieu ou un événement) est fusionné dans l'album :
  - `portraits/<lieu>/` → album « Portraits » (ex. `portraits/nepal/`)
  - `paysages/<lieu>/` → album « Paysages » (ex. `paysages/bretagne/`, `paysages/londres2025/`)
  - `events/<événement>/` → album « Événements » (ex. `events/motors_and_blues/`, `events/nepal/`)
  - Article Blues Magazine (bouton « Voir l'article ») : `events/motors_and_blues/article/`
  - Le nom du sous-dossier s'affiche au survol de la photo (titre lisible défini dans `src/data/projects/photographies/<sous-dossier>.ts`, ex. `nepal.ts` → « Népal »)

**Données (fichiers TS écrits à la main)**
- Films : `src/data/projects/films/<projectId>.ts`
- Documentaires : `src/data/projects/documentaries/<projectId>.ts`
- Expériences professionnelles : `src/data/projects/experiences/<projectId>.ts`
- Métadonnées albums photo (optionnel) : `src/data/projects/photographies/<albumId>.ts`

**Fichiers clés**
- Agrégateur & traductions : `src/data/portfolio.ts`
- Types : `src/data/types.ts` (`ProjectData`, `PhotoAlbumMeta`)
- Variables CSS & utilitaires couleur : `src/index.css`

**Documents**
- CV (FR & ENG) : `src/assets/CV/`
- Projets futurs Master : `src/assets/futur/`

### Fonctionnement des médias

- Les images sont chargées via `import.meta.glob` de Vite, insensible à la casse : `{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}`.
- Films/Docs : toutes les images du dossier projet forment la galerie. La première image est la couverture. Les coulisses sont lues depuis le sous-dossier `<projectId>BehindScenes/` s'il existe.
- Photographies : chaque dossier feuille sous `src/assets/projects/photographies/**` devient automatiquement un album.

## Ajouter un film, un documentaire ou une expérience

1. Déposer les stills (et coulisses optionnelles) :
   - Films : `src/assets/projects/films/<projectId>/`
     - Coulisses : `src/assets/projects/films/<projectId>/<projectId>BehindScenes/`
   - Docs : `src/assets/projects/documentaries/<projectId>/`
   - Expériences : `src/assets/projects/experiences/<projectId>/`
2. Créer un fichier de données exportant `ProjectData` :
   - Films : `src/data/projects/films/<projectId>.ts`
   - Docs : `src/data/projects/documentaries/<projectId>.ts`
   - Expériences : `src/data/projects/experiences/<projectId>.ts` (`category: 'experience'`)
3. Enregistrer le projet dans `src/data/portfolio.ts` en important le fichier et en l'ajoutant au tableau `PROJECTS`.

**Notes :**
- `videoUrl` peut être une URL YouTube (intégrée automatiquement avec miniature HD) ou `#` pour afficher une image statique.
- `documentationUrl` (optionnel) : importer un PDF via `?url` pour afficher un bouton "Dossier de Production".
- La première image découverte est utilisée comme couverture. Sans image ni YouTube, une carte « vidéo » cliquable s'affiche à la place (lien vers `videoUrl`, ou vers le premier `links` si `videoUrl` vaut `#`).
- `links` (optionnel) : liens supplémentaires (autres vidéos, article de presse, compte TikTok…), au format `{ label: { FR, ENG }, url }`.
- `producer` (optionnel) : si absent, la ligne « produit par » est masquée.

## Ajouter des photos

**Dans un album existant (cas courant)** - déposer les photos (en `.webp` de préférence) dans le bon thème, dans un sous-dossier par lieu ou événement :
- `src/assets/projects/photographies/portraits/<lieu>/`
- `src/assets/projects/photographies/paysages/<lieu>/`
- `src/assets/projects/photographies/events/<événement>/`

Le sous-dossier peut être nouveau (ex. `paysages/ecosse2027/`). Pour afficher un nom propre au survol des photos, créer `src/data/projects/photographies/<sous-dossier>.ts` exportant un `PhotoAlbumMeta` avec `{ id: '<sous-dossier>', title: { FR, ENG } }` (ex. `nepal.ts` → « Népal »). Sans ce fichier, le nom du dossier est utilisé tel quel.

**Créer un nouvel album** - créer un dossier directement sous `src/assets/projects/photographies/<albumId>/`, puis (optionnel) `src/data/projects/photographies/<albumId>.ts` avec `{ id, title: {FR, ENG}, description?: {FR, ENG} }`. Ajouter `<albumId>` à `ALBUM_ORDER` dans `src/data/portfolio.ts` pour choisir sa position (sinon il s'affiche après les autres).

Les albums sont générés automatiquement à partir des dossiers. Redémarrer `npm run dev` si des fichiers ont été déplacés.

## Réorganiser l'ordre des photos

L'ordre des photos dans chaque album est enregistré dans le tableau `order` du fichier de métadonnées de l'album :

| Album | Fichier |
|---|---|
| Portraits | `src/data/projects/photographies/portraits.ts` |
| Paysages | `src/data/projects/photographies/paysages.ts` |
| Événements | `src/data/projects/photographies/events.ts` |

### Avec l'éditeur (recommandé)

Une page cachée permet de réordonner les photos par glisser-déposer (ou avec les flèches sous chaque photo). Le numéro rouge indique la position sur le site.

**En local, enregistrement direct :**
1. Lancer `npm run dev`
2. Ouvrir `http://localhost:3000/?editor`
3. Déplacer les photos, puis cliquer sur **Enregistrer** sous l'album : le tableau `order` du fichier est réécrit et le site se met à jour immédiatement
4. Commit + push pour publier

**Sur le site en ligne** (`https://cl4iire.github.io/?editor`) : GitHub Pages est un hébergement statique, rien ne peut y être enregistré. Après avoir réordonné un album, cliquer sur **Copier le code** : le code s'affiche dans un encadré sous l'album (et est copié dans le presse-papiers), prêt à être envoyé par message. Sa première ligne indique le fichier concerné ; il suffit de remplacer le bloc `order: [...]` de ce fichier par celui reçu, puis commit + push.

> Fichiers de l'éditeur : `src/components/PhotoOrderEditor.tsx` (la page), `photo-order-plugin.ts` (l'enregistrement, actif uniquement avec `npm run dev`) et 3 lignes dans `src/main.tsx`.

### À la main

Chaque entrée est `<sous-dossier>/<fichier>`, ce qui permet d'intercaler librement les lieux. Déplacer une ligne déplace la photo :

```ts
const meta: PhotoAlbumMeta = {
  id: 'events',
  title: { FR: 'Événements', ENG: 'Events' },
  order: [
    'motors_and_blues/1.webp',
    'nepal/DSC_0054.webp',
    'motors_and_blues/8.webp',
    // ...
  ],
};
```

> Les photos absentes du tableau `order` s'ajoutent automatiquement à la fin (par sous-dossier, puis par nom de fichier).
>
> L'ordre des albums sur la page est défini par `ALBUM_ORDER` dans `src/data/portfolio.ts`.

## Design « Zine rose »

La maquette validée est dans `design/zine-rose-maquette.html` (référence visuelle, format de l'outil de design, pas du React) avec le brief `design/PROMPT-claude-code.md`.

**Police :** Bricolage Grotesque (Google Fonts, chargée dans `index.html`).

**Couleurs** (déclarées dans `@theme` de `src/index.css`, utilisables en classes Tailwind `bg-rose`, `text-ink`, `border-pink`, `bg-ink/75`…) :

```css
--color-rose:   #F0BCC0   /* fond du site */
--color-ink:    #121010   /* encre : nav, CV, section Photographies */
--color-accent: #C7194F   /* accent (survol, numéros, e-mail) */
--color-pink:   #EA5E8D   /* rose vif */
--color-muted:  #4E3B3D   /* texte secondaire */
```

Le point de rupture `desk:` (901 px) sépare la navigation latérale (ordinateur) de la barre du haut + menu plein écran (mobile).

**Composants (`src/components/`) :**

| Composant | Rôle |
|---|---|
| `Sidebar.tsx` | Navigation latérale noire (01 à 05, CV, projet, e-mail, FR/EN) ; barre du haut et menu plein écran sur mobile |
| `HeroSection.tsx` | Accueil 50/50 : photo de tournage (`about/claireAbout.webp`) et portrait N&B (`portraits/nepal/DSC00198.webp`) |
| `AboutSection.tsx` | À propos, formations, cartes Outils / Langues / Compétences |
| `WorksSection.tsx` | Liste des travaux filtrable, preview au survol, ligne qui s'ouvre au clic |
| `PhotographySection.tsx` | Onglets Portraits / Paysages / Événements + second filtre par pays ou événement |
| `ContactSection.tsx` | Contact |
| `Lightbox.tsx` | Visionneuse plein écran (ne parcourt que les images filtrées) |
| `DocumentModal.tsx` | Fenêtres CV (FR/EN) et projet documentaire |
| `PhotoOrderEditor.tsx` | Éditeur d'ordre des photos (`?editor`) |

Les textes de l'interface (FR/EN) sont dans `TRANSLATIONS` (`src/data/portfolio.ts`) ; l'ordre de la liste des travaux est le tableau `PROJECTS` du même fichier.

**Filtres pays / événement :** chaque album thématique déclare dans son fichier (`paysages.ts`, `events.ts`, `portraits.ts`) un objet `places` qui associe chaque sous-dossier à un libellé. Plusieurs sous-dossiers peuvent partager le même libellé (`Irlande2025` et `irlande` → « Irlande »). Un album avec un seul lieu n'affiche pas de second filtre. **Un nouveau sous-dossier doit être ajouté à `places`**, sinon son nom de dossier brut s'affiche.

## Fonctionnalités

- **Bilingue FR / EN** - détection automatique de la langue du navigateur, bascule dans la navigation
- **Travaux** - liste indexée filtrable (Tout, Films, Documentaires, Expériences pro), preview au survol, détails au clic (images, vidéo YouTube intégrée, liens, coulisses)
- **Photographies** - onglets Portraits / Paysages / Événements, filtre par pays ou par événement, article Blues Magazine
- **Visionneuse** - plein écran, flèches du clavier, Échap, swipe mobile
- **CV et projet documentaire** - fenêtres PDF plein écran, choix FR / EN pour le CV
- **Accessibilité** - cibles de 44 px minimum, onglets et fenêtres annotés (`aria-*`), fermeture avec Échap, respect de `prefers-reduced-motion`
- **Responsive** - testé en 1920, 1440, 1024, 768 et 390 px

## Dépannage

- **Rien n'apparaît dans le mur photo :** vérifier que les photos sont bien dans `src/assets/projects/photographies/**` et que les extensions sont `png/jpg/jpeg/webp`. Redémarrer le serveur Vite si des fichiers ont été déplacés.
- **Le PDF ne s'ouvre pas :** vérifier que le fichier est importé avec le suffixe `?url` (`import monPdf from './mon.pdf?url'`).

## Déploiement (GitHub Pages)

Ce projet Vite génère des fichiers statiques déployables sur GitHub Pages.

> **Configuration actuelle :** le dépôt s'appelle `cl4iire.github.io` (site utilisateur), donc le site est servi à la racine **https://cl4iire.github.io/** avec `base: '/'`. Chaque push sur `main` le republie via `.github/workflows/main.yml`.
>
> Ne pas renommer le dépôt : Google lit le nom du site et le favicon sur la page d'accueil du domaine (`https://cl4iire.github.io/`). Avec un dépôt de projet (ex. `portfolioClaire`), cette page n'existe pas et Google affiche « GitHub Pages documentation » sans favicon.

**1. Configurer le chemin de base**

- Site utilisateur (`username.github.io`) : laisser `base` par défaut (`/`).
- Site de projet (`username/portfolio`) : définir `base` dans `vite.config.ts` :

```ts
export default defineConfig(({ mode }) => ({
  base: '/portfolio/', // remplacer par le nom du dépôt
}))
```

**2. Déploiement automatique via GitHub Actions**

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch: {}

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Puis : Settings → Pages → Build and deployment → Source : "GitHub Actions".

**3. Publication manuelle**

```bash
npm run build
git add -f dist
git commit -m "Publish site"
git subtree push --prefix dist origin gh-pages
```

Settings → Pages → Branch : `gh-pages` / dossier `root`.

> Après tout changement de `base`, relancer `npm run build` avant de déployer.
