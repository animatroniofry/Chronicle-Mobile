// ═══════════════════════════════════════════
//  asi-tracker.js — ASI TRACKER v6
//
//  D&D 5e CORRECT LOGIC:
//    ASI triggers on class level 4, 8, 12, 16, 19 — per class, not total level.
//    Bard 4 / Sorcerer 2 → only Bard gets ASI (reached level 4 in that class).
//
//  Mode A — MULTICLASS (data.multiclass.classes has entries):
//    Each class gets its own independent ASI slots tracked in data.asiTrackerPerClass
//    Key: className (e.g. "Bard"), value: array of 5 slot objects for levels 4/8/12/16/19
//
//  Mode B — SINGLE CLASS (no multiclass configured):
//    Falls back to identity card charLevel + legacy data.asiTracker flat array
//
//  Banner shows per-class pending ASIs, labelled with class name.
//  History shows all spent ASIs across all classes.
//
//  Click logic (unchanged):
//    1st click = +1 (yellow, .asi-nb-attr-sel)
//    2nd click same stat = +2 (green, .asi-nb-attr-double)
//    3rd click = deselect
//    Other stats blocked when +2 locked (.asi-nb-attr-blocked)
//  Feat button = mark without stat change
// ═══════════════════════════════════════════

const ASI_LEVELS  = [4, 8, 12, 16, 19];
const ASI_ATTRS   = ['str','dex','con','int','wis','cha'];
const ASI_LABELS  = {str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA'};
const ASI_NAMES   = {str:'Strength', dex:'Dexterity', con:'Constitution', int:'Intelligence', wis:'Wisdom', cha:'Charisma'};

// ── Determine if we are in multiclass mode ────────────────────────────────────
function asiIsMulticlass() {
  const mc = data.multiclass;
  return mc && Array.isArray(mc.classes) && mc.classes.length > 0 &&
    mc.classes.some(c => c.name && (parseInt(c.level) || 0) > 0);
}

// ── Get identity-card level (fallback) ───────────────────────────────────────
function asiIdentityLevel() {
  return parseInt(document.getElementById('charLevel')?.value) || (data.charLevel || 1);
}

// ══════════════════════════════════════════════════════════════════════════════
//  DATA LAYER
// ══════════════════════════════════════════════════════════════════════════════

// ── Single-class data (legacy flat array, 5 slots) ───────────────────────────
function getAsiDataSingle() {
  if (!Array.isArray(data.asiTracker) || data.asiTracker.length !== ASI_LEVELS.length) {
    data.asiTracker = ASI_LEVELS.map(lvl => ({
      level: lvl, spent: false, tookFeat: false, pending: {}, applied: {}
    }));
  }
  data.asiTracker.forEach(e => {
    if (!e.pending) e.pending = {};
    if (!e.applied) e.applied = {};
  });
  return data.asiTracker;
}

// ── Per-class data ────────────────────────────────────────────────────────────
function getAsiDataForClass(className) {
  if (!data.asiTrackerPerClass) data.asiTrackerPerClass = {};
  if (!data.asiTrackerPerClass[className] ||
      !Array.isArray(data.asiTrackerPerClass[className]) ||
      data.asiTrackerPerClass[className].length !== ASI_LEVELS.length) {
    data.asiTrackerPerClass[className] = ASI_LEVELS.map(lvl => ({
      level: lvl, spent: false, tookFeat: false, pending: {}, applied: {}
    }));
  }
  data.asiTrackerPerClass[className].forEach(e => {
    if (!e.pending) e.pending = {};
    if (!e.applied) e.applied = {};
  });
  return data.asiTrackerPerClass[className];
}

// ── Build list of {className, classLevel, slots[]} for all active classes ────
function asiGetAllClassSlots() {
  if (!asiIsMulticlass()) {
    const level = asiIdentityLevel();
    const slots = getAsiDataSingle();
    return [{ className: null, classLevel: level, slots }];
  }
  const mc = data.multiclass;
  return mc.classes
    .filter(c => c.name && (parseInt(c.level) || 0) > 0)
    .map(c => ({
      className:  c.name,
      classLevel: Math.min(20, parseInt(c.level) || 0),
      slots:      getAsiDataForClass(c.name)
    }));
}

// ══════════════════════════════════════════════════════════════════════════════
//  CLICK / APPLY / FEAT / UNDO
// ══════════════════════════════════════════════════════════════════════════════

function asiClickAttr(className, slotIdx, attr) {
  const slots = className ? getAsiDataForClass(className) : getAsiDataSingle();
  const entry = slots[slotIdx];
  if (!entry || entry.spent) return;

  const cur         = entry.pending[attr] || 0;
  const totalPoints = Object.values(entry.pending).reduce((s,v) => s+v, 0);

  if (cur === 0) {
    if (totalPoints >= 2) return;
    entry.pending[attr] = 1;
  } else if (cur === 1) {
    const otherPoints = totalPoints - cur;
    entry.pending[attr] = otherPoints === 0 ? 2 : 0;
  } else {
    entry.pending[attr] = 0;
  }

  const newTotal = Object.values(entry.pending).reduce((s,v) => s+v, 0);
  autoSave();
  renderAsiTracker();

  if (newTotal === 2) {
    setTimeout(() => asiApplyASI(className, slotIdx), 400);
  }
}

function asiApplyASI(className, slotIdx) {
  const slots = className ? getAsiDataForClass(className) : getAsiDataSingle();
  const entry = slots[slotIdx];
  if (!entry || entry.spent) return;

  Object.entries(entry.pending).forEach(([attr, bonus]) => {
    if (bonus <= 0) return;
    const el = document.getElementById(attr);
    if (!el) return;
    const newVal = Math.min(20, (parseInt(el.value) || 10) + bonus);
    el.value = newVal;
    data[attr] = newVal;
    entry.applied[attr] = bonus;
  });

  entry.spent    = true;
  entry.tookFeat = false;
  entry.pending  = {};

  if (typeof updateMods === 'function') updateMods();

  autoSave();
  renderAsiTracker();
  renderAsiHistory();

  Object.keys(entry.applied).forEach(attr => {
    const box = document.getElementById('statBox_' + attr);
    if (box) {
      box.classList.add('asi-stat-flash');
      setTimeout(() => box.classList.remove('asi-stat-flash'), 1200);
    }
  });
}

function asiMarkFeat(className, slotIdx) {
  const slots = className ? getAsiDataForClass(className) : getAsiDataSingle();
  const entry = slots[slotIdx];
  if (!entry) return;
  entry.spent    = true;
  entry.tookFeat = true;
  entry.pending  = {};
  entry.applied  = {};
  autoSave();
  renderAsiTracker();
  renderAsiHistory();
}

function asiUndo(className, slotIdx) {
  const slots = className ? getAsiDataForClass(className) : getAsiDataSingle();
  const entry = slots[slotIdx];
  if (!entry) return;

  if (!entry.tookFeat) {
    Object.entries(entry.applied || {}).forEach(([attr, bonus]) => {
      const el = document.getElementById(attr);
      if (!el) return;
      const newVal = Math.max(1, (parseInt(el.value) || 10) - bonus);
      el.value = newVal;
      data[attr] = newVal;
    });
    if (typeof updateMods === 'function') updateMods();
  }

  entry.spent    = false;
  entry.tookFeat = false;
  entry.pending  = {};
  entry.applied  = {};
  autoSave();
  renderAsiTracker();
  renderAsiHistory();
}

// ── Toggle history collapse ───────────────────────────────────────────────────
function asiToggleHistory() {
  data.asiHistoryOpen = !data.asiHistoryOpen;
  autoSave();
  renderAsiHistory();
}

// ── Called when identity-card level changes (single-class mode only) ──────────
function asiCheckLevelUp(newLevel) {
  if (asiIsMulticlass()) return; // multiclass handles its own per-class checks
  if (!ASI_LEVELS.includes(newLevel)) return;
  const slots   = getAsiDataSingle();
  const slotIdx = ASI_LEVELS.indexOf(newLevel);
  const entry   = slots[slotIdx];
  if (entry && !entry.spent) {
    autoSave();
    renderAsiTracker();
    setTimeout(() => {
      const el = document.getElementById('asiNotifBanner');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}

// ── Called from multiclass when a single class level changes ─────────────────
function asiCheckClassLevelUp(className, newClassLevel) {
  if (!ASI_LEVELS.includes(newClassLevel)) return;
  const slots   = getAsiDataForClass(className);
  const slotIdx = ASI_LEVELS.indexOf(newClassLevel);
  const entry   = slots[slotIdx];
  if (entry && !entry.spent) {
    autoSave();
    renderAsiTracker();
    setTimeout(() => {
      const el = document.getElementById('asiNotifBanner');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  RENDER: NOTIFICATION BANNER
// ══════════════════════════════════════════════════════════════════════════════
function renderAsiTracker() {
  const banner = document.getElementById('asiNotifBanner');
  if (!banner) return;

  const allClasses = asiGetAllClassSlots();

  const pendingEntries = [];
  allClasses.forEach(({ className, classLevel, slots }) => {
    slots.forEach((entry, slotIdx) => {
      if (classLevel >= entry.level && !entry.spent) {
        pendingEntries.push({ className, slotIdx, entry });
      }
    });
  });

  if (pendingEntries.length === 0) {
    banner.style.display = 'none';
    banner.innerHTML = '';
    return;
  }

  banner.style.display = '';

  let rows = '';
  pendingEntries.forEach(({ className, slotIdx, entry }) => {
    const totalPoints = Object.values(entry.pending || {}).reduce((s,v) => s+v, 0);
    const hasDouble   = Object.values(entry.pending || {}).some(v => v >= 2);
    const classArg    = className ? `'${className.replace(/'/g, "\\'")}'` : 'null';

    const attrBtns = ASI_ATTRS.map(attr => {
      const points = (entry.pending || {})[attr] || 0;
      const curVal = parseInt(document.getElementById(attr)?.value) || 10;

      let cls, blocked = false;
      if (points === 2)      { cls = 'asi-nb-attr-double'; }
      else if (points === 1) { cls = 'asi-nb-attr-sel'; }
      else if (hasDouble || (totalPoints >= 2 && points === 0)) {
        cls = 'asi-nb-attr-blocked'; blocked = true;
      } else { cls = 'asi-nb-attr'; }

      const valHtml = points > 0 ? `${curVal} → <b>${curVal + points}</b>` : `${curVal}`;
      let pipHtml   = '';
      if (points === 1) pipHtml = `<span class="asi-nb-attr-pip asi-pip-1">+1</span>`;
      if (points === 2) pipHtml = `<span class="asi-nb-attr-pip asi-pip-2">+2</span>`;
      const xHint   = points > 0 ? `<span class="asi-nb-attr-x">×</span>` : '';

      return `<button class="${cls}"
        onclick="${blocked ? '' : `asiClickAttr(${classArg},${slotIdx},'${attr}')`}"
        ${blocked ? 'disabled' : ''}
        title="${ASI_NAMES[attr]} (current: ${curVal})${points > 0 ? ' — click to remove' : ''}">
        ${xHint}
        <span class="asi-nb-attr-name">${ASI_LABELS[attr]}</span>
        <span class="asi-nb-attr-val">${valHtml}</span>
        ${pipHtml}
      </button>`;
    }).join('');

    const hint = totalPoints === 0
      ? 'Click once for +1, twice for +2 — or split across two stats'
      : totalPoints === 1
        ? 'Click same stat again for +2, or pick another for +1/+1'
        : '✓ Applying…';

    const headerLabel = className
      ? `${className} Level ${entry.level} — Ability Score Improvement`
      : `Level ${entry.level} — Ability Score Improvement`;

    rows += `
      <div class="asi-nb-entry">
        <div class="asi-nb-entry-header">
          <span class="asi-nb-lv">${headerLabel}</span>
        </div>
        <div class="asi-nb-attrs">${attrBtns}</div>
        <div class="asi-nb-footer">
          <span class="asi-nb-hint">${hint}</span>
          <button class="asi-nb-feat-btn" onclick="asiMarkFeat(${classArg},${slotIdx})">⭐ Took a Feat</button>
        </div>
      </div>
    `;
  });

  banner.innerHTML = `
    <div class="asi-nb-wrap">
      <div class="asi-nb-title">⚔ Ability Score Improvement</div>
      ${rows}
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════════════
//  RENDER: HISTORY PANEL
// ══════════════════════════════════════════════════════════════════════════════
function renderAsiHistory() {
  const container = document.getElementById('asiHistoryContainer');
  if (!container) return;

  const allClasses  = asiGetAllClassSlots();
  const unlockedAll = [];
  const spentAll    = [];

  allClasses.forEach(({ className, classLevel, slots }) => {
    slots.forEach((entry, slotIdx) => {
      if (classLevel >= entry.level) {
        unlockedAll.push({ className, slotIdx, entry });
        if (entry.spent) spentAll.push({ className, slotIdx, entry });
      }
    });
  });

  if (unlockedAll.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = '';

  const isOpen  = !!data.asiHistoryOpen;
  const chevron = isOpen ? '▾' : '▸';

  let histRows = '';
  if (isOpen) {
    if (spentAll.length === 0) {
      histRows = `<div class="asi-hist-empty">No ASIs applied yet.</div>`;
    } else {
      spentAll.forEach(({ className, slotIdx, entry }) => {
        const classArg   = className ? `'${className.replace(/'/g, "\\'")}'` : 'null';
        const levelLabel = className ? `${className} Lv ${entry.level}` : `Lv ${entry.level}`;
        const label = entry.tookFeat
          ? '⭐ Feat'
          : Object.entries(entry.applied || {}).filter(([,v]) => v > 0)
              .map(([k,v]) => `+${v} ${ASI_NAMES[k]}`).join(', ') || '✦ ASI';
        histRows += `
          <div class="asi-hist-row">
            <span class="asi-hist-lv">${levelLabel}</span>
            <span class="asi-hist-label">${label}</span>
            <button class="asi-undo-btn" onclick="asiUndo(${classArg},${slotIdx})" title="Undo">↺</button>
          </div>`;
      });
    }
  }

  container.innerHTML = `
    <div class="asi-hist-wrap">
      <div class="asi-hist-header" onclick="asiToggleHistory()">
        <span class="asi-hist-chevron">${chevron}</span>
        <span class="asi-hist-title">ASI History</span>
        ${spentAll.length > 0 ? `<span class="asi-hist-count">${spentAll.length}/${unlockedAll.length}</span>` : ''}
      </div>
      ${isOpen ? `<div class="asi-hist-body">${histRows}</div>` : ''}
    </div>
  `;
}
