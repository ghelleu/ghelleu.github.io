import glob,math,json
from PIL import Image,ImageDraw
O=(6.09,46.158);K=1e5
def dec(s):
    a=list(map(int,s.split(',')));x=y=0;pts=[]
    for i in range(0,len(a),2):
        x+=a[i];y+=a[i+1];pts.append((O[0]+x/K,O[1]+y/K))
    return pts
def area(p):return sum(p[i][0]*p[(i+1)%len(p)][1]-p[(i+1)%len(p)][0]*p[i][1] for i in range(len(p)))/2
def load_bld():
    outer=[];holes=[]
    for f in sorted(glob.glob('/home/claude/build/osm/b_g*.txt')):
        for s in open(f).read().split(';'):
            if not s:continue
            p=dec(s);(holes if area(p)>0 else outer).append(p)
    return outer,holes
def load_w():
    W=json.load(open('/home/claude/build/osm/water.json'));R={}
    for k,v in W.items():
        R[k]=[(s.startswith('H'),dec(s.lstrip('H'))) for s in v if s.lstrip('H')]
    return R
def merc(lon,lat,z):
    n=2**z;x=(lon+180)/360*n;la=math.radians(lat);y=(1-math.log(math.tan(la)+1/math.cos(la))/math.pi)/2*n;return x,y
