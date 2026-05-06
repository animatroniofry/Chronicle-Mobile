// ═══════════════════════════════════════════
//  combat.js - COMBAT HUD, TIME TAB, MONEY TAB
// ═══════════════════════════════════════════

//  COMBAT HUD
// ═══════════════════════════════════════════
const HUD_CONDITIONS = [
  'Blinded','Charmed','Deafened','Exhaustion','Frightened',
  'Grappled','Incapacitated','Invisible','Paralyzed','Petrified',
  'Poisoned','Prone','Restrained','Stunned','Unconscious','Concentrating'
];

function toggleCombatHud() {
  const panel = document.getElementById('combatHudPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderCombatHud();
  repositionPanels();
}

// Combat HUD panel lock state
var combatHudLocked = false;

function toggleCombatHudLock() {
  combatHudLocked = !combatHudLocked;
  const btn = document.getElementById('combatHudLockBtn');
  if (btn) {
    btn.textContent = combatHudLocked ? '🔒' : '🔓';
    btn.title = combatHudLocked ? 'Unlock panel' : 'Lock panel';
    btn.style.opacity = combatHudLocked ? '1' : '0.6';
  }
  repositionPanels();
}

// Close combat HUD panel when clicking outside (unless locked)
document.addEventListener('click', function(e) {
  const panel = document.getElementById('combatHudPanel');
  const wrapper = document.getElementById('combatHudWrapper');
  if (!panel || !panel.classList.contains('open')) return;
  if (combatHudLocked) return;
  const fab = document.getElementById('fabMenu');
  if (fab && fab.contains(e.target)) return;
  if (!wrapper.contains(e.target)) {
    panel.classList.remove('open');
    repositionPanels();
  }
});

function renderCombatHud() {
  // HP
  const cur = parseInt(data.hpCurrent) || 0;
  const max = parseInt(data.hpMax) || 0;
  const tmp = parseInt(data.hpTemp) || 0;
  const hpEl = document.getElementById('hudHpDisplay');
  if (hpEl) {
    hpEl.textContent = cur;
    hpEl.style.color = cur <= 0 ? '#555' : cur < max * 0.3 ? '#ee3030' : cur < max * 0.6 ? '#e07030' : '#e05050';
  }
  const maxEl = document.getElementById('hudMaxDisplay'); if (maxEl) maxEl.textContent = max;
  const tmpEl = document.getElementById('hudTempDisplay'); if (tmpEl) tmpEl.textContent = tmp;
  const acEl = document.getElementById('hudAcDisplay');
  if (acEl) {
    if (typeof calcAutoAC === 'function' && (data.armor || []).length > 0) {
      const acResult = autoCalcAC(true);
      acEl.textContent = acResult.total;
      // Quietly sync data + armorClass input without showing a toast
      data.armorClass = acResult.total;
      const acInput = document.getElementById('armorClass');
      if (acInput) acInput.value = acResult.total;
    } else {
      acEl.textContent = data.armorClass || 10;
    }
  }
  const initEl2 = document.getElementById('hudInitDisplay'); if (initEl2) initEl2.textContent = fmtMod(parseInt(data.initiative) || 0);
  const tmpInp = document.getElementById('hudTempInput'); if (tmpInp) tmpInp.value = tmp || '';

  // Spell Slots — show all levels with max > 0, or hint if none
  const grid = document.getElementById('hudSlotsGrid');
  if (grid) {
    grid.innerHTML = '';
    let anySlots = false;
    for (let lvl = 1; lvl <= 9; lvl++) {
      const sd = data.spellSlots?.[lvl] || {max:0, used:0};
      if (!sd.max) continue;
      anySlots = true;
      const remaining = sd.max - sd.used;
      const grp = document.createElement('div');
      grp.className = 'hud-slot-group';
      const dots = Array.from({length: sd.max}, (_, i) => {
        const usedStart = sd.max - sd.used;
        const isUsed = i >= usedStart;
        return `<div class="hud-slot-dot ${isUsed ? 'used' : 'avail'}" 
          title="${isUsed ? 'Expended — click to restore' : 'Available — click to expend'}"
          onclick="hudToggleSlot(${lvl}, ${i})"></div>`;
      }).join('');
      grp.innerHTML = `
        <div class="hud-slot-lbl">${lvl}</div>
        <div class="hud-slot-dots">${dots}</div>
        <div style="font-family:'Cinzel',serif;font-size:8px;color:${remaining===0?'#552020':'#6a9a6a'};margin-top:2px;">${remaining}/${sd.max}</div>`;
      grid.appendChild(grp);
    }
    const noSlotsEl = document.getElementById('hudNoSlots');
    if (noSlotsEl) noSlotsEl.style.display = anySlots ? 'none' : '';
    const sec = document.getElementById('hudSpellSection');
    if (sec) sec.style.display = '';
  }

  // Hit Dice — always read from DOM input as source of truth
  const hdUsedInput = document.getElementById('hitDiceUsed');
  if (hdUsedInput) data.hitDiceUsed = parseInt(hdUsedInput.value) || 0;
  const hdMax = parseInt(data.charLevel) || 1;
  const hdUsed = parseInt(data.hitDiceUsed) || 0;
  const hdLeft = Math.max(0, hdMax - hdUsed);
  const hdType = (data.hitDice || 'd8').replace(/^\d+/, '');
  const hdEl = document.getElementById('hudHdDisplay'); if (hdEl) hdEl.textContent = hdLeft + '/' + hdMax;
  const hdTypeEl = document.getElementById('hudHdType'); if (hdTypeEl) hdTypeEl.textContent = hdType;

  // Death Saves
  const succDots = document.querySelectorAll('#hudDsSucc .hud-ds-dot');
  const failDots = document.querySelectorAll('#hudDsFail .hud-ds-dot');
  (data.deathSuccesses || [false,false,false]).forEach((v,i) => { if (succDots[i]) succDots[i].classList.toggle('filled', !!v); });
  (data.deathFailures  || [false,false,false]).forEach((v,i) => { if (failDots[i])  failDots[i].classList.toggle('filled', !!v); });
  const dsSec = document.getElementById('hudDsSection');
  if (dsSec) dsSec.style.display = cur <= 0 ? '' : 'none';
  // Re-apply active death save skin to HUD dots
  if (typeof applyDsSkin === 'function' && typeof getActiveDsSkin === 'function') {
    applyDsSkin(getActiveDsSkin());
  }

  // Consumables
  const cl = document.getElementById('hudConsList');
  if (cl) {
    if (!(data.hudConsumables || []).length) {
      cl.innerHTML = '<div style="font-family:Crimson Text,serif;font-size:17px;color:var(--text-muted);padding:4px 0;">No consumables added yet.</div>';
    } else {
      cl.innerHTML = (data.hudConsumables || []).map((c, i) => `
        <div class="hud-consumable-row">
          <div class="hud-cons-name">${c.name}${c.inventoryId ? ' <span style="font-size:10px;color:var(--accent-gold);opacity:0.7;" title="Synced with inventory">⚡</span>' : ''}</div>
          <button class="hud-cons-btn" onclick="hudUseConsumable(${i},-1)">−</button>
          <div class="hud-cons-count">${c.count}</div>
          <button class="hud-cons-btn" onclick="hudUseConsumable(${i},1)">+</button>
          <button class="hud-cons-btn hud-cons-del" onclick="hudDeleteConsumable(${i})">✕</button>
        </div>`).join('');
    }
  }

  // Conditions
  const cg = document.getElementById('hudCondGrid');
  if (cg) {
    const tips = {"Blinded":"Cannot see; auto-fails sight checks; attacks vs you advantage","Charmed":"Can\u2019t attack charmer; charmer has advantage on social checks","Deafened":"Can\u2019t hear; fails hearing checks","Exhaustion":"Stacks 1\u20136: disadvantage, halved speed, disadvantage attacks/saves, halved HP max, death at 6","Frightened":"Disadvantage on checks/attacks while source visible; can\u2019t move closer","Grappled":"Speed 0; ends if grappler incapacitated","Incapacitated":"No actions or reactions","Invisible":"Unseen; your attacks advantage; attacks vs you advantage","Paralyzed":"Incapacitated; auto-fails Str/Dex; attacks advantage; crits within 5 ft","Petrified":"Stone; incapacitated; immune poison/disease; resistant all dmg","Poisoned":"Disadvantage on attack rolls and ability checks","Prone":"Attacks at disadvantage; melee vs you advantage; ranged vs you disadvantage","Restrained":"Speed 0; attacks disadvantage; attacks vs you advantage; Dex saves disadvantage","Stunned":"Incapacitated; auto-fails Str/Dex; attacks vs you advantage","Unconscious":"Incapacitated; drops held items; falls prone; crits in 5 ft","Concentrating":"Maintaining concentration spell. Damage may break it (DC = half dmg or 10)"};
    cg.innerHTML = HUD_CONDITIONS.map(c => {
      const active = !!(data.conditions || {})[c];
      const tip = tips[c] || c;
      return `<div class="hud-cond-chip ${active ? 'active' : ''}" onclick="hudToggleCondition('${c}')" title="${tip}">${c}</div>`;
    }).join('');
  }

  // Food/Water display removed from HUD (available in Notes tab and General panel)

  // Inspiration — synced via renderInspiration()
  renderInspiration();

  // Effects tracker
  hudRenderEffects();
}

// HP staging — accumulate before applying
let _hudHpStaged = 0; // positive = heal, negative = dmg

function hudHpStage(amt, mode) {
  if (mode === 'heal') _hudHpStaged += amt;
  else _hudHpStaged -= amt;
  _hudHpUpdatePending();
}

function hudHpStageCustom(mode) {
  const val = Math.abs(parseInt(document.getElementById('hudHpInput')?.value) || 0);
  if (!val) return;
  if (mode === 'heal') _hudHpStaged += val;
  else _hudHpStaged -= val;
  document.getElementById('hudHpInput').value = '';
  _hudHpUpdatePending();
}

function hudHpPreviewCustom() {
  // no-op — just let staging buttons handle it
}

function _hudHpUpdatePending() {
  const p = document.getElementById('hudHpPending');
  const applyBtn = document.getElementById('hudHpApplyBtn');
  const cancelBtn = document.getElementById('hudHpCancelBtn');
  if (!p) return;
  if (_hudHpStaged === 0) {
    p.innerHTML = '';
    if (applyBtn) applyBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
    return;
  }
  const isHeal = _hudHpStaged > 0;
  const color = isHeal ? '#60cc60' : '#cc4040';
  const sign = isHeal ? '+' : '';
  p.innerHTML = `<span style="color:${color};font-size:16px;">${sign}${_hudHpStaged} HP</span>`;
  if (applyBtn) { applyBtn.style.display = ''; applyBtn.style.borderColor = isHeal ? '#5a9a40' : '#aa3030'; applyBtn.style.color = isHeal ? '#80cc50' : '#ee6050'; }
  if (cancelBtn) cancelBtn.style.display = '';
}

function hudHpApply() {
  if (_hudHpStaged === 0) return;
  const max = parseInt(data.hpMax) || 0;
  if (_hudHpStaged > 0) {
    data.hpCurrent = Math.min(max, (parseInt(data.hpCurrent)||0) + _hudHpStaged);
  } else {
    let dmg = Math.abs(_hudHpStaged);
    const tmp = parseInt(data.hpTemp) || 0;
    if (tmp > 0) { const abs = Math.min(tmp, dmg); data.hpTemp = tmp - abs; dmg -= abs; }
    data.hpCurrent = Math.max(0, (parseInt(data.hpCurrent)||0) - dmg);
  }
  const curEl = document.getElementById('hpCurrent'); if (curEl) curEl.value = data.hpCurrent;
  const tmpEl = document.getElementById('hpTemp'); if (tmpEl) tmpEl.value = data.hpTemp;
  if (data.hpCurrent <= 0) _autoLog('💀 HP dropped to 0 — Death Saving Throws!', 'Combat');
  wsSyncHpFromMain();
  _hudHpStaged = 0;
  _hudHpUpdatePending();
  renderCombatHud();
  autoSave();
}

function hudHpCancel() {
  _hudHpStaged = 0;
  _hudHpUpdatePending();
}

// Zmena HP s prioritou Temp HP — používa sa z hlavného sheetu (spin buttony, ±1/±5)
function changeHpWithTemp(delta) {
  if (delta >= 0) {
    // Heal — ide priamo do hpCurrent (temp HP sa nehealuje)
    const max = parseInt(data.hpMax) || 0;
    data.hpCurrent = Math.min(max, (parseInt(data.hpCurrent) || 0) + delta);
  } else {
    // Poškodenie — odpočíta najprv z temp HP
    let dmg = Math.abs(delta);
    const tmp = parseInt(data.hpTemp) || 0;
    if (tmp > 0) {
      const absorbed = Math.min(tmp, dmg);
      data.hpTemp = tmp - absorbed;
      dmg -= absorbed;
      // Sync temp HP input
      const tmpEl = document.getElementById('hpTemp');
      if (tmpEl) tmpEl.value = data.hpTemp;
      // Sync HUD temp input
      const hudTmpEl = document.getElementById('hudTempInput');
      if (hudTmpEl) hudTmpEl.value = data.hpTemp;
    }
    if (dmg > 0) {
      data.hpCurrent = Math.max(0, (parseInt(data.hpCurrent) || 0) - dmg);
    }
  }
  // Sync hpCurrent input
  const curEl = document.getElementById('hpCurrent');
  if (curEl) curEl.value = data.hpCurrent;
  if (data.hpCurrent <= 0) _autoLog('💀 HP dropped to 0 — Death Saving Throws!', 'Combat');
  wsSyncHpFromMain();
  renderCombatHud();
  autoSave();
}

// Legacy function kept for compatibility
function hudHpChange(sign) {
  const inp = document.getElementById('hudHpInput');
  const val = Math.abs(parseInt(inp?.value) || 0);
  if (!val) return;
  if (sign > 0) hudHpStage(val, 'heal');
  else hudHpStage(val, 'dmg');
  if (inp) inp.value = '';
}

function hudToggleSlot(level, idx) {
  const sd = data.spellSlots[level];
  const usedStart = sd.max - sd.used;
  const expending = idx < usedStart;
  if (expending) {
    sd.used = Math.min(sd.max, sd.used + 1);
    _autoLog(`✨ Spell slot expended — Level ${level} (${sd.max - sd.used}/${sd.max} remaining)`, 'Spell');
  } else {
    sd.used = Math.max(0, sd.used - 1);
    _autoLog(`✨ Spell slot restored — Level ${level} (${sd.max - sd.used}/${sd.max} remaining)`, 'Spell');
  }
  buildSpellSlots(); // keep main sheet in sync
  renderCombatHud();
  autoSave();
}

function hudRestoreAllSlots() {
  for (let lvl = 1; lvl <= 9; lvl++) {
    if (data.spellSlots?.[lvl]) data.spellSlots[lvl].used = 0;
  }
  buildSpellSlots();
  renderCombatHud();
  autoSave();
}

function hudUseHitDice() {
  // Sync from DOM first so we have current value
  const hdUsedEl = document.getElementById('hitDiceUsed');
  if (hdUsedEl) data.hitDiceUsed = parseInt(hdUsedEl.value) || 0;
  const hdMax = parseInt(data.charLevel) || 1;
  const hdUsed = parseInt(data.hitDiceUsed) || 0;
  if (hdUsed >= hdMax) { showToast('No hit dice remaining!'); return; }
  data.hitDiceUsed = hdUsed + 1;
  // Sync back to main sheet input
  if (hdUsedEl) hdUsedEl.value = data.hitDiceUsed;
  // Roll the hit die and heal
  const sides = parseInt((data.hitDice || 'd8').replace(/^\d+d?/,'')) || 8;
  const roll = Math.ceil(Math.random() * sides);
  const conMod = getMod(data.con || 10);
  const healed = Math.max(1, roll + conMod);
  data.hpCurrent = Math.min(parseInt(data.hpMax)||0, (parseInt(data.hpCurrent)||0) + healed);
  const curEl = document.getElementById('hpCurrent'); if (curEl) curEl.value = data.hpCurrent;
  // flash result
  const hdEl = document.getElementById('hudHdDisplay');
  if (hdEl) { hdEl.textContent = '+' + healed + ' HP'; setTimeout(() => renderCombatHud(), 1200); }
  // Sync main sheet hit dice display
  updateHitDiceRemaining();
  autoSave();
}

function hudRestoreHitDice() {
  const hdUsedEl = document.getElementById('hitDiceUsed');
  if (hdUsedEl) data.hitDiceUsed = parseInt(hdUsedEl.value) || 0;
  data.hitDiceUsed = Math.max(0, (parseInt(data.hitDiceUsed)||0) - 1);
  if (hdUsedEl) hdUsedEl.value = data.hitDiceUsed;
  // Sync main sheet hit dice display
  updateHitDiceRemaining();
  renderCombatHud(); autoSave();
}

function hudToggleDS(type, idx) {
  if (type === 'suc') {
    if (!data.deathSuccesses) data.deathSuccesses = [false,false,false];
    data.deathSuccesses[idx] = !data.deathSuccesses[idx];
  } else {
    if (!data.deathFailures) data.deathFailures = [false,false,false];
    data.deathFailures[idx] = !data.deathFailures[idx];
  }
  renderCombatHud(); autoSave();
}

function hudAddConsumable() {
  const name = document.getElementById('hudConsName')?.value.trim();
  const count = parseInt(document.getElementById('hudConsCount')?.value) || 1;
  if (!name) return;
  if (!data.hudConsumables) data.hudConsumables = [];
  data.hudConsumables.push({name, count});
  document.getElementById('hudConsName').value = '';
  document.getElementById('hudConsCount').value = '';
  renderCombatHud(); autoSave();
}

function hudUseConsumable(idx, delta) {
  if (!data.hudConsumables?.[idx]) return;
  data.hudConsumables[idx].count = Math.max(0, data.hudConsumables[idx].count + delta);
  // Sync back to inventory if linked
  const invId = data.hudConsumables[idx].inventoryId;
  if (invId) {
    const invItem = (data.inventory||[]).find(it => it._id === invId);
    if (invItem) {
      invItem.qty = data.hudConsumables[idx].count;
      renderInventory();
    }
  }
  // Sync back to tracker if linked
  const trkId = data.hudConsumables[idx].trackerId;
  if (trkId) {
    const trk = (data.trackers||[]).find(t => t._id === trkId);
    if (trk) {
      trk.used = Math.min(trk.max||5, Math.max(0, data.hudConsumables[idx].count));
      renderTrackers();
    }
  }
  renderCombatHud(); autoSave();
}

function hudDeleteConsumable(idx) {
  // Unlink from inventory if linked
  const invId = data.hudConsumables?.[idx]?.inventoryId;
  if (invId) {
    const invItem = (data.inventory||[]).find(it => it._id === invId);
    if (invItem) delete invItem._linkedToQuick;
    renderInventory();
  }
  // Unlink from tracker if linked
  const trkId = data.hudConsumables?.[idx]?.trackerId;
  if (trkId) {
    const trk = (data.trackers||[]).find(t => t._id === trkId);
    if (trk) delete trk._linkedToQuick;
    renderTrackers();
  }
  data.hudConsumables?.splice(idx, 1);
  renderCombatHud(); autoSave();
}

// Add inventory item to Quick Bar (consumables) with sync
function inventoryToQuickBar(invIdx) {
  const item = (data.inventory||[])[invIdx];
  if (!item) return;
  // Assign a unique ID if not present
  if (!item._id) item._id = 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  // Check if already linked
  if (data.hudConsumables && data.hudConsumables.find(c => c.inventoryId === item._id)) {
    showToast(item.name + ' is already in the Quick Bar!');
    return;
  }
  if (!data.hudConsumables) data.hudConsumables = [];
  data.hudConsumables.push({
    name: item.name || 'Item',
    count: parseInt(item.qty) || 1,
    inventoryId: item._id
  });
  item._linkedToQuick = true;
  renderInventory();
  renderCombatHud();
  autoSave();
  showToast('⚡ ' + (item.name||'Item') + ' added to Quick Bar!');
}

// Sync inventory qty change → linked hudConsumable
function syncInvQtyToQuick(invIdx) {
  const item = (data.inventory||[])[invIdx];
  if (!item || !item._id) return;
  const cons = (data.hudConsumables||[]).find(c => c.inventoryId === item._id);
  if (cons) {
    cons.count = parseInt(item.qty) || 0;
    renderCombatHud();
  }
}

// Add resource tracker to Quick Bar with sync
function trackerToQuickBar(tIdx) {
  const t = (data.trackers||[])[tIdx];
  if (!t) return;
  if (!t._id) t._id = 'trk_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  if (data.hudConsumables && data.hudConsumables.find(c => c.trackerId === t._id)) {
    showToast((t.name||'Resource') + ' is already in the Quick Bar!');
    return;
  }
  if (!data.hudConsumables) data.hudConsumables = [];
  data.hudConsumables.push({
    name: t.name || 'Resource',
    count: t.used||0,
    trackerId: t._id
  });
  t._linkedToQuick = true;
  renderTrackers();
  renderCombatHud();
  autoSave();
  showToast('⚡ ' + (t.name||'Resource') + ' added to Quick Bar!');
}

// Sync tracker change → linked hudConsumable (remaining = max - used)
function syncTrackerToQuick(tIdx) {
  const t = (data.trackers||[])[tIdx];
  if (!t || !t._id) return;
  const cons = (data.hudConsumables||[]).find(c => c.trackerId === t._id);
  if (cons) {
    cons.count = t.used||0;
    renderCombatHud();
  }
}

function hudToggleCondition(name) {
  if (!data.conditions) data.conditions = {};
  data.conditions[name] = !data.conditions[name];
  const isOn = data.conditions[name];
  _autoLog(`⚡ Condition ${isOn ? 'gained' : 'removed'}: ${name}`, 'Condition');
  // sync to main sheet condition chips
  const chips = document.querySelectorAll('.cond-chip');
  chips.forEach(ch => { if (ch.dataset.cond === name) ch.classList.toggle('active', !!data.conditions[name]); });
  renderCombatHud(); autoSave();
}

function hudConsumeFood(n) { _changeFood(-n); renderCombatHud(); showToast(n===1?'One meal eaten −1 food ✦':'Full day eaten −3 food ✦'); }
function hudDrink() { _changeWater(-1/3); renderCombatHud(); showToast('Drank −⅓ gallon ✦'); }
function hudConsumeFullDay() { _changeFood(-3); _changeWater(-1); renderCombatHud(); showToast('Full day consumed −3 food −1 water ✦'); }

function hudToggleInspiration() {
  data.inspiration = !data.inspiration;
  renderInspiration();
  autoSave();
}

function hudShortRest() {
  if (confirm('Short Rest: use hit dice to heal?\n(Use the Hit Dice section to roll them manually)')) {
    renderCombatHud();
    _autoLog('☕ Short Rest taken (HUD)', 'Rest');
    autoSave();
  }
}

function hudLongRest() {
  if (!confirm('Long Rest: Restore HP to max, all spell slots, and half your hit dice?')) return;
  // HP to max
  data.hpCurrent = parseInt(data.hpMax) || 0;
  data.hpTemp = 0;
  // All spell slots restored
  for (let lvl = 1; lvl <= 9; lvl++) {
    if (data.spellSlots?.[lvl]) data.spellSlots[lvl].used = 0;
  }
  // Restore half hit dice
  const hdMax = parseInt(data.charLevel) || 1;
  data.hitDiceUsed = Math.max(0, (parseInt(data.hitDiceUsed)||0) - Math.max(1, Math.floor(hdMax/2)));
  // Clear death saves
  data.deathSuccesses = [false,false,false];
  data.deathFailures  = [false,false,false];
  // Reset prayers
  (data.prayers||[]).forEach(p => { p.pips = []; });
  renderPrayers();
  // Reset short rests
  data.shortRests = [false, false, false, false, false];
  for (let i = 0; i < 5; i++) document.getElementById('shortRest'+i)?.classList.remove('used');
  // Sync to main sheet
  const curEl = document.getElementById('hpCurrent'); if (curEl) curEl.value = data.hpCurrent;
  const tmpEl = document.getElementById('hpTemp'); if (tmpEl) tmpEl.value = 0;
  buildSpellSlots();
  _autoLog('🌙 Long Rest taken (HUD) — HP & spell slots restored', 'Rest');
  renderCombatHud();
  // Sync floating TIME panel if open
  const _drTime = document.getElementById('drContentTime');
  if (_drTime && _drTime.classList.contains('active')) renderTimeTab();
  autoSave();
}

// ═══════════════════════════════════════════
//  TIME TAB
// ═══════════════════════════════════════════
function renderTimeTab() {
  initTimeData();
  const td = data.timeData;
  const h = td.hour, m = td.minute;
  // Digital
  const dig = document.getElementById('qtDigital');
  if (dig) dig.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
  // Period
  const period = h>=5&&h<12?'MORNING':h>=12&&h<17?'AFTERNOON':h>=17&&h<21?'EVENING':'NIGHT';
  const periodIcon = h>=5&&h<12?'☀️':h>=12&&h<17?'🌞':h>=17&&h<21?'🌆':'🌙';
  const ptEl = document.getElementById('qtPeriodText'); if (ptEl) ptEl.textContent = period;
  // Analog clock
  const hAngle = ((h%12)/12*360 + m/60*30 - 90) * Math.PI/180;
  const mAngle = (m/60*360 - 90) * Math.PI/180;
  const hh = document.getElementById('qtHourHand');
  const mh = document.getElementById('qtMinuteHand');
  if (hh) { hh.setAttribute('x2', 45+Math.cos(hAngle)*27); hh.setAttribute('y2', 45+Math.sin(hAngle)*27); }
  if (mh) { mh.setAttribute('x2', 45+Math.cos(mAngle)*35); mh.setAttribute('y2', 45+Math.sin(mAngle)*35); }
  const pp = document.getElementById('qtPeriod'); if (pp) pp.textContent = period.slice(0,3);
  // Build clock marks once
  const marks = document.getElementById('qtMarks');
  if (marks && marks.children.length === 0) {
    for (let i=0;i<12;i++) {
      const a = (i/12*360-90)*Math.PI/180;
      const r = i%3===0?36:38;
      const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
      ln.setAttribute('x1', 45+Math.cos(a)*r); ln.setAttribute('y1', 45+Math.sin(a)*r);
      ln.setAttribute('x2', 45+Math.cos(a)*42); ln.setAttribute('y2', 45+Math.sin(a)*42);
      ln.setAttribute('stroke', i%3===0 ? getComputedStyle(document.body).getPropertyValue('--border-gold').trim() : getComputedStyle(document.body).getPropertyValue('--border-dark').trim());
      ln.setAttribute('stroke-width', i%3===0?'1.5':'0.8');
      marks.appendChild(ln);
    }
  }
  // Date line
  const monthName = td.months[td.monthIdx]?.name || '—';
  const dlEl = document.getElementById('qtDateLine');
  if (dlEl) dlEl.textContent = `${td.day} ${monthName}, ${td.year}`;
  // Weekday
  const daysPerWeek = td.daysPerWeek || 7;
  const weekdays = (td.weekdays||'').split(',').map(s=>s.trim());
  let totalDays = 0;
  for (let mi=0; mi<td.monthIdx; mi++) totalDays += (td.months[mi]?.days||30);
  totalDays += td.day - 1;
  const wdName = weekdays[totalDays % daysPerWeek] || (totalDays%daysPerWeek+1)+'-day';
  const wdEl = document.getElementById('qtWeekday'); if (wdEl) wdEl.textContent = wdName.toUpperCase();
  // Season + weather
  const sEl = document.getElementById('qtSeason'); if (sEl) sEl.textContent = td.season || '🌸 Spring';
  const wEl = document.getElementById('qtWeather');
  if (wEl) {
    if (td.weatherIcon && td.weather) wEl.textContent = td.weatherIcon + ' ' + td.weather;
    else wEl.textContent = td.weather || '⛅ Clear';
  }
  // Temperature — always recalculate and display
  const tEl = document.getElementById('qtTemp');
  if (tEl) {
    // If no weatherTemp yet, use season-based default (don't call getTempRange to avoid DOM deps)
    const SEASON_DEFAULTS = {Spring:12, Summer:26, Autumn:8, Winter:-3};
    let midTemp = td.weatherTemp;
    if (midTemp === undefined || midTemp === null) {
      const sk = getSeasonKey();
      midTemp = SEASON_DEFAULTS[sk] !== undefined ? SEASON_DEFAULTS[sk] : 15;
      td.weatherTemp = midTemp;
    }
    // Time-of-day adjustment: same formula as getTempAtHour
    const hour = td.hour || 12;
    const amplitude = Math.max(3, Math.abs(midTemp) * 0.25 + 2);
    const angle = ((hour - 14) / 12) * Math.PI;
    const currentTemp = Math.round(midTemp + amplitude * Math.cos(angle) - amplitude * 0.2);
    const tempF = Math.round(currentTemp * 9/5 + 32);
    const col = currentTemp > 30 ? '#e05030' : currentTemp > 20 ? '#e8a040' : currentTemp > 10 ? '#80c050' : currentTemp > 0 ? '#50b0e0' : '#80a0e8';
    tEl.textContent = tempF + '°F / ' + currentTemp + '°C';
    tEl.style.color = col;
  }
  // Mini calendar
  buildQtCalGrid();
}

function buildQtCalGrid() {
  initTimeData();
  const td = data.timeData;
  const grid = document.getElementById('qtCalGrid');
  if (!grid) return;
  const daysPerWeek = Math.max(1, Math.min(td.daysPerWeek||7, 10));
  const daysInMonth = td.months[td.monthIdx]?.days || 30;
  const weekdays = (td.weekdays||'').split(',').map(s=>s.trim());
  const holidays = {};
  getHolidaysForMonth(td.monthIdx).forEach(hol => { holidays[hol.day] = hol.name; });
  // Calculate start offset
  let totalDaysBefore = 0;
  for (let mi=0; mi<td.monthIdx; mi++) totalDaysBefore += (td.months[mi]?.days||30);
  const startOffset = totalDaysBefore % daysPerWeek;

  grid.style.gridTemplateColumns = `repeat(${daysPerWeek}, minmax(0,1fr))`;
  grid.innerHTML = '';

  // Month name + year in header
  const mnEl = document.getElementById('qtCalMonthName');
  if (mnEl) mnEl.textContent = td.months[td.monthIdx]?.name || '—';
  const yrEl = document.getElementById('qtCalYear');
  if (yrEl) yrEl.textContent = td.year;

  // Weekday headers — abbreviated to 2 chars
  for (let i=0; i<daysPerWeek; i++) {
    const name = weekdays[i] || String(i+1);
    const hdr = document.createElement('div');
    hdr.className = 'qt-cal-cell hdr';
    hdr.textContent = name.slice(0,2).toUpperCase();
    hdr.title = name;
    grid.appendChild(hdr);
  }
  // Empty offset cells
  for (let i=0; i<startOffset; i++) {
    const e = document.createElement('div'); grid.appendChild(e);
  }
  // Day cells
  for (let d=1; d<=daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'qt-cal-cell' + (d===td.day?' today':'') + (holidays[d]?' holiday':'');
    cell.textContent = d;
    cell.title = holidays[d] ? `🎉 ${holidays[d]}` : '';
    const qnKey = `${td.monthIdx}_${d}`;
    const hasQNote = !!(td.dayNotes && td.dayNotes[qnKey]);
    const isHolidayQt = !!holidays[d];
    if (hasQNote || isHolidayQt) {
      cell.style.background = hasQNote ? 'rgba(160,130,40,0.2)' : 'rgba(100,40,130,0.2)';
      cell.style.border = '1px solid ' + (hasQNote ? '#8a6820' : '#7040a0');
      cell.style.borderRadius = '3px';
      cell.title = hasQNote ? '📝 ' + (td.dayNotes[qnKey]||'') : '🎉 ' + (holidays[d]||'');
    }
    cell.onclick = () => qtOpenDayNote(d, td.monthIdx);
    grid.appendChild(cell);
  }
}

function qtCycleSeason() {
  initTimeData();
  const seasons = ['🌸 Spring','☀️ Summer','🍂 Autumn','❄️ Winter'];
  const cur = data.timeData.season || '🌸 Spring';
  const idx = seasons.findIndex(s => cur.includes(s.replace(/[🌸☀️🍂❄️]/g,'')));
  const next = seasons[(Math.max(0,idx) + 1) % 4];
  data.timeData.season = next;
  const el = document.getElementById('calSeason');
  if (el) el.value = next.replace(/[^a-zA-Z ]/g,'').trim();
  renderTimeTab(); updateCalendar(); autoSave();
  showToast('Season: ' + next + ' ✦');
}

function qtGenerateWeather() {
  initTimeData();
  // generateWeather() sets td.weather, td.weatherIcon, td.weatherTemp, td.weatherWind
  generateWeather();
  const td = data.timeData;
  // Sync calWeather input on main tab
  const el = document.getElementById('calWeather');
  if (el) el.value = td.weather || 'Clear';
  renderTimeTab(); updateCalendar(); autoSave();
  const tempC = td.weatherTemp;
  const tempF = tempC !== undefined ? Math.round(tempC * 9/5 + 32) : null;
  const tempStr = tempF !== null ? ` · ${tempF}°F / ${tempC}°C` : '';
  showToast((td.weatherIcon || '⛅') + ' ' + (td.weather || 'Clear') + tempStr + ' ✦');
}

function qtOpenDayNote(d, monthIdx) {
  // Open day note popup (same as main calendar's showDayPopup, doesn't change date)
  const td = data.timeData;
  const noteKey = `${monthIdx}_${d}`;
  const existingNote = (td.dayNotes || {})[noteKey] || '';
  const monthName = td.months[monthIdx]?.name || '';
  const holidays = {};
  getHolidaysForMonth(monthIdx).forEach(h => { holidays[h.day] = h.name; });
  const isHol = !!holidays[d];
  showModal(`📅 ${d} ${monthName}${isHol ? ' 🎉 ' + holidays[d] : ''}`, `
    <div class="field">
      <label>Quick Note for this day</label>
      <textarea id="qtDayNoteInput" rows="4" placeholder="Quest reminder, event, battle…" style="width:100%;resize:vertical;">${existingNote}</textarea>
    </div>
    ${isHol ? `<div style="font-family:'Cinzel',serif;font-size:11px;color:#c060f0;margin-bottom:8px;">🎉 ${holidays[d]}</div>` : ''}
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Clear', action:`
      data.timeData.dayNotes = data.timeData.dayNotes||{};
      delete data.timeData.dayNotes['${noteKey}'];
      autoSave(); buildCalendarGrid(); closeModal();
      document.getElementById('qtCalGrid') && renderTimeTab();
    `, cls:'btn-danger'},
    {label:'Save Note', action:`
      data.timeData.dayNotes = data.timeData.dayNotes||{};
      const v = document.getElementById('qtDayNoteInput')?.value?.trim();
      if (v) data.timeData.dayNotes['${noteKey}'] = v;
      else delete data.timeData.dayNotes['${noteKey}'];
      autoSave(); buildCalendarGrid(); closeModal();
      renderTimeTab();
      showToast('Note saved for ${d} ${monthName} ✦');
    `, cls:'btn-primary'}
  ]);
}

function qtJumpToDay(d) {
  initTimeData();
  data.timeData.day = d;
  updateCalendar(); updateClock();
  renderTimeTab();
  autoSave();
}

function qtChangeMonth(dir) {
  initTimeData();
  const td = data.timeData;
  td.monthIdx = (td.monthIdx + dir + td.months.length) % td.months.length;
  if (dir > 0 && td.monthIdx === 0) td.year++;
  if (dir < 0 && td.monthIdx === td.months.length-1) td.year--;
  td.day = Math.min(td.day, td.months[td.monthIdx]?.days||30);
  updateCalendar(); updateClock(); renderTimeTab(); autoSave();
}

function qtChangeDay(dir) {
  initTimeData();
  for (let i=0;i<Math.abs(dir);i++) advanceDayInternal(dir>0?1:-1);
  updateCalendar(); updateClock(); renderTimeTab(); autoSave();
}

function qtApplyTime() {
  initTimeData();
  const h = Math.max(0,Math.min(23,parseInt(document.getElementById('qtSetH')?.value)||0));
  const m = Math.max(0,Math.min(59,parseInt(document.getElementById('qtSetM')?.value)||0));
  data.timeData.hour = h; data.timeData.minute = m;
  updateClock(); renderTimeTab(); autoSave();
}

function qtSetDawn() {
  initTimeData();
  data.timeData.hour = 6; data.timeData.minute = 0;
  updateClock(); renderTimeTab(); autoSave();
}

function qtLongRest() {
  // Advance to next dawn (6:00)
  initTimeData();
  const td = data.timeData;
  const minsUntilDawn = (td.hour >= 6)
    ? (24*60 - td.hour*60 - td.minute + 6*60)
    : (6*60 - td.hour*60 - td.minute);
  advanceTime(0, minsUntilDawn);

  // ── Full Long Rest: restore HP, spell slots, hit dice, death saves ──
  data.hpCurrent = parseInt(data.hpMax) || 0;
  data.hpTemp = 0;
  for (let lvl = 1; lvl <= 9; lvl++) {
    if (data.spellSlots?.[lvl]) data.spellSlots[lvl].used = 0;
  }
  const hdMax = parseInt(data.charLevel) || 1;
  data.hitDiceUsed = Math.max(0, (parseInt(data.hitDiceUsed)||0) - Math.max(1, Math.floor(hdMax/2)));
  data.deathSuccesses = [false,false,false];
  data.deathFailures  = [false,false,false];
  (data.prayers||[]).forEach(p => { p.pips = []; });
  if (typeof renderPrayers === 'function') renderPrayers();
  data.shortRests = [false, false, false, false, false];
  for (let i = 0; i < 5; i++) document.getElementById('shortRest'+i)?.classList.remove('used');
  // Sync HP to main sheet inputs
  const curEl = document.getElementById('hpCurrent'); if (curEl) curEl.value = data.hpCurrent;
  const tmpEl = document.getElementById('hpTemp');    if (tmpEl) tmpEl.value = 0;
  if (typeof buildSpellSlots === 'function') buildSpellSlots();
  if (typeof renderCombatHud === 'function') renderCombatHud();
  _autoLog('🌙 Long Rest taken (TIME panel) — HP & spell slots restored', 'Rest');
  renderTimeTab();
  autoSave();
  if (typeof showToast === 'function') showToast('Long Rest complete — dawn 🌅');
}

// ═══════════════════════════════════════════
//  MONEY TAB
// ═══════════════════════════════════════════
const COIN_NAMES = { cp:'Copper', sp:'Silver', ep:'Electrum', gp:'Gold', pp:'Platinum' };
// qrTxHistory je alias na data.txHistory — perzistentný cez localStorage
Object.defineProperty(window, 'qrTxHistory', {
  get: function() { return (typeof data !== 'undefined' && data.txHistory) ? data.txHistory : []; },
  set: function(v) { if (typeof data !== 'undefined') data.txHistory = v; }
});

function renderMoneyTab() {
  const cp = parseInt(data.cp)||0, sp=parseInt(data.sp)||0, ep=parseInt(data.ep)||0,
        gp = parseInt(data.gp)||0, pp=parseInt(data.pp)||0;
  const set = (id, val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
  // Floating panel displays
  set('qrCpAmt', cp); set('qrSpAmt', sp); set('qrEpAmt', ep);
  set('qrGpAmt', gp); set('qrPpAmt', pp);
  const total = (cp/100)+(sp/10)+(ep/2)+gp+(pp*10);
  set('qrTotalGP', total.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})+' GP');
  // Main page inputs
  ['cp','sp','ep','gp','pp'].forEach(c => {
    const inp = document.getElementById(c);
    if (inp && document.activeElement !== inp) inp.value = data[c] || 0;
  });
  // Main page total
  const mainTotal = document.getElementById('totalGP');
  if (mainTotal) mainTotal.textContent = total.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})+' GP';
  // tx log
  const log = document.getElementById('qrTxLog');
  if (log) {
    if (!qrTxHistory.length) { log.innerHTML = '<span style="color:var(--text-muted);">No transactions yet…</span>'; return; }
    log.innerHTML = qrTxHistory.map(t => `<div>${t}</div>`).join('');
  }
}

// Zavolá sa keď user zmení hodnotu priamo v hlavnom tabe (oninput)
function syncCoinFromMain(coin) {
  const inp = document.getElementById(coin);
  if (!inp) return;
  const val = Math.max(0, parseInt(inp.value) || 0);
  data[coin] = val;
  inp.value = val;
  // Aktualizuj floating panel display
  const qrEl = document.getElementById('qr' + coin.charAt(0).toUpperCase() + coin.slice(1) + 'Amt');
  if (qrEl) qrEl.textContent = val;
  // Aktualizuj total v oboch miestach
  const cp=parseInt(data.cp)||0, sp=parseInt(data.sp)||0, ep=parseInt(data.ep)||0,
        gp=parseInt(data.gp)||0, pp=parseInt(data.pp)||0;
  const total = (cp/100)+(sp/10)+(ep/2)+gp+(pp*10);
  const fmt = total.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})+' GP';
  const qrTotal = document.getElementById('qrTotalGP'); if (qrTotal) qrTotal.textContent = fmt;
  const mainTotal = document.getElementById('totalGP'); if (mainTotal) mainTotal.textContent = fmt;
  autoSave();
}

// ── Staged coin system (HP-style) ──
const _coinStaged = {cp:0, sp:0, ep:0, gp:0, pp:0};
const COIN_ID_MAP = {cp:'cp', sp:'sp', ep:'ep', gp:'gp', pp:'pp'};

function coinStage(coin, amount) {
  _coinStaged[coin] = (_coinStaged[coin] || 0) + amount;
  _coinUpdatePending(coin);
}

function _coinUpdatePending(coin) {
  const val = _coinStaged[coin] || 0;
  const pendEl = document.getElementById(coin + 'PendDisp');
  const confBtn = document.getElementById(coin + 'Confirm');
  const cancBtn = document.getElementById(coin + 'Cancel');
  if (!pendEl) return;
  if (val === 0) {
    pendEl.textContent = '';
    if (confBtn) confBtn.style.display = 'none';
    if (cancBtn) cancBtn.style.display = 'none';
    return;
  }
  const isPos = val > 0;
  pendEl.textContent = (isPos?'+':'') + val;
  pendEl.style.color = isPos ? '#70cc50' : '#cc5040';
  if (confBtn) { confBtn.style.display = ''; confBtn.style.borderColor = isPos ? '#5a9a40' : '#aa3030'; confBtn.style.color = isPos ? '#80cc50' : '#ee6050'; }
  if (cancBtn) cancBtn.style.display = '';
}

function coinCommit(coin) {
  const amount = _coinStaged[coin] || 0;
  if (amount === 0) return;
  qrCoinChange(coin, amount);
  _coinStaged[coin] = 0;
  _coinUpdatePending(coin);
}

function coinCancel(coin) {
  _coinStaged[coin] = 0;
  _coinUpdatePending(coin);
}

function qrCoinChange(coin, amount) {
  // amount is signed: positive = add, negative = subtract
  const cur = parseInt(data[coin])||0;
  const next = Math.max(0, cur + amount);
  data[coin] = next;
  const mainInp = document.getElementById(coin);
  if (mainInp) mainInp.value = next;
  // Log transaction to quick panel
  const sign_sym = amount > 0 ? '+' : '−';
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  qrTxHistory.unshift(`[${time}] ${sign_sym}${Math.abs(amount)} ${COIN_NAMES[coin]} → ${next} ${coin.toUpperCase()}`);
  if (qrTxHistory.length > 20) qrTxHistory.pop();
  // Log transaction to Time Log
  _autoLog(`💰 ${sign_sym}${Math.abs(amount)} ${COIN_NAMES[coin]} (now ${next} ${coin.toUpperCase()})`, 'Transaction');
  calcGP();
  renderMoneyTab();
  autoSave();
}

// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  EFFECTS / BUFF-DEBUFF TRACKER + ROUNDS
// ═══════════════════════════════════════════

function hudRenderEffects() {
  // Round display
  const rd = document.getElementById('hudRoundDisplay');
  if (rd) rd.textContent = data.combatRound || 1;

  // Concentration box
  const conc = data.concentration || { active: false, spell: '' };
  const box   = document.getElementById('hudConcentrationBox');
  const spell = document.getElementById('hudConcentrationSpell');
  const stat  = document.getElementById('hudConcentrationStatus');
  if (box && spell && stat) {
    if (conc.active) {
      box.style.background    = 'rgba(100,40,200,0.25)';
      box.style.borderColor   = '#7a40d0';
      spell.textContent       = conc.spell || '— active —';
      spell.style.color       = '#d0a0ff';
      stat.textContent        = 'ACTIVE';
      stat.style.background   = '#3a1a70';
      stat.style.color        = '#c080ff';
      stat.style.borderColor  = '#7a40d0';
    } else {
      box.style.background    = 'rgba(60,30,100,0.15)';
      box.style.borderColor   = '#3a2a6a';
      spell.textContent       = '— none —';
      spell.style.color       = 'var(--text-muted)';
      stat.textContent        = 'OFF';
      stat.style.background   = '#1a0a2a';
      stat.style.color        = '#5a3a80';
      stat.style.borderColor  = '#3a1a60';
    }
  }

  // Effects list
  const list = document.getElementById('hudEffectsList');
  if (!list) return;
  const effects = data.hudEffects || [];
  if (effects.length === 0) {
    list.innerHTML = '<div style="font-family:\'Crimson Text\',serif;font-size:15px;color:var(--text-muted);padding:4px 2px;text-align:center;">No active effects.</div>';
    return;
  }

  const typeColors = {
    buff:    { border: '#3a7a40', bg: 'rgba(20,60,20,0.35)',  icon: '↑', col: '#70cc70' },
    debuff:  { border: '#7a3030', bg: 'rgba(60,15,15,0.35)',  icon: '↓', col: '#cc6060' },
    neutral: { border: '#4a4a30', bg: 'rgba(40,40,20,0.25)',  icon: '◈', col: '#c0b060' },
  };

  list.innerHTML = effects.map((ef, i) => {
    const t = typeColors[ef.type] || typeColors.neutral;
    const isPerm = ef.rounds === null || ef.rounds === undefined;
    const roundsLeft = isPerm ? '∞' : ef.rounds;
    const urgent = !isPerm && ef.rounds <= 1;
    const roundColor = isPerm ? '#6a8a6a' : urgent ? '#ee4444' : ef.rounds <= 3 ? '#e09030' : '#80cc80';
    const hasDesc = ef.desc && ef.desc.trim();
    return `<div style="padding:5px 8px;border-radius:var(--radius);border:1px solid ${t.border};background:${t.bg};transition:all 0.2s;">
      <div style="display:flex;align-items:center;gap:6px;">
        <div style="font-family:'Cinzel',serif;font-size:11px;font-weight:700;color:${t.col};flex-shrink:0;">${t.icon}</div>
        <div style="flex:1;font-family:'Crimson Text',serif;font-size:15px;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ef.name}</div>
        <div style="font-family:'Cinzel',serif;font-size:13px;font-weight:900;color:${roundColor};min-width:22px;text-align:center;" title="${isPerm ? 'Permanent' : roundsLeft + ' round(s) left'}">${roundsLeft}</div>
        <button onclick="hudEffectDelta(${i}, 1)"  style="font-size:11px;padding:1px 5px;background:rgba(40,80,40,0.5);border:1px solid #3a6a40;border-radius:3px;color:#70cc70;cursor:pointer;" title="+1 round">+</button>
        <button onclick="hudEffectDelta(${i}, -1)" style="font-size:11px;padding:1px 5px;background:rgba(80,30,30,0.5);border:1px solid #7a3030;border-radius:3px;color:#cc6060;cursor:pointer;" title="−1 round">−</button>
        <button onclick="hudRemoveEffect(${i})"    style="font-size:11px;padding:1px 5px;background:rgba(60,20,20,0.5);border:1px solid #6a2020;border-radius:3px;color:#aa4040;cursor:pointer;" title="Remove">✕</button>
      </div>
      ${hasDesc ? `<div style="font-family:'Crimson Text',serif;font-size:13px;color:${t.col};opacity:0.7;font-style:italic;padding:3px 2px 1px 17px;line-height:1.35;white-space:pre-wrap;word-break:break-word;">${ef.desc}</div>` : ''}
    </div>`;
  }).join('');
}

// ── Effect modal state ──
var _hudEffectType = 'buff';

function hudOpenEffectModal() {
  _hudEffectType = 'buff';
  const nameEl   = document.getElementById('hudEffectName');
  const roundsEl = document.getElementById('hudEffectRounds');
  const descEl   = document.getElementById('hudEffectDesc');
  if (nameEl)   nameEl.value   = '';
  if (roundsEl) roundsEl.value = '';
  if (descEl)   descEl.value   = '';
  hudSelectEffectType('buff');
  const modal = document.getElementById('hudEffectModal');
  if (modal) { modal.style.display = 'flex'; setTimeout(() => nameEl?.focus(), 50); }
}

function hudCloseEffectModal() {
  const modal = document.getElementById('hudEffectModal');
  if (modal) modal.style.display = 'none';
}

function hudSelectEffectType(type) {
  _hudEffectType = type;
  const styles = {
    buff:    { border:'#3a7a40', bg:'linear-gradient(135deg,#1a3020,#0e1e12)', color:'#70cc70' },
    debuff:  { border:'#7a3030', bg:'linear-gradient(135deg,#301010,#1e0808)', color:'#cc6060' },
    neutral: { border:'#6a6a30', bg:'linear-gradient(135deg,#282810,#181808)', color:'#c0b060' },
  };
  ['buff','debuff','neutral'].forEach(t => {
    const btn = document.getElementById('hudEfType' + t.charAt(0).toUpperCase() + t.slice(1));
    if (!btn) return;
    const s = styles[t];
    if (t === type) {
      btn.style.border     = '2px solid ' + s.border;
      btn.style.background = s.bg;
      btn.style.color      = s.color;
      btn.style.boxShadow  = '0 0 8px rgba(80,180,100,0.2)';
    } else {
      btn.style.border     = '1px solid #2a2a2a';
      btn.style.background = 'rgba(20,20,20,0.4)';
      btn.style.color      = '#4a4a4a';
      btn.style.boxShadow  = 'none';
    }
  });
}

function hudAddEffect() {
  const nameEl   = document.getElementById('hudEffectName');
  const roundsEl = document.getElementById('hudEffectRounds');
  const descEl   = document.getElementById('hudEffectDesc');
  const name = (nameEl?.value || '').trim();
  if (!name) { showToast('Enter effect name'); nameEl?.focus(); return; }
  const roundsRaw = roundsEl?.value;
  const rounds = (roundsRaw === '' || roundsRaw === null || roundsRaw === undefined)
    ? null
    : Math.max(1, parseInt(roundsRaw) || 1);
  const desc = (descEl?.value || '').trim();
  if (!data.hudEffects) data.hudEffects = [];
  data.hudEffects.push({ name, rounds, type: _hudEffectType, desc: desc || '' });
  hudCloseEffectModal();
  hudRenderEffects();
  autoSave();
  showToast('✦ ' + name + ' pridaný');
}

function hudRemoveEffect(idx) {
  if (!data.hudEffects) return;
  data.hudEffects.splice(idx, 1);
  hudRenderEffects();
  autoSave();
}

function hudEffectDelta(idx, delta) {
  const ef = (data.hudEffects || [])[idx];
  if (!ef) return;
  if (ef.rounds === null || ef.rounds === undefined) return; // permanent — ignore
  ef.rounds = Math.max(0, ef.rounds + delta);
  if (ef.rounds === 0) {
    showToast('⌛ ' + ef.name + ' skončil!');
    data.hudEffects.splice(idx, 1);
  }
  hudRenderEffects();
  autoSave();
}

function hudNextRound() {
  // Advance round counter
  data.combatRound = (parseInt(data.combatRound) || 1) + 1;

  // Tick down all finite effects
  const expired = [];
  (data.hudEffects || []).forEach(ef => {
    if (ef.rounds !== null && ef.rounds !== undefined) {
      ef.rounds = Math.max(0, ef.rounds - 1);
      if (ef.rounds === 0) expired.push(ef.name);
    }
  });
  // Remove expired
  data.hudEffects = (data.hudEffects || []).filter(ef => ef.rounds === null || ef.rounds > 0);

  // Toast for expired effects
  if (expired.length === 1) showToast('⌛ ' + expired[0] + ' skončil!');
  else if (expired.length > 1) showToast('⌛ Skončili: ' + expired.join(', '));

  hudRenderEffects();
  autoSave();
}

function hudChangeRound(delta) {
  data.combatRound = Math.max(1, (parseInt(data.combatRound) || 1) + delta);
  hudRenderEffects();
  autoSave();
}

function hudResetRound() {
  if (!confirm('Reset round to 1? (effects remain)')) return;
  data.combatRound = 1;
  hudRenderEffects();
  autoSave();
}

function hudToggleConcentration() {
  if (!data.concentration) data.concentration = { active: false, spell: '' };
  if (!data.concentration.active) {
    // turning ON — ask for spell name, pre-fill from main sheet if available
    const prefill = data.concentration.spell || data.concSpell || '';
    const spell = prompt('Koncentrácia na spell:', prefill);
    if (spell === null) return; // cancelled
    data.concentration.active = true;
    data.concentration.spell  = spell.trim() || '';
    // Sync to main sheet fields
    data.concentrating = true;
    data.concSpell = data.concentration.spell;
    // Also toggle the Concentrating condition chip on main sheet
    if (!data.conditions) data.conditions = {};
    data.conditions['Concentrating'] = true;
    renderCombatHud();
  } else {
    // turning OFF
    data.concentration.active = false;
    data.concentration.spell  = '';
    // Sync to main sheet fields
    data.concentrating = false;
    data.concSpell = '';
    if (data.conditions) data.conditions['Concentrating'] = false;
    renderCombatHud();
  }
  // Sync main sheet concentration widget
  if (typeof renderConcentration === 'function') renderConcentration();
  hudRenderEffects();
  autoSave();
}

// ═══════════════════════════════════════════
