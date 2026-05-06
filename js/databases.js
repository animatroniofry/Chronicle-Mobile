// ─── Helper: rozdelí description na čistý popis a At Higher Levels text ───────
function _slSplitDescHigher(desc) {
  if (!desc) return { cleanDesc: '', higherText: '' };
  const match = desc.match(/^([\s\S]*?)\s*At Higher Levels[:\.]?\s*([\s\S]*)$/i);
  if (!match) return { cleanDesc: desc.trim(), higherText: '' };
  return { cleanDesc: match[1].trim(), higherText: match[2].trim() };
}

function initCustomDB() {
  if (!data.customSpells) data.customSpells = [];
  if (!data.customItems) data.customItems = [];
  if (!data.customMonsters) data.customMonsters = [];
}

function getAllSpells() {
  initCustomDB();
  return [...SPELL_DB, ...data.customSpells];
}

function getAllItems() {
  initCustomDB();
  return [...EQUIPMENT_DB, ...MAGIC_ITEM_DB, ...data.customItems];
}

const SCHOOL_NAMES = {"Abj": "Abjuration", "Conj": "Conjuration", "Div": "Divination", "Ench": "Enchantment", "Evo": "Evocation", "Ill": "Illusion", "Necro": "Necromancy", "Trans": "Transmutation"};
const LEVEL_LABELS = ['Cantrip','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
const SCHOOL_COLORS = {
  'Abj':'#4a90d9','Conj':'#9b59b6','Div':'#1abc9c','Ench':'#e91e63',
  'Evo':'#e74c3c','Ill':'#8e44ad','Necro':'#2c3e50','Trans':'#e67e22',
  '':'#8a6a28'
};

function clearSpellFilters() {
  document.getElementById('slSearch').value='';
  document.getElementById('slLevel').value='';
  document.getElementById('slClass').value='';
  document.getElementById('slSchool').value='';
  document.getElementById('slConc').checked=false;
  document.getElementById('slRitual').checked=false;
  renderSpellList();
}

function clearItemFilters() {
  const ids = ['itSearch','itMaxCost'];
  ids.forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  ['itCategory','itSubCategory','itRarity','itSort'].forEach(id => {
    const el = document.getElementById(id); if(el) el.selectedIndex=0;
  });
  updateSubcategoryFilter();
  renderItemList();
}


function renderSpellList() {
  const search = (document.getElementById('slSearch')?.value||'').toLowerCase();
  const level = document.getElementById('slLevel')?.value;
  const cls = document.getElementById('slClass')?.value;
  const school = document.getElementById('slSchool')?.value;
  const conc = document.getElementById('slConc')?.checked;
  const ritual = document.getElementById('slRitual')?.checked;

  let spells = getAllSpells().filter(s => {
    // Filter out hidden built-in spells
    if (!s._custom && data.hiddenSpells && data.hiddenSpells.includes(s.name + '|' + s.level)) return false;
    if (level !== '' && s.level !== parseInt(level)) return false;
    if (school && s.school !== school) return false;
    if (cls && !s.class.includes(cls)) return false;
    if (conc && !s.concentration) return false;
    if (ritual && !s.ritual) return false;
    if (search && !s.name.toLowerCase().includes(search) && !s.description.toLowerCase().includes(search)) return false;
    return true;
  });

  spells.sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));
  
  const countEl = document.getElementById('slCount');
  if (countEl) countEl.textContent = `${spells.length} spell${spells.length!==1?'s':''} found`;

  const tableEl = document.getElementById('slTable');
  if (!tableEl) return;

  if (spells.length === 0) {
    tableEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;">No spells match the current filters</div>';
    return;
  }

  // Group by level
  const byLevel = {};
  spells.forEach(s => {
    if (!byLevel[s.level]) byLevel[s.level] = [];
    byLevel[s.level].push(s);
  });

  // Store spells in a lookup array for safe access from buttons
  window._slSpellCache = spells;

  let html = '';
  Object.keys(byLevel).sort((a,b)=>+a-+b).forEach(lvl => {
    const lvlLabel = LEVEL_LABELS[+lvl] || lvl;
    html += `<div style="font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent-gold);border-bottom:1px solid var(--border-gold);padding-bottom:5px;margin:16px 0 8px;">✦ ${lvlLabel==='Cantrip'?'Cantrips':lvlLabel+' Level Spells'}</div>`;
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:8px;">';
    byLevel[lvl].forEach((s) => {
      const schoolColor = SCHOOL_COLORS[s.school]||'#8a6a28';
      const isCustom = !!s._custom;
      // Find global index in the cache for safe button referencing
      const cacheIdx = window._slSpellCache.indexOf(s);
      html += `<div class="panel panel-sm" style="cursor:pointer;position:relative;border-left:3px solid ${schoolColor};" onclick="toggleSpellExpand(this)">
        <div style="display:flex;align-items:start;gap:8px;">
          <div style="flex:1;">
            <div style="font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:var(--text-primary);">${s.name}${s.ritual?' <span style="font-size:10px;color:#1abc9c;letter-spacing:1px;">[R]</span>':''}${s.concentration?' <span style="font-size:10px;color:#e67e22;letter-spacing:1px;">[C]</span>':''}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;align-items:center;">
              <span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:${schoolColor};background:${schoolColor}18;border:1px solid ${schoolColor}44;border-radius:3px;padding:1px 6px;">${SCHOOL_NAMES[s.school]||s.school}</span>
              ${s.castTime?`<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);">⏱ ${s.castTime}</span>`:''}
              ${s.range?`<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);">◎ ${s.range}</span>`:''}
              ${s.duration?`<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);">⧗ ${s.duration}</span>`:''}
              ${s.components?`<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);">${s.components}</span>`:''}
              ${s.class?`<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);font-style:italic;">${s.class}</span>`:''}
            </div>
          </div>
          <div style="display:flex;gap:4px;">
            ${isCustom?`<button class="btn btn-silver btn-sm" style="padding:3px 7px;font-size:10px;" onclick="event.stopPropagation();editCustomSpell('${s._id}')" title="Edit">✎</button><button class="btn btn-danger btn-sm" style="padding:3px 7px;font-size:10px;" onclick="event.stopPropagation();deleteCustomSpell('${s._id}')" title="Delete">✕</button>`:
              `<button class="btn btn-silver btn-sm" style="padding:3px 7px;font-size:10px;" onclick="event.stopPropagation();editBuiltinSpellByIdx(${cacheIdx})" title="Edit">✎</button>
               <button class="btn btn-danger btn-sm" style="padding:3px 7px;font-size:10px;" onclick="event.stopPropagation();hideBuiltinSpellByIdx(${cacheIdx})" title="Hide from list">✕</button>`}
            <button class="btn btn-primary btn-sm" style="padding:3px 7px;font-size:10px;" onclick="event.stopPropagation();addSpellToBookByIdx(${cacheIdx})" title="Add to Spellbook">+ Book</button>
          </div>
        </div>
        <div class="spell-desc-expand" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-dark);">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin-bottom:10px;">
            ${s.castTime?`<div style="background:var(--bg-input);border:1px solid var(--border-dark);border-radius:4px;padding:5px 8px;"><div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);margin-bottom:2px;">&#9201; CASTING TIME</div><div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-primary);">${s.castTime}</div></div>`:''}
            ${s.range?`<div style="background:var(--bg-input);border:1px solid var(--border-dark);border-radius:4px;padding:5px 8px;"><div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);margin-bottom:2px;">&#9678; RANGE</div><div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-primary);">${s.range}</div></div>`:''}
            ${s.duration?`<div style="background:var(--bg-input);border:1px solid var(--border-dark);border-radius:4px;padding:5px 8px;"><div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);margin-bottom:2px;">&#10711; DURATION</div><div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-primary);">${s.duration}</div></div>`:''}
            ${s.components?`<div style="background:var(--bg-input);border:1px solid var(--border-dark);border-radius:4px;padding:5px 8px;"><div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);margin-bottom:2px;">&#9672; COMPONENTS</div><div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-primary);">${s.components}</div></div>`:''}
          </div>
          <div style="font-family:'Crimson Text',serif;font-size:16px;color:var(--text-secondary);line-height:1.6;">${(()=>{const sp=_slSplitDescHigher(s.description||'');return sp.cleanDesc||'No description.';})()}</div>
          ${(()=>{const ht=s.higher||_slSplitDescHigher(s.description||'').higherText;return ht?`<div style="margin-top:6px;font-family:'Crimson Text',serif;font-size:17px;color:var(--accent-gold);font-style:italic;"><strong>At Higher Levels:</strong> ${ht}</div>`:'';})()}
        </div>
      </div>`;
    });
    html += '</div>';
  });

  tableEl.innerHTML = html;
}

function toggleSpellExpand(el) {
  const desc = el.querySelector('.spell-desc-expand');
  if (desc) desc.style.display = desc.style.display==='none' ? 'block' : 'none';
}

function addSpellToBookByIdx(idx) {
  try {
    const s = window._slSpellCache && window._slSpellCache[idx];
    if (!s) { showToast('Chyba: kuzlo sa nenaslo.'); return; }
    _addSpellToBookObj(s);
  } catch(e) { console.error(e); }
}

function addSpellToBook(encoded) {
  try {
    const s = JSON.parse(decodeURIComponent(encoded));
    _addSpellToBookObj(s);
  } catch(e) { console.error(e); }
}

function _addSpellToBookObj(s) {
    initCustomDB();
    if (!data.spells) data.spells = [];
    const already = data.spells.find(x => x.name === s.name && x.level === s.level);
    if (already) {
      showToast(s.name + ' je uz v tvojom Spellbooku');
      return;
    }
    // Rozdelíme description na čistý popis a At Higher Levels text
    const _bookSplit = _slSplitDescHigher(s.description || s.desc || '');
    const newSpell = {
      id: 'sp_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      name: s.name,
      level: s.level,
      school: SCHOOL_NAMES[s.school] || s.school || '',
      castTime: s.castTime || '',
      range: s.range || '',
      duration: s.duration || '',
      components: s.components || '',
      desc: _bookSplit.cleanDesc,
      higher: s.higher || _bookSplit.higherText || '',
      prepared: false,
      concentration: !!s.concentration,
      ritual: !!s.ritual
    };
    data.spells.push(newSpell);
    autoSave();
    renderSpells();
    showToast(s.name + ' pridane do Spellbooku (Level ' + (s.level === 0 ? 'Cantrip' : s.level) + ')');
}

function openAddSpellModal() {
  initCustomDB();
  showModal('Add Custom Spell', `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div class="field"><label>Spell Name</label><input type="text" id="cspName" placeholder="Name…"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <div class="field"><label>Level (0=Cantrip)</label><input type="number" id="cspLevel" value="1" min="0" max="9"></div>
        <div class="field"><label>School</label><select id="cspSchool"><option value="Abj">Abjuration</option><option value="Conj">Conjuration</option><option value="Div">Divination</option><option value="Ench">Enchantment</option><option value="Evo">Evocation</option><option value="Ill">Illusion</option><option value="Necro">Necromancy</option><option value="Trans">Transmutation</option></select></div>
        <div class="field"><label>Class(es)</label><input type="text" id="cspClass" placeholder="Wizard, Sorcerer…"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <div class="field"><label>Casting Time</label><select id="cspCast"><option value="1 action">1 Action</option><option value="1 bonus action">Bonus Action</option><option value="1 reaction">Reaction</option><option value="1 minute">1 Minute</option><option value="10 minutes">10 Minutes</option><option value="1 hour">1 Hour</option></select></div>
        <div class="field"><label>Range</label><input type="text" id="cspRange" placeholder="60 ft / Self / Touch"></div>
        <div class="field"><label>Duration</label><input type="text" id="cspDuration" placeholder="Instantaneous / 1 hour…"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;">
        <div class="field"><label>Components</label><input type="text" id="cspComp" placeholder="V, S, M (material…)"></div>
        <div style="display:flex;gap:12px;align-items:center;padding-bottom:8px;">
          <label style="display:flex;gap:5px;align-items:center;cursor:pointer;"><input type="checkbox" id="cspConc"> Conc.</label>
          <label style="display:flex;gap:5px;align-items:center;cursor:pointer;"><input type="checkbox" id="cspRitual"> Ritual</label>
        </div>
      </div>
      <div class="field"><label>Description</label><textarea id="cspDesc" rows="4" placeholder="Describe the spell effect…"></textarea></div>
      <div class="field"><label>At Higher Levels</label><input type="text" id="cspHigher" placeholder="When cast using a higher level slot…"></div>
    </div>
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Add Spell', action:'saveCustomSpell()', cls:'btn-primary'}
  ]);
}

function saveCustomSpell(id) {
  const name = document.getElementById('cspName')?.value?.trim();
  if (!name) { showToast('Spell name is required'); return; }
  initCustomDB();
  const spell = {
    _custom: true,
    _id: id || 'csp_' + Date.now(),
    name,
    level: parseInt(document.getElementById('cspLevel')?.value||1),
    school: document.getElementById('cspSchool')?.value||'Abj',
    castTime: document.getElementById('cspCast')?.value||'1 action',
    range: document.getElementById('cspRange')?.value||'',
    duration: document.getElementById('cspDuration')?.value||'',
    components: document.getElementById('cspComp')?.value||'',
    class: document.getElementById('cspClass')?.value||'Custom',
    concentration: document.getElementById('cspConc')?.checked||false,
    ritual: document.getElementById('cspRitual')?.checked||false,
    description: document.getElementById('cspDesc')?.value||'',
    higher: document.getElementById('cspHigher')?.value||''
  };
  if (id) {
    const idx = data.customSpells.findIndex(s=>s._id===id);
    if (idx>=0) data.customSpells[idx] = spell;
  } else {
    data.customSpells.push(spell);
  }
  autoSave();
  closeModal();
  renderSpellList();
  showToast(`${name} added to Spell List ✦`);
}

function editCustomSpell(id) {
  initCustomDB();
  const s = data.customSpells.find(x=>x._id===id);
  if (!s) return;
  openAddSpellModal();
  setTimeout(()=>{
    document.getElementById('cspName').value = s.name||'';
    document.getElementById('cspLevel').value = s.level||1;
    document.getElementById('cspSchool').value = s.school||'Abj';
    // Normalize castTime for select compatibility (DB uses "Action" etc.)
    const _cMap = {'Action':'1 action','Bonus Action':'1 bonus action','Reaction':'1 reaction','Long':'1 minute'};
    document.getElementById('cspCast').value = _cMap[s.castTime] || s.castTime || '1 action';
    document.getElementById('cspRange').value = s.range||'';
    document.getElementById('cspDuration').value = s.duration||'';
    document.getElementById('cspComp').value = s.components||'';
    document.getElementById('cspClass').value = s.class||'';
    document.getElementById('cspConc').checked = !!s.concentration;
    document.getElementById('cspRitual').checked = !!s.ritual;
    const _cSplit = _slSplitDescHigher(s.description || '');
    document.getElementById('cspDesc').value = _cSplit.cleanDesc || s.description || '';
    document.getElementById('cspHigher').value = s.higher || _cSplit.higherText || '';
    // Patch save button
    document.querySelector('.modal-actions button:last-child').onclick = ()=>saveCustomSpell(id);
  }, 50);
}

function deleteCustomSpell(id) {
  initCustomDB();
  showModal('Delete Spell', '<p style="color:var(--text-secondary);font-size:15px;">Remove this custom spell from the list?</p>', [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Delete', action:`data.customSpells=data.customSpells.filter(s=>s._id!=='${id}');autoSave();closeModal();renderSpellList();showToast('Spell removed');`, cls:'btn-danger'}
  ]);
}

function editBuiltinSpellByIdx(idx) {
  const s = window._slSpellCache && window._slSpellCache[idx];
  if (!s) { showToast('Spell not found'); return; }
  editBuiltinSpell(encodeURIComponent(s.name), s.level);
}

function hideBuiltinSpellByIdx(idx) {
  const s = window._slSpellCache && window._slSpellCache[idx];
  if (!s) return;
  hideBuiltinSpellByKey(encodeURIComponent(s.name), s.level);
}

function editBuiltinSpell(encodedName, level) {
  initCustomDB();
  try {
    const name = decodeURIComponent(encodedName);
    // Find the spell in the database
    const s = getAllSpells().find(x => x.name === name && x.level === level);
    if (!s) { showToast('Spell not found'); return; }
    openAddSpellModal();
    setTimeout(() => {
      document.getElementById('cspName').value = s.name || '';
      document.getElementById('cspLevel').value = s.level || 0;
      document.getElementById('cspSchool').value = s.school || 'Abj';
      // Normalize castTime: DB uses "Action","Bonus Action","Reaction","Long" but select uses lowercase full strings
      const castMap = {
        'Action': '1 action',
        'Bonus Action': '1 bonus action',
        'Reaction': '1 reaction',
        'Long': '1 minute',
        '1 action': '1 action',
        '1 bonus action': '1 bonus action',
        '1 reaction': '1 reaction',
        '1 minute': '1 minute',
        '10 minutes': '10 minutes',
        '1 hour': '1 hour'
      };
      const castVal = castMap[s.castTime] || '1 action';
      document.getElementById('cspCast').value = castVal;
      document.getElementById('cspRange').value = s.range || '';
      document.getElementById('cspDuration').value = s.duration || '';
      document.getElementById('cspComp').value = s.components || '';
      document.getElementById('cspClass').value = s.class || '';
      document.getElementById('cspConc').checked = !!s.concentration;
      document.getElementById('cspRitual').checked = !!s.ritual;
      const _bSplit = _slSplitDescHigher(s.description || '');
      document.getElementById('cspDesc').value = _bSplit.cleanDesc;
      document.getElementById('cspHigher').value = s.higher || _bSplit.higherText || '';
      // Check if custom override already exists
      const existingCustom = data.customSpells.find(x => x.name === s.name && x.level === s.level);
      if (existingCustom) {
        // Update existing custom override
        document.querySelector('.modal-actions button:last-child').onclick = () => saveCustomSpell(existingCustom._id);
      } else {
        // Create new custom override and hide the built-in
        document.querySelector('.modal-actions button:last-child').onclick = () => {
          hideBuiltinSpellSilent(s.name, s.level);
          saveCustomSpell();
        };
      }
    }, 50);
  } catch(e) { console.error(e); }
}

function hideBuiltinSpellByKey(encodedName, level) {
  const name = decodeURIComponent(encodedName);
  showModal('Remove from List',
    `<p style="color:var(--text-secondary);font-size:15px;">Hide <b>${name}</b> from the spell list?<br><small style="color:var(--text-muted);">You can restore it with the ↺ Restore Hidden button.</small></p>`,
    [
      {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
      {label:'Remove', action:`hideBuiltinSpellConfirmed('${encodedName}',${level});closeModal();renderSpellList();showToast('Spell hidden ✦');`, cls:'btn-danger'}
    ]
  );
}

function hideBuiltinSpell(encodedStr) {
  try {
    const s = JSON.parse(decodeURIComponent(encodedStr));
    hideBuiltinSpellByKey(encodeURIComponent(s.name), s.level);
  } catch(e) { console.error(e); }
}

function hideBuiltinSpellConfirmed(encodedName, level) {
  initCustomDB();
  const name = decodeURIComponent(encodedName);
  if (!data.hiddenSpells) data.hiddenSpells = [];
  const key = name + '|' + level;
  if (!data.hiddenSpells.includes(key)) data.hiddenSpells.push(key);
  autoSave();
}

function hideBuiltinSpellSilent(name, level) {
  initCustomDB();
  if (!data.hiddenSpells) data.hiddenSpells = [];
  const key = name + '|' + level;
  if (!data.hiddenSpells.includes(key)) data.hiddenSpells.push(key);
}

function restoreAllHiddenSpells() {
  initCustomDB();
  data.hiddenSpells = [];
  autoSave();
  renderSpellList();
  showToast('All hidden spells restored ✦');
}

// ═══════════════════════════════════════════
//  ITEM COMPENDIUM
// ═══════════════════════════════════════════
function parseGP(costStr) {
  if (!costStr) return 0;
  let total = 0;
  const ppM = costStr.match(/([\d.]+)\s*PP/i); if(ppM) total += parseFloat(ppM[1])*100;
  const gpM = costStr.match(/([\d.]+)\s*GP/i); if(gpM) total += parseFloat(gpM[1]);
  const spM = costStr.match(/([\d.]+)\s*SP/i); if(spM) total += parseFloat(spM[1])*0.1;
  const cpM = costStr.match(/([\d.]+)\s*CP/i); if(cpM) total += parseFloat(cpM[1])*0.01;
  const cbM = costStr.match(/([\d.]+)\s*CB/i); if(cbM) total += parseFloat(cbM[1])*0.001;
  return total;
}

function updateSubcategoryFilter() {
  const cat = document.getElementById('itCategory')?.value || '';
  const subSel = document.getElementById('itSubCategory');
  const rarityWrap = document.getElementById('rarityWrapper');
  if (!subSel) return;
  subSel.innerHTML = '<option value="">All Subcategories</option>';

  // Show/hide rarity for magic items
  if (rarityWrap) rarityWrap.style.display = (cat === 'Magic Item' || cat === '') ? 'block' : 'none';

  // Build subcategory options from current data
  const all = getAllItems();
  const types = new Set();
  for (const item of all) {
    if (!cat || item.category === cat) {
      if (item.type) types.add(item.type);
    }
  }
  const sorted = [...types].sort();
  for (const t of sorted) {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    subSel.appendChild(opt);
  }
}

function renderItemList() {
  const search    = (document.getElementById('itSearch')?.value||'').toLowerCase();
  const cat       = document.getElementById('itCategory')?.value || '';
  const subCat    = document.getElementById('itSubCategory')?.value || '';
  const rarity    = document.getElementById('itRarity')?.value || '';
  const sortBy    = document.getElementById('itSort')?.value || 'name';
  const maxCost   = parseFloat(document.getElementById('itMaxCost')?.value || '');

  let items = getAllItems().filter(item => {
    if (!item._custom && data.hiddenItems && data.hiddenItems.includes(item.name)) return false;
    if (cat && item.category !== cat) return false;
    if (subCat && item.type !== subCat) return false;
    if (rarity && item.rarity !== rarity) return false;
    if (search && !item.name.toLowerCase().includes(search)
                && !(item.description||'').toLowerCase().includes(search)
                && !(item.type||'').toLowerCase().includes(search)
                && !(item.properties||'').toLowerCase().includes(search)) return false;
    if (!isNaN(maxCost) && maxCost > 0) {
      const gp = parseGP(item.cost||'');
      if (gp > maxCost) return false;
    }
    return true;
  });

  // Sort
  const RARITY_ORDER = {'Common':1,'Uncommon':2,'Rare':3,'Very Rare':4,'Legendary':5,'Artifact':6,'Varies':7};
  if (sortBy === 'name')     items.sort((a,b) => a.name.localeCompare(b.name));
  else if (sortBy === 'cost')    items.sort((a,b) => parseGP(a.cost||'') - parseGP(b.cost||''));
  else if (sortBy === 'weight')  items.sort((a,b) => parseFloat(a.weight||0) - parseFloat(b.weight||0));
  else if (sortBy === 'category')items.sort((a,b) => (a.category||'').localeCompare(b.category||'') || a.name.localeCompare(b.name));
  else if (sortBy === 'rarity')  items.sort((a,b) => (RARITY_ORDER[a.rarity]||99) - (RARITY_ORDER[b.rarity]||99) || a.name.localeCompare(b.name));

  const countEl = document.getElementById('itCount');
  if (countEl) countEl.textContent = `${items.length} item${items.length!==1?'s':''} found`;

  const tableEl = document.getElementById('itTable');
  if (!tableEl) return;

  if (items.length === 0) {
    tableEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;">No items match the current filters</div>';
    return;
  }

  const CAT_COLORS = {
    'Quest Item': '#c060a0',
    'Armor':'#4a90d9','Weapon':'#e74c3c','Gear':'#27ae60','Magic Item':'#9b59b6',
    'Tool':'#e67e22','Kit':'#16a085','Ammunition':'#c0392b','Consumable':'#d35400',
    'Food & Drink':'#8e44ad','Mount & Vehicle':'#2980b9','Holy Symbol':'#f39c12',
    'Arcane Focus':'#1abc9c',
    'Ingredient':'#e67e22'
  };
  const RARITY_COLORS = {
    'Common':'#aaa','Uncommon':'#1eff00','Rare':'#0070dd','Very Rare':'#a335ee','Legendary':'#ff8000','Artifact':'#e6cc80'
  };

  let out = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-family:\'Crimson Text\',serif;font-size:16px;">';
  out += `<thead><tr style="border-bottom:2px solid var(--border-gold);">
    <th style="text-align:left;padding:8px 10px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--accent-gold);">Name</th>
    <th style="text-align:left;padding:8px 10px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--accent-gold);">Type</th>
    <th style="text-align:left;padding:8px 10px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--accent-gold);">Cost</th>
    <th style="text-align:left;padding:8px 10px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--accent-gold);">Weight</th>
    <th style="text-align:left;padding:8px 10px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--accent-gold);">Properties / Details</th>
    <th style="padding:8px 10px;"></th>
  </tr></thead><tbody>`;

  // Use a global cache so button onclick doesn't break on special chars
  window._itemCache = window._itemCache || {};
  let itemCacheIdx = 0;

  for (const item of items) {
    const cc = CAT_COLORS[item.category] || '#888';
    const rc = RARITY_COLORS[item.rarity] || '';
    const cacheKey = 'itm_' + (itemCacheIdx++);
    window._itemCache[cacheKey] = item;

    // Build details cell
    let details = [];
    if (item.ac) details.push(`AC: ${item.ac}`);
    if (item.damage) details.push(`⚔ ${item.damage}`);
    if (item.properties) details.push(item.properties);
    if (item.stealth) details.push(`Stealth: ${item.stealth}`);
    if (item.speed) details.push(`Speed: ${item.speed}`);
    if (item.capacity) details.push(`Cap: ${item.capacity}`);
    if (item.rarity) details.push(`<span style="color:${rc};font-weight:600;">${item.rarity}</span>`);
    if (item.attunement === 'Y') details.push('<span style="color:#f0c060;">Attunement</span>');

    const detailStr = details.join(' · ') || (item.description ? item.description.slice(0,80)+'…' : '—');

    // Equip buttons — use cache key, no inline JSON
    let equipBtns = '';
    const kind = item._itemKind || (item.category === 'Weapon' ? 'weapon' : item.category === 'Armor' ? 'armor' : item.category === 'Magic Item' ? 'magic' : item.category === 'Quest Item' ? 'quest' : '');
    if (kind === 'weapon') {
      equipBtns = `<button class="equip-btn equip-weapon-btn btn-sm" title="Equip as Weapon" onclick="equipItemAsWeaponCached('${cacheKey}')">⚔</button>`;
    } else if (kind === 'armor') {
      equipBtns = `<button class="equip-btn equip-armor-btn btn-sm" title="Equip as Armor" onclick="equipItemAsArmorCached('${cacheKey}')">🛡</button>`;
    } else if (kind === 'magic' || item.category === 'Magic Item') {
      equipBtns = `<button class="equip-btn equip-magic-btn btn-sm" title="Add as Magic Item" onclick="equipItemAsMagicCached('${cacheKey}')">✨</button>`;
    } else if (kind === 'quest' || item.category === 'Quest Item') {
      equipBtns = `<button class="equip-btn btn-sm" title="Add to Quest Inventory" onclick="addQuestItemFromCompendiumCached('${cacheKey}')" style="color:#c060a0;border-color:#602040;background:rgba(96,32,64,0.18);">🗺</button>`;
    }
    const addInvBtn = `<button class="equip-btn equip-generic-btn btn-sm" title="Add to Inventory" onclick="addItemToInventoryCached('${cacheKey}')">📦</button>`;

    const isCustom = !!item._custom;
    const editBtn = isCustom
      ? `<button class="equip-btn btn-sm" title="Edit" onclick="editCustomItem('${item._id}')">✏</button>`
      : `<button class="equip-btn btn-sm" title="Edit/Override" onclick="editBuiltinItemCached('${cacheKey}')">✏</button>`;
    const hideBtn = isCustom
      ? `<button class="del-btn btn-sm" title="Delete" onclick="deleteCustomItem('${item._id}')">🗑</button>`
      : `<button class="del-btn btn-sm" title="Hide" onclick="hideBuiltinItemByName('${encodeURIComponent(item.name)}')">✕</button>`;

    out += `<tr style="border-bottom:1px solid var(--border-dark);transition:background 0.15s;cursor:pointer;" onclick="showItemFullText('${cacheKey}')" onmouseover="this.style.background='rgba(180,130,40,0.06)'" onmouseout="this.style.background=''">
      <td style="padding:8px 10px;font-weight:600;color:var(--text-primary);">${item.name}${item.description ? `<div style="font-size:11px;color:var(--text-muted);font-weight:400;margin-top:2px;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.description.slice(0,80)}${item.description.length>80?'…':''}</div>` : ''}</td>
      <td style="padding:8px 10px;white-space:nowrap;"><span style="background:${cc}22;color:${cc};border:1px solid ${cc}44;border-radius:3px;padding:2px 7px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;">${item.category === 'Quest Item' ? '🗺 '+item.category : item.category}</span><div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${item.type||''}</div></td>
      <td style="padding:8px 10px;font-family:'Cinzel',serif;font-size:12px;color:var(--accent-gold);white-space:nowrap;">${item.cost||'—'}</td>
      <td style="padding:8px 10px;font-size:12px;color:var(--text-secondary);white-space:nowrap;">${item.weight||'—'}</td>
      <td style="padding:8px 10px;font-size:12px;color:var(--text-secondary);">${detailStr}</td>
      <td style="padding:8px 6px;white-space:nowrap;text-align:right;" onclick="event.stopPropagation()">${equipBtns}${addInvBtn}${editBtn}${hideBtn}</td>
    </tr>`;
  }

  out += '</tbody></table></div>';
  tableEl.innerHTML = out;
}


function showInvItemDetail(i) {
  const item = data.inventory && data.inventory[i];
  if (!item) return;
  const kindColors = {weapon:'#c08030', armor:'#30a060', magic:'#a040c0', quest:'#c060a0'};
  const kindLabels = {weapon:'⚔ Weapon', armor:'🛡 Armor', magic:'✨ Magic Item', quest:'🗺 Quest Item'};
  const col = kindColors[item._itemKind] || 'var(--accent-gold)';
  const kindLabel = kindLabels[item._itemKind] || '📦 Item';

  // Build stat badges
  let badges = '';
  if (item._damage)     badges += `<span style="background:rgba(200,40,40,0.12);border:1px solid #aa303066;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#ee6060;">⚔ ${item._damage}</span>`;
  if (item._ac)         badges += `<span style="background:rgba(40,80,200,0.12);border:1px solid #3050aa66;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#6080ee;">🛡 AC ${item._ac}</span>`;
  if (item._range)      badges += `<span style="background:rgba(80,80,80,0.15);border:1px solid #44444466;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#aaa;">Range ${item._range}</span>`;
  if (item._properties) badges += `<span style="background:rgba(80,80,80,0.15);border:1px solid #44444466;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);">${item._properties}</span>`;
  if (item._armorType)  badges += `<span style="background:rgba(48,160,96,0.12);border:1px solid #30a06066;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#50d080;">${item._armorType}</span>`;
  if (item._stealthDis) badges += `<span style="background:rgba(200,96,64,0.12);border:1px solid #cc604066;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#cc6040;">Stealth Disadv.</span>`;
  if (item._rarity)     badges += `<span style="background:rgba(160,64,192,0.12);border:1px solid ${col}44;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:${col};">${item._rarity}</span>`;
  if (item._charges)    badges += `<span style="background:rgba(180,130,40,0.1);border:1px solid var(--border-gold);border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:var(--accent-gold);">Charges: ${item._charges}</span>`;
  if (item.cost)        badges += `<span style="background:rgba(180,130,40,0.1);border:1px solid var(--border-gold);border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:var(--accent-gold);">💰 ${item.cost}</span>`;
  if (item.weight)      badges += `<span style="background:rgba(80,80,80,0.15);border:1px solid #44444466;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#aaa;">⚖ ${item.weight} lb</span>`;

  // Wide modal overlay using a custom overlay so we can go wider
  const overlay = document.createElement('div');
  overlay.id = 'invDetailOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;';

  overlay.innerHTML = `
    <div style="background:linear-gradient(180deg,var(--bg-panel),var(--bg-dark));border:1px solid var(--border-gold);border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.9);width:100%;max-width:820px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border-gold);flex-shrink:0;">
        <div>
          <div style="font-family:'Cinzel',serif;font-size:17px;font-weight:700;color:var(--accent-gold-bright);letter-spacing:2px;">${item.name || 'Item Detail'}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap;">
            <span style="font-family:'Cinzel',serif;font-size:10px;color:${col};background:${col}18;border:1px solid ${col}44;border-radius:3px;padding:2px 8px;">${kindLabel}</span>
            <span style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-muted);">×${item.qty||1}</span>
            ${badges}
          </div>
        </div>
        <button onclick="saveAndCloseInvDetail(${i})" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer;padding:4px 8px;line-height:1;" title="Close">✕</button>
      </div>
      <!-- Body: two columns -->
      <div style="display:grid;grid-template-columns:1fr 280px;gap:0;flex:1;overflow:hidden;min-height:0;">
        <!-- Left: large Notes area -->
        <div style="display:flex;flex-direction:column;padding:16px;border-right:1px solid var(--border-dark);overflow:hidden;">
          <label style="font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:2px;color:var(--accent-gold);margin-bottom:6px;display:block;">📜 NOTES</label>
          <textarea id="invDetailNotes" style="flex:1;width:100%;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:4px;color:var(--text-primary);font-family:'Crimson Text',serif;font-size:16px;line-height:1.7;padding:10px 12px;resize:none;min-height:0;outline:none;" placeholder="Enter item description, its story, effects...">${(item.notes||'').replace(/</g,'&lt;')}</textarea>
        </div>
        <!-- Right: small My Notes -->
        <div style="display:flex;flex-direction:column;padding:16px;overflow:hidden;">
          <label style="font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:2px;color:var(--text-muted);margin-bottom:6px;display:block;">🗒 MY NOTES</label>
          <textarea id="invDetailMyNotes" style="flex:1;width:100%;background:var(--bg-mid);border:1px solid var(--border-dark);border-radius:4px;color:var(--text-secondary);font-family:'Crimson Text',serif;font-size:16px;line-height:1.6;padding:8px 10px;resize:none;min-height:0;outline:none;" placeholder="Personal notes, reminders...">${(item.myNotes||'').replace(/</g,'&lt;')}</textarea>
          <!-- Qty -->
          <div style="margin-top:12px;">
            <label style="font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:2px;color:var(--text-muted);display:block;margin-bottom:4px;">QUANTITY</label>
            <input type="number" id="invDetailQty" value="${item.qty||1}" min="0" style="width:100%;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:4px;color:var(--text-primary);font-family:'Crimson Text',serif;font-size:16px;padding:6px 10px;outline:none;">
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:12px 20px;border-top:1px solid var(--border-dark);flex-shrink:0;">
        <button onclick="saveAndCloseInvDetail(${i})" style="font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:1.5px;padding:8px 20px;background:linear-gradient(135deg,var(--bg-card),var(--bg-dark));border:1px solid var(--border-gold);border-radius:4px;color:var(--accent-gold-bright);cursor:pointer;">SAVE & CLOSE</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) saveAndCloseInvDetail(i); });
}

function saveAndCloseInvDetail(i) {
  const item = data.inventory && data.inventory[i];
  if (item) {
    const notesEl = document.getElementById('invDetailNotes');
    const myNotesEl = document.getElementById('invDetailMyNotes');
    const qtyEl = document.getElementById('invDetailQty');
    if (notesEl)   item.notes   = notesEl.value;
    if (myNotesEl) item.myNotes = myNotesEl.value;
    if (qtyEl)     item.qty     = parseInt(qtyEl.value) || 0;
    autoSave();
    renderInventory();
  }
  const ov = document.getElementById('invDetailOverlay');
  if (ov) ov.remove();
}

function showItemFullText(cacheKey) {
  const item = window._itemCache && window._itemCache[cacheKey];
  if (!item) return;
  const rc = {'Common':'#aaa','Uncommon':'#1eff00','Rare':'#0070dd','Very Rare':'#a335ee','Legendary':'#ff8000','Artifact':'#e6cc80'}[item.rarity] || 'var(--accent-gold)';
  const desc = (item.description || '').replace(/\*\*\*(.*?)\*\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');

  // Load saved myNotes for this compendium item
  if (!window._itemMyNotes) window._itemMyNotes = {};
  const savedMyNotes = window._itemMyNotes[cacheKey] || '';

  const overlay = document.createElement('div');
  overlay.id = 'itemFullTextOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;';

  overlay.innerHTML = `
    <div style="background:linear-gradient(180deg,var(--bg-panel),var(--bg-dark));border:1px solid var(--border-gold);border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.9);width:100%;max-width:860px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border-gold);flex-shrink:0;">
        <div>
          <div style="font-family:'Cinzel',serif;font-size:17px;font-weight:700;color:var(--accent-gold-bright);letter-spacing:2px;">${item.name}</div>
          <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);margin-top:4px;letter-spacing:1px;">${item.category}${item.type?' · '+item.type:''}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
            ${item.cost?`<span style="background:rgba(180,130,40,0.1);border:1px solid var(--border-gold);border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:var(--accent-gold);">💰 ${item.cost}</span>`:''}
            ${item.weight?`<span style="background:rgba(80,80,80,0.2);border:1px solid #444;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#aaa;">⚖ ${item.weight}</span>`:''}
            ${item.rarity?`<span style="background:rgba(80,80,80,0.2);border:1px solid ${rc}44;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:${rc};">${item.rarity}</span>`:''}
            ${item.attunement==='Y'?`<span style="background:rgba(240,192,96,0.1);border:1px solid #c0a040;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#c0a040;">Attunement</span>`:''}
            ${item.damage?`<span style="background:rgba(200,40,40,0.1);border:1px solid #aa3030;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#ee6060;">⚔ ${item.damage}</span>`:''}
            ${item.ac?`<span style="background:rgba(40,80,200,0.1);border:1px solid #3050aa;border-radius:3px;padding:2px 8px;font-family:'Cinzel',serif;font-size:10px;color:#6080ee;">🛡 ${item.ac}</span>`:''}
            ${item.properties?`<span style="font-size:10px;color:var(--text-muted);align-self:center;font-family:'Cinzel',serif;">${item.properties}</span>`:''}
          </div>
        </div>
        <button onclick="document.getElementById('itemFullTextOverlay').remove()" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer;padding:4px 8px;line-height:1;" title="Close">✕</button>
      </div>
      <!-- Body: two columns -->
      <div style="display:grid;grid-template-columns:1fr 280px;gap:0;flex:1;overflow:hidden;min-height:0;">
        <!-- Left: description fulltext (read-only scroll) -->
        <div style="display:flex;flex-direction:column;padding:16px;border-right:1px solid var(--border-dark);overflow:hidden;">
          <label style="font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:2px;color:var(--accent-gold);margin-bottom:6px;display:block;">📜 DESCRIPTION</label>
          <div style="flex:1;overflow-y:auto;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:4px;padding:12px 14px;font-family:'Crimson Text',serif;font-size:16px;line-height:1.75;color:var(--text-secondary);">
            ${desc || '<span style="color:var(--text-muted);font-style:italic;">No description.</span>'}
          </div>
        </div>
        <!-- Right: My Notes editable -->
        <div style="display:flex;flex-direction:column;padding:16px;overflow:hidden;">
          <label style="font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:2px;color:var(--text-muted);margin-bottom:6px;display:block;">🗒 MY NOTES</label>
          <textarea id="compendiumMyNotes" style="flex:1;width:100%;background:var(--bg-mid);border:1px solid var(--border-dark);border-radius:4px;color:var(--text-secondary);font-family:'Crimson Text',serif;font-size:16px;line-height:1.6;padding:8px 10px;resize:none;min-height:0;outline:none;" placeholder="Personal notes, reminders...">${savedMyNotes.replace(/</g,'&lt;')}</textarea>
        </div>
      </div>
      <!-- Footer -->
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:12px 20px;border-top:1px solid var(--border-dark);flex-shrink:0;">
        <button onclick="saveCompendiumMyNotes('${cacheKey.replace(/'/g,"\\'")}');document.getElementById('itemFullTextOverlay').remove();" style="font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:1.5px;padding:8px 20px;background:linear-gradient(135deg,var(--bg-card),var(--bg-dark));border:1px solid var(--border-gold);border-radius:4px;color:var(--accent-gold-bright);cursor:pointer;">SAVE & CLOSE</button>
        <button onclick="document.getElementById('itemFullTextOverlay').remove()" style="font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:1.5px;padding:8px 16px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:4px;color:var(--text-secondary);cursor:pointer;">CLOSE</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) { saveCompendiumMyNotes(cacheKey); overlay.remove(); } });
}

function saveCompendiumMyNotes(cacheKey) {
  if (!window._itemMyNotes) window._itemMyNotes = {};
  const el = document.getElementById('compendiumMyNotes');
  if (el) {
    window._itemMyNotes[cacheKey] = el.value;
    // Persist in data so it saves with the sheet
    if (!data.compendiumMyNotes) data.compendiumMyNotes = {};
    data.compendiumMyNotes[cacheKey] = el.value;
    autoSave();
  }
}

function toggleItemRow(tr) {
  const next = tr.nextElementSibling;
  if (next && next.classList.contains('item-expand-row')) {
    next.style.display = next.style.display==='none'?'table-row':'none';
  }
}

function addItemToEquipment(encoded) {
  try {
    const item = JSON.parse(decodeURIComponent(encoded));
    const isWeapon = item.category === 'Weapon';
    const isArmor = item.category === 'Armor';
    const isMagic = item.category === 'Magic Item';

    let buttons = [
      {label: 'Cancel', action: 'closeModal()', cls: 'btn-silver'},
      {label: '📦 Add to Inventory', action: `equipItemToInventory('${encoded}')`, cls: 'btn-primary'}
    ];

    if (isWeapon) {
      buttons.push({label: '⚔ Equip as Weapon', action: `equipItemAsWeapon('${encoded}')`, cls: 'btn-primary'});
    }
    if (isArmor) {
      buttons.push({label: '🛡 Equip Armor', action: `equipItemAsArmor('${encoded}')`, cls: 'btn-primary'});
    }
    if (isMagic) {
      buttons.push({label: '✨ Add as Magic Item', action: `equipItemAsMagic('${encoded}')`, cls: 'btn-primary'});
    }

    const dmg = item.damage || item.ac || '';
    const props = item.properties || '';
    showModal(
      `Equip: ${item.name}`,
      `<div style="color:var(--text-secondary);font-size:15px;line-height:1.6;">
        <div style="margin-bottom:10px;padding:10px;background:var(--bg-card);border-radius:4px;border-left:3px solid var(--border-gold);">
          <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--accent-gold);margin-bottom:4px;">${item.type||item.category}</div>
          ${dmg?`<div>Damage/AC: <b>${dmg}</b></div>`:''}
          ${item.cost?`<div>Cost: ${item.cost}</div>`:''}
          ${item.weight?`<div>Weight: ${item.weight}</div>`:''}
          ${props?`<div>Properties: ${props}</div>`:''}
        </div>
        <p>Where would you like to add <b>${item.name}</b>?</p>
      </div>`,
      buttons
    );
  } catch(e) { console.error(e); }
}

function equipItemToInventory(encoded) {
  try {
    const item = JSON.parse(decodeURIComponent(encoded));
    initCustomDB();
    if (!data.inventory) data.inventory = [];
    // Detect category to store metadata
    const cat = (item.category || item.type || '').toLowerCase();
    const isWeapon = cat.includes('weapon') || cat.includes('melee') || cat.includes('ranged');
    const isArmor  = cat.includes('armor') || cat.includes('shield');
    const isMagic  = cat.includes('magic');
    const entry = {
      id: 'inv_' + Date.now(),
      name: item.name,
      qty: 1,
      weight: item.weight || '',
      notes: (item.type || item.category || '') + (item.damage ? ' — ' + item.damage : '') + (item.properties ? ' | ' + item.properties : '')
    };
    if (isWeapon) {
      entry._itemKind   = 'weapon';
      entry._damage     = item.damage || '';
      entry._properties = item.properties || '';
      entry._range      = (item.properties||'').match(/\d+\/\d+/) ? (item.properties||'').match(/\d+\/\d+/)[0] : '5 ft';
    } else if (isArmor) {
      entry._itemKind  = 'armor';
      entry._ac        = item.ac || item.damage || '';
      entry._armorType = item.type || item.category || '';
      entry._stealthDis = !!(item.stealth);
      entry._properties = item.properties || '';
    } else if (isMagic) {
      entry._itemKind = 'magic';
      entry._rarity   = item.rarity || 'Uncommon';
      entry._charges  = item.charges || '';
    }
    data.inventory.push(entry);
    autoSave();
    renderEquipment();
    closeModal();
    showToast(`${item.name} added to inventory ✦`);
  } catch(e) { console.error(e); }
}

function equipItemAsWeapon(encoded) {
  try {
    const item = JSON.parse(decodeURIComponent(encoded));
    initCustomDB();
    if (!data.weapons) data.weapons = [];
    const strMod = getMod(parseInt(document.getElementById('str')?.value || data.str || 10));
    const dexMod = getMod(parseInt(document.getElementById('dex')?.value || data.dex || 10));
    const isFinesse = (item.properties||'').toLowerCase().includes('finesse');
    const isRanged = item.type && (item.type.toLowerCase().includes('ranged'));
    const mod = (isFinesse || isRanged) ? Math.max(strMod, dexMod) : strMod;
    const pb = getProfBonus(parseInt(document.getElementById('charLevel')?.value || data.charLevel || 1));
    const atkBonus = fmtMod(mod + pb);
    const rangeStr = (item.properties||'').match(/\d+\/\d+/) ? (item.properties||'').match(/\d+\/\d+/)[0] : (isRanged ? '—' : '5 ft');
    // Build inventory snapshot so unequip can restore weight etc.
    const invSnapshot = {
      id: 'inv_' + Date.now(),
      name: item.name,
      qty: 1,
      weight: item.weight || '',
      notes: (item.type || '') + (item.damage ? ' — ' + item.damage : '') + (item.properties ? ' | ' + item.properties : ''),
      _itemKind: 'weapon',
      _damage: item.damage || '',
      _properties: item.properties || '',
      _range: rangeStr,
      _atkBonus: atkBonus
    };
    data.weapons.push({
      id: 'wpn_' + Date.now(),
      name: item.name,
      attack: atkBonus,
      atkBonus: atkBonus,
      damage: item.damage || '',
      range: rangeStr,
      props: item.properties || '',
      properties: item.properties || '',
      _fromInventory: true,
      _invSnapshot: invSnapshot
    });
    autoSave();
    renderEquipment();
    closeModal();
    showToast(`${item.name} equipped as Weapon ✦`);
  } catch(e) { console.error(e); }
}

function equipItemAsArmor(encoded) {
  try {
    const item = JSON.parse(decodeURIComponent(encoded));
    initCustomDB();
    if (!data.armor) data.armor = [];
    // Build the inventory snapshot so unequip can restore weight etc.
    const invSnapshot = {
      id: 'inv_' + Date.now(),
      name: item.name,
      qty: 1,
      weight: item.weight || '',
      notes: (item.type || item.category || '') + (item.properties ? ' | ' + item.properties : ''),
      _itemKind: 'armor',
      _ac: item.ac || item.damage || '',
      _armorType: item.type || item.category || '',
      _stealthDis: !!(item.stealth),
      _properties: item.properties || ''
    };
    data.armor.push({
      id: 'arm_' + Date.now(),
      name: item.name,
      ac: item.ac || item.damage || '',
      type: item.type || item.category,
      stealth: item.stealth || '',
      notes: item.properties || '',
      _fromInventory: true,
      _invSnapshot: invSnapshot
    });
    autoSave();
    renderEquipment();
    closeModal();
    showToast(`${item.name} equipped as Armor ✦`);
  } catch(e) { console.error(e); }
}

function equipItemAsMagic(encoded) {
  try {
    const item = JSON.parse(decodeURIComponent(encoded));
    initCustomDB();
    if (!data.magicItems) data.magicItems = [];
    const invSnapshot = {
      id: 'inv_' + Date.now(),
      name: item.name,
      qty: 1,
      weight: item.weight || '',
      notes: item.description || item.properties || '',
      _itemKind: 'magic',
      _rarity: item.rarity || 'Uncommon',
      _charges: item.charges || ''
    };
    data.magicItems.push({
      id: 'mag_' + Date.now(),
      name: item.name,
      rarity: item.rarity || 'Uncommon',
      attunement: item.attunement === 'Y',
      description: item.description || '',
      _fromInventory: true,
      _invSnapshot: invSnapshot
    });
    autoSave();
    renderEquipment();
    closeModal();
    showToast(`${item.name} added as Magic Item ✦`);
  } catch(e) { console.error(e); }
}

function citUpdateSubcat() {
  const cat = document.getElementById('citCat')?.value || '';
  const sc = document.getElementById('citSubcat');
  if (!sc) return;
  const opts = {
    'Gear': ['Standard Gear','Tool','Light','Consumable','Container','Camping'],
    'Weapon': ['Simple Melee','Simple Ranged','Martial Melee','Martial Ranged'],
    'Armor': ['Light Armor','Medium Armor','Heavy Armor','Shield'],
    'Tool': ['Artisan Tools','Gaming Set','Musical Instrument','Navigator Tools','Thieves Tools','Other Tool'],
    'Kit': ['Burglar Pack','Diplomat Pack','Dungeoneer Pack','Entertainer Pack','Explorer Pack','Priest Pack','Scholar Pack','Other Pack'],
    'Ammunition': ['Arrow','Bolt','Bullet','Dart','Needle','Blowgun Needle','Other Ammo'],
    'Mount & Vehicle': ['Mount','Tack & Harness','Drawn Vehicle','Waterborne Vehicle','Other Vehicle'],
    'Holy Symbol': ['Amulet','Emblem','Reliquary','Other Holy Symbol'],
    'Arcane Focus': ['Crystal','Orb','Rod','Staff','Wand','Other Focus'],
    'Magic Item': ['Potion','Wand','Staff','Ring','Wondrous Items','Weapon','Armor','Scroll','Rod'],
    'Food & Drink': ['Food','Drink','Alcohol','Consumable'],
    'Consumable': ['Potion','Explosive','Poison','Other Consumable'],
    'Treasure': ['Gemstone','Coin','Art Object','Jewelry','Relic','Other Treasure'],
    'Trade Good': ['Metal','Spice','Cloth','Animal','Grain','Other Trade Good'],
    'Explosive': ['Bomb','Grenade','Powder','Other Explosive'],
    'Tack & Harness': ['Saddle','Barding','Feed & Care','Other Tack'],
    'Trinket': ['Curiosity','Keepsake','Strange Relic','Lucky Charm','Other Trinket'],
    'Quest Item': ['Key Item','Story Item','Artifact Fragment','Collectible','Evidence','Letter/Document'],
    'Ingredient': ['Alchemical Base','Alchemical Component','Ammo','Container / Supply','Craft Material','Creature Part','Essence','Herb / Plant','Liquid','Metal / Mineral','Misc','Poison / Acid','Reagent','Tiered Ingredient','Tiered Reagent'],
  };
  const choices = opts[cat] || [];
  sc.innerHTML = '<option value="">— select —</option>' + choices.map(o => `<option value="${o}">${o}</option>`).join('');
}

function openAddItemModal() {
  initCustomDB();
  showModal('Add Custom Item', `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div class="field"><label>Item Name</label><input type="text" id="citName" placeholder="Name…"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <div class="field"><label>Category</label><select id="citCat" onchange="citUpdateSubcat()"><option value="Gear">🎒 Adventuring Gear</option><option value="Weapon">🗡 Weapon</option><option value="Armor">⚔ Armor</option><option value="Tool">🔧 Tool</option><option value="Kit">🧰 Kit &amp; Pack</option><option value="Ammunition">🏹 Ammunition</option><option value="Consumable">🕯 Consumable</option><option value="Food &amp; Drink">🍖 Food &amp; Drink</option><option value="Mount &amp; Vehicle">🐴 Mount &amp; Vehicle</option><option value="Holy Symbol">✦ Holy Symbol</option><option value="Arcane Focus">🔮 Arcane Focus</option><option value="Magic Item">✨ Magic Item</option><option value="Treasure">💎 Treasure</option><option value="Trade Good">⚖ Trade Good</option><option value="Explosive">💥 Explosive</option><option value="Tack &amp; Harness">🐎 Tack &amp; Harness</option><option value="Trinket">🔮 Trinket</option><option value="Quest Item">🗺 Quest Item</option><option value="Ingredient">⚗ Ingredient</option></select></div>
        <div class="field"><label>Subcategory / Type</label><select id="citSubcat" style="width:100%;"><option value="">— select —</option></select><input type="text" id="citType" placeholder="or type custom…" style="margin-top:4px;"></div>
        <div class="field"><label>Cost</label><input type="text" id="citCost" placeholder="e.g. 5 GP"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <div class="field"><label>Weight</label><input type="text" id="citWeight" placeholder="e.g. 3 lbs"></div>
        <div class="field"><label>Damage / AC</label><input type="text" id="citDmg" placeholder="e.g. 1d8 slashing"></div>
        <div class="field"><label>Properties</label><input type="text" id="citProps" placeholder="e.g. Finesse, Light"></div>
      </div>
      <div class="field"><label>Description</label><textarea id="citDesc" rows="4" placeholder="Describe the item…"></textarea></div>
    </div>
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Add Item', action:'saveCustomItem()', cls:'btn-primary'}
  ]);
}


function addItemToInventoryFromDB(encoded) {
  try {
    const item = JSON.parse(decodeURIComponent(encoded));
    _addItemToInventory(item);
  } catch(e) { console.error('addItemToInventoryFromDB error:', e); showToast('Error adding item'); }
}

function addItemToInventoryCached(cacheKey) {
  const item = window._itemCache && window._itemCache[cacheKey];
  if (!item) { showToast('Item not found — try re-opening the compendium'); return; }
  _addItemToInventory(item);
}

function _addItemToInventory(item) {
  data.inventory = data.inventory || [];
  const cat = item.category || '';
  const kind = item._itemKind
    || (cat === 'Weapon' ? 'weapon'
      : cat === 'Armor'  ? 'armor'
      : cat === 'Magic Item' ? 'magic'
      : cat === 'Quest Item' ? 'quest'
      : undefined);
  const entry = {
    id: 'inv_' + Date.now(),
    name: item.name,
    qty: 1,
    weight: item.weight || '',
    cost: item.cost || '',
    notes: item.description ? item.description.slice(0, 120) : (item.type || ''),
    _itemKind: kind,
  };
  if (kind === 'weapon') {
    entry._damage     = item.damage || '';
    entry._properties = item.properties || '';
    const rangeMatch  = (item.properties || '').match(/\d+\/\d+/);
    entry._range      = item.range || (rangeMatch ? rangeMatch[0] : '5 ft');
  } else if (kind === 'armor') {
    entry._ac         = item.ac || item.damage || '';
    entry._armorType  = item.type || cat || '';
    entry._stealthDis = !!(item.stealth && item.stealth.toString().toLowerCase().includes('dis'));
    entry._properties = item.properties || '';
  } else if (kind === 'magic') {
    entry._rarity   = item.rarity || 'Uncommon';
    entry._charges  = item.charges || '';
  }
  data.inventory.push(entry);
  autoSave();
  renderInventory();
  showToast(`${item.name} added to Inventory 📦`);
}

function equipItemAsWeaponCached(cacheKey) {
  const item = window._itemCache && window._itemCache[cacheKey];
  if (!item) { showToast('Item not found'); return; }
  equipItemAsWeapon(encodeURIComponent(JSON.stringify(item)));
}
function equipItemAsArmorCached(cacheKey) {
  const item = window._itemCache && window._itemCache[cacheKey];
  if (!item) { showToast('Item not found'); return; }
  equipItemAsArmor(encodeURIComponent(JSON.stringify(item)));
}
function equipItemAsMagicCached(cacheKey) {
  const item = window._itemCache && window._itemCache[cacheKey];
  if (!item) { showToast('Item not found'); return; }
  equipItemAsMagic(encodeURIComponent(JSON.stringify(item)));
}
function editBuiltinItemCached(cacheKey) {
  const item = window._itemCache && window._itemCache[cacheKey];
  if (!item) { showToast('Item not found'); return; }
  editBuiltinItem(encodeURIComponent(JSON.stringify(item)));
}
function hideBuiltinItemByName(encodedName) {
  const name = decodeURIComponent(encodedName);
  initCustomDB();
  if (!data.hiddenItems) data.hiddenItems = [];
  if (!data.hiddenItems.includes(name)) data.hiddenItems.push(name);
  autoSave();
  renderItemList();
  showToast('Item hidden ✕');
}

function saveCustomItem(id) {
  const name = document.getElementById('citName')?.value?.trim();
  if (!name) { showToast('Item name is required'); return; }
  initCustomDB();
  const item = {
    _custom: true,
    _id: id||'cit_'+Date.now(),
    name,
    category: document.getElementById('citCat')?.value||'Gear',
    subcategory: document.getElementById('citSubcat')?.value||'',
    type: document.getElementById('citType')?.value||'',
    cost: document.getElementById('citCost')?.value||'',
    weight: document.getElementById('citWeight')?.value||'',
    damage: document.getElementById('citDmg')?.value||'',
    properties: document.getElementById('citProps')?.value||'',
    description: document.getElementById('citDesc')?.value||''
  };
  if (id) {
    const idx = data.customItems.findIndex(x=>x._id===id);
    if (idx>=0) data.customItems[idx]=item;
  } else {
    data.customItems.push(item);
  }
  autoSave();
  closeModal();
  renderItemList();
  showToast(`${name} added to Item Compendium ✦`);
}

function editCustomItem(id) {
  initCustomDB();
  const item = data.customItems.find(x=>x._id===id);
  if (!item) return;
  openAddItemModal();
  setTimeout(()=>{
    document.getElementById('citName').value=item.name||'';
    document.getElementById('citCat').value=item.category||'Gear';
    document.getElementById('citType').value=item.type||'';
    document.getElementById('citCost').value=item.cost||'';
    document.getElementById('citWeight').value=item.weight||'';
    document.getElementById('citDmg').value=item.damage||'';
    document.getElementById('citProps').value=item.properties||'';
    document.getElementById('citDesc').value=item.description||'';
    document.querySelector('.modal-actions button:last-child').onclick=()=>saveCustomItem(id);
  },50);
}

function deleteCustomItem(id) {
  initCustomDB();
  showModal('Delete Item','<p style="color:var(--text-secondary);font-size:15px;">Remove this custom item from the compendium?</p>',[
    {label:'Cancel',action:'closeModal()',cls:'btn-silver'},
    {label:'Delete',action:`data.customItems=data.customItems.filter(x=>x._id!=='${id}');autoSave();closeModal();renderItemList();showToast('Item removed');`,cls:'btn-danger'}
  ]);
}

function editBuiltinItem(encoded) {
  initCustomDB();
  try {
    const item = JSON.parse(decodeURIComponent(encoded));
    openAddItemModal();
    setTimeout(() => {
      document.getElementById('citName').value = item.name || '';
      document.getElementById('citCat').value = item.category || 'Gear';
      document.getElementById('citType').value = item.type || '';
      document.getElementById('citCost').value = item.cost || '';
      document.getElementById('citWeight').value = item.weight || '';
      document.getElementById('citDmg').value = item.damage || item.ac || '';
      document.getElementById('citProps').value = item.properties || '';
      document.getElementById('citDesc').value = item.description || '';
      // Check if custom override already exists
      const existingCustom = data.customItems.find(x => x.name === item.name && !x._builtinHide);
      if (existingCustom) {
        document.querySelector('.modal-actions button:last-child').onclick = () => saveCustomItem(existingCustom._id);
      } else {
        document.querySelector('.modal-actions button:last-child').onclick = () => {
          hideBuiltinItemSilent(item.name);
          saveCustomItem();
        };
      }
    }, 50);
  } catch(e) { console.error(e); }
}

function hideBuiltinItem(encodedName) {
  const name = decodeURIComponent(encodedName);
  showModal('Remove from List',
    `<p style="color:var(--text-secondary);font-size:15px;">Hide <b>${name}</b> from the item list?<br><small style="color:var(--text-muted);">You can restore it with the ↺ Restore Hidden button.</small></p>`,
    [
      {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
      {label:'Remove', action:`hideBuiltinItemConfirmed('${encodedName}');closeModal();renderItemList();showToast('Item hidden ✦');`, cls:'btn-danger'}
    ]
  );
}

function hideBuiltinItemConfirmed(encodedName) {
  initCustomDB();
  const name = decodeURIComponent(encodedName);
  if (!data.hiddenItems) data.hiddenItems = [];
  if (!data.hiddenItems.includes(name)) data.hiddenItems.push(name);
  autoSave();
}

function hideBuiltinItemSilent(name) {
  initCustomDB();
  if (!data.hiddenItems) data.hiddenItems = [];
  if (!data.hiddenItems.includes(name)) data.hiddenItems.push(name);
}

function restoreAllHiddenItems() {
  initCustomDB();
  data.hiddenItems = [];
  autoSave();
  renderItemList();
  showToast('All hidden items restored ✦');
}


// =======================================
//  BESTIARY
// =======================================

function crLabel(cr) {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return String(cr);
}

function crColor(cr) {
  if (cr === 0) return "var(--text-muted)";
  if (cr <= 0.5) return "#6aaa6a";
  if (cr <= 3) return "#88cc44";
  if (cr <= 7) return "var(--accent-gold)";
  if (cr <= 14) return "#e07020";
  return "var(--accent-red-bright)";
}

function bstMod(score) {
  var m = Math.floor((score - 10) / 2);
  return (m >= 0 ? "+" : "") + m;
}

function addMonsterToBattle(index) {
  initCustomDB();
  var m = (data.customMonsters || []).find(function(x) { return x.index === index; });
  if (!m) return;

  initBattle();

  // Roll initiative: d20 + DEX mod
  var dexMod = Math.floor((m.dex - 10) / 2);
  var initRoll = Math.ceil(Math.random() * 20) + dexMod;

  // Count how many of this monster already in battle (for numbering)
  var existing = data.battle.combatants.filter(function(c) { return c._monsterIndex === index; }).length;
  var label = existing > 0 ? m.name + ' ' + (existing + 1) : m.name;

  data.battle.combatants.push({
    id: Date.now(),
    lane: 'monster',
    name: label,
    initiative: initRoll,
    hpCur: m.hp,
    hpMax: m.hp,
    ac: m.ac,
    photo: null,
    effects: [],
    isTurn: false,
    _monsterIndex: index,
    _cr: m.cr
  });

  // Sort by initiative descending
  data.battle.combatants.sort(function(a, b) { return b.initiative - a.initiative; });

  renderBattle();
  autoSave();

  // Switch to battle tab and flash toast
  var battleBtn = document.querySelector('.tab-btn[onclick*="battle"]');
  if (battleBtn) showTab('battle', battleBtn);
  showToast('⚔ ' + label + ' added to battle (Init: ' + initRoll + ') ✦');
}

function renderBestiary() {
  var search = (document.getElementById("bstSearch").value || "").toLowerCase();
  var type = document.getElementById("bstType").value || "";
  var size = document.getElementById("bstSize").value || "";
  var crMinVal = document.getElementById("bstCrMin").value;
  var crMaxVal = document.getElementById("bstCrMax").value;
  var crMin = crMinVal !== "" ? parseFloat(crMinVal) : NaN;
  var crMax = crMaxVal !== "" ? parseFloat(crMaxVal) : NaN;
  var sort = document.getElementById("bstSort").value || "name";

  var list = (function() {
    initCustomDB();
    return data.customMonsters || [];
  }()).filter(function(m) {
    if (type && !m.type.includes(type)) return false;
    if (size && m.size !== size) return false;
    if (!isNaN(crMin) && m.cr < crMin) return false;
    if (!isNaN(crMax) && m.cr > crMax) return false;
    if (search) {
      var hay = (m.name + " " + m.type + " " + m.alignment + " " + m.size + " " +
        m.special.map(function(s){ return s.name; }).join(" ") + " " +
        m.actions.map(function(a){ return a.name + " " + a.desc; }).join(" ")).toLowerCase();
      if (hay.indexOf(search) === -1) return false;
    }
    return true;
  });

  list.sort(function(a, b) {
    if (sort === "cr_asc") return a.cr - b.cr;
    if (sort === "cr_desc") return b.cr - a.cr;
    if (sort === "hp") return b.hp - a.hp;
    if (sort === "type") { var t = a.type.localeCompare(b.type); return t !== 0 ? t : a.name.localeCompare(b.name); }
    return a.name.localeCompare(b.name);
  });

  document.getElementById("bstCount").textContent =
    "\u2014 " + list.length + " MONSTER" + (list.length !== 1 ? "S" : "") + " FOUND \u2014";

  var container = document.getElementById("bstTable");
  if (list.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:60px;color:var(--text-muted);font-family:Cinzel,serif;letter-spacing:2px;'>No monsters match your search.</div>";
    return;
  }

  var rows = "";
  list.forEach(function(m) {
    var cr = crLabel(m.cr);
    var col = crColor(m.cr);
    var isCustom = !!m._custom;
    rows += "<div onclick=\"openBstDetail('" + m.index + "')\" "
      + "style='background:var(--bg-card);border:1px solid " + (isCustom ? "var(--border-gold)" : "var(--border-dark)") + ";border-radius:6px;padding:14px 16px;cursor:pointer;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:var(--shadow-deep);' "
      + "onmouseover=\"this.style.borderColor='var(--border-gold-bright)';this.style.boxShadow='var(--shadow-gold)'\" "
      + "onmouseout=\"this.style.borderColor='" + (isCustom ? "var(--border-gold)" : "var(--border-dark)") + "';this.style.boxShadow='var(--shadow-deep)'\">"
      + "<div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;'>"
      + "<div style='flex:1;min-width:0;'>"
      + "<div style='font-family:Cinzel,serif;font-size:13px;font-weight:700;color:var(--accent-gold-bright);display:flex;align-items:center;gap:6px;'>" + m.name + (isCustom ? "<span style='font-size:9px;background:rgba(180,130,40,0.2);border:1px solid var(--border-gold);border-radius:3px;padding:1px 5px;color:var(--accent-gold);letter-spacing:1px;'>CUSTOM</span>" : "") + "</div>"
      + "<div style='font-size:11px;color:var(--text-secondary);font-style:italic;margin-top:1px;'>" + m.size + " " + m.type + " \u00b7 " + m.alignment + "</div>"
      + "</div>"
      + "<div style='text-align:right;flex-shrink:0;margin-left:10px;'>"
      + "<div style='font-family:Cinzel,serif;font-size:15px;font-weight:700;color:" + col + ";'>" + cr + "</div>"
      + "<div style='font-size:9px;color:var(--text-muted);letter-spacing:1px;'>CR</div>"
      + "</div></div>"
      + "<div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;font-size:11px;border-top:1px solid var(--border-dark);padding-top:8px;'>"
      + "<div style='color:var(--text-muted);'>\u2764 <span style='color:var(--text-primary);'>" + m.hp + "</span></div>"
      + "<div style='color:var(--text-muted);'>\ud83d\udee1 <span style='color:var(--text-primary);'>" + m.ac + "</span></div>"
      + "<div style='color:var(--text-muted);'>\ud83d\udca8 <span style='color:var(--text-primary);'>" + m.speed + "</span></div>"
      + "</div>"
      + "<button onclick=\"event.stopPropagation();addMonsterToBattle('" + m.index + "')\" style='margin-top:8px;width:100%;padding:6px;background:linear-gradient(135deg,#2a0a0a,#180606);border:1px solid #7a2020;border-radius:var(--radius);font-family:Cinzel,serif;font-size:10px;font-weight:700;letter-spacing:1px;color:#e06060;cursor:pointer;transition:all 0.15s;' onmouseover=\"this.style.background='linear-gradient(135deg,#3a1010,#280808)';this.style.borderColor='#cc4040'\" onmouseout=\"this.style.background='linear-gradient(135deg,#2a0a0a,#180606)';this.style.borderColor='#7a2020'\">⚔ Add to Battle</button>"
      + "</div>";
  });

  container.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px;'>" + rows + "</div>";
}

function clearBestiaryFilters() {
  document.getElementById("bstSearch").value = "";
  document.getElementById("bstType").value = "";
  document.getElementById("bstSize").value = "";
  document.getElementById("bstCrMin").value = "";
  document.getElementById("bstCrMax").value = "";
  document.getElementById("bstSort").value = "name";
  renderBestiary();
}

function openBstDetail(index) {
  initCustomDB();
  var m = (data.customMonsters || []).find(function(x) { return x.index === index; });
  var isCustom = !!m;
  if (!m) return;
  var cr = crLabel(m.cr);
  var col = crColor(m.cr);

  function sc(label, score) {
    return "<div style='text-align:center;'>"
      + "<div style='font-family:Cinzel,serif;font-size:10px;color:var(--text-muted);letter-spacing:1px;margin-bottom:3px;'>" + label + "</div>"
      + "<div style='font-size:18px;font-weight:700;color:var(--accent-gold-bright);'>" + score + "</div>"
      + "<div style='font-size:12px;color:var(--text-secondary);'>(" + bstMod(score) + ")</div>"
      + "</div>";
  }

  function ab(title, items) {
    if (!items.length) return "";
    return "<div style='margin-bottom:14px;'>"
      + "<div style='font-family:Cinzel,serif;font-size:11px;font-weight:700;color:var(--accent-gold);letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid var(--border-gold);padding-bottom:4px;margin-bottom:8px;'>" + title + "</div>"
      + items.map(function(a) {
          return "<div style='margin-bottom:8px;'><span style='font-weight:600;color:var(--text-gold);'>" + a.name + ".</span> <span style='color:var(--text-secondary);font-size:14px;'>" + a.desc + "</span></div>";
        }).join("")
      + "</div>";
  }

  var saves = m.profs.filter(function(p){ return p.type === "save"; }).map(function(p){ return p.name + " +" + p.val; }).join(", ");
  var skills = m.profs.filter(function(p){ return p.type === "skill"; }).map(function(p){ return p.name + " +" + p.val; }).join(", ");

  var infoRows = "";
  if (saves) infoRows += "<div><span style='color:var(--text-muted);'>Saving Throws</span> <span style='color:var(--text-primary);'>" + saves + "</span></div>";
  if (skills) infoRows += "<div><span style='color:var(--text-muted);'>Skills</span> <span style='color:var(--text-primary);'>" + skills + "</span></div>";
  if (m.vuln.length) infoRows += "<div><span style='color:var(--text-muted);'>Damage Vulnerabilities</span> <span style='color:#e06060;'>" + m.vuln.join(", ") + "</span></div>";
  if (m.res.length) infoRows += "<div><span style='color:var(--text-muted);'>Damage Resistances</span> <span style='color:#60b0e0;'>" + m.res.join(", ") + "</span></div>";
  if (m.imm.length) infoRows += "<div><span style='color:var(--text-muted);'>Damage Immunities</span> <span style='color:#a0a0a0;'>" + m.imm.join(", ") + "</span></div>";
  if (m.cond_imm.length) infoRows += "<div><span style='color:var(--text-muted);'>Condition Immunities</span> <span style='color:#a0a0a0;'>" + m.cond_imm.join(", ") + "</span></div>";
  if (m.senses) infoRows += "<div><span style='color:var(--text-muted);'>Senses</span> <span style='color:var(--text-primary);'>" + m.senses + "</span></div>";
  if (m.languages) infoRows += "<div><span style='color:var(--text-muted);'>Languages</span> <span style='color:var(--text-primary);'>" + m.languages + "</span></div>";
  infoRows += "<div><span style='color:var(--text-muted);'>Challenge</span> <span style='font-family:Cinzel,serif;font-size:15px;font-weight:700;color:" + col + ";'> " + cr + "</span> <span style='color:var(--text-muted);'>(" + m.xp.toLocaleString() + " XP)</span></div>";

  document.getElementById("bstDetailBody").innerHTML =
      "<div style='margin-bottom:16px;'>"
    + "<div style='font-family:Cinzel,serif;font-size:22px;font-weight:900;color:var(--accent-gold-bright);letter-spacing:1px;display:flex;align-items:center;gap:10px;'>" + m.name + (isCustom ? "<span style='font-size:10px;background:rgba(180,130,40,0.2);border:1px solid var(--border-gold);border-radius:3px;padding:2px 6px;color:var(--accent-gold);letter-spacing:1px;'>CUSTOM</span>" : "") + "</div>"
    + "<div style='font-style:italic;color:var(--text-secondary);margin-top:2px;'>" + m.size + " " + m.type + ", " + m.alignment + "</div>"
    + (isCustom ? "<div style='display:flex;gap:8px;margin-top:10px;'><button class='btn btn-silver btn-sm' onclick=\"closeBstDetail();openAddMonsterModal('"+m.index+"')\">✎ Edit</button><button class='btn btn-danger btn-sm' onclick=\"deleteCustomMonster('"+m.index+"')\">🗑 Delete</button></div>" : "")
    + "<button onclick=\"addMonsterToBattle('"+m.index+"');closeBstDetail()\" style='margin-top:12px;width:100%;padding:10px;background:linear-gradient(135deg,#2a0a0a,#180606);border:1px solid #8a2020;border-radius:var(--radius);font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:2px;color:#e06060;cursor:pointer;transition:all 0.15s;' onmouseover=\"this.style.background='#3a1010';this.style.borderColor='#dd4040'\" onmouseout=\"this.style.background='linear-gradient(135deg,#2a0a0a,#180606)';this.style.borderColor='#8a2020'\">⚔ ADD TO BATTLE TRACKER</button>"
    + "</div>"
    + "<div style='background:var(--bg-mid);border-radius:6px;padding:12px 16px;margin-bottom:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:13px;'>"
    + "<div><span style='color:var(--text-muted);'>Armor Class</span> <span style='color:var(--text-primary);font-weight:600;'>" + m.ac + "</span></div>"
    + "<div><span style='color:var(--text-muted);'>Hit Points</span> <span style='color:var(--text-primary);font-weight:600;'>" + m.hp + " (" + m.hd + ")</span></div>"
    + "<div><span style='color:var(--text-muted);'>Speed</span> <span style='color:var(--text-primary);font-weight:600;'>" + m.speed + "</span></div>"
    + "</div>"
    + "<div style='display:grid;grid-template-columns:repeat(6,1fr);gap:8px;background:var(--bg-mid);border-radius:6px;padding:14px;margin-bottom:16px;'>"
    + sc("STR", m.str) + sc("DEX", m.dex) + sc("CON", m.con)
    + sc("INT", m.int) + sc("WIS", m.wis) + sc("CHA", m.cha)
    + "</div>"
    + "<div style='background:var(--bg-mid);border-radius:6px;padding:12px 16px;margin-bottom:16px;font-size:13px;display:grid;gap:6px;'>" + infoRows + "</div>"
    + ab("Traits", m.special)
    + ab("Actions", m.actions)
    + ab("Legendary Actions", m.legendary);

  document.getElementById("bstDetailOverlay").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeBstDetail() {
  document.getElementById("bstDetailOverlay").style.display = "none";
  document.body.style.overflow = "";
}

function openAddMonsterModal(editId) {
  initCustomDB();
  showModal((editId ? 'Edit Custom Monster' : 'Add Custom Monster'), `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div class="field"><label>Monster Name</label><input type="text" id="cmnName" placeholder="Name…"></div>
        <div class="field"><label>Alignment</label><input type="text" id="cmnAlign" placeholder="chaotic evil…"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;">
        <div class="field"><label>Size</label><select id="cmnSize"><option value="Tiny">Tiny</option><option value="Small">Small</option><option value="Medium" selected>Medium</option><option value="Large">Large</option><option value="Huge">Huge</option><option value="Gargantuan">Gargantuan</option></select></div>
        <div class="field"><label>Type</label><select id="cmnType"><option value="aberration">Aberration</option><option value="beast">Beast</option><option value="celestial">Celestial</option><option value="construct">Construct</option><option value="dragon">Dragon</option><option value="elemental">Elemental</option><option value="fey">Fey</option><option value="fiend">Fiend</option><option value="giant">Giant</option><option value="humanoid">Humanoid</option><option value="monstrosity">Monstrosity</option><option value="ooze">Ooze</option><option value="plant">Plant</option><option value="undead">Undead</option></select></div>
        <div class="field"><label>CR</label><input type="number" id="cmnCr" value="1" min="0" max="30" step="0.125"></div>
        <div class="field"><label>XP</label><input type="number" id="cmnXp" value="200" min="0"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <div class="field"><label>AC</label><input type="number" id="cmnAc" value="10" min="0" max="30"></div>
        <div class="field"><label>HP</label><input type="number" id="cmnHp" value="10" min="0"></div>
        <div class="field"><label>HD (e.g. 2d8)</label><input type="text" id="cmnHd" placeholder="2d8"></div>
      </div>
      <div class="field"><label>Speed</label><input type="text" id="cmnSpeed" placeholder="30 ft."></div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
        <div class="field"><label>STR</label><input type="number" id="cmnStr" value="10" min="1" max="30"></div>
        <div class="field"><label>DEX</label><input type="number" id="cmnDex" value="10" min="1" max="30"></div>
        <div class="field"><label>CON</label><input type="number" id="cmnCon" value="10" min="1" max="30"></div>
        <div class="field"><label>INT</label><input type="number" id="cmnInt" value="10" min="1" max="30"></div>
        <div class="field"><label>WIS</label><input type="number" id="cmnWis" value="10" min="1" max="30"></div>
        <div class="field"><label>CHA</label><input type="number" id="cmnCha" value="10" min="1" max="30"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div class="field"><label>Senses</label><input type="text" id="cmnSenses" placeholder="darkvision 60 ft., passive Perception 10"></div>
        <div class="field"><label>Languages</label><input type="text" id="cmnLangs" placeholder="Common"></div>
      </div>
      <div class="field"><label>Traits (one per line: Name. Description)</label><textarea id="cmnTraits" rows="3" placeholder="Keen Smell. The creature has advantage on Perception checks that rely on smell."></textarea></div>
      <div class="field"><label>Actions (one per line: Name. Description)</label><textarea id="cmnActions" rows="3" placeholder="Bite. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) piercing damage."></textarea></div>
      <div class="field"><label>Legendary Actions (one per line: Name. Description)</label><textarea id="cmnLegendary" rows="2" placeholder="(optional)"></textarea></div>
    </div>
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label: editId ? 'Save Changes' : 'Add Monster', action:'saveCustomMonster(' + (editId ? '"'+editId+'"' : '') + ')', cls:'btn-primary'}
  ]);

  if (editId) {
    var s = (data.customMonsters || []).find(function(x){ return x.index === editId; });
    if (s) setTimeout(function() {
      document.getElementById('cmnName').value = s.name || '';
      document.getElementById('cmnAlign').value = s.alignment || '';
      document.getElementById('cmnSize').value = s.size || 'Medium';
      document.getElementById('cmnType').value = s.type || 'monstrosity';
      document.getElementById('cmnCr').value = s.cr || 1;
      document.getElementById('cmnXp').value = s.xp || 0;
      document.getElementById('cmnAc').value = s.ac || 10;
      document.getElementById('cmnHp').value = s.hp || 10;
      document.getElementById('cmnHd').value = s.hd || '';
      document.getElementById('cmnSpeed').value = s.speed || '30 ft.';
      document.getElementById('cmnStr').value = s.str || 10;
      document.getElementById('cmnDex').value = s.dex || 10;
      document.getElementById('cmnCon').value = s.con || 10;
      document.getElementById('cmnInt').value = s.int || 10;
      document.getElementById('cmnWis').value = s.wis || 10;
      document.getElementById('cmnCha').value = s.cha || 10;
      document.getElementById('cmnSenses').value = s.senses || '';
      document.getElementById('cmnLangs').value = s.languages || '';
      document.getElementById('cmnTraits').value = (s.special || []).map(function(a){ return a.name + '. ' + a.desc; }).join('\n');
      document.getElementById('cmnActions').value = (s.actions || []).map(function(a){ return a.name + '. ' + a.desc; }).join('\n');
      document.getElementById('cmnLegendary').value = (s.legendary || []).map(function(a){ return a.name + '. ' + a.desc; }).join('\n');
    }, 50);
  }
}

function parseAbilityLines(text) {
  if (!text || !text.trim()) return [];
  return text.trim().split('\n').filter(function(l){ return l.trim(); }).map(function(line) {
    var dot = line.indexOf('. ');
    if (dot === -1) return { name: line.trim(), desc: '' };
    return { name: line.slice(0, dot).trim(), desc: line.slice(dot + 2).trim() };
  });
}

function saveCustomMonster(id) {
  var name = document.getElementById('cmnName')?.value?.trim();
  if (!name) { showToast('Monster name is required'); return; }
  initCustomDB();
  var monster = {
    _custom: true,
    index: id || 'cmn_' + Date.now(),
    name: name,
    alignment: document.getElementById('cmnAlign')?.value || 'unaligned',
    size: document.getElementById('cmnSize')?.value || 'Medium',
    type: document.getElementById('cmnType')?.value || 'monstrosity',
    cr: parseFloat(document.getElementById('cmnCr')?.value) || 0,
    xp: parseInt(document.getElementById('cmnXp')?.value) || 0,
    ac: parseInt(document.getElementById('cmnAc')?.value) || 10,
    hp: parseInt(document.getElementById('cmnHp')?.value) || 1,
    hd: document.getElementById('cmnHd')?.value || '',
    speed: document.getElementById('cmnSpeed')?.value || '30 ft.',
    str: parseInt(document.getElementById('cmnStr')?.value) || 10,
    dex: parseInt(document.getElementById('cmnDex')?.value) || 10,
    con: parseInt(document.getElementById('cmnCon')?.value) || 10,
    int: parseInt(document.getElementById('cmnInt')?.value) || 10,
    wis: parseInt(document.getElementById('cmnWis')?.value) || 10,
    cha: parseInt(document.getElementById('cmnCha')?.value) || 10,
    senses: document.getElementById('cmnSenses')?.value || '',
    languages: document.getElementById('cmnLangs')?.value || '',
    profs: [],
    vuln: [], res: [], imm: [], cond_imm: [],
    special: parseAbilityLines(document.getElementById('cmnTraits')?.value),
    actions: parseAbilityLines(document.getElementById('cmnActions')?.value),
    legendary: parseAbilityLines(document.getElementById('cmnLegendary')?.value)
  };
  if (id) {
    var idx = data.customMonsters.findIndex(function(x){ return x.index === id; });
    if (idx >= 0) data.customMonsters[idx] = monster;
    else data.customMonsters.push(monster);
  } else {
    monster.index = 'cmn_' + Date.now();
    data.customMonsters.push(monster);
  }
  autoSave();
  closeModal();
  renderBestiary();
  showToast(name + (id ? ' updated ✦' : ' added to Bestiary ✦'));
}

function deleteCustomMonster(id) {
  initCustomDB();
  var m = (data.customMonsters || []).find(function(x){ return x.index === id; });
  if (!m) return;
  if (!confirm('Delete "' + m.name + '" from your custom monsters?')) return;
  data.customMonsters = data.customMonsters.filter(function(x){ return x.index !== id; });
  autoSave();
  closeBstDetail();
  renderBestiary();
  showToast(m.name + ' removed ✦');
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeBstDetail();
});

// ═══════════════════════════════════════════
//  PLAYER BESTIARY
// ═══════════════════════════════════════════
var PB_DANGER_META = {
  'Weak':       { color: '#2a5a1a', border: '#4a9a2a', icon: '🟢' },
  'Moderate':   { color: '#5a5a10', border: '#aaaa20', icon: '🟡' },
  'Dangerous':  { color: '#6a3a10', border: '#cc6a20', icon: '🟠' },
  'Lethal':     { color: '#6a1a1a', border: '#cc3030', icon: '🔴' },
  'Legendary':  { color: '#3a0a3a', border: '#9a30aa', icon: '💀' },
};
var PB_STATUS_META = {
  'Defeated':  { color: '#60c070', icon: '✅' },
  'Escaped':   { color: '#c08030', icon: '🏃' },
  'Ally':      { color: '#6090d0', icon: '🤝' },
  'Unknown':   { color: '#707070', icon: '❓' },
};

function addPlayerMonster() {
  data.playerBestiary = data.playerBestiary || [];
  data.playerBestiary.unshift({
    name: '', type: 'Unknown', danger: 'Unknown', status: 'Unknown',
    location: '', firstSeen: '', description: '',
    appearance: '', behavior: '', weaknesses: '', resistances: '',
    abilities: '', tactics: '', loot: '', notes: '', _open: true
  });
  _pageState.bestiary.page = 0;
  renderPlayerBestiary();
  autoSave();
  setTimeout(() => {
    const cards = document.querySelectorAll('.pb-card');
    if (cards.length) cards[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function deletePlayerMonster(idx) {
  data.playerBestiary = data.playerBestiary || [];
  data.playerBestiary.splice(idx, 1);
  renderPlayerBestiary();
  autoSave();
}

function togglePbCard(headerEl) {
  const card = headerEl.closest('.pb-card');
  if (!card) return;
  const isOpen = card.classList.toggle('expanded');
  const idx = parseInt(card.dataset.idx);
  if (!isNaN(idx) && data.playerBestiary && data.playerBestiary[idx]) {
    data.playerBestiary[idx]._open = isOpen;
    autoSave();
  }
}

function pbField(idx, field, value, placeholder, rows) {
  if (rows) {
    return `<div class="field"><label>${placeholder}</label><textarea rows="${rows}" placeholder="${placeholder}…" oninput="pbUpdate(${idx},'${field}',this.value)">${value||''}</textarea></div>`;
  }
  return `<div class="field"><label>${placeholder}</label><input type="text" value="${(value||'').replace(/"/g,'&quot;')}" placeholder="${placeholder}…" oninput="pbUpdate(${idx},'${field}',this.value)"></div>`;
}

function pbUpdate(idx, field, value) {
  data.playerBestiary = data.playerBestiary || [];
  if (data.playerBestiary[idx]) {
    data.playerBestiary[idx][field] = value;
    autoSave();
    // For name field: update only the header text to avoid losing focus
    if (field === 'name') {
      const card = document.querySelector('.pb-card[data-idx="' + idx + '"]');
      if (card) {
        const nameEl = card.querySelector('.pb-card-header > div > div:first-child');
        if (nameEl) {
          nameEl.innerHTML = value || '<em style="color:var(--text-muted);font-size:15px;">Unnamed Creature</em>';
        }
      }
    } else if (field === 'danger' || field === 'type' || field === 'status') {
      renderPlayerBestiary();
    }
  }
}

function renderPlayerBestiary() {
  const container = document.getElementById('pbList');
  const countEl = document.getElementById('pbCount');
  if (!container) return;

  data.playerBestiary = data.playerBestiary || [];

  const search = (document.getElementById('pbSearch')?.value || '').toLowerCase();
  const dangerFilter = document.getElementById('pbDanger')?.value || '';
  const typeFilter = document.getElementById('pbType')?.value || '';
  const statusFilter = document.getElementById('pbStatus')?.value || '';

  const filtered = data.playerBestiary.map((m, i) => ({ m, i })).filter(({ m }) => {
    if (dangerFilter && m.danger !== dangerFilter) return false;
    if (typeFilter && m.type !== typeFilter) return false;
    if (statusFilter && m.status !== statusFilter) return false;
    if (search) {
      const hay = [m.name, m.type, m.danger, m.location, m.description, m.appearance,
        m.behavior, m.weaknesses, m.resistances, m.abilities, m.tactics, m.loot, m.notes]
        .join(' ').toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  const totalFilteredB = filtered.length;
  const ps_b = _pageState.bestiary;
  const maxPage_b = ps_b.perPage === 9999 ? 0 : Math.max(0, Math.ceil(totalFilteredB / ps_b.perPage) - 1);
  if (ps_b.page > maxPage_b) ps_b.page = maxPage_b;
  const pagedBestiary = _applyPagination(filtered, 'bestiary');

  if (countEl) countEl.textContent = `— ${totalFilteredB} CREATURE${totalFilteredB === 1 ? '' : 'S'} —`;

  if (totalFilteredB === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;">${data.playerBestiary.length === 0 ? 'No entries yet — add your first creature!' : 'No results match this filter.'}</div>`;
    renderPagination('pbList', 'bestiary', totalFilteredB);
    return;
  }

  const DANGER_LIST = ['Weak','Moderate','Dangerous','Lethal','Legendary','Unknown'];
  const TYPE_LIST = ['Beast','Undead','Demon / Devil','Dragon','Humanoid','Giant','Fey','Elemental','Aberration','Construct','Unknown'];
  const STATUS_LIST = ['Defeated','Escaped','Ally','Unknown'];

  container.innerHTML = '';

  pagedBestiary.forEach(({ m, i }) => {
    const dm = PB_DANGER_META[m.danger] || { color: '#4a3a22', border: '#8a6a28', icon: '❓' };
    const sm = PB_STATUS_META[m.status] || { color: '#707070', icon: '❓' };

    const dangerOpts = DANGER_LIST.map(d => `<option value="${d}"${m.danger===d?' selected':''}>${PB_DANGER_META[d]?.icon||'❓'} ${d}</option>`).join('');
    const typeOpts = TYPE_LIST.map(t => `<option value="${t}"${m.type===t?' selected':''}>${t}</option>`).join('');
    const statusOpts = STATUS_LIST.map(s => `<option value="${s}"${m.status===s?' selected':''}>${PB_STATUS_META[s]?.icon||'❓'} ${s}</option>`).join('');

    const div = document.createElement('div');
    div.className = 'pb-card' + (m._open ? ' expanded' : '');
    div.dataset.idx = i;
    div.style.borderLeftColor = dm.border;

    div.innerHTML = `
      <div class="pb-card-header" onclick="togglePbCard(this)">
        <span class="pb-chevron">▶</span>
        <div style="font-size:22px;line-height:1;">${m.type==='Dragon'?'🐉':m.type==='Undead'?'💀':m.type==='Demon / Devil'?'😈':m.type==='Beast'?'🐺':m.type==='Humanoid'?'🧑':m.type==='Giant'?'🏔':m.type==='Fey'?'🧚':m.type==='Elemental'?'🔥':m.type==='Aberration'?'👁':m.type==='Construct'?'⚙️':'❓'}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:'IM Fell English',serif;font-size:18px;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.name||'<em style="color:var(--text-muted);font-size:17px;">Unnamed Creature</em>'}</div>
          <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);margin-top:1px;letter-spacing:0.5px;">${m.type}</div>
        </div>
        <span class="pb-tag" style="color:${dm.border};border-color:${dm.border};background:${dm.color}22;">${dm.icon} ${m.danger}</span>
        <span class="pb-tag" style="color:${sm.color};border-color:${sm.color}66;background:${sm.color}18;">${sm.icon} ${m.status}</span>
        ${m.location ? `<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);border:1px solid var(--border-dark);border-radius:3px;padding:2px 7px;white-space:nowrap;max-width:100px;overflow:hidden;text-overflow:ellipsis;">📍 ${m.location.slice(0,16)}${m.location.length>16?'…':''}</span>` : ''}
        <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();deletePlayerMonster(${i})">🗑</button>
      </div>

      <div class="pb-card-body" onclick="event.stopPropagation()">
        <!-- Row 1: Name + classification -->
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;margin-top:14px;">
          <div class="field" style="margin:0;">
            <label>Creature Name</label>
            <input type="text" value="${(m.name||'').replace(/"/g,'&quot;')}" placeholder="Name…" style="font-family:'IM Fell English',serif;font-size:17px;" oninput="pbUpdate(${i},'name',this.value)">
          </div>
          <div class="field" style="margin:0;">
            <label>Typ</label>
            <select onchange="pbUpdate(${i},'type',this.value)">${typeOpts}</select>
          </div>
          <div class="field" style="margin:0;">
            <label>Danger Level</label>
            <select onchange="pbUpdate(${i},'danger',this.value)">${dangerOpts}</select>
          </div>
          <div class="field" style="margin:0;">
            <label>Encounter Outcome</label>
            <select onchange="pbUpdate(${i},'status',this.value)">${statusOpts}</select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
          ${pbField(i,'location',m.location,'Location / Region')}
          ${pbField(i,'firstSeen',m.firstSeen,'First Encounter (place, time…)')}
        </div>

        <div class="pb-section-title">📖 Description & Behaviour</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${pbField(i,'appearance',m.appearance,'Appearance & Size',3)}
          ${pbField(i,'behavior',m.behavior,'Behaviour & Tactics',3)}
        </div>
        ${pbField(i,'description',m.description,'Overall Impression (what you saw, felt, heard…)',3)}

        <div class="pb-section-title">⚔ Combat Notes</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${pbField(i,'weaknesses',m.weaknesses,'Apparent Weaknesses & what worked',3)}
          ${pbField(i,'resistances',m.resistances,'What didn\'t work / Resistances',3)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${pbField(i,'abilities',m.abilities,'Abilities & Attacks (what it used)',3)}
          ${pbField(i,'tactics',m.tactics,'How we defeated it / What to watch out for',3)}
        </div>

        <div class="pb-section-title">💎 Other</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${pbField(i,'loot',m.loot,'Loot & Valuables',2)}
          ${pbField(i,'notes',m.notes,'Free Notes',2)}
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  renderPagination('pbList', 'bestiary', totalFilteredB);
}

// ═══════════════════════════════════════════
