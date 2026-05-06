// ═══════════════════════════════════════════
//  init.js - INIT, TABS, ABILITY MODS, HP, CONDITIONS, WEAPONS, ARMOR
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
function defaultData() {
  return {
    charName:'', playerName:'', charClass:'', charSubclass:'', charLevel:1,
    charRace:'', charBackground:'', charAlignment:'', charXP:0,
    charAge:'', charLanguages:'', charHeight:'', charWeight:'',
    charEyes:'', charSkin:'', charHair:'', charGender:'',
    charBackstory:'', charAllies:'',
    personalityTraits:'', ideals:'', bonds:'', flaws:'',
    str:10, dex:10, con:10, int:10, wis:10, cha:10,
    photo: null,
    inspiration: false,
    concentrating: false,
    concSpell: '',
    jackOfAllTrades: false,
    hasLucky: false,
    exhaustion: 0,
    conditions: {},
    // Saves proficiency
    savesProf: {str:false,dex:false,con:false,int:false,wis:false,cha:false},
    // Skills: 0=none, 1=prof, 2=expertise
    skillsProf: {},
    // Combat
    armorClass:10, initiative:0, speed:'30',
    hpCurrent:0, hpMax:0, hpTemp:0,
    hitDice:'1d8', hitDiceUsed:1,
    deathSuccesses:[false,false,false],
    deathFailures:[false,false,false],
    specialSenses:'',
    resistances:{},
    armorProf:'', weaponProf:'', toolProf:'', languagesProf:'',
    // Equipment
    weapons:[], armor:[], inventory:[], magicItems:[], questItems:[], trackers:[],
    totalWeight:0,
    cp:0, sp:0, ep:0, gp:0, pp:0, txHistory:[],
    attune:[false,false,false], attuneName:['','',''],
    // Spells
    spellcastingClass:'', spellcastingAbility:'int', spellsPrepared:0, spellNotes:'',
    spellSlots:{1:{max:0,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},
    spells:[],
    // Features
    classFeatures:[], racialFeatures:[], feats:[], backgroundFeatures:[], activeAbilities:[],
    // Proficiencies
    // Notes
    npcs:[], quests:[], generalNotes:[], loreNotes:[], journal:[],
    // Misc
    diceHistory:[],
    qrPresets:[],
    hudConsumables:[],
    lootHistory:[],
    // Wild Shape
    wildShapes: [],
    wildShapeActive: false,
    wildShapeFormIdx: -1,
    wildShapeCurHP: 0,
    wildShapeCharges: 2,
    wildShapeMaxCharges: 2,
    wildShapeCRLimit: '',
    // ASI Tracker
    asiTracker: [4,8,12,16,19].map(lvl => ({level:lvl, spent:false, tookFeat:false, pending:{}, applied:{}})),
    asiHistoryOpen: false,
    asiNotifOpen: false,
    externalStorages: []
  };
}

function loadData() {
  const raw = localStorage.getItem('dnd5e_chronicle');
  if (raw) {
    try {
      data = {...defaultData(), ...JSON.parse(raw)};
      // Migrate legacy string → array
      if (typeof data.generalNotes === 'string') {
        const old = data.generalNotes;
        data.generalNotes = old.trim() ? [{ title:'Old Notes', category:'Other', content:old, tags:'', _open:true }] : [];
      }
      if (typeof data.loreNotes === 'string') {
        const old = data.loreNotes;
        data.loreNotes = old.trim() ? [{ title:'Old Lore Notes', category:'Other', content:old, region:'', _open:true }] : [];
      }
      // Migrate: sync concentration fields between main sheet and HUD
      if (!data.concentration) data.concentration = { active: false, spell: '' };
      // If main sheet has concentrating=true but HUD object is empty, sync it
      if (data.concentrating && !data.concentration.active) {
        data.concentration.active = true;
        data.concentration.spell  = data.concSpell || '';
      }
      // If HUD has concentration.active=true but main sheet fields are empty, sync them
      if (data.concentration.active && !data.concentrating) {
        data.concentrating = true;
        data.concSpell = data.concentration.spell || '';
      }
    }
    catch(e) { data = defaultData(); }
  } else {
    data = defaultData();
  }
  window._itemMyNotes = data.compendiumMyNotes || {};
}

function saveData() {
  localStorage.setItem('dnd5e_chronicle', JSON.stringify(data));
  showToast('Character saved ✦');
}

function autoSave() {
  collectData();
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => { localStorage.setItem('dnd5e_chronicle', JSON.stringify(data)); }, 800);
}

function collectData() {
  const fields = ['charName','playerName','charClass','charSubclass','charLevel',
    'charRace','charBackground','charXP','charAge','charLanguages',
    'charHeight','charWeight','charEyes','charSkin','charHair','charGender',
    'charBackstory','charAllies','personalityTraits','ideals','bonds','flaws',
    'str','dex','con','int','wis','cha',
    'armorClass','initiative','speed','hpCurrent','hpMax','hpTemp',
    'hitDice','hitDiceUsed',
    'specialSenses','armorProf','weaponProf','toolProf','languagesProf',
    'totalWeight','cp','sp','ep','gp','pp',
    'spellcastingClass','spellsPrepared','spellNotes'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = el.type==='number' ? (parseFloat(el.value)||0) : el.value;
  });
  data.charAlignment = document.getElementById('charAlignment')?.value || '';
  data.spellcastingAbility = document.getElementById('spellcastingAbility')?.value || 'int';
  // If Wild Shape is active, sync any HP change from main sheet → wild shape tracker
  if (typeof wsSyncHpFromMain === 'function') wsSyncHpFromMain();
}

function populateForm() {
  const fields = ['charName','playerName','charClass','charSubclass','charLevel',
    'charRace','charBackground','charXP','charAge','charLanguages',
    'charHeight','charWeight','charEyes','charSkin','charHair','charGender',
    'charBackstory','charAllies','personalityTraits','ideals','bonds','flaws',
    'str','dex','con','int','wis','cha',
    'armorClass','initiative','speed','hpCurrent','hpMax','hpTemp',
    'hitDice','hitDiceUsed',
    'specialSenses','armorProf','weaponProf','toolProf','languagesProf',
    'totalWeight','cp','sp','ep','gp','pp',
    'spellcastingClass','spellsPrepared','spellNotes'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && data[id] !== undefined) el.value = data[id];
  });
  if (data.charAlignment) document.getElementById('charAlignment').value = data.charAlignment;
  if (data.spellcastingAbility) document.getElementById('spellcastingAbility').value = data.spellcastingAbility;

  // Photo
  if (data.photo) {
    document.getElementById('characterPhoto').src = data.photo;
    document.getElementById('characterPhoto').style.display = 'block';
    document.getElementById('photoPlaceholder').style.display = 'none';
    document.getElementById('photoContainer').classList.add('has-photo');
    var removeBtn = document.getElementById('portraitHoverRemove');
    if (removeBtn) removeBtn.style.display = '';
    if (data.photoPos) {
      document.documentElement.style.setProperty('--portrait-pos-x', data.photoPos.x);
      document.documentElement.style.setProperty('--portrait-pos-y', data.photoPos.y);
    }
  }

  // Inspiration
  renderInspiration();
  // Bardic Inspiration
  renderBardic();
  renderConcentration();
  initJackOfAllTrades();
  // Exhaustion
  renderExhaustion();
  // Conditions
  buildConditions();
  // Death saves
  renderDeathSaves();
  // Attunement
  renderAttunement();
  // Encumbrance
  calcEncumbrance();
  // Currency calc
  calcGP();
  // XP progress bar + milestone mode
  applyMilestoneUI();
  updateXPBar(data.charXP || 0);
  if (typeof renderAsiTracker  === 'function') renderAsiTracker();
  if (typeof renderAsiHistory  === 'function') renderAsiHistory();
}

// ═══════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════
function showTab(tab, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
  if (tab === 'spelllist') renderSpellList();
  if (tab === 'itemdb') { updateSubcategoryFilter(); renderItemList(); }
  if (tab === 'bestiary') renderBestiary();
  if (tab === 'loot') { lootUpdatePreview(); renderLootHistory(); }
  if (tab === 'achievements') renderAchievements();
  if (tab === 'playerbest') renderPlayerBestiary();
  if (tab === 'companions') renderCompanions();
  if (tab === 'wildshape') renderWildShape();
  if (tab === 'crafting' && typeof renderCraftingTable === 'function') renderCraftingTable();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('sidebarToggleBtn');
  const collapsed = sidebar.classList.toggle('collapsed');
  btn.textContent = collapsed ? '▶' : '◀';
  btn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  localStorage.setItem('dnd_sidebar_collapsed', collapsed ? '1' : '0');
}

// Restore sidebar state on load
(function() {
  window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('dnd_sidebar_collapsed') === '1') {
      const sidebar = document.getElementById('sidebar');
      const btn = document.getElementById('sidebarToggleBtn');
      if (sidebar) sidebar.classList.add('collapsed');
      if (btn) { btn.textContent = '▶'; btn.title = 'Expand sidebar'; }
    }
  });
})();

// ═══════════════════════════════════════════
//  ABILITY MODS
// ═══════════════════════════════════════════
function updateMods() {
  ['str','dex','con','int','wis','cha'].forEach(attr => {
    const score = parseInt(document.getElementById(attr)?.value) || 10;
    const mod = getMod(score);
    document.getElementById(attr + 'Mod').textContent = fmtMod(mod);
  });
  updateSkills();
  updateSaves();
  updateSpellStats();
  updatePassive();
  updateCarryCapacity();
  renderWeapons();
  if (typeof refreshWeaponSpellPresets === 'function') refreshWeaponSpellPresets();
  autoSave();
}

function updateHitDiceRemaining() {
  const lvl = parseInt(document.getElementById('charLevel')?.value) || 1;
  const used = parseInt(document.getElementById('hitDiceUsed')?.value) || 0;
  const remaining = Math.max(0, lvl - used);
  const totalEl = document.getElementById('hitDiceTotalDisplay');
  const remEl   = document.getElementById('hitDiceRemainingLabel');
  if (totalEl) {
    totalEl.textContent = remaining + '/' + lvl;
    totalEl.style.color = remaining === 0 ? '#cc4040' : remaining <= 2 ? '#c09030' : '#c0a040';
  }
  if (remEl) {
    remEl.textContent = 'REMAINING';
    remEl.style.color = remaining === 0 ? '#cc4040' : remaining <= 2 ? '#c09030' : '#60aa60';
  }
  // Keep HUD in sync
  renderCombatHud();
}

function combatTabUseHitDice() {
  const lvl = parseInt(document.getElementById('charLevel')?.value) || 1;
  const hdUsedEl = document.getElementById('hitDiceUsed');
  const used = parseInt(hdUsedEl?.value) || 0;
  if (used >= lvl) { showToast('No hit dice remaining!'); return; }
  if (hdUsedEl) hdUsedEl.value = used + 1;
  data.hitDiceUsed = used + 1;
  // Roll the die and heal
  const hdType = (data.hitDice || 'd8').replace(/^\d+/, '');
  const sides = parseInt(hdType.replace('d','')) || 8;
  const roll = Math.ceil(Math.random() * sides);
  const conMod = getMod(data.con || 10);
  const healed = Math.max(1, roll + conMod);
  const max = parseInt(data.hpMax) || 0;
  data.hpCurrent = Math.min(max, (parseInt(data.hpCurrent)||0) + healed);
  const curEl = document.getElementById('hpCurrent'); if (curEl) curEl.value = data.hpCurrent;
  updateHitDiceRemaining();
  autoSave();
  showToast(`🎲 ${hdType}: ${roll} + ${conMod} CON = +${healed} HP ✦`);
}

function combatTabRestoreHitDice() {
  const hdUsedEl = document.getElementById('hitDiceUsed');
  const used = parseInt(hdUsedEl?.value) || 0;
  if (used <= 0) { showToast('All hit dice already restored'); return; }
  if (hdUsedEl) hdUsedEl.value = Math.max(0, used - 1);
  data.hitDiceUsed = Math.max(0, used - 1);
  updateHitDiceRemaining();
  autoSave();
  showToast('Hit die restored ✦');
}

function onLevelChange() {
  const lvl = parseInt(document.getElementById('charLevel')?.value) || 1;
  data.charLevel = lvl;
  const pb = getProfBonus(lvl);
  document.getElementById('profBonusDisplay').textContent = fmtMod(pb);
  updateSkills();
  updateSaves();
  updateSpellStats();
  updateHitDiceRemaining();
  renderWeapons();
  if (typeof refreshWeaponSpellPresets === 'function') refreshWeaponSpellPresets();
  // Update hit dice max display and HUD if open
  const hudPanel = document.getElementById('combatHudPanel');
  if (hudPanel?.classList.contains('open')) renderCombatHud();
  // Update XP bar to reflect new level immediately
  if (typeof syncXPBarToLevel === 'function') syncXPBarToLevel();
  if (typeof asiCheckLevelUp === 'function') asiCheckLevelUp(lvl);
  if (typeof renderAsiHistory === 'function') renderAsiHistory();
  autoSave();
}

// ═══════════════════════════════════════════
//  XP AUTO LEVEL UP (D&D 5E)
// ═══════════════════════════════════════════
const XP_THRESHOLDS = [
  0,       // level 1
  300,     // level 2
  900,     // level 3
  2700,    // level 4
  6500,    // level 5
  14000,   // level 6
  23000,   // level 7
  34000,   // level 8
  48000,   // level 9
  64000,   // level 10
  85000,   // level 11
  100000,  // level 12
  120000,  // level 13
  140000,  // level 14
  165000,  // level 15
  195000,  // level 16
  225000,  // level 17
  265000,  // level 18
  305000,  // level 19
  355000   // level 20
];

const XP_LEVEL_FLAVOR = [
  '',
  'The hero awakens…',
  'First steps into darkness.',
  'Your name is whispered in taverns.',
  'Strength grows with every scar.',
  'Legends begin here.',
  'Fear turns to respect.',
  'The mighty bow their heads.',
  'The fates of nations tremble.',
  'The gods take notice.',
  'Halfway to immortality.',
  'Your name resonates across the world.',
  'The powers of darkness know you.',
  'Reality bends to your will.',
  'Legends are written about you.',
  'Heroes hide when you pass.',
  'Gods watch with respect.',
  'The world shifts with your existence.',
  'Immortality is within reach.',
  '✦ Apex. Legend. Immortal.'
];

function checkXPLevelUp() {
  // Ak je milestone mode, nič nerob
  if (data.milestoneMode) return;

  const xp = parseInt(document.getElementById('charXP')?.value) || 0;
  const currentLevel = parseInt(document.getElementById('charLevel')?.value) || 1;

  // Zisti aký level zodpovedá tomuto XP
  let newLevel = 1;
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) { newLevel = i + 1; break; }
  }

  // Len ak XP spôsobil level up (nie manuálna zmena) → zobraz modál
  if (newLevel > currentLevel && newLevel <= 20) {
    const levelEl = document.getElementById('charLevel');
    if (levelEl) levelEl.value = newLevel;
    data.charLevel = newLevel;
    onLevelChange();
    autoSave();
    showLevelUpModal(newLevel); // Modál LEN tu — pri XP level-upe
  }

  updateXPBar(xp);
}

function updateXPBar(xp) {
  // Ak je milestone mode, skry bar
  if (data.milestoneMode) return;

  const currentLevel = parseInt(document.getElementById('charLevel')?.value) || 1;

  const barEl   = document.getElementById('xpProgressBar');
  const labelEl = document.getElementById('xpProgressLabel');
  const nextEl  = document.getElementById('xpNextLevelLabel');

  if (currentLevel >= 20) {
    if (barEl)   barEl.style.width = '100%';
    if (labelEl) labelEl.textContent = 'MAX LEVEL ✦';
    if (nextEl)  nextEl.textContent = '';
    return;
  }

  const xpCurrent = XP_THRESHOLDS[currentLevel - 1];
  const xpNext    = XP_THRESHOLDS[currentLevel];
  const progress  = Math.min(100, Math.max(0, Math.round(((xp - xpCurrent) / (xpNext - xpCurrent)) * 100)));

  if (barEl)   barEl.style.width = progress + '%';
  if (labelEl) labelEl.textContent = xp.toLocaleString() + ' / ' + xpNext.toLocaleString() + ' XP (' + progress + '%)';
  if (nextEl)  nextEl.textContent = 'LVL ' + (currentLevel + 1);
}

// Volané z multiclass.js keď sa zmení celkový level cez triedy
// Aktualizuje XP bar podľa nového levelu BEZ zobrazovania modálu
function syncXPBarToLevel() {
  if (data.milestoneMode) return;
  const xp = parseInt(document.getElementById('charXP')?.value) || data.charXP || 0;
  updateXPBar(xp);
}

// ── MILESTONE MODE ──
function toggleMilestoneMode() {
  data.milestoneMode = !data.milestoneMode;
  autoSave();
  applyMilestoneUI();
}

function applyMilestoneUI() {
  const isMilestone = !!data.milestoneMode;
  const xpWrap       = document.getElementById('xpInputWrap');
  const msWrap       = document.getElementById('milestoneModeWrap');
  const btn          = document.getElementById('milestoneToggleBtn');

  if (xpWrap) xpWrap.style.display  = isMilestone ? 'none' : '';
  if (msWrap) msWrap.style.display  = isMilestone ? ''     : 'none';

  if (btn) {
    btn.style.color       = isMilestone ? 'var(--accent-gold)'  : 'var(--text-muted)';
    btn.style.borderColor = isMilestone ? 'var(--accent-gold)'  : 'var(--border)';
    btn.style.background  = isMilestone ? 'rgba(200,155,48,0.12)' : 'transparent';
    btn.title = isMilestone ? 'Switch to XP system' : 'Switch to Milestone system';
  }
}

function showLevelUpModal(level) {
  const overlay = document.getElementById('levelUpOverlay');
  const title   = document.getElementById('levelUpTitle');
  const sub     = document.getElementById('levelUpSub');
  const xpNext  = document.getElementById('levelUpXPNext');

  if (!overlay) return;

  if (title) title.textContent = 'Level ' + level + '!';
  if (sub)   sub.textContent   = XP_LEVEL_FLAVOR[level - 1] || '';
  if (xpNext) {
    if (level < 20) {
      xpNext.textContent = 'Next level at ' + XP_THRESHOLDS[level].toLocaleString() + ' XP';
    } else {
      xpNext.textContent = '✦ Maximum level reached! ✦';
    }
  }

  overlay.style.display = 'flex';
}

function closeLevelUpModal() {
  const overlay = document.getElementById('levelUpOverlay');
  if (overlay) overlay.style.display = 'none';
}

// Aktualizuj XP bar aj pri načítaní formu
const _origPopulateForm = typeof populateForm === 'function' ? populateForm : null;

// ═══════════════════════════════════════════
//  SAVING THROWS
// ═══════════════════════════════════════════
function buildSaves() {
  const container = document.getElementById('savingThrows');
  container.innerHTML = '';
  SAVES_DEF.forEach(s => {
    const prof = data.savesProf?.[s.attr] || false;
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <div class="skill-prof ${prof ? 'active' : ''}" onclick="toggleSaveProf('${s.attr}',this)" title="Toggle proficiency"></div>
      <div class="skill-mod" id="saveBonus_${s.attr}">+0</div>
      <div class="skill-name">${s.name}</div>
    `;
    container.appendChild(row);
  });
  updateSaves();
}

function toggleSaveProf(attr, el) {
  data.savesProf = data.savesProf || {};
  data.savesProf[attr] = !data.savesProf[attr];
  el.classList.toggle('active', data.savesProf[attr]);
  updateSaves();
  autoSave();
}

function updateSaves() {
  const lvl = parseInt(document.getElementById('charLevel')?.value) || 1;
  const pb = getProfBonus(lvl);
  SAVES_DEF.forEach(s => {
    const score = parseInt(document.getElementById(s.attr)?.value) || 10;
    const mod = getMod(score);
    const prof = data.savesProf?.[s.attr] || false;
    const total = mod + (prof ? pb : 0);
    const el = document.getElementById('saveBonus_' + s.attr);
    if (el) el.textContent = fmtMod(total);
  });
}

// ═══════════════════════════════════════════
//  SKILLS
// ═══════════════════════════════════════════
function buildSkills() {
  const container = document.getElementById('skillsList');
  container.innerHTML = '';
  SKILLS_DEF.forEach(s => {
    const prof = data.skillsProf?.[s.name] || 0;
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <div class="skill-prof ${prof===1?'active':''} ${prof===2?'expert':''}" 
           onclick="cycleSkillProf('${s.name}',this)" 
           title="Click: none → proficient → expertise"></div>
      <div class="skill-mod" id="skillBonus_${s.name.replace(/ /g,'_')}">+0</div>
      <div class="skill-name">${s.name}</div>
      <div class="skill-attr">${s.attr.toUpperCase()}</div>
    `;
    container.appendChild(row);
  });
  updateSkills();
}

function cycleSkillProf(name, el) {
  data.skillsProf = data.skillsProf || {};
  const cur = data.skillsProf[name] || 0;
  const next = (cur + 1) % 3;
  data.skillsProf[name] = next;
  el.classList.toggle('active', next===1);
  el.classList.toggle('expert', next===2);
  updateSkills();
  autoSave();
}

function updateSkills() {
  const lvl = parseInt(document.getElementById('charLevel')?.value) || 1;
  const pb = getProfBonus(lvl);
  SKILLS_DEF.forEach(s => {
    const score = parseInt(document.getElementById(s.attr)?.value) || 10;
    const mod = getMod(score);
    const prof = data.skillsProf?.[s.name] || 0;
    const bonus = mod + (prof===1 ? pb : prof===2 ? pb*2 : 0);
    const el = document.getElementById('skillBonus_' + s.name.replace(/ /g,'_'));
    if (el) el.textContent = fmtMod(bonus);
  });
  updatePassive();
}

function updatePassive() {
  const wis = parseInt(document.getElementById('wis')?.value) || 10;
  const int = parseInt(document.getElementById('int')?.value) || 10;
  const lvl = parseInt(document.getElementById('charLevel')?.value) || 1;
  const pb = getProfBonus(lvl);
  const percProf = data.skillsProf?.['Perception'] || 0;
  const invProf = data.skillsProf?.['Investigation'] || 0;
  const insProf = data.skillsProf?.['Insight'] || 0;
  const pp = document.getElementById('passivePerception');
  const pi = document.getElementById('passiveInvestigation');
  const pis = document.getElementById('passiveInsight');
  if (pp) pp.textContent = 10 + getMod(wis) + (percProf===1?pb:percProf===2?pb*2:0);
  if (pi) pi.textContent = 10 + getMod(int) + (invProf===1?pb:invProf===2?pb*2:0);
  if (pis) pis.textContent = 10 + getMod(wis) + (insProf===1?pb:insProf===2?pb*2:0);
}

// ═══════════════════════════════════════════
//  RESISTANCES
// ═══════════════════════════════════════════
function buildResistances() {
  const tbody = document.getElementById('resistanceTable');
  tbody.innerHTML = '';
  DAMAGE_TYPES.forEach(type => {
    const r = data.resistances?.[type] || {};
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:12px;">${type}</td>
      <td><div class="res-check ${r.resist?'active':''}" onclick="toggleRes('${type}','resist',this)" title="Resistance"></div></td>
      <td><div class="res-check ${r.immune?'immune':''}" onclick="toggleRes('${type}','immune',this)" title="Immunity"></div></td>
      <td><div class="res-check ${r.vuln?'vuln':''}" onclick="toggleRes('${type}','vuln',this)" title="Vulnerability"></div></td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleRes(type, kind, el) {
  data.resistances = data.resistances || {};
  data.resistances[type] = data.resistances[type] || {};
  const cur = data.resistances[type][kind];
  data.resistances[type][kind] = !cur;
  const classMap = {resist:'active',immune:'immune',vuln:'vuln'};
  el.classList.toggle(classMap[kind], !cur);
  autoSave();
}

// ═══════════════════════════════════════════
//  HP
// ═══════════════════════════════════════════
function adjustHP(delta) {
  const cur = parseInt(document.getElementById('hpCurrent').value) || 0;
  const max = parseInt(document.getElementById('hpMax').value) || 0;
  const newVal = Math.max(0, Math.min(max, cur + delta));
  document.getElementById('hpCurrent').value = newVal;
  data.hpCurrent = newVal;
  if (newVal <= 0 && cur > 0) _autoLog('💀 HP dropped to 0 — Death Saving Throws!', 'Combat');
  wsSyncHpFromMain();
  autoSave();
}

// ═══════════════════════════════════════════
//  DEATH SAVES
// ═══════════════════════════════════════════
function renderDeathSaves() {
  ['s','f'].forEach(type => {
    const arr = type === 's' ? data.deathSuccesses : data.deathFailures;
    const container = document.getElementById(type === 's' ? 'deathSuccesses' : 'deathFailures');
    if (!container) return;
    container.querySelectorAll('.ds-dot').forEach((dot, i) => {
      dot.classList.remove('success','fail');
      if (arr && arr[i]) dot.classList.add(type === 's' ? 'success' : 'fail');
    });
  });
}

function toggleDeathSave(type, idx) {
  if (type === 's') {
    data.deathSuccesses = data.deathSuccesses || [false,false,false];
    data.deathSuccesses[idx] = !data.deathSuccesses[idx];
  } else {
    data.deathFailures = data.deathFailures || [false,false,false];
    data.deathFailures[idx] = !data.deathFailures[idx];
  }
  renderDeathSaves();
  autoSave();
}

// ═══════════════════════════════════════════
//  INSPIRATION
// ═══════════════════════════════════════════
function toggleInspiration() {
  data.inspiration = !data.inspiration;
  renderInspiration();
  autoSave();
}
function renderInspiration() {
  const active = !!data.inspiration;
  // Hlavná stránka — gem
  const gem = document.getElementById('inspirationGem');
  if (gem) gem.classList.toggle('active', active);
  // Combat HUD
  const ib = document.getElementById('hudInspBox');
  const ig = document.getElementById('hudInspGem');
  if (ib) ib.classList.toggle('lit', active);
  if (ig) ig.textContent = active ? '✨' : '🔮';
}

// ── BARDIC INSPIRATION ──
function initBardic() {
  if (data.bardicMax === undefined) data.bardicMax = 0;
  if (data.bardicCur === undefined) data.bardicCur = 0;
  if (!data.bardicDie) data.bardicDie = '6';
}

function renderBardic() {
  initBardic();
  const pipsEl = document.getElementById('bardicPips');
  const maxLabel = document.getElementById('bardicMaxLabel');
  const dieSelect = document.getElementById('bardicDie');
  const dieLbl = document.getElementById('bardicDieLabel');
  if (!pipsEl) return;
  if (dieSelect) dieSelect.value = data.bardicDie || '6';
  if (dieLbl) dieLbl.textContent = data.bardicDie || '6';
  if (maxLabel) maxLabel.textContent = `${data.bardicCur} / ${data.bardicMax}`;
  pipsEl.innerHTML = '';
  for (let i = 0; i < data.bardicMax; i++) {
    const pip = document.createElement('div');
    const available = i < data.bardicCur;
    pip.style.cssText = `width:34px;height:34px;border-radius:50%;border:2px solid ${available?'#7050c0':'#2a1a40'};background:${available?'linear-gradient(135deg,#5030a0,#2a1060)':'transparent'};cursor:pointer;transition:all 0.15s;flex-shrink:0;box-shadow:${available?'0 0 10px rgba(120,70,220,0.55)':'none'};display:flex;align-items:center;justify-content:center;font-size:16px;color:${available?'#d0a0ff':'#3a2060'};`;
    pip.textContent = available ? '♪' : '·';
    pip.title = available ? `Use inspiration (${data.bardicCur} remaining)` : 'Spent — click to restore';
    pip.onclick = () => {
      if (!available) { if (data.bardicCur < data.bardicMax) data.bardicCur++; }
      else { if (data.bardicCur > 0) data.bardicCur--; }
      autoSave(); renderBardic();
    };
    pipsEl.appendChild(pip);
  }
  if (data.bardicMax === 0) {
    pipsEl.innerHTML = '<span style="font-family:\'Cinzel\',serif;font-size:10px;color:var(--text-muted);letter-spacing:1px;align-self:center;">Press + to add inspiration dice</span>';
  }
}

function changeBardicMax(dir) {
  initBardic();
  data.bardicMax = Math.max(0, (data.bardicMax || 0) + dir);
  if (dir > 0) data.bardicCur = Math.min(data.bardicMax, data.bardicCur + 1);
  data.bardicCur = Math.min(data.bardicCur, data.bardicMax);
  autoSave(); renderBardic();
}

function rollBardicDie() {
  initBardic();
  const sides = parseInt(data.bardicDie) || 6;
  const roll = Math.floor(Math.random() * sides) + 1;
  const el = document.getElementById('bardicRollResult');
  if (el) {
    el.style.display = 'block';
    el.innerHTML = `<span style='font-size:11px;color:var(--text-muted);'>d${sides} →</span> <span style='font-size:28px;'>${roll}</span>`;
    el.style.color = roll === sides ? 'var(--accent-gold-bright)' : 'var(--accent-gold)';
    clearTimeout(el._timer);
    el._timer = setTimeout(() => { if(el) el.style.display = 'none'; }, 4000);
  }
  showToast(`Bardic Inspiration d${sides}: ${roll} 🎵`);
}

// ═══════════════════════════════════════════
//  EXHAUSTION
// ═══════════════════════════════════════════
function setExhaustion(level) {
  data.exhaustion = data.exhaustion === level ? 0 : level;
  renderExhaustion();
  autoSave();
}
function renderExhaustion() {
  document.querySelectorAll('.exhaust-pip').forEach(pip => {
    pip.classList.toggle('active', parseInt(pip.dataset.level) <= data.exhaustion);
  });
}

// ═══════════════════════════════════════════
//  CONDITIONS
// ═══════════════════════════════════════════
const CONDITION_DESC = {
  Blinded: 'Attack rolls against you have advantage. Your attack rolls have disadvantage. You automatically fail any ability check requiring sight.',
  Charmed: 'You cannot attack the charmer or target them with harmful abilities/spells. The charmer has advantage on social checks against you.',
  Deafened: 'You cannot hear. You automatically fail any ability check requiring hearing.',
  Exhaustion: 'Level 1: Disadvantage on ability checks. Level 2: Speed halved. Level 3: Disadvantage on attacks & saves. Level 4: HP max halved. Level 5: Speed = 0. Level 6: Death.',
  Frightened: 'Disadvantage on ability checks and attacks while you can see the source of fear. You cannot willingly move closer to it.',
  Grappled: 'Speed becomes 0. Ends if grappler is incapacitated or you are moved out of reach.',
  Incapacitated: 'Cannot take actions or reactions.',
  Invisible: 'Impossible to see without magic. Attack rolls against you have disadvantage. Your attacks have advantage.',
  Paralyzed: 'Incapacitated, cannot move or speak. Auto-fail STR and DEX saves. Attacks against you have advantage. Hits within 5 ft are critical hits.',
  Petrified: 'Transformed to stone. Incapacitated, cannot move/speak. Resistance to all damage. Immune to poison/disease. Auto-fail STR and DEX saves. Attacks have advantage against you.',
  Poisoned: 'Disadvantage on attack rolls and ability checks.',
  Prone: 'Can only crawl (costs 1 extra ft per ft). Standing costs half movement. Attacks against you have advantage if attacker is adjacent, else disadvantage. Your attacks have disadvantage.',
  Restrained: 'Speed becomes 0. Attack rolls against you have advantage. Your attacks have disadvantage. Disadvantage on DEX saves.',
  Stunned: 'Incapacitated, cannot move. Can only speak haltingly. Auto-fail STR and DEX saves. Attacks against you have advantage.',
  Unconscious: 'Incapacitated, cannot move or speak, unaware of surroundings. Drop held items, fall prone. Auto-fail STR and DEX saves. Attacks have advantage. Hits within 5 ft are critical hits.',
};

function buildConditions() {
  const grid = document.getElementById('conditionsGrid');
  grid.innerHTML = '';
  CONDITIONS.forEach(c => {
    const chip = document.createElement('div');
    chip.className = 'condition-chip' + (data.conditions?.[c] ? ' active' : '');
    chip.textContent = c;

    // Tooltip
    const desc = CONDITION_DESC[c];
    if (desc) {
      chip.style.position = 'relative';
      chip.addEventListener('mouseenter', (e) => showConditionTooltip(e, c, desc));
      chip.addEventListener('mouseleave', hideConditionTooltip);
    }

    chip.onclick = () => {
      data.conditions = data.conditions || {};
      data.conditions[c] = !data.conditions[c];
      chip.classList.toggle('active', data.conditions[c]);
      _autoLog(`⚡ Condition ${data.conditions[c] ? 'gained' : 'removed'}: ${c}`, 'Condition');
      autoSave();
    };
    grid.appendChild(chip);
  });
}

function showConditionTooltip(e, name, desc) {
  hideConditionTooltip();
  const tip = document.createElement('div');
  tip.id = 'conditionTooltip';
  tip.style.cssText = `
    position:fixed;z-index:9999;
    background:linear-gradient(135deg,var(--bg-panel),var(--bg-dark));
    border:1px solid var(--border-gold);
    border-radius:6px;padding:10px 13px;
    max-width:280px;min-width:180px;
    font-family:'Crimson Text',serif;font-size:16px;
    color:var(--text-secondary);line-height:1.5;
    box-shadow:0 4px 20px rgba(0,0,0,0.8);
    pointer-events:none;
  `;
  tip.innerHTML = `<div style="font-family:'Cinzel',serif;font-size:11px;font-weight:700;color:var(--accent-red-bright);letter-spacing:1px;margin-bottom:5px;text-transform:uppercase;">${name}</div>${desc}`;
  document.body.appendChild(tip);
  positionTooltip(e, tip);
}

function positionTooltip(e, tip) {
  const margin = 10;
  const rect = tip.getBoundingClientRect();
  let x = e.clientX + margin;
  let y = e.clientY - rect.height / 2;
  if (x + rect.width > window.innerWidth - margin) x = e.clientX - rect.width - margin;
  if (y < margin) y = margin;
  if (y + rect.height > window.innerHeight - margin) y = window.innerHeight - rect.height - margin;
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}

function hideConditionTooltip() {
  const tip = document.getElementById('conditionTooltip');
  if (tip) tip.remove();
}

// ═══════════════════════════════════════════
//  PHOTO
// ═══════════════════════════════════════════
function loadPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    data.photo = e.target.result;
    document.getElementById('characterPhoto').src = e.target.result;
    document.getElementById('characterPhoto').style.display = 'block';
    document.getElementById('photoPlaceholder').style.display = 'none';
    document.getElementById('photoContainer').classList.add('has-photo');
    var removeBtn = document.getElementById('portraitHoverRemove');
    if (removeBtn) removeBtn.style.display = '';
    // Restore saved position if any
    if (data.photoPos) {
      document.documentElement.style.setProperty('--portrait-pos-x', data.photoPos.x);
      document.documentElement.style.setProperty('--portrait-pos-y', data.photoPos.y);
    }
    autoSave();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  data.photo = null;
  data.photoPos = null;
  document.getElementById('characterPhoto').src = '';
  document.getElementById('characterPhoto').style.display = 'none';
  document.getElementById('photoPlaceholder').style.display = 'flex';
  document.getElementById('photoContainer').classList.remove('has-photo');
  var removeBtn = document.getElementById('portraitHoverRemove');
  if (removeBtn) removeBtn.style.display = 'none';
  document.documentElement.style.removeProperty('--portrait-pos-x');
  document.documentElement.style.removeProperty('--portrait-pos-y');
  autoSave();
}

// ═══════════════════════════════════════════
//  WEAPONS
// ═══════════════════════════════════════════
function addWeapon() {
  data.weapons = data.weapons || [];
  data.weapons.push({name:'', attack:'', damage:'', range:'', props:'', proficient:true});
  renderWeapons();
}

function renderEquipment() {
  if (typeof renderExternalStorages === 'function') renderExternalStorages();
  renderWeapons();
  renderArmor();
  renderInventory();
  renderMagicItems();
  renderQuestItems();
}

// Read ability modifier directly from DOM (no debounce lag)
function _liveAttrMod(attr) {
  if (!attr || attr === 'none') return null;
  const el = document.getElementById(attr);
  const score = el ? (parseInt(el.value) || 10) : (parseInt(data[attr]) || 10);
  return getMod(score);
}

// Compute auto attack bonus: attr mod + proficiency bonus (only if proficient)
function _liveAtkBonus(atkAttr, proficient) {
  if (!atkAttr || atkAttr === 'none') return null;
  const attrMod = _liveAttrMod(atkAttr) || 0;
  const lvl = parseInt(document.getElementById('charLevel')?.value) || parseInt(data.charLevel) || 1;
  const pb  = getProfBonus(lvl);
  return attrMod + (proficient !== false ? pb : 0);
}

function renderWeapons() {
  const tbody = document.getElementById('weaponsBody');
  tbody.innerHTML = '';

  const SEL = 'font-size:10px;padding:1px 2px;background:var(--bg-input);border:1px solid var(--border-dark);color:var(--text-secondary);border-radius:3px;height:22px;';
  const ATTRS = ['none','str','dex','con','int','wis','cha'];
  const ATK_LBL = {none:'atk▾',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};
  const DMG_LBL = {none:'dmg▾',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};

  (data.weapons || []).forEach((w, i) => {
    const tr = document.createElement('tr');
    const equippedBadge = w._fromInventory
      ? `<span style="font-family:'Cinzel',serif;font-size:8px;color:var(--accent-gold);border:1px solid var(--border-gold);border-radius:3px;padding:1px 4px;letter-spacing:1px;margin-right:4px;white-space:nowrap;">EQ</span>`
      : '';

    const nm  = (w.name||'').replace(/"/g,'&quot;');
    const dmg = (w.damage||'').replace(/"/g,'&quot;');
    const rng = (w.range||'').replace(/"/g,'&quot;');
    const prp = (w.props||'').replace(/"/g,'&quot;');

    const atkAttr = w.atkAttr || 'none';
    const dmgAttr = w.dmgAttr || 'none';
    const isProficient = w.proficient !== false; // default true

    const atkSel = ATTRS.map(a => `<option value="${a}"${atkAttr===a?' selected':''}>${ATK_LBL[a]}</option>`).join('');
    const dmgSel = ATTRS.map(a => `<option value="${a}"${dmgAttr===a?' selected':''}>${DMG_LBL[a]}</option>`).join('');

    // Attack bonus — auto if attr chosen, else manual input
    const atkBonus = _liveAtkBonus(atkAttr, isProficient);
    const atkColor = atkBonus !== null ? (atkBonus >= 0 ? '#80e060' : '#ee6060') : 'var(--text-secondary)';
    const atkVal   = atkBonus !== null ? fmtMod(atkBonus) : (w.attack || '');
    const atkDisplay = atkBonus !== null
      ? `<span style="font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:${atkColor};min-width:28px;text-align:center;">${atkVal}</span>`
      : `<input type="text" value="${(w.attack||'').replace(/"/g,'&quot;')}" placeholder="+0"
           oninput="data.weapons[${i}].attack=this.value;autoSave()"
           style="width:30px;text-align:center;font-family:'Cinzel',serif;font-size:11px;height:22px;padding:1px 3px;">`;

    // DMG modifier badge
    const dmgMod = _liveAttrMod(dmgAttr);
    const dmgColor = dmgMod !== null ? (dmgMod >= 0 ? '#80cc60' : '#cc6060') : '';
    const dmgBadge = dmgMod !== null
      ? `<span style="font-family:'Cinzel',serif;font-size:10px;font-weight:700;color:${dmgColor};min-width:20px;text-align:center;">${fmtMod(dmgMod)}</span>`
      : '';

    tr.innerHTML = `
      <td style="white-space:nowrap;">${equippedBadge}<input type="text" value="${nm}" placeholder="Longsword…"
            oninput="data.weapons[${i}].name=this.value;autoSave()"
            style="width:100%;min-width:80px;"></td>
      <td>
        <div style="display:flex;align-items:center;gap:3px;white-space:nowrap;">
          <select style="${SEL}width:46px;" title="ATK attribute + proficiency"
            onchange="data.weapons[${i}].atkAttr=this.value;autoSave();renderWeapons();">${atkSel}</select>
          ${atkDisplay}
        </div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:3px;white-space:nowrap;">
          <input type="text" value="${dmg}" placeholder="1d8 slashing"
            oninput="data.weapons[${i}].damage=this.value;autoSave()"
            style="width:90px;height:22px;padding:1px 4px;">
          <select style="${SEL}width:46px;" title="DMG attribute bonus"
            onchange="data.weapons[${i}].dmgAttr=this.value;autoSave();renderWeapons();">${dmgSel}</select>
          ${dmgBadge}
        </div>
      </td>
      <td><input type="text" value="${rng}" placeholder="5 ft"
            oninput="data.weapons[${i}].range=this.value;autoSave()" style="width:52px;height:22px;padding:1px 4px;"></td>
      <td><input type="text" value="${prp}" placeholder="Versatile…"
            oninput="data.weapons[${i}].props=this.value;autoSave()" style="width:100%;min-width:70px;height:22px;padding:1px 4px;"></td>
      <td style="white-space:nowrap;">
        <label title="Proficient with this weapon (proficiency bonus applies)" style="display:inline-flex;align-items:center;gap:3px;cursor:pointer;margin-right:4px;">
          <input type="checkbox" ${isProficient?'checked':''} 
            onchange="data.weapons[${i}].proficient=this.checked;renderWeapons();if(typeof refreshWeaponSpellPresets==='function')refreshWeaponSpellPresets();autoSave();"
            style="width:13px;height:13px;cursor:pointer;accent-color:#90d060;">
          <span style="font-family:'Cinzel',serif;font-size:9px;color:${isProficient?'#90d060':'#888'};letter-spacing:0.5px;">PROF</span>
        </label>
        <button title="Add to Quick Roll" onclick="addWeaponPreset(${i})"
          style="font-size:13px;padding:2px 5px;background:linear-gradient(135deg,rgba(40,60,20,0.7),rgba(20,40,10,0.5));border:1px solid #4a7a30;color:#90d060;border-radius:4px;cursor:pointer;margin-right:2px;">🎲</button>
        <button class="equip-btn unequip-btn" title="Return to Inventory" onclick="unequipWeapon(${i})">📦</button>
        <button class="del-btn" onclick="removeWeapon(${i})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function removeWeapon(i) { data.weapons.splice(i,1); renderWeapons(); autoSave(); }

function _parseWeaponBonus(str) {
  const m = (str || '').match(/([+-]?\d+)/);
  return m ? parseInt(m[1]) : 0;
}
function _parseWeaponDamage(str) {
  str = (str || '').trim();
  const m = str.match(/^(\d*d\d+)\s*([+-]\s*\d+)?/i);
  if (!m) return { dice: '1d4', staticBonus: 0 };
  return { dice: m[1], staticBonus: m[2] ? parseInt(m[2].replace(/\s/g,'')) : 0 };
}

function addWeaponPreset(i) {
  const w = (data.weapons || [])[i];
  if (!w) return;
  const name = (w.name || 'Weapon').trim();
  const atkBonus = _liveAtkBonus(w.atkAttr, w.proficient !== false);
  const hitBonus = atkBonus !== null ? atkBonus : _parseWeaponBonus(w.attack);
  const { dice: dmgDice, staticBonus } = _parseWeaponDamage(w.damage);
  const attrMod  = _liveAttrMod(w.dmgAttr) || 0;
  const dmgBonus = staticBonus + attrMod;
  const noteBase = (w.damage || '').replace(/^[\d\s+\-d]+/i,'').trim().split(/[,\s]/)[0] || '';
  const lblMap   = {str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};
  const attrLbl  = lblMap[w.dmgAttr] || '';
  const note     = [noteBase, attrLbl ? attrLbl+' '+fmtMod(attrMod) : ''].filter(Boolean).join(' · ');
  data.qrPresets = data.qrPresets || [];
  if (data.qrPresets.length >= 12) { showToast('Quick Roll: max 12 presets'); return; }
  const existIdx = data.qrPresets.findIndex(p => p._srcWeapon === i || (p._fromWeapon && p.name === name));
  const preset   = { name, type:'both', hitBonus, dmgDice, dmgBonus, note, _fromWeapon:true, _srcWeapon:i };
  if (existIdx >= 0) { data.qrPresets[existIdx] = preset; showToast('🎲 ' + name + ' — preset updated ✦'); }
  else { data.qrPresets.push(preset); showToast('🎲 ' + name + ' → Quick Roll preset added ✦'); }
  autoSave();
  if (typeof renderQrPresets === 'function') renderQrPresets();
}

function refreshWeaponSpellPresets() {
  data.qrPresets = data.qrPresets || [];
  let changed = false;
  data.qrPresets.forEach(p => {
    if (p._fromWeapon) {
      const w = (data.weapons || [])[p._srcWeapon];
      if (!w) return;
      const atkB = _liveAtkBonus(w.atkAttr, w.proficient !== false);
      const hb   = atkB !== null ? atkB : _parseWeaponBonus(w.attack);
      const { dice, staticBonus } = _parseWeaponDamage(w.damage);
      const am   = _liveAttrMod(w.dmgAttr) || 0;
      const db   = staticBonus + am;
      if (p.hitBonus !== hb || p.dmgDice !== dice || p.dmgBonus !== db) {
        p.hitBonus = hb; p.dmgDice = dice; p.dmgBonus = db; changed = true;
      }
    }
    if (p._fromSpell) {
      const ability = data.spellcastingAbility || 'int';
      const score   = parseInt(document.getElementById(ability)?.value) || parseInt(data[ability]) || 10;
      const lvl     = parseInt(document.getElementById('charLevel')?.value) || parseInt(data.charLevel) || 1;
      const sa      = getMod(score) + getProfBonus(lvl);
      if (p.hitBonus !== sa) { p.hitBonus = sa; changed = true; }
    }
  });
  if (changed) { autoSave(); if (typeof renderQrPresets === 'function') renderQrPresets(); }
}

// ═══════════════════════════════════════════
//  ARMOR
// ═══════════════════════════════════════════
function addArmor() {
  data.armor = data.armor || [];
  data.armor.push({name:'', type:'', ac:'', stealth:false, equipped:true});
  renderArmor();
}

function renderArmor() {
  const container = document.getElementById('armorList');
  container.innerHTML = '';
  (data.armor || []).forEach((a, i) => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;background:var(--bg-card);border:1px solid var(--border-dark);border-radius:4px;padding:8px;flex-wrap:wrap;';
    const equippedBadge = a._fromInventory
      ? `<span style="font-family:'Cinzel',serif;font-size:8px;color:var(--accent-gold);border:1px solid var(--border-gold);border-radius:3px;padding:1px 5px;letter-spacing:1px;white-space:nowrap;">EQUIPPED</span>`
      : '';
    const nm  = (a.name||'').replace(/"/g,'&quot;');
    const typ = (a.type||'').replace(/"/g,'&quot;');
    const ac  = (a.ac||'').replace(/"/g,'&quot;');
    div.innerHTML = `
      ${equippedBadge}
      <input type="text" value="${nm}" placeholder="Armor name…" style="flex:2;" oninput="data.armor[${i}].name=this.value;autoSave()">
      <input type="text" value="${typ}" placeholder="Type" style="flex:1;" oninput="data.armor[${i}].type=this.value;autoSave()">
      <input type="text" value="${ac}" placeholder="AC" style="width:60px;" oninput="data.armor[${i}].ac=this.value;autoSave()">
      <label style="display:flex;align-items:center;gap:4px;font-size:11px;white-space:nowrap;"><input type="checkbox" ${a.stealth?'checked':''} onchange="data.armor[${i}].stealth=this.checked;autoSave()"> Stealth Dis.</label>
      <button class="equip-btn unequip-btn" title="Return to Inventory" onclick="unequipArmor(${i})">📦</button>
      <button class="del-btn" onclick="data.armor.splice(${i},1);renderArmor();autoSave()">🗑</button>
    `;
    container.appendChild(div);
  });
}

// ═══════════════════════════════════════════
//  AUTO AC CALCULATION
// ═══════════════════════════════════════════

// ─── D&D 5e armor table ───────────────────────────────────────────────────────
// dexType: 'none' = heavy (no DEX), 'capped' = medium (max +2), 'full' = light
const ARMOR_AC_RULES = [
  // Heavy — NO DEX bonus
  { keys: ['plate mail','plate armor','plate'],   base: 18, dexType: 'none' },
  { keys: ['splint'],                              base: 17, dexType: 'none' },
  { keys: ['chain mail','chainmail'],              base: 16, dexType: 'none' },
  { keys: ['ring mail','ringmail'],                base: 14, dexType: 'none' },
  // Medium — DEX capped at +2
  { keys: ['half plate','halfplate'],              base: 15, dexType: 'capped' },
  { keys: ['breastplate'],                         base: 14, dexType: 'capped' },
  { keys: ['scale mail','scalemail','scale armor'],base: 14, dexType: 'capped' },
  { keys: ['chain shirt','chainshirt'],            base: 13, dexType: 'capped' },
  { keys: ['hide'],                                base: 12, dexType: 'capped' },
  // Light — full DEX (positive or negative)
  { keys: ['studded leather','studded'],           base: 12, dexType: 'full' },
  { keys: ['leather'],                             base: 11, dexType: 'full' },
  { keys: ['padded'],                              base: 11, dexType: 'full' },
];

// Returns { base, dexType, dexBonus, total, label } for one armor piece
function resolveArmorPiece(armorItem) {
  const dexScore = parseInt(document.getElementById('dex')?.value) || 10;
  const dexMod   = getMod(dexScore);

  // Helper: parse AC string into { base, dexType, dexBonus, total, label } or null
  // Supported formats (case-insensitive, tolerant of spaces):
  //   "14 + Dex (Max 2)"  / "14+dex(max2)"   → base 14, DEX capped at +2
  //   "11 + Dex"          / "11+dex"          → base 11, full DEX
  //   "18"                                    → base 18, no DEX
  //   "+2"                                    → flat bonus (shield)
  function parseACString(acStr, itemName) {
    if (!acStr) return null;
    const s = acStr.trim().toLowerCase().replace(/\s+/g, ' ');

    // Pattern: number + dex (max N) — medium armor cap
    const capMatch = s.match(/^(\d+)\s*\+\s*dex\s*\(max\s*(\d+)\)/);
    if (capMatch) {
      const base = parseInt(capMatch[1]);
      const cap  = parseInt(capMatch[2]);
      const dexBonus = Math.min(dexMod, cap);
      const total    = base + dexBonus;
      return { base, dexType: 'capped', dexBonus, total,
               label: `${itemName} (${base} + DEX ${fmtMod(dexMod)} max ${cap}→${fmtMod(dexBonus)})` };
    }

    // Pattern: number + dex  (no cap — light armor)
    const fullMatch = s.match(/^(\d+)\s*\+\s*dex/);
    if (fullMatch) {
      const base  = parseInt(fullMatch[1]);
      const total = base + dexMod;
      return { base, dexType: 'full', dexBonus: dexMod, total,
               label: `${itemName} (${base} + DEX ${fmtMod(dexMod)})` };
    }

    // Pattern: plain integer (heavy / fixed AC)
    const numMatch = s.match(/^(\d+)$/);
    if (numMatch) {
      const base = parseInt(numMatch[1]);
      return { base, dexType: 'none', dexBonus: 0, total: base,
               label: `${itemName} (${base})` };
    }

    // Pattern: +N  (shield / flat bonus)
    const plusMatch = s.match(/^\+(\d+)/);
    if (plusMatch) {
      const base = parseInt(plusMatch[1]);
      return { base, dexType: 'none', dexBonus: 0, total: base,
               label: `${itemName} (+${base})` };
    }

    return null;
  }

  // 1. AC field has PRIORITY — if filled in, always use it
  const acFieldStr = (armorItem.ac || '').trim();
  if (acFieldStr) {
    const fromField = parseACString(acFieldStr, armorItem.name);
    if (fromField) return fromField;
  }

  // 2. Fall back to name-based lookup table
  const nameRaw = (armorItem.name + ' ' + (armorItem.type || '')).toLowerCase();
  for (const rule of ARMOR_AC_RULES) {
    if (rule.keys.some(k => nameRaw.includes(k))) {
      let dexBonus;
      if      (rule.dexType === 'none')   dexBonus = 0;
      else if (rule.dexType === 'capped') dexBonus = Math.min(dexMod, 2);
      else                                dexBonus = dexMod;
      const total = rule.base + dexBonus;
      const capNote = rule.dexType === 'capped'
        ? ` + DEX ${fmtMod(dexMod)} max 2→${fmtMod(dexBonus)}`
        : rule.dexType === 'full'
          ? ` + DEX ${fmtMod(dexMod)}`
          : '';
      return { base: rule.base, dexType: rule.dexType, dexBonus, total,
               label: `${armorItem.name} (${rule.base}${capNote})` };
    }
  }

  // 3. Try parsing notes field as last resort
  const notesStr = (armorItem.notes || '').trim();
  if (notesStr) {
    const fromNotes = parseACString(notesStr, armorItem.name);
    if (fromNotes) return fromNotes;
  }

  // 4. Unrecognised — fallback (caller uses unarmored formula)
  return null;
}

function calcAutoAC() {
  const dexScore  = parseInt(document.getElementById('dex')?.value) || 10;
  const dexMod    = getMod(dexScore);
  const allArmor  = (data.armor || []).filter(a => !a._removed);

  const isShield = a => (a.name + ' ' + (a.type || '')).toLowerCase().includes('shield');
  const shields   = allArmor.filter(isShield);
  const bodyPieces= allArmor.filter(a => !isShield(a));

  // Shield bonus — read AC field (supports "2", "+2", "+1 (special)", etc.) or default 2
  let shieldBonus = 0;
  let shieldLabel = '';
  if (shields.length > 0) {
    const shieldAcStr = (shields[0].ac || '').trim();
    const shieldMatch = shieldAcStr.match(/[+-]?(\d+)/);
    shieldBonus = shieldMatch ? parseInt(shieldMatch[1]) : 2;
    if (isNaN(shieldBonus) || shieldBonus <= 0) shieldBonus = 2;
    shieldLabel = `${shields[0].name || 'Shield'} +${shieldBonus}`;
  }

  // Body armor
  let baseAC = 10 + dexMod;   // unarmored default
  let armorLabel = `Unarmored (10 + DEX ${fmtMod(dexMod)})`;

  if (bodyPieces.length > 0) {
    const resolved = resolveArmorPiece(bodyPieces[0]);
    if (resolved !== null) {
      baseAC     = resolved.total;
      armorLabel = resolved.label;
    } else {
      // Unknown armor — use unarmored formula
      armorLabel = `${bodyPieces[0].name} (unrecognised, unarmored formula)`;
    }
  }

  return { total: baseAC + shieldBonus, armorLabel, shieldLabel, shieldBonus };
}

function autoCalcAC(silent) {
  const result   = calcAutoAC();
  const computed = result.total;

  const acEl = document.getElementById('armorClass');
  if (acEl) { acEl.value = computed; data.armorClass = computed; }

  const hudAc = document.getElementById('hudAcDisplay');
  if (hudAc) hudAc.textContent = computed;

  autoSave();

  if (!silent) {
    const parts = [result.armorLabel];
    if (result.shieldLabel) parts.push(result.shieldLabel);
    showToast('🛡 AC ' + computed + ' — ' + parts.join(' + '));
  }

  return result;
}

// ═══════════════════════════════════════════
//  INITIATIVE ROLL
// ═══════════════════════════════════════════
function rollInitiative() {
  const dex = getMod(parseInt(document.getElementById('dex')?.value) || 10);
  const roll = Math.ceil(Math.random() * 20);
  const total = roll + dex;
  const isCrit = roll === 20;
  const isFail = roll === 1;

  // Update initiative field
  const initEl = document.getElementById('initiative');
  if (initEl) {
    initEl.value = total;
    data.initiative = total;
  }
  autoSave();

  // Sync to Combat HUD display
  const hudPanel = document.getElementById('combatHudPanel');
  if (hudPanel?.classList.contains('open')) renderCombatHud();

  // Show animated result in the initiative result box
  const resEl = document.getElementById('initiativeRollResult');
  if (resEl) {
    const color = isCrit ? '#e0c040' : isFail ? '#cc3030' : '#60b0e0';
    const label = isCrit ? ' 🌟 NAT 20!' : isFail ? ' 💀 NAT 1' : '';
    resEl.style.display = 'block';
    resEl.innerHTML = `<span style="font-size:11px;color:var(--text-muted);">d20 ${fmtMod(dex)} DEX →</span> <span style="font-size:28px;font-weight:900;color:${color};">${total}</span><span style="font-size:12px;color:${color};">${label}</span>`;
    clearTimeout(resEl._timer);
    resEl._timer = setTimeout(() => { if (resEl) resEl.style.display = 'none'; }, 5000);
  }

  const sign = dex >= 0 ? '+' : '';
  showToast(`⚡ Initiative: d20(${roll}) ${sign}${dex} DEX = ${total}${isCrit?' 🌟':''}${isFail?' 💀':''}`);
}

// ═══════════════════════════════════════════
//  INVENTORY
// ═══════════════════════════════════════════
function addInventoryItem() {
  showModal('Add Item to Inventory', `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <!-- Category quick-filter tabs -->
      <div style="display:flex;flex-wrap:wrap;gap:5px;padding-bottom:6px;border-bottom:1px solid var(--border-dark);">
        <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;color:var(--text-muted);text-transform:uppercase;width:100%;margin-bottom:2px;">Quick Category</div>
        <button class="inv-qcat-btn active" data-invkind="" onclick="invQCat(this,'')">📦 Regular</button>
        <button class="inv-qcat-btn" data-invkind="weapon" onclick="invQCat(this,'weapon')">⚔ Weapon</button>
        <button class="inv-qcat-btn" data-invkind="armor" onclick="invQCat(this,'armor')">🛡 Armor</button>
        <button class="inv-qcat-btn" data-invkind="magic" onclick="invQCat(this,'magic')">✨ Magic</button>
        <button class="inv-qcat-btn" data-invkind="quest" onclick="invQCat(this,'quest')">🗺 Quest</button>
      </div>
      <style>
        .inv-qcat-btn{font-family:'Cinzel',serif;font-size:10px;letter-spacing:1px;padding:4px 10px;border-radius:14px;border:1px solid var(--border-dark);background:transparent;color:var(--text-muted);cursor:pointer;transition:all 0.13s;}
        .inv-qcat-btn:hover{border-color:var(--border-mid);color:var(--text-secondary);}
        .inv-qcat-btn.active{background:color-mix(in srgb,var(--accent-gold) 18%,var(--bg-mid));border-color:var(--border-gold);color:var(--accent-gold-bright,var(--text-gold));font-weight:700;}
      </style>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div class="field"><label>Item Name</label><input type="text" id="invName" placeholder="Dagger…"></div>
        <div class="field"><label>Item Type</label>
          <select id="invKind" onchange="updateInvKindFields()">
            <option value="">Regular Item</option>
            <option value="weapon">⚔ Weapon</option>
            <option value="armor">🛡 Armor / Shield</option>
            <option value="magic">✨ Magic Item</option>
            <option value="quest">🗺 Quest Item</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <div class="field"><label>Quantity</label><input type="number" id="invQty" value="1" min="1"></div>
        <div class="field"><label>Weight (lb)</label><input type="text" id="invWeight" placeholder="e.g. 1"></div>
        <div class="field" id="invCostField"><label>Cost</label><input type="text" id="invCost" placeholder="e.g. 2 GP"></div>
      </div>
      <!-- Weapon fields -->
      <div id="invWeaponFields" style="display:none;background:var(--bg-card);border:1px solid var(--border-dark);border-radius:4px;padding:10px;">
        <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--accent-gold);letter-spacing:2px;margin-bottom:8px;">⚔ WEAPON DETAILS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div class="field"><label>Damage</label><input type="text" id="invDamage" placeholder="e.g. 1d4 piercing"></div>
          <div class="field"><label>Range</label><input type="text" id="invRange" placeholder="e.g. 5 ft or 20/60"></div>
        </div>
        <div class="field"><label>Properties</label><input type="text" id="invProperties" placeholder="e.g. Finesse, Light, Thrown"></div>
      </div>
      <!-- Armor fields -->
      <div id="invArmorFields" style="display:none;background:var(--bg-card);border:1px solid var(--border-dark);border-radius:4px;padding:10px;">
        <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--accent-gold);letter-spacing:2px;margin-bottom:8px;">🛡 ARMOR DETAILS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div class="field"><label>AC Value</label><input type="text" id="invAC" placeholder="e.g. 14 or 11+DEX"></div>
          <div class="field"><label>Armor Type</label><input type="text" id="invArmorType" placeholder="e.g. Light, Medium, Heavy"></div>
        </div>
        <div class="field"><label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="invStealthDis"> Stealth Disadvantage</label></div>
      </div>
      <!-- Magic fields -->
      <div id="invMagicFields" style="display:none;background:var(--bg-card);border:1px solid var(--border-dark);border-radius:4px;padding:10px;">
        <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--accent-gold);letter-spacing:2px;margin-bottom:8px;">✨ MAGIC ITEM</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div class="field"><label>Rarity</label>
            <select id="invRarity"><option>Common</option><option selected>Uncommon</option><option>Rare</option><option>Very Rare</option><option>Legendary</option></select>
          </div>
          <div class="field"><label>Charges</label><input type="text" id="invCharges" placeholder="e.g. 3/3"></div>
        </div>
      </div>
      <div class="field"><label>Notes</label><input type="text" id="invNotes" placeholder="Description, properties…"></div>
    </div>
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Add to Inventory', action:'saveNewInventoryItem()', cls:'btn-primary'}
  ]);
}

function invQCat(btn, kind) {
  document.querySelectorAll('.inv-qcat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sel = document.getElementById('invKind');
  if (sel) { sel.value = kind; updateInvKindFields(); }
}

function updateInvKindFields() {
  const kind = document.getElementById('invKind')?.value;
  document.getElementById('invWeaponFields').style.display = kind === 'weapon' ? '' : 'none';
  document.getElementById('invArmorFields').style.display  = kind === 'armor'  ? '' : 'none';
  document.getElementById('invMagicFields').style.display  = kind === 'magic'  ? '' : 'none';
}

function saveNewInventoryItem() {
  const name = document.getElementById('invName')?.value?.trim();
  if (!name) { showToast('Item name is required'); return; }
  const kind = document.getElementById('invKind')?.value || '';
  const item = {
    id: 'inv_' + Date.now(),
    name,
    qty: parseInt(document.getElementById('invQty')?.value) || 1,
    weight: document.getElementById('invWeight')?.value || '',
    cost: document.getElementById('invCost')?.value || '',
    notes: document.getElementById('invNotes')?.value || '',
    _itemKind: kind || undefined,
  };
  if (kind === 'weapon') {
    item._damage     = document.getElementById('invDamage')?.value || '';
    item._range      = document.getElementById('invRange')?.value  || '';
    item._properties = document.getElementById('invProperties')?.value || '';
  } else if (kind === 'armor') {
    item._ac         = document.getElementById('invAC')?.value || '';
    item._armorType  = document.getElementById('invArmorType')?.value || '';
    item._stealthDis = document.getElementById('invStealthDis')?.checked || false;
  } else if (kind === 'magic') {
    item._rarity  = document.getElementById('invRarity')?.value || 'Uncommon';
    item._charges = document.getElementById('invCharges')?.value || '';
  }
  data.inventory = data.inventory || [];
  data.inventory.push(item);
  _autoLog(`🎒 Item added: ${name} ×${item.qty}`, 'Inventory');
  autoSave();
  closeModal();
  renderInventory();
  showToast(`${name} added to inventory ✦`);
}

// ─── Inventory pagination state ────────────────────────────────────────────
let _invPage = 0;
const INV_PAGE_SIZE = 10;

function renderInventory() {
  const tbody = document.getElementById('inventoryBody');
  tbody.innerHTML = '';
  const search = (document.getElementById('invSearch')?.value || '').toLowerCase();
  const catBtn = document.querySelector('.inv-filter-btn.active[data-cat]');
  const cat = catBtn?.dataset.cat || 'all';

  const FOOD_KW  = ['food','ration','bread','meat','fish','fruit','berry','meal','feast','provision','sustenance','jerky','cheese','apple','herb'];
  const POTION_KW= ['potion','elixir','vial','tincture','philter','draught','flask'];
  const AMMO_KW  = ['arrow','bolt','bullet','dart','sling','quiver','ammo','ammunition','shot'];
  const TOOL_KW  = ['tool','kit','thieves','herbalism','disguise','forgery','instrument','set','lock','rope','torch','lantern','oil','tinderbox'];

  const matchCat = (item) => {
    if (cat === 'all') return true;
    const txt = (item.name + ' ' + (item.notes||'')).toLowerCase();
    if (cat === 'food')   return FOOD_KW.some(k => txt.includes(k));
    if (cat === 'potion') return POTION_KW.some(k => txt.includes(k));
    if (cat === 'ammo')   return AMMO_KW.some(k => txt.includes(k));
    if (cat === 'tool')   return TOOL_KW.some(k => txt.includes(k));
    if (cat === 'quest')  return item._itemKind === 'quest';
    if (cat === 'misc')   return item._itemKind !== 'quest' && ![...FOOD_KW,...POTION_KW,...AMMO_KW,...TOOL_KW].some(k => (item.name+' '+(item.notes||'')).toLowerCase().includes(k));
    return true;
  };

  // Build filtered list first (preserving original indices)
  const filtered = [];
  (data.inventory || []).forEach((item, i) => {
    const txt = (item.name + ' ' + (item.notes||'')).toLowerCase();
    if (search && !txt.includes(search)) return;
    if (!matchCat(item)) return;
    filtered.push({ item, i });
  });

  const total = (data.inventory||[]).length;
  const shown = filtered.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / INV_PAGE_SIZE));
  // Clamp page in case items were deleted
  if (_invPage >= totalPages) _invPage = totalPages - 1;
  if (_invPage < 0) _invPage = 0;

  const pageItems = filtered.slice(_invPage * INV_PAGE_SIZE, (_invPage + 1) * INV_PAGE_SIZE);

  pageItems.forEach(({ item, i }) => {
    const tr = document.createElement('tr');
    const isWeapon = item._itemKind === 'weapon' || (item._damage && item._damage.length > 0);
    const isArmor  = item._itemKind === 'armor'  || (item._ac && item._ac.length > 0);
    const isMagic  = item._itemKind === 'magic';
    const isQuest  = item._itemKind === 'quest';
    let equipBtnHtml = '';
    if (isWeapon) {
      equipBtnHtml = `<button class="equip-btn equip-weapon-btn" title="Equip as Weapon" onclick="equipFromInventory(${i},'weapon')">⚔ Equip</button>`;
    } else if (isArmor) {
      equipBtnHtml = `<button class="equip-btn equip-armor-btn" title="Equip as Armor" onclick="equipFromInventory(${i},'armor')">🛡 Equip</button>`;
    } else if (isMagic) {
      equipBtnHtml = `<button class="equip-btn equip-magic-btn" title="Equip as Magic Item" onclick="equipFromInventory(${i},'magic')">✨ Equip</button>`;
    } else if (isQuest) {
      equipBtnHtml = `<button onclick="inventoryItemToQuest(${i})" title="Move to Quest Inventory" style="font-family:'Cinzel',serif;font-size:9px;color:#c060a0;border:1px solid #602040;border-radius:3px;padding:2px 8px;letter-spacing:1px;background:rgba(96,32,64,0.18);cursor:pointer;transition:all 0.15s;" onmouseover="this.style.background='rgba(192,96,160,0.25)';this.style.borderColor='#c060a0';" onmouseout="this.style.background='rgba(96,32,64,0.18)';this.style.borderColor='#602040';">🗺 QUEST</button>`;
    } else {
      equipBtnHtml = `<button class="equip-btn equip-generic-btn" title="Equip item…" onclick="promptEquipFromInventory(${i})">⬆ Equip</button>`;
    }
    tr.innerHTML = `
      <td style="cursor:pointer;" onclick="showInvItemDetail(${i})" title="Click to see details"><input type="text" value="${esc(item.name||'')}" placeholder="Item name…" oninput="event.stopPropagation();data.inventory[${i}].name=this.value;autoSave()" onclick="event.stopPropagation()"></td>
      <td><input type="number" value="${item.qty||1}" style="width:60px;" oninput="const _old=data.inventory[${i}].qty;data.inventory[${i}].qty=this.value;_autoLog('🎒 Qty changed: '+data.inventory[${i}].name+' '+_old+'→'+this.value,'Inventory');autoSave();calcEncumbrance();syncInvQtyToQuick(${i})"></td>
      <td><input type="text" value="${esc(item.weight||'')}" style="width:70px;" placeholder="lb" oninput="data.inventory[${i}].weight=this.value;autoSave();calcEncumbrance()"></td>
      <td><input type="text" value="${esc(item.myNotes||'')}" placeholder="My notes…" oninput="data.inventory[${i}].myNotes=this.value;autoSave()"></td>
      <td style="white-space:nowrap;">${equipBtnHtml}<button class="equip-btn equip-generic-btn" style="padding:3px 8px;" onclick="showInvItemDetail(${i})" title="View details">📋</button><button class="equip-btn equip-generic-btn" style="padding:3px 8px;${item._linkedToQuick?'color:#f0c060;border-color:#f0c060;':'color:#a0c060;border-color:#4a6020;'}" onclick="inventoryToQuickBar(${i})" title="${item._linkedToQuick?'Already in Quick Bar':'Add to Quick Bar as consumable'}">⚡${item._linkedToQuick?' ✓':''}</button><button class="del-btn" onclick="_autoLog('🎒 Item removed: '+data.inventory[${i}].name,'Inventory');data.inventory.splice(${i},1);renderInventory();autoSave()">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Badge
  const badge = document.getElementById('invCountBadge');
  if (badge) {
    badge.textContent = shown === total ? `${total} items` : `${shown} / ${total} items`;
  }

  // Render pagination controls
  _renderInvPagination(totalPages, shown, filtered.length);

  calcEncumbrance();
}

function _renderInvPagination(totalPages, shown, filteredCount) {
  // Find or create pagination container (placed after the inventory table)
  let pg = document.getElementById('invPagination');
  if (!pg) {
    const table = document.getElementById('inventoryBody')?.closest('table');
    if (!table) return;
    pg = document.createElement('div');
    pg.id = 'invPagination';
    pg.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:6px;padding:8px 4px 4px;flex-wrap:wrap;';
    table.parentNode.insertBefore(pg, table.nextSibling);
  }
  pg.innerHTML = '';

  if (totalPages <= 1) return; // No controls needed for single page

  const pageStart = _invPage * INV_PAGE_SIZE + 1;
  const pageEnd   = Math.min((_invPage + 1) * INV_PAGE_SIZE, filteredCount);

  // Prev button
  const prev = document.createElement('button');
  prev.className = 'btn btn-silver btn-sm';
  prev.style.cssText = 'padding:3px 10px;font-size:12px;font-family:Cinzel,serif;';
  prev.textContent = '◀';
  prev.disabled = _invPage === 0;
  prev.onclick = () => { _invPage--; renderInventory(); };
  pg.appendChild(prev);

  // Page number buttons
  for (let p = 0; p < totalPages; p++) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm';
    btn.style.cssText = `padding:3px 9px;font-size:12px;font-family:Cinzel,serif;${p === _invPage ? 'background:var(--accent-gold);color:#1a1208;border-color:var(--accent-gold);font-weight:700;' : 'background:var(--bg-mid);color:var(--text-secondary);border:1px solid var(--border-dark);'}`;
    btn.textContent = p + 1;
    btn.onclick = ((_p) => () => { _invPage = _p; renderInventory(); })(p);
    pg.appendChild(btn);
  }

  // Next button
  const next = document.createElement('button');
  next.className = 'btn btn-silver btn-sm';
  next.style.cssText = 'padding:3px 10px;font-size:12px;font-family:Cinzel,serif;';
  next.textContent = '▶';
  next.disabled = _invPage >= totalPages - 1;
  next.onclick = () => { _invPage++; renderInventory(); };
  pg.appendChild(next);

  // Info label
  const info = document.createElement('span');
  info.style.cssText = 'font-size:11px;color:var(--text-muted);font-family:Cinzel,serif;margin-left:6px;';
  info.textContent = `${pageStart}–${pageEnd} of ${filteredCount}`;
  pg.appendChild(info);
}

let _invActiveCat = 'all';
function invSetCat(btn) {
  document.querySelectorAll('.inv-filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _invPage = 0; // Reset to first page on filter change
  renderInventory();
}

// Safely escape HTML attribute values
function esc(str) {
  return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Equip item from inventory → weapons/armor/magic
function equipFromInventory(idx, kind) {
  data.inventory = data.inventory || [];
  const item = data.inventory[idx];
  if (!item) return;

  if (kind === 'weapon') {
    data.weapons = data.weapons || [];
    const strMod = getMod(parseInt(document.getElementById('str')?.value || data.str || 10));
    const dexMod = getMod(parseInt(document.getElementById('dex')?.value || data.dex || 10));
    const isFinesse = (item._properties||'').toLowerCase().includes('finesse');
    const isRanged  = (item._itemKind === 'weapon') && (item._properties||'').toLowerCase().includes('ranged');
    const mod = (isFinesse || isRanged) ? Math.max(strMod, dexMod) : strMod;
    const pb = getProfBonus(parseInt(document.getElementById('charLevel')?.value || data.charLevel || 1));
    const atkBonus = fmtMod(mod + pb);
    const rangeMatch = (item._properties||'').match(/\d+\/\d+/);
    data.weapons.push({
      id: 'wpn_' + Date.now(),
      name: item.name,
      attack: item._atkBonus || atkBonus,
      damage: item._damage || '',
      range: item._range || (rangeMatch ? rangeMatch[0] : '5 ft'),
      props: item._properties || item.notes || '',
      // Store back-reference so unequip knows what to restore
      _fromInventory: true,
      _invSnapshot: JSON.parse(JSON.stringify(item))
    });
    data.inventory.splice(idx, 1);
    autoSave(); renderWeapons(); renderInventory();
    showToast(`${item.name} equipped as Weapon ⚔`);

  } else if (kind === 'armor') {
    data.armor = data.armor || [];
    data.armor.push({
      id: 'arm_' + Date.now(),
      name: item.name,
      type: item._armorType || item.notes || '',
      ac: item._ac || '',
      stealth: item._stealthDis || false,
      notes: item._properties || '',
      _fromInventory: true,
      _invSnapshot: JSON.parse(JSON.stringify(item))
    });
    data.inventory.splice(idx, 1);
    autoSave(); renderArmor(); renderInventory();
    showToast(`${item.name} equipped as Armor 🛡`);

  } else if (kind === 'magic') {
    data.magicItems = data.magicItems || [];
    data.magicItems.push({
      id: 'mag_' + Date.now(),
      name: item.name,
      rarity: item._rarity || 'Uncommon',
      charges: item._charges || '',
      desc: item.notes || '',
      _fromInventory: true,
      _invSnapshot: JSON.parse(JSON.stringify(item))
    });
    data.inventory.splice(idx, 1);
    autoSave(); renderMagicItems(); renderInventory();
    showToast(`${item.name} equipped as Magic Item ✨`);
  }
}

// Prompt to choose equip type for generic items
function promptEquipFromInventory(idx) {
  data.inventory = data.inventory || [];
  const item = data.inventory[idx];
  if (!item) return;
  showModal(
    `Equip: ${item.name}`,
    `<div style="color:var(--text-secondary);font-size:15px;line-height:1.8;">
      <p style="margin-bottom:12px;">How do you want to equip <b>${item.name}</b>?</p>
      <div style="font-size:12px;color:var(--text-muted);">The item will be stored with its data and can be returned to inventory at any time.</div>
    </div>`,
    [
      {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
      {label:'⚔ Weapon', action:`closeModal();equipFromInventory(${idx},'weapon')`, cls:'btn-primary'},
      {label:'🛡 Armor', action:`closeModal();equipFromInventory(${idx},'armor')`, cls:'btn-primary'},
      {label:'✨ Magic Item', action:`closeModal();equipFromInventory(${idx},'magic')`, cls:'btn-primary'},
    ]
  );
}

// Unequip weapon → back to inventory
function unequipWeapon(i) {
  data.weapons = data.weapons || [];
  const w = data.weapons[i];
  if (!w) return;
  data.inventory = data.inventory || [];
  if (w._fromInventory && w._invSnapshot) {
    data.inventory.push(w._invSnapshot);
  } else {
    data.inventory.push({
      id: 'inv_' + Date.now(),
      name: w.name,
      qty: 1,
      weight: '',
      notes: [w.damage, w.props].filter(Boolean).join(' | '),
      _itemKind: 'weapon',
      _damage: w.damage,
      _properties: w.props,
      _range: w.range,
      _atkBonus: w.attack
    });
  }
  data.weapons.splice(i, 1);
  autoSave(); renderWeapons(); renderInventory();
  showToast(`${w.name} returned to inventory 📦`);
}

// Unequip armor → back to inventory
function unequipArmor(i) {
  data.armor = data.armor || [];
  const a = data.armor[i];
  if (!a) return;
  data.inventory = data.inventory || [];
  if (a._fromInventory && a._invSnapshot) {
    data.inventory.push(a._invSnapshot);
  } else {
    data.inventory.push({
      id: 'inv_' + Date.now(),
      name: a.name,
      qty: 1,
      weight: '',
      notes: [a.type, a.ac ? 'AC '+a.ac : '', a.notes].filter(Boolean).join(' | '),
      _itemKind: 'armor',
      _ac: a.ac,
      _armorType: a.type,
      _stealthDis: a.stealth,
      _properties: a.notes
    });
  }
  data.armor.splice(i, 1);
  autoSave(); renderArmor(); renderInventory();
  showToast(`${a.name} returned to inventory 📦`);
}

function calcEncumbrance() {
  // Auto-sum weight from inventory (qty * weight per item)
  let total = 0;
  (data.inventory || []).forEach(item => {
    const w = parseFloat(item.weight) || 0;
    const q = parseFloat(item.qty) || 1;
    total += w * q;
  });
  total = Math.round(total * 10) / 10;

  const twEl = document.getElementById('totalWeight');
  if (twEl) twEl.value = total;

  const str = parseInt(document.getElementById('str')?.value) || 10;
  const cap = str * 15;
  const encumbered = str * 5;
  const heavyEncumbered = str * 10;

  const capEl = document.getElementById('carryCapacity');
  if (capEl) capEl.textContent = cap;

  // Update encumbrance bar and status
  const barFill = document.getElementById('encumbranceBarFill');
  const statusEl = document.getElementById('encumbranceStatus');
  const totalEl = document.getElementById('encumbranceTotalDisplay');
  if (!barFill || !statusEl) return;

  const pct = Math.min(100, (total / cap) * 100);
  barFill.style.width = pct + '%';

  if (totalEl) totalEl.textContent = total + ' lb';

  if (total > cap) {
    barFill.style.background = '#8b1a1a';
    statusEl.textContent = '🚫 Over Capacity';
    statusEl.style.color = '#e05050';
  } else if (total > heavyEncumbered) {
    barFill.style.background = '#8b4a1a';
    statusEl.textContent = '⚠ Heavily Encumbered';
    statusEl.style.color = '#e08040';
  } else if (total > encumbered) {
    barFill.style.background = '#7a6a10';
    statusEl.textContent = '⚡ Encumbered';
    statusEl.style.color = '#c0a030';
  } else {
    barFill.style.background = 'linear-gradient(90deg,#3a6a28,#5a9a40)';
    statusEl.textContent = '✓ Unencumbered';
    statusEl.style.color = '#70c050';
  }
}

// ═══════════════════════════════════════════
//  MAGIC ITEMS
// ═══════════════════════════════════════════
function addMagicItem() {
  data.magicItems = data.magicItems || [];
  data.magicItems.push({name:'', rarity:'Common', charges:'', desc:''});
  renderMagicItems();
}

function renderMagicItems() {
  const container = document.getElementById('magicItemsList');
  container.innerHTML = '';
  (data.magicItems || []).forEach((item, i) => {
    const rarity = item.rarity || 'Common';
    const rarityClass = 'rarity-' + rarity.replace(' ','-');
    const div = document.createElement('div');
    div.className = 'magic-card' + (item._open ? ' open' : '');
    div.id = `magicCard${i}`;

    // Parse roll expressions from description (e.g. "1d6", "2d8+3", "d20")
    const rollMatches = [...new Set((item.desc||'').match(/\d*d\d+(?:[+-]\d+)?/gi) || [])];
    const chargesNum = parseInt(item.charges);
    const hasCharges = !isNaN(chargesNum) && chargesNum > 0;

    const rollBtns = rollMatches.slice(0,4).map(expr =>
      `<div class="magic-roll-btn purple" onclick="magicRoll(${i},'${expr}')">🎲 ${expr}</div>`
    ).join('');

    const chargesBtn = hasCharges
      ? `<div class="magic-roll-btn" onclick="magicUseCharge(${i})">⚡ Use Charge (<span id="magicCharge${i}">${item._chargesLeft ?? chargesNum}</span>/${chargesNum})</div>`
      : '';

    const rechargeBtn = hasCharges
      ? `<div class="magic-roll-btn" onclick="magicRestoreCharges(${i})">↺ Restore</div>`
      : '';

    div.innerHTML = `
      <div class="magic-card-header" onclick="toggleMagicCard(${i})">
        <div class="magic-rarity-dot ${rarityClass}"></div>
        <div class="magic-card-name">${item.name || '<em style="color:var(--text-muted)">Unnamed Item</em>'}</div>
        <div class="magic-card-meta">${rarity}</div>
        ${hasCharges ? `<div class="magic-card-meta" style="border-color:#6a4a18;color:#c09040;" id="magicChargeMeta${i}">${item._chargesLeft ?? chargesNum}/${chargesNum} ⚡</div>` : ''}
        <button onclick="event.stopPropagation();magicItemToInventory(${i})" title="Move to Inventory" style="padding:2px 7px;background:var(--bg-mid);border:1px solid var(--border-dark);border-radius:3px;color:var(--text-muted);font-size:11px;cursor:pointer;line-height:1.4;margin-left:auto;">📦</button>
        <div class="magic-card-chevron" style="margin-left:6px;">▼</div>
      </div>
      <div class="magic-card-body">
        <div class="magic-card-fields">
          <input type="text" value="${esc(item.name||'')}" placeholder="Item name…" style="flex:2;font-family:'IM Fell English',serif;font-size:16px;" oninput="data.magicItems[${i}].name=this.value;magicUpdateHeader(${i});autoSave()">
          <select style="flex:1;" onchange="data.magicItems[${i}].rarity=this.value;renderMagicItems();autoSave()">
            ${['Common','Uncommon','Rare','Very Rare','Legendary','Artifact'].map(r=>`<option ${rarity===r?'selected':''}>${r}</option>`).join('')}
          </select>
          <input type="text" value="${esc(item.charges||'')}" placeholder="Charges (e.g. 7)" style="width:90px;" oninput="data.magicItems[${i}].charges=this.value;data.magicItems[${i}]._chargesLeft=parseInt(this.value)||0;magicUpdateCharges(${i});autoSave()">
          <button class="del-btn" onclick="event.stopPropagation();data.magicItems.splice(${i},1);renderMagicItems();autoSave()">🗑</button>
        </div>
        <textarea rows="3" placeholder="Description, properties, effects… (type e.g. 1d6 fire and a roll button will appear)" oninput="data.magicItems[${i}].desc=this.value;magicUpdateRollBar(${i},this.value);autoSave()" onclick="event.stopPropagation()">${esc(item.desc||'')}</textarea>
        <div class="magic-roll-bar">
          ${rollBtns}${chargesBtn}${rechargeBtn}
        </div>
        <div class="magic-result-line" id="magicResult${i}"></div>
      </div>`;
    container.appendChild(div);
  });
}

function toggleMagicCard(i) {
  data.magicItems[i]._open = !data.magicItems[i]._open;
  const card = document.getElementById(`magicCard${i}`);
  if (card) card.classList.toggle('open', data.magicItems[i]._open);
}

function magicUpdateHeader(i) {
  const card = document.getElementById(`magicCard${i}`);
  if (!card) return;
  const nameEl = card.querySelector('.magic-card-name');
  if (nameEl) {
    const name = data.magicItems[i].name || '';
    nameEl.innerHTML = name || '<em style="color:var(--text-muted)">Unnamed Item</em>';
  }
}

function magicUpdateCharges(i) {
  const item = data.magicItems[i];
  const chargesNum = parseInt(item.charges);
  const hasCharges = !isNaN(chargesNum) && chargesNum > 0;
  const card = document.getElementById(`magicCard${i}`);
  if (!card) return;
  const rollBar = card.querySelector('.magic-roll-bar');
  if (rollBar) {
    const rollMatches = [...new Set((item.desc||'').match(/\d*d\d+(?:[+-]\d+)?/gi) || [])];
    const rollBtns = rollMatches.slice(0,4).map(expr =>
      `<div class="magic-roll-btn purple" onclick="magicRoll(${i},'${expr}')">🎲 ${expr}</div>`
    ).join('');
    const chargesBtn = hasCharges
      ? `<div class="magic-roll-btn" onclick="magicUseCharge(${i})">⚡ Use Charge (<span id="magicCharge${i}">${item._chargesLeft ?? chargesNum}</span>/${chargesNum})</div>`
      : '';
    const rechargeBtn = hasCharges
      ? `<div class="magic-roll-btn" onclick="magicRestoreCharges(${i})">↺ Restore</div>`
      : '';
    rollBar.innerHTML = rollBtns + chargesBtn + rechargeBtn;
  }
  let chargeMeta = document.getElementById(`magicChargeMeta${i}`);
  if (hasCharges) {
    if (!chargeMeta) {
      chargeMeta = document.createElement('div');
      chargeMeta.className = 'magic-card-meta';
      chargeMeta.id = `magicChargeMeta${i}`;
      chargeMeta.style.cssText = 'border-color:#6a4a18;color:#c09040;';
      const chevron = card.querySelector('.magic-card-chevron');
      if (chevron) chevron.before(chargeMeta);
    }
    chargeMeta.textContent = `${item._chargesLeft ?? chargesNum}/${chargesNum} ⚡`;
  } else if (chargeMeta) {
    chargeMeta.remove();
  }
}

function magicUpdateRollBar(i, desc) {
  const item = data.magicItems[i];
  const card = document.getElementById(`magicCard${i}`);
  if (!card) return;
  const rollBar = card.querySelector('.magic-roll-bar');
  if (!rollBar) return;
  const rollMatches = [...new Set((desc||'').match(/\d*d\d+(?:[+-]\d+)?/gi) || [])];
  const chargesNum = parseInt(item.charges);
  const hasCharges = !isNaN(chargesNum) && chargesNum > 0;
  const rollBtns = rollMatches.slice(0,4).map(expr =>
    `<div class="magic-roll-btn purple" onclick="magicRoll(${i},'${expr}')">🎲 ${expr}</div>`
  ).join('');
  const chargesBtn = hasCharges
    ? `<div class="magic-roll-btn" onclick="magicUseCharge(${i})">⚡ Use Charge (<span id="magicCharge${i}">${item._chargesLeft ?? chargesNum}</span>/${chargesNum})</div>`
    : '';
  const rechargeBtn = hasCharges
    ? `<div class="magic-roll-btn" onclick="magicRestoreCharges(${i})">↺ Restore</div>`
    : '';
  rollBar.innerHTML = rollBtns + chargesBtn + rechargeBtn;
}

function magicItemToInventory(i) {
  const item = data.magicItems[i];
  if (!item) return;
  data.inventory = data.inventory || [];
  data.inventory.push({
    name: item.name || 'Magic Item',
    qty: 1,
    weight: '',
    notes: [item.rarity, item.charges ? `${item.charges} charges` : '', item.desc].filter(Boolean).join(' · '),
    _itemKind: 'magic'
  });
  data.magicItems.splice(i, 1);
  renderMagicItems();
  autoSave();
  showToast(`${item.name || 'Item'} moved to inventory 📦`);
}

// ═══════════════════════════════════════════
//  QUEST INVENTORY
// ═══════════════════════════════════════════
function addQuestItem() {
  data.questItems = data.questItems || [];
  data.questItems.push({ name: '', notes: '', obtained: '' });
  renderQuestItems();
}

function renderQuestItems() {
  const container = document.getElementById('questItemsList');
  if (!container) return;
  data.questItems = data.questItems || [];
  if (data.questItems.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:14px 0;color:var(--text-muted);font-style:italic;font-size:17px;">No quest items. Add one using the button below.</div>';
    return;
  }
  container.innerHTML = '';
  data.questItems.forEach((item, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 4px;border-bottom:1px solid var(--border-dark);';
    row.innerHTML = `
      <span style="font-size:15px;flex-shrink:0;">🗺</span>
      <input type="text" value="${esc(item.name||'')}" placeholder="Item name…"
        style="flex:2;padding:4px 8px;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--accent-gold);font-family:'IM Fell English',serif;font-size:16px;"
        oninput="data.questItems[${i}].name=this.value;autoSave()">
      <input type="text" value="${esc(item.notes||'')}" placeholder="Note…"
        style="flex:3;padding:4px 8px;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-secondary);font-size:13px;"
        oninput="data.questItems[${i}].notes=this.value;autoSave()">
      <button onclick="questItemToInventory(${i})" title="Move to Inventory"
        style="padding:3px 8px;background:var(--bg-mid);border:1px solid var(--border-dark);border-radius:3px;color:var(--text-muted);font-size:12px;cursor:pointer;white-space:nowrap;">📦</button>
      <button onclick="data.questItems.splice(${i},1);renderQuestItems();autoSave()"
        class="del-btn">🗑</button>
    `;
    container.appendChild(row);
  });
}

function questItemToInventory(i) {
  const item = data.questItems[i];
  if (!item) return;
  data.inventory = data.inventory || [];
  data.inventory.push({
    name: item.name || 'Quest Item',
    qty: 1,
    weight: '',
    notes: item.notes || '',
    _itemKind: 'quest'
  });
  data.questItems.splice(i, 1);
  renderQuestItems();
  renderInventory();
  autoSave();
  showToast(`${item.name || 'Quest Item'} moved to inventory 📦`);
}

function inventoryItemToQuest(idx) {
  const item = data.inventory[idx];
  if (!item) return;
  data.questItems = data.questItems || [];
  data.questItems.push({
    name: item.name || 'Quest Item',
    notes: item.notes || '',
    obtained: ''
  });
  data.inventory.splice(idx, 1);
  renderInventory();
  renderQuestItems();
  autoSave();
  showToast(`${item.name || 'Item'} moved to Quest Inventory 🗺`);
}

function addQuestItemFromCompendiumCached(cacheKey) {
  const item = window._itemCache && window._itemCache[cacheKey];
  if (!item) return;
  data.questItems = data.questItems || [];
  data.questItems.push({
    name: item.name || 'Quest Item',
    notes: item.description ? item.description.slice(0, 120) : '',
    obtained: ''
  });
  renderQuestItems();
  autoSave();
  showToast(`${item.name} added to Quest Inventory 🗺`);
}

function magicRoll(i, expr) {
  // Parse e.g. "2d6+3", "d8", "1d20-1"
  const m = expr.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!m) return;
  const num = parseInt(m[1]) || 1;
  const sides = parseInt(m[2]);
  const bonus = parseInt(m[3]) || 0;
  let rolls = [], total = 0;
  for (let r=0; r<num; r++) { const v = Math.ceil(Math.random()*sides); rolls.push(v); total+=v; }
  total += bonus;
  const isCrit = num===1 && sides===20 && rolls[0]===20;
  const isFail = num===1 && sides===20 && rolls[0]===1;
  const color = isCrit?'#e0c040':isFail?'#cc3030':'#b080e0';
  const detail = rolls.length>1 ? ` (${rolls.join('+')}${bonus?fmtMod(bonus):''})` : bonus?` ${fmtMod(bonus)}`:'';
  const el = document.getElementById(`magicResult${i}`);
  if (el) el.innerHTML = `<span style="color:${color}">${expr}: <strong>${total}</strong></span><span style="font-size:9px;color:var(--text-muted);margin-left:6px;">${detail}${isCrit?' 🌟 CRIT!':isFail?' 💀 FAIL':''}</span>`;
}

function magicUseCharge(i) {
  const item = data.magicItems[i];
  const max = parseInt(item.charges) || 0;
  if (item._chargesLeft === undefined) item._chargesLeft = max;
  if (item._chargesLeft <= 0) {
    const el = document.getElementById(`magicResult${i}`);
    if (el) el.innerHTML = `<span style="color:#cc3030">No charges left!</span>`;
    return;
  }
  item._chargesLeft--;
  const el = document.getElementById(`magicResult${i}`);
  if (el) el.innerHTML = `<span style="color:#c09040">Charge used — remaining: ${item._chargesLeft}/${max}</span>`;
  const metaEl = document.getElementById(`magicChargeMeta${i}`);
  if (metaEl) metaEl.textContent = `${item._chargesLeft}/${max} ⚡`;
  const chEl = document.getElementById(`magicCharge${i}`);
  if (chEl) chEl.textContent = item._chargesLeft;
  autoSave();
}

function magicRestoreCharges(i) {
  const item = data.magicItems[i];
  const max = parseInt(item.charges) || 0;
  item._chargesLeft = max;
  renderMagicItems();
  autoSave();
}

// ═══════════════════════════════════════════
//  TRACKERS
// ═══════════════════════════════════════════
function addTracker() {
  data.trackers = data.trackers || [];
  data.trackers.push({name:'', max:5, used:0});
  renderTrackers();
}

function renderTrackers() {
  const container = document.getElementById('trackersList');
  container.innerHTML = '';
  (data.trackers || []).forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'tracker-item';
    div.style.flexWrap = 'wrap';
    const max = t.max || 5;
    const used = t.used || 0;
    const showPips = max <= 50;

    const pips = showPips ? Array.from({length: max}, (_, p) =>
      `<div class="tracker-pip ${p < used ? 'used' : ''}" onclick="toggleTrackerPip(${i},${p})"></div>`
    ).join('') : '';

    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;width:100%;flex-wrap:nowrap;">
        <input type="text" value="${t.name||''}" placeholder="Resource name (e.g. Ki Points, Bardic Inspiration)…" style="flex:1;min-width:80px;" oninput="data.trackers[${i}].name=this.value;if(data.trackers[${i}]._id){const _c=(data.hudConsumables||[]).find(c=>c.trackerId===data.trackers[${i}]._id);if(_c)_c.name=this.value;}autoSave()">
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <span style="font-size:11px;color:var(--text-muted);font-family:Cinzel,serif;">MAX</span>
          <input type="number" value="${max}" min="1" max="999" style="width:55px;" title="Max" oninput="const _v=parseInt(this.value);if(!_v||_v<1)return;data.trackers[${i}].max=_v;data.trackers[${i}].used=Math.min(data.trackers[${i}].used,_v);syncTrackerToQuick(${i});autoSave();clearTimeout(this._rt);this._rt=setTimeout(()=>renderTrackers(),600)" onchange="const _v2=Math.max(1,parseInt(this.value)||1);data.trackers[${i}].max=_v2;data.trackers[${i}].used=Math.min(data.trackers[${i}].used,_v2);renderTrackers();syncTrackerToQuick(${i});autoSave()">
        </div>
        <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
          <button class="btn btn-danger btn-sm" style="padding:4px 8px;font-size:14px;line-height:1;" onclick="data.trackers[${i}].used=Math.max(0,(data.trackers[${i}].used||0)-1);renderTrackers();syncTrackerToQuick(${i});autoSave()">−</button>
          <span style="font-family:Cinzel,serif;font-size:15px;font-weight:700;color:var(--accent-gold);min-width:40px;text-align:center;">${used}<span style="color:var(--text-muted);font-size:12px;">/${max}</span></span>
          <button class="btn btn-primary btn-sm" style="padding:4px 8px;font-size:14px;line-height:1;" onclick="data.trackers[${i}].used=Math.min(data.trackers[${i}].max,(data.trackers[${i}].used||0)+1);renderTrackers();syncTrackerToQuick(${i});autoSave()">+</button>
          <button class="btn btn-silver btn-sm" style="padding:4px 6px;font-size:10px;" title="Reset to 0" onclick="data.trackers[${i}].used=0;renderTrackers();syncTrackerToQuick(${i});autoSave()">✕</button>
          <button class="btn btn-primary btn-sm" style="padding:4px 6px;font-size:10px;" title="Refill to max" onclick="data.trackers[${i}].used=data.trackers[${i}].max;renderTrackers();syncTrackerToQuick(${i});autoSave()">↺</button>
        </div>
        <button class="equip-btn equip-generic-btn" style="padding:3px 8px;flex-shrink:0;${t._linkedToQuick?'color:#f0c060;border-color:#f0c060;':'color:#a0c060;border-color:#4a6020;'}" onclick="trackerToQuickBar(${i})" title="${t._linkedToQuick?'Already in Quick Bar':'Add to Quick Bar'}">⚡${t._linkedToQuick?' ✓':''}</button>
        <button class="del-btn" style="flex-shrink:0;" onclick="data.trackers.splice(${i},1);renderTrackers();autoSave()">🗑</button>
      </div>
      ${showPips ? `<div class="tracker-pips" style="width:100%;margin-top:6px;">${pips}</div>` : ''}
    `;
    container.appendChild(div);
  });
}

function toggleTrackerPip(ti, pi) {
  const t = data.trackers[ti];
  if (pi < t.used) t.used = pi;
  else t.used = pi + 1;
  renderTrackers();
  syncTrackerToQuick(ti);
  autoSave();
}

// ═══════════════════════════════════════════
//  CURRENCY
// ═══════════════════════════════════════════
function calcGP() {
  const cp = parseFloat(document.getElementById('cp')?.value) || 0;
  const sp = parseFloat(document.getElementById('sp')?.value) || 0;
  const ep = parseFloat(document.getElementById('ep')?.value) || 0;
  const gp = parseFloat(document.getElementById('gp')?.value) || 0;
  const pp = parseFloat(document.getElementById('pp')?.value) || 0;
  const total = (cp/100) + (sp/10) + (ep/2) + gp + (pp*10);
  const fmt = total.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:2}) + ' GP';
  const el = document.getElementById('totalGP');
  if (el) el.textContent = fmt;
  // Sync floating panel total
  const qrEl = document.getElementById('qrTotalGP');
  if (qrEl) qrEl.textContent = fmt;
  // Sync floating panel coin amounts
  ['cp','sp','ep','gp','pp'].forEach(c => {
    const val = parseFloat(document.getElementById(c)?.value) || 0;
    const qr = document.getElementById('qr' + c.charAt(0).toUpperCase() + c.slice(1) + 'Amt');
    if (qr) qr.textContent = val;
  });
}
['cp','sp','ep','gp','pp'].forEach(id => {
  // hooked via oninput in HTML + autoSave calls calcGP each time
});

// ═══════════════════════════════════════════
//  ATTUNEMENT
// ═══════════════════════════════════════════
function toggleAttune(i) {
  data.attune = data.attune || [false,false,false];
  data.attune[i] = !data.attune[i];
  renderAttunement();
  autoSave();
}
function renderAttunement() {
  for (let i=0;i<3;i++) {
    const gem = document.getElementById('attune'+i);
    if (gem) gem.classList.toggle('active', !!(data.attune && data.attune[i]));
    const nameEl = document.getElementById('attuneName'+i);
    if (nameEl && data.attuneName) nameEl.value = data.attuneName[i]||'';
  }
}

// ═══════════════════════════════════════════
//  CARRY CAPACITY
// ═══════════════════════════════════════════
function updateCarryCapacity() {
  calcEncumbrance();
}

