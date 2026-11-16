import re,json,html,time,urllib.request,os
UA={'User-Agent':'Mozilla/5.0 (research crawl; contact guillaumehelleu.com)'}
def get(u):
    for k in range(4):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40).read().decode('utf8','replace')
        except Exception: time.sleep(2*(k+1))
def txt(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',re.sub(r'<(script|style)[^>]*>.*?</\1>','',s,flags=re.S)))).strip()
L=get('https://head-maia.ch/projects/')
urls=sorted(set(re.findall(r'href="(https://head-maia\.ch/project/[^"#?]+)"',L)),key=lambda u:L.find(u))
os.makedirs('maia',exist_ok=True)
out=[]
for u in urls:
    slug=u.rstrip('/').rsplit('/',1)[-1];fn=f'maia/{slug}.html'
    h=open(fn).read() if os.path.exists(fn) else get(u)
    if not os.path.exists(fn): open(fn,'w').write(h);time.sleep(0.4)
    # content area after the "Siguiente" nav
    i=h.find('Siguiente');body=h[i:] if i>0 else h
    end=body.find('<footer');body=body[:end] if end>0 else body
    t=txt(body).replace('Siguiente','',1).replace('-->','').strip()
    m=re.match(r'(\w[\w ]*?) (.+?) (Geneva|Genève|Milan|Milano|Seoul|New York|Paris|[A-Z][a-z]+),? ?(Spring|Fall|Autumn|Summer|Winter|Sept\.?|September|January|June|March|May|April|October|November|December|February|July|August)? ?(\d{4})',t)
    imgs=[]
    for s in re.findall(r'(?:src|href|data-src|srcset)="([^"]*wp-content/uploads/[^"]+)"',body):
        for x in s.split(','):
            x=x.strip().split(' ')[0]
            if not re.search(r'\.(jpe?g|png|webp|gif)$',x,re.I): continue
            full=re.sub(r'-\d+x\d+(?=\.\w+$)','',x)
            if full.startswith('/'): full='https://head-maia.ch'+full
            if 'logo' in full or 'favicon' in full: continue
            if full not in imgs: imgs.append(full)
    # prefer -scaled variants over their base duplicates
    base=lambda v:v.replace('-scaled.','.')
    best={}
    for v in imgs: best.setdefault(base(v),v); best[base(v)]=v if '-scaled.' in v else best[base(v)]
    out.append({'url':u,'slug':slug,'head':t[:200],'text':t[:4000],'imgs':list(best.values())})
json.dump(out,open('maia_projects.json','w'),ensure_ascii=False,indent=1)
print(len(out),sum(len(p['imgs']) for p in out))
for p in out[:5]: print(p['head'][:150],'|',len(p['imgs']))
