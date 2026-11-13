# Portfolio - Claire Buhaceanu Laborde

Site portfolio de Claire Buhaceanu Laborde, construit avec React, Vite et Tailwind CSS v4.
Tout le contenu (textes, projets, photos, CV, réglages) est modifiable **sans coder** avec [Pages CMS](https://pagescms.org).

- Site en ligne : **https://cl4iire.github.io/** (dépôt GitHub `cl4iire/cl4iire.github.io`)
- Guide pour Claire (modifier le site depuis Pages CMS) : [`GUIDE-CLAIRE.md`](GUIDE-CLAIRE.md)

## Lancer le projet en local

**Prérequis :** Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000/`. Sous Windows, lancer le terminal depuis `O:\www\Portfolio` (lettre de lecteur en **majuscule**, voir Dépannage).

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement (rechargement automatique) |
| `npm run check` | Vérifie le contenu (champs obligatoires, images et PDF existants, liens valides) |
| `npm run optimize-images` | Convertit les JPG/PNG de `public/media` en WebP (2560 px max) et met à jour le contenu |
| `npm run build` | Construit le site dans `dist/` |
| `npm run lint` | Vérification TypeScript |

## Organisation

```
content/                 ← tout le contenu, en JSON (modifié par Pages CMS)
  projets/<id>.json        un fichier par projet (liste « Travaux »)
  albums/<id>.json         un fichier par onglet photo (portraits, paysages, evenements)
  lieux/<id>.json          lieux et événements des filtres photo
  textes.json              tous les textes de l'interface, en FR et EN
  documents.json           CV FR, CV EN, projet de master (chemins des PDF)
  reglages.json            titre et description Google, police, thème de couleurs
public/media/            ← toutes les images et tous les PDF (servis tels quels)
  projets/<id>/            images d'un projet (et coulisses/)
  photos/<album>/<lieu>/   photos des albums
  accueil/  documents/
src/data/portfolio.ts    ← lit content/ et prépare les données pour les composants
src/components/          ← l'affichage (voir « Design »)
.pages.yml               ← configuration des formulaires de Pages CMS
scripts/                 ← check-content.ts, optimize-images.ts
site-settings-plugin.ts  ← applique reglages.json à index.html (Google, police, thème)
photo-order-plugin.ts    ← enregistrement de l'éditeur d'ordre des photos (local)
design/                  ← maquette « Zine rose » et brief (référence)
```

**Textes bilingues :** chaque texte est stocké sous la forme `{ "fr": "...", "en": "..." }`. Si `en` est vide, le site affiche le français.

**Chemins des médias :** le contenu référence les fichiers en `/media/...` (= `public/media/...`).

## Pages CMS (administration sans code)

### Mise en place (une seule fois)

1. **Installer l'application Pages CMS sur le dépôt** : aller sur [app.pagescms.org](https://app.pagescms.org), se connecter avec GitHub et installer l'application GitHub « Pages CMS » sur le dépôt `cl4iire/cl4iire.github.io`. Le dépôt appartient au compte `cl4iire` : c'est ce compte qui doit valider l'installation.
2. **Autoriser le workflow à enregistrer les images optimisées** : sur GitHub, Settings > Actions > General > Workflow permissions > **Read and write permissions**.
3. **Inviter Claire** (si elle n'utilise pas son compte GitHub) : dans Pages CMS, ouvrir le dépôt puis inviter un collaborateur par **e-mail**. Elle pourra modifier le contenu et les médias, pas la configuration.
4. **Tester** une modification, puis vérifier dans l'onglet Actions que la publication passe au vert.

### Ce que Claire peut modifier

| Menu dans Pages CMS | Fichier | Contenu |
|---|---|---|
| Projets (Travaux) | `content/projets/*.json` | Ajouter, modifier, masquer, supprimer, ordonner (champ « Position ») ; titre, catégorie, année, textes FR/EN, lien vidéo, liens, images, coulisses |
| Photos (albums) | `content/albums/*.json` | Ajouter ou retirer des photos, choisir leur lieu, les réordonner ; nom et description de l'onglet ; pages d'article |
| Lieux et événements | `content/lieux/*.json` | Les filtres des photos (ex. « Népal », « Motors & Blues ») |
| CV et projet de master | `content/documents.json` | Remplacer les PDF |
| Textes du site | `content/textes.json` | Tous les textes de l'interface (menu, à propos, boutons, contact...) et les photos de l'accueil |
| Réglages | `content/reglages.json` | Titre et description Google, police (liste fermée), couleurs (4 thèmes) |

Ce qui reste dans le code : la mise en page, les animations, de nouvelles sections ou fonctionnalités.

### Ce qui se passe à chaque « Enregistrer »

Pages CMS crée un commit sur `main`, ce qui lance le workflow **Publication du site** (`.github/workflows/main.yml`) :

1. **Optimisation des images** : les JPG/PNG envoyés sont convertis en WebP (2560 px max, noms nettoyés), le contenu est mis à jour, et un commit `[bot] Optimisation des images (WebP)` est ajouté.
2. **Vérification du contenu** (`npm run check`) : en cas d'erreur (texte obligatoire vide, image manquante, lien invalide...), le workflow s'arrête avec un message en français et **le site en ligne reste sur la version précédente**.
3. **Construction et publication** sur GitHub Pages (1 à 2 minutes au total).

### Suivre les modifications et revenir en arrière

- **Commits identifiables** : ceux de Pages CMS commencent par `[CMS]`, suivi du nom de la personne, de l'action et du fichier (`[CMS] Claire · modification : Done by Friday (content/projets/done-by-friday.json)`). Ceux du robot commencent par `[bot]`. Filtrer : `git log --grep "\[CMS\]"`.
- **Statut** : GitHub affiche ✅ ou ❌ à côté de chaque commit (onglet Actions ou liste des commits).
- **Marquer une version validée** : `git tag stable-AAAA-MM-JJ && git push origin stable-AAAA-MM-JJ` (ou GitHub > Releases > « Draft a new release »).
- **Remettre en ligne une ancienne version, sans toucher à l'historique** : GitHub > Actions > **Republier une version** > Run workflow > saisir un tag ou un numéro de commit. Le site est remplacé en 1 à 2 minutes ; le prochain enregistrement republie `main`.
- **Annuler une modification précise** : `git revert <numéro du commit>` puis `git push`. Les autres modifications sont conservées.

## Ajouter ou modifier du contenu à la main

Tout se fait normalement depuis Pages CMS. À la main, il suffit de modifier les fichiers de `content/` (puis `npm run check`).

**Projet** (`content/projets/<id>.json`, le nom du fichier sert d'identifiant) :

```json
{
  "titre": "Done by Friday",
  "masquer": false,
  "ordre": 6,
  "categorie": "film",
  "annee": "2025",
  "type": { "fr": "Court métrage", "en": "" },
  "duree": "2'30",
  "production": "Janine Hemker",
  "video": "https://youtu.be/zKjolkqnnho",
  "roles": { "fr": "...", "en": "..." },
  "description": { "fr": "...", "en": "..." },
  "composition": { "fr": "", "en": "" },
  "images": ["/media/projets/done-by-friday/capture-1.webp"],
  "coulisses": [],
  "liens": [{ "texte": { "fr": "Article", "en": "Article" }, "url": "https://..." }]
}
```

- `categorie` : `film`, `documentaire` ou `experience`.
- **Ordre de la liste « Travaux »** : `ordre` croissant (1 = en haut), puis l'année la plus récente.
- `video` : lien YouTube (lancé dans le site au clic sur l'image de couverture), autre page vidéo (nouvel onglet), ou vide.
- La **première image** sert de couverture et de preview au survol. Sans image : pas de preview, et une carte noire avec le titre renvoie vers la vidéo ou le premier lien. Astuce : la miniature d'une vidéo YouTube (`https://i.ytimg.com/vi/<id>/maxresdefault.jpg`, convertie en WebP) peut servir de couverture, comme pour Portrait of a Woman.
- `production`, `duree`, `composition` : la case correspondante est masquée si le champ est vide.

**Album photo** (`content/albums/<id>.json`) : `photos` est la liste **dans l'ordre d'affichage**, chaque photo avec son `image` et son `lieu` (identifiant d'un fichier de `content/lieux/`). `format` (`portrait` ou `carre`) règle la forme des vignettes, `filtre` (`pays` ou `evenement`) le nom du second filtre pour les lecteurs d'écran, `ordre` la position de l'onglet. Un album dont toutes les photos ont le même lieu n'affiche pas de second filtre. Plusieurs albums peuvent partager un lieu.

**Lieu** (`content/lieux/<id>.json`) : `{ "nom": "Népal", "nom_en": "Nepal" }`.

## Réorganiser l'ordre des photos

- **Dans Pages CMS** : déplacer les photos dans la liste « Photos » de l'album.
- **Avec l'éditeur visuel** : une page cachée permet de les réordonner par glisser-déposer (ou avec les flèches), le numéro rose indiquant la position sur le site.
  - **En local** : `npm run dev`, ouvrir `http://localhost:3000/?editor`, déplacer, cliquer sur **Enregistrer** : la liste `photos` du fichier de l'album est réécrite.
  - **En ligne** (`https://cl4iire.github.io/?editor`) : rien ne peut être enregistré sur GitHub Pages. **Copier le code** affiche la nouvelle liste `photos` à coller dans `content/albums/<album>.json` (le fichier est indiqué sur la première ligne).
  - Fichiers : `src/components/PhotoOrderEditor.tsx`, `photo-order-plugin.ts` (actif uniquement avec `npm run dev`) et 3 lignes dans `src/main.tsx`.

## Design « Zine rose »

Maquette validée : `design/zine-rose-maquette.html` (référence visuelle) et brief `design/PROMPT-claude-code.md`.

**Police :** choisie dans `content/reglages.json`, parmi une liste fermée testée avec la mise en page (Bricolage Grotesque par défaut, Space Grotesk, DM Sans, Archivo, Instrument Sans), chargée depuis Google Fonts.

**Couleurs :** déclarées dans `@theme` de `src/index.css` et utilisables en classes Tailwind (`bg-rose`, `text-ink`, `border-pink`, `bg-ink/75`...). Le thème « rose » est la palette d'origine ; `bleu`, `vert` et `sable` la remplacent via `<html data-theme>` (l'encre `#121010` est commune à tous).

```css
--color-rose:   #F0BCC0   /* fond du site */
--color-ink:    #121010   /* encre : nav, CV, section Photographies */
--color-accent: #C7194F   /* accent (survol, numéros, e-mail) */
--color-pink:   #EA5E8D   /* rose vif */
--color-muted:  #4E3B3D   /* texte secondaire */
```

**Ajouter une police ou un thème** (développeur) : l'ajouter à `FONTS` / `THEMES` dans `site-settings-plugin.ts`, au CSS pour un thème, et à la liste correspondante dans `.pages.yml`. `npm run check` refuse une valeur inconnue. Vérifier qu'une nouvelle police ne déborde pas de la barre latérale (les polices très larges, comme Syne, ont été écartées pour cette raison).

Le point de rupture `desk:` (901 px) sépare la navigation latérale (ordinateur) de la barre du haut + menu plein écran (mobile).

**Composants (`src/components/`) :**

| Composant | Rôle |
|---|---|
| `Sidebar.tsx` | Navigation latérale noire (01 à 05, CV, projet, lien LinkedIn, FR/EN) ; barre du haut et menu plein écran sur mobile |
| `HeroSection.tsx` | Accueil 50/50 : photo de tournage et portrait N&B (choisis dans « Textes du site > Accueil ») |
| `AboutSection.tsx` | À propos, formations, cartes Outils / Langues / Compétences (un élément par ligne) |
| `WorksSection.tsx` | Liste des travaux filtrable, preview au survol, ligne qui s'ouvre au clic. Sur mobile : titre en haut, catégorie à gauche, bouton +/− à droite |
| `PhotographySection.tsx` | Onglets d'albums + second filtre par lieu ou événement (pas de « Tout » : le premier lieu est sélectionné par défaut) |
| `ContactSection.tsx` | Contact : e-mail, téléphone, Instagram, LinkedIn, base, boutons CV et projet |
| `Lightbox.tsx` | Visionneuse plein écran (ne parcourt que les images filtrées) |
| `DocumentModal.tsx` | Fenêtres CV (FR/EN) et projet documentaire |
| `PhotoOrderEditor.tsx` | Éditeur d'ordre des photos (`?editor`) |

## Fonctionnalités

- **Bilingue FR / EN** - détection automatique de la langue du navigateur, bascule dans la navigation, repli sur le français si une traduction manque
- **Accueil** - plein écran sur ordinateur
- **Travaux** - liste filtrable (Tout, Films, Documentaires, Expériences pro), lignes fermées au chargement, preview au survol, détails au clic (images, vidéo YouTube, liens, coulisses)
- **Photographies** - onglets d'albums, filtre par pays ou par événement, article Blues Magazine
- **Visionneuse** - plein écran, flèches du clavier, Échap, swipe mobile
- **CV et projet documentaire** - fenêtres PDF plein écran, choix FR / EN pour le CV
- **Accessibilité** - cibles de 44 px minimum, onglets et fenêtres annotés (`aria-*`), fermeture avec Échap, respect de `prefers-reduced-motion`
- **Responsive** - testé en 1920, 1440, 1024, 768 et 390 px

## Dépannage

- **La publication est en ❌ dans l'onglet Actions** : ouvrir le workflow, étape « Vérifier le contenu » : la liste des problèmes s'affiche en français. Corriger dans Pages CMS et enregistrer à nouveau. Le site en ligne n'a pas changé.
- **Une photo envoyée en JPG n'apparaît pas tout de suite** : la conversion en WebP a lieu pendant la publication ; attendre 1 à 2 minutes.
- **Un filtre photo affiche un identifiant brut** : le lieu de la photo n'existe pas dans « Lieux et événements » (`npm run check` le signale).
- **Erreur `Failed to resolve import "../../../../../o:/www/..."` (Windows)** : le serveur a été lancé depuis `o:\` (lettre en minuscule). Ouvrir le terminal dans `O:\www\Portfolio` et relancer `npm run dev`.
- **Pages CMS indique un conflit à l'enregistrement** : le robot a pu modifier le même fichier (conversion d'images). Recharger la page de Pages CMS et refaire la modification.

## Déploiement (GitHub Pages)

Le dépôt s'appelle `cl4iire.github.io` (site utilisateur) : le site est servi à la racine **https://cl4iire.github.io/** avec `base: '/'` (`vite.config.ts`).

> Ne pas renommer le dépôt : Google lit le nom du site et le favicon sur la page d'accueil du domaine (`https://cl4iire.github.io/`). Avec un dépôt de projet (ex. `portfolioClaire`), cette page n'existe pas et Google affiche « GitHub Pages documentation » sans favicon.

| Workflow | Déclenchement | Rôle |
|---|---|---|
| `.github/workflows/main.yml` « Publication du site » | chaque push sur `main` (dont Pages CMS) | optimise les images, vérifie le contenu, construit et publie |
| `.github/workflows/republier.yml` « Republier une version » | manuel (onglet Actions) | remet en ligne un tag ou un commit donné |

Réglage GitHub requis : Settings > Pages > Source : « GitHub Actions ».
