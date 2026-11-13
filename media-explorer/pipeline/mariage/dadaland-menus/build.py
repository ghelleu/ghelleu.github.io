import json
BASE = ("Top-down product mockup photograph of one single tall narrow vertical menu card, very elongated proportion of 10 by 21 centimetres, lying flat and centred on a pale warm grey linen tablecloth, soft even daylight, the whole card visible with margin around it. "
"The card is thick uncoated deep burgundy cotton paper, colour sang-de-boeuf #560002. "
"The only printing on the card is hot-foil stamping in two flat layers. Layer one, underneath: a fish, stamped in flat opaque matte white foil. Layer two, on top: a lamb, stamped in flat bright silver metallic foil, printed over the white fish and fully opaque where the two overlap, so the silver hides the white there. "
"Each foil is one perfectly uniform solid area with crisp clean edges and a very slight debossed relief pressed into the paper. The drawing is made of bold, simple, flat shapes with thick strokes and a few large internal cut-outs, like a hand-carved linocut reduced to its essentials, readable from across a table. "
"Plenty of empty burgundy paper around the figures. The card surface carries no lettering at all. ")
P = {
"p01_superposition": "Composition: like a two-colour overprint poster, the white fish stands vertically, head up, filling the central two thirds of the card; the silver lamb, in side profile at a similar large scale, is placed over it with a clear offset to the right and slightly lower, so roughly half of each animal overlaps the other and both remain fully readable.",
"p02_geant": "Composition: a huge white fish crosses the whole card on a steep diagonal from bottom left to top right, its head and tail running off the card edges; a small silver lamb, lying down with folded legs, rests in the middle of the fish's body, about one quarter of the card's width.",
"p03_chimere": "Composition: one single chimera creature in vertical position. The white fish's long body and forked tail form the lower half of the card; the silver lamb's front half (head, woolly chest, front legs) is stamped over the upper part of the fish, so they read as one impossible animal, half lamb, half fish, standing upright on its tail.",
"p04_tete_beche": "Composition: like a playing card, point-symmetric and head-to-tail. The white fish runs vertically with its head pointing up; the silver lamb is drawn upside down with its head pointing down, overlapping the fish in the centre of the card; the composition reads the same when the card is turned 180 degrees.",
"p05_ajoure": "Composition: the white fish is a large solid filled silhouette, vertical, head up, centred. The silver lamb is drawn only as one thick continuous outline, open inside, standing in profile over the fish, so the white fish stays visible through the inside of the lamb's outline and the two layers interlace.",
"p06_banc": "Composition: the white layer is a loose vertical pattern of about fifteen small simple fish swimming upward, scattered over the whole card like a shoal, each a plain solid shape. Over it, one large silver lamb in side profile stands in the centre of the card, covering some of the small fish.",
"p07_heraldique": "Composition: a vertical heraldic emblem in the style of a medieval coat of arms, flat and frontal. A large white fish lies horizontally across the lower third of the card like a heraldic base; the silver lamb stands upright on it, in strict profile, one front leg raised, holding a small pennant staff. Symmetric, centred, solemn.",
"p08_decoupage": "Composition: drawn like Matisse paper cut-outs, soft organic hand-cut shapes with no outlines. The white fish is a tall vertical cut-out shape, slightly tilted; the silver lamb is a rounded cloud-like cut-out shape placed over its upper half; a few loose white seaweed-like cut-out leaves float around them.",
"p09_enroulement": "Composition: the two bodies coil around each other along the vertical axis of the card in a tall S curve. The white fish's long body winds upward from the bottom, the silver lamb's body curls downward from the top, and they cross twice, the silver passing over the white at each crossing, like two intertwined medieval marginalia creatures.",
"p10_horschamp": "Composition: a tight close-up crop. Only fragments are on the card: the white fish's large eye, gills and part of the head enter from the bottom edge, filling the lower half; the silver lamb's head and one ear enter from the top edge, looking down, overlapping the fish's head in the middle. Both animals bleed off the card edges.",
}
ops=[]
for i,(k,v) in enumerate(P.items()):
    col=i%5; row=i//5
    x=col*700; y=row*900
    ops.append({"op":"add_node","nodeType":"textPrompt","id":f"t_{k}","position":{"x":x,"y":y},"config":{"text":BASE+v}})
    ops.append({"op":"add_node","nodeType":"imageBlock","id":f"g_{k}","position":{"x":x,"y":y+350},"config":{"model":"fal-ai/nano-banana-2","aspect_ratio":"9:16","resolution":"1K"}})
    ops.append({"op":"connect_ports","source":f"t_{k}","sourceHandle":"prompt","target":f"g_{k}","targetHandle":"prompt"})
json.dump(ops,open("ops.json","w"))
print(len(ops))
