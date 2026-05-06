// ═══════════════════════════════════════════
//  companions.js - PLAYER BESTIARY, COMPANIONS
// ═══════════════════════════════════════════

//  COMPANIONS
// ═══════════════════════════════════════════

const COMP_TYPE_META = {
  'Pet':            { icon:'🐾', color:'#4a7a3a', border:'#6aaa5a' },
  'Familiar':       { icon:'🔮', color:'#3a3a7a', border:'#6a6aaa' },
  'Animal Companion':{ icon:'🦅', color:'#7a5a2a', border:'#c8962a' },
  'Summon':         { icon:'✨', color:'#5a2a6a', border:'#aa5aca' },
  'Mount':          { icon:'🐴', color:'#6a4a1a', border:'#b07a3a' },
  'Undead Thrall':  { icon:'💀', color:'#2a3a2a', border:'#557055' },
  'Construct':      { icon:'⚙️', color:'#3a3a3a', border:'#707070' },
  'Other':          { icon:'❓', color:'#4a3a22', border:'#8a6a28' },
};

const COMP_STATUS_META = {
  'Active':     { icon:'✅', color:'#5aaa5a' },
  'Dismissed':  { icon:'💤', color:'#707070' },
  'Injured':    { icon:'🩹', color:'#e09020' },
  'Dead':       { icon:'💀', color:'#aa4444' },
  'Unknown':    { icon:'❓', color:'#888888' },
};

function addCompanion() {
  data.companions = data.companions || [];
  data.companions.unshift({
    name: '', type: 'Pet', status: 'Active',
    hpCurrent: 10, hpMax: 10,
    ac: 0, speed: 30, initiative: 0,
    str: 10, dex: 10, con: 10, int: 3, wis: 10, cha: 7,
    cr: '', size: 'Medium',
    attacks: '', abilities: '', conditions: '', notes: '',
    _open: true
  });
  autoSave();
  renderCompanions();
  setTimeout(() => {
    const cards = document.querySelectorAll('.comp-card');
    if (cards.length) cards[0].querySelector('input')?.focus();
  }, 80);
}

function deleteCompanion(idx) {
  data.companions = data.companions || [];
  data.companions.splice(idx, 1);
  autoSave();
  renderCompanions();
}

function toggleCompCard(headerEl) {
  const card = headerEl.closest('.comp-card');
  const isOpen = !card.classList.contains('expanded');
  card.classList.toggle('expanded', isOpen);
  const idx = parseInt(card.dataset.idx);
  if (!isNaN(idx) && data.companions && data.companions[idx]) {
    data.companions[idx]._open = isOpen;
  }
}

function compUpdate(idx, field, value) {
  data.companions = data.companions || [];
  if (!data.companions[idx]) return;
  data.companions[idx][field] = value;
  autoSave();

  // For name changes, only update header text (no full re-render)
  if (field === 'name') {
    const card = document.querySelector('.comp-card[data-idx="' + idx + '"]');
    if (card) {
      const nameEl = card.querySelector('.comp-header-name');
      if (nameEl) nameEl.innerHTML = value || '<em style="color:var(--text-muted);font-size:15px;">Unnamed Companion</em>';
    }
    return;
  }

  // For HP changes, update all bars + display without full re-render
  if (field === 'hpCurrent' || field === 'hpMax') {
    const card = document.querySelector('.comp-card[data-idx="' + idx + '"]');
    if (card) {
      const comp = data.companions[idx];
      const pct = comp.hpMax > 0 ? Math.max(0, Math.min(100, (comp.hpCurrent / comp.hpMax) * 100)) : 0;
      const barColor = pct > 60 ? '#5aaa5a' : pct > 25 ? '#e09020' : '#cc3333';
      const barEls = card.querySelectorAll('.comp-hp-bar');
      barEls.forEach(barEl => {
        barEl.style.width = pct + '%';
        barEl.style.background = barColor;
      });
      const hpTextEls = card.querySelectorAll('.comp-hp-text');
      hpTextEls.forEach(el => el.textContent = (parseInt(comp.hpCurrent)||0) + ' / ' + (parseInt(comp.hpMax)||0));
    }
    return;
  }

  // For ability score changes, update the modifier display without full re-render
  const abilityKeys = ['str','dex','con','int','wis','cha'];
  if (abilityKeys.includes(field)) {
    const card = document.querySelector('.comp-card[data-idx="' + idx + '"]');
    if (card) {
      const comp = data.companions[idx];
      // Find the stat box for this ability
      const statBoxes = card.querySelectorAll('.comp-stat-box');
      const labelMap = {str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};
      statBoxes.forEach(box => {
        const lbl = box.querySelector('.stat-lbl');
        if (lbl && lbl.textContent.trim() === labelMap[field]) {
          const modEl = box.querySelectorAll('.stat-lbl')[1];
          if (modEl) {
            const score = parseInt(value) || 10;
            const m = Math.floor(score / 2) - 5;
            modEl.textContent = (m >= 0 ? '+' : '') + m;
          }
        }
      });
    }
    return;
  }

  // For type/status changes, re-render
  if (field === 'type' || field === 'status') {
    renderCompanions();
  }
}

function compHpChange(idx, delta) {
  data.companions = data.companions || [];
  if (!data.companions[idx]) return;
  const comp = data.companions[idx];
  comp.hpCurrent = Math.max(0, Math.min(comp.hpMax, (parseInt(comp.hpCurrent) || 0) + delta));
  autoSave();

  const card = document.querySelector('.comp-card[data-idx="' + idx + '"]');
  if (card) {
    const pct = comp.hpMax > 0 ? Math.max(0, Math.min(100, (comp.hpCurrent / comp.hpMax) * 100)) : 0;
    const barColor = pct > 60 ? '#5aaa5a' : pct > 25 ? '#e09020' : '#cc3333';
    const barEls = card.querySelectorAll('.comp-hp-bar');
    barEls.forEach(barEl => {
      barEl.style.width = pct + '%';
      barEl.style.background = barColor;
    });
    const hpTextEls = card.querySelectorAll('.comp-hp-text');
    hpTextEls.forEach(el => el.textContent = (parseInt(comp.hpCurrent)||0) + ' / ' + (parseInt(comp.hpMax)||0));
    const hpInput = card.querySelector('.comp-hp-input-cur');
    if (hpInput) hpInput.value = comp.hpCurrent;
  }
}

function compField(idx, field, value, placeholder, rows) {
  if (rows) {
    return `<div class="field"><label>${placeholder}</label><textarea rows="${rows}" placeholder="${placeholder}…" oninput="compUpdate(${idx},'${field}',this.value)">${value||''}</textarea></div>`;
  }
  return `<div class="field"><label>${placeholder}</label><input type="text" value="${(value||'').replace(/"/g,'&quot;')}" placeholder="${placeholder}…" oninput="compUpdate(${idx},'${field}',this.value)"></div>`;
}

function modStr(score) {
  const m = Math.floor((parseInt(score)||10) / 2) - 5;
  return (m >= 0 ? '+' : '') + m;
}

function renderCompanions() {
  const container = document.getElementById('compList');
  const countEl = document.getElementById('compCount');
  if (!container) return;
  data.companions = data.companions || [];

  if (countEl) countEl.textContent = `— ${data.companions.length} COMPANION${data.companions.length === 1 ? '' : 'S'} —`;

  if (data.companions.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;">No companions yet — add your first!</div>`;
    return;
  }

  const search = (document.getElementById('compSearch')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('compTypeFilter')?.value || '';
  const statusFilter = document.getElementById('compStatusFilter')?.value || '';

  const filtered = data.companions.map((c, i) => ({ c, i })).filter(({ c }) => {
    if (typeFilter && c.type !== typeFilter) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (search) {
      const hay = [c.name, c.type, c.status, c.size, c.attacks, c.abilities, c.conditions, c.notes].join(' ').toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  if (countEl) countEl.textContent = `— ${filtered.length} of ${data.companions.length} COMPANION${data.companions.length === 1 ? '' : 'S'} —`;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;">${data.companions.length === 0 ? 'No companions yet — add your first!' : 'No results match this filter.'}</div>`;
    return;
  }

  const TYPE_LIST = ['Pet','Familiar','Animal Companion','Summon','Mount','Undead Thrall','Construct','Other'];
  const STATUS_LIST = ['Active','Dismissed','Injured','Dead','Unknown'];
  const SIZE_LIST = ['Tiny','Small','Medium','Large','Huge','Gargantuan'];
  const ABILITY_LIST = [['STR','str'],['DEX','dex'],['CON','con'],['INT','int'],['WIS','wis'],['CHA','cha']];

  container.innerHTML = '';

  filtered.forEach(({ c, i }) => {
    const tm = COMP_TYPE_META[c.type] || COMP_TYPE_META['Other'];
    const sm = COMP_STATUS_META[c.status] || COMP_STATUS_META['Unknown'];
    const pct = c.hpMax > 0 ? Math.max(0, Math.min(100, ((parseInt(c.hpCurrent)||0) / (parseInt(c.hpMax)||1)) * 100)) : 0;
    const barColor = pct > 60 ? '#5aaa5a' : pct > 25 ? '#e09020' : '#cc3333';

    const typeOpts = TYPE_LIST.map(t => `<option value="${t}"${c.type===t?' selected':''}>${COMP_TYPE_META[t]?.icon||'❓'} ${t}</option>`).join('');
    const statusOpts = STATUS_LIST.map(s => `<option value="${s}"${c.status===s?' selected':''}>${COMP_STATUS_META[s]?.icon||'❓'} ${s}</option>`).join('');
    const sizeOpts = SIZE_LIST.map(s => `<option value="${s}"${c.size===s?' selected':''}>${s}</option>`).join('');

    const abilityBoxes = ABILITY_LIST.map(([lbl, key]) => `
      <div class="comp-stat-box">
        <div class="stat-lbl">${lbl}</div>
        <input type="number" min="1" max="30" value="${c[key]||10}"
          style="width:100%;text-align:center;background:transparent;border:none;font-family:'Cinzel',serif;font-size:18px;font-weight:700;color:var(--text-primary);padding:0;"
          oninput="compUpdate(${i},'${key}',this.value)">
        <div class="stat-lbl" style="color:var(--accent-gold);">${modStr(c[key]||10)}</div>
      </div>`).join('');

    const div = document.createElement('div');
    div.className = 'comp-card' + (c._open ? ' expanded' : '');
    div.dataset.idx = i;
    div.style.borderLeftColor = tm.border;

    div.innerHTML = `
      <div class="comp-card-header" onclick="toggleCompCard(this)">
        <span class="comp-chevron">▶</span>
        <div style="font-size:22px;line-height:1;">${tm.icon}</div>
        <div style="flex:1;min-width:0;">
          <div class="comp-header-name" style="font-family:'IM Fell English',serif;font-size:18px;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.name||'<em style="color:var(--text-muted);font-size:17px;">Unnamed Companion</em>'}</div>
          <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);margin-top:1px;letter-spacing:0.5px;">${c.type} · ${c.size||'Medium'}</div>
        </div>
        <!-- HP mini bar in header -->
        <div style="display:flex;flex-direction:column;align-items:flex-end;min-width:90px;gap:3px;">
          <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-muted);">❤️ <span class="comp-hp-text">${parseInt(c.hpCurrent)||0} / ${parseInt(c.hpMax)||0}</span></div>
          <div class="comp-hp-bar-wrap" style="width:90px;">
            <div class="comp-hp-bar" style="width:${pct}%;background:${barColor};"></div>
          </div>
        </div>
        <span class="comp-type-tag" style="color:${sm.color};border-color:${sm.color}66;background:${sm.color}18;">${sm.icon} ${c.status}</span>
        <!-- Collapsed quick-HP buttons -->
        <div class="comp-collapsed-hp-btns" onclick="event.stopPropagation()" style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;">
          <button class="comp-hp-btn comp-hp-btn-death" style="font-size:12px;padding:3px 6px;" onclick="compHpChange(${i}, -(data.companions[${i}].hpMax+999))" title="HP na 0 (Smrť)">💀</button>
          <button class="comp-hp-btn comp-hp-btn-dmg" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},-1)" title="-1 HP">−1</button>
          <button class="comp-hp-btn comp-hp-btn-dmg" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},-5)" title="-5 HP">−5</button>
          <button class="comp-hp-btn comp-hp-btn-dmg" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},-10)" title="-10 HP">−10</button>
          <button class="comp-hp-btn comp-hp-btn-dmg" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},-25)" title="-25 HP">−25</button>
          <button class="comp-hp-btn comp-hp-btn-dmg" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},-50)" title="-50 HP">−50</button>
          <button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},1)" title="+1 HP">+1</button>
          <button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},5)" title="+5 HP">+5</button>
          <button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},10)" title="+10 HP">+10</button>
          <button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},25)" title="+25 HP">+25</button>
          <button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:3px 6px;" onclick="compHpChange(${i},50)" title="+50 HP">+50</button>
          <button class="comp-hp-btn comp-hp-btn-full" style="font-size:9px;padding:3px 5px;" onclick="compHpChange(${i}, data.companions[${i}].hpMax+999)" title="Plné HP">FULL</button>
        </div>
        <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();deleteCompanion(${i})">🗑</button>
      </div>

      <div class="comp-card-body" onclick="event.stopPropagation()">

        <!-- Row 1: Name + Classification -->
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;margin-top:14px;">
          <div class="field" style="margin:0;">
            <label>Companion Name</label>
            <input type="text" value="${(c.name||'').replace(/"/g,'&quot;')}" placeholder="Name…" style="font-family:'IM Fell English',serif;font-size:17px;" oninput="compUpdate(${i},'name',this.value)">
          </div>
          <div class="field" style="margin:0;">
            <label>Type</label>
            <select onchange="compUpdate(${i},'type',this.value)">${typeOpts}</select>
          </div>
          <div class="field" style="margin:0;">
            <label>Size</label>
            <select onchange="compUpdate(${i},'size',this.value)">${sizeOpts}</select>
          </div>
          <div class="field" style="margin:0;">
            <label>Status</label>
            <select onchange="compUpdate(${i},'status',this.value)">${statusOpts}</select>
          </div>
        </div>

        <!-- HP Tracker Section -->
        <div style="background:var(--bg-panel);border:1px solid var(--border-dark);border-radius:8px;padding:14px;margin-top:14px;">
          <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:10px;">❤️ HIT POINTS</div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:space-between;">
            <!-- Left: Damage buttons -->
            <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
              <button class="comp-hp-btn comp-hp-btn-death" title="Set HP to 0 (Death)" onclick="compHpChange(${i}, -(data.companions[${i}].hpMax+999))">💀</button>
              <button class="comp-hp-btn comp-hp-btn-dmg" onclick="compHpChange(${i},-1)">−1</button>
              <button class="comp-hp-btn comp-hp-btn-dmg" onclick="compHpChange(${i},-5)">−5</button>
              <button class="comp-hp-btn comp-hp-btn-dmg" onclick="compHpChange(${i},-10)">−10</button>
              <button class="comp-hp-btn comp-hp-btn-dmg" onclick="compHpChange(${i},-25)">−25</button>
              <button class="comp-hp-btn comp-hp-btn-dmg" onclick="compHpChange(${i},-50)">−50</button>
            </div>
            <!-- Center: HP inputs -->
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
              <input type="number" class="comp-hp-input-cur" value="${parseInt(c.hpCurrent)||0}" min="0"
                style="width:64px;text-align:center;font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:var(--text-primary);background:var(--bg-card);border:1px solid var(--border-gold);border-radius:6px;padding:4px;"
                oninput="compUpdate(${i},'hpCurrent',parseInt(this.value)||0)">
              <span style="font-family:'Cinzel',serif;font-size:16px;color:var(--text-muted);">/</span>
              <input type="number" value="${parseInt(c.hpMax)||0}" min="0"
                style="width:64px;text-align:center;font-family:'Cinzel',serif;font-size:16px;color:var(--text-secondary);background:var(--bg-card);border:1px solid var(--border-dark);border-radius:6px;padding:4px;"
                oninput="compUpdate(${i},'hpMax',parseInt(this.value)||0)">
              <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:1px;">MAX</span>
            </div>
            <!-- Right: Heal buttons -->
            <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
              <button class="comp-hp-btn comp-hp-btn-heal" onclick="compHpChange(${i},1)">+1</button>
              <button class="comp-hp-btn comp-hp-btn-heal" onclick="compHpChange(${i},5)">+5</button>
              <button class="comp-hp-btn comp-hp-btn-heal" onclick="compHpChange(${i},10)">+10</button>
              <button class="comp-hp-btn comp-hp-btn-heal" onclick="compHpChange(${i},25)">+25</button>
              <button class="comp-hp-btn comp-hp-btn-heal" onclick="compHpChange(${i},50)">+50</button>
              <button class="comp-hp-btn comp-hp-btn-full" onclick="compHpChange(${i}, data.companions[${i}].hpMax+999)">FULL</button>
            </div>
          </div>
          <div class="comp-hp-bar-wrap" style="margin-top:10px;height:10px;">
            <div class="comp-hp-bar" style="width:${pct}%;background:${barColor};"></div>
          </div>
        </div>

        <!-- Combat Stats Row -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px;">
          <div class="comp-stat-box">
            <div class="stat-lbl">ARMOR CLASS</div>
            <input type="number" value="${c.ac||0}" min="0" max="30"
              style="width:100%;text-align:center;background:transparent;border:none;font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:var(--text-primary);padding:0;"
              oninput="compUpdate(${i},'ac',this.value)">
          </div>
          <div class="comp-stat-box">
            <div class="stat-lbl">SPEED (ft)</div>
            <input type="number" value="${c.speed||30}" min="0" step="5"
              style="width:100%;text-align:center;background:transparent;border:none;font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:var(--text-primary);padding:0;"
              oninput="compUpdate(${i},'speed',this.value)">
          </div>
          <div class="comp-stat-box">
            <div class="stat-lbl">INITIATIVE</div>
            <input type="number" value="${c.initiative||0}" min="-10" max="20"
              style="width:100%;text-align:center;background:transparent;border:none;font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:var(--text-primary);padding:0;"
              oninput="compUpdate(${i},'initiative',this.value)">
          </div>
          <div class="comp-stat-box">
            <div class="stat-lbl">CR / LEVEL</div>
            <input type="text" value="${c.cr||'—'}" placeholder="—"
              style="width:100%;text-align:center;background:transparent;border:none;font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:var(--text-primary);padding:0;"
              oninput="compUpdate(${i},'cr',this.value)">
          </div>
        </div>

        <!-- Ability Scores -->
        <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:2px;margin:14px 0 8px;">⚔ ABILITY SCORES</div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
          ${abilityBoxes}
        </div>

        <!-- Attacks, Abilities, Conditions, Notes -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
          ${compField(i,'attacks',c.attacks,'Attacks & Damage',3)}
          ${compField(i,'abilities',c.abilities,'Special Abilities & Traits',3)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">
          ${compField(i,'conditions',c.conditions,'Active Conditions / Buffs',2)}
          ${compField(i,'notes',c.notes,'Notes & Backstory',2)}
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  // Keep Quick panel in sync
  renderQuickCompanions();
}

// ═══════════════════════════════════════════
