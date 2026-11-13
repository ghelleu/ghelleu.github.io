(function(){
'use strict';
const D=window.D, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>n.toLocaleString('fr-CH').replace(/ |,/g,' ');
const S=(k,lbl)=>{const s=D.S[k];return s?`<a class="src" href="${s[1]}" target="_blank" rel="noopener" title="${esc(s[0])}">${lbl||'['+(Object.keys(D.S).indexOf(k)+1)+']'}</a>`:''};
const sc=t=>t===t.toUpperCase()?t.charAt(0)+t.slice(1).toLowerCase():t;
const img=(h,w)=>D.CDN+h+'/'+(w||480)+'.webp';
const tip=$('#tip');
function showTip(e,html){tip.innerHTML=html;tip.style.opacity=1;const x=Math.min(e.clientX+14,innerWidth-340),y=Math.min(e.clientY+14,innerHeight-120);tip.style.left=x+'px';tip.style.top=y+'px'}
function hideTip(){tip.style.opacity=0}
const drawer=$('#drawer'),dbody=$('#dbody');
function openD(html){dbody.innerHTML=html;drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');drawer.scrollTop=0}
$('#dx').onclick=()=>{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true')};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#dx').click()});
$('#gen').textContent=D.GEN;

const CAT={atel:['Atelier, studio','--c-atel'],ws:['Workshop','--c-ws'],theo:['Théorie','--c-theo'],tech:['Technique, professionnel','--c-tech'],repr:['Représentation','--c-repr'],trans:['Transversal','--c-trans'],thesis:['Thèse','--c-thesis'],pro:['Pratique professionnelle','--c-pro'],rech:['Formation à la recherche','--c-rech'],jma:['Joint Master of Architecture','--c-jma']};
const cv=k=>getComputedStyle(document.documentElement).getPropertyValue(CAT[k][1]).trim();

/* ---------- héros ---------- */
const allMods=[...Object.values(D.BA).flat(),...Object.values(D.MA).flat()];
const nAI=allMods.filter(m=>m.ai&&!m.c.startsWith('TRANS')).length;
const years=D.PR.map(p=>p.y).filter(Boolean);
const K=[
 [300,'crédits ECTS, Bachelor (180) et Master (120)',S('peba','plans d\'études')],
 [allMods.length,'modules aux plans d\'études 2026-2027',S('dba','descriptifs')],
 [D.PR.length,`fiches de projets publiées, ${Math.min(...years)} à ${Math.max(...years)}`,S('mx','relevé')],
 [D.NIMG_ALL,'images publiques de la filière',S('mx','relevé')],
 [D.NPEOPLE,'personnes citées dans les fiches',S('proj','fiches')],
 [D.MODS.length,'studios, modules et séminaires du MAIA depuis 2020',S('mmod','head-maia.ch')],
 [D.EVM.length,'événements à l\'agenda du MAIA',S('mev','head-maia.ch')],
 [D.EV.length,'échéances datées en 2026-2027',S('cal','calendrier')],
];
$('#kpis').innerHTML=K.map(k=>`<div class="kpi"><b>${fmt(k[0])}</b><span>${k[1]}</span>${k[2]}</div>`).join('');
(function mosaic(){const hs=[];D.PR.forEach(p=>{if(p.h.length)hs.push(p.h[0])});for(let i=hs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[hs[i],hs[j]]=[hs[j],hs[i]]}
 const m=$('#mosaic');m.innerHTML=hs.slice(0,160).map(h=>`<img loading="lazy" alt="" src="${img(h,160)}" onload="this.classList.add('in')">`).join('')})();

/* ---------- 01 parcours ---------- */
let HL='none';
function grid(el,prog,lab){
 el.innerHTML=Object.entries(prog).map(([s,mods])=>{const tot=mods.reduce((a,m)=>a+m.e,0);
  return `<div><div class="semh"><span>${lab}${s}</span><span>${tot} ECTS</span></div><div class="col">${mods.map(m=>{
   const h=Math.max(34,m.e*11.5);const bd=[m.ai?'IA':'',m.stage?'stage':''].filter(Boolean).join(' · ');
   return `<div class="mod${m.e>=6?' big':''}" data-c="${m.c}" title="${esc(m.t)}" style="height:${h}px;background:var(${CAT[m.k][1]})"><b>${m.c.startsWith('TRANS')?'TRANS':m.c} · ${m.e}</b><span class="tt">${esc(m.t)}</span>${bd?`<span class="bdg">${bd}</span>`:''}</div>`}).join('')}</div></div>`}).join('');
}
grid($('#gBA'),D.BA,'S');grid($('#gMA'),D.MA,'MAIA ');
$('#leg').innerHTML=Object.entries(CAT).map(([k,v])=>`<span style="--c:var(${v[1]})">${v[0]}</span>`).join('');
function applyHL(){$$('.mod').forEach(el=>{const m=allMods.find(x=>x.c===el.dataset.c);el.classList.toggle('dim',HL!=='none'&&!m[HL])})}
$$('#ptools button').forEach(b=>b.onclick=()=>{$$('#ptools button').forEach(x=>x.classList.remove('on'));b.classList.add('on');HL=b.dataset.h;applyHL()});
$$('.mod').forEach(el=>el.onclick=()=>{const m=allMods.find(x=>x.c===el.dataset.c);const ma=Object.values(D.MA).flat().includes(m);
 const sem=Object.entries(ma?D.MA:D.BA).find(([s,ms])=>ms.includes(m))[0];
 const rem=m.c==='16BT'?'Aucune (art. 35 al. 3 du règlement Bachelor)':m.rem?'Possible à 3.5, travail complémentaire':'Aucune remédiation possible';
 openD(`<div class="meta">${ma?'Master MAIA':'Bachelor'} · semestre ${sem} · ${m.e} ECTS</div><h3>${esc(m.t)}</h3>
 <dl><dt>Code</dt><dd>${m.c.startsWith('TRANS')?'PRAT / THEO':m.c}</dd><dt>Famille</dt><dd>${CAT[m.k][0]}</dd><dt>Contenu</dt><dd>${esc(m.u)}</dd>
 <dt>Validation</dt><dd>Note finale minimale 4.0, crédits attribués en bloc</dd><dt>Remédiation</dt><dd>${rem}</dd>
 <dt>Présence</dt><dd>${m.part?'Évaluée ; plus de 20 % d\'absence vaut 1.0 (ou « absence justifiée »)':'Ne fait pas partie des éléments évalués'}</dd>
 ${m.ai?`<dt>IA</dt><dd>${m.k==='trans'?'Le catalogue des modules transversaux pratiques cite l\'intelligence artificielle parmi les nouvelles technologies enseignées.':ma?'Le descriptif vise la conception d\'intérieurs numériques intégrant réalité virtuelle, réseaux sociaux, jeux vidéo et intelligence artificielle.':'Le descriptif demande de « se familiariser avec les changements de la profession liés à l\'intelligence artificielle ».'}</dd>`:''}
 ${m.stage?'<dt>Stage</dt><dd>Un stage approuvé avant le début du semestre par le responsable de filière peut valoir les 9 ECTS du module.</dd>':''}
 <dt>Logiciels</dt><dd>${m.k==='trans'?'Selon le cours choisi':'L\'étudiant indique les applicatifs et logiciels utilisés pour son travail, et précise leur usage si l\'enseignant le demande.'}</dd></dl>
 <p>Sources : ${S(ma?'pema':'peba','plan d\'études')} · ${S(ma?'dma':'dba','descriptifs de modules')} · ${S(ma?'regma':'regba','règlement')}</p>`)});
$('#pcall').innerHTML=[
 [nAI,'descriptifs de modules citent déjà l\'intelligence artificielle : les cinq ateliers de projet du Bachelor, la représentation 1 et le BIM 1 à 3, et le module numérique du MAIA.',S('dba','descriptifs BA')+' '+S('dma','MAIA')],
 [59,'descriptifs de la filière demandent à chaque étudiant d\'indiquer les logiciels utilisés pour son travail, et d\'en préciser l\'usage sur demande.',S('dba','descriptifs BA')+' '+S('dma','MAIA')],
 [5,'jurés au minimum pour chaque thèse, dont trois externes, au Bachelor comme au Master : le premier poste logistique de juin.',S('regba','règlement BA')+' '+S('regma','règlement MA')],
 ['20 %',`d'absence suffisent pour une note de 1.0 dans les ${allMods.filter(m=>m.part&&m.k==='ws').length} modules workshop des deux formations : la présence s'y relève chaque jour.`,S('dba','descriptifs BA')+' '+S('dma','MAIA')],
].map(c=>`<div class="call"><b>${c[0]}</b><p>${c[1]}</p>${c[2]}</div>`).join('');
const KEYS=[
 ['Ateliers',[`Un atelier de projet par semestre de S1 à S5, 9 ECTS. En S5, un stage approuvé avant le semestre peut valoir les 9 ECTS.`,['peba','dba']],[`Un atelier de conception de S1 à S3 (9, 12 puis 12 ECTS), confié à des enseignants et à des agences invitées.`,['pema','mmod']]],
 ['Projets',[`Mandats réels avec des entreprises, des institutions culturelles et des associations.`,['ba']],[`Projets avec des institutions et des industriels, recherches Scènes de Nuit, Forced Reuse, The Future of Humanitarian Design.`,['ma']]],
 ['Workshops',[`Semaine inaugurale chaque automne (14-18.09.2026), Semaine de tous les possibles ou autre workshop chaque printemps (22-26.02.2027).`,['peba','cal','sdtlp']],[`HEAD – Camondo en S1 et S3, Semaine de tous les possibles et workshop avec le MA Design Installation en S2.`,['pema','mmod']]],
 ['Évaluations',[`Note 4.0 requise, crédits en bloc, aucune remédiation pour les ateliers et la thèse ; notes publiées dans IS-Academia ; résultats d'automne au 22.01.2027 à 17h.`,['regba','cal']],[`Note 4.0 requise, remédiation à 3.5 si le descriptif la prévoit (mémoire de Master compris), aucune pour les ateliers et le projet de diplôme.`,['regma','dma']]],
 ['Jurys',[`Semaines du 18 au 22.01 et du 14 au 23.06.2027. Thèse : 5 jurés (2 internes, 3 externes) validés par la direction, soutenance d'environ 45 minutes.`,['cal','regba']],[`Thèse pratique : au moins 2 jurés de la filière et 3 extérieurs, validés par le responsable ; ouverte après validation de S1 à S3.`,['regma']]],
 ['Mobilité',[`Un ou deux semestres après une année validée (60 ECTS), sur learning agreement. Vœux du 15 au 30.11.2026 pour l'automne 2027.`,['out','reghes']],[`Mêmes règles d'échange ; partenaires structurels : Joint Master of Architecture (Genève, Fribourg, Berthoud) et École Camondo.`,['out','ma']]],
 ['Diplôme',[`Bachelor Thesis (mémoire d'environ 20 000 signes et projet), 18 ECTS ; fête des diplômes le 07.07.2027.`,['dba','cal']],[`Master Thesis 9 + 21 ECTS ; en 2026, exposition des thèses (19.02), Milan Design Week (20-26.04), exposition des diplômes (05-08.06).`,['pema','mev']]],
 ['Admission',[`Concours en deux tours : dossiers du 9 au 15.03, entretiens du 12 au 16.04.2027, en français.`,['cal','selba']],[`Concours en deux tours : dossiers du 30.03 au 07.04, entretiens du 28.04 au 07.05.2027, en anglais.`,['cal','selma']]],
];
$('#keys').innerHTML=KEYS.map(k=>`<div class="key"><h4>${k[0]}</h4><div class="r"><i>Bachelor</i><div>${k[1][0]} ${k[1][1].map(x=>S(x)).join('')}</div></div><div class="r"><i>MAIA</i><div>${k[2][0]} ${k[2][1].map(x=>S(x)).join('')}</div></div></div>`).join('');

/* ---------- 02 année ---------- */
(function year(){
 const WT={pre:['Pré-rentrée','#cfd6e6'],inau:['Semaine inaugurale','#7fb3e3'],cours:['Cours','#f3e3a6'],hc:['Semaine « hors cadre »','#7fb3e3'],jury:['Jurys','#c94f86'],rem:['Remédiations','#ee9a4a'],sans:['Sans cours','#f6c75a'],ferm:['Fermeture des bâtiments','#a690c4'],sdtlp:['Semaine de tous les possibles','#7fb3e3']};
 const TR={ecole:['École','#1D3F9E'],adm:['Admissions','#b8432f'],mob:['Mobilité','#2b8a78'],maia:['MAIA','#a64d93']};
 const W=D.CAL.length,cw=22,lx=120,top=46,rh=26,rows=Object.keys(TR);
 const d0=new Date(D.CAL[0][0]+'T00:00:00');const wi=ds=>Math.floor((new Date(ds+'T00:00:00')-d0)/864e5/7);
 const load=new Array(W).fill(0);D.CAL.forEach((c,i)=>{if(c[3]==='jury')load[i]+=4;if(c[3]==='rem')load[i]+=1});
 D.EV.forEach(e=>{if(!e[4])return;for(let i=Math.max(0,wi(e[0]));i<=Math.min(W-1,wi(e[1]));i++)load[i]+=e[4]});
 const mx=Math.max(...load),H=top+rh*(rows.length+1)+84,Wd=lx+W*cw+20;
 let s=`<svg width="${Wd}" height="${H}" viewBox="0 0 ${Wd} ${H}" font-family="PlexMono" font-size="10">`;
 const MO=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];let pm=-1;
 D.CAL.forEach((c,i)=>{const d=new Date(c[0]+'T00:00:00'),x=lx+i*cw;if(d.getMonth()!==pm){pm=d.getMonth();s+=`<text x="${x}" y="12" fill="#14161b" font-weight="500">${MO[pm]}${pm===0||i===0?' '+d.getFullYear():''}</text><line x1="${x}" x2="${x}" y1="16" y2="${H-8}" stroke="#e2e5ec"/>`}
  s+=`<rect class="wk" data-i="${i}" x="${x+1}" y="${top-24}" width="${cw-2}" height="20" rx="2" fill="${WT[c[3]][1]}"/><text x="${x+cw/2}" y="${top-10}" text-anchor="middle" fill="#14161b" font-size="8">${c[2]}</text>`});
 s+=`<text x="8" y="${top-10}" fill="#5f6571">Semaines</text>`;
 rows.forEach((r,ri)=>{const y=top+ri*rh+6;s+=`<text x="8" y="${y+13}" fill="${TR[r][1]}" font-weight="500">${TR[r][0]}</text><line x1="${lx}" x2="${Wd-20}" y1="${y+rh-3}" y2="${y+rh-3}" stroke="#eef0f4"/>`;
  D.EV.filter(e=>e[3]===r).forEach((e,k)=>{const a=Math.max(0,wi(e[0])),b=Math.min(W-1,wi(e[1]));const x=lx+a*cw+(a===wi(e[0])?((new Date(e[0]+'T00:00:00').getDay()+6)%7)/7*cw:0);
   const x2=lx+b*cw+(((new Date(e[1]+'T00:00:00').getDay()+6)%7)+1)/7*cw;const w=Math.max(6,x2-x);
   s+=`<rect class="ev" data-k="${D.EV.indexOf(e)}" x="${x}" y="${y+3}" width="${w}" height="13" rx="3" fill="${TR[r][1]}" opacity="${e[4]?0.9:0.35}"/>`})});
 const by=top+rows.length*rh+14;s+=`<text x="8" y="${by+30}" fill="#14161b" font-weight="500">Charge</text><text x="8" y="${by+44}" fill="#9aa0ab" font-size="8.5">indice calculé</text>`;
 load.forEach((v,i)=>{const h=v/mx*52;s+=`<rect class="ld" data-i="${i}" x="${lx+i*cw+2}" y="${by+56-h}" width="${cw-4}" height="${h}" rx="2" fill="${v>=6?'#b8432f':v>=3?'#e3a43c':'#c8d2ea'}"/>`});
 const today=wi('2026-11-13'),pf=wi('2026-12-01');
 [[today,'13.11'],[pf,'01.12']].forEach(([w,l],k)=>{const x=lx+w*cw+(k?((new Date('2026-12-01').getDay()+6)%7)/7*cw:4/7*cw);s+=`<line x1="${x}" x2="${x}" y1="${top-28}" y2="${by+60+k*12}" stroke="${k?'#1D3F9E':'#14161b'}" stroke-dasharray="3 3"/><text x="${x+3}" y="${by+70+k*12}" fill="${k?'#1D3F9E':'#14161b'}" font-size="9">${k?'prise de fonction':'aujourd\'hui'} ${l}</text>`});
 $('#year').innerHTML=s+'</svg>';
 $$('#year .wk').forEach(r=>{const c=D.CAL[r.dataset.i];r.onmousemove=e=>showTip(e,`Semaine du ${c[0].split('-').reverse().join('.')}<br><b>${esc(c[1])}</b>${c[2]?`<i>semaine ${c[2]} du semestre</i>`:''}<i>source : calendrier académique</i>`);r.onmouseleave=hideTip;r.style.cursor='pointer';r.onclick=()=>open(D.S.cal[1])});
 $$('#year .ev').forEach(r=>{const e=D.EV[r.dataset.k];const d=e[0]===e[1]?e[0].split('-').reverse().join('.'):e[0].split('-').reverse().join('.')+' au '+e[1].split('-').reverse().join('.');
  r.onmousemove=ev=>showTip(ev,`<b>${esc(e[2])}</b><br>${d}<i>source : ${esc(D.S[e[5]][0])}</i>`);r.onmouseleave=hideTip;r.style.cursor='pointer';r.onclick=()=>open(D.S[e[5]][1])});
 $$('#year .ld').forEach(r=>{const i=+r.dataset.i,c=D.CAL[i];const items=D.EV.filter(e=>e[4]&&wi(e[0])<=i&&wi(e[1])>=i).map(e=>esc(e[2]));
  r.onmousemove=ev=>showTip(ev,`Semaine du ${c[0].split('-').reverse().join('.')} · indice ${load[i]}<br>${c[3]==='jury'?'Jurys (4)<br>':''}${c[3]==='rem'?'Remédiations (1)<br>':''}${items.join('<br>')}`);r.onmouseleave=hideTip});
 $('#ylegend').innerHTML=Object.values(WT).filter((v,i,a)=>a.findIndex(x=>x[0]===v[0])===i).map(v=>`<span style="--c:${v[1]}">${v[0]}</span>`).join('')+' · '+Object.values(TR).map(v=>`<span style="--c:${v[1]}">${v[0]}</span>`).join('');
 $('#yreps').innerHTML=`L'indice de charge additionne, pour chaque semaine, un poids par échéance (jurys 4, tours de concours 3, délais de résultats 3, autres 1 ou 2) : c'est un outil de lecture, pas une mesure officielle. Les dates 2027 des événements du MAIA ne sont pas encore publiées ; repères de 2026 : ${D.REP.map(r=>`<a href="${r[2]}" target="_blank" rel="noopener">${esc(r[1])}</a>`).join(' · ')}. Sources : ${S('cal','calendrier académique')} ${S('admba','admissions BA')} ${S('admma','admissions MA')} ${S('out','mobilité OUT')} ${S('in','mobilité IN')}.`;
})();

/* ---------- 03 personnes ---------- */
(function team(){const T=D.TEAM,roles=Object.keys(T.BA);const both=new Set(Object.values(T.BA).flat().filter(n=>Object.values(T.MA).flat().includes(n)));
 const cell=ns=>ns.map(n=>`<span class="pp${both.has(n)&&!['Javier Fernández Contreras','Valentina De Luigi','Lucie Landenbergue'].includes(n)?' both':''}">${esc(n)}${D.AFF[n]?` <small>${esc(D.AFF[n])}</small>`:''}</span>`).join('');
 $('#team').innerHTML=`<div class="team"><div class="h"></div><div class="h">Bachelor ${S('ba','page')}</div><div class="h">MAIA ${S('ma','page')}</div>${roles.map(r=>`<div class="rl">${r} <small>${T.BA[r].length} · ${T.MA[r].length}</small></div><div>${cell(T.BA[r])}</div><div>${cell(T.MA[r])}</div>`).join('')}</div>
 <p style="font-size:12.5px;color:var(--mute)">Sur fond bleu : les ${[...both].filter(n=>!['Javier Fernández Contreras','Valentina De Luigi','Lucie Landenbergue'].includes(n)).length} personnes publiées dans les deux formations. Les rôles de direction et de secrétariat sont communs.</p>`})();
(function tea(){const c={};D.PR.forEach((p,i)=>p.te.forEach(n=>{(c[n]=c[n]||{BA:0,MA:0,ys:[],ps:[]});c[n][p.lv==='MA'?'MA':'BA']++;if(p.y)c[n].ys.push(p.y);c[n].ps.push(i)}));
 const L=Object.entries(c).sort((a,b)=>b[1].ps.length-a[1].ps.length).slice(0,28),mx=L[0][1].ps.length;
 $('#tea').innerHTML=`<div class="bars">${L.map(([n,v])=>`<div class="b" data-n="${esc(n)}"><span>${esc(n)}</span><span class="t" style="width:${v.ps.length/mx*100}%"><span style="width:${v.BA/v.ps.length*100}%;background:var(--c-atel)"></span><span style="width:${v.MA/v.ps.length*100}%;background:var(--c-jma)"></span></span><span class="n">${v.ps.length}</span></div>`).join('')}</div>
 <p style="font-size:12px;color:var(--mute)"><span style="color:var(--c-atel)">■</span> Bachelor <span style="color:var(--c-jma)">■</span> Master · ${Object.keys(c).length} personnes citées à l'encadrement, noms tels qu'écrits dans les fiches ${S('proj','fiches HEAD')} ${S('mx','relevé')}</p>`;
 $$('#tea .b').forEach(b=>b.onclick=()=>{const v=c[b.dataset.n];const ys=v.ys.length?`${Math.min(...v.ys)} à ${Math.max(...v.ys)}`:'';
  openD(`<div class="meta">Encadrement · ${v.ps.length} fiches · ${ys}</div><h3>${esc(b.dataset.n)}</h3><ul>${v.ps.sort((a,b)=>(D.PR[b].y||0)-(D.PR[a].y||0)).map(i=>{const p=D.PR[i];return `<li><a href="${p.u}" target="_blank" rel="noopener">${esc(p.t)}</a> <small>${p.y||''} · ${p.lv} · ${esc(p.ty)}</small></li>`}).join('')}</ul>`)})})();
(function mods(){const KC={studio:['Studios','--c-atel'],module:['Modules','--c-tech'],jma:['JMA','--c-jma'],workshop:['Workshops','--c-ws'],thesis:['Thèses','--c-thesis']};let f='all';
 const tb=$('#mtools');tb.innerHTML=`<span class="lbl">Afficher</span><button data-k="all" class="on">Tout (${D.MODS.length})</button>`+Object.entries(KC).map(([k,v])=>`<button data-k="${k}">${v[0]} (${D.MODS.filter(m=>m.k===k).length})</button>`).join('')+` <span class="lbl" style="margin-left:10px">source</span>${S('mmod','head-maia.ch/modules')}`;
 const clean=w=>w.replace(/^(STUDIO|WORKSHOP[^:]*|JMA[^:]*|JOINT MASTER OF ARCHITECTURE)\s*:?\s*/i,'').replace(/\s*\/\s*/g,' · ').trim();
 function draw(){const sems=[...new Set(D.MODS.map(m=>m.s))];
  $('#mods').innerHTML=sems.map(s=>{const ms=D.MODS.filter(m=>m.s===s&&(f==='all'||m.k===f));if(!ms.length)return'';
   return `<div class="msem"><h5>${s.replace('Fall','Automne').replace('Spring','Printemps')} · ${ms.length}</h5>${ms.map(m=>`<div class="mc" style="--c:var(${KC[m.k][1]})"><b>${esc(sc(m.t))}</b><span>${esc(clean(m.w)||m.w)}</span></div>`).join('')}</div>`}).join('')}
 tb.querySelectorAll('button').forEach(b=>b.onclick=()=>{tb.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');f=b.dataset.k;draw()});draw()})();

/* ---------- 04 mémoire ---------- */
const TYPES=['Semestre','Diplôme','Workshop','Exposition','Partenariat','Actualité','Projet','Recherche','Cours','Événement','Symposium'];
const TC={Semestre:'#1D3F9E',Diplôme:'#b8432f',Workshop:'#d9772b',Exposition:'#a64d93',Partenariat:'#2b8a78',Actualité:'#9aa0ab',Projet:'#4b95cf',Recherche:'#c99a12',Cours:'#7a5fb3',Événement:'#8a6a4c',Symposium:'#5f6571'};
(function byyear(){const ys=[];for(let y=2011;y<=2026;y++)ys.push(y);const cnt={};D.PR.forEach(p=>{if(!p.y)return;(cnt[p.y]=cnt[p.y]||{});cnt[p.y][p.ty]=(cnt[p.y][p.ty]||0)+1});
 const mx=Math.max(...ys.map(y=>Object.values(cnt[y]||{}).reduce((a,b)=>a+b,0)));const W=760,H=260,l=34,b=24,bw=(W-l-10)/ys.length;
 let s=`<svg viewBox="0 0 ${W} ${H+40}" font-family="PlexMono" font-size="10">`;
 for(let t=0;t<=mx;t+=20){const y=H-b-(t/mx)*(H-b-10);s+=`<line x1="${l}" x2="${W-10}" y1="${y}" y2="${y}" stroke="#eef0f4"/><text x="${l-6}" y="${y+3}" text-anchor="end" fill="#9aa0ab">${t}</text>`}
 ys.forEach((y,i)=>{let acc=0;const x=l+i*bw+3;TYPES.forEach(t=>{const v=(cnt[y]||{})[t]||0;if(!v)return;const h=v/mx*(H-b-10);const yy=H-b-acc-h;acc+=h;
  s+=`<rect class="yb" data-y="${y}" data-t="${t}" data-v="${v}" x="${x}" y="${yy}" width="${bw-6}" height="${h}" fill="${TC[t]}"/>`});s+=`<text x="${x+(bw-6)/2}" y="${H-b+14}" text-anchor="middle" fill="#5f6571">${String(y).slice(2)}</text>`});
 s+=TYPES.slice(0,8).map((t,i)=>`<rect x="${l+i*90}" y="${H+8}" width="9" height="9" fill="${TC[t]}"/><text x="${l+i*90+13}" y="${H+16}" fill="#5f6571">${t}</text>`).join('')+'</svg>';
 $('#byyear').innerHTML=`<h3 class="sub" style="margin-top:0">Fiches publiées par année et par type ${S('proj','fiches')} ${S('mx','relevé')}</h3>`+s;
 $$('#byyear .yb').forEach(r=>{r.onmousemove=e=>showTip(e,`<b>${r.dataset.y} · ${r.dataset.t}</b><br>${r.dataset.v} fiches<i>clic : filtrer</i>`);r.onmouseleave=hideTip;r.style.cursor='pointer';r.onclick=()=>{$('#fy').value=r.dataset.y;$('#ft').value=r.dataset.t;N=48;drawWall();$('#mfilt').scrollIntoView({behavior:'smooth',block:'start'})}})})();
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
(function side(){const pz={};D.PR.forEach((p,i)=>p.pz.forEach(z=>{(pz[z]=pz[z]||[]).push(i)}));
 $('#prizes').innerHTML=`<h4>Prix cités dans les fiches</h4><ul>${Object.entries(pz).sort((a,b)=>b[1].length-a[1].length).map(([z,l])=>`<li data-q="${esc(z)}">${esc(z)}<i>${l.length}</i></li>`).join('')}</ul>`;
 const pa={};const AL={'mudac':'MUDAC','clair bois foundation':'Fondation Clair Bois'};
 D.PR.forEach(p=>p.pa.forEach(z=>z.split(/\s*,\s*/).forEach(x=>{x=x.trim();if(!x)return;x=AL[norm(x)]||x;(pa[x]=pa[x]||0);pa[x]++})));
 const L=Object.entries(pa).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 $('#partners').innerHTML=`<h4>Partenaires cités (${L.length})</h4><ul style="max-height:270px;overflow:auto">${L.map(([z,n])=>`<li data-q="${esc(z)}">${esc(z)}<i>${n}</i></li>`).join('')}</ul>`;
 $$('.side li').forEach(li=>li.onclick=()=>{$('#q').value=li.dataset.q;$('#fy').value='';$('#ft').value='';N=48;drawWall();$('#mfilt').scrollIntoView({behavior:'smooth',block:'start'})})})();
$('#ft').innerHTML='<option value="">Tous les types</option>'+TYPES.map(t=>`<option>${t}</option>`).join('');
$('#fy').innerHTML='<option value="">Toutes les années</option>'+[...new Set(years)].sort((a,b)=>b-a).map(y=>`<option>${y}</option>`).join('');
let N=48;
function filt(){const q=norm($('#q').value.trim()),lv=$('#fl').value,t=$('#ft').value,y=$('#fy').value;
 return D.PR.map((p,i)=>i).filter(i=>{const p=D.PR[i];if(lv&&!p.lv.includes(lv))return false;if(t&&p.ty!==t)return false;if(y&&String(p.y)!==y)return false;
  if(q){const hay=norm([p.t,p.pl,...p.te,...p.st,...p.asx,...p.pa,...p.pz].join(' '));if(!hay.includes(q))return false}return true}).sort((a,b)=>(D.PR[b].y||0)-(D.PR[a].y||0))}
function drawWall(){const L=filt();$('#mcount').textContent=`${L.length} fiches`;
 $('#wall').innerHTML=L.slice(0,N).map(i=>{const p=D.PR[i];return `<div class="card" data-i="${i}"><div class="im" style="background-image:${p.h.length?`url(${img(p.h[0],480)})`:'none'}"></div><div class="tx"><b>${esc(p.t)}</b><span>${p.y||''} · ${p.lv} · ${esc(p.ty)}</span></div></div>`}).join('');
 $('#moreb').style.display=L.length>N?'':'none';
 $$('#wall .card').forEach(c=>c.onclick=()=>proj(+c.dataset.i))}
function plist(a){return a.length?a.map(esc).join(', '):'<span style="color:var(--faint)">non renseigné</span>'}
function proj(i){const p=D.PR[i];openD(`<div class="meta">${p.y||''} · ${p.lv==='MA'?'Master':p.lv==='BA'?'Bachelor':'Bachelor et Master'} · ${esc(p.ty)} · ${p.src==='MAIA'?'head-maia.ch':'hesge.ch'}</div><h3>${esc(p.t)}</h3>
 ${p.h.length?`<img src="${img(p.h[0],1000)}" alt="">`:''}${p.h.length>1?`<div class="imgs">${p.h.slice(1).map(h=>`<img loading="lazy" src="${img(h,480)}" alt="">`).join('')}</div>`:''}
 <dl><dt>Encadrement</dt><dd>${plist(p.te)}</dd>${p.asx.length?`<dt>Assistance</dt><dd>${plist(p.asx)}</dd>`:''}<dt>Étudiants</dt><dd>${plist(p.st)}</dd>
 ${p.pa.length?`<dt>Partenaires</dt><dd>${plist(p.pa)}</dd>`:''}${p.pz.length?`<dt>Prix</dt><dd>${plist(p.pz)}</dd>`:''}${p.pl?`<dt>Lieu</dt><dd>${esc(p.pl)}</dd>`:''}<dt>Images</dt><dd>${p.ni} publiées</dd></dl>
 <p><a href="${p.u}" target="_blank" rel="noopener">Ouvrir la fiche source</a></p>`)}
['#q','#fl','#ft','#fy'].forEach(s=>$(s).addEventListener('input',()=>{N=48;drawWall()}));
$('#moreb').onclick=()=>{N+=48;drawWall()};drawWall();

/* ---------- 05 rayonnement ---------- */
(function ev(){const G=e=>/Exhibition/i.test(e.ty)?'Expositions':/Conference|Symposium/i.test(e.ty)?'Conférences':/Lecture|MIDIS/i.test(e.ty)?'Conférences invitées':'Autres';
 const rows=['Expositions','Conférences','Conférences invitées','Autres'],RC={'Genève':'#1D3F9E','En ligne':'#9aa0ab'};const ic='#b8432f';
 const y0=2018,y1=2027,W=1100,H=40+rows.length*46,l=150,sx=d=>{const t=new Date(d+'T00:00:00');return l+((t.getFullYear()+t.getMonth()/12+t.getDate()/365)-y0)/(y1-y0)*(W-l-20)};
 let s=`<svg viewBox="0 0 ${W} ${H+46}" font-family="PlexMono" font-size="10">`;for(let y=y0;y<=y1;y++){const x=sx(y+'-01-01');s+=`<line x1="${x}" x2="${x}" y1="10" y2="${H}" stroke="#eef0f4"/><text x="${x+3}" y="${H+14}" fill="#5f6571">${y}</text>`}
 rows.forEach((r,ri)=>{const y=30+ri*46;s+=`<text x="0" y="${y+4}" fill="#14161b" font-family="Plex" font-size="12">${r}</text>`;
  D.EVM.filter(e=>G(e)===r).forEach((e,k)=>{const x=sx(e.d0),x2=sx(e.d1),jit=((k*37)%5-2)*5;const c=RC[e.c]||ic;
   s+=x2-x>4?`<rect class="em" data-k="${D.EVM.indexOf(e)}" x="${x}" y="${y+jit-3}" width="${x2-x}" height="6" rx="3" fill="${c}" opacity=".6"/>`:`<circle class="em" data-k="${D.EVM.indexOf(e)}" cx="${x}" cy="${y+jit}" r="5" fill="${c}" opacity=".85"/>`})});
 s+=`<g font-size="10.5"><circle cx="4" cy="${H+34}" r="4" fill="#1D3F9E"/><text x="12" y="${H+38}" fill="#5f6571">Genève</text><circle cx="84" cy="${H+34}" r="4" fill="#9aa0ab"/><text x="92" y="${H+38}" fill="#5f6571">En ligne</text><circle cx="164" cy="${H+34}" r="4" fill="${ic}"/><text x="172" y="${H+38}" fill="#5f6571">Hors de Genève</text></g></svg>`;
 $('#evchart').innerHTML=s;
 $$('#evchart .em').forEach(c=>{const e=D.EVM[c.dataset.k];c.style.cursor='pointer';c.onmousemove=ev=>showTip(ev,`<b>${esc(e.t)}</b><br>${esc(e.ty)} · ${esc(e.pl)}<br>${e.d0.split('-').reverse().join('.')}${e.d1!==e.d0?' au '+e.d1.split('-').reverse().join('.'):''}<i>head-maia.ch</i>`);c.onmouseleave=hideTip;c.onclick=()=>open(e.u)});
 const cities={};D.EVM.forEach(e=>cities[e.c]=(cities[e.c]||0)+1);
 $('#evlist').innerHTML=`<div style="column-span:all;font-size:13px;color:var(--mute);margin-bottom:8px">${Object.entries(cities).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`${c} ${n}`).join(' · ')} · source ${S('mev','head-maia.ch/events')}</div>`+D.EVM.filter(e=>!/Lecture|MIDIS/i.test(e.ty)).map(e=>`<div><i>${e.d0.slice(0,4)}</i><a href="${e.u}" target="_blank" rel="noopener">${esc(sc(e.t))}</a> <small style="color:var(--mute)">${esc(e.ty)} · ${esc(e.c)}</small></div>`).join('');
})();

/* ---------- 06 workshop ---------- */
const TASKS=[
 ['Cadrage','Vérifier les dates sur les calendriers HEAD et partenaires','Adjoint',-13,-13],
 ['Cadrage','Note de cadrage : objectifs, ECTS, effectifs, plafond, lieu','Adjoint',-13,-12],
 ['Cadrage','Validation de la note de cadrage','Responsable',-11,-11],
 ['Partenaires','Accord de principe des deux écoles','Responsable',-13,-11],
 ['Partenaires','Conventions signées (sélection, frais, assurances, crédits)','Adjoint',-11,-8],
 ['Partenaires','Listes des 15 étudiants et des encadrants','Écoles',-10,-8],
 ['RH','Dossiers d\'engagement des intervenants','Adjoint + RH',-11,-7],
 ['RH','Contrats signés','RH',-7,-6],
 ['Logistique','Réserver salles, ateliers et lieu d\'exposition','Adjoint',-11,-9],
 ['Logistique','Hébergement des 15 invités confirmé','Adjoint',-10,-6],
 ['Logistique','Commandes de matériel','Équipe + Finances',-7,-4],
 ['Logistique','Kit d\'accueil bilingue','Adjoint',-4,-1],
 ['Budget','Budget détaillé validé','Adjoint + Finances',-10,-9],
 ['Budget','Suivi hebdomadaire engagé et payé','Adjoint',-9,2],
 ['Pédagogie','Programme jour par jour','Équipe',-8,-5],
 ['Pédagogie','Critères d\'évaluation écrits','Équipe',-6,-5],
 ['Pédagogie','Groupes mixtes constitués','Équipe + Adjoint',-6,-4],
 ['Pédagogie','Inscriptions au module','Bureau des études',-8,-6],
 ['Communication','Plan de communication et visuel','Communication',-8,-6],
 ['Communication','Annonce publique','Communication',-6,-6],
 ['Communication','Relances presse et invitations','Communication',-3,-1],
 ['Exposition','Besoins techniques arrêtés','Équipe + Services techniques',-6,-5],
 ['Exposition','Plan d\'exposition et contrôle de sécurité','Services techniques',-5,-4],
 ['Déroulement','Workshop, semaine 1','Tous',0,0],
 ['Déroulement','Workshop, semaine 2 : montage et vernissage','Tous',1,1],
 ['Clôture','Démontage, notes saisies, paiements','Adjoint + Équipe',2,2],
 ['Clôture','Bilan et archivage','Adjoint',2,3],
];
const WEEKS=[];for(let w=-13;w<=3;w++)WEEKS.push(w);
const KEY='adjoint-ai-ws-v1';let ST={};
function defST(){const s={};TASKS.forEach((t,i)=>{s[i]=t[4]<-8?'done':t[3]<=-8?'go':'todo'});s[19]='todo';return s}
try{ST=JSON.parse(localStorage.getItem(KEY))||defST()}catch(e){ST=defST()}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
function eff(i,cur){const st=ST[i],e=TASKS[i][4];if(st==='done')return'done';if(e<cur)return'late';if(e-cur<=1)return st==='todo'?'alert':'alert';return st}
function drawWS(){const cur=+$('#wk').value;$('#wkl').textContent=cur<0?'S'+cur:cur===0?'S0':'S+'+cur;
 let lot='',h=`<table><tr><th class="l">Tâche</th><th class="l">Responsable</th><th class="l">Statut</th>${WEEKS.map(w=>`<th class="${w===cur?'now':''}">${w<0?'S'+w:w===0?'S0':'S+'+w}</th>`).join('')}</tr>`;
 TASKS.forEach((t,i)=>{if(t[0]!==lot){lot=t[0];h+=`<tr><td class="lot" colspan="${3+WEEKS.length}">${lot}</td></tr>`}const e=eff(i,cur);
  h+=`<tr class="st-${e}"><td class="l">${esc(t[1])}${e==='alert'?'<span class="flag alert">alerte</span>':e==='late'?'<span class="flag late">en retard</span>':''}</td><td class="l"><small>${esc(t[2])}</small></td><td class="l"><select data-i="${i}">${[['todo','non démarré'],['go','en cours'],['done','fait']].map(o=>`<option value="${o[0]}"${ST[i]===o[0]?' selected':''}>${o[1]}</option>`).join('')}</select></td>${WEEKS.map(w=>`<td class="${w===cur?'now':''}">${w>=t[3]&&w<=t[4]?'<span class="bar"></span>':''}</td>`).join('')}</tr>`});
 $('#gantt').innerHTML=h+'</table>';
 $$('#gantt select').forEach(s=>s.onchange=()=>{ST[s.dataset.i]=s.value;save();drawWS()});
 const E=TASKS.map((t,i)=>eff(i,cur));const n=k=>E.filter(x=>x===k).length;
 $('#wkpi').innerHTML=[[`${Math.round(n('done')/TASKS.length*100)} %`,'des tâches faites'],[n('go'),'en cours'],[n('alert'),'en alerte : échéance sous sept jours, non terminée'],[n('late'),'en retard'],[TASKS.filter(t=>t[3]<=cur&&t[4]>=cur).length,'tâches actives cette semaine']].map(k=>`<div class="kpi"><b>${k[0]}</b><span>${k[1]}</span></div>`).join('')}
$('#wk').oninput=drawWS;$('#wreset').onclick=()=>{ST=defST();save();drawWS()};drawWS();
const ACT=['Responsable de département','Adjoint','Équipe pédagogique','Étudiants','Écoles partenaires','Service communication','Service financier','Service RH','Relations internationales','Bureau des études','Ateliers et pôles','Services techniques'];
const RACI=[
 ['Note de cadrage','A','R','C','','C','','C','','','','',''],
 ['Conventions avec les écoles','A','R','I','','R','','C','','C','','',''],
 ['Engagement des intervenants','A','R','C','','','','C','R','','','',''],
 ['Budget et engagements de dépenses','A','R','C','','','','R','','','','',''],
 ['Programme et sujets','A','C','R','I','C','','','','','','C',''],
 ['Accueil des étudiants invités','I','R','I','I','C','','','','C','I','',''],
 ['Inscriptions et notes','I','C','R','I','','','','','','R','',''],
 ['Ateliers, machines et sécurité','I','C','C','I','','','','','','','R','C'],
 ['Communication et presse','A','C','C','I','I','R','','','','','',''],
 ['Exposition publique','A','R','R','R','I','C','C','','','','C','R'],
 ['Bilan et archivage','A','R','C','C','C','I','I','','','','',''],
];
$('#raci').innerHTML=`<table class="raci"><tr><th style="writing-mode:horizontal-tb;transform:none;height:auto"></th>${ACT.map(a=>`<th>${a}</th>`).join('')}</tr>${RACI.map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(x=>`<td>${x?`<span class="${x}">${x}</span>`:''}</td>`).join('')}</tr>`).join('')}</table>`;
const RISKS=[
 ['Collision avec les jurys, les concours ou le calendrier d\'une école partenaire',2,4,'Dates vérifiées à S-13 sur les trois calendriers, gelées dès la validation.','Adjoint',`Jurys du 18 au 22.01 et du 14 au 23.06.2027 ; concours de mars à mai ${S('cal','calendrier')}`],
 ['Intervenant non contractualisé au premier jour',3,3,'Dossiers RH lancés dès S-11, liste des pièces envoyée à chaque intervenant ; personne ne commence sans contrat signé.','Adjoint + RH',''],
 ['Hébergement des 15 étudiants invités',3,3,'Option de réservation groupée dès S-10, prise en charge fixée dans la convention.','Adjoint',`L'école ne propose pas de logement sur le campus et le marché genevois est très tendu ${S('in','mobilité IN')}`],
 ['Désistement d\'un enseignant ou d\'un intervenant',2,3,'Encadrement en binôme, remplaçant identifié, programme documenté jour par jour.','Responsable',''],
 ['Dépassement budgétaire',3,2,'Budget par poste avec réserve, engagements validés par une seule personne, suivi hebdomadaire de l\'engagé et du payé.','Adjoint + Finances',''],
 ['Exposition non prête ou non conforme pour le public',2,4,'Plan d\'exposition arrêté à S-4, contrôle de sécurité avec les services techniques, contenus gelés deux jours avant.','Services techniques',''],
 ['Groupes hétérogènes : langue, niveau, culture d\'école',3,2,'Langue de travail inscrite dans la convention, groupes mixtes constitués à l\'avance, critères communiqués le premier jour.','Équipe pédagogique','Bachelor enseigné en français '+S('ba','page BA')],
 ['Évaluation contestée',2,3,'Présence relevée chaque jour, critères écrits, notes saisies avant le délai.','Équipe pédagogique',`Plus de 20 % d'absence en workshop vaut 1.0 ${S('dba','descriptifs')}`],
];
let RS=0;function drawRisk(){let h='<div class="riskgrid">';for(let p=4;p>=1;p--){h+=`<div class="ax">${p}</div>`;for(let i=1;i<=4;i++){const sc=p*i;const bg=sc>=9?'#f6d4d0':sc>=6?'#f6e3c0':sc>=3?'#f1f3f8':'#f8f9fb';
 h+=`<div class="cell" style="background:${bg}">${RISKS.map((r,k)=>r[1]===p&&r[2]===i?`<span class="rk${k===RS?' on':''}" data-k="${k}">${k+1}</span>`:'').join('')}</div>`}}
 h+=`<div class="ax"></div>${[1,2,3,4].map(i=>`<div class="ax">impact ${i}</div>`).join('')}</div>`;$('#risk').innerHTML=h+'<p style="font:10.5px PlexMono;color:#5f6571;margin:4px 0 0">axe vertical : probabilité</p>';
 const r=RISKS[RS];$('#riskd').innerHTML=`<b>${RS+1}. ${esc(r[0])}</b>${esc(r[3])}<br><small style="color:var(--mute)">Responsable : ${esc(r[4])}${r[5]?' · '+r[5]:''}</small>`;
 $$('.rk').forEach(x=>x.onclick=()=>{RS=+x.dataset.k;drawRisk()})}drawRisk();

/* ---------- 07 arbitrage ---------- */
const CR=[['app','Lien avec les apprentissages évalués',5,'La dépense sert directement les objectifs du module.'],['nb','Nombre d\'étudiants concernés',3,'À coût égal, la demande qui profite au plus grand nombre.'],['rec','Réciprocité due aux partenaires',4,'Un accueil comparable à celui qu\'ils offrent à nos étudiants.'],['dur','Durée de vie de la dépense',2,'Matériel réutilisable, documentation utile au département.'],['alt','Absence d\'alternative interne',2,'Ateliers, prêt, réemploi ou cofinancement disponibles font baisser la note.']];
const REQ=[
 ['Sécurité et assurance de l\'exposition',2400,1,{}],
 ['Honoraires et défraiements des intervenants (contrats signés)',12000,1,{}],
 ['Matériaux pour maquettes et prototypes',6500,0,{app:3,nb:3,rec:1,dur:1,alt:2}],
 ['Contribution à l\'hébergement des 15 invités',4500,0,{app:1,nb:1,rec:3,dur:0,alt:2}],
 ['Découpe numérique chez un prestataire externe',2800,0,{app:2,nb:2,rec:0,dur:0,alt:0}],
 ['Catalogue imprimé de l\'exposition',4200,0,{app:1,nb:2,rec:1,dur:2,alt:2}],
 ['Captation vidéo professionnelle',3000,0,{app:0,nb:1,rec:1,dur:3,alt:1}],
 ['Mobilier d\'exposition réutilisable',3500,0,{app:1,nb:2,rec:0,dur:3,alt:1}],
 ['Vernissage (traiteur)',2000,0,{app:0,nb:2,rec:2,dur:0,alt:1}],
 ['Visite de terrain pour les 75 étudiants',3800,0,{app:3,nb:3,rec:2,dur:0,alt:2}],
 ['Accueil des encadrants partenaires',1500,0,{app:1,nb:1,rec:3,dur:0,alt:2}],
];
const WG={};CR.forEach(c=>WG[c[0]]=c[2]);let BUD=30000,MODE='score';
$('#weights').innerHTML=`<h4>Pondération des critères</h4><div class="w"><label>Budget disponible <b id="budl"></b></label><input type="range" id="bud" min="15000" max="50000" step="500" value="${BUD}"></div>`+CR.map(c=>`<div class="w"><label>${c[1]} <b id="wl-${c[0]}">${c[2]}</b></label><input type="range" min="0" max="5" value="${c[2]}" data-k="${c[0]}"><p>${c[3]}</p></div>`).join('')+`<div class="w"><label>Classement</label><select id="amode"><option value="score">par note</option><option value="eff">par note pour 1000 CHF</option></select></div><p style="font-size:11.5px;color:var(--mute)">Les obligations (sécurité, assurances, engagements signés) ne s'arbitrent pas et passent en premier.</p>`;
function drawArb(){$('#budl').textContent='CHF '+fmt(BUD);const sw=CR.reduce((a,c)=>a+WG[c[0]]*3,0)||1;
 const R=REQ.map((r,i)=>{const sc=r[2]?100:Math.round(CR.reduce((a,c)=>a+WG[c[0]]*(r[3][c[0]]||0),0)/sw*100);return{i,t:r[0],c:r[1],ob:r[2],sc,ef:sc/(r[1]/1000)}});
 R.sort((a,b)=>b.ob-a.ob||(MODE==='eff'?b.ef-a.ef:b.sc-a.sc));let left=BUD;R.forEach(r=>{r.in=r.c<=left;if(r.in)left-=r.c});
 $('#arbres').innerHTML=`<table class="arbt"><tr><th>#</th><th>Demande (exemple)</th><th style="text-align:right">Note</th><th style="text-align:right">CHF</th><th>Décision</th></tr>${R.map((r,k)=>`<tr class="${r.in?'':'out'}"><td class="n">${k+1}</td><td>${esc(r.t)}</td><td class="n">${r.ob?'oblig.':r.sc}</td><td class="n">${fmt(r.c)}</td><td>${r.ob?'<span class="tag ob">obligation</span>':r.in?'<span class="tag in">retenue</span>':'<span class="tag no">reportée</span>'}</td></tr>`).join('')}</table>
 <p style="font-size:13px;margin:10px 0 0">Retenu : CHF ${fmt(BUD-left)} sur ${fmt(BUD)} · solde CHF ${fmt(left)} · demandes totales CHF ${fmt(REQ.reduce((a,r)=>a+r[1],0))}. Chaque demandeur reçoit la note et le motif.</p>`;
 const tot=REQ.reduce((a,r)=>a+r[1],0);$('#arbbar').innerHTML=R.map((r,k)=>`<span title="${esc(r.t)} · CHF ${fmt(r.c)}" style="width:${r.c/tot*100}%;background:${r.ob?'#b8432f':r.in?'#1D3F9E':'#cfd5e3'}"></span>`).join('')+`<i class="cap" style="left:${Math.min(100,BUD/tot*100)}%"></i>`}
$$('#weights input[data-k]').forEach(x=>x.oninput=()=>{WG[x.dataset.k]=+x.value;$('#wl-'+x.dataset.k).textContent=x.value;drawArb()});
$('#bud').oninput=e=>{BUD=+e.target.value;drawArb()};$('#amode').onchange=e=>{MODE=e.target.value;drawArb()};drawArb();

/* ---------- 08 méthode ---------- */
$('#method').innerHTML=`<p>Le 13 novembre 2026, toutes les pages publiques de la filière ont été collectées : pages des formations et des admissions, calendrier académique, règlements, pages de mobilité, site head-maia.ch. Les plans d'études (${allMods.length} modules) et les 59 descriptifs de modules 2026-2027 de la filière ont été extraits des PDF officiels et convertis en données, règle par règle : crédits, remédiation, présence évaluée, mention de l'IA, déclaration des logiciels.</p>
<p>Les ${D.PR.length} fiches de projets et leurs ${fmt(D.NIMG_ALL)} images proviennent du relevé Media Explorer du 12 novembre 2026 : liste des projets du site de la HEAD pour les codes de formation Bachelor et Master en architecture d'intérieur, actualités et expositions de la filière, projets de head-maia.ch. Les noms sont repris tels qu'ils figurent sur les fiches.</p>
<h4>Ce que la page ne sait pas</h4><ul><li>Les effectifs par volée, les budgets du département et le nombre de jurés externes engagés chaque année : source manquante, ces données ne sont pas publiques.</li><li>Les dates 2027 des expositions du MAIA et de Milan : non publiées au 13 novembre 2026.</li><li>Les publications Instagram de @head_baai et @head_maia : non collectées.</li><li>Les types de projets suivent la classification des sites ; quelques fiches anciennes n'ont pas d'année.</li></ul>
<h4>Ce qui est construit pour la démonstration</h4><ul><li>L'indice de charge de l'année (pondération explicite, section 02).</li><li>Le planning, les statuts, la matrice des rôles et le registre des risques du workshop (section 06), qui reprennent le dossier.</li><li>Le jeu de demandes budgétaires et ses montants (section 07).</li></ul>
<h4>Mise à jour</h4><p>La collecte et la compilation sont scriptées : relancer les scripts suffit à reconstruire la page à chaque nouveau plan d'études, calendrier ou semestre de projets.</p>`;
$('#srcs').innerHTML=Object.values(D.S).map(s=>`<li><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a><small>${esc(s[1])}</small></li>`).join('')+`<li>${D.PR.length} fiches de projets, chacune liée à sa page source dans la section 04.</li><li>${D.EVM.length} pages d'événements de head-maia.ch, chacune liée dans la section 05.</li>`;

/* nav active */
const secs=$$('main .sec');const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$$('#nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});secs.forEach(s=>obs.observe(s));
window.__ok=true;
})();
