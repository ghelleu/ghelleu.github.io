# usage: python3 ingest.py items.json  (list of {"id":..., "src":...}); writes manifest.jsonl (append, resumable)
import json,sys,os,io,hashlib,time,urllib.request,urllib.parse,threading,concurrent.futures as cf
from PIL import Image,ImageOps
Image.MAX_IMAGE_PIXELS=300_000_000
import boto3,botocore
s3=boto3.client('s3',endpoint_url=os.environ['R2_ENDPOINT'],region_name='auto',config=botocore.config.Config(max_pool_connections=32,retries={'max_attempts':6}))
B='media-explorer';PFX='head-ai/img/'
UA={'User-Agent':'Mozilla/5.0 (research archive; contact guillaumehelleu.com)'}
LV=[160,480,1000,2000]
items=json.load(open(sys.argv[1]))
done={}
if os.path.exists('manifest.jsonl'):
    for l in open('manifest.jsonl'):
        r=json.loads(l)
        if r.get('err')=='fail': continue
        done[r['id']]=r
lock=threading.Lock();seen_sha={r['sha']:r for r in done.values() if r.get('sha')}
out=open('manifest.jsonl','a')
def fetch(u):
    for k in range(4):
        try:
            r=urllib.request.urlopen(urllib.request.Request(urllib.parse.quote(u,safe=':/?=&%#+,;@'),headers=UA),timeout=60);return r.read(),r.headers.get('content-type','')
        except urllib.error.HTTPError as e:
            if e.code in (403,404,410): return None,str(e.code)
            time.sleep(3*(k+1))
        except Exception as e: time.sleep(3*(k+1))
    return None,'fail'
def put(key,data,ct):
    s3.put_object(Bucket=B,Key=key,Body=data,ContentType=ct,CacheControl='public, max-age=31536000, immutable')
def one(it):
    if it['id'] in done: return None
    data,ct=fetch(it['src'])
    if data is None: return {'id':it['id'],'src':it['src'],'err':ct}
    sha=hashlib.sha1(data).hexdigest()
    with lock:
        if sha in seen_sha:
            r=dict(seen_sha[sha]);r.update({'id':it['id'],'src':it['src'],'dup':True});return r
    try:
        im=Image.open(io.BytesIO(data))
        if im.format=='JPEG': im.draft('RGB',(2000,2000))
        im=ImageOps.exif_transpose(im)
        if im.mode in ('RGBA','LA','P'):
            im=im.convert('RGBA');bg=Image.new('RGB',im.size,(255,255,255));bg.paste(im,mask=im.split()[-1]);im=bg
        else: im=im.convert('RGB')
    except Exception as e: return {'id':it['id'],'src':it['src'],'err':'decode '+str(e)[:80]}
    W,H=im.size;ext=(it['src'].split('?')[0].rsplit('.',1)[-1].lower())[:5]
    if ext not in ('jpg','jpeg','png','webp','gif','tif','tiff'): ext='jpg'
    base=PFX+sha+'/'
    put(base+'o.'+ext,data,ct or 'image/jpeg')
    for lv in LV:
        w=min(lv,W);t=im if w==W else im.resize((w,max(1,round(H*w/W))),Image.LANCZOS)
        b=io.BytesIO();t.save(b,'WEBP',quality=82 if lv<=480 else 86,method=4);put(base+f'{lv}.webp',b.getvalue(),'image/webp')
        if lv==480: t.save(f'img/{sha}.jpg',quality=90)
    r={'id':it['id'],'src':it['src'],'sha':sha,'w':W,'h':H,'ext':ext,'bytes':len(data)}
    with lock: seen_sha[sha]=r
    return r
n=0;t0=time.time()
with cf.ThreadPoolExecutor(4) as ex:
    for r in ex.map(one,items):
        if r is None: continue
        out.write(json.dumps(r)+'\n');out.flush();n+=1
        if n%100==0: print(n,round(time.time()-t0),flush=True)
print('done',n,flush=True)
