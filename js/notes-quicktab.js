// ═══════════════════════════════════════════
//  notes-quicktab.js
//  Quick-access tabs inside the Session Notes panel
//  Tabs: Write | NPC | Quests | Players | General | Lore | Journal
//  • Mirrors data from main character sheet (live read/write)
//  • Search + filter per tab
//  • Cards expandable, editable inline
// ═══════════════════════════════════════════

(function () {
  'use strict';

  // ── Tab definitions ──────────────────────────────────────────────────
  const TABS = [
    { id: 'write',   icon: '📝', label: 'Write'   },
    { id: 'npc',     icon: '🧙', label: 'NPC'     },
    { id: 'quest',   icon: '📜', label: 'Quests'  },
    { id: 'players', icon: '🎲', label: 'Players' },
    { id: 'general', icon: '📌', label: 'General' },
    { id: 'lore',    icon: '📚', label: 'Lore'    },
    { id: 'journal', icon: '📖', label: 'Journal' },
  ];

  let activeTab = 'write';

  // ── Inject CSS ──────────────────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById('sn-quicktab-style')) return;
    const s = document.createElement('style');
    s.id = 'sn-quicktab-style';
    s.textContent = `
/* ── Tab bar ── */
.sn-tab-bar {
  display: flex;
  gap: 2px;
  margin-bottom: 10px;
  background: rgba(0,0,0,0.3);
  border-radius: 6px;
  padding: 3px;
  overflow-x: auto;
  scrollbar-width: none;
}
.sn-tab-bar::-webkit-scrollbar { display: none; }
.sn-tab-btn {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 5px 4px 4px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.sn-tab-btn .sn-tab-icon { font-size: 13px; line-height: 1; }
.sn-tab-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-secondary); }
.sn-tab-btn.active {
  background: rgba(50,140,80,0.18);
  border-color: #3a7a4a;
  color: #6ed98a;
}
.sn-tab-btn .sn-tab-count {
  font-size: 8px;
  opacity: 0.6;
  color: inherit;
}

/* ── Tab content area ── */
.sn-tab-content { display: none; }
.sn-tab-content.active { display: block; }

/* ── Search / filter row ── */
.sn-qt-search-row {
  display: flex;
  gap: 5px;
  margin-bottom: 8px;
}
.sn-qt-search {
  flex: 1;
  background: rgba(0,0,0,0.35);
  border: 1px solid #2a4a2a;
  border-radius: var(--radius);
  color: var(--text-primary);
  font-family: 'Cinzel', serif;
  font-size: 11px;
  padding: 5px 9px;
  outline: none;
  transition: border-color 0.15s;
}
.sn-qt-search:focus { border-color: #3a7a4a; }
.sn-qt-search::placeholder { color: var(--text-muted); font-style: italic; }
.sn-qt-filter {
  background: rgba(0,0,0,0.35);
  border: 1px solid #2a4a2a;
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: 'Cinzel', serif;
  font-size: 10px;
  padding: 4px 7px;
  outline: none;
  cursor: pointer;
}
.sn-qt-filter:focus { border-color: #3a7a4a; }

/* ── Cards list ── */
.sn-qt-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-right: 2px;
}

/* ── Pagination ── */
.sn-qt-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 0;
}
.sn-qt-page-btn {
  background: rgba(0,0,0,0.3);
  border: 1px solid #2a4a2a;
  border-radius: 3px;
  color: var(--text-secondary);
  font-family: 'Cinzel', serif;
  font-size: 10px;
  padding: 3px 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  min-width: 28px;
  text-align: center;
}
.sn-qt-page-btn:hover { background: rgba(90,170,106,0.1); border-color: #5aaa6a; color: #6ed98a; }
.sn-qt-page-btn.active {
  background: rgba(50,140,80,0.2);
  border-color: #3a7a4a;
  color: #6ed98a;
  font-weight: bold;
}
.sn-qt-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.sn-qt-page-info {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  color: var(--text-muted);
  padding: 0 4px;
  letter-spacing: 0.5px;
}

/* ── Quick card ── */
.sn-qt-card {
  background: rgba(0,0,0,0.28);
  border: 1px solid #2a4a2a;
  border-left: 3px solid #3a7a4a;
  border-radius: 5px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.sn-qt-card-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 9px;
  cursor: pointer;
  user-select: none;
  transition: background 0.12s;
}
.sn-qt-card-header:hover { background: rgba(255,255,255,0.035); }
.sn-qt-chevron {
  font-size: 9px;
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}
.sn-qt-card.open .sn-qt-chevron { transform: rotate(90deg); }
.sn-qt-card-title {
  flex: 1;
  font-family: 'IM Fell English', serif;
  font-size: 15px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sn-qt-card-title.empty { color: var(--text-muted); font-style: italic; }
.sn-qt-badge {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid;
  white-space: nowrap;
  flex-shrink: 0;
}
.sn-qt-card-body {
  display: none;
  padding: 0 9px 9px;
  border-top: 1px solid #1a3a1a;
}
.sn-qt-card.open .sn-qt-card-body { display: block; }
.sn-qt-field {
  margin-top: 8px;
}
.sn-qt-field label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 3px;
}
.sn-qt-field input,
.sn-qt-field textarea,
.sn-qt-field select {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0,0,0,0.3);
  border: 1px solid #2a4a2a;
  border-radius: 3px;
  color: var(--text-primary);
  font-family: 'Crimson Text', serif;
  font-size: 13px;
  padding: 4px 8px;
  outline: none;
  transition: border-color 0.15s;
  resize: vertical;
}
.sn-qt-field input:focus,
.sn-qt-field textarea:focus,
.sn-qt-field select:focus { border-color: #3a7a4a; }
.sn-qt-row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.sn-qt-row3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
}

/* ── Add / empty state ── */
.sn-qt-add-btn {
  width: 100%;
  margin-top: 6px;
  padding: 6px;
  border: 1px dashed #3a6a3a;
  border-radius: 4px;
  background: transparent;
  color: #5aaa6a;
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.sn-qt-add-btn:hover { background: rgba(90,170,106,0.08); border-color: #5aaa6a; }
.sn-qt-empty {
  text-align: center;
  padding: 18px 10px;
  color: var(--text-muted);
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 1px;
}

/* ── Journal entry card ── */
.sn-qt-journal-entry {
  background: rgba(0,0,0,0.25);
  border: 1px solid #2a4a2a;
  border-radius: 5px;
  overflow: hidden;
}
.sn-qt-journal-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 9px;
  cursor: pointer;
  user-select: none;
}
.sn-qt-journal-header:hover { background: rgba(255,255,255,0.03); }
.sn-qt-journal-title {
  flex: 1;
  font-family: 'IM Fell English', serif;
  font-size: 14px;
  color: var(--text-primary);
}
.sn-qt-journal-date {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  color: var(--text-muted);
}
.sn-qt-journal-body {
  display: none;
  padding: 0 9px 9px;
  border-top: 1px solid #1a3a1a;
}
.sn-qt-journal-entry.open .sn-qt-journal-body { display: block; }
.sn-qt-journal-entry.open .sn-qt-chevron { transform: rotate(90deg); }

/* ── Count badge on tab button ── */
.sn-tab-has-data .sn-tab-count { color: #6ed98a; opacity: 1; }
    `;
    document.head.appendChild(s);
  }

  // ── Build the tab bar HTML ───────────────────────────────────────────
  function buildTabBar() {
    return `<div class="sn-tab-bar" id="snTabBar">
      ${TABS.map(t => `
        <button class="sn-tab-btn${t.id === activeTab ? ' active' : ''}" id="snTab_${t.id}"
          onclick="snSwitchTab('${t.id}')" title="${t.label}">
          <span class="sn-tab-icon">${t.icon}</span>
          <span>${t.label}</span>
          <span class="sn-tab-count" id="snTabCount_${t.id}"></span>
        </button>`).join('')}
    </div>`;
  }

  // ── Inject tab bar + content wrappers into panel body ───────────────
  function injectTabUI() {
    const panelBody = document.getElementById('snPanelBody');
    if (!panelBody || document.getElementById('snTabBar')) return;

    // Wrap existing write UI into a div
    const existingHTML = panelBody.innerHTML;
    panelBody.innerHTML = buildTabBar() + `
      <div class="sn-tab-content${activeTab === 'write' ? ' active' : ''}" id="snTabPane_write">
        ${existingHTML}
      </div>
      <div class="sn-tab-content${activeTab === 'npc' ? ' active' : ''}" id="snTabPane_npc"></div>
      <div class="sn-tab-content${activeTab === 'quest' ? ' active' : ''}" id="snTabPane_quest"></div>
      <div class="sn-tab-content${activeTab === 'players' ? ' active' : ''}" id="snTabPane_players"></div>
      <div class="sn-tab-content${activeTab === 'general' ? ' active' : ''}" id="snTabPane_general"></div>
      <div class="sn-tab-content${activeTab === 'lore' ? ' active' : ''}" id="snTabPane_lore"></div>
      <div class="sn-tab-content${activeTab === 'journal' ? ' active' : ''}" id="snTabPane_journal"></div>
    `;

    snUpdateTabCounts();
  }

  // ── Switch tab ───────────────────────────────────────────────────────
  window.snSwitchTab = function(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.sn-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sn-tab-content').forEach(p => p.classList.remove('active'));
    const btn = document.getElementById('snTab_' + tabId);
    if (btn) btn.classList.add('active');
    const pane = document.getElementById('snTabPane_' + tabId);
    if (pane) pane.classList.add('active');
    snRenderTab(tabId);
  };

  // ── Update count badges ─────────────────────────────────────────────
  function snUpdateTabCounts() {
    const counts = {
      write:   null,
      npc:     (data && data.npcs || []).length,
      quest:   (data && data.quests || []).length,
      players: (data && data.playerNotes || []).length,
      general: (data && data.generalNotes || []).length,
      lore:    (data && data.loreNotes || []).length,
      journal: (data && data.journal || []).length,
    };
    Object.keys(counts).forEach(id => {
      const el = document.getElementById('snTabCount_' + id);
      const btn = document.getElementById('snTab_' + id);
      if (!el) return;
      const c = counts[id];
      if (c === null || c === undefined) { el.textContent = ''; return; }
      el.textContent = c > 0 ? c : '';
      if (btn) btn.classList.toggle('sn-tab-has-data', c > 0);
    });
  }

  // ── Render dispatcher ────────────────────────────────────────────────
  function snRenderTab(tabId) {
    snUpdateTabCounts();
    switch (tabId) {
      case 'npc':     return snRenderNPCTab();
      case 'quest':   return snRenderQuestTab();
      case 'players': return snRenderPlayersTab();
      case 'general': return snRenderGeneralTab();
      case 'lore':    return snRenderLoreTab();
      case 'journal': return snRenderJournalTab();
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getSearchVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.toLowerCase().trim() : '';
  }

  // ── Pagination state (per tab) ───────────────────────────────────────
  const PAGE_SIZE = 5;
  const tabPages = { npc:0, quest:0, players:0, general:0, lore:0, journal:0 };

  function buildPagination(tabId, totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    if (totalPages <= 1) return '';
    const start = currentPage * PAGE_SIZE + 1;
    const end   = Math.min((currentPage + 1) * PAGE_SIZE, totalItems);
    let btns = '';
    btns += `<button class="sn-qt-page-btn" ${currentPage===0?'disabled':''} onclick="snQtSetPage('${tabId}',${currentPage-1})">‹</button>`;
    const maxVisible = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible/2));
    let endPage   = Math.min(totalPages, startPage + maxVisible);
    if (endPage - startPage < maxVisible) startPage = Math.max(0, endPage - maxVisible);
    if (startPage > 0) btns += `<span class="sn-qt-page-info">…</span>`;
    for (let p = startPage; p < endPage; p++) {
      btns += `<button class="sn-qt-page-btn${p===currentPage?' active':''}" onclick="snQtSetPage('${tabId}',${p})">${p+1}</button>`;
    }
    if (endPage < totalPages) btns += `<span class="sn-qt-page-info">…</span>`;
    btns += `<button class="sn-qt-page-btn" ${currentPage>=totalPages-1?'disabled':''} onclick="snQtSetPage('${tabId}',${currentPage+1})">›</button>`;
    btns += `<span class="sn-qt-page-info">${start}–${end} / ${totalItems}</span>`;
    return `<div class="sn-qt-pagination">${btns}</div>`;
  }

  window.snQtSetPage = function(tabId, page) {
    tabPages[tabId] = page;
    switch(tabId) {
      case 'npc':     snRenderNPCTab(); break;
      case 'quest':   snRenderQuestTab(); break;
      case 'players': snRenderPlayersTab(); break;
      case 'general': snRenderGeneralTab(); break;
      case 'lore':    snRenderLoreTab(); break;
      case 'journal': snRenderJournalTab(); break;
    }
  };

  function toggleQtCard(headerEl) {
    const card = headerEl.closest('.sn-qt-card, .sn-qt-journal-entry');
    if (!card) return;
    card.classList.toggle('open');
  }

  // ═══════════════════════════════════════════
  //  NPC TAB
  // ═══════════════════════════════════════════
  const ATTITUDE_COLORS = { Friendly:'#2a5a1a', Ally:'#5a5a10', Neutral:'#3a3a3a', Unknown:'#2a2a4a', Hostile:'#6a3a10', Enemy:'#6a1a1a' };
  const ATTITUDE_ICONS  = { Friendly:'🟢', Ally:'💛', Neutral:'⚪', Unknown:'❓', Hostile:'🟠', Enemy:'🔴' };
  const ATTITUDE_LIST   = ['Unknown','Friendly','Neutral','Hostile','Ally','Enemy'];

  function snRenderNPCTab() {
    const pane = document.getElementById('snTabPane_npc');
    if (!pane) return;
    const search = getSearchVal('snQtNpcSearch');
    const attFilter = document.getElementById('snQtNpcFilter')?.value || '';

    const npcs = data && data.npcs || [];
    const filtered = npcs.filter((npc, i) => {
      if (attFilter && npc.attitude !== attFilter) return false;
      if (search) {
        const hay = ((npc.name||'')+(npc.role||'')+(npc.location||'')+(npc.notes||'')).toLowerCase();
        return hay.includes(search);
      }
      return true;
    });

    // Reset to page 0 if filter/search changed and current page is out of range
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    if (tabPages.npc >= totalPages) tabPages.npc = 0;
    const page = tabPages.npc;
    const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    let html = `
      <div class="sn-qt-search-row">
        <input class="sn-qt-search" id="snQtNpcSearch" placeholder="🔍 Search NPC…"
          value="${esc(document.getElementById('snQtNpcSearch')?.value || '')}"
          oninput="snRenderNPCTab()">
        <select class="sn-qt-filter" id="snQtNpcFilter" onchange="snRenderNPCTab()">
          <option value="">All attitudes</option>
          ${ATTITUDE_LIST.map(a => `<option value="${a}"${attFilter===a?' selected':''}>${ATTITUDE_ICONS[a]} ${a}</option>`).join('')}
        </select>
      </div>
      <div class="sn-qt-list" id="snQtNpcList">`;

    if (filtered.length === 0) {
      html += `<div class="sn-qt-empty">${npcs.length === 0 ? 'No NPCs yet. Add the first one!' : 'No results.'}</div>`;
    } else {
      pageItems.forEach((npc) => {
        const realIdx = npcs.indexOf(npc);
        const borderColor = ATTITUDE_COLORS[npc.attitude] || '#3a7a4a';
        const attIcon = ATTITUDE_ICONS[npc.attitude] || '❓';
        const attLabel = npc.attitude || 'Unknown';
        const attOpts = ATTITUDE_LIST.map(a =>
          `<option value="${a}"${npc.attitude===a?' selected':''}>${ATTITUDE_ICONS[a]} ${a}</option>`
        ).join('');
        html += `
          <div class="sn-qt-card${npc._qtOpen ? ' open' : ''}" style="border-left-color:${borderColor}" data-npc-qt="${realIdx}">
            <div class="sn-qt-card-header" onclick="toggleQtCardByEl(this)">
              <span class="sn-qt-chevron">▶</span>
              <span class="sn-qt-card-title${!npc.name ? ' empty' : ''}">${esc(npc.name) || 'Unnamed NPC'}</span>
              ${npc.role ? `<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);">${esc(npc.role)}</span>` : ''}
              <span class="sn-qt-badge" style="color:${borderColor};border-color:${borderColor}44;">${attIcon} ${attLabel}</span>
              <button style="flex-shrink:0;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:0 2px;"
                onclick="event.stopPropagation();snQtDeleteNPC(${realIdx})">🗑</button>
            </div>
            <div class="sn-qt-card-body">
              <div class="sn-qt-row3" style="margin-top:8px;">
                <div class="sn-qt-field" style="margin:0;">
                  <label>Meno</label>
                  <input type="text" value="${esc(npc.name)}" placeholder="Meno NPC…"
                    oninput="snQtUpdateNPC(${realIdx},'name',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Rola / Titul</label>
                  <input type="text" value="${esc(npc.role)}" placeholder="e.g. Innkeeper…"
                    oninput="snQtUpdateNPC(${realIdx},'role',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Postoj</label>
                  <select onchange="snQtUpdateNPC(${realIdx},'attitude',this.value)">${attOpts}</select>
                </div>
              </div>
              <div class="sn-qt-field">
                <label>Lokalita / Frakcia</label>
                <input type="text" value="${esc(npc.location)}" placeholder="Where they are located…"
                  oninput="snQtUpdateNPC(${realIdx},'location',this.value)">
              </div>
              <div class="sn-qt-field">
                <label>Notes</label>
                <textarea rows="3" placeholder="What you know about this NPC…"
                  oninput="snQtUpdateNPC(${realIdx},'notes',this.value)">${esc(npc.notes)}</textarea>
              </div>
              <div class="sn-qt-field" style="margin-bottom:0;">
                <label>🏷 Keywords</label>
                <input type="text" value="${esc(npc.keywords)}" placeholder="nicknames, roles…"
                  oninput="snQtUpdateNPC(${realIdx},'keywords',this.value)">
              </div>
            </div>
          </div>`;
      });
    }
    html += `</div>
      ${buildPagination('npc', filtered.length, page)}
      <button class="sn-qt-add-btn" onclick="snQtAddNPC()">＋ Add NPC</button>`;
    pane.innerHTML = html;
  }

  window.snRenderNPCTab = snRenderNPCTab;

  window.snQtUpdateNPC = function(idx, field, val) {
    if (!data.npcs || !data.npcs[idx]) return;
    data.npcs[idx][field] = val;
    if (typeof autoSave === 'function') autoSave();
    snUpdateTabCounts();
    // Update header inline without full re-render
    const card = document.querySelector(`.sn-qt-card[data-npc-qt="${idx}"]`);
    if (card && field === 'name') {
      const titleEl = card.querySelector('.sn-qt-card-title');
      if (titleEl) { titleEl.textContent = val || 'Unnamed NPC'; titleEl.classList.toggle('empty', !val); }
    }
    if (card && field === 'attitude') {
      snRenderNPCTab();
    }
    // Mirror to main NPC list if visible
    if (typeof renderNPCs === 'function') renderNPCs();
  };

  window.snQtDeleteNPC = function(idx) {
    if (!data.npcs) return;
    data.npcs.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderNPCs === 'function') renderNPCs();
    snRenderNPCTab();
  };

  window.snQtAddNPC = function() {
    data.npcs = data.npcs || [];
    data.npcs.unshift({ name:'', role:'', location:'', attitude:'Unknown', notes:'', keywords:'', _open:false, _qtOpen:true });
    tabPages.npc = 0;
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderNPCs === 'function') renderNPCs();
    snRenderNPCTab();
    setTimeout(() => {
      const firstInput = document.querySelector('#snTabPane_npc .sn-qt-card input');
      if (firstInput) firstInput.focus();
    }, 60);
  };

  // ═══════════════════════════════════════════
  //  QUESTS TAB
  // ═══════════════════════════════════════════
  const QUEST_STATUS_COLORS = { Active:'#2a5a10', Completed:'#103a6a', Failed:'#6a1a1a', 'On Hold':'#4a3a10' };
  const QUEST_STATUS_ICONS  = { Active:'⚔️', Completed:'✅', Failed:'❌', 'On Hold':'⏸️' };
  const QUEST_STATUS_LIST   = ['Active','Completed','Failed','On Hold'];

  function snRenderQuestTab() {
    const pane = document.getElementById('snTabPane_quest');
    if (!pane) return;
    const search = getSearchVal('snQtQuestSearch');
    const stFilter = document.getElementById('snQtQuestFilter')?.value || '';
    const quests = data && data.quests || [];
    const filtered = quests.filter((q) => {
      if (stFilter && q.status !== stFilter) return false;
      if (search) {
        const hay = ((q.title||'')+(q.desc||'')+(q.reward||'')).toLowerCase();
        return hay.includes(search);
      }
      return true;
    });

    const totalPagesQ = Math.ceil(filtered.length / PAGE_SIZE);
    if (tabPages.quest >= totalPagesQ) tabPages.quest = 0;
    const page = tabPages.quest;
    const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    let html = `
      <div class="sn-qt-search-row">
        <input class="sn-qt-search" id="snQtQuestSearch" placeholder="🔍 Search quest…"
          value="${esc(document.getElementById('snQtQuestSearch')?.value||'')}"
          oninput="snRenderQuestTab()">
        <select class="sn-qt-filter" id="snQtQuestFilter" onchange="snRenderQuestTab()">
          <option value="">All</option>
          ${QUEST_STATUS_LIST.map(s => `<option value="${s}"${stFilter===s?' selected':''}>${QUEST_STATUS_ICONS[s]} ${s}</option>`).join('')}
        </select>
      </div>
      <div class="sn-qt-list">`;

    if (filtered.length === 0) {
      html += `<div class="sn-qt-empty">${quests.length===0 ? 'No quests yet. Add the first one!' : 'No results.'}</div>`;
    } else {
      pageItems.forEach((q) => {
        const realIdx = quests.indexOf(q);
        const borderColor = QUEST_STATUS_COLORS[q.status] || '#3a5a2a';
        const stIcon = QUEST_STATUS_ICONS[q.status] || '📜';
        const stOpts = QUEST_STATUS_LIST.map(s =>
          `<option value="${s}"${q.status===s?' selected':''}>${QUEST_STATUS_ICONS[s]} ${s}</option>`
        ).join('');
        html += `
          <div class="sn-qt-card${q._qtOpen?' open':''}" style="border-left-color:${borderColor}" data-quest-qt="${realIdx}">
            <div class="sn-qt-card-header" onclick="toggleQtCardByEl(this)">
              <span class="sn-qt-chevron">▶</span>
              <span class="sn-qt-card-title${!q.title?' empty':''}">${esc(q.title)||'Unnamed Quest'}</span>
              <span class="sn-qt-badge" style="color:${borderColor};border-color:${borderColor}55;">${stIcon} ${q.status||'Active'}</span>
              <button style="flex-shrink:0;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:0 2px;"
                onclick="event.stopPropagation();snQtDeleteQuest(${realIdx})">🗑</button>
            </div>
            <div class="sn-qt-card-body">
              <div class="sn-qt-row2" style="margin-top:8px;">
                <div class="sn-qt-field" style="margin:0;">
                  <label>Name</label>
                  <input type="text" value="${esc(q.title)}" placeholder="Quest name…"
                    oninput="snQtUpdateQuest(${realIdx},'title',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Stav</label>
                  <select onchange="snQtUpdateQuest(${realIdx},'status',this.value)">${stOpts}</select>
                </div>
              </div>
              <div class="sn-qt-field">
                <label>Description / Task</label>
                <textarea rows="3" placeholder="What needs to be done…"
                  oninput="snQtUpdateQuest(${realIdx},'desc',this.value)">${esc(q.desc)}</textarea>
              </div>
              <div class="sn-qt-field" style="margin-bottom:0;">
                <label>Odmena</label>
                <input type="text" value="${esc(q.reward)}" placeholder="napr. 500 gp, artefakt…"
                  oninput="snQtUpdateQuest(${realIdx},'reward',this.value)">
              </div>
            </div>
          </div>`;
      });
    }
    html += `</div>
      ${buildPagination('quest', filtered.length, page)}
      <button class="sn-qt-add-btn" onclick="snQtAddQuest()">＋ Add quest</button>`;
    pane.innerHTML = html;
  }

  window.snRenderQuestTab = snRenderQuestTab;

  window.snQtUpdateQuest = function(idx, field, val) {
    if (!data.quests || !data.quests[idx]) return;
    data.quests[idx][field] = val;
    if (typeof autoSave === 'function') autoSave();
    snUpdateTabCounts();
    if (field === 'status') snRenderQuestTab();
    if (typeof renderQuests === 'function') renderQuests();
  };

  window.snQtDeleteQuest = function(idx) {
    if (!data.quests) return;
    data.quests.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderQuests === 'function') renderQuests();
    snRenderQuestTab();
  };

  window.snQtAddQuest = function() {
    data.quests = data.quests || [];
    data.quests.unshift({ title:'', status:'Active', desc:'', reward:'', _open:false, _qtOpen:true });
    tabPages.quest = 0;
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderQuests === 'function') renderQuests();
    snRenderQuestTab();
    setTimeout(() => {
      const firstInput = document.querySelector('#snTabPane_quest .sn-qt-card input');
      if (firstInput) firstInput.focus();
    }, 60);
  };

  // ═══════════════════════════════════════════
  //  PLAYERS TAB
  // ═══════════════════════════════════════════
  const RELATION_COLORS_QT = { Unknown:'#2a2a4a', Friend:'#1a4a2a', Ally:'#4a4a10', Neutral:'#3a3a3a', Rival:'#5a2a3a', Suspicious:'#5a3a10' };
  const RELATION_ICONS_QT  = { Unknown:'❓', Friend:'💚', Ally:'💛', Neutral:'⚪', Rival:'🟠', Suspicious:'👁️' };
  const RELATION_LIST = ['Unknown','Friend','Ally','Neutral','Rival','Suspicious'];

  function snRenderPlayersTab() {
    const pane = document.getElementById('snTabPane_players');
    if (!pane) return;
    const search = getSearchVal('snQtPlayersSearch');
    const relFilter = document.getElementById('snQtPlayersFilter')?.value || '';
    const players = data && data.playerNotes || [];
    const filtered = players.filter((pn) => {
      if (relFilter && pn.relation !== relFilter) return false;
      if (search) {
        const hay = ((pn.name||'')+(pn.player||'')+(pn.class||'')+(pn.notes||'')+(pn.secrets||'')).toLowerCase();
        return hay.includes(search);
      }
      return true;
    });

    const totalPagesP = Math.ceil(filtered.length / PAGE_SIZE);
    if (tabPages.players >= totalPagesP) tabPages.players = 0;
    const page = tabPages.players;
    const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    let html = `
      <div class="sn-qt-search-row">
        <input class="sn-qt-search" id="snQtPlayersSearch" placeholder="🔍 Search character…"
          value="${esc(document.getElementById('snQtPlayersSearch')?.value||'')}"
          oninput="snRenderPlayersTab()">
        <select class="sn-qt-filter" id="snQtPlayersFilter" onchange="snRenderPlayersTab()">
          <option value="">All</option>
          ${RELATION_LIST.map(r => `<option value="${r}"${relFilter===r?' selected':''}>${RELATION_ICONS_QT[r]} ${r}</option>`).join('')}
        </select>
      </div>
      <div class="sn-qt-list">`;

    if (filtered.length === 0) {
      html += `<div class="sn-qt-empty">${players.length===0 ? 'No players yet. Add the first one!' : 'No results.'}</div>`;
    } else {
      pageItems.forEach((pn) => {
        const realIdx = players.indexOf(pn);
        const borderColor = RELATION_COLORS_QT[pn.relation] || '#3a3a6a';
        const relIcon = RELATION_ICONS_QT[pn.relation] || '❓';
        const relLabel = pn.relation || 'Unknown';
        const relOpts = RELATION_LIST.map(r =>
          `<option value="${r}"${pn.relation===r?' selected':''}>${RELATION_ICONS_QT[r]} ${r}</option>`
        ).join('');
        const sub = [pn.class, pn.player].filter(Boolean).join(' · ');
        html += `
          <div class="sn-qt-card${pn._qtOpen?' open':''}" style="border-left-color:${borderColor}" data-player-qt="${realIdx}">
            <div class="sn-qt-card-header" onclick="toggleQtCardByEl(this)">
              <span class="sn-qt-chevron">▶</span>
              <div style="flex:1;min-width:0;overflow:hidden;">
                <div class="sn-qt-card-title${!pn.name?' empty':''}">${esc(pn.name)||'Unnamed Player'}</div>
                ${sub ? `<div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);margin-top:1px;">${esc(sub)}</div>` : ''}
              </div>
              <span class="sn-qt-badge" style="color:${borderColor};border-color:${borderColor}55;">${relIcon} ${relLabel}</span>
              <button style="flex-shrink:0;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:0 2px;"
                onclick="event.stopPropagation();snQtDeletePlayer(${realIdx})">🗑</button>
            </div>
            <div class="sn-qt-card-body">
              <div class="sn-qt-row3" style="margin-top:8px;">
                <div class="sn-qt-field" style="margin:0;">
                  <label>Meno postavy</label>
                  <input type="text" value="${esc(pn.name)}" placeholder="Meno…"
                    oninput="snQtUpdatePlayer(${realIdx},'name',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Trieda / Rasa</label>
                  <input type="text" value="${esc(pn.class)}" placeholder="napr. Human Paladin…"
                    oninput="snQtUpdatePlayer(${realIdx},'class',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Relation</label>
                  <select onchange="snQtUpdatePlayer(${realIdx},'relation',this.value)">${relOpts}</select>
                </div>
              </div>
              <div class="sn-qt-field">
                <label>Player (real name)</label>
                <input type="text" value="${esc(pn.player)}" placeholder="Player's name…"
                  oninput="snQtUpdatePlayer(${realIdx},'player',this.value)">
              </div>
              <div class="sn-qt-field">
                <label>What I know about them</label>
                <textarea rows="3" placeholder="Background, personality, story arcs…"
                  oninput="snQtUpdatePlayer(${realIdx},'notes',this.value)">${esc(pn.notes)}</textarea>
              </div>
              <div class="sn-qt-field" style="margin-bottom:0;">
                <label>🤫 Secrets / Suspicions</label>
                <textarea rows="2" placeholder="Private theories, revealed secrets…"
                  oninput="snQtUpdatePlayer(${realIdx},'secrets',this.value)">${esc(pn.secrets)}</textarea>
              </div>
            </div>
          </div>`;
      });
    }
    html += `</div>
      ${buildPagination('players', filtered.length, page)}
      <button class="sn-qt-add-btn" onclick="snQtAddPlayer()">＋ Add player</button>`;
    pane.innerHTML = html;
  }

  window.snRenderPlayersTab = snRenderPlayersTab;

  window.snQtUpdatePlayer = function(idx, field, val) {
    if (!data.playerNotes || !data.playerNotes[idx]) return;
    data.playerNotes[idx][field] = val;
    if (typeof autoSave === 'function') autoSave();
    snUpdateTabCounts();
    if (field === 'relation') snRenderPlayersTab();
    if (typeof renderPlayerNotes === 'function') renderPlayerNotes();
  };

  window.snQtDeletePlayer = function(idx) {
    if (!data.playerNotes) return;
    data.playerNotes.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderPlayerNotes === 'function') renderPlayerNotes();
    snRenderPlayersTab();
  };

  window.snQtAddPlayer = function() {
    data.playerNotes = data.playerNotes || [];
    data.playerNotes.unshift({ name:'', player:'', class:'', relation:'Unknown', notes:'', secrets:'', keywords:'', _open:false, _qtOpen:true });
    tabPages.players = 0;
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderPlayerNotes === 'function') renderPlayerNotes();
    snRenderPlayersTab();
    setTimeout(() => {
      const firstInput = document.querySelector('#snTabPane_players .sn-qt-card input');
      if (firstInput) firstInput.focus();
    }, 60);
  };

  // ═══════════════════════════════════════════
  //  GENERAL NOTES TAB
  // ═══════════════════════════════════════════
  const GN_CAT_ICONS_QT  = { 'Plot Hook':'🎣', 'Clue':'🔍', 'Reminder':'⏰', 'NPC Hint':'💬', 'Other':'📌' };
  const GN_CAT_COLORS_QT = { 'Plot Hook':'#2a4a6a', 'Clue':'#3a5a2a', 'Reminder':'#5a4a10', 'NPC Hint':'#3a2a5a', 'Other':'#3a3a3a' };
  const GN_CAT_LIST = ['Plot Hook','Clue','Reminder','NPC Hint','Other'];

  function snRenderGeneralTab() {
    const pane = document.getElementById('snTabPane_general');
    if (!pane) return;
    const search = getSearchVal('snQtGenSearch');
    const catFilter = document.getElementById('snQtGenFilter')?.value || '';
    const notes = data && data.generalNotes || [];
    const filtered = notes.filter((n) => {
      if (catFilter && n.category !== catFilter) return false;
      if (search) {
        const hay = ((n.title||'')+(n.content||'')+(n.tags||'')).toLowerCase();
        return hay.includes(search);
      }
      return true;
    });

    const totalPagesG = Math.ceil(filtered.length / PAGE_SIZE);
    if (tabPages.general >= totalPagesG) tabPages.general = 0;
    const page = tabPages.general;
    const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    let html = `
      <div class="sn-qt-search-row">
        <input class="sn-qt-search" id="snQtGenSearch" placeholder="🔍 Search note…"
          value="${esc(document.getElementById('snQtGenSearch')?.value||'')}"
          oninput="snRenderGeneralTab()">
        <select class="sn-qt-filter" id="snQtGenFilter" onchange="snRenderGeneralTab()">
          <option value="">All</option>
          ${GN_CAT_LIST.map(c => `<option value="${c}"${catFilter===c?' selected':''}>${GN_CAT_ICONS_QT[c]} ${c}</option>`).join('')}
        </select>
      </div>
      <div class="sn-qt-list">`;

    if (filtered.length === 0) {
      html += `<div class="sn-qt-empty">${notes.length===0 ? 'No notes yet. Add the first one!' : 'No results.'}</div>`;
    } else {
      pageItems.forEach((n) => {
        const realIdx = notes.indexOf(n);
        const borderColor = GN_CAT_COLORS_QT[n.category] || '#3a3a3a';
        const catIcon = GN_CAT_ICONS_QT[n.category] || '📌';
        const catOpts = GN_CAT_LIST.map(c =>
          `<option value="${c}"${n.category===c?' selected':''}>${GN_CAT_ICONS_QT[c]} ${c}</option>`
        ).join('');
        html += `
          <div class="sn-qt-card${n._qtOpen?' open':''}" style="border-left-color:${borderColor}" data-gen-qt="${realIdx}">
            <div class="sn-qt-card-header" onclick="toggleQtCardByEl(this)">
              <span class="sn-qt-chevron">▶</span>
              <span style="font-size:13px;">${catIcon}</span>
              <span class="sn-qt-card-title${!n.title?' empty':''}">${esc(n.title)||'Untitled Note'}</span>
              <span class="sn-qt-badge" style="color:${borderColor};border-color:${borderColor}55;">${n.category||'Other'}</span>
              <button style="flex-shrink:0;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:0 2px;"
                onclick="event.stopPropagation();snQtDeleteGen(${realIdx})">🗑</button>
            </div>
            <div class="sn-qt-card-body">
              <div class="sn-qt-row2" style="margin-top:8px;">
                <div class="sn-qt-field" style="margin:0;">
                  <label>Name</label>
                  <input type="text" value="${esc(n.title)}" placeholder="Note title…"
                    oninput="snQtUpdateGen(${realIdx},'title',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Category</label>
                  <select onchange="snQtUpdateGen(${realIdx},'category',this.value)">${catOpts}</select>
                </div>
              </div>
              <div class="sn-qt-field">
                <label>Obsah</label>
                <textarea rows="4" placeholder="Note content…"
                  oninput="snQtUpdateGen(${realIdx},'content',this.value)">${esc(n.content)}</textarea>
              </div>
              <div class="sn-qt-field" style="margin-bottom:0;">
                <label>🏷 Tagy</label>
                <input type="text" value="${esc(n.tags)}" placeholder="napr. session, dungeon, boss…"
                  oninput="snQtUpdateGen(${realIdx},'tags',this.value)">
              </div>
            </div>
          </div>`;
      });
    }
    html += `</div>
      ${buildPagination('general', filtered.length, page)}
      <button class="sn-qt-add-btn" onclick="snQtAddGen()">＋ Add note</button>`;
    pane.innerHTML = html;
  }

  window.snRenderGeneralTab = snRenderGeneralTab;

  window.snQtUpdateGen = function(idx, field, val) {
    if (!data.generalNotes || !data.generalNotes[idx]) return;
    data.generalNotes[idx][field] = val;
    if (typeof autoSave === 'function') autoSave();
    snUpdateTabCounts();
    if (field === 'category') snRenderGeneralTab();
    if (typeof renderGeneralNotes === 'function') renderGeneralNotes();
  };

  window.snQtDeleteGen = function(idx) {
    if (!data.generalNotes) return;
    data.generalNotes.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderGeneralNotes === 'function') renderGeneralNotes();
    snRenderGeneralTab();
  };

  window.snQtAddGen = function() {
    data.generalNotes = data.generalNotes || [];
    data.generalNotes.unshift({ title:'', category:'Other', content:'', tags:'', _open:false, _qtOpen:true });
    tabPages.general = 0;
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderGeneralNotes === 'function') renderGeneralNotes();
    snRenderGeneralTab();
    setTimeout(() => {
      const firstInput = document.querySelector('#snTabPane_general .sn-qt-card input');
      if (firstInput) firstInput.focus();
    }, 60);
  };

  // ═══════════════════════════════════════════
  //  LORE & WORLD TAB
  // ═══════════════════════════════════════════
  const LORE_CAT_ICONS_QT = {
    'History':'📜','Legend':'⚡','Faction':'⚔️','Religion':'🙏',
    'Location':'🗺️','Lore':'📚','NPC Backstory':'🧙','Other':'📌'
  };
  const LORE_CAT_COLORS_QT = {
    'History':'#4a3a10','Legend':'#4a2a5a','Faction':'#3a2a10',
    'Religion':'#2a3a4a','Location':'#2a4a2a','Lore':'#3a3a5a',
    'NPC Backstory':'#1a3a4a','Other':'#3a3a3a'
  };
  const LORE_CAT_LIST = ['History','Legend','Faction','Religion','Location','Lore','NPC Backstory','Other'];

  function snRenderLoreTab() {
    const pane = document.getElementById('snTabPane_lore');
    if (!pane) return;
    const search = getSearchVal('snQtLoreSearch');
    const catFilter = document.getElementById('snQtLoreFilter')?.value || '';
    const notes = data && data.loreNotes || [];
    const filtered = notes.filter((n) => {
      if (catFilter && n.category !== catFilter) return false;
      if (search) {
        const hay = ((n.title||'')+(n.content||'')+(n.region||'')).toLowerCase();
        return hay.includes(search);
      }
      return true;
    });

    const totalPagesL = Math.ceil(filtered.length / PAGE_SIZE);
    if (tabPages.lore >= totalPagesL) tabPages.lore = 0;
    const page = tabPages.lore;
    const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    let html = `
      <div class="sn-qt-search-row">
        <input class="sn-qt-search" id="snQtLoreSearch" placeholder="🔍 Search lore…"
          value="${esc(document.getElementById('snQtLoreSearch')?.value||'')}"
          oninput="snRenderLoreTab()">
        <select class="sn-qt-filter" id="snQtLoreFilter" onchange="snRenderLoreTab()">
          <option value="">All</option>
          ${LORE_CAT_LIST.map(c => `<option value="${c}"${catFilter===c?' selected':''}>${LORE_CAT_ICONS_QT[c]||'📌'} ${c}</option>`).join('')}
        </select>
      </div>
      <div class="sn-qt-list">`;

    if (filtered.length === 0) {
      html += `<div class="sn-qt-empty">${notes.length===0 ? 'No entries yet. Add the first one!' : 'No results.'}</div>`;
    } else {
      pageItems.forEach((n) => {
        const realIdx = notes.indexOf(n);
        const borderColor = LORE_CAT_COLORS_QT[n.category] || '#3a3a5a';
        const catIcon = LORE_CAT_ICONS_QT[n.category] || '📌';
        const catOpts = LORE_CAT_LIST.map(c =>
          `<option value="${c}"${n.category===c?' selected':''}>${LORE_CAT_ICONS_QT[c]||'📌'} ${c}</option>`
        ).join('');
        html += `
          <div class="sn-qt-card${n._qtOpen?' open':''}" style="border-left-color:${borderColor}" data-lore-qt="${realIdx}">
            <div class="sn-qt-card-header" onclick="toggleQtCardByEl(this)">
              <span class="sn-qt-chevron">▶</span>
              <span style="font-size:13px;">${catIcon}</span>
              <span class="sn-qt-card-title${!n.title?' empty':''}">${esc(n.title)||'Untitled'}</span>
              ${n.region ? `<span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);">${esc(n.region)}</span>` : ''}
              <span class="sn-qt-badge" style="color:${borderColor};border-color:${borderColor}55;">${n.category||'Lore'}</span>
              <button style="flex-shrink:0;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:0 2px;"
                onclick="event.stopPropagation();snQtDeleteLore(${realIdx})">🗑</button>
            </div>
            <div class="sn-qt-card-body">
              <div class="sn-qt-row2" style="margin-top:8px;">
                <div class="sn-qt-field" style="margin:0;">
                  <label>Name</label>
                  <input type="text" value="${esc(n.title)}" placeholder="Entry title…"
                    oninput="snQtUpdateLore(${realIdx},'title',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Category</label>
                  <select onchange="snQtUpdateLore(${realIdx},'category',this.value)">${catOpts}</select>
                </div>
              </div>
              <div class="sn-qt-field">
                <label>Region / World</label>
                <input type="text" value="${esc(n.region)}" placeholder="e.g. Northern Kingdom…"
                  oninput="snQtUpdateLore(${realIdx},'region',this.value)">
              </div>
              <div class="sn-qt-field" style="margin-bottom:0;">
                <label>Obsah</label>
                <textarea rows="4" placeholder="Description, history, details…"
                  oninput="snQtUpdateLore(${realIdx},'content',this.value)">${esc(n.content)}</textarea>
              </div>
            </div>
          </div>`;
      });
    }
    html += `</div>
      ${buildPagination('lore', filtered.length, page)}
      <button class="sn-qt-add-btn" onclick="snQtAddLore()">＋ Add lore</button>`;
    pane.innerHTML = html;
  }

  window.snRenderLoreTab = snRenderLoreTab;

  window.snQtUpdateLore = function(idx, field, val) {
    if (!data.loreNotes || !data.loreNotes[idx]) return;
    data.loreNotes[idx][field] = val;
    if (typeof autoSave === 'function') autoSave();
    snUpdateTabCounts();
    if (field === 'category') snRenderLoreTab();
    if (typeof renderLoreNotes === 'function') renderLoreNotes();
  };

  window.snQtDeleteLore = function(idx) {
    if (!data.loreNotes) return;
    data.loreNotes.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderLoreNotes === 'function') renderLoreNotes();
    snRenderLoreTab();
  };

  window.snQtAddLore = function() {
    data.loreNotes = data.loreNotes || [];
    data.loreNotes.unshift({ title:'', category:'Lore', content:'', region:'', _open:false, _qtOpen:true });
    tabPages.lore = 0;
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderLoreNotes === 'function') renderLoreNotes();
    snRenderLoreTab();
    setTimeout(() => {
      const firstInput = document.querySelector('#snTabPane_lore .sn-qt-card input');
      if (firstInput) firstInput.focus();
    }, 60);
  };

  // ═══════════════════════════════════════════
  //  JOURNAL TAB
  // ═══════════════════════════════════════════
  function snRenderJournalTab() {
    const pane = document.getElementById('snTabPane_journal');
    if (!pane) return;
    const search = getSearchVal('snQtJournalSearch');
    const journal = data && data.journal || [];
    const filtered = journal.filter((e) => {
      if (!search) return true;
      const hay = ((e.title||'')+(e.content||'')+(e.date||'')).toLowerCase();
      return hay.includes(search);
    });

    const totalPagesJ = Math.ceil(filtered.length / PAGE_SIZE);
    if (tabPages.journal >= totalPagesJ) tabPages.journal = 0;
    const page = tabPages.journal;
    const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    let html = `
      <div class="sn-qt-search-row">
        <input class="sn-qt-search" id="snQtJournalSearch" placeholder="🔍 Search journal…"
          value="${esc(document.getElementById('snQtJournalSearch')?.value||'')}"
          oninput="snRenderJournalTab()">
      </div>
      <div class="sn-qt-list">`;

    if (filtered.length === 0) {
      html += `<div class="sn-qt-empty">${journal.length===0 ? 'Journal is empty. Save a session!' : 'No results.'}</div>`;
    } else {
      pageItems.forEach((e) => {
        const realIdx = journal.indexOf(e);
        html += `
          <div class="sn-qt-journal-entry${e._qtOpen?' open':''}" data-journal-qt="${realIdx}">
            <div class="sn-qt-journal-header" onclick="toggleQtCardByEl(this)">
              <span class="sn-qt-chevron" style="font-size:9px;color:var(--text-muted);transition:transform 0.2s;">▶</span>
              <span class="sn-qt-journal-title">${esc(e.title)||'<em style="color:var(--text-muted);font-style:italic;">Untitled Session</em>'}</span>
              <span class="sn-qt-journal-date">${esc(e.date)||''}</span>
              <button style="flex-shrink:0;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:0 2px;"
                onclick="event.stopPropagation();snQtDeleteJournal(${realIdx})">🗑</button>
            </div>
            <div class="sn-qt-journal-body">
              <div class="sn-qt-row2" style="margin-top:8px;">
                <div class="sn-qt-field" style="margin:0;">
                  <label>Session title</label>
                  <input type="text" value="${esc(e.title)}" placeholder="Title…"
                    oninput="snQtUpdateJournal(${realIdx},'title',this.value)">
                </div>
                <div class="sn-qt-field" style="margin:0;">
                  <label>Date</label>
                  <input type="text" value="${esc(e.date)}" placeholder="Date…"
                    oninput="snQtUpdateJournal(${realIdx},'date',this.value)">
                </div>
              </div>
              <div class="sn-qt-field" style="margin-bottom:0;">
                <label>Obsah</label>
                <textarea rows="5" placeholder="What happened in this session…"
                  oninput="snQtUpdateJournal(${realIdx},'content',this.value)">${esc(e.content)}</textarea>
              </div>
            </div>
          </div>`;
      });
    }
    html += `</div>
      ${buildPagination('journal', filtered.length, page)}`;
    pane.innerHTML = html;
  }

  window.snRenderJournalTab = snRenderJournalTab;

  window.snQtUpdateJournal = function(idx, field, val) {
    if (!data.journal || !data.journal[idx]) return;
    data.journal[idx][field] = val;
    if (typeof autoSave === 'function') autoSave();
    snUpdateTabCounts();
    if (typeof renderJournal === 'function') renderJournal();
  };

  window.snQtDeleteJournal = function(idx) {
    if (!data.journal) return;
    data.journal.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof renderJournal === 'function') renderJournal();
    snRenderJournalTab();
  };

  // ── Shared toggle helper ─────────────────────────────────────────────
  window.toggleQtCardByEl = function(headerEl) {
    const card = headerEl.closest('.sn-qt-card, .sn-qt-journal-entry');
    if (!card) return;
    const isOpen = card.classList.contains('open');
    card.classList.toggle('open', !isOpen);
    // Persist open state on data
    const npcIdx = card.dataset.npcQt;
    const questIdx = card.dataset.questQt;
    const playerIdx = card.dataset.playerQt;
    const genIdx = card.dataset.genQt;
    const loreIdx = card.dataset.loreQt;
    const journalIdx = card.dataset.journalQt;
    const val = !isOpen;
    if (npcIdx !== undefined && data.npcs && data.npcs[npcIdx]) data.npcs[npcIdx]._qtOpen = val;
    if (questIdx !== undefined && data.quests && data.quests[questIdx]) data.quests[questIdx]._qtOpen = val;
    if (playerIdx !== undefined && data.playerNotes && data.playerNotes[playerIdx]) data.playerNotes[playerIdx]._qtOpen = val;
    if (genIdx !== undefined && data.generalNotes && data.generalNotes[genIdx]) data.generalNotes[genIdx]._qtOpen = val;
    if (loreIdx !== undefined && data.loreNotes && data.loreNotes[loreIdx]) data.loreNotes[loreIdx]._qtOpen = val;
    if (journalIdx !== undefined && data.journal && data.journal[journalIdx]) data.journal[journalIdx]._qtOpen = val;
  };

  // ── Patch snInit to also inject tab UI ──────────────────────────────
  const _origSnInit = window.snInit;
  window.snInit = function() {
    if (typeof _origSnInit === 'function') _origSnInit();
    injectCSS();
    injectTabUI();
    // If a non-write tab was active before, refresh it
    if (activeTab !== 'write') snRenderTab(activeTab);
  };

  // ── Also inject when panel is opened via toggleSessionNotesPanel ────
  const _origToggle = window.toggleSessionNotesPanel;
  window.toggleSessionNotesPanel = function() {
    if (typeof _origToggle === 'function') _origToggle();
    // After toggle, check if panel is open and inject if needed
    const panel = document.getElementById('sessionNotesPanel');
    if (panel && panel.classList.contains('open')) {
      injectCSS();
      // Small delay to let snInit run first
      setTimeout(() => {
        injectTabUI();
        if (activeTab !== 'write') snRenderTab(activeTab);
        snUpdateTabCounts();
      }, 30);
    }
  };

  // ── Auto-refresh counts after Save All ──────────────────────────────
  // Hook into snSaveAll to refresh counts after data is saved
  const _origSnSaveAll = window.snSaveAll;
  window.snSaveAll = function() {
    if (typeof _origSnSaveAll === 'function') _origSnSaveAll();
    setTimeout(() => {
      snUpdateTabCounts();
      if (activeTab !== 'write') snRenderTab(activeTab);
    }, 200);
  };

  console.log('[notes-quicktab.js] Quick-tab system loaded ✓');

})();
