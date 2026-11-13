import json,re
from collections import Counter
d=json.load(open('panel_raw.json'))
P={v['url']:(v.get('prompt') or '') for v in d['gens'].values()}
for g in json.load(open('early.json')): P[g['url']]=g.get('prompt') or ''
h=open(__import__('os').environ.get('SITE_DIR',__import__('os').path.expanduser('~/ghelleu.github.io'))+'/asset-mariage/index.html').read()
m=re.search(r'<script id="data" type="application/json">(.*?)</script>',h,re.S)
D=json.loads(m.group(1).replace('<\\/','</'))
SER={s['code']:s for s in D['series']}
RULES=[('Centaure',r'centaur|centaure|chevalier|knight'),('Faune',r'\bfaun|faune|satyr|troubadour'),('Sirène',r'mermaid|sir[eè]ne|dame du lac'),
 ('Coq',r'rooster|\bcoq\b|cockerel|wattles|h[ée]raut|herald'),('Escargot',r'snail|escargot|vigneronne'),('Caméléon',r'chameleon|cam[ée]l[ée]on|bateleur'),
 ('Harpie',r'harp(y|ie)|fauconni[eè]re|falconer'),('Femme-cerf',r'\bstag\b|\bdeer\b|antler|\bcerf\b|ch[âa]telaine|doe'),('Araignée',r'spider|araign|dentelli[eè]re|lacemaker'),
 ('Bouffon',r'bouffon|jester|harlequin'),('Salamandre',r'salamander|alchemist|alchimiste'),('Chouette',r'\bowl\b|chouette|hibou'),('Aigle',r'\beagle\b|aigle'),
 ('Pie',r'magpie'),('Crustacé',r'crustacean|lobster|\bcrab'),('Insecte',r'insect|\bmoth\b|dragonfly'),('Dragon',r'dragon'),('Licorne',r'unicorn|licorne'),
 ('Poisson et agneau',r'\bfish\b.*\blamb\b|\blamb\b.*\bfish\b|poisson|agneau'),('Loup',r'\bwolf\b|\bloup'),('Renard',r'\bfox\b|renard'),('Lion',r'\blion\b'),('Lièvre',r'\bhare\b|li[eè]vre')]
def tag(i):
    txt=(i['n']+' '+P.get(i['url'],'')).lower()
    for t,rx in RULES:
        if re.search(rx,txt): return t
    if i['s'].startswith('V'): return 'Poisson et agneau'
    return None
c=Counter(); miss=Counter()
for i in D['items']:
    t=tag(i); c[t]+=1
    if t is None: miss[i['s']]+=1
print(c.most_common()); print(miss)
un=[(k,i['url'].split('generations/')[1]) for k,i in enumerate(D['items']) if tag(i) is None]
json.dump(un,open('untagged.json','w'))
print(len(un))
