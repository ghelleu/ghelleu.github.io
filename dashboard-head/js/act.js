/* Socle d'action : état enregistré, journal, annulation, boîte d'envoi, formulaires, exports, file d'actions */
(function(){
'use strict';
const A=window.APP,D=A.D,S=A.S,{esc,dd,iso,fr,frs,frl}=A;
const KEY='pilotage-ai-v2';
const PK=['ST','IN','ENG','BC','MAND','SYL','JURY','CONS','DEC','ODJ_PROP','BUD','PEOPLE','FB','LAUREATS','BUREAUX','MOB','X','OUT','LOG','TASKS'];
D.X=D.X||{};D.OUT=D.OUT||[];D.LOG=D.LOG||[];D.TASKS=D.TASKS||[];
const X=()=>D.X;
const def=(k,v)=>{if(X()[k]===undefined)X()[k]=v;return X()[k]};
['edone','edate','snz','valid','sdtp','prs','notes','budAt','sylSP','note'].forEach(k=>def(k,{}));
const snap=()=>JSON.stringify(PK.reduce((o,k)=>(o[k]=D[k],o),{}));
const restore=s=>{const o=typeof s==='string'?JSON.parse(s):s;PK.forEach(k=>{if(o[k]===undefined)return;if(k==='X'){Object.keys(D.X).forEach(j=>delete D.X[j]);Object.assign(D.X,o.X)}else D[k]=o[k]})};
/* restauration au chargement */
try{const raw=localStorage.getItem(KEY);if(raw){const o=JSON.parse(raw);if(o.v===2){restore(o.data);if(o.td!=null)S.TD=o.td}}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({v:2,td:S.TD,data:JSON.parse(snap())}))}catch(e){}};
A.save=save;
const UNDO=[];
let uid=Date.now()%100000;A.uid=p=>(p||'x')+(uid++);

/* une action : instantané, mutation, journal, enregistrement */
function act(label,m,fn,opt={}){UNDO.push(snap());if(UNDO.length>40)UNDO.shift();
 fn();D.LOG.unshift({id:A.uid('l'),d:iso(S.TD),l:label,m});if(D.LOG.length>300)D.LOG.length=300;save();
 if(!opt.keep)A.close();A.render();toastU(label)}
function undo(){if(!UNDO.length)return;restore(UNDO.pop());save();A.close();A.render();toast2('Dernière action annulée')}
A.act=act;A.undo=undo;
let tt;
function toastU(m){const t=A.$('#toast');t.innerHTML=`<span>${esc(m)}</span> <button class="tl" id="tu" style="color:inherit;text-decoration:underline;margin-left:10px;background:none;border:0;cursor:pointer">Annuler</button>`;t.classList.add('on');A.$('#tu').onclick=undo;clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),5000)}
function toast2(m){const t=A.$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3000)}
A.toast=toast2;

/* échéances : date effective, statut, report */
const edate=e=>X().edate[e[0]]||e[2];
A.edate=edate;
A.est=function(e){const d=dd(edate(e));if(X().edone[e[0]])return'done';
 if(d<S.TD)return D.OPEN_LATE.has(e[0])&&!X().edate[e[0]]?'late':(X().edate[e[0]]?'late':'done');
 if(S.TD>=d-e[3])return d-S.TD<=7?'trig':'open';return'soon'};
/* tâches libres créées par l'adjoint·e */
A.allE=()=>D.E.concat(D.TASKS.map(t=>[t.id,t.t,t.d,7,t.dom||'ins','Adjoint·e',t.m||'echeancier',0,t.note||'',1]));

/* ---------- boîte d'envoi ---------- */
A.HOOK={};
function compose(dr){let d=dr.id?D.OUT.find(x=>x.id===dr.id):null;
 if(!d){d={id:A.uid('m'),st:'brouillon',d:iso(S.TD),...dr};D.OUT.unshift(d);save();A.render()}
 const inbox=window.top!==window;
 A.drawer(`<p class="muted">Courriel préparé · ${d.st==='envoyé'?'envoyé le '+fr(d.sent):'brouillon'}</p><h3>${esc(d.subject)}</h3>
 <label class="fl">À<input type="text" id="c_to" value="${esc(d.to)}"></label>
 ${d.cc!==undefined?`<label class="fl">Copie<input type="text" id="c_cc" value="${esc(d.cc||'')}"></label>`:''}
 <label class="fl">Objet<input type="text" id="c_su" value="${esc(d.subject)}"></label>
 <label class="fl">Message<textarea id="c_bo" rows="12">${esc(d.body)}</textarea></label>
 ${d.att?`<p class="muted" style="font-size:13px;margin:4px 0 10px">Pièce à joindre : ${esc(d.att)}</p>`:''}
 <div class="bar"><button class="bt" id="c_ok">${d.st==='envoyé'?'Enregistrer':'Marquer comme envoyé'}</button><button class="bt gh" id="c_cp">Copier le texte</button><button class="bt gh" id="c_sv">Garder en brouillon</button><button class="bt gh" id="c_rm" style="margin-left:auto">Supprimer</button></div>
 <p class="muted" style="font-size:12.5px">La plateforme n'envoie rien elle-même : copier le texte dans la messagerie, l'envoyer, puis le marquer comme envoyé. ${d.hook?'Le marquage met aussi à jour le module concerné.':''}</p>`);
 const grab=()=>{d.to=A.$('#c_to').value;d.subject=A.$('#c_su').value;d.body=A.$('#c_bo').value;if(A.$('#c_cc'))d.cc=A.$('#c_cc').value};
 A.$('#c_cp').onclick=()=>{grab();const txt=`À : ${d.to}\nObjet : ${d.subject}\n\n${d.body}`;try{navigator.clipboard.writeText(txt).then(()=>toast2('Texte copié'),()=>toast2('Copie refusée par le navigateur : sélectionner le texte'))}catch(e){toast2('Copie refusée par le navigateur')}};
 A.$('#c_sv').onclick=()=>{grab();save();A.close();A.render();toast2('Brouillon enregistré dans la boîte d\'envoi')};
 A.$('#c_rm').onclick=()=>act('Courriel supprimé : '+d.subject,'envoi',()=>{D.OUT=D.OUT.filter(x=>x.id!==d.id)});
 A.$('#c_ok').onclick=()=>{grab();if(d.st==='envoyé'){save();A.close();A.render();return}act('Envoyé : '+d.subject,d.m||'envoi',()=>{const o=D.OUT.find(x=>x.id===d.id);Object.assign(o,{to:d.to,subject:d.subject,body:d.body,cc:d.cc,st:'envoyé',sent:iso(S.TD)});if(o.hook&&A.HOOK[o.hook])A.HOOK[o.hook](o.args||{})})}}
A.compose=compose;

/* ---------- formulaire en tiroir ---------- */
function form(o){A.drawer(`<p class="muted">${esc(o.k||'Saisie')}</p><h3>${esc(o.t)}</h3>${o.intro?`<p style="font-size:14px">${o.intro}</p>`:''}<form id="ff">${o.f.map(f=>{const v=f.v??'';
  if(f.type==='select')return `<label class="fl">${esc(f.l)}<select id="f_${f.id}">${f.o.map(x=>{const [val,lab]=Array.isArray(x)?x:[x,x];return `<option value="${esc(val)}"${String(val)===String(v)?' selected':''}>${esc(lab)}</option>`}).join('')}</select></label>`;
  if(f.type==='textarea')return `<label class="fl">${esc(f.l)}<textarea id="f_${f.id}" rows="${f.rows||4}">${esc(v)}</textarea></label>`;
  if(f.type==='check')return `<label class="ck" style="margin:8px 0"><input type="checkbox" id="f_${f.id}"${v?' checked':''}> ${esc(f.l)}</label>`;
  return `<label class="fl">${esc(f.l)}<input type="${f.type||'text'}" id="f_${f.id}" value="${esc(v)}"${f.step?` step="${f.step}"`:''}${f.req?' required':''}></label>`}).join('')}
 <div class="bar" style="margin-top:12px"><button class="bt" type="submit">${esc(o.ok||'Enregistrer')}</button><button class="bt gh" type="button" id="ffx">Annuler</button></div></form>`);
 A.$('#ffx').onclick=A.close;A.$('#ff').onsubmit=e=>{e.preventDefault();const v={};o.f.forEach(f=>{const el=A.$('#f_'+f.id);v[f.id]=f.type==='check'?el.checked:f.type==='number'?+el.value:el.value});o.go(v)}}
A.form=form;

/* ---------- export d'un tableau ---------- */
function exportRows(name,head,rows,note){const tsv=[head].concat(rows).map(r=>r.map(c=>String(c??'').replace(/\t|\n/g,' ')).join('\t')).join('\n');
 const csv=[head].concat(rows).map(r=>r.map(c=>`"${String(c??'').replace(/"/g,'""')}"`).join(';')).join('\n');const inFrame=window.top!==window;
 A.drawer(`<p class="muted">Export</p><h3>${esc(name)}</h3>${note?`<p style="font-size:13.5px">${note}</p>`:''}<div class="scroll" style="max-height:52vh;overflow:auto;border:1px solid var(--line);margin:8px 0"><table class="tb"><thead><tr>${head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,200).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
 <div class="bar"><button class="bt" id="x_cp">Copier pour Excel</button>${inFrame?'':'<button class="bt gh" id="x_dl">Télécharger le fichier .csv</button>'}<span class="muted" style="font-size:12.5px">${rows.length} lignes</span></div>${inFrame?'<p class="muted" style="font-size:12.5px">Dans l\'aperçu claude.ai, le téléchargement est bloqué : copier puis coller dans Excel. Sur le site, le bouton de téléchargement apparaît.</p>':''}`);
 A.$('#x_cp').onclick=()=>{try{navigator.clipboard.writeText(tsv).then(()=>toast2('Tableau copié : coller dans Excel'),()=>toast2('Copie refusée par le navigateur'))}catch(e){toast2('Copie refusée')}};
 const dl=A.$('#x_dl');if(dl)dl.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'}));a.download=name.replace(/[^\wÀ-ÿ -]/g,'').replace(/ +/g,'_')+'.csv';document.body.appendChild(a);a.click();a.remove()}}
A.exportRows=exportRows;

/* ---------- modèles de courriels des échéances ---------- */
const AUD={
 e01:['Responsable de filière','Voici l\'organigramme 2026-2027 mis à jour, tiré de l\'annuaire. Les changements de l\'année sont signalés ; merci de me dire si quelque chose manque.'],
 e02:['Assistant·e de filière','Les plans de répartition des ateliers et les cartels de portes du semestre sont prêts à être imprimés et posés.'],
 e04:['Assistant·es','Je vous propose un moment pour présenter et expliquer vos feuilles de charge de l\'année. Merci de m\'indiquer vos disponibilités.'],
 e05:['Assistant·es','Voici les descriptifs des workshops de la Semaine de tous les possibles. Merci de me dire lequel vous souhaitez accompagner.'],
 e06:['Assistant·es','L\'attribution des workshops de la Semaine de tous les possibles est confirmée. Vous trouverez la répartition ci-dessous.'],
 e08:['Secrétariat de filière','Voici les dates des Conseils de filière et des Conseils de Master de l\'année. Peux-tu envoyer les invitations aux membres ?'],
 e10:['Bureau de la transversalité','Vous trouverez ci-joint les descriptifs finalisés des workshops de la filière pour la Semaine de tous les possibles, avec l\'assistant·e associé·e à chacun.'],
 e14:['Intervenant·es SDTP','Je vous mets en contact avec l\'assistant·e qui accompagnera votre workshop. Le lien vers le catalogue suivra dès qu\'il sera en ligne.'],
 e15:['Enseignant·es de la filière','Petit rappel : merci de me retourner vos remarques sur les calendriers du semestre de printemps.'],
 e16:['Étudiant·es MAIA 2','Je vous invite à la présentation de l\'atelier de diplôme, qui lance la préparation du semestre de diplôme.'],
 e21:['Responsables des sites du JMA','Pourriez-vous me transmettre les notes du séminaire d\'octobre de nos étudiant·es MAIA avant la fin de l\'année civile ?'],
 e22:['Étudiant·es en stage au printemps','Les conventions de stage doivent être signées au plus tard début janvier. Merci de me transmettre la vôtre dès qu\'elle est signée.'],
 e24:['Étudiant·es et enseignant·es','Vous trouverez ci-joint les calendriers définitifs du semestre de printemps.'],
 e25:['Service de la communication','Voici la liste des prix et distinctions de l\'année, pour les supports des portes ouvertes.'],
 e26:['Responsables des sites du JMA','En attendant les notes définitives du séminaire de janvier, pourriez-vous me signaler les absences et les échecs déjà connus ?'],
 e27:['Étudiant·es MAIA 2','Voici la composition du jury de diplôme. Vous pouvez maintenant proposer une courte liste de noms pour le dernier membre externe.'],
 e29:['Intervenant·es SDTP','Vous trouverez ci-dessous la liste des étudiant·es inscrit·es à votre workshop, le programme de la semaine et les attentes communes.'],
 e30:['Responsable de filière','Voici les premières projections pour l\'année 2027-2028. Je propose qu\'on en parle avant le 15 février.'],
 e31:['Coordination des études (Aurélie Gfeller)','Voici les changements du plan d\'études envisagés pour 2027-2028.'],
 e32:['Membres des commissions d\'admission','La séance d\'information sur les admissions approche. Merci d\'y participer, y compris si vous avez déjà siégé.'],
 e34:['Étudiant·es BA et MAIA','Si vous souhaitez faire un stage au semestre d\'automne, merci de l\'annoncer maintenant et d\'indiquer les bureaux visés.'],
 e37:['Ateliers de diplôme BA et MAIA','Les textes des cartels de l\'exposition de diplôme sont attendus à la date ci-dessous.'],
 e38:['Mariama Sylla','Je reviens vers vous pour confirmer les dates du workshop S\'exprimer en public de l\'année prochaine, dans les mêmes créneaux.'],
 e39:['Enseignant·es de la filière','Voici les projets de calendrier 2027-2028. Merci de les vérifier et de me faire vos retours début juin au plus tard.'],
 e40:['Volées BA AI 2025, 2026 et 2027','Le Prix de la Fondation Hans Wilsdorf revient cette année au Bachelor en architecture d\'intérieur. Merci de vous manifester avant le 15 mai si vous souhaitez concourir.'],
 e41:['Secrétariat de filière','Voici les dates des Conseils 2027-2028, fixées en évitant les semaines hors cadre et les séminaires MAIA.'],
 e42:['Enseignant·es du kick-off AI1','Je vous mets en relation pour le kick-off de la rentrée. Vous trouverez le calendrier et les dates de jury ci-dessous.'],
 e43:['Enseignant·es de la filière','Petit rappel : vos retours sur les calendriers 2027-2028 sont attendus début juin.'],
 e44:['Responsables des sites du JMA','Pourriez-vous me transmettre les notes du séminaire de printemps de nos étudiant·es MAIA 1 ?'],
 e45:['Membres du Conseil et vacataires réguliers','Le dernier Conseil de filière de l\'année aura lieu le mardi 29 juin 2027, de 14 h à 17 h, salle Barthélémy Menn. Les vacataires réguliers y sont invité·es.'],
 e46:['Étudiant·es en stage à l\'automne','Les conventions de stage de l\'automne doivent être signées fin juin au plus tard.'],
 e47:['Candidat·es au Prix Hans Wilsdorf','Merci de me remettre une version avancée de votre dossier pour le 30 juin.'],
 e50:['Coordination du JMA (Robin Schori)','Voici les descriptifs des cours à option que la HEAD propose aux semestres d\'automne et de printemps, pour le catalogue de fin août.'],
 e52:['Mariama Sylla','Voici la liste des participant·es au workshop S\'exprimer en public.'],
};
A.mailForE=function(e){const a=AUD[e[0]]||[e[5]==='Adjoint·e'?'Destinataires à préciser':e[5],''];
 return{to:a[0],subject:e[1],body:`Bonjour,\n\n${a[1]||`Pour rappel : ${e[1].charAt(0).toLowerCase()+e[1].slice(1)}, pour le ${frl(edate(e))}.`}${e[8]&&!a[1]?'\n'+e[8]:''}\n\nMerci d'avance,\nGuillaume`,m:e[6],hook:'edone',args:{id:e[0]}}};
A.HOOK.edone=a=>{X().edone[a.id]=true};

/* ---------- file d'actions ---------- */
A.QUEUE=[];
A.queue=()=>{const out=[];A.QUEUE.forEach(f=>{try{out.push(...f())}catch(e){console.error(e)}});
 return out.filter(i=>!(X().snz[i.id]&&dd(X().snz[i.id])>S.TD)).sort((a,b)=>(b.sev-a.sev)||((a.due||'9')<(b.due||'9')?-1:1))};
A.snooze=(id,days,label)=>act(`Reporté de ${days} jours : ${label}`,'cockpit',()=>{X().snz[id]=iso(S.TD+days)});

/* ---------- vue : boîte d'envoi et journal ---------- */
let OF='brouillon';
A.VIEWS.envoi={html(){const dr=D.OUT.filter(o=>o.st==='brouillon'),se=D.OUT.filter(o=>o.st==='envoyé');const L=OF==='brouillon'?dr:se;
 return A.vh({k:'Vue d\'ensemble · boîte d\'envoi et journal',t:dr.length?`${dr.length} courriel${dr.length>1?'s':''} préparé${dr.length>1?'s':''} à envoyer`:'Aucun courriel en attente',l:'Chaque action qui demande d\'écrire prépare ici son courriel, destinataires et texte compris. Tu le relis, tu le copies dans ta messagerie, puis tu le marques comme envoyé : le module concerné se met à jour. Le journal garde la trace de chaque geste, et la dernière action peut être annulée.',f:['6.3','7.1']})+
 `<div class="g2"><section class="pn"><h2>Courriels<span><span class="seg" style="vertical-align:middle"><button class="${OF==='brouillon'?'on':''}" data-of="brouillon">À envoyer (${dr.length})</button><button class="${OF==='envoyé'?'on':''}" data-of="envoyé">Envoyés (${se.length})</button></span></span></h2>
 ${L.length?`<div class="rows">${L.map(o=>`<div class="row" data-mail="${o.id}" style="grid-template-columns:64px minmax(0,1fr) auto"><span class="d">${frs(o.st==='envoyé'?o.sent:o.d)}</span><span class="t"><b>${esc(o.subject)}</b><small>À : ${esc(o.to)}</small></span><span class="s">${o.st==='envoyé'?'<span class="pill">envoyé</span>':'<span class="pill r">à envoyer</span>'}</span></div>`).join('')}</div>`:`<p class="empty">${OF==='brouillon'?'Rien à envoyer. Les courriels apparaissent ici quand une action en prépare un.':'Aucun courriel envoyé pour l\'instant.'}</p>`}
 <div class="bar" style="margin-top:12px"><button class="bt gh" id="newmail">Nouveau courriel</button></div></section>
 <section class="pn"><h2>Journal<span>${D.LOG.length} actions</span></h2><div class="bar"><button class="bt gh" id="undo" ${UNDO.length?'':'disabled'}>Annuler la dernière action</button><button class="bt gh" id="reset">Remettre la démonstration à zéro</button></div>
 ${D.LOG.length?`<div class="rows" style="max-height:520px;overflow:auto">${D.LOG.map(l=>`<div class="row" style="grid-template-columns:52px minmax(0,1fr);cursor:default"><span class="d">${frs(l.d)}</span><span class="t">${esc(l.l)}</span></div>`).join('')}</div>`:'<p class="empty">Aucune action encore.</p>'}
 <p class="muted" style="font-size:12.5px;margin:10px 0 0">Les actions sont gardées dans ce navigateur d'une visite à l'autre.</p></section></div>`},
 bind(){A.$$('[data-of]').forEach(b=>b.onclick=()=>{OF=b.dataset.of;A.render()});A.$$('[data-mail]').forEach(r=>r.onclick=()=>compose({id:r.dataset.mail}));
  A.$('#newmail').onclick=()=>compose({to:'',subject:'Nouveau message',body:'Bonjour,\n\n\n\nGuillaume',m:'envoi'});
  A.$('#undo').onclick=undo;A.$('#reset').onclick=()=>{form({k:'Démonstration',t:'Remettre à zéro ?',intro:'Toutes les actions, brouillons et saisies de ce navigateur seront effacés, et les données fictives reviendront à leur état de départ.',f:[],ok:'Remettre à zéro',go:()=>{try{localStorage.removeItem(KEY)}catch(e){}location.reload()}})}}};
A.QUEUE.push(()=>D.OUT.filter(o=>o.st==='brouillon').map(o=>({id:'out-'+o.id,m:'envoi',sev:1,due:o.d,t:`Envoyer : ${o.subject}`,c:`Préparé le ${frs(o.d)} · à : ${o.to}`,acts:[{l:'Ouvrir',p:1,f:()=>compose({id:o.id})}]})));
})();
