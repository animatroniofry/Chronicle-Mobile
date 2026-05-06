// ═══════════════════════════════════════════
//  notes.js - PAGINATION, NOTES, LORE, DICE ROLLER
// ═══════════════════════════════════════════

//  PAGINATION SYSTEM
// ═══════════════════════════════════════════
const _pageState = {
  npc:          { page: 0, perPage: 10 },
  quest:        { page: 0, perPage: 10 },
  playerNotes:  { page: 0, perPage: 10 },
  journal:      { page: 0, perPage: 10 },
  bestiary:     { page: 0, perPage: 10 },
  generalNotes: { page: 0, perPage: 10 },
  loreNotes:    { page: 0, perPage: 10 },
};

function renderPagination(containerId, sectionKey, filteredCount) {
  const existing = document.getElementById('pagination-' + sectionKey);
  if (existing) existing.remove();

  const ps = _pageState[sectionKey];
  const perPage = ps.perPage;
  const totalPages = perPage === 9999 ? 1 : Math.ceil(filteredCount / perPage);
  if (filteredCount === 0) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  const nav = document.createElement('div');
  nav.id = 'pagination-' + sectionKey;
  nav.style.cssText = 'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding:10px 4px 2px;border-top:1px solid var(--border-dark);margin-top:8px;';

  const perPageOptions = [10,25,50,100];
  const perPageHtml = perPageOptions.map(n =>
    `<option value="${n}"${perPage===n?' selected':''}>${n}</option>`
  ).join('');

  const startItem = perPage === 9999 ? 1 : ps.page * perPage + 1;
  const endItem   = perPage === 9999 ? filteredCount : Math.min((ps.page + 1) * perPage, filteredCount);
  const info      = `<span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:0.5px;">${startItem}–${endItem} z ${filteredCount}</span>`;

  const prevDisabled = ps.page === 0 ? 'disabled' : '';
  const nextDisabled = ps.page >= totalPages - 1 ? 'disabled' : '';

  const btnStyle = 'font-family:\'Cinzel\',serif;font-size:11px;padding:3px 10px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-secondary);cursor:pointer;';
  const btnDisabledStyle = 'opacity:0.35;cursor:not-allowed;pointer-events:none;';

  // Page buttons (max 5 visible)
  let pageButtons = '';
  if (totalPages > 1) {
    const maxVisible = 5;
    let startPage = Math.max(0, ps.page - Math.floor(maxVisible / 2));
    let endPage   = Math.min(totalPages, startPage + maxVisible);
    if (endPage - startPage < maxVisible) startPage = Math.max(0, endPage - maxVisible);

    for (let p = startPage; p < endPage; p++) {
      const activeStyle = p === ps.page ? 'background:var(--bg-mid);border-color:var(--border-gold);color:var(--accent-gold);' : '';
      pageButtons += `<button style="${btnStyle}${activeStyle}" onclick="_goPage('${sectionKey}',${p})">${p+1}</button>`;
    }
  }

  nav.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
      <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);">Na stránku:</span>
      <select style="font-family:'Cinzel',serif;font-size:11px;padding:3px 6px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-secondary);"
        onchange="_setPerPage('${sectionKey}',+this.value)">${perPageHtml}</select>
      ${info}
    </div>
    <div style="display:flex;align-items:center;gap:4px;">
      <button style="${btnStyle}${prevDisabled?btnDisabledStyle:''}" onclick="_goPage('${sectionKey}',${ps.page-1})" ${prevDisabled}>‹ Späť</button>
      ${pageButtons}
      <button style="${btnStyle}${nextDisabled?btnDisabledStyle:''}" onclick="_goPage('${sectionKey}',${ps.page+1})" ${nextDisabled}>Ďalej ›</button>
    </div>
  `;

  container.after(nav);
}

function _goPage(key, page) {
  _pageState[key].page = page;
  if      (key==='npc')          renderNPCs();
  else if (key==='quest')        renderQuests();
  else if (key==='playerNotes')  renderPlayerNotes();
  else if (key==='journal')      renderJournal();
  else if (key==='bestiary')     renderPlayerBestiary();
  else if (key==='generalNotes') renderGeneralNotes();
  else if (key==='loreNotes')    renderLoreNotes();
}

function _setPerPage(key, val) {
  _pageState[key].perPage = val;
  _pageState[key].page = 0;
  if      (key==='npc')          renderNPCs();
  else if (key==='quest')        renderQuests();
  else if (key==='playerNotes')  renderPlayerNotes();
  else if (key==='journal')      renderJournal();
  else if (key==='bestiary')     renderPlayerBestiary();
  else if (key==='generalNotes') renderGeneralNotes();
  else if (key==='loreNotes')    renderLoreNotes();
}

function _applyPagination(filtered, key) {
  const ps = _pageState[key];
  if (ps.perPage === 9999) return filtered;
  const start = ps.page * ps.perPage;
  return filtered.slice(start, start + ps.perPage);
}

// ─── END PAGINATION ───

function renderPlayerNotes() {
  const container = document.getElementById('playerNoteList');
  if (!container) return;
  const search = (document.getElementById('playerNoteSearch')?.value || '').toLowerCase();

  const filtered = [];
  (data.playerNotes||[]).forEach((pn, i) => {
    if (search) {
      const hay = ((pn.name||'') + ' ' + (pn.player||'') + ' ' + (pn.class||'') + ' ' + (pn.notes||'') + ' ' + (pn.secrets||'')).toLowerCase();
      if (!hay.includes(search)) return;
    }
    filtered.push({pn, i});
  });

  const totalFiltered = filtered.length;
  // Clamp page if needed
  const ps_pn = _pageState.playerNotes;
  const maxPage_pn = ps_pn.perPage === 9999 ? 0 : Math.max(0, Math.ceil(totalFiltered / ps_pn.perPage) - 1);
  if (ps_pn.page > maxPage_pn) ps_pn.page = maxPage_pn;

  const pagedFiltered = _applyPagination(filtered, 'playerNotes');

  container.innerHTML = '';

  if (totalFiltered === 0 && (data.playerNotes||[]).length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;">No player notes yet. Add notes about your party members!</div>';
    renderPagination('playerNoteList', 'playerNotes', totalFiltered);
    return;
  }
  if (totalFiltered === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;">No notes match the search.</div>';
    renderPagination('playerNoteList', 'playerNotes', totalFiltered);
    return;
  }

  const REL_LIST = ['Unknown','Friend','Ally','Neutral','Rival','Suspicious'];
  pagedFiltered.forEach(({pn, i}) => {
    const rel = pn.relation || 'Unknown';
    const relColor = RELATION_COLORS[rel] || '#2a2a4a';
    const relIcon = RELATION_ICONS[rel] || '❓';
    const relOpts = REL_LIST.map(r =>
      `<option value="${r}"${rel===r?' selected':''}>${RELATION_ICONS[r]} ${r}</option>`
    ).join('');

    const div = document.createElement('div');
    div.className = 'player-note-card' + (pn._open ? ' expanded' : '');
    div.dataset.cardIdx = i;
    div.style.borderLeftColor = relColor;

    div.innerHTML = `
      <div class="player-note-card-header" onclick="toggleCard(this,'player-note-card')">
        <span class="pn-chevron">▶</span>
        <div style="width:34px;height:34px;border-radius:50%;background:${relColor}40;border:1.5px solid ${relColor};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${relIcon}</div>
        <div style="flex:1;min-width:0;overflow:hidden;">
          <div style="font-family:'IM Fell English',serif;font-size:17px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" class="pn-header-name">${pn.name||'<em style=color:var(--text-muted)>Unnamed Player</em>'}</div>
          ${pn.class||pn.player ? `<div class="pn-header-sub" style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);letter-spacing:1px;margin-top:1px;">${[pn.class,pn.player].filter(Boolean).join(' · ')}</div>` : `<div class="pn-header-sub" style="display:none;font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);letter-spacing:1px;margin-top:1px;"></div>`}
        </div>
        <span style="font-family:'Cinzel',serif;font-size:10px;color:${relColor};border:1px solid ${relColor}44;border-radius:3px;padding:2px 7px;white-space:nowrap;flex-shrink:0;">${relIcon} ${rel}</span>
        <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();data.playerNotes.splice(${i},1);renderPlayerNotes();autoSave()">🗑</button>
      </div>
      <div class="player-note-card-body" onclick="event.stopPropagation()">
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-bottom:8px;align-items:end;">
          <div class="field" style="margin:0;">
            <label>Character Name</label>
            <input type="text" value="${pn.name||''}" placeholder="Character name…" style="font-family:'IM Fell English',serif;font-size:16px;" oninput="data.playerNotes[${i}].name=this.value;autoSave();(function(el){var card=el.closest('.player-note-card');if(!card)return;var nameEl=card.querySelector('.pn-header-name');if(nameEl)nameEl.innerHTML=el.value||'<em style=color:var(--text-muted)>Unnamed Player</em>';})(this)">
          </div>
          <div class="field" style="margin:0;">
            <label>Class / Race</label>
            <input type="text" value="${pn.class||''}" placeholder="e.g. Human Paladin" style="font-size:13px;" oninput="data.playerNotes[${i}].class=this.value;autoSave();(function(el){var card=el.closest('.player-note-card');if(!card)return;var sub=card.querySelector('.pn-header-sub');if(!sub)return;var cls=el.value;var plr=data.playerNotes[${i}].player||'';sub.style.display=(cls||plr)?'':'none';sub.textContent=[cls,plr].filter(Boolean).join(' \u00b7 ');})(this)">
          </div>
          <div class="field" style="margin:0;">
            <label>Relation</label>
            <select style="font-size:12px;" onchange="data.playerNotes[${i}].relation=this.value;renderPlayerNotes();autoSave()">
              ${relOpts}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Player Name</label>
          <input type="text" value="${pn.player||''}" placeholder="Player's real name…" style="font-size:13px;" oninput="data.playerNotes[${i}].player=this.value;autoSave();(function(el){var card=el.closest('.player-note-card');if(!card)return;var sub=card.querySelector('.pn-header-sub');if(!sub)return;var plr=el.value;var cls=data.playerNotes[${i}].class||'';sub.style.display=(cls||plr)?'':'none';sub.textContent=[cls,plr].filter(Boolean).join(' \u00b7 ');})(this)">
        </div>
        <div class="field">
          <label>What I know about them</label>
          <textarea rows="3" placeholder="Background, personality, strengths, story arcs you noticed…" oninput="data.playerNotes[${i}].notes=this.value;autoSave()">${pn.notes||''}</textarea>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>🤫 Secrets / Suspicions</label>
          <textarea rows="2" placeholder="Secrets discovered, suspicious behaviour, private theories…" oninput="data.playerNotes[${i}].secrets=this.value;autoSave()">${pn.secrets||''}</textarea>
        </div>
        <div class="field" style="margin-bottom:0;margin-top:8px;">
          <label style="display:flex;align-items:center;gap:6px;">
            🏷 Kľúčové slová / Prezývky
            <span style="font-family:'Crimson Text',serif;font-size:11px;color:var(--text-muted);font-style:italic;font-weight:normal;">— session notes ich rozozná</span>
          </label>
          <input type="text" value="${pn.keywords||''}" placeholder="napr. Torvin, trpaslík, paladin, tank, môj hráč…" style="font-size:13px;" oninput="data.playerNotes[${i}].keywords=this.value;autoSave()">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  renderPagination('playerNoteList', 'playerNotes', totalFiltered);
}

function addNPC() {
  data.npcs = data.npcs || [];
  data.npcs.unshift({name:'', role:'', location:'', attitude:'', notes:'', _open:true});
  _pageState.npc.page = 0;
  renderNPCs();
}

function renderNPCs() {
  const container = document.getElementById('npcList');
  if (!container) return;
  const attitudeFilter = document.getElementById('npcAttitudeFilter')?.value || '';
  const searchFilter = (document.getElementById('npcSearch')?.value || '').toLowerCase();
  const ATTITUDE_COLORS = {
    Friendly: '#2a5a1a', Ally: '#5a5a10', Neutral: '#3a3a3a',
    Unknown: '#2a2a4a', Hostile: '#6a3a10', Enemy: '#6a1a1a'
  };
  const ATTITUDE_ICONS = {
    Friendly:'🟢', Ally:'💛', Neutral:'⚪', Unknown:'❓', Hostile:'🟠', Enemy:'🔴'
  };
  const ATTITUDE_LIST = ['Unknown','Friendly','Neutral','Hostile','Ally','Enemy'];

  const filtered = [];
  (data.npcs||[]).forEach((npc, i) => {
    const att = npc.attitude || '';
    if (attitudeFilter && att !== attitudeFilter) return;
    if (searchFilter) {
      const hay = ((npc.name||'') + ' ' + (npc.role||'') + ' ' + (npc.location||'') + ' ' + (npc.notes||'')).toLowerCase();
      if (!hay.includes(searchFilter)) return;
    }
    filtered.push({npc, i});
  });

  container.innerHTML = '';

  const totalFilteredNPC = filtered.length;
  const ps_npc = _pageState.npc;
  const maxPage_npc = ps_npc.perPage === 9999 ? 0 : Math.max(0, Math.ceil(totalFilteredNPC / ps_npc.perPage) - 1);
  if (ps_npc.page > maxPage_npc) ps_npc.page = maxPage_npc;
  const pagedNPC = _applyPagination(filtered, 'npc');

  if (totalFilteredNPC === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;">No NPCs match the filter.</div>';
    renderPagination('npcList', 'npc', totalFilteredNPC);
    return;
  }

  pagedNPC.forEach(({npc, i}) => {
    const borderColor = ATTITUDE_COLORS[npc.attitude] || '#8a6a28';
    const attIcon = ATTITUDE_ICONS[npc.attitude] || '❓';
    const attLabel = npc.attitude || 'Unknown';
    const attOptions = ATTITUDE_LIST.map(a =>
      `<option value="${a}"${npc.attitude===a?' selected':''}>${ATTITUDE_ICONS[a]} ${a}</option>`
    ).join('');
    const locBadge = npc.location
      ? `<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);border:1px solid var(--border-dark);border-radius:3px;padding:1px 6px;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;">${npc.location.slice(0,18)}${npc.location.length>18?'…':''}</span>`
      : '';

    const div = document.createElement('div');
    div.className = 'npc-card' + (npc._open ? ' expanded' : '');
    div.dataset.cardIdx = i;
    div.style.borderLeftColor = borderColor;
    div.innerHTML = `
      <div class="npc-card-header" onclick="toggleCard(this,'npc-card')">
        <span class="npc-chevron">▶</span>
        <div style="flex:1;min-width:0;overflow:hidden;">
          <span data-npc-name style="font-family:'IM Fell English',serif;font-size:17px;color:var(--text-primary);">${npc.name||'<em style=color:var(--text-muted)>Unnamed NPC</em>'}</span>
          <span data-npc-role style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);margin-left:8px;">${npc.role ? '· ' + npc.role : ''}</span>
        </div>
        <span style="font-size:14px;">${attIcon}</span>
        <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);flex-shrink:0;">${attLabel}</span>
        <span data-npc-loc style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);border:1px solid var(--border-dark);border-radius:3px;padding:1px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;${npc.location ? '' : 'display:none;'}">${npc.location ? npc.location.slice(0,16)+(npc.location.length>16?'…':'') : ''}</span>
        <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();data.npcs.splice(${i},1);renderNPCs();autoSave()">🗑</button>
      </div>
      <div class="npc-card-body" onclick="event.stopPropagation()">
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-top:10px;margin-bottom:8px;align-items:end;">
          <div class="field" style="margin:0;">
            <label>Name</label>
            <input type="text" value="${npc.name||''}" placeholder="NPC name…" style="font-family:'IM Fell English',serif;font-size:16px;" oninput="data.npcs[${i}].name=this.value;autoSave();refreshNPCHeader(this)">
          </div>
          <div class="field" style="margin:0;">
            <label>Role / Title</label>
            <input type="text" value="${npc.role||''}" placeholder="e.g. Innkeeper" style="font-size:13px;" oninput="data.npcs[${i}].role=this.value;autoSave();refreshNPCHeader(this)">
          </div>
          <div class="field" style="margin:0;">
            <label>Attitude</label>
            <select style="font-size:12px;" data-npc-idx="${i}" onchange="updateNPCAttitude(this)">
              ${attOptions}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Location / Faction</label>
          <input type="text" value="${npc.location||''}" placeholder="Location / Faction…" style="font-size:13px;" oninput="data.npcs[${i}].location=this.value;autoSave();refreshNPCHeader(this)">
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>Notes</label>
          <textarea rows="3" placeholder="Notes about this NPC…" oninput="data.npcs[${i}].notes=this.value;autoSave()">${npc.notes||''}</textarea>
        </div>
        <div class="field" style="margin-bottom:0;margin-top:8px;">
          <label style="display:flex;align-items:center;gap:6px;">
            🏷 Kľúčové slová / Prezývky
            <span style="font-family:'Crimson Text',serif;font-size:11px;color:var(--text-muted);font-style:italic;font-weight:normal;">— session notes ich rozozná</span>
          </label>
          <input type="text" value="${npc.keywords||''}" placeholder="napr. stará čarodějnica, Morwen, hádačka, obchodník s mágiou…" style="font-size:13px;" oninput="data.npcs[${i}].keywords=this.value;autoSave()">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  renderPagination('npcList', 'npc', totalFilteredNPC);

}

// ═══════════════════════════════════════════
//  GENERAL NOTES
// ═══════════════════════════════════════════
const GENERAL_NOTE_CAT_ICONS = {
  'Plot Hook':'🎣', 'Clue':'🔍', 'Reminder':'⏰', 'NPC Hint':'💬', 'Other':'📌'
};
const GENERAL_NOTE_CAT_COLORS = {
  'Plot Hook':'#2a4a6a', 'Clue':'#3a5a2a', 'Reminder':'#5a4a10',
  'NPC Hint':'#3a2a5a', 'Other':'#3a3a3a'
};

function addGeneralNote() {
  data.generalNotes = data.generalNotes || [];
  data.generalNotes.unshift({ title:'', category:'Other', content:'', tags:'', _open:true });
  _pageState.generalNotes.page = 0;
  renderGeneralNotes();
}

function renderGeneralNotes() {
  const container = document.getElementById('generalNoteList');
  if (!container) return;
  const catFilter  = document.getElementById('generalNoteCatFilter')?.value || '';
  const search     = (document.getElementById('generalNoteSearch')?.value || '').toLowerCase();

  // migrate legacy string → array
  if (typeof data.generalNotes === 'string') {
    const old = data.generalNotes;
    data.generalNotes = old.trim() ? [{ title:'Old Notes', category:'Other', content:old, tags:'', _open:true }] : [];
    autoSave();
  }

  const filtered = [];
  (data.generalNotes||[]).forEach((n, i) => {
    if (catFilter && n.category !== catFilter) return;
    if (search) {
      const hay = ((n.title||'') + ' ' + (n.content||'') + ' ' + (n.tags||'') + ' ' + (n.category||'')).toLowerCase();
      if (!hay.includes(search)) return;
    }
    filtered.push({n, i});
  });

  container.innerHTML = '';

  const total = filtered.length;
  const ps = _pageState.generalNotes;
  const maxPage = ps.perPage === 9999 ? 0 : Math.max(0, Math.ceil(total / ps.perPage) - 1);
  if (ps.page > maxPage) ps.page = maxPage;
  const paged = _applyPagination(filtered, 'generalNotes');

  if (total === 0 && (data.generalNotes||[]).length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;">No notes yet. Add the first one!</div>';
    renderPagination('generalNoteList', 'generalNotes', total);
    return;
  }
  if (total === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;">No notes match the filter.</div>';
    renderPagination('generalNoteList', 'generalNotes', total);
    return;
  }

  const CAT_LIST = ['Plot Hook','Clue','Reminder','NPC Hint','Other'];

  paged.forEach(({n, i}) => {
    const catIcon  = GENERAL_NOTE_CAT_ICONS[n.category]  || '📌';
    const catColor = GENERAL_NOTE_CAT_COLORS[n.category] || '#3a3a3a';
    const catOpts  = CAT_LIST.map(c => `<option value="${c}"${n.category===c?' selected':''}>${GENERAL_NOTE_CAT_ICONS[c]} ${c}</option>`).join('');

    const div = document.createElement('div');
    div.className = 'npc-card' + (n._open ? ' expanded' : '');
    div.dataset.cardIdx = i;
    div.dataset.cardType = 'gnote';
    div.style.borderLeftColor = catColor;
    div.innerHTML = `
      <div class="npc-card-header" onclick="toggleCard(this,'npc-card')">
        <span class="npc-chevron">▶</span>
        <div style="flex:1;min-width:0;overflow:hidden;">
          <span style="font-family:'IM Fell English',serif;font-size:17px;color:var(--text-primary);">${n.title||'<em style=color:var(--text-muted)>Bez názvu</em>'}</span>
        </div>
        <span style="font-size:14px;">${catIcon}</span>
        <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);flex-shrink:0;">${n.category||'Other'}</span>
        ${n.tags ? `<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);border:1px solid var(--border-dark);border-radius:3px;padding:1px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;">${n.tags.slice(0,20)}${n.tags.length>20?'…':''}</span>` : ''}
        <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();data.generalNotes.splice(${i},1);renderGeneralNotes();autoSave()">🗑</button>
      </div>
      <div class="npc-card-body" onclick="event.stopPropagation()">
        <div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px;margin-bottom:8px;align-items:end;">
          <div class="field" style="margin:0;">
            <label>Title</label>
            <input type="text" value="${n.title||''}" placeholder="Note title…" style="font-family:'IM Fell English',serif;font-size:16px;"
              oninput="data.generalNotes[${i}].title=this.value;autoSave();(function(el){var h=el.closest('.npc-card')?.querySelector('.npc-card-header div span');if(h)h.innerHTML=el.value||'<em style=color:var(--text-muted)>Bez názvu</em>';})(this)">
          </div>
          <div class="field" style="margin:0;">
            <label>Kategória</label>
            <select style="font-size:12px;" onchange="data.generalNotes[${i}].category=this.value;renderGeneralNotes();autoSave()">${catOpts}</select>
          </div>
        </div>
        <div class="field">
          <label>Obsah</label>
          <textarea rows="4" placeholder="Napíš poznámku…" oninput="data.generalNotes[${i}].content=this.value;autoSave()">${n.content||''}</textarea>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>Tagy</label>
          <input type="text" value="${n.tags||''}" placeholder="napr. goblin, dungeon, Aldric…" style="font-size:13px;" oninput="data.generalNotes[${i}].tags=this.value;autoSave()">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  renderPagination('generalNoteList', 'generalNotes', total);
}

// ═══════════════════════════════════════════
//  LORE NOTES
// ═══════════════════════════════════════════
const LORE_NOTE_CAT_ICONS = {
  'Location':'🗺', 'Faction':'⚔', 'History':'📖', 'Magic':'✨', 'Deity':'🙏', 'Other':'📌'
};
const LORE_NOTE_CAT_COLORS = {
  'Location':'#2a5a3a', 'Faction':'#5a2a2a', 'History':'#4a3a1a',
  'Magic':'#2a2a5a', 'Deity':'#4a2a4a', 'Other':'#3a3a3a'
};

function addLoreNote() {
  data.loreNotes = data.loreNotes || [];
  data.loreNotes.unshift({ title:'', category:'Other', content:'', region:'', _open:true });
  _pageState.loreNotes.page = 0;
  renderLoreNotes();
}

function renderLoreNotes() {
  const container = document.getElementById('loreNoteList');
  if (!container) return;
  const catFilter = document.getElementById('loreNoteCatFilter')?.value || '';
  const search    = (document.getElementById('loreNoteSearch')?.value || '').toLowerCase();

  // migrate legacy string → array
  if (typeof data.loreNotes === 'string') {
    const old = data.loreNotes;
    data.loreNotes = old.trim() ? [{ title:'Old Lore Notes', category:'Other', content:old, region:'', _open:true }] : [];
    autoSave();
  }

  const filtered = [];
  (data.loreNotes||[]).forEach((n, i) => {
    if (catFilter && n.category !== catFilter) return;
    if (search) {
      const hay = ((n.title||'') + ' ' + (n.content||'') + ' ' + (n.region||'') + ' ' + (n.category||'')).toLowerCase();
      if (!hay.includes(search)) return;
    }
    filtered.push({n, i});
  });

  container.innerHTML = '';

  const total = filtered.length;
  const ps = _pageState.loreNotes;
  const maxPage = ps.perPage === 9999 ? 0 : Math.max(0, Math.ceil(total / ps.perPage) - 1);
  if (ps.page > maxPage) ps.page = maxPage;
  const paged = _applyPagination(filtered, 'loreNotes');

  if (total === 0 && (data.loreNotes||[]).length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;">No lore entries yet. Add the first one!</div>';
    renderPagination('loreNoteList', 'loreNotes', total);
    return;
  }
  if (total === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;">No entries match the filter.</div>';
    renderPagination('loreNoteList', 'loreNotes', total);
    return;
  }

  const CAT_LIST = ['Location','Faction','History','Magic','Deity','Other'];

  paged.forEach(({n, i}) => {
    const catIcon  = LORE_NOTE_CAT_ICONS[n.category]  || '📌';
    const catColor = LORE_NOTE_CAT_COLORS[n.category] || '#3a3a3a';
    const catOpts  = CAT_LIST.map(c => `<option value="${c}"${n.category===c?' selected':''}>${LORE_NOTE_CAT_ICONS[c]} ${c}</option>`).join('');

    const div = document.createElement('div');
    div.className = 'npc-card' + (n._open ? ' expanded' : '');
    div.dataset.cardIdx = i;
    div.dataset.cardType = 'lnote';
    div.style.borderLeftColor = catColor;
    div.innerHTML = `
      <div class="npc-card-header" onclick="toggleCard(this,'npc-card')">
        <span class="npc-chevron">▶</span>
        <div style="flex:1;min-width:0;overflow:hidden;">
          <span style="font-family:'IM Fell English',serif;font-size:17px;color:var(--text-primary);">${n.title||'<em style=color:var(--text-muted)>Bez názvu</em>'}</span>
        </div>
        <span style="font-size:14px;">${catIcon}</span>
        <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);flex-shrink:0;">${n.category||'Other'}</span>
        ${n.region ? `<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);border:1px solid var(--border-dark);border-radius:3px;padding:1px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;">${n.region.slice(0,20)}${n.region.length>20?'…':''}</span>` : ''}
        <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();data.loreNotes.splice(${i},1);renderLoreNotes();autoSave()">🗑</button>
      </div>
      <div class="npc-card-body" onclick="event.stopPropagation()">
        <div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px;margin-bottom:8px;align-items:end;">
          <div class="field" style="margin:0;">
            <label>Title</label>
            <input type="text" value="${n.title||''}" placeholder="Entry title…" style="font-family:'IM Fell English',serif;font-size:16px;"
              oninput="data.loreNotes[${i}].title=this.value;autoSave();(function(el){var h=el.closest('.npc-card')?.querySelector('.npc-card-header div span');if(h)h.innerHTML=el.value||'<em style=color:var(--text-muted)>Bez názvu</em>';})(this)">
          </div>
          <div class="field" style="margin:0;">
            <label>Kategória</label>
            <select style="font-size:12px;" onchange="data.loreNotes[${i}].category=this.value;renderLoreNotes();autoSave()">${catOpts}</select>
          </div>
        </div>
        <div class="field">
          <label>Región / Svet</label>
          <input type="text" value="${n.region||''}" placeholder="napr. Forgotten Realms, Waterdeep…" style="font-size:13px;" oninput="data.loreNotes[${i}].region=this.value;autoSave()">
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>Obsah</label>
          <textarea rows="5" placeholder="Opíš lore, históriu, detaily…" oninput="data.loreNotes[${i}].content=this.value;autoSave()">${n.content||''}</textarea>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  renderPagination('loreNoteList', 'loreNotes', total);
}

function toggleCard(headerEl, cardClass) {
  const card = headerEl.closest('.' + cardClass);
  if (!card) return;
  const isNowExpanded = card.classList.toggle('expanded');
  const idx = card.dataset.cardIdx;
  const cardType = card.dataset.cardType;
  if (idx !== undefined) {
    if (cardType === 'gnote' && data.generalNotes) {
      data.generalNotes[parseInt(idx)]._open = isNowExpanded;
    } else if (cardType === 'lnote' && data.loreNotes) {
      data.loreNotes[parseInt(idx)]._open = isNowExpanded;
    } else if (cardClass === 'npc-card' && data.npcs && !cardType) {
      data.npcs[parseInt(idx)]._open = isNowExpanded;
    } else if (cardClass === 'quest-card' && data.quests) {
      data.quests[parseInt(idx)]._open = isNowExpanded;
    } else if (cardClass === 'player-note-card' && data.playerNotes) {
      data.playerNotes[parseInt(idx)]._open = isNowExpanded;
    }
    autoSave();
  }
}

function refreshNPCHeader(inputEl) {
  // Update the header name/role/location preview directly in DOM — no full re-render
  const card = inputEl.closest('.npc-card');
  if (!card) return;
  const idx = parseInt(card.dataset.cardIdx);
  if (isNaN(idx) || !data.npcs || !data.npcs[idx]) return;
  const npc = data.npcs[idx];

  // Update name span (uses data-npc-name attribute — no duplicate creation possible)
  const nameSpan = card.querySelector('[data-npc-name]');
  if (nameSpan) nameSpan.innerHTML = npc.name || '<em style=color:var(--text-muted)>Unnamed NPC</em>';

  // Update role span (uses data-npc-role attribute)
  const roleSpan = card.querySelector('[data-npc-role]');
  if (roleSpan) roleSpan.textContent = npc.role ? '\u00b7 ' + npc.role : '';

  // Update location badge (uses data-npc-loc attribute)
  const locSpan = card.querySelector('[data-npc-loc]');
  if (locSpan) {
    if (npc.location) {
      locSpan.textContent = npc.location.slice(0,16) + (npc.location.length > 16 ? '\u2026' : '');
      locSpan.style.display = '';
    } else {
      locSpan.textContent = '';
      locSpan.style.display = 'none';
    }
  }
}

function refreshQuestHeader(inputEl) {
  // Update the header title/reward preview directly in DOM - no full re-render
  const card = inputEl.closest('.quest-card');
  if (!card) return;
  const idx = parseInt(card.dataset.cardIdx);
  if (isNaN(idx) || !data.quests || !data.quests[idx]) return;
  const q = data.quests[idx];
  const headerDiv = card.querySelector('.quest-card-header > div');
  if (headerDiv) {
    const titleSpan = headerDiv.querySelector('span:first-child');
    if (titleSpan) titleSpan.innerHTML = q.title || '<em style=color:var(--text-muted)>Unnamed Quest</em>';
    let rewardSpan = headerDiv.querySelector('span:nth-child(2)');
    if (q.reward) {
      const rewardText = String.fromCodePoint(0x1F3C6) + ' ' + q.reward.slice(0,30) + (q.reward.length > 30 ? '…' : '');
      if (!rewardSpan) {
        rewardSpan = document.createElement('span');
        rewardSpan.style.cssText = "font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);margin-left:8px;";
        headerDiv.appendChild(rewardSpan);
      }
      rewardSpan.textContent = rewardText;
    } else if (rewardSpan) {
      rewardSpan.textContent = '';
    }
  }
}

function updateNPCAttitude(selectEl) {
  const i = parseInt(selectEl.dataset.npcIdx);
  const val = selectEl.value;
  data.npcs[i].attitude = val;
  autoSave();
  // Update border color of the parent card without re-rendering
  const ATTITUDE_COLORS = {
    Friendly: '#2a5a1a', Ally: '#5a5a10', Neutral: '#3a3a3a',
    Unknown: '#2a2a4a', Hostile: '#6a3a10', Enemy: '#6a1a1a'
  };
  const card = selectEl.closest('.npc-card');
  if (card) card.style.borderLeftColor = ATTITUDE_COLORS[val] || '#8a6a28';
  // Re-apply filter if active
  const attitudeFilter = document.getElementById('npcAttitudeFilter')?.value || '';
  if (attitudeFilter && val !== attitudeFilter) {
    renderNPCs();
  }
}

function addQuest() {
  data.quests = data.quests || [];
  data.quests.unshift({title:'', status:'Active', _open:true, desc:'', reward:''});
  _pageState.quest.page = 0;
  renderQuests();
}

function renderQuests() {
  const container = document.getElementById('questList');
  if (!container) return;
  const statusFilter = document.getElementById('questStatusFilter')?.value || '';
  const searchFilter = (document.getElementById('questSearch')?.value || '').toLowerCase();
  const STATUS_ICONS = {Active:'⚔',Completed:'✅',Failed:'❌','On Hold':'⏸'};
  const STATUS_COLORS = {Active:'var(--accent-gold)',Completed:'#60c070',Failed:'var(--accent-red-bright)','On Hold':'#6090c0'};

  const filtered = [];
  (data.quests||[]).forEach((q, i) => {
    const qs = q.status || 'Active';
    if (statusFilter && qs !== statusFilter) return;
    if (searchFilter) {
      const hay = ((q.title||'') + ' ' + (q.desc||'') + ' ' + (q.reward||'')).toLowerCase();
      if (!hay.includes(searchFilter)) return;
    }
    filtered.push({q, i});
  });

  container.innerHTML = '';

  const totalFilteredQ = filtered.length;
  const ps_q = _pageState.quest;
  const maxPage_q = ps_q.perPage === 9999 ? 0 : Math.max(0, Math.ceil(totalFilteredQ / ps_q.perPage) - 1);
  if (ps_q.page > maxPage_q) ps_q.page = maxPage_q;
  const pagedQuests = _applyPagination(filtered, 'quest');

  if (totalFilteredQ === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;">No quests match the filter.</div>';
    renderPagination('questList', 'quest', totalFilteredQ);
    return;
  }

  pagedQuests.forEach(({q, i}) => {
    const qs = q.status || 'Active';
    const statusColor = STATUS_COLORS[qs] || 'var(--accent-gold)';
    const statusIcon = STATUS_ICONS[qs] || '⚔';
    const statusOpts = ['Active','Completed','Failed','On Hold'].map(s =>
      `<option value="${s}"${qs===s?' selected':''}>${STATUS_ICONS[s]||''} ${s}</option>`
    ).join('');
    const STATUS_TEXT_COLORS = {
      Active:'var(--accent-gold)', Completed:'#60c070',
      Failed:'var(--accent-red-bright)', 'On Hold':'#6090c0'
    };
    const stc = STATUS_TEXT_COLORS[qs] || 'var(--accent-gold)';

    const div = document.createElement('div');
    div.className = 'quest-card' + (q._open ? ' expanded' : '');
    div.dataset.cardIdx = i;
    div.style.borderLeftColor = statusColor;
    div.innerHTML = `
      <div class="quest-card-header" onclick="toggleCard(this,'quest-card')" style="cursor:pointer;">
        <span class="quest-chevron">▶</span>
        <div style="flex:1;min-width:0;overflow:hidden;">
          <span style="font-family:'IM Fell English',serif;font-size:17px;color:var(--text-primary);">${q.title||'<em style=color:var(--text-muted)>Unnamed Quest</em>'}</span>
          ${q.reward ? `<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);margin-left:8px;">🏆 ${q.reward.slice(0,30)}${q.reward.length>30?'…':''}</span>` : ''}
        </div>
        <span class="quest-status-badge" style="color:${stc};border-color:${stc};background:${stc}18;">
          ${statusIcon} ${qs}
        </span>
        <button class="del-btn" style="flex-shrink:0;" onclick="event.stopPropagation();data.quests.splice(${i},1);renderQuests();autoSave()">🗑</button>
      </div>
      <div class="quest-card-body" onclick="event.stopPropagation()">
        <div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px;margin-bottom:8px;align-items:end;">
          <div class="field" style="margin:0;">
            <label>Quest Title</label>
            <input type="text" value="${q.title||''}" placeholder="Quest title…" style="font-family:'IM Fell English',serif;font-size:16px;" oninput="data.quests[${i}].title=this.value;autoSave();refreshQuestHeader(this)">
          </div>
          <div class="field" style="margin:0;">
            <label>Status</label>
            <select style="font-size:12px;" data-quest-idx="${i}" onchange="updateQuestStatus(this)">
              ${statusOpts}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Description & Objectives</label>
          <textarea rows="3" placeholder="Quest description & objectives…" oninput="data.quests[${i}].desc=this.value;autoSave()">${q.desc||''}</textarea>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>Reward / Consequence</label>
          <input type="text" value="${q.reward||''}" placeholder="Reward…" oninput="data.quests[${i}].reward=this.value;autoSave();refreshQuestHeader(this)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  renderPagination('questList', 'quest', totalFilteredQ);

}

function updateQuestStatus(selectEl) {
  const i = parseInt(selectEl.dataset.questIdx);
  const val = selectEl.value;
  data.quests[i].status = val;
  autoSave();
  // Update border color without full re-render
  const STATUS_COLORS = {Active:'var(--accent-gold)',Completed:'#60c070',Failed:'var(--accent-red-bright)','On Hold':'#6090c0'};
  const card = selectEl.closest('.quest-card');
  if (card) {
    card.style.borderLeftColor = STATUS_COLORS[val] || 'var(--accent-gold)';
    // update badge
    const badge = card.querySelector('.quest-status-badge');
    const STATUS_ICONS2 = {Active:'⚔',Completed:'✅',Failed:'❌','On Hold':'⏸'};
    const STATUS_TEXT_COLORS = {Active:'var(--accent-gold)',Completed:'#60c070',Failed:'var(--accent-red-bright)','On Hold':'#6090c0'};
    const stc = STATUS_TEXT_COLORS[val] || 'var(--accent-gold)';
    if (badge) { badge.style.color=stc; badge.style.borderColor=stc; badge.style.background=stc+'18'; badge.textContent=`${STATUS_ICONS2[val]||''} ${val}`; }
  }
  // If filter is active and new status doesn't match, re-render to hide it
  const statusFilter = document.getElementById('questStatusFilter')?.value || '';
  if (statusFilter && val !== statusFilter) {
    renderQuests();
  }
}

function addJournalEntry() {
  data.journal = data.journal || [];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  data.journal.unshift({title:'', date: dateStr, content:'', _open: true});
  _pageState.journal.page = 0;
  rebuildJournalYearFilter();
  renderJournal();
  // auto-open first card
  setTimeout(() => {
    const first = document.querySelector('.journal-entry');
    if (first) first.classList.add('open');
  }, 50);
}

function journalClearFilters() {
  const s = document.getElementById('journalSearchTitle');
  const y = document.getElementById('journalFilterYear');
  const m = document.getElementById('journalFilterMonth');
  if (s) s.value = '';
  if (y) y.value = '';
  if (m) m.value = '';
  _pageState.journal.page = 0;
  renderJournal();
}

function journalCollapseAll() {
  document.querySelectorAll('.journal-entry').forEach(el => el.classList.remove('open'));
}

function rebuildJournalYearFilter() {
  const select = document.getElementById('journalFilterYear');
  if (!select) return;
  const years = new Set();
  (data.journal||[]).forEach(e => {
    if (e.date) {
      const m = e.date.match(/\b(20\d{2}|19\d{2})\b/);
      if (m) years.add(m[1]);
    }
  });
  const cur = select.value;
  select.innerHTML = '<option value="">All Years</option>';
  [...years].sort((a,b) => b-a).forEach(y => {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y;
    select.appendChild(opt);
  });
  if (cur) select.value = cur;
}

function renderJournal() {
  const container = document.getElementById('journalList');
  if (!container) return;
  container.innerHTML = '';

  rebuildJournalYearFilter();

  const searchVal = (document.getElementById('journalSearchTitle')?.value || '').toLowerCase();
  const yearVal   = document.getElementById('journalFilterYear')?.value || '';
  const monthVal  = document.getElementById('journalFilterMonth')?.value || '';

  const entries = data.journal || [];

  const filtered = entries.map((e, i) => ({e, i})).filter(({e}) => {
    const title = (e.title || '').toLowerCase();
    const date  = (e.date  || '');
    if (searchVal && !title.includes(searchVal)) return false;
    if (yearVal  && !date.includes(yearVal))  return false;
    if (monthVal && !date.toLowerCase().includes(monthVal.toLowerCase())) return false;
    return true;
  });

  const totalFilteredJ = filtered.length;
  const ps_j = _pageState.journal;
  const maxPage_j = ps_j.perPage === 9999 ? 0 : Math.max(0, Math.ceil(totalFilteredJ / ps_j.perPage) - 1);
  if (ps_j.page > maxPage_j) ps_j.page = maxPage_j;
  const pagedJournal = _applyPagination(filtered, 'journal');

  if (totalFilteredJ === 0) {
    container.innerHTML = '<div class="journal-no-results">No journal entries match the current filters.</div>';
    renderPagination('journalList', 'journal', totalFilteredJ);
    return;
  }

  pagedJournal.forEach(({e, i}) => {
    const isOpen = e._open !== false;
    const div = document.createElement('div');
    div.className = 'journal-entry' + (isOpen ? ' open' : '');
    div.dataset.idx = i;

    const displayTitle = e.title || 'Untitled Session';
    div.innerHTML = `
      <div class="journal-card-header" onclick="journalToggle(this.parentElement, ${i})">
        <span class="journal-card-toggle">▶</span>
        <span class="journal-card-title${e.title ? '' : ' empty'}">${displayTitle}</span>
        <span class="journal-card-date">${e.date || ''}</span>
        <button class="del-btn" onclick="event.stopPropagation();data.journal.splice(${i},1);renderJournal();autoSave();" style="margin-left:6px;">🗑</button>
      </div>
      <div class="journal-card-body">
        <input type="text" class="journal-title-input" value="${(e.title||'').replace(/"/g,'&quot;')}" placeholder="Session title…"
          oninput="data.journal[${i}].title=this.value;this.closest('.journal-entry').querySelector('.journal-card-title').textContent=this.value||'Untitled Session';this.closest('.journal-entry').querySelector('.journal-card-title').className='journal-card-title'+(this.value?'':' empty');autoSave();">
        <input type="text" class="journal-date-input" value="${(e.date||'').replace(/"/g,'&quot;')}" placeholder="Date…"
          oninput="data.journal[${i}].date=this.value;this.closest('.journal-entry').querySelector('.journal-card-date').textContent=this.value;autoSave();rebuildJournalYearFilter();">
        <textarea rows="8" placeholder="What happened this session?…"
          oninput="data.journal[${i}].content=this.value;autoSave()">${e.content||''}</textarea>
      </div>
    `;
    container.appendChild(div);
  });
  renderPagination('journalList', 'journal', totalFilteredJ);
}

function journalToggle(el, idx) {
  const isOpen = el.classList.contains('open');
  el.classList.toggle('open', !isOpen);
  if (data.journal[idx]) data.journal[idx]._open = !isOpen;
}

// ═══════════════════════════════════════════
//  DICE ROLLER
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
//  PANEL VERTICAL POSITIONING
// ═══════════════════════════════════════════
// Buttons are stacked vertically on the right side:
// dice=bottom:24, quickRoll=bottom:90, combatHud=bottom:156, allies=bottom:222
// Panels open to the LEFT of the button column.

const PANEL_ORDER = [
  { id: 'dicePanel',     width: 280 },
  { id: 'quickRollPanel',width: 340 },
  { id: 'combatHudPanel',width: 360 },
  { id: 'alliesPanel',   width: 300 },
];

function repositionPanels() {
  const PANEL_RIGHT = 88; // distance from right edge (button column width)
  const PANEL_GAP = 8;    // gap between panels
  const PANEL_BOTTOM = 24; // all panels align to same bottom baseline

  const openPanels = PANEL_ORDER.filter(p => {
    const el = document.getElementById(p.id);
    return el && el.classList.contains('open');
  });

  if (openPanels.length === 0) return;

  // All open panels stack side by side from right to left, no overlap
  let currentRight = PANEL_RIGHT;
  for (let i = 0; i < openPanels.length; i++) {
    const p = openPanels[i];
    const el = document.getElementById(p.id);
    if (!el) continue;
    el.style.right = currentRight + 'px';
    el.style.bottom = PANEL_BOTTOM + 'px';
    el.style.top = 'auto';
    el.style.transition = 'right 0.25s ease, bottom 0.25s ease';
    currentRight += p.width + PANEL_GAP;
  }
}

function toggleDicePanel() {
  document.getElementById('dicePanel').classList.toggle('open');
  repositionPanels();
}

// Dice Roller panel lock state
var diceRollerLocked = false;

function toggleDiceRollerLock() {
  diceRollerLocked = !diceRollerLocked;
  const btn = document.getElementById('diceRollerLockBtn');
  if (btn) {
    btn.textContent = diceRollerLocked ? '🔒' : '🔓';
    btn.title = diceRollerLocked ? 'Odomknúť panel' : 'Zamknúť panel';
    btn.style.opacity = diceRollerLocked ? '1' : '0.6';
  }
  repositionPanels();
}

// Close Dice Roller panel when clicking outside (unless locked)
document.addEventListener('click', function(e) {
  const panel = document.getElementById('dicePanel');
  const wrapper = document.getElementById('diceRollerWrapper');
  if (!panel || !panel.classList.contains('open')) return;
  if (diceRollerLocked) return;
  const fab = document.getElementById('fabMenu');
  if (fab && fab.contains(e.target)) return;
  if (!wrapper.contains(e.target)) {
    panel.classList.remove('open');
    repositionPanels();
  }
});

function selectDie(n) {
  selectedDie = n;
  document.querySelectorAll('.die-btn').forEach(b => b.classList.toggle('selected', parseInt(b.dataset.die)===n));
}

function rollDice() {
  const count = parseInt(document.getElementById('diceCount').value) || 1;
  const mod = parseInt(document.getElementById('diceModifier').value) || 0;
  const rolls = [];
  let total = 0;
  for (let i=0;i<count;i++) {
    const r = Math.floor(Math.random() * selectedDie) + 1;
    rolls.push(r);
    total += r;
  }
  total += mod;
  showRollResult(total, rolls, mod, `${count}d${selectedDie}${mod!==0?fmtMod(mod):''}`);
}

function rollWithAdv(type) {
  const mod = parseInt(document.getElementById('diceModifier').value) || 0;
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  const chosen = type === 1 ? Math.max(r1,r2) : Math.min(r1,r2);
  const total = chosen + mod;
  const label = type===1 ? 'Advantage' : 'Disadvantage';
  showRollResult(total, [r1,r2], mod, `d20 (${label})`, type===1?r1>r2?0:1:r1<r2?0:1);
}

function showRollResult(total, rolls, mod, label, dropped=-1) {
  const resultEl = document.getElementById('diceResult');
  const rollsStr = rolls.map((r,i)=>`<span style="${i===dropped?'color:var(--text-muted);text-decoration:line-through':r===selectedDie||r===20?'color:var(--accent-gold-bright)':r===1?'color:var(--accent-red-bright)':''}">${r}</span>`).join(' + ');
  const modStr = mod!==0 ? ` ${fmtMod(mod)}` : '';
  resultEl.innerHTML = `<div class="result-num">${total}</div><div class="result-detail">[${rollsStr}]${modStr} — ${label}</div>`;

  // History
  data.diceHistory = data.diceHistory || [];
  data.diceHistory.unshift({label, total, rolls});
  if (data.diceHistory.length > 10) data.diceHistory.pop();
  renderDiceHistory();
}

function renderDiceHistory() {
  const container = document.getElementById('diceHistory');
  container.innerHTML = (data.diceHistory||[]).map(h => 
    `<div class="dice-history-item">⬡ ${h.label} → <strong style="color:var(--text-secondary)">${h.total}</strong></div>`
  ).join('');
}

// ═══════════════════════════════════════════
