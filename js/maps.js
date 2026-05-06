// ═══════════════════════════════════════════
//  maps.js — VISUAL MAP JOURNAL v4
//  Objektový model: select/move/resize, zoom/pan, image upload
// ═══════════════════════════════════════════
'use strict';

const MapEditor = (function () {

  // ── Stav modulu ────────────────────────────────────────────────────────
  let activeMapIdx = null;
  let canvas = null;
  let ctx    = null;

  let mapPage      = 0;
  const PER_PAGE  = 16;
  let thumbOpen   = {};
  let selectedMaps = new Set(); // indexy vybraných kariet

  // ── Objektový model ────────────────────────────────────────────────────
  // objects[] = pole objektov aktuálnej mapy
  // Každý objekt: { id, type, x, y, w, h, color, lineWidth, points, text, src, locked, ... }
  let objects      = [];
  let selectedId   = null;
  let selected     = new Set(); // multi-select ids
  let selectBox    = null;      // rubber-band {sx,sy,cx,cy}
  let dragState    = null;   // { mode:'move'|'resize', handle, startX, startY, origObj }
  let drawState    = null;   // { type, startX, startY, points[] }
  let nextId       = 1;

  // ── Pen buffer ─────────────────────────────────────────────────────────
  let penPoints    = [];

  // ── Zoom / Pan ─────────────────────────────────────────────────────────
  let zoom     = 1;
  let panX     = 0;
  let panY     = 0;
  let panning  = false;
  let panStart = null;
  let spaceDown = false;

  // ── Tool / style ───────────────────────────────────────────────────────
  let tool      = 'select';
  let color     = '#d4a843';
  let lineWidth = 3;
  let gridType  = 'none';

  // ── Undo ───────────────────────────────────────────────────────────────
  const undoStacks = {};
  const MAX_UNDO   = 30;

  // ── Helpers ────────────────────────────────────────────────────────────
  function getMaps() { if (!data.maps) data.maps = []; return data.maps; }
  function getActiveMap() {
    const m = getMaps();
    return (activeMapIdx !== null && activeMapIdx < m.length) ? m[activeMapIdx] : null;
  }
  function genId() { return nextId++; }
  function formatDate(iso) {
    try { return new Date(iso).toLocaleDateString('sk-SK',{day:'2-digit',month:'2-digit',year:'numeric'}); }
    catch { return ''; }
  }

  // ── Sub-tab ────────────────────────────────────────────────────────────
  function switchNotesSubTab(tab) {
    ['notes','maps'].forEach(t => {
      const c = document.getElementById('ntab-content-'+t);
      const b = document.getElementById('ntab-'+t);
      if (c) c.style.display = t===tab?'':'none';
      if (b) b.className = t===tab?'btn btn-primary btn-sm':'btn btn-silver btn-sm';
    });
    if (tab==='maps') { renderMapList(); if (activeMapIdx!==null) openMapEditor(activeMapIdx); }
  }
  window.switchNotesSubTab = switchNotesSubTab;

  // ══════════════════════════════════════════════════════════════════════
  //  MULTI-SELECT KARIET
  // ══════════════════════════════════════════════════════════════════════
  function toggleMapSelect(i, e) {
    e.stopPropagation();
    if (selectedMaps.has(i)) selectedMaps.delete(i);
    else selectedMaps.add(i);
    renderMapList();
    renderMapSelectBar();
  }
  window.toggleMapCardSelect = toggleMapSelect;

  function selectAllMaps() {
    const maps = getMaps();
    const q = (document.getElementById('mapSearch')?.value||'').toLowerCase();
    getMaps().map((m,i)=>({m,i}))
      .filter(({m})=>!q||(m.name||'').toLowerCase().includes(q)||(m.session||'').toLowerCase().includes(q))
      .forEach(({i})=>selectedMaps.add(i));
    renderMapList(); renderMapSelectBar();
  }
  window.selectAllMaps = selectAllMaps;

  function clearMapSelection() {
    selectedMaps.clear(); renderMapList(); renderMapSelectBar();
  }
  window.clearMapSelection = clearMapSelection;

  function deleteSelectedMaps() {
    if (selectedMaps.size===0) return;
    if (!confirm(`Delete ${selectedMaps.size} maps?`)) return;
    // Zoraď zostupne aby splice neposúval indexy
    const indices = [...selectedMaps].sort((a,b)=>b-a);
    const maps = getMaps();
    indices.forEach(i=>{
      maps.splice(i,1);
      delete thumbOpen[i];
      if (activeMapIdx===i) activeMapIdx = maps.length>0 ? Math.max(0,i-1) : null;
      else if (activeMapIdx>i) activeMapIdx--;
    });
    selectedMaps.clear();
    autoSave(); renderMapList(); renderMapSelectBar();
    // Ak aktívna mapa stále existuje, otvor ju
    if (activeMapIdx!==null && activeMapIdx<maps.length) openMapEditor(activeMapIdx);
    else { const ed=document.getElementById('mapEditorArea'); if(ed) ed.style.display='none'; }
  }
  window.deleteSelectedMaps = deleteSelectedMaps;

  function renderMapSelectBar() {
    const bar = document.getElementById('mapSelectBar');
    if (!bar) return;
    if (selectedMaps.size===0) {
      bar.style.display='none'; return;
    }
    bar.style.display='flex';
    const cnt = document.getElementById('mapSelectCount');
    if (cnt) cnt.textContent = `${selectedMaps.size} map${selectedMaps.size>1?'s':''} selected`;
  }

  // ══════════════════════════════════════════════════════════════════════
  //  RENDER KARIET
  // ══════════════════════════════════════════════════════════════════════
  function renderMapList() {
    const maps = getMaps();
    const container = document.getElementById('mapListContainer');
    if (!container) return;

    const q = (document.getElementById('mapSearch')?.value||'').toLowerCase();
    const filtered = maps.map((m,i)=>({m,i})).filter(({m})=>
      !q||(m.name||'').toLowerCase().includes(q)||(m.session||'').toLowerCase().includes(q)||(m.tags||'').toLowerCase().includes(q));

    const total = filtered.length;
    const pages = Math.max(1,Math.ceil(total/PER_PAGE));
    if (mapPage>=pages) mapPage=Math.max(0,pages-1);
    const slice = filtered.slice(mapPage*PER_PAGE,(mapPage+1)*PER_PAGE);

    if (total===0) {
      container.innerHTML=`<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:'Cinzel',serif;font-size:13px;letter-spacing:1px;grid-column:1/-1;">${maps.length===0?'— No maps. Create the first one. —':'— No maps match. —'}</div>`;
      renderPagination(total); return;
    }

    container.innerHTML = slice.map(({m,i})=>{
      const isActive = i===activeMapIdx;
      const isOpen   = !!thumbOpen[i];
      const bg       = m.bgColor||'#0a0805';
      const tags     = (m.tags||'').split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<span class="map-tag">${t}</span>`).join('');
      const isChecked = selectedMaps.has(i);
      return `
        <div class="map-card-v3 ${isActive?'map-card-v3-active':''} ${isChecked?'map-card-v3-checked':''}" id="mapCard_${i}">
          <div class="map-card-v3-thumb" style="background:${bg};" onclick="MapEditor.openMapEditor(${i})">
            ${m.thumbnail?`<img src="${m.thumbnail}" style="width:100%;height:100%;object-fit:cover;">`:
              `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:4px;color:var(--text-muted);opacity:0.45;"><span style="font-size:24px;">🗺</span><span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;">EMPTY</span></div>`}
            ${isActive?`<div class="map-card-v3-active-badge">OPEN</div>`:''}
            <!-- Checkbox overlay -->
            <div class="map-card-checkbox ${isChecked?'checked':''}"
              onclick="toggleMapCardSelect(${i}, event)" title="Select map">
              ${isChecked?'✓':''}
            </div>
          </div>
          <div class="map-card-v3-footer">
            <div class="map-card-v3-name" title="${m.name||'Unnamed'}">${m.name||'Unnamed Map'}</div>
            ${m.session?`<div class="map-card-v3-session">📅 ${m.session}</div>`:''}
            <div class="map-card-v3-actions">
              <button class="map-card-v3-btn ${isOpen?'map-card-v3-btn-active':''}" title="${isOpen?'Hide':'Details'}"
                onclick="event.stopPropagation();MapEditor.toggleThumb(${i})">${isOpen?'▴':'▾'}</button>
              <button class="map-card-v3-btn" title="Duplicate" onclick="event.stopPropagation();MapEditor.duplicateMap(${i})">⧉</button>
              <button class="map-card-v3-btn map-card-v3-btn-del" title="Delete" onclick="event.stopPropagation();MapEditor.deleteMap(${i})">🗑</button>
            </div>
          </div>
          <div class="map-card-v3-detail ${isOpen?'open':''}">
            <div style="padding:6px 8px 8px;border-top:1px solid var(--border-dark);">
              ${m.session?`<div style="font-family:'Crimson Text',serif;font-size:11px;color:#5a9aee;margin-bottom:3px;">📅 ${m.session}</div>`:''}
              ${tags?`<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:4px;">${tags}</div>`:''}
              <div style="font-family:'Crimson Text',serif;font-size:10px;color:var(--text-muted);">${m.created?formatDate(m.created):''}</div>
            </div>
          </div>
        </div>`;
    }).join('');
    renderPagination(total);
  }
  window.renderMapList = renderMapList;

  function renderPagination(total) {
    const c = document.getElementById('mapPagination');
    if (!c) return;
    const pages = Math.max(1,Math.ceil(total/PER_PAGE));
    if (pages<=1) { c.innerHTML=''; return; }
    const start=mapPage*PER_PAGE+1, end=Math.min((mapPage+1)*PER_PAGE,total);
    let btns='';
    for (let p=0;p<pages;p++) btns+=`<button class="map-page-btn ${p===mapPage?'active':''}" onclick="MapEditor.goToPage(${p})">${p+1}</button>`;
    c.innerHTML=`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:space-between;padding:10px 2px 4px;border-top:1px solid var(--border-dark);margin-top:8px;">
      <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:0.5px;">${start}–${end} z ${total}</span>
      <div style="display:flex;gap:3px;">
        <button class="map-page-btn" ${mapPage===0?'disabled':''} onclick="MapEditor.goToPage(${mapPage-1})">‹</button>
        ${btns}
        <button class="map-page-btn" ${mapPage>=pages-1?'disabled':''} onclick="MapEditor.goToPage(${mapPage+1})">›</button>
      </div></div>`;
  }
  function goToPage(p) { mapPage=p; renderMapList(); }

  function toggleThumb(i) { thumbOpen[i]=!thumbOpen[i]; renderMapList(); }

  // ══════════════════════════════════════════════════════════════════════
  //  CRUD MÁPY
  // ══════════════════════════════════════════════════════════════════════
  function createMap() {
    const maps = getMaps();
    maps.unshift({ name:`Map ${maps.length+1}`, session:'', tags:'',
      created:new Date().toISOString(), objects:[], bgImage:null, bgColor:'#0a0805', gridType:'none', thumbnail:null });
    const nb={}; Object.keys(thumbOpen).forEach(k=>{nb[parseInt(k)+1]=thumbOpen[k];}); thumbOpen=nb;
    activeMapIdx=0; mapPage=0;
    autoSave(); renderMapList(); openMapEditor(0);
  }
  window.createMap = createMap;

  function duplicateMap(i) {
    const maps=getMaps();
    const copy=JSON.parse(JSON.stringify(maps[i]));
    copy.name=(maps[i].name||'Map')+' (copy)'; copy.created=new Date().toISOString();
    maps.splice(i+1,0,copy); autoSave(); renderMapList();
  }

  function deleteMap(i) {
    if (!confirm(`Delete "${getMaps()[i]?.name||'this map'}"?`)) return;
    getMaps().splice(i,1); delete thumbOpen[i];
    if (activeMapIdx===i) activeMapIdx=getMaps().length>0?Math.max(0,i-1):null;
    else if (activeMapIdx>i) activeMapIdx--;
    autoSave(); renderMapList();
    if (activeMapIdx!==null) openMapEditor(activeMapIdx);
    else { const ed=document.getElementById('mapEditorArea'); if(ed) ed.style.display='none'; }
  }

  // ══════════════════════════════════════════════════════════════════════
  //  OTVORENIE EDITORA
  // ══════════════════════════════════════════════════════════════════════
  function openMapEditor(i) {
    activeMapIdx=i;
    const map=getActiveMap(); if (!map) return;

    document.getElementById('mapEditorArea').style.display='';
    const hint=document.getElementById('mapEmptyHint'); if(hint) hint.style.display='none';

    // Metadata
    document.getElementById('mapEditorName').value    = map.name||'';
    document.getElementById('mapEditorSession').value = map.session||'';
    document.getElementById('mapEditorTags').value    = map.tags||'';

    // Bg
    const bgPicker=document.getElementById('mapBgColor');
    if (bgPicker) bgPicker.value=map.bgColor||'#0a0805';
    applyBgToWrapper(map.bgColor||'#0a0805');
    renderBgPresets();

    // Grid
    gridType=map.gridType||'none';
    document.querySelectorAll('.map-grid-btn').forEach(b=>b.classList.toggle('active',b.dataset.grid===gridType));

    // Canvas
    canvas=document.getElementById('mapCanvas');
    ctx=canvas?.getContext('2d'); if (!canvas||!ctx) return;

    // Načítaj objekty
    objects=(map.objects||[]).map(o=>({...o}));
    nextId=objects.reduce((mx,o)=>Math.max(mx,(o.id||0)+1),1);
    selectedId=null;
    selected=new Set();
    selectBox=null;
    zoom=1; panX=0; panY=0;

    if (!undoStacks[i]) undoStacks[i]=[];
    attachEvents();
    redraw();
    renderMapList();
    updateZoomLabel();
  }
  window.openMapEditor = openMapEditor;

  // ══════════════════════════════════════════════════════════════════════
  //  METADATA
  // ══════════════════════════════════════════════════════════════════════
  function saveMapMeta(field,value) {
    const map=getActiveMap(); if (!map) return;
    map[field]=value; autoSave();
    if (['name','session','tags'].includes(field)) renderMapList();
  }
  window.saveMapMeta=saveMapMeta;

  // ══════════════════════════════════════════════════════════════════════
  //  BG FARBA
  // ══════════════════════════════════════════════════════════════════════
  const BG_PRESETS=[
    {color:'#0a0805',label:'Dark parchment'},{color:'#060608',label:'Void'},
    {color:'#0e1a08',label:'Forest'},{color:'#08100e',label:'Sea'},
    {color:'#1a0808',label:'Blood'},{color:'#0d0e1a',label:'Arcane'},
    {color:'#1a1408',label:'Stone'},{color:'#f5e9c8',label:'Parchment'},
  ];

  function applyBgToWrapper(bg) {
    const w=document.getElementById('mapCanvasWrapper'); if(w) w.style.background=bg;
  }
  function setMapBgColor(val) {
    const map=getActiveMap(); if(!map) return;
    map.bgColor=val; applyBgToWrapper(val); autoSave(); renderMapList(); redraw();
  }
  window.setMapBgColor=setMapBgColor;

  function renderBgPresets() {
    const c=document.getElementById('mapBgPresets'); if(!c) return;
    const map=getActiveMap(); const cur=map?.bgColor||'#0a0805';
    c.innerHTML=BG_PRESETS.map(p=>`<button class="map-bg-preset ${p.color===cur?'active':''}"
      style="background:${p.color};${p.color==='#f5e9c8'?'outline:1px solid #c8a84a;':''}"
      title="${p.label}" onclick="setMapBgColor('${p.color}');renderBgPresets()"></button>`).join('');
  }
  window.renderBgPresets=renderBgPresets;

  // ══════════════════════════════════════════════════════════════════════
  //  GRID
  // ══════════════════════════════════════════════════════════════════════
  function setGridType(type) {
    gridType=type;
    const map=getActiveMap(); if(map){map.gridType=type;autoSave();}
    document.querySelectorAll('.map-grid-btn').forEach(b=>b.classList.toggle('active',b.dataset.grid===type));
    redraw();
  }
  window.setMapGrid=setGridType;

  // ══════════════════════════════════════════════════════════════════════
  //  UNDO
  // ══════════════════════════════════════════════════════════════════════
  function pushUndo() {
    if (activeMapIdx===null) return;
    if (!undoStacks[activeMapIdx]) undoStacks[activeMapIdx]=[];
    const st=undoStacks[activeMapIdx];
    st.push(JSON.stringify(objects));
    if (st.length>MAX_UNDO) st.shift();
  }
  function undoMap() {
    if (activeMapIdx===null) return;
    const st=undoStacks[activeMapIdx];
    if (!st||!st.length) return;
    objects=JSON.parse(st.pop());
    selectedId=null; saveObjects(); redraw();
  }
  window.undoMap=undoMap;

  function clearCanvas() {
    if (!confirm('Clear the entire map?')) return;
    pushUndo(); objects=[]; selectedId=null; saveObjects(); redraw();
  }
  window.clearMapCanvas=clearCanvas;

  // ══════════════════════════════════════════════════════════════════════
  //  SAVE
  // ══════════════════════════════════════════════════════════════════════
  function saveObjects() {
    const map=getActiveMap(); if(!map) return;
    map.objects=objects.map(o=>({...o}));
    map.thumbnail=makeThumbnail();
    autoSave();
  }

  function makeThumbnail() {
    if (!canvas) return null;
    const tc=document.createElement('canvas'); tc.width=160; tc.height=90;
    const tctx=tc.getContext('2d');
    tctx.fillStyle=getActiveMap()?.bgColor||'#0a0805';
    tctx.fillRect(0,0,160,90);
    tctx.drawImage(canvas,0,0,160,90);
    return tc.toDataURL('image/jpeg',0.7);
  }

  // ══════════════════════════════════════════════════════════════════════
  //  ZOOM / PAN
  // ══════════════════════════════════════════════════════════════════════
  function clampZoom(z) { return Math.min(10, Math.max(0.1, z)); }

  // cx, cy = canvas-pixel coords (už prepočítané)
  function zoomBy(delta, cx, cy) {
    if (!canvas) return;
    // Pivot v canvas-pixel space
    const cpx = cx ?? canvas.width/2;
    const cpy = cy ?? canvas.height/2;
    // World coords pivotu pred zoomom
    const wx = (cpx - panX) / zoom;
    const wy = (cpy - panY) / zoom;
    // Nový zoom
    zoom = clampZoom(zoom * delta);
    // Nový pan tak aby wx,wy ostalo na cpx,cpy
    panX = cpx - wx * zoom;
    panY = cpy - wy * zoom;
    updateZoomLabel(); redraw();
  }
  function zoomIn()  { zoomBy(1.25); }
  function zoomOut() { zoomBy(1/1.25); }
  function zoomReset(){
    const map=getActiveMap();
    if (map?.bgImage && map?.bgImageW && canvas) {
      const scaleX=canvas.width/map.bgImageW, scaleY=canvas.height/map.bgImageH;
      zoom=Math.min(scaleX,scaleY)*0.92;
      panX=(canvas.width  - map.bgImageW*zoom)/2;
      panY=(canvas.height - map.bgImageH*zoom)/2;
    } else { zoom=1; panX=0; panY=0; }
    updateZoomLabel(); redraw();
  }
  function zoomInCenter() { if(canvas) zoomBy(1.25, canvas.width/2, canvas.height/2); }
  function zoomOutCenter(){ if(canvas) zoomBy(1/1.25, canvas.width/2, canvas.height/2); }
  window.mapZoomIn=zoomInCenter; window.mapZoomOut=zoomOutCenter; window.mapZoomReset=zoomReset;

  function updateZoomLabel() {
    const lbl=document.getElementById('mapZoomLabel');
    if (lbl) lbl.textContent=Math.round(zoom*100)+'%';
  }

  // Canvas coords z mouse event
  function canvasPos(e) {
    const r=canvas.getBoundingClientRect();
    const cx=(e.clientX-r.left)*(canvas.width/r.width);
    const cy=(e.clientY-r.top)*(canvas.height/r.height);
    return { cx, cy, wx:(cx-panX)/zoom, wy:(cy-panY)/zoom };
  }

  // ══════════════════════════════════════════════════════════════════════
  //  DRAWING / OBJEKTY
  // ══════════════════════════════════════════════════════════════════════
  const HANDLE_SIZE=8;

  function getHandles(obj) {
    // 8 resize handles + 1 move center
    const {x,y,w,h}=obj;
    return [
      {id:'nw',cx:x,    cy:y},    {id:'n', cx:x+w/2,cy:y},    {id:'ne',cx:x+w,cy:y},
      {id:'w', cx:x,    cy:y+h/2},{id:'e', cx:x+w,  cy:y+h/2},
      {id:'sw',cx:x,    cy:y+h},  {id:'s', cx:x+w/2,cy:y+h},  {id:'se',cx:x+w,cy:y+h},
    ];
  }

  function hitHandle(obj, wx, wy) {
    if (obj.type==='pen'||obj.type==='line'&&!obj.w) return null;
    const hs=HANDLE_SIZE/zoom;
    for (const h of getHandles(obj)) {
      if (Math.abs(wx-h.cx)<hs&&Math.abs(wy-h.cy)<hs) return h.id;
    }
    return null;
  }

  function hitObject(wx, wy) {
    // Test v obrátenom poradí (vrchné objekty prvé)
    for (let i=objects.length-1;i>=0;i--) {
      const o=objects[i];
      if (o.locked) continue;
      if (hitTest(o,wx,wy)) return o;
    }
    // Locked background image
    for (let i=objects.length-1;i>=0;i--) {
      const o=objects[i];
      if (hitTest(o,wx,wy)) return o;
    }
    return null;
  }

  function hitTest(o, wx, wy) {
    if (o.type==='pen') {
      if (!o.points||o.points.length<2) return false;
      const bb=penBB(o.points); const pad=Math.max(8,o.lineWidth*2);
      return wx>=bb.x-pad&&wx<=bb.x+bb.w+pad&&wy>=bb.y-pad&&wy<=bb.y+bb.h+pad;
    }
    const pad=Math.max(4,o.lineWidth||2);
    return wx>=o.x-pad&&wx<=o.x+(o.w||0)+pad&&wy>=o.y-pad&&wy<=o.y+(o.h||0)+pad;
  }

  function penBB(pts) {
    let minX=pts[0],maxX=pts[0],minY=pts[1],maxY=pts[1];
    for (let i=0;i<pts.length;i+=2){minX=Math.min(minX,pts[i]);maxX=Math.max(maxX,pts[i]);minY=Math.min(minY,pts[i+1]);maxY=Math.max(maxY,pts[i+1]);}
    return {x:minX,y:minY,w:maxX-minX,h:maxY-minY};
  }

  // ══════════════════════════════════════════════════════════════════════
  //  DRAW ENGINE
  // ══════════════════════════════════════════════════════════════════════
  const imgCache={};

  function redraw() {
    if (!canvas||!ctx) return;
    const W=canvas.width, H=canvas.height;
    ctx.clearRect(0,0,W,H);

    const map=getActiveMap();

    // ── Bg farba — vždy celá plocha, bez transformu ──
    ctx.fillStyle = map?.bgColor||'#0a0805';
    ctx.fillRect(0,0,W,H);

    // ── Bg image — transformovaná spolu s obsahom ──
    ctx.save();
    ctx.translate(panX,panY);
    ctx.scale(zoom,zoom);

    if (map?.bgImage) drawBgImage(map.bgImage);

    // Grid
    drawGrid(W/zoom,H/zoom);

    // Objekty
    objects.forEach(o=>drawObject(o));

    // Draw preview
    if (drawState) drawPreview();

    // Pen preview
    if (penPoints.length>=4) drawPenPreview();

    // Selection — všetky vybrané objekty
    selected.forEach(id=>{
      const o=objects.find(x=>x.id===id);
      if (o) drawSelection(o, id===selectedId);
    });
    if (selectedId!=null&&!selected.has(selectedId)) {
      const o=objects.find(x=>x.id===selectedId);
      if (o) drawSelection(o, true);
    }

    // Multi-select box
    if (selectBox) drawSelectBox();

    ctx.restore();
  }

  function drawBgImage(src) {
    if (!imgCache[src]) {
      const img=new Image();
      img.onload=()=>{
        imgCache[src]=img;
        // Nastav world rozmery podľa obrázka pri prvom načítaní
        const map=getActiveMap();
        if (map&&(!map.bgImageW||!map.bgImageH)) {
          map.bgImageW=img.naturalWidth;
          map.bgImageH=img.naturalHeight;
        }
        redraw();
      };
      img.src=src; imgCache[src]='loading'; return;
    }
    if (imgCache[src]==='loading') return;
    const map=getActiveMap();
    const iw=map?.bgImageW||imgCache[src].naturalWidth||canvas.width;
    const ih=map?.bgImageH||imgCache[src].naturalHeight||canvas.height;
    // Kreslí od (0,0) s prirodzenými rozmermi — transform sa stará o zoom/pan
    ctx.drawImage(imgCache[src], 0, 0, iw, ih);
    // Ohraničenie world zóny
    ctx.save();
    ctx.strokeStyle='rgba(200,155,48,0.35)';
    ctx.lineWidth=2/zoom;
    ctx.setLineDash([6/zoom,4/zoom]);
    ctx.strokeRect(0,0,iw,ih);
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawGrid(W, H) {
    const map = getActiveMap();
    // Ak je bgImage, grid len v jeho zóne
    const gW = (map?.bgImage && map?.bgImageW) ? map.bgImageW : W;
    const gH = (map?.bgImage && map?.bgImageH) ? map.bgImageH : H;
    ctx.save(); ctx.globalAlpha=0.13; ctx.strokeStyle='#c89b30'; ctx.lineWidth=0.8/zoom;
    if (gridType==='square') {
      const s=32;
      for(let x=0;x<=gW;x+=s){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,gH);ctx.stroke();}
      for(let y=0;y<=gH;y+=s){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(gW,y);ctx.stroke();}
    } else if (gridType==='hex') {
      const r=22,w=r*2,h=Math.sqrt(3)*r;
      for(let row=-1;row<gH/h+2;row++) for(let col=-1;col<gW/(w*0.75)+2;col++){
        const cx=col*w*0.75,cy=row*h+(col%2===0?0:h/2);
        ctx.beginPath();
        for(let a=0;a<6;a++){const ag=Math.PI/180*(60*a-30);a===0?ctx.moveTo(cx+r*Math.cos(ag),cy+r*Math.sin(ag)):ctx.lineTo(cx+r*Math.cos(ag),cy+r*Math.sin(ag));}
        ctx.closePath();ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawObject(o) {
    ctx.save();
    ctx.strokeStyle=o.color||'#d4a843';
    ctx.fillStyle  =(o.color||'#d4a843')+'33';
    ctx.lineWidth  =(o.lineWidth||2)/zoom;
    ctx.lineCap='round'; ctx.lineJoin='round';

    if (o.type==='pen'&&o.points?.length>=4) {
      ctx.beginPath(); ctx.moveTo(o.points[0],o.points[1]);
      for(let i=2;i<o.points.length;i+=2) ctx.lineTo(o.points[i],o.points[i+1]);
      ctx.stroke();
    } else if (o.type==='line') {
      ctx.beginPath(); ctx.moveTo(o.x,o.y); ctx.lineTo(o.x+o.w,o.y+o.h); ctx.stroke();
    } else if (o.type==='rect') {
      ctx.beginPath(); ctx.rect(o.x,o.y,o.w,o.h); ctx.fill(); ctx.stroke();
    } else if (o.type==='ellipse') {
      ctx.beginPath(); ctx.ellipse(o.x+o.w/2,o.y+o.h/2,Math.abs(o.w/2),Math.abs(o.h/2),0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    } else if (o.type==='arrow') {
      drawArrowObj(o);
    } else if (o.type==='text') {
      ctx.font=`${(o.fontSize||16)}px 'Cinzel', serif`;
      ctx.fillStyle=o.color||'#d4a843';
      ctx.textBaseline='top'; ctx.fillText(o.text||'',o.x,o.y);
    } else if (o.type==='image') {
      drawImageObj(o);
    }
    ctx.restore();
  }

  function drawArrowObj(o) {
    const x2=o.x+o.w, y2=o.y+o.h;
    const ang=Math.atan2(y2-o.y,x2-o.x), hl=Math.max(14,(o.lineWidth||2)*4)/zoom;
    ctx.beginPath(); ctx.moveTo(o.x,o.y); ctx.lineTo(x2,y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2,y2);
    ctx.lineTo(x2-hl*Math.cos(ang-Math.PI/6),y2-hl*Math.sin(ang-Math.PI/6));
    ctx.lineTo(x2-hl*Math.cos(ang+Math.PI/6),y2-hl*Math.sin(ang+Math.PI/6));
    ctx.closePath(); ctx.fillStyle=o.color||'#d4a843'; ctx.fill();
  }

  function drawImageObj(o) {
    if (!o.src) return;
    if (!imgCache[o.src]) {
      const img=new Image(); img.onload=()=>{imgCache[o.src]=img;redraw();};
      img.src=o.src; imgCache[o.src]='loading'; return;
    }
    if (imgCache[o.src]==='loading') return;
    ctx.drawImage(imgCache[o.src],o.x,o.y,o.w,o.h);
  }

  function drawPreview() {
    const d=drawState;
    ctx.save();
    ctx.strokeStyle=color; ctx.fillStyle=color+'33';
    ctx.lineWidth=lineWidth/zoom; ctx.lineCap='round';
    const dx=d.curX-d.startX, dy=d.curY-d.startY;
    if (d.type==='line'){ctx.beginPath();ctx.moveTo(d.startX,d.startY);ctx.lineTo(d.curX,d.curY);ctx.stroke();}
    else if (d.type==='rect'){ctx.beginPath();ctx.rect(d.startX,d.startY,dx,dy);ctx.fill();ctx.stroke();}
    else if (d.type==='ellipse'){ctx.beginPath();ctx.ellipse(d.startX+dx/2,d.startY+dy/2,Math.abs(dx/2),Math.abs(dy/2),0,0,Math.PI*2);ctx.fill();ctx.stroke();}
    else if (d.type==='arrow'){
      const ang=Math.atan2(dy,dx),hl=Math.max(14,lineWidth*4)/zoom;
      ctx.beginPath();ctx.moveTo(d.startX,d.startY);ctx.lineTo(d.curX,d.curY);ctx.stroke();
      ctx.beginPath();ctx.moveTo(d.curX,d.curY);
      ctx.lineTo(d.curX-hl*Math.cos(ang-Math.PI/6),d.curY-hl*Math.sin(ang-Math.PI/6));
      ctx.lineTo(d.curX-hl*Math.cos(ang+Math.PI/6),d.curY-hl*Math.sin(ang+Math.PI/6));
      ctx.closePath();ctx.fillStyle=color;ctx.fill();
    }
    ctx.restore();
  }

  function drawPenPreview() {
    ctx.save();
    ctx.strokeStyle=color; ctx.lineWidth=lineWidth/zoom; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(penPoints[0],penPoints[1]);
    for(let i=2;i<penPoints.length;i+=2) ctx.lineTo(penPoints[i],penPoints[i+1]);
    ctx.stroke(); ctx.restore();
  }

  function drawSelection(o, isPrimary=true) {
    ctx.save();
    ctx.strokeStyle='#5a9aee'; ctx.lineWidth=1.5/zoom;
    ctx.setLineDash([4/zoom,3/zoom]);

    let bx,by,bw,bh;
    if (o.type==='pen') {
      const bb=penBB(o.points); bx=bb.x;by=bb.y;bw=bb.w;bh=bb.h;
    } else { bx=o.x;by=o.y;bw=o.w||0;bh=o.h||0; }
    const pad=6/zoom;
    ctx.strokeRect(bx-pad,by-pad,(bw||1)+pad*2,(bh||1)+pad*2);
    ctx.setLineDash([]);

    // Handles (nie pre locked bg image)
    if (!o.locked && o.type!=='pen') {
      getHandles(o).forEach(h=>{
        ctx.fillStyle='#fff'; ctx.strokeStyle='#5a9aee'; ctx.lineWidth=1/zoom;
        const hs=HANDLE_SIZE/zoom;
        ctx.fillRect(h.cx-hs/2,h.cy-hs/2,hs,hs);
        ctx.strokeRect(h.cx-hs/2,h.cy-hs/2,hs,hs);
      });
    }
    // Lock indicator
    if (o.locked) {
      ctx.fillStyle='#ffcc00'; ctx.font=`${12/zoom}px sans-serif`;
      ctx.fillText('🔒',bx-pad,by-pad-2/zoom);
    }
    // Shift-to-deform hint for image objects
    if (o.type==='image' && !o.locked && isPrimary) {
      ctx.fillStyle='rgba(90,154,238,0.75)';
      ctx.font=`${10/zoom}px 'Cinzel', sans-serif`;
      ctx.textBaseline='bottom';
      ctx.fillText('⇧ = free resize', bx-pad, by-pad-1/zoom);
      ctx.textBaseline='alphabetic';
    }
    ctx.restore();
  }

  function drawSelectBox() {
    if (!selectBox) return;
    const {sx,sy,cx,cy} = selectBox;
    ctx.save();
    ctx.strokeStyle='#5a9aee'; ctx.lineWidth=1/zoom;
    ctx.fillStyle='rgba(90,154,238,0.08)';
    ctx.setLineDash([4/zoom,3/zoom]);
    ctx.beginPath();
    ctx.rect(Math.min(sx,cx),Math.min(sy,cy),Math.abs(cx-sx),Math.abs(cy-sy));
    ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════════════
  //  EVENTS
  // ══════════════════════════════════════════════════════════════════════
  function attachEvents() {
    if (!canvas) return;
    const fresh=canvas.cloneNode(false);
    canvas.parentNode.replaceChild(fresh,canvas);
    canvas=fresh; ctx=canvas.getContext('2d');

    // Mouse
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup',   onUp);
    canvas.addEventListener('mouseleave',onUp);
    // Wheel zoom
    canvas.addEventListener('wheel', onWheel, {passive:false});
    // Keyboard pan (space)
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    // Touch
    canvas.addEventListener('touchstart',e=>{e.preventDefault();onDown(toMouse(e));},{passive:false});
    canvas.addEventListener('touchmove', e=>{e.preventDefault();onMove(toMouse(e));},{passive:false});
    canvas.addEventListener('touchend',  e=>{e.preventDefault();onUp();},{passive:false});
    canvas.style.cursor='crosshair';

    // Redraw po načítaní
    redraw();
  }

  function toMouse(e){const r=canvas.getBoundingClientRect(),t=e.touches[0];return{clientX:t.clientX,clientY:t.clientY,button:0};}

  function onKeyDown(e) {
    if (e.code==='Space'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA') {
      spaceDown=true; if(canvas) canvas.style.cursor='grab'; e.preventDefault();
    }
    if ((e.ctrlKey||e.metaKey)&&e.key==='z') { e.preventDefault(); undoMap(); }
    if (e.key==='Delete'||e.key==='Backspace') {
      if (document.activeElement===canvas||document.activeElement===document.body) deleteSelected();
    }
  }
  function onKeyUp(e) {
    if (e.code==='Space') { spaceDown=false; if(canvas) canvas.style.cursor=tool==='select'?'default':'crosshair'; }
  }

  function onWheel(e) {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    // Prepočet na canvas-pixel coords (zohľadní CSS scaling)
    const cx = (e.clientX - r.left) * (canvas.width  / r.width);
    const cy = (e.clientY - r.top)  * (canvas.height / r.height);
    const factor = e.deltaY < 0 ? 1.15 : 1/1.15;
    zoomBy(factor, cx, cy);
  }

  function onDown(e) {
    if (!canvas) return;
    const {cx,cy,wx,wy}=canvasPos(e);

    // Panning — space+drag alebo middle button
    if (spaceDown||e.button===1) {
      panning=true; panStart={mx:cx,my:cy,px:panX,py:panY};
      canvas.style.cursor='grabbing'; return;
    }

    if (tool==='select') {
      const shift = e.shiftKey;

      // Resize handle na vybranom objekte?
      if (selectedId!=null) {
        const sel=objects.find(x=>x.id===selectedId);
        if (sel&&!sel.locked) {
          const h=hitHandle(sel,wx,wy);
          if (h) {
            pushUndo();
            const aspectRatio = (sel.type==='image' && sel.h) ? sel.w / sel.h : null;
            dragState={mode:'resize',handle:h,startX:wx,startY:wy,origObj:{...sel},aspectRatio};
            return;
          }
        }
      }

      const hit=hitObject(wx,wy);
      if (hit) {
        // Shift = pridaj/odober z multi-selectu
        if (shift) {
          if (selected.has(hit.id)) selected.delete(hit.id);
          else selected.add(hit.id);
          selectedId = selected.size===1 ? [...selected][0] : null;
        } else {
          // Ak kliknutý objekt nie je v selekcii, resetni
          if (!selected.has(hit.id)) { selected.clear(); selected.add(hit.id); }
          selectedId=hit.id;
          if (!hit.locked) {
            pushUndo();
            // Pohyb celej skupiny
            const moveObjs=objects.filter(o=>selected.has(o.id)&&!o.locked).map(o=>({...o}));
            dragState={mode:'move-multi',startX:wx,startY:wy,origObjs:moveObjs};
          }
        }
      } else if (!shift) {
        // Klik do prázdna — začni rubber-band box
        selected.clear(); selectedId=null;
        selectBox={sx:wx,sy:wy,cx:wx,cy:wy};
      }
      redraw(); return;
    }

    if (tool==='pen') {
      pushUndo(); penPoints=[wx,wy]; return;
    }

    // Shape tools
    if (['line','rect','ellipse','arrow'].includes(tool)) {
      pushUndo();
      drawState={type:tool,startX:wx,startY:wy,curX:wx,curY:wy};
    }

    if (tool==='text') {
      const txt=prompt('Text:'); if(!txt) return;
      pushUndo();
      objects.push({id:genId(),type:'text',x:wx,y:wy,w:200,h:30,color,fontSize:Math.max(14,lineWidth*5),text:txt,lineWidth});
      saveObjects(); redraw();
    }

    if (tool==='eraser') {
      pushUndo();
      const hit=hitObject(wx,wy);
      if (hit) { objects=objects.filter(x=>x.id!==hit.id); if(selectedId===hit.id) selectedId=null; saveObjects(); redraw(); }
    }
  }

  function onMove(e) {
    if (!canvas) return;
    const {cx,cy,wx,wy}=canvasPos(e);

    if (panning&&panStart) {
      panX=panStart.px+(cx-panStart.mx);
      panY=panStart.py+(cy-panStart.my);
      redraw(); return;
    }

    if (dragState) {
      if (dragState.mode==='move-multi') {
        const dx=wx-dragState.startX, dy=wy-dragState.startY;
        dragState.origObjs.forEach(orig=>{
          const o=objects.find(x=>x.id===orig.id); if(!o) return;
          if (o.type==='pen') o.points=orig.points.map((v,i)=>i%2===0?v+dx:v+dy);
          else { o.x=orig.x+dx; o.y=orig.y+dy; }
        });
      } else {
        const o=objects.find(x=>x.id===selectedId); if(!o) return;
        if (dragState.mode==='move') {
          const dx=wx-dragState.startX, dy=wy-dragState.startY;
          if (o.type==='pen') {
            const orig=dragState.origObj;
            o.points=orig.points.map((v,i)=>i%2===0?v+dx:v+dy);
          } else { o.x=dragState.origObj.x+dx; o.y=dragState.origObj.y+dy; }
        } else if (dragState.mode==='resize') {
          applyResize(o,dragState,wx,wy,e.shiftKey);
        }
      }
      redraw(); return;
    }

    // Rubber-band selectBox
    if (selectBox) {
      selectBox.cx=wx; selectBox.cy=wy; redraw(); return;
    }

    if (drawState) { drawState.curX=wx; drawState.curY=wy; redraw(); return; }

    if (tool==='pen'&&penPoints.length>0) {
      penPoints.push(wx,wy); redraw(); return;
    }

    // Kurzor
    if (tool==='select'&&selectedId!=null) {
      const sel=objects.find(x=>x.id===selectedId);
      if (sel&&!sel.locked) {
        const h=hitHandle(sel,wx,wy);
        if (h) { canvas.style.cursor=resizeCursor(h); return; }
      }
      const hit=hitObject(wx,wy);
      canvas.style.cursor=hit?'move':'default';
    }
  }

  function onUp(e) {
    if (panning) { panning=false; panStart=null; canvas.style.cursor=spaceDown?'grab':tool==='select'?'default':'crosshair'; return; }

    if (dragState) {
      dragState=null; saveObjects(); redraw(); return;
    }

    // Finalizuj rubber-band selectBox
    if (selectBox) {
      const {sx,sy,cx,cy}=selectBox;
      const minX=Math.min(sx,cx),maxX=Math.max(sx,cx),minY=Math.min(sy,cy),maxY=Math.max(sy,cy);
      if (Math.abs(cx-sx)>4||Math.abs(cy-sy)>4) {
        // Vyber všetky objekty ktoré sa prekrývajú s boxom
        selected.clear();
        objects.forEach(o=>{
          let ox,oy,ow,oh;
          if (o.type==='pen'&&o.points) { const bb=penBB(o.points);ox=bb.x;oy=bb.y;ow=bb.w;oh=bb.h; }
          else { ox=o.x;oy=o.y;ow=o.w||0;oh=o.h||0; }
          if (ox+ow>=minX&&ox<=maxX&&oy+oh>=minY&&oy<=maxY) selected.add(o.id);
        });
        selectedId = selected.size===1 ? [...selected][0] : null;
      }
      selectBox=null; redraw(); return;
    }

    if (drawState) {
      const d=drawState; drawState=null;
      const dx=d.curX-d.startX, dy=d.curY-d.startY;
      if (Math.abs(dx)<2&&Math.abs(dy)<2) { redraw(); return; }
      objects.push({id:genId(),type:d.type,x:d.startX,y:d.startY,w:dx,h:dy,color,lineWidth});
      saveObjects(); redraw(); return;
    }

    if (tool==='pen'&&penPoints.length>=4) {
      objects.push({id:genId(),type:'pen',points:[...penPoints],color,lineWidth,x:0,y:0,w:0,h:0});
      penPoints=[]; saveObjects(); redraw(); return;
    }
    penPoints=[];
  }

  function applyResize(o, ds, wx, wy, shiftKey) {
    const orig=ds.origObj, h=ds.handle;
    let {x,y,w,h:oh}=orig;
    const newRight=wx, newBottom=wy;
    if (h.includes('e')) w=newRight-x;
    if (h.includes('s')) oh=newBottom-y;
    if (h.includes('w')) { w=orig.x+orig.w-wx; x=wx; }
    if (h.includes('n')) { oh=orig.y+orig.h-wy; y=wy; }

    // Constrain aspect ratio for image objects — UNLESS Shift is held (free deform)
    const ar = ds.aspectRatio; // non-null only for image objects
    if (ar && !shiftKey) {
      const cornerHandle = h.length === 2; // 'nw','ne','sw','se'
      const edgeH = h==='e'||h==='w';
      const edgeV = h==='n'||h==='s';

      if (cornerHandle) {
        // Determine which dimension changed more, keep the larger delta
        const dw = Math.abs(w - orig.w), dh = Math.abs(oh - orig.h);
        if (dw / (orig.w||1) >= dh / (orig.h||1)) {
          // Width is dominant — adjust height
          oh = w / ar;
          if (h.includes('n')) y = orig.y + orig.h - oh;
          if (h.includes('w')) x = orig.x + orig.w - w;
        } else {
          // Height is dominant — adjust width
          w = oh * ar;
          if (h.includes('n')) y = orig.y + orig.h - oh;
          if (h.includes('w')) x = orig.x + orig.w - w;
        }
      } else if (edgeH) {
        // Dragging left/right edge — height follows
        oh = w / ar;
        y = orig.y + (orig.h - oh) / 2;
      } else if (edgeV) {
        // Dragging top/bottom edge — width follows
        w = oh * ar;
        x = orig.x + (orig.w - w) / 2;
      }
    }

    o.x=x; o.y=y; o.w=w; o.h=oh;
  }

  function resizeCursor(h) {
    const map={nw:'nw-resize',n:'n-resize',ne:'ne-resize',w:'w-resize',e:'e-resize',sw:'sw-resize',s:'s-resize',se:'se-resize'};
    return map[h]||'pointer';
  }

  // ══════════════════════════════════════════════════════════════════════
  //  SELECT ACTIONS (tlačidlá)
  // ══════════════════════════════════════════════════════════════════════
  function deleteSelected() {
    if (selected.size===0&&selectedId===null) return;
    pushUndo();
    const toDelete = selected.size>0 ? selected : new Set([selectedId]);
    objects=objects.filter(x=>!toDelete.has(x.id));
    selected.clear(); selectedId=null; saveObjects(); redraw();
  }
  window.deleteSelectedMapObj=deleteSelected;

  function toggleLockSelected() {
    const o=objects.find(x=>x.id===selectedId); if(!o) return;
    o.locked=!o.locked; saveObjects(); redraw();
    const btn=document.getElementById('mapLockBtn');
    if (btn) btn.textContent=o.locked?'🔒 Locked':'🔓 Unlock';
  }
  window.toggleLockSelectedMapObj=toggleLockSelected;

  function bringForward() {
    const i=objects.findIndex(x=>x.id===selectedId); if(i<0||i===objects.length-1) return;
    [objects[i],objects[i+1]]=[objects[i+1],objects[i]]; saveObjects(); redraw();
  }
  function sendBackward() {
    const i=objects.findIndex(x=>x.id===selectedId); if(i<=0) return;
    [objects[i],objects[i-1]]=[objects[i-1],objects[i]]; saveObjects(); redraw();
  }
  window.mapBringForward=bringForward; window.mapSendBackward=sendBackward;

  // ══════════════════════════════════════════════════════════════════════
  //  IMAGE UPLOAD
  // ══════════════════════════════════════════════════════════════════════
  function triggerImageUpload() {
    const inp=document.getElementById('mapImageInput'); if(inp) inp.click();
  }
  window.triggerMapImageUpload=triggerImageUpload;

  function handleImageUpload(input) {
    const file=input.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      const src=e.target.result;
      showImageUploadModal(src);
    };
    reader.readAsDataURL(file);
    input.value='';
  }
  window.handleMapImageUpload=handleImageUpload;

  function showImageUploadModal(src) {
    // Vytvor modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'mapImgModal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
      <div style="background:var(--bg-panel);border:1px solid var(--border-gold);border-radius:8px;padding:28px 32px;max-width:360px;width:90%;box-shadow:0 8px 40px rgba(0,0,0,0.8);">
        <div style="font-family:'Cinzel',serif;font-size:15px;font-weight:700;color:var(--accent-gold);letter-spacing:1px;margin-bottom:8px;">🖼 Upload Image</div>
        <div style="font-family:'Crimson Text',serif;font-size:14px;color:var(--text-secondary);margin-bottom:20px;line-height:1.5;">
          How do you want to add the image to the map?
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <button id="imgModalBg" style="padding:12px 16px;background:var(--bg-card);border:1px solid var(--border-gold);border-radius:6px;color:var(--accent-gold);font-family:'Cinzel',serif;font-size:12px;letter-spacing:1px;cursor:pointer;text-align:left;transition:background 0.15s;">
            🗺 <strong>Background</strong>
            <div style="font-family:'Crimson Text',serif;font-size:12px;color:var(--text-muted);margin-top:2px;font-weight:normal;">Full canvas · locked under drawing</div>
          </button>
          <button id="imgModalObj" style="padding:12px 16px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:6px;color:var(--text-primary);font-family:'Cinzel',serif;font-size:12px;letter-spacing:1px;cursor:pointer;text-align:left;transition:background 0.15s;">
            📌 <strong>Object</strong>
            <div style="font-family:'Crimson Text',serif;font-size:12px;color:var(--text-muted);margin-top:2px;font-weight:normal;">Movable · resizable</div>
          </button>
          <button id="imgModalCancel" style="padding:8px;background:transparent;border:1px solid var(--border-dark);border-radius:6px;color:var(--text-muted);font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;cursor:pointer;margin-top:4px;">
            CANCEL
          </button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    function close() { overlay.remove(); }

    document.getElementById('imgModalBg').onclick = () => {
      close(); pushUndo();
      const map=getActiveMap(); if(!map) return;
      map.bgImage=src;
      map.bgImageW=null; map.bgImageH=null; // reset — načíta sa z obrázka
      imgCache[src]=null; // force reload
      saveObjects();
      // Vycentruj view na obrázok po načítaní
      const tmpImg=new Image();
      tmpImg.onload=()=>{
        if (!canvas) return;
        const iw=tmpImg.naturalWidth, ih=tmpImg.naturalHeight;
        map.bgImageW=iw; map.bgImageH=ih;
        // Fit obrázok do canvas so zachovaním aspect ratio
        const scaleX=canvas.width/iw, scaleY=canvas.height/ih;
        zoom=Math.min(scaleX,scaleY)*0.92;
        panX=(canvas.width  - iw*zoom)/2;
        panY=(canvas.height - ih*zoom)/2;
        updateZoomLabel(); redraw();
      };
      tmpImg.src=src;
    };
    document.getElementById('imgModalObj').onclick = () => {
      close(); pushUndo();
      const W=canvas.width/zoom, H=canvas.height/zoom;
      const img=new Image();
      img.onload=()=>{
        const aspect=img.naturalWidth/img.naturalHeight;
        const iw=Math.min(400,W*0.5), ih=iw/aspect;
        // Stred viditeľného viewport-u vo world-space
        const cx = (canvas.width/2  - panX) / zoom;
        const cy = (canvas.height/2 - panY) / zoom;
        objects.push({id:genId(),type:'image',src,
          x:cx-iw/2, y:cy-ih/2,
          w:iw,h:ih,color:'transparent',lineWidth:0});
        saveObjects(); redraw();
      };
      img.src=src;
    };
    document.getElementById('imgModalCancel').onclick = close;
    overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
  }

  function removeBgImage() {
    const map=getActiveMap(); if(!map) return;
    if (!confirm('Remove background?')) return;
    pushUndo(); map.bgImage=null; saveObjects(); redraw();
  }
  window.removeMapBgImage=removeBgImage;

  // ══════════════════════════════════════════════════════════════════════
  //  TOOLS
  // ══════════════════════════════════════════════════════════════════════
  function setTool(t) {
    tool=t;
    document.querySelectorAll('.map-tool-btn').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));
    if (!canvas) return;
    canvas.style.cursor=t==='select'?'default':t==='eraser'?'cell':t==='text'?'text':'crosshair';
    if (t!=='select') { selectedId=null; redraw(); }
  }
  window.setMapTool=setTool;

  function setColor(c) {
    color=c;
    document.querySelectorAll('.map-color-swatch').forEach(s=>s.classList.toggle('active',s.dataset.color===c));
    const cu=document.getElementById('mapColorCustom'); if(cu) cu.value=c;
    // Zmeň farbu vybraného objektu
    if (selectedId!=null) {
      const o=objects.find(x=>x.id===selectedId); if(o&&o.type!=='image'){o.color=c;saveObjects();redraw();}
    }
  }
  window.setMapColor=setColor;

  function setLineWidth(w) {
    lineWidth=parseInt(w);
    const lbl=document.getElementById('mapSizeLabel'); if(lbl) lbl.textContent=w+'px';
  }
  window.setMapLineWidth=setLineWidth;

  function pickCustomColor(val) {
    color=val;
    document.querySelectorAll('.map-color-swatch').forEach(s=>s.classList.remove('active'));
    if (selectedId!=null) {
      const o=objects.find(x=>x.id===selectedId); if(o&&o.type!=='image'){o.color=val;saveObjects();redraw();}
    }
  }
  window.pickMapCustomColor=pickCustomColor;

  // ══════════════════════════════════════════════════════════════════════
  //  EXPORT
  // ══════════════════════════════════════════════════════════════════════
  function exportMapPNG() {
    if (!canvas) return;
    const map=getActiveMap();
    const expW = map?.bgImageW || canvas.width;
    const expH = map?.bgImageH || canvas.height;
    // Reset view na 1:1 pre export
    const oz=zoom, opx=panX, opy=panY;
    zoom=1; panX=0; panY=0; redraw();
    const exp=document.createElement('canvas');
    exp.width=expW; exp.height=expH;
    const ectx=exp.getContext('2d');
    ectx.fillStyle=map?.bgColor||'#0a0805';
    ectx.fillRect(0,0,expW,expH);
    // Nakresli canvas obsah (1:1 zoom, pan=0)
    ectx.drawImage(canvas, 0,0, expW,expH, 0,0, expW,expH);
    zoom=oz; panX=opx; panY=opy; redraw();
    const link=document.createElement('a');
    link.download=(map?.name||'map').replace(/[^a-z0-9_\-]/gi,'_')+'.png';
    link.href=exp.toDataURL('image/png'); link.click();
  }
  window.exportMapPNG=exportMapPNG;

  // ══════════════════════════════════════════════════════════════════════
  //  EXPORT / IMPORT MÁP
  //  Súbor: chronicle_maps_<meno>.json
  //  Obsahuje: data.maps (všetky mapy s kreslami, vrstvami, tokenmi)
  //  Obrázky pozadí (base64) sú súčasťou map.bgImage — idú automaticky.
  // ══════════════════════════════════════════════════════════════════════

  function exportMaps() {
    try {
      const maps     = getMaps();
      const charName = (typeof data !== 'undefined' && data.charName) ? data.charName : 'character';

      const exportObj = {
        _type:    'chronicle_maps',
        _version: 1,
        _date:    new Date().toISOString(),
        maps:     JSON.parse(JSON.stringify(maps)),
      };

      const blob = new Blob([JSON.stringify(exportObj, null, 2)], {type:'application/json'});
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = charName.replace(/\s+/g,'_') + '_maps.json';
      a.click();
      URL.revokeObjectURL(a.href);

      if (typeof showToast === 'function')
        showToast(`Maps exported — ${maps.length} map${maps.length!==1?'s':''} ✦`);
    } catch(err) {
      console.error('Maps export error:', err);
      if (typeof showToast === 'function') showToast('Maps export failed: ' + err.message);
    }
  }
  window.exportMaps = exportMaps;

  function importMaps() {
    const input    = document.createElement('input');
    input.type     = 'file';
    input.accept   = '.json,application/json';
    input.onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;

      let parsed;
      try {
        parsed = JSON.parse(await file.text());
      } catch(err) {
        if (typeof showToast === 'function') showToast('Import failed: invalid JSON file');
        console.error('Maps import parse error:', err);
        return;
      }

      if (parsed._type !== 'chronicle_maps') {
        if (!confirm('This file does not look like a Maps export. Continue?')) return;
      }

      if (!Array.isArray(parsed.maps)) {
        if (typeof showToast === 'function') showToast('Import failed: file contains no maps');
        return;
      }

      const action = parsed.maps.length > 0 && getMaps().length > 0
        ? confirm('Replace existing maps? OK = replace, Cancel = merge (add to existing)')
        : true;

      if (action) {
        // Nahradiť
        if (typeof data !== 'undefined') data.maps = parsed.maps;
      } else {
        // Zlúčiť — pridaj importované, zachovaj existujúce
        const existing = getMaps();
        parsed.maps.forEach(m => existing.push(m));
      }

      if (typeof autoSave === 'function') autoSave();
      if (typeof renderMapList === 'function') renderMapList();

      const count = parsed.maps.length;
      if (typeof showToast === 'function')
        showToast(`Maps imported — ${count} map${count!==1?'s':''} ✦`);
    };
    input.click();
  }
  window.importMaps = importMaps;

  return { openMapEditor, duplicateMap, deleteMap, toggleThumb, goToPage, exportMaps, importMaps };
})();

// Inicializácia po načítaní stránky — vyrenderuj zoznam máp aj bez kliknutia na tab
document.addEventListener('DOMContentLoaded', function() {
  // Počkaj kým sa načítajú dáta (loadData sa volá pred DOMContentLoaded v niektorých prípadoch)
  setTimeout(function() {
    if (typeof renderMapList === 'function') renderMapList();
  }, 100);
});
