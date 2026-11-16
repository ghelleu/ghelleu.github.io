"""Dossier V2 : exercice de la 2e étape, poste réf. 566. Rend dossier_v2.html, puis PDF par Chrome."""
import json, re, datetime

REFS = {
 'ba': ("HEAD – Genève, page « Bachelor Architecture d'intérieur »", 'hesge.ch/head/formations/bachelors/bachelor-architecture-dinterieur'),
 'ma': ("HEAD – Genève, page « Master Architecture d'intérieur »", 'hesge.ch/head/formations/masters/master-architecture-dinterieur'),
 'peba': ("Plan d'études Bachelor en Architecture d'intérieur 2026-2027", 'hesge.ch/sites/head/files/2026-09/PE-BAAI_2026-2027.pdf'),
 'pema': ("Plan d'études du Master of Arts HES-SO en Architecture d'intérieur 2026-2027", 'hesge.ch/sites/head/files/2026-09/PE_MAIA_2026-2027.pdf'),
 'cal': ("Calendrier académique 2026-2027 de la HEAD – Genève", 'hesge.ch/sites/head/files/2026-10/CalendrierAcademique_2026-2027_Sept26.pdf'),
 'dba': ("Descriptifs de modules Bachelor 2026-2027, dont 15AP Atelier et projets 5", 'hesge.ch/sites/head/files/2026-10/Bachelor_en_Architecture_dinterieur_descriptifs_modules.zip'),
 'dma': ("Descriptifs de modules MAIA 2026-2027", 'hesge.ch/sites/head/files/2026-10/Master_en_Architecture_dinterieur_descriptifs_modules.zip'),
 'maia': ("head-maia.ch, pages About, Modules et Agenda", 'head-maia.ch'),
 'regba': ("Règlement d'études des filières Bachelor Design et Arts visuels de la HEAD – Genève, 28.07.2021, art. 11, 27, 35 et 36", 'hesge.ch/head/vie-etudiante/informations-pratiques/reglements-et-directives'),
 'regma': ("Règlement de filière du Master of Arts HES-SO en Architecture d'intérieur, 02.06.2020, art. 4, 11 et 13", 'hesge.ch/head/vie-etudiante/informations-pratiques/reglements-et-directives'),
 'mob': ("HEAD – Genève, pages « Partir en échange à l'étranger » et « Venir en échange à la HEAD »", 'hesge.ch/head/ecole/international/mobilite'),
 'reghes': ("Règlement relatif à la formation de base Bachelor et Master HES-SO, 02.06.2020, art. 16", 'hesge.ch/head/vie-etudiante/informations-pratiques/reglements-et-directives'),
 'adm': ("HEAD – Genève, admissions Bachelor et Master : calendriers et processus de sélection", 'hesge.ch/head/admissions'),
 'mx': ("Media Explorer HEAD, relevé des pages publiques de hesge.ch et head-maia.ch du 12.11.2026", 'guillaumehelleu.com/media-explorer/head-ai'),
}
order = []
def R(*keys):
    out = []
    for k in keys:
        if k not in order: order.append(k)
        out.append(str(order.index(k) + 1))
    return '<sup>' + ','.join(sorted(out, key=int)) + '</sup>'

def refs(s):
    return re.sub(r'\[\[([a-z,]+)\]\]', lambda m: R(*m.group(1).split(',')), s)

# ---------- données pour les graphiques ----------
raw = open('/home/claude/ghelleu.github.io/adjoint-ai/data.js').read()
D = json.loads(raw[raw.index('=') + 1:-1])
d0 = datetime.date.fromisoformat(D['CAL'][0][0])
wi = lambda s: (datetime.date.fromisoformat(s) - d0).days // 7
W = len(D['CAL'])
load = [0] * W
for i, c in enumerate(D['CAL']):
    if c[3] == 'jury': load[i] += 4
    if c[3] == 'rem': load[i] += 1
for e in D['EV']:
    if not e[4]: continue
    for i in range(max(0, wi(e[0])), min(W - 1, wi(e[1])) + 1): load[i] += e[4]

def year_svg():
    cw, lx, H, bh = 9.4, 0, 120, 52
    Wd = W * cw
    F = {'inau': 'url(#h)', 'hc': 'url(#h)', 'sdtlp': 'url(#h)', 'cours': '#fff', 'jury': '#121212', 'rem': '#9a978e'}
    s = [f'<svg viewBox="0 0 {Wd+2} {H}" width="100%" font-family="Archivo" font-size="6.2"><defs><pattern id="h" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="#fff"/><line x1="0" y1="0" x2="0" y2="3" stroke="#121212" stroke-width=".9"/></pattern></defs>']
    MO = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC']
    pm = -1; mx = max(load)
    for i, c in enumerate(D['CAL']):
        dt = datetime.date.fromisoformat(c[0]); x = i * cw
        if dt.month - 1 != pm:
            pm = dt.month - 1
            s.append(f'<text x="{x+1}" y="7" font-weight="600" letter-spacing=".4">{MO[pm]}</text><line x1="{x}" x2="{x}" y1="0" y2="{H-14}" stroke="#121212" stroke-opacity=".15" stroke-width=".5"/>')
        if c[3] in F: s.append(f'<rect x="{x+.6}" y="11" width="{cw-1.2}" height="8" fill="{F[c[3]]}" stroke="#121212" stroke-opacity=".45" stroke-width=".3"/>')
        else: s.append(f'<line x1="{x+.6}" x2="{x+cw-.6}" y1="15" y2="15" stroke="#121212" stroke-opacity=".25" stroke-width=".4"/>')
        h = load[i] / mx * bh
        if h: s.append(f'<rect x="{x+1.4}" y="{24+bh-h}" width="{cw-2.8}" height="{h}" fill="{"#e6483a" if load[i]>=7 else "#121212"}"/>')
    s.append(f'<line x1="0" x2="{Wd}" y1="{24+bh}" y2="{24+bh}" stroke="#121212" stroke-width=".6"/>')
    for d, lb in (('2027-01-18', 'Jurys, résultats, portes ouvertes'), ('2027-06-21', 'Jurys et résultats de juin')):
        x = wi(d) * cw + cw / 2
        s.append(f'<line x1="{x}" x2="{x}" y1="{24+bh+2}" y2="{24+bh+10}" stroke="#e6483a" stroke-width=".6"/><text x="{x+2}" y="{24+bh+12}" fill="#e6483a" font-weight="600">{lb}</text>')
    xa, xb = wi('2027-03-08') * cw + 1, (wi('2027-05-10') + 1) * cw - 1
    s.append(f'<path d="M{xa} {24+bh+16}v4H{xb}v-4" fill="none" stroke="#121212" stroke-width=".6"/><text x="{xa}" y="{24+bh+28}" font-weight="600">Concours Bachelor et Master, deux tours</text>')
    s.append('</svg>')
    return ''.join(s)

def gantt_svg():
    ph = [('Cadrage', -13, -11), ('Engagements', -11, -8), ('Conception', -8, -4), ('Préparation', -4, -1), ('Workshop', 0, 1), ('Après', 2, 3)]
    cw, lx = 26, 70; wks = list(range(-13, 4)); Wd = lx + len(wks) * cw; H = 14 + len(ph) * 13 + 4
    s = [f'<svg viewBox="0 0 {Wd} {H}" width="100%" font-family="Archivo" font-size="7">']
    for j, w in enumerate(wks):
        x = lx + j * cw
        s.append(f'<text x="{x+cw/2}" y="8" text-anchor="middle" fill="{"#e6483a" if w in (0,1) else "#8b887f"}" font-weight="600">{"S"+str(w) if w<0 else "S"+("+" if w>0 else "")+str(w)}</text><line x1="{x}" x2="{x}" y1="11" y2="{H}" stroke="#121212" stroke-opacity=".1" stroke-width=".5"/>')
    for k, (n, a, b) in enumerate(ph):
        y = 14 + k * 13
        x = lx + (a + 13) * cw; w = (b - a + 1) * cw
        s.append(f'<text x="0" y="{y+7.5}" font-weight="600">{n}</text><rect x="{x+1}" y="{y+1}" width="{w-2}" height="8" fill="{"#e6483a" if n=="Workshop" else "#121212"}"/>')
    s.append(f'<text x="{lx+15*cw-1}" y="{14+4*13+7.5}" text-anchor="end" fill="#fff" font-weight="600" font-size="6">exposition</text>')
    s.append('</svg>')
    return ''.join(s)

# ---------- contenu ----------
URL = 'guillaumehelleu.com/adjoint-ai'
TOOLS = [('Version détaillée et interactive', URL, 'Chaque analyse avec ses données, ses sources et ses filtres.'),
         ('Outil 1 · Media Explorer', 'guillaumehelleu.com/media-explorer/head-ai', 'Les 5 734 images publiées par la filière depuis 2011, interrogeables par année, par projet et par ressemblance.'),
         ('Outil 2 · Tableau de bord de pilotage', URL + '/pilotage', 'L\'interface proposée en action A, en fonctionnement, alimentée par des données fictives.')]

def tbl(head, rows, cls=''):
    h = f'<table class="{cls}"><thead><tr>' + ''.join(f'<th>{x}</th>' for x in head) + '</tr></thead><tbody>'
    for r in rows:
        h += '<tr>' + ''.join((f'<td colspan="2">{c[1:]}</td>' if c.startswith('§') else f'<td>{c}</td>') for c in r) + '</tr>'
    return h + '</tbody></table>'

body = []
A = body.append
A(refs(f'''<header class="band"><div class="bt"><p class="lab">Adjoint au responsable du département Architecture d'intérieur · HEAD – Genève · réf. 566</p>
<h1>Architecture d'intérieur<br><span>exercice de la 2e étape</span></h1><p class="by">Guillaume Helleu · 16 novembre 2026</p></div>
<img src="field.png" alt=""><p class="cap">Les images publiées par la filière sur les sites de la HEAD et de head-maia.ch, de 2011 à 2026, une colonne par année.[[mx]]</p></header>'''))
A(f'''<p class="lede">Ce document répond aux deux questions de l'exercice, dans l'ordre de l'énoncé. Il est complété par sa version détaillée et interactive en ligne, et par deux outils opérationnels qui prouvent et illustrent les propositions de la question 1. Les faits relatifs aux formations proviennent des pages publiques de la HEAD – Genève et de head-maia.ch, des plans d'études et descriptifs de modules 2026-2027, du calendrier académique et des règlements, consultés le 13 novembre 2026. Les appels numérotés renvoient aux références en annexe.</p>
<div class="tools">''' + ''.join(f'<div><p class="lab">{t[0]}</p><a href="https://{t[1]}">{t[1]}</a><p>{t[2]}</p></div>' for t in TOOLS) + '</div>')

A('''<section class="q q1"><div class="qh"><span>1</span><h2>Analyse d'un cursus<br><em>et enjeux pédagogiques</em></h2></div>
<p class="intro">Le département porte deux formations qui se suivent et se répondent. Le Bachelor forme en trois ans au métier d'architecte d'intérieur par le projet, la construction et la représentation. Le Master, enseigné en anglais sous l'intitulé <i>Interior Ecologies</i>, prolonge cette formation vers la recherche et l'expérimentation, avec des partenaires extérieurs à l'école. La lecture qui suit part des plans d'études et des règlements pour identifier ce que ces parcours demandent concrètement à l'équipe qui les organise.</p>''')

A('<h3><b>1.1</b> L\'organisation des études</h3>')
A(refs('<p>Les deux formations partagent le rythme de l\'école. Chaque semestre s\'ouvre sur une semaine de workshop, la Semaine inaugurale à l\'automne et la Semaine de tous les possibles au printemps, alterne cours et semaines « hors cadre », puis se referme sur une semaine de jurys suivie des remédiations.[[cal]] Elles partagent aussi une même équipe : un responsable, une adjointe et un secrétariat communs, et des assistants qui interviennent dans les deux programmes.[[ba,ma]]</p>'))
A(refs(tbl(['', 'Bachelor', 'Master MAIA'], [
 ['Titre et durée', 'Bachelor of Arts HES-SO, trois ans, 180 ECTS, enseigné en français[[ba]]', 'Master of Arts HES-SO, deux ans, 120 ECTS, enseigné en anglais[[ma,maia]]'],
 ['Progression', '1<sup class="o">re</sup> année : fondamentaux du projet, de la construction et de la représentation 2D et 3D, histoire de la discipline. 2<sup class="o">e</sup> année : BIM, technologies et matériaux, design d\'objets, énergie du bâtiment (éclairage, chauffage, ventilation). 3<sup class="o">e</sup> année : réalités professionnelles, circularité, acoustique, puis diplôme.[[peba]]', 'MAIA 1 <i>Glossaries</i> : le corps, l\'animal et le végétal dans l\'intérieur. MAIA 2 <i>Assemblages</i> : numérique et circularité. MAIA 3 <i>Investigations</i> : pratiques curatoriales et mémoire écrit. MAIA 4 <i>Diploma</i>.[[pema,maia]]'],
 ['Colonne vertébrale', 'Un atelier de projet chaque semestre jusqu\'au S5, un workshop chaque semestre, des modules transversaux partagés avec les autres filières en 2<sup class="o">e</sup> et 3<sup class="o">e</sup> année.[[peba]]', 'Un atelier de conception de MAIA 1 à MAIA 3, une formation à la recherche commune avec le Master HES-SO en design, les séminaires du Joint Master of Architecture (Genève, Fribourg, Berthoud), des workshops avec l\'École Camondo.[[pema]]'],
 ['Fin d\'études', 'Bachelor Thesis au S6, mémoire et projet, avec des modules de gestion durable, d\'économie de projet et de connaissance des métiers.[[peba]]', 'Master Thesis en MAIA 4, avec un volet théorique et un volet pratique.[[pema]]'],
], 'k3')))

A('<h3><b>1.2</b> Les moments clés du parcours</h3>')
A('<p>Le parcours se lit dans ses temps forts plus que dans ses modules. Pour l\'équipe, chacun de ces moments est aussi un temps de coordination : un jury à composer ou une exposition à produire.</p>')
A(refs(tbl(['', 'Bachelor', 'Master MAIA'], [
 ['Ateliers', 'Un atelier de projet par semestre, de S1 à S5 (par exemple Intérieur vivant, Nested Spaces, Food Futures). En S5, un stage approuvé avant le semestre par le responsable de filière peut remplacer l\'atelier.[[ba,dba]]', 'Des studios confiés à des enseignants et à des agences invitées (automne 2026 : Studio Ossidiana ; Simon Husslein et Aida Navarro Redón).[[maia]]'],
 ['Projets', 'Mandats réels avec des entreprises, des institutions culturelles et des associations.[[ba]]', 'Projets avec des institutions et des industriels ; recherches Scènes de Nuit, Forced Reuse et The Future of Humanitarian Design.[[ma]]'],
 ['Workshops', 'Semaine inaugurale chaque automne (14-18.09.2026), Semaine de tous les possibles ou autre workshop chaque printemps (22-26.02.2027).[[peba,cal]]', 'Workshop HEAD – Camondo en MAIA 1 et 3 ; Semaine de tous les possibles et workshop avec le MA Design Installation en MAIA 2.[[pema,maia]]'],
 ['Jurys', 'Deux semaines de jurys par an (18-22.01 et 14-23.06.2027). La Bachelor Thesis se soutient devant cinq jurés, dont trois externes, validés par la direction.[[cal,regba]]', 'Mêmes semaines de jurys. La Master Thesis se soutient devant au moins deux jurés de la filière et trois jurés extérieurs, après validation des trois premiers semestres.[[regma]]'],
 ['Mobilité', '§Un ou deux semestres d\'échange après une année validée, sur <i>learning agreement</i> ; vœux pour l\'automne 2027 du 15 au 30 novembre 2026. L\'école accueille une cinquantaine d\'étudiants en échange chaque année.[[mob,reghes]] Le MAIA y ajoute ses échanges réguliers avec le JMA et l\'École Camondo.[[ma]]'],
 ['Diplôme et visibilité', 'Fête des diplômes le 7 juillet 2027.[[cal]]', 'En 2026 : exposition des thèses le 19 février, Milan Design Week du 20 au 26 avril, exposition des diplômes du 5 au 8 juin.[[maia]]'],
 ['Admission', 'Concours en deux tours : dossiers du 9 au 15 mars, entretiens du 12 au 16 avril 2027.[[cal,adm]]', 'Concours en deux tours : dossiers du 30 mars au 7 avril, entretiens du 28 avril au 7 mai 2027.[[cal,adm]]'],
], 'k3')))

A('<h3><b>1.3</b> Les enjeux organisationnels et administratifs</h3>')
A('<p>Lus depuis le poste d\'adjoint, ces parcours posent des questions d\'organisation plus que de contenu. Elles tiennent à quelques semaines très denses, au nombre de personnes à coordonner et aux partenaires dont dépend le Master. Le graphique additionne, semaine par semaine, les échéances publiées de l\'année 2026-2027.</p>')
A(f'<figure class="fig">{year_svg()}<figcaption>Calendrier 2026-2027 : cases blanches, cours ; hachures, semaines de workshop et « hors cadre » ; noir, jurys ; gris, remédiations ; trait, semaines sans cours et fermetures des bâtiments. Barres : indice de charge, pondéré par échéance (jurys 4, tours de concours et délais de résultats 3, autres 1 ou 2). En rouge, les deux semaines les plus chargées.' + R('cal', 'adm', 'mob') + '</figcaption></figure>')
A(refs('''<ul class="pts">
<li><b>Les jurys concentrent la charge.</b> Les deux semaines les plus chargées de l'année sont celles des jurys de janvier (18-22.01), close par le délai des résultats et les portes ouvertes du 23, et de la fin des jurys de juin (21-23.06), avec le délai des résultats du semestre. Entre les deux, les deux tours des concours Bachelor et Master occupent la plupart des semaines de mars à mai. La même équipe porte ces échéances pour les deux formations, et chaque jury de thèse mobilise au moins trois externes à inviter, engager et défrayer.[[cal,adm,regba,regma]]</li>
<li><b>Les intervenants sont nombreux.</b> Les pages des deux formations publient douze enseignants et quinze intervenants pour le Bachelor, cinq enseignants, huit intervenants et un studio pour le Master : plus de trente personnes distinctes, auxquelles s'ajoutent chaque année les jurés externes et les studios invités du MAIA.[[ba,ma,maia]]</li>
<li><b>Les parcours individuels se suivent dossier par dossier, surtout au Bachelor.</b> Un stage en S5 s'approuve avant le semestre ; un départ en mobilité se prépare huit à dix mois à l'avance ; une équivalence se demande dans les trois semaines qui suivent l'entrée. Un étudiant qui échoue deux fois au même module obligatoire est exclu de la filière : les situations fragiles doivent être repérées tôt.[[dba,mob,regba]]</li>
<li><b>Le MAIA dépend d'autres institutions.</b> Séminaires du JMA, formation à la recherche du Master HES-SO, workshops avec l'École Camondo : son calendrier se construit avec des partenaires qui ont le leur.[[pema]]</li>
<li><b>Le rayonnement se produit.</b> L'agenda du MAIA publie plus de cent événements depuis 2018, de Genève à Milan, Lisbonne ou New York. Expositions, conférences et mandats réels impliquent conventions, budgets, transport, assurances et documentation.[[maia]]</li>
</ul>'''))

A('<h3><b>1.4</b> Trois actions concrètes</h3>')
A('<p>Les actions proposées se construisent l\'une sur l\'autre. La première pose un outil commun ; les deux suivantes s\'y branchent et le nourrissent.</p>')
A(refs(tbl(['Action', 'Contenu', 'Effet attendu'], [
 ['<b>A</b> Une interface de pilotage commune', 'Une interface numérique unique, qui centralise toutes les échéances des deux formations : calendrier de l\'école, jurys et jurés, concours, mobilité, JMA, Camondo, expositions, engagements. Chaque échéance porte un responsable et une date de déclenchement (l\'invitation des jurés externes, par exemple, huit semaines avant). L\'interface s\'adapte à son public : l\'équipe y pilote, les enseignants y trouvent leurs jurys et leurs délais, les étudiants leurs démarches, les services ce qui les concerne. Le suivi des dossiers individuels (stage, mobilité, équivalence, échec) y devient une vue réservée à l\'équipe. Il ne s\'agit pas d\'un calendrier papier ou d\'un agenda Outlook partagé.', 'La charge devient visible avant les semaines denses et se répartit ; chacun trouve ses échéances sans avoir à les demander.'],
 ['<b>B</b> Un circuit standardisé des jurys et des intervenants externes', 'Une base des jurés et des intervenants (coordonnées, expertise, participations passées) et un circuit unique, de l\'invitation au paiement : invitation, contrat, accès, grille d\'évaluation, défraiement. Les modèles sont prêts avant chaque session et chaque étape se suit dans l\'interface A.', 'Des jurys complets, des contrats signés à temps, des intervenants payés sans relance ; un réseau de jurés qui s\'enrichit d\'une année à l\'autre.'],
 ['<b>C</b> Une mémoire du département', 'Les projets, jurys, partenaires, intervenants et images de la filière, réunis dans une base alimentée à chaque fin de semestre. L\'enjeu est double : structurer la matière première pour la rendre pilotable et exploitable, puis l\'analyser. Media Explorer en donne l\'exemple avec les 5 734 images publiées par la filière depuis 2011.[[mx]]', 'Une matière disponible pour la communication, les admissions, les rapports et la recherche ; une lecture fine de l\'évolution de la production.'],
], 'act')))
A('''<div class="prio"><p class="lab">Priorité à ressources limitées</p><p><b>L'action A.</b> Elle se met en place sans recrutement et repose sur une discipline de mise à jour. Elle agit sur les deux formations à la fois, alors que la même équipe les porte. Elle réduit les incidents les plus coûteux pour les étudiants : un juré qui manque, une note remise hors délai. Les actions B et C s'y branchent. Une première version peut fonctionner avant les jurys du 18 janvier 2027 ; le tableau de bord en ligne en montre le principe avec des données fictives.</p></div></section>''')

A('''<section class="q"><div class="qh"><span>2</span><h2>Cas pratique<br><em>un workshop international de deux semaines</em></h2></div>
<p class="intro">Le cas se lit comme un projet de trois mois dont la partie visible ne dure que deux semaines. L'essentiel du travail précède le workshop : réunir deux écoles partenaires, huit enseignants et intervenants et soixante-quinze étudiants autour d'un programme commun, puis d'une exposition ouverte au public. Dans ce dispositif, l'adjoint tient le calendrier et sert de point d'entrée unique ; le responsable de département garde les décisions. Pour la lecture, S0 désigne la première semaine du workshop ; l'exposition ouvre à la fin de la deuxième semaine (S+1).</p>''')
A('<h3><b>2.1</b> Planification</h3>')
A(refs('<p>Quatre phases préparent le workshop, chacune fermée par des livrables précis. Les dates se choisissent hors des jurys, des concours d\'admission et des fermetures de bâtiments du calendrier académique.[[cal]]</p>'))
A(f'<figure class="fig g">{gantt_svg()}</figure>')
A(tbl(['Semaines', 'Étape', 'Livrables et décisions'], [
 ['S-13 à S-11', '<b>Cadrage</b>', 'Note de cadrage validée par le responsable : objectifs pédagogiques, dates vérifiées sur les calendriers de la HEAD et des deux écoles, effectifs, plafond budgétaire, lieu d\'exposition. Accord de principe des écoles partenaires.'],
 ['S-11 à S-8', '<b>Engagements</b>', 'Conventions avec les écoles (sélection des 15 étudiants, encadrants, prise en charge des frais, assurances, reconnaissance des crédits). Dossiers d\'engagement des intervenants transmis aux RH. Salles, ateliers techniques et lieu d\'exposition réservés. Hébergement des invités. Budget détaillé validé.'],
 ['S-8 à S-4', '<b>Conception</b>', 'Programme jour par jour, groupes mixtes constitués, critères d\'évaluation écrits. Commandes de matériel. Communication : annonce publique à S-6, visuel, agenda, invitations. Besoins techniques de l\'exposition arrêtés.'],
 ['S-4 à S-1', '<b>Préparation</b>', 'Kit d\'accueil bilingue, planning des ateliers, plan de montage et de sécurité de l\'exposition, relances presse, point budgétaire, revue finale de la liste de contrôle.'],
 ['S0 et S+1', '<b>Workshop</b>', 'Accueil le premier jour, point quotidien de 15 minutes avec l\'équipe, montage de l\'exposition pendant la deuxième semaine, vernissage, captation.'],
 ['S+2 et S+3', '<b>Après le workshop</b>', 'Démontage, notes saisies, paiements et défraiements, bilan auprès des étudiants, des enseignants et des partenaires, archivage de la documentation.'],
], 'k3n'))

A('<h3><b>2.2</b> Coordination</h3>')
A('<p>Chaque acteur a un rôle et un seul interlocuteur côté département. Les services n\'ont pas à reconstituer le projet : l\'adjoint leur transmet ce qui les concerne, au moment où ils en ont besoin.</p>')
A(tbl(['Acteur', 'Rôle'], [
 ['<b>Responsable de département</b>', 'Fixe les objectifs et l\'enveloppe budgétaire, valide le programme, l\'équipe et les arbitrages, représente le département auprès des écoles partenaires et de la direction.'],
 ['<b>Adjoint</b>', 'Tient le calendrier et le tableau de suivi, sert de point d\'entrée unique pour les services et les partenaires, prépare conventions et engagements, suit le budget, anime le point hebdomadaire, rédige le bilan.'],
 ['<b>Équipe pédagogique (8)</b>', 'Conçoit le programme et les sujets, encadre un groupe chacun, applique les critères d\'évaluation, transmet les notes et ses besoins matériels.'],
 ['<b>Étudiants (60 + 15)</b>', 'Travaillent en groupes mixtes, produisent et montent l\'exposition ; deux délégués relaient les besoins. Les invités accomplissent leurs formalités d\'accueil.'],
 ['<b>Partenaires académiques</b>', 'Sélectionnent leurs étudiants, désignent un encadrant accompagnant, signent la convention, transmettent leurs listes, reconnaissent les crédits.'],
 ['<b>Service communication</b>', 'Visuel, agenda du site, réseaux, relations presse, invitations au vernissage, captation et documentation.'],
 ['<b>Service financier</b>', 'Ouvre la ligne budgétaire, valide les engagements de dépenses, traite commandes, paiements et défraiements, refacture ce que prévoient les conventions.'],
 ['<b>Service RH</b>', 'Établit les contrats des intervenants externes, réunit les pièces administratives, traite les cas des intervenants résidant à l\'étranger.'],
 ['<b>Autres</b>', 'Relations internationales (accueil des étudiants invités), bureau des études (inscriptions, notes), ateliers et pôles techniques (créneaux, encadrement, sécurité des machines), services techniques et bâtiments (salles, exposition, sécurité), prestataires (transport, hébergement, matériaux, vernissage).'],
], 'k2'))

A('<h3><b>2.3</b> Gestion des risques</h3>')
A('<p>Les risques retenus sont ceux qui menacent l\'ouverture de l\'exposition ou l\'accueil des invités. Chacun reçoit une mesure et un moment.</p>')
A(refs(tbl(['Risque', 'Mesure d\'anticipation ou de réduction'], [
 ['Collision avec les jurys, les concours ou le calendrier d\'une école partenaire', 'Dates vérifiées à S-13 sur les trois calendriers, gelées dès la validation.'],
 ['Intervenant sans contrat le premier jour', 'Dossiers RH lancés dès S-11, liste des pièces envoyée à chaque intervenant.'],
 ['Hébergement des 15 invités', 'L\'école ne propose pas de logement sur le campus et le marché genevois est tendu[[mob]] : réservation groupée dès S-10, prise en charge fixée dans la convention.'],
 ['Désistement d\'un enseignant ou d\'un intervenant', 'Encadrement en binôme, remplaçant identifié, programme documenté jour par jour.'],
 ['Dépassement budgétaire', 'Budget par poste avec une réserve, engagements validés par une seule personne, suivi hebdomadaire de l\'engagé et du payé.'],
 ['Exposition non prête ou non conforme pour le public', 'Plan d\'exposition arrêté à S-4, contrôle de sécurité avec les services techniques, contenus gelés deux jours avant l\'ouverture.'],
 ['Groupes hétérogènes : langue, niveau, culture d\'école', 'Langue de travail inscrite dans la convention, groupes mixtes constitués à l\'avance, critères communiqués le premier jour.'],
], 'r2')))

A('<h3 style="page-break-before:always;margin-top:0"><b>2.4</b> Outil de pilotage</h3>')
A(f'<p>Un tableau partagé, une ligne par tâche et un responsable par ligne, revu chaque semaine en trente minutes avec le responsable de département. Une ligne passe en alerte quand son échéance tombe dans les sept jours sans qu\'elle soit terminée. Un second onglet suit le budget poste par poste : prévu, engagé, payé. L\'extrait ci-dessous montre l\'état à S-8 ; la version en ligne le fait fonctionner, avec un curseur qui fait avancer le temps et recalcule les alertes.</p>')
st = lambda c, t: f'<span class="st {c}">{t}</span>'
A(tbl(['Lot', 'Tâche', 'Responsable', 'Échéance', 'Dépend de', 'Statut'], [
 ['Cadrage', 'Note de cadrage validée', 'Responsable', 'S-11', '·', st('ok', 'Fait')],
 ['Partenaires', 'Conventions signées par les deux écoles', 'Adjoint', 'S-8', 'Cadrage', st('al', 'Alerte')],
 ['RH', 'Contrats des 5 intervenants externes', 'Adjoint et RH', 'S-6', 'Programme', st('go', 'En cours')],
 ['Logistique', 'Hébergement des 15 invités confirmé', 'Adjoint', 'S-6', 'Conventions', st('go', 'En cours')],
 ['Pédagogie', 'Programme jour par jour et critères', 'Équipe', 'S-5', 'Cadrage', st('go', 'En cours')],
 ['Communication', 'Annonce publique et visuel', 'Communication', 'S-6', 'Programme', st('no', 'Non démarré')],
 ['Exposition', 'Plan d\'exposition et sécurité', 'Services techniques', 'S-4', 'Lieu réservé', st('no', 'Non démarré')],
], 'trk'))

A('<h3><b>2.5</b> Arbitrage budgétaire</h3>')
A('<p>Les demandes sont chiffrées, puis examinées dans un ordre fixe. La proposition d\'arbitrage est soumise au responsable de département, qui décide ; chaque demandeur reçoit une réponse motivée, et une réserve reste disponible jusqu\'à S-2. La grille est testable en ligne, critère par critère.</p>')
A('''<ol class="crit">
<li><b>Les obligations</b>Sécurité, assurances, accessibilité de l'exposition et engagements déjà signés ne s'arbitrent pas.</li>
<li><b>Le lien avec les apprentissages évalués</b>Une dépense qui sert directement les objectifs du workshop passe avant une dépense de confort ou d'image.</li>
<li><b>Le nombre d'étudiants concernés</b>À coût égal, la demande qui profite au plus grand nombre est retenue.</li>
<li><b>La réciprocité due aux partenaires</b>L'accueil offert doit être comparable à celui qu'ils réservent à nos étudiants.</li>
<li><b>La durée de vie de la dépense</b>Matériel réutilisable et documentation utile au département sont préférés.</li>
<li><b>L'existence d'une alternative</b>Ateliers internes, prêt, matériaux de réemploi ou cofinancement d'un partenaire avant tout achat.</li>
</ol></section>''')

# annexe
ann = '<section class="annex"><p class="lab">Annexe</p><h2 class="ah">Références</h2><ol class="refs">'
for k in order:
    t, u = REFS[k]
    ann += f'<li>{t}. <a href="https://{u}">{u}</a></li>'
ann += '</ol><p class="note">Pages et documents consultés le 13 novembre 2026. Le relevé Media Explorer réunit les fiches de projets publiées pour le Bachelor et le Master en architecture d\'intérieur sur hesge.ch, et les projets et actualités de head-maia.ch.</p></section>'

band = body.pop(0)
html = open('/home/claude/dossier/v2_shell.html').read().replace('{{BODY}}', '\n'.join(body) + ann)
open('/home/claude/dossier/dossier_v2.html', 'w').write(html)
cov = open('/home/claude/dossier/cover_shell.html').read().replace('{{BAND}}', band)
open('/home/claude/dossier/cover_v2.html', 'w').write(cov)
print('ok', len(order), 'refs')
