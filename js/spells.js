// ═══════════════════════════════════════════
//  spells.js - SPELLS, FEATURES, NOTES
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  SPELLS
// ═══════════════════════════════════════════
function updateSpellStats() {
  const ability = document.getElementById('spellcastingAbility')?.value || 'int';
  const score = parseInt(document.getElementById(ability)?.value) || 10;
  const mod = getMod(score);
  const lvl = parseInt(document.getElementById('charLevel')?.value) || 1;
  const pb = getProfBonus(lvl);
  const dc = 8 + mod + pb;
  const atk = mod + pb;
  const dcEl = document.getElementById('spellSaveDC');
  const atkEl = document.getElementById('spellAttackBonus');
  if (dcEl) dcEl.textContent = dc;
  if (atkEl) atkEl.textContent = fmtMod(atk);
  if (typeof refreshWeaponSpellPresets === 'function') refreshWeaponSpellPresets();
  autoSave();
}

function getPactInfo() {
  // Returns {level, count} for pact magic, or null
  if (!data.multiclass?.classes?.length) return null;
  const mc = data.multiclass;
  const WARLOCK_PACT = {1:[1,1],2:[1,2],3:[2,2],4:[2,2],5:[3,2],6:[3,2],7:[4,2],8:[4,2],9:[5,2],10:[5,2],11:[5,3],12:[5,3],13:[5,3],14:[5,3],15:[5,3],16:[5,3],17:[5,4],18:[5,4],19:[5,4],20:[5,4]};
  const MC_TYPE_MAP = {Artificer:'half',Barbarian:'none',Bard:'full','Blood Hunter':'none',Cleric:'full',Druid:'full',Fighter:'none','Eldritch Knight':'third',Monk:'none',Paladin:'half',Ranger:'half',Rogue:'none','Arcane Trickster':'third',Sorcerer:'full',Warlock:'pact',Wizard:'full'};
  let wl = 0;
  mc.classes.forEach(c => {
    const type = c.casterType || MC_TYPE_MAP[c.name] || 'none';
    if (type === 'pact') wl += Math.max(0, parseInt(c.level)||0);
  });
  wl = Math.min(20, wl);
  if (wl < 1) return null;
  return {level: WARLOCK_PACT[wl][0], count: WARLOCK_PACT[wl][1]};
}

function getPactSlotLevel() {
  const p = getPactInfo();
  return p ? p.level : null;
}

function buildSpellSlots() {
  const container = document.getElementById('spellSlots');
  container.innerHTML = '';
  const pact = getPactInfo();
  for (let lvl=1; lvl<=9; lvl++) {
    const slotData = data.spellSlots?.[lvl] || {max:0,used:0};
    const isPact = pact && (pact.level === lvl);
    // pact dots are the LAST pact.count dots in the row (not all of them)
    const pactCount = isPact ? pact.count : 0;
    const pactStart = slotData.max - pactCount; // index where pact dots begin
    const row = document.createElement('div');
    row.className = 'spell-slot-row' + (isPact ? ' pact-row' : '');
    const dots = Array.from({length:9}, (_,i) => {
      const avail = i < slotData.max;
      const used = i >= (slotData.max - slotData.used) && avail;
      const isPactDot = isPact && avail && i >= pactStart;
      return `<div class="slot-dot ${avail ? (used?'used':'available') : ''}${isPactDot ? ' pact' : ''}" 
        onclick="${avail ? `toggleSlot(${lvl},${i})` : `addSlot(${lvl},${i})`}"
        title="${avail ? (isPactDot ? (used?'Expended (Pact)':'Pact Magic') : (used?'Expended':'Available')) : 'No slot'}"></div>`;
    }).join('');
    row.innerHTML = `
      <div class="slot-level" style="display:flex;align-items:center;gap:6px;">
        <span>${ordinal(lvl)}</span>
        <input type="number" value="${slotData.max}" min="0" max="9" style="width:36px;font-size:12px;padding:2px 4px;" title="Max slots"
          oninput="data.spellSlots[${lvl}]={max:Math.min(9,parseInt(this.value)||0),used:Math.min(data.spellSlots[${lvl}]?.used||0,parseInt(this.value)||0)};buildSpellSlots();autoSave()">
      </div>
      <div class="slot-dots">${dots}</div>
      <div style="font-family:'Cinzel',serif;font-size:10px;color:${isPact ? '#b07ae0' : 'var(--text-muted)'};white-space:nowrap;">
        ${(slotData.max - slotData.used)}/${slotData.max}
      </div>
    `;
    container.appendChild(row);
  }
}

function toggleSlot(level, idx) {
  const sd = data.spellSlots[level];
  // figure out if slot at idx is used or available
  const usedStart = sd.max - sd.used;
  const expending = idx < usedStart; // true = using slot, false = restoring
  if (expending) {
    sd.used = Math.min(sd.max, sd.used + 1);
    _autoLog(`✨ Spell slot expended — Level ${level} (${sd.max - sd.used}/${sd.max} remaining)`, 'Spell');
  } else {
    sd.used = Math.max(0, sd.used - 1);
    _autoLog(`✨ Spell slot restored — Level ${level} (${sd.max - sd.used}/${sd.max} remaining)`, 'Spell');
  }
  buildSpellSlots();
  autoSave();
}

function ordinal(n) {
  const s=['th','st','nd','rd'];
  return n+(s[(n-20)%10]||s[n]||s[0]);
}

let _editSpellIdx = null;

// ─── Auto-parse dice & higher levels from description ───────────────────────

/**
 * Parsuje základný damage dice z popisu spellu.
 * Vracia napr. "3d10", "8d6", "2d8+5" alebo null.
 */
function _parseSpellDiceFromDesc(desc) {
  if (!desc) return null;
  // Hľadáme prvý výskyt NdM (prípadne s +bonus) PRED "At Higher Levels"
  const beforeHL = desc.split(/At Higher Levels/i)[0];
  // Uprednostnime výskyt "takes Xd?" alebo "deals Xd?" alebo "regains Xd?" alebo "takes Xd?"
  const patterns = [
    /takes?\s+(\d+d\d+(?:\s*\+\s*\d+)?)\b/i,
    /deals?\s+(\d+d\d+(?:\s*\+\s*\d+)?)\b/i,
    /regains?\s+(\d+d\d+(?:\s*\+\s*\d+)?)\b/i,
    /heals?\s+(\d+d\d+(?:\s*\+\s*\d+)?)\b/i,
    /(\d+d\d+(?:\s*\+\s*\d+)?)\s+(?:necrotic|fire|cold|lightning|radiant|psychic|poison|acid|thunder|force|piercing|slashing|bludgeoning|damage)\b/i,
    /(\d+d\d+(?:\s*\+\s*\d+)?)(?:\s*\+\s*\d+)?\s+hit\s+points/i,
    /(\d+d\d+)/i,
  ];
  for (const pat of patterns) {
    const m = beforeHL.match(pat);
    if (m) {
      // Normalizuj spacing
      return m[1].replace(/\s+/g, '');
    }
  }
  return null;
}

/**
 * Parsuje At Higher Levels sekciu z popisu spellu.
 * Podporuje formát DB: "increases by 3d10|1-9|1d10" (kde 1d10 je increment per slot)
 * aj prirodzený text: "increases by 1d6 for each slot level above 1st"
 * Vracia pole {level, dice, note} pre levely baseLevel+1 až 9.
 */
function _parseHigherLevelsFromDesc(desc, baseLevel) {
  if (!desc) return [];
  const base = parseInt(baseLevel) || 1;

  // Hľadáme At Higher Levels sekciu
  const hlMatch = desc.match(/At Higher Levels[:\.]?\s*([\s\S]+?)(?:\.|$)/i);
  if (!hlMatch) return [];
  const hlText = hlMatch[1].trim();

  // Formát DB: "increases by BASE|RANGE|INCREMENT" napr. "3d10|1-9|1d10"
  // BASE = základný dice pre vyšší level, INCREMENT = dice per slot above base
  const dbFmt = hlText.match(/increases?\s+by\s+(\d+d\d+)\|(\d+)-(\d+)\|(\d+d\d+)/i);
  if (dbFmt) {
    const incrDice = dbFmt[4]; // napr. "1d10"
    const result = [];
    for (let lvl = base + 1; lvl <= 9; lvl++) {
      const slotsAbove = lvl - base;
      // Vypočítame dice: slotsAbove * increment
      const incrMatch = incrDice.match(/(\d+)d(\d+)/);
      if (incrMatch) {
        const count = parseInt(incrMatch[1]) * slotsAbove;
        const die = incrMatch[2];
        // Základný dice + increment * slotsAbove
        const baseDiceMatch = desc.match(/(\d+d\d+)/);
        let baseDiceForHL = null;
        if (baseDiceMatch) {
          const bm = baseDiceMatch[1].match(/(\d+)d(\d+)/);
          if (bm && bm[2] === die) {
            baseDiceForHL = `${parseInt(bm[1]) + count}d${die}`;
          }
        }
        result.push({
          level: lvl,
          dice: baseDiceForHL || `+${count}d${die}`,
          note: ''
        });
      }
    }
    return result;
  }

  // Prirodzený text: "increases by 1d6 for each slot level above 1st"
  const natFmt = hlText.match(/increases?\s+by\s+(\d+d\d+)\s+for\s+each\s+(?:slot\s+level|level)\s+above/i);
  if (natFmt) {
    const incrDice = natFmt[1];
    const incrMatch = incrDice.match(/(\d+)d(\d+)/);
    const result = [];
    if (incrMatch) {
      for (let lvl = base + 1; lvl <= 9; lvl++) {
        const slotsAbove = lvl - base;
        const count = parseInt(incrMatch[1]) * slotsAbove;
        const die = incrMatch[2];
        // Skúsime nájsť base dice
        const beforeHL2 = desc.split(/At Higher Levels/i)[0];
        const bdm = beforeHL2.match(/(\d+)d(\d+)/);
        let diceFmt;
        if (bdm && bdm[2] === die) {
          diceFmt = `${parseInt(bdm[1]) + count}d${die}`;
        } else {
          diceFmt = `+${count}d${die}`;
        }
        result.push({ level: lvl, dice: diceFmt, note: '' });
      }
    }
    return result;
  }

  // Ak nič nesedí, vrátime prázdne pole
  return [];
}

/**
 * Vyplní dice pole a higher levels v editore podľa popisu spellu.
 * Volá sa z tlačidla "Auto-fill" — vždy prepíše dice aj higher levels.
 */
function _autoFillDiceFromDesc() {
  const desc = document.getElementById('m_desc')?.value || '';
  const level = parseInt(document.getElementById('m_spellLevel')?.value) || 1;

  // Dice pole — vždy vyparsuj a vyplň (aj keď tam niečo je)
  const diceField = document.getElementById('m_dice');
  if (diceField) {
    const parsed = _parseSpellDiceFromDesc(desc);
    if (parsed) {
      diceField.value = parsed;
      diceField.style.borderColor = '#80e090';
      setTimeout(() => { diceField.style.borderColor = ''; }, 1500);
    }
  }

  // Higher levels — vždy prepíš
  const parsedHL = _parseHigherLevelsFromDesc(desc, level);
  if (parsedHL.length > 0) {
    _hlTemp = parsedHL;
    _hlRerenderSection(level);
  }
}


function _buildHigherLevelsEditorHTML(spellLevel, higherLevels) {
  // higherLevels = array of {level, dice, note}
  const hl = Array.isArray(higherLevels) ? higherLevels : [];
  const baseLevel = parseInt(spellLevel) || 1;
  // Available levels to add (2-9, excluding already added and base level)
  const usedLevels = new Set(hl.map(e => e.level));
  const availLevels = [];
  for (let l = Math.max(2, baseLevel + 1); l <= 9; l++) {
    if (!usedLevels.has(l)) availLevels.push(l);
  }

  const rows = hl.map((e, i) => `
    <div class="hl-entry-row" id="hl_row_${i}" style="display:flex;align-items:center;gap:6px;background:rgba(120,80,20,0.12);border:1px solid rgba(180,140,40,0.2);border-radius:5px;padding:6px 8px;margin-bottom:5px;">
      <span style="font-family:'Cinzel',serif;font-size:11px;color:var(--accent-gold);min-width:32px;">Lv ${e.level}</span>
      <input type="text" value="${e.dice||''}" placeholder="e.g. 2d6" style="width:80px;font-size:13px;" title="Dice formula"
        oninput="_hlUpdate(${i},'dice',this.value)">
      <input type="text" value="${e.note||''}" placeholder="Note / effect…" style="flex:1;font-size:12px;" title="Description"
        oninput="_hlUpdate(${i},'note',this.value)">
      <button onclick="_hlRemove(${i})" style="background:rgba(120,20,20,0.5);border:1px solid #6a2020;color:#e06060;border-radius:3px;padding:2px 7px;font-size:13px;cursor:pointer;" title="Remove">✕</button>
    </div>
  `).join('');

  const addDropdown = availLevels.length > 0 ? `
    <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
      <select id="hl_add_level" style="font-size:12px;padding:3px 6px;">
        ${availLevels.map(l => `<option value="${l}">${l}${['st','nd','rd'][l-1]||'th'} level</option>`).join('')}
      </select>
      <button onclick="_hlAdd()" style="background:rgba(20,80,40,0.6);border:1px solid #3a7a40;color:#80e090;border-radius:3px;padding:3px 10px;font-size:12px;cursor:pointer;font-family:'Cinzel',serif;">+ Add Level</button>
    </div>
  ` : `<div style="color:var(--text-muted);font-size:11px;font-style:italic;margin-top:4px;">All levels added.</div>`;

  return `
    <div class="field" style="margin-top:4px;">
      <label style="display:flex;align-items:center;gap:8px;">
        At Higher Levels
        <span style="font-size:10px;color:var(--text-muted);font-family:'Crimson Text',serif;font-style:italic;font-weight:normal;">— dice used for upcast presets</span>
      </label>
      <div id="hl_entries_wrap" style="margin-bottom:4px;max-height:220px;overflow-y:auto;padding-right:4px;">${rows || '<div style="color:var(--text-muted);font-size:12px;font-style:italic;padding:4px 0;">No higher level entries yet.</div>'}</div>
      ${addDropdown}
    </div>
  `;
}

// In-modal higher levels state (temp while modal is open)
let _hlTemp = [];

function _hlUpdate(i, field, val) {
  if (_hlTemp[i]) _hlTemp[i][field] = val;
}
function _hlAdd() {
  const sel = document.getElementById('hl_add_level');
  if (!sel) return;
  const lvl = parseInt(sel.value);
  if (!lvl) return;
  _hlTemp.push({level: lvl, dice: '', note: ''});
  _hlTemp.sort((a,b) => a.level - b.level);
  // Re-render higher levels section only
  const spellLvl = parseInt(document.getElementById('m_spellLevel')?.value) || 1;
  _hlRerenderSection(spellLvl);
}
function _hlRemove(i) {
  _hlTemp.splice(i, 1);
  const spellLvl = parseInt(document.getElementById('m_spellLevel')?.value) || 1;
  _hlRerenderSection(spellLvl);
}
function _hlRerenderSection(spellLevel) {
  const wrap = document.getElementById('hl_section_wrap');
  if (wrap) wrap.innerHTML = _buildHigherLevelsEditorHTML(spellLevel, _hlTemp);
}

function editSpell(idx) {
  const s = data.spells && data.spells[idx];
  if (!s) return;
  _editSpellIdx = idx;
  _hlTemp = Array.isArray(s.higherLevels) ? s.higherLevels.map(e => ({...e})) : [];
  const SPELL_SCHOOLS_LOCAL = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'];
  const autoDice = (s.dice && s.dice.trim()) ? s.dice : (_parseSpellDiceFromDesc(s.desc || '') || '');
  if (_hlTemp.length === 0) {
    if (s.higher) {
      const parsedHL = _parseHigherLevelsFromDesc('At Higher Levels: ' + s.higher, s.level || 1);
      if (parsedHL.length > 0) _hlTemp = parsedHL;
    }
    if (_hlTemp.length === 0 && s.desc) {
      const parsedHL = _parseHigherLevelsFromDesc(s.desc, s.level || 1);
      if (parsedHL.length > 0) _hlTemp = parsedHL;
    }
  }
  showModal('Edit Spell', `
    <div class="field"><label>Spell Name</label><input type="text" id="m_spellName" value="${s.name||''}"></div>
    <div class="grid-2">
      <div class="field"><label>Level (0=Cantrip)</label><input type="number" id="m_spellLevel" value="${s.level||0}" min="0" max="9"></div>
      <div class="field"><label>School</label><select id="m_spellSchool">${SPELL_SCHOOLS_LOCAL.map(sc=>`<option${s.school===sc?' selected':''}>${sc}</option>`).join('')}</select></div>
    </div>
    <div class="grid-3">
      <div class="field"><label>Casting Time</label><input type="text" id="m_castTime" value="${s.castTime||''}" placeholder="1 action"></div>
      <div class="field"><label>Range</label><input type="text" id="m_range" value="${s.range||''}" placeholder="60 ft"></div>
      <div class="field"><label>Duration</label><input type="text" id="m_dur" value="${s.duration||''}" placeholder="Instantaneous"></div>
    </div>
    <div class="grid-2">
      <div class="field"><label>Components</label><input type="text" id="m_comp" value="${s.components||''}" placeholder="V, S, M (…)"></div>
      <div class="field">
        <label>Dice</label>
        <input type="text" id="m_dice" value="${autoDice}" placeholder="napr. 3d10, 2d6+4">
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px;flex-wrap:wrap;">
      <label style="display:flex;align-items:center;gap:6px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;color:var(--text-muted);cursor:pointer;">
        <input type="checkbox" id="m_conc" ${s.concentration?'checked':''}> Concentration
      </label>
      <label style="display:flex;align-items:center;gap:6px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;color:var(--text-muted);cursor:pointer;">
        <input type="checkbox" id="m_ritual" ${s.ritual?'checked':''}> Ritual
      </label>
      <button onclick="_autoFillDiceFromDesc()" title="Auto-vyplniť dice a higher levels z popisu" style="margin-left:auto;background:rgba(30,60,20,0.7);border:1px solid #3a7a40;color:#80e090;border-radius:4px;padding:2px 10px;font-size:9px;cursor:pointer;font-family:'Cinzel',serif;letter-spacing:0.5px;">✨ Auto-fill</button>
    </div>
    <div class="field"><label>Description</label><textarea id="m_desc" rows="4">${s.desc||''}</textarea></div>
    <div id="hl_section_wrap">${_buildHigherLevelsEditorHTML(s.level||1, _hlTemp)}</div>
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Save Changes', action:'saveEditedSpell()', cls:'btn-primary'}
  ]);
}

function saveEditedSpell() {
  const idx = _editSpellIdx;
  if (idx === null || !data.spells || !data.spells[idx]) { closeModal(); return; }
  // Collect live values from _hlTemp (oninput already updated it)
  // Also capture any field that might not have fired oninput yet
  document.querySelectorAll('#hl_entries_wrap .hl-entry-row').forEach((row, i) => {
    if (!_hlTemp[i]) return;
    const inputs = row.querySelectorAll('input');
    if (inputs[0]) _hlTemp[i].dice = inputs[0].value;
    if (inputs[1]) _hlTemp[i].note = inputs[1].value;
  });
  data.spells[idx] = {
    ...data.spells[idx],
    name:          document.getElementById('m_spellName')?.value  || '',
    level:         parseInt(document.getElementById('m_spellLevel')?.value) || 0,
    school:        document.getElementById('m_spellSchool')?.value || '',
    castTime:      document.getElementById('m_castTime')?.value   || '',
    range:         document.getElementById('m_range')?.value      || '',
    duration:      document.getElementById('m_dur')?.value        || '',
    components:    document.getElementById('m_comp')?.value       || '',
    dice:          document.getElementById('m_dice')?.value       || '',
    concentration: document.getElementById('m_conc')?.checked     || false,
    ritual:        document.getElementById('m_ritual')?.checked   || false,
    desc:          document.getElementById('m_desc')?.value       || '',
    higherLevels:  _hlTemp.filter(e => e.dice || e.note),
  };
  _editSpellIdx = null;
  _hlTemp = [];
  renderSpells(); autoSave(); closeModal(); showToast('Spell updated ✦');
}

function addSpell(forcedLevel) {
  _hlTemp = [];
  const baseLevel = forcedLevel >= 0 ? forcedLevel : 1;
  showModal('Add Spell', `
    <div class="field"><label>Spell Name</label><input type="text" id="m_spellName" placeholder="Fireball…"></div>
    <div class="grid-2">
      <div class="field"><label>Level (0=Cantrip)</label><input type="number" id="m_spellLevel" value="${baseLevel}" min="0" max="9"
        oninput="_hlRerenderSection(parseInt(this.value)||1)"></div>
      <div class="field"><label>School</label><select id="m_spellSchool">${SPELL_SCHOOLS.map(s=>`<option>${s}</option>`).join('')}</select></div>
    </div>
    <div class="grid-3">
      <div class="field"><label>Casting Time</label><input type="text" id="m_castTime" placeholder="1 action"></div>
      <div class="field"><label>Range</label><input type="text" id="m_range" placeholder="60 ft"></div>
      <div class="field"><label>Duration</label><input type="text" id="m_dur" placeholder="Instantaneous"></div>
    </div>
    <div class="grid-3">
      <div class="field"><label>Components</label><input type="text" id="m_comp" placeholder="V, S, M (…)"></div>
      <div class="field"><label>Dice</label><input type="text" id="m_dice" placeholder="napr. 3d10, 2d6+4"></div>
      <div class="field" style="display:flex;align-items:center;gap:8px;padding-top:20px;">
        <input type="checkbox" id="m_conc"> <label style="display:inline;font-size:12px;">Concentration</label>
        <input type="checkbox" id="m_ritual"> <label style="display:inline;font-size:12px;">Ritual</label>
      </div>
    </div>
    <div class="field"><label>Description</label><textarea id="m_desc" rows="4" placeholder="Spell description…"></textarea></div>
    <div id="hl_section_wrap">${_buildHigherLevelsEditorHTML(baseLevel, [])}</div>
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Add Spell', action:`
      // Flush any pending oninput values from hl rows
      document.querySelectorAll('#hl_entries_wrap .hl-entry-row').forEach((row, i) => {
        if (!_hlTemp[i]) return;
        const inputs = row.querySelectorAll('input');
        if (inputs[0]) _hlTemp[i].dice = inputs[0].value;
        if (inputs[1]) _hlTemp[i].note = inputs[1].value;
      });
      data.spells = data.spells||[];
      data.spells.push({
        name: document.getElementById('m_spellName').value,
        level: parseInt(document.getElementById('m_spellLevel').value)||0,
        school: document.getElementById('m_spellSchool').value,
        castTime: document.getElementById('m_castTime').value,
        range: document.getElementById('m_range').value,
        duration: document.getElementById('m_dur').value,
        components: document.getElementById('m_comp').value,
        dice: document.getElementById('m_dice').value,
        concentration: document.getElementById('m_conc').checked,
        ritual: document.getElementById('m_ritual').checked,
        desc: document.getElementById('m_desc').value,
        higherLevels: _hlTemp.filter(e => e.dice || e.note),
        prepared: false
      });
      _hlTemp = [];
      renderSpells();
      autoSave();
      closeModal();
    `, cls:'btn-primary'}
  ]);
}

function renderSpells() {
  // Cantrips
  const cantripContainer = document.getElementById('cantripsList');
  cantripContainer.innerHTML = '';
  (data.spells||[]).filter(s=>s.level===0).forEach((s,si) => {
    const realIdx = (data.spells||[]).indexOf(s);
    cantripContainer.appendChild(buildSpellCard(s, realIdx));
  });

  // Levels 1-9
  const container = document.getElementById('spellLevels');
  container.innerHTML = '';
  for (let lvl=1; lvl<=9; lvl++) {
    const spellsAtLevel = (data.spells||[]).filter(s=>s.level===lvl);
    const section = document.createElement('div');
    section.className = 'panel mb';
    section.innerHTML = `<div class="section-header">${ordinal(lvl)}-Level Spells <span style="color:var(--text-muted);font-size:10px;letter-spacing:1px;margin-left:8px;">(${spellsAtLevel.length} spells)</span></div><div id="spellLevel_${lvl}"></div><button class="add-row-btn" onclick="addSpell(${lvl})">+ Add ${ordinal(lvl)}-Level Spell</button>`;
    container.appendChild(section);
    const lvlContainer = section.querySelector('#spellLevel_' + lvl);
    spellsAtLevel.forEach(s => {
      const realIdx = (data.spells||[]).indexOf(s);
      lvlContainer.appendChild(buildSpellCard(s, realIdx));
    });
  }
}

function buildSpellCard(spell, idx) {
  // Auto-fill dice from description if missing — uloží aj do dát
  if (!spell.dice && spell.desc) {
    const _parsed = _parseSpellDiceFromDesc(spell.desc);
    if (_parsed) {
      spell.dice = _parsed;
      if (data.spells && data.spells[idx]) data.spells[idx].dice = _parsed;
    }
  }
  // Auto-fill higherLevels from description if missing
  if ((!spell.higherLevels || spell.higherLevels.length === 0) && spell.desc) {
    const _parsedHL = _parseHigherLevelsFromDesc(spell.desc, spell.level || 1);
    if (_parsedHL.length > 0) {
      spell.higherLevels = _parsedHL;
      if (data.spells && data.spells[idx]) data.spells[idx].higherLevels = _parsedHL;
    }
  }
  const card = document.createElement('div');
  card.className = 'spell-card';
  card.innerHTML = `
    <div class="spell-card-header">
      <div class="spell-prepared ${spell.prepared?'yes':''}" onclick="togglePrepared(${idx})" title="Toggle prepared"></div>
      <div class="spell-level-badge">${spell.level===0?'Cantrip':ordinal(spell.level)}</div>
      <div class="spell-name">${spell.name||'Unnamed Spell'}</div>
      <div class="spell-school">${spell.school||''}</div>
      ${spell.concentration?'<div class="conc-indicator">C</div>':''}
      ${spell.ritual?'<div class="conc-indicator" style="border-color:#5060b8;color:#8090d0;background:rgba(80,80,180,0.1);">R</div>':''}
      <button class="del-btn" style="background:linear-gradient(135deg,rgba(40,60,20,0.7),rgba(20,40,10,0.5));border-color:#4a7a30;color:#90d060;font-size:13px;" onclick="event.stopPropagation();addSpellPreset(${idx})" title="Pridať do Quick Roll">🎲</button>
      <button class="del-btn" style="background:rgba(40,60,100,0.3);border-color:#304080;" onclick="event.stopPropagation();editSpell(${idx})" title="Edit spell">✎</button>
      <button class="del-btn" onclick="event.stopPropagation();data.spells.splice(${idx},1);renderSpells();autoSave()">🗑</button>
    </div>
    <div class="spell-tags">
      ${spell.castTime?`<div class="spell-tag">⏱ ${spell.castTime}</div>`:''}
      ${spell.range?`<div class="spell-tag">◎ ${spell.range}</div>`:''}
      ${spell.duration?`<div class="spell-tag">⧗ ${spell.duration}</div>`:''}
      ${spell.dice?`<div class="spell-tag" style="color:#e0c060;border-color:rgba(200,160,40,0.4);background:rgba(120,80,10,0.2);">🎲 ${spell.dice}</div>`:''}
      ${spell.components?`<div class="spell-tag">${spell.components}</div>`:''}
    </div>
    <div class="spell-desc">
      <p style="margin-bottom:6px;">${spell.desc||''}</p>
      ${(() => {
        const hl = Array.isArray(spell.higherLevels) && spell.higherLevels.length > 0 ? spell.higherLevels : null;
        const legacyHigher = !hl && spell.higher ? spell.higher : null;
        if (hl) {
          const rows = hl.map(e =>
            '<div style="display:flex;align-items:baseline;gap:8px;padding:2px 0;">' +
              '<span style="font-family:\'Cinzel\',serif;font-size:10px;color:var(--accent-gold);min-width:30px;letter-spacing:0.5px;">Lv ' + e.level + '</span>' +
              (e.dice ? '<span style="font-family:\'Cinzel\',serif;font-size:13px;color:#e0c060;font-weight:700;">' + e.dice + '</span>' : '') +
              (e.note ? '<span style="font-size:13px;color:var(--text-secondary);font-style:italic;">' + e.note + '</span>' : '') +
            '</div>'
          ).join('');
          return '<div style="margin-top:6px;border-top:1px solid rgba(180,140,40,0.2);padding-top:6px;">' +
            '<div style="font-family:\'Cinzel\',serif;font-size:10px;color:var(--accent-gold);letter-spacing:1px;margin-bottom:4px;">AT HIGHER LEVELS</div>' +
            rows + '</div>';
        }
        if (legacyHigher) {
          return '<p style="color:var(--accent-gold);font-size:17px;font-style:italic;"><strong>At Higher Levels:</strong> ' + legacyHigher + '</p>';
        }
        return '';
      })()}
    </div>
  `;
  card.addEventListener('click', e => {
    if (!e.target.classList.contains('del-btn') && !e.target.classList.contains('spell-prepared')) {
      card.classList.toggle('expanded');
    }
  });
  return card;
}

function togglePrepared(idx) {
  if (data.spells && data.spells[idx]) {
    data.spells[idx].prepared = !data.spells[idx].prepared;
    renderSpells();
    autoSave();
  }
}

// ─── Quick Roll preset zo spellu ──────────────────────────────────────────────
// Spells that add the casting modifier to damage (ability mod is part of the hit)
// Most damaging spells do NOT add the ability modifier to damage in 5e.
// Exceptions: Shillelagh, Booming Blade, Green-Flame Blade, some cantrips.
// We detect them by keywords in the description.
const _SPELL_MOD_TO_DMG_KEYWORDS = ['shillelagh','booming blade','green-flame','toll the dead'];

function addSpellPreset(idx) {
  const spell = (data.spells || [])[idx];
  if (!spell) return;
  const name = (spell.name || 'Spell').trim();

  const ability  = document.getElementById('spellcastingAbility')?.value || data.spellcastingAbility || 'int';
  const score    = parseInt(document.getElementById(ability)?.value) || parseInt(data[ability]) || 10;
  const lvl      = parseInt(document.getElementById('charLevel')?.value) || parseInt(data.charLevel) || 1;
  const pb       = getProfBonus(lvl);
  const spellMod = getMod(score);
  const spellAtk = spellMod + pb;
  const spellDC  = 8 + spellAtk;

  // Use explicit dice field first, then parse from description as fallback
  const descText = (spell.desc || '') + ' ' + (spell.higher || '');
  const dmgMatch = descText.match(/(\d+d\d+)/i);
  // spell.dice (pole Dice v editore) má vždy prednosť pred parsovaním z popisu
  const dmgDice = (spell.dice && spell.dice.trim()) || (dmgMatch ? dmgMatch[1] : null);

  // Only add ability mod to damage for spells that explicitly do so
  const descLower = descText.toLowerCase();
  const addModToDmg = _SPELL_MOD_TO_DMG_KEYWORDS.some(k => descLower.includes(k));

  data.qrPresets = data.qrPresets || [];
  if (data.qrPresets.length >= 12) { showToast('Quick Roll: max 12 presets'); return; }

  const existIdx = data.qrPresets.findIndex(p => p._srcSpell === idx || (p._fromSpell && p.name === name));

  let preset;
  const schoolNote = spell.school ? ' · ' + spell.school : '';

  if (dmgDice) {
    // Attack spell with damage (e.g. Inflict Wounds, Fire Bolt)
    // hitBonus = spell attack bonus; dmgBonus = 0 unless spell explicitly adds mod
    preset = {
      name,
      type: 'both',
      hitBonus: spellAtk,
      dmgDice,
      dmgBonus: addModToDmg ? spellMod : 0,
      note: 'DC ' + spellDC + schoolNote,
      _fromSpell: true,
      _srcSpell: idx
    };
  } else {
    // Save/utility spell bez dice — použij 1d4 ako placeholder
    preset = {
      name,
      type: 'attack',
      hitBonus: spellAtk,
      dmgDice: '1d4',
      dmgBonus: 0,
      note: 'DC ' + spellDC + schoolNote,
      _fromSpell: true,
      _srcSpell: idx
    };
  }

  if (existIdx >= 0) {
    data.qrPresets[existIdx] = preset;
    showToast('🎲 ' + name + ' — preset aktualizovaný ✦');
  } else {
    data.qrPresets.push(preset);
    showToast('🎲 ' + name + ' → Quick Roll preset pridaný ✦');
  }
  autoSave();
  if (typeof renderQrPresets === 'function') renderQrPresets();
}

// ═══════════════════════════════════════════
//  FEATURES
// ═══════════════════════════════════════════
function addFeature(type) {
  const key = type + 'Features';
  const keyMap = {class:'classFeatures',racial:'racialFeatures',feat:'feats',background:'backgroundFeatures',active:'activeAbilities'};
  const arrKey = keyMap[type];
  data[arrKey] = data[arrKey] || [];
  data[arrKey].push({name:'', source:'', desc:'', uses:'', recharge:''});
  renderFeatures();
}

function renderFeatures() {
  const types = [
    {key:'classFeatures', domId:'classFeaturesList'},
    {key:'racialFeatures', domId:'racialFeaturesList'},
    {key:'feats', domId:'featsList'},
    {key:'backgroundFeatures', domId:'backgroundFeaturesList'},
    {key:'activeAbilities', domId:'activeAbilitiesList'}
  ];
  types.forEach(t => {
    const container = document.getElementById(t.domId);
    if (!container) return;
    // Remember which cards were expanded before re-render
    const expanded = new Set();
    container.querySelectorAll('.feature-card[data-idx]').forEach(el => {
      if (el.querySelector('.feature-expand').style.display !== 'none') expanded.add(+el.dataset.idx);
    });
    container.innerHTML = '';
    (data[t.key]||[]).forEach((f,i) => {
      const div = document.createElement('div');
      div.className = 'feature-card';
      div.dataset.idx = i;
      const isOpen = expanded.has(i);
      div.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;cursor:pointer;" onclick="toggleFeatureCard(this.parentElement)">
          <span style="font-family:'Cinzel',serif;font-size:11px;color:var(--accent-gold);transition:transform 0.2s;display:inline-block;" class="feat-chevron">${isOpen?'▾':'▸'}</span>
          <span style="flex:1;font-family:'IM Fell English',serif;font-size:17px;color:var(--accent-gold);">${f.name||'<span style="color:var(--text-muted);font-size:17px;font-style:italic;">Bez názvu…</span>'}</span>
          ${f.uses?`<span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:1px;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:3px;padding:2px 7px;">${f.uses}${f.recharge?' / '+f.recharge:''}</span>`:''}
          <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();data['${t.key}'].splice(${i},1);renderFeatures();autoSave()">🗑</button>
        </div>
        <div class="feature-expand" style="display:${isOpen?'block':'none'};margin-top:10px;padding-top:10px;border-top:1px solid var(--border-dark);">
          <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
            <input type="text" value="${f.name||''}" placeholder="Názov…" style="flex:2;min-width:140px;font-family:'IM Fell English',serif;font-size:16px;color:var(--accent-gold);" oninput="data['${t.key}'][${i}].name=this.value;autoSave();this.closest('.feature-card').querySelector('span.feat-name')&&(this.closest('.feature-card').querySelector('span.feat-name').textContent=this.value);" onchange="renderFeatures()">
            <input type="text" value="${f.source||''}" placeholder="Zdroj (napr. Paladin 3)" style="flex:1;min-width:100px;font-size:12px;" oninput="data['${t.key}'][${i}].source=this.value;autoSave()">
            <input type="text" value="${f.uses||''}" placeholder="Uses" style="width:60px;font-size:12px;" oninput="data['${t.key}'][${i}].uses=this.value;autoSave()">
            <input type="text" value="${f.recharge||''}" placeholder="Recharge" style="width:80px;font-size:12px;" oninput="data['${t.key}'][${i}].recharge=this.value;autoSave()">
          </div>
          <textarea rows="4" placeholder="Popis…" style="width:100%;box-sizing:border-box;" oninput="data['${t.key}'][${i}].desc=this.value;autoSave()">${f.desc||''}</textarea>
        </div>
      `;
      container.appendChild(div);
    });
  });
}

function toggleFeatureCard(card) {
  const body = card.querySelector('.feature-expand');
  const chevron = card.querySelector('.feat-chevron');
  if (!body) return;
  const opening = body.style.display === 'none';
  body.style.display = opening ? 'block' : 'none';
  if (chevron) chevron.textContent = opening ? '▾' : '▸';
}

// ═══════════════════════════════════════════
//  NOTES
// ═══════════════════════════════════════════
// ══════════════════════════════════════════
//  PLAYER NOTES
// ══════════════════════════════════════════
const RELATION_COLORS = {
  'Ally': '#2a5a4a', 'Friend': '#2a5a1a', 'Neutral': '#3a3a3a',
  'Rival': '#5a4a10', 'Suspicious': '#5a3a10', 'Unknown': '#2a2a4a'
};
const RELATION_ICONS = {
  'Ally':'🤝', 'Friend':'💚', 'Neutral':'⚪', 'Rival':'⚔', 'Suspicious':'👁', 'Unknown':'❓'
};

function addPlayerNote() {
  data.playerNotes = data.playerNotes || [];
  data.playerNotes.push({
    name:'', player:'', class:'', relation:'Unknown', notes:'', secrets:'', _open:true
  });
  _pageState.playerNotes.page = 0;
  renderPlayerNotes();
  setTimeout(() => {
    const cards = document.querySelectorAll('.player-note-card');
    if (cards.length) cards[cards.length-1].scrollIntoView({behavior:'smooth', block:'nearest'});
  }, 50);
}

// ═══════════════════════════════════════════
