"""Reconstruit media-explorer/data.json selon la nomenclature Univers / Série / Génération.
Entrée : data.json actuel (codes P et V), données Dadaland locales, prompts complets locaux.
Sortie : data.json réécrit + restruct/mapping.json (ancien code -> nouveau code)."""
import json, re, sys, unicodedata, collections
sys.path.insert(0, '/home/claude/restruct')
from spec import SPEC, U

SITE = '/home/claude/ghelleu.github.io/media-explorer/'
SRC = json.load(open('/home/claude/restruct/data_orig.json', encoding='utf-8'))
raw_pan = json.load(open(SITE + 'pipeline/mariage/data/panel_raw.json'))
early = json.load(open(SITE + 'pipeline/mariage/data/early.json'))
GEN = {**{x['generation_id']: x for x in early}, **raw_pan['gens']}
LOCAL = json.load(open('/home/claude/restruct/local_prompts.json', encoding='utf-8'))
EXTRA = json.load(open('/home/claude/restruct/dadaland_prompts.json', encoding='utf-8')) if __import__('os').path.exists('/home/claude/restruct/dadaland_prompts.json') else {}
WF = json.load(open('/home/claude/restruct/workflows.json', encoding='utf-8'))

MODELS = {'fal-ai/nano-banana-pro': 'Nano Banana Pro', 'gpt-image-2.5-flare': 'GPT Image 2.5 Flare', 'gpt-image-2.6-flare': 'GPT Image 2.6 Flare',
          'gpt-image-2.5-sunburst': 'GPT Image 2.5 Sunburst', 'fal-ai/nano-banana-2': 'Nano Banana 2', 'gpt-image-2.6-sunburst': 'GPT Image 2.6 Sunburst',
          'fal-ai/zone-edit': 'Zone Edit', 'gemini-nanobanana-2-lite': 'Nano Banana 2 Lite', 'fal-ai/image-apps-v2/outpaint': 'Outpaint'}
MODEL_RE = re.compile(r'GPT Image 2\.[56] (?:Sunburst|Flare)|Nano Banana (?:Pro|2)')

gid_of = lambda url: re.search(r'/([0-9a-f-]{36})/output', url).group(1)
norm = lambda s: re.sub(r'\s+', ' ', s).strip()

# ---------- prompts complets locaux, rattachés par URL ----------
FULL = {}  # url -> (texte, source)
by_old = collections.defaultdict(list)
for it in SRC['items']: by_old[it['s']].append(it)
res = json.load(open('/home/claude/final/results.json'))
ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
for k, rom in enumerate(ROM):
    for j, url in enumerate(res[rom]):
        t = LOCAL.get(f'/home/claude/final/ops_all.json:{rom}#t_{j+1:02d}') or LOCAL.get(f'final/ops_all.json:{rom}#t_{j+1:02d}')
        if t: FULL[url] = t
PERSO_ROM = {'Herboriste': 'i', 'Chevalier': 'ii', 'Héraut': 'iii', 'Conteuse': 'iv', 'Dame du Lac': 'v', 'Bateleur': 'vi', 'Troubadour': 'vii', 'Châtelaine': 'viii'}
for it in by_old['P67']:
    if it.get('perso') in PERSO_ROM and it['perso'] != 'Dame du Lac':
        FULL[it['url']] = LOCAL['final2/prompts.json#' + PERSO_ROM[it['perso']]]
for it in by_old['P68']:
    if it.get('perso') in PERSO_ROM:
        FULL[it['url']] = LOCAL['final3/ops1.json#t_' + PERSO_ROM[it['perso']]]
for code, f, one in [('P71', 'final5', False), ('P73', 'final7', False), ('P76', 'final8', True), ('P77', 'final9', False), ('P78', 'final10', False), ('P79', 'final11', False)]:
    for j, it in enumerate(by_old[code]):
        FULL[it['url']] = LOCAL[f'{f}/ops.json#t_' + ('a' if one else 'abcd'[j])]
MP = 'ghelleu.github.io/media-explorer/pipeline/mariage/dadaland-menus/'
for code, f in [('V8', 'ops8.json'), ('V9', 'ops9b.json'), ('V10', 'ops10.json'), ('P32', 'ops_pan.json')]:
    for j, it in enumerate(by_old[code]):
        FULL[it['url']] = LOCAL[f'/home/claude/{MP}{f}#t_{j+1:02d}'] if f'/home/claude/{MP}{f}#t_{j+1:02d}' in LOCAL else LOCAL[f'{MP}{f}#t_{j+1:02d}']
for code, key in [('P62', 'V'), ('P63', 'VI')]:
    for j, it in enumerate(by_old[code]):
        FULL[it['url']] = LOCAL[f'final/hd.json:ops:{key}#t_{j+1:02d}']
for it in by_old['P64']:
    FULL[it['url']] = LOCAL['final/ops_all.json:VI#t_05']
# prompts Dadaland récupérés à part (url -> texte)
SCH = {}
for url, t in EXTRA.items():
    FULL[url] = t['p'] if isinstance(t, dict) else t
    if isinstance(t, dict) and 'in' in t: SCH[url] = t['in']
# menus : correspondance par le début du prompt
idx = {norm(t)[:150]: t for t in LOCAL.values()}

def model_of(it, ser_sub):
    g = GEN.get(gid_of(it['url']))
    if g and g.get('model'): return MODELS.get(g['model'], g['model'])
    m = MODEL_RE.search(ser_sub or '')
    return m.group(0) if m else None

def schema_of(text, kind):
    t = text or ''
    ins = []
    if t:
        if t.startswith('Image 1 is a blank sheet'):
            ins.append('Toile vierge 5:6')
            m = re.search(r'Images? (2(?:, \d)*(?: and \d)?) (?:is|are) the STYLE', t)
            n = len(re.findall(r'\d', m.group(1))) if m else 0
            ins.append(f'{n} références de style' if n > 1 else 'Référence de style')
            if re.search(r'Image 5 shows the CREATURE|Image 5 is', t): ins.append('Image de référence (créature)')
        elif re.match(r'(Image 1 is (?:a |the )?(?:finished|Caravaggesque|photograph)|Keep (?:the |image 1|the input)|Re-render this|Repaint image 1|Overlay task|First, remove|Use the input image|This is an overlay|Image 1 is the photograph)', t):
            ins.append('Image source')
            if re.search(r'TYPEFACE SPECIMEN|specimen', t, re.I): ins.append('Spécimen typographique')
            elif re.search(r'Image 2 is a reference|Image 2 is the reference|Image 2 is a', t): ins.append('Image de référence')
        elif re.search(r'STYLE REFERENCES|reference images|attached images|Image 1 is a poster', t, re.I):
            ins.append('Images de référence de style')
        return ins
    return {'gen': [], 'ref': ['Images de référence'], 'edit': ['Image source'], 'title': ['Image source', 'Spécimen typographique'],
            'canvas': ['Toile vierge 5:6', 'Références de style'], 'render': ['Image source'], None: []}.get(kind, [])

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')[:60]

def take(old, rng):
    L = by_old[old]
    if not rng: return L
    a, b = map(int, rng.split('-'))
    return [it for it in L if a <= int(it['num']) <= b]

old_ser = {s['code']: s for s in SRC['series']}
series, items, sec = [], [], []
MAP_S, MAP_I = {}, {}
for u, S in SPEC.items():
    sec.append({k: v for k, v in U[u].items()})
    for k, (title, sub, members, kind) in enumerate(S, 1):
        code = f'U{u}S{k}'
        o0 = old_ser[members[0][0]]
        title = title or o0['title']
        sub = sub if sub is not None else o0.get('sub', '')
        olds = [m[0] + (f" {m[1].replace('-', ' à ')}" if m[1] else '') for m in members]
        ent = {'code': code, 'u': u, 'n': k, 'title': title, 'sub': sub, 'sec': U[u]['code'], 'old': ', '.join(olds)}
        if o0.get('pin'): ent['pin'] = o0['pin']
        series.append(ent)
        g = 0
        for old, rng in members:
            if not rng: MAP_S.setdefault(old, code)
            for it in take(old, rng):
                g += 1
                gid = gid_of(it['url'])
                ge = GEN.get(gid) or {}
                new = {'s': code, 'g': g, 'code': f'{code}G{g}', 'url': it['url'], 'n': it['n'], 'ext': it['ext'], 'tag': it.get('tag', ''),
                       'old': f"{old}_{it['num']}"}
                if it.get('perso'): new['perso'] = it['perso']
                # nom : les anciennes « Direction 01 · Chevalier » prennent le nom de leur direction
                if re.match(r'^Direction \d+ · ', it['n']) and old in ('P24', 'P25', 'P26', 'P27', 'P28', 'P29'):
                    new['n'] = title + ' · ' + it['n'].split(' · ', 1)[1]
                if old == 'P27' and title == 'Proposition libre 10': new['n'] = it['n'].replace('Direction 10', 'Proposition libre 10')
                m = model_of(it, o0.get('sub', ''))
                if m: new['model'] = m
                if ge.get('created_at'): new['date'] = ge['created_at'][:10]
                wf = ge.get('workflow_id') or WF['series'].get(old)
                if wf: new['wf'] = wf
                # prompt
                full = FULL.get(it['url'])
                ex = (ge.get('prompt') or '').rstrip('…').strip()
                if not full and ex and norm(ex)[:150] in idx: full = idx[norm(ex)[:150]]
                if full: new['p'], new['pk'] = full, 'full'
                elif ex: new['p'], new['pk'] = ex, 'extrait'
                elif it.get('p'): new['p'], new['pk'] = it['p'], 'resume'
                new['sch'] = SCH.get(it['url']) or schema_of(full or ex, kind)
                MAP_I[f"{old}_{it['num']}"] = new['code']
                items.append(new)
        ent['count'] = g

# ---------- renvois vers les anciens codes dans les textes ----------
DIRS = {}  # direction de l'ancienne P24/P25 -> code série
for s in series:
    m = re.match(r'Direction (\d+) sur 14, titre monumental', s['sub'])
    if m: DIRS[int(m.group(1))] = s['code']
def recode(t):
    if not t: return t
    t = re.sub(r'P25 Direction (\d+)', lambda m: DIRS.get(int(m.group(1)), m.group(0)), t)
    t = re.sub(r'P25-D(\d+)', lambda m: DIRS.get(int(m.group(1)), m.group(0)), t)
    t = re.sub(r'P25-01/02/03', DIRS[1], t)
    t = re.sub(r'\b([PV]\d{1,2})[_ ](\d{2})\b', lambda m: MAP_I.get(f'{m.group(1)}_{m.group(2)}', m.group(0)), t)
    t = re.sub(r'\b([PV]\d{1,2})\b', lambda m: MAP_S.get(m.group(1), m.group(0)), t)
    return t
for s in series:
    s['title'], s['sub'] = recode(s['title']), recode(s['sub'])
for it in items:
    it['n'] = recode(it['n'])
    if it.get('pk') == 'resume': it['p'] = recode(it['p'])
    it['file'] = f"{it['code']}_{slug(it['n'])}"

out = {'series': series, 'items': items, 'sections': sec, 'workflows': WF['names']}
open(SITE + 'data.json', 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n')
json.dump({'series': MAP_S, 'items': MAP_I}, open('/home/claude/restruct/mapping.json', 'w'), ensure_ascii=False, indent=0)
c = collections.Counter(it.get('pk', 'aucun') for it in items)
print(len(series), 'séries', len(items), 'images', dict(c))
print(collections.Counter(s['sec'] for s in series))
left = [t for s in series for t in re.findall(r'\b[PV]\d{1,2}\b', s['title'] + ' ' + s['sub'])]
print('renvois non convertis :', collections.Counter(left))
