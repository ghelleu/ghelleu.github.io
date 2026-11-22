/* Plateforme de pilotage · filière Architecture d'intérieur · démonstrateur
   Données. Trois natures, signalées dans l'interface :
   - OFFICIEL : jalons du calendrier académique HEAD 2026-2027 (repris du premier démonstrateur) ;
   - GUIDE : tâches, règles et échéances tirées du guide de passation de novembre 2026 ;
   - FICTIF : personnes, effectifs, montants, statuts. Tout ce qui n'est pas marqué ci-dessus. */
(function(){
'use strict';
let seed=20261207;
const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const pick=a=>a[Math.floor(rnd()*a.length)];
const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};

/* ---------- Jalons officiels (calendrier académique 2026-2027) ---------- */
const MS=[
 ['2026-09-14','2026-09-18','Semaine inaugurale'],['2026-11-02','2026-11-06','Semaine hors cadre'],
 ['2027-01-11','2027-01-15','Semaine hors cadre'],['2027-01-18','2027-01-22','Jurys du semestre d\'automne'],
 ['2027-01-23','2027-01-23','Portes ouvertes'],['2027-01-25','2027-02-05','Remédiations'],
 ['2027-02-22','2027-02-26','Semaine de tous les possibles'],['2027-03-09','2027-03-15','Concours BA, 1er tour'],
 ['2027-03-30','2027-04-07','Concours MA, 1er tour'],['2027-04-12','2027-04-16','Concours BA, entretiens'],
 ['2027-04-19','2027-04-23','Semaine hors cadre'],['2027-04-28','2027-05-07','Concours MA, entretiens'],
 ['2027-06-07','2027-06-11','Semaine hors cadre'],['2027-06-14','2027-06-23','Jurys du semestre de printemps'],
 ['2027-06-28','2027-07-09','Remédiations'],['2027-07-07','2027-07-07','Fête des diplômes'],
];

/* ---------- Échéancier annuel (fiche 1.3), tiré du guide ----------
   [id, titre, date, préavis (jours), domaine, responsable, module, exacte?, note]
   exacte = la date est donnée telle quelle par le guide ; sinon le guide donne le mois. */
const DOM={cur:'Cursus et étudiant·es',ens:'Enseignement et calendriers',evt:'Événements et jurys',fin:'Finances et engagements',ins:'Instances et communication'};
const E=[
 ['e01','Mettre à jour l\'organigramme de la filière','2026-09-11',14,'ins','Adjoint·e','equipe',0,'Début de chaque année académique.'],
 ['e02','Plans de répartition des ateliers et cartels de portes','2026-09-11',10,'ins','Adjoint·e','equipe',0,'Chaque semestre, au minimum à la rentrée.'],
 ['e03','Liste Excel des cessions de droits au secrétariat','2026-09-18',14,'cur','Adjoint·e','etudiants',0,'1re année BA et MAIA, IN de toutes années.'],
 ['e04','Feuilles de charge présentées aux assistant·es','2026-09-25',14,'fin','Adjoint·e','equipe',0,''],
 ['e05','SDTP : descriptifs aux assistant·es, gabarits vérifiés','2026-09-18',14,'evt','Adjoint·e','evenements',0,''],
 ['e06','SDTP : attribution des assistant·es confirmée','2026-09-30',10,'evt','Adjoint·e','evenements',0,'Fin septembre.'],
 ['e07','Syllabi du semestre d\'automne reçus','2026-09-30',21,'ens','Enseignant·es','enseignement',1,'Délai du 30 septembre.'],
 ['e08','Invitations aux Conseils de filière envoyées','2026-09-30',14,'ins','Secrétariat','conseils',0,'Au plus tard en septembre.'],
 ['e09','Conseil de Master du semestre d\'automne','2026-10-06',10,'ins','Adjoint·e','conseils',0,'Septembre ou octobre.'],
 ['e10','SDTP : descriptifs finalisés au Bureau de la transversalité','2026-10-15',21,'evt','Adjoint·e','evenements',1,'Délai du 15 octobre.'],
 ['e11','Stages du printemps : intentions annoncées','2026-11-02',14,'cur','Étudiant·es','mobilites',0,'Début novembre.'],
 ['e12','IN du printemps informé·es de l\'inscription aux ateliers','2026-11-16',14,'cur','Adjoint·e','mobilites',0,'Dès novembre, si les noms sont connus.'],
 ['e13','Facture JMA du semestre d\'automne demandée','2026-11-20',14,'fin','Adjoint·e','maia',0,'En novembre, pour payer dans l\'année civile.'],
 ['e14','SDTP : intervenant·es en contact avec leur assistant·e','2026-11-20',14,'evt','Adjoint·e','evenements',0,''],
 ['e15','Calendriers du printemps : retours des enseignant·es','2026-11-30',21,'ens','Enseignant·es','echeancier',0,'Fin novembre.'],
 ['e16','Atelier de diplôme MAIA présenté aux MAIA 2','2026-12-04',21,'evt','Adjoint·e','jurys',0,'Novembre ou décembre.'],
 ['e17','Inscriptions aux ateliers du printemps (Forms)','2026-12-09',10,'cur','Adjoint·e','ateliers',0,'En décembre.'],
 ['e18','Crédits SHC : message aux étudiant·es concerné·es','2026-12-10',10,'cur','Adjoint·e','etudiants',0,'Avant les inscriptions à la SDTP.'],
 ['e19','Composition des jurys de diplôme BA et MAIA','2026-12-15',30,'evt','Adjoint·e','jurys',0,'Avec le responsable de filière.'],
 ['e20','Répartition des ateliers du printemps communiquée','2026-12-18',7,'cur','Adjoint·e','ateliers',0,'Excel de travail puis PDF définitif.'],
 ['e21','Notes du séminaire JMA d\'octobre demandées aux sites','2026-12-18',14,'cur','Adjoint·e','maia',0,'Avant la fin de l\'année civile.'],
 ['e22','Conventions de stage du printemps signées','2027-01-08',21,'cur','Étudiant·es','mobilites',0,'Début janvier.'],
 ['e23','Engagements des vacataires du printemps saisis','2027-01-15',21,'fin','Adjoint·e','engagements',0,'En janvier.'],
 ['e24','Calendriers du printemps définitifs envoyés','2027-01-15',10,'ens','Adjoint·e','echeancier',0,'Mi-janvier.'],
 ['e25','Portes ouvertes : affiches A0 validées, liste des prix','2027-01-15',21,'evt','Adjoint·e','evenements',0,''],
 ['e26','Séminaire JMA de janvier : absences et échecs connus','2027-01-20',7,'cur','Adjoint·e','maia',0,'Avant l\'échéance de saisie HEAD.'],
 ['e27','Jury MAIA : composition communiquée aux étudiant·es','2027-01-22',14,'evt','Adjoint·e','jurys',0,'En janvier.'],
 ['e28','Listes et trombinoscopes du printemps aux enseignant·es','2027-01-29',10,'cur','Adjoint·e','etudiants',0,'Avec calendriers et listes de présence.'],
 ['e29','SDTP : listes des inscrit·es aux intervenant·es','2027-01-29',10,'evt','Adjoint·e','evenements',0,''],
 ['e30','Premières projections de l\'année 2027-2028','2027-01-29',21,'ens','Adjoint·e','echeancier',0,'En janvier.'],
 ['e31','Changements majeurs du plan d\'études annoncés','2027-02-15',30,'ens','Adjoint·e','echeancier',1,'Avant le 15 février.'],
 ['e32','Commissions d\'admission : rappel de la séance d\'information','2027-02-19',10,'ins','Adjoint·e','conseils',0,'Février ou mars.'],
 ['e33','Syllabi du semestre de printemps reçus','2027-02-28',21,'ens','Enseignant·es','enseignement',1,'Délai du 28 février.'],
 ['e34','Stages de l\'automne : intentions annoncées','2027-03-01',14,'cur','Étudiant·es','mobilites',0,'Début mars.'],
 ['e35','Conseil de Master du semestre de printemps','2027-03-02',10,'ins','Adjoint·e','conseils',0,'Février ou mars.'],
 ['e36','Notes SDTP transmises au secrétariat','2027-03-05',7,'evt','Adjoint·e','evenements',0,'Dans les délais du BDE.'],
 ['e37','Cartels : échéance de remise des textes annoncée','2027-03-15',14,'evt','Adjoint·e','evenements',0,'Aux environs de mars.'],
 ['e38','WS S\'exprimer en public : dates confirmées','2027-04-15',21,'ens','Adjoint·e','enseignement',0,'Au plus tard en avril.'],
 ['e39','Calendriers 2027-2028 envoyés aux enseignant·es','2027-04-30',21,'ens','Adjoint·e','echeancier',0,'Avril et mai.'],
 ['e40','Prix Hans Wilsdorf : manifestations d\'intérêt','2027-05-15',30,'evt','Adjoint·e','evenements',1,'Idéalement pour le 15 mai.'],
 ['e41','Dates des Conseils 2027-2028 fixées','2027-05-28',21,'ins','Adjoint·e','conseils',0,'En mai.'],
 ['e42','Kick-off AI1 : enseignant·es mis·es en relation','2027-05-28',21,'ens','Adjoint·e','enseignement',0,'Mai ou juin.'],
 ['e43','Calendriers 2027-2028 : retours des enseignant·es','2027-06-04',14,'ens','Enseignant·es','echeancier',0,'Début juin au plus tard.'],
 ['e44','Notes du séminaire JMA de printemps demandées','2027-06-04',14,'cur','Adjoint·e','maia',0,'Début juin si possible.'],
 ['e45','Dernier Conseil de filière, vacataires invité·es','2027-06-29',21,'ins','Adjoint·e','conseils',1,'Mardi 29 juin 2027, 14 h, salle Barthélémy Menn.'],
 ['e46','Conventions de stage de l\'automne signées','2027-06-30',21,'cur','Étudiant·es','mobilites',0,'Fin juin.'],
 ['e47','Prix Hans Wilsdorf : dossiers avancés','2027-06-30',21,'evt','Adjoint·e','evenements',1,'Pour le 30 juin.'],
 ['e48','Engagements des vacataires de l\'automne saisis','2027-07-02',21,'fin','Adjoint·e','engagements',0,'Juin ou juillet.'],
 ['e49','Facture JMA du semestre de printemps demandée','2027-07-09',14,'fin','Adjoint·e','maia',0,'En juillet.'],
 ['e50','Descriptifs des cours à option JMA transmis','2027-07-16',21,'ens','Adjoint·e','maia',0,'En juillet, pour le catalogue de fin août.'],
 ['e51','Crédits SHC : message avant la Semaine inaugurale','2027-08-16',10,'cur','Adjoint·e','etudiants',0,'En août.'],
 ['e52','WS S\'exprimer en public : liste des participant·es','2027-08-20',10,'ens','Adjoint·e','enseignement',0,'En août.'],
 ['e53','Calendriers de l\'automne 2027 définitifs envoyés','2027-08-27',14,'ens','Adjoint·e','echeancier',0,'Fin août.'],
];
/* échéances passées laissées ouvertes pour la démonstration */
const OPEN_LATE=new Set(['e15','e13']);

/* ---------- Personnes (fiche 1.2) : fictives ---------- */
const FN=['Léa','Noah','Inès','Malik','Chloé','Elias','Maëlle','Yanis','Zoé','Luca','Sara','Mattéo','Lina','Gabriel','Nora','Arthur','Alix','Rayan','Jade','Samuel','Lou','Adam','Iris','Hugo','Mila','Théo','Ana','Nils','Elsa','Tom','Ambre','Diego','Lucie','Ilyas','Margaux','Basile','Aya','Victor','Romane','Kenji','Céleste','Milo','Yasmine','Oscar','Eva','Liam','Selma','Jonas','Clara','Ismaël','Héloïse','Anton','Leila','Raphaël','Nina','Joshua','Maya','Félix','Alma','Mehdi','Sofia','Louis','Emma','Timéo','Rose','Axel','Naïa','Paolo','Wen','Ilaria','Oskar','Mariam','Bastien','Ines','Julien','Tara','Simon','Asia','Nathan','Livia','Yuki','Marius','Daria','Esteban','Cléa','Hamza','Agathe','Pablo','Salomé','Ivo','Laure','Kofi','Manon','Teo','Ylva','Rémi','Sacha','Amir','Flora','Luis','Nour','Aurèle','Thaïs','Ugo','Hana','Robin','Elif','Gaspard','Juna'];
const LN=['Rochat','Moser','Dubey','Ferreira','Keller','Morand','Baumann','Sauvage','Lambelet','Pittet','Rossi','Nguyen','Dumas','Berset','Zanetti','Marchand','Favre','Haddad','Weber','Chappuis','Costa','Imhof','Gilliéron','Bianchi','Martin','Schmid','Duc','Vuilleumier','Oliveira','Perrin','Graf','Meylan','Ackermann','Leroy','Bachmann','Mendes','Jaquet','Bosshard','Kurt','Lopes','Varone','Monney','Huber','Ricci','Delacroix','Fischer','Tinguely','Yilmaz','Correvon','Brunner','Abbet','Sallin','Pereira','Thévoz','Gerber','Marti','Joliat','Mariani','Coppey','Steiner'];

const ATB=[ // ateliers BA du printemps 2027 (fictifs)
 {id:'MOR',nom:'Atelier Morel',lead:'Hélène Morel',theme:'Habiter le seuil',col:0},
 {id:'KEL',nom:'Atelier Keller',lead:'Jonas Keller',theme:'Réemploi et matière',col:1},
 {id:'DUA',nom:'Atelier Duarte',lead:'Inês Duarte',theme:'Intérieurs publics',col:2},
 {id:'BRU',nom:'Atelier Brunner',lead:'Mathis Brunner',theme:'Lumière et nuit',col:3},
 {id:'NAK',nom:'Atelier Nakamura',lead:'Aiko Nakamura',theme:'Mobilier et prototype',col:4},
 {id:'FER',nom:'Atelier Ferrari',lead:'Giulia Ferrari',theme:'Scénographies',col:5},
];
const PEOPLE=[
 {id:'p01',nom:'Hélène Morel',fn:'Professeure, atelier BA',st:'Engagée',taux:80,ateliers:['MOR'],cours:['Théorie de l\'espace intérieur'],cf:1,exp:'Habitat, rénovation',lieu:'Genève',h:{atelier:420,cours:56,jurys:48,ws:24,admin:60}},
 {id:'p02',nom:'Jonas Keller',fn:'Professeur, atelier BA',st:'Engagé',taux:70,ateliers:['KEL'],cours:[],cf:1,exp:'Matériaux, réemploi',lieu:'Bâle',h:{atelier:420,cours:0,jurys:44,ws:30,admin:40}},
 {id:'p03',nom:'Inês Duarte',fn:'Professeure, atelier BA',st:'Engagée',taux:60,ateliers:['DUA'],cours:[],cf:1,exp:'Espaces publics',lieu:'Lausanne',h:{atelier:400,cours:0,jurys:40,ws:0,admin:30}},
 {id:'p04',nom:'Mathis Brunner',fn:'Professeur, atelier BA',st:'Engagé',taux:60,ateliers:['BRU'],cours:['Lumière'],cf:1,exp:'Éclairage',lieu:'Zurich',h:{atelier:400,cours:28,jurys:36,ws:24,admin:20}},
 {id:'p05',nom:'Aiko Nakamura',fn:'Professeure, atelier BA',st:'Engagée',taux:50,ateliers:['NAK'],cours:[],cf:1,exp:'Design mobilier',lieu:'Genève',h:{atelier:380,cours:0,jurys:36,ws:24,admin:20}},
 {id:'p06',nom:'Giulia Ferrari',fn:'Professeure, atelier BA',st:'Engagée',taux:50,ateliers:['FER'],cours:[],cf:1,exp:'Scénographie',lieu:'Milan',h:{atelier:380,cours:0,jurys:36,ws:0,admin:20}},
 {id:'p07',nom:'Pierre Sallin',fn:'Professeur, studio MAIA',st:'Engagé',taux:70,ateliers:['MAIA'],cours:['Séminaire de recherche'],cf:1,exp:'Théorie, recherche',lieu:'Genève',h:{atelier:360,cours:84,jurys:40,ws:30,admin:40}},
 {id:'p08',nom:'Nadia Haddad',fn:'Professeure, studio MAIA',st:'Engagée',taux:60,ateliers:['MAIA'],cours:[],cf:1,exp:'Patrimoine, exposition',lieu:'Paris',h:{atelier:360,cours:28,jurys:40,ws:24,admin:20}},
 {id:'p09',nom:'Théo Graf',fn:'Chargé de cours',st:'Engagé',taux:30,ateliers:[],cours:['Technologie et matériaux'],cf:1,exp:'Construction',lieu:'Genève',h:{atelier:0,cours:168,jurys:12,ws:0,admin:6}},
 {id:'p10',nom:'Clara Bianchi',fn:'Chargée de cours',st:'Engagée',taux:30,ateliers:[],cours:['Théorie de la construction'],cf:1,exp:'Ingénierie',lieu:'Lausanne',h:{atelier:0,cours:168,jurys:12,ws:0,admin:6}},
 {id:'p11',nom:'Marc Vuilleumier',fn:'Chargé de cours',st:'Engagé',taux:20,ateliers:[],cours:['Histoire de l\'architecture intérieure'],cf:1,exp:'Histoire',lieu:'Genève',h:{atelier:0,cours:112,jurys:8,ws:0,admin:4}},
 {id:'p12',nom:'Sofia Lopes',fn:'Assistante, atelier BA',st:'Engagée',taux:60,ateliers:['MOR','BA1'],cours:[],cf:1,exp:'Maquette',lieu:'Genève',h:{atelier:520,cours:0,jurys:40,ws:40,admin:60}},
 {id:'p13',nom:'Kenji Rossi',fn:'Assistant, atelier BA',st:'Engagé',taux:50,ateliers:['KEL','NAK'],cours:[],cf:1,exp:'Fabrication',lieu:'Genève',h:{atelier:460,cours:0,jurys:36,ws:40,admin:40}},
 {id:'p14',nom:'Elsa Meylan',fn:'Assistante, atelier BA',st:'Engagée',taux:50,ateliers:['DUA','BRU'],cours:[],cf:1,exp:'Représentation',lieu:'Lausanne',h:{atelier:460,cours:0,jurys:36,ws:40,admin:30}},
 {id:'p15',nom:'Anton Huber',fn:'Assistant, atelier BA',st:'Engagé',taux:40,ateliers:['FER','BA1'],cours:[],cf:1,exp:'Scénographie',lieu:'Genève',h:{atelier:380,cours:0,jurys:30,ws:40,admin:20}},
 {id:'p16',nom:'Maya Thévoz',fn:'Assistante, MAIA',st:'Engagée',taux:50,ateliers:['MAIA'],cours:[],cf:1,exp:'Recherche',lieu:'Genève',h:{atelier:420,cours:40,jurys:36,ws:40,admin:40}},
 {id:'p17',nom:'Léo Correvon',fn:'Assistant de filière',st:'Engagé',taux:80,ateliers:[],cours:[],cf:1,exp:'Communication, images',lieu:'Genève',h:{atelier:0,cours:0,jurys:40,ws:20,admin:900}},
 {id:'p18',nom:'Ana Ferreira',fn:'Vacataire régulière',st:'Vacataire',taux:0,ateliers:[],cours:['Dessin d\'observation'],cf:0,exp:'Dessin',lieu:'Genève'},
 {id:'p19',nom:'Ivo Marti',fn:'Vacataire régulier',st:'Vacataire',taux:0,ateliers:[],cours:['Outils numériques'],cf:0,exp:'Modélisation 3D',lieu:'Lausanne'},
 {id:'p20',nom:'Laure Pittet',fn:'Vacataire régulière',st:'Vacataire',taux:0,ateliers:[],cours:['Gestion durable'],cf:0,exp:'Durabilité',lieu:'Fribourg'},
 {id:'p21',nom:'Raphaël Dumas',fn:'Vacataire régulier',st:'Vacataire',taux:0,ateliers:[],cours:['Économie de projet'],cf:0,exp:'Économie de la construction',lieu:'Genève'},
 {id:'p22',nom:'Nour Yilmaz',fn:'Vacataire régulière',st:'Vacataire',taux:0,ateliers:[],cours:['Théorie et pratique de la photographie'],cf:0,exp:'Photographie',lieu:'Zurich'},
 {id:'p23',nom:'Carla Mendes',fn:'Intervenante ponctuelle',st:'Intervenant·e',taux:0,ateliers:[],cours:['Workshop SDTP'],cf:0,exp:'Textile',lieu:'Lisbonne'},
 {id:'p24',nom:'Oskar Lindqvist',fn:'Intervenant ponctuel',st:'Intervenant·e',taux:0,ateliers:[],cours:['Workshop SDTP'],cf:0,exp:'Acoustique',lieu:'Stockholm'},
 {id:'p25',nom:'Bastien Coppey',fn:'Intervenant ponctuel',st:'Intervenant·e',taux:0,ateliers:[],cours:['Midi Archi'],cf:0,exp:'Architecture',lieu:'Sion'},
 {id:'p26',nom:'Elif Kaya',fn:'Intervenante ponctuelle',st:'Intervenant·e',taux:0,ateliers:[],cours:['Workshop SDTP'],cf:0,exp:'Design sonore',lieu:'Berlin'},
 {id:'p27',nom:'Paolo Varone',fn:'Intervenant ponctuel',st:'Intervenant·e',taux:0,ateliers:[],cours:['Jury externe'],cf:0,exp:'Agencement',lieu:'Milan'},
 {id:'p28',nom:'Hana Weber',fn:'Intervenante ponctuelle',st:'Intervenant·e',taux:0,ateliers:[],cours:['Jury externe'],cf:0,exp:'Retail design',lieu:'Zurich'},
];

[.02,-.05,.08,-.03,.0,-.08,.05,.12,-.04,.0,.06,.1,-.02,.04,-.06,.07,.03].forEach((dv,i)=>{const p=PEOPLE[i];if(!p||!p.h)return;const tot=Object.values(p.h).reduce((a,b)=>a+b,0);const f=p.taux*19*(1+dv)/tot;for(const k in p.h)p.h[k]=Math.round(p.h[k]*f/5)*5});
/* ---------- Étudiant·es (fiche 1.1) : fictifs ---------- */
const COH=[['BA1','Bachelor 1re année',30,'BA'],['BA2','Bachelor 2e année',28,'BA'],['BA3','Bachelor 3e année',30,'BA'],['MA1','MAIA 1',16,'MA'],['MA2','MAIA 2',14,'MA']];
const used=new Set();const nm=()=>{let n;do{n=pick(FN)+' '+pick(LN)}while(used.has(n));used.add(n);return n};
const ST=[];
COH.forEach(([c,lab,n,cur])=>{for(let i=1;i<=n;i++){
  const id=`${c}-${String(i).padStart(3,'0')}`;
  ST.push({id,nom:nm(),coh:c,cur,annee:+c[2],statut:'Régulier',flags:[],hist:[],histRank:[],cession:true,shc:0,credits:0,attendu:0,pep:null,stage:null,mob:null});
}});
const byCoh=c=>ST.filter(s=>s.coh===c);
/* historique des ateliers BA (S2 de BA1 au S5) */
const ATIDS=ATB.map(a=>a.id);
const hr=()=>{const r=rnd();return r<.8?1:r<.95?2:3};
byCoh('BA2').forEach(s=>{s.hist=shuffle(ATIDS).slice(0,2);s.histRank=[hr(),hr()]});
byCoh('BA3').forEach(s=>{const h=[];for(let k=0;k<4;k++){let a=pick(ATIDS);if(h.filter(x=>x===a).length>=1&&rnd()<.7)a=pick(ATIDS);h.push(a)}s.hist=h;s.histRank=h.map(()=>hr())});
byCoh('BA1').forEach(s=>{s.hist=[];s.histRank=[]});
/* crédits (attendus au S3 / S5 etc.) */
ST.forEach(s=>{const sem={BA1:1,BA2:3,BA3:5,MA1:1,MA2:3}[s.coh];s.attendu=(sem-1)*30;s.credits=s.attendu});
/* statuts particuliers */
const setFlag=(s,f)=>{if(!s.flags.includes(f))s.flags.push(f)};
const ba2=byCoh('BA2'),ba3=byCoh('BA3'),ba1=byCoh('BA1'),ma1=byCoh('MA1'),ma2=byCoh('MA2');
// OUT au printemps (BA2) et stages (BA2/BA3, MAIA)
[ba2[3],ba2[9],ba2[17],ba2[22]].forEach((s,i)=>{s.statut='OUT';setFlag(s,'OUT');s.mob={dir:'OUT',ecole:['Politecnico di Milano','TU Delft','Aalto University','ENSAD Paris'][i],sem:'Printemps 2027'}});
[ba3[2],ba3[11],ba2[5],ba3[19],ba2[14]].forEach((s,i)=>{s.statut='Stage';setFlag(s,'Stage');s.stage={bureau:['Atelier Lumen','Studio Fabrique','Bureau Seuil & Co','Atelier Contrepoint','Kollektiv Raum'][i],ville:['Genève','Lausanne','Genève','Zurich','Bâle'][i],credits:9,intention:'2026-11-03',convention:[1,1,0,0,1][i]?'Signée':'Attendue',sem:'Printemps 2027'}});
[ma2[4],ma1[6],ma1[11]].forEach((s,i)=>{s.statut='Stage';setFlag(s,'Stage');s.stage={bureau:['Maison Dédale','Studio Nord','Spazio Tre'][i],ville:['Paris','Copenhague','Milan'][i],credits:12,intention:'2026-11-04',convention:['Signée','Attendue','Attendue'][i],sem:'Printemps 2027',horsUE:i===2}});
// PEP
const PEPS=[[ba2[1],'Rattrapage','Atelier échoué au S3 repris au S4'],[ba3[6],'Allègement','Semestres allégés sur deux ans'],[ba3[14],'Rattrapage','Cours Technologie et matériaux à reprendre'],[ma2[9],'Allègement','Cursus MAIA sur trois ans'],[ba1[12],'Allègement','Allègement dès le S2']];
PEPS.forEach(([s,type,lib],i)=>{s.statut='PEP';setFlag(s,'PEP');
  const sems=['S1','S2','S3','S4','S5','S6','S7'];const n=type==='Allègement'?7:6;
  s.pep={type,lib,valide:'2026-0'+(6+i%3)+'-1'+(i+2),plan:sems.slice(0,n).map((x,k)=>({sem:x,prevu:type==='Allègement'?(k<2?30:22):30}))};
  s.credits=s.attendu-[9,14,3,8,0][i]});
// IN printemps (arrivées)
const IN=[];
[['BA','Politecnico di Torino','Italie'],['BA','ENSAAMA Paris','France'],['BA','Universidade de Lisboa','Portugal'],['BA','LMU Munich','Allemagne'],['BA','ESAD Porto','Portugal'],['BA','ENSA Nantes','France'],['MA','KADK Copenhague','Danemark'],['MA','Politecnico di Milano','Italie'],['MA','TU Wien','Autriche'],['MA','Aalto University','Finlande'],['MA','Bezalel Jérusalem','Israël']].forEach(([cur,ec,pays],i)=>{
  const crit=cur==='BA'?{langue:rnd()>.18,credits:rnd()>.12,portfolio:rnd()>.2}:{langue:rnd()>.1,portfolio:rnd()>.25};
  const dec=['Acceptée','Acceptée','Acceptée','Refusée','Acceptée','Acceptée','Acceptée','Acceptée','Acceptée','À examiner','Refusée'][i];
  if(dec==='Acceptée')Object.keys(crit).forEach(k=>crit[k]=true);
  if(dec==='Refusée'){crit[i===3?'langue':'portfolio']=false}
  if(dec==='À examiner'){Object.keys(crit).forEach(k=>crit[k]=true);crit.portfolio=null}
  IN.push({id:'IN-'+String(i+1).padStart(2,'0'),nom:nm(),cur,ecole:ec,pays,crit,decision:dec,inscrAteliers:cur==='BA'?(i<4):null})});
// crédits SHC (BA)
[ba1[3],ba1[8],ba2[2],ba2[12],ba2[20],ba3[4],ba3[22]].forEach((s,i)=>{s.shc=3;setFlag(s,'SHC');s.shcChoix=['Utilise','Sans réponse','Utilise','Suit la SDTP','Sans réponse','Utilise','Sans réponse'][i]});
// cessions de droits manquantes
[ba1[17],ma1[2],ba1[25]].forEach(s=>{s.cession=false;setFlag(s,'Cession')});
// congé
ba3[27].statut='Congé';setFlag(ba3[27],'Congé');
/* choix d'ateliers du printemps (BA1 à BA3 présents) */
const pop=[0.22,0.2,0.12,0.16,0.19,0.11]; // attractivité relative des ateliers (fictif)
const wpick=excl=>{let t=0;const w=ATB.map((a,i)=>excl.includes(a.id)?0:pop[i]);w.forEach(x=>t+=x);let r=rnd()*t;for(let i=0;i<w.length;i++){r-=w[i];if(r<=0)return ATB[i].id}return ATB.find(a=>!excl.includes(a.id)).id};
ST.filter(s=>s.cur==='BA'&&!['OUT','Stage','Congé'].includes(s.statut)).forEach(s=>{
  const c=[];for(let k=0;k<3;k++)c.push(wpick(c));s.choix=c;
  s.repondu=!(rnd()<0.05);if(!s.repondu)s.choix=null});
// diplômé·es du printemps : BA3 (S6)
ba3.forEach(s=>{if(s.statut!=='Stage'&&s.statut!=='Congé')s.diplome=true});
// IN BA acceptés rejoignent la répartition
IN.filter(x=>x.decision==='Acceptée').forEach(x=>{const ba=x.cur==='BA';ST.push({id:x.id,nom:x.nom,coh:'IN',cur:x.cur,annee:ba?2:1,statut:'IN',flags:['IN'],hist:[],histRank:[],cession:x.id!=='IN-03',shc:0,credits:0,attendu:0,ecole:x.ecole,choix:ba?(()=>{const c=[];for(let k=0;k<3;k++)c.push(wpick(c));return c})():undefined,repondu:true});if(x.id==='IN-03')setFlag(ST[ST.length-1],'Cession')});
ST.forEach(s=>{s.email=s.nom.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z ]/g,'').replace(' ','.')+'@etu.hesge.ch'});

/* ---------- Budget 2026 (fiche 2.1) : fictif ---------- */
const MOIS=['janv','févr','mars','avr','mai','juin','juil','août','sept','oct','nov','déc'];
const prof=(tot,shape)=>{const s=shape.reduce((a,b)=>a+b,0);return shape.map(x=>Math.round(tot*x/s))};
const BUD={
 BA:[
  {l:'Vacataires et intervenant·es',p:182000,f:0.97,sh:[2,14,6,4,3,4,1,0,16,6,4,2]},
  {l:'Jurys et expert·es',p:38000,f:0.9,sh:[8,2,1,1,1,9,1,0,0,0,0,1]},
  {l:'Workshops (inaugurale, SDTP, SHC)',p:46000,f:0.84,sh:[1,10,1,1,0,1,0,1,9,1,1,1]},
  {l:'Voyages d\'études',p:24000,f:0.71,sh:[0,1,3,2,1,0,0,0,1,3,1,0]},
  {l:'Matériel et maquettes',p:31000,f:1.08,sh:[2,3,3,2,2,2,0,1,4,3,3,2]},
  {l:'Événements et expositions',p:28000,f:0.88,sh:[6,0,0,1,1,7,0,0,0,0,1,1]},
  {l:'Communication et publications',p:18000,f:0.62,sh:[1,1,1,2,1,2,0,0,1,1,1,1]},
  {l:'Divers',p:6000,f:0.55,sh:[1,1,1,1,1,1,1,1,1,1,1,1]},
 ],
 MA:[
  {l:'Vacataires et intervenant·es',p:96000,f:0.95,sh:[2,13,6,4,3,4,1,0,14,6,4,2]},
  {l:'Participation au JMA',p:64000,f:1.0,sh:[0,0,0,0,0,0,0,1,0,0,0,1]},
  {l:'Jurys et expert·es',p:22000,f:0.86,sh:[6,2,1,1,1,8,0,0,0,0,0,1]},
  {l:'Workshops (Camondo, PULSE)',p:21000,f:0.78,sh:[0,0,0,0,0,4,0,0,6,1,0,0]},
  {l:'Voyages (ECAL, JDRC)',p:9000,f:0.92,sh:[0,0,1,0,0,0,0,0,3,3,1,0]},
  {l:'Événements (Milan, diplômes)',p:26000,f:0.81,sh:[1,1,3,5,1,6,0,0,0,0,0,0]},
  {l:'Communication (site, brochure)',p:12000,f:0.74,sh:[1,0,1,1,0,1,0,0,1,1,1,2]},
  {l:'Divers',p:4000,f:0.4,sh:[1,1,1,1,1,1,1,1,1,1,1,1]},
 ]};
Object.values(BUD).forEach(L=>L.forEach(x=>{x.m=prof(x.p*x.f,x.sh)}));
/* ---------- Engagements vacataires du printemps 2027 (fiche 2.2) ---------- */
const STAGES=['Tarif convenu','Demande préparée','À signer','Signée','N° attribué','Reportée'];
const ENG=[];
const engRows=[
 ['p18','Cours Dessin d\'observation, BA1','BA','Horaire',120,56,0],['p19','Cours Outils numériques, BA2','BA','Horaire',120,42,0],
 ['p20','Cours Gestion durable, BA3','BA','Horaire',120,28,0],['p21','Cours Économie de projet, BA3','BA','Horaire',120,28,0],
 ['p22','Théorie et pratique de la photographie, BA2','BA','Horaire',120,42,0],['p23','Workshop SDTP « Textiles habités »','Projet École','Forfait',2400,1,780],
 ['p24','Workshop SDTP « Écouter la pièce »','Projet École','Forfait',2400,1,1120],['p26','Workshop SDTP « Sons d\'intérieur »','Projet École','Forfait',2400,1,940],
 ['p25','Midi Archi, conférence du 9 mars','BA','Forfait',500,1,120],['p27','Jury externe, diplômes BA','BA','Forfait',900,1,380],
 ['p28','Jury externe, diplômes MAIA','MAIA','Forfait',900,1,160],['p19','Workshop maquette numérique, MAIA 1','MAIA','Horaire',120,16,0],
 ['p20','Intervention GENEVA LUX, atelier','Mandat GENEVA LUX','Forfait',1600,1,0],['p25','Critique intermédiaire, atelier Morel','BA','Forfait',450,1,90],
 ['p21','Séminaire économie, MAIA 2','MAIA','Horaire',120,12,0],['p23','Visite d\'atelier textile, MAIA','MAIA','Forfait',600,1,240],
 ['p22','Prises de vues des diplômes','BA','Forfait',1800,1,0],['p27','Critique finale, studio MAIA','MAIA','Forfait',450,1,380],
];
const engStage=[5,5,4,4,3,3,2,2,2,1,1,1,0,0,0,3,2,4];
engRows.forEach((r,i)=>{const p=PEOPLE.find(x=>x.id===r[0]);const montant=r[4]*r[5]+r[6];ENG.push({id:'g'+(i+1),pers:p.nom,lieu:p.lieu,obj:r[1],budget:r[2],remu:r[3],tarif:r[4],qte:r[5],frais:r[6],montant,stage:engStage[i],depose:engStage[i]===2?['2026-12-01','2026-12-03','2026-11-27'][i%3]:null,num:engStage[i]>=4?'DE-2026-'+(410+i):null})});
/* ---------- Bons de commande en attente (circuit de signature, fiche 6.1) ---------- */
const BC=[
 {id:'bc1',type:'Bon de commande',obj:'Matériaux maquettes, atelier Keller',budget:'BA',montant:1840,depose:'2026-12-02'},
 {id:'bc2',type:'Bon de commande',obj:'Impression affiches A0 portes ouvertes',budget:'BA',montant:960,depose:'2026-12-04'},
 {id:'bc3',type:'Bon de commande',obj:'Location de matériel, GENEVA LUX',budget:'Mandat GENEVA LUX',montant:2350,depose:'2026-12-04'},
];

/* ---------- Mandats 2026-2027 (fiche 2.3) : noms du guide, montants fictifs ---------- */
const MSTEPS=['Pesée d\'intérêts','Contrat signé','Fiche budget','Enregistrement AGP','N° de mandat','Facturation','Clôture'];
const MAND=[
 {id:'FCAC',nom:'FCAC · projet NOMADE',cadre:'Atelier BA, semestre d\'automne',montant:18500,pilier:'6 · Prestations de services',sign:'Directrice',step:4,num:'M-26-031',eng:11200,fact:[['2026-10-15',9250,'Émise'],['2027-02-15',9250,'Prévue']]},
 {id:'LUX',nom:'GENEVA LUX',cadre:'Studio MAIA, semestre de printemps',montant:24000,pilier:'6 · Prestations de services',sign:'Directrice',step:4,num:'M-26-044',eng:3900,fact:[['2027-01-31',8000,'Prévue'],['2027-03-31',8000,'Prévue'],['2027-05-31',8000,'Prévue']]},
 {id:'OPI',nom:'OPI · CONTRE-JOURS',cadre:'Atelier BA, demi-semestre',montant:7800,pilier:'5 · Recherche',sign:'Directrice',step:3,num:null,eng:0,fact:[['2027-04-30',7800,'Prévue']]},
 {id:'SIA',nom:'SIA',cadre:'Cours BA3, semestre de printemps',montant:4500,pilier:'6 · Prestations de services',sign:'Responsable de filière',step:1,num:null,eng:0,fact:[['2027-06-30',4500,'Prévue']]},
];

/* ---------- Enseignement : syllabi (fiche 4.4) et cohérence (4.5) ---------- */
const SYL=[
 ['Atelier BA1 (kick-off)','BA1','Sofia Lopes','ok'],['Atelier Morel','BA2-3','Hélène Morel','ok'],['Atelier Keller','BA2-3','Jonas Keller','ok'],
 ['Atelier Duarte','BA2-3','Inês Duarte','ecart'],['Atelier Brunner','BA2-3','Mathis Brunner','ok'],['Atelier Nakamura','BA2-3','Aiko Nakamura','ok'],
 ['Atelier Ferrari','BA2-3','Giulia Ferrari','ok'],['Technologie et matériaux','BA2','Théo Graf','ok'],['Théorie de la construction','BA1','Clara Bianchi','ok'],
 ['Histoire de l\'architecture intérieure','BA1','Marc Vuilleumier','ecart'],['Théorie de l\'espace intérieur','BA2','Hélène Morel','ok'],['Lumière','BA3','Mathis Brunner','ok'],
 ['Dessin d\'observation','BA1','Ana Ferreira','manque'],['Outils numériques','BA2','Ivo Marti','ok'],['Théorie et pratique de la photographie','BA2','Nour Yilmaz','ok'],
 ['Préparation à la thèse','BA3','Marc Vuilleumier','ok'],['Studio MAIA 1','MA1','Pierre Sallin','ok'],['Studio MAIA 2 (diplôme)','MA2','Nadia Haddad','ok'],
 ['Séminaire de recherche','MA1','Pierre Sallin','ok'],['Bases techniques et professionnelles','MA1','Théo Graf','ecart'],
].map(r=>({cours:r[0],coh:r[1],ens:r[2],sa:r[3]}));
const COHER={
 'Atelier Duarte':{fm:{part:'Présence obligatoire à 80 % des séances',comp:['C1 Analyser un contexte','C2 Concevoir un intérieur public','C3 Représenter','C4 Argumenter oralement'],eval:'Jury de fin de semestre, note sur 6, critères publiés'},sy:{part:'Présence obligatoire à 70 % des séances',comp:['C1 Analyser un contexte','C2 Concevoir un intérieur public','C3 Représenter'],eval:'Jury de fin de semestre, note sur 6, critères publiés'},ecarts:['part','comp']},
 'Histoire de l\'architecture intérieure':{fm:{part:'Présence recommandée',comp:['C1 Situer une œuvre','C2 Mobiliser des références'],eval:'Examen écrit, 50 % ; dossier, 50 %'},sy:{part:'Présence recommandée',comp:['C1 Situer une œuvre','C2 Mobiliser des références'],eval:'Examen écrit, 100 %'},ecarts:['eval']},
 'Bases techniques et professionnelles':{fm:{part:'Présence obligatoire à 80 %',comp:['C1 Normes et réglementation','C2 Chiffrage','C3 Détail constructif'],eval:'Moyenne des cours du module'},sy:{part:'Présence obligatoire à 80 %',comp:['C1 Normes et réglementation','C3 Détail constructif'],eval:'Moyenne des cours du module'},ecarts:['comp']},
};
/* moyennes de modules MAIA (fiche 4.6) */
const MODNOTES={mod:'Bases techniques et professionnelles',cours:['Normes et réglementation','Chiffrage','Détail constructif'],recu:[1,1,0]};

/* ---------- JMA (fiches 4.2, 2.4, 4.7) ---------- */
const JMA={sites:['Fribourg','Bienne','Genève'],libre:'jeudi',
 sem:[{id:'O1',lib:'Séminaire d\'octobre · option A',site:'Fribourg',langue:'Français'},{id:'O2',lib:'Séminaire d\'octobre · option B',site:'Bienne',langue:'Allemand et anglais'},
      {id:'J1',lib:'Séminaire de janvier · option A',site:'Genève',langue:'Français'},{id:'J2',lib:'Séminaire de janvier · option B',site:'Fribourg',langue:'Français'}],
 opt:[{id:'C1',lib:'Construire en terre',site:'Fribourg',jour:'mercredi',langue:'Français'},{id:'C2',lib:'Paysages de l\'énergie',site:'Bienne',jour:'jeudi',langue:'Allemand'},
      {id:'C3',lib:'Intérieurs en transition',site:'Genève',jour:'jeudi',langue:'Français',maia:true},{id:'C4',lib:'Atlas des seuils',site:'Genève',jour:'mardi',langue:'Anglais'},
      {id:'C5',lib:'Structures légères',site:'Fribourg',jour:'jeudi',langue:'Français'}],
 tarifSem:1150,tarifOpt:420, // fictif
 conv:[['A',6],['B',5.5],['C',5],['D',4.5],['E',4],['Fx',3.5],['F',3]],
};
const ma1i=byCoh('MA1');
ma1i.forEach((s,i)=>{s.jma={O:i%2?'O1':'O2',J:i%3?'J1':'J2',opt:['C3','C1','C3','C4','C5','C3','C1','C3','C2','C3','C4','C3','C5','C3','C1','C3'][i]};
 if(i===4)s.jma.J=null; if(i===10)s.jma.opt=null;});
ma1i.forEach((s,i)=>{s.jmaRes={O:['A','B','B','C','A','B','D','B','A','C','B','Fx','A','B','C','B'][i]}});

/* ---------- Mobilités (fiche 3.3) : fictif ---------- */
const MOB=[['SA 23',4,3,2,1],['SP 24',6,4,3,2],['SA 24',5,3,3,1],['SP 25',7,4,4,2],['SA 25',5,4,4,2],['SP 26',8,5,5,2],['SA 26',6,4,5,3],['SP 27',5,4,3,0]];// [sem, BA IN, BA OUT, MA IN, MA OUT]
/* ---------- Bureaux de stage depuis 2023 (fiche 3.4) : fictifs, villes réelles ---------- */
const CITY={Genève:[6.14,46.2],Lausanne:[6.63,46.52],Zurich:[8.54,47.37],Bâle:[7.59,47.56],Berne:[7.45,46.95],Fribourg:[7.16,46.8],Paris:[2.35,48.86],Lyon:[4.83,45.76],Milan:[9.19,45.46],Londres:[-0.13,51.5],Berlin:[13.4,52.52],Copenhague:[12.57,55.68],Rotterdam:[4.48,51.92],Barcelone:[2.17,41.39],Lisbonne:[-9.14,38.72],Vienne:[16.37,48.21]};
const BUREAUX=[['Atelier Lumen','Genève',4,'BA'],['Studio Fabrique','Lausanne',3,'BA'],['Bureau Seuil & Co','Genève',3,'BA'],['Atelier Contrepoint','Zurich',2,'BA'],['Kollektiv Raum','Bâle',2,'BA'],['Maison Dédale','Paris',3,'MA'],['Studio Nord','Copenhague',2,'MA'],['Spazio Tre','Milan',3,'MA'],['Agence Ligne Claire','Genève',2,'BA'],['Atelier Vitrine','Lausanne',1,'BA'],['Raumwerk','Berne',2,'BA'],['Bureau Prisme','Lyon',1,'MA'],['Oficina Luz','Lisbonne',1,'MA'],['Halle 5','Fribourg',1,'BA'],['Studio Mezzanine','Londres',2,'MA'],['Werkhaus','Berlin',1,'MA'],['Atelier Patine','Genève',2,'BA'],['Huis Studio','Rotterdam',1,'MA'],['Estudi Pati','Barcelone',1,'MA'],['Form & Raum','Vienne',1,'MA'],['Atelier Strate','Zurich',1,'BA']];

/* ---------- Événements (fiches 5.1, 5.2, 5.5, 5.9) ---------- */
const EVT=[
 {id:'inaug',nom:'Semaine inaugurale',d:'2026-09-14',f:'2026-09-18',off:1,src:'WORKSHOPS › 2026-2027 › 2026.09_Semaine inaugurale'},
 {id:'camondo',nom:'Workshop HEAD-Camondo',d:'2026-09-28',f:'2026-10-02',off:0,src:'02_MASTER AI › 2026-2027 › WS HEAD - CAMONDO'},
 {id:'po',nom:'Portes ouvertes',d:'2027-01-23',f:'2027-01-23',off:1,src:'EVENEMENTS / PROJETS ECOLE › OPEN HOUSE'},
 {id:'sdtp',nom:'Semaine de tous les possibles',d:'2027-02-22',f:'2027-02-26',off:1,src:'WORKSHOPS › 2026-2027 › 2027.02_SDTP'},
 {id:'milan',nom:'Milano Design Week',d:'2027-04-20',f:'2027-04-25',off:0,src:'EVENEMENTS / PROJETS ECOLE › MILAN - DESIGN WEEK'},
 {id:'pulse',nom:'Workshop PULSE MAIA-MADI',d:'2027-06-07',f:'2027-06-11',off:0,src:'02_MASTER AI › 2026-2027 › WS PULSE MAIA-MADI'},
 {id:'expo',nom:'Expositions de fin de semestre et de diplôme',d:'2027-06-14',f:'2027-06-25',off:0,src:'EVENEMENTS / PROJETS ECOLE › EXPOSITION FIN SEMESTRE'},
 {id:'defile',nom:'Défilé',d:'2027-11-12',f:'2027-11-12',off:0,src:'EVENEMENTS / PROJETS ECOLE › DÉFILÉ'},
];
/* fiche de reprise : les six points du guide. g = repris du guide, f = fictif */
const REPRISE={
 po:{chrono:[['Octobre','Textes des ateliers relus pour les affiches A0','g'],['Novembre','Sélection des portfolio reviews vérifiée avec les assistant·es','g'],['Mi-janvier','Liste des prix transmise à la communication','g'],['Samedi 10 h','Installations terminées, ouverture au public','g'],['Samedi 18 h','Rangement collectif, BA au 1er, MAIA au 4e','g']],
  resp:[['Adjoint·e','Coordination des ateliers, validation des affiches, stand du BDE'],['Assistant·e de filière','Affiches A0, rangement des ateliers-maquettes'],['Ateliers','Présentation du travail du semestre'],['Communication','Supports et valorisation des prix']],
  valid:['Affiches validées par le responsable ou l\'adjoint·e avant impression','Choix des étudiant·es des portfolio reviews vérifié avec les assistant·es'],
  docs:['Affiches A0 par atelier','Planning des portfolio reviews','Liste des prix et distinctions','Plan d\'occupation des étages'],
  contacts:['Bureau des alumni (présentation des parcours)','Service de la communication','Bureau des études (stand près du Cube)'],
  echeances:[['2027-01-08','Affiches envoyées à l\'impression','f'],['2027-01-15','Liste des prix à la communication','f'],['2027-01-23','Portes ouvertes','o']],
  note:'Sélection des travaux de BA AI 2 « Technologie et matériaux », tabourets de BA AI 1, publications de la filière : trois présentations complémentaires au premier étage.'},
 sdtp:{chrono:[['Année précédente','Première liste d\'intervenant·es avec le responsable','g'],['Mai à juillet','Contact avec les personnes pressenties','g'],['Fin août','Premier descriptif','g'],['Septembre','Gabarits, assistant·es','g'],['15 octobre','Descriptifs finalisés à la transversalité','g'],['Novembre','Mise en contact, lien du catalogue','g'],['Janvier','Inscriptions et listes','g']],
  resp:[['Adjoint·e','Suivi des workshops AI, coordination du workshop MADI'],['Assistant·es','Lien avec l\'intervenant·e, logistique, matériel'],['Bureau de la transversalité','Catalogue, inscriptions'],['Secrétariat','Saisie des notes dans AGE']],
  valid:['Demande d\'apéritif adressée à la direction','Contrats des intervenant·es préparés tôt'],
  docs:['Gabarits de la transversalité','Message récapitulatif à chaque intervenant·e','Listes AGE','Notes des participant·es'],
  contacts:['Bureau de la transversalité','Département Communication visuelle (apéritif du vendredi)'],
  echeances:[['2026-10-15','Descriptifs à la transversalité','g'],['2027-01-29','Listes aux intervenant·es','f'],['2027-02-22','Accueil du lundi matin','o'],['2027-03-05','Notes au secrétariat','f']],
  note:'Une absence de plus d\'une journée invalide le workshop : les intervenant·es en sont informé·es dès l\'accueil.'},
 expo:{chrono:[['Novembre-décembre','Composition des jurys discutée','g'],['Mars','Échéance des textes de cartels annoncée','g'],['Mai','Scénographie et vernissage','f'],['Juin','Jurys, prises de vues, exposition','g']],
  resp:[['Adjoint·e','Jurys, demande d\'apéritif, coordination des ateliers de diplôme'],['Assistant·e de filière','Organisation pratique, centralisation des cartels'],['Communication','Documentation visuelle des diplômes']],
  valid:['Membres des jurys validés par la direction','Autorisation d\'apéritif par la direction','Validation finale des cartels'],
  docs:['Rétroplanning général','Cartels BA et MAIA','Ordre de passage','Rapports de jury'],
  contacts:['Service de la communication','Ateliers de diplôme BA et MAIA'],
  echeances:[['2027-03-15','Textes des cartels annoncés','f'],['2027-06-14','Début des jurys','o']],
  note:'Les rétroplannings des années précédentes sont dans DIPLÔMES - BACHELOR et MA THESIS.'},
};
const SDTP=[
 {t:'Textiles habités',int:'Carla Mendes',orig:'Lisbonne',ass:'Sofia Lopes',cur:'AI',steps:9},
 {t:'Écouter la pièce',int:'Oskar Lindqvist',orig:'Stockholm',ass:'Kenji Rossi',cur:'AI',steps:8},
 {t:'Sons d\'intérieur',int:'Elif Kaya',orig:'Berlin',ass:'Elsa Meylan',cur:'AI',steps:8},
 {t:'Mobilier à démonter',int:'Bastien Coppey',orig:'Sion',ass:'Anton Huber',cur:'AI',steps:9},
 {t:'Cartographies sensibles',int:'Nour Yilmaz',orig:'Zurich',ass:'Maya Thévoz',cur:'AI',steps:7},
 {t:'Installation lumineuse',int:'Intervenant·e MADI',orig:'Genève',ass:'Master Design Installation',cur:'MADI',steps:6},
];
const SDTP_STEPS=['Liste','Contact','Descriptif','Gabarit','Assistant·e','Transversalité 15.10','Mise en contact','Contrat','Transport','Listes','Notes'];
const PRIX=[
 {nom:'Prix Hans Wilsdorf',cible:'BA AI, volées 2025 à 2027',etapes:[['Mai','Séance d\'information'],['15 mai','Manifestations d\'intérêt'],['30 juin','Dossiers avancés'],['Octobre','Dossiers définitifs, dix au plus']],g:1},
 {nom:'Prix Teo Jakob',cible:'Diplôme de Bachelor',etapes:[['Juin','Jurys de diplôme']],g:1},
 {nom:'Prix d\'encouragement VSI.ASAI',cible:'Diplômes BA et MAIA',etapes:[['Juin','Jurys de diplôme']],g:1},
 {nom:'Prix Art et Humanité',cible:'Diplômé·es proposé·es par la filière',etapes:[['Sur sollicitation','Proposition de noms']],g:1},
];
const LAUREATS=[['2026','Prix Teo Jakob','Diplômée BA (fictif)'],['2026','Prix VSI.ASAI','Diplômé MAIA (fictif)'],['2026','Prix VSI.ASAI','Diplômée BA (fictif)'],['2025','Prix Hans Wilsdorf','Diplômé MAIA (fictif)'],['2026','Red Dot Award','Alumna MAIA 2024 (fictif)']];

/* ---------- Jurys de diplôme (fiche 5.3) ---------- */
const JURY={
 BA:{internes:['Irma Cilacian','Valentin Dubois'],ext:[{n:'Paolo Varone',st:'Confirmé'},{n:'Hana Weber',st:'Invité'},{n:null,st:'À choisir'}],shortlist:['Studio Nord, Copenhague','Bureau Prisme, Lyon','Raumwerk, Berne','Agence Ligne Claire, Genève'],cand:28,jours:['2027-06-14','2027-06-15','2027-06-16'],cube:'Réservé'},
 MA:{internes:['Interne 1','Interne 2'],ext:[{n:null,st:'À choisir'},{n:null,st:'À choisir'},{n:null,st:'Choix étudiant·es'}],shortlist:[],cand:13,jours:['2027-06-21','2027-06-22'],cube:'Réservé'},
};

/* ---------- Conseils et décisions (fiches 5.6, 5.7) ---------- */
const CONS=[
 {d:'2026-09-29',t:'Conseil de filière',h:'12 h-14 h',f:0},{d:'2026-10-06',t:'Conseil de Master',h:'',f:0},{d:'2026-10-27',t:'Conseil de filière',h:'12 h-14 h',f:0},
 {d:'2026-11-17',t:'Conseil de filière',h:'12 h-14 h',f:1},{d:'2027-03-02',t:'Conseil de filière',h:'12 h-14 h',f:0},{d:'2027-03-09',t:'Conseil de Master',h:'',f:0},
 {d:'2027-04-13',t:'Conseil de filière',h:'12 h-14 h',f:0},{d:'2027-05-25',t:'Conseil de filière',h:'12 h-14 h',f:0},{d:'2027-06-29',t:'Conseil de filière élargi aux vacataires',h:'14 h-17 h',f:1},
];
const ODJ_FIXE=['Approbation du procès-verbal du 17 novembre','Informations de la direction et du Conseil élargi','Retour sur les jurys du semestre d\'automne','Semaine de tous les possibles : derniers ajustements','Divers'];
const ODJ_PROP=[{t:'Calendrier 2027-2028 : première projection',par:'Responsable',ok:1},{t:'Usage des ateliers-maquettes le week-end',par:'Kenji Rossi',ok:1},{t:'Retour des étudiant·es sur la charge du S3',par:'Représentant·es',ok:0},{t:'Prix Hans Wilsdorf 2027 : calendrier',par:'Adjoint·e',ok:1}];
const DEC=[
 ['2026-11-17','ateliers','Les choix d\'ateliers du printemps se font par Forms jusqu\'au 9 décembre ; aucune modification après publication.','CF'],
 ['2026-11-17','calendrier','La semaine du 7 juin reste sans jury pour laisser place au workshop PULSE.','CF'],
 ['2026-10-27','stages','Les intentions de stage sont annoncées par formulaire, plus par courriel.','CF'],
 ['2026-10-06','jma','Le cours à option « Intérieurs en transition » est maintenu le jeudi pour rester compatible avec les MAIA.','CM'],
 ['2026-09-29','budget','Les budgets d\'ateliers du printemps sont annoncés avant le 15 janvier.','CF'],
 ['2026-06-30','evaluation','Les retours de la séance de feedback sont présentés au Conseil suivant.','CF'],
 ['2026-03-03','mobilite','Le nombre d\'IN au BA est plafonné à six par semestre.','CF'],
 ['2026-03-10','jma','Les notes du séminaire de janvier sont demandées aux sites dès la fin du séminaire.','CM'],
 ['2025-11-18','ateliers','Pas plus de deux passages dans le même atelier, premier semestre exclu.','CF'],
 ['2025-10-07','evaluation','Suivi des objectifs de l\'évaluation du Master une fois par an.','CM'],
 ['2025-05-27','stages','Les conventions de l\'automne doivent être signées fin juin.','CF'],
 ['2025-03-04','calendrier','Les Conseils de filière se tiennent le mardi de 12 h à 14 h.','CF'],
 ['2024-11-19','ateliers','Le stage peut remplacer un atelier BA de 9 crédits.','CF'],
 ['2024-06-25','evaluation','Les modèles de syllabus sont refondus pour 2024-2025.','CF'],
 ['2023-09-26','outils','Formation Moodle pour les enseignant·es.','CF'],
];

/* ---------- Qualité (fiches 3.6, 3.7) : fictif ---------- */
const FB={sem:['SA 22','SP 23','SA 23','SP 24','SA 24','SP 25','SA 25','SP 26','SA 26'],
 themes:[['Charge de travail',[-1,-1,-2,-1,-2,-1,-1,0,-1]],['Clarté des consignes',[0,0,1,1,1,1,2,1,2]],['Chevauchements de calendrier',[-2,-1,-1,-2,-1,-1,0,0,0]],['Ateliers-maquettes et matériel',[1,0,0,-1,-1,0,1,1,1]],['Encadrement en atelier',[1,1,2,1,1,2,1,2,2]],['Retours des jurys',[0,-1,0,0,1,0,1,1,1]],['Communication administrative',[-1,-1,-1,0,0,0,1,1,1]],['Espaces de travail',[-1,-2,-1,-1,0,0,-1,0,0]]],
 actions:{'Chevauchements de calendrier':['SA 25','Calendrier maître et contrôle des conflits'],'Communication administrative':['SA 25','Courriels de rentrée unifiés'],'Clarté des consignes':['SA 24','Nouveaux modèles de syllabus']},
 eee:[['SA 24',18],['SP 25',14],['SA 25',16],['SP 26',12],['SA 26',15]]};
const IND=[
 {l:'Syllabi conformes à la fiche module',u:'%',base:62,now:85,cible:95},
 {l:'Diplômé·es en emploi ou en formation à un an',u:'%',base:71,now:78,cible:85},
 {l:'Étudiant·es BA en mobilité OUT par volée',u:'%',base:9,now:14,cible:20},
 {l:'Étudiant·es avec un stage pendant le cursus',u:'%',base:12,now:24,cible:30},
 {l:'Participation aux évaluations (EEE)',u:'%',base:22,now:15,cible:35},
];

/* ---------- Veille Teams (fiche 7.2) : fictif ---------- */
const TEAMS=[
 ['EVA - Espace virtuel des adjoint·es','Nouveau tableau des échéances du printemps 2027 déposé','2026-12-03','échéancier'],
 ['Séances de fin de semestre','Délai de saisie des notes d\'automne : 22 janvier, 17 h','2026-12-02','enseignement'],
 ['Relations internationales','Tableau des IN du printemps 2027 mis à jour (11 noms)','2026-12-01','mobilités'],
 ['Conseil de direction','Documents du Conseil élargi du 15 décembre en ligne','2026-11-30','instances'],
 ['Rentrée des classes','Trombinoscopes de l\'automne archivés','2026-11-26','étudiant·es'],
];

JURY.BA.cand=ST.filter(s=>s.diplome).length;JURY.MA.cand=ST.filter(s=>s.coh==='MA2'&&s.statut!=='Stage').length;
window.DATA={MS,E,DOM,OPEN_LATE,PEOPLE,ATB,COH,ST,IN,MOIS,BUD,STAGES,ENG,BC,MSTEPS,MAND,SYL,COHER,MODNOTES,JMA,MOB,CITY,BUREAUX,EVT,REPRISE,SDTP,SDTP_STEPS,PRIX,LAUREATS,JURY,CONS,ODJ_FIXE,ODJ_PROP,DEC,FB,IND,TEAMS};
})();
