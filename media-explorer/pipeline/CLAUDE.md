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

- Collections « Menus mariage » (séries V1 à V10) et « Panneaux mariage » (P01 à P33), 698 images générées dans Dadaland. Données dans `media-explorer/data.json` : `{items, series, sections}` ; items `s` (série), `url`, `n`, `num`, `file`, `ext`, `tag` (sujet), `p` (extrait de prompt).
- Les prompts viennent du connecteur Dadaland (`list_generations`), qui ne renvoie qu'environ 240 caractères. Les sujets (`tag`) combinent mots-clés de prompts, noms d'images et une lecture visuelle partielle ; 186 images restent « Non identifié ». Scripts : `mariage/tagger.py` et `mariage/build_data.py`, données sources dans `mariage/data/`. `tagger.py` lisait l'ancienne page asset-mariage, devenue une redirection : il est conservé comme trace et ne se relance pas tel quel.
- Les caractéristiques visuelles (couleur, lumière, densité) et la carte UMAP sont calculées dans le navigateur (`umap-js.min.js` local), avec cache `localStorage` (`mx-emb-v2`).
- Ordre d'affichage (vue Séries et navigation du panneau) : `data.json` est tenu en ordre d'arrivée, et l'interface l'affiche à l'envers. La série la plus récente vient en tête de sa section, et dans chaque série l'image la plus récente vient en tête. Toute nouvelle série s'ajoute donc à la fin de `series`, toute nouvelle image à la fin de `items`. Une série marquée `"pin":"end"` reste en bas de sa section (P33 et P37, mises en situation dans l'orangerie, choix de Guillaume du 13 novembre 2026). L'ordre des sections ne change pas. Le texte d'introduction des Panneaux a été retiré à la demande de Guillaume le même jour.
- `mariage/dadaland-menus/` : les scripts qui ont construit les workflows Dadaland des menus. Règle de Guillaume : toute génération d'image Dadaland passe par un workflow (canvas nodal), jamais par une génération isolée.

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
- Espace Mariage : passe de lecture visuelle pour les 186 « Non identifié » proposée, non lancée.
- Rattacher davantage d'images à leurs auteurs (légendes, texte des fiches).
