# Tâches pour plus tard

Améliorations du CMS validées mais pas encore faites.

## Réseaux sociaux libres

Remplacer Instagram et LinkedIn, fixés dans le code, par une liste dans « Textes du site > Contact » : Claire ajoute le réseau qu'elle veut (Vimeo, YouTube, TikTok...) avec son nom, son lien et un interrupteur « afficher ». Concerne `content/textes.json`, `.pages.yml`, `ContactSection.tsx` et le lien du menu dans `Sidebar.tsx`.

## Légende et description par photo

Ajouter à chaque photo d'album un texte facultatif (FR/EN) : affiché sous la photo dans la visionneuse et utilisé comme description pour les lecteurs d'écran (aujourd'hui générique : « Paysages · Népal »). Concerne `content/albums/*.json` (champ dans la liste `photos`), `.pages.yml`, `src/data/portfolio.ts`, `PhotographySection.tsx` et `Lightbox.tsx`.

## Ne plus publier les informations masquées (en attente de l'accord de Claire)

Aujourd'hui, l'interrupteur « Afficher ... sur le site » (téléphone, e-mail, Instagram, LinkedIn, base) **cache** l'information à l'écran, mais elle reste dans le code JavaScript publié (lisible par les robots) et dans `content/textes.json` sur GitHub (dépôt public). À faire : au moment de la construction, retirer du site publié les informations désactivées (plugin Vite sur l'import de `content/textes.json`). Pour retirer vraiment une information des fichiers, il faut aussi vider le champ ; elle restera dans l'historique git (purge possible mais lourde, déconseillée).

