# Nouvelle structure Univers / Série / Génération du Media Explorer mariage.
# Chaque série : (titre, sous-titre ou None pour garder celui d'origine, membres, type de schéma par défaut)
# membres : liste de (ancien code, plage de numéros d'origine 'a-b' ou None pour toute la série)
# Les séries P24 à P29 sont découpées par direction graphique (une direction = une série).
import json
DIR = json.load(open('/home/claude/restruct/directions.json'))
P27 = ["Faïence de Bresse", "Découpage suisse", "Boîte de camembert", "Imagerie d'Épinal", "Affiche de voyage",
       "Vitrail", "Point de croix", "Papiers découpés", "Sérigraphie irisée", "Direction 10"]

U = {
    1: dict(code='U1', title='Panneaux mariage', ratio='3/4', project='Mariage'),
    2: dict(code='U2', title='Menus mariage', ratio='266/559', project='Mariage',
            lede="Menus du dîner, carton 10 × 21 cm bordeaux. Le saumon en dorure blanche, l'agneau en dorure argent par-dessus. Toutes les propositions générées sur Dadaland, série par série."),
    3: dict(code='U3', title="Mises en situation orangerie", ratio='16/10', project='Mariage'),
}

def r(a, b): return f'{a:02d}-{b:02d}'

S1 = [
    ("Affiches de film en patois", None, [('P01', None)], 'gen'),
    ("Peinture flamande, premiers essais", "26 oct. · Nano Banana Pro · huile façon Bruegel et Bosch sur panneau de chêne, puis photographies de tableau vieilli", [('P02', r(1, 6))], 'gen'),
    ("Essais de styles isolés", "26 oct. · Nano Banana Pro · une image par style sur la même scène : photo de cinéma, Bruegel, Bosch nocturne, huile Renaissance, ténébrisme, gravure coloriée, risographie, photomontage dada, bichromie, studio de mode, dessin à la plume, sérigraphie de concert", [('P02', r(7, 18))], 'gen'),
    ("Photographie éditoriale, tableaux vivants", "26 oct. · Nano Banana Pro · photographie de mode et tableau vivant façon Renaissance, Caravage, vanité, Bosch", [('P02', r(19, 21)), ('P04', r(1, 4))], 'gen'),
    ("Calque typographique vermillon sur peinture", None, [('P03', None)], 'title'),
    ("Calque titre sur photographies éditoriales", "26 oct. · Nano Banana Pro · photographie gardée, titre vermillon posé dessus", [('P04', r(5, 10))], 'title'),
    ("Studio éditorial, personnages humains", "26 oct. · Nano Banana Pro · studio, toile peinte sur châssis, accessoires au sol, personnages costumés", [('P05', r(1, 8))], 'ref'),
    ("Studio éditorial, créatures", "26 oct. · Nano Banana Pro · même studio et même toile peinte, personnages en créatures", [('P05', r(9, 18))], 'ref'),
    ("Studio éditorial humains, titres vermillon", "26 oct. · Nano Banana Pro · calque titre vermillon sur la série studio humaine", [('P06', r(1, 9))], 'title'),
    ("Studio éditorial créatures, titres vermillon", "26 oct. · Nano Banana Pro · calque titre vermillon sur la série studio créatures", [('P06', r(10, 17))], 'title'),
    ("Créatures, toile peinte façon Bruegel", None, [('P07', None)], 'ref'),
    ("Créatures, titres vermillon", None, [('P08', None)], 'title'),
    ("Palette mariage, toiles Genève et Bresse", None, [('P09', None)], 'edit'),
    ("Titre AS Château, essais", None, [('P10', None)], 'title'),
    ("Gouache, style Lou Benesch", None, [('P11', None)], 'ref'),
    ("Gouache, essais Sunburst", None, [('P12', None)], 'ref'),
    ("Caravage, quatre peintures", "Nano Banana Pro · quatre compositions repeintes en ténébrisme, sans titre", [('P13', r(1, 4))], 'edit'),
    ("Caravage, titre AS Château", "Nano Banana Pro · titre AS Château bleu ciel intégré et numéro romain sur les quatre peintures", [('P13', r(5, 8))], 'title'),
    ("Caravage v2, compositions repensées", "Nano Banana Pro 4K · huit chimères, peinture seule", [('P14', r(1, 8))], 'gen'),
    ("Caravage v2, titre gothique", "Nano Banana Pro 4K · titre gothique intégré sur les huit peintures", [('P14', r(9, 16))], 'title'),
    ("Caravage et La Tour, huit chimères", "Nano Banana Pro 4K · huit chimères, peinture seule", [('P15', r(1, 8))], 'gen'),
    ("Caravage et La Tour, titre gothique", "Nano Banana Pro 4K · titre gothique intégré sur les huit peintures", [('P15', r(9, 16))], 'title'),
    ("Douze chimères, passe A corrections", "Nano Banana Pro 4K · reprise haute définition des douze photographies, corrections", [('P16', r(1, 12))], 'edit'),
    ("Douze chimères, passe B titre AS Château", "Nano Banana Pro 4K · titre AS Château posé sur la passe A", [('P16', r(13, 24))], 'title'),
    ("Éditorial (style Sissi)", None, [('P17', None)], 'gen'),
    ("Peinture brodée (style Licorne)", None, [('P18', None)], 'gen'),
    ("Graphique héraldique", None, [('P19', None)], 'gen'),
    ("Papier découpé", None, [('P20', None)], 'gen'),
    ("Flat contemporain contorsionné", None, [('P21', None)], 'gen'),
    ("Pop dégradé et grain", None, [('P22', None)], 'gen'),
    ("Aérographe grain", None, [('P23', None)], 'gen'),
]
# 14 directions : même prompt passé dans Nano Banana Pro (ancienne P24) puis GPT Image 2.5 Flare (ancienne P25)
for k, name in enumerate(DIR['P24']):
    a = 3 * k + 1
    S1.append((name, f"Direction {k+1:02d} sur 14, titre monumental entrelacé · même prompt dans Nano Banana Pro (G1 à G3) puis GPT Image 2.5 Flare (G4 à G6)",
               [('P24', r(a, a + 2)), ('P25', r(a, a + 2))], 'gen'))
for k, name in enumerate(DIR['P26']):
    a = 3 * k + 1
    S1.append((name, f"Direction {k+1:02d} sur 14 du deuxième lot d'après les références · GPT Image 2.5 Flare", [('P26', r(a, a + 2))], 'gen'))
for k, name in enumerate(P27):
    a = 3 * k + 1
    S1.append((name if name != 'Direction 10' else 'Proposition libre 10', f"Proposition libre {k+1:02d} sur 10, une chimère habillée, gothique redessiné dans le style · GPT Image 2.5 Flare", [('P27', r(a, a + 2))], 'gen'))
for k, name in enumerate(DIR['P28']):
    a = 3 * k + 1
    S1.append((name, f"Direction design mature {k+1:02d} sur 10, graphisme contemporain épuré · GPT Image 2.5 Flare", [('P28', r(a, a + 2))], 'gen'))
for k, name in enumerate(DIR['P29']):
    a = 3 * k + 1
    S1.append((name, f"Direction dense {k+1:02d} sur 10, horror vacui, rempli bord à bord · GPT Image 2.5 Flare", [('P29', r(a, a + 2))], 'gen'))
S1 += [
    ("Peinture douce naïve", None, [('P30', None)], 'gen'),
    ("Pastel fantastique contemporain", None, [('P31', None)], 'gen'),
    ("Style menu, blanc sur bleu ciel", None, [('P32', None)], 'ref'),
    ("Gouache recolorée, palette mariage", None, [('P34', None)], 'edit'),
    ("Série hybride cadre A, gouache", None, [('P35', None)], 'ref'),
    ("Série hybride cadre B, linogravure blanche", None, [('P36', None)], 'ref'),
    ("Série hybride « Lutte » A, gouache", None, [('P38', None)], 'ref'),
    ("Série hybride « Lutte » B, linogravure blanche", None, [('P39', None)], 'ref'),
    ("Gouache en palette, 16 chimères métier", None, [('P40', None)], 'ref'),
    ("Batch canonique 8, linogravure taillée", None, [('P41', None)], 'ref'),
    ("Batch canonique 8, gouache en palette", None, [('P42', None)], 'ref'),
    ("Batch canonique 8, aquarelle et compositions réinventées", None, [('P43', None)], 'ref'),
    ("Batch canonique 8, aquarelle, planche remplie", None, [('P44', None)], 'ref'),
    ("Batch canonique 8, workflow gouache d'origine", None, [('P45', None)], 'ref'),
    ("Matrice 8, style réfs A4", None, [('P46', None)], 'canvas'),
    ("Matrice 8, gouache plate", None, [('P47', None)], 'canvas'),
    ("Matrice 8, linogravure", None, [('P48', None)], 'canvas'),
    ("Matrice 8, réfs A4 avec ornements", None, [('P49', None)], 'canvas'),
    ("L'Herboriste au lièvre, trois styles", None, [('P50', None)], 'canvas'),
    ("I L'Herboriste, quatre compositions en scène", None, [('P51', None)], 'canvas'),
    ("I L'Herboriste, quatre compositions décalées", None, [('P52', None)], 'canvas'),
    ("Batch final · I L'Herboriste", None, [('P53', None)], 'canvas'),
    ("Batch final · II Le Chevalier", None, [('P54', None)], 'canvas'),
    ("Batch final · III Le Héraut", None, [('P55', None)], 'canvas'),
    ("Batch final · IV La Conteuse", None, [('P56', None)], 'canvas'),
    ("Batch final · V La Dame du Lac", None, [('P57', None)], 'canvas'),
    ("Batch final · VI Le Bateleur", None, [('P58', None)], 'canvas'),
    ("Batch final · VII Le Troubadour", None, [('P59', None)], 'canvas'),
    ("Batch final · VIII La Châtelaine", None, [('P60', None)], 'canvas'),
    ("II Le Chevalier cabré", None, [('P61', None)], 'canvas'),
    ("V La Dame du Lac, tête en bas", None, [('P62', None)], 'canvas'),
    ("VI Le Bateleur, tête en bas", None, [('P63', None)], 'canvas'),
    ("VI Le Bateleur, sur les mains", None, [('P64', None)], 'canvas'),
    ("IV La Conteuse, quatre visages", None, [('P65', None)], 'edit'),
    ("V La Dame du Lac, quatre visages", None, [('P66', None)], 'edit'),
    ("Sélection finale, passe décor et corrections", None, [('P67', None)], 'edit'),
    ("Sélection finale, sujets flottants", None, [('P68', None)], 'edit'),
    ("IV La Conteuse en centaure inversé", None, [('P69', None)], 'ref'),
    ("IV La Conteuse licorne, version plus mature", None, [('P70', None)], 'edit'),
    ("IV La Conteuse en pégase licorne", None, [('P71', None)], 'ref'),
    ("V La Dame du Lac, l'anneau au fond du lac", None, [('P72', None)], 'edit'),
    ("V La Dame du Lac, plongée vers l'anneau", None, [('P73', None)], 'canvas'),
    ("V La Dame du Lac, la cueillette de l'anneau avec décors", None, [('P74', None)], 'edit'),
    ("III Le Héraut flottant, bras corrigés en édition", None, [('P75', None)], 'edit'),
    ("III Le Héraut flottant, régénéré", None, [('P76', None)], 'canvas'),
    ("IV La Conteuse en pégase licorne, bottes d'équitation", None, [('P77', None)], 'ref'),
    ("IV La Conteuse assise, livre ouvert", None, [('P78', None)], 'ref'),
    ("IV La Conteuse, pile basse, ailes déployées", None, [('P79', None)], 'canvas'),
]
S2 = [(None, None, [(f'V{k}', None)], None) for k in range(1, 11)]
S3 = [(None, None, [('P33', None)], 'render'), (None, None, [('P37', None)], 'render')]
SPEC = {1: S1, 2: S2, 3: S3}
