(function(){
'use strict';
const D=window.D,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Number(n).toLocaleString('fr-CH').replace(/[ ,’']/g,' ');
const sc=t=>t===t.toUpperCase()?t.charAt(0)+t.slice(1).toLowerCase():t;
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const SK=Object.keys(D.S);
const S=k=>D.S[k]?`<a class="s" href="${D.S[k][1]}" target="_blank" rel="noopener" title="${esc(D.S[k][0])}">${SK.indexOf(k)+1}</a>`:'';
const SS=(...ks)=>ks.map(S).join('');
const img=(h,w)=>D.CDN+h+'/'+(w||480)+'.webp';
const dfr=d=>d.split('-').reverse().join('.');
const tip=$('#tip');
const showTip=(e,h)=>{tip.innerHTML=h;tip.style.opacity=1;const r=tip.getBoundingClientRect();tip.style.left=Math.min(e.clientX+16,innerWidth-r.width-12)+'px';tip.style.top=Math.min(e.clientY+16,innerHeight-r.height-12)+'px'};
const hideTip=()=>{tip.style.opacity=0};
const drawer=$('#drawer'),dbody=$('#dbody');
const openD=h=>{dbody.innerHTML=h;drawer.classList.add('open');drawer.scrollTop=0};
$('#dx').onclick=()=>drawer.classList.remove('open');
document.addEventListener('keydown',e=>{if(e.key==='Escape')drawer.classList.remove('open')});
const allMods=[...Object.values(D.BA).flat(),...Object.values(D.MA).flat()];
const MAset=new Set(Object.values(D.MA).flat());

/* ---------- couverture : les images, par année ---------- */
(function field(){
 const cv=$('#field'),ctx=cv.getContext('2d');const Y0=2011,Y1=2026,NY=Y1-Y0+1;
 const by=[...Array(NY)].map(()=>[]);D.IM.forEach(r=>{const y=D.PR[r[0]].y;if(y>=Y0&&y<=Y1)by[y-Y0].push(r)});
 const grp=r=>r[7]<.12?(r[8]<.55?0:2):1;by.forEach(a=>a.sort((p,q)=>grp(p)-grp(q)||(grp(p)===1?p[6]-q[6]:p[8]-q[8])));
 const tot=by.reduce((a,b)=>a+b.length,0);
 $('#fieldCap').innerHTML=`${fmt(tot)} images publiées par la filière sur les sites de la HEAD et de head-maia.ch, de ${Y0} à ${Y1}, rangées par année puis par couleur. Chaque point est une image : le survol la montre, le clic ouvre son projet. ${SS('proj','mx')}`;
 const atl=[...Array(6)].map((_,i)=>{const im=new Image();im.src=`../media-explorer/head-ai/atlas_${i}.webp`;return im});
 let L=null;
 function layout(){const W=cv.parentElement.clientWidth,gap=Math.max(8,W/120),cw=W/NY,inner=cw-gap,mx=Math.max(...by.map(a=>a.length));
  let s=14;for(;s>3;s--){const per=Math.floor(inner/s);if(Math.ceil(mx/per)*s<=Math.min(480,innerHeight*.55))break}
  const per=Math.floor(inner/s),H=Math.ceil(mx/per)*s;L={W,H,cw,s,per};
  const dpr=devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  $('#fieldYears').style.gridTemplateColumns=`repeat(${NY},1fr)`;$('#fieldYears').innerHTML=by.map((a,i)=>`<span><b>${Y0+i}</b>${a.length}</span>`).join('')}
 function draw(){if(!L)return;ctx.fillStyle='#0b0b0b';ctx.fillRect(0,0,L.W,L.H);
  by.forEach((a,yi)=>a.forEach((r,k)=>{const x=yi*L.cw+(k%L.per)*L.s,y=L.H-(Math.floor(k/L.per)+1)*L.s;const im=atl[r[1]];
   if(im.complete&&im.naturalWidth){const w=r[4],h=r[5],m=Math.min(w,h);ctx.drawImage(im,r[2]+(w-m)/2,r[3]+(h-m)/2,m,m,x,y,L.s-(L.s>5?1:0),L.s-(L.s>5?1:0))}
   else{ctx.fillStyle='#2a2a2a';ctx.fillRect(x,y,L.s-1,L.s-1)}}))}
 function hit(e){const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const yi=Math.floor(x/L.cw);if(yi<0||yi>=NY)return null;
  const cx=Math.floor((x-yi*L.cw)/L.s);if(cx>=L.per)return null;const row=Math.floor((L.H-y)/L.s);const k=row*L.per+cx;return by[yi][k]||null}
 cv.onmousemove=e=>{const r=hit(e);if(!r){hideTip();return}const p=D.PR[r[0]];
  showTip(e,`<img src="${img(r[9],480)}" alt=""><b>${esc(p.t)}</b><i>${p.y} · ${p.lv==='MA'?'Master':'Bachelor'} · ${esc(p.ty)}</i>`)};
 cv.onmouseleave=hideTip;cv.onclick=e=>{const r=hit(e);if(r)proj(r[0])};
 layout();draw();atl.forEach(im=>im.onload=draw);let t;addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(()=>{layout();draw()},150)});
})();
$('#index').innerHTML=[['parcours','Parcours','Les deux formations, module par module'],['annee','Année','Le calendrier 2026-2027 et sa charge'],['personnes','Personnes','Équipes, encadrement, studios du MAIA'],['memoire','Mémoire','633 fiches de projets à interroger'],['rayonnement','Rayonnement','Expositions et conférences depuis 2018'],['workshop','Workshop','Le cas pratique, piloté semaine par semaine'],['arbitrage','Arbitrage','Les critères budgétaires en fonctionnement'],['sources','Sources','Méthode, limites et documents']]
 .map((c,i)=>`<li><a href="#${c[0]}"><i>0${i+1}</i><b>${c[1]}</b><span>${c[2]}</span><span>↓</span></a></li>`).join('');

/* ---------- 01 parcours ---------- */
const FAM={atel:'Atelier ou studio',ws:'Workshop',theo:'Théorie',tech:'Technique et professionnel',repr:'Représentation',trans:'Transversal',thesis:'Thèse',pro:'Pratique professionnelle',rech:'Formation à la recherche',jma:'Joint Master of Architecture'};
function plan(el,prog,lab){el.innerHTML=Object.entries(prog).map(([s,ms])=>`<div class="sem"><header>${lab}${s}<span>${ms.reduce((a,m)=>a+m.e,0)}</span></header>${ms.map(m=>`<div class="m k-${m.k}${m.e>=6?' big':''}" data-c="${m.c}" title="${esc(m.t)}" style="height:${Math.max(36,m.e*12.5)}px"><b>${m.c.startsWith('TRANS')?'PRAT / THEO':m.c} · ${m.e}</b><span class="t">${esc(m.t)}</span></div>`).join('')}</div>`).join('')}
plan($('#gBA'),D.BA,'S');plan($('#gMA'),D.MA,'MAIA ');
$('.plans').insertAdjacentHTML('afterend',`<p class="plegend">Trait épais : ateliers et studios. Hachures : thèses. Chiffre : crédits ECTS. ${SS('peba','pema','dba','dma')}</p>`);
const PF=[['none','Tout'],['ai','IA citée dans le descriptif'],['rem','Remédiation possible'],['part','Présence évaluée'],['stage','Stage possible']];
$('#pf').innerHTML='<span class="lab">Montrer</span>'+PF.map((f,i)=>`<button data-f="${f[0]}"${i?'':' class="on"'}>${f[1]}</button>`).join('');
$$('#pf button').forEach(b=>b.onclick=()=>{$$('#pf button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;
 $$('.m').forEach(el=>{const m=allMods.find(x=>x.c===el.dataset.c);el.classList.toggle('hit',f!=='none'&&!!m[f]);el.classList.toggle('off',f!=='none'&&!m[f])})});
$$('.m').forEach(el=>el.onclick=()=>{const m=allMods.find(x=>x.c===el.dataset.c),ma=MAset.has(m);const sem=Object.entries(ma?D.MA:D.BA).find(([s,ms])=>ms.includes(m))[0];
 const rem=m.c==='16BT'?'Aucune (règlement Bachelor, art. 35 al. 3)':m.rem?'Possible à 3.5, par un travail complémentaire':'Aucune';
 const ai=m.ai?(m.k==='trans'?'Le catalogue des modules transversaux pratiques cite l\'intelligence artificielle parmi les technologies enseignées.':ma?'Le descriptif vise des intérieurs numériques intégrant réalité virtuelle, réseaux sociaux, jeux vidéo et intelligence artificielle.':'Le descriptif demande de « se familiariser avec les changements de la profession liés à l\'intelligence artificielle ».'):'';
 openD(`<p class="lab">${ma?'Master MAIA':'Bachelor'} · semestre ${sem} · ${m.e} ECTS</p><h3>${esc(m.t)}</h3><dl>
 <dt>Code</dt><dd>${m.c.startsWith('TRANS')?'PRAT / THEO':m.c}</dd><dt>Famille</dt><dd>${FAM[m.k]}</dd><dt>Contenu</dt><dd>${esc(m.u)}</dd>
 <dt>Validation</dt><dd>Note finale minimale de 4.0, crédits attribués en bloc</dd><dt>Remédiation</dt><dd>${rem}</dd>
 <dt>Présence</dt><dd>${m.part?'Évaluée : plus de 20 % d\'absence vaut 1.0, ou « absence justifiée »':'Hors évaluation'}</dd>
 ${ai?`<dt>IA</dt><dd>${ai}</dd>`:''}${m.stage?'<dt>Stage</dt><dd>Un stage approuvé avant le semestre par le responsable de filière peut valoir les 9 ECTS du module.</dd>':''}
 <dt>Logiciels</dt><dd>${m.k==='trans'?'Selon le cours choisi':'L\'étudiant indique les applicatifs et logiciels utilisés, et précise leur usage à la demande de l\'enseignant.'}</dd>
 <dt>Sources</dt><dd>${SS(ma?'pema':'peba',ma?'dma':'dba',ma?'regma':'regba')}</dd></dl>`)});
const nAI=allMods.filter(m=>m.ai&&m.k!=='trans').length,nWS=allMods.filter(m=>m.k==='ws'&&m.part).length;
$('#facts').innerHTML=[
 [nAI,`descriptifs citent déjà l'intelligence artificielle : les cinq ateliers de projet du Bachelor, la représentation 1, le BIM 1 à 3 et le module numérique du MAIA.`,SS('dba','dma')],
 [59,`descriptifs demandent à chaque étudiant d'indiquer les logiciels utilisés pour son travail.`,SS('dba','dma')],
 [5,`jurés au minimum pour chaque thèse, dont trois externes, au Bachelor comme au MAIA.`,SS('regba','regma')],
 [nWS,`modules workshop où la présence est évaluée : au-delà de 20 % d'absence, la note est 1.0.`,SS('dba','dma')],
].map((f,i)=>`<div><p class="lab">${['Intelligence artificielle','Logiciels','Jurys de thèse','Présence'][i]}</p><b>${f[0]}</b><p>${f[1]}${f[2]}</p></div>`).join('');
const KEYS=[
 ['Ateliers',`Un atelier de projet par semestre de S1 à S5, 9 ECTS. En S5, un stage approuvé avant le semestre peut valoir l'atelier.${SS('peba','dba')}`,`Un atelier de conception de S1 à S3, 9, 12 puis 12 ECTS, confié à des enseignants et à des agences invitées.${SS('pema','mmod')}`],
 ['Projets',`Mandats réels avec des entreprises, des institutions culturelles et des associations.${S('ba')}`,`Projets avec institutions et industriels ; recherches Scènes de Nuit, Forced Reuse, The Future of Humanitarian Design.${S('ma')}`],
 ['Workshops',`Semaine inaugurale chaque automne (14-18.09.2026), Semaine de tous les possibles ou autre workshop chaque printemps (22-26.02.2027).${SS('peba','cal','sdtlp')}`,`HEAD – Camondo en S1 et S3 ; Semaine de tous les possibles et workshop avec le MA Design Installation en S2.${SS('pema','mmod')}`],
 ['Évaluations',`Note 4.0, crédits en bloc, aucune remédiation pour les ateliers ni pour la thèse. Résultats d'automne le 22.01.2027 à 17h, dans IS-Academia.${SS('regba','cal')}`,`Note 4.0, remédiation à 3.5 quand le descriptif la prévoit, mémoire de Master compris ; aucune pour les ateliers et le projet de diplôme.${SS('regma','dma')}`],
 ['Jurys',`Du 18 au 22.01 et du 14 au 23.06.2027. Thèse : 5 jurés, dont 3 externes, validés par la direction ; soutenance d'environ 45 minutes.${SS('cal','regba')}`,`Thèse pratique : au moins 2 jurés de la filière et 3 extérieurs, validés par le responsable, après validation de S1 à S3.${S('regma')}`],
 ['Mobilité',`Un ou deux semestres après une année validée, sur learning agreement. Vœux du 15 au 30.11.2026 pour l'automne 2027.${SS('out','reghes')}`,`Mêmes règles ; partenaires réguliers : Joint Master of Architecture (Genève, Fribourg, Berthoud) et École Camondo.${SS('out','ma')}`],
 ['Diplôme',`Bachelor Thesis, 18 ECTS : mémoire d'environ 20 000 signes et projet. Fête des diplômes le 07.07.2027.${SS('dba','cal')}`,`Master Thesis, 9 et 21 ECTS. En 2026 : exposition des thèses le 19.02, Milan Design Week du 20 au 26.04, diplômes du 05 au 08.06.${SS('pema','mev')}`],
 ['Admission',`Deux tours : dossiers du 9 au 15.03, entretiens en français du 12 au 16.04.2027.${SS('cal','selba')}`,`Deux tours : dossiers du 30.03 au 07.04, entretiens en anglais du 28.04 au 07.05.2027.${SS('cal','selma')}`],
];
$('#keys').innerHTML=`<div class="row head"><span></span><span></span><span>Bachelor</span><span>MAIA</span></div>`+KEYS.map((k,i)=>`<div class="row"><span class="n">0${i+1}</span><span class="h">${k[0]}</span><span>${k[1]}</span><span>${k[2]}</span></div>`).join('');

/* ---------- 02 année ---------- */
(function year(){
 const W=D.CAL.length,cw=24,lx=118,top=40,rows=[['ecole','École'],['adm','Admissions'],['mob','Mobilité'],['maia','MAIA']],rh=30;
 const d0=new Date(D.CAL[0][0]+'T00:00:00'),wi=ds=>Math.floor((new Date(ds+'T00:00:00')-d0)/6048e5),dow=ds=>(new Date(ds+'T00:00:00').getDay()+6)%7;
 const load=new Array(W).fill(0);D.CAL.forEach((c,i)=>{if(c[3]==='jury')load[i]+=4;if(c[3]==='rem')load[i]+=1});
 D.EV.forEach(e=>{if(!e[4])return;for(let i=Math.max(0,wi(e[0]));i<=Math.min(W-1,wi(e[1]));i++)load[i]+=e[4]});
 const mx=Math.max(...load),by=top+rows.length*rh+24,bh=70,H=by+bh+40,Wd=lx+W*cw+8;
 const F={pre:'#e7e4dd',inau:'url(#h)',hc:'url(#h)',sdtlp:'url(#h)',cours:'#f2f0eb',jury:'#121212',rem:'#8b887f',sans:'#d8d5ce',ferm:'#b9b6ad'};
 let s=`<svg width="${Wd}" height="${H}" font-family="Archivo" font-size="10"><defs><pattern id="h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#f2f0eb"/><line x1="0" y1="0" x2="0" y2="4" stroke="#121212" stroke-width="1.2"/></pattern></defs>`;
 const MO=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];let pm=-1;
 D.CAL.forEach((c,i)=>{const d=new Date(c[0]+'T00:00:00'),x=lx+i*cw;if(d.getMonth()!==pm){pm=d.getMonth();s+=`<text x="${x}" y="11" fill="#121212" font-weight="600" letter-spacing=".08em">${MO[pm].toUpperCase()}${pm===0||i===0?' '+d.getFullYear():''}</text><line x1="${x}" x2="${x}" y1="16" y2="${by+bh}" stroke="rgba(18,18,18,.12)"/>`}
  s+=`<rect class="wk" data-i="${i}" x="${x+1}" y="${top-18}" width="${cw-2}" height="14" fill="${F[c[3]]}" stroke="rgba(18,18,18,.35)" stroke-width=".5"/>`});
 s+=`<text x="0" y="${top-7}" fill="#8b887f" font-weight="600" letter-spacing=".1em">SEMAINES</text>`;
 rows.forEach(([k,lb],ri)=>{const y=top+ri*rh+12;s+=`<text x="0" y="${y+4}" fill="#121212" font-weight="600" letter-spacing=".1em">${lb.toUpperCase()}</text><line x1="${lx}" x2="${Wd}" y1="${y}" y2="${y}" stroke="rgba(18,18,18,.2)"/>`;
  D.EV.forEach((e,ei)=>{if(e[3]!==k)return;const a=wi(e[0]),b=wi(e[1]);const x=lx+Math.max(0,a)*cw+(a<0?0:dow(e[0])/7*cw),x2=lx+Math.min(W-1,b)*cw+(dow(e[1])+1)/7*cw;
   s+=e[0]===e[1]?`<circle class="ev" data-k="${ei}" cx="${x+cw/14}" cy="${y}" r="${e[4]>=2?4:3}" fill="#121212"/>`:`<rect class="ev" data-k="${ei}" x="${x}" y="${y-(e[4]?3:1.5)}" width="${Math.max(4,x2-x)}" height="${e[4]?6:3}" fill="${e[4]?'#121212':'#b9b6ad'}"/>`})});
 s+=`<text x="0" y="${by+bh-4}" fill="#121212" font-weight="600" letter-spacing=".1em">CHARGE</text><line x1="${lx}" x2="${Wd}" y1="${by+bh}" y2="${by+bh}" stroke="#121212"/>`;
 load.forEach((v,i)=>{const h=v/mx*bh;if(h)s+=`<rect class="ld" data-i="${i}" x="${lx+i*cw+4}" y="${by+bh-h}" width="${cw-8}" height="${h}" fill="${v>=6?'#e6483a':'#121212'}"/>`});
 [['2026-11-13','aujourd\'hui'],['2026-12-01','prise de fonction']].forEach(([d,l],k)=>{const x=lx+wi(d)*cw+dow(d)/7*cw;s+=`<line x1="${x}" x2="${x}" y1="${top-24}" y2="${by+bh+14+k*12}" stroke="#e6483a" stroke-dasharray="${k?'2 3':'0'}"/><text x="${x+4}" y="${by+bh+14+k*12}" fill="#e6483a" font-weight="600" letter-spacing=".06em">${l.toUpperCase()} ${dfr(d).slice(0,5)}</text>`});
 $('#year').innerHTML=s+'</svg>';
 $$('#year .wk').forEach(r=>{const c=D.CAL[r.dataset.i];r.onmousemove=e=>showTip(e,`<b>${esc(c[1])}</b><i>semaine du ${dfr(c[0])}${c[2]?' · '+c[2]:''}</i>`);r.onmouseleave=hideTip});
 $$('#year .ev').forEach(r=>{const e=D.EV[r.dataset.k];r.style.cursor='pointer';r.onmousemove=ev=>showTip(ev,`<b>${esc(e[2])}</b><i>${dfr(e[0])}${e[1]!==e[0]?' au '+dfr(e[1]):''} · ${esc(D.S[e[5]][0])}</i>`);r.onmouseleave=hideTip;r.onclick=()=>open(D.S[e[5]][1])});
 $$('#year .ld').forEach(r=>{const i=+r.dataset.i,c=D.CAL[i];const it=D.EV.filter(e=>e[4]&&wi(e[0])<=i&&wi(e[1])>=i).map(e=>esc(e[2]));r.onmousemove=ev=>showTip(ev,`<b>Semaine du ${dfr(c[0])} · indice ${load[i]}</b><i>${[c[3]==='jury'?'Jurys':'',c[3]==='rem'?'Remédiations':'',...it].filter(Boolean).join('<br>')}</i>`);r.onmouseleave=hideTip});
 $('#ynote').innerHTML=`Cases : blanc, cours ; hachures, semaine inaugurale, « hors cadre » et Semaine de tous les possibles ; noir, jurys ; gris, remédiations, semaines sans cours et fermetures. L'indice de charge additionne un poids par échéance (jurys 4, tours de concours et délais de résultats 3, autres 1 ou 2) : un outil de lecture, sans valeur officielle. Les dates 2027 des expositions du MAIA ne sont pas publiées ; repères 2026 : ${D.REP.map(r=>`<a href="${r[2]}" target="_blank" rel="noopener">${esc(r[1])}</a>`).join(', ')}. ${SS('cal','admba','admma','out','in')}`;
})();

/* ---------- 03 personnes ---------- */
(function(){const T=D.TEAM,roles=Object.keys(T.BA),dir=['Javier Fernández Contreras','Valentina De Luigi','Lucie Landenbergue'];
 const both=new Set(Object.values(T.BA).flat().filter(n=>Object.values(T.MA).flat().includes(n)&&!dir.includes(n)));
 const cell=ns=>ns.map(n=>`<span${both.has(n)?' class="sh"':''}>${esc(n)}${D.AFF[n]?` <small>${esc(D.AFF[n])}</small>`:''}</span>`).join('');
 $('#team').innerHTML=`<div class="row head"><span></span><span>Bachelor ${S('ba')}</span><span>MAIA ${S('ma')}</span></div>`+roles.map(r=>`<div class="row"><span class="h">${r}</span><div>${cell(T.BA[r])}</div><div>${cell(T.MA[r])}</div></div>`).join('')+
 `<p class="note">En rouge, les ${both.size} personnes publiées dans les deux formations. Responsable, adjointe et secrétariat sont communs.</p>`})();
(function(){const c={};D.PR.forEach((p,i)=>p.te.forEach(n=>{(c[n]=c[n]||{BA:0,MA:0,ys:[],ps:[]});c[n][p.lv==='MA'?'MA':'BA']++;if(p.y)c[n].ys.push(p.y);c[n].ps.push(i)}));
 const L=Object.entries(c).sort((a,b)=>b[1].ps.length-a[1].ps.length).slice(0,30),mx=L[0][1].ps.length;
 $('#tea').innerHTML=L.map(([n,v],i)=>`<li data-n="${esc(n)}"><i>${String(i+1).padStart(2,'0')}</i><span>${esc(n)}</span><span class="ln" style="width:${v.ps.length/mx*100}%"><span style="width:${v.BA/v.ps.length*100}%;background:#121212"></span><span style="width:${v.MA/v.ps.length*100}%;background:#b9b6ad"></span></span><span class="c">${v.ps.length}</span></li>`).join('');
 $('#teaNote').innerHTML=`<p>Les ${D.PR.length} fiches de projets citent ${Object.keys(c).length} personnes à l'encadrement. La liste donne les trente plus présentes ; noir pour le Bachelor, gris pour le Master. Un clic ouvre la liste de leurs projets, chacun lié à sa fiche.</p><p>Les noms sont repris tels qu'écrits sur les fiches : une même personne peut apparaître sous deux formes, par exemple Irma Cilacian et Irma Cilacian Gandolfi. ${SS('proj','mx')}</p>`;
 $$('#tea li').forEach(li=>li.onclick=()=>{const v=c[li.dataset.n];openD(`<p class="lab">Encadrement · ${v.ps.length} fiches · ${Math.min(...v.ys)} à ${Math.max(...v.ys)}</p><h3>${esc(li.dataset.n)}</h3><ol>${v.ps.sort((a,b)=>(D.PR[b].y||0)-(D.PR[a].y||0)).map(i=>{const p=D.PR[i];return `<li><a href="${p.u}" target="_blank" rel="noopener">${esc(p.t)}</a> <small>${p.y||''} · ${p.lv} · ${esc(p.ty)}</small></li>`}).join('')}</ol>`)})})();
(function(){const K={studio:'Studio',module:'Module',jma:'JMA',workshop:'Workshop',thesis:'Thèse'};let f='all';
 const clean=w=>w.replace(/^(STUDIO|WORKSHOP[^:]*|JMA[^:]*|JOINT MASTER OF ARCHITECTURE)\s*:?\s*/i,'').replace(/\s*\/\s*/g,', ').trim();
 $('#mf').innerHTML=`<span class="lab">Montrer</span><button data-k="all" class="on">Tout ${D.MODS.length}</button>`+Object.entries(K).map(([k,v])=>`<button data-k="${k}">${v} ${D.MODS.filter(m=>m.k===k).length}</button>`).join('')+`<span class="lab">${S('mmod')}</span>`;
 function draw(){const sems=[...new Set(D.MODS.map(m=>m.s))];$('#mods').innerHTML=sems.map(s=>{const ms=D.MODS.filter(m=>m.s===s&&(f==='all'||m.k===f));if(!ms.length)return'';
  return `<div class="ms"><header>${s.replace('Fall','Automne').replace('Spring','Printemps')}<span>${ms.length}</span></header>${ms.map(m=>`<div class="mi"><i>${K[m.k]}</i>${esc(sc(m.t))}<span>${esc(sc(clean(m.w)||m.w))}</span></div>`).join('')}</div>`}).join('')}
 $$('#mf button').forEach(b=>b.onclick=()=>{$$('#mf button').forEach(x=>x.classList.toggle('on',x===b));f=b.dataset.k;draw()});draw()})();

/* ---------- 04 mémoire ---------- */
const TYPES=['Semestre','Diplôme','Workshop','Exposition','Partenariat','Actualité','Projet','Recherche','Cours','Événement','Symposium'];
$('#ft').innerHTML='<option value="">Tous les types</option>'+TYPES.map(t=>`<option>${t}</option>`).join('');
$('#fy').innerHTML='<option value="">Toutes les années</option>'+[...new Set(D.PR.map(p=>p.y).filter(Boolean))].sort((a,b)=>b-a).map(y=>`<option>${y}</option>`).join('');
let N=24;
function filt(){const q=norm($('#q').value.trim()),lv=$('#fl').value,t=$('#ft').value,y=$('#fy').value;
 return D.PR.map((p,i)=>i).filter(i=>{const p=D.PR[i];if(lv&&!p.lv.includes(lv))return false;if(t&&p.ty!==t)return false;if(y&&String(p.y)!==y)return false;
  return !q||norm([p.t,p.pl,...p.te,...p.st,...p.asx,...p.pa,...p.pz].join(' ')).includes(q)}).sort((a,b)=>(D.PR[b].y||0)-(D.PR[a].y||0))}
function wall(){const L=filt();$('#mcount').textContent=`${L.length} fiches`;
 $('#wall').innerHTML=L.slice(0,N).map(i=>{const p=D.PR[i];return `<div class="card" data-i="${i}"><div class="im" style="background-image:${p.h.length?`url(${img(p.h[0],480)})`:'none'}"></div><b>${esc(p.t)}</b><span>${p.y||''} · ${p.lv==='MA'?'Master':'Bachelor'} · ${esc(p.ty)}</span></div>`}).join('');
 $('#moreb').style.display=L.length>N?'':'none';$$('#wall .card').forEach(c=>c.onclick=()=>proj(+c.dataset.i))}
const pl=a=>a.length?a.map(esc).join(', '):'<span style="color:#8b887f">non renseigné sur la fiche</span>';
function proj(i){const p=D.PR[i];openD(`<p class="lab">${p.y||''} · ${p.lv==='MA'?'Master':p.lv==='BA'?'Bachelor':'Bachelor et Master'} · ${esc(p.ty)}</p><h3>${esc(p.t)}</h3>
 ${p.h.length?`<img src="${img(p.h[0],1000)}" alt="">`:''}${p.h.length>1?`<div class="imgs">${p.h.slice(1).map(h=>`<img loading="lazy" src="${img(h,480)}" alt="">`).join('')}</div>`:''}
 <dl><dt>Encadrement</dt><dd>${pl(p.te)}</dd>${p.asx.length?`<dt>Assistance</dt><dd>${pl(p.asx)}</dd>`:''}<dt>Étudiants</dt><dd>${pl(p.st)}</dd>
 ${p.pa.length?`<dt>Partenaires</dt><dd>${pl(p.pa)}</dd>`:''}${p.pz.length?`<dt>Prix</dt><dd>${pl(p.pz)}</dd>`:''}${p.pl?`<dt>Lieu</dt><dd>${esc(p.pl)}</dd>`:''}<dt>Images</dt><dd>${p.ni} publiées</dd><dt>Source</dt><dd>${p.src==='MAIA'?'head-maia.ch':'hesge.ch'}</dd></dl>
 <a class="go" href="${p.u}" target="_blank" rel="noopener">Ouvrir la fiche source ↗</a>`)}
['#q','#fl','#ft','#fy'].forEach(s=>$(s).addEventListener('input',()=>{N=24;wall()}));$('#moreb').onclick=()=>{N+=24;wall()};wall();
(function(){const pz={};D.PR.forEach(p=>p.pz.forEach(z=>pz[z]=(pz[z]||0)+1));
 $('#prizes').innerHTML=Object.entries(pz).sort((a,b)=>b[1]-a[1]).map(([z,n])=>`<li data-q="${esc(z)}">${esc(z)}<i>${n}</i></li>`).join('');
 const pa={},AL={'mudac':'MUDAC','clair bois foundation':'Fondation Clair Bois'};D.PR.forEach(p=>p.pa.forEach(z=>z.split(/\s*,\s*/).forEach(x=>{x=x.trim();if(!x)return;x=AL[norm(x)]||x;pa[x]=(pa[x]||0)+1})));
 $('#partners').innerHTML=Object.entries(pa).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([z,n])=>`<li data-q="${esc(z)}">${esc(z)}<i>${n}</i></li>`).join('');
 $$('.list li').forEach(li=>li.onclick=()=>{$('#q').value=li.dataset.q;$('#fy').value='';$('#ft').value='';N=24;wall();$('.search').scrollIntoView({behavior:'smooth'})})})();

/* ---------- 05 rayonnement ---------- */
(function(){const G=e=>/Exhibition/i.test(e.ty)?'Expositions':/Conference|Symposium/i.test(e.ty)?'Conférences':/Lecture|MIDIS/i.test(e.ty)?'Conférences invitées':'Autres';
 const rows=['Expositions','Conférences','Conférences invitées','Autres'],y0=2018,y1=2027,W=1200,l=170,H=34+rows.length*56;
 const sx=d=>{const t=new Date(d+'T00:00:00');return l+((t.getFullYear()+(t.getMonth()+t.getDate()/31)/12)-y0)/(y1-y0)*(W-l-10)};
 let s=`<svg viewBox="0 0 ${W} ${H+40}" font-family="Archivo" font-size="11">`;
 for(let y=y0;y<=y1;y++){const x=sx(y+'-01-01');s+=`<line x1="${x}" x2="${x}" y1="10" y2="${H}" stroke="rgba(18,18,18,.12)"/><text x="${x+4}" y="${H+16}" fill="#121212" font-weight="600">${y}</text>`}
 rows.forEach((r,ri)=>{const y=40+ri*56;s+=`<text x="0" y="${y+4}" fill="#121212" font-weight="600" letter-spacing=".08em" font-size="10">${r.toUpperCase()}</text><line x1="${l}" x2="${W}" y1="${y}" y2="${y}" stroke="rgba(18,18,18,.2)"/>`;
  D.EVM.forEach((e,k)=>{if(G(e)!==r)return;const x=sx(e.d0),x2=sx(e.d1),j=((k*37)%5-2)*6,on=e.c==='En ligne',out=!on&&e.c!=='Genève';const col=out?'#e6483a':'#121212';
   s+=x2-x>5?`<rect class="d" data-k="${k}" x="${x}" y="${y+j-2}" width="${x2-x}" height="4" fill="${col}" opacity=".85"/>`:`<circle class="d" data-k="${k}" cx="${x}" cy="${y+j}" r="4.5" fill="${on?'#f2f0eb':col}" stroke="${col}" stroke-width="1.2"/>`})});
 s+=`<g font-size="11"><circle cx="5" cy="${H+34}" r="4.5" fill="#121212"/><text x="16" y="${H+38}">Genève</text><circle cx="85" cy="${H+34}" r="4.5" fill="#f2f0eb" stroke="#121212"/><text x="96" y="${H+38}">En ligne</text><circle cx="168" cy="${H+34}" r="4.5" fill="#e6483a"/><text x="179" y="${H+38}">Hors de Genève</text></g></svg>`;
 $('#ev').innerHTML=s;
 $$('#ev .d').forEach(c=>{const e=D.EVM[c.dataset.k];c.onmousemove=ev=>showTip(ev,`<b>${esc(sc(e.t))}</b><i>${esc(e.ty)} · ${esc(e.pl)} · ${dfr(e.d0)}${e.d1!==e.d0?' au '+dfr(e.d1):''}</i>`);c.onmouseleave=hideTip;c.onclick=()=>open(e.u)});
 const ev=D.EVM.filter(e=>!/Lecture|MIDIS/i.test(e.ty));
 $('#evl').innerHTML=`<div class="row head"><span>Année</span><span>Expositions, conférences et événements · ${ev.length} ${S('mev')}</span><span>Type · lieu</span></div>`+ev.map(e=>`<div class="row"><span class="n">${e.d0.slice(0,4)}</span><a href="${e.u}" target="_blank" rel="noopener">${esc(sc(e.t))}</a><span>${esc(e.ty)} · ${esc(e.c)}</span></div>`).join('')})();

/* ---------- 06 workshop ---------- */
const TASKS=[
 ['Cadrage','Vérifier les dates sur les calendriers HEAD et partenaires','Adjoint',-13,-13],['Cadrage','Note de cadrage : objectifs, ECTS, effectifs, plafond, lieu','Adjoint',-13,-12],['Cadrage','Validation de la note de cadrage','Responsable',-11,-11],
 ['Partenaires','Accord de principe des deux écoles','Responsable',-13,-11],['Partenaires','Conventions signées : sélection, frais, assurances, crédits','Adjoint',-11,-8],['Partenaires','Listes des 15 étudiants et des encadrants','Écoles',-10,-8],
 ['RH','Dossiers d\'engagement des intervenants','Adjoint et RH',-11,-7],['RH','Contrats signés','RH',-7,-6],
 ['Logistique','Salles, ateliers et lieu d\'exposition réservés','Adjoint',-11,-9],['Logistique','Hébergement des 15 invités confirmé','Adjoint',-10,-6],['Logistique','Commandes de matériel','Équipe et finances',-7,-4],['Logistique','Kit d\'accueil bilingue','Adjoint',-4,-1],
 ['Budget','Budget détaillé validé','Adjoint et finances',-10,-9],['Budget','Suivi hebdomadaire de l\'engagé et du payé','Adjoint',-9,2],
 ['Pédagogie','Programme jour par jour','Équipe',-8,-5],['Pédagogie','Critères d\'évaluation écrits','Équipe',-6,-5],['Pédagogie','Groupes mixtes constitués','Équipe et adjoint',-6,-4],['Pédagogie','Inscriptions au module','Bureau des études',-8,-6],
 ['Communication','Plan de communication et visuel','Communication',-8,-6],['Communication','Annonce publique','Communication',-6,-6],['Communication','Relances presse et invitations','Communication',-3,-1],
 ['Exposition','Besoins techniques arrêtés','Équipe et services techniques',-6,-5],['Exposition','Plan d\'exposition et contrôle de sécurité','Services techniques',-5,-4],
 ['Déroulement','Workshop, semaine 1','Tous',0,0],['Déroulement','Workshop, semaine 2 : montage et vernissage','Tous',1,1],
 ['Clôture','Démontage, notes saisies, paiements','Adjoint et équipe',2,2],['Clôture','Bilan et archivage','Adjoint',2,3],
];
const WK=[];for(let w=-13;w<=3;w++)WK.push(w);const wl=w=>w<0?'S'+w:w===0?'S0':'S+'+w;
const KEY='adjoint-ai-ws-v2';const defST=()=>{const s={};TASKS.forEach((t,i)=>s[i]=t[4]<-8?'done':t[3]<=-8?'go':'todo');s[19]='todo';return s};
let ST;try{ST=JSON.parse(localStorage.getItem(KEY))||defST()}catch(e){ST=defST()}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
const eff=(i,c)=>{const e=TASKS[i][4];if(ST[i]==='done')return'done';if(e<c)return'late';if(e-c<=1)return'alert';return ST[i]};
const LBL={todo:'Non démarré',go:'En cours',done:'Fait'};
function ws(){const c=+$('#wk').value;$('#wkl').textContent=wl(c);let lot='',h=`<table class="gt"><tr><th class="l">Tâche</th><th class="l">Responsable</th><th class="l">Statut</th>${WK.map(w=>`<th class="${w===c?'now':''}">${wl(w)}</th>`).join('')}</tr>`;
 TASKS.forEach((t,i)=>{if(t[0]!==lot){lot=t[0];h+=`<tr class="lot"><td colspan="${3+WK.length}">${lot}</td></tr>`}const e=eff(i,c);
  h+=`<tr class="s-${e}"><td class="l">${esc(t[1])}${e==='alert'?'<span class="flag">alerte</span>':e==='late'?'<span class="flag">en retard</span>':''}</td><td class="l o">${esc(t[2])}</td><td class="l"><button class="st" data-i="${i}">${LBL[ST[i]]}</button></td>${WK.map(w=>`<td class="${w===c?'now':''}">${w>=t[3]&&w<=t[4]?'<span class="bar"></span>':''}</td>`).join('')}</tr>`});
 $('#gantt').innerHTML=h+'</table>';
 $$('#gantt .st').forEach(b=>b.onclick=()=>{const o=['todo','go','done'];ST[b.dataset.i]=o[(o.indexOf(ST[b.dataset.i])+1)%3];save();ws()});
 const E=TASKS.map((t,i)=>eff(i,c)),n=k=>E.filter(x=>x===k).length,act=TASKS.filter(t=>t[3]<=c&&t[4]>=c).length;
 $('#wsum').innerHTML=`${n('done')} tâches faites sur ${TASKS.length}, ${n('go')} en cours, ${act} actives cette semaine. <span style="color:#e6483a">${n('alert')} en alerte et ${n('late')} en retard.</span> Une tâche passe en alerte quand son échéance tombe sous sept jours sans qu'elle soit faite.`}
$('#wk').oninput=ws;$('#wreset').onclick=()=>{ST=defST();save();ws()};ws();
const ACT=['Responsable de département','Adjoint','Équipe pédagogique','Étudiants','Écoles partenaires','Communication','Finances','RH','Relations internationales','Bureau des études','Ateliers et pôles','Services techniques'];
const RACI=[['Note de cadrage','A','R','C','','C','','C','','','','',''],['Conventions avec les écoles','A','R','I','','R','','C','','C','','',''],['Engagement des intervenants','A','R','C','','','','C','R','','','',''],['Budget et dépenses','A','R','C','','','','R','','','','',''],['Programme et sujets','A','C','R','I','C','','','','','','C',''],['Accueil des invités','I','R','I','I','C','','','','C','I','',''],['Inscriptions et notes','I','C','R','I','','','','','','R','',''],['Ateliers et sécurité','I','C','C','I','','','','','','','R','C'],['Communication et presse','A','C','C','I','I','R','','','','','',''],['Exposition publique','A','R','R','R','I','C','C','','','','C','R'],['Bilan et archivage','A','R','C','C','C','I','I','','','','','']];
$('#raci').innerHTML=`<table class="raci"><tr><th style="writing-mode:horizontal-tb;transform:none;height:auto"></th>${ACT.map(a=>`<th>${a}</th>`).join('')}</tr>${RACI.map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(x=>`<td class="${x}">${x}</td>`).join('')}</tr>`).join('')}</table>`;
const RISKS=[
 ['Collision avec les jurys, les concours ou le calendrier d\'une école partenaire',2,4,'Dates vérifiées à S-13 sur les trois calendriers, gelées dès la validation.','Adjoint',`Jurys du 18 au 22.01 et du 14 au 23.06.2027 ; concours de mars à mai.${S('cal')}`],
 ['Intervenant sans contrat le premier jour',3,3,'Dossiers RH lancés dès S-11, liste des pièces envoyée à chaque intervenant ; aucun début sans contrat signé.','Adjoint et RH',''],
 ['Hébergement des 15 invités',3,3,'Option de réservation groupée dès S-10, prise en charge fixée dans la convention.','Adjoint',`L'école ne propose pas de logement sur le campus ; le marché genevois est très tendu.${S('in')}`],
 ['Désistement d\'un enseignant ou d\'un intervenant',2,3,'Encadrement en binôme, remplaçant identifié, programme documenté jour par jour.','Responsable',''],
 ['Dépassement budgétaire',3,2,'Budget par poste avec réserve, engagements validés par une seule personne, suivi hebdomadaire.','Adjoint et finances',''],
 ['Exposition non prête ou non conforme pour le public',2,4,'Plan d\'exposition arrêté à S-4, contrôle de sécurité avec les services techniques, contenus gelés deux jours avant.','Services techniques',''],
 ['Groupes hétérogènes : langue, niveau, culture d\'école',3,2,'Langue de travail inscrite dans la convention, groupes mixtes constitués à l\'avance, critères donnés le premier jour.','Équipe pédagogique',`Le Bachelor est enseigné en français.${S('ba')}`],
 ['Évaluation contestée',2,3,'Présence relevée chaque jour, critères écrits, notes saisies avant le délai.','Équipe pédagogique',`Plus de 20 % d'absence en workshop vaut 1.0.${S('dba')}`],
];
let RS=0;function risk(){let h='<div class="rg">';for(let p=4;p>=1;p--){h+=`<div class="ax">${p}</div>`;for(let i=1;i<=4;i++){const v=p*i;h+=`<div class="c ${v>=9?'h3':v>=6?'h2':''}">${RISKS.map((r,k)=>r[1]===p&&r[2]===i?`<span class="rk${k===RS?' on':''}" data-k="${k}">${k+1}</span>`:'').join('')}</div>`}}
 h+=`<div class="axx"></div>${[1,2,3,4].map(i=>`<div class="axx">impact ${i}</div>`).join('')}</div><p class="note">Axe vertical : probabilité, de 1 à 4.</p>`;$('#risk').innerHTML=h;
 const r=RISKS[RS];$('#riskd').innerHTML=`<b>${RS+1}. ${esc(r[0])}</b>${esc(r[3])}<br><small>Responsable : ${esc(r[4])}. ${r[5]}</small>`;$$('.rk').forEach(x=>x.onclick=()=>{RS=+x.dataset.k;risk()})}risk();

/* ---------- 07 arbitrage ---------- */
const CR=[['app','Lien avec les apprentissages évalués',5,'La dépense sert directement les objectifs du module.'],['nb','Nombre d\'étudiants concernés',3,'À coût égal, la demande qui profite au plus grand nombre.'],['rec','Réciprocité due aux partenaires',4,'Un accueil comparable à celui qu\'ils réservent à nos étudiants.'],['dur','Durée de vie de la dépense',2,'Matériel réutilisable, documentation utile au département.'],['alt','Absence d\'alternative interne',2,'Ateliers, prêt, réemploi ou cofinancement font baisser la note.']];
const REQ=[['Sécurité et assurance de l\'exposition',2400,1,{}],['Honoraires et défraiements des intervenants, contrats signés',12000,1,{}],['Matériaux pour maquettes et prototypes',6500,0,{app:3,nb:3,rec:1,dur:1,alt:2}],['Contribution à l\'hébergement des 15 invités',4500,0,{app:1,nb:1,rec:3,dur:0,alt:2}],['Découpe numérique chez un prestataire',2800,0,{app:2,nb:2,rec:0,dur:0,alt:0}],['Catalogue imprimé de l\'exposition',4200,0,{app:1,nb:2,rec:1,dur:2,alt:2}],['Captation vidéo professionnelle',3000,0,{app:0,nb:1,rec:1,dur:3,alt:1}],['Mobilier d\'exposition réutilisable',3500,0,{app:1,nb:2,rec:0,dur:3,alt:1}],['Vernissage, traiteur',2000,0,{app:0,nb:2,rec:2,dur:0,alt:1}],['Visite de terrain pour les 75 étudiants',3800,0,{app:3,nb:3,rec:2,dur:0,alt:2}],['Accueil des encadrants partenaires',1500,0,{app:1,nb:1,rec:3,dur:0,alt:2}]];
const WG={};CR.forEach(c=>WG[c[0]]=c[2]);let BUD=30000,MODE='score';const TOT=REQ.reduce((a,r)=>a+r[1],0);
$('#weights').innerHTML=`<div class="w"><label>Budget disponible <b id="budl"></b></label><input type="range" id="bud" min="15000" max="50000" step="500" value="${BUD}"></div>`+CR.map(c=>`<div class="w"><label>${c[1]} <b id="wl-${c[0]}">${c[2]}</b></label><input type="range" min="0" max="5" value="${c[2]}" data-k="${c[0]}"><p>${c[3]}</p></div>`).join('')+`<div class="w"><label>Classement</label><select id="amode"><option value="score">par note</option><option value="eff">par note pour 1000 CHF</option></select><p>Sécurité, assurances et engagements signés ne s'arbitrent pas.</p></div>`;
function arb(){$('#budl').textContent='CHF '+fmt(BUD);const sw=CR.reduce((a,c)=>a+WG[c[0]]*3,0)||1;
 const R=REQ.map(r=>{const v=r[2]?100:Math.round(CR.reduce((a,c)=>a+WG[c[0]]*(r[3][c[0]]||0),0)/sw*100);return{t:r[0],c:r[1],ob:r[2],v,ef:v/(r[1]/1000)}});
 R.sort((a,b)=>b.ob-a.ob||(MODE==='eff'?b.ef-a.ef:b.v-a.v));let left=BUD;R.forEach(r=>{r.in=r.c<=left;if(r.in)left-=r.c});
 $('#arbres').innerHTML=`<div class="row head"><span>#</span><span>Demande, exemple</span><span class="r">Note</span><span class="r">CHF</span><span>Décision</span></div>`+R.map((r,k)=>`<div class="row ${r.ob?'ob':r.in?'':'out'}"><span class="n">${k+1}</span><span>${esc(r.t)}</span><span class="r">${r.ob?'·':r.v}</span><span class="r">${fmt(r.c)}</span><span class="dec">${r.ob?'Obligation':r.in?'Retenue':'Reportée'}</span></div>`).join('');
 $('#arbbar').innerHTML=R.map(r=>`<span title="${esc(r.t)}" style="width:${r.c/TOT*100}%;background:${r.ob?'#e6483a':r.in?'#121212':'#d8d5ce'}"></span>`).join('')+`<i style="left:${Math.min(100,BUD/TOT*100)}%"></i><em style="left:${Math.min(100,BUD/TOT*100)}%">Budget</em>`;
 $('#arbsum').textContent=`Retenu : CHF ${fmt(BUD-left)} sur ${fmt(BUD)}, solde CHF ${fmt(left)}, pour CHF ${fmt(TOT)} demandés. Chaque demandeur reçoit sa note et le motif de la décision.`}
$$('#weights input[data-k]').forEach(x=>x.oninput=()=>{WG[x.dataset.k]=+x.value;$('#wl-'+x.dataset.k).textContent=x.value;arb()});
$('#bud').oninput=e=>{BUD=+e.target.value;arb()};$('#amode').onchange=e=>{MODE=e.target.value;arb()};arb();

/* ---------- 08 sources ---------- */
$('#method').innerHTML=`<p>Le 13 novembre 2026, les pages publiques de la filière ont été collectées : formations, admissions, calendrier académique, règlements, mobilité, site head-maia.ch. Les plans d'études (${allMods.length} modules) et les 59 descriptifs de modules 2026-2027 ont été extraits des PDF officiels et convertis en données, règle par règle.</p>
<p>Les ${D.PR.length} fiches de projets et leurs ${fmt(D.NIMG_ALL)} images proviennent du relevé <a href="../media-explorer/head-ai/" target="_blank" rel="noopener">Media Explorer</a> du 12 novembre 2026 : projets du site de la HEAD pour le Bachelor et le Master en architecture d'intérieur, actualités et expositions de la filière, projets de head-maia.ch.</p>
<h4>Ce que la page ne sait pas</h4><ul><li>Effectifs par volée, budgets du département, nombre de jurés externes engagés : source manquante, ces données ne sont pas publiques.</li><li>Dates 2027 des expositions du MAIA et de Milan : non publiées au 13 novembre 2026.</li><li>Publications Instagram de @head_baai et @head_maia : non collectées.</li></ul>
<h4>Ce qui est construit pour la démonstration</h4><ul><li>L'indice de charge de l'année.</li><li>Le planning, les statuts, les rôles et le registre des risques du workshop, repris du dossier.</li><li>Le jeu de demandes budgétaires et ses montants.</li></ul>
<h4>Mise à jour</h4><p>Collecte et compilation sont scriptées : un nouveau plan d'études, un nouveau calendrier ou un nouveau semestre de projets se reconstruisent en relançant les scripts.</p>`;
$('#srcs').innerHTML=Object.values(D.S).map(s=>`<li><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a><small>${esc(s[1])}</small></li>`).join('');

new IntersectionObserver(es=>es.forEach(e=>$('#bar').classList.toggle('dark',e.isIntersecting)),{rootMargin:'0px 0px -95% 0px'}).observe($('#top'));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('#nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});$$('.ch').forEach(s=>obs.observe(s));
window.__ok=true;
})();
