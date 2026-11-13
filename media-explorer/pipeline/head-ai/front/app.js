(async function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cv=$('#cv'),ctx=cv.getContext('2d');
let DPR=Math.min(2,window.devicePixelRatio||1);
const css=getComputedStyle(document.documentElement);
const LAYOUTS=[
  {k:'sim',t:'Ressemblance',d:'<b>Ressemblance</b>Chaque image est placée par une lecture de son contenu (modèle CLIP) : sujet, matière, cadrage et style. Les images proches se ressemblent.'},
  {k:'typ',t:'Type d\'image',d:'<b>Type d\'image</b>Les images s\'attirent par type de document (maquette, plan, rendu, photo d\'exposition…), puis par ressemblance. Types estimés automatiquement.'},
  {k:'chr',t:'Chronologie',d:'<b>Chronologie</b>Une colonne par année. La hauteur suit la ressemblance : à une même hauteur, le même genre d\'image, d\'une année à l\'autre.'},
  {k:'col',t:'Couleur',d:'<b>Couleur</b>Roue chromatique : l\'angle suit la teinte dominante, le centre réunit les images peu saturées.'},
  {k:'lum',t:'Lumière',d:'<b>Lumière</b>De gauche à droite, du plus épuré au plus chargé ; de bas en haut, du plus sombre au plus clair.'},
  {k:'grid',t:'Projets',d:''}
];
// eight chart families folded from the thirteen image types (categorical slots in fixed order)
const FAM=[['Maquette',[0]],['Dessin technique',[1,2,3]],['Rendu 3D',[4]],['Collage, croquis, document',[5,6,12]],['Intérieur photographié',[7]],['Exposition',[8]],['Objet et matériaux',[9,10]],['Personnes et atelier',[11]]];
const famOf=[];FAM.forEach(([,l],f)=>l.forEach(c=>famOf[c]=f));
const SCOL=k=>css.getPropertyValue('--s'+(k+1)).trim();

// ---------- data ----------
const D=await (await fetch('data.json',{cache:'no-cache'})).json();
const I=D.it,NI=I.h.length,PR=D.proj,PE=D.people;
const years=[...new Set(PR.map(p=>p.y).filter(Boolean))].sort((a,b)=>a-b);
const Y0=years[0],Y1=years[years.length-1];
const atlas=[];
await Promise.all(Array.from({length:D.sheets},(_,k)=>new Promise(r=>{const im=new Image();im.onload=()=>{atlas[k]=im;r()};im.onerror=r;im.src='atlas_'+k+'.webp'})));
const url=(i,lv)=>D.cdn+I.h[i]+'/'+lv+'.webp';
const orig=i=>D.cdn+I.h[i]+'/o.'+I.ext[i];
// people roles per item, and per person
const roleOf=(p,pid)=>PR[p].stu.includes(pid)?'étudiant·e':PR[p].tea.includes(pid)?'encadrement':PR[p].ass.includes(pid)?'assistanat':(PR[p].oth||[]).includes(pid)?'autre':(PR[p].men||[]).includes(pid)?'cité·e':'';
const projPeople=p=>[...PR[p].stu,...PR[p].tea,...PR[p].ass,...(PR[p].oth||[]),...(PR[p].men||[])];
const pprojs=PE.map(()=>[]);PR.forEach((p,k)=>new Set(projPeople(k)).forEach(x=>pprojs[x].push(k)));
const N=[];for(let i=0;i<NI;i++){const a=I.atl[i];N.push({i,p:I.p[i],ar:I.w[i]/I.hh[i],a,x:0,y:0,tx:0,ty:0,pos:{},raw:{},lod:{}})}
const itemsOfProj=PR.map(()=>[]);N.forEach(n=>itemsOfProj[n.p].push(n));

// ---------- state ----------
const st={lay:'sim',att:40,sel:null,f:{y0:Y0,y1:Y1,lv:new Set(),ty:new Set(),src:new Set(),dc:new Set(),fc:new Set(),prize:false,dup:true,person:null,proj:null}};
try{const s=JSON.parse(localStorage.getItem('mx-head-st')||'{}');if(s.lay)st.lay=s.lay;if(Number.isFinite(s.att))st.att=s.att}catch(e){}
const H=location.hash.slice(1);if(LAYOUTS.some(l=>l.k===H))st.lay=H;if(H==='projets')st.lay='grid';
const save=()=>{try{localStorage.setItem('mx-head-st',JSON.stringify({lay:st.lay,att:st.att}))}catch(e){}};

// ---------- layouts ----------
const TW=40;const span=Math.sqrt(NI)*TW*1.15;
N.forEach(n=>{const i=n.i;n.raw.sim=[I.sim[i][0]*span,I.sim[i][1]*span];n.raw.typ=[I.typ[i][0]*span,I.typ[i][1]*span];
  const a=I.hue[i]*Math.PI/180,r=Math.min(1,I.sat[i]*3.2),rr=(0.12+0.88*r)*span*0.5;n.raw.col=[span/2+Math.cos(a)*rr,span/2-Math.sin(a)*rr]});
{const es=N.map(n=>I.E[n.i]).sort((a,b)=>a-b),ls=N.map(n=>I.L[n.i]).sort((a,b)=>a-b);
 const rank=(arr,v)=>{let lo=0,hi=arr.length;while(lo<hi){const m=(lo+hi)>>1;if(arr[m]<v)lo=m+1;else hi=m}return lo/arr.length};
 N.forEach(n=>n.raw.lum=[rank(es,I.E[n.i])*span*1.3,(1-rank(ls,I.L[n.i]))*span])}
// chronology: one column per year; size each column from its own image count
const perYear={};N.forEach(n=>{const y=PR[n.p].y||Y0;(perYear[y]=perYear[y]||[]).push(n)});
// columns share one vertical axis: the 1D projection of the visual map, so a given height means the same kind of image every year
const COLS=[];{let x=0;const Hc=span*1.05;years.forEach(y=>{const L=perYear[y]||[];const w=TW*(3+L.length/38);COLS.push({y,x,w,n:L.length});
  L.forEach(n=>{const r=((n.i*2654435761)>>>0)/4294967296;n.raw.chr=[x+w/2+(r-0.5)*w*0.9,I.one[n.i]*Hc];n.grp=y});x+=w+TW*4})}
function relax(list,key,k,iter){if(k<0.03)return;const P=list.map(n=>n.pos[key]);const R=list.map(n=>k*(TW*0.5+TW/n.ar*0.5)*0.5*1.04);const cell=Math.max(...R)*2;
  for(let it=0;it<iter;it++){const grid=new Map();let hit=0;
    P.forEach((p,i)=>{const kk=Math.floor(p[0]/cell)+','+Math.floor(p[1]/cell);(grid.get(kk)||grid.set(kk,[]).get(kk)).push(i)});
    P.forEach((p,i)=>{const gx=Math.floor(p[0]/cell),gy=Math.floor(p[1]/cell);
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){const c=grid.get((gx+dx)+','+(gy+dy));if(!c)continue;
        for(const j of c){if(j<=i)continue;const q=P[j];let vx=q[0]-p[0],vy=q[1]-p[1];let d=Math.hypot(vx,vy);const m=R[i]+R[j];if(d>=m)continue;hit++;
          if(d<1e-3){const a=(i*2.399)%(Math.PI*2);vx=Math.cos(a);vy=Math.sin(a);d=1}
          const f=(m-d)/d*0.5*0.7;p[0]-=vx*f;p[1]-=vy*f;q[0]+=vx*f;q[1]+=vy*f}}});
    if(!hit)return}}
const scaleOf=a=>Math.exp(Math.log(3.2)*(1-a)+Math.log(0.32)*a);
const tolOf=a=>Math.max(0,Math.min(1,1-a*1.15));
const built={};
function applyLayout(key){if(key==='grid')return;const a=st.att/100,S=scaleOf(a);
  if(key==='chr'){// scale inside each year column, columns keep their order and spacing grows with the spread
    let off=0;COLS.forEach(c=>{const L=perYear[c.y]||[];const cx=c.x+c.w/2;let cy=0;L.forEach(n=>cy+=n.raw.chr[1]);cy/=L.length||1;
      L.forEach(n=>{n.pos.chr=[off+c.w*S/2+(n.raw.chr[0]-cx)*S,cy+(n.raw.chr[1]-cy)*S]});c.ox=off;c.ow=c.w*S;off+=c.w*S+TW*5})}
  else{let cx=0,cy=0;N.forEach(n=>{cx+=n.raw[key][0];cy+=n.raw[key][1]});cx/=NI;cy/=NI;
    N.forEach(n=>{const r=n.raw[key];n.pos[key]=[cx+(r[0]-cx)*S,cy+(r[1]-cy)*S]})}
  relax(N,key,tolOf(a),40);built[key]=st.att}
const ensure=k=>{if(k!=='grid'&&built[k]!==st.att)applyLayout(k)};
['sim'].forEach(applyLayout);

// ---------- filtering ----------
const F=st.f;
function pass(n,skip){const p=PR[n.p],i=n.i;
  if(skip!=='y'&&p.y&&(p.y<F.y0||p.y>F.y1))return false;
  if(F.dup&&I.dup[i]>=0)return false;
  if(skip!=='lv'&&F.lv.size&&!F.lv.has(p.lv==='BA+MA'?(F.lv.has('BA')?'BA':'MA'):p.lv))return false;
  if(skip!=='ty'&&F.ty.size&&!F.ty.has(p.ty))return false;
  if(skip!=='src'&&F.src.size&&!F.src.has(p.src))return false;
  if(skip!=='dc'&&F.dc.size&&!F.dc.has(I.dc[i]))return false;
  if(skip!=='fc'&&F.fc.size&&!F.fc.has(I.fc[i]))return false;
  if(F.prize&&!p.prz.length)return false;
  if(F.person!=null&&!projPeople(n.p).includes(F.person)&&!I.au[i].includes(F.person))return false;
  if(F.proj!=null&&n.p!==F.proj&&!I.also[i].includes(F.proj))return false;
  return true}
let VIS=[];const visSet=new Set();
function refresh(){VIS=N.filter(n=>pass(n));visSet.clear();VIS.forEach(n=>visSet.add(n));anchDirty=true;
  $('#status').textContent=VIS.length.toLocaleString('fr-CH')+' images';
  const nf=(F.y0!==Y0||F.y1!==Y1)+F.lv.size+F.ty.size+F.src.size+F.dc.size+F.fc.size+F.prize+(F.person!=null)+(F.proj!=null);$('#nf').textContent=nf||'';
  if(st.lay==='grid')renderGrid();if(!$('#side').hidden)renderSide()}

// ---------- view ----------
let view={x:0,y:0,s:1},anim=null;
function bounds(list){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;list.forEach(n=>{const p=n.pos[st.lay];x0=Math.min(x0,p[0]-TW);y0=Math.min(y0,p[1]-TW*1.6);x1=Math.max(x1,p[0]+TW);y1=Math.max(y1,p[1]+TW)});return[x0,y0,x1,y1]}
function fit(animate){if(st.lay==='grid'||!VIS.length)return;const r=cv.getBoundingClientRect();const[x0,y0,x1,y1]=bounds(VIS);const pad=36;
  const left=$('#side').hidden||innerWidth<980?pad:$('#side').getBoundingClientRect().right+18;
  const top=Math.min(r.height*0.4,$('.top').getBoundingClientRect().bottom+(st.lay==='chr'?44:18)),bot=Math.max(r.height*0.6,$('.dock').getBoundingClientRect().top-18);
  const s=Math.min((r.width-left-pad)/(x1-x0),(bot-top)/(y1-y0));const t={s,x:(left+r.width-pad)/2-(x0+x1)/2*s,y:(top+bot)/2-(y0+y1)/2*s};
  if(animate)tweenView(t);else view=t}
function tweenView(t){const f={...view},t0=performance.now();anim=()=>{const k=Math.min(1,(performance.now()-t0)/450),e=1-Math.pow(1-k,3);
  view={x:f.x+(t.x-f.x)*e,y:f.y+(t.y-f.y)*e,s:f.s+(t.s-f.s)*e};if(k>=1)anim=null}}
function setTargets(){anchDirty=true;if(st.lay==='grid')return;N.forEach(n=>{const p=n.pos[st.lay];n.tx=p[0];n.ty=p[1]})}
N.forEach(n=>{const p=n.pos.sim;n.x=n.tx=p[0];n.y=n.ty=p[1]});
function resize(){const r=cv.getBoundingClientRect();DPR=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*DPR;cv.height=r.height*DPR}
addEventListener('resize',resize);resize();

// ---------- dynamic resolution ----------
const LV=[160,480,1000,2000];let inflight=0;const want=new Map();const big=[];
const need=px=>{for(const l of LV)if(l>=px)return l;return LV[LV.length-1]};
function best(n,lv){for(let k=LV.length-1;k>=0;k--){const l=LV[k];if(l<=lv&&n.lod[l])return n.lod[l]}return null}
function pump(){while(inflight<8&&want.size){let bk=null,bv=-Infinity;for(const[k,v]of want)if(v.p>bv){bv=v.p;bk=k}const{n,lv}=want.get(bk);want.delete(bk);
  if(n.lod[lv])continue;inflight++;const im=new Image();im.decoding='async';
  im.onload=()=>{inflight--;n.lod[lv]=im;if(lv>=1000){big.push([n,lv]);while(big.length>80){const[o,l]=big.shift();if(!o._vis)delete o.lod[l];else big.push([o,l])}}pump()};
  im.onerror=()=>{inflight--;pump()};im.src=url(n.i,lv)}}

// subject-like labels for the image-type map, year labels for the chronology
let ANCH=[],anchDirty=true;
function anchors(){ANCH=[];if(st.lay!=='typ')return;const by={};VIS.forEach(n=>{(by[I.dc[n.i]]=by[I.dc[n.i]]||[]).push(n)});
  ANCH=Object.entries(by).filter(([,L])=>L.length>=4).map(([c,L])=>{const S=L.length>400?L.filter((_,k)=>k%Math.ceil(L.length/400)===0):L;let bi=0,bd=Infinity;
    S.forEach((a,i)=>{let d=0;for(const b of S)d+=Math.hypot(a.tx-b.tx,a.ty-b.ty);if(d<bd){bd=d;bi=i}});return{t:D.doc[c],n:L.length,m:S[bi]}}).sort((a,b)=>b.n-a.n);anchDirty=false}
function pill(t,n,sx,sy,placed){ctx.font=`650 13px 'Bricolage Grotesque', sans-serif`;const w1=ctx.measureText(t).width;ctx.font=`500 11px 'Bricolage Grotesque', sans-serif`;const w2=n!=null?ctx.measureText(String(n)).width+6:0;
  const W=w1+w2+22,Hh=26,x=sx-W/2,y=sy-Hh/2;if(placed&&placed.some(r=>x<r[2]&&x+W>r[0]&&y<r[3]&&y+Hh>r[1]))return;if(placed)placed.push([x-4,y-4,x+W+4,y+Hh+4]);
  ctx.fillStyle=css.getPropertyValue('--bg');ctx.globalAlpha=.86;ctx.beginPath();ctx.roundRect(x,y,W,Hh,13);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=css.getPropertyValue('--edge');ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle=css.getPropertyValue('--fg');ctx.textBaseline='middle';ctx.font=`650 13px 'Bricolage Grotesque', sans-serif`;ctx.fillText(t,x+11,sy+.5);
  if(n!=null){ctx.globalAlpha=.55;ctx.font=`500 11px 'Bricolage Grotesque', sans-serif`;ctx.fillText(String(n),x+17+w1,sy+.5);ctx.globalAlpha=1}}
function drawLabels(){ctx.setTransform(DPR,0,0,DPR,0,0);const placed=[];
  if(st.lay==='typ'){if(anchDirty)anchors();for(const a of ANCH)pill(a.t,a.n,a.m.x*view.s+view.x,(a.m.y-TW/a.m.ar/2)*view.s+view.y-16,placed)}
  if(st.lay==='chr'){const cnt={};VIS.forEach(n=>cnt[PR[n.p].y]=(cnt[PR[n.p].y]||0)+1);
    let top=Infinity;VIS.forEach(n=>top=Math.min(top,n.y-TW/n.ar/2));const sy=Math.max($('.top').getBoundingClientRect().bottom+20,top*view.s+view.y-22);
    COLS.forEach(c=>{if(!cnt[c.y])return;const wide=c.ow*view.s>84;pill(wide?String(c.y):"'"+String(c.y).slice(2),wide?cnt[c.y]:null,(c.ox+c.ow/2)*view.s+view.x,sy,placed)})}}

// ---------- draw ----------
let hover=null;
function draw(){
  if(anim)anim();
  if(st.lay!=='grid'){
  N.forEach(n=>{const dx=n.tx-n.x,dy=n.ty-n.y;if(Math.abs(dx)+Math.abs(dy)>0.3){n.x+=dx*0.14;n.y+=dy*0.14}else{n.x=n.tx;n.y=n.ty}});
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.translate(view.x,view.y);ctx.scale(view.s,view.s);
  const sel=st.sel;
  if(sel&&visSet.has(sel)){ctx.strokeStyle=css.getPropertyValue('--link');ctx.lineWidth=1/view.s;I.nb[sel.i].forEach(j=>{const b=N[j];if(!visSet.has(b))return;ctx.beginPath();ctx.moveTo(sel.x,sel.y);ctx.lineTo(b.x,b.y);ctx.stroke()})}
  const near=sel?new Set([sel,...I.nb[sel.i].map(j=>N[j])]):null;
  const vr=cv.getBoundingClientRect(),[vx0,vy0]=toWorld(-60,-60),[vx1,vy1]=toWorld(vr.width+60,vr.height+60);
  const px=TW*view.s*DPR,lv=need(px*1.05),useAtlas=px<=72;const round=TW*view.s>22,rad=Math.min(TW*0.1,9/view.s);
  const cx=(vx0+vx1)/2,cy=(vy0+vy1)/2;N.forEach(n=>n._vis=false);
  for(const n of VIS){if(n.x<vx0||n.x>vx1||n.y<vy0||n.y>vy1)continue;n._vis=true;const w=TW,h=TW/n.ar;ctx.globalAlpha=near&&!near.has(n)?0.16:1;
    let im=useAtlas?null:best(n,lv);
    if(!useAtlas&&!n.lod[lv]&&!anim){const k=n.i+'@'+lv;if(!want.has(k))want.set(k,{n,lv,p:-Math.hypot(n.x-cx,n.y-cy)})}
    if(round){ctx.save();ctx.beginPath();ctx.roundRect(n.x-w/2,n.y-h/2,w,h,rad);ctx.clip()}
    if(im)ctx.drawImage(im,n.x-w/2,n.y-h/2,w,h);else{const a=n.a,A=atlas[a[0]];if(A)ctx.drawImage(A,a[1],a[2],a[3],a[4],n.x-w/2,n.y-h/2,w,h)}
    if(round)ctx.restore()}
  for(const[k,v]of want)if(!v.n._vis||v.lv!==lv)want.delete(k);
  pump();ctx.globalAlpha=1;ctx.lineWidth=2.5/view.s;const o=4/view.s;
  [[hover,'--fg'],[sel,'--accent']].forEach(([n,c])=>{if(!n||!visSet.has(n))return;const col=css.getPropertyValue(c);ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=18;const w=TW,h=TW/n.ar;
    ctx.beginPath();ctx.roundRect(n.x-w/2-o,n.y-h/2-o,w+2*o,h+2*o,rad+o);ctx.stroke();ctx.shadowBlur=0});
  drawLabels()}
  requestAnimationFrame(draw)}
requestAnimationFrame(draw);

// ---------- interaction ----------
function toWorld(cx,cy){return[(cx-view.x)/view.s,(cy-view.y)/view.s]}
function pick(cx,cy){const[wx,wy]=toWorld(cx,cy);for(let k=VIS.length-1;k>=0;k--){const n=VIS[k],w=TW,h=TW/n.ar;if(wx>=n.x-w/2&&wx<=n.x+w/2&&wy>=n.y-h/2&&wy<=n.y+h/2)return n}return null}
function zoomAt(cx,cy,f){const s=Math.max(0.03,Math.min(60,view.s*f));const k=s/view.s;view={s,x:cx-(cx-view.x)*k,y:cy-(cy-view.y)*k}}
let drag=null,moved=false;const pts=new Map();let pinch=null;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);anim=null;
  if(pts.size===2){const[a,b]=[...pts.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),s:view.s}}else{drag={x:e.clientX,y:e.clientY,vx:view.x,vy:view.y};moved=false}});
cv.addEventListener('pointermove',e=>{if(pts.has(e.pointerId))pts.set(e.pointerId,[e.clientX,e.clientY]);
  if(pinch&&pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);const r=cv.getBoundingClientRect();zoomAt((a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top,(pinch.s*d/pinch.d)/view.s);return}
  if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4){moved=true;cv.classList.add('drag')}if(moved){view.x=drag.vx+dx;view.y=drag.vy+dy}return}
  const r=cv.getBoundingClientRect();const n=pick(e.clientX-r.left,e.clientY-r.top);if(n!==hover){hover=n;showTip(n,e)}else if(n)moveTip(e)});
cv.addEventListener('pointerup',e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;cv.classList.remove('drag');
  if(drag&&!moved){const r=cv.getBoundingClientRect();const n=pick(e.clientX-r.left,e.clientY-r.top);select(n)}drag=null});
cv.addEventListener('pointerleave',()=>{hover=null;$('#tip').hidden=true});
cv.addEventListener('wheel',e=>{e.preventDefault();anim=null;const r=cv.getBoundingClientRect();
  if(e.ctrlKey||Math.abs(e.deltaY)>Math.abs(e.deltaX)&&!e.shiftKey&&e.deltaMode!==0||!e.deltaX&&Math.abs(e.deltaY)>=40)zoomAt(e.clientX-r.left,e.clientY-r.top,Math.exp(-e.deltaY*0.0018*(e.ctrlKey?4:1)));
  else{view.x-=e.deltaX;view.y-=e.deltaY}},{passive:false});
function showTip(n,e){const t=$('#tip');if(!n){t.hidden=true;return}const p=PR[n.p];
  t.innerHTML=`<img alt="" src="${url(n.i,160)}"><div><b>${esc(p.t)}</b><span>${p.y||''} · ${esc(p.ty)} · ${esc(D.doc[I.dc[n.i]])}</span></div>`;t.hidden=false;moveTip(e)}
function moveTip(e){const t=$('#tip');t.style.left=Math.min(innerWidth-310,e.clientX+16)+'px';t.style.top=(e.clientY+16)+'px'}
addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;if(e.key==='Escape'){if(st.sel)select(null);else if(!$('#side').hidden)openSide(null)}
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const L=VIS.filter(n=>n.p===(st.sel&&st.sel.p));if(!st.sel||!L.length)return;let k=L.indexOf(st.sel);k=(k+(e.key==='ArrowRight'?1:-1)+L.length)%L.length;select(L[k]);centerOn(L[k])}});
function centerOn(n){const r=cv.getBoundingClientRect();const s=Math.max(view.s,2.2);tweenView({s,x:r.width/2-n.tx*s,y:r.height/2-n.ty*s})}
$('#zin').onclick=()=>{const r=cv.getBoundingClientRect();anim=null;zoomAt(r.width/2,r.height/2,1.5)};
$('#zout').onclick=()=>{const r=cv.getBoundingClientRect();anim=null;zoomAt(r.width/2,r.height/2,1/1.5)};
$('#zfit').onclick=()=>fit(true);

// ---------- detail panel ----------
const plink=(pid,role)=>`<button class="lk" data-person="${pid}" type="button">${esc(PE[pid])}</button>`;
function select(n){st.sel=n;const P=$('#panel');if(!n){P.hidden=true;return}P.hidden=false;const i=n.i,p=PR[n.p];
  $('#pimg').src=url(i,1000);$('#pimg').alt=p.t;
  const rows=[];const add=(k,v)=>{if(v)rows.push(`<dt>${k}</dt><dd>${v}</dd>`)};
  add('Année',p.y);add('Formation',p.lv==='BA'?'Bachelor':p.lv==='MA'?'Master':'Bachelor et Master');add('Type',esc(p.ty));
  if(I.au[i].length)add('Image de',I.au[i].map(x=>plink(x)).join(', '));
  add('Étudiant·e·s',p.stu.slice(0,40).map(x=>plink(x)).join(', ')+(p.stu.length>40?' …':''));
  add('Encadrement',p.tea.map(x=>plink(x)).join(', '));add('Assistanat',p.ass.map(x=>plink(x)).join(', '));
  if(p.men&&p.men.length)add('Cité·e·s',p.men.map(x=>plink(x)).join(', '));
  add('Prix',esc(p.prz.join(', ')));add('Lieu',esc(p.pl));add('Photo',esc(I.ph[i]));
  add('Source',`<a href="${esc(p.url)}" target="_blank" rel="noopener">${p.src==='MAIA'?'head-maia.ch':'head.hesge.ch'}</a>`);
  $('#pbody').innerHTML=`<div><div class="n">${esc(p.t)}</div><div class="s">${esc(D.credits[I.cr[i]]||'')}</div></div>
    <div class="acts"><a class="pri" href="${orig(i)}" target="_blank" rel="noopener">Original</a><button class="sec" type="button" id="pproj">Tout le projet · ${itemsOfProj[n.p].length}</button></div>
    <dl class="meta">${rows.join('')}</dl>
    <div class="auto">Estimé automatiquement : ${esc(D.doc[I.dc[i]])} (${Math.round(I.dp[i]*100)} %) · cadrage ${esc(D.frame[I.fc[i]]).toLowerCase()} (${Math.round(I.fp[i]*100)} %)</div>
    ${p.d?`<div class="desc">${esc(p.d)}${p.d.length>=700?' …':''}</div>`:''}
    <div><h3>Images voisines</h3><div class="nb">${I.nb[i].slice(0,8).map(j=>`<button type="button" data-n="${j}" title="${esc(PR[N[j].p].t)}"><img loading="lazy" alt="" src="${url(j,160)}"></button>`).join('')}</div></div>`;
  $('#pproj').onclick=()=>{F.proj=n.p;refresh();setTargets();fit(true)};
  $('#pbody').querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const m=N[+b.dataset.n];if(!visSet.has(m)){F.proj=null;F.person=null;refresh()}select(m);centerOn(m)});
  bindPeople($('#pbody'))}
function bindPeople(root){root.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>{F.person=+b.dataset.person;F.proj=null;refresh();setTargets();fit(true);if($('#side').hidden)openSide('f')})}
$('#pclose').onclick=()=>select(null);

// ---------- side drawer ----------
function openSide(tab){const s=$('#side');document.body.classList.toggle('sideopen',!!tab);if(!tab){s.hidden=true;$('#bF').setAttribute('aria-pressed',false);$('#bA').setAttribute('aria-pressed',false);return}
  s.hidden=false;s.dataset.tab=tab;$('#bF').setAttribute('aria-pressed',tab==='f');$('#bA').setAttribute('aria-pressed',tab==='a');renderSide()}
$('#bF').onclick=()=>openSide($('#side').hidden||$('#side').dataset.tab!=='f'?'f':null);
$('#bA').onclick=()=>openSide($('#side').hidden||$('#side').dataset.tab!=='a'?'a':null);
$('#sclose').onclick=()=>openSide(null);
function counts(skip,fn){const c=new Map();N.forEach(n=>{if(!pass(n,skip))return;const k=fn(n);c.set(k,(c.get(k)||0)+1)});return c}
function chipRow(set,opts,skip,fn,colorOf){const c=counts(skip,fn);return opts.map(([v,t],k)=>`<button type="button" aria-pressed="${set.has(v)}" data-v="${esc(v)}">${colorOf?`<i style="background:${colorOf(v)}"></i>`:''}${esc(t)}<sup>${(c.get(v)||0).toLocaleString('fr-CH')}</sup></button>`).join('')}
function renderSide(){const s=$('#side'),b=$('#sbody');if(s.hidden)return;$('#stitle').textContent=s.dataset.tab==='f'?'Filtres':'Analyse';
  if(s.dataset.tab==='f')renderFilters(b);else renderAnalysis(b)}
function renderFilters(b){
  const act=[];if(F.person!=null)act.push(`<button type="button" data-x="person">${esc(PE[F.person])}</button>`);if(F.proj!=null)act.push(`<button type="button" data-x="proj">${esc(PR[F.proj].t)}</button>`);
  const tys=[...new Set(PR.map(p=>p.ty))].sort();
  b.innerHTML=`<div class="srch"><input id="q" type="search" placeholder="Personne, projet…" autocomplete="off" aria-label="Chercher une personne ou un projet"><div class="sugg" id="sugg"></div></div>
   ${act.length?`<div class="active">${act.join('')}</div>`:''}
   <div class="fs"><h4>Années <button type="button" data-reset="y">Tout</button></h4><div class="yr"><output id="yro"></output><div class="dual"><div class="tr"><i id="yrt"></i></div><input id="ya" type="range" min="${Y0}" max="${Y1}" value="${F.y0}" aria-label="Première année"><input id="yb" type="range" min="${Y0}" max="${Y1}" value="${F.y1}" aria-label="Dernière année"></div></div></div>
   <div class="fs"><h4>Formation</h4><div class="chips" data-f="lv">${chipRow(F.lv,[['BA','Bachelor'],['MA','Master']],'lv',n=>PR[n.p].lv==='BA+MA'?'BA':PR[n.p].lv)}</div></div>
   <div class="fs"><h4>Type de projet</h4><div class="chips" data-f="ty">${chipRow(F.ty,tys.map(t=>[t,t]),'ty',n=>PR[n.p].ty)}</div></div>
   <div class="fs"><h4>Type d'image <span>estimé</span></h4><div class="chips" data-f="dc">${chipRow(F.dc,D.doc.map((t,k)=>[k,t]),'dc',n=>I.dc[n.i],v=>SCOL(famOf[v]))}</div></div>
   <div class="fs"><h4>Cadrage <span>estimé</span></h4><div class="chips" data-f="fc">${chipRow(F.fc,D.frame.map((t,k)=>[k,t]),'fc',n=>I.fc[n.i])}</div></div>
   <div class="fs"><h4>Source</h4><div class="chips" data-f="src">${chipRow(F.src,[['HEAD','head.hesge.ch'],['MAIA','head-maia.ch']],'src',n=>PR[n.p].src)}</div></div>
   <label class="tg"><input type="checkbox" id="fprize" ${F.prize?'checked':''}> Projets primés seulement</label>
   <label class="tg"><input type="checkbox" id="fdup" ${F.dup?'checked':''}> Masquer les doublons (même image publiée deux fois)</label>
   <p class="note">Sources : fiches projets du site HEAD (architecture d'intérieur, Bachelor et Master) et site du MAIA. Les types d'image et cadrages sont estimés par un modèle et peuvent se tromper.</p>`;
  const ya=$('#ya'),yb=$('#yb');const yshow=()=>{const a=+ya.value,c=+yb.value;$('#yro').textContent=a===c?a:`${Math.min(a,c)} – ${Math.max(a,c)}`;const l=(Math.min(a,c)-Y0)/(Y1-Y0||1)*100,r=(Math.max(a,c)-Y0)/(Y1-Y0||1)*100;$('#yrt').style.left=l+'%';$('#yrt').style.width=(r-l)+'%'};yshow();
  let yT=null;[ya,yb].forEach(x=>x.oninput=()=>{yshow();clearTimeout(yT);yT=setTimeout(()=>{F.y0=Math.min(+ya.value,+yb.value);F.y1=Math.max(+ya.value,+yb.value);refreshKeep()},120)});
  b.querySelectorAll('.chips').forEach(c=>c.onclick=e=>{const t=e.target.closest('button');if(!t)return;const set=F[c.dataset.f];let v=t.dataset.v;if(c.dataset.f==='dc'||c.dataset.f==='fc')v=+v;set.has(v)?set.delete(v):set.add(v);refresh();setTargets()});
  b.querySelectorAll('[data-reset]').forEach(x=>x.onclick=()=>{F.y0=Y0;F.y1=Y1;refresh()});
  b.querySelectorAll('[data-x]').forEach(x=>x.onclick=()=>{F[x.dataset.x]=null;refresh();fit(true)});
  $('#fprize').onchange=e=>{F.prize=e.target.checked;refresh()};$('#fdup').onchange=e=>{F.dup=e.target.checked;refresh()};
  const q=$('#q');q.oninput=()=>suggest(q.value)}
function refreshKeep(){const a=document.activeElement&&document.activeElement.id;refresh();if(a&&$('#'+a))$('#'+a).focus()}
const fold=s=>s.normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase();
const PEf=PE.map(fold),PRf=PR.map(p=>fold(p.t));
function suggest(v){const s=$('#sugg');v=fold(v.trim());if(v.length<2){s.innerHTML='';return}
  const pp=[];PEf.forEach((n,k)=>{if(n.includes(v))pp.push(k)});const pj=[];PRf.forEach((n,k)=>{if(n.includes(v))pj.push(k)});
  s.innerHTML=pp.slice(0,8).map(k=>`<button type="button" data-person="${k}">${esc(PE[k])}<span>${pprojs[k].length} projet${pprojs[k].length>1?'s':''}</span></button>`).join('')+
    pj.slice(0,8).map(k=>`<button type="button" data-proj="${k}">${esc(PR[k].t)}<span>${PR[k].y||''} · projet</span></button>`).join('');
  bindPeople(s);s.querySelectorAll('[data-proj]').forEach(b=>b.onclick=()=>{F.proj=+b.dataset.proj;F.person=null;refresh();setTargets();fit(true)})}
// ---------- analysis ----------
function stackChart(rows,keys,colorOf,label){// rows: [{y,c:{k:n},t}] 100% stacked bars
  const W=356,Hc=150,pad=22,bw=(W-4)/rows.length,gap=Math.min(4,bw*0.25);let svg=`<svg viewBox="0 0 ${W} ${Hc+pad}" role="img" aria-label="${esc(label)}">`;
  rows.forEach((r,k)=>{let y=Hc;const x=2+k*bw;keys.forEach(c=>{const v=r.c[c]||0;if(!v||!r.t)return;const h=v/r.t*Hc;y-=h;svg+=`<rect x="${x.toFixed(1)}" y="${(y+1).toFixed(1)}" width="${(bw-gap).toFixed(1)}" height="${Math.max(0,h-2).toFixed(1)}" rx="2" fill="${colorOf(c)}"/>`});
    if(rows.length<=18||k%2===0)svg+=`<text class="ax" x="${(x+(bw-gap)/2).toFixed(1)}" y="${Hc+14}" text-anchor="middle">${String(r.y).slice(2)}</text>`;
    svg+=`<rect class="hit" data-k="${k}" x="${x.toFixed(1)}" y="0" width="${bw.toFixed(1)}" height="${Hc}"/>`});
  return svg+'</svg>'}
function renderAnalysis(b){
  const ys=years.filter(y=>y>=F.y0&&y<=F.y1);const byY={};ys.forEach(y=>byY[y]={t:0,fam:{},fc:{},n:[]});
  const projs=new Set(),ppl=new Map();
  VIS.forEach(n=>{const p=PR[n.p];const r=byY[p.y];if(r){r.t++;r.fam[famOf[I.dc[n.i]]]=(r.fam[famOf[I.dc[n.i]]]||0)+1;r.fc[I.fc[n.i]]=(r.fc[I.fc[n.i]]||0)+1;r.n.push(n)}projs.add(n.p)});
  projs.forEach(k=>new Set(projPeople(k)).forEach(x=>ppl.set(x,(ppl.get(x)||0)+1)));
  const famRows=ys.map(y=>({y,t:byY[y].t,c:byY[y].fam})),fcRows=ys.map(y=>({y,t:byY[y].t,c:byY[y].fc}));
  const top=[...ppl.entries()].sort((a,c)=>c[1]-a[1]).slice(0,14);
  b.innerHTML=`<div class="kpi"><div><b>${VIS.length.toLocaleString('fr-CH')}</b><span>images</span></div><div><b>${projs.size}</b><span>projets</span></div><div><b>${ppl.size}</b><span>personnes</span></div></div>
   <div class="fs chart" id="c1"><h4>Types d'image par année <span>part, estimée</span></h4>${stackChart(famRows,FAM.map((_,k)=>k),k=>SCOL(k),"Part de chaque type d'image par année")}
     <div class="lg">${FAM.map(([t],k)=>`<span><i style="background:${SCOL(k)}"></i>${esc(t)}</span>`).join('')}</div></div>
   <div class="fs chart" id="c2"><h4>Cadrages par année <span>part, estimée</span></h4>${stackChart(fcRows,D.frame.map((_,k)=>k),k=>SCOL(k),'Part de chaque cadrage par année')}
     <div class="lg">${D.frame.map((t,k)=>`<span><i style="background:${SCOL(k)}"></i>${esc(t)}</span>`).join('')}</div></div>
   <div class="fs strip"><h4>Couleurs dominantes par année <span>triées par teinte</span></h4><canvas id="cs" width="712" height="${ys.length*22}" style="height:${ys.length*11}px" aria-label="Couleurs dominantes par année"></canvas></div>
   <div class="fs"><h4>Personnes les plus présentes <span>projets</span></h4><div class="ppl">${top.map(([k,v])=>{const roles=new Set();pprojs[k].forEach(p=>{if(projs.has(p))roles.add(roleOf(p,k))});
     const yy=pprojs[k].map(p=>PR[p].y).filter(Boolean);return`<button type="button" data-person="${k}">${esc(PE[k])}<span>${v}</span><small>${[...roles].join(', ')} · ${Math.min(...yy)}${Math.max(...yy)!==Math.min(...yy)?' – '+Math.max(...yy):''}</small></button>`}).join('')}</div></div>
   <p class="note">Les graphiques suivent les filtres. Clic sur une barre : n'afficher que cette année. Clic sur une personne : ses projets.</p>`;
  const tip=$('#vtip');
  [['#c1',famRows,FAM.map(f=>f[0])],['#c2',fcRows,D.frame]].forEach(([id,rows,names])=>{b.querySelectorAll(id+' .hit').forEach(h=>{const r=rows[+h.dataset.k];
    h.onmouseenter=e=>{tip.innerHTML=`<b>${r.y}</b> · ${r.t} images<br>`+names.map((t,k)=>r.c[k]?`${esc(t)} : ${Math.round(r.c[k]/r.t*100)} %`:'').filter(Boolean).join('<br>');tip.hidden=false};
    h.onmousemove=e=>{tip.style.left=(e.clientX+14)+'px';tip.style.top=(e.clientY+14)+'px'};h.onmouseleave=()=>tip.hidden=true;
    h.onclick=()=>{tip.hidden=true;F.y0=F.y1=r.y;refresh();setTargets();fit(true)}})});
  const c=$('#cs'),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
  ys.forEach((y,k)=>{const L=byY[y].n.slice().sort((a,d)=>(I.sat[a.i]<0.05)-(I.sat[d.i]<0.05)||I.hue[a.i]-I.hue[d.i]);const w=c.width/(L.length||1);L.forEach((n,j)=>{g.fillStyle='#'+I.dom[n.i];g.fillRect(j*w,k*22,Math.ceil(w),20)})});
  c.onclick=e=>{const r=c.getBoundingClientRect();const k=Math.floor((e.clientY-r.top)/r.height*ys.length);const y=ys[k];if(y){F.y0=F.y1=y;refresh();setTargets();fit(true)}};
  bindPeople(b)}

// ---------- project grid ----------
function renderGrid(){const g=$('#grid');g.innerHTML='';const by=new Map();VIS.forEach(n=>{if(!by.has(n.p))by.set(n.p,[]);by.get(n.p).push(n)});
  const ps=[...by.keys()].sort((a,b)=>(PR[b].y||0)-(PR[a].y||0)||PR[a].ty.localeCompare(PR[b].ty)||PR[a].t.localeCompare(PR[b].t));let cy=null;const frag=document.createDocumentFragment();
  ps.forEach(k=>{const p=PR[k];if(p.y!==cy){cy=p.y;const h=document.createElement('h2');h.textContent=p.y||'Sans date';frag.append(h)}
    const s=document.createElement('section');s.className='gp';const who=[...p.stu.slice(0,6),...p.tea.slice(0,3)].map(x=>PE[x]).join(', ');
    s.innerHTML=`<header><b>${esc(p.t)}</b><span>${esc(p.ty)} · ${p.lv==='MA'?'Master':p.lv==='BA'?'Bachelor':'BA et MA'}${who?' · '+esc(who):''}${p.prz.length?' · '+esc(p.prz.join(', ')):''}</span><a href="${esc(p.url)}" target="_blank" rel="noopener">Source ↗</a></header><div class="row">${by.get(k).map(n=>`<button type="button" data-n="${n.i}"><img loading="lazy" alt="" src="${url(n.i,480)}" width="${Math.round(150*n.ar)}" height="150"></button>`).join('')}</div>`;
    frag.append(s)});
  g.append(frag);g.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>select(N[+b.dataset.n]))}

// ---------- layout switch, attraction ----------
const gl=$('#gLay');LAYOUTS.forEach(l=>{const b=document.createElement('button');b.type='button';b.textContent=l.t;b.dataset.k=l.k;b.onclick=()=>setLay(l.k);gl.append(b)});
const ind=document.createElement('span');ind.className='ind';gl.prepend(ind);
function moveInd(){const b=gl.querySelector('[aria-pressed="true"]');if(!b)return;ind.style.width=b.offsetWidth+'px';ind.style.transform=`translateX(${b.offsetLeft}px)`}
function setLay(k){st.lay=k;save();try{history.replaceState(null,'','#'+(k==='grid'?'projets':k))}catch(e){}
  gl.querySelectorAll('button[data-k]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));requestAnimationFrame(moveInd);
  document.body.classList.toggle('isgrid',k==='grid');$('#grid').hidden=k!=='grid';$('#cv').hidden=k==='grid';
  const L=LAYOUTS.find(l=>l.k===k);$('#legend').innerHTML=L.d?L.d+'<span class="hint">Clic pour voir une image · glisser pour se déplacer · molette pour zoomer</span>':'';
  if(k==='grid')renderGrid();else{ensure(k);setTargets();setTimeout(()=>fit(true),40)}}
const spc=$('#spc'),spo=$('#spco');let spT=null;
function showAtt(){spo.innerHTML=st.att+'<small>%</small>';spc.style.setProperty('--p',st.att+'%')}
function setAtt(v){st.att=Math.round(Math.max(0,Math.min(100,v)));spc.value=st.att;showAtt();save();clearTimeout(spT);spT=setTimeout(()=>{if(st.lay!=='grid'){applyLayout(st.lay);setTargets()}},30)}
spc.addEventListener('input',()=>setAtt(+spc.value));$('#sless').onclick=()=>setAtt(st.att-10);$('#smore').onclick=()=>setAtt(st.att+10);
spc.value=st.att;showAtt();
addEventListener('resize',moveInd);
addEventListener('hashchange',()=>{const h=location.hash.slice(1);const k=h==='projets'?'grid':h;if(LAYOUTS.some(l=>l.k===k)&&k!==st.lay)setLay(k)});
$('#loading').hidden=true;
refresh();setLay(st.lay);if(st.lay!=='grid'){ensure(st.lay);setTargets();N.forEach(n=>{n.x=n.tx;n.y=n.ty});fit(false)}
window.__mx={N,VIS:()=>VIS,setLay,setAtt,F,refresh,openSide,select};
})();
