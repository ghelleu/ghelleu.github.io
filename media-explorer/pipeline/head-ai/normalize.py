import json,re,unicodedata,collections
def clean_names(vals):
    out=[]
    for v in vals or []:
        v=re.sub(r'\((?:HEAD|[^)]{0,40})\)','',v)
        for n in re.split(r'\s*,\s*|\s+et\s+|\s*&\s*|\s*/\s*',v):
            n=re.sub(r'\s+',' ',n).strip(' .;–-')
            if not n or n.lower() in ('et al','et al.','al'): continue
            if len(n.split())>5 or len(n)<4: continue
            out.append(n)
    seen=[];[seen.append(x) for x in out if x not in seen];return seen
def key(n): return unicodedata.normalize('NFKD',n).encode('ascii','ignore').decode().lower().replace('-',' ').strip()
TYPEMAP={'Diplôme':'Diplôme','Semestre':'Semestre','Workshop':'Workshop','Partenariats et mandats':'Partenariat','Recherche':'Recherche'}
P=[];
for p in json.load(open('head_projects.json')):
    m=p.get('meta',{})
    form=' '.join(m.get('Formation',[]))
    level='MA' if 'Master architecture' in form and 'Bachelor architecture' not in form else ('BA' if 'Bachelor architecture' in form and 'Master architecture' not in form else 'BA+MA')
    typ=next((TYPEMAP[t] for t in m.get('Type de projet',[]) if t in TYPEMAP),'Autre')
    yr=(m.get('Année') or [p['year']])[0];y=re.findall(r'(20\d\d|19\d\d)',yr)
    teachers=clean_names(m.get('Encadrement',[])+m.get('Tuteur·ice·x·s',[]))
    assistants=clean_names(m.get('Assistant·e·x·s',[]))
    students=clean_names(m.get('Étudiant·e·x·s',[]))
    sub=clean_names([p['subtitle']])
    if not students and typ=='Diplôme': students=[s for s in sub if s not in teachers]
    elif not teachers and typ!='Diplôme' and sub and not students: teachers=sub
    P.append({'id':'hesge:'+p['href'].rsplit('/',1)[-1],'src':'HEAD','url':'https://head.hesge.ch'+p['href'],'title':p['title'],'year':int(y[0]) if y else None,'yearLabel':yr,
      'level':level,'type':typ,'formations':m.get('Formation',[]),'students':students,'teachers':teachers,'assistants':assistants,
      'others':clean_names(m.get('Autres personnes',[])),'partners':m.get('Partenaires',[]),'prizes':m.get('Prix et distinctions',[]),'place':'',
      'desc':p.get('desc',''),'figs':p.get('figs',[])})
MT={'Studio':'Semestre','Course':'Cours','Workshop':'Workshop','Exhibition':'Exposition','Thesis':'Diplôme','Project':'Projet','Symposium':'Symposium','Future':'Recherche'}
import html as _h
for p in json.load(open('maia_projects.json')):
    h=open(f"maia/{p['slug']}.html").read()
    tt=_h.unescape(re.search(r'<title>(.*?)</title>',h,re.S).group(1)).rsplit(' - MAIA',1)[0].strip()
    t=p['text'];typ=MT.get(t.split(' ')[0],'Projet')
    i=t.upper().find(tt.upper()[:25]);rest=t[i+len(tt):].strip() if i>=0 else t
    m=re.match(r'([^.,0-9]{2,40}?)[.,]\s*(.{0,40}?)(20\d\d)',rest)
    place=m.group(1).strip() if m else '';yrs=re.findall(r'20\d\d',rest[:80]) or re.findall(r'20\d\d',t)
    year=int(yrs[0]) if yrs else None;desc=rest[m.end():].strip() if m else rest
    title=tt.title() if tt.isupper() else tt
    P.append({'id':'maia:'+p['slug'],'src':'MAIA','url':p['url'],'title':title,'year':year,'yearLabel':str(year),'level':'MA','type':typ,'formations':['Master architecture d’intérieur'],
      'students':[],'teachers':[],'assistants':[],'others':[],'partners':[],'prizes':[],'place':place,'desc':desc[:3000],'figs':[{'src':u,'credit':''} for u in p['imgs']]})
for p in json.load(open('head_ne_keep.json')):
    m=p.get('meta',{});slug=p['href'].strip('/').replace('/','__')
    typ='Actualité' if p['kind']=='Actualité' else ('Exposition' if 'Exposition' in p['tags'] else 'Événement')
    lv='MA' if 'Master' in p['tags'][0] else 'BA'
    P.append({'id':'ne:'+slug,'src':'HEAD','url':'https://head.hesge.ch'+p['href'],'title':p['title'] or _h.unescape(re.search(r'<title>(.*?)</title>',open('pages_ne/'+slug+'.html').read(),re.S).group(1)).split(' | ')[0].strip(),'year':p['year'],'yearLabel':str(p['year']),
      'level':lv,'type':typ,'formations':[p['tags'][0]],'students':[],'teachers':[],'assistants':[],'others':clean_names(m.get('Avec',[])),'partners':[],'prizes':[],
      'place':' '.join(m.get('Lieu',[]))[:80],'desc':p['desc'][:3000],'figs':p['figs']})
json.dump(P,open('projects_norm.json','w'),ensure_ascii=False,indent=1)
c=collections.Counter()
for p in P:
    for r in ('students','teachers','assistants'):
        for n in p[r]: c[(key(n),r)]+=1
print(len(P),'projects;',len({k for k,_ in c}),'people')
print(collections.Counter((p['src'],p['type']) for p in P).most_common())
print([ (p['title'],p['year'],p['place'],p['type']) for p in P if p['src']=='MAIA'][:8])
print(sorted(((v,k) for k,v in c.items()),reverse=True)[:12])
