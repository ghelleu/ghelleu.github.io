/* Noyau : état, dates, navigation, composants, graphiques */
(function(){
'use strict';
const D=window.DATA;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const D0=new Date('2026-08-31T12:00:00Z'),DAY=864e5;
const dd=s=>Math.round((new Date(s+'T12:00:00Z')-D0)/DAY);
const dt=n=>new Date(D0.getTime()+n*DAY);
const iso=n=>dt(n).toISOString().slice(0,10);
const fr=s=>{const [y,m,d]=s.split('-');return `${d}.${m}.${y}`};
const frs=s=>fr(s).slice(0,5);
const MO=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const frl=s=>{const d=new Date(s+'T12:00:00Z');return `${d.getUTCDate()} ${MO[d.getUTCMonth()]} ${d.getUTCFullYear()}`};
const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const chf=n=>"CHF "+Math.round(n).toLocaleString('fr-CH').replace(/[  ,]/g,"'");
const k=n=>Math.round(n/1000).toLocaleString('fr-CH')+" k";
const pct=(a,b)=>b?Math.round(100*a/b):0;

/* ---------- état partagé ---------- */
const S={TD:dd('2026-12-07'),done:new Set(),view:'accueil'};
window.APP={S};

/* ---------- échéances ---------- */
function est(e){const d=dd(e[2]);if(S.done.has(e[0]))return'done';
 if(d<S.TD)return D.OPEN_LATE.has(e[0])?'late':'done';
 if(S.TD>=d-e[3])return d-S.TD<=7?'trig':'open';return'soon'}
const SL={late:'En retard',trig:'Cette semaine',open:'En cours',done:'Fait',soon:'À venir'};

/* ---------- utilitaires d'interface ---------- */
const tip=()=>$('#tip');
function showTip(e,h){const t=tip();t.innerHTML=h;t.style.opacity=1;const r=t.getBoundingClientRect();t.style.left=Math.min(e.clientX+14,innerWidth-r.width-10)+'px';t.style.top=Math.min(e.clientY+14,innerHeight-r.height-10)+'px'}
function hideTip(){tip().style.opacity=0}
function bindTips(root){(root||document).querySelectorAll('[data-tip]').forEach(el=>{el.onmousemove=e=>showTip(e,el.dataset.tip);el.onmouseleave=hideTip})}
function drawer(h){$('#dbody').innerHTML=h;$('#drawer').classList.add('open');$('#veil').classList.add('on');bindTips($('#dbody'))}
function closeDrawer(){$('#drawer').classList.remove('open');$('#veil').classList.remove('on')}
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3200)}

/* ---------- composants ---------- */
const ICON={
 cockpit:'<circle cx="8" cy="8" r="6.5"/><path d="M8 8l3-3"/>',arch:'<rect x="1.5" y="2" width="4" height="12"/><rect x="10.5" y="2" width="4" height="5"/><rect x="10.5" y="9" width="4" height="5"/><path d="M5.5 5h5M5.5 11h5"/>',
 ech:'<rect x="1.5" y="3" width="13" height="11"/><path d="M1.5 6.5h13M5 1.5v3M11 1.5v3"/>',etu:'<circle cx="5" cy="5" r="2.2"/><circle cx="11" cy="5" r="2.2"/><path d="M1.5 13c.5-3 6.5-3 7 0M7.5 13c.5-3 6.5-3 7 0"/>',
 atl:'<rect x="1.5" y="1.5" width="5.5" height="5.5"/><rect x="9" y="1.5" width="5.5" height="5.5"/><rect x="1.5" y="9" width="5.5" height="5.5"/><rect x="9" y="9" width="5.5" height="5.5"/>',
 ens:'<path d="M2 3h9v10H2zM11 5h3v8h-3"/><path d="M4 6h5M4 8.5h5"/>',jma:'<path d="M1.5 13L8 3l6.5 10z"/><path d="M5 13l3-5 3 5"/>',mob:'<circle cx="8" cy="8" r="6.5"/><path d="M1.5 8h13M8 1.5c-3 3-3 10 0 13M8 1.5c3 3 3 10 0 13"/>',
 bud:'<path d="M1.5 14.5h13"/><rect x="2.5" y="8" width="2.5" height="6"/><rect x="6.8" y="4" width="2.5" height="10"/><rect x="11" y="6" width="2.5" height="8"/>',sig:'<path d="M2 12c2-1 3-7 5-7s0 7 2 7 2-3 5-3"/><path d="M2 14.5h12"/>',
 man:'<rect x="2" y="1.5" width="12" height="13"/><path d="M5 5h6M5 8h6M5 11h3"/>',eq:'<circle cx="8" cy="5" r="2.5"/><path d="M3 14c.5-4 9.5-4 10 0"/>',
 evt:'<path d="M3 14V2l10 4-10 4"/>',jur:'<path d="M2 13.5h12M3.5 13.5V7M8 13.5V7M12.5 13.5V7M2 7h12L8 2.5z"/>',con:'<circle cx="4" cy="11" r="2"/><circle cx="12" cy="11" r="2"/><circle cx="8" cy="4" r="2"/><path d="M5.5 9.5l1.5-3.5M10.5 9.5L9 6"/>',
 home:'<path d="M2 7.5L8 2.5l6 5V14H2z"/><path d="M6.5 14v-4h3v4"/>',srv:'<circle cx="8" cy="8" r="2"/><circle cx="2.5" cy="3" r="1.3"/><circle cx="13.5" cy="3" r="1.3"/><circle cx="2.5" cy="13" r="1.3"/><circle cx="13.5" cy="13" r="1.3"/><path d="M6.5 6.7L3.5 3.9M9.5 6.7l3-2.8M6.5 9.3l-3 2.8M9.5 9.3l3 2.8"/>',qua:'<path d="M1.5 12l4-4 3 3 6-6"/><path d="M10.5 5h4v4"/>',ag:'<path d="M2 3h12v8H7l-3 3v-3H2z"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">${ICON[n]}</svg>`;
function vh(o){return `<div class="vh"><div><p class="k"><a class="back" href="#accueil">← Accueil</a><span>${o.k}</span></p><h1>${o.t}</h1>${o.l?`<p class="lead">${o.l}</p>`:''}</div></div>
 ${o.how||o.f?`<details class="howd"><summary>Comment fonctionne ce module</summary>${o.how?`<div class="how"><div><h4>Ce que fait le module</h4><p>${o.how[0]}</p></div><div><h4>Ce qu'il évite</h4><p>${o.how[1]}</p></div><div><h4>Données sur ARCHI et ailleurs</h4><div class="src">${o.how[2].map(p=>`<span class="path${p.endsWith('~')?' sup':''}">${esc(p.replace(/~$/,''))}</span>`).join('')}</div></div></div>`:''}${(o.f||[]).length?`<div class="fiches">${o.f.map(n=>`<button class="fch" data-fiche="${n}" title="Voir la fiche du catalogue">Fiche ${n}</button>`).join('')}</div>`:''}</details>`:''}`}
function kpi(l,v,s,o={}){return `<div class="kpi${o.go?' click':''}"${o.go?` data-go="${o.go}"`:''}><p class="l">${l}</p><b class="${o.r?'r':''}">${v}</b><span>${s}</span>${o.spark?`<svg class="spark" viewBox="0 0 64 26">${o.spark}</svg>`:''}</div>`}
function pn(t,sub,body,right){return `<section class="pn"><h2>${t}${right?`<span>${right}</span>`:''}</h2>${sub?`<p class="sub">${sub}</p>`:''}${body}</section>`}
function sparkPath(vals,stroke='currentColor'){const mx=Math.max(...vals),mn=Math.min(...vals);const p=vals.map((v,i)=>`${(i/(vals.length-1)*62+1).toFixed(1)},${(24-(v-mn)/((mx-mn)||1)*22).toFixed(1)}`).join(' ');return `<polyline points="${p}" fill="none" stroke="${stroke}" stroke-width="1.4"/>`}

/* ---------- graphiques : chaque .fig est redessinée à sa taille réelle ---------- */
const FIGS=new Map();
let ro=null;
function fig(id,cls,draw){FIGS.set(id,draw);return `<div class="fig ${cls||''}" id="${id}"><svg></svg></div>`}
function drawFigs(){if(ro)ro.disconnect();ro=new ResizeObserver(en=>en.forEach(e=>{const f=FIGS.get(e.target.id);if(f){const s=e.target.querySelector('svg');const W=e.target.clientWidth,H=e.target.clientHeight;if(W>0){s.setAttribute('viewBox',`0 0 ${W} ${H}`);s.innerHTML=f(W,H);bindTips(e.target)}}}));
 $$('.fig').forEach(el=>{if(FIGS.has(el.id))ro.observe(el)})}
function redraw(id){const el=document.getElementById(id);if(!el)return;const f=FIGS.get(id),s=el.querySelector('svg');const W=el.clientWidth,H=el.clientHeight;s.setAttribute('viewBox',`0 0 ${W} ${H}`);s.innerHTML=f(W,H);bindTips(el)}
const css=v=>`var(--${v})`;

/* ---------- modules ---------- */
const MODS=[
 ['Vue d\'ensemble',[['accueil','Accueil','home'],['cockpit','Actions du jour','cockpit'],['envoi','Boîte d\'envoi et journal','sig'],['architecture','Comment ça marche','arch']]],
 ['Cursus',[['echeancier','Échéancier et calendriers','ech'],['etudiants','Étudiant·es','etu'],['ateliers','Répartition des ateliers','atl'],['enseignement','Syllabi et notes','ens'],['maia','MAIA et JMA','jma'],['mobilites','Mobilités et stages','mob']]],
 ['Ressources',[['budget','Budget','bud'],['engagements','Engagements et signatures','sig'],['mandats','Mandats','man'],['equipe','Équipe et charges','eq']]],
 ['Événements et instances',[['evenements','Événements','evt'],['jurys','Jurys de diplôme','jur'],['conseils','Conseils et décisions','con']]],
 ['Qualité et mémoire',[['qualite','Qualité et évaluation','qua'],['serveur','Carte du serveur','srv'],['assistant','Assistant','ag']]],
];
const VIEWS={};
const BADGES={};
function nav(){ $('#nav').innerHTML=MODS.map(([g,l])=>`<p class="grp">${g}</p>`+l.map(([id,lab,i])=>{const b=BADGES[id];return `<a href="#${id}" class="${S.view===id?'on':''}" data-v="${id}">${ic(i)}<span>${lab}</span>${b?`<span class="bd${b.q?' q':''}">${b.n}</span>`:''}</a>`}).join('')).join('')}
function render(){const v=VIEWS[S.view]?S.view:'accueil';S.view=v;FIGS.clear();document.body.classList.toggle('is-home',v==='accueil');
 window.APP.badges&&window.APP.badges();nav();
 $('#dayl').textContent=`${JOURS[dt(S.TD).getUTCDay()]} ${frl(iso(S.TD))}`;
 $('#main').innerHTML=VIEWS[v].html();
 $$('[data-fiche]').forEach(b=>b.onclick=()=>fiche(b.dataset.fiche));
 $$('[data-go]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.go});
 VIEWS[v].bind&&VIEWS[v].bind();bindTips($('#main'));drawFigs()}
function fiche(n){const c=window.CAT[n];if(!c)return;drawer(`<p class="muted">Catalogue de propositions · fiche ${n} · ${esc(c.type)}</p><h3>${esc(c.titre)}</h3><p>${esc(c.desc)}</p><h5>Données rattachées</h5><p class="muted" style="font-size:13px">${esc(c.data)}</p>`)}
function go(){const h=location.hash.slice(1);S.view=VIEWS[h]?h:'accueil';closeDrawer();render();window.scrollTo(0,0)}

Object.assign(window.APP,{D,$,$$,esc,dd,dt,iso,fr,frs,frl,MO,JOURS,chf,k,pct,est,SL,showTip,hideTip,bindTips,drawer,close:closeDrawer,toast,vh,kpi,pn,sparkPath,fig,redraw,css,VIEWS,BADGES,render,fiche,ic});

window.addEventListener('DOMContentLoaded',()=>{
 const sl=$('#day');sl.min=0;sl.max=364;sl.value=S.TD;
 sl.oninput=()=>{S.TD=+sl.value;render()};sl.onchange=()=>{window.APP.save&&window.APP.save()};
 $('#reset').onclick=()=>{S.TD=dd('2026-12-07');sl.value=S.TD;render();window.APP.save&&window.APP.save()};
 $('#veil').onclick=closeDrawer;$('#dx').onclick=closeDrawer;
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();location.hash='assistant';setTimeout(()=>{const q=$('#q');q&&q.focus()},60)}});
 $('#askb').onclick=()=>{location.hash='assistant';setTimeout(()=>{const q=$('#q');q&&q.focus()},60)};
 window.addEventListener('hashchange',go);go()});
})();
