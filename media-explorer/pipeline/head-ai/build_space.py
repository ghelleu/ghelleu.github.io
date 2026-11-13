import json,re,unicodedata,collections,io,os,math
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__))
D=os.environ.get('HEADAI_WORK',os.path.join(HERE,'data'))
OUT=os.path.join(os.environ.get('SITE_DIR',os.path.expanduser('~/ghelleu.github.io')),'media-explorer/head-ai')
os.makedirs(OUT,exist_ok=True)
P=json.load(open(f'{D}/projects_norm.json'));A=json.load(open(f'{D}/analysis.json'))
items=A['items']
def key(n): return re.sub(r'\s+',' ',unicodedata.normalize('NFKD',n).encode('ascii','ignore').decode().lower().replace('-',' ')).strip()
# people registry (one entry per normalised name)
people=[];pidx={}
def pid(n):
    k=key(n)
    if k not in pidx: pidx[k]=len(people);people.append(n)
    return pidx[k]
proj=[]
for p in P:
    proj.append({'t':p['title'],'y':p['year'],'lv':p['level'],'ty':p['type'],'src':p['src'],'url':p['url'],'pl':p['place'],
      'stu':[pid(n) for n in p['students']],'tea':[pid(n) for n in p['teachers']],'ass':[pid(n) for n in p['assistants']],
      'oth':[pid(n) for n in p['others']],'prz':p['prizes'],'d':p['desc'][:700]})
# MAIA pages have no structured people: link names already known from HEAD when they appear in the text
known=sorted(pidx.items(),key=lambda kv:-len(kv[0]))
for p,q in zip(P,proj):
    if p['src']!='MAIA': continue
    tx=key(p['desc'][:3000]+' '+p['title'])
    q['men']=[i for k,i in known if len(k)>6 and re.search(r'\b'+re.escape(k)+r'\b',tx)][:20]
# per-image author: a student of the project named in the caption
au=[]
for it in items:
    q=proj[it['p']];c=key(it['credit'])
    au.append([s for s in q['stu'] if key(people[s]) and key(people[s]) in c])
# photographer: the name after the last comma following ©
def photog(c):
    m=re.search(r'©\s*(.*)$',c)
    if not m: return ''
    s=m.group(1);parts=[x.strip() for x in s.split(',')]
    cand=[x for x in parts if not re.search(r'HEAD|Genève|Geneve|École|Ecole|\d{4}',x)]
    return cand[-1] if cand else ''
credits=[];cidx={}
def cid(c):
    if c not in cidx: cidx[c]=len(credits);credits.append(c)
    return cidx[c]
# ---------- atlases: 64px cells, 32x32 per sheet ----------
CELL=64;N=32;sheets=[];atl=[]
for i,it in enumerate(items):
    s,j=divmod(i,N*N)
    if j==0: sheets.append(Image.new('RGB',(CELL*N,CELL*N),(0,0,0)))
    im=Image.open(f"{D}/img/{it['sha']}.jpg").convert('RGB');im.thumbnail((CELL,CELL),Image.LANCZOS)
    cx,cy=(j%N)*CELL,(j//N)*CELL;ox,oy=(CELL-im.width)//2,(CELL-im.height)//2
    sheets[-1].paste(im,(cx+ox,cy+oy));atl.append([s,cx+ox,cy+oy,im.width,im.height])
for k,sh in enumerate(sheets): sh.save(f'{OUT}/atlas_{k}.webp','WEBP',quality=78,method=5)
F=A['feats']
data={'v':1,'cdn':'https://media.hint3rland.com/head-ai/img/','doc':A['doc'],'frame':A['frame'],'people':people,'credits':None,'proj':proj,
 'it':{'p':[it['p'] for it in items],'also':[it['also'] for it in items],'h':[it['sha'] for it in items],'ext':[it['ext'] for it in items],
   'w':[it['w'] for it in items],'hh':[it['h'] for it in items],'cr':[cid(it['credit']) for it in items],'ph':[photog(it['credit']) for it in items],'au':au,
   'dc':A['dc'],'dp':A['dp'],'fc':A['fc'],'fp':A['fp'],'sim':A['sim'],'typ':A['typ'],'one':A['one'],'dup':A['dup'],'nb':A['nb'],
   'dom':['%02x%02x%02x'%tuple(f['dom']) for f in F],'L':[round(f['L'],3) for f in F],'E':[round(f['E'],3) for f in F],'hue':[round(f['hue']) for f in F],'sat':[round(f['sat'],3) for f in F],
   'atl':atl},'sheets':len(sheets)}
data['credits']=credits
json.dump(data,open(f'{OUT}/data.json','w'),ensure_ascii=False,separators=(',',':'))
print('items',len(items),'projects',len(proj),'people',len(people),'sheets',len(sheets),'size',os.path.getsize(f'{OUT}/data.json')//1024,'KB',
  'authored',sum(1 for a in au if a),file=__import__('sys').stderr)
