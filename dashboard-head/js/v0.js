/* Accueil : une porte d'entrée simple, un pictogramme par outil, ce qui presse en premier */
(function(){
'use strict';
const A=window.APP,D=A.D,S=A.S,{esc,dd,iso,frl,frs}=A;
const G='<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const T=s=>`<g fill="var(--pict,var(--famt))" stroke="none">${s}</g>`,F=s=>`<g fill="var(--fam)" stroke="none">${s}</g>`;
/* pictogrammes 48 × 48 : une forme de fond teintée, le dessin au trait, un détail plein */
const P={
 cockpit:T('<circle cx="33" cy="15" r="10"/>')+G+'<rect x="10" y="9" width="26" height="33" rx="3"/><path d="M18 9V6h10v3"/><path d="M15 20l3 3 5-6M15 32l3 3 5-6"/><path d="M27 21h5M27 33h5"/></g>',
 envoi:T('<rect x="5" y="11" width="30" height="24" rx="3"/>')+G+'<rect x="10" y="15" width="30" height="22" rx="2"/><path d="M10 17l15 11 15-11"/></g>'+F('<circle cx="39" cy="14" r="5"/>'),
 echeancier:T('<rect x="5" y="8" width="26" height="26" rx="3"/>')+G+'<rect x="9" y="11" width="31" height="29" rx="3"/><path d="M9 19h31M17 7v8M32 7v8"/><path d="M15 26h4M15 33h4"/></g>'+F('<rect x="25" y="26" width="8" height="8" rx="1.5"/>'),
 etudiants:T('<circle cx="31" cy="20" r="13"/>')+G+'<circle cx="19" cy="17" r="5"/><path d="M9 39c1-7 5-10 10-10s9 3 10 10"/><circle cx="32" cy="19" r="4"/><path d="M31.5 27c5 0 8.5 3.5 9 10"/></g>',
 ateliers:T('<rect x="24" y="6" width="18" height="18" rx="3"/>')+G+'<rect x="8" y="8" width="14" height="14" rx="2"/><rect x="26" y="8" width="14" height="14" rx="2"/><rect x="8" y="26" width="14" height="14" rx="2"/><rect x="26" y="26" width="14" height="14" rx="2"/></g>'+F('<circle cx="15" cy="15" r="2.6"/><circle cx="33" cy="33" r="2.6"/><circle cx="15" cy="33" r="2.6"/>'),
 enseignement:T('<path d="M6 8h18v30H6z"/>')+G+'<path d="M24 13c-4-3-10-4-16-3v27c6-1 12 0 16 3 4-3 10-4 16-3V10c-6-1-12 0-16 3z"/><path d="M24 13v27"/><path d="M12 18h7M12 23h7M29 18h7"/></g>'+F('<path d="M29 24l3 3 5-6" stroke="var(--fam)" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
 maia:T('<circle cx="24" cy="24" r="15"/>')+G+'<path d="M6 39h36"/><path d="M10 39V25a14 14 0 0 1 28 0v14"/><path d="M18 39V27a6 6 0 0 1 12 0v12"/></g>',
 mobilites:T('<circle cx="22" cy="27" r="15"/>')+G+'<circle cx="22" cy="27" r="13"/><path d="M9 27h26M22 14c-5 4-5 22 0 26M22 14c5 4 5 22 0 26"/></g>'+F('<path d="M33 7l10 5-10 5 2.5-5z"/>'),
 budget:T('<circle cx="30" cy="18" r="12"/>')+G+'<path d="M7 40h34"/><rect x="11" y="27" width="6" height="13" rx="1"/><rect x="31" y="22" width="6" height="18" rx="1"/></g>'+F('<rect x="21" y="16" width="6" height="24" rx="1"/>'),
 engagements:T('<rect x="6" y="20" width="30" height="20" rx="3"/>')+G+'<path d="M9 41h30"/><path d="M11 34c4-1 6-11 9-11s1 10 5 10 3-3 6-4"/><path d="M33 7l6 6-12 12h-6v-6z"/></g>',
 mandats:T('<rect x="5" y="12" width="28" height="22" rx="3"/>')+G+'<rect x="9" y="16" width="31" height="23" rx="3"/><path d="M19 16v-4h11v4M9 26h31"/></g>'+F('<rect x="21" y="23.5" width="7" height="5.5" rx="1"/>'),
 equipe:T('<circle cx="24" cy="15" r="11"/>')+G+'<circle cx="24" cy="13" r="5"/><path d="M15 26c1-5 5-7 9-7s8 2 9 7"/><path d="M24 29v4M12 33h24M12 33v3M36 33v3M24 33v3"/><circle cx="12" cy="39" r="2.5"/><circle cx="24" cy="39" r="2.5"/><circle cx="36" cy="39" r="2.5"/></g>',
 evenements:T('<path d="M12 8h26l-6 8 6 8H12z"/>')+G+'<path d="M12 42V7"/><path d="M12 9h24l-5 7 5 7H12"/></g>'+F('<circle cx="12" cy="42" r="3"/>'),
 jurys:T('<rect x="8" y="26" width="32" height="13" rx="2"/>')+G+'<path d="M6 39h36"/><path d="M10 39V28h28v11"/><circle cx="15" cy="19" r="4"/><circle cx="33" cy="19" r="4"/></g>'+F('<circle cx="24" cy="17" r="4.5"/>'),
 conseils:T('<path d="M30 17h12v18h-12z"/>')+G+'<path d="M7 11h23v15H17l-6 5v-5H7z"/><path d="M34 18h7v15h-3v5l-6-5h-9v-3"/></g>'+F('<circle cx="14" cy="18.5" r="1.8"/><circle cx="19" cy="18.5" r="1.8"/><circle cx="24" cy="18.5" r="1.8"/>'),
 qualite:T('<path d="M8 40V22l9-6 8 7 15-13v30z"/>')+G+'<path d="M8 40V8M8 40h33"/><path d="M13 31l8-8 6 5 11-12"/><path d="M33 16h5v5"/></g>',
serveur:T('<circle cx="24" cy="24" r="16"/>')+G+'<circle cx="24" cy="24" r="5"/><circle cx="9" cy="11" r="3.5"/><circle cx="39" cy="11" r="3.5"/><circle cx="9" cy="37" r="3.5"/><circle cx="39" cy="37" r="3.5"/><circle cx="24" cy="6" r="2.5"/><path d="M20 21l-8-7.5M28 21l8-7.5M20 27l-8 7.5M28 27l8 7.5M24 19v-10"/></g>'+F('<circle cx="24" cy="24" r="3"/>'),
 assistant:T('<circle cx="24" cy="21" r="14"/>')+G+'<path d="M8 10h32v22H22l-8 7v-7H8z"/><path d="M20 18a4 4 0 1 1 5.5 3.7c-1 .5-1.5 1.3-1.5 2.3"/></g>'+F('<circle cx="24" cy="28" r="1.8"/>')
};
A.PICTO=(m,s)=>`<svg class="pic" viewBox="0 0 48 48" width="${s||48}" height="${s||48}" aria-hidden="true">${P[m]||''}</svg>`;
/* familles d'outils : chaque outil dit ce qu'on y fait, avec les mots qu'on taperait pour le chercher */
const FAM=[
 ['quo','Au quotidien',[['cockpit','Ce qui m\'attend','Tout ce qui demande une action aujourd\'hui, avec le bouton pour la faire','urgent retard aujourd hui tâche action faire'],
  ['envoi','Mes courriels','Les courriels préparés, prêts à partir, et le journal de ce qui a été fait','mail courriel brouillon envoyer journal annuler'],
  ['echeancier','Le calendrier de l\'année','Les échéances de la filière, ce qui est fait et ce qui vient','échéance date calendrier délai tâche conflit']]],
 ['cur','Les étudiant·es et les cours',[['etudiants','Suivre un·e étudiant·e','Dossiers, cessions de droits, crédits SHC, PEP, conventions','étudiant dossier pep shc cession convention liste trombinoscope'],
  ['ateliers','Répartir les ateliers','Recueillir les choix, ajuster la répartition, la publier','atelier choix répartition forms inscription'],
  ['enseignement','Syllabi et notes','Demander et valider les syllabi, saisir les notes pour AGE','syllabus syllabi note age workshop fiche module'],
  ['maia','Le MAIA et le JMA','Inscriptions au Joint Master, facture, résultats','maia jma joint master séminaire facture inscription'],
  ['mobilites','Échanges et stages','Candidatures IN, départs OUT, conventions de stage','mobilité erasmus in out stage convention bureau permis']]],
 ['res','L\'argent et les personnes',[['engagements','Signer','Engagements des vacataires et bons de commande à signer','signer signature engagement vacataire bon de commande'],
  ['budget','Suivre le budget','Ce qui est engagé, ce qui reste, saisir une dépense','budget dépense argent solde réallouer atelier'],
  ['mandats','Les mandats','Du contrat à la clôture, factures comprises','mandat contrat facture comptabilité numéro clôture'],
  ['equipe','L\'équipe','Annuaire, organigramme, feuilles de charge','équipe annuaire organigramme feuille de charge assistant contact']]],
 ['evt','Les moments de l\'année',[['evenements','Préparer un événement','Portes ouvertes, Semaine de tous les possibles, prix','événement portes ouvertes sdtp workshop prix lauréat'],
  ['jurys','Les jurys de diplôme','Inviter les membres, réserver le Cube, l\'ordre de passage','jury diplôme cube externe passage'],
  ['conseils','Les Conseils','Ordre du jour, envoi, registre des décisions','conseil ordre du jour décision pv procès-verbal']]],
 ['mem','Apprendre et s\'améliorer',[['qualite','Retours et évaluations','Séances de feedback, indicateurs, participation aux EEE','qualité feedback évaluation eee indicateur'],
  ['serveur','La carte du serveur','Tout ARCHI en un graphe à explorer : où est quoi, et qui s\'en sert','serveur archi dossier arborescence carte graphe chemin où trouver classement'],
  ['assistant','Poser une question','Une règle, une procédure, un précédent : la réponse cite le guide','question aide procédure règle guide comment qui quand']]],
];
let Q='';
const SPAN={cockpit:3,engagements:2,evenements:2,jurys:2,serveur:2,assistant:2};
const FOF={};FAM.forEach(([k,,t])=>t.forEach(x=>FOF[x[0]]=k));
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function yearFig(W,H){const E=A.allE();const n=52,c=new Array(n).fill(0);E.forEach(e=>{const w=Math.floor(dd(A.edate(e))/7);if(w>=0&&w<n)c[w]++});
 const mx=Math.max(...c,1),cw=W/n,base=H-18,top=26,cur=Math.floor(S.TD/7);let s='';
 c.forEach((v,i)=>{const h=v?Math.max(6,(base-top)*v/mx):3;const x=i*cw+cw/2;const on=i===cur;s+=`<rect x="${x-1.25}" y="${base-h}" width="2.5" height="${h}" rx="1.25" fill="${on?'var(--lime)':i<cur?'rgba(255,255,255,.28)':'#f2f0eb'}" data-tip="<b>Semaine du ${frs(iso(i*7))}</b><i>${v} échéance${v>1?'s':''}</i>"/><rect x="${i*cw}" y="0" width="${cw}" height="${H}" fill="transparent" data-tip="<b>Semaine du ${frs(iso(i*7))}</b><i>${v} échéance${v>1?'s':''}</i>"/>`});
 const x=cur*cw+cw/2;if(cur>=0&&cur<n)s+=`<g><rect x="${Math.min(Math.max(x-60,0),W-120)}" y="0" width="120" height="20" rx="10" fill="var(--lime)"/><text x="${Math.min(Math.max(x,60),W-60)}" y="14" text-anchor="middle" font-size="11.5" font-weight="600" fill="#121212" style="stroke:none">${c[cur]} cette semaine</text></g>`;
 ['sept.','déc.','mars','juin','août'].forEach((m,i)=>{const d=[0,91,182,273,334][i];s+=`<text x="${Math.min(d/7*cw+2,W-30)}" y="${H-3}" font-size="11" fill="rgba(255,255,255,.55)" style="stroke:none">${m}</text>`});return s}
A.VIEWS.accueil={html(){const q=A.queue();const by={};q.forEach(i=>{const b=by[i.m]||(by[i.m]={n:0,late:0});b.n++;if(i.sev>1)b.late++});
 const late=q.filter(i=>i.sev>1).length,now=q.filter(i=>i.sev>=1).length;const first=q.slice(0,4);const doneT=D.LOG.filter(l=>l.d===iso(S.TD)).length;
 const h=A.dt(S.TD);const J=A.JOURS[h.getUTCDay()];const drafts=D.OUT.filter(o=>o.st!=='envoyé').length;
 const cnt=m=>m==='cockpit'?(now?{n:now,late}:null):m==='envoi'?(drafts?{n:drafts,late:0,w:'à envoyer'}:null):by[m];
 const tile=([m,t,d,kw],fam)=>{const sp=SPAN[m]||1,big=sp>1;const b=cnt(m);const st=b?`<span class="hs${b.late?' r':''}">${b.n} ${b.w||'à traiter'}</span>`:'<span class="hs ok">À jour</span>';
  return `<a class="ht f-${fam}${big?' big s'+sp:''}" href="#${m}" data-kw="${esc(norm(t+' '+d+' '+kw))}"><span class="pw">${A.PICTO(m)}</span>${big&&b?`<span class="hnum">${b.n}</span>`:''}<span class="htx"><b>${t}</b><small>${d}</small></span>${st}</a>`};
 return `<section class="hhero">
  <div class="hdate"><p class="hk">Bonjour Guillaume</p><h1>${J.charAt(0).toUpperCase()+J.slice(1)}</h1><p class="hd">${frl(iso(S.TD)).replace(/^(\d+) /,'$1 ')}</p>
   <div class="hcta"><a class="bt big" href="#cockpit">Voir ce qui m'attend <span aria-hidden="true">→</span></a><a class="bt gh big" href="#assistant">Poser une question</a></div></div>
  <div class="hstats">
   <a class="hcard c-lime" href="#cockpit"><span class="lab">Aujourd'hui</span><b>${now}</b><span>chose${now>1?'s':''} demande${now>1?'nt':''} ton attention</span></a>
   <a class="hcard c-orange" href="#cockpit"><span class="lab">En retard</span><b>${late}</b><span>${late?'à rattraper en premier':'rien en retard'}</span></a>
   <a class="hcard c-ink wide" href="#echeancier"><span class="lab">L'année</span><span class="hyr">${doneT?`${doneT} action${doneT>1?'s':''} faite${doneT>1?'s':''} aujourd'hui`:'Échéances par semaine'}</span>${A.fig('hyear','hyf',yearFig)}</a>
  </div></section>
 <label class="hsearch"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><input type="search" id="hq" placeholder="Que veux-tu faire ? Signer, facture, syllabus…" value="${esc(Q)}" autocomplete="off" aria-label="Chercher un outil"></label>
 ${first.length?`<section class="hfirst"><h2 class="hh"><span>Pour commencer</span></h2><div class="hfg">${first.map(i=>{const a=i.acts.find(x=>x.p)||i.acts[0];return `<div class="hf f-${FOF[i.m]||'quo'}${i.sev>1?' late':''}"><span class="hfp">${A.PICTO(i.m,30)}</span><div><small>${i.sev>1?'<i class="dl"></i>En retard · ':''}${esc((A.MODLAB||{})[i.m]||'')}</small><b>${esc(i.t)}</b></div>${a?`<button class="bt s" data-hq="${esc(i.id)}">${esc(a.l)}</button>`:''}</div>`}).join('')}</div>${q.length>first.length?`<a class="hmore" href="#cockpit">Et ${q.length-first.length} autres dans « Ce qui m'attend » →</a>`:''}</section>`:''}
 <div id="htools">${FAM.map(([k,lab,tools])=>`<section class="hfam" data-fam="${k}"><h2 class="hh"><span>${lab}</span></h2><div class="hgrid">${tools.map(t=>tile(t,k)).join('')}</div></section>`).join('')}
 <p class="hnone" id="hnone" hidden>Aucun outil ne correspond. Essaie un autre mot, ou <a href="#assistant">pose la question à l'assistant</a>.</p></div>
 <p class="hfoot"><a href="#architecture">Comment la plateforme est construite</a> · Démonstrateur : personnes, montants et statuts fictifs ; règles et échéances tirées du guide de passation.</p>`},
 bind(){const q=A.queue();A.$$('[data-hq]').forEach(b=>b.onclick=()=>{const i=q.find(x=>x.id===b.dataset.hq);const a=i&&(i.acts.find(x=>x.p)||i.acts[0]);a&&a.f()});
  const inp=A.$('#hq');const filt=()=>{Q=inp.value;const w=norm(Q).split(/\s+/).filter(Boolean);let n=0;A.$$('.ht').forEach(t=>{const ok=!w.length||w.every(x=>t.dataset.kw.includes(x));t.hidden=!ok;if(ok)n++});A.$$('.hfam').forEach(s=>{s.hidden=![...s.querySelectorAll('.ht')].some(t=>!t.hidden)});A.$('#hnone').hidden=n>0};
  inp.oninput=filt;inp.onkeydown=e=>{if(e.key==='Enter'){const t=A.$$('.ht').find(x=>!x.hidden);if(t)location.hash=t.getAttribute('href').slice(1)}};filt()}};
})();
