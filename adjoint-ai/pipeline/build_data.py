"""Compile les données publiques de la filière Architecture d'intérieur (HEAD – Genève)
en un seul fichier data.js pour la plateforme adjoint-ai.
Sources : pages hesge.ch et head-maia.ch, plans d'études et descriptifs 2026-2027,
calendrier académique 2026-2027, données Media Explorer HEAD (relevé du 12.11.2026)."""
import json, re, collections, sys
from bs4 import BeautifulSoup

SRC = '/home/claude/src'
ME = '/home/claude/ghelleu.github.io/media-explorer'
OUT = sys.argv[1]

H = 'https://www.hesge.ch'
S = {  # registre des sources
 'ba': ('HEAD – Genève, page Bachelor Architecture d\'intérieur', H+'/head/formations/bachelors/bachelor-architecture-dinterieur'),
 'ma': ('HEAD – Genève, page Master Architecture d\'intérieur', H+'/head/formations/masters/master-architecture-dinterieur'),
 'peba': ('Plan d\'études Bachelor AI 2026-2027 (PDF)', H+'/sites/head/files/2026-09/PE-BAAI_2026-2027.pdf'),
 'pema': ('Plan d\'études MAIA 2026-2027 (PDF)', H+'/sites/head/files/2026-09/PE_MAIA_2026-2027.pdf'),
 'dba': ('Descriptifs de modules Bachelor AI 2026-2027 (ZIP)', H+'/sites/head/files/2026-10/Bachelor_en_Architecture_dinterieur_descriptifs_modules.zip'),
 'dma': ('Descriptifs de modules MAIA 2026-2027 (ZIP)', H+'/sites/head/files/2026-10/Master_en_Architecture_dinterieur_descriptifs_modules.zip'),
 'cal': ('Calendrier académique 2026-2027 (PDF)', H+'/sites/head/files/2026-10/CalendrierAcademique_2026-2027_Sept26.pdf'),
 'calp': ('HEAD – Genève, page Calendrier académique 2026-27', H+'/head/vie-etudiante/informations-pratiques/calendrier-academique-2026-27'),
 'admba': ('Admissions Bachelor, calendrier', H+'/head/admissions/bachelor/calendrier-des-admissions'),
 'selba': ('Admissions Bachelor, processus de sélection', H+'/head/admissions/bachelor/processus-de-selection'),
 'admma': ('Admissions Master, calendrier', H+'/head/admissions/master/calendrier-des-admissions'),
 'selma': ('Admissions Master, processus de sélection', H+'/head/admissions/master/processus-de-selection'),
 'out': ('Mobilité, partir en échange à l\'étranger', H+'/head/ecole/international/mobilite/partir-en-echange-a-letranger-out'),
 'in': ('Mobilité, venir en échange à la HEAD', H+'/head/ecole/international/mobilite/venir-en-echange-a-la-head'),
 'stage': ('Mobilité, effectuer un stage à l\'étranger', H+'/head/ecole/international/mobilite/effectuer-un-stage-a-letranger-out'),
 'sdtlp': ('Semaine de tous les possibles', H+'/head/formations/transversalite/semaine-de-tous-les-possibles'),
 'regba': ('Règlement d\'études des filières Bachelor Design et Arts visuels de la HEAD, 28.07.2021 (PDF)', H+'/sites/head/files/2026-09/7-1_an1_reglement_etudes_head1.pdf'),
 'regma': ('Règlement de filière du Master of Arts HES-SO en Architecture d\'intérieur, 02.06.2020 (PDF)', H+'/sites/head/files/2026-09/r_2020-18-60_ann3-6_regl_filiere_master_arts_ai_rt_02-06-2020.pdf'),
 'reghes': ('Règlement relatif à la formation de base (Bachelor et Master) HES-SO, 02.06.2020 (PDF)', H+'/sites/head/files/2026-09/reglement_formation_de_base_ba-ma_septembre_2020.pdf'),
 'regs': ('HEAD – Genève, règlements et directives', H+'/head/vie-etudiante/informations-pratiques/reglements-et-directives'),
 'mabout': ('head-maia.ch, About', 'https://head-maia.ch/about/'),
 'mmod': ('head-maia.ch, Modules', 'https://head-maia.ch/modules/'),
 'mev': ('head-maia.ch, Agenda', 'https://head-maia.ch/events/'),
 'minfo': ('head-maia.ch, Info', 'https://head-maia.ch/info/'),
 'proj': ('HEAD – Genève, projets de la filière (fiches publiques)', 'https://head.hesge.ch/projets'),
 'mx': ('Media Explorer HEAD, relevé des pages publiques du 12.11.2026', 'https://guillaumehelleu.com/media-explorer/head-ai/'),
}

# ---------- 1. Plans d'études ----------
def M(code, t, ects, cat, units='', ai=False):
    return dict(c=code, t=t, e=ects, k=cat, u=units, ai=ai)
BA = {
 1: [M('01HC','Histoire et conceptualisation du design 1',3,'theo','Histoire et théorie du design 1 · Méthodologies du travail théorique 1'),
     M('11AP','Atelier et projets 1',9,'atel','Atelier pratique',True),
     M('11TEM1','Fondamentaux techniques (matériel) 1',3,'tech','Théorie et pratique de la construction 1'),
     M('11REP1','Représentation (PAO)',3,'repr','Photoshop, Illustrator, InDesign'),
     M('11RE1','Représentation 1',6,'repr','Détails de construction · Représentation 2D/3D',True),
     M('11TH1','Fondamentaux théoriques 1',3,'theo','Histoire et théorie de l\'architecture d\'intérieur 1'),
     M('11WS','Workshops 1',3,'ws','Semaine inaugurale')],
 2: [M('02HC','Histoire et conceptualisation du design 2',3,'theo','Histoire et théorie du design 2 · Méthodologies du travail théorique 2'),
     M('12AP','Atelier et projets 2',9,'atel','Atelier pratique',True),
     M('12TEM2','Fondamentaux techniques (matériel) 2',3,'tech','Théorie et pratique de la construction 2'),
     M('12REB1','Représentation (BIM 1)',3,'repr','BIM 1',True),
     M('12RE2','Représentation 2',6,'repr','Théorie de la représentation · Théorie et pratique de la photographie'),
     M('12TH2','Fondamentaux théoriques 2',3,'theo','Histoire et théorie de l\'architecture d\'intérieur 2'),
     M('12WS','Workshops 2',3,'ws','Semaine de tous les possibles ou autre workshop')],
 3: [M('13AP','Atelier et projets 3',9,'atel','Atelier pratique',True),
     M('13TEM3','Fondamentaux techniques (matériel) 3',3,'tech','Technologies et matériaux'),
     M('13DO','Design objets',3,'tech','Culture et aménagement du mobilier'),
     M('13REB2','Représentation (BIM 2)',3,'repr','BIM 2',True),
     M('13TH','Fondamentaux théoriques 3',3,'theo','Histoire et théorie de l\'architecture d\'intérieur 3'),
     M('13WS','Workshops 3',3,'ws','Semaine inaugurale'),
     M('TRANS3','Modules transversaux',6,'trans','Un cours théorique à choix · un cours théorique ou pratique à choix',True)],
 4: [M('14AP','Atelier et projets 4',9,'atel','Atelier pratique',True),
     M('14TEM4','Fondamentaux techniques (matériel) 4',3,'tech','Dessin d\'observation'),
     M('14TEE1','Fondamentaux techniques (énergie) 1',3,'tech','Lumière, éclairage · Chauffage, ventilation'),
     M('14REB3','Représentation (BIM 3)',3,'repr','BIM 3',True),
     M('14TH','Fondamentaux théoriques 4',3,'theo','Séminaire, théories contemporaines en architecture d\'intérieur'),
     M('14WS','Workshops 4',3,'ws','Semaine de tous les possibles ou autre workshop'),
     M('TRANS4','Modules transversaux',6,'trans','Un cours théorique à choix · un cours théorique ou pratique à choix',True)],
 5: [M('15AP','Atelier et projets 5',9,'atel','Atelier pratique (ou stage approuvé)',True),
     M('15TEM5','Fondamentaux techniques (matériel) 5',3,'tech','Théorie et pratique de la construction 3'),
     M('15TEE2','Fondamentaux techniques (énergie) 2',3,'tech','Circularité · Acoustique'),
     M('15RP','Réalités professionnelles',3,'pro','Réalités professionnelles'),
     M('15TH','Fondamentaux théoriques 5',3,'theo','Séminaire de recherche'),
     M('15WS','Workshops 5',3,'ws','Semaine inaugurale'),
     M('TRANS5','Modules transversaux optionnels',6,'trans','Un cours théorique à choix · un cours théorique ou pratique à choix',True)],
 6: [M('16BT','Bachelor Thesis',18,'thesis','Réalisation du travail théorique et pratique'),
     M('16GD','Gestion durable',3,'pro','Gestion durable'),
     M('16EP','Économie de projet',3,'pro','Économie de projet'),
     M('16CM','Connaissances métiers',3,'pro','Connaissances métier'),
     M('16WS','Workshops 6',3,'ws','Semaine de tous les possibles ou autre workshop')],
}
MA = {
 1: [M('MAIBTP1','Bases techniques et professionnelles',6,'tech','Plants · Animals · Human Bodies within Interior Spaces'),
     M('1MaDE11','Formation à la recherche 1',3,'rech','Avec le Master HES-SO en design'),
     M('MAIMTAC1','Atelier de conception 1',9,'atel','Studio'),
     M('MAIWS1','Workshop HEAD – Camondo 1',3,'ws','Avec l\'École Camondo'),
     M('MOJMA1','Séminaire théorique 1',3,'jma','Joint Master of Architecture'),
     M('MOJMA2','Séminaire théorique 2',3,'jma','Joint Master of Architecture'),
     M('MAIO-1','Option 1',3,'jma','Options du JMA, seules celles à 3 ECTS sont validées')],
 2: [M('MAIATP1','Approfondissements techniques et professionnels 1',6,'tech','Digital Interior Architecture · Circularity and Materials',True),
     M('1MaDE21','Formation à la recherche 2',3,'rech','Avec le Master HES-SO en design'),
     M('MAIMTAC2','Atelier de conception 2',12,'atel','Studio'),
     M('SDTLP','Workshop, Semaine de tous les possibles',3,'ws','Workshop interfilières'),
     M('MAIWSEC','Workshop MA Design Installation',3,'ws','Avec le MA Design Installation'),
     M('MOJMA3','Séminaire théorique 3',3,'jma','Joint Master of Architecture'),
     M('MAIO-2','Option 2',3,'jma','Options du JMA, seules celles à 3 ECTS sont validées')],
 3: [M('MAIATP2','Approfondissements techniques et professionnels 2',3,'tech','Curatorial Practices'),
     M('2MaAIDE11','Formation à la recherche 3',3,'rech','Préparation de la Master Thesis'),
     M('MAIMTAC3','Atelier de conception 3',12,'atel','Studio'),
     M('MAIWS2','Workshop HEAD – Camondo 2',3,'ws','Avec l\'École Camondo'),
     M('MOJMA4','Séminaire théorique 4',3,'jma','Joint Master of Architecture'),
     M('MOJMA5','Séminaire théorique 5',3,'jma','Joint Master of Architecture')],
 4: [M('MAIMTT1','Master Thesis théorique',9,'thesis','Mémoire'),
     M('MAIMTP1','Master Thesis pratique',21,'thesis','Projet de diplôme')],
}
desc = {d['code']: d for d in json.load(open(SRC+'/descriptors.json'))}
fmap = {'1MaDE11':'Formation à la Recherche 1','1MaDE21':'Formation à la Recherche 2','2MaAIDE11':'Formation à la recherche 3'}
byt = {d['title']: d for d in desc.values()}
for k, v in fmap.items():
    for d in json.load(open(SRC+'/descriptors.json')):
        if d['title'] and d['title'].lower().startswith(v.lower()): desc[k] = d
for prog in (BA, MA):
    for sem, mods in prog.items():
        for m in mods:
            d = desc.get(m['c']) or (desc.get('PRAT') if m['c'].startswith('TRANS') else None)
            if d:
                m['rem'] = bool(d['rem']); m['part'] = bool(d['part'])
            if m['c'] == '16BT': m['rem'] = False  # art. 35 al. 3 du règlement Bachelor
            if m['c'] == '15AP': m['stage'] = True

# ---------- 2. Calendrier ----------
# (lundi, libellé de la semaine, semaine du semestre, type) d'après le PDF officiel
CAL = [
 ('2026-09-07','Semaine de pré-rentrée (jeudi : fermeture des bâtiments)','','pre'),
 ('2026-09-14','Semaine inaugurale','A1','inau'),
 ('2026-09-21','Cours','A2','cours'),('2026-09-28','Cours','A3','cours'),('2026-10-05','Cours','A4','cours'),
 ('2026-10-12','Cours','A5','cours'),('2026-10-19','Cours','A6','cours'),('2026-10-26','Cours','A7','cours'),
 ('2026-11-02','Semaine « hors cadre »','A8','hc'),
 ('2026-11-09','Cours','A9','cours'),('2026-11-16','Cours','A10','cours'),('2026-11-23','Cours','A11','cours'),
 ('2026-11-30','Cours','A12','cours'),('2026-12-07','Cours','A13','cours'),('2026-12-14','Cours','A14','cours'),
 ('2026-12-21','Semaine sans cours (jeudi-vendredi : fermeture)','','sans'),
 ('2026-12-28','Fermeture des bâtiments','','ferm'),('2027-01-04','Fermeture des bâtiments','','ferm'),
 ('2027-01-11','Semaine « hors cadre »','A15','hc'),
 ('2027-01-18','Jurys','A16','jury'),
 ('2027-01-25','Remédiations / sans cours','','rem'),('2027-02-01','Remédiations / sans cours','','rem'),
 ('2027-02-08','Semaine sans cours','','sans'),('2027-02-15','Semaine sans cours','','sans'),
 ('2027-02-22','Semaine de tous les possibles','P1','sdtlp'),
 ('2027-03-01','Cours','P2','cours'),('2027-03-08','Cours','P3','cours'),('2027-03-15','Cours','P4','cours'),
 ('2027-03-22','Cours (vendredi : fermeture)','P5','cours'),
 ('2027-03-29','Sans cours (lundi : fermeture)','','sans'),
 ('2027-04-05','Cours','P6','cours'),('2027-04-12','Cours','P7','cours'),
 ('2027-04-19','Semaine « hors cadre »','P8','hc'),
 ('2027-04-26','Cours','P9','cours'),('2027-05-03','Cours (jeudi sans cours)','P10','cours'),
 ('2027-05-10','Cours','P11','cours'),('2027-05-17','Cours (lundi sans cours)','P12','cours'),
 ('2027-05-24','Cours','P13','cours'),('2027-05-31','Cours','P14','cours'),
 ('2027-06-07','Semaine « hors cadre »','P15','hc'),
 ('2027-06-14','Jurys','P16','jury'),
 ('2027-06-21','Jurys (lundi-mercredi), jours sans cours','P17','jury'),
 ('2027-06-28','Remédiations / sans cours','','rem'),('2027-07-05','Remédiations / sans cours','','rem'),
 ('2027-07-12','Semaine sans cours','','sans'),('2027-07-19','Semaine sans cours','','sans'),
 ('2027-07-26','Fermeture des bâtiments','','ferm'),('2027-08-02','Fermeture des bâtiments','','ferm'),
 ('2027-08-09','Fermeture des bâtiments','','ferm'),('2027-08-16','Fermeture des bâtiments','','ferm'),
 ('2027-08-23','Semaine sans cours','','sans'),('2027-08-30','Semaine sans cours','','sans'),
]
# Échéances datées : (début, fin, libellé, piste, poids, source)
EV = [
 ('2026-09-07','2026-09-07','AG de rentrée','ecole',1,'cal'),
 ('2026-09-08','2026-09-11','Accueil des nouveaux étudiants, visite du campus','ecole',1,'cal'),
 ('2026-09-14','2026-09-14','Rentrée, début du semestre d\'automne','ecole',1,'cal'),
 ('2026-10-10','2026-10-15','Mobilité IN : nominations (10.10) et candidatures (15.10) pour le printemps 2027','mob',1,'in'),
 ('2026-10-20','2026-10-20','Séance d\'information des mobilités OUT 2027-2028','mob',1,'out'),
 ('2026-11-15','2026-11-30','Mobilité OUT : vœux pour le semestre d\'automne 2027','mob',2,'out'),
 ('2026-11-17','2026-11-17','Ouverture des inscriptions aux concours Bachelor et Master','adm',1,'admba'),
 ('2027-01-22','2027-01-22','Délai de remise des résultats du semestre d\'automne, 17h','ecole',3,'cal'),
 ('2027-01-23','2027-01-23','Portes ouvertes','adm',2,'cal'),
 ('2027-02-08','2027-02-08','Concours Bachelor : délai conditions spéciales, 17h','adm',1,'cal'),
 ('2027-02-19','2027-02-19','Publication des épreuves de création (Bachelor design)','adm',1,'admba'),
 ('2027-03-01','2027-03-01','Concours Bachelor : délai de candidature, 17h','adm',1,'cal'),
 ('2027-03-08','2027-03-08','Concours Master : délai conditions spéciales, 17h','adm',1,'cal'),
 ('2027-03-09','2027-03-15','Concours Bachelor : 1er tour (examen des dossiers)','adm',3,'cal'),
 ('2027-03-19','2027-03-19','Concours Bachelor : résultats du 1er tour','adm',1,'admba'),
 ('2027-03-22','2027-03-22','Concours Master : délai de candidature, 17h','adm',1,'cal'),
 ('2027-03-30','2027-04-07','Concours Master : 1er tour (examen des dossiers)','adm',3,'cal'),
 ('2027-04-12','2027-04-12','Concours Master : résultats du 1er tour','adm',1,'admma'),
 ('2027-04-12','2027-04-16','Concours Bachelor : entretiens du 2e tour','adm',3,'cal'),
 ('2027-04-28','2027-05-07','Concours Master : entretiens du 2e tour','adm',3,'cal'),
 ('2027-04-30','2027-04-30','Concours Bachelor : résultats du 2e tour','adm',1,'admba'),
 ('2027-05-14','2027-05-14','Concours Master : résultats du 2e tour','adm',1,'admma'),
 ('2027-05-15','2027-05-31','Mobilité OUT : vœux pour le semestre de printemps 2028','mob',2,'out'),
 ('2027-05-31','2027-05-31','Délai de confirmation des admis','adm',1,'admba'),
 ('2027-06-23','2027-06-23','Délai de remise des résultats du semestre de printemps, 17h','ecole',3,'cal'),
 ('2027-07-07','2027-07-07','Fête des diplômes','ecole',2,'cal'),
 ('2026-10-08','2027-08-27','Exposition Humanitarian, by Design? (MAIA, Genève)','maia',0,'mev'),
]
# Repères MAIA observés en 2026 (dates 2027 non publiées)
REP = [
 ('02-19','Exposition des thèses MAIA (19.02.2026)','https://head-maia.ch/events/'),
 ('04-20','Milan Design Week, NO ONE SEES THEM LIKE WE DO (20-26.04.2026)','https://head-maia.ch/event/no-one-sees-them-like-we-do/'),
 ('06-05','Exposition des diplômes MAIA, 13 Houses, 1 Garden (05-08.06.2026)','https://head-maia.ch/event/13-houses-1-garden-diploma-show/'),
]

# ---------- 3. Équipes publiées ----------
TEAM = {
 'BA': {'Responsable':['Javier Fernández Contreras'],'Adjointe':['Valentina De Luigi'],'Secrétariat':['Lucie Landenbergue'],
        'Assistants':['Robin Delerce','Valentin Calame','Bryan Jefferson Reyes','Louis Meier','Chiara Pezzetta','Manuel Rossi','David Viladomiu Ceballos'],
        'Enseignants':['Endrias Abeyi','Ahmed Belkhodja','Irma Cilacian Gandolfi','Yves Corminboeuf','Valentin Dubois','David Fagart','Line Fontana','Simon Husslein','Youri Kravtchenko','Philippe Rahm','Leonid Slonimskiy','Roberto Zancan'],
        'Intervenants':['Elsa Audouin','Sébastien Grosset','Antoine Guay','Aurélien Reymond','Guillaume Helleu','Thomas Juguin','Christophe Lombardo','Dorothée Loustalot','Jonathan Martinez','Federico Neder','Dylan Perrenoud','Paule Perron','Manon Portera','André Schlaepfer','Guillaume Capt']},
 'MA': {'Responsable':['Javier Fernández Contreras'],'Adjointe':['Valentina De Luigi'],'Secrétariat':['Lucie Landenbergue'],
        'Assistants':['Valentin Calame','David Viladomiu Ceballos','Chiara Pezzetta','Manuel Rossi','Bryan Jefferson Reyes'],
        'Enseignants':['Simon Husslein','Aida Navarro Redón','Philippe Rahm','Leonid Slonimskiy','Roberto Zancan'],
        'Intervenants':['Apropå (studio)','Alessandra Covini','Marine de Dardel','Guillaume Helleu','Jolanthe Kugler','Alejandro Muiño','Paule Perron','Daniel Zamarbide','Galliane Zamarbide']},
}
AFF = {'Elsa Audouin':'Collectif GALTA','Sébastien Grosset':'Collectif GALTA','Antoine Guay':'Collectif GALTA','Aurélien Reymond':'Collectif GALTA',
       'André Schlaepfer':'Schlaepfer Capt','Guillaume Capt':'Schlaepfer Capt','Ahmed Belkhodja':'Fala atelier','David Fagart':'Fagart & Fontana','Line Fontana':'Fagart & Fontana',
       'Alessandra Covini':'Studio Ossidiana','Daniel Zamarbide':'BUREAU','Galliane Zamarbide':'BUREAU','Apropå (studio)':'Studio for Lighting and Circular design'}

# ---------- 4. Modules MAIA 2020-2026 ----------
s = BeautifulSoup(open(SRC+'/maia_modules.html'), 'html.parser')
for t in s(['script','style']): t.decompose()
lines = [l.strip() for l in s.get_text('\n').split('\n') if l.strip()]
mods = []; seen = set()
for i, l in enumerate(lines):
    m = re.match(r'^(Fall|Spring) (20\d\d)$', l)
    if m:
        who, title = lines[i-2], lines[i-1]
        k = (who, title, l)
        if k in seen: continue
        seen.add(k)
        w = re.sub(r'\s+', ' ', who).strip()
        kind = 'module'
        if re.match(r'^STUDIO', w, re.I): kind = 'studio'
        elif re.match(r'^WORKSHOP', w, re.I): kind = 'workshop'
        elif re.match(r'^JMA|JOINT MASTER', w, re.I) or 'JOINT MASTER' in title.upper(): kind = 'jma'
        elif 'THESIS' in title.upper(): kind = 'thesis'
        sem = int(m.group(2)) + (0.5 if m.group(1) == 'Fall' else 0)
        mods.append(dict(w=w, t=title.strip(), s=l, y=int(m.group(2)), f=m.group(1), k=kind, o=sem))
mods.sort(key=lambda x: -x['o'])

# ---------- 5. Agenda MAIA ----------
ev = json.load(open(SRC+'/maia_events.json'))
EVM = []
for e in ev:
    raw = e['raw']; t = e['title']
    m = re.search(r'\|\s*([^|]*?)\s*\|\s*\|\s*([^|]*?\d\d\.\d\d\.\d{4}[^|]*?)\s*\|\s*\|\s*' + re.escape(t[:30]), raw)
    if not m: continue
    typ, wd = m.group(1).strip(), m.group(2).strip()
    ds = re.findall(r'(\d\d)\.(\d\d)\.(\d{4})', wd)
    place = re.sub(r',?\s*\d\d\.\d\d\.\d{4}.*$', '', wd).strip(' ,')
    d0 = '%s-%s-%s' % (ds[0][2], ds[0][1], ds[0][0]); d1 = '%s-%s-%s' % (ds[-1][2], ds[-1][1], ds[-1][0])
    low = place.lower()
    city = 'Genève'
    for c, n in [('milan','Milan'),('milano','Milan'),('new york','New York'),('madrid','Madrid'),('lisbon','Lisbonne'),('paris','Paris'),('weil','Weil am Rhein'),('online','En ligne'),('zoom','En ligne'),('hyères','Hyères'),('toulon','Toulon'),('venice','Venise'),('venezia','Venise'),('seoul','Séoul'),('london','Londres'),('prague','Prague'),('basel','Bâle'),('zurich','Zurich'),('lausanne','Lausanne'),('mexico','Mexico'),('boston','Boston')]:
        if c in low: city = n; break
    EVM.append(dict(t=t, ty=typ or 'Événement', pl=place, c=city, d0=d0, d1=d1, u=e['url']))
EVM.sort(key=lambda x: x['d0'], reverse=True)

# ---------- 6. Projets (Media Explorer HEAD) ----------
D = json.load(open(ME+'/head-ai/data.json'))
norm = {r['url']: r for r in json.load(open(ME+'/pipeline/head-ai/data/projects_norm.json'))}
people = D['people']; P = D['proj']; it = D['it']
first = collections.defaultdict(list); nimg = collections.Counter()
for i, p in enumerate(it['p']):
    if it['dup'][i] != -1: continue
    nimg[p] += 1
    if len(first[p]) < 9: first[p].append(it['h'][i])
PR = []
for i, p in enumerate(P):
    n = norm.get(p['url'], {})
    PR.append(dict(t=p['t'], y=p['y'], lv=p['lv'], ty=p['ty'], src=p['src'], u=p['url'], pl=p.get('pl',''),
                   te=[people[j] for j in p['tea']], st=[people[j] for j in p['stu']], asx=[people[j] for j in p['ass']],
                   pa=[x for x in n.get('partners', []) if x], pz=n.get('prizes', []), h=first.get(i) or [], ni=nimg[i]))

# Thèmes de partenaires normalisés à la main (variantes d'écriture de la même entité)
data = dict(S=S, BA=BA, MA=MA, CAL=CAL, EV=EV, REP=REP, TEAM=TEAM, AFF=AFF, MODS=mods, EVM=EVM, PR=PR,
            CDN=D['cdn'], NIMG=sum(1 for i in range(len(it['p'])) if it['dup'][i] == -1), NIMG_ALL=len(it['p']),
            NPEOPLE=len(people), GEN='13.11.2026')
js = 'window.D=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';'
open(OUT, 'w').write(js)
print('ok', len(js)//1024, 'Ko', 'mods', len(mods), 'evm', len(EVM), 'proj', len(PR), 'imgs', data['NIMG'], data['NIMG_ALL'])
