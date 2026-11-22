/* Carte du serveur ARCHI : graphe radial explorable, arborescence, fiche de dossier */
(function(){
'use strict';
const A=window.APP,{esc}=A;const {T,EXT}=window.SRV;
const BY={};T.forEach(t=>{t.ch=[];BY[t.id]=t});T.forEach(t=>{if(t.pa)BY[t.pa].ch.push(t)});
const depth=t=>t.pa?depth(BY[t.pa])+1:0;T.forEach(t=>t.dp=depth(t));
const anc=t=>{const a=[];let x=t;while(x){a.unshift(x);x=x.pa?BY[x.pa]:null}return a};
const desc=t=>t.ch.reduce((s,c)=>s+1+desc(c),0);T.forEach(t=>t.nd=desc(t));
/* familles : chaque dossier de premier niveau prend la couleur de son domaine */
const GR={lime:['Pilotage et signatures','#dcf26c',['s00','s01']],pink:['Communication','#f5a8bd',['s02']],lilac:['Formation et étudiant·es','#c7b6f7',['s10','s11','s22']],cobalt:['Recherche et international','#2f5cf0',['s12','s14']],orange:['Ressources et mandats','#f26a3d',['s13','s30','s31','s32','s33']],mint:['Santé et égalité','#bcd5b6',['s20','s21']],olive:['Archives des ateliers','#6f7d4f',['atl']],grey:['Vides et archives','#b9b6ad',['s23','s34','s35','s99']]};
const G0={};Object.entries(GR).forEach(([k,v])=>v[2].forEach(id=>G0[id]=k));
T.forEach(t=>{const a=anc(t);const top=a.find(x=>G0[x.id]);t.g=top?G0[top.id]:null});
const short=t=>{const m=t.l.match(/^(\d{2})\s*[–-]/);return t.id==='atl'?'AT':m?m[1]:''};
const USE={f:['Utilisé toute l\'année','#121212'],s:['Utilisé à certaines périodes','#f26a3d'],r:['Consulté comme référence','#c7b6f7'],a:['Archive','#b9b6ad'],v:['Vide','transparent']};
const LENS=[['dom','Domaines'],['use','Rythme d\'usage'],['plat','Lien avec la plateforme'],['agent','Index de l\'agent']];
let LZ='dom',ROOT='root',SEL=null,HOV=null,Q='',MODE=null,VB=null,OPEN=new Set(['root','adm']);
const fill=t=>{if(t.id==='root')return'#121212';
 if(LZ==='dom')return t.g?GR[t.g][1]:'#121212';
 if(LZ==='use')return t.u?USE[t.u][1]:'#e2dfd7';
 if(LZ==='plat')return t.m?'#dcf26c':'var(--g3)';
 if(LZ==='agent')return t.x?'#e6483a':t.u==='v'?'transparent':'#c7b6f7';return'#ccc'};
const match=t=>{if(!Q)return true;const w=Q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');return (t.l+' '+(t.d||'')+' '+(t.f||[]).join(' ')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(w)};

/* ---------- disposition radiale : feuilles sur l'anneau extérieur, dossiers à leur profondeur ---------- */
/* à la racine, ADMINISTRATION et ATELIERS deviennent un anneau intérieur : leurs dossiers partent directement du centre */
const kids=t=>t.id==='root'&&ROOT==='root'?[BY.atl,...BY.adm.ch]:t.ch;
function layout(){const R=BY[ROOT];const nodes=[];const leaves=t=>kids(t).length?kids(t).reduce((s,c)=>s+leaves(c),0):1;
 const dep=(t,d)=>kids(t).length?Math.max(...kids(t).map(c=>dep(c,d+1))):d;const D=dep(R,0);
 const RL=Math.max(240,Math.min(520,leaves(R)*4.6));
 const rad=d=>d===0?0:RL*(D<=2?d/(D+.6):(.42+.46*(d-1)/Math.max(1,D-1)));
 const tot=leaves(R),gap=tot>40?0.03:0.1;const arcs=[];
 (function place(t,a0,a1,d){const a=(a0+a1)/2;const leaf=!kids(t).length;const r=leaf&&d>0?RL:rad(d);nodes.push({t,a,r,x:r*Math.cos(a),y:r*Math.sin(a),d,leaf,p:d===1&&ROOT==='root'?'root':t.pa});
  let s=a0;const span=a1-a0;const L=leaves(t);kids(t).forEach(c=>{const w=span*leaves(c)/L;place(c,s,s+w,d+1);s+=w})})(R,-Math.PI/2+gap/2,1.5*Math.PI-gap/2,0);
 const P={};nodes.forEach(n=>P[n.t.id]=n);
 if(ROOT==='root'){const ad=nodes.filter(n=>n.d===1&&n.t.pa==='adm');arcs.push({t:BY.adm,a0:Math.min(...ad.map(n=>n.a)),a1:Math.max(...ad.map(n=>n.a))},{t:BY.atl,a0:P.atl.a-.06,a1:P.atl.a+.06})}
 return{nodes,P,RL,arcs}}
let LY=null;
const nr=n=>n.d===0?20:n.d===1?Math.max(8,5.5+Math.sqrt(n.t.nd)*1.15):n.leaf?4.2:Math.max(4.5,3+Math.sqrt(n.t.nd)*1.3);
function linkPath(p,c){const a1=p.a,a2=c.a,rm=(p.r+c.r)/2;const pt=(a,r)=>`${(r*Math.cos(a)).toFixed(1)},${(r*Math.sin(a)).toFixed(1)}`;return `M${pt(a1,p.r)}C${pt(a1,rm)} ${pt(a2,rm)} ${pt(a2,c.r)}`}
function draw(){const svg=A.$('#srvsvg');if(!svg)return;if(NEEDFIT||!VB)doFit(svg);if(!VB)return;const {nodes,P,RL}=LY;const k=svg.clientWidth/VB[2];const u=1/k;
 const hot=new Set();if(HOV){anc(HOV).forEach(x=>hot.add(x.id))}if(SEL){anc(SEL).forEach(x=>hot.add(x.id))}
 const many=nodes.length>60;const nl=nodes.filter(n=>n.leaf).length;const fsL=Math.max(7.5,Math.min(11.5,2*Math.PI*RL*k/Math.max(1,nl)*.88));const zr=k/FITK;let s='';
 nodes.forEach(n=>{if(!n.p||!P[n.p])return;const p=P[n.p];const on=hot.has(n.t.id)&&(hot.has(p.t.id)||n.p==='root');const dim=Q&&!match(n.t);s+=`<path vector-effect="non-scaling-stroke" class="lk${on?' hot':''}" data-c="${n.t.id}"${n.p==='root'?' data-r="1"':''} d="${linkPath(p,n)}" fill="none" opacity="${dim?.25:1}"/>`});
 if(LY.arcs&&LY.arcs.length){const rr=LY.RL*.24;const need=l=>(l.length*7.2+26)*u/rr;const at=LY.arcs[1],ad=LY.arcs[0];const ha=Math.max(at.a1-at.a0,need('ATELIERS'))/2,am=(at.a0+at.a1)/2;const A0=am-ha,A1=am+ha;
  [[ad.t,A1+.16,A0+2*Math.PI-.16],[at.t,A0,A1]].forEach(([t,a0,a1],i)=>{const pt=a=>`${(rr*Math.cos(a)).toFixed(1)} ${(rr*Math.sin(a)).toFixed(1)}`;const mid=(a0+a1)/2%(2*Math.PI);const flip=Math.sin(mid)>0;const large=a1-a0>Math.PI?1:0;const d=flip?`M${pt(a1)} A${rr} ${rr} 0 ${large} 0 ${pt(a0)}`:`M${pt(a0)} A${rr} ${rr} 0 ${large} 1 ${pt(a1)}`;
   s+=`<g class="sn ring" data-id="${t.id}"><path id="rg${i}" d="${d}" fill="none" stroke="${SEL===t?'var(--red)':t.id==='atl'?'#6f7d4f':'#121212'}" stroke-width="${20*u}" stroke-linecap="round"/><text font-size="${10*u}" font-weight="600" letter-spacing=".06em" fill="#f2f0eb" class="nh" dy="${4*u}"><textPath href="#rg${i}" startOffset="50%" text-anchor="middle">${t.l}</textPath></text></g>`})}
 nodes.forEach(n=>{const t=n.t;const r=nr(n)*u;const dim=Q&&!match(t);const sel=SEL===t;const big=r>=9&&t.id!=='root';
  s+=`<g class="sn" data-id="${t.id}" transform="translate(${n.x.toFixed(1)},${n.y.toFixed(1)})" opacity="${dim?.18:1}" style="cursor:pointer">`;
  if(sel)s+=`<circle vector-effect="non-scaling-stroke" r="${r+6*u}" fill="none" stroke="var(--red)" stroke-width="2.5"/>`;
  if(Q&&!dim&&t.id!=='root')s+=`<circle vector-effect="non-scaling-stroke" r="${r+4*u}" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="2 2"/>`;
  s+=`<circle vector-effect="non-scaling-stroke" r="${r}" fill="${fill(t)}" stroke="${t.u==='v'||fill(t)==='transparent'?'var(--g)':'var(--ink)'}" stroke-width="${t.u==='v'?1.2:1}" ${t.u==='v'?'stroke-dasharray="2 2"':''}/>`;
  if(t.id===ROOT)s+=`<text text-anchor="middle" y="${4*u}" font-size="${(ROOT==='root'?11:9)*u}" font-weight="600" fill="#f2f0eb" class="nh">${esc(ROOT==='root'?'ARCHI':'↑')}</text>`;
  else if(big&&short(t))s+=`<text text-anchor="middle" y="${4*u}" font-size="${10.5*u}" font-weight="600" fill="${t.g==='cobalt'||t.g==='olive'||LZ==='use'&&t.u==='f'?'#fff':'#121212'}" class="nh">${short(t)}</text>`;
  /* étiquette radiale : feuilles toujours, dossiers quand la vue est légère, au survol ou au zoom */
  const showL=t.id!==ROOT&&(n.leaf||!many||zr>1.9||sel||HOV===t);
  if(showL){let deg=n.a*180/Math.PI;const flip=deg>90&&deg<270;const off=r+5*u;const lab=t.l.length>30?t.l.slice(0,29)+'…':t.l;
   s+=`<text class="sl${hot.has(t.id)?' on':''}" transform="rotate(${flip?deg-180:deg})" x="${flip?-off:off}" y="${3.6*u}" text-anchor="${flip?'end':'start'}" font-size="${(n.leaf?fsL:11.5)*u}" font-weight="${hot.has(t.id)||!n.leaf?600:400}">${esc(lab)}</text>`}
  s+=`</g>`});
 svg.setAttribute('viewBox',VB.join(' '));svg.innerHTML=s;
 if(!svg.dataset.b){svg.dataset.b=1;const tip=t=>`<b>${esc(t.l)}</b><i>${t.ch.length?t.ch.length+' sous-dossier'+(t.ch.length>1?'s':'')+' · ':''}${t.u?USE[t.u][0]:'cliquer pour la fiche'}</i>`;
  svg.addEventListener('mouseover',e=>{const g=e.target.closest('.sn');if(!g){if(HOV){HOV=null;hilite()}return}const t=BY[g.dataset.id];if(HOV!==t){HOV=t;hilite()}A.showTip(e,tip(t))});
  svg.addEventListener('mousemove',e=>{const g=e.target.closest('.sn');if(g)A.showTip(e,tip(BY[g.dataset.id]));else A.hideTip()});
  svg.addEventListener('mouseleave',()=>{HOV=null;hilite();A.hideTip()});
  svg.addEventListener('click',e=>{const g=e.target.closest('.sn');if(!g)return;const t=BY[g.dataset.id];A.hideTip();if(t.id===ROOT&&ROOT!=='root'){refocus(BY[ROOT].pa||'root');return}select(t)})}}
/* survol : on surligne le chemin sans redessiner */
function hilite(){const svg=A.$('#srvsvg');if(!svg)return;const hot=new Set();if(HOV)anc(HOV).forEach(x=>hot.add(x.id));if(SEL)anc(SEL).forEach(x=>hot.add(x.id));
 svg.querySelectorAll('.lk').forEach(l=>{const c=BY[l.dataset.c];l.classList.toggle('hot',hot.has(c.id)&&(hot.has(c.pa)||l.dataset.r==='1'))});
 svg.querySelectorAll('.sn').forEach(g=>g.classList.toggle('hot',hot.has(g.dataset.id)))}
let NEEDFIT=true,FITK=1;
function fitAll(){NEEDFIT=true;const svg=A.$('#srvsvg');if(svg)doFit(svg)}
function doFit(svg){const r=svg.getBoundingClientRect();if(!r.width)return;const S=Math.min(r.width,r.height)/2;const kk=Math.max(.18,(S-190)/LY.RL);FITK=kk;const R=S/kk;const ratio=r.height/r.width;VB=ratio<1?[-R/ratio,-R,2*R/ratio,2*R]:[-R,-R*ratio,2*R,2*R*ratio];NEEDFIT=false}
function refocus(id){ROOT=id;LY=layout();NEEDFIT=true;A.render()}
function select(t){SEL=t;draw();panel()}
/* ---------- fiche du dossier ---------- */
function panel(){const el=A.$('#srvp');if(!el)return;const t=SEL||BY[ROOT];const a=anc(t);
 const ext=EXT.filter(x=>x.to.includes(t.id));
 el.innerHTML=`<div class="crumb">${a.map(x=>`<button data-go="${x.id}">${esc(x.l)}</button>`).join('<span>›</span>')}</div>
 <h3>${esc(t.l)}</h3>
 <div class="chips sp">${t.g?`<span class="spill" style="--c:${GR[t.g][1]}">${GR[t.g][0]}</span>`:''}${t.u?`<span class="spill" style="--c:${USE[t.u][1]==='transparent'?'var(--bg)':USE[t.u][1]}">${USE[t.u][0]}</span>`:''}${t.x?'<span class="spill r">Hors de l\'index de l\'agent</span>':''}</div>
 ${t.d?`<p class="sd">${esc(t.d)}</p>`:''}
 ${t.w?`<p class="sm"><b>Qui y travaille</b> ${esc(t.w)}</p>`:''}
 ${t.f?`<p class="sm"><b>Fichiers cités</b></p><div class="chips">${t.f.map(f=>`<span class="path">${esc(f)}</span>`).join('')}</div>`:''}
 ${t.ch.length?`<p class="sm"><b>${t.ch.length} sous-dossier${t.ch.length>1?'s':''}</b></p><div class="chips">${t.ch.map(c=>`<button class="chip" data-sel="${c.id}">${esc(c.l)}</button>`).join('')}</div>`:''}
 ${ext.length?`<p class="sm"><b>Lié hors d'ARCHI</b></p>${ext.map(x=>`<p class="sm" style="margin:4px 0">${esc(x.l)}</p>`).join('')}`:''}
 ${t.q?'<p class="sw">Emplacement déduit de l\'ordre du guide : à vérifier sur ARCHI.</p>':''}
 ${t.x?'<p class="sw">Données sensibles : l\'agent ne lit pas ce dossier, conformément aux exclusions prévues.</p>':''}
 <div class="bar" style="margin-top:14px">${t.m?`<a class="bt" href="#${t.m}">Ouvrir « ${esc((A.MODLAB||{})[t.m]||t.m)} »</a>`:''}${t.ch.length&&t.id!==ROOT?`<button class="bt gh" data-focus="${t.id}">Centrer la carte ici</button>`:''}${ROOT!=='root'&&t.id===ROOT?`<button class="bt gh" data-focus="${BY[ROOT].pa||'root'}">Remonter d'un niveau</button>`:''}</div>
 ${t.p?`<p class="muted" style="font-size:12.5px;margin:12px 0 0">Guide de passation, page ${t.p}${t.p>1?'':' (introduction)'}.</p>`:''}`;
 el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const x=BY[b.dataset.go];if(!anc(x).includes(BY[ROOT])){refocus(x.id)}else select(x)});
 el.querySelectorAll('[data-sel]').forEach(b=>b.onclick=()=>{const x=BY[b.dataset.sel];if(MODE==='tree'){OPEN.add(x.pa);SEL=x;A.render()}else select(x)});
 el.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{SEL=BY[b.dataset.focus];refocus(b.dataset.focus)})}
/* ---------- arborescence ---------- */
function treeHTML(t,lvl){const open=OPEN.has(t.id)||!!Q;const kids=Q?t.ch.filter(c=>match(c)||c.nd&&T.some(x=>anc(x).includes(c)&&match(x))):t.ch;
 return `<div class="tr${SEL===t?' on':''}${Q&&match(t)&&t.id!=='root'?' hit':''}" style="padding-left:${lvl*18+8}px" data-tr="${t.id}">${t.ch.length?`<button class="tg" data-tg="${t.id}" aria-label="Déplier">${open?'▾':'▸'}</button>`:'<span class="tg"></span>'}<i class="dotc" style="background:${fill(t)};${t.u==='v'?'border:1px dashed var(--g)':''}"></i><span class="tl2">${esc(t.l)}</span>${t.ch.length?`<small>${t.nd}</small>`:''}${t.m?'<small class="mk">plateforme</small>':''}${t.x?'<small class="mk r">exclu</small>':''}</div>${open?kids.map(c=>treeHTML(c,lvl+1)).join(''):''}`}

A.VIEWS.serveur={html(){if(!MODE)MODE=innerWidth<760?'tree':'graph';if(!LY){LY=layout();NEEDFIT=true}
 const folders=T.length-1,act=T.filter(t=>t.u==='f').length,linked=T.filter(t=>t.m).length,excl=T.filter(t=>t.x).length,inf=T.filter(t=>t.q).length,empty=T.filter(t=>t.u==='v').length;
 return A.vh({k:'Qualité et mémoire · le serveur ARCHI en un coup d\'œil',t:`${folders} dossiers d'ARCHI, <em>${act} utilisés toute l'année</em>`,l:'L\'arborescence du serveur, reconstituée depuis le guide de passation. Chaque point est un dossier : un clic ouvre sa fiche, avec ce qu\'on y trouve, qui y travaille et le module de la plateforme qui s\'en sert. Les lentilles changent ce que dit la couleur.',f:['1.4','7.1'],how:['Reconstitue l\'arborescence d\'ARCHI depuis le guide, relie chaque dossier au module qui s\'en sert, et signale ce que l\'agent ne lit pas.','Ouvrir les dossiers un par un pour comprendre où se trouve quoi, et chercher dans 52 pages de guide le dossier d\'une procédure.',['Guide de passation (novembre 2026)','ARCHI › ADMINISTRATION','ARCHI › ATELIERS','Serveur N','Groupes Teams']]})+
 `<div class="kpis">${A.kpi('Dossiers cartographiés',folders,'cités par le guide')}${A.kpi('Liés à la plateforme',linked,'un module s\'en sert')}${A.kpi('Hors index de l\'agent',excl,'données sensibles')}${A.kpi('À vérifier sur ARCHI',inf,'emplacement déduit')}${A.kpi('Dossiers vides',empty,'présents dans le plan HES-SO')}</div>
 <div class="srvbar"><div class="seg">${[['graph','Graphe'],['tree','Arborescence']].map(([k,l])=>`<button class="${MODE===k?'on':''}" data-mode="${k}">${l}</button>`).join('')}</div>
  <div class="seg">${LENS.map(([k,l])=>`<button class="${LZ===k?'on':''}" data-lens="${k}">${l}</button>`).join('')}</div>
  <label class="srvq"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><input type="search" id="srvq" placeholder="Chercher un dossier : facture, stage, syllabus…" value="${esc(Q)}" aria-label="Chercher un dossier"></label></div>
 <div class="srvl">${LZ==='dom'?Object.values(GR).map(([l,c])=>`<span><i style="background:${c}"></i>${l}</span>`).join(''):LZ==='use'?Object.values(USE).map(([l,c])=>`<span><i style="background:${c};${c==='transparent'?'border:1px dashed var(--g)':''}"></i>${l}</span>`).join('')+'<span class="muted">lecture du guide</span>':LZ==='plat'?'<span><i style="background:#dcf26c"></i>Un module de la plateforme s\'en sert</span><span><i style="background:var(--g3)"></i>Consulté directement sur ARCHI</span>':'<span><i style="background:#c7b6f7"></i>Indexé, en lecture seule</span><span><i style="background:#e6483a"></i>Exclu : données sensibles</span><span><i style="border:1px dashed var(--g)"></i>Vide</span>'}</div>
 <div class="srvw"><div class="srvg">${MODE==='graph'?`<svg id="srvsvg" role="img" aria-label="Graphe de l'arborescence ARCHI"></svg><div class="srvz"><button data-z="in" aria-label="Zoomer">+</button><button data-z="out" aria-label="Dézoomer">−</button><button data-z="fit">Tout voir</button>${ROOT!=='root'?'<button data-z="up">↑ Tout ARCHI</button>':''}</div><p class="srvh">Glisser pour déplacer, molette pour zoomer, clic sur un point pour sa fiche.</p>`:`<div class="srvt">${treeHTML(BY['root'],0)}</div>`}</div>
 <aside class="srvp" id="srvp"></aside></div>
 <section class="pn" style="margin-top:20px"><h2>Autour d'ARCHI<span>cités par le guide</span></h2><p class="sub">Une partie du travail vit ailleurs. Survoler une carte montre les dossiers qui s'y rattachent.</p><div class="srvx">${EXT.map(x=>`<button class="srvc" data-ext="${x.id}"><b>${esc(x.l)}</b><span>${esc(x.d)}</span><small>${x.to.length} dossier${x.to.length>1?'s':''} lié${x.to.length>1?'s':''}</small></button>`).join('')}</div></section>`},
 bind(){A.$$('[data-mode]').forEach(b=>b.onclick=()=>{MODE=b.dataset.mode;A.render()});A.$$('[data-lens]').forEach(b=>b.onclick=()=>{LZ=b.dataset.lens;A.render()});
  const q=A.$('#srvq');q.oninput=()=>{Q=q.value.trim();if(MODE==='graph'){draw();A.$('.srvl')}else{const p=q.selectionStart;A.render();const q2=A.$('#srvq');q2.focus();q2.setSelectionRange(p,p)}};
  q.onkeydown=e=>{if(e.key==='Enter'){const t=T.find(x=>x.id!=='root'&&match(x));if(t){if(!anc(t).includes(BY[ROOT]))refocus('root');select(t)}}};
  panel();
  A.$$('.srvc').forEach(c=>{const x=EXT.find(y=>y.id===c.dataset.ext);c.onmouseenter=()=>{if(MODE!=='graph')return;HOV=null;const svg=A.$('#srvsvg');x.to.forEach(id=>{const g=svg.querySelector(`[data-id="${id}"] circle:last-of-type`);if(g){g.setAttribute('stroke','var(--red)');g.setAttribute('stroke-width','3')}})};c.onmouseleave=()=>draw();c.onclick=()=>{const t=BY[x.to[0]];if(MODE==='graph'){if(!anc(t).includes(BY[ROOT]))refocus('root');select(t)}else{anc(t).forEach(a=>OPEN.add(a.id));SEL=t;A.render()}}});
  if(MODE==='tree'){A.$$('[data-tg]').forEach(b=>b.onclick=e=>{e.stopPropagation();const id=b.dataset.tg;OPEN.has(id)?OPEN.delete(id):OPEN.add(id);A.render()});A.$$('[data-tr]').forEach(r=>r.onclick=()=>{SEL=BY[r.dataset.tr];if(SEL.ch.length)OPEN.add(SEL.id);A.render()});return}
  const svg=A.$('#srvsvg');requestAnimationFrame(draw);
  const toW=(cx,cy)=>{const r=svg.getBoundingClientRect();const k=VB[2]/r.width;return[VB[0]+(cx-r.left)*k,VB[1]+(cy-r.top)*(VB[3]/r.height)]};
  const zoom=(f,cx,cy)=>{const r=svg.getBoundingClientRect();if(cx==null){cx=r.left+r.width/2;cy=r.top+r.height/2}const [wx,wy]=toW(cx,cy);const nw=Math.min(Math.max(VB[2]*f,LY.RL*.35),LY.RL*8);const s=nw/VB[2];VB=[wx-(wx-VB[0])*s,wy-(wy-VB[1])*s,nw,VB[3]*s];draw()};
  svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.15:1/1.15,e.clientX,e.clientY)},{passive:false});
  let drag=null;svg.addEventListener('pointerdown',e=>{if(e.target.closest('.sn'))return;drag={x:e.clientX,y:e.clientY,v:VB.slice()};svg.setPointerCapture(e.pointerId);svg.classList.add('drag')});
  svg.addEventListener('pointermove',e=>{if(!drag)return;const r=svg.getBoundingClientRect();const k=VB[2]/r.width;VB=[drag.v[0]-(e.clientX-drag.x)*k,drag.v[1]-(e.clientY-drag.y)*k,VB[2],VB[3]];draw()});
  svg.addEventListener('pointerup',()=>{drag=null;svg.classList.remove('drag')});
  A.$$('[data-z]').forEach(b=>b.onclick=()=>{const z=b.dataset.z;if(z==='in')zoom(1/1.35);else if(z==='out')zoom(1.35);else if(z==='fit'){NEEDFIT=true;draw()}else refocus('root')});
  new ResizeObserver(()=>{const r=svg.getBoundingClientRect();if(!r.width)return;if(NEEDFIT||!VB){doFit(svg)}else{const ratio=r.height/r.width;const cy=VB[1]+VB[3]/2;VB[3]=VB[2]*ratio;VB[1]=cy-VB[3]/2}draw()}).observe(svg)}};
A.MODLAB&&(A.MODLAB.serveur='Carte du serveur');
})();
