# Modifier ton site : le guide

Ton site se modifie depuis **Pages CMS**, une interface avec des formulaires. Tu n'as jamais besoin de toucher au code.

## Se connecter

**La première fois, sur ton ordinateur :**

1. Va sur **[github.com](https://github.com)** et connecte-toi avec ton compte **cl4iire** (ton identifiant et ton mot de passe GitHub, et le code de vérification si GitHub en demande un).
2. Va sur **[app.pagescms.org](https://app.pagescms.org)** et clique sur **Sign in with GitHub** (se connecter avec GitHub). Si GitHub demande d'autoriser Pages CMS, accepte.
3. Dans la liste, à côté de **cl4iire.github.io**, clique sur **Open** (ouvrir).
4. Ajoute cette page à tes favoris : la prochaine fois, tu arriveras directement sur ton site.

**Les fois suivantes :** ouvre ton favori. Si on te demande de te reconnecter, refais l'étape 2.

## Le principe

1. Dans le menu de gauche, partie **Contenu**, choisis une rubrique.
2. Modifie, puis clique sur **Save** (enregistrer).
3. **1 à 2 minutes plus tard**, le site en ligne est à jour : https://cl4iire.github.io/

Pas d'inquiétude : si une information manque ou est mal remplie, le site **n'est pas modifié** et reste comme avant. Rien ne peut « casser » le site en ligne.

Pages CMS est en anglais. Les boutons principaux : **Save** = enregistrer, **Add an entry** = ajouter une entrée, **Delete** = supprimer, **Upload** = envoyer un fichier, **Open** = ouvrir.

**Désactive la traduction automatique de ton navigateur** sur Pages CMS : elle traduit aussi les noms de dossiers (« done-by-friday » devient « fait-d'ici-vendredi »), ce qui embrouille. Dans Chrome : clique sur l'icône de traduction dans la barre d'adresse, puis **Ne jamais traduire ce site**.

**Ne touche pas à la partie « Admin »** du menu (Actions, Collaborateurs, Configuration) : c'est le réglage technique du site. Tout ce dont tu as besoin est dans **Contenu** et **Médias**.

## Les textes en anglais

Chaque texte a deux cases : **Français** et **Anglais**. L'anglais est facultatif : si tu le laisses vide, le site affiche le français aux visiteurs anglophones.

## Ajouter un projet

Menu **Projets (Travaux)** > **Add an entry** (ajouter une entrée), puis remplis :

- **Titre**, **Catégorie** (Film, Documentaire ou Expérience pro) et **Année** (4 chiffres) : obligatoires.
- **Position dans la liste** : 1 = tout en haut de « Travaux ». À position égale, le projet le plus récent passe devant.
- **Description** : obligatoire en français. **Rôles** : facultatif.
- **Lien de la vidéo** : colle l'adresse complète (qui commence par `https://`). Une vidéo YouTube se lance directement sur le site.
- **Date de mise en ligne de la vidéo** : la date indiquée sous la vidéo sur YouTube. Elle permet à Google d'afficher ta vidéo dans ses résultats de recherche vidéo.
- **Images** : clique sur **Upload** pour envoyer tes photos (JPG et PNG acceptés). Pas besoin de choisir un dossier : elles sont rangées dans le dossier du projet et converties automatiquement à la publication. **La première image** sert de couverture et d'aperçu quand on passe la souris sur le projet.
- **Coulisses** : photos de tournage (facultatif), affichées avec un bouton « Coulisses ».
- **Liens supplémentaires** : un article, une autre vidéo... avec le texte du bouton et l'adresse.

Puis **Save**.

**Cacher un projet sans le supprimer** : coche **Masquer du site**. Décoche pour le faire réapparaître.

## Ajouter des photos à un album

Menu **Photos (albums)** > choisis l'album (Portraits, Paysages, Événements).

1. Dans **Photos**, ajoute une ligne (**Add**).
2. **Photo** : envoie ta photo (JPG accepté).
3. **Lieu ou événement** : choisis dans la liste (Népal, Irlande, Motors & Blues...). C'est ce qui sert aux filtres sous les onglets.
4. **Save**.

**Passe toujours par l'album.** Déposer une photo dans *Médias > Images* la range seulement dans la bibliothèque : elle n'apparaît sur le site que si elle est ajoutée dans la liste **Photos** d'un album (étapes ci-dessus, en la choisissant dans la bibliothèque au lieu de l'envoyer).

## Taille des photos : moins de 3 Mo

Pages CMS refuse les fichiers trop lourds : la photo apparaît puis disparaît, avec une erreur **413**. Le site n'a pas besoin de la pleine résolution (il affiche au maximum 2560 px). Avant d'envoyer, réduis tes photos :

- **Depuis Lightroom** (le plus simple) : Fichier > Exporter > **Dimensionner** : « Bord long » **2560 pixels** ; **Format** JPEG, **Qualité 80**. Enregistre ces réglages comme paramètre prédéfini « Portfolio » pour les prochaines fois. Une photo pèse alors environ 1 Mo.
- **Sans Lightroom** : sur le site gratuit **[squoosh.app](https://squoosh.app)**, dépose la photo, coche « Resize » avec une largeur de 2560, puis télécharge le résultat.

**Le lieu n'existe pas encore ?** Va d'abord dans **Lieux et événements** > **Add an entry**, écris le nom en français (et en anglais si tu veux), **Save**. Il apparaîtra ensuite dans la liste des photos.

**Changer l'ordre des photos** : déplace les lignes dans la liste **Photos** : l'ordre de la liste est l'ordre sur le site.

**Retirer une photo** : supprime sa ligne dans la liste (**Delete**), puis **Save**. La photo n'est plus sur le site, mais son fichier reste dans la bibliothèque (**Médias > Images**), au cas où tu voudrais la remettre. Pour la supprimer définitivement : dans **Médias > Images**, ouvre le dossier, menu **⋮** de la photo > **Delete**. La page de publication sur GitHub liste les photos qui ne servent plus (« Médias inutilisés »).

**Cacher tout un album sans le supprimer** : active **Masquer cet album**.

**Ajouter des filtres à un album** (y compris Portraits, qui n'en a pas pour l'instant) : il suffit de donner un **lieu différent** à certaines photos. Dès qu'un album contient au moins deux lieux, les boutons de filtre apparaissent tout seuls ; avec un seul lieu, il n'y a pas de filtre.

**Choisir l'ordre des filtres** (Londres, Népal...) : dans **Lieux et événements**, ouvre un lieu et change sa **Position dans le filtre** (1 = premier). Le premier lieu de l'album est celui affiché quand on ouvre l'onglet.

## Remplacer le CV

Menu **CV et projet de master** > clique sur le CV à changer, envoie le nouveau PDF > **Save**.

Tu peux aussi **cacher le bouton CV** ou **le bouton du projet de master** sur tout le site avec les interrupteurs « Afficher le bouton... ».

## Modifier un texte du site

Menu **Textes du site** : tous les textes sont rangés par partie du site (Accueil, Menu et boutons, À propos, Travaux, Photographies, Contact, Fenêtres). Tu y trouves aussi :

- les **deux photos de l'accueil** (dans « Accueil ») ;
- tes **formations**, **outils**, **langues** et **compétences** (dans « À propos ») : une ligne par élément ;
- ton **e-mail**, ton **téléphone**, **Instagram** et **LinkedIn** (dans « Contact »). Chacun a un interrupteur **Afficher ... sur le site** : désactive-le pour ne plus le montrer (par exemple ton numéro de téléphone), sans effacer l'information.

## Police, couleurs et résultat Google

Menu **Réglages** :

- **Police du site** : 5 polices au choix, testées avec la mise en page.
- **Couleurs du site** : Rose (d'origine), Bleu, Vert ou Sable.
- **Résultat Google** : le titre et la description qui s'affichent dans Google. Google met parfois plusieurs jours à les mettre à jour.
- **Icône du site** : la petite image dans l'onglet du navigateur et dans Google. Envoie une image carrée de préférence : toutes les tailles sont créées automatiquement.
- **Image de partage** : l'aperçu qui s'affiche quand tu envoies le lien de ton site sur WhatsApp, LinkedIn, Messenger... Elle est recadrée automatiquement. Les applications gardent parfois l'ancien aperçu en mémoire quelques jours.

## Si ça ne marche pas

- **Ta modification n'apparaît pas après 5 minutes** : il y a sûrement une information manquante, et le site est resté comme avant. Pour voir quoi : va sur **[github.com/cl4iire/cl4iire.github.io/actions](https://github.com/cl4iire/cl4iire.github.io/actions)** et clique sur la ligne avec une croix rouge ❌ : la liste de ce qu'il faut corriger s'affiche en français. Corrige dans Pages CMS et enregistre à nouveau. Si tu ne comprends pas le message, préviens la personne qui gère le site.
- **Les photos d'iPhone (.heic)** ne sont pas acceptées : envoie-les en JPG (sur l'iPhone : Réglages > Appareil photo > Formats > **Le plus compatible**).
- **Pages CMS affiche une erreur en enregistrant** : recharge la page et refais ta modification.
- **Tu t'es trompée** : pas de panique, chaque modification est sauvegardée dans l'historique. La personne qui gère le site peut revenir à la version d'avant en quelques clics.
