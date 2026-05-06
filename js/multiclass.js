// ═══════════════════════════════════════════
//  multiclass.js — MULTICLASS SPELL SLOT TRACKER
// ═══════════════════════════════════════════

const MC_SLOT_TABLE = [
  [2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],
  [4,3,0,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,3,1,0,0,0,0],
  [4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],
  [4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1],
];

const MC_CLASSES = [
  {name:'Artificer',type:'half'},{name:'Barbarian',type:'none'},
  {name:'Bard',type:'full'},{name:'Blood Hunter',type:'none'},
  {name:'Cleric',type:'full'},{name:'Druid',type:'full'},
  {name:'Fighter',type:'none'},{name:'Eldritch Knight',type:'third'},
  {name:'Monk',type:'none'},{name:'Paladin',type:'half'},
  {name:'Ranger',type:'half'},{name:'Rogue',type:'none'},
  {name:'Arcane Trickster',type:'third'},{name:'Sorcerer',type:'full'},
  {name:'Warlock',type:'pact'},{name:'Wizard',type:'full'},
];
const MC_TYPE_MAP = Object.fromEntries(MC_CLASSES.map(c=>[c.name,c.type]));
const MC_TYPE_LABELS = {full:'Full caster',half:'Half caster',third:'1/3 caster',pact:'Pact Magic',none:'Non-caster'};
const MC_TYPE_COLORS = {full:'#80d090',half:'#80a0d0',third:'#a080d0',pact:'#b07ae0',none:'#666'};
const SLOT_ORDINALS = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];

const WARLOCK_PACT = {
  1:[1,1],2:[1,2],3:[2,2],4:[2,2],5:[3,2],6:[3,2],7:[4,2],8:[4,2],
  9:[5,2],10:[5,2],11:[5,3],12:[5,3],13:[5,3],14:[5,3],15:[5,3],
  16:[5,3],17:[5,4],18:[5,4],19:[5,4],20:[5,4],
};

function getMCData() {
  if (!data.multiclass) data.multiclass = {classes:[], collapsed:true};
  if (!Array.isArray(data.multiclass.classes)) data.multiclass.classes = [];
  if (data.multiclass.collapsed === undefined) data.multiclass.collapsed = true;
  return data.multiclass;
}

function calcMCSlots() {
  const mc = getMCData();
  let cl = 0, wl = 0;
  mc.classes.forEach(c => {
    const lvl = Math.max(0, parseInt(c.level)||0);
    const type = c.casterType || MC_TYPE_MAP[c.name] || 'none';
    if      (type==='full')  cl += lvl;
    else if (type==='half')  cl += Math.floor(lvl/2);
    else if (type==='third') cl += Math.floor(lvl/3);
    else if (type==='pact')  wl += lvl;
  });
  cl = Math.min(20, Math.round(cl));
  wl = Math.min(20, wl);
  return {
    combined: cl>=1 ? MC_SLOT_TABLE[cl-1] : null,
    combinedLevel: cl,
    pact: wl>=1 ? {slotLevel:WARLOCK_PACT[wl][0], slots:WARLOCK_PACT[wl][1], warlockLevel:wl} : null,
  };
}

// ── Auto-apply slots whenever classes/levels change ──
function mcAutoApplySlots() {
  const calc = calcMCSlots();
  if (!data.spellSlots) data.spellSlots = {};

  const intended = {};
  for (let lvl = 1; lvl <= 9; lvl++) intended[lvl] = 0;

  if (calc.combined) {
    calc.combined.forEach((num, i) => { intended[i + 1] += num; });
  }
  if (calc.pact) {
    intended[calc.pact.slotLevel] += calc.pact.slots;
  }

  for (let lvl = 1; lvl <= 9; lvl++) {
    const num = intended[lvl];
    if (num === 0) {
      delete data.spellSlots[lvl];
    } else {
      const cur = data.spellSlots[lvl] || {max:0, used:0};
      data.spellSlots[lvl] = {max: num, used: Math.min(cur.used, num)};
    }
  }

  if (typeof buildSpellSlots === 'function') buildSpellSlots();
}

// ── Soft-sync: multiclass total → charLevel only when user explicitly changes classes ──
// The profile level is the source of truth. Multiclass only pushes an update
// when the user actively edits a class row — never on page load / renderMulticlass.
function mcPushLevelToProfile(newTotal) {
  const capped = Math.min(20, Math.max(1, newTotal));
  data.charLevel = capped;
  const el = document.getElementById('charLevel');
  if (el) el.value = capped;
  if (typeof onLevelChange === 'function') onLevelChange();
  if (typeof syncXPBarToLevel === 'function') syncXPBarToLevel();
  // Re-render ASI tracker so history reflects current class levels
  if (typeof renderAsiTracker === 'function') renderAsiTracker();
  if (typeof renderAsiHistory === 'function') renderAsiHistory();
}

function mcToggleCollapse() {
  const mc = getMCData();
  mc.collapsed = !mc.collapsed;
  autoSave();
  renderMulticlass();
}

function renderMulticlass() {
  const container = document.getElementById('mcTrackerPanel');
  if (!container) return;
  const mc = getMCData();
  const calc = calcMCSlots();
  const isCollapsed = mc.collapsed;

  // Do NOT call mcSyncTotalLevel here — profile level is the source of truth on render/load

  const totalLevel = mc.classes.reduce((sum, c) => sum + Math.max(0, parseInt(c.level) || 0), 0);
  const totalLevelBadge = totalLevel > 0
    ? `<span style="margin-left:8px;background:var(--accent-gold)22;border:1px solid var(--accent-gold)44;border-radius:4px;padding:1px 7px;font-family:'Cinzel',serif;font-size:11px;color:var(--accent-gold);" title="Total character level">Lv ${Math.min(20,totalLevel)}</span>`
    : '';

  let summaryHTML = '';
  if (mc.classes.length > 0) {
    const parts = mc.classes.map(c => {
      const name = c.name || '?';
      const lvl = c.level || 1;
      return `<span style="color:var(--accent-gold);font-family:'Cinzel',serif;font-size:13px;">${name} ${lvl}</span>`;
    }).join('<span style="color:var(--text-muted);margin:0 4px;">/</span>');
    summaryHTML = `<span style="margin-left:10px;">${parts}</span>`;
    if (calc.combined || calc.pact) {
      summaryHTML += `<span style="color:var(--text-muted);font-size:13px;margin-left:8px;">→</span>`;
      if (calc.combined) {
        const topSlots = calc.combined.map((n,i)=>n>0?`${SLOT_ORDINALS[i]}:${n}`:'').filter(Boolean).join(' ');
        summaryHTML += `<span style="color:#80d090;font-family:'Cinzel',serif;font-size:13px;margin-left:6px;">${topSlots}</span>`;
      }
      if (calc.pact) {
        summaryHTML += `<span style="color:#b07ae0;font-family:'Cinzel',serif;font-size:13px;margin-left:6px;">Pact:${SLOT_ORDINALS[calc.pact.slotLevel-1]}×${calc.pact.slots}</span>`;
      }
    }
  } else {
    summaryHTML = `<span style="color:var(--text-muted);font-family:'Crimson Text',serif;font-size:13px;font-style:italic;margin-left:10px;">click to configure…</span>`;
  }

  const rows = mc.classes.map((c, i) => {
    const knownType = MC_TYPE_MAP[c.name];
    const effectiveType = c.casterType || knownType || 'none';
    const typeColor = MC_TYPE_COLORS[effectiveType] || '#666';
    const typeBadge = `<span class="mc-type-badge" style="color:${typeColor};border-color:${typeColor}22;background:${typeColor}11;">${MC_TYPE_LABELS[effectiveType]}</span>`;

    const showDropdown = !knownType || c.casterType;
    const opts = ['full','half','third','pact','none'].map(t =>
      `<option value="${t}"${effectiveType===t?' selected':''}>${MC_TYPE_LABELS[t]}</option>`
    ).join('');
    const typeControl = showDropdown
      ? `<select class="mc-type-select" title="Caster type" onchange="mcUpdateClass(${i},'casterType',this.value)">${opts}</select>`
      : typeBadge;

    return `<div class="mc-class-row">
      <input type="text" class="mc-class-name" value="${c.name||''}" placeholder="e.g. Wizard…" list="mcClassList"
        onchange="mcUpdateClass(${i},'name',this.value)"
        oninput="mcUpdateClassName(${i},this.value)">
      <div class="num-wrap" style="width:72px;flex-shrink:0;">
        <input type="number" value="${c.level||1}" min="1" max="20" oninput="mcUpdateClass(${i},'level',this.value)">
        <div class="num-spin-btns">
          <button class="num-spin-btn" onclick="mcSpinLevel(${i},1)">▲</button>
          <button class="num-spin-btn" onclick="mcSpinLevel(${i},-1)">▼</button>
        </div>
      </div>
      ${typeControl}
      <button class="del-btn" onclick="mcRemoveClass(${i})">🗑</button>
    </div>`;
  }).join('');

  // ── Slot results (display only, no Apply button) ──
  let resultHTML = '';
  if (calc.combined) {
    const chips = calc.combined.map((n,i) => n>0
      ? `<div class="mc-slot-chip"><span class="mc-slot-lvl">${SLOT_ORDINALS[i]}</span><span class="mc-slot-num">${n}</span></div>`
      : '').join('');
    resultHTML += `<div class="mc-result-label">Combined Spell Slots <span style="color:var(--text-muted);font-size:10px;margin-left:6px;">(Caster Level ${calc.combinedLevel})</span></div>
    <div class="mc-slot-preview">${chips}</div>`;
  }
  if (calc.pact) {
    resultHTML += `<div class="mc-result-label" style="margin-top:10px;">Pact Magic <span style="color:var(--text-muted);font-size:10px;margin-left:6px;">(Warlock ${calc.pact.warlockLevel} · Short Rest)</span></div>
    <div class="mc-slot-preview">
      <div class="mc-slot-chip pact">
        <span class="mc-slot-lvl">${SLOT_ORDINALS[calc.pact.slotLevel-1]}</span>
        <span class="mc-slot-num">${calc.pact.slots}×</span>
      </div>
    </div>`;
  }
  if (!calc.combined && !calc.pact && mc.classes.length > 0) {
    resultHTML = `<div style="color:var(--text-muted);font-size:13px;font-family:'Crimson Text',serif;font-style:italic;padding:6px 0;">No spellcasting classes — slots will appear once you add a caster.</div>`;
  }

  const autoSyncNote = (calc.combined || calc.pact)
    ? `<div style="font-family:'Crimson Text',serif;font-size:12px;color:var(--text-muted);margin-top:6px;font-style:italic;">
        ⚡ Spell slots update automatically with every change.
       </div>`
    : '';

  container.innerHTML = `
    <datalist id="mcClassList">${MC_CLASSES.map(c=>`<option value="${c.name}">`).join('')}</datalist>

    <div class="mc-collapse-header" onclick="mcToggleCollapse()" style="display:flex;align-items:center;gap:6px;cursor:pointer;">
      <span class="mc-chevron" style="color:var(--accent-gold);font-size:11px;">${isCollapsed ? '▸' : '▾'}</span>
      <span style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;color:var(--accent-gold);">CLASSES</span>
      ${totalLevelBadge}
      ${summaryHTML}
    </div>

    <div class="mc-body" style="display:${isCollapsed ? 'none' : 'block'};">
      ${rows ? `<div class="mc-classes-list" style="margin-top:12px;">${rows}</div>` : '<div style="margin-top:12px;"></div>'}
      <button class="add-row-btn" onclick="mcAddClass()" style="margin-bottom:14px;">+ Add Class</button>
      ${resultHTML ? `<div class="mc-divider"></div><div class="mc-slot-results">${resultHTML}${autoSyncNote}</div>` : ''}
    </div>
  `;
}

function mcUpdateClassName(i, value) {
  const mc = getMCData();
  if (!mc.classes[i]) return;
  mc.classes[i].name = value;
  if (MC_TYPE_MAP[value]) {
    mc.classes[i].casterType = null;
    autoSave();
    mcAutoApplySlots();
    renderMulticlass();
  } else {
    autoSave();
  }
}

function mcAddClass() {
  getMCData().classes.push({name:'',level:1,casterType:null});
  // Adding a class with level 1 increases total — push to profile
  const total = getMCData().classes.reduce((sum, c) => sum + Math.max(0, parseInt(c.level)||0), 0);
  mcPushLevelToProfile(total);
  autoSave();
  mcAutoApplySlots();
  renderMulticlass();
}

function mcRemoveClass(i) {
  getMCData().classes.splice(i,1);
  const mc = getMCData();
  if (mc.classes.length > 0) {
    const total = mc.classes.reduce((sum, c) => sum + Math.max(0, parseInt(c.level)||0), 0);
    mcPushLevelToProfile(total);
  }
  autoSave();
  mcAutoApplySlots();
  renderMulticlass();
}

function mcUpdateClass(i,field,value) {
  const mc = getMCData();
  if (!mc.classes[i]) return;
  if (field==='level') {
    mc.classes[i].level = Math.min(20,Math.max(1,parseInt(value)||1));
    // Push updated total to profile level
    const total = mc.classes.reduce((sum, c) => sum + Math.max(0, parseInt(c.level)||0), 0);
    mcPushLevelToProfile(total);
    // Check ASI trigger for this specific class
    if (typeof asiCheckClassLevelUp === 'function') {
      asiCheckClassLevelUp(mc.classes[i].name, mc.classes[i].level);
    }
  } else if (field==='name') {
    mc.classes[i].name = value;
    if (MC_TYPE_MAP[value]) mc.classes[i].casterType = null;
  } else {
    mc.classes[i][field] = value;
  }
  autoSave();
  mcAutoApplySlots();
  renderMulticlass();
}

function mcSpinLevel(i,delta) {
  const mc = getMCData();
  if (!mc.classes[i]) return;
  mc.classes[i].level = Math.min(20,Math.max(1,(parseInt(mc.classes[i].level)||1)+delta));
  const total = mc.classes.reduce((sum, c) => sum + Math.max(0, parseInt(c.level)||0), 0);
  mcPushLevelToProfile(total);
  // Check ASI trigger for this specific class
  if (typeof asiCheckClassLevelUp === 'function') {
    asiCheckClassLevelUp(mc.classes[i].name, mc.classes[i].level);
  }
  autoSave();
  mcAutoApplySlots();
  renderMulticlass();
}

document.addEventListener('DOMContentLoaded', function() {
  renderMulticlass();
});
