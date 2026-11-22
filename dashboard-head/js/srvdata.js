/* Arborescence du serveur ARCHI, d'après le guide de passation de novembre 2026.
   n(id, nom tel que sur le serveur, parent, options)
   p : page du guide · u : rythme d'usage lu dans le guide (f fréquent, s saisonnier, r référence, a archive, v vide)
   w : qui y travaille selon le guide · d : ce qu'on y trouve · f : fichiers et sous-dossiers nommés par le guide
   m : module de la plateforme qui s'en sert · q : emplacement déduit de l'ordre du guide, à vérifier sur ARCHI
   x : dossier exclu de l'index de l'agent (données sensibles) */
(function(){
const T=[];const n=(id,l,pa,o={})=>T.push(Object.assign({id,l,pa},o));
n('root','ARCHI',null,{p:2,d:'Serveur de la filière. Les premiers niveaux suivent le plan de classement commun demandé par la HES-SO, mis en place il y a environ un an ; les sous-dossiers suivent les processus internes de la filière.'});
n('atl','ATELIERS','root',{p:3,u:'s',w:'Assistant·es d\'atelier',d:'Archives des ateliers déposées à chaque fin de semestre : travaux des étudiant·es, photographies, évaluations et notes. L\'archivage doit permettre à quelqu\'un qui n\'a pas suivi l\'atelier de retrouver l\'essentiel.'});
n('atl_ma','1 MASTER','atl',{p:3,u:'s',d:'Archives du Master, classées par semestre.'});
n('atl_ba','2 BACHELOR','atl',{p:3,u:'s',d:'Archives du Bachelor, classées par atelier.'});
n('atl_ms','MARCHE A SUIVRE / ARCHIVAGE','atl',{p:3,u:'s',w:'Adjoint·e',d:'Procédure d\'archivage. L\'adjoint·e la rappelle aux responsables et aux assistant·es d\'atelier à chaque fin de semestre et vérifie que chaque atelier a tout déposé.'});
n('adm','ADMINISTRATION','root',{p:3,w:'Adjoint·e, secrétariat, assistant·e de filière',d:'Gestion du Bachelor et du Master en architecture d\'intérieur.'});

n('s00','00 – SIGNATAIRE','adm',{p:4,u:'f',w:'Adjoint·e, secrétariat',m:'engagements',d:'Échanges de documents entre l\'adjoint·e et le secrétariat. Le secrétariat y dépose les pièces à signer ; l\'adjoint·e les classe une fois signées et ajoute le numéro.',f:['Suivi DE_VdL-LUCIE 2026-2027 (engagements des vacataires)']});
n('s00a','À signer','s00',{p:5,u:'f',w:'Secrétariat',m:'engagements',d:'Demandes d\'engagement et bons de commande déposés par le secrétariat, qui prévient l\'adjoint·e.'});
n('s00b','Signé','s00',{p:5,u:'f',w:'Adjoint·e',m:'engagements',d:'Pièces signées, avec le numéro de demande ou de bon de commande. Le secrétariat en classe ensuite les PDF sur le serveur N.'});

n('s01','01 – DIRECTION ET PILOTAGE','adm',{p:6,d:'Pilotage de la filière : plan de classement, passation, évaluations, instances, événements, plan d\'études-cadre, voyages.'});
n('s01a','0_PLAN DE CLASSEMENT','s01',{p:6,u:'r',d:'Passage de l\'ancienne arborescence à la nouvelle. Utile pour retrouver un document ancien ou comprendre la logique actuelle.'});
n('s01b','AIDE MÉMOIRE - CHECK LIST - PASSATION','s01',{p:6,u:'r',d:'Documents pour une personne qui arrive dans la filière, datés de novembre 2026.',f:['AIDE MÉMOIRE','CHECK-LIST','GUIDE DE PASSATION']});
n('s01c','AUTOÉVALUATION DE LA FILIÈRE','s01',{p:6,u:'r',m:'qualite',d:'Évaluations du Bachelor (2022) et du Master (2025). La prochaine évaluation demandera les résultats obtenus au regard de leurs objectifs.'});
n('s01d','CONSEIL DE DIRECTION ET ASSEMBLÉE GÉNÉRALE','s01',{p:6,u:'s',d:'Dossiers des instances de direction et projets transversaux confiés au département : durabilité, employabilité, autres dossiers ponctuels.'});
n('s01e','EVENEMENTS / PROJETS ECOLE','s01',{p:7,u:'s',m:'evenements',d:'Dossier particulièrement volumineux : événements organisés ou suivis par la filière. Pour une nouvelle édition, partir du dossier de l\'année précédente.',f:['DESIGN DAYS OU DESIGN SATURDAY','DÉFILÉ','MILANO DESIGN WEEK','PORTES OUVERTES','EXPOSITIONS DE FIN DE SEMESTRE ET DE DIPLÔME']});
n('s01e1','EXPOSITIONS DE FIN DE SEMESTRE - JURYS','s01e',{p:7,u:'s',w:'Adjoint·e, assistant·e de filière',m:'jurys',d:'Dates des jurys de juin, vernissage, demande d\'apéritif, scénographie, cartels, prises de vues avec la communication. Le choix des membres du jury est validé par la direction.'});
n('s01e2','PORTES OUVERTES','s01e',{p:8,u:'s',m:'evenements',d:'Présentations des ateliers (BA au 1er, Master au 4e), installations prêtes le samedi à 10 h, portfolio reviews des 1re année.'});
n('s01f','FILIÈRE AI','s01',{p:10,u:'f',w:'Adjoint·e',m:'equipe',d:'Documents généraux de la filière, dont l\'organigramme, à mettre à jour au début de chaque année académique.',f:['Organigramme']});
n('s01f1','RÉUNIONS DE FILIÈRE','s01f',{p:10,u:'f',w:'Adjoint·e (ordres du jour), secrétariat (procès-verbaux)',m:'conseils',d:'Sept Conseils de filière par an, le mardi de 12 h à 14 h, salle Barthélémy Menn. Le dernier, en fin d\'année, invite aussi les vacataires réguliers.',f:['pv template.docx','Procédure Conseil Filière.docx']});
n('s01g','PLAN D\'ÉTUDES-CADRE (PEC)','s01',{p:11,u:'r',d:'Plan d\'études-cadre de 2024 pour le Bachelor et le Master : versions, documents de travail, retours de la HES-SO, versions validées. À réviser seulement quand les cursus évoluent.'});
n('s01h','PEC_INTEGRATION FM','s01',{p:11,u:'r',m:'enseignement',d:'Mise en cohérence des fiches modules avec les compétences du PEC (2025-2026), révisées pour la rentrée 2026-2027. À refaire en cas de révision du PEC ou de nouveaux modules.'});
n('s01i','SUPSI','s01',{p:11,u:'r',d:'Évaluation du Bachelor en architecture d\'intérieur de la SUPSI (novembre 2025), présidée par Valentina De Luigi. Document de comparaison.'});
n('s01j','VOYAGES','s01',{p:11,u:'s',d:'Voyages d\'études et déplacements professionnels de l\'année, avec les formulaires et le bilan carbone. Une copie des demandes signées est sur le serveur N.'});
n('s01k','VSI.ASAI','s01',{p:12,u:'r',d:'Association suisse des architectes d\'intérieur et Archives d\'architecture d\'intérieur (ai-s) : correspondance, séances, cotisations. Représentation au comité reprise par Simon Husslein dès décembre 2026, à titre transitoire.'});

n('s02','02 – COMMUNICATION','adm',{p:13,d:'Documents, contacts, images et supports de communication de la filière.'});
n('s02a','ALUMNI','s02',{p:13,u:'r',d:'Liste à jour des diplômé·es BA AI et MAIA, petites enquêtes, parcours professionnels, collaborations.'});
n('s02b','CONTACTS','s02',{p:13,u:'f',w:'Adjoint·e',m:'equipe',d:'Principale base des intervenant·es extérieur·es. Chaque engagement signé s\'y ajoute ; une mise à jour tous les un ou deux mois évite le rattrapage de fin d\'année.',f:['Adresses AI']});
n('s02c','IMAGES','s02',{p:14,u:'s',w:'Assistant·e de filière',d:'Photothèque de la filière par année académique : une sélection des meilleures images de chaque type d\'activité.'});
['01. ATELIER BA','02. COURS BA','03. MASTER','04. WORKSHOP','05. EVENEMENTS','06. MANDATS','07. PUBLICATIONS','08. PRIX','09. REMISE DIPLOMES'].forEach((x,i)=>n('s02c'+i,x,'s02c',{p:14,u:'s',d:'Catégorie de la photothèque, dans chaque année académique.'}));
n('s02d','MIDIS ARCHI','s02',{p:14,u:'s',w:'Assistant·es',d:'Conférences des Midis Archi : marche à suivre, modèles de visuels pour les écrans, éditions passées.'});
n('s02e','WEB /COMMUNICATION','s02',{p:14,u:'r',d:'Communication numérique et échanges avec le service de communication : demandes, textes, versions validées et traductions pour le site de la HEAD.'});
n('s02e1','MAIA WEBSITE','s02e',{p:15,u:'s',q:1,d:'Site du MAIA : création, échanges avec l\'informaticien Andrea Cumbro, une ou deux factures par an à vérifier.'});
n('s02e2','PLAN DE COMMUNICATION AI','s02e',{p:15,u:'s',q:1,d:'Demandes au service de communication, une fois par semestre ou par an, et échanges avec l\'agence BAGUETTE (2025-2027).'});
n('s02e3','MODÈLES, BROCHURES ET RESSOURCES GRAPHIQUES','s02e',{p:15,u:'r',q:1,d:'Modèles de lettres à en-tête, logos MAIA, HEAD et FNS, polices Circular et Executive, éditions de la brochure du MAIA.'});

n('s10','10 – FORMATION DE BASE','adm',{p:16,d:'Principal point d\'entrée du suivi pédagogique : cours, ateliers, calendriers, étudiant·es, workshops, stages.'});
n('ba','01_BACHELOR AI','s10',{p:16,d:'Suivi du cursus du Bachelor en architecture d\'intérieur.'});
n('ba1','COURS BA AI','ba',{p:16,u:'f',d:'Cours, calendriers, fiches modules, plans d\'études, relevés de notes et workshops intégrés, classés par année et par semestre.'});
n('ba1a','ATELIERS','ba1',{p:16,u:'f',q:1,m:'ateliers',d:'Par année et par semestre : inscriptions et répartition, syllabus ou booklet, supports, demandes d\'engagement, bons de commande. Choix recueillis par Microsoft Forms.'});
n('ba1b','CALENDRIERS','ba1',{p:17,u:'s',m:'echeancier',d:'Préparés sept à huit mois avant l\'année : projections en janvier, changements majeurs avant le 15 février, projets aux enseignant·es en avril et mai.'});
n('ba1c','COURS TECHNIQUES ET THEORIQUES','ba1',{p:17,u:'s',m:'enseignement',d:'Un dossier par enseignement, avec au minimum un syllabus à jour. Syllabi demandés pour le 30 septembre et le 28 février.'});
n('ba1d','FICHES MODULES','ba1',{p:18,u:'r',d:'Révisions des fiches modules d\'une année à l\'autre et copie des versions publiées.'});
n('ba1e','KICK - OFF AI1','ba1',{p:18,u:'s',d:'Les quatre premières semaines du Bachelor. En mai ou juin, l\'adjoint·e met les enseignant·es en relation et transmet calendrier et dates de jury.'});
n('ba1f','PLAN ETUDES','ba1',{p:18,u:'r',d:'Plans d\'études ; toute modification s\'annonce avant le 15 février à la coordination des études.'});
n('ba1g','RELEVE NOTES – JURYS','ba1',{p:18,u:'s',w:'Adjoint·e',d:'Bulletins de notes de chaque semestre, en sauvegarde et en contrôle.'});
n('ba1h','WS S\'EXPRIMER EN PUBLIC','ba1',{p:18,u:'s',d:'Workshop de prise de parole avec Mariama Sylla : dates confirmées en avril au plus tard, liste des participant·es en août.'});
n('ba2','DIPLÔMES - BACHELOR','ba',{p:18,u:'s',m:'jurys',d:'Travail théorique et thèse pratique : répartition, syllabi, consignes, notes, documents et rapports de jury, un rapport par étudiant·e.'});
n('ba3','ÉTUDIANT·ES BACHELOR AI','ba',{p:19,m:'etudiants',d:'Suivi des étudiant·es du Bachelor.'});
n('ba3a','BESOINS SPÉCIFIQUES','ba3',{p:19,u:'r',x:1,d:'Copies des décisions d\'aménagement d\'études transmises à l\'adjoint·e pour information.'});
n('ba3b','ERASMUS – ECHANGES','ba3',{p:20,u:'s',m:'mobilites',d:'Étudiant·es BA IN et OUT. Candidatures IN examinées sur le français, les 30 crédits et un portfolio de niveau BA2.'});
n('ba3c','CESSION DE DROITS MANDATS','ba3',{p:20,u:'s',w:'Adjoint·e, secrétariat',m:'etudiants',d:'Contrats que signent les nouvelles et nouveaux étudiant·es. L\'adjoint·e prépare en septembre la liste Excel ; le secrétariat collecte et archive.'});
n('ba3d','HORIZON ACADÉMIQUE – AUDITEUR','ba3',{p:20,u:'r',d:'Auditrices et auditeurs du Bachelor. Procédure suivie par Émilie Parendeau ; l\'adjoint·e fixe leur plan d\'études.'});
n('ba3e','LISTES – TROMBINOSCOPES','ba3',{p:20,u:'s',m:'etudiants',d:'Listes semestrielles du Bureau des études, fichier SWITCH pour les enseignant·es, listes « PROJECTION » de fin d\'année.'});
n('ba3f','PROLONGATIONS D\'ÉTUDES','ba3',{p:21,u:'s',x:1,m:'etudiants',d:'Plans d\'études personnalisés par année académique. Les motifs ne sont pas indexés.'});
n('ba3g','STAGES','ba3',{p:21,u:'s',q:1,m:'mobilites',d:'Stage à la place d\'un atelier de 9 crédits : intentions début novembre ou début mars, conventions signées avant le stage.'});
n('ma','02 – MASTER AI','s10',{p:21,d:'Master en architecture d\'intérieur (MAIA) et Joint Master of Architecture. Classement par année académique.'});
n('ma0','0. Préparation du Master','ma',{p:22,u:'a',d:'Historique de la création et de la mise en place du MAIA.'});
n('ma1','01_ETUDIANTS','ma',{p:22,u:'s',m:'etudiants',d:'Par année : listes, trombinoscopes, abandons, IN et OUT, prolongations. Aucun certificat médical.'});
n('ma1a','IN-OUT','ma1',{p:22,u:'s',m:'mobilites',d:'Candidatures IN examinées sur l\'anglais et le portfolio ; rencontre des IN avant le semestre.'});
n('ma1b','LISTES','ma1',{p:23,u:'s',m:'maia',d:'Listes semestrielles, trombinoscopes et fichier « Projection », clé des inscriptions au JMA.'});
n('ma1c','PROLONGATION DES ÉTUDES','ma1',{p:23,u:'s',x:1,d:'Cursus sur trois ans ou plan personnalisé, même procédure qu\'au Bachelor.'});
n('ma2','02_CONSEILS DE MASTER','ma',{p:23,u:'s',m:'conseils',d:'Deux Conseils par an (septembre ou octobre, février ou mars). Ordre du jour envoyé une semaine avant avec le procès-verbal précédent.'});
n('ma3','2026-2027','ma',{p:24,u:'f',d:'Dossier de l\'année académique en cours.'});
n('ma3a','ATELIERS - COURS','ma3',{p:24,u:'f',q:1,m:'enseignement',d:'Syllabi, échanges, listes et consignes d\'inscription ; inscription aux ateliers MAIA à l\'automne seulement.'});
n('ma3b','BUDGET JMA','ma3',{p:24,u:'s',q:1,m:'maia',d:'Calcul semestriel de la participation du MAIA au JMA. Facture à demander en juillet et en novembre ; deux ou trois signatures.'});
n('ma3c','CALENDRIERS','ma3',{p:24,u:'s',q:1,m:'echeancier',d:'Priorité aux semaines de séminaires JMA (Robin Schori) et aux modules Formation à la recherche (Anthony Masure).'});
n('ma3d','FICHES MODULES','ma3',{p:24,u:'r',q:1,d:'Révisions des fiches modules et copie des versions publiées.'});
n('ma3e','FORMATION À LA RECHERCHE','ma3',{p:24,u:'s',q:1,d:'Modules à l\'ECAL et Junior Design Research Conference : demandes de voyage, billets commandés par le secrétariat.'});
n('ma3f','JMA','ma3',{p:25,u:'s',q:1,m:'maia',d:'Inscriptions aux séminaires et aux cours à option du Joint Master, fichier général d\'inscription.'});
n('ma3g','JMA - COURS A OPTION','ma3',{p:25,u:'s',q:1,m:'maia',d:'Cours à option donnés à la HEAD ; descriptifs préparés en juillet pour le catalogue de fin août.'});
n('ma3h','JMA – SEMINAIRES','ma3',{p:25,u:'s',q:1,m:'maia',d:'Calendriers, absences et résultats ; notes transmises à Loïc Félix pour AGE.'});
n('ma3i','MA THESIS','ma3',{p:26,u:'s',m:'jurys',d:'Thèse pratique et théorique : consignes, formulaires, échéances, jury.'});
n('ma3j','PLAN D\'ETUDES','ma3',{p:26,u:'r',q:1,d:'Plan d\'études du Master ; modification annoncée avant le 15 février.'});
n('ma3k','STAGE','ma3',{p:26,u:'s',q:1,m:'mobilites',d:'Stage de 12 crédits. Attirer l\'attention des étudiant·es hors UE sur leur permis de séjour.'});
n('ma3l','WS HEAD – CAMONDO','ma3',{p:26,u:'s',q:1,d:'Workshop avec l\'École Camondo, en alternance à Genève et à Toulon.'});
n('ma3m','WS PULSE MAIA-MADI','ma3',{p:26,u:'s',q:1,d:'Workshop commun avec le Master Design Installation, en juin 2027 avec PULSE sur l\'entrepreneuriat.'});
n('ma3n','WS S\'EXPRIMER EN PUBLIC','ma3',{p:26,u:'s',q:1,d:'Même organisation qu\'au Bachelor, liste transmise à Mariama Sylla.'});
[['ANNÉE PRÉREQUIS','Réflexion sur une année pour les personnes admises à qui certaines compétences manquent, pas mise en œuvre.'],['FICHES SOUTENANCE','Fiches des soutenances de mémoires, par année académique.'],['JMA INFO','Formations du Joint Master, équivalences notes et lettres, contacts.'],['PROTOCOLE D\'ENTENTE CAMONDO','Protocole d\'entente avec l\'École Camondo, de 2017.'],['RÈGLEMENT','Règlement du Master, inchangé depuis 2020.'],['SUPPLÉMENT AU DIPLÔME','Documents de 2021 sur le supplément au diplôme.']].forEach(([l,d],i)=>n('ma4'+i,l,'ma',{p:26,u:i===2?'r':'a',d}));
n('mdi','03 – MASTER DESIGN INSTALLATION','s10',{p:27,u:'r',d:'Quelques informations repérées par l\'adjoint·e. Le suivi est assuré par Arno Mathis et Rosario Hurtado.'});
n('s10a','FEEDBACK ETUDIANTS','s10',{p:27,u:'s',q:1,m:'qualite',d:'Deux séances par an avec les représentant·es : une heure pour le Master, deux pour le Bachelor. Elles compensent la faible participation aux EEE.'});
n('s10b','STAGE – DOCUMENTS','s10',{p:27,u:'s',q:1,m:'mobilites',d:'Modèles et consignes de stage, stages précursus, base des bureaux d\'accueil.',f:['Suivi BUREAUX STAGES BA AI MAIA']});
n('s10c','SYLLABUS ET DESCRIPTIFS MODULE','s10',{p:28,u:'s',q:1,m:'enseignement',d:'Modèles de syllabus envoyés au début de chaque semestre, refondus en 2024-2025, inchangés pour 2026-2027.'});
n('s10d','TRANSVERSALITE','s10',{p:28,u:'s',q:1,d:'Échanges avec le Bureau de la transversalité : mobilité interne, catalogue des cours transversaux.'});
n('s10e','VR AR / ARTIFICIAL INTELLIGENCE','s10',{p:28,u:'r',q:1,d:'Initiatives de la filière dans ces domaines.'});
n('s10f','WORKSHOPS','s10',{p:28,u:'s',q:1,m:'evenements',d:'Semaine inaugurale, semaines hors cadre, Semaine de tous les possibles, autres workshops, par année académique.'});
n('s10f1','SEMAINE DE TOUS LES POSSIBLES','s10f',{p:29,u:'s',m:'evenements',d:'Six workshops en février : intervenant·es contacté·es entre mai et juillet, descriptifs au Bureau de la transversalité pour le 15 octobre.'});
n('s10f2','ETAT CREDITS SHC','s10f',{p:30,u:'s',m:'etudiants',d:'Crédits obtenus en semaines hors cadre, qui remplacent les 3 ECTS de la Semaine inaugurale ou de la Semaine de tous les possibles. Étudiant·es contacté·es en août et en décembre.'});

n('s11','11 – FORMATION CONTINUE','adm',{p:31,u:'r',d:'MAS en conservation du patrimoine et muséologie, depuis 2025-2026 : enseignements et accompagnement des expositions de Master.'});
n('s12','12 – RECHERCHE APPLIQUÉE ET DÉVELOPPEMENT','adm',{p:32,d:'Activités scientifiques, publications et projets de recherche de la filière.'});
n('s12a','01_COLLOQUES – SYMPOSIUMS','s12',{p:32,u:'r',d:'Un dossier par colloque : organisation, programmes, appels, résumés, enregistrements, pièces administratives.'});
n('s12b','02_COLLOQUES PUBLICATION','s12',{p:32,u:'r',d:'Publications liées aux colloques, étapes éditoriales et versions finales.'});
n('s12c','03_PROJETS DE RECHERCHE','s12',{p:32,u:'r',d:'Projets menés ou accompagnés par la filière ; le suivi principal relève de l\'IRAD.'});
n('s12d','04_CRUISING Publication','s12',{p:33,u:'a',d:'Publication à laquelle la filière a contribué lors d\'un cours du MAIA.'});
n('s12e','05_EDITEURS','s12',{p:33,u:'r',d:'Documents et contacts de maisons d\'édition.'});
n('s12f','06_VISITING SCHOLARS','s12',{p:33,u:'a',d:'Accueil d\'une personne avec ce statut jusqu\'ici : documents administratifs et productions.'});

n('s13','13 – PRESTATIONS DE SERVICES','adm',{p:34,u:'f',w:'Adjoint·e',m:'mandats',d:'Mandats et prestations de la filière, par année académique, suivis du contrat à la clôture. Contrat et fiche budget aussi enregistrés sur le serveur N.'});
n('s13y','2026-2027','s13',{p:34,u:'f',m:'mandats',d:'Mandats en cours, tous liés à des projets pédagogiques.'});
['FCAC','GENEVA LUX','OPI-CONTRE-JOURS','SIA'].forEach((x,i)=>n('s13m'+i,x,'s13y',{p:34,u:'f',q:1,m:'mandats',d:'Mandat 2026-2027 cité par le guide.'}));

n('s14','14 – RELATIONS INTERNATIONALES','adm',{p:36,u:'r',d:'Écoles partenaires, financements, Summer Schools, mobilité du personnel. Plusieurs dossiers inactifs restent des références.'});
n('s14a','10_CAMONDO - mobilité PAT','s14',{p:36,u:'a',d:'Mobilité de l\'adjointe à Camondo en mars 2025.'});
n('s14b','12_COMITE SELECTION OUT','s14',{p:36,u:'s',m:'mobilites',d:'Documents du comité de sélection des mobilités OUT, auquel l\'adjoint·e participe.'});

n('s20','20 – SANTÉ, SÉCURITÉ ET BIEN-ÊTRE','adm',{p:37,d:'Prévention et sécurité.'});
n('s20a','CORONAVIRUS','s20',{p:37,u:'a',d:'Archive des consignes de la période de pandémie.'});
n('s20b','SST - SANTÉ ET SÉCURITÉ AU TRAVAIL','s20',{p:37,u:'r',d:'Consignes reçues, dont la formation de prévention incendie de 2025.'});
n('s21','21 – ÉGALITÉ DES CHANCES','adm',{p:38,u:'r',d:'Mémos des services à contacter pour une question de santé mentale, à vérifier périodiquement.'});
n('s21a','HEAD INCLUSIVE','s21',{p:38,u:'r',d:'Dispositifs et pratiques favorisant l\'inclusivité à l\'école.'});

n('s22','22 – AFFAIRES ÉTUDIANTES HORS CURSUS','adm',{p:39,d:'Admissions, prix et bourses, courriels de début et de fin de semestre.'});
n('s22a','ADMISSIONS - BACHELOR ET MASTER','s22',{p:39,u:'s',w:'Adjoint·e (coordination)',d:'Un dossier par année. L\'adjoint·e coordonne sans siéger dans les commissions et transmet les résultats au Bureau des études.'});
n('s22a1','01_BA','s22a',{p:39,u:'s',d:'Admissions du Bachelor : commissions, épreuve de création, premier et deuxième tours.'});
n('s22a2','02_MA','s22a',{p:39,u:'s',d:'Admissions du MAIA : commissions, premier et deuxième tours.'});
n('s22b','MOODLE','s22',{p:40,u:'a',d:'Formation des enseignant·es à Moodle en 2023.'});
n('s22c','PRIX – BOURSES','s22',{p:40,u:'s',m:'evenements',d:'Prix et aides pour les étudiant·es et les alumni.'});
n('s22c1','PRIX RÉCURRENTS','s22c',{p:41,u:'s',m:'evenements',d:'Prix qui reviennent chaque année.'});
n('s22c1a','PRIX TEO JAKOB','s22c1',{p:41,u:'s',d:'Pour un diplôme de Bachelor.'});
n('s22c1b','PRIX VSI_ASAI','s22c1',{p:41,u:'s',d:'Prix d\'encouragement pour les diplômes BA et Master.'});
n('s22c1c','PRIX ART ET HUMANITE','s22c1',{p:41,u:'s',d:'La filière propose des diplômé·es quand elle est sollicitée.'});
n('s22c2','PRIX DE LA FONDATION HANS WILSDORF','s22c',{p:41,u:'s',m:'evenements',d:'Tournus entre diplômes depuis 2025. Pour 2027 : séance en mai, manifestations d\'intérêt vers le 15 mai, dossiers avancés le 30 juin.'});
n('s22d','RENTREE','s22',{p:41,u:'s',w:'Adjoint·e',d:'Courriels de début et de fin de semestre, par année : ils servent de gabarits.'});
n('s22d1','PRESENTATIONS RENTREE','s22d',{p:42,u:'s',d:'Présentations du Bachelor et du Master par le responsable de filière.'});
n('s22d2','WELCOME WEEK – VISITES D\'ATELIERS','s22d',{p:42,u:'s',d:'Semaine d\'accueil, coordonnée par le Bureau de la programmation.'});
n('s23','23 – SERVICE D\'INFORMATION DOCUMENTAIRE','adm',{p:43,u:'v',d:'Existe dans l\'arborescence ; aucun document de la filière.'});

n('s30','30 – RESSOURCES HUMAINES','adm',{p:44,d:'Professeur·es, assistant·es, vacataires ; recrutement, évaluation des cours, candidatures spontanées.'});
n('s30a','01_PROFESSEUR-ES','s30',{p:44,u:'r',x:1,d:'Dossiers des professeur·es, dont les feuilles de charge.'});
n('s30a1','02_FEUILLE DE CHARGE','s30a',{p:44,u:'s',m:'equipe',d:'Données des feuilles de charge, vérifiées et complétées chaque année.',f:['Calcul et liste']});
n('s30a2','04_MISES A CONCOURS / PROFESSEUR-ES INVITE-ES','s30a',{p:44,u:'r',d:'Mises au concours et engagements de professeur·es invité·es, comme références.'});
n('s30b','02_ASSISTANT-ES','s30',{p:44,u:'s',m:'equipe',d:'Accueil, suivi et évaluation des assistant·es.'});
[['01_MAIL DE DÉBUT – CHECKLIST','Liste de contrôle pour l\'arrivée d\'un·e assistant·e.'],['01a_LISTE TACHE ASS. FILIERE','Tâches établies à la passation du poste d\'assistante de filière, septembre 2026.'],['02_ASSISTANT-ES EN POSTE','Un dossier de suivi par assistant·e en fonction.',1],['03_CAHIER DES CHARGES','Missions et responsabilités des assistant·es.'],['04_EEDP','Entretiens annuels d\'évaluation, transmis aux RH pour le renouvellement des contrats.',1],['05_FEUILLES DE CHARGES','Feuilles de charge présentées à chaque assistant·e en début d\'année.'],['10_CONCOURS','Mises au concours des postes d\'assistant·es.'],['99_ARCHIVES ASSISTANTS','Dossiers des ancien·nes assistant·es, transférés en fin d\'année.',1]].forEach(([l,d,x],i)=>n('s30b'+i,l,'s30b',{p:45,u:i===7?'a':i===5?'s':'r',d,x,m:i===5?'equipe':undefined}));
n('s30c','03_VACATAIRES','s30',{p:45,u:'f',m:'engagements',d:'Liste des vacataires prévus dans l\'année, base du budget et des demandes d\'engagement ; à tenir à jour à chaque changement.',f:['Vacataires SA-SP 2026-2027']});
n('s30d','07_EEE- ÉVALUATION DES COURS AI','s30',{p:46,u:'s',m:'qualite',d:'Cours évalués chaque semestre ; listes du Bureau des études à contrôler et valider.'});
n('s30e','08_OFFRES SPONTANÉES','s30',{p:46,u:'r',d:'Candidatures reçues par la filière, à consulter quand un besoin se présente.'});

n('s31','31 – RESSOURCES FINANCIÈRES','adm',{p:47,d:'Préparation et suivi des budgets, nouvelles procédures financières.'});
n('s31a','BUDGET AI','s31',{p:47,u:'f',w:'Adjoint·e',m:'budget',d:'Classé par année civile. Les deux fichiers de prévision s\'actualisent à partir des bons de commande, des engagements et des autres dépenses.',f:['2026_Prévisions budget Bachelor AI','2026_Prévisions budget Master AI','01_Taux 2026']});
n('s31a1','Augmentations – changements de taux','s31a',{p:48,u:'r',d:'Changements de taux en cours d\'année, enseignant·es et assistant·es.'});
n('s31a2','Budget ateliers','s31a',{p:48,u:'s',m:'budget',d:'Courriels qui annoncent leur budget aux responsables d\'atelier, chaque semestre.'});
n('s31b','PO – NOUVELLE PROCÉDURE','s31',{p:48,u:'r',d:'Projet pilote des bons de commande (Purchase Orders) depuis septembre 2024.'});

n('s32','32 – RESSOURCES IMMOBILIÈRES','adm',{p:49,d:'Locaux, demandes d\'acquisition, matériauthèque.'});
n('s32a','BÂTIMENTS','s32',{p:49,u:'r',d:'Plans, règles d\'utilisation, documents des transformations, dont la surélévation.'});
n('s32a1','DÉPARTEMENT AI','s32a',{p:49,u:'f',d:'L\'un des dossiers les plus utilisés : cartels de portes et plans de répartition des ateliers, à actualiser chaque semestre.'});
n('s32a2','RÈGLES DU BÂTIMENT H','s32a',{p:49,u:'s',d:'Règles de 2026, transmises aux étudiant·es au moins à chaque rentrée.'});
n('s32a3','STUDIO PHOTO H','s32a',{p:50,u:'r',d:'Équipement et achats du petit studio photo de la filière.'});
n('s32b','COMMISSION D\'ACHAT','s32',{p:50,u:'s',d:'Demandes soumises chaque année à la commission d\'achat et leur suite.'});
n('s32c','MATÉRIAUTHÈQUE','s32',{p:50,u:'a',d:'Création de la matériauthèque ; documents arrêtés en 2023.'});
n('s33','33 – RESSOURCES MATÉRIELLES ET IMMATÉRIELLES','adm',{p:51,d:'Pôles techniques utilisés par la filière, par pôle et par année.'});
n('s33a','PÔLE PHOTO','s33',{p:51,u:'s',d:'Formations photo des étudiant·es du MAIA ; le Bachelor a son propre cours depuis 2025-2026.'});
n('s33b','PHOTOGRAPHES EXTERNES','s33',{p:51,u:'r',d:'Coordonnées de photographes externes et guide de la photothèque.'});
n('s33c','PÔLES','s33',{p:51,u:'s',d:'Pôle matériaux : fonctionnement et consignes, à transmettre chaque semestre.'});
n('s34','34 – SYSTÈMES D\'INFORMATION','adm',{p:52,u:'v',d:'Existe dans l\'arborescence ; aucun document de la filière.'});
n('s35','35 – AFFAIRES JURIDIQUES','adm',{p:52,u:'v',d:'Existe dans l\'arborescence ; aucun document de la filière.'});
n('s99','99 - ARCHIVAGE','adm',{p:52,u:'a',d:'Éléments historiques de la filière.'});
n('s99a','ARCHIVAGE BOOKLETS ATELIERS','s99',{p:52,u:'s',w:'Assistant·e de filière',d:'Booklets d\'ateliers transmis à la bibliothèque, à compléter chaque année.'});
n('s99b','ARCHIVES Admin AI (avant 2015)','s99',{p:52,u:'a',d:'Fichiers anciens ; consulter la documentaliste avant tout tri.'});

/* hors d'ARCHI, cités par le guide */
const EXT=[
 {id:'N',l:'Serveur N de l\'école',d:'Copies PDF des pièces signées, contrats et fiches budget des mandats, tableau général des mandats, demandes de voyage signées.',to:['s00b','s13','s01j'],p:5},
 {id:'t1',l:'Teams · Relations internationales',d:'Fichiers Excel des mobilités IN et OUT de chaque semestre, gérés par le service RI.',to:['ba3b','ma1a','s14b'],p:1,m:'mobilites'},
 {id:'t2',l:'Teams · Rentrée des classes',d:'Trombinoscopes et listes d\'étudiant·es de chaque rentrée, gérés par le Bureau des études.',to:['ba3e','ma1b'],p:1,m:'etudiants'},
 {id:'t3',l:'Teams · Séances de fin de semestre',d:'Informations et échéances des séances de validation des crédits, gérées par le Bureau des études.',to:['ba1g'],p:1},
 {id:'t4',l:'Teams · EVA, espace des adjoint·es',d:'Documents partagés entre adjoint·es, référence pour le suivi des échéances.',to:['s01b'],p:1,m:'echeancier'},
 {id:'t5',l:'Teams · Conseil de direction',d:'Documents à lire avant chaque Conseil ; l\'adjoint·e participe aux conseils élargis.',to:['s01d'],p:1},
];
window.SRV={T,EXT};
})();
