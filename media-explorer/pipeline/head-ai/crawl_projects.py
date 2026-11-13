import re,json,html,time,urllib.request,sys,os,concurrent.futures as cf
UA={'User-Agent':'Mozilla/5.0 (research crawl; contact guillaumehelleu.com)'}
def get(u):
    for k in range(4):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40).read().decode('utf8','replace')
        except Exception as e: err=e;time.sleep(2*(k+1))
    return None
def txt(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s))).strip()
def orig(u): return re.sub(r'/styles/[^/]+/public/','/',u).split('?')[0].removesuffix('.webp')
L=json.load(open('head_list.json'))
os.makedirs('pages',exist_ok=True)
def one(p):
    slug=p['href'].rsplit('/',1)[-1];fn=f'pages/{slug}.html'
    if os.path.exists(fn): h=open(fn).read()
    else:
        h=get('https://head.hesge.ch'+p['href']);
        if h is None: return p['href'],None
        open(fn,'w').write(h);time.sleep(0.3)
    meta={}
    for e in re.findall(r'<head-definition-list-entry>(.*?)</head-definition-list-entry>',h,re.S):
        t=re.search(r'slot="term"[^>]*>(.*?)</div>',e,re.S);d=re.search(r'slot="description"[^>]*>(.*)',e,re.S)
        if not t or not d: continue
        vals=[txt(x) for x in re.findall(r'<div>(.*?)</div>',d.group(1),re.S)] or [txt(d.group(1))]
        meta[txt(t.group(1))]=[v for v in vals if v]
    figs=[]
    for f in re.findall(r'<head-figure(.*?)</head-figure>',h,re.S):
        im=re.search(r'<head-image src="([^"]+)"[^>]*?width="(\d+)" height="(\d+)"',f)
        if not im: continue
        cap=re.search(r'caption="([^"]*)"',f)
        o=orig(im.group(1))
        if o not in [x['src'] for x in figs]: figs.append({'src':o,'credit':html.unescape(cap.group(1)) if cap else '','w':int(im.group(2)),'h':int(im.group(3))})
    if not figs:
        for im in re.findall(r'<head-image src="([^"]+)"',h):
            o=orig(im)
            if 'head-content' in o and o not in [x['src'] for x in figs]: figs.append({'src':o,'credit':''})
    j=h.find('<head-rich-text');desc=txt(h[j:h.find('</head-rich-text>',j)]) if j>=0 else ''
    t=re.search(r'<title>(.*?)</title>',h,re.S)
    return p['href'],{'meta':meta,'figs':figs,'desc':desc[:3000],'page_title':txt(t.group(1)) if t else ''}
res={}
with cf.ThreadPoolExecutor(4) as ex:
    for k,(href,r) in enumerate(ex.map(one,L)):
        res[href]=r
        if k%50==0: print(k,file=sys.stderr)
for p in L: p.update(res.get(p['href']) or {'error':True})
json.dump(L,open('head_projects.json','w'),ensure_ascii=False,indent=1)
import collections
print('projects',len(L),'errors',sum(1 for p in L if p.get('error')),'images',sum(len(p.get('figs',[])) for p in L))
print(collections.Counter(k for p in L for k in p.get('meta',{})).most_common())
