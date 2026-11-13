import json,re
exec(open('tagger.py').read().split("c=Counter()")[0])  # loads D, P, RULES, tag()
EXTRA=[('Jonfalonier',r'jonfalonier|gonfalon'),('Fauconestrel',r'fauconestrel'),('Bouffmestre',r'bouffmestre'),('Échanchimiste',r'[ée]chanchimiste'),
 ('Orfermite',r'orfermite|hermit'),('Tisseradour',r'tisseradour|weaver'),('Monnours',r'monnours|\bbear\b'),('Verrilleur',r'verrilleur|night watchman')]
VIS={104:'Héron',105:'Chouette',106:'Renard',108:'Grenouille',109:'Chouette',110:'Loup',
 159:'Fauconestrel',160:'Bouffmestre',161:'Échanchimiste',162:'Orfermite',163:'Tisseradour',164:'Monnours',165:'Verrilleur',
 166:'Faune',167:'Sirène',168:'Aigle',169:'Sirène',170:'Dragon',171:'Harpie',172:'Centaure',173:'Dragon',174:'Centaure',175:'Centaure',
 176:'Jonfalonier',177:'Fauconestrel',178:'Bouffmestre',179:'Échanchimiste',180:'Orfermite',181:'Tisseradour',182:'Monnours',183:'Verrilleur',
 184:'Orfermite',185:'Faune',186:'Sirène'}
for k in range(113,159): VIS.setdefault(k,'Jonfalonier')
def tag2(k,i):
    if k in VIS: return VIS[k],'visuel'
    txt=(i['n']+' '+P.get(i['url'],'')).lower()
    for t,rx in EXTRA+RULES:
        if re.search(rx,txt): return t,'texte'
    if i['s'].startswith('V'): return 'Poisson et agneau','texte'
    return None,None
from collections import Counter
c=Counter()
for k,i in enumerate(D['items']):
    t,src=tag2(k,i); i['tag']=t or 'Non identifié'; c[i['tag']]+=1
    p=P.get(i['url'],'').strip()
    if p: i['p']=p
    i.pop('i',None)
for s in D['sections']:
    s['title']={'menus':'Menus mariage','panneaux':'Panneaux mariage'}[s['code']]; s['project']='Mariage'
D['sections'][1].pop('lede',None)  # texte d'introduction des Panneaux retiré à la demande de Guillaume, 13 novembre 2026
json.dump(D,open(__import__('os').environ.get('SITE_DIR',__import__('os').path.expanduser('~/ghelleu.github.io'))+'/media-explorer/data.json','w'),ensure_ascii=False,separators=(',',':'))
print(c.most_common()); print([s['title'] for s in D['sections']], D['sections'][0].get('lede','')[:80])
