/* Vue d'ensemble : actions du jour, architecture, échéancier */
(function(){
'use strict';
const A=window.APP,D=A.D,S=A.S,{esc,dd,iso,fr,frs,frl,est,SL,vh,kpi,pn,fig,chf,pct}=A;
const DOMK=Object.keys(D.DOM);
const MODLAB={cockpit:'Actions',envoi:'Boîte d\'envoi',echeancier:'Échéancier',etudiants:'Étudiant·es',ateliers:'Ateliers',enseignement:'Syllabi et notes',maia:'MAIA et JMA',mobilites:'Mobilités et stages',budget:'Budget',engagements:'Engagements',mandats:'Mandats',equipe:'Équipe',evenements:'Événements',jurys:'Jurys',conseils:'Conseils',qualite:'Qualité',assistant:'Assistant'};
A.MODLAB=MODLAB;
A.EACT={};
/* pastilles : nombre d'actions par module */
A.badges=()=>{for(const k in A.BADGES)delete A.BADGES[k];const q=A.queue();q.forEach(i=>{const b=A.BADGES[i.m]||(A.BADGES[i.m]={n:0,q:true});b.n++;if(i.sev>1)b.q=false});
 const u=q.filter(i=>i.sev>=1).length;if(u)A.BADGES.cockpit={n:u,q:!q.some(i=>i.sev>1)}};

/* ---------- échéance : actions ---------- */
function prepE(e){const ea=A.EACT[e[0]];if(ea)return ea.f(e);A.compose(A.mailForE(e))}
A.prepE=prepE;
function doneE(e,on=true){A.act(`${on?'Fait':'Rouvert'} : ${e[1]}`,'echeancier',()=>{if(on)D.X.edone[e[0]]=true;else delete D.X.edone[e[0]]})}
function moveE(e){A.form({k:'Échéance',t:'Reporter : '+e[1],f:[{id:'d',l:'Nouvelle date',type:'date',v:A.edate(e)}],ok:'Reporter',go:v=>A.act(`Reporté au ${fr(v.d)} : ${e[1]}`,'echeancier',()=>{D.X.edate[e[0]]=v.d})})}
function newTask(){A.form({k:'Échéancier',t:'Nouvelle tâche',f:[{id:'t',l:'Tâche',req:1},{id:'d',l:'Échéance',type:'date',v:iso(S.TD+7)},{id:'dom',l:'Domaine',type:'select',o:DOMK.map(k=>[k,D.DOM[k]])},{id:'m',l:'Module',type:'select',o:Object.entries(MODLAB).filter(([k])=>!['cockpit','envoi'].includes(k))},{id:'note',l:'Précision',type:'textarea',rows:2}],ok:'Créer la tâche',go:v=>A.act('Tâche créée : '+v.t,'echeancier',()=>{D.TASKS.push({id:A.uid('t'),t:v.t,d:v.d,dom:v.dom,m:v.m,note:v.note})})})}
A.newTask=newTask;
function openTask(id){const e=A.allE().find(x=>x[0]===id),s=est(e);
 A.drawer(`<p class="muted">${D.DOM[e[4]]} · <i class="dot d-${s}"></i> ${SL[s]}</p><h3>${esc(e[1])}</h3>
 <dl><dt>Échéance</dt><dd>${frl(A.edate(e))} ${e[9]?'<span class="pill">tâche ajoutée</span>':`<span class="off g">guide</span> ${e[7]?'<span class="pill">date du guide</span>':'<span class="pill o">mois du guide, date indicative</span>'}`}${D.X.edate[e[0]]?' <span class="pill r">reportée</span>':''}</dd>
 <dt>Alerte</dt><dd>${fr(iso(dd(A.edate(e))-e[3]))}, soit ${e[3]} jours avant</dd><dt>Porté par</dt><dd>${esc(e[5])}</dd><dt>Module</dt><dd><a href="#${e[6]}">${MODLAB[e[6]]}</a></dd>${e[8]?`<dt>Précision</dt><dd>${esc(e[8])}</dd>`:''}</dl>
 <div class="bar"><button class="bt" id="tp">${A.EACT[e[0]]?esc(A.EACT[e[0]].l):'Préparer le courriel'}</button><button class="bt gh" id="td">${s==='done'?'Rouvrir':'Marquer comme fait'}</button><button class="bt gh" id="tr">Reporter</button></div>`);
 A.$('#tp').onclick=()=>prepE(e);A.$('#td').onclick=()=>doneE(e,s!=='done');A.$('#tr').onclick=()=>moveE(e)}
A.openTask=openTask;
A.QUEUE.push(()=>A.allE().filter(e=>['late','trig','open'].includes(est(e))).map(e=>{const s=est(e);return{id:'e-'+e[0],m:e[6],sev:s==='late'?2:s==='trig'?1:0,due:A.edate(e),t:e[1],c:`${esc(e[5])} · échéance ${s==='late'?'dépassée le':'le'} ${frs(A.edate(e))}${e[8]?' · '+esc(e[8]):''}`,
 acts:[{l:A.EACT[e[0]]?A.EACT[e[0]].l:'Préparer le courriel',p:1,f:()=>prepE(e)},{l:'Fait',f:()=>doneE(e)}]}}));

/* ---------- roue de l'année ---------- */
function wheel(W,H){const cx=W/2,cy=H/2,R=Math.min(W,H)/2-28,r0=R*.30;const nR=DOMK.length+1,rw=(R-r0)/nR;
 const ang=n=>(-90+360*n/365)*Math.PI/180;const P=(r,n)=>[cx+r*Math.cos(ang(n)),cy+r*Math.sin(ang(n))];
 const arc=(r1,r2,n1,n2)=>{const [x1,y1]=P(r2,n1),[x2,y2]=P(r2,n2),[x3,y3]=P(r1,n2),[x4,y4]=P(r1,n1);const lg=(n2-n1)>182?1:0;return `M${x1},${y1}A${r2},${r2} 0 ${lg} 1 ${x2},${y2}L${x3},${y3}A${r1},${r1} 0 ${lg} 0 ${x4},${y4}Z`};
 let s='';
 for(let i=0;i<nR;i++){s+=`<circle cx="${cx}" cy="${cy}" r="${r0+rw*(i+1)}" fill="none" stroke="var(--line)"/>`;const [tx,ty]=P(r0+rw*i+rw/2,-4);s+=`<text x="${tx}" y="${ty+4}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--g)">${i+1}</text>`}
 s+=`<circle cx="${cx}" cy="${cy}" r="${r0}" fill="none" stroke="var(--line2)"/>`;
 // fenêtre des trois prochaines semaines
 s+=`<path d="${arc(r0,R,S.TD,Math.min(364,S.TD+21))}" fill="var(--red)" opacity=".08"/>`;
 // mois
 const MN=['sept.','oct.','nov.','déc.','janv.','févr.','mars','avr.','mai','juin','juil.','août'];
 for(let m=0;m<12;m++){const y=m<4?2026:2027,mm=((m+8)%12)+1;const n=dd(`${y}-${String(mm).padStart(2,'0')}-01`);const n2=m<11?dd(`${m+1<4?2026:2027}-${String(((m+9)%12)+1).padStart(2,'0')}-01`):365;
  const [x1,y1]=P(r0,n),[x2,y2]=P(R+4,n);s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line2)" stroke-width=".8"/>`;
  const [lx,ly]=P(R+16,(n+n2)/2);s+=`<text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink2)">${MN[m]}</text>`}
 // jalons officiels (anneau intérieur)
 D.MS.forEach(m=>{const a=dd(m[0]),b=dd(m[1])+1;const j=/Jurys/.test(m[2]),c=/Concours/.test(m[2]);
  s+=`<path d="${arc(r0+3,r0+rw-3,a,Math.max(b,a+1.6))}" fill="${j?'var(--ink)':c?'var(--g)':'var(--g2)'}" data-tip="<b>${esc(m[2])}</b><i>${fr(m[0])}${m[0]!==m[1]?' au '+fr(m[1]):''} · officiel</i>"/>`});
 // échéances par domaine
 const seen={};
 A.allE().forEach(e=>{const ring=DOMK.indexOf(e[4])+1;const n=dd(A.edate(e));const key=ring+'-'+Math.round(n/5);seen[key]=(seen[key]||0)+1;const off=(seen[key]-1)*5;
  const [x,y]=P(r0+rw*ring+rw/2+(off%2?-off/2:off/2),n);const st=est(e);
  const fill=st==='late'?'var(--red)':st==='done'?'var(--g2)':st==='trig'?'var(--panel)':st==='open'?'var(--ink)':'var(--panel)';
  const stroke=st==='late'||st==='trig'?'var(--red)':st==='done'?'var(--g2)':'var(--ink)';
  s+=`<circle class="wt" data-id="${e[0]}" cx="${x}" cy="${y}" r="${st==='trig'||st==='late'?6:4.6}" fill="${fill}" stroke="${stroke}" stroke-width="${st==='trig'?2.2:1.2}" style="cursor:pointer" data-tip="<b>${esc(e[1])}</b><i>${fr(A.edate(e))} · ${esc(e[5])} · ${SL[st]}</i>"/>`});
 // aiguille
 const [nx,ny]=P(R+6,S.TD),[ix,iy]=P(r0,S.TD);s+=`<line x1="${ix}" y1="${iy}" x2="${nx}" y2="${ny}" stroke="var(--red)" stroke-width="2"/><circle cx="${nx}" cy="${ny}" r="3.5" fill="var(--red)"/>`;
 // centre
 const wk=Math.floor(S.TD/7)+1,open=A.allE().filter(e=>['trig','open'].includes(est(e))).length;
 s+=`<text x="${cx}" y="${cy-10}" text-anchor="middle" font-size="${Math.max(16,r0*.28)}" font-weight="600" fill="var(--ink)">${frs(iso(S.TD))}</text><text x="${cx}" y="${cy+10}" text-anchor="middle" font-size="12" fill="var(--g)">semaine ${wk} sur 52</text><text x="${cx}" y="${cy+27}" text-anchor="middle" font-size="12" fill="var(--g)">${open} échéances ouvertes</text>`;
 return s}

/* ---------- ACTIONS DU JOUR ---------- */
let QF='all';
function qrow(i){const s=i.sev>1?'late':i.sev===1?'trig':'open';return `<div class="qi" data-q="${i.id}"><i class="dot d-${s}" style="margin-top:6px"></i><span class="t"><span class="tag">${A.MODLAB[i.m]||i.m}</span><b>${esc(i.t)}</b><small>${i.c||''}</small></span>
 <span class="acts">${i.acts.map((a,k)=>`<button class="bt s${a.p?'':' gh'}" data-qa="${i.id}|${k}">${esc(a.l)}</button>`).join('')}<button class="bt s gh" data-qs="${i.id}" title="Ne plus l'afficher pendant une semaine">Reporter</button></span></div>`}
A.qrow=qrow;
function bindQ(list){A.$$('[data-qa]').forEach(b=>b.onclick=()=>{const [id,k]=b.dataset.qa.split('|');const it=list.find(x=>x.id===id);if(it)it.acts[+k].f()});
 A.$$('[data-qs]').forEach(b=>b.onclick=()=>{const it=list.find(x=>x.id===b.dataset.qs);if(it)A.snooze(it.id,7,it.t.replace(/<[^>]+>/g,''))})}
A.bindQ=bindQ;
A.VIEWS.cockpit={html(){const T=S.TD;const Q=A.queue();const L=Q.filter(i=>QF==='all'||i.m===QF);
 const g=[['En retard',L.filter(i=>i.sev>1)],['À faire maintenant',L.filter(i=>i.sev===1)],['Dans les trois semaines',L.filter(i=>i.sev===0)]];
 const mods=[...new Set(Q.map(i=>i.m))];const urg=Q.filter(i=>i.sev>=1).length;
 const sig=D.ENG.filter(x=>x.stage===2).length+D.BC.filter(b=>!b.signed).length;const be=A.budToDate(),bp=[...D.BUD.BA,...D.BUD.MA].reduce((a,x)=>a+x.p,0);
 const today=D.LOG.filter(l=>l.d===iso(T));
 return vh({k:`Actions du jour · ${A.JOURS[A.dt(T).getUTCDay()]} ${frl(iso(T))}`,t:Q.length?`${Q.length} actions à mener, <em>${urg} à traiter maintenant</em>`:'Rien à traiter : la filière est à jour',l:'Tout ce que la filière attend de toi aujourd\'hui, tiré des échéances du guide et des données de chaque module. Chaque ligne porte son geste : préparer le courriel, signer, enregistrer, décider. Une fois fait, la ligne disparaît et le journal en garde la trace.',f:['1.3','6.1','6.3','7.1']})+
 `<div class="kpis">${kpi('À traiter maintenant',urg,'actions en retard ou de la semaine',{r:urg>0})}${kpi('À signer',sig,'dans « A signer »',{go:'engagements',r:sig>3})}${kpi('Courriels à envoyer',D.OUT.filter(o=>o.st==='brouillon').length,'dans la boîte d\'envoi',{go:'envoi'})}${kpi('Budget 2026 engagé',pct(be,bp)+'<small> %</small>',`${A.k(be)} sur ${A.k(bp)}`,{go:'budget'})}${kpi('Fait aujourd\'hui',today.length,'actions au journal',{go:'envoi'})}</div>
 <div class="g2"><section class="pn"><h2>File d'actions<span>${L.length}</span></h2>
 <div class="bar"><div class="chips"><button class="chip${QF==='all'?' on':''}" data-qf="all">Tout<i>${Q.length}</i></button>${mods.map(m=>`<button class="chip${QF===m?' on':''}" data-qf="${m}">${A.MODLAB[m]||m}<i>${Q.filter(i=>i.m===m).length}</i></button>`).join('')}</div><button class="bt s gh" id="nt" style="margin-left:auto">Nouvelle tâche</button></div>
 ${g.map(([h,l])=>l.length?`<p class="qg">${h}<span>${l.length}</span></p>${l.map(qrow).join('')}`:'').join('')||'<p class="empty">Aucune action dans ce filtre.</p>'}</section>
 <div><section class="pn"><h2>L'année en une roue<span>un point s'ouvre au clic</span></h2>${fig('wheel','h420',wheel)}<p class="muted" style="font-size:12.5px;margin:6px 0 0">Anneau 1 : jalons officiels ; puis, vers l'extérieur : ${DOMK.map(k=>D.DOM[k].toLowerCase()).join(' ; ')}.</p></section>
 <section class="pn"><h2>Fait aujourd'hui<span><a href="#envoi">journal complet</a></span></h2>${today.length?`<div class="rows">${today.slice(0,8).map(l=>`<div class="row" style="grid-template-columns:minmax(0,1fr);cursor:default"><span class="t">${esc(l.l)}</span></div>`).join('')}</div><div class="bar" style="margin-top:10px"><button class="bt s gh" id="cundo">Annuler la dernière action</button></div>`:'<p class="empty">Encore rien aujourd\'hui.</p>'}</section>
 ${pn('Veille des espaces Teams','Reporter une nouvelle dans l\'échéancier en un geste',`<div class="rows">${D.TEAMS.map((t,i)=>`<div class="row" style="grid-template-columns:44px minmax(0,1fr) auto;cursor:default"><span class="d">${frs(t[2])}</span><span class="t"><b>${esc(t[1])}</b><small>${esc(t[0])}</small></span>${(D.X.teams||{})[i]?'<span class="pill">traité</span>':`<button class="bt s gh" data-team="${i}">Traiter</button>`}</div>`).join('')}</div>`)}</div></div>`},
 bind(){const Q=A.queue();bindQ(Q);A.$$('[data-qf]').forEach(b=>b.onclick=()=>{QF=b.dataset.qf;A.render()});A.$('#nt').onclick=newTask;
  const u=A.$('#cundo');if(u)u.onclick=A.undo;
  A.$$('[data-team]').forEach(b=>b.onclick=()=>{const i=+b.dataset.team,t=D.TEAMS[i];A.form({k:'Veille Teams',t:t[1],intro:`${esc(t[0])}, ${fr(t[2])}`,f:[{id:'mk',l:'Créer une tâche dans l\'échéancier',type:'check',v:true},{id:'t',l:'Tâche',v:t[1]},{id:'d',l:'Échéance',type:'date',v:iso(S.TD+7)}],ok:'Traiter',go:v=>A.act('Veille traitée : '+t[1],'cockpit',()=>{D.X.teams=D.X.teams||{};D.X.teams[i]=1;if(v.mk)D.TASKS.push({id:A.uid('t'),t:v.t,d:v.d,dom:'ins',m:'echeancier',note:'Depuis la veille Teams : '+t[0]})})})});
  document.getElementById('wheel').addEventListener('click',ev=>{const c=ev.target.closest('.wt');if(c)openTask(c.dataset.id)})}};

/* ---------- ARCHITECTURE ---------- */
const SRC=[['s1','ARCHI · 10_FORMATION DE BASE'],['s2','ARCHI · 00_SIGNATAIRE'],['s3','ARCHI · 30 RH et 31 FINANCES'],['s4','ARCHI · 13_PRESTATION DE SERVICE'],['s5','ARCHI · 01 et 02, direction, communication'],['s6','ARCHI · 22_AFFAIRES ÉTUDIANTES'],['s7','Groupes Teams (5)'],['s8','AGE, AGP, serveur N'],['s9','Formulaires Forms']];
const REF=[['r1','Fichier étudiant unique','1.1'],['r2','Annuaire des personnes','1.2'],['r3','Échéancier annuel','1.3'],['r4','Index du serveur','1.4']];
const MODS2=[['echeancier','Échéancier'],['etudiants','Étudiant·es'],['ateliers','Ateliers'],['enseignement','Syllabi et notes'],['maia','MAIA et JMA'],['mobilites','Mobilités et stages'],['budget','Budget'],['engagements','Engagements'],['mandats','Mandats'],['equipe','Équipe'],['evenements','Événements'],['jurys','Jurys'],['conseils','Conseils'],['qualite','Qualité'],['assistant','Assistant']];
const OUTS=[['o1','Courriels préparés'],['o2','Listes, PDF, cartels'],['o3','Fichiers pour AGE'],['o4','Notes pour la direction']];
const LINKS=[['s1','r1'],['s6','r1'],['s7','r1'],['s8','r1'],['s9','r1'],['s3','r2'],['s5','r2'],['s2','r2'],['s5','r3'],['s7','r3'],['s1','r4'],['s2','r4'],['s3','r4'],['s4','r4'],['s5','r4'],['s6','r4'],
 ['r3','echeancier'],['r1','etudiants'],['r1','ateliers'],['s9','ateliers'],['r2','enseignement'],['s1','enseignement'],['r1','maia'],['s8','maia'],['r1','mobilites'],['s7','mobilites'],['s3','budget'],['s2','budget'],['s2','engagements'],['r2','engagements'],['s4','mandats'],['s8','mandats'],['r2','equipe'],['s3','equipe'],['s5','evenements'],['r3','evenements'],['r2','jurys'],['r1','jurys'],['s5','conseils'],['r3','conseils'],['r1','qualite'],['s1','qualite'],['r4','assistant'],['r3','assistant'],
 ['echeancier','o1'],['etudiants','o2'],['ateliers','o2'],['ateliers','o1'],['enseignement','o3'],['enseignement','o1'],['maia','o3'],['maia','o1'],['mobilites','o1'],['budget','o4'],['engagements','o2'],['mandats','o4'],['equipe','o2'],['evenements','o2'],['evenements','o1'],['jurys','o2'],['conseils','o1'],['qualite','o4'],['assistant','o1']];
let HL=null;
function archFig(W,H){const cols=[SRC,REF,MODS2,OUTS];const cw=W<700?[W*.27,W*.22,W*.22,W*.2]:[W*.25,W*.2,W*.2,W*.17];const gap=(W-cw.reduce((a,b)=>a+b,0))/3;
 const xs=[0];for(let i=1;i<4;i++)xs[i]=xs[i-1]+cw[i-1]+gap;
 const pos={};cols.forEach((c,ci)=>{const n=c.length,hh=Math.min(34,(H-40)/n-6);const tot=n*(hh+6)-6;const y0=28+(H-28-tot)/2;c.forEach((it,i)=>pos[it[0]]={x:xs[ci],y:y0+i*(hh+6),w:cw[ci],h:hh,ci,lab:it[1],f:it[2]})});
 const on=id=>!HL||HL===id||LINKS.some(([a,b])=>(a===HL&&b===id)||(b===HL&&a===id))||(pos[HL]&&pos[HL].ci===2&&LINKS.some(([a,b])=>b===HL&&LINKS.some(([c,d])=>d===a&&c===id)));
 let s='';const heads=['Sources','Référentiels','Modules','Ce qui en sort'];xs.forEach((x,i)=>s+=`<text x="${x}" y="14" font-size="12.5" font-weight="600" fill="var(--g)">${heads[i]}</text>`);
 LINKS.forEach(([a,b])=>{const p=pos[a],q=pos[b];if(!p||!q)return;const x1=p.x+p.w,y1=p.y+p.h/2,x2=q.x,y2=q.y+q.h/2,mx=(x1+x2)/2;const act=HL&&(a===HL||b===HL||(on(a)&&on(b)&&pos[HL].ci===2));
  s+=`<path d="M${x1},${y1}C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="${act?'var(--red)':'var(--line2)'}" stroke-width="${act?1.8:1}" opacity="${HL&&!act?.25:1}"/>`});
 Object.entries(pos).forEach(([id,p])=>{const o=on(id);const fill=p.ci===1?'var(--ink)':p.ci===2?'var(--panel)':p.ci===3?'var(--g3)':'var(--bg)';const tc=p.ci===1?'var(--bg)':'var(--ink)';
  s+=`<g class="an" data-id="${id}" style="cursor:pointer" opacity="${o?1:.3}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3" fill="${fill}" stroke="${HL===id?'var(--red)':'var(--line2)'}" stroke-width="${HL===id?2:1}"/><text class="ns" x="${p.x+8}" y="${p.y+p.h/2+4}" font-size="${W<700?11:12.5}" fill="${tc}" font-weight="${p.ci===1?600:500}">${esc(p.lab)}</text></g>`});
 return s}
A.VIEWS.architecture={html(){return A.vh({k:'Vue d\'ensemble · comment la plateforme fonctionne',t:'Quatre référentiels saisis une fois nourrissent quinze modules',l:'Aujourd\'hui, les mêmes informations sont ressaisies d\'un fichier Excel à l\'autre. La plateforme lit les fichiers existants du serveur ARCHI, les rassemble dans quatre référentiels et en tire chaque module. Survoler une case montre ce qu\'elle lit et ce qu\'elle alimente.',f:['1.1','1.2','1.3','1.4']})+
 pn('Le circuit des données','Survoler ou toucher une case : ses liens passent en rouge.',A.fig('arch','h520',archFig))+
 `<div class="g3">${pn('L\'outil propose, l\'adjoint·e valide','',`<p style="margin:0;font-size:14px">Chaque automatisation produit un brouillon, une liste ou une proposition. Les répartitions, les jurys, les PEP et les courriels restent décidés et envoyés par une personne.</p>`)}
 ${pn('Une donnée, un seul endroit','',`<p style="margin:0;font-size:14px">Une signature dans « A signer » met à jour le suivi des vacataires, le budget et la base « Adresses AI » en même temps. L\'essai : signer un document dans <a href="#engagements">Engagements</a>, puis ouvrir le <a href="#budget">Budget</a>.</p>`)}
 ${pn('Ce qui reste dehors','',`<p style="margin:0 0 6px;font-size:14px">Ces dossiers ne sont lus par aucun module :</p><div class="chips">${['BESOINS SPECIFIQUES','Motifs des PEP','04_EEDP','02_ASSISTANT-ES EN POSTE','21_EGALITE DES CHANCES'].map(x=>`<span class="path">${x}</span>`).join('')}</div>`)}</div>
 ${pn('Mise en place proposée','Un ordre possible, à discuter : chaque étape s\'appuie sur la précédente.',`<div class="g3" style="gap:14px">${[['Étape 1','Le socle','Fichier étudiant, annuaire, échéancier. Cockpit et circuit de signature.',['1.1','1.2','1.3','6.1']],['Étape 2','Le semestre','Répartition des ateliers, syllabi, JMA, budget et engagements.',['4.1','4.4','4.2','2.1','2.2']],['Étape 3','L\'année et la mémoire','Événements, jurys, conseils et décisions, qualité, assistant.',['5.1','5.3','5.7','3.6','7.1']]].map(([a,b,c,f])=>`<div style="border-top:2px solid var(--ink);padding-top:8px"><p class="muted" style="margin:0;font-size:12.5px">${a}</p><b style="font-size:17px">${b}</b><p style="margin:4px 0 8px;font-size:13.5px">${c}</p><div class="fiches" style="justify-content:flex-start">${f.map(n=>`<button class="fch" data-fiche="${n}">Fiche ${n}</button>`).join('')}</div></div>`).join('')}</div>`)}`},
 bind(){const el=document.getElementById('arch');const h=ev=>{const g=ev.target.closest('.an');const id=g?g.dataset.id:null;if(id!==HL){HL=id;A.redraw('arch')}};el.addEventListener('mousemove',h);el.addEventListener('click',ev=>{const g=ev.target.closest('.an');if(g&&A.VIEWS[g.dataset.id]){location.hash=g.dataset.id}else h(ev)});el.addEventListener('mouseleave',()=>{HL=null;A.redraw('arch')})}};

/* ---------- ÉCHÉANCIER ---------- */
let FD='all',FO='all',FS='open';
const OWN=['Adjoint·e','Secrétariat','Enseignant·es','Étudiant·es'];
function gantt(W,H){const L=W<600?110:200,Rm=10,top=40,lanes=DOMK.length,lh=(H-top-20)/lanes;const x=n=>L+(W-L-Rm)*n/365;let s='';
 const MN=['sept.','oct.','nov.','déc.','janv.','févr.','mars','avr.','mai','juin','juil.','août'];
 for(let m=0;m<12;m++){const y=m<4?2026:2027,mm=((m+8)%12)+1;const n=dd(`${y}-${String(mm).padStart(2,'0')}-01`);s+=`<line x1="${x(n)}" x2="${x(n)}" y1="${top-24}" y2="${H-14}" stroke="var(--line)"/>`;if(W>560||m%2===0)s+=`<text x="${x(n)+3}" y="${top-28}" font-size="11.5" fill="var(--g)">${MN[m]}</text>`}
 D.MS.forEach(m=>{const a=dd(m[0]),b=dd(m[1])+1;s+=`<rect x="${x(a)}" y="${top-20}" width="${Math.max(2,x(b)-x(a))}" height="9" fill="${/Jurys/.test(m[2])?'var(--ink)':/Concours/.test(m[2])?'var(--g)':'var(--g2)'}" data-tip="<b>${esc(m[2])}</b><i>${fr(m[0])} · officiel</i>"/>`});
 DOMK.forEach((d,i)=>{const y=top+i*lh;s+=`<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="0" y="${y+lh/2+4}" font-size="12" fill="var(--ink2)" font-weight="500">${W<600?D.DOM[d].split(' ')[0]:D.DOM[d]}</text>`;
  const list=A.allE().filter(e=>e[4]===d&&(FO==='all'||e[5]===FO));const lane={};
  list.forEach(e=>{const n=dd(A.edate(e)),st=est(e);const k2=Math.floor(n/12);lane[k2]=(lane[k2]||0)+1;const yy=y+10+((lane[k2]-1)%3)*(lh-20)/2.4+6;const dim=FD!=='all'&&FD!==d;
   s+=`<g class="gt" data-id="${e[0]}" style="cursor:pointer" opacity="${dim?.2:1}" data-tip="<b>${esc(e[1])}</b><i>${fr(A.edate(e))} · alerte ${e[3]} j avant · ${esc(e[5])}</i>"><line x1="${x(n-e[3])}" x2="${x(n)}" y1="${yy}" y2="${yy}" stroke="${st==='late'||st==='trig'?'var(--red)':'var(--g2)'}" stroke-width="2"/><circle cx="${x(n)}" cy="${yy}" r="5" fill="${st==='late'?'var(--red)':st==='done'?'var(--g2)':st==='open'?'var(--ink)':'var(--panel)'}" stroke="${st==='trig'||st==='late'?'var(--red)':st==='done'?'var(--g2)':'var(--ink)'}" stroke-width="${st==='trig'?2.2:1.2}"/></g>`})});
 s+=`<line x1="${x(S.TD)}" x2="${x(S.TD)}" y1="${top-24}" y2="${H-8}" stroke="var(--red)" stroke-width="1.5"/><text x="${x(S.TD)+4}" y="${H-4}" font-size="11.5" fill="var(--red)" font-weight="600">aujourd'hui</text>`;
 return s}
/* contrôle de calendrier MAIA 2027-2028 (fiche 4.3) : dates fictives */
const CAL28=[['JMA','Séminaire JMA d\'octobre',dd('2027-10-11'),5],['FR','Formation à la recherche 1 et 3 (ECAL)',dd('2027-10-13'),2],['HC','Semaine hors cadre',dd('2027-11-01'),5],['JDRC','Junior Design Research Conference',dd('2027-11-18'),1],['CM','Conseil de Master',dd('2027-10-05'),1],['JMA','Séminaire JMA de janvier',dd('2028-01-10'),5],['HC','Semaine hors cadre',dd('2028-01-10'),5],['JU','Jurys d\'automne',dd('2028-01-17'),5],['SDTP','Semaine de tous les possibles',dd('2028-02-21'),5],['FR','Formation à la recherche 2',dd('2028-03-15'),2],['JMA','Séminaire JMA de printemps',dd('2028-03-20'),5]];
function calCheck(W,H){const n0=dd('2027-09-27'),n1=dd('2028-04-01'),L=W<500?110:160,x=n=>L+(W-L-10)*(n-n0)/(n1-n0);const rows=['JMA','FR','HC','JU','SDTP','JDRC','CM'];const lab={JMA:'Séminaires JMA',FR:'Formation à la recherche',HC:'Hors cadre',JU:'Jurys',SDTP:'SDTP',JDRC:'JDRC',CM:'Conseils de Master'};const rh=(H-40)/rows.length;let s='';
 for(let n=n0;n<n1;n+=7){s+=`<line x1="${x(n)}" x2="${x(n)}" y1="18" y2="${H-14}" stroke="var(--line)"/>`}
 ['2027-10-01','2027-11-01','2027-12-01','2028-01-01','2028-02-01','2028-03-01'].forEach(m=>{const n=dd(m);s+=`<text x="${x(n)+3}" y="12" font-size="11.5" fill="var(--g)">${A.MO[+m.slice(5,7)-1]}</text>`});
 const conf=[];CAL28.forEach((a,i)=>CAL28.forEach((b,j)=>{if(j>i&&a[0]!==b[0]&&a[2]<b[2]+b[3]&&b[2]<a[2]+a[3]&&!((a[0]==='HC'&&b[0]==='JMA')||(a[0]==='JMA'&&b[0]==='HC')))conf.push([a,b])}));
 conf.forEach(([a,b])=>{if(D.X.calOK&&D.X.calOK[a[1]+b[1]])return;const st=Math.max(a[2],b[2]),en=Math.min(a[2]+a[3],b[2]+b[3]);s+=`<rect x="${x(st)}" y="18" width="${Math.max(4,x(en)-x(st))}" height="${H-34}" fill="var(--red)" opacity=".14"/>`});
 rows.forEach((r,i)=>{const y=24+i*rh;s+=`<text x="0" y="${y+rh/2+4}" font-size="12" fill="var(--ink2)">${lab[r]}</text>`;CAL28.filter(c=>c[0]===r).forEach(c=>{const isC=conf.some(([a,b])=>a===c||b===c);s+=`<rect x="${x(c[2])}" y="${y+4}" width="${Math.max(5,x(c[2]+c[3])-x(c[2]))}" height="${rh-10}" rx="2" fill="${isC?'var(--red)':'var(--ink)'}" data-tip="<b>${esc(c[1])}</b><i>${fr(iso(c[2]))} · ${c[3]} j${isC?' · chevauchement':''}</i>"/>`})});
 A.calConf=conf;return s}
A.VIEWS.echeancier={html(){const all=A.allE();const list=all.filter(e=>(FD==='all'||e[4]===FD)&&(FO==='all'||e[5]===FO)&&(FS==='all'||(FS==='open'?est(e)!=='done':est(e)==='done'))).sort((a,b)=>A.edate(a).localeCompare(A.edate(b)));
 const nw=all.filter(e=>['trig','late'].includes(est(e))).length;
 const byM={};list.forEach(e=>{const m=A.edate(e).slice(0,7);(byM[m]=byM[m]||[]).push(e)});
 calCheck(800,300);const conf=A.calConf.filter(([a,b])=>!(D.X.calOK||{})[a[1]+b[1]]);
 return vh({k:'Cursus · échéancier annuel et calendriers',t:`${all.length} échéances, ${nw?`<em>${nw} à traiter maintenant</em>`:'aucune urgente aujourd\'hui'}`,l:'Chaque tâche du guide, datée pour 2026-2027. Chaque ligne se prépare, se marque comme faite ou se reporte ; « Nouvelle tâche » ajoute ce que le guide ne prévoit pas.',f:['1.3','4.3'],how:['Date chaque échéance du guide, déclenche l\'alerte au bon préavis, prépare le courriel ou ouvre le geste du module concerné.','Relire 52 pages de guide pour savoir ce qui arrive le mois prochain, et retrouver le courriel de l\'an passé.',['Guide de passation, novembre 2026','Document des échéances de Valentina','Teams · EVA','RENTREE › MAIL DEBUT - RENTREES','CALENDRIER (BA, MAIA)']]})+
 `<div class="bar"><div class="chips">${[['all','Tous les domaines']].concat(DOMK.map(k=>[k,D.DOM[k]])).map(([k,l])=>`<button class="chip${FD===k?' on':''}" data-fd="${k}">${l}<i>${k==='all'?all.length:all.filter(e=>e[4]===k).length}</i></button>`).join('')}</div>
 <div class="seg" style="margin-left:auto">${[['all','Tout le monde']].concat(OWN.map(o=>[o,o])).map(([k,l])=>`<button class="${FO===k?'on':''}" data-fo="${k}">${l}</button>`).join('')}</div></div>
 ${pn('L\'année de septembre à août','Bandeau du haut : jalons officiels. Points : échéances, par domaine. Trait : préavis de l\'alerte. Un clic ouvre l\'échéance.',A.fig('gantt','h340',gantt))}
 <div class="g2"><section class="pn"><h2>Échéances<span><span class="seg" style="vertical-align:middle">${[['open','À faire'],['done','Faites'],['all','Toutes']].map(([k,l])=>`<button class="${FS===k?'on':''}" data-fs="${k}">${l}</button>`).join('')}</span></span></h2>
 <div class="bar"><button class="bt s" id="nt">Nouvelle tâche</button><span class="muted" style="font-size:12.5px">${list.length} lignes</span></div>
 <div style="max-height:620px;overflow:auto">${Object.entries(byM).map(([m,l])=>`<p class="qg">${A.MO[+m.slice(5)-1]} ${m.slice(0,4)}<span>${l.length}</span></p>`+l.map(e=>{const s=est(e);return `<div class="qi"><i class="dot d-${s}" style="margin-top:6px"></i><span class="t" data-task="${e[0]}" style="cursor:pointer"><b>${frs(A.edate(e))}${e[7]||e[9]?'':'<sup class="muted">~</sup>'} · ${esc(e[1])}</b><small>${esc(e[5])} · ${A.MODLAB[e[6]]} · ${SL[s]}</small></span><span class="acts">${s==='done'?`<button class="bt s gh" data-eu="${e[0]}">Rouvrir</button>`:`<button class="bt s" data-ep="${e[0]}">${A.EACT[e[0]]?esc(A.EACT[e[0]].l):'Préparer'}</button><button class="bt s gh" data-ed="${e[0]}">Fait</button><button class="bt s gh" data-em="${e[0]}">Reporter</button>`}</span></div>`}).join('')).join('')||'<p class="empty">Aucune échéance.</p>'}</div><p class="muted" style="font-size:12.5px;margin:8px 0 0">~ : le guide donne le mois, la date est indicative.</p></section>
 <section class="pn"><h2>Contrôle des calendriers MAIA 2027-2028<span>${conf.length} chevauchement${conf.length>1?'s':''}</span></h2><p class="sub">Le guide demande de poser d'abord les séminaires JMA et la Formation à la recherche, puis de vérifier qu'aucune date ne se chevauche. Dates 2027-2028 fictives.</p>${A.fig('cal','h300',calCheck)}
 <div style="margin-top:8px">${conf.map(([a,b])=>`<div class="qi"><i class="dot d-late" style="margin-top:6px"></i><span class="t"><b>${esc(a[1])} et ${esc(b[1])}</b><small>Les MAIA doivent suivre les deux.</small></span><span class="acts"><button class="bt s" data-cm="${esc(a[1]+'|'+b[1])}">Demander d'autres dates</button><button class="bt s gh" data-co="${esc(a[1]+b[1])}">Résolu</button></span></div>`).join('')||'<p class="empty">Aucun chevauchement.</p>'}</div></section></div>`},
 bind(){A.$$('[data-fd]').forEach(b=>b.onclick=()=>{FD=b.dataset.fd;A.render()});A.$$('[data-fo]').forEach(b=>b.onclick=()=>{FO=b.dataset.fo;A.render()});A.$$('[data-fs]').forEach(b=>b.onclick=()=>{FS=b.dataset.fs;A.render()});
  const E=id=>A.allE().find(x=>x[0]===id);
  A.$$('[data-task]').forEach(r=>r.onclick=()=>openTask(r.dataset.task));A.$$('[data-ep]').forEach(b=>b.onclick=()=>prepE(E(b.dataset.ep)));A.$$('[data-ed]').forEach(b=>b.onclick=()=>doneE(E(b.dataset.ed)));A.$$('[data-eu]').forEach(b=>b.onclick=()=>doneE(E(b.dataset.eu),false));A.$$('[data-em]').forEach(b=>b.onclick=()=>moveE(E(b.dataset.em)));
  A.$('#nt').onclick=newTask;
  A.$$('[data-cm]').forEach(b=>b.onclick=()=>{const [x,y]=b.dataset.cm.split('|');A.compose({to:'Robin Schori (coordination JMA) ; Anthony Masure (IRAD)',subject:'Calendrier MAIA 2027-2028 : chevauchement à résoudre',body:`Bonjour,\n\nEn construisant le calendrier MAIA 2027-2028, je vois que « ${x} » et « ${y} » tombent la même semaine. Nos étudiant·es devant suivre les deux, auriez-vous la possibilité de déplacer l'un des deux ?\n\nMerci d'avance,\nGuillaume`,m:'echeancier'})});
  A.$$('[data-co]').forEach(b=>b.onclick=()=>A.act('Chevauchement de calendrier résolu','echeancier',()=>{D.X.calOK=D.X.calOK||{};D.X.calOK[b.dataset.co]=1}));
  document.getElementById('gantt').addEventListener('click',ev=>{const g=ev.target.closest('.gt');if(g)openTask(g.dataset.id)})}};
})();
