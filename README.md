# Portfolio - Claire Buhaceanu Laborde

Site portfolio de Claire Buhaceanu Laborde, construit avec React, Vite et Tailwind CSS v4.
Tout le contenu (textes, projets, photos, CV, réglages) est modifiable **sans coder** avec [Pages CMS](https://pagescms.org).

- Site en ligne : **https://cl4iire.github.io/** (dépôt GitHub `cl4iire/cl4iire.github.io`)
- Guide pour Claire (modifier le site depuis Pages CMS) : [`GUIDE-CLAIRE.md`](GUIDE-CLAIRE.md)
- Améliorations prévues pour plus tard : [`TACHES.md`](TACHES.md)

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
| `npm run optimize-images` | Range les photos envoyées dans le dossier de leur projet ou album, convertit les JPG/PNG en WebP (2560 px max) et met à jour le contenu |
| `npm run icons` | Génère la favicon (toutes tailles) et l'image de partage `og-image.jpg` (1200 x 630) depuis les images choisies dans les réglages |
| `npm run media-inutilises` | Liste les médias de `public/media` utilisés nulle part dans `content/` (photos retirées d'un album ou d'un projet) ; `npm run media-inutilises -- --supprimer` les supprime (puis commit + push). `npm run check` les signale sans jamais les supprimer |
| `npm run build` | Construit le site dans `dist/`, puis pré-rend la page en HTML (`src/entry-server.tsx` + `scripts/prerender.ts`) |
| `npm run lint` | Vérification TypeScript |

## Organisation

```
content/                 ← tout le contenu, en JSON (modifié par Pages CMS)
  projets/<id>.json        un fichier par projet (liste « Travaux »)
  albums/<id>.json         un fichier par onglet photo (portraits, paysages, evenements)
  lieux/<id>.json          lieux et événements des filtres photo
  textes.json              tous les textes de l'interface, en FR et EN
  documents.json           CV FR, CV EN, projet de master (chemins des PDF)
  reglages.json            titre et description Google, police, thème, icône du site, image de partage
public/media/            ← toutes les images et tous les PDF (servis tels quels)
  projets/<id>/            images d'un projet (et coulisses/)
  photos/<album>/<lieu>/   photos des albums
  accueil/  documents/
src/data/portfolio.ts    ← lit content/ et prépare les données pour les composants
src/components/          ← l'affichage (voir « Design »)
.pages.yml               ← configuration des formulaires de Pages CMS
scripts/                 ← check-content.ts, optimize-images.ts
site-settings-plugin.ts  ← applique reglages.json à index.html (Google, police, thème)
seo-plugin.ts            ← données structurées (JSON-LD), sitemap.xml et llms.txt générés depuis content/
src/entry-server.tsx     ← rendu de la page en HTML pour le pré-rendu (scripts/prerender.ts)
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
| Photos (albums) | `content/albums/*.json` | Ajouter ou retirer des photos, choisir leur lieu, les réordonner ; nom et description de l'onglet ; masquer un album ; pages d'article |
| Lieux et événements | `content/lieux/*.json` | Les filtres des photos (ex. « Népal », « Motors & Blues ») et leur ordre (le premier est affiché par défaut) |
| CV et projet de master | `content/documents.json` | Remplacer les PDF ; afficher ou masquer les boutons CV et projet |
| Textes du site | `content/textes.json` | Tous les textes de l'interface (menu, à propos, boutons, contact...) et les photos de l'accueil ; choisir ce qui est affiché dans Contact (e-mail, téléphone, Instagram, LinkedIn, base) |
| Réglages | `content/reglages.json` | Titre et description Google, police (liste fermée), couleurs (4 thèmes), icône du site, image de partage des liens |

Ce qui reste dans le code : la mise en page, les animations, de nouvelles sections ou fonctionnalités.

### Ce qui se passe à chaque « Enregistrer »

Pages CMS crée un commit sur `main`, ce qui lance le workflow **Publication du site** (`.github/workflows/main.yml`) :

1. **Rangement et optimisation des images** : une photo envoyée à la racine d'un dossier de médias et utilisée à un seul endroit est rangée dans `projets/<projet>/` (ou `coulisses/`) ou `photos/<album>/<lieu>/` ; les JPG/PNG sont convertis en WebP (2560 px max, noms nettoyés) ; le contenu est mis à jour et un commit `[bot] Rangement et optimisation des images` est ajouté.
   Puis **icônes** : la favicon (`.ico`, 48/96/192 px, Apple, SVG) et l'image de partage `og-image.jpg` sont régénérées depuis les images des réglages (`npm run icons`, seulement si elles ont changé).
2. **Vérification du contenu** (`npm run check`) : en cas d'erreur (description vide, image manquante, lien invalide...), le workflow s'arrête et **le site en ligne reste sur la version précédente**. Chaque problème s'affiche en français directement sur la page de la publication (résumé et annotations), sans ouvrir le journal. Un lien entièrement vide est ignoré ; les rôles sont facultatifs.
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
  "date_video": "2026-03-01",
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
- `date_video` : date de mise en ligne de la vidéo (`AAAA-MM-JJ`, indiquée sous la vidéo sur YouTube). Nécessaire pour que Google affiche la vidéo dans ses résultats vidéo (voir « Référencement »).
- La **première image** sert de couverture et de preview au survol. Sans image : pas de preview, et une carte noire avec le titre renvoie vers la vidéo ou le premier lien. Astuce : la miniature d'une vidéo YouTube (`https://i.ytimg.com/vi/<id>/maxresdefault.jpg`, convertie en WebP) peut servir de couverture, comme pour Portrait of a Woman.
- `production`, `duree`, `composition` : la case correspondante est masquée si le champ est vide.

**Album photo** (`content/albums/<id>.json`) : `photos` est la liste **dans l'ordre d'affichage**, chaque photo avec son `image` et son `lieu` (identifiant d'un fichier de `content/lieux/`). `format` (`portrait` ou `carre`) règle la forme des vignettes, `filtre` (`pays` ou `evenement`) le nom du second filtre pour les lecteurs d'écran, `ordre` la position de l'onglet. Un album dont toutes les photos ont le même lieu n'affiche pas de second filtre. Plusieurs albums peuvent partager un lieu.

**Lieu** (`content/lieux/<id>.json`) : `{ "nom": "Népal", "nom_en": "Nepal", "ordre": 6 }`. `ordre` règle la position du bouton dans le filtre (le premier de chaque album est affiché par défaut ; sans position, le lieu vient après, dans l'ordre d'apparition).

**Masquer sans supprimer** : `"masquer": true` dans un projet ou un album. Les interrupteurs `afficher_*` (contact dans `textes.json`, boutons dans `documents.json`) masquent un élément ; absents, l'élément est affiché.

## Réorganiser l'ordre des photos

Dans Pages CMS, ouvrir l'album et déplacer les photos dans la liste « Photos » : l'ordre de la liste est l'ordre sur le site. À la main : réordonner la liste `photos` de `content/albums/<album>.json`.

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

- **La publication est en ❌ dans l'onglet Actions** : cliquer sur la publication : la liste des problèmes s'affiche en français dans le résumé et les annotations. Corriger dans Pages CMS et enregistrer à nouveau. Le site en ligne n'a pas changé.
- **Noms de dossiers ou de branche bizarres dans Pages CMS** (« principal » au lieu de `main`, « fait-d'ici-vendredi »...) : c'est la traduction automatique du navigateur. La désactiver pour app.pagescms.org (Chrome : icône de traduction dans la barre d'adresse > « Ne jamais traduire ce site »).
- **Erreur 413 à l'envoi d'une image dans Pages CMS** (l'image apparaît puis disparaît) : fichier trop lourd pour le service en ligne de Pages CMS (en pratique au-delà d'environ 3 à 4 Mo, une photo pleine résolution 6000 px). Réduire avant l'envoi (Lightroom : bord long 2560 px, JPEG qualité 80 ; ou squoosh.app). Pour un fichier exceptionnellement lourd : l'envoyer par l'interface web de GitHub (« Add file > Upload files », jusqu'à 25 Mo) dans `public/media/...`, puis le choisir dans la bibliothèque de Pages CMS ; le robot le réduira à la publication.
- **« X média(s) utilisé(s) nulle part » dans la publication** : des photos ont été retirées d'un album ou d'un projet mais sont restées dans la bibliothèque (et en ligne à leur adresse directe). La liste est dans le résumé de la publication. Rien n'est supprimé automatiquement : les supprimer dans Pages CMS (Médias > Images) ou avec `npm run media-inutilises -- --supprimer`.
- **Une photo déposée dans *Médias* n'apparaît pas sur le site** : il faut l'ajouter à la liste « Photos » d'un album (ou aux images d'un projet) ; la bibliothèque seule ne publie rien.
- **Une photo envoyée en JPG n'apparaît pas tout de suite** : la conversion en WebP a lieu pendant la publication ; attendre 1 à 2 minutes.
- **Un filtre photo affiche un identifiant brut** : le lieu de la photo n'existe pas dans « Lieux et événements » (`npm run check` le signale).
- **Erreur `Failed to resolve import "../../../../../o:/www/..."` (Windows)** : le serveur a été lancé depuis `o:\` (lettre en minuscule). Ouvrir le terminal dans `O:\www\Portfolio` et relancer `npm run dev`.
- **Pages CMS indique un conflit à l'enregistrement** : le robot a pu modifier le même fichier (conversion d'images). Recharger la page de Pages CMS et refaire la modification.

## Référencement (SEO)

Tout est généré automatiquement depuis `content/`, à chaque construction du site. Objectif : que les moteurs de recherche **et les assistants IA** (ChatGPT, Perplexity, Claude...) lisent facilement qui est Claire, sa formation et ses projets.

- **Pré-rendu HTML** (`src/entry-server.tsx` + `scripts/prerender.ts`, lancés par `npm run build`) : la page complète (en français) est écrite dans `dist/index.html`, donc lisible **sans JavaScript** (les robots d'IA et la plupart des moteurs, hormis Google, n'exécutent pas JavaScript). Dans le navigateur, React reprend ce HTML (`hydrateRoot` dans `src/main.tsx`) ; pour un visiteur anglophone, la page est rendue à nouveau en anglais. Les descriptions des projets, cachées tant qu'une ligne n'est pas ouverte, sont données aux robots par les données structurées et `llms.txt`.
- **Données structurées** (JSON-LD schema.org, `seo-plugin.ts`) insérées dans `index.html` à la place de `<!--__JSON_LD__-->` :
  - `WebSite` et `ProfilePage` (page de profil d'une créatrice, format reconnu par Google) ;
  - `Person` (Claire) : nom et **variantes** (« Claire Laborde », « Claire Buhaceanu », nom court), métier, présentation, **situation d'étudiante** (formation en cours = `affiliation`, formations terminées = `alumniOf` + diplômes `hasCredential`, calculé d'après les années et la rentrée de septembre), compétences, langues, et Instagram, LinkedIn, e-mail et base **seulement s'ils sont affichés** sur le site ;
  - un `Movie` (films et documentaires) ou `CreativeWork` (expériences) par projet visible, avec le rôle de Claire, et un `VideoObject` pour chaque vidéo YouTube **qui a une date de mise en ligne** (`date_video`, exigée par Google ; `npm run check` signale une vidéo YouTube sans date).
- **`llms.txt`** (`https://cl4iire.github.io/llms.txt`) : résumé en texte simple pour les assistants IA (présentation, situation, formation, compétences, outils, langues, chaque projet avec rôle, liens et description complète, albums photo, contact affiché, CV, et un résumé en anglais).
- **`sitemap.xml`** : l'adresse du site, la date de construction et **toutes les photos** (accueil, projets, coulisses, albums visibles) pour Google Images. `llms.txt` et `sitemap.xml` n'existent que dans le site construit (`dist/`) ; en local, ils sont servis par `npm run dev` (`/llms.txt`, `/sitemap.xml`). `robots.txt` autorise tous les robots et indique le plan du site.
- **Titre, description et image de partage** : dans « Réglages » (`site-settings-plugin.ts` et `npm run icons`).

L'adresse du site est la constante `SITE_URL` de `seo-plugin.ts` (à changer aussi dans `index.html` et `public/robots.txt` si le domaine change).

**Vérifier après publication :**
- données structurées : [Test des résultats enrichis de Google](https://search.google.com/test/rich-results) ou [validateur schema.org](https://validator.schema.org/) avec l'adresse `https://cl4iire.github.io/` ;
- plan du site : Google Search Console > Sitemaps > ajouter `sitemap.xml` ;
- **Bing** (ChatGPT s'appuie en partie sur l'index de Bing pour ses recherches) : [Bing Webmaster Tools](https://www.bing.com/webmasters) > importer le site depuis Google Search Console, puis soumettre `sitemap.xml` ;
- ce que lisent les IA : ouvrir `https://cl4iire.github.io/llms.txt`, ou afficher le code source de la page (Ctrl+U) : le texte doit y figurer.

## Déploiement (GitHub Pages)

Le dépôt s'appelle `cl4iire.github.io` (site utilisateur) : le site est servi à la racine **https://cl4iire.github.io/** avec `base: '/'` (`vite.config.ts`).

> Ne pas renommer le dépôt : Google lit le nom du site et le favicon sur la page d'accueil du domaine (`https://cl4iire.github.io/`). Avec un dépôt de projet (ex. `portfolioClaire`), cette page n'existe pas et Google affiche « GitHub Pages documentation » sans favicon.

| Workflow | Déclenchement | Rôle |
|---|---|---|
| `.github/workflows/main.yml` « Publication du site » | chaque push sur `main` (dont Pages CMS) | optimise les images, vérifie le contenu, construit et publie |
| `.github/workflows/republier.yml` « Republier une version » | manuel (onglet Actions) | remet en ligne un tag ou un commit donné |

Réglage GitHub requis : Settings > Pages > Source : « GitHub Actions ».
