import json,os,re,sys,math,collections,numpy as np
from PIL import Image,ImageFilter
import onnxruntime as ort
from tokenizers import Tokenizer
HERE=os.path.dirname(os.path.abspath(__file__))
D=os.environ.get('HEADAI_WORK',os.path.join(HERE,'data'))
P=json.load(open(f'{D}/projects_norm.json'));PI={p['id']:i for i,p in enumerate(P)}
M={}
for l in open(f'{D}/manifest.jsonl'):
    r=json.loads(l)
    if r.get('sha'): M[r['id']]=r
# local 480px copies are a cache: fetch the missing ones from R2
import urllib.request,io
os.makedirs(f'{D}/img',exist_ok=True)
for r in {r['sha']:r for r in M.values()}.values():
    p=f"{D}/img/{r['sha']}.jpg"
    if not os.path.exists(p):
        b=urllib.request.urlopen('https://media.hint3rland.com/head-ai/img/'+r['sha']+'/480.webp',timeout=60).read()
        Image.open(io.BytesIO(b)).convert('RGB').save(p,quality=90)
# items: one per (project, figure); identical files keep the first occurrence and list other projects
items=[];bysha={}
for i,p in enumerate(P):
    for k,f in enumerate(p['figs']):
        mid=p['id'].split(':')[0]+':'+p['id'].split(':',1)[1]+':'+str(k)
        r=M.get(mid)
        if not r: continue
        if r['sha'] in bysha:
            items[bysha[r['sha']]]['also'].append(i);continue
        bysha[r['sha']]=len(items)
        items.append({'p':i,'k':k,'sha':r['sha'],'w':r['w'],'h':r['h'],'ext':r['ext'],'credit':f.get('credit',''),'also':[]})
print('items',len(items),file=sys.stderr)
# ---------- pixel features ----------
def feats(path):
    im=Image.open(path).convert('RGB');im.thumbnail((96,96))
    a=np.asarray(im).astype(np.float32)/255;hsv=np.asarray(im.convert('HSV')).astype(np.float32)/255
    L=(0.299*a[...,0]+0.587*a[...,1]+0.114*a[...,2]);S=hsv[...,1];V=hsv[...,2];Hh=hsv[...,0]*2*np.pi
    w=S*V;cw=w.sum()+1e-6;hue=(math.degrees(math.atan2((np.sin(Hh)*w).sum(),(np.cos(Hh)*w).sum()))+360)%360
    g=np.asarray(im.convert('L').filter(ImageFilter.FIND_EDGES)).astype(np.float32)/255
    mean=a.reshape(-1,3).mean(0)
    # dominant colour: median of the most saturated quartile, else mean
    flat=a.reshape(-1,3);sf=S.reshape(-1);top=flat[sf>=np.quantile(sf,0.75)]
    dom=np.median(top,0) if len(top) else mean
    return {'L':float(L.mean()),'S':float(S.mean()),'E':float(g.mean()),'hue':hue,'sat':float(cw/S.size),'mean':[int(x*255) for x in mean],'dom':[int(x*255) for x in dom],'contrast':float(L.std())}
FC=f'{D}/feats.json';F=json.load(open(FC)) if os.path.exists(FC) else {}
for it in items:
    if it['sha'] not in F: F[it['sha']]=feats(f"{D}/img/{it['sha']}.jpg")
json.dump(F,open(FC,'w'))
# ---------- CLIP ----------
so=ort.SessionOptions();so.intra_op_num_threads=2
V=ort.InferenceSession(f'{D}/clip/vision_model.onnx',so);T=ort.InferenceSession(f'{D}/clip/text_model.onnx',so)
MEAN=np.array([0.48145466,0.4578275,0.40821073],np.float32);STD=np.array([0.26862954,0.26130258,0.27577711],np.float32)
def prep(path):
    im=Image.open(path).convert('RGB');w,h=im.size;s=224/min(w,h);im=im.resize((max(224,round(w*s)),max(224,round(h*s))),Image.BICUBIC)
    w,h=im.size;l=(w-224)//2;t=(h-224)//2;im=im.crop((l,t,l+224,t+224))
    return ((np.asarray(im).astype(np.float32)/255-MEAN)/STD).transpose(2,0,1)
EC=f'{D}/emb.npz';E=dict(np.load(EC)) if os.path.exists(EC) else {}
todo=[it['sha'] for it in items if it['sha'] not in E]
vin=V.get_inputs()[0].name;vout=[o.name for o in V.get_outputs()]
oi=vout.index('image_embeds') if 'image_embeds' in vout else 0
for b in range(0,len(todo),16):
    batch=todo[b:b+16];x=np.stack([prep(f'{D}/img/{s}.jpg') for s in batch])
    e=V.run(None,{vin:x})[oi];e=e/np.linalg.norm(e,axis=1,keepdims=True)
    for s,v in zip(batch,e): E[s]=v.astype(np.float32)
    if b%320==0: print('clip',b,len(todo),file=sys.stderr);np.savez(EC,**E)
np.savez(EC,**E)
X=np.stack([E[it['sha']] for it in items])
tok=Tokenizer.from_file(f'{D}/clip/tokenizer.json')
tin=[i.name for i in T.get_inputs()];tout=[o.name for o in T.get_outputs()];ti=tout.index('text_embeds') if 'text_embeds' in tout else 0
def text_emb(prompts):
    enc=[tok.encode(p).ids[:77] for p in prompts];n=77
    ids=np.array([e+[49407]*(n-len(e)) for e in enc],np.int64)
    feed={'input_ids':ids}
    if 'attention_mask' in tin: feed['attention_mask']=np.array([[1]*len(e)+[0]*(n-len(e)) for e in enc],np.int64)
    e=T.run(None,feed)[ti];return e/np.linalg.norm(e,axis=1,keepdims=True)
def zeroshot(classes):
    # classes: [(label,[prompts])] ; returns index per item and probabilities
    W=[];[W.append(text_emb(ps).mean(0)) for _,ps in classes];W=np.stack(W);W/=np.linalg.norm(W,axis=1,keepdims=True)
    logits=100*X@W.T;p=np.exp(logits-logits.max(1,keepdims=True));p/=p.sum(1,keepdims=True)
    return p.argmax(1),p.max(1)
DOC=[('Photo de maquette',['a photo of an architectural scale model','a white cardboard architecture model','a physical maquette of a building interior']),
 ('Plan',['an architectural floor plan drawing','a black and white floor plan','a technical plan drawing seen from above']),
 ('Coupe ou élévation',['an architectural section drawing','an elevation drawing of a building','a cross section line drawing of a room']),
 ('Axonométrie',['an axonometric drawing','an isometric architectural illustration','an exploded axonometric diagram']),
 ('Rendu 3D',['a photorealistic 3D render of an interior','a computer generated visualization of a room','a CGI rendering of an interior design']),
 ('Collage',['an architectural collage','a graphic collage mixing photos and drawings','a surreal photomontage']),
 ('Croquis',['a hand drawn sketch','a pencil sketch on paper','a watercolor drawing']),
 ('Intérieur photographié',['a photograph of a real interior space','a photo of a furnished room','an interior photography of a living space']),
 ('Exposition ou installation',['an exhibition installation view','a design exhibition in a gallery','a spatial installation in a dark hall']),
 ('Objet ou mobilier',['a product photo of a piece of furniture','a design object on a plain background','a lamp or chair studio photo']),
 ('Matériaux',['material samples and textures','close up of materials and fabrics','a mood board of material swatches']),
 ('Personnes et atelier',['students working in a studio','people at an event','a workshop with people building']),
 ('Document ou affiche',['a poster with text','a page of a booklet with text','a graphic design layout with typography'])]
FRAME=[('Frontale',['a frontal symmetrical view','a straight on elevation-like view']),
 ('Perspective',['a one point perspective view into a room','a corner perspective view']),
 ('Vue de dessus',['a top down view from above','a bird\'s eye view']),
 ('Détail',['a close up detail shot','a macro photograph of a detail']),
 ('Vue d\'ensemble',['a wide shot of a large space','a wide angle overall view'])]
dc,dp=zeroshot(DOC);fc,fp=zeroshot(FRAME)
# ---------- layouts ----------
import umap
def um(Z,sup=None,seed=7,nn=15,md=0.25):
    r=umap.UMAP(n_neighbors=nn,min_dist=md,metric='cosine',random_state=seed,target_weight=0.55 if sup is not None else 0.5)
    Y=r.fit_transform(Z,y=sup) if sup is not None else r.fit_transform(Z)
    Y-=Y.min(0);Y/=Y.max(0).max();return Y
sim=um(X)
typ=um(X,sup=dc)
yrs=np.array([P[it['p']]['year'] or 0 for it in items])
one=umap.UMAP(n_components=1,n_neighbors=15,metric='cosine',random_state=7).fit_transform(X)[:,0];one=(one-one.min())/(one.max()-one.min())
# near duplicates (same picture re-exported): cosine > .985
S=X@X.T;np.fill_diagonal(S,0);dup=[-1]*len(items)
for i in range(len(items)):
    j=int(S[i].argmax())
    if S[i,j]>0.985 and j<i: dup[i]=j
nb=np.argsort(-S,1)[:,:8]
out={'items':items,'doc':[c for c,_ in DOC],'frame':[c for c,_ in FRAME],'dc':dc.tolist(),'dp':dp.round(3).tolist(),'fc':fc.tolist(),'fp':fp.round(3).tolist(),
 'sim':sim.round(5).tolist(),'typ':typ.round(5).tolist(),'one':one.round(5).tolist(),'dup':dup,'nb':nb.tolist(),'feats':[F[it['sha']] for it in items]}
json.dump(out,open(f'{D}/analysis.json','w'))
print('ok',len(items),collections.Counter(DOC[i][0] for i in dc).most_common(),file=sys.stderr)
