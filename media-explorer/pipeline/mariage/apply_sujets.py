"""Applique les sujets des panneaux (personnage et créature) à media-explorer/data.json.

Source : data/sujets_panneaux.json, une entrée par URL d'image, établie le 13 novembre 2026
par lecture visuelle de chaque panneau, contrôlée contre le nom de l'image.
  perso : le personnage (rôle) représenté, par exemple Troubadour, Chevalier, Héraut.
  crea  : la créature qui l'incarne dans cette image, par exemple Faune, Bélier, Centaure, Humain.
Dans data.json, le personnage va dans le champ `perso` et la créature dans `tag`.

Une image absente de la table garde son `tag`, ramené au même vocabulaire (« Femme-biche » devient « Biche »). Si son nom contient un rôle connu
(« Le Troubadour », « La Châtelaine, fond rouge »…), ce rôle devient son `perso`.
À relancer après tout ajout d'images : python3 apply_sujets.py
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.environ.get('SITE_DIR', os.path.expanduser('~/ghelleu.github.io'))
DATA = os.path.join(SITE, 'media-explorer', 'data.json')
ROLES = ['Chevalier', 'Troubadour', 'Héraut', 'Châtelaine', 'Dentellière', 'Vigneronne', 'Bouffon', 'Fauconnière',
         'Fauconnier', 'Herboriste', 'Sorcière', 'Reine', 'Alchimiste', 'Pèlerin', 'Orfèvre', 'Bateleur', 'Dame du Lac',
         'Batelière du Léman', 'Échanson', 'Bergère', 'Fileuse', 'Messager', 'Cavalière', 'Lavandière', 'Meunière',
         'Forgeron', 'Veilleur']
fold = lambda s: s.lower().replace('é', 'e').replace('è', 'e').replace('â', 'a').replace('’', "'")
raw = open(DATA, encoding='utf-8').read()
d = json.loads(raw)
table = json.load(open(os.path.join(HERE, 'data', 'sujets_panneaux.json'), encoding='utf-8'))
hit = guess = 0
for it in d['items']:
    t = table.get(it['url'])
    if t:
        it['perso'], it['tag'] = t['perso'], t['crea']; hit += 1
    elif it['s'].startswith('P') and not it.get('perso'):
        # même vocabulaire que la table : « Femme-biche » ou « Homme-bélier » deviennent « Biche » et « Bélier »
        m = re.match(r'^(?:Femme|Homme)-(.+)$', it.get('tag') or '')
        if m: it['tag'] = m.group(1)[:1].upper() + m.group(1)[1:]
        n = fold(it['n'])
        r = next((r for r in sorted(ROLES, key=len, reverse=True) if re.search(r'\b' + re.escape(fold(r)) + r'\b', n)), None)
        if r: it['perso'] = r; guess += 1
open(DATA, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ('\n' if raw.endswith('\n') else ''))
print(f'{hit} images depuis la table, {guess} personnages déduits du nom, {len(d["items"])} images au total')
