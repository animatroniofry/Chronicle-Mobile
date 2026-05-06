// ═══════════════════════════════════════════
//  rolls.js - QUICK ROLL, MODAL, TOAST, RESET/EXPORT/IMPORT
// ═══════════════════════════════════════════

//  SKILL / SAVE QUICK ROLL
// ═══════════════════════════════════════════
let srAdvMode = 'norm'; // 'norm' | 'adv' | 'dis'
let qrWeaponAdvMode = 'norm'; // 'norm' | 'adv' | 'dis'  — iba pre attack hit v weapon tabe

function qrSetWeaponAdv(mode) {
  qrWeaponAdvMode = mode;
  ['norm','adv','dis'].forEach(m => {
    document.getElementById('qrWpnBtn' + m.charAt(0).toUpperCase() + m.slice(1))
      ?.classList.toggle('sel', m === mode);
  });
}

function qrSwitchTab(tab) {
  ['dice','weapon','skills'].forEach(t => {
    const capT = t.charAt(0).toUpperCase() + t.slice(1);
    document.getElementById('qrTab' + capT)?.classList.toggle('active', t === tab);
    document.getElementById('qrContent' + capT)?.classList.toggle('active', t === tab);
  });
  if (tab === 'skills') renderSkillRollGrid();
}

function drSwitchTab(tab) {
  ['money','time'].forEach(t => {
    const capT = t.charAt(0).toUpperCase() + t.slice(1);
    document.getElementById('drTab' + capT)?.classList.toggle('active', t === tab);
    document.getElementById('drContent' + capT)?.classList.toggle('active', t === tab);
  });
  if (tab === 'money') renderMoneyTab();
  if (tab === 'time') renderTimeTab();
}

function renderQuickCompanions() {
  const container = document.getElementById('qrAlliesList');
  if (!container) return;
  data.companions = data.companions || [];
  const active = data.companions.map((c, i) => ({ c, i })).filter(({ c }) => c.status === 'Active');

  if (active.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;">No active companions.<br>Mark companions as Active<br>in the Companions tab.</div>';
    return;
  }

  container.innerHTML = '';
  active.forEach(({ c, i }) => {
    const tm = COMP_TYPE_META[c.type] || COMP_TYPE_META['Other'];
    const pct = c.hpMax > 0 ? Math.max(0, Math.min(100, ((parseInt(c.hpCurrent)||0) / (parseInt(c.hpMax)||1)) * 100)) : 0;
    const barColor = pct > 60 ? '#5aaa5a' : pct > 25 ? '#e09020' : '#cc3333';
    const notesEsc = (c.notes||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const card = document.createElement('div');
    card.className = 'qr-ally-card';
    card.style.borderLeftColor = tm.border;
    card.dataset.idx = i;
    card.innerHTML =
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
        '<span style="font-size:18px;">' + tm.icon + '</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-family:\'IM Fell English\',serif;font-size:16px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (c.name || '<em style="color:var(--text-muted);font-size:16px;">Unnamed</em>') + '</div>' +
          '<div style="font-family:\'Cinzel\',serif;font-size:9px;color:var(--text-muted);letter-spacing:0.5px;">' + c.type + ' · ' + (c.size||'Medium') + '</div>' +
        '</div>' +
        '<div style="font-family:\'Cinzel\',serif;font-size:11px;color:var(--text-muted);text-align:right;">❤️ <span class="comp-hp-text qr-hp-text">' + (parseInt(c.hpCurrent)||0) + ' / ' + (parseInt(c.hpMax)||0) + '</span></div>' +
      '</div>' +
      '<div class="comp-hp-bar-wrap" style="height:7px;margin-bottom:8px;"><div class="comp-hp-bar qr-hp-bar" style="width:' + pct + '%;background:' + barColor + ';"></div></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px;justify-content:center;">' +
        '<button class="comp-hp-btn comp-hp-btn-death" style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',-(data.companions[' + i + '].hpMax+999))" title="Set HP to 0">💀</button>' +
        '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',-1)">−1</button>' +
        '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',-5)">−5</button>' +
        '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',-10)">−10</button>' +
        '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',-25)">−25</button>' +
        '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',1)">+1</button>' +
        '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',5)">+5</button>' +
        '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',10)">+10</button>' +
        '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="qrCompHp(' + i + ',25)">+25</button>' +
        '<button class="comp-hp-btn comp-hp-btn-full" style="font-size:9px;padding:2px 4px;" onclick="qrCompHp(' + i + ',data.companions[' + i + '].hpMax+999)">FULL</button>' +
      '</div>' +
      '<textarea rows="2" placeholder="Attacks, abilities, notes…" style="width:100%;font-size:11px;resize:vertical;background:var(--bg-panel);border:1px solid var(--border-dark);border-radius:4px;color:var(--text-secondary);padding:4px;font-family:inherit;box-sizing:border-box;" oninput="data.companions[' + i + '].notes=this.value;autoSave()">' + notesEsc + '</textarea>';
    container.appendChild(card);
  });
}

function qrCompHp(idx, delta) {
  compHpChange(idx, delta);
  const qrCard = document.querySelector('#qrAlliesList [data-idx="' + idx + '"]');
  if (qrCard) {
    const comp = data.companions[idx];
    const pct = comp.hpMax > 0 ? Math.max(0, Math.min(100, (comp.hpCurrent / comp.hpMax) * 100)) : 0;
    const barColor = pct > 60 ? '#5aaa5a' : pct > 25 ? '#e09020' : '#cc3333';
    const bar = qrCard.querySelector('.qr-hp-bar');
    if (bar) { bar.style.width = pct + '%'; bar.style.background = barColor; }
    const txt = qrCard.querySelector('.qr-hp-text');
    if (txt) txt.textContent = (parseInt(comp.hpCurrent)||0) + ' / ' + (parseInt(comp.hpMax)||0);
  }
}

function srSetAdv(mode) {
  srAdvMode = mode;
  ['norm','adv','dis'].forEach(m => {
    document.getElementById('srBtn' + m.charAt(0).toUpperCase() + m.slice(1))
      ?.classList.toggle('sel', m === mode);
  });
}

function srGetSkillMod(skillName, attr) {
  const pb = getProfBonus(parseInt(data.charLevel) || 1);
  const base = getMod(data[attr] || 10);
  const prof = data.skillsProf?.[skillName] || 0;
  return base + (prof === 2 ? pb * 2 : prof === 1 ? pb : 0);
}

function srGetSaveMod(attr) {
  const pb = getProfBonus(parseInt(data.charLevel) || 1);
  const base = getMod(data[attr] || 10);
  const hasProf = !!(data.savesProf?.[attr]);
  return base + (hasProf ? pb : 0);
}

function renderSkillRollGrid() {
  const sg = document.getElementById('srSkillGrid');
  const svg2 = document.getElementById('srSaveGrid');
  if (!sg || !svg2) return;

  sg.innerHTML = SKILLS_DEF.map(s => {
    const mod = srGetSkillMod(s.name, s.attr);
    const prof = data.skillsProf?.[s.name] || 0;
    const pipClass = prof === 2 ? 'exp' : prof === 1 ? 'prof' : 'none';
    const modClass = mod > 0 ? 'pos' : mod < 0 ? 'neg' : 'zero';
    return `<div class="sr-skill-btn" onclick="srRoll('${s.name}', ${mod}, '${s.attr}')">
      <div class="sr-prof-pip ${pipClass}"></div>
      <span class="sr-skill-name">${s.name}</span>
      <span class="sr-skill-mod ${modClass}">${fmtMod(mod)}</span>
    </div>`;
  }).join('');

  svg2.innerHTML = SAVES_DEF.map(s => {
    const mod = srGetSaveMod(s.attr);
    const hasProf = !!(data.savesProf?.[s.attr]);
    const pipClass = hasProf ? 'prof' : 'none';
    const modClass = mod > 0 ? 'pos' : mod < 0 ? 'neg' : 'zero';
    return `<div class="sr-skill-btn" onclick="srRoll('${s.name} Save', ${mod}, '${s.attr}', true)">
      <div class="sr-prof-pip ${pipClass}"></div>
      <span class="sr-skill-name">${s.name}</span>
      <span class="sr-skill-mod ${modClass}">${fmtMod(mod)}</span>
    </div>`;
  }).join('');
}

function srRoll(name, mod, attr, isSave) {
  const r1 = Math.ceil(Math.random() * 20);
  const r2 = Math.ceil(Math.random() * 20);
  let die;
  if (srAdvMode === 'adv') die = Math.max(r1, r2);
  else if (srAdvMode === 'dis') die = Math.min(r1, r2);
  else die = r1;
  const total = die + mod;

  const isCrit = die === 20;
  const isFumble = die === 1;
  const color = isCrit ? '#e0c040' : isFumble ? '#cc3030' : total >= 15 ? '#70cc80' : '#e0d0a0';

  let detailParts = [`d20: ${die}`];
  if (srAdvMode === 'adv')   detailParts = [`d20: ${r1} / ${r2} → max ${die}`];
  if (srAdvMode === 'dis')   detailParts = [`d20: ${r1} / ${r2} → min ${die}`];
  if (mod !== 0) detailParts.push(`mod: ${fmtMod(mod)}`);

  let badge = '';
  if (isCrit) badge = ' 🌟 NAT 20!';
  if (isFumble) badge = ' 💀 NAT 1';

  const modeLabel = srAdvMode === 'adv' ? ' (Advantage)' : srAdvMode === 'dis' ? ' (Disadvantage)' : '';

  const box = document.getElementById('srResultBox');
  if (box) {
    box.innerHTML = `
      <div class="sr-result-name">${name.toUpperCase()}${modeLabel}</div>
      <div class="sr-result-total" style="color:${color}">${total}${badge}</div>
      <div class="sr-result-detail">${detailParts.join(' · ')}</div>
    `;
  }

  // Also log to dice history
  data.diceHistory = data.diceHistory || [];
  data.diceHistory.unshift({ die: 'd20', result: die, mod, total, label: name + modeLabel });
  if (data.diceHistory.length > 50) data.diceHistory.pop();
  renderDiceHistory();
  autoSave();
}

// ═══════════════════════════════════════════
//  QUICK ROLL
// ═══════════════════════════════════════════
function toggleQuickRoll() {
  const p = document.getElementById('quickRollPanel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) renderQrPresets();
  repositionPanels();
}

// Quick Roll panel lock state
var quickRollLocked = false;

function toggleQuickRollLock() {
  quickRollLocked = !quickRollLocked;
  const btn = document.getElementById('quickRollLockBtn');
  if (btn) {
    btn.textContent = quickRollLocked ? '🔒' : '🔓';
    btn.title = quickRollLocked ? 'Unlock panel' : 'Lock panel';
    btn.style.opacity = quickRollLocked ? '1' : '0.6';
  }
  repositionPanels();
}

// Close Quick Roll panel when clicking outside (unless locked)
document.addEventListener('click', function(e) {
  const panel = document.getElementById('quickRollPanel');
  const wrapper = document.getElementById('quickRoller');
  if (!panel || !panel.classList.contains('open')) return;
  if (quickRollLocked) return;
  const fab = document.getElementById('fabMenu');
  if (fab && fab.contains(e.target)) return;
  const path = e.composedPath ? e.composedPath() : [];
  const insideWrapper = path.some(function(el) { return el === wrapper; });
  if (!insideWrapper) {
    panel.classList.remove('open');
    repositionPanels();
  }
});

function alliesInitScroll() {
  var list = document.getElementById('alliesQuickList');
  if (!list || list._wi) return;
  list._wi = true;
  list.addEventListener('wheel', function(e) {
    var el = e.target;
    var cb = null;
    while (el && el !== list) {
      if (el.classList && el.classList.contains('allies-card-body')) { cb = el; break; }
      el = el.parentElement;
    }
    if (cb && cb.scrollHeight > cb.clientHeight) {
      var top = cb.scrollTop <= 0 && e.deltaY < 0;
      var bot = cb.scrollTop + cb.clientHeight >= cb.scrollHeight - 1 && e.deltaY > 0;
      if (!top && !bot) {
        e.preventDefault();
        e.stopPropagation();
        cb.scrollTop += e.deltaY;
      }
    }
  }, { passive: false });
}

function toggleAlliesPanel() {
  const p = document.getElementById('alliesPanel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) { renderAlliesPanel(); setTimeout(alliesInitScroll, 50); }
  repositionPanels();
}

// Allies panel lock state
var alliesLocked = false;

function toggleAlliesLock() {
  alliesLocked = !alliesLocked;
  const btn = document.getElementById('alliesLockBtn');
  if (btn) {
    btn.textContent = alliesLocked ? '🔒' : '🔓';
    btn.title = alliesLocked ? 'Unlock panel' : 'Lock panel';
    btn.style.opacity = alliesLocked ? '1' : '0.6';
  }
  repositionPanels();
}

// Close allies panel when clicking outside (unless locked)
document.addEventListener('click', function(e) {
  const panel = document.getElementById('alliesPanel');
  const wrapper = document.getElementById('alliesWrapper');
  if (!panel || !panel.classList.contains('open')) return;
  if (alliesLocked) return;
  const fab = document.getElementById('fabMenu');
  if (fab && fab.contains(e.target)) return;
  // Use composedPath so DOM mutations (e.g. innerHTML re-render in card expand)
  // don't detach e.target before we can check containment
  const path = e.composedPath ? e.composedPath() : [];
  const insideWrapper = path.some(function(el) { return el === wrapper; });
  if (!insideWrapper) {
    panel.classList.remove('open');
    repositionPanels();
  }
});

function renderAlliesPanel() {
  const container = document.getElementById('alliesQuickList');
  if (!container) return;
  data.companions = data.companions || [];
  const active = data.companions.map((c, i) => ({ c, i })).filter(({ c }) => c.status === 'Active');

  if (active.length === 0) {
    container.innerHTML = '<div class="allies-empty">No active companions.<br>Mark companions as Active<br>in the Companions tab.</div>';
    return;
  }

  container.innerHTML = '';
  active.forEach(({ c, i }) => {
    const tm = COMP_TYPE_META[c.type] || COMP_TYPE_META['Other'];
    const pct = c.hpMax > 0 ? Math.max(0, Math.min(100, ((parseInt(c.hpCurrent)||0) / (parseInt(c.hpMax)||1)) * 100)) : 0;
    const barColor = pct > 60 ? '#9060d0' : pct > 25 ? '#b06020' : '#cc3333';
    const notesEsc = (c.notes||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const cardId = 'allies-card-body-' + i;

    const card = document.createElement('div');
    card.className = 'qr-ally-card';
    card.style.cssText = 'border-left:3px solid #7a3ac0;background:linear-gradient(135deg,rgba(60,20,100,0.3),rgba(30,10,60,0.2));padding:0;border-radius:4px;';
    card.dataset.alliesIdx = i;
    card.innerHTML =
      // ── HEADER (always visible, click to toggle) ──
      '<div onclick="alliesToggleCard(this)" style="display:flex;align-items:center;gap:6px;padding:8px 10px;cursor:pointer;user-select:none;" data-card-id="' + cardId + '">' +
        '<span style="font-size:16px;">' + tm.icon + '</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-family:\'IM Fell English\',serif;font-size:16px;color:#d0a0ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (c.name || '<em style="color:#6a4a90;font-size:16px;">Unnamed</em>') + '</div>' +
          '<div style="font-family:\'Cinzel\',serif;font-size:9px;color:#7a5aa0;letter-spacing:0.5px;">' + c.type + ' · ' + (c.size||'Medium') + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<div style="font-family:\'Cinzel\',serif;font-size:11px;color:#9070c0;white-space:nowrap;">❤️ <span class="allies-hp-text" data-ai="' + i + '">' + (parseInt(c.hpCurrent)||0) + ' / ' + (parseInt(c.hpMax)||0) + '</span></div>' +
          '<div style="font-size:10px;color:#7a5aa0;transition:transform 0.2s;" class="allies-chevron">▼</div>' +
        '</div>' +
      '</div>' +
      // ── HP BAR (always visible) ──
      '<div style="padding:0 10px 2px;"><div class="comp-hp-bar-wrap" style="height:5px;"><div class="allies-hp-bar comp-hp-bar" data-ai="' + i + '" style="width:' + pct + '%;background:' + barColor + ';border-radius:3px;"></div></div></div>' +
      // ── BODY (collapsed by default) ──
      '<div id="' + cardId + '" class="allies-card-body" style="display:none;padding:8px 10px 10px;">' +
        '<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px;justify-content:center;">' +
          '<button class="comp-hp-btn comp-hp-btn-death" style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',-(data.companions[' + i + '].hpMax+999))" title="Set HP to 0">💀</button>' +
          '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',-1)">−1</button>' +
          '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',-5)">−5</button>' +
          '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',-10)">−10</button>' +
          '<button class="comp-hp-btn comp-hp-btn-dmg"  style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',-25)">−25</button>' +
          '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',1)">+1</button>' +
          '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',5)">+5</button>' +
          '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',10)">+10</button>' +
          '<button class="comp-hp-btn comp-hp-btn-heal" style="font-size:10px;padding:2px 5px;" onclick="alliesCompHp(' + i + ',25)">+25</button>' +
          '<button class="comp-hp-btn comp-hp-btn-full" style="font-size:9px;padding:2px 4px;" onclick="alliesCompHp(' + i + ',data.companions[' + i + '].hpMax+999)">FULL</button>' +
        '</div>' +
        '<div id="allies-result-' + i + '" style="display:none;margin-bottom:6px;padding:6px 8px;background:rgba(10,2,25,0.8);border:1px solid #7a3ac0;border-radius:5px;text-align:center;font-family:Cinzel,serif;font-size:11px;"></div>' +
        '<div id="allies-attacks-' + i + '" style="margin-bottom:4px;"></div>' +
        '<button onclick="alliesOpenAddModal(' + i + ')" style="display:block;width:100%;margin-top:6px;padding:7px 0;font-family:\'Cinzel\',serif;font-size:11px;font-weight:700;letter-spacing:1px;color:#d0a0ff;background:rgba(60,20,100,0.5);border:1px solid #7a3ac0;border-radius:4px;cursor:pointer;" onmouseover="this.style.boxShadow=\'0 0 10px rgba(140,80,220,0.3)\'" onmouseout="this.style.boxShadow=\'none\'">＋ Add Attack</button>' +
      '</div>';
    container.appendChild(card);
  });
}

function alliesCompHp(idx, delta) {
  compHpChange(idx, delta);
  const comp = data.companions[idx];
  const pct = comp.hpMax > 0 ? Math.max(0, Math.min(100, (comp.hpCurrent / comp.hpMax) * 100)) : 0;
  const barColor = pct > 60 ? '#9060d0' : pct > 25 ? '#b06020' : '#cc3333';
  const bar = document.querySelector('.allies-hp-bar[data-ai="' + idx + '"]');
  if (bar) { bar.style.width = pct + '%'; bar.style.background = barColor; }
  const txt = document.querySelector('.allies-hp-text[data-ai="' + idx + '"]');
  if (txt) txt.textContent = (parseInt(comp.hpCurrent)||0) + ' / ' + (parseInt(comp.hpMax)||0);
  // also update qrAlliesList if open
  const qrBar = document.querySelector('#qrAlliesList .qr-hp-bar');
  if (qrBar) renderQuickCompanions();
}

function alliesToggleCard(header) {
  const bodyId = header.dataset.cardId;
  const body = document.getElementById(bodyId);
  const chevron = header.querySelector('.allies-chevron');
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  if (!isOpen) {
    const card = header.closest('[data-allies-idx]');
    if (card) alliesRenderAttacks(parseInt(card.dataset.alliesIdx));
    // scroll panel so this card is visible
    const list = document.getElementById('alliesQuickList');
    if (list && card) {
      const cardTop = card.offsetTop - list.offsetTop;
      list.scrollTo({ top: cardTop, behavior: 'smooth' });
    }
  }
}

// ════ ALLIES ATTACK ROLLER ════
var _alliesAtkCompIdx = -1;
var _alliesAtkEditIdx = -1;

function alliesOpenAddModal(compIdx) {
  _alliesAtkCompIdx = compIdx;
  _alliesAtkEditIdx = -1;
  document.getElementById('alliesAtkModalTitle').textContent = '＋ Add Attack';
  document.getElementById('alliesAtkSaveBtn').textContent = '＋ Add';
  document.getElementById('alliesAtkName').value = '';
  document.getElementById('alliesAtkType').value = 'both';
  document.getElementById('alliesAtkHitF').value = '1d20';
  document.getElementById('alliesAtkDmgF').value = '1d6';
  document.getElementById('alliesAtkCusF').value = '1d20';
  alliesAtkModalTypeChange();
  var modal = document.getElementById('alliesAtkModal');
  modal.style.display = 'flex';
  setTimeout(function(){ document.getElementById('alliesAtkName').focus(); }, 50);
}

function alliesOpenEditModal(compIdx, atkIdx) {
  var atk = (data.companions[compIdx] && data.companions[compIdx].attacks) ? data.companions[compIdx].attacks[atkIdx] : null;
  if (!atk) return;
  _alliesAtkCompIdx = compIdx;
  _alliesAtkEditIdx = atkIdx;
  document.getElementById('alliesAtkModalTitle').textContent = '✎ Edit Attack';
  document.getElementById('alliesAtkSaveBtn').textContent = '✔ Save';
  document.getElementById('alliesAtkName').value = atk.name || '';
  document.getElementById('alliesAtkType').value = atk.type || 'both';
  document.getElementById('alliesAtkHitF').value = atk.hitF || (atk.hitD ? atk.hitD+(parseInt(atk.hitB)>=0?'+'+atk.hitB:atk.hitB) : '1d20');
  document.getElementById('alliesAtkDmgF').value = atk.dmgF || (atk.dmgD ? atk.dmgD+(parseInt(atk.dmgB)>=0?'+'+atk.dmgB:atk.dmgB) : '1d6');
  document.getElementById('alliesAtkCusF').value = atk.cusF || '1d20';
  alliesAtkModalTypeChange();
  var modal = document.getElementById('alliesAtkModal');
  modal.style.display = 'flex';
  setTimeout(function(){ document.getElementById('alliesAtkName').focus(); }, 50);
}

function alliesCloseAtkModal() {
  document.getElementById('alliesAtkModal').style.display = 'none';
}

function alliesAtkModalTypeChange() {
  var t = document.getElementById('alliesAtkType').value;
  var hr = document.getElementById('alliesAtkHitRow');
  var dr = document.getElementById('alliesAtkDmgRow');
  var cr = document.getElementById('alliesAtkCusRow');
  if (hr) hr.style.display = (t === 'dmg' || t === 'custom') ? 'none' : 'flex';
  if (dr) dr.style.display = (t === 'hit' || t === 'custom') ? 'none' : 'flex';
  if (cr) cr.style.display = (t === 'custom') ? 'flex' : 'none';
}

function alliesModalSave() {
  var idx = _alliesAtkCompIdx;
  var editIdx = _alliesAtkEditIdx;
  var name = document.getElementById('alliesAtkName').value.trim() || 'Attack';
  var type = document.getElementById('alliesAtkType').value;
  var hitF = document.getElementById('alliesAtkHitF').value.trim() || '1d20';
  var dmgF = document.getElementById('alliesAtkDmgF').value.trim() || '1d6';
  var cusF = document.getElementById('alliesAtkCusF').value.trim() || '1d20';
  data.companions = data.companions || [];
  if (!data.companions[idx]) return;
  data.companions[idx].attacks = data.companions[idx].attacks || [];
  var obj = {name:name, type:type, hitF:hitF, dmgF:dmgF, cusF:cusF};
  if (editIdx >= 0) {
    data.companions[idx].attacks[editIdx] = obj;
    showToast(name + ' updated ✎');
  } else {
    data.companions[idx].attacks.push(obj);
    showToast(name + ' added ✦');
  }
  autoSave();
  alliesRenderAttacks(idx);
  alliesCloseAtkModal();
}

// Legacy stubs (not used anymore but kept for safety)
function alliesSaveAttack(idx, editIdx) { alliesOpenAddModal(idx); }
function alliesEditAttack(idx, ai) { alliesOpenEditModal(idx, ai); }
function alliesParseRoll(formula) {
  formula = (formula||'').trim();
  var m = formula.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if(!m){var v=parseInt(formula)||1; return {rolls:[v],total:v};}
  var cnt=parseInt(m[1]||'1')||1, sides=parseInt(m[2]), bon=parseInt(m[3]||'0')||0, rolls=[];
  for(var j=0;j<cnt;j++) rolls.push(Math.floor(Math.random()*sides)+1);
  return {rolls:rolls, total:rolls.reduce(function(a,b){return a+b;},0)+bon};
}
function alliesRollAttack(idx, atkIdx) {
  var comp=data.companions[idx]; if(!comp) return;
  var atk=(comp.attacks||[])[atkIdx]; if(!atk) return;
  var res=document.getElementById('allies-result-'+idx); if(!res) return;
  var type=atk.type||'both';
  var hitF=atk.hitF||(atk.hitD?(atk.hitD+(parseInt(atk.hitB)>=0?'+'+atk.hitB:atk.hitB)):'1d20');
  var dmgF=atk.dmgF||(atk.dmgD?(atk.dmgD+(parseInt(atk.dmgB)>=0?'+'+atk.dmgB:atk.dmgB)):'1d6');
  var cusF=atk.cusF||'1d20';
  if(type==='custom'){
    var r=alliesParseRoll(cusF);
    res.innerHTML='<div style="text-align:center;padding:4px 0;"><div style="font-size:26px;font-weight:900;color:#d0a0ff;">'+r.total+'</div><div style="font-size:9px;color:#7a5aa0;">'+cusF+' ['+r.rolls.join('+')+']</div></div>';
    res.style.display='block';
    document.querySelectorAll('.allies-card-body').forEach(function(b){if(b.id==='allies-card-body-'+idx)b.scrollTop=0;});
    return;
  }
  var html='<div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:4px 0;">';
  if(type==='hit'||type==='both'){
    var h=alliesParseRoll(hitF);
    var isD20=hitF.toLowerCase().indexOf('d20')!==-1;
    var crit=isD20&&h.rolls[0]===20, miss=isD20&&h.rolls[0]===1;
    var hc=crit?'#f0c060':miss?'#e05050':'#80e0a0';
    var hl=crit?' CRIT!':miss?' MISS!':'';
    html+='<div style="text-align:center;"><div style="font-size:22px;font-weight:900;color:'+hc+';">'+h.total+hl+'</div><div style="font-size:9px;color:#7a5aa0;">'+hitF+' ['+h.rolls.join('+')+']</div></div>';
    if(type==='both') html+='<div style="color:#3a2a60;font-size:18px;">&#x27F6;</div>';
  }
  if(type==='dmg'||type==='both'){
    var d=alliesParseRoll(dmgF);
    html+='<div style="text-align:center;"><div style="font-size:22px;font-weight:900;color:#f08040;">'+d.total+' dmg</div><div style="font-size:9px;color:#7a5aa0;">'+dmgF+' ['+d.rolls.join('+')+']</div></div>';
  }
  html+='</div>';
  res.innerHTML=html; res.style.display='block';
  document.querySelectorAll('.allies-card-body').forEach(function(b){
    if(b.getAttribute('id')==='allies-card-body-'+idx) b.scrollTop=0;
  });
}
function alliesDeleteAttack(idx, atkIdx) {
  if(!data.companions[idx]||!data.companions[idx].attacks) return;
  data.companions[idx].attacks.splice(atkIdx,1); autoSave(); alliesRenderAttacks(idx);
}
function alliesRenderAttacks(idx) {
  var container=document.getElementById('allies-attacks-'+idx); if(!container) return;
  var attacks=(data.companions[idx]||{}).attacks||[];
  if(!attacks.length){container.innerHTML='<div style="font-size:10px;color:#5a3a70;font-style:italic;padding:2px 0;">Ziadne utoky</div>'; return;}
  container.innerHTML=attacks.map(function(atk,ai){
    var name=(atk.name||'Utok').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return '<div style="display:flex;align-items:center;gap:3px;background:rgba(50,15,90,0.5);border:1px solid #4a1a70;border-radius:4px;padding:4px 6px;margin-bottom:3px;">'
      +'<span style="flex:1;font-size:12px;color:#e0c0ff;font-family:Cinzel,serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;">'+name+'</span>'
      +'<button onclick="alliesRollAttack('+idx+','+ai+')" style="font-size:11px;padding:3px 9px;background:linear-gradient(135deg,#5a1a8a,#3a0a60);border:1px solid #7a3ac0;color:#f0c0ff;border-radius:3px;cursor:pointer;font-weight:700;flex-shrink:0;">Roll</button>'
      +'<button onclick="alliesOpenEditModal('+idx+','+ai+')" style="font-size:10px;padding:3px 6px;background:rgba(30,20,60,0.7);border:1px solid #5a3a80;color:#b090d0;border-radius:3px;cursor:pointer;flex-shrink:0;">Edit</button>'
      +'<button onclick="alliesDeleteAttack('+idx+','+ai+')" style="font-size:10px;padding:3px 5px;background:rgba(80,10,10,0.5);border:1px solid #6a1a1a;color:#e06060;border-radius:3px;cursor:pointer;flex-shrink:0;">X</button>'
      +'</div>';
  }).join('');
}
function alliesTypeChange(idx) { /* stub – replaced by alliesAtkModalTypeChange */ }
function alliesInitScroll(){}

function qrTypeChange() {
  const t = document.getElementById('qrType').value;
  // attack  → iba ATK+
  // damage  → DICE + DMG+
  // both    → ATK+ + DICE + DMG+
  // custom  → DICE + DMG+
  const showAtk = (t === 'attack' || t === 'both');
  const showDmg = (t === 'damage' || t === 'both' || t === 'custom');
  const atkRow = document.getElementById('qrAttackBonusRow');
  const dmgField = document.getElementById('qrDmgField');
  const dmgBonusRow = document.getElementById('qrDmgBonusRow');
  if (atkRow)      atkRow.style.display      = showAtk ? 'flex' : 'none';
  if (dmgField)    dmgField.style.display     = showDmg ? 'flex' : 'none';
  if (dmgBonusRow) dmgBonusRow.style.display  = showDmg ? 'flex' : 'none';
}

// ── Full multi-dice expression parser ──────────────────────────────────────
// Supports: "3d10", "2d8+4", "3d10+2d8", "3d10+2d8-1", "1d6+1d4+3" etc.
// Returns: { total, rolls, parts, bonus, formula }
//   rolls  = flat array of all individual die results
//   parts  = array of {label, rolls, subtotal} for display purposes
//   bonus  = flat integer bonus (sum of all flat modifiers)
function qrRollDice(formula) {
  formula = (formula || '').trim().replace(/\s+/g, '');
  if (!formula) return { total: 0, rolls: [], parts: [], bonus: 0, formula };

  const parts = [];
  let bonus = 0;
  let total = 0;
  const allRolls = [];

  // Tokenise: split on + and - keeping the sign
  // e.g. "3d10+2d8-1" → ["+3d10", "+2d8", "-1"]
  const tokens = formula.replace(/^([^+-])/, '+$1').match(/[+-][^+-]+/g) || [];

  for (const token of tokens) {
    const sign = token[0] === '-' ? -1 : 1;
    const raw = token.slice(1);
    const diceMatch = raw.match(/^(\d+)d(\d+)$/i);
    if (diceMatch) {
      const count = parseInt(diceMatch[1]);
      const sides = parseInt(diceMatch[2]);
      const rolls = [];
      for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
      const subtotal = rolls.reduce((a, b) => a + b, 0) * sign;
      allRolls.push(...rolls);
      total += subtotal;
      parts.push({ label: (sign < 0 ? '-' : '') + raw, rolls, subtotal, sign });
    } else {
      const flat = parseInt(raw) || 0;
      bonus += flat * sign;
      total += flat * sign;
      parts.push({ label: (sign < 0 ? '-' : '+') + flat, rolls: [], subtotal: flat * sign, sign, isBonus: true });
    }
  }

  return { total, rolls: allRolls, parts, bonus, formula };
}

// ── Human-readable breakdown string ─────────────────────────────────────────
// e.g. "3d10[4+7+2] + 2d8[5+3]" or "3d10[4+7+2] + 2d8[5+3] + 4"
function qrRollBreakdown(rollResult) {
  return rollResult.parts.map((p, i) => {
    const prefix = i === 0 ? '' : (p.sign < 0 ? ' − ' : ' + ');
    if (p.isBonus) return prefix + Math.abs(p.subtotal);
    return prefix + p.label + '[' + p.rolls.join('+') + ']';
  }).join('');
}

// ── Upcast helper: build per-level dice map from structured higherLevels array ──
// Returns: { [level]: diceFormula } or null if no data
function _getUpcastDiceMap(spell) {
  if (!spell) return null;
  // New structured format: higherLevels = [{level, dice, note}, ...]
  if (Array.isArray(spell.higherLevels) && spell.higherLevels.length > 0) {
    const map = {};
    spell.higherLevels.forEach(e => {
      if (e.level && e.dice) map[e.level] = e.dice;
    });
    return Object.keys(map).length > 0 ? map : null;
  }
  // Legacy fallback: parse text 'higher' field
  if (spell.higher) return null; // handled by _parseUpcastScaling below
  return null;
}

// ── Legacy text parser (kept for backward compat with old 'higher' text field) ──
function _parseUpcastScaling(higherText) {
  if (!higherText) return null;
  const t = higherText.toLowerCase();
  // "+Xd? for each slot level above Nth"
  const m1 = t.match(/\+?(\d+)d(\d+)\s+for each (?:slot )?level above (\d+)/i);
  if (m1) return { diceCount: parseInt(m1[1]), diceSides: parseInt(m1[2]), baseLevel: parseInt(m1[3]) };
  // "an additional Xd? per level above Nth"
  const m2 = t.match(/additional (\d+)d(\d+) (?:per|for each) (?:slot )?level above (\d+)/i);
  if (m2) return { diceCount: parseInt(m2[1]), diceSides: parseInt(m2[2]), baseLevel: parseInt(m2[3]) };
  // "Xd? per level above Nth"
  const m3 = t.match(/(\d+)d(\d+) per (?:slot )?level above (\d+)/i);
  if (m3) return { diceCount: parseInt(m3[1]), diceSides: parseInt(m3[2]), baseLevel: parseInt(m3[3]) };
  return null;
}

// Get dice formula for a given cast level — tries structured map first, then legacy scaling
function _getUpcastFormula(spell, baseDice, castLevel) {
  const spellBaseLevel = spell ? (spell.level || 1) : 1;
  if (castLevel <= spellBaseLevel) return baseDice;

  // Structured higherLevels map takes priority
  const diceMap = _getUpcastDiceMap(spell);
  if (diceMap) {
    // Find exact level or closest lower defined level
    for (let lvl = castLevel; lvl > spellBaseLevel; lvl--) {
      if (diceMap[lvl]) return diceMap[lvl];
    }
  }

  // Legacy text scaling fallback
  const scaling = _parseUpcastScaling(spell ? spell.higher : null);
  return _upcastDiceFormula(baseDice, scaling, castLevel);
}

function _upcastDiceFormula(baseDice, scaling, castLevel) {
  // baseDice = "8d6", scaling = {diceCount,diceSides,baseLevel}
  if (!scaling || castLevel <= scaling.baseLevel) return baseDice;
  const bm = baseDice.match(/^(\d+)d(\d+)$/i);
  if (!bm) return baseDice;
  const extra = (castLevel - scaling.baseLevel) * scaling.diceCount;
  const total = parseInt(bm[1]) + extra;
  return total + 'd' + bm[2];
}

// ── Inline upcast picker ──────────────────────────────────────────────────────
function qrShowUpcastPicker(idx) {
  const p = data.qrPresets[idx];
  if (!p) return;
  const spell = (data.spells || [])[p._srcSpell];
  const spellBaseLevel = spell ? (spell.level || 1) : 1;
  const box = document.getElementById('qrResultBox');

  // Build available slots — starting from BASE level (expends a slot) up to 9
  const slotRows = [];
  for (let lvl = spellBaseLevel; lvl <= 9; lvl++) {
    const sd = data.spellSlots?.[lvl];
    const avail = sd ? (sd.max - sd.used) : 0;
    if (sd && sd.max > 0) {
      // Base level uses the preset's own dice; higher levels use upcast formula
      const projDice = lvl > spellBaseLevel
        ? _getUpcastFormula(spell, p.dmgDice, lvl)
        : p.dmgDice;
      const unavailable = avail <= 0;
      const bonusStr = p.dmgBonus > 0 ? '+' + p.dmgBonus : p.dmgBonus < 0 ? p.dmgBonus : '';
      const isBase = lvl === spellBaseLevel;
      slotRows.push(
        `<button class="qr-upcast-slot-btn${unavailable ? ' qr-upcast-exhausted' : ''}${isBase ? ' qr-upcast-base' : ''}" `
        + `onclick="${unavailable ? '' : `qrFireUpcast(${idx},${lvl})`}" `
        + `${unavailable ? 'disabled' : ''} title="${avail} slot(s) remaining">`
        + `<span class="qr-upcast-lvl">${lvl}${['st','nd','rd'][lvl-1]||'th'}${isBase ? ' ★' : ''}</span>`
        + `<span class="qr-upcast-dice">${projDice}${bonusStr}</span>`
        + `<span class="qr-upcast-avail">${avail}/${sd.max}</span>`
        + `</button>`
      );
    }
  }

  if (slotRows.length === 0) {
    box.innerHTML = `<div class="qr-result-detail" style="color:#e05050;text-align:center;padding:8px 0;">No slots available (need a ${spellBaseLevel}${['st','nd','rd'][spellBaseLevel-1]||'th'}-level slot or higher).</div>`;
    return;
  }

  box.innerHTML = `
    <div class="qr-upcast-wrap">
      <div class="qr-upcast-title">✦ ${p.name} — Cast (expends a slot)</div>
      <div class="qr-upcast-grid">${slotRows.join('')}</div>
      <button class="qr-upcast-cancel" onclick="document.getElementById('qrResultBox').innerHTML=''">✕ Cancel</button>
    </div>`;
}
function qrFireUpcast(presetIdx, castLevel) {
  data.qrPresets = data.qrPresets || [];
  const p = data.qrPresets[presetIdx];
  if (!p) return;

  const spell = (data.spells || [])[p._srcSpell];
  const spellBaseLevel = spell ? (spell.level || 1) : 1;

  // Compute actual dice for this cast level (structured map takes priority over legacy text)
  const finalDice = _getUpcastFormula(spell, p.dmgDice, castLevel);

  // Expend the spell slot
  if (data.spellSlots?.[castLevel]) {
    data.spellSlots[castLevel].used = Math.min(
      data.spellSlots[castLevel].max,
      (data.spellSlots[castLevel].used || 0) + 1
    );
    if (typeof buildSpellSlots === 'function') buildSpellSlots();
    _autoLog && _autoLog(`✨ Spell slot expended — Level ${castLevel} (${data.spellSlots[castLevel].max - data.spellSlots[castLevel].used}/${data.spellSlots[castLevel].max} remaining)`, 'Spell');
    autoSave();
  }

  const lvlLabel = castLevel === spellBaseLevel ? '' : ` ↑ ${castLevel}${['st','nd','rd'][castLevel-1]||'th'}`;
  const box = document.getElementById('qrResultBox');
  let html = '';

  if (p.type === 'both' || p.type === 'attack') {
    const r1u = Math.floor(Math.random()*20)+1;
    const r2u = Math.floor(Math.random()*20)+1;
    let atkDie, atkR2;
    if (qrWeaponAdvMode === 'adv')      { atkDie = Math.max(r1u,r2u); atkR2 = r2u; }
    else if (qrWeaponAdvMode === 'dis') { atkDie = Math.min(r1u,r2u); atkR2 = r2u; }
    else                                { atkDie = r1u; atkR2 = null; }
    const atkTotal = atkDie + (p.hitBonus||0);
    const isCrit = atkDie === 20;
    const isFail = atkDie === 1;
    const atkColor = isCrit ? '#f0c060' : isFail ? '#e05050' : '#80e0a0';
    const critLabel = isCrit ? ' ✦ CRIT!' : isFail ? ' ✦ MISS!' : '';
    const modeLabel = qrWeaponAdvMode === 'adv' ? ' (Adv)' : qrWeaponAdvMode === 'dis' ? ' (Dis)' : '';
    const diceDetail = atkR2 !== null ? `d20[${r1u}/${atkR2}→${atkDie}]` : `d20[${atkDie}]`;
    if (p.type === 'both') {
      const dmgFormula = finalDice + (p.dmgBonus>0?'+'+p.dmgBonus:p.dmgBonus<0?p.dmgBonus:'');
      const dmgRoll = qrRollDice(dmgFormula);
      html = `<div style="display:flex;gap:12px;align-items:center;justify-content:center">`;
      html += `<div><div class="qr-result-num" style="color:${atkColor};font-size:28px">${atkTotal}${critLabel}</div><div class="qr-result-detail">${diceDetail} + ${p.hitBonus||0}${modeLabel}</div></div>`;
      html += `<div style="color:#3a6a40;font-size:20px">→</div>`;
      html += `<div><div class="qr-result-num" style="color:#f08040;font-size:28px">${dmgRoll.total} dmg</div><div class="qr-result-detail">${qrRollBreakdown(dmgRoll)}${lvlLabel}</div></div>`;
      html += `</div>`;
    } else {
      html = `<div class="qr-result-num" style="color:${atkColor}">${atkTotal}${critLabel}</div>`;
      html += `<div class="qr-result-detail">${diceDetail} + ${p.hitBonus||0}${modeLabel} — ${p.name}${lvlLabel}</div>`;
    }
  } else if (p.type === 'damage') {
    const dmgFormula = finalDice + (p.dmgBonus>0?'+'+p.dmgBonus:p.dmgBonus<0?p.dmgBonus:'');
    const dmgRoll = qrRollDice(dmgFormula);
    html = `<div class="qr-result-num" style="font-size:28px;color:#f08040">${dmgRoll.total} dmg</div>`;
    html += `<div class="qr-result-detail">${qrRollBreakdown(dmgRoll)}${lvlLabel}</div>`;
  }

  box.innerHTML = html;
}

function qrFire(idx) {
  data.qrPresets = data.qrPresets || [];
  const p = data.qrPresets[idx];
  if (!p) return;

  // Spell presets fire immediately at base level — NO slot expended, NO picker
  // (Use the ✦ upcast button to cast at higher level and expend a slot)

  const box = document.getElementById('qrResultBox');
  let html = '';

  // ── Helper: roll d20 with current weapon adv mode ──
  function _qrAtkRoll() {
    const r1 = Math.floor(Math.random()*20)+1;
    const r2 = Math.floor(Math.random()*20)+1;
    if (qrWeaponAdvMode === 'adv') return { die: Math.max(r1,r2), r1, r2 };
    if (qrWeaponAdvMode === 'dis') return { die: Math.min(r1,r2), r1, r2 };
    return { die: r1, r1, r2: null };
  }
  function _qrAtkDetail(r, bonus) {
    const modeLabel = qrWeaponAdvMode === 'adv' ? ' (Adv)' : qrWeaponAdvMode === 'dis' ? ' (Dis)' : '';
    const diceStr = r.r2 !== null
      ? `d20[${r.r1}/${r.r2}→${r.die}]`
      : `d20[${r.die}]`;
    return `${diceStr} + ${bonus}${modeLabel}`;
  }

  if (p.type === 'attack' || p.type === 'save') {
    const r = _qrAtkRoll();
    const total = r.die + (p.hitBonus||0);
    const isCrit = r.die === 20;
    const isFail = r.die === 1;
    const color = isCrit ? '#f0c060' : isFail ? '#e05050' : '#80e0a0';
    const label = isCrit ? ' ✦ CRIT!' : isFail ? ' ✦ FAIL!' : '';
    html += `<div class="qr-result-num" style="color:${color}">${total}${label}</div>`;
    html += `<div class="qr-result-detail">${_qrAtkDetail(r, p.hitBonus||0)} — ${p.name}</div>`;
  }
  if (p.type === 'damage') {
    const dmgFormula = (p.dmgDice||'1d4') + (p.dmgBonus>0?'+'+p.dmgBonus:p.dmgBonus<0?p.dmgBonus:'');
    const dmgRoll = qrRollDice(dmgFormula);
    html += `<div class="qr-result-num" style="font-size:28px;color:#f08040">${dmgRoll.total} dmg</div>`;
    html += `<div class="qr-result-detail">${qrRollBreakdown(dmgRoll)} — ${p.note||p.dmgDice}</div>`;
  }
  if (p.type === 'both') {
    const r = _qrAtkRoll();
    const atkTotal = r.die + (p.hitBonus||0);
    const isCrit = r.die === 20;
    const isFail = r.die === 1;
    const dmgFormula = (p.dmgDice||'1d4') + (p.dmgBonus>0?'+'+p.dmgBonus:p.dmgBonus<0?p.dmgBonus:'');
    const dmgRoll = qrRollDice(dmgFormula);
    const atkColor = isCrit ? '#f0c060' : isFail ? '#e05050' : '#80e0a0';
    const critLabel = isCrit ? ' ✦ CRIT!' : isFail ? ' ✦ MISS!' : '';
    html = `<div style="display:flex;gap:12px;align-items:center;justify-content:center">`;
    html += `<div><div class="qr-result-num" style="color:${atkColor};font-size:28px">${atkTotal}${critLabel}</div><div class="qr-result-detail">${_qrAtkDetail(r, p.hitBonus||0)}</div></div>`;
    html += `<div style="color:#3a6a40;font-size:20px">→</div>`;
    html += `<div><div class="qr-result-num" style="color:#f08040;font-size:28px">${dmgRoll.total} dmg</div><div class="qr-result-detail">${qrRollBreakdown(dmgRoll)} ${p.note||''}</div></div>`;
    html += `</div>`;
  }
  if (p.type === 'custom') {
    const r = qrRollDice(p.dmgDice || '1d20');
    html = `<div class="qr-result-num">${r.total}</div><div class="qr-result-detail">[${r.rolls.join(' + ')}]${r.bonus?'+'+r.bonus:''} — ${p.name}</div>`;
  }
  box.innerHTML = html;
}

// ── Preset modal state ──
var _qrEditIdx = -1; // -1 = add mode, ≥0 = edit mode

function qrOpenAddModal() {
  _qrEditIdx = -1;
  document.getElementById('qrModalTitle').textContent = '✦ Add Preset';
  document.getElementById('qrModalSaveBtn').textContent = '＋ Add';
  document.getElementById('qrName').value = '';
  document.getElementById('qrNote').value = '';
  document.getElementById('qrType').value = 'attack';
  document.getElementById('qrHitBonus').value = '0';
  document.getElementById('qrDmgDice').value = '1d4';
  document.getElementById('qrDmgBonus').value = '0';
  qrTypeChange();
  const modal = document.getElementById('qrPresetModal');
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('qrName').focus(), 50);
}

function qrOpenEditModal(idx) {
  data.qrPresets = data.qrPresets || [];
  const p = data.qrPresets[idx];
  if (!p) return;
  _qrEditIdx = idx;
  document.getElementById('qrModalTitle').textContent = '✎ Edit Preset';
  document.getElementById('qrModalSaveBtn').textContent = '✔ Save';
  document.getElementById('qrName').value = p.name || '';
  document.getElementById('qrNote').value = p.note || '';
  document.getElementById('qrType').value = p.type || 'attack';
  document.getElementById('qrHitBonus').value = p.hitBonus ?? 0;
  document.getElementById('qrDmgDice').value = p.dmgDice || '1d4';
  document.getElementById('qrDmgBonus').value = p.dmgBonus ?? 0;
  qrTypeChange();
  const modal = document.getElementById('qrPresetModal');
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('qrName').focus(), 50);
}

function qrCloseModal() {
  document.getElementById('qrPresetModal').style.display = 'none';
}

function qrModalSave() {
  const name = document.getElementById('qrName').value.trim();
  const type = document.getElementById('qrType').value;
  const dmgDice = document.getElementById('qrDmgDice').value.trim() || '1d4';
  const hitBonus = parseInt(document.getElementById('qrHitBonus').value) || 0;
  const dmgBonus = parseInt(document.getElementById('qrDmgBonus').value) || 0;
  const note = document.getElementById('qrNote').value.trim();
  if (!name) { showToast('Enter a preset name'); return; }
  data.qrPresets = data.qrPresets || [];
  if (_qrEditIdx >= 0) {
    // Edit mode
    data.qrPresets[_qrEditIdx] = {name, type, dmgDice, hitBonus, dmgBonus, note};
    showToast(name + ' updated ✎');
  } else {
    // Add mode
    if (data.qrPresets.length >= 12) { showToast('Max 12 presets'); return; }
    data.qrPresets.push({name, type, dmgDice, hitBonus, dmgBonus, note});
    showToast(name + ' added ✦');
  }
  autoSave();
  renderQrPresets();
  qrCloseModal();
}

function qrAddPreset() { qrOpenAddModal(); }

function qrEditPreset(idx) { qrOpenEditModal(idx); }

function qrDeletePreset(idx) {
  data.qrPresets = data.qrPresets || [];
  data.qrPresets.splice(idx, 1);
  autoSave();
  renderQrPresets();
}

function renderQrPresets() {
  data.qrPresets = data.qrPresets || [];
  const list = document.getElementById('qrPresetList');
  if (data.qrPresets.length === 0) {
    list.innerHTML = '<div class="qr-empty">No presets yet. Add your own!</div>';
    return;
  }
  const typeIcons = {attack:'⚔', damage:'💥', both:'⚔💥', save:'🛡', custom:'🎲'};
  list.innerHTML = data.qrPresets.map((p,i) => {
    let formula = '';
    if (p.type === 'attack' || p.type === 'save') formula = 'd20' + (p.hitBonus>0?'+'+p.hitBonus:p.hitBonus<0?p.hitBonus:'');
    else if (p.type === 'damage') formula = p.dmgDice + (p.dmgBonus>0?'+'+p.dmgBonus:p.dmgBonus<0?p.dmgBonus:'') + (p.note?' ('+p.note+')':'');
    else if (p.type === 'both') formula = 'd20+'+p.hitBonus+' / '+p.dmgDice+(p.dmgBonus?'+'+p.dmgBonus:'')+(p.note?' '+p.note:'');
    else formula = p.dmgDice;

    // Upcast button — only for spell presets with level >= 1
    const spell = p._fromSpell && p._srcSpell !== undefined ? (data.spells||[])[p._srcSpell] : null;
    const isUpcastable = spell && spell.level >= 1;
    const upcastBtn = isUpcastable
      ? `<button class="qr-delete-btn qr-upcast-btn" onclick="event.stopPropagation();qrShowUpcastPicker(${i})" title="Cast with slot — base or upcast (expends a slot)">✦</button>`
      : '';

    return `<div class="qr-preset-row">${upcastBtn}<button class="qr-fire-btn" onclick="qrFire(${i})"><span class="qr-label">${typeIcons[p.type]||'🎲'} ${p.name}</span><span class="qr-formula">${formula}</span></button><button class="qr-delete-btn qr-edit-btn" onclick="qrEditPreset(${i})" title="Edit preset">✎</button><button class="qr-delete-btn" onclick="qrDeletePreset(${i})" title="Delete preset">✕</button></div>`;
  }).join('');
}

// ═══════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════
function showModal(title, bodyHTML, actions) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  const actionsEl = document.getElementById('modalActions');
  actionsEl.innerHTML = '';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'btn ' + (a.cls||'btn-silver');
    btn.textContent = a.label;
    btn.onclick = new Function(a.action);
    actionsEl.appendChild(btn);
  });
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ═══════════════════════════════════════════
//  RESET / EXPORT / IMPORT
// ═══════════════════════════════════════════
function confirmReset() {
  showModal('Reset Character Sheet', '<p style="color:var(--text-secondary);font-size:15px;line-height:1.6;">This will permanently erase all character data. Are you certain you wish to proceed?</p>', [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Reset Everything', action:'doReset()', cls:'btn-danger'}
  ]);
}

function doReset() {
  localStorage.removeItem('dnd5e_chronicle');
  data = defaultData();
  initAll();
  closeModal();
  showToast('Character sheet reset.');
}

function exportData() {
  collectData();

  // Exportuje iba hlavný character sheet (bez archívnych obrázkov).
  // Archív, Mapy a Achievements majú vlastné export tlačidlá.
  let jsonStr;
  try {
    jsonStr = JSON.stringify(data, null, 2);
  } catch(e) {
    showToast('Export error: ' + e.message);
    console.error('Export JSON.stringify error:', e);
    return;
  }

  const blob = new Blob([jsonStr], {type:'application/json'});
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = (data.charName||'character').replace(/\s+/g,'_') + '_sheet.json';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Character sheet exported ✦');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      // Parse JSON
      let imported;
      try {
        imported = JSON.parse(ev.target.result);
      } catch(parseErr) {
        console.error('Import JSON parse error:', parseErr);
        showToast('Error: Neplatný JSON súbor — ' + parseErr.message);
        return;
      }

      // Ak niekto omylom nahrá archive/maps export — upozorni
      if (imported._type === 'chronicle_archive') {
        showToast('Toto je Archive export — použi "↑ Import Archive" v Archive tabe.');
        return;
      }
      if (imported._type === 'chronicle_maps') {
        showToast('Toto je Maps export — použi "↑ Import Maps" v Maps tabe.');
        return;
      }

      // Nastav dáta a obnov UI
      try {
        data = {...defaultData(), ...imported};
        localStorage.setItem('dnd5e_chronicle', JSON.stringify(data));
        initAll();
        showToast('Character sheet imported ✦');
      } catch(saveErr) {
        console.error('Import save error:', saveErr);
        showToast('Error: Nepodarilo sa uložiť — ' + saveErr.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// FLOATING PANELS — side by side, aligned to bottom
// Order left to right: General | Combat HUD | Quick Roll | Allies
// Each panel aligns to the bottom next to its toggle button.
// ═══════════════════════════════════════════

function repositionPanels() {
  var GAP   = 8;    // medzera medzi panelmi
  var REDGE = 24;   // right offset of all wrappers (from inline style)
  var TW    = 56;   // toggle button width (approx)
  var vw    = window.innerWidth;
  var vh    = window.innerHeight;

  // All panels defined in LEFT TO RIGHT order
  // (last in array = closest to toggle buttons = rightmost)
  var PANELS = [
    { panelId: 'dicePanel',        wrapperId: 'diceRollerWrapper',  display: 'block', defaultBottom: 24  },
    { panelId: 'combatHudPanel',   wrapperId: 'combatHudWrapper',   display: 'block', defaultBottom: 156 },
    { panelId: 'quickRollPanel',   wrapperId: 'quickRoller',        display: 'block', defaultBottom: 90  },
    { panelId: 'alliesPanel',      wrapperId: 'alliesWrapper',      display: 'flex',  defaultBottom: 222 },
    { panelId: 'sessionNotesPanel',wrapperId: 'sessionNotesWrapper',display: 'block', defaultBottom: 24  }
  ];

  // Natural width of each panel (from CSS)
  var NATURAL_W = {
    'dicePanel':         340,
    'combatHudPanel':    360,
    'quickRollPanel':    340,
    'alliesPanel':       300,
    'sessionNotesPanel': 420
  };

  // 1. Find which panels are open
  var open = PANELS.filter(function(p) {
    var el = document.getElementById(p.panelId);
    return el && el.classList.contains('open');
  });

  // 2. Close (clear inline styles) panels that are not open
  PANELS.forEach(function(p) {
    var el = document.getElementById(p.panelId);
    if (!el || el.classList.contains('open')) return;
    el.style.removeProperty('right');
    el.style.removeProperty('bottom');
    el.style.removeProperty('width');
    el.style.removeProperty('max-height');
  });

  if (open.length === 0) return;

  // 3. Calculate positions — going RIGHT TO LEFT
  // First (rightmost) panel starts right next to the toggle buttons
  // right offset of first panel = REDGE + TW + GAP
  var curRight = REDGE + TW + GAP;

  // Iterate from end (rightmost panel) to start
  for (var i = open.length - 1; i >= 0; i--) {
    var p   = open[i];
    var el  = document.getElementById(p.panelId);
    if (!el) continue;

    // Width: natural but max available space
    var natW = NATURAL_W[p.panelId] || 300;
    var w    = Math.min(natW, vw - curRight - GAP);
    w = Math.max(180, w);

    // Bottom: always at the bottom of the viewport
    var bottom = 24;

    // Max height: nearly the full viewport
    var maxH = Math.min(Math.floor(vh * 0.85), vh - bottom - GAP);

    // Apply inline styles
    el.style.position  = 'fixed';
    el.style.right     = curRight + 'px';
    el.style.bottom    = bottom + 'px';
    el.style.width     = w + 'px';
    el.style.maxHeight = maxH + 'px';
    el.style.left      = 'auto';
    el.style.top       = 'auto';

    // Move cursor left for next panel
    curRight += w + GAP;
  }
}

window.addEventListener('resize', repositionPanels);
document.addEventListener('DOMContentLoaded', repositionPanels);
