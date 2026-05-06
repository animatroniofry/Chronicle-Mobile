// ═══════════════════════════════════════════
//  battle.js - BATTLE TRACKER & BOOT
// ═══════════════════════════════════════════

//  BATTLE TRACKER
// ═══════════════════════════════════════════
let dragSrc = null;
let battleTurnIdx = -1; // -1 = no active turn

function initBattle() {
  data.battle = data.battle || { round: 1, combatants: [] };
}

function addCombatant(lane) {
  initBattle();
  const emoji = lane==='party'?'🧙':lane==='npc'?'🤝':'💀';
  data.battle.combatants.push({
    id: Date.now(), lane, name:'', initiative:0,
    hpCur:10, hpMax:10, ac:10, photo:null,
    effects:[], isTurn:false
  });
  renderBattle();
  autoSave();
}

function renderInitiativeStrip() {
  initBattle();
  const strip = document.getElementById('initiativeOrder');
  if (!strip) return;
  strip.innerHTML = '';
  // Show combatants in CURRENT ARRAY ORDER (not re-sorted) so Wait/move-to-end is visible
  const combatants = data.battle.combatants;
  if (!combatants.length) {
    strip.innerHTML = '<div class="init-strip-empty">— No combatants yet. Add party, NPCs or monsters to begin. —</div>';
    return;
  }
  combatants.forEach((c, realIdx) => {
    if (realIdx > 0) {
      const arrow = document.createElement('div');
      arrow.className = 'init-strip-arrow';
      arrow.textContent = '›';
      strip.appendChild(arrow);
    }
    const card = document.createElement('div');
    const isWaiting = !!c.waiting;
    card.className = 'init-strip-card' + (c.isTurn ? ' active-turn' : '');
    card.title = `${c.name||'Unnamed'} — Initiative ${c.initiative} | HP ${c.hpCur}/${c.hpMax} | AC ${c.ac}\nClick to set active turn`;
    const avatarContent = c.photo ? `<img src="${c.photo}">` : (c.lane==='party'?'🧙':c.lane==='npc'?'🤝':'💀');
    const laneColor = c.lane==='party'?'#406040':c.lane==='npc'?'#304070':'#603030';
    card.style.borderColor = c.isTurn ? 'var(--accent-gold)' : isWaiting ? '#7a6020' : c.absent ? '#4a2020' : laneColor;
    card.style.opacity = c.absent ? '0.3' : isWaiting ? '0.7' : '1';
    if (c.absent) card.title += ' [NOT IN FIGHT]';
    card.style.filter = c.absent ? 'grayscale(0.7)' : '';
    card.innerHTML = `
      <div class="init-strip-avatar" style="${isWaiting?'filter:grayscale(0.5);':''}">${avatarContent}</div>
      <div class="init-strip-num" style="${isWaiting?'color:var(--text-muted);':''}">${c.initiative}</div>
      <div class="init-strip-name">${c.name||'—'}${isWaiting?' <span style="font-size:8px;color:#c0a030;">⏸</span>':''}</div>
      <div class="init-strip-hp">♥ ${c.hpCur}/${c.hpMax}</div>
    `;
    card.onclick = () => toggleTurn(realIdx);
    strip.appendChild(card);
  });
}

function renderBattle() {
  initBattle();
  // Render initiative strip
  renderInitiativeStrip();
  // Round
  const rEl = document.getElementById('battleRound');
  if (rEl) rEl.textContent = data.battle.round;
  // Banner
  const banner = document.getElementById('currentTurnBanner');
  // Clear lanes
  ['party','npc','monster'].forEach(lane => {
    const el = document.getElementById('battle'+lane.charAt(0).toUpperCase()+lane.slice(1));
    if (el) el.innerHTML = '';
  });
  // Figure out who has isTurn
  const active = data.battle.combatants.find(c=>c.isTurn);
  if (banner) {
    if (active) {
      banner.style.display = 'block';
      banner.textContent = `⚔ Current Turn: ${active.name||'Unnamed'} (Round ${data.battle.round})`;
    } else {
      banner.style.display = 'none';
    }
  }
  // Render each combatant
  data.battle.combatants.forEach((c,idx) => {
    const laneId = 'battle'+c.lane.charAt(0).toUpperCase()+c.lane.slice(1);
    const laneEl = document.getElementById(laneId);
    if (!laneEl) return;
    const card = document.createElement('div');
    card.className = 'combatant-card' + (c.isTurn?' is-turn':'') + (c.absent?' combatant-absent':'');
    card.dataset.idx = idx;
    card.draggable = true;
    card.addEventListener('dragstart', e => { dragSrc=idx; card.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag-over'); });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault(); card.classList.remove('drag-over');
      if (dragSrc !== null && dragSrc !== idx) {
        const arr = data.battle.combatants;
        const [moved] = arr.splice(dragSrc, 1);
        arr.splice(idx, 0, moved);
        dragSrc = null;
        renderBattle(); autoSave();
      }
    });
    // Avatar
    const avatarDiv = `<div class="combatant-avatar" onclick="uploadCombatantPhoto(${idx})" title="Click to upload photo">${c.photo?`<img src="${c.photo}">`:(c.lane==='party'?'🧙':c.lane==='npc'?'🤝':'💀')}</div>`;
    // Effects html
    const effectsHtml = (c.effects||[]).map((ef,ei)=>
      `<div class="effect-chip">
        <span>${ef.name}</span>
        <span class="effect-rounds ${ef.rounds<=1?'low':''}">${ef.rounds}</span>
        <button class="rm-effect" onclick="removeEffect(${idx},${ei})">✕</button>
      </div>`).join('');
    card.innerHTML = `
      <div class="combatant-header">
        ${avatarDiv}
        <div style="flex:1;min-width:0;">
          <input type="text" class="combatant-name-input" value="${c.name||''}" placeholder="${c.lane==='monster'?'Monster name':'Character name'}…" oninput="data.battle.combatants[${idx}].name=this.value;autoSave()">
        </div>
        <div class="initiative-badge" title="Initiative">${c.initiative}</div>
        <button class="btn ${c.isTurn?'btn-primary':'btn-silver'} btn-sm" onclick="toggleTurn(${idx})" title="Toggle active turn">▶</button>
        <button class="btn btn-silver btn-sm" onclick="waitCombatant(${idx})" title="Wait — move to end of initiative order" style="padding:5px 8px;font-size:11px;${c.waiting?'border-color:var(--accent-gold);color:var(--accent-gold);':'opacity:0.55;'}">⏸</button>
        <button class="btn btn-sm" onclick="toggleAbsent(${idx})" title="${c.absent?'Mark as participating':'Mark as not participating in this fight'}" style="padding:5px 8px;font-size:11px;${c.absent?'border-color:#8a4040;color:#cc6060;background:#1a0808;':'opacity:0.45;border-color:var(--border-dark);color:var(--text-muted);'}">👁</button>
        <button class="del-btn" onclick="removeCombatant(${idx})">🗑</button>
      </div>
      <div class="combatant-stats-row">
        <div class="combatant-stat-mini">
          <label>INIT</label>
          <input type="number" value="${c.initiative}" oninput="data.battle.combatants[${idx}].initiative=parseInt(this.value)||0;autoSave()">
        </div>
        <div class="combatant-stat-mini" style="border-color:var(--accent-red);">
          <label>HP</label>
          <div style="display:flex;align-items:center;gap:2px;">
            <input type="number" value="${c.hpCur}" style="color:#e05050;width:40px;" oninput="data.battle.combatants[${idx}].hpCur=parseInt(this.value)||0;autoSave()">
            <span style="color:var(--text-muted);font-size:11px;">/</span>
            <input type="number" value="${c.hpMax}" style="width:40px;" oninput="data.battle.combatants[${idx}].hpMax=parseInt(this.value)||0;autoSave()">
          </div>
        </div>
        <div class="combatant-stat-mini">
          <label>AC</label>
          <input type="number" value="${c.ac}" oninput="data.battle.combatants[${idx}].ac=parseInt(this.value)||0;autoSave()">
        </div>
        <div class="combatant-stat-mini" style="flex:0;padding:4px 6px;">
          <label>DMG</label>
          <div style="display:flex;gap:3px;">
            <button style="background:var(--accent-red);border:none;border-radius:3px;color:white;font-size:11px;cursor:pointer;padding:2px 5px;font-family:'Cinzel',serif;" onclick="quickHP(${idx},-1)">-</button>
            <button style="background:#306030;border:none;border-radius:3px;color:white;font-size:11px;cursor:pointer;padding:2px 5px;font-family:'Cinzel',serif;" onclick="quickHP(${idx},1)">+</button>
          </div>
        </div>
      </div>
      <div class="effect-chips" id="effectChips_${idx}">${effectsHtml}</div>
      <div class="add-effect-row">
        <input type="text" id="effectName_${idx}" placeholder="Effect name (e.g. Shield, Burning)…" style="flex:2;">
        <input type="number" id="effectRounds_${idx}" value="1" min="1" max="99" class="rounds-input" style="width:52px;text-align:center;" placeholder="Rounds">
        <button class="btn btn-primary btn-sm" onclick="addEffect(${idx})">+ Effect</button>
      </div>
    `;
    laneEl.appendChild(card);
  });
}

function toggleTurn(idx) {
  initBattle();
  data.battle.combatants.forEach((c,i) => {
    c.isTurn = (i === idx) ? !c.isTurn : false;
    if (i === idx && c.isTurn) c.waiting = false; // clear wait when turn starts
  });
  renderBattle(); autoSave();
}

function waitCombatant(idx) {
  initBattle();
  const arr = data.battle.combatants;
  if (!arr[idx]) return;
  const waitingName = arr[idx].name || 'Combatant';
  const wasActive = arr[idx].isTurn;

  const [moved] = arr.splice(idx, 1);
  moved.isTurn = false;
  moved.waiting = true;
  arr.push(moved);

  // If this combatant had the active turn, give it to whoever is now at their old index
  if (wasActive) {
    const nextIdx = Math.min(idx, arr.length - 1);
    const nextNonWaiting = arr.findIndex((c, i) => i >= nextIdx && !c.waiting);
    const giveIdx = nextNonWaiting !== -1 ? nextNonWaiting : -1;
    if (giveIdx !== -1) {
      arr[giveIdx].isTurn = true;
      renderBattle(); autoSave();
      showToast(`${waitingName} waits ⏸ — ${arr[giveIdx].name||'next'}'s turn ▶`);
      return;
    }
  }
  renderBattle(); autoSave();
  showToast(`${waitingName} is waiting — moved to end ⏸`);
}

// Wait button in the initiative strip — acts on whoever currently has isTurn
function waitCurrentCombatant() {
  initBattle();
  const arr = data.battle.combatants;
  const idx = arr.findIndex(c => c.isTurn);
  if (idx === -1) { showToast('No active character — click ▶ to set whose turn it is'); return; }
  const [moved] = arr.splice(idx, 1);
  moved.isTurn = false;
  moved.waiting = true;
  arr.push(moved);
  // Auto-advance turn to the new first combatant
  if (arr.length > 0 && !arr.some(c => c.isTurn)) {
    // give turn to whoever is now at idx (or last if we were last)
    const nextIdx = Math.min(idx, arr.length - 1);
    // don't auto-assign — just remove turn so DM can pick
  }
  renderBattle(); autoSave();
  showToast(`${moved.name||'Combatant'} is waiting — moved to end of order ⏸`);
}

// Next Character — advance isTurn to next in strip order
function nextCharacter() {
  initBattle();
  const arr = data.battle.combatants;
  if (arr.length === 0) return;
  const activeIdx = arr.findIndex(c => c.isTurn);
  if (activeIdx !== -1) arr[activeIdx].isTurn = false;
  const next = activeIdx + 1;

  if (next >= arr.length) {
    // End of round — start new round, re-sort by initiative, clear waiting
    data.battle.round++;
    data.battle.combatants.forEach(c => {
      c.waiting = false;
      c.effects = (c.effects||[]).map(ef => ({...ef, rounds: ef.rounds-1})).filter(ef => ef.rounds > 0);
    });
    data.battle.combatants.sort((a, b) => (b.initiative||0) - (a.initiative||0));
    if (data.battle.combatants.length > 0) {
      data.battle.combatants[0].isTurn = true;
    }
    renderBattle(); autoSave();
    showToast(`Round ${data.battle.round} begins — sorted by initiative ⚔`);
  } else {
    arr[next].isTurn = true;
    arr[next].waiting = false;
    renderBattle(); autoSave();
    showToast(`${arr[next].name||'Next combatant'}'s turn ▶`);
  }
}

// Wait/Delay — move current combatant to end, auto-advance turn to next in line
function waitCurrentCombatant() {
  initBattle();
  const arr = data.battle.combatants;
  const idx = arr.findIndex(c => c.isTurn);
  if (idx === -1) { showToast('No active character — click ▶ to set whose turn it is'); return; }
  const waitingName = arr[idx].name || 'Combatant';

  // Remove from current position, mark as waiting, push to end
  const [moved] = arr.splice(idx, 1);
  moved.isTurn = false;
  moved.waiting = true;
  arr.push(moved);

  // Auto-advance to whoever is now at that index (or last if we were last)
  const nextIdx = Math.min(idx, arr.length - 1);
  // Only give turn to next if they're not also waiting (skip waiters if possible)
  const nextNonWaiting = arr.findIndex((c, i) => i >= nextIdx && !c.waiting && !c.isTurn);
  const giveIdx = nextNonWaiting !== -1 ? nextNonWaiting : (arr.length > 1 ? nextIdx : -1);
  if (giveIdx !== -1 && arr[giveIdx] && arr[giveIdx] !== moved) {
    arr[giveIdx].isTurn = true;
    renderBattle(); autoSave();
    showToast(`${waitingName} waits ⏸ — ${arr[giveIdx].name||'next'}'s turn ▶`);
  } else {
    renderBattle(); autoSave();
    showToast(`${waitingName} is waiting — moved to end ⏸`);
  }
}

function quickHP(idx, dir) {
  initBattle();
  const c = data.battle.combatants[idx];
  if (!c) return;
  // Ask for amount
  const amt = parseInt(prompt(`Enter amount to ${dir>0?'heal':'damage'} ${c.name||'combatant'}:`));
  if (isNaN(amt)) return;
  c.hpCur = Math.max(0, c.hpCur + (dir * Math.abs(amt)));
  renderBattle(); autoSave();
}

function removeCombatant(idx) {
  initBattle();
  data.battle.combatants.splice(idx,1);
  renderBattle(); autoSave();
}

function addEffect(idx) {
  initBattle();
  const nameEl = document.getElementById('effectName_'+idx);
  const roundsEl = document.getElementById('effectRounds_'+idx);
  const name = nameEl?.value?.trim();
  const rounds = parseInt(roundsEl?.value) || 1;
  if (!name) return;
  data.battle.combatants[idx].effects = data.battle.combatants[idx].effects || [];
  data.battle.combatants[idx].effects.push({name, rounds});
  if (nameEl) nameEl.value = '';
  renderBattle(); autoSave();
}

function removeEffect(cIdx, eIdx) {
  initBattle();
  data.battle.combatants[cIdx].effects.splice(eIdx,1);
  renderBattle(); autoSave();
}

function nextRound() {
  initBattle();
  data.battle.round++;
  // Clear all waiting flags and tick down effects
  data.battle.combatants.forEach(c => {
    c.waiting = false;
    c.effects = (c.effects||[]).map(ef => ({...ef, rounds: ef.rounds-1})).filter(ef => ef.rounds > 0);
  });
  // Re-sort by initiative descending at the start of each new round
  data.battle.combatants.sort((a, b) => (b.initiative||0) - (a.initiative||0));
  // Give turn to first combatant
  data.battle.combatants.forEach((c, i) => c.isTurn = (i === 0));
  renderBattle(); autoSave();
  showToast(`Round ${data.battle.round} begins — re-sorted by initiative ⚔`);
}

function prevRound() {
  initBattle();
  if (data.battle.round > 1) data.battle.round--;
  renderBattle(); autoSave();
}

function sortByInitiative() {
  initBattle();
  data.battle.combatants.sort((a,b) => (b.initiative||0) - (a.initiative||0));
  renderBattle(); autoSave();
  showToast('Sorted by initiative ⬆');
}

function dragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }

function drop(e, lane) {
  e.preventDefault();
  if (dragSrc === null) return;
  initBattle();
  data.battle.combatants[dragSrc].lane = lane;
  dragSrc = null;
  renderBattle(); autoSave();
}

function confirmClearBattle() {
  showModal('Reset Battle', `
    <p style="color:var(--text-secondary);font-size:15px;line-height:1.6;margin-bottom:14px;">What should be reset?</p>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button class="btn btn-silver" style="text-align:left;padding:10px 14px;" onclick="battleResetMonsters()">
        💀 <strong>Remove only monsters</strong><br>
        <span style="font-size:11px;color:var(--text-muted);">Party and NPCs stay. Round resets to 1.</span>
      </button>
      <button class="btn btn-silver" style="text-align:left;padding:10px 14px;" onclick="battleResetAll()">
        ↺ <strong>Reset everything</strong><br>
        <span style="font-size:11px;color:var(--text-muted);">All combatants removed, round → 1.</span>
      </button>
    </div>
  `, [{label:'Cancel', action:'closeModal()', cls:'btn-silver'}]);
}

function toggleAbsent(idx) {
  initBattle();
  const c = data.battle.combatants[idx];
  if (!c) return;
  c.absent = !c.absent;
  if (c.absent) c.isTurn = false; // can't be active if absent
  renderBattle(); autoSave();
  showToast(c.absent ? (c.name||'Combatant') + ' sitting out 👁' : (c.name||'Combatant') + ' back in fight ⚔');
}

function battleResetMonsters() {
  initBattle();
  data.battle.combatants = data.battle.combatants.filter(c => c.lane !== 'monster');
  // Clear isTurn on all, reset round
  data.battle.combatants.forEach(c => { c.isTurn = false; c.waiting = false; c.effects = []; });
  data.battle.round = 1;
  renderBattle(); autoSave(); closeModal();
  showToast('Monsters cleared, party & NPCs kept ⚔');
}

function battleResetAll() {
  data.battle = {round:1, combatants:[]};
  renderBattle(); autoSave(); closeModal();
  showToast('Battle fully reset ⚔');
}

function uploadCombatantPhoto(idx) {
  const input = document.createElement('input');
  input.type='file'; input.accept='image/*';
  input.onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      data.battle.combatants[idx].photo = ev.target.result;
      renderBattle(); autoSave();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ═══════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════
loadData();
initAll();
// Render compendium lists on page load so they appear immediately
setTimeout(() => { renderSpellList(); renderItemList(); }, 0);

// ═══════════════════════════════════════════
