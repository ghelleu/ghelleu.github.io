# adjoint-ai : compilation

Plateforme publiée sur https://guillaumehelleu.com/adjoint-ai/ (13 novembre 2026).

- `build_data.py` compile `../data.js` à partir des pages publiques de hesge.ch et head-maia.ch (téléchargées dans un dossier `src/`), de `descriptors.json` (règles extraites des 59 descriptifs de modules 2026-2027 par `pdftotext`), de `maia_events.json` (agenda head-maia.ch) et des données Media Explorer HEAD (`../../media-explorer/head-ai/data.json`, `../../media-explorer/pipeline/head-ai/data/projects_norm.json`).
- `h2t.py` convertit les pages HTML téléchargées en texte et en listes de liens.
- `dossier.html` est la source du PDF (`../dossier.pdf`), rendu par Chrome sans en-tête : `google-chrome --headless=new --no-pdf-header-footer --print-to-pdf=dossier.pdf dossier.html` (polices dans `fonts/`).
- Le plan d'études, le calendrier et les échéances sont saisis dans `build_data.py` depuis les PDF officiels ; chaque entrée garde la clé de sa source dans le registre `S`.
