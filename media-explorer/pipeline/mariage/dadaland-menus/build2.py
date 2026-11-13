import json
BASE = ("Studio product photograph, top-down, of one single tall narrow vertical menu card, very elongated proportion of 10 by 21 centimetres, lying flat and centred on a pale warm grey linen tablecloth, soft even daylight, the whole card visible with margin around it. "
"The card is thick uncoated deep burgundy cotton paper, colour sang-de-boeuf #560002. "
"The only printing is hot-foil stamping in two flat layers: underneath, a fish in flat opaque matte white foil; on top, a lamb in flat bright silver metallic foil, printed over the white and fully opaque where they overlap. "
"Each foil is one perfectly uniform solid area with crisp sharp edges and a slight debossed relief in the paper. "
"The artwork is sophisticated contemporary graphic design for adults, expressive, sharp and bold, the kind of image an independent design studio would print on a poster; strong contrast between the two layers and the burgundy. The card carries no lettering. ")
P = {
"s01_pinceau": "Style: gestural black-ink brush painting translated into foil, sumi-e energy. The white fish is one huge fast diagonal brushstroke with split dry-brush edges, running the full height of the card; the silver lamb is a few violent brush gestures thrown across it, the strokes of the two animals crossing and tangling.",
"s02_bauhaus": "Style: Bauhaus and Swiss modernist geometry. Both animals are constructed only from circles, half-circles, quarter arcs, rectangles and triangles, compass-precise. The white fish is a tall vertical stack of geometric segments; the silver lamb's geometric pieces interlock into the gaps of the fish so the two figures puzzle into one tall totem.",
"s03_lanieres": "Style: Dada razor-cut collage. Both silhouettes are sliced into horizontal strips about one centimetre high; the strips alternate down the card, one strip of white fish, one strip of silver lamb, each strip slightly shifted sideways, so the two animals are woven into one sliced, glitching vertical image with thin burgundy gaps between the strips.",
"s04_ligne": "Style: one single continuous thick line per animal, drawn without lifting the pen, like a modernist line drawing. The white line draws a vertical fish, the silver line draws a lamb, and the two lines loop through each other many times, over and under, forming a tight knot in the middle of the card.",
"s05_xylo": "Style: German expressionist woodcut, Die Bruecke. Angular gouged shapes, jagged knife cuts, aggressive faceted planes, raw and dramatic. The white fish rears up vertically, mouth open; the silver lamb is twisted around its body, both carved with sharp splinter-like marks, filling the card edge to edge.",
"s06_opart": "Style: optical art. The white fish is made only of bold parallel horizontal stripes; the silver lamb is made only of bold parallel vertical stripes stamped over it; where they overlap the stripes form a woven grid. Both silhouettes are large and overlapping across the vertical card, the image vibrates.",
"s07_entrelacs": "Style: insular medieval knotwork like the Book of Kells, redrawn as a modern flat graphic. The fish's body and the lamb's body are stretched into long ribbons that braid and knot around each other down the whole height of the card, over-under interlace, with the fish head at the top and the lamb head at the bottom.",
"s08_figurefond": "Style: cut-paper poster in the manner of mid-century film title design, sharp scissor-cut edges, figure-ground play. A huge white fish fills the card vertically; inside the fish's body the silhouette of a lamb is cut out, showing burgundy, and the same lamb in silver is stamped slightly out of register beside the cut-out, overlapping the fish's edge.",
"s09_arete": "Style: precise graphic diagram. The white layer is a large fish skeleton, spine and ribs as bold clean bars, vertical, head up, filling the card; the silver lamb is a compact solid silhouette leaping through the rib cage, half in front of the bones, half hidden behind them.",
"s10_kamon": "Style: Japanese kamon family crest, perfectly balanced, sharp vector curves. A single circular emblem in the upper middle of the card: the white fish and the silver lamb curl around each other inside the circle, head to tail, their bodies wrapping like a yin and yang, below the emblem a long empty burgundy space.",
}
ops=[]
for i,(k,v) in enumerate(P.items()):
    x=(i%5)*700; y=(i//5)*900
    ops+= [{"op":"add_node","nodeType":"textPrompt","id":f"t_{k}","position":{"x":x,"y":y},"config":{"text":BASE+v}},
           {"op":"add_node","nodeType":"imageBlock","id":f"g_{k}","position":{"x":x,"y":y+350},"config":{"model":"fal-ai/nano-banana-2","aspect_ratio":"9:16","resolution":"1K"}},
           {"op":"connect_ports","source":f"t_{k}","sourceHandle":"prompt","target":f"g_{k}","targetHandle":"prompt"}]
json.dump(ops,open("ops2.json","w"),ensure_ascii=False)
