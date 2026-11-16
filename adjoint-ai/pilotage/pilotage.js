(function(){
'use strict';
/* Démonstrateur : les dates « officiel » viennent du calendrier académique 2026-2027 et des pages
   d'admission et de mobilité de la HEAD – Genève ; tâches, responsables, personnes et dossiers sont fictifs. */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const D0=new Date('2026-09-07T12:00:00Z'),DAY=864e5;
const dd=s=>Math.round((new Date(s+'T12:00:00Z')-D0)/DAY);
const iso=n=>{const d=new Date(D0.getTime()+n*DAY);return d.toISOString().slice(0,10)};
const fr=s=>{const [y,m,d]=s.split('-');return `${d}.${m}.${y}`};
const frl=n=>new Date(D0.getTime()+n*DAY).toLocaleDateString('fr-CH',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const OFF={cal:['Calendrier académique 2026-2027','https://www.hesge.ch/sites/head/files/2026-10/CalendrierAcademique_2026-2027_Sept26.pdf'],adm:['Admissions, calendrier','https://www.hesge.ch/head/admissions/bachelor/calendrier-des-admissions'],mob:['Mobilité OUT','https://www.hesge.ch/head/ecole/international/mobilite/partir-en-echange-a-letranger-out']};
const OWN={resp:'Responsable de département',adj:'Adjoint',sec:'Secrétariat',ens:'Enseignants',etu:'Étudiants',rh:'Service RH',fin:'Service financier',com:'Service communication',bde:'Bureau des études',ri:'Relations internationales'};

/* jalons officiels */
const MS=[
 ['2026-09-14','2026-09-18','Semaine inaugurale','BA+MA','cal'],['2026-11-02','2026-11-06','Semaine « hors cadre »','BA+MA','cal'],
 ['2027-01-11','2027-01-15','Semaine « hors cadre »','BA+MA','cal'],['2027-01-18','2027-01-22','Jurys du semestre d\'automne','BA+MA','cal'],
 ['2027-01-23','2027-01-23','Portes ouvertes','BA+MA','cal'],['2027-01-25','2027-02-05','Remédiations','BA+MA','cal'],
 ['2027-02-22','2027-02-26','Semaine de tous les possibles','BA+MA','cal'],['2027-03-09','2027-03-15','Concours BA, 1er tour','BA','cal'],
 ['2027-03-30','2027-04-07','Concours MA, 1er tour','MA','cal'],['2027-04-12','2027-04-16','Concours BA, entretiens','BA','cal'],
 ['2027-04-19','2027-04-23','Semaine « hors cadre »','BA+MA','cal'],['2027-04-28','2027-05-07','Concours MA, entretiens','MA','cal'],
 ['2027-06-07','2027-06-11','Semaine « hors cadre »','BA+MA','cal'],['2027-06-14','2027-06-23','Jurys du semestre de printemps','BA+MA','cal'],
 ['2027-06-28','2027-07-09','Remédiations','BA+MA','cal'],['2027-07-07','2027-07-07','Fête des diplômes','BA+MA','cal'],
];
/* tâches : [id, titre, échéance, délai de déclenchement (jours), responsable, publics, formation, officiel, note] */
const T=[
 ['t01','Rentrée : listes de classes et groupes d\'atelier publiés','2026-09-11',14,'sec',['eq','ens','etu1','etu2','etu3','ma1','ma2','bde'],'BA+MA',null,''],
 ['t02','Contrats des intervenants du semestre d\'automne signés','2026-09-14',35,'rh',['eq','rh'],'BA+MA',null,''],
 ['t03','Séance d\'information mobilités OUT 2027-2028','2026-10-20',21,'ri',['eq','etu1','etu2','ri'],'BA+MA','mob',''],
 ['t04','Inviter les jurés externes des jurys de janvier','2026-11-23',21,'adj',['eq','ens'],'BA+MA',null,'Huit semaines avant les jurys.'],
 ['t05','Vœux de mobilité pour l\'automne 2027','2026-11-30',15,'etu',['eq','etu1','etu2','ri'],'BA+MA','mob','Du 15 au 30 novembre 2026.'],
 ['t06','Composer les jurys d\'atelier de janvier','2026-11-30',21,'adj',['eq','ens'],'BA+MA',null,''],
 ['t07','Convention annuelle avec l\'École Camondo','2026-12-04',30,'resp',['eq'],'MA',null,''],
 ['t08','Réserver les salles des jurys de janvier','2026-12-11',14,'sec',['eq','bde'],'BA+MA',null,''],
 ['t09','Contrats des jurés externes de janvier signés','2026-12-18',21,'rh',['eq','rh'],'BA+MA',null,''],
 ['t10','Learning agreements des départs du printemps 2027 validés','2026-12-18',21,'ri',['eq','ri','etu3'],'BA+MA',null,''],
 ['t11','Ordre de passage des jurys publié','2027-01-08',10,'adj',['eq','ens','etu1','etu2','etu3','ma1','ma2'],'BA+MA',null,''],
 ['t12','Programme et stands des portes ouvertes','2027-01-15',28,'com',['eq','com'],'BA+MA',null,''],
 ['t13','Rappel du délai des notes aux enseignants','2027-01-15',5,'adj',['eq'],'BA+MA',null,''],
 ['t14','Notes du semestre d\'automne saisies, 17h','2027-01-22',7,'ens',['eq','ens','bde'],'BA+MA','cal','Délai officiel du calendrier académique.'],
 ['t15','Inscriptions à la Semaine de tous les possibles','2027-02-05',14,'etu',['eq','etu1','etu2','etu3','ma1','bde'],'BA+MA',null,''],
 ['t16','Défraiements des jurés de janvier payés','2027-02-05',14,'fin',['eq','fin'],'BA+MA',null,''],
 ['t17','Contrats des intervenants du semestre de printemps signés','2027-02-15',35,'rh',['eq','rh'],'BA+MA',null,''],
 ['t18','Commission du concours BA constituée','2027-02-26',21,'resp',['eq','ens'],'BA',null,''],
 ['t19','Dossier de participation à la Milan Design Week','2027-02-26',35,'adj',['eq','com','ma1','ma2'],'MA',null,''],
 ['t20','Commission du concours MA constituée','2027-03-19',21,'resp',['eq','ens'],'MA',null,''],
 ['t21','Convocations aux entretiens du concours BA','2027-03-26',7,'sec',['eq'],'BA',null,''],
 ['t22','Inviter les jurés externes des thèses de juin','2027-04-19',21,'adj',['eq','ens'],'BA+MA',null,'Huit semaines avant les jurys de thèse.'],
 ['t23','Exposition des diplômes MAIA : lieu et scénographie','2027-04-30',45,'adj',['eq','com','ma2'],'MA',null,''],
 ['t24','Contrats des jurés de thèse signés','2027-05-14',21,'rh',['eq','rh'],'BA+MA',null,''],
 ['t25','Demandes de stage S5 approuvées pour l\'automne 2027','2027-06-04',30,'resp',['eq','etu2'],'BA',null,'Approbation avant le semestre, module 15AP.'],
 ['t26','Notes du semestre de printemps saisies, 17h','2027-06-23',7,'ens',['eq','ens','bde'],'BA+MA','cal','Délai officiel du calendrier académique.'],
 ['t27','Bilan de l\'année et calendrier 2027-2028','2027-07-02',21,'adj',['eq'],'BA+MA',null,''],
];
const LATE=new Set(['t03']);           // une tâche passée non faite, pour la démonstration
const done={};try{Object.assign(done,JSON.parse(localStorage.getItem('pil-done')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('pil-done',JSON.stringify(done))}catch(e){}};

/* jurys : circuit de l'action B */
const J=[
 ['Jurys d\'atelier BA, S1','2027-01-18',4,'BA',['A']],['Jurys d\'atelier BA, S3','2027-01-19',4,'BA',['B']],['Jurys d\'atelier BA, S5','2027-01-20',5,'BA',['C']],
 ['Jurys de studio MAIA 1','2027-01-21',3,'MA',['D']],['Jurys de studio MAIA 3','2027-01-22',3,'MA',['E']],
 ['Jurys de Bachelor Thesis','2027-06-14',18,'BA',['C']],['Jurys de Master Thesis','2027-06-21',12,'MA',['E']],
];
const STEPS=[['Invités',-56,-42],['Confirmés',-49,-35],['Contrats',-35,-21],['Grilles',-14,-3],['Défrayés',2,21]];
const noise=(i,k)=>((i*37+k*53)%11)/10;
function jstep(j,ji,k,t){const d=dd(j[1]),a=d+STEPS[k][1],b=d+STEPS[k][2];let f=(t-a)/(b-a);f=Math.max(0,Math.min(1,f));if(f>0&&f<1)f=Math.min(1,f*(0.75+noise(ji,k)*0.3));return Math.round(f*j[2])}

/* dossiers individuels (vue équipe) */
const C=[
 ['BA3-017','Stage S5, automne 2027','Approbation avant le semestre','2027-06-04','resp'],
 ['BA2-031','Mobilité OUT, automne 2027','Vœux à déposer','2026-11-30','etu'],
 ['BA2-012','Mobilité OUT, automne 2027','Vœux déposés, entretien','2026-12-04','ri'],
 ['BA3-006','Mobilité OUT, printemps 2027','Learning agreement à valider','2026-12-18','ri'],
 ['BA1-008','Équivalence','Décision à notifier','2026-10-02','bde'],
 ['BA2-022','Module en répétition, 12REB1','Point de suivi avec l\'enseignant','2026-12-11','adj'],
 ['BA3-029','Module en répétition, 14TEE1','Point de suivi avec l\'enseignant','2026-11-27','adj'],
 ['BA1-041','Absences en workshop','Entretien, risque de 1.0','2026-11-20','adj'],
 ['MA1-004','Séminaires JMA','Choix des séminaires du printemps','2027-01-29','etu'],
 ['MA2-011','Master Thesis','Composition du jury','2027-04-19','adj'],
 ['IN-003','Mobilité IN, printemps 2027','Accueil et learning agreement','2027-01-29','ri'],
];

const TEACH=[['A','Enseignant A · atelier S1'],['B','Enseignant B · atelier S3'],['C','Enseignant C · atelier S5 et thèses'],['D','Enseignant D · studio MAIA 1'],['E','Enseignant E · studio MAIA 3 et thèses']];
const STUD=[['etu1','Bachelor, 1re année'],['etu2','Bachelor, 2e année'],['etu3','Bachelor, 3e année'],['ma1','MAIA 1'],['ma2','MAIA 2']];
const SRV=[['rh','Service RH'],['fin','Service financier'],['com','Service communication'],['bde','Bureau des études'],['ri','Relations internationales']];
const VIEWS=[['eq','Équipe de direction'],['ens','Enseignants'],['etu','Étudiants'],['srv','Services']];
let V='eq',SEL={ens:'C',etu:'etu3',srv:'rh'};
let TD=dd('2026-11-16');

function status(t,today){const d=dd(t[2]);if(done[t[0]])return'done';if(d<today)return LATE.has(t[0])?'late':(done[t[0]]===false?'late':'done');
 if(today>=d-t[3]){return d-today<=7?'trig':'open'}return'soon'}
const SL={late:'En retard',trig:'À déclencher',open:'En cours',done:'Fait',soon:'À venir'};

const tip=$('#tip');const showTip=(e,h)=>{tip.innerHTML=h;tip.style.opacity=1;const r=tip.getBoundingClientRect();tip.style.left=Math.min(e.clientX+14,innerWidth-r.width-10)+'px';tip.style.top=Math.min(e.clientY+14,innerHeight-r.height-10)+'px'};const hideTip=()=>tip.style.opacity=0;
const drawer=$('#drawer');$('#dx').onclick=()=>drawer.classList.remove('open');document.addEventListener('keydown',e=>{if(e.key==='Escape')drawer.classList.remove('open')});
function openTask(id){const t=T.find(x=>x[0]===id),s=status(t,TD);
 $('#dbody').innerHTML=`<p class="lab">${t[6]} · ${SL[s]}</p><h3>${esc(t[1])}</h3><dl><dt>Échéance</dt><dd>${fr(t[2])}${t[7]?` <span class="off">officiel</span>`:''}</dd><dt>Déclenchement</dt><dd>${fr(iso(dd(t[2])-t[3]))}, ${t[3]} jours avant</dd><dt>Responsable</dt><dd>${OWN[t[4]]}</dd><dt>Visible par</dt><dd>${t[5].map(a=>({eq:'Équipe',ens:'Enseignants',etu1:'BA 1',etu2:'BA 2',etu3:'BA 3',ma1:'MAIA 1',ma2:'MAIA 2',rh:'RH',fin:'Finances',com:'Communication',bde:'Bureau des études',ri:'Relations internationales'}[a])).join(', ')}</dd>${t[8]?`<dt>Note</dt><dd>${esc(t[8])}</dd>`:''}${t[7]?`<dt>Source</dt><dd><a href="${OFF[t[7]][1]}" target="_blank" rel="noopener">${OFF[t[7]][0]}</a></dd>`:''}</dl>
 <div class="act"><button id="bd">${s==='done'?'Rouvrir':'Marquer comme fait'}</button></div>`;
 $('#bd').onclick=()=>{if(s==='done'){done[id]=false}else{done[id]=true}save();drawer.classList.remove('open');render()};drawer.classList.add('open')}

function rows(list){if(!list.length)return'<p class="empty">Aucune échéance sur la période.</p>';
 return '<div class="rows">'+list.map(t=>{const s=status(t,TD);return `<div class="r ${s}" data-id="${t[0]}"><i class="dot ${s}"></i><span class="d">${fr(t[2]).slice(0,5)}</span><span class="t"><b>${esc(t[1])}</b>${t[7]?'<span class="off">officiel</span>':''}<small>${t[6]}${t[8]?' · '+esc(t[8]):''}</small></span><span class="o">${OWN[t[4]]}</span><span class="s">${SL[s]}</span></div>`}).join('')+'</div>'}

function timeline(list){const w0=Math.floor(TD/7)-2,NW=28,cw=34,lx=0,H=118;let s=`<svg width="${NW*cw+10}" height="${H}" font-family="Archivo" font-size="10">`;
 const MO=['JANV','FÉVR','MARS','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC'];let pm=-1;
 for(let k=0;k<NW;k++){const n=(w0+k)*7,d=new Date(D0.getTime()+n*DAY),x=lx+k*cw;if(d.getUTCMonth()!==pm){pm=d.getUTCMonth();s+=`<text x="${x+2}" y="10" font-weight="600" letter-spacing=".8">${MO[pm]}</text><line x1="${x}" x2="${x}" y1="0" y2="${H-14}" stroke="rgba(18,18,18,.15)"/>`}
  s+=`<text x="${x+cw/2}" y="${H-2}" text-anchor="middle" fill="#8b887f" font-size="9">${String(d.getUTCDate()).padStart(2,'0')}</text>`}
 MS.forEach(m=>{const a=dd(m[0]),b=dd(m[1]);const x1=lx+(a/7-w0)*cw,x2=lx+((b+1)/7-w0)*cw;if(x2<0||x1>NW*cw)return;const j=/Jurys/.test(m[2]);
  s+=`<rect class="ms" data-t="${esc(m[2])}" data-d="${fr(m[0])}${m[0]!==m[1]?' au '+fr(m[1]):''}" x="${Math.max(0,x1)}" y="18" width="${Math.max(3,x2-Math.max(0,x1))}" height="12" fill="${j?'#121212':/Concours/.test(m[2])?'#8b887f':'#d8d5ce'}"/>`});
 const lanes={};list.forEach(t=>{const n=dd(t[2]);const k=Math.floor(n/7)-w0;if(k<0||k>=NW)return;lanes[k]=(lanes[k]||0)+1;const y=44+(lanes[k]-1)*11;const st=status(t,TD);const c=st==='late'?'#e6483a':st==='done'?'#b9b6ad':'#121212';
  s+=`<circle class="pt" data-id="${t[0]}" cx="${lx+k*cw+cw/2}" cy="${y}" r="4.5" fill="${st==='trig'||st==='soon'?'#f2f0eb':c}" stroke="${st==='trig'?'#e6483a':c}" stroke-width="${st==='trig'?2:1.2}"/>`});
 const xn=lx+(TD/7-w0)*cw;s+=`<line x1="${xn}" x2="${xn}" y1="14" y2="${H-14}" stroke="#e6483a"/><text x="${xn+3}" y="${H-16}" fill="#e6483a" font-weight="600" font-size="9">AUJOURD'HUI</text></svg>`;
 return `<div class="tl-svg">${s}</div>`}
function bindTL(){$$('.ms').forEach(r=>{r.onmousemove=e=>showTip(e,`<b>${r.dataset.t}</b><i>${r.dataset.d} · calendrier officiel</i>`);r.onmouseleave=hideTip});
 $$('.pt').forEach(c=>{const t=T.find(x=>x[0]===c.dataset.id);c.style.cursor='pointer';c.onmousemove=e=>showTip(e,`<b>${esc(t[1])}</b><i>${fr(t[2])} · ${OWN[t[4]]} · ${SL[status(t,TD)]}</i>`);c.onmouseleave=hideTip;c.onclick=()=>openTask(t[0])});
 $$('.r[data-id]').forEach(r=>r.onclick=()=>openTask(r.dataset.id))}

function juries(list){let h=`<div class="jury h"><span>Session</span>${STEPS.map(s=>`<span>${s[0]}</span>`).join('')}</div>`;
 list.forEach(j=>{const ji=J.indexOf(j);h+=`<div class="jury"><span>${esc(j[0])}<small>${fr(j[1])} · ${j[2]} jurés externes requis</small></span>`+STEPS.map((s,k)=>{const n=jstep(j,ji,k,TD),f=n/j[2],d=dd(j[1]);const lateStep=TD>d+s[2]&&n<j[2];
  return `<span><span class="bar${f>=1?' full':''}${lateStep?' low':''}"><i style="width:${f*100}%"></i></span><span class="n">${n}/${j[2]}</span></span>`}).join('')+'</div>'});return h}

function cases(){return C.map(c=>{const d=dd(c[3]);const st=d<TD-3?'late':d<TD?'trig':'open';return `<div class="case ${st}"><b>${c[0]}</b><span>${esc(c[1])}<small>${esc(c[2])}</small></span><span>${fr(c[3])}<small>${OWN[c[4]]}</small></span><span class="s">${st==='late'?'En retard':st==='trig'?'À traiter':'Suivi'}</span></div>`}).join('')}

function kpi(n,l,red){return `<div class="kpi"><p class="lab">${l[0]}</p><b class="${red&&n?'r':''}">${n}</b><span>${l[1]}</span></div>`}

function render(){$('#dayl').textContent=frl(TD);
 $('#views').innerHTML=VIEWS.map(v=>`<button data-v="${v[0]}" class="${V===v[0]?'on':''}">${v[1]}</button>`).join('');
 $$('#views button').forEach(b=>b.onclick=()=>{V=b.dataset.v;render()});
 const who=$('#who');
 if(V==='ens')who.innerHTML=`<p class="lab">Personne</p><select id="sel">${TEACH.map(t=>`<option value="${t[0]}"${SEL.ens===t[0]?' selected':''}>${t[1]}</option>`).join('')}</select>`;
 else if(V==='etu')who.innerHTML=`<p class="lab">Promotion</p><select id="sel">${STUD.map(t=>`<option value="${t[0]}"${SEL.etu===t[0]?' selected':''}>${t[1]}</option>`).join('')}</select>`;
 else if(V==='srv')who.innerHTML=`<p class="lab">Service</p><select id="sel">${SRV.map(t=>`<option value="${t[0]}"${SEL.srv===t[0]?' selected':''}>${t[1]}</option>`).join('')}</select>`;
 else who.innerHTML='';
 if($('#sel'))$('#sel').onchange=e=>{SEL[V]=e.target.value;render()};
 const win=t=>{const d=dd(t[2]);return (d>=TD-14&&d<=TD+70)||(d<TD&&status(t,TD)==='late')};
 let h='';
 if(V==='eq'){const act=T.filter(t=>['trig','late'].includes(status(t,TD)));const next=T.filter(win).sort((a,b)=>a[2].localeCompare(b[2]));
  const jn=J.filter(j=>dd(j[1])>=TD-21).slice(0,5);const jr=jn.reduce((a,j)=>a+j[2],0),jc=jn.reduce((a,j)=>a+jstep(j,J.indexOf(j),1,TD),0);
  h+=`<div class="hd"><h1>Équipe de direction<br><span>tout le département, ${new Date(D0.getTime()+TD*DAY).toLocaleDateString('fr-CH',{day:'numeric',month:'long',timeZone:'UTC'})}</span></h1><p>L'interface proposée en action A du dossier. Chaque échéance porte un responsable et une date de déclenchement ; l'alerte part avant qu'il soit trop tard. Le curseur « Aujourd'hui » fait avancer l'année.</p></div>
  <div class="kpis">${kpi(act.filter(t=>status(t,TD)==='trig').length,['À déclencher','échéances sous sept jours, non faites'],1)}${kpi(act.filter(t=>status(t,TD)==='late').length,['En retard','échéances dépassées, non faites'],1)}${kpi(`${jc}/${jr}`,['Jurés confirmés','prochaines sessions de jury'],0)}${kpi(C.filter(c=>dd(c[3])>=TD-3).length,['Dossiers individuels','stage, mobilité, équivalence, échec'],0)}</div>
  <h2>Les 28 prochaines semaines<span>jalons officiels en bandeau, échéances en points</span></h2>${timeline(T)}
  <div class="grid2"><div><h2>Échéances, deux semaines passées et dix à venir<span>${next.length}</span></h2>${rows(next)}</div>
  <div><h2>Circuit des jurys, action B<span>jurés externes</span></h2>${juries(J.filter(j=>dd(j[1])>=TD-30).slice(0,6))}
  <h2>Dossiers individuels<span>vue réservée à l'équipe</span></h2>${cases()}</div></div>`}
 else if(V==='ens'){const me=SEL.ens,name=TEACH.find(t=>t[0]===me)[1];const mine=T.filter(t=>t[5].includes('ens')&&dd(t[2])>=TD-14).sort((a,b)=>a[2].localeCompare(b[2]));const myj=J.filter(j=>j[4].includes(me));
  h+=`<div class="hd"><h1>${esc(name.split(' · ')[0])}<br><span>${esc(name.split(' · ')[1])}</span></h1><p>Ce que voit un enseignant : ses jurys, ses délais de notes et ce qui le concerne dans le calendrier. Rien d'autre.</p></div>
  <div class="kpis">${kpi(myj.filter(j=>dd(j[1])>=TD).length,['Mes jurys','à venir cette année'],0)}${kpi(mine.filter(t=>['trig','late'].includes(status(t,TD))).length,['À faire','sous sept jours'],1)}${kpi(fr('2027-01-22').slice(0,5),['Notes d\'automne','délai officiel, 17h'],0)}${kpi(fr('2027-06-23').slice(0,5),['Notes de printemps','délai officiel, 17h'],0)}</div>
  <h2>Mon calendrier<span>jalons officiels et échéances</span></h2>${timeline(mine)}
  <div class="grid2"><div><h2>Mes échéances<span>${mine.length}</span></h2>${rows(mine)}</div><div><h2>Mes jurys<span>état du circuit des jurés</span></h2>${juries(myj)}</div></div>`}
 else if(V==='etu'){const me=SEL.etu,name=STUD.find(t=>t[0]===me)[1];const mine=T.filter(t=>t[5].includes(me)&&dd(t[2])>=TD-14).sort((a,b)=>a[2].localeCompare(b[2]));
  h+=`<div class="hd"><h1>${esc(name)}<br><span>mes démarches</span></h1><p>Ce que voit une promotion : les échéances qui la concernent, au moment où elles se déclenchent. Les dossiers individuels restent du côté de l'équipe.</p></div>
  <div class="kpis">${kpi(mine.filter(t=>['trig','open'].includes(status(t,TD))).length,['En cours','démarches ouvertes'],0)}${kpi(mine.filter(t=>status(t,TD)==='trig').length,['Urgent','sous sept jours'],1)}${kpi(MS.filter(m=>dd(m[0])>=TD&&/Jurys/.test(m[2])).length,['Sessions de jurys','à venir'],0)}${kpi(MS.filter(m=>dd(m[0])>=TD&&/Semaine/.test(m[2])).length,['Semaines spéciales','workshops et « hors cadre »'],0)}</div>
  <h2>Mon année<span>jalons officiels et démarches</span></h2>${timeline(mine)}<h2>Mes démarches<span>${mine.length}</span></h2>${rows(mine)}`}
 else {const me=SEL.srv,name=SRV.find(t=>t[0]===me)[1];const mine=T.filter(t=>(t[4]===me||t[5].includes(me))&&dd(t[2])>=TD-14).sort((a,b)=>a[2].localeCompare(b[2]));
  h+=`<div class="hd"><h1>${esc(name)}<br><span>ce que le département attend de nous</span></h1><p>Ce que voit un service : ses tâches pour le département, avec la date à laquelle il doit les lancer. Il n'a pas à reconstituer le calendrier de la filière.</p></div>
  <div class="kpis">${kpi(mine.filter(t=>status(t,TD)==='trig').length,['À déclencher','sous sept jours'],1)}${kpi(mine.filter(t=>status(t,TD)==='open').length,['En cours','fenêtre ouverte'],0)}${kpi(mine.filter(t=>status(t,TD)==='soon').length,['À venir','cette année'],0)}${kpi(mine.filter(t=>status(t,TD)==='late').length,['En retard','à traiter'],1)}</div>
  <h2>Calendrier du service<span>jalons officiels et tâches</span></h2>${timeline(mine)}<h2>Tâches<span>${mine.length}</span></h2>${rows(mine)}${me==='rh'||me==='fin'?`<h2>Circuit des jurys<span>étapes contrats et défraiements</span></h2>${juries(J.filter(j=>dd(j[1])>=TD-30))}`:''}`}
 $('#main').innerHTML=h;bindTL()}

const sl=$('#day');sl.value=TD;sl.oninput=()=>{TD=+sl.value;render()};render();
window.__ok=true;
})();
