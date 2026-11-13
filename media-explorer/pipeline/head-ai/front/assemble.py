import os
HERE=os.path.dirname(os.path.abspath(__file__))
SITE=os.environ.get('SITE_DIR',os.path.expanduser('~/ghelleu.github.io'))
base=open(f'{HERE}/base.css').read();extra=open(f'{HERE}/app_extra.css').read();js=open(f'{HERE}/app.js').read()
html=f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Media Explorer · HEAD Architecture d'intérieur</title>
<meta name="description" content="Cartographie visuelle des projets de la filière architecture d'intérieur de la HEAD – Genève, Bachelor et Master, à partir des sources publiques.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap">
<style>{base}
{extra}</style>
</head>
<body>
<div class="stage" id="stage">
  <canvas id="cv"></canvas>
  <div class="gridv" id="grid" hidden></div>
  <div class="top">
    <div class="brand glass"><h1>Media <i>Explorer</i></h1><span class="sl"><b id="status"></b></span>
      <nav class="spaces" aria-label="Espaces"><a href="../">Mariage</a><a href="./" aria-current="page">HEAD · Architecture d'intérieur</a></nav></div>
    <div class="seg glass" id="gLay" role="group" aria-label="Organisation"></div>
    <div class="spacer"></div>
    <div class="tools glass"><button type="button" id="bF" aria-pressed="false">Filtres <b id="nf"></b></button><button type="button" id="bA" aria-pressed="false">Analyse</button></div>
  </div>
  <aside class="side glass" id="side" hidden data-tab="f" aria-label="Filtres et analyse">
    <div class="sh"><h2 id="stitle">Filtres</h2><button class="close" id="sclose" type="button" aria-label="Fermer" style="position:static"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="sb" id="sbody"></div>
  </aside>
  <div class="legend glass" id="legend"></div>
  <div class="dock glass">
    <div class="grp mapc">
      <span class="lab" id="spcl">Attraction</span>
      <button class="rb" id="sless" type="button" aria-label="Disperser"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
      <div class="rng"><input id="spc" type="range" min="0" max="100" step="1" aria-labelledby="spcl"></div>
      <button class="rb" id="smore" type="button" aria-label="Resserrer"><svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg></button>
      <output class="val" id="spco"></output>
      <span class="sep"></span>
      <button class="rb" id="zout" type="button" aria-label="Dézoomer"><svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg></button>
      <button class="rb" id="zfit" type="button" aria-label="Tout voir"><svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3"/></svg></button>
      <button class="rb" id="zin" type="button" aria-label="Zoomer"><svg viewBox="0 0 24 24"><path d="M6 12h12M12 6v12"/></svg></button>
    </div>
  </div>
  <div class="tip glass" id="tip" hidden></div>
  <div class="vtip glass" id="vtip" hidden></div>
  <aside class="panel glass" id="panel" hidden>
    <div class="fig"><img class="big" id="pimg" alt=""><button class="close glass" id="pclose" type="button" aria-label="Fermer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="pb" id="pbody"></div>
  </aside>
  <div class="loading" id="loading"><div class="box"><div id="ltxt"><span>Chargement de la cartographie</span><span>…</span></div><div class="bar"><i style="width:60%"></i></div></div></div>
</div>
<script>
{js}
</script>
</body>
</html>
'''
open(f'{SITE}/media-explorer/head-ai/index.html','w').write(html);print(len(html))
