import re,json,html,time,urllib.request,sys
UA={'User-Agent':'Mozilla/5.0 (research crawl; contact guillaumehelleu.com)'}
def get(u):
    for k in range(4):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40).read().decode('utf8','replace')
        except Exception as e: time.sleep(2*(k+1))
    raise SystemExit('fail '+u)
out={}
for code,label in [(11785,'BA AI'),(11825,'MA AI')]:
    for p in range(0,200):
        h=get(f'https://head.hesge.ch/api/head-views?view_name=headge_listing_projects&view_display_id=page&formation%5B0%5D={code}&page={p}')
        cards=re.findall(r'<head-card(.*?)</head-card>',h,re.S)
        if not cards: break
        for c in cards:
            href=re.search(r'href="([^"]+)"',c).group(1)
            tags=json.loads(html.unescape(re.search(r'tag-segments="([^"]*)"',c).group(1)))
            t=re.search(r'<span slot="title">(.*?)</span>',c,re.S);s=re.search(r'<span slot="subtitle">(.*?)</span>',c,re.S)
            d=re.search(r'detail="([^"]*)"',c);img=re.search(r'<head-image src="([^"]+)"',c)
            e=out.setdefault(href,{'href':href,'formations':[],'title':html.unescape(t.group(1)).strip() if t else '','subtitle':html.unescape(s.group(1)).strip() if s else '','year':d.group(1) if d else '','tags':[x['text'] for x in tags],'thumb':img.group(1) if img else ''})
            if label not in e['formations']: e['formations'].append(label)
        print(label,p,len(cards),len(out),file=sys.stderr)
        time.sleep(0.4)
json.dump(list(out.values()),open('head_list.json','w'),ensure_ascii=False,indent=1)
print(len(out))
