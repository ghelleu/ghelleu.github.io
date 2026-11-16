# Media Explorer : passation

Media Explorer est la plateforme d'exploration d'images de Guillaume Helleu, en ligne sur https://guillaumehelleu.com/media-explorer/. Ce dossier (`media-explorer/pipeline/` du dépôt `ghelleu/ghelleu.github.io`) contient les scripts de collecte, d'import et d'analyse, et les données intermédiaires. Rédigé le 13 novembre 2026 par la session Claude qui a construit la plateforme du 10 au 12 novembre 2026.

## Où vit quoi

| Élément | Emplacement |
|---|---|
| Pages publiées | dépôt `ghelleu/ghelleu.github.io` (public, GitHub Pages, branche `main`), dossier `media-explorer/` |
| Espace Mariage | `media-explorer/index.html` (application complète, un seul fichier) et `media-explorer/data.json` |
| Espace HEAD architecture d'intérieur | `media-explorer/head-ai/` : `index.html` (généré), `data.json`, `atlas_0.webp` à `atlas_5.webp` |
| Ancienne page asset-mariage | `asset-mariage/index.html`, simple redirection vers `media-explorer/#series` |
| Scripts et données intermédiaires | `media-explorer/pipeline/head-ai/` et `media-explorer/pipeline/mariage/` |
| Images Dadaland (espace Mariage) | `https://assets.hint3rland.com/...`, redimensionnées à la volée par `/cdn-cgi/image/width=W,quality=Q,format=auto/` |
| Images hors Dadaland (espace HEAD) | Cloudflare R2, bucket `media-explorer`, servi sur `https://media.hint3rland.com/` |
| Mémoire partagée avec Hermes | dépôt `ghelleu/hermes-vault`, lignes datées dans `inbox/claude/2026-11-12.md` et `2026-11-13.md` |

Publication : push sur `main` de `ghelleu.github.io`, puis contrôle avec `gh run list -R ghelleu/ghelleu.github.io -L 1`. Le déploiement Pages prend une à deux minutes.

## Infrastructure Cloudflare (compte de Hint3rland)

- Compte Cloudflare de Hint3rland. Les collections hors Dadaland y sont stockées (décision de Guillaume, 12 novembre 2026), pas sur un compte séparé.
- Bucket R2 `media-explorer`, Europe de l'Ouest, classe Standard. Domaine public `media.hint3rland.com`.
- CORS du bucket : `GET` et `HEAD` pour `https://guillaumehelleu.com` et `https://www.guillaumehelleu.com`.
- Images, Transformations sur la zone `hint3rland.com`, mode « Specified origins » : `hint3rland.com`, `assets.hint3rland.com`, un domaine `pub-….r2.dev`, `media.hint3rland.com`. Toute nouvelle origine d'images doit y être ajoutée, sinon `/cdn-cgi/image/` répond 9401.
- Quota de transformations : 5 000 uniques gratuites par mois, puis 0,50 $ les 1 000. Le compte en était à 7 021 le 12 novembre (Dadaland compris). C'est pourquoi l'espace HEAD sert des tailles fabriquées à l'import au lieu de `/cdn-cgi/image/`.
- Écriture dans R2 : jeton « Account API token », droit Object Read & Write limité au bucket `media-explorer` (R2, Manage API Tokens). Aucune clé n'est dans ce dépôt ni dans le vault (ce dossier est public, comme tout le site). Les scripts lisent :

```
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=auto
export R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com   # visible dans R2, media-explorer, Settings, S3 API
export R2_BUCKET=media-explorer
```

Dans un environnement Claude, les domaines suivants doivent être autorisés (Guillaume les a ajoutés le 12 novembre) : `*.r2.cloudflarestorage.com`, `media.hint3rland.com`, `head.hesge.ch`, `www.hesge.ch`, `head-maia.ch`, `huggingface.co`, `*.hf.co`.

## Espace Mariage

### Nomenclature Univers · Série · Génération (16 novembre 2026, demande de Guillaume)

Chaque image porte un code `U<univers>S<série>G<génération>`, par exemple `U1S7G14` : univers 1, série 7, génération 14. La numérotation repart à 1 dans chaque branche (séries dans un univers, générations dans une série). Les anciens codes `Pnn` et `Vnn` restent consultables dans le champ `old` de chaque image et de chaque série (« ancien code » dans l'interface).

| Univers | Contenu | Anciennes séries |
|---|---|---|
| U1 | Panneaux mariage, 137 séries, 880 images | P01 à P79 sauf P33 et P37 |
| U2 | Menus mariage, 10 séries, 104 images | V1 à V10 |
| U3 | Mises en situation dans l'orangerie, 2 séries, 20 images | P33, P37 |

Règle de découpage : une série regroupe une seule direction graphique produite dans une même passe. Les anciennes séries qui mélangeaient plusieurs directions ont été découpées : P24 et P25 (14 directions, un même prompt passé dans Nano Banana Pro puis GPT Image 2.5 Flare : une série de 6 images par direction), P26 (14 directions), P27, P28, P29 (10 directions chacune), P02, P04, P05, P06, P13, P14, P15, P16 (passes distinctes : peinture seule puis titre, passe A puis passe B, humains puis créatures). Les essais d'un seul style par image sont regroupés dans une série « Essais de styles isolés ». La correspondance complète ancien code vers nouveau code est dans `mariage/data/correspondance_codes.json`.

Ordre : les séries d'un univers suivent l'ordre chronologique de production ; l'interface affiche la plus récente en tête. Toute nouvelle série prend le numéro suivant de son univers (U1 : `U1S138`, puis `U1S139`…) et s'ajoute à la fin de `series` ; ses images s'ajoutent à la fin de `items` avec `g` = 1, 2, 3…

### Données

`media-explorer/data.json` : `{items, series, sections, workflows}`.
- `sections` : un univers par entrée (`code` U1, U2, U3, `title`, `ratio`).
- `series` : `code` (U1S7), `u`, `n`, `title`, `sub`, `sec` (code de l'univers), `old` (anciens codes et numéros), `count`, éventuellement `pin`.
- `items` : `s` (code série), `g` (numéro de génération), `code` (U1S7G14), `url`, `n` (nom), `file` (code puis nom en snake_case, nom du fichier téléchargé), `ext`, `tag` (créature), `perso` (personnage, panneaux), `old` (ancien code, ex. `P25_04`), `model` (modèle Dadaland), `date` (jour de génération quand Dadaland le donne), `wf` (identifiant du workflow Dadaland), `p` (prompt), `pk` (nature du prompt : `full` complet, `extrait` les 240 premiers caractères conservés par l'historique Dadaland, `resume` consigne résumée au moment de la génération), `sch` (entrées du schéma simplifié du workflow : image source, références, toile vierge…).
- `workflows` : identifiant de workflow Dadaland vers son nom.

État des prompts au 16 novembre 2026 : 247 complets (menus V1 à V10 en grande partie, batch final et suites, workflows lus dans Dadaland), 586 extraits de 240 caractères (séries de P01 à P33), 167 consignes résumées (séries de P34 à P52 et une partie de P67), 4 sans prompt. Le connecteur Dadaland ne rend le prompt complet qu'en lisant le workflow (`get_workflow`), nœud par nœud ; `list_generations` n'en donne que le début.

Scripts de la restructuration (trace, chemins de la session du 16 novembre) : `mariage/restructure/spec.py` (découpage des séries), `mariage/restructure/build.py` (reconstruction de `data.json`), données d'appui dans `mariage/restructure/`.

### Interface

- Un clic sur une image ouvre la visionneuse plein écran : grande image à gauche, flèches et touches ← → pour passer d'une image à l'autre, Échap pour fermer. À droite : code, série, modèle, date, ancien code, schéma simplifié du workflow (entrées, prompt, modèle, image), nom et identifiant du workflow Dadaland, prompt avec sa nature (complet, extrait ou résumé), caractéristiques visuelles, images les plus proches.
- Sujets des panneaux (13 novembre 2026, demande de Guillaume) : chaque panneau porte un personnage (`perso`, par exemple Troubadour, Chevalier, Héraut, Châtelaine) et la créature qui l'incarne dans cette image (`tag`, par exemple Faune, Bélier, Centaure, Humain, Coq). La table est dans `mariage/data/sujets_panneaux.json` (indexée par URL), appliquée par `mariage/apply_sujets.py` (à relancer après tout ajout : une image de l'univers U1 absente de la table prend son personnage dans son nom, et garde son `tag`). Les menus n'ont pas de personnage. La vue Sujet regroupe par personnage, puis par créature.
- Les caractéristiques visuelles (couleur, lumière, densité) et la carte UMAP sont calculées dans le navigateur (`umap-js.min.js` local), avec cache `localStorage`.
- Une série marquée `"pin":"end"` reste en bas de son univers. Le texte d'introduction des Panneaux a été retiré à la demande de Guillaume le 13 novembre 2026.
- `mariage/dadaland-menus/` : les scripts qui ont construit les workflows Dadaland des menus et de la série « Style menu, blanc sur bleu ciel ». Règle de Guillaume : toute génération d'image Dadaland passe par un workflow (canvas nodal), jamais par une génération isolée.
- Règles de Guillaume pour les générations (15 novembre 2026) : ne rien pousser dans Figma sans sa demande expresse ; toute génération monte systématiquement sur Media Explorer.
- Historique : les sujets (`tag`) des premières séries viennent de `mariage/tagger.py` et `mariage/build_data.py` (données sources dans `mariage/data/`), conservés comme trace.

## Espace HEAD architecture d'intérieur

Demande de Guillaume (12 novembre 2026) : cartographier toute la production visuelle publique de la filière, Bachelor et Master, pour l'analyser par année, type d'image, cadrage, style et personne. Choix de Guillaume : diffusion publique, sources web publiques, Instagram par son Chrome. Collection séparée des collections Mariage.

État au 12 novembre 2026 : 5 734 images uniques, 619 projets ou fiches avec images (633 au total), 2011 à 2026, 1 014 personnes.

### Sources

- Site HEAD, fiches projets. La liste se charge par `https://head.hesge.ch/api/head-views?view_name=headge_listing_projects&view_display_id=page&formation%5B0%5D=<code>&page=<n>` (11785 Bachelor architecture d'intérieur, 11825 Master architecture d'intérieur) : 460 projets.
- Site HEAD, actualités (`listing_news`, `block_page_listing`) et événements (`listing_event`, `block_evenements`) avec les mêmes codes. On garde les fiches dont la formation principale est l'architecture d'intérieur, et pour les événements les expositions ou ceux qui ont au moins trois images : 112 fiches.
- head-maia.ch, 61 projets (pages WordPress, pas d'API pour ce type de contenu).
- Instagram (@head_baai, @head_maia) : non collecté. L'appel aux services internes d'Instagram a été bloqué par les garde-fous de Claude (contournement de protection anti-robot). Voie prévue : export officiel des comptes (Paramètres, Télécharger vos informations) par la personne qui les gère.
- Avant 2011 : rien en ligne.

### Pipeline (dossier `head-ai/`, à lancer depuis `head-ai/data/`)

1. `python3 ../crawl_list.py` : liste des projets → `head_list.json`.
2. `python3 ../crawl_projects.py` : fiches (métadonnées, figures, crédits) → `head_projects.json` (cache HTML dans `pages/`).
3. `python3 ../crawl_maia.py` → `maia_projects.json` (cache `maia/`) ; `python3 ../crawl_ne.py` → `head_ne.json`. La sélection des actualités et expositions et la liste `items_all.json` ont été faites à la main ; la logique est décrite ci-dessus.
4. `python3 ../normalize.py` → `projects_norm.json` (personnes, types, années). Il relit les caches HTML de MAIA et des événements : relancer les crawls avant.
5. `python3 ../ingest.py items_all.json` (variables R2 requises) : télécharge, déduplique par SHA-1, envoie dans R2 sous `head-ai/img/<sha1>/o.<ext>` et `160.webp`, `480.webp`, `1000.webp`, `2000.webp`. Reprise possible : `manifest.jsonl` garde ce qui est fait. Quatre fils au maximum (avec huit, le processus a été tué faute de mémoire).
6. `python3 ../analyze.py` : caractéristiques de couleur, empreintes CLIP ViT-B/16 (modèle ONNX `Xenova/clip-vit-base-patch16`, fichiers `vision_model.onnx`, `text_model.onnx`, `tokenizer.json` à placer dans `data/clip/`), classement zéro-shot en 13 types d'image et 5 cadrages, cartes UMAP (`umap-learn`), voisins, doublons visuels (cosinus > 0,985) → `analysis.json`. Les empreintes sont en cache dans `emb.npz`. Les copies 480 px locales (`data/img/`) se retéléchargent depuis R2 si elles manquent.
7. `python3 ../build_space.py` (variable `SITE_DIR`, chemin du clone de `ghelleu.github.io`, par défaut `~/ghelleu.github.io`) : écrit `media-explorer/head-ai/data.json` et les atlas de vignettes 64 px.
8. `python3 front/assemble.py` : assemble `base.css` (feuille de l'espace Mariage), `app_extra.css` et `app.js` en `media-explorer/head-ai/index.html`. On modifie l'interface dans `head-ai/front/`, jamais directement dans le `index.html` publié.

Dépendances : `pip install boto3 pillow numpy onnxruntime tokenizers umap-learn`.

### Interface

- Vues : Ressemblance (UMAP CLIP), Type d'image (UMAP supervisé par type), Chronologie (une colonne par année, hauteur = projection 1D de la ressemblance), Couleur, Lumière, Projets (liste par année).
- Curseur « Attraction » : 0 % écarte les images jusqu'au contact, 100 % donne la projection brute avec chevauchements. Collision douce par disques, pas de grille.
- Filtres : années, formation, type de projet, type d'image, cadrage, source, projets primés, doublons, recherche de personne ou de projet. Panneau Analyse : barres empilées par année (types, cadrages), couleurs dominantes par année, personnes les plus présentes ; tout suit les filtres.
- Palette catégorielle des graphiques : huit familles fixes (`FAM` dans `app.js`), jamais recyclées.

### Limites connues

- Types d'image et cadrages estimés par CLIP : à présenter comme indicatifs.
- Les projets MAIA n'ont pas d'étudiants structurés ; les noms déjà connus côté HEAD sont repérés dans le texte (« cité·e·s »). 221 images seulement sont attribuées à un·e étudiant·e précis·e via leur légende.
- 577 images publiées à la fois sur les sites HEAD et MAIA sont masquées par défaut.

## Tests

Test sans navigateur visible avec Playwright (Chromium) : servir le clone du site en local (`python3 -m http.server`), ouvrir `media-explorer/head-ai/`, attendre `window.__mx`, passer les vues avec `__mx.setLay(k)`, faire des captures en 1440×900 et 390×844. Bloquer `fonts.googleapis.com` si le réseau le refuse.

## Règles de Guillaume (non négociables)

- Aucun fait inventé. Source absente : écrire « source manquante » et demander.
- Un texte validé se recopie mot pour mot.
- Interdits d'écriture : antithèse ou contrepoint, règle de trois, « ni… ni… mais… », tiret cadratin. Français par défaut, direct, sans flatterie ni préambule.
- Aucun mail envoyé sans brouillon soumis en entier et confirmation explicite.
- Mémoire : le vault `ghelleu/hermes-vault` fait foi. Lire son `CLAUDE.md` avant d'y écrire ; Claude n'écrit que dans `inbox/claude/AAAA-MM-JJ.md`, une ligne datée par fait durable, commit préfixé `claude:`, jamais de `--force`, jamais de clé ni d'identifiant.
- Guillaume ne code pas : lui donner des résultats et des liens, pas des commandes.

## Pistes ouvertes

- Intégrer l'export Instagram quand Guillaume le fournit (format JSON de Meta, images et légendes datées).
- Archives antérieures à 2011 : aucune source fournie à ce jour.
- Rattacher davantage d'images à leurs auteurs (légendes, texte des fiches).
