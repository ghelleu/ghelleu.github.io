import sys,re
from bs4 import BeautifulSoup
for fn in sys.argv[1:]:
    s=BeautifulSoup(open(fn,encoding='utf-8',errors='ignore'),'html.parser')
    for t in s(['script','style','nav','header','footer','noscript','svg']): t.decompose()
    m=s.find('main') or s.body
    txt=m.get_text('\n')
    txt=re.sub(r'\n\s*\n+','\n',txt)
    out=fn.replace('.html','.txt'); open(out,'w').write(txt)
    # links
    links=sorted(set(a['href'] for a in m.find_all('a',href=True)))
    open(fn.replace('.html','.links'),'w').write('\n'.join(links))
    print(out,len(txt))
