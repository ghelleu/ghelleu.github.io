import re,json,html,time,urllib.request,os,sys,concurrent.futures as cf
exec(open('crawl_projects.py').read().split("L=json.load")[0])  # get(), txt(), orig()
out={}
for v,kind in [('listing_news&view_display_id=block_page_listing','Actualité'),('listing_event&view_display_id=block_evenements','Événement')]:
    for code,label in [(11785,'BA AI'),(11825,'MA AI')]:
        for p in range(60):
            h=get(f'https://head.hesge.ch/api/head-views?view_name={v}&formation%5B0%5D={code}&page={p}')
            cards=re.findall(r'<head-card(.*?)</head-card>',h or '',re.S)
            if not cards: break
            for c in cards:
                href=re.search(r'href="([^"]+)"',c).group(1)
                t=re.search(r'<span slot="title">(.*?)</span>',c,re.S);d=re.search(r'detail="([^"]*)"',c)
                tg=re.search(r'tag-segments="([^"]*)"',c);tags=[x['text'] for x in json.loads(html.unescape(tg.group(1)))] if tg else []
                e=out.setdefault(href,{'href':href,'kind':kind,'formations':[],'title':html.unescape(t.group(1)).strip() if t else '','detail':html.unescape(d.group(1)) if d else '','tags':tags})
                if label not in e['formations']: e['formations'].append(label)
            time.sleep(0.3)
L=list(out.values());print('cards',len(L),file=sys.stderr)
os.makedirs('pages_ne',exist_ok=True)
def one(p):
    slug=p['href'].strip('/').replace('/','__');fn=f'pages_ne/{slug}.html'
    if os.path.exists(fn): h=open(fn).read()
    else:
        h=get('https://head.hesge.ch'+p['href'])
        if h is None: return p,None
        open(fn,'w').write(h);time.sleep(0.3)
    meta={}
    for e in re.findall(r'<head-definition-list-entry>(.*?)</head-definition-list-entry>',h,re.S):
        t=re.search(r'slot="term"[^>]*>(.*?)</div>',e,re.S);d=re.search(r'slot="description"[^>]*>(.*)',e,re.S)
        if t and d: meta[txt(t.group(1))]=[v for v in ([txt(x) for x in re.findall(r'<div>(.*?)</div>',d.group(1),re.S)] or [txt(d.group(1))]) if v]
    figs=[]
    for f in re.findall(r'<head-figure(.*?)</head-figure>',h,re.S):
        im=re.search(r'<head-image src="([^"]+)"',f)
        if not im: continue
        cap=re.search(r'caption="([^"]*)"',f);o=orig(im.group(1))
        if '/head-content/' in o or '/files/' in o:
            if o not in [x['src'] for x in figs]: figs.append({'src':o,'credit':html.unescape(cap.group(1)) if cap else ''})
    if not figs:
        for im in re.findall(r'<head-image src="([^"]+)"',h):
            o=orig(im)
            if o not in [x['src'] for x in figs] and '/files/' in o: figs.append({'src':o,'credit':''})
    j=h.find('<head-rich-text');desc=txt(h[j:h.find('</head-rich-text>',j)]) if j>=0 else ''
    dates=re.findall(r'datetime="(\d{4})-',h)
    return p,{'meta':meta,'figs':figs,'desc':desc[:3000],'years':dates[:3]}
with cf.ThreadPoolExecutor(4) as ex:
    for p,r in ex.map(one,L):
        if r: p.update(r)
json.dump(L,open('head_ne.json','w'),ensure_ascii=False,indent=1)
print(len(L),sum(len(p.get('figs',[])) for p in L))
