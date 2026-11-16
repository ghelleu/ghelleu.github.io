import os,math,sys,json
from PIL import Image,ImageDraw
from render import *
OUT='/home/claude/ghelleu.github.io/adjoint-ai/tiles'
BB=(6.080,46.150,6.190,46.240)
C=dict(bg=(242,240,235),water=(224,223,216),hatch=(205,203,195),park=(233,230,222),green=(236,233,226),bld=(190,186,176),rail=(170,167,159))
o,h=load_bld();W=load_w() if os.path.exists('water.json') else {}
def bbox(p):xs=[a for a,_ in p];ys=[b for _,b in p];return min(xs),min(ys),max(xs),max(ys)
def prep(L):return [(p,bbox(p)) for p in L]
OB=prep(o);HB=prep(h)
WL={k:[(hole,p,bbox(p)) for hole,p in v] for k,v in W.items()}
def tile(z,tx,ty,size=512,ss=2):
    S=size*ss;n=2**z
    lon0=tx/n*360-180;lon1=(tx+1)/n*360-180
    def lat(y):return math.degrees(math.atan(math.sinh(math.pi*(1-2*y/n))))
    la1=lat(ty);la0=lat(ty+1);pad=(lon1-lon0)*.02
    vis=lambda b:not(b[2]<lon0-pad or b[0]>lon1+pad or b[3]<la0-pad or b[1]>la1+pad)
    im=Image.new('RGB',(S,S),C['bg']);d=ImageDraw.Draw(im)
    def P(p):x,y=merc(p[0],p[1],z);return ((x-tx)*S,(y-ty)*S)
    for k in ('green','park','water'):
        for hole,p,b in [t for t in WL.get(k,[]) if not t[0]]:
            if vis(b) and len(p)>2:d.polygon([P(q) for q in p],fill=C[k])
        for hole,p,b in [t for t in WL.get(k,[]) if t[0]]:
            if vis(b) and len(p)>2:d.polygon([P(q) for q in p],fill=C['bg'])
        if k=='water':
            # hachures horizontales dans l'eau
            mask=Image.new('L',(S,S),0);md=ImageDraw.Draw(mask)
            for hole,p,b in WL.get('water',[]):
                if vis(b) and len(p)>2:md.polygon([P(q) for q in p],fill=0 if hole else 255)
            hat=Image.new('RGB',(S,S),C['water']);hd=ImageDraw.Draw(hat)
            step=int(7*ss*(1 if z<15 else 1.4))
            for yy in range(-(int(ty*S))%step,S,step):hd.line([(0,yy),(S,yy)],fill=C['hatch'],width=max(1,ss))
            im.paste(hat,(0,0),mask)
    for p in WL.get('rail',[]):
        hole,pts,b=p
        if vis(b):d.line([P(q) for q in pts],fill=C['rail'],width=max(1,int(ss*(1 if z<15 else 2))))
    for p,b in OB:
        if vis(b):d.polygon([P(q) for q in p],fill=C['bld'])
    for p,b in HB:
        if vis(b):d.polygon([P(q) for q in p],fill=C['bg'])
    return im.resize((size,size),Image.LANCZOS)
def rng(z):
    x0,y0=merc(BB[0],BB[3],z);x1,y1=merc(BB[2],BB[1],z);return range(int(x0),int(x1)+1),range(int(y0),int(y1)+1)
if __name__=='__main__':
    zs=list(map(int,sys.argv[1:])) or [12,13,14,15,16]
    for z in zs:
        xs,ys=rng(z);c=0
        for tx in xs:
            for ty in ys:
                os.makedirs(f'{OUT}/{z}/{tx}',exist_ok=True)
                tile(z,tx,ty).convert('P',palette=Image.ADAPTIVE,colors=32).save(f'{OUT}/{z}/{tx}/{ty}.png',optimize=True);c+=1
        print(z,c,flush=True)
