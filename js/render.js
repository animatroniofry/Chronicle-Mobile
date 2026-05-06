// ═══════════════════════════════════════════
//  render.js - FULL RENDER, LOOT GENERATOR, CONCENTRATION, PRAYERS
// ═══════════════════════════════════════════

//  FULL RENDER
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
//  LOOT GENERATOR
// ═══════════════════════════════════════════

const LOOT_PROFILES = {
  chest_small:    { minItems:1, maxItems:3, goldMin:5,   goldMax:50,   magicMult:0.5, coinMix:['cp','sp'],         label:'Small Chest' },
  chest_medium:   { minItems:2, maxItems:5, goldMin:20,  goldMax:200,  magicMult:1.0, coinMix:['sp','gp'],         label:'Medium Chest' },
  chest_large:    { minItems:3, maxItems:7, goldMin:100, goldMax:800,  magicMult:1.5, coinMix:['sp','gp','pp'],    label:'Large Chest' },
  chest_treasure: { minItems:4, maxItems:10,goldMin:500, goldMax:5000, magicMult:2.5, coinMix:['gp','pp'],         label:'Treasure Hoard' },
  corpse_weak:    { minItems:0, maxItems:2, goldMin:0,   goldMax:15,   magicMult:0.2, coinMix:['cp','sp'],         label:'Weak Enemy' },
  corpse_medium:  { minItems:1, maxItems:3, goldMin:5,   goldMax:80,   magicMult:0.6, coinMix:['sp','gp'],         label:'Medium Enemy' },
  corpse_boss:    { minItems:2, maxItems:5, goldMin:50,  goldMax:500,  magicMult:1.8, coinMix:['gp','pp'],         label:'Boss Enemy' },
  pickpocket:     { minItems:1, maxItems:2, goldMin:1,   goldMax:30,   magicMult:0.1, coinMix:['cp','sp','gp'],    label:'Pickpocket' },
  merchant:       { minItems:2, maxItems:6, goldMin:50,  goldMax:400,  magicMult:0.8, coinMix:['gp'],              label:'Merchant Stash' },
  dungeon:        { minItems:2, maxItems:6, goldMin:30,  goldMax:300,  magicMult:1.2, coinMix:['sp','gp'],         label:'Dungeon Cache' },
  nature:         { minItems:1, maxItems:4, goldMin:0,   goldMax:20,   magicMult:0.1, coinMix:['cp'],              label:'Nature Find' },
  custom:         { minItems:1, maxItems:4, goldMin:10,  goldMax:100,  magicMult:1.0, coinMix:['sp','gp'],         label:'Custom' },
};

const LOOT_TIER_RARITY = {
  poor:      ['Common'],
  modest:    ['Common','Common','Uncommon'],
  wealthy:   ['Common','Uncommon','Uncommon','Rare'],
  rich:      ['Uncommon','Rare','Rare','Very Rare'],
  legendary: ['Rare','Very Rare','Very Rare','Legendary'],
};

const LOOT_TIER_GOLD_MULT = { poor:0.5, modest:1, wealthy:3, rich:8, legendary:25 };

const RARITY_COLORS = {
  'Common':'#888', 'Uncommon':'#4a9a40', 'Rare':'#4060cc',
  'Very Rare':'#8040cc', 'Legendary':'#cc8820', 'Artifact':'#cc3030', 'Varies':'#6a8a80'
};

// Mundane loot tables for non-magic items
const MUNDANE_LOOT = {
  chest_small:    ['Candle','Rope (50 ft)','Torch','Rations (1 day)','Waterskin','Tinderbox','Chalk (10 pieces)'],
  chest_medium:   ['Lantern','Oil flask','Crowbar','Grappling hook','Healing herbs','Ink & quill','Lock'],
  chest_large:    ['Fine clothes','Spyglass','Magnifying glass','Hourglass','Merchant scales','Map case','Adventuring kit'],
  chest_treasure: ['Gemstone (50 gp)','Art object','Ancient coin collection','Rare spice pouch','Rolled tapestry','Jeweled goblet'],
  corpse_weak:    ['Dagger','Club','Leather scraps','Crude shield','Ration (half eaten)','Wooden holy symbol'],
  corpse_medium:  ['Short sword','Chain shirt','Adventurer\'s pack','Healing potion (partial)','Lock picks','Signet ring'],
  corpse_boss:    ['War axe','Scale armor','Commander\'s badge','Key ring','Battle standard','Spell component pouch'],
  pickpocket:     ['Coin purse','House key','Love letter','Stolen ring','Forged document','Lucky rabbit\'s foot'],
  merchant:       ['Trade goods','Exotic spice','Rare cloth','Sealed letter','Merchant ledger','Fine wine'],
  dungeon:        ['Broken weapon','Crude map','Bone dice','Torch stub','Rat skull','Carved token'],
  nature:         ['Healing herb','Rare mushroom','Bird feather','Smooth stone','Dried flower','Animal tooth','Pine cone'],
  custom:         ['Mysterious item','Wrapped package','Sealed scroll','Strange device'],
};

let _lootLastResult = null;

function lootUpdatePreview() {
  const src = document.getElementById('lootSource').value;
  const tier = document.getElementById('lootTier').value;
  const profile = LOOT_PROFILES[src] || LOOT_PROFILES.chest_medium;
  const mult = LOOT_TIER_GOLD_MULT[tier] || 1;
  const min = Math.round(profile.goldMin * mult);
  const max = Math.round(profile.goldMax * mult);
  const el = document.getElementById('lootGoldRange');
  if (el) el.textContent = min + ' – ' + max + ' GP equivalent';
  // Show/hide custom fields
  const cf = document.getElementById('lootCustomFields');
  if (cf) cf.style.display = src === 'custom' ? '' : 'none';
}

function _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function _pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateLoot() {
  initCustomDB();
  const src = document.getElementById('lootSource').value;
  const tier = document.getElementById('lootTier').value;
  const magicChancePct = parseInt(document.getElementById('lootMagicChance').value) || 25;
  const profile = LOOT_PROFILES[src] || LOOT_PROFILES.chest_medium;
  const goldMult = LOOT_TIER_GOLD_MULT[tier] || 1;

  // Determine item count
  let minI = profile.minItems, maxI = profile.maxItems;
  if (src === 'custom') {
    minI = parseInt(document.getElementById('lootMinItems')?.value) || 1;
    maxI = parseInt(document.getElementById('lootMaxItems')?.value) || 4;
  }
  const count = _rand(minI, maxI);

  // Generate gold/coins
  const goldBase = _rand(profile.goldMin, profile.goldMax) * goldMult;
  const coins = lootGenerateCoins(goldBase, profile.coinMix);

  // Generate items
  const allItems = [...MAGIC_ITEM_DB, ...EQUIPMENT_DB, ...(data.customItems||[])];
  const rarityPool = LOOT_TIER_RARITY[tier] || ['Common'];
  const items = [];
  const mundanePool = MUNDANE_LOOT[src] || MUNDANE_LOOT.chest_medium;

  for (let i = 0; i < count; i++) {
    const isMagic = Math.random() * 100 < (magicChancePct * profile.magicMult);
    if (isMagic && allItems.length > 0) {
      const rarity = _pick(rarityPool);
      const pool = allItems.filter(it => it.rarity === rarity || it.rarity === 'Varies');
      const item = pool.length > 0 ? _pick(pool) : _pick(allItems);
      items.push({ type: 'magic', item });
    } else {
      // Mundane item
      items.push({ type: 'mundane', name: _pick(mundanePool) });
    }
  }

  _lootLastResult = { coins, items, source: profile.label, tier };
  renderLootResult(_lootLastResult);

  // Save to history
  if (!data.lootHistory) data.lootHistory = [];
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  const summary = `[${timeStr}] ${profile.label} · ${tier} · ${items.length} items · ${Math.round(goldBase)} GP`;
  data.lootHistory.unshift({ time: timeStr, summary, items: items.map(i => i.type === 'magic' ? i.item.name : i.name), coins });
  if (data.lootHistory.length > 20) data.lootHistory.pop();
  renderLootHistory();
  autoSave();
}

function lootGenerateCoins(targetGP, coinMix) {
  const coins = {cp:0,sp:0,ep:0,gp:0,pp:0};
  let remaining = targetGP;
  const shuffled = [...coinMix].sort(() => Math.random()-0.5);
  for (const coin of shuffled) {
    const rates = {cp:0.01,sp:0.1,ep:0.5,gp:1,pp:10};
    const rate = rates[coin];
    if (remaining <= 0) break;
    const max = Math.floor(remaining / rate);
    if (max <= 0) continue;
    const amount = _rand(Math.floor(max*0.3), max);
    coins[coin] = amount;
    remaining -= amount * rate;
  }
  return coins;
}

function renderLootResult(result) {
  const area = document.getElementById('lootResultArea');
  if (!area) return;
  if (!result) { area.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);">— CONFIGURE & GENERATE —</div>'; return; }

  const { coins, items } = result;
  let html = '';

  // Gold row
  const totalGP = coins.cp*0.01 + coins.sp*0.1 + coins.ep*0.5 + coins.gp + coins.pp*10;
  const coinParts = [];
  if (coins.pp) coinParts.push(`${coins.pp} PP`);
  if (coins.gp) coinParts.push(`${coins.gp} GP`);
  if (coins.ep) coinParts.push(`${coins.ep} EP`);
  if (coins.sp) coinParts.push(`${coins.sp} SP`);
  if (coins.cp) coinParts.push(`${coins.cp} CP`);

  if (coinParts.length > 0) {
    html += `<div class="loot-gold-row">
      <div class="loot-gold-icon">💰</div>
      <div>
        <div class="loot-gold-amount">${totalGP.toFixed(totalGP < 1 ? 2 : 0)} GP value</div>
        <div class="loot-gold-breakdown">${coinParts.join(' · ')}</div>
      </div>
      <button class="loot-add-btn" id="lootAddCoinsBtn" onclick="lootAddCoinsToSheet()" style="margin-left:auto;">+ Add to Sheet</button>
    </div>`;
  }

  // Items
  items.forEach((entry, idx) => {
    if (entry.type === 'magic') {
      const item = entry.item;
      const rarity = item.rarity || 'Common';
      const color = RARITY_COLORS[rarity] || '#888';
      const shortDesc = (item.description || '').substring(0, 120) + (item.description?.length > 120 ? '…' : '');
      html += `<div class="loot-item-card magic" id="lootCard${idx}">
        <div class="loot-rarity-pip" style="background:${color};"></div>
        <div class="loot-item-info">
          <div class="loot-item-name magic">${item.name}</div>
          <div class="loot-item-meta">${rarity} · ${item.type || ''} ${item.attunement==='Y'?' · Attunement':''}</div>
          <div class="loot-item-desc">${shortDesc}</div>
        </div>
        <button class="loot-add-btn" id="lootItemBtn${idx}" onclick="lootAddItemToInventory(${idx})">+ Inventory</button>
      </div>`;
    } else {
      html += `<div class="loot-item-card" id="lootCard${idx}">
        <div class="loot-rarity-pip" style="background:#554433;"></div>
        <div class="loot-item-info">
          <div class="loot-item-name">${entry.name}</div>
          <div class="loot-item-meta">Mundane Item</div>
        </div>
        <button class="loot-add-btn" id="lootItemBtn${idx}" onclick="lootAddItemToInventory(${idx})">+ Inventory</button>
      </div>`;
    }
  });

  if (items.length === 0 && coinParts.length === 0) {
    html += '<div style="text-align:center;padding:30px;color:var(--text-muted);font-family:Cinzel,serif;font-size:11px;">Nothing of value found.</div>';
  }

  area.innerHTML = html;
  document.getElementById('lootAddAllBtn').style.display = '';
  document.getElementById('lootRerollBtn').style.display = '';
}

function lootAddCoinsToSheet() {
  if (!_lootLastResult) return;
  const c = _lootLastResult.coins;
  ['cp','sp','ep','gp','pp'].forEach(coin => {
    data[coin] = (parseInt(data[coin])||0) + (c[coin]||0);
    const el = document.getElementById(coin); if (el) el.value = data[coin];
  });
  calcGP();
  autoSave();
  const btn = document.getElementById('lootAddCoinsBtn');
  if (btn) { btn.textContent = '✓ Added'; btn.classList.add('added'); }
  showToast('Coins added to your purse ✦');
}

function lootAddItemToInventory(idx) {
  if (!_lootLastResult) return;
  const entry = _lootLastResult.items[idx];
  if (!entry) return;
  data.inventory = data.inventory || [];
  if (entry.type === 'magic') {
    data.inventory.push({ name: entry.item.name, qty: 1, weight: entry.item.weight || '', notes: entry.item.rarity + ' · ' + (entry.item.type||''), _itemKind: 'magic' });
  } else {
    data.inventory.push({ name: entry.name, qty: 1, weight: '', notes: 'Looted item' });
  }
  renderInventory();
  autoSave();
  const btn = document.getElementById(`lootItemBtn${idx}`);
  if (btn) { btn.textContent = '✓ Added'; btn.classList.add('added'); }
  showToast((entry.type === 'magic' ? entry.item.name : entry.name) + ' added to inventory ✦');
}

function lootAddAllToInventory() {
  if (!_lootLastResult) return;
  lootAddCoinsToSheet();
  _lootLastResult.items.forEach((_, idx) => lootAddItemToInventory(idx));
  showToast('All loot added to inventory & purse ✦');
}

function renderLootHistory() {
  const el = document.getElementById('lootHistory');
  if (!el) return;
  const hist = data.lootHistory || [];
  if (!hist.length) { el.innerHTML = '<div style="color:var(--text-muted);padding:8px 0;">No loot generated yet.</div>'; return; }
  el.innerHTML = hist.map(h => `
    <div class="loot-hist-entry">
      <span style="color:var(--accent-gold);font-family:Cinzel,serif;font-size:10px;">${h.summary}</span><br>
      <span style="font-size:12px;">${(h.items||[]).join(', ') || '—'}</span>
    </div>`).join('');
}

// ── CONCENTRATION TRACKER ──
function toggleConcentration() {
  data.concentrating = !data.concentrating;
  if (!data.concentrating) { data.concSpell = ''; }
  // Sync HUD concentration state
  if (!data.concentration) data.concentration = { active: false, spell: '' };
  data.concentration.active = data.concentrating;
  data.concentration.spell  = data.concSpell || '';
  // Sync Concentrating condition chip
  if (!data.conditions) data.conditions = {};
  data.conditions['Concentrating'] = data.concentrating;
  renderConcentration();
  // Refresh HUD if open
  if (typeof renderCombatHud === 'function') renderCombatHud();
  autoSave();
}

function editConcSpell() {
  const name = prompt('Spell name (or leave blank to clear):', data.concSpell || '');
  if (name === null) return;
  data.concSpell = name.trim();
  if (data.concSpell) data.concentrating = true;
  // Sync HUD concentration state
  if (!data.concentration) data.concentration = { active: false, spell: '' };
  data.concentration.active = data.concentrating;
  data.concentration.spell  = data.concSpell || '';
  if (!data.conditions) data.conditions = {};
  data.conditions['Concentrating'] = data.concentrating;
  renderConcentration();
  if (typeof renderCombatHud === 'function') renderCombatHud();
  autoSave();
}

function renderConcentration() {
  const btn = document.getElementById('concToggleBtn');
  const nameEl = document.getElementById('concSpellName');
  if (btn) {
    btn.textContent = data.concentrating ? 'ON' : 'OFF';
    btn.style.borderColor = data.concentrating ? '#c08030' : 'var(--border-dark)';
    btn.style.background = data.concentrating ? 'rgba(200,120,30,0.15)' : 'var(--bg-card)';
    btn.style.color = data.concentrating ? '#e0a040' : 'var(--text-muted)';
  }
  if (nameEl) {
    nameEl.textContent = data.concSpell || (data.concentrating ? '— click to name spell —' : '— not concentrating —');
    nameEl.style.color = data.concentrating ? 'var(--accent-gold-bright)' : 'var(--text-muted)';
    nameEl.style.fontStyle = data.concSpell ? 'normal' : 'italic';
  }
}

function initJackOfAllTrades() {
  const jEl = document.getElementById('jackOfAllTrades');
  if (jEl) jEl.checked = !!data.jackOfAllTrades;
  const lEl = document.getElementById('hasLucky');
  if (lEl) lEl.checked = !!data.hasLucky;
}

function initAll() {
  populateForm();
  updateHitDiceRemaining();
  buildSaves();
  buildSkills();
  buildResistances();
  renderWeapons();
  renderArmor();
  renderInventory();
  renderMagicItems();
  renderTrackers();
  buildSpellSlots();
  renderSpells();
  renderFeatures();
  renderNPCs();
  renderQuests();
  renderPlayerNotes();
  renderJournal();
  renderGeneralNotes();
  renderLoreNotes();
  renderDiceHistory();
  updateMods();
  updateSpellStats();
  calcGP();
  // Prayers
  renderPrayers();
  // Food/Water/Rest — rationNotes still a textarea
  const rationNotes = document.getElementById('rationNotes');
  if (rationNotes && data.rationNotes !== undefined) rationNotes.value = data.rationNotes;
  const lastLR = document.getElementById('lastLongRest');
  if (lastLR && data.lastLongRest !== undefined) lastLR.value = data.lastLongRest;
  const drLastLR = document.getElementById('drLastLongRest');
  if (drLastLR && data.lastLongRest !== undefined) drLastLR.value = data.lastLongRest;
  const restNotes = document.getElementById('restNotes');
  if (restNotes && data.restNotes !== undefined) restNotes.value = data.restNotes;
  (data.shortRests||[]).forEach((v,i)=>{
    const el=document.getElementById('shortRest'+i);
    if(el) el.classList.toggle('used',v);
  });
  // Time & Calendar
  initTimeData();
  updateClock();
  updateCalendar();
  // Battle tracker
  initBattle();
  renderBattle();
  // Restore attune names
  for (let i=0;i<3;i++) {
    const nameEl = document.getElementById('attuneName'+i);
    if (nameEl && data.attuneName) nameEl.value = data.attuneName[i]||'';
    nameEl && nameEl.addEventListener('input', (e)=>{ data.attuneName = data.attuneName||['','','']; data.attuneName[i]=e.target.value; autoSave(); });
  }
  // Init Combat HUD data
  if (!data.hudConsumables) data.hudConsumables = [];
  // Food/water bars
  updateFoodBar();
  syncFoodFromInventory();
}

// Hook currency calcGP on input
document.addEventListener('input', e => {
  if (['cp','sp','ep','gp','pp'].includes(e.target.id)) calcGP();
});

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});


// ═══════════════════════════════════════════
//  PRAYERS
// ═══════════════════════════════════════════
function addPrayer() {
  data.prayers = data.prayers || [];
  data.prayers.push({name:'', deity:'', time:'Dawn', desc:'', done:false, open:true});
  renderPrayers();
  // auto-open the new card
  const cards = document.querySelectorAll('.prayer-card');
  if (cards.length) cards[cards.length-1].querySelector('.prayer-card-body')?.classList.add('open');
}

function togglePrayerDone(i) {
  data.prayers[i].done = !data.prayers[i].done;
  if (data.prayers[i].done) {
    const pName = data.prayers[i].name || 'Prayer';
    _autoLog('🙏 Prayer completed: ' + pName, 'Other');
  }
  autoSave();
  renderPrayers();
}

function togglePrayerCollapse(i) {
  data.prayers[i]._open = !data.prayers[i]._open;
  renderPrayers();
}

function renderPrayers() {
  const container = document.getElementById('prayersList');
  if (!container) return;
  container.innerHTML = '';
  const prayers = data.prayers || [];
  if (!prayers.length) {
    container.innerHTML = `<div style="text-align:center;padding:18px;color:var(--text-muted);font-style:italic;font-size:14px;">No prayers or rituals added yet</div>`;
    return;
  }
  prayers.forEach((p, i) => {
    const isOpen = p._open !== false; // default open
    const isDone = !!p.done;
    const timeOptions = ['Dawn','Dusk','Midday','Midnight','Any','Long Rest','Short Rest'];
    const div = document.createElement('div');
    div.className = 'prayer-card' + (isDone ? ' done-card' : '');
    div.innerHTML = `
      <div class="prayer-card-header" onclick="togglePrayerCard(${i}, event)">
        <input type="checkbox" class="prayer-done-toggle"
          ${isDone ? 'checked' : ''}
          onclick="event.stopPropagation();togglePrayerDone(${i})"
          title="Mark as done">
        <span class="prayer-name-display ${isDone ? 'done-name' : ''}">${p.name || '<em style="color:var(--text-muted)">Unnamed ritual</em>'}</span>
        ${p.deity ? `<span class="prayer-deity-badge" title="Deity / Source">⚜ ${p.deity}</span>` : ''}
        ${p.time ? `<span class="prayer-time-badge">⏱ ${p.time}</span>` : ''}
        <span class="prayer-collapse-arrow ${isOpen ? 'open' : ''}">▼</span>
      </div>
      <div class="prayer-card-body ${isOpen ? 'open' : ''}">
        <div class="prayer-field-row">
          <input type="text" value="${p.name||''}" placeholder="Prayer / ritual name…"
            style="flex:2;font-family:'IM Fell English',serif;font-size:15px;"
            oninput="data.prayers[${i}].name=this.value;autoSave();"
            onblur="renderPrayers()">
          <input type="text" value="${p.deity||''}" placeholder="Deity / Source"
            style="flex:1;"
            oninput="data.prayers[${i}].deity=this.value;autoSave();"
            onblur="renderPrayers()">
          <select onchange="data.prayers[${i}].time=this.value;autoSave();renderPrayers()">
            ${timeOptions.map(t=>`<option ${p.time===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <textarea placeholder="Prayer text, ritual steps, description…"
          oninput="data.prayers[${i}].desc=this.value;autoSave()">${p.desc||''}</textarea>
        <div class="prayer-card-actions">
          <button class="prayer-del-btn" onclick="data.prayers.splice(${i},1);renderPrayers();autoSave()">🗑 Delete</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function togglePrayerCard(i, event) {
  if (event && event.target.classList.contains('prayer-done-toggle')) return;
  data.prayers[i]._open = data.prayers[i]._open === false ? true : false;
  renderPrayers();
}

function refreshPrayerHeader(i) {
  // lightweight re-render just the header text without full re-render
  renderPrayers();
}

function consumeResource(type) {
  // legacy — keep for compatibility
  const cur = document.getElementById(type+'Current');
  if (cur) { cur.value = Math.max(0, (parseFloat(cur.value)||0) - 1); autoSave(); }
}

// ─── FOOD KEYWORDS (same as inventory filter) ───
const FOOD_KEYWORDS = ['food','ration','bread','meat','fish','fruit','berry','meal','provision','sustenance','jerky','cheese','apple','herb','mushroom','nut','grain','vegetable','dried','smoked','salted'];
const WATER_KEYWORDS = ['water','waterskin','flask','canteen','jug','barrel','gallon','potion of water'];
const DRINK_KEYWORDS = ['drink','ale','wine','mead','beer','juice','milk','tea','coffee','spirits','stout','cider','beverage'];

function getFoodItemsFromInventory() {
  return (data.inventory || []).filter(item => {
    const txt = (item.name + ' ' + (item.notes||'')).toLowerCase();
    return FOOD_KEYWORDS.some(k => txt.includes(k));
  });
}

function syncFoodFromInventory() {
  const foodItems = getFoodItemsFromInventory();

  // Count food
  const totalFood = foodItems.reduce((sum, item) => sum + Math.max(0, parseFloat(item.qty)||1), 0);
  data.foodCurrent = totalFood;

  // Count water/drinks from inventory — water items override, drink items add to pool
  const allDrinkItems = (data.inventory||[]).filter(item => {
    const txt = (item.name + ' ' + (item.notes||'')).toLowerCase();
    return WATER_KEYWORDS.some(k => txt.includes(k)) || DRINK_KEYWORDS.some(k => txt.includes(k));
  });
  if (allDrinkItems.length > 0) {
    const totalWater = allDrinkItems.reduce((sum, item) => {
      const txt = (item.name||'').toLowerCase();
      const qty = Math.max(0, parseFloat(item.qty)||1);
      // Capacity estimates: barrel=20gal, jug/pitcher=1gal, waterskin/flask=0.5gal, cup/mug=0.125gal, bottle=0.25gal, default drink=0.25gal
      const unit = txt.includes('barrel') ? 20
                 : txt.includes('jug') || txt.includes('pitcher') ? 1
                 : txt.includes('waterskin') ? 0.5
                 : txt.includes('flask') || txt.includes('canteen') ? 0.5
                 : txt.includes('bottle') ? 0.25
                 : txt.includes('mug') || txt.includes('gallon') ? 1
                 : txt.includes('cup') ? 0.125
                 : 0.25;  // default for ale, wine, tea, milk etc
      return sum + qty * unit;
    }, 0);
    data.waterCurrent = Math.round(totalWater * 100) / 100;
  }

  updateFoodBar();
  autoSave();
}

function updateFoodBar() {
  const food = data.foodCurrent ?? 0;
  const water = data.waterCurrent ?? 0;

  // Update displays (now divs, not inputs)
  const fEl = document.getElementById('foodCurrent');
  if (fEl) {
    fEl.textContent = Math.floor(food);
    fEl.style.color = food <= 0 ? '#cc3030' : food <= 3 ? '#c09030' : '#80cc50';
  }
  const wEl = document.getElementById('waterCurrent');
  if (wEl) {
    wEl.textContent = Number.isInteger(water) ? water : water.toFixed(1);
    wEl.style.color = water <= 0 ? '#cc3030' : water <= 1 ? '#c09030' : '#50a0d0';
  }

  const fStatus = document.getElementById('foodStatus');
  if (fStatus) {
    fStatus.textContent = food <= 0 ? '⚠️ No food!' : food <= 3 ? `⚠️ Low — ~${Math.floor(food/3)} day(s)` : `✓ ~${Math.floor(food/3)} days`;
    fStatus.style.color = food <= 0 ? '#cc3030' : food <= 3 ? '#c09030' : '#6a9a40';
  }
  const wStatus = document.getElementById('waterStatus');
  if (wStatus) {
    wStatus.textContent = water <= 0 ? '⚠️ No water!' : water <= 1 ? `⚠️ Low — ~${Math.floor(water)} day(s)` : `✓ ~${Math.floor(water)} days`;
    wStatus.style.color = water <= 0 ? '#cc3030' : water <= 1 ? '#c09030' : '#4090b0';
  }
}

function _changeFood(amount) {
  data.foodCurrent = Math.max(0, (parseFloat(data.foodCurrent)||0) + amount);
  if (amount < 0) {
    let toConsume = Math.abs(amount);
    const foodItems = getFoodItemsFromInventory();
    for (const item of foodItems) {
      if (toConsume <= 0) break;
      const qty = parseFloat(item.qty) || 1;
      const take = Math.min(qty, toConsume);
      item.qty = Math.max(0, qty - take);
      toConsume -= take;
    }
    data.inventory = (data.inventory||[]).filter(item =>
      (parseFloat(item.qty)||0) > 0 || !FOOD_KEYWORDS.some(k => (item.name+' '+(item.notes||'')).toLowerCase().includes(k))
    );
    renderInventory();
  }
  updateFoodBar();
  autoSave();
}

function _changeWater(amount) {
  data.waterCurrent = Math.max(0, Math.round(((parseFloat(data.waterCurrent)||0) + amount) * 100) / 100);
  // Remove drink items from inventory proportionally (same logic as food)
  if (amount < 0) {
    let toRemove = Math.abs(amount);
    const drinkItems = (data.inventory||[]).filter(item => {
      const txt = (item.name + ' ' + (item.notes||'')).toLowerCase();
      return WATER_KEYWORDS.some(k => txt.includes(k)) || DRINK_KEYWORDS.some(k => txt.includes(k));
    });
    for (const item of drinkItems) {
      if (toRemove <= 0) break;
      const txt = (item.name||'').toLowerCase();
      const unit = txt.includes('barrel') ? 20 : txt.includes('jug')||txt.includes('pitcher') ? 1
                 : txt.includes('waterskin')||txt.includes('flask')||txt.includes('canteen') ? 0.5
                 : txt.includes('bottle') ? 0.25 : txt.includes('mug')||txt.includes('gallon') ? 1
                 : txt.includes('cup') ? 0.125 : 0.25;
      const qty = parseFloat(item.qty)||1;
      if (qty * unit <= toRemove) {
        toRemove -= qty * unit;
        item.qty = 0;
      } else {
        item.qty = Math.max(0, qty - toRemove / unit);
        toRemove = 0;
      }
    }
    data.inventory = (data.inventory||[]).filter(item => {
      if ((parseFloat(item.qty)||0) > 0) return true;
      const txt = (item.name + ' ' + (item.notes||'')).toLowerCase();
      return !(WATER_KEYWORDS.some(k => txt.includes(k)) || DRINK_KEYWORDS.some(k => txt.includes(k)));
    });
    renderInventory();
  }
  updateFoodBar();
  autoSave();
}

function consumeFullDay() {
  // Full day: breakfast + lunch + dinner = 3 food, 1 gallon water
  _changeFood(-3);
  _changeWater(-1);
  _autoLog('🌅 Full day consumed: −3 food, −1 water', 'Other');
  showToast('Full day consumed: −3 food, −1 water ✦');
}

function consumeOneMeal() {
  _changeFood(-1);
  _autoLog('🍽️ One meal consumed: −1 food', 'Other');
  showToast('One meal consumed: −1 food ✦');
}

function consumeDrink() {
  // One drink = 1/3 gallon
  _changeWater(-1/3);
  showToast('Drank: −⅓ gallon of water ✦');
}

// _autoLog is defined in calendar.js (with visibility check + immediate localStorage persist)

function toggleShortRest(idx) {
  data.shortRests = data.shortRests || [false, false, false, false, false];
  // Extend array if needed
  while (data.shortRests.length < 5) data.shortRests.push(false);
  data.shortRests[idx] = !data.shortRests[idx];
  const el = document.getElementById('shortRest'+idx);
  if (el) el.classList.toggle('used', data.shortRests[idx]);
  if (data.shortRests[idx]) {
    _autoLog('☕ Short Rest #' + (idx+1) + ' taken', 'Rest');
  }
  autoSave();
}

function doLongRest() {
  data.shortRests = [false, false, false, false, false];
  for (let i = 0; i < 5; i++) document.getElementById('shortRest'+i)?.classList.remove('used');
  const now = getTimeStr();
  document.getElementById('lastLongRest').value = now;
  data.lastLongRest = now;
  // Sync floating panel
  const drLlr = document.getElementById('drLastLongRest');
  if (drLlr) drLlr.value = now;
  if (typeof drSyncRestPips === 'function') drSyncRestPips();
  // Restore HP to max + clear temp HP
  data.hpCurrent = parseInt(data.hpMax) || 0;
  data.hpTemp = 0;
  const curEl = document.getElementById('hpCurrent'); if (curEl) curEl.value = data.hpCurrent;
  const tmpEl = document.getElementById('hpTemp');    if (tmpEl) tmpEl.value = 0;
  // Restore hit dice per DnD 5e rules:
  //   - Regain floor(level / 2) dice, minimum 1
  //   - hitDiceUsed cannot go below 0 (i.e. available cannot exceed max = level)
  const hdMax = parseInt(data.charLevel) || 1;
  const hdRestore = Math.max(1, Math.floor(hdMax / 2));
  data.hitDiceUsed = Math.max(0, (parseInt(data.hitDiceUsed) || 0) - hdRestore);
  // Sync the input field on the sheet if it exists
  const hdUsedEl = document.getElementById('hitDiceUsed');
  if (hdUsedEl) hdUsedEl.value = data.hitDiceUsed;
  // Redraw the hit dice remaining display immediately (no page refresh needed)
  if (typeof updateHitDiceRemaining === 'function') updateHitDiceRemaining();
  // Clear death saves
  data.deathSuccesses = [false,false,false];
  data.deathFailures  = [false,false,false];
  if (typeof renderDeathSaves === 'function') renderDeathSaves();
  // Reset prayers
  (data.prayers||[]).forEach(p => { p.pips = []; });
  if (typeof renderPrayers === 'function') renderPrayers();
  // Reset spell slots used
  for (let lvl=1;lvl<=9;lvl++) { if(data.spellSlots[lvl]) data.spellSlots[lvl].used=0; }
  buildSpellSlots();
  // Refresh Combat HUD so spell slots + HP update immediately
  if (typeof renderCombatHud === 'function') renderCombatHud();
  // Sync floating REST panel pips
  if (typeof drSyncRestPips === 'function') drSyncRestPips();
  // Sync floating TIME panel
  const _drTime = document.getElementById('drContentTime');
  if (_drTime && _drTime.classList.contains('active') && typeof renderTimeTab === 'function') renderTimeTab();
  _autoLog('🌙 Long Rest taken — HP & spell slots restored', 'Rest');
  showToast('Long Rest taken — HP & spell slots restored ✦');
  autoSave();
}

// ═══════════════════════════════════════════
