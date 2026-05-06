// ═══════════════════════════════════════════════════════════
//  priority-hud.js — Floating Priority Panel
//  Tabbed: Quests | Achievements — Collapsible cards
// ═══════════════════════════════════════════════════════════

var PINNED_ACHV_KEY  = 'dnd_pinned_achievements';
var PINNED_QUEST_KEY = 'dnd_pinned_quests';

var MAX_PINNED_QUESTS = 5;
var MAX_PINNED_ACHV   = 10;

var priorityHudOpen    = false;
var priorityHudLocked  = false;
var priorityHudTab     = 'quests';

// ── LocalStorage helpers ─────────────────────────────────
function getPinnedAchievements() {
  try { return JSON.parse(localStorage.getItem(PINNED_ACHV_KEY) || '[]'); }
  catch(e) { return []; }
}
function savePinnedAchievements(arr) {
  localStorage.setItem(PINNED_ACHV_KEY, JSON.stringify(arr));
}
function getPinnedQuests() {
  try { return JSON.parse(localStorage.getItem(PINNED_QUEST_KEY) || '[]'); }
  catch(e) { return []; }
}
function savePinnedQuests(arr) {
  localStorage.setItem(PINNED_QUEST_KEY, JSON.stringify(arr));
}

// ── Collapsed state per item ──────────────────────────────
var _phudCollapsedAchv  = {};
var _phudCollapsedQuest = {};

function togglePhudItemCollapse(type, key) {
  if (type === 'achv') {
    _phudCollapsedAchv[key]  = !_phudCollapsedAchv[key];
  } else {
    _phudCollapsedQuest[key] = !_phudCollapsedQuest[key];
  }
  renderPriorityHud();
}

// ── Pin / Unpin Achievement ───────────────────────────────
function togglePinAchievement(id) {
  var pins = getPinnedAchievements();
  var idx  = pins.indexOf(id);
  if (idx === -1) {
    if (pins.length >= MAX_PINNED_ACHV) {
      showToast('📌 Max ' + MAX_PINNED_ACHV + ' pinned achievements!');
      return;
    }
    pins.push(id);
    _phudCollapsedAchv[id] = true;
    showToast('📌 Achievement pinned');
  } else {
    pins.splice(idx, 1);
    delete _phudCollapsedAchv[id];
    showToast('📌 Achievement unpinned');
  }
  savePinnedAchievements(pins);
  if (typeof renderAchievements === 'function') renderAchievements();
  renderPriorityHud();
  updatePriorityHudBadge();
}

// ── Pin / Unpin Quest ─────────────────────────────────────
function togglePinQuest(questIdx) {
  var pins = getPinnedQuests();
  var i    = pins.indexOf(questIdx);
  if (i === -1) {
    if (pins.length >= MAX_PINNED_QUESTS) {
      showToast('📌 Max ' + MAX_PINNED_QUESTS + ' pinned quests!');
      return;
    }
    pins.push(questIdx);
    _phudCollapsedQuest[questIdx] = true;
    showToast('📌 Quest pinned');
  } else {
    pins.splice(i, 1);
    delete _phudCollapsedQuest[questIdx];
    showToast('📌 Quest unpinned');
  }
  savePinnedQuests(pins);
  if (typeof renderQuests === 'function') renderQuests();
  renderPriorityHud();
  updatePriorityHudBadge();
}

// ── Tab switch ────────────────────────────────────────────
function switchPriorityHudTab(tab) {
  priorityHudTab = tab;
  ['quests','achievements'].forEach(function(t) {
    var btn = document.getElementById('phudTab_' + t);
    if (btn) btn.classList.toggle('active', t === tab);
  });
  renderPriorityHud();
}

// ── Toggle panel open / close ─────────────────────────────
function togglePriorityHud() {
  var panel = document.getElementById('priorityHudPanel');
  if (!panel) return;
  priorityHudOpen = !priorityHudOpen;
  panel.classList.toggle('open', priorityHudOpen);
  if (priorityHudOpen) {
    renderPriorityHud();
    repositionAllPanels();
  } else {
    repositionAllPanels();
  }
}

function togglePriorityHudLock() {
  priorityHudLocked = !priorityHudLocked;
  var btn = document.getElementById('priorityHudLockBtn');
  if (btn) {
    btn.textContent   = priorityHudLocked ? '🔒' : '🔓';
    btn.style.opacity = priorityHudLocked ? '1' : '0.6';
  }
}

// ── Badge counter ─────────────────────────────────────────
function updatePriorityHudBadge() {
  var badge = document.getElementById('priorityHudBadge');
  if (!badge) return;
  var total = getPinnedAchievements().length + getPinnedQuests().length;
  if (total > 0) {
    badge.textContent   = total;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// ── Toggle Quest status from HUD (Active <-> Completed) ──
function toggleQuestStatusFromHud(idx) {
  var quests = (typeof data !== 'undefined' && data.quests) ? data.quests : null;
  if (!quests || !quests[idx]) return;
  var q   = quests[idx];
  var cur = q.status || 'Active';
  q.status = (cur === 'Completed') ? 'Active' : 'Completed';
  if (typeof saveData === 'function') saveData();
  if (typeof renderQuests === 'function') renderQuests();
  if (q.status === 'Completed') {
    showToast('✅ Quest completed! Unpinning…');
    setTimeout(function() { togglePinQuest(idx); }, 700);
  } else {
    showToast('⚔️ Quest set to Active');
    renderPriorityHud();
  }
}

// ── Toggle Achievement unlock from HUD ───────────────────
function toggleAchievementFromHud(id) {
  if (typeof achvUnlocked === 'undefined') return;
  var wasUnlocked = !!achvUnlocked[id];
  if (wasUnlocked) {
    delete achvUnlocked[id];
    showToast('🔒 Achievement locked');
  } else {
    achvUnlocked[id] = true;
    showToast('✅ Achievement unlocked! Unpinning…');
  }
  if (typeof saveAchievements === 'function') saveAchievements();
  if (typeof renderAchievements === 'function') renderAchievements();
  if (typeof updatePortraitRank === 'function') updatePortraitRank();
  if (!wasUnlocked) {
    setTimeout(function() { togglePinAchievement(id); }, 700);
  } else {
    renderPriorityHud();
  }
}

// ── Main render ───────────────────────────────────────────
function renderPriorityHud() {
  var body = document.getElementById('priorityHudBody');
  if (!body) return;
  body.innerHTML = priorityHudTab === 'achievements'
    ? _renderAchievementsTab()
    : _renderQuestsTab();
}

// ── Render Quests tab ─────────────────────────────────────
function _renderQuestsTab() {
  var pinnedQuestIdx = getPinnedQuests();
  var quests = (typeof data !== 'undefined' && data.quests) ? data.quests : [];

  var clean = pinnedQuestIdx.filter(function(idx){ return !!quests[idx]; });
  if (clean.length !== pinnedQuestIdx.length) {
    savePinnedQuests(clean);
    pinnedQuestIdx = clean;
    updatePriorityHudBadge();
  }

  if (pinnedQuestIdx.length === 0) {
    return '<div class="phud-empty">No quests pinned.<br>'
         + '<span>Open Notes &amp; Journal and click 📌 on any quest.</span></div>';
  }

  var STATUS_ICONS  = {Active:'⚔', Completed:'✅', Failed:'❌', 'On Hold':'⏸'};
  var STATUS_COLORS = {Active:'var(--accent-gold)', Completed:'#60cc60', Failed:'#cc4444', 'On Hold':'#6090c0'};

  var slotLabel = pinnedQuestIdx.length + ' / ' + MAX_PINNED_QUESTS + ' quests pinned';
  var html = '<div class="phud-slot-label">' + slotLabel + '</div>';

  pinnedQuestIdx.forEach(function(idx) {
    var q = quests[idx];
    if (!q) return;
    var qs          = q.status || 'Active';
    var isDone      = qs === 'Completed' || qs === 'Failed';
    var isCompleted = qs === 'Completed';
    var sIcon       = STATUS_ICONS[qs]  || '📜';
    var sColor      = STATUS_COLORS[qs] || 'var(--accent-gold)';
    var collapsed   = !!_phudCollapsedQuest[idx];

    var cbHtml = '<label class="phud-cb-wrap" title="' + (isCompleted ? 'Mark as Active' : 'Mark as Completed') + '" onclick="event.stopPropagation()">'
               +   '<input type="checkbox" ' + (isCompleted ? 'checked' : '') + ' onchange="event.stopPropagation();toggleQuestStatusFromHud(' + idx + ')" class="phud-cb">'
               +   '<span class="phud-cb-box"></span>'
               + '</label>';

    html += '<div class="phud-card' + (isDone ? ' phud-card-done' : '') + '">';
    html += '<div class="phud-card-header" onclick="togglePhudItemCollapse(\'quest\',' + idx + ')">'
          +   '<span class="phud-card-chevron">' + (collapsed ? '▶' : '▼') + '</span>'
          +   '<span class="phud-card-icon">' + sIcon + '</span>'
          +   '<span class="phud-card-title' + (isDone ? ' phud-done-name' : '') + '">' + (q.title || '<em>Unnamed Quest</em>') + '</span>'
          +   '<span class="phud-card-status-dot" style="background:' + sColor + ';box-shadow:0 0 6px ' + sColor + ';"></span>'
          +   cbHtml
          +   '<button class="phud-unpin-btn" title="Unpin" onclick="event.stopPropagation();togglePinQuest(' + idx + ')">📌</button>'
          + '</div>';

    if (!collapsed) {
      html += '<div class="phud-card-body">';
      if (q.desc)   html += '<div class="phud-item-desc">' + q.desc.slice(0, 200) + (q.desc.length > 200 ? '…' : '') + '</div>';
      if (q.reward) html += '<div class="phud-item-reward">🏆 ' + q.reward + '</div>';
      html += '<div class="phud-item-tag" style="color:' + sColor + ';">' + qs.toUpperCase() + '</div>';
      html += '</div>';
    }
    html += '</div>';
  });
  return html;
}

// ── Render Achievements tab ───────────────────────────────
function _renderAchievementsTab() {
  var pinnedAchvIds = getPinnedAchievements();

  if (pinnedAchvIds.length === 0) {
    return '<div class="phud-empty">No achievements pinned.<br>'
         + '<span>Go to the Achievements tab and click 📌 on any card.</span></div>';
  }

  var slotLabel = pinnedAchvIds.length + ' / ' + MAX_PINNED_ACHV + ' achievements pinned';
  var html = '<div class="phud-slot-label">' + slotLabel + '</div>';

  pinnedAchvIds.forEach(function(id) {
    var a = (typeof ACHIEVEMENTS !== 'undefined')
          ? ACHIEVEMENTS.find(function(x){ return x.id === id; })
          : null;
    if (!a) return;
    var unlocked  = (typeof achvUnlocked !== 'undefined') && !!achvUnlocked[id];
    var collapsed = !!_phudCollapsedAchv[id];

    // ── TRACKER card in HUD ──────────────────────────────────
    if (a.tracker) {
      var t     = a.tracker;
      var count = (typeof getTrackerCount === 'function') ? getTrackerCount(t.parent) : 0;

      // Gather all milestones for this tracker parent, sorted ascending
      var allAchvMs = (typeof ACHIEVEMENTS !== 'undefined')
        ? ACHIEVEMENTS.filter(function(x){ return x.tracker && x.tracker.parent === t.parent; })
            .sort(function(x,y){ return x.tracker.milestone - y.tracker.milestone; })
        : [a];

      // displayAchv = last earned tier (for name/colour/label).
      // nextAchv    = next incomplete tier (for bar + count target).
      // If nothing earned yet, both point to tier I.
      var displayAchv = (function() {
        var sorted = allAchvMs;
        var lastEarned = null;
        for (var _di = 0; _di < sorted.length; _di++) {
          if ((typeof achvUnlocked !== 'undefined') && achvUnlocked[sorted[_di].id]) {
            lastEarned = sorted[_di];
          }
        }
        return lastEarned || sorted[0];
      })();
      var nextAchv = allAchvMs.find(function(x){
        return (typeof achvUnlocked === 'undefined') || !achvUnlocked[x.id];
      }) || allAchvMs[allAchvMs.length - 1];

      // Visual (name/colour) comes from displayAchv; progress target from nextAchv
      var dt        = displayAchv.tracker;
      var ntMs      = nextAchv.tracker.milestone;
      var allMs     = allAchvMs.map(function(x){ return x.tracker.milestone; });
      var nIdx      = allMs.indexOf(ntMs);
      var prevMs    = nIdx > 0 ? allMs[nIdx - 1] : 0;
      var range     = ntMs - prevMs;
      var dUnlocked = (typeof achvUnlocked !== 'undefined') && !!achvUnlocked[displayAchv.id];
      var allDone   = nextAchv === allAchvMs[allAchvMs.length - 1] && dUnlocked;
      var tierCfg   = (typeof _TRACKER_TIER_CONFIG !== 'undefined') ? _TRACKER_TIER_CONFIG[dt.tier] : null;
      var tc        = tierCfg ? tierCfg.color : 'var(--accent-gold)';
      var tg        = tierCfg ? tierCfg.glow  : 'transparent';
      var barPct    = allDone ? 100 : (range > 0 ? Math.min(100, Math.round((count - prevMs) / range * 100)) : 0);
      // Override the milestone shown in the count label to the next target
      var displayMs = ntMs;
      var displayUnit = nextAchv.tracker.unit;

      html += '<div class="phud-card' + (allDone ? ' phud-card-done' : '') + '" style="border-left:3px solid ' + tc + ';">';
      html += '<div class="phud-card-header" onclick="togglePhudItemCollapse(\'achv\',\'' + id + '\')">'
            +   '<span class="phud-card-chevron">' + (collapsed ? '▶' : '▼') + '</span>'
            +   '<span class="phud-card-icon" style="' + (allDone ? 'filter:drop-shadow(0 0 3px ' + tg + ');' : 'filter:grayscale(0.6);opacity:0.55;') + '">' + displayAchv.icon + '</span>'
            +   '<span style="display:flex;flex-direction:column;flex:1;min-width:0;gap:1px;">'
            +     '<span class="phud-card-title' + (allDone ? ' phud-done-name' : '') + '" style="color:' + tc + ';">' + displayAchv.name + '</span>'
            +     '<span style="font-size:11px;color:var(--text-muted);font-style:italic;line-height:1.4;white-space:normal;opacity:0.9;">' + displayAchv.desc + '</span>'
            +   '</span>'
            +   '<button class="phud-unpin-btn" title="Unpin" onclick="event.stopPropagation();togglePinAchievement(\'' + id + '\')">📌</button>'
            + '</div>';
      if (!collapsed) {
        html += '<div class="phud-card-body">'
              + '<div style="background:var(--bg-panel);border-radius:3px;height:4px;overflow:hidden;margin-bottom:6px;">'
                + '<div style="height:100%;width:' + barPct + '%;background:' + tc + ';border-radius:3px;transition:width 0.3s;"></div>'
              + '</div>'
              + '<div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;">'
                + '<span style="font-family:\'Cinzel\',serif;font-size:10px;color:' + tc + ';flex:1;">'
                  + count.toLocaleString() + ' / ' + displayMs.toLocaleString() + ' ' + displayUnit + (allDone ? ' ✓' : '') + '</span>'
              + '</div>'
              + '<div style="display:flex;gap:4px;">'
                + '<button onclick="event.stopPropagation();incrementTracker(\'' + dt.parent + '\',-1);renderPriorityHud();" '
                  + 'style="width:24px;height:24px;border-radius:3px;border:1px solid var(--border-dark);background:var(--bg-panel);color:var(--text-muted);cursor:pointer;font-size:13px;line-height:1;" '
                  + 'onmouseover="this.style.borderColor=\'#e53935\';this.style.color=\'#e53935\'" '
                  + 'onmouseout="this.style.borderColor=\'var(--border-dark)\';this.style.color=\'var(--text-muted)\'">−</button>'
                + '<button onclick="event.stopPropagation();incrementTracker(\'' + dt.parent + '\',1);renderPriorityHud();" '
                  + 'style="flex:1;height:24px;border-radius:3px;border:1px solid ' + tc + ';background:' + tc + '22;color:' + tc + ';cursor:pointer;font-size:15px;font-weight:700;" '
                  + 'onmouseover="this.style.opacity=\'0.75\'" onmouseout="this.style.opacity=\'1\'">+</button>'
                + '<button onclick="event.stopPropagation();openTrackerEditModal(\'' + dt.parent + '\',' + count + ');" '
                  + 'style="width:24px;height:24px;border-radius:3px;border:1px solid var(--border-dark);background:var(--bg-panel);color:var(--text-muted);cursor:pointer;font-size:11px;line-height:1;" '
                  + 'title="Set manually">✎</button>'
              + '</div>'
              + '<div class="phud-item-tag" style="color:' + tc + ';margin-top:5px;">📈 TRACKER — ' + (tierCfg ? tierCfg.label.toUpperCase() : '') + '</div>'
              + '</div>';
      }
      html += '</div>';
      return;
    }

    // ── NORMAL achievement card ───────────────────────────────
    var cbHtml = '<label class="phud-cb-wrap" title="' + (unlocked ? 'Mark as locked' : 'Mark as earned') + '" onclick="event.stopPropagation()">'
               +   '<input type="checkbox" ' + (unlocked ? 'checked' : '') + ' onchange="event.stopPropagation();toggleAchievementFromHud(\'' + id + '\')" class="phud-cb">'
               +   '<span class="phud-cb-box"></span>'
               + '</label>';

    html += '<div class="phud-card' + (unlocked ? ' phud-card-done' : '') + '">';
    html += '<div class="phud-card-header" onclick="togglePhudItemCollapse(\'achv\',\'' + id + '\')">'
          +   '<span class="phud-card-chevron">' + (collapsed ? '▶' : '▼') + '</span>'
          +   '<span class="phud-card-icon" style="' + (unlocked ? '' : 'filter:grayscale(1);opacity:0.55;') + '">' + (unlocked ? '✅' : a.icon) + '</span>'
          +   '<span style="display:flex;flex-direction:column;flex:1;min-width:0;gap:1px;">'
          +     '<span class="phud-card-title' + (unlocked ? ' phud-done-name' : '') + '">' + a.name + '</span>'
          +     '<span style="font-size:11px;color:var(--text-muted);font-style:italic;line-height:1.4;white-space:normal;opacity:0.9;">' + a.desc + '</span>'
          +   '</span>'
          +   (unlocked ? '<span class="phud-card-status-dot" style="background:#60cc60;box-shadow:0 0 6px #60cc60;flex-shrink:0;"></span>' : '')
          +   cbHtml
          +   '<button class="phud-unpin-btn" title="Unpin" onclick="event.stopPropagation();togglePinAchievement(\'' + id + '\')">📌</button>'
          + '</div>';

    if (!collapsed) {
      html += '<div class="phud-card-body">'
            + '<div class="phud-item-tag">' + a.cat.toUpperCase() + '</div>'
            + '</div>';
    }
    html += '</div>';
  });
  return html;
}

// ── repositionAllPanels ───────────────────────────────────
function repositionAllPanels() {
  if (typeof repositionPanels === 'function') repositionPanels();
}

// ── Outside-click: close panel if click was outside ──────
(function() {
  var _insideOnDown = false;

  document.addEventListener('pointerdown', function(e) {
    if (!priorityHudOpen) return;
    var wrapper = document.getElementById('priorityHudWrapper');
    _insideOnDown = !!(wrapper && wrapper.contains(e.target));
  }, true);

  document.addEventListener('pointerup', function(e) {
    if (!priorityHudOpen || priorityHudLocked) return;
    if (_insideOnDown) return;
    var wrapper = document.getElementById('priorityHudWrapper');
    var upInside = !!(wrapper && wrapper.contains(e.target));
    if (upInside) return;
    priorityHudOpen = false;
    var panel = document.getElementById('priorityHudPanel');
    if (panel) panel.classList.remove('open');
    repositionAllPanels();
  });
})();

// ── Patch renderQuests to inject 📌 pin buttons ──────────
(function() {
  function _injectQuestPins() {
    var container = document.getElementById('questList');
    if (!container) return;
    var pins = getPinnedQuests();
    Array.from(container.children).forEach(function(card) {
      var idx = parseInt(card.dataset.cardIdx);
      if (isNaN(idx)) return;
      var existing = card.querySelector('.phud-quest-pin-btn');
      var isPinned = pins.indexOf(idx) !== -1;
      if (existing) {
        existing.style.opacity  = isPinned ? '1' : '0.35';
        existing.dataset.pinned = isPinned ? '1' : '0';
        existing.title = isPinned ? 'Unpin from Priority HUD' : 'Pin to Priority HUD';
        return;
      }
      var header = card.querySelector('.quest-card-header');
      if (!header) return;
      var btn = document.createElement('button');
      btn.className      = 'phud-quest-pin-btn';
      btn.dataset.qidx   = idx;
      btn.dataset.pinned = isPinned ? '1' : '0';
      btn.title          = isPinned ? 'Unpin from Priority HUD' : 'Pin to Priority HUD';
      btn.style.cssText  = 'flex-shrink:0;background:none;border:none;cursor:pointer;font-size:16px;padding:2px 4px;line-height:1;opacity:' + (isPinned ? '1' : '0.35') + ';transition:opacity 0.2s;';
      btn.innerHTML      = '📌';
      btn.onmouseover = function(){ this.style.opacity = '1'; };
      btn.onmouseout  = function(){ this.style.opacity = this.dataset.pinned === '1' ? '1' : '0.35'; };
      btn.onclick = function(e) {
        e.stopPropagation();
        togglePinQuest(parseInt(this.dataset.qidx));
      };
      var delBtn = header.querySelector('.del-btn');
      if (delBtn) header.insertBefore(btn, delBtn);
      else        header.appendChild(btn);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (typeof renderQuests === 'function') {
      var _orig = window.renderQuests;
      window.renderQuests = function() {
        _orig.apply(this, arguments);
        setTimeout(_injectQuestPins, 0);
      };
    }

    var questContainer = document.getElementById('questList');
    if (questContainer) {
      var _obs = new MutationObserver(function() { _injectQuestPins(); });
      _obs.observe(questContainer, { childList: true, subtree: false });
    }

    setTimeout(function() {
      if (typeof renderQuests === 'function' && !window._phudPatched) {
        var _orig2 = window.renderQuests;
        window.renderQuests = function() {
          _orig2.apply(this, arguments);
          setTimeout(_injectQuestPins, 0);
        };
      }
      window._phudPatched = true;
      _injectQuestPins();
      updatePriorityHudBadge();

      var qc2 = document.getElementById('questList');
      if (qc2 && !qc2._phudObserving) {
        qc2._phudObserving = true;
        var _obs2 = new MutationObserver(function() { _injectQuestPins(); });
        _obs2.observe(qc2, { childList: true, subtree: false });
      }
    }, 1500);
  });
})();

// ── Monkey-patch repositionPanels to include priorityHudPanel ──
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var _origReposition = window.repositionPanels;
    if (typeof _origReposition !== 'function') return;

    window.repositionPanels = function() {
      _origReposition.apply(this, arguments);

      var PANEL_RIGHT  = 88;
      var PANEL_GAP    = 8;
      var PANEL_BOTTOM = 24;

      var panelOrder = [
        { id: 'dicePanel',      width: 280 },
        { id: 'quickRollPanel', width: 340 },
        { id: 'combatHudPanel', width: 360 },
        { id: 'alliesPanel',    width: 300 }
      ];

      var currentRight = PANEL_RIGHT;
      panelOrder.forEach(function(p) {
        var el = document.getElementById(p.id);
        if (el && el.classList.contains('open')) {
          currentRight += p.width + PANEL_GAP;
        }
      });

      var phudPanel = document.getElementById('priorityHudPanel');
      if (phudPanel && priorityHudOpen) {
        phudPanel.style.right      = currentRight + 'px';
        phudPanel.style.bottom     = PANEL_BOTTOM + 'px';
        phudPanel.style.top        = 'auto';
        phudPanel.style.transition = 'right 0.25s ease, bottom 0.25s ease';
      }
    };
  }, 1000);
});

// ── Live sync: re-render HUD whenever achievements/trackers change ──
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var _origRenderAchv = window.renderAchievements;
    if (typeof _origRenderAchv === 'function') {
      window.renderAchievements = function() {
        _origRenderAchv.apply(this, arguments);
        if (priorityHudOpen && priorityHudTab === 'achievements') {
          renderPriorityHud();
        }
      };
    }
  }, 500);
});
