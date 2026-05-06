// ═══════════════════════════════════════════
//  archive.js — MEDIA ARCHIVE
//  Priečinky + galéria, grid/detail view, stránkovanie
//  data.archive = { folders:[], items:[] }
// ═══════════════════════════════════════════
'use strict';

const Archive = (function () {

  // ══════════════════════════════════════════════════════════════════════
  //  IMAGE STORE — IndexedDB (primary) + localStorage (fallback)
  //  Každý obrázok má vlastný kľúč aby sme obišli 5MB JSON limit.
  //  Pri exporte/importe sa base64 dáta zahŕňajú priamo v JSON.
  // ══════════════════════════════════════════════════════════════════════
  const IMG_STORE_KEY = 'dnd_archive_imgs'; // legacy
  const IMG_PREFIX    = 'dnd_img_';
  const IDB_NAME      = 'dnd_archive_idb';
  const IDB_STORE     = 'images';

  // ── In-memory cache (rýchle čítanie, prežije rerender, nie refresh) ──
  const _memCache = {};
  // ── Veľkosti obrázkov po kompresii { imgId: bytes } ─────────────────
  const _imgSizes = {};

  // ── IndexedDB setup ───────────────────────────────────────────────────
  let _idb = null;
  function openIDB() {
    if (_idb) return Promise.resolve(_idb);
    return new Promise((res, rej) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE);
      req.onsuccess = e => { _idb = e.target.result; res(_idb); };
      req.onerror   = () => rej(req.error);
    });
  }
  function idbPut(id, src) {
    return openIDB().then(db => new Promise((res, rej) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(src, id);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    })).catch(()=>{});
  }
  function idbGet(id) {
    return openIDB().then(db => new Promise((res, rej) => {
      const req = db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).get(id);
      req.onsuccess = () => res(req.result||null);
      req.onerror   = () => rej(req.error);
    })).catch(()=>null);
  }
  function idbDelete(id) {
    return openIDB().then(db => new Promise(res => {
      const tx = db.transaction(IDB_STORE,'readwrite');
      tx.objectStore(IDB_STORE).delete(id);
      tx.oncomplete = res; tx.onerror = res;
    })).catch(()=>{});
  }
  function idbGetAll() {
    // Vráti { id: src } pre všetky uložené obrázky
    return openIDB().then(db => new Promise((res, rej) => {
      const store = db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE);
      const result = {};
      const reqKeys = store.getAllKeys();
      reqKeys.onsuccess = () => {
        const keys = reqKeys.result;
        if (!keys.length) return res(result);
        const reqVals = store.getAll();
        reqVals.onsuccess = () => {
          keys.forEach((k,i) => result[k] = reqVals.result[i]);
          res(result);
        };
        reqVals.onerror = () => rej(reqVals.error);
      };
      reqKeys.onerror = () => rej(reqKeys.error);
    })).catch(()=>({}));
  }

  // ── Nastavenia kompresie ─────────────────────────────────────────────
  const COMPRESS = {
    maxPx:    1400,    // max šírka alebo výška v pixeloch
    quality:  0.82,    // JPEG kvalita (0–1); 0.82 = výborný pomer kvalita/veľkosť
    mimeOut:  'image/jpeg',  // vždy ukladáme ako JPEG (PNG by bol príliš veľký)
  };

  // ── compressImg — canvas kompresia, vráti Promise<{src,origSize,compSize,origW,origH,newW,newH}> ──
  function compressImg(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const origW = img.width, origH = img.height;
        let width = origW, height = origH;
        const max = COMPRESS.maxPx;

        // Zmenši ak treba (zachová pomer strán)
        if (width > max || height > max) {
          if (width >= height) { height = Math.round(height * max / width);  width  = max; }
          else                 { width  = Math.round(width  * max / height); height = max; }
        }

        const canvas  = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Biely podklad pre PNG s priehľadnosťou (JPEG nepodporuje alfa)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL(COMPRESS.mimeOut, COMPRESS.quality);
        const origSize = Math.round(src.length * 3 / 4);
        const compSize = Math.round(compressed.length * 3 / 4);
        resolve({ src: compressed, origSize, compSize, origW, origH, newW: width, newH: height });
      };
      img.onerror = () => resolve({ src, origSize:0, compSize:0, origW:0, origH:0, newW:0, newH:0 });
      img.src = src;
    });
  }

  function fmtBytes(b) {
    if (!b || b <= 0) return '?';
    if (b < 1024)     return b + ' B';
    if (b < 1048576)  return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  }

  // ── storeImg — skomprimuje a uloží do IDB + localStorage fallback ─────
  // Vracia Promise<id>; voliteľný onInfo(result) callback dostane veľkosti
  async function storeImg(src, onInfo) {
    const id = IMG_PREFIX + Date.now() + '_' + Math.random().toString(36).slice(2,7);

    // Skomprimuj pred uložením
    let finalSrc = src;
    try {
      const result = await compressImg(src);
      finalSrc = result.src;
      _imgSizes[id] = result.compSize;
      if (typeof onInfo === 'function') onInfo(result);
    } catch(e) {
      console.warn('Compress failed, storing original:', e);
    }

    _memCache[id] = finalSrc;
    idbPut(id, finalSrc).catch(()=>{});
    try { localStorage.setItem(id, finalSrc); } catch(e) {}
    return id;
  }

  // ── getImg — synchronné čítanie z cache/localStorage, async IDB ──────
  function getImg(id) {
    if (!id) return null;
    if (id.startsWith('data:')) return id;          // starý priamy base64
    if (_memCache[id]) return _memCache[id];         // in-memory hit
    try {
      const ls = localStorage.getItem(id);
      if (ls) { _memCache[id] = ls; return ls; }    // localStorage hit
    } catch(e) {}
    // IDB — async; spustí re-render po načítaní
    idbGet(id).then(val => {
      if (val) {
        _memCache[id] = val;
        try { localStorage.setItem(id, val); } catch(e) {}
        // Re-render galérie ak je otvorená
        const g = document.getElementById('archGallery');
        if (g) renderArchive();
      }
    });
    return null; // zatiaľ null, re-render príde neskôr
  }

  // ── deleteImgs ────────────────────────────────────────────────────────
  function deleteImgs(ids) {
    (ids||[]).forEach(id => {
      if (!id || id.startsWith('data:')) return;
      delete _memCache[id];
      try { localStorage.removeItem(id); } catch(e) {}
      idbDelete(id);
    });
  }

  // ── resolveImgs — vráti pole src pre item ────────────────────────────
  function resolveImgs(item) {
    return (item.images||[]).map(id => getImg(id)).filter(Boolean);
  }

  // ══════════════════════════════════════════════════════════════════════
  //  EXPORT / IMPORT HELPERS — base64 dáta priamo v JSON
  // ══════════════════════════════════════════════════════════════════════

  /**
   * Zbiera všetky obrázky archívu (z IDB + localStorage + cache)
   * a vráti Promise<{ id: base64src }> — pre vloženie do export JSON.
   */
  async function collectImagesForExport() {
    // 1. Začni s tým čo je v IDB
    const idbAll = await idbGetAll();
    // 2. Doplň z localStorage a cache
    const items = getItems();
    const usedIds = new Set(items.flatMap(it => it.images||[]));
    usedIds.forEach(id => {
      if (!id || id.startsWith('data:') || idbAll[id]) return;
      const src = _memCache[id] || (() => { try { return localStorage.getItem(id); } catch(e) { return null; } })();
      if (src) idbAll[id] = src;
    });
    // Vráť len použité
    const result = {};
    usedIds.forEach(id => { if (idbAll[id]) result[id] = idbAll[id]; });
    return result;
  }

  /**
   * Pri importe — dostane { id: src } a uloží do IDB + localStorage + cache.
   * Volaj PRED tým ako nastavíš data.archive.
   */
  async function restoreImagesFromImport(imgMap) {
    if (!imgMap || typeof imgMap !== 'object') return;
    const entries = Object.entries(imgMap);
    for (const [id, src] of entries) {
      if (!src) continue;
      _memCache[id] = src;
      _imgSizes[id] = Math.round(src.length * 3 / 4);
      try { localStorage.setItem(id, src); } catch(e) {}
      await idbPut(id, src);
    }
  }

  // Exportuj na window aby ich mohol volať hlavný export/import kód
  window.Archive_collectImagesForExport = collectImagesForExport;
  window.Archive_restoreImagesFromImport = restoreImagesFromImport;

  // ── Migrácia zo starého IMG_STORE_KEY formátu ─────────────────────────
  function migrateOldImgStore() {
    try {
      const old = localStorage.getItem(IMG_STORE_KEY);
      if (!old) return;
      const store = JSON.parse(old);
      Object.entries(store).forEach(([id, src]) => {
        _memCache[id] = src;
        if (!localStorage.getItem(id)) {
          try { localStorage.setItem(id, src); } catch(e) {}
        }
        idbPut(id, src);
      });
      localStorage.removeItem(IMG_STORE_KEY);
    } catch(e) {}
  }
  migrateOldImgStore();

  // ── Pri štarte načítaj všetky IDB obrázky do cache ───────────────────
  idbGetAll().then(all => {
    Object.assign(_memCache, all);
    // Obnov veľkosti z base64 dĺžky
    Object.entries(all).forEach(([id, src]) => {
      if (src) _imgSizes[id] = Math.round(src.length * 3 / 4);
    });
    // Ak je galéria otvorená, prerender
    const g = document.getElementById('archGallery');
    if (g && g.children.length) renderArchive();
  });

  // ── Stav ──────────────────────────────────────────────────────────────
  const PER_PAGE_GRID   = 24;
  const PER_PAGE_DETAIL = 10;

  let viewMode      = 'grid';    // 'grid' | 'detail'
  let activeFolderId = null;     // null = všetky
  let archivePage   = 0;
  let searchVal     = '';
  let filterType    = '';
  let lightboxId    = null;

  // ── Data helpers ───────────────────────────────────────────────────────
  function getArchive() {
    if (!data.archive) data.archive = { folders: [], items: [] };
    if (!data.archive.folders) data.archive.folders = [];
    if (!data.archive.items)   data.archive.items   = [];
    return data.archive;
  }
  function getFolders() { return getArchive().folders; }
  function getItems()   { return getArchive().items;   }
  function genId()      { return 'a' + Date.now() + Math.random().toString(36).slice(2,6); }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString('sk-SK',{day:'2-digit',month:'2-digit',year:'numeric'}); }
    catch { return ''; }
  }

  const ITEM_TYPES = [
    { id:'item',     icon:'⚔️',  label:'Item'     },
    { id:'location', icon:'🗺',  label:'Location' },
    { id:'npc',      icon:'🧙',  label:'NPC'      },
    { id:'clue',     icon:'🔍',  label:'Clue'     },
    { id:'document', icon:'📜',  label:'Document' },
    { id:'creature', icon:'🐉',  label:'Creature' },
    { id:'reward',   icon:'💰',  label:'Reward'   },
    { id:'other',    icon:'📌',  label:'Other'    },
  ];
  const TYPE_MAP = Object.fromEntries(ITEM_TYPES.map(t=>[t.id,t]));

  // ── Sub-tab inject ─────────────────────────────────────────────────────
  function switchNotesSubTabArch(tab) {
    ['notes','maps','archive'].forEach(t => {
      const c = document.getElementById('ntab-content-'+t);
      const b = document.getElementById('ntab-'+t);
      if (c) c.style.display = t===tab ? '' : 'none';
      if (b) b.className = t===tab ? 'btn btn-primary btn-sm' : 'btn btn-silver btn-sm';
    });
    if (tab==='archive') renderArchive();
    if (tab==='maps') {
      if (typeof renderMapList === 'function') renderMapList();
      // Otvor aktívnu mapu ak existuje
      if (typeof MapEditor !== 'undefined' && MapEditor.openMapEditor) {
        const maps = (data&&data.maps)||[];
        if (maps.length>0) MapEditor.openMapEditor(0);
      }
    }
  }
  window.switchNotesSubTab = switchNotesSubTabArch;

  // ══════════════════════════════════════════════════════════════════════
  //  HLAVNÝ RENDER
  // ══════════════════════════════════════════════════════════════════════
  function renderArchive() {
    renderFolderSidebar();
    renderGallery();
  }
  window.renderArchive = renderArchive;

  // ══════════════════════════════════════════════════════════════════════
  //  SIDEBAR — PRIEČINKY
  // ══════════════════════════════════════════════════════════════════════
  function renderFolderSidebar() {
    const container = document.getElementById('archFolderList');
    if (!container) return;
    const folders = getFolders();
    const items   = getItems();

    const allCount = items.length;
    const rows = folders.map(f => {
      const cnt = items.filter(it=>it.folderId===f.id).length;
      const isActive = activeFolderId===f.id;
      return `
        <div class="arch-folder-row ${isActive?'active':''}"
          onclick="Archive.setFolder('${f.id}')">
          <span class="arch-folder-icon">${f.icon||'📁'}</span>
          <span class="arch-folder-name">${f.name||'Unnamed'}</span>
          <span class="arch-folder-count">${cnt}</span>
          <button class="arch-folder-edit" title="Edit folder"
            onclick="event.stopPropagation();Archive.editFolder('${f.id}')">✎</button>
          <button class="arch-folder-del" title="Delete folder"
            onclick="event.stopPropagation();Archive.deleteFolder('${f.id}')">🗑</button>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div class="arch-folder-row ${activeFolderId===null?'active':''}"
        onclick="Archive.setFolder(null)">
        <span class="arch-folder-icon">🗂</span>
        <span class="arch-folder-name">All Items</span>
        <span class="arch-folder-count">${allCount}</span>
      </div>
      ${rows}
      <button class="add-row-btn" onclick="Archive.createFolder()" style="margin-top:8px;width:100%;">
        + New Folder
      </button>`;
  }

  // ── Folder CRUD ────────────────────────────────────────────────────────
  function setFolder(id) {
    activeFolderId = id; archivePage = 0; renderArchive();
  }

  function createFolder() {
    const name = prompt('Folder name:'); if (!name) return;
    const icon = prompt('Icon (emoji, optional):', '📁') || '📁';
    getFolders().push({ id:genId(), name:name.trim(), icon, created:new Date().toISOString() });
    autoSave(); renderArchive();
  }

  function editFolder(id) {
    const f = getFolders().find(x=>x.id===id); if (!f) return;
    const name = prompt('Folder name:', f.name); if (name===null) return;
    const icon = prompt('Icon:', f.icon||'📁');
    f.name = name.trim()||f.name;
    f.icon = icon||f.icon;
    autoSave(); renderArchive();
  }

  function deleteFolder(id) {
    if (!confirm('Delete folder? Items will remain in All Items.')) return;
    const arch = getArchive();
    arch.folders = arch.folders.filter(f=>f.id!==id);
    // Unlink items
    arch.items.forEach(it=>{ if(it.folderId===id) it.folderId=null; });
    if (activeFolderId===id) activeFolderId=null;
    autoSave(); renderArchive();
  }

  // ══════════════════════════════════════════════════════════════════════
  //  GALÉRIA
  // ══════════════════════════════════════════════════════════════════════
  function renderGallery() {
    const container = document.getElementById('archGallery');
    if (!container) return;

    const items = getFilteredItems();
    const perPage = viewMode==='grid' ? PER_PAGE_GRID : PER_PAGE_DETAIL;
    const total   = items.length;
    const pages   = Math.max(1, Math.ceil(total/perPage));
    if (archivePage>=pages) archivePage=Math.max(0,pages-1);
    const slice   = items.slice(archivePage*perPage, (archivePage+1)*perPage);

    // Toolbar
    const folderName = activeFolderId
      ? (getFolders().find(f=>f.id===activeFolderId)?.name || 'Folder')
      : 'All Items';

    const typeOptions = ITEM_TYPES.map(t=>
      `<option value="${t.id}" ${filterType===t.id?'selected':''}>${t.icon} ${t.label}</option>`
    ).join('');

    // NPC a Quest options pre link dropdowny
    const npcOpts = (data.npcs||[]).map((n,i)=>
      `<option value="${i}">${n.name||'NPC '+i}</option>`).join('');
    const questOpts = (data.quests||[]).map((q,i)=>
      `<option value="${i}">${q.title||'Quest '+i}</option>`).join('');

    container.innerHTML = `
      <!-- Toolbar -->
      <div class="arch-toolbar">
        <div style="font-family:'Cinzel',serif;font-size:13px;color:var(--accent-gold);letter-spacing:1px;">
          ${folderName}
          <span style="color:var(--text-muted);font-size:11px;margin-left:6px;">${total} items</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
          <input type="text" id="archSearch" placeholder="🔍 Search…" value="${searchVal}"
            oninput="Archive.setSearch(this.value)"
            style="font-size:13px;padding:4px 8px;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-primary);width:160px;">
          <select id="archTypeFilter" onchange="Archive.setTypeFilter(this.value)"
            style="font-size:13px;padding:4px 6px;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-primary);">
            <option value="">All Types</option>
            ${typeOptions}
          </select>
          <button class="btn btn-silver btn-sm" onclick="Archive.setSearch('');Archive.setTypeFilter('')"
            style="font-size:11px;">✕</button>
          <!-- View toggle -->
          <div style="display:flex;gap:2px;background:var(--bg-deepest);border:1px solid var(--border-dark);border-radius:var(--radius);padding:2px;">
            <button class="arch-view-btn ${viewMode==='grid'?'active':''}" onclick="Archive.setView('grid')" title="Grid">⊞</button>
            <button class="arch-view-btn ${viewMode==='detail'?'active':''}" onclick="Archive.setView('detail')" title="Detail">☰</button>
          </div>
          <button class="btn btn-primary btn-sm" onclick="Archive.openUploadModal()"
            style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.5px;">+ Add Item</button>
        </div>
      </div>

      <!-- Items -->
      <div class="${viewMode==='grid' ? 'arch-grid' : 'arch-list'}">
        ${slice.length===0
          ? `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-family:'Cinzel',serif;font-size:13px;letter-spacing:1px;">— No items found —</div>`
          : slice.map(it => viewMode==='grid' ? renderGridItem(it) : renderDetailItem(it, npcOpts, questOpts)).join('')
        }
      </div>

      <!-- Pagination -->
      ${renderPaginationHTML(total, perPage)}
    `;
  }

  function getFilteredItems() {
    return getItems().filter(it => {
      if (activeFolderId!==null && it.folderId!==activeFolderId) return false;
      if (filterType && it.type!==filterType) return false;
      if (searchVal) {
        const q = searchVal.toLowerCase();
        if (!(it.name||'').toLowerCase().includes(q) &&
            !(it.desc||'').toLowerCase().includes(q) &&
            !(it.tags||'').toLowerCase().includes(q) &&
            !(it.session||'').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  // ── Grid item ──────────────────────────────────────────────────────────
  function renderGridItem(it) {
    const t = TYPE_MAP[it.type] || TYPE_MAP.other;
    const tags = (it.tags||'').split(',').map(s=>s.trim()).filter(Boolean)
      .map(s=>`<span class="map-tag">${s}</span>`).join('');
    const firstImgId = it.images && it.images[0];
    const firstSrc   = firstImgId ? getImg(firstImgId) : null;
    const _gSizeB    = firstImgId ? (it.imgSizes && it.imgSizes[firstImgId]) || _imgSizes[firstImgId] || 0 : 0;
    const _gSizeBadge = _gSizeB > 0
      ? `<div style="position:absolute;bottom:4px;left:4px;background:rgba(0,0,0,0.6);color:#ccc;` +
        `font-size:9px;font-family:'Cinzel',serif;padding:1px 5px;border-radius:3px;pointer-events:none;` +
        `letter-spacing:0.3px;">${fmtBytes(_gSizeB)}</div>` : '';
    let thumbHtml;
    if (firstImgId) {
      if (firstSrc) {
        thumbHtml = `<img src="${firstSrc}" style="width:100%;height:100%;object-fit:cover;">`;
      } else {
        // IDB loading — zobraz placeholder, re-render príde cez idbGet callback
        thumbHtml = `<div class="arch-lazy-thumb" data-imgid="${firstImgId}"
          style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:4px;opacity:0.4;">
          <span style="font-size:20px;">⏳</span>
        </div>`;
      }
    } else {
      thumbHtml = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:4px;opacity:0.4;">
        <span style="font-size:28px;">${t.icon}</span>
        <span style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:1px;color:var(--text-muted);">NO IMAGE</span>
      </div>`;
    }
    return `
      <div class="arch-grid-item" onclick="Archive.openLightbox('${it.id}')">
        <div class="arch-grid-thumb" style="background:var(--bg-deepest);">
          ${thumbHtml}
          <div class="arch-type-badge">${t.icon}</div>
          ${_gSizeBadge}
        </div>
        <div style="padding:6px 8px 5px;">
          <div style="font-family:'Cinzel',serif;font-size:11px;font-weight:600;color:var(--text-primary);
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${it.name||''}">${it.name||'Unnamed'}</div>
          ${it.session ? `<div style="font-family:'Crimson Text',serif;font-size:11px;color:var(--text-muted);">📅 ${it.session}</div>` : ''}
          ${tags ? `<div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:3px;">${tags}</div>` : ''}
        </div>
      </div>`;
  }

  // ── Detail item ────────────────────────────────────────────────────────
  function renderDetailItem(it, npcOpts, questOpts) {
    const t = TYPE_MAP[it.type] || TYPE_MAP.other;
    const tags = (it.tags||'').split(',').map(s=>s.trim()).filter(Boolean)
      .map(s=>`<span class="map-tag">${s}</span>`).join('');
    const linkedNPC   = it.linkedNPC!=null   ? (data.npcs||[])[it.linkedNPC]?.name   : null;
    const linkedQuest = it.linkedQuest!=null ? (data.quests||[])[it.linkedQuest]?.title : null;
    const imgCount    = it.images?.length || 0; // počet, nie resolved src
    const firstImgId2 = it.images && it.images[0];
    const firstSrc2   = firstImgId2 ? getImg(firstImgId2) : null;
    const _dSizeB     = firstImgId2 ? (it.imgSizes && it.imgSizes[firstImgId2]) || _imgSizes[firstImgId2] || 0 : 0;
    const _dSizeBadge = _dSizeB > 0
      ? `<div style="position:absolute;bottom:4px;left:4px;background:rgba(0,0,0,0.6);color:#ccc;` +
        `font-size:9px;font-family:'Cinzel',serif;padding:1px 5px;border-radius:3px;pointer-events:none;` +
        `letter-spacing:0.3px;">${fmtBytes(_dSizeB)}</div>` : '';
    let detailThumb;
    if (firstImgId2) {
      detailThumb = firstSrc2
        ? `<img src="${firstSrc2}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius);">`
        : `<div class="arch-lazy-thumb" data-imgid="${firstImgId2}"
            style="display:flex;align-items:center;justify-content:center;height:100%;font-size:24px;opacity:0.4;">⏳</div>`;
    } else {
      detailThumb = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:32px;opacity:0.3;">${t.icon}</div>`;
    }

    return `
      <div class="arch-detail-item">
        <!-- Thumb -->
        <div class="arch-detail-thumb" onclick="Archive.openLightbox('${it.id}')" style="cursor:pointer;position:relative;">
          ${detailThumb}
          ${imgCount>1 ? `<div class="arch-img-count">+${imgCount-1}</div>` : ''}
          ${_dSizeBadge}
        </div>
        <!-- Info -->
        <div class="arch-detail-info">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
            <span style="font-family:'Cinzel',serif;font-size:14px;font-weight:600;color:var(--text-primary);">${it.name||'Unnamed'}</span>
            <span style="font-family:'Cinzel',serif;font-size:9px;padding:1px 6px;background:${typeColor(it.type)}22;border:1px solid ${typeColor(it.type)}44;border-radius:3px;color:${typeColor(it.type)};">${t.icon} ${t.label}</span>
            ${it.session?`<span style="font-family:'Crimson Text',serif;font-size:12px;color:var(--text-muted);">📅 ${it.session}</span>`:''}
          </div>
          ${it.desc ? `<div style="font-family:'Crimson Text',serif;font-size:13px;color:var(--text-secondary);margin-bottom:5px;line-height:1.4;">${it.desc}</div>` : ''}
          <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
            ${tags}
            ${linkedNPC   ? `<span class="arch-link-badge npc-link">🧙 ${linkedNPC}</span>`   : ''}
            ${linkedQuest ? `<span class="arch-link-badge quest-link">📜 ${linkedQuest}</span>` : ''}
          </div>
          <div style="font-family:'Crimson Text',serif;font-size:11px;color:var(--text-muted);margin-top:4px;">${fmtDate(it.created)}</div>
        </div>
        <!-- Actions -->
        <div class="arch-detail-actions">
          <button class="map-card-btn" title="Edit" onclick="Archive.openEditModal('${it.id}')">✎</button>
          <button class="map-card-btn map-card-btn-del" title="Delete" onclick="Archive.deleteItem('${it.id}')">🗑</button>
        </div>
      </div>`;
  }

  function typeColor(type) {
    const colors = {item:'#c89b30',location:'#70c050',npc:'#5a9aee',clue:'#b07ae0',
      document:'#e8dcc8',creature:'#cc4444',reward:'#d4a843',other:'#888'};
    return colors[type]||'#888';
  }

  // ── Pagination HTML ────────────────────────────────────────────────────
  function renderPaginationHTML(total, perPage) {
    const pages = Math.max(1, Math.ceil(total/perPage));
    if (pages<=1) return '';
    const start=archivePage*perPage+1, end=Math.min((archivePage+1)*perPage,total);
    let btns='';
    for(let p=0;p<pages;p++) btns+=`<button class="map-page-btn ${p===archivePage?'active':''}" onclick="Archive.goToPage(${p})">${p+1}</button>`;
    return `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:space-between;
      padding:10px 2px 4px;border-top:1px solid var(--border-dark);margin-top:10px;">
      <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:0.5px;">${start}–${end} z ${total}</span>
      <div style="display:flex;gap:3px;">
        <button class="map-page-btn" ${archivePage===0?'disabled':''} onclick="Archive.goToPage(${archivePage-1})">‹</button>
        ${btns}
        <button class="map-page-btn" ${archivePage>=pages-1?'disabled':''} onclick="Archive.goToPage(${archivePage+1})">›</button>
      </div></div>`;
  }

  // ── Controls ───────────────────────────────────────────────────────────
  function setView(v)       { viewMode=v; archivePage=0; renderGallery(); }
  function setSearch(v)     { searchVal=v; archivePage=0; renderGallery(); }
  function setTypeFilter(v) { filterType=v; archivePage=0; renderGallery(); }
  function goToPage(p)      { archivePage=p; renderGallery(); }

  // ══════════════════════════════════════════════════════════════════════
  //  UPLOAD / EDIT MODAL
  // ══════════════════════════════════════════════════════════════════════
  function openUploadModal(editId) {
    const isEdit = !!editId;
    const it = isEdit ? getItems().find(x=>x.id===editId) : null;

    const folderOptions = getFolders().map(f=>
      `<option value="${f.id}" ${it?.folderId===f.id?'selected':''}>${f.icon||'📁'} ${f.name}</option>`
    ).join('');

    const typeOptions = ITEM_TYPES.map(t=>
      `<option value="${t.id}" ${(it?.type||'other')===t.id?'selected':''}>${t.icon} ${t.label}</option>`
    ).join('');

    const npcOptions = `<option value="">— None —</option>` +
      (data.npcs||[]).map((n,i)=>`<option value="${i}" ${it?.linkedNPC==i?'selected':''}>${n.name||'NPC '+i}</option>`).join('');
    const questOptions = `<option value="">— None —</option>` +
      (data.quests||[]).map((q,i)=>`<option value="${i}" ${it?.linkedQuest==i?'selected':''}>${q.title||'Quest '+i}</option>`).join('');

    // Existujúce obrázky
    const existingImgs = resolveImgs(it||{}).map((src,idx)=>
      `<div style="position:relative;display:inline-block;">
        <img src="${src}" style="width:60px;height:60px;object-fit:cover;border-radius:3px;border:1px solid var(--border-mid);">
        <button onclick="Archive._removeImg('${editId||'new'}',${idx})" style="position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:var(--accent-red);border:none;color:#fff;font-size:10px;cursor:pointer;line-height:1;">✕</button>
      </div>`
    ).join('');

    const overlay = document.createElement('div');
    overlay.id = 'archModal';
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML=`
      <div style="background:var(--bg-panel);border:1px solid var(--border-gold);border-radius:8px;
        padding:24px 28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,0.8);">
        <div style="font-family:'Cinzel',serif;font-size:15px;font-weight:700;color:var(--accent-gold);letter-spacing:1px;margin-bottom:16px;">
          ${isEdit ? '✎ Edit Item' : '+ Add Archive Item'}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          <div class="field" style="margin:0;">
            <label>Name</label>
            <input type="text" id="archModalName" value="${it?.name||''}" placeholder="Item name…">
          </div>
          <div class="field" style="margin:0;">
            <label>Type</label>
            <select id="archModalType">${typeOptions}</select>
          </div>
          <div class="field" style="margin:0;">
            <label>Session / Date</label>
            <input type="text" id="archModalSession" value="${it?.session||''}" placeholder="Session 5 / 12.3.2026…">
          </div>
          <div class="field" style="margin:0;">
            <label>Folder</label>
            <select id="archModalFolder">
              <option value="">— No folder —</option>
              ${folderOptions}
            </select>
          </div>
        </div>

        <div class="field">
          <label>Description</label>
          <textarea id="archModalDesc" rows="3" placeholder="Description, where you found it, circumstances…">${it?.desc||''}</textarea>
        </div>

        <div class="field">
          <label>Tags <span style="color:var(--text-muted);font-size:11px;">(comma separated)</span></label>
          <input type="text" id="archModalTags" value="${it?.tags||''}" placeholder="magic, sword, dungeon…">
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          <div class="field" style="margin:0;">
            <label>🧙 Link NPC</label>
            <select id="archModalNPC">${npcOptions}</select>
          </div>
          <div class="field" style="margin:0;">
            <label>📜 Link Quest</label>
            <select id="archModalQuest">${questOptions}</select>
          </div>
        </div>

        <!-- Images -->
        <div class="field">
          <label>Images</label>
          ${existingImgs ? `<div id="archExistingImgs" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">${existingImgs}</div>` : ''}
          <input type="file" id="archModalFiles" accept="image/*" multiple
            style="font-size:12px;color:var(--text-secondary);">
          <div style="font-family:'Crimson Text',serif;font-size:12px;color:var(--text-muted);margin-top:3px;font-style:italic;">
            You can upload multiple images at once
          </div>
        </div>

        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">
          <button class="btn btn-silver btn-sm" onclick="document.getElementById('archModal').remove()"
            style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.5px;">CANCEL</button>
          <button class="btn btn-primary btn-sm" onclick="Archive._saveModal('${editId||''}')"
            style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.5px;">
            ${isEdit?'SAVE CHANGES':'ADD TO ARCHIVE'}
          </button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  }
  function openEditModal(id) { openUploadModal(id); }

  // ── Uloženie modalu ────────────────────────────────────────────────────
  function saveModal(editId) {
    const name    = document.getElementById('archModalName')?.value.trim();
    const type    = document.getElementById('archModalType')?.value    || 'other';
    const session = document.getElementById('archModalSession')?.value.trim() || '';
    const folder  = document.getElementById('archModalFolder')?.value  || null;
    const desc    = document.getElementById('archModalDesc')?.value.trim()    || '';
    const tags    = document.getElementById('archModalTags')?.value.trim()    || '';
    const npcVal  = document.getElementById('archModalNPC')?.value;
    const qstVal  = document.getElementById('archModalQuest')?.value;
    const linkedNPC   = npcVal   !== '' ? parseInt(npcVal)   : null;
    const linkedQuest = qstVal   !== '' ? parseInt(qstVal)   : null;
    const files   = document.getElementById('archModalFiles')?.files;

    const isEdit = !!editId;
    const arch   = getArchive();
    let item     = isEdit ? arch.items.find(x=>x.id===editId) : null;

    if (!isEdit) {
      item = { id:genId(), created:new Date().toISOString(), images:[] };
      arch.items.unshift(item);
    }

    item.name    = name||'Unnamed';
    item.type    = type;
    item.session = session;
    item.folderId= folder||null;
    item.desc    = desc;
    item.tags    = tags;
    item.linkedNPC   = linkedNPC;
    item.linkedQuest = linkedQuest;
    if (!item.images) item.images=[];

    // Načítaj nové obrázky — skomprimuj + ulož
    if (files && files.length>0) {
      const modal = document.getElementById('archModal');
      const saveBtn = modal?.querySelector('.btn-primary');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳ Saving…'; }

      const fileArr = Array.from(files);
      const readFile = f => new Promise(res => {
        const r = new FileReader();
        r.onload  = e => res(e.target.result);
        r.onerror = ()  => res(null);
        r.readAsDataURL(f);
      });

      Promise.all(fileArr.map(readFile)).then(async srcs => {
        // Zatvor modal hneď — obrázky spracuj na pozadí
        autoSave();
        renderArchive();
        document.getElementById('archModal')?.remove();

        const validSrcs = srcs.filter(Boolean);
        if (!validSrcs.length) return;

        const toastId = 'archCmpToast';
        function showCmpToast(html) {
          let t = document.getElementById(toastId);
          if (!t) {
            t = document.createElement('div');
            t.id = toastId;
            t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);' +
              'background:var(--bg-panel,#1a1a2e);border:1px solid var(--border-gold,#c89b30);' +
              'border-radius:8px;padding:10px 20px;z-index:99999;font-family:"Cinzel",serif;' +
              'font-size:11px;letter-spacing:0.5px;box-shadow:0 4px 24px rgba(0,0,0,0.7);' +
              'min-width:260px;max-width:400px;text-align:center;color:var(--text-secondary,#bbb);' +
              'transition:opacity 0.4s;';
            document.body.appendChild(t);
          }
          t.style.opacity = '1';
          t.innerHTML = html;
        }
        function removeCmpToast(delay) {
          setTimeout(() => {
            const t = document.getElementById(toastId);
            if (t) { t.style.opacity = '0'; setTimeout(() => t.remove(), 450); }
          }, delay || 0);
        }

        const sizeLog = [];
        let done = 0;
        for (const src of validSrcs) {
          showCmpToast('⏳ Compressing ' + (done + 1) + ' / ' + validSrcs.length + '…');
          const info = {};
          const imgId = await storeImg(src, r => Object.assign(info, r));
          item.images.push(imgId);
          if (info.compSize) {
            if (!item.imgSizes) item.imgSizes = {};
            item.imgSizes[imgId] = info.compSize;
          }
          done++;
          if (info.origSize) sizeLog.push(info);
        }

        autoSave();
        renderArchive();

        if (sizeLog.length) {
          const tOrig = sizeLog.reduce((s, x) => s + x.origSize, 0);
          const tComp = sizeLog.reduce((s, x) => s + x.compSize, 0);
          const pct   = tOrig > 0 ? Math.round((1 - tComp / tOrig) * 100) : 0;
          const col   = pct >= 5 ? '#6dbb6d' : 'var(--text-muted,#888)';
          let rows = sizeLog.map((x, i) => {
            const p = x.origSize > 0 ? Math.round((1 - x.compSize / x.origSize) * 100) : 0;
            const c = p >= 5 ? '#6dbb6d' : 'var(--text-muted,#888)';
            const d = (x.origW && x.newW && x.origW !== x.newW)
              ? ' <span style="font-size:10px;color:var(--text-muted,#888);">' + x.origW + 'x' + x.origH + '->' + x.newW + 'x' + x.newH + '</span>' : '';
            return '<div style="font-size:10px;line-height:1.8;">📷 ' + (sizeLog.length > 1 ? (i+1)+': ' : '') +
              fmtBytes(x.origSize) + ' → <span style="color:' + c + ';">' + fmtBytes(x.compSize) + '</span>' +
              ' <span style="color:' + c + ';">(−' + p + '%)</span>' + d + '</div>';
          }).join('');
          if (sizeLog.length > 1) {
            rows += '<div style="border-top:1px solid var(--border-dark,#333);margin-top:4px;padding-top:4px;font-size:11px;">Spolu: ' +
              fmtBytes(tOrig) + ' → <span style="color:' + col + ';">' + fmtBytes(tComp) + '</span>' +
              ' <span style="color:' + col + ';">(−' + pct + '%)</span></div>';
          }
          showCmpToast('<div style="color:var(--accent-gold,#c89b30);margin-bottom:5px;font-size:10px;letter-spacing:1px;">🗜 COMPRESSION DONE</div>' + rows);
          removeCmpToast(5000);
        }
      });

      return;
    } else {
      autoSave(); renderArchive();
      document.getElementById('archModal')?.remove();
    }
  }

  function removeImg(itemId, idx) {
    const it = getItems().find(x=>x.id===itemId); if(!it) return;
    const removedId = it.images[idx];
    it.images.splice(idx,1);
    deleteImgs([removedId]);
    autoSave();
    // Refresh existing imgs v modali
    const existing = document.getElementById('archExistingImgs');
    if (existing) {
      existing.innerHTML = it.images.map((src,i)=>
        `<div style="position:relative;display:inline-block;">
          <img src="${src}" style="width:60px;height:60px;object-fit:cover;border-radius:3px;border:1px solid var(--border-mid);">
          <button onclick="Archive._removeImg('${itemId}',${i})" style="position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:var(--accent-red);border:none;color:#fff;font-size:10px;cursor:pointer;line-height:1;">✕</button>
        </div>`
      ).join('');
    }
  }

  // ── Delete item ────────────────────────────────────────────────────────
  function deleteItem(id) {
    if (!confirm('Delete this item?')) return;
    const arch=getArchive();
    const it=arch.items.find(x=>x.id===id);
    if (it) deleteImgs(it.images||[]);
    arch.items=arch.items.filter(x=>x.id!==id);
    autoSave(); renderArchive();
  }

  // ══════════════════════════════════════════════════════════════════════
  //  LIGHTBOX
  // ══════════════════════════════════════════════════════════════════════
  function openLightbox(id) {
    const it = getItems().find(x=>x.id===id); if(!it) return;
    lightboxId = id;
    const t     = TYPE_MAP[it.type] || TYPE_MAP.other;
    const imgs  = resolveImgs(it);
    const tc    = typeColor(it.type);
    const linkedNPC   = it.linkedNPC!=null   ? (data.npcs||[])[it.linkedNPC]?.name   : null;
    const linkedQuest = it.linkedQuest!=null ? (data.quests||[])[it.linkedQuest]?.title : null;
    const folder      = it.folderId ? getFolders().find(f=>f.id===it.folderId) : null;
    const tags  = (it.tags||'').split(',').map(s=>s.trim()).filter(Boolean);

    // ── Veľkosti obrázkov pre lightbox (podľa poradia v it.images) ────────
    const lbImgSizes = (it.images||[]).map(imgId =>
      (it.imgSizes && it.imgSizes[imgId]) || _imgSizes[imgId] || 0
    );

    // ── Overlay ──────────────────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.id    = 'archLightbox';
    overlay.className = 'arch-lb-overlay';

    overlay.innerHTML = `
      <div class="arch-lb-shell">

        <!-- ═══ LEFT: Viewer ═══ -->
        <div class="arch-lb-viewer">

          <!-- Zoom bar -->
          <div class="arch-lb-zoombar">
            <button class="arch-lb-zbtn" onclick="archLbZoom(-0.2)" title="Zoom out">−</button>
            <span id="archLbZoomLabel" class="arch-lb-zlabel">100%</span>
            <button class="arch-lb-zbtn" onclick="archLbZoom(0.2)"  title="Zoom in">+</button>
            <button class="arch-lb-zbtn arch-lb-zbtn-reset" onclick="archLbZoomReset()" title="Reset">1:1</button>
            <span class="arch-lb-hint">scroll = zoom &nbsp;·&nbsp; drag = pan &nbsp;·&nbsp; dbl-click = reset</span>
            <!-- Nav šípky ak viac obrázkov -->
            ${imgs.length>1 ? `
              <div style="margin-left:auto;display:flex;gap:4px;">
                <button class="arch-lb-zbtn" id="archLbPrev" onclick="archLbNav(-1)" title="Previous">‹</button>
                <span id="archLbImgIdx" class="arch-lb-zlabel">1 / ${imgs.length}</span>
                <button class="arch-lb-zbtn" id="archLbNext" onclick="archLbNav(1)"  title="Next">›</button>
              </div>` : ''}
          </div>

          <!-- Viewport -->
          <div id="archLbViewport" class="arch-lb-viewport">
            ${imgs.length > 0
              ? `<img id="archLbImg" src="${imgs[0]}" draggable="false" class="arch-lb-img">`
              : `<div class="arch-lb-noimg">${t.icon}</div>`}
            ${lbImgSizes[0] > 0 ? `
            <div id="archLbSizeBadge" style="position:absolute;bottom:10px;left:10px;
              background:rgba(0,0,0,0.6);color:#ccc;font-size:10px;
              font-family:'Cinzel',serif;letter-spacing:0.5px;
              padding:2px 8px;border-radius:4px;pointer-events:none;z-index:5;">
              ${fmtBytes(lbImgSizes[0])}
            </div>` : `<div id="archLbSizeBadge" style="display:none;position:absolute;bottom:10px;left:10px;
              background:rgba(0,0,0,0.6);color:#ccc;font-size:10px;
              font-family:'Cinzel',serif;letter-spacing:0.5px;
              padding:2px 8px;border-radius:4px;pointer-events:none;z-index:5;"></div>`}
          </div>

          <!-- Thumbnails -->
          ${imgs.length > 1 ? `
            <div class="arch-lb-thumbs" id="archLbThumbs">
              ${imgs.map((src,i)=>`
                <img src="${src}" data-idx="${i}"
                  class="arch-lb-thumb ${i===0?'active':''}"
                  onclick="archLbGoTo(${i})">`).join('')}
            </div>` : ''}
        </div>

        <!-- ═══ RIGHT: Info panel ═══ -->
        <div class="arch-lb-info">

          <!-- Header -->
          <div class="arch-lb-info-header">
            <div class="arch-lb-info-type" style="background:${tc}18;border-color:${tc}44;color:${tc};">
              ${t.icon}&nbsp;${t.label}
            </div>
            ${folder ? `<div class="arch-lb-info-folder">${folder.icon||'📁'} ${folder.name}</div>` : ''}
          </div>

          <!-- Názov -->
          <div class="arch-lb-info-name">${it.name||'Unnamed'}</div>

          <!-- Session -->
          ${it.session ? `<div class="arch-lb-info-session">📅 ${it.session}</div>` : ''}

          <!-- Divider -->
          <div class="arch-lb-divider"></div>

          <!-- Popis -->
          ${it.desc ? `
            <div class="arch-lb-info-section-label">DESCRIPTION</div>
            <div class="arch-lb-info-desc">${it.desc}</div>` : ''}

          <!-- Tagy -->
          ${tags.length ? `
            <div class="arch-lb-info-section-label">TAGS</div>
            <div class="arch-lb-info-tags">
              ${tags.map(t=>`<span class="map-tag">${t}</span>`).join('')}
            </div>` : ''}

          <!-- Linky -->
          ${(linkedNPC||linkedQuest) ? `
            <div class="arch-lb-info-section-label">LINKS</div>
            <div class="arch-lb-info-links">
              ${linkedNPC   ? `<span class="arch-link-badge npc-link">🧙 ${linkedNPC}</span>`   : ''}
              ${linkedQuest ? `<span class="arch-link-badge quest-link">📜 ${linkedQuest}</span>` : ''}
            </div>` : ''}

          <!-- Spacer -->
          <div style="flex:1;"></div>

          <!-- Dátum -->
          <div class="arch-lb-info-date">${fmtDate(it.created)}</div>

          <!-- Akcie -->
          <div class="arch-lb-info-actions">
            <button class="arch-lb-action-btn arch-lb-action-edit"
              onclick="Archive.openEditModal('${id}');document.getElementById('archLightbox').remove()">
              ✎ Edit
            </button>
            <button class="arch-lb-action-btn arch-lb-action-del"
              onclick="Archive.deleteItem('${id}');document.getElementById('archLightbox').remove()">
              🗑 Delete
            </button>
          </div>
        </div>

        <!-- Close -->
        <button class="arch-lb-close" onclick="document.getElementById('archLightbox').remove()">✕</button>
      </div>`;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });

    // ── Zoom / Pan logika ─────────────────────────────────────────────────
    let lbZoom=1, lbPanX=0, lbPanY=0;
    let lbDragging=false, lbDragStart=null;
    let lbImgIdx = 0;

    function lbApplyTransform() {
      const img=document.getElementById('archLbImg'); if(!img) return;
      img.style.transform=`translate(calc(-50% + ${lbPanX}px), calc(-50% + ${lbPanY}px)) scale(${lbZoom})`;
      const lbl=document.getElementById('archLbZoomLabel');
      if (lbl) lbl.textContent=Math.round(lbZoom*100)+'%';
    }

    window.archLbZoom = delta=>{
      lbZoom=Math.min(8,Math.max(0.1,lbZoom+delta)); lbApplyTransform();
    };
    window.archLbZoomReset = ()=>{
      lbZoom=1; lbPanX=0; lbPanY=0; lbApplyTransform();
    };
    window.archLbSetImg = src=>{
      const img=document.getElementById('archLbImg');
      if (img){img.src=src;lbZoom=1;lbPanX=0;lbPanY=0;lbApplyTransform();}
    };
    window.archLbGoTo = idx=>{
      if (idx<0||idx>=imgs.length) return;
      lbImgIdx=idx;
      window.archLbSetImg(imgs[idx]);
      // Update thumbnails active
      document.querySelectorAll('.arch-lb-thumb').forEach((el,i)=>
        el.classList.toggle('active',i===idx));
      // Update counter
      const ctr=document.getElementById('archLbImgIdx');
      if(ctr) ctr.textContent=`${idx+1} / ${imgs.length}`;
      // Update size badge
      const badge=document.getElementById('archLbSizeBadge');
      if(badge){
        const sz=lbImgSizes[idx]||0;
        if(sz>0){ badge.textContent=fmtBytes(sz); badge.style.display=''; }
        else { badge.style.display='none'; }
      }
    };
    window.archLbNav = delta=>{
      window.archLbGoTo(lbImgIdx+delta);
    };

    const vp = overlay.querySelector('#archLbViewport');
    if (vp) {
      // Wheel zoom na kurzor
      vp.addEventListener('wheel',e=>{
        e.preventDefault();
        const r=vp.getBoundingClientRect();
        const mx=e.clientX-r.left-r.width/2, my=e.clientY-r.top-r.height/2;
        const dz=e.deltaY<0?0.15:-0.15;
        const nz=Math.min(8,Math.max(0.1,lbZoom+dz));
        lbPanX=mx+(lbPanX-mx)*(nz/lbZoom);
        lbPanY=my+(lbPanY-my)*(nz/lbZoom);
        lbZoom=nz; lbApplyTransform();
      },{passive:false});

      // Drag pan
      vp.addEventListener('mousedown',e=>{
        if(e.button!==0) return;
        lbDragging=true; lbDragStart={x:e.clientX-lbPanX,y:e.clientY-lbPanY};
        vp.style.cursor='grabbing'; e.preventDefault();
      });
      window.addEventListener('mousemove',e=>{
        if(!lbDragging||!lbDragStart) return;
        lbPanX=e.clientX-lbDragStart.x; lbPanY=e.clientY-lbDragStart.y; lbApplyTransform();
      });
      window.addEventListener('mouseup',()=>{ lbDragging=false; if(vp) vp.style.cursor='grab'; });

      // Touch pinch + pan
      let lbInitDist=0, lbInitZoom=1;
      vp.addEventListener('touchstart',e=>{
        if(e.touches.length===2){
          lbInitDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
          lbInitZoom=lbZoom;
        } else if(e.touches.length===1){
          lbDragging=true; lbDragStart={x:e.touches[0].clientX-lbPanX,y:e.touches[0].clientY-lbPanY};
        }
        e.preventDefault();
      },{passive:false});
      vp.addEventListener('touchmove',e=>{
        if(e.touches.length===2&&lbInitDist>0){
          const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
          lbZoom=Math.min(8,Math.max(0.1,lbInitZoom*(d/lbInitDist))); lbApplyTransform();
        } else if(e.touches.length===1&&lbDragging&&lbDragStart){
          lbPanX=e.touches[0].clientX-lbDragStart.x; lbPanY=e.touches[0].clientY-lbDragStart.y; lbApplyTransform();
        }
        e.preventDefault();
      },{passive:false});
      vp.addEventListener('touchend',()=>{ lbDragging=false; lbInitDist=0; });

      // Double-click reset
      vp.addEventListener('dblclick',()=>{ lbZoom=1;lbPanX=0;lbPanY=0;lbApplyTransform(); });

      // Keyboard nav
      const onKey=e=>{
        if(e.key==='ArrowRight') window.archLbNav(1);
        if(e.key==='ArrowLeft')  window.archLbNav(-1);
        if(e.key==='Escape'){ overlay.remove(); window.removeEventListener('keydown',onKey); }
      };
      window.addEventListener('keydown',onKey);
      const origRemove=overlay.remove.bind(overlay);
      overlay.remove=()=>{ window.archLbZoom=null;window.archLbZoomReset=null;window.archLbSetImg=null;window.archLbGoTo=null;window.archLbNav=null; origRemove(); };
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  //  EXPORT / IMPORT INTEGRÁCIA — POKYNY:
  //
  //  V tvojom exportData() pridaj:
  //    async function exportData() {
  //      const imgMap = await Archive.getImagesForExport();
  //      const json = JSON.stringify({ ...data, _archiveImages: imgMap });
  //      // stiahni json ako súbor...
  //    }
  //
  //  V tvojom importData() po parsovaní JSON pridaj:
  //    if (parsed._archiveImages) {
  //      await Archive.restoreImages(parsed._archiveImages);
  //      delete parsed._archiveImages;
  //    }
  //    // potom nastav data = parsed
  // ══════════════════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════════════════
  //  ARCHIVE EXPORT / IMPORT
  // ══════════════════════════════════════════════════════════════════════
  async function exportArchive() {
    const arch = (typeof data !== 'undefined' && data.archive)
      ? data.archive : { folders: [], items: [] };

    const imgMap = await collectImagesForExport();
    const payload = {
      _type: 'chronicle_archive',
      _exportedAt: new Date().toISOString(),
      archive: JSON.parse(JSON.stringify(arch)),
      _archiveImages: imgMap,
    };

    let jsonStr;
    try { jsonStr = JSON.stringify(payload); }
    catch(e) { if (typeof showToast==='function') showToast('Export error: ' + e.message); return; }

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href     = url;
    a.download = 'archive_' + date + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    if (typeof showToast === 'function') showToast('Archive exported (' + (arch.items||[]).length + ' items) ✦');
  }

  function importArchive() {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async ev => {
        let parsed;
        try { parsed = JSON.parse(ev.target.result); }
        catch(err) {
          if (typeof showToast==='function') showToast('Error: Invalid JSON — ' + err.message);
          return;
        }
        if (parsed._type !== 'chronicle_archive') {
          if (typeof showToast==='function') showToast('This is not an Archive export file.');
          return;
        }
        // Obnov obrázky
        if (parsed._archiveImages) {
          await restoreImagesFromImport(parsed._archiveImages);
        }
        // Nastav archívne dáta
        if (typeof data !== 'undefined' && parsed.archive) {
          data.archive = parsed.archive;
          if (typeof autoSave === 'function') autoSave();
          renderArchive();
          if (typeof showToast==='function') showToast('Archive imported (' + (parsed.archive.items||[]).length + ' items) ✦');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // ── Verejné API ──────────────────────────────────────────────────────────
  return {
    setFolder, createFolder, editFolder, deleteFolder,
    setView, setSearch, setTypeFilter, goToPage,
    openUploadModal, openEditModal, deleteItem,
    openLightbox,
    _saveModal: saveModal,
    _removeImg: removeImg,
    // Export / import obrázkov (pre hlavný export/import)
    getImagesForExport: collectImagesForExport,
    restoreImages: restoreImagesFromImport,
    // Samostatný archive export/import
    exportArchive,
    importArchive,
  };
})();
