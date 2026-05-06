// ═══════════════════════════════════════════
//  themes.js - THEME SYSTEM, PORTRAITS, ANIMATIONS
// ═══════════════════════════════════════════

// ── Spell List sub-tab switching ──
function switchSpellListSubTab(tab) {
  ['spells','invocations','psionics'].forEach(t => {
    const el = document.getElementById('sltab-content-' + t);
    const btn = document.getElementById('sltab-' + t);
    if (el) el.style.display = t === tab ? '' : 'none';
    if (btn) {
      btn.className = t === tab ? 'btn btn-primary btn-sm' : 'btn btn-silver btn-sm';
      btn.style.fontFamily = "'Cinzel',serif";
      btn.style.letterSpacing = '1px';
    }
  });
  if (tab === 'invocations') renderInvocationList();
  if (tab === 'psionics') renderPsionicList();
}

// ── Render Invocation List ──
function renderInvocationList() {
  const search = (document.getElementById('invocSearch')?.value||'').toLowerCase();
  let items = INVOCATION_DB.filter(inv => {
    if (search && !inv.name.toLowerCase().includes(search)
               && !inv.description.toLowerCase().includes(search)
               && !(inv.prerequisites||'').toLowerCase().includes(search)) return false;
    return true;
  });
  items.sort((a,b) => a.name.localeCompare(b.name));

  const countEl = document.getElementById('invCount');
  if (countEl) countEl.textContent = items.length + ' invocation' + (items.length !== 1 ? 's' : '') + ' found';

  const tableEl = document.getElementById('invTable');
  if (!tableEl) return;
  if (items.length === 0) {
    tableEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;">No invocations match the current filters</div>';
    return;
  }

  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:8px;">';
  items.forEach((inv, idx) => {
    const globalIdx = INVOCATION_DB.indexOf(inv);
    html += `<div class="panel panel-sm" style="cursor:pointer;border-left:3px solid #7c4dff;" onclick="toggleSpellExpand(this)">
      <div style="display:flex;align-items:start;gap:6px;">
        <div style="flex:1;">
          <div style="font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:var(--text-primary);">${inv.name}</div>
          ${inv.prerequisites ? `<div style="margin-top:3px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:#7c4dff;background:#7c4dff18;border:1px solid #7c4dff44;border-radius:3px;padding:1px 6px;display:inline-block;">Prereq: ${inv.prerequisites}</div>` : ''}
          <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);margin-top:3px;">📚 ${inv.source}${inv.page?' p.'+inv.page:''}</div>
        </div>
        <button class="btn btn-primary btn-sm" style="padding:3px 8px;font-size:10px;flex-shrink:0;" onclick="event.stopPropagation();addInvocationToSheet(${globalIdx})" title="Add to sheet">➕ Add</button>
      </div>
      <div class="spell-desc-expand" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-dark);">
        <div style="font-family:'Crimson Text',serif;font-size:16px;color:var(--text-secondary);line-height:1.6;">${inv.description||'No description.'}</div>
      </div>
    </div>`;
  });
  html += '</div>';
  tableEl.innerHTML = html;
}

// ── Render Psionic List ──
function renderPsionicList() {
  const search = (document.getElementById('psiSearch')?.value||'').toLowerCase();
  const typeFilter = document.getElementById('psiType')?.value||'';
  let items = PSIONIC_DB.filter(p => {
    if (typeFilter && p.type !== typeFilter) return false;
    if (search && !p.name.toLowerCase().includes(search)
               && !(p.description||'').toLowerCase().includes(search)) return false;
    return true;
  });
  items.sort((a,b) => {
    if (a.type !== b.type) return a.type === 'T' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const countEl = document.getElementById('psiCount');
  if (countEl) countEl.textContent = items.length + ' psionic' + (items.length !== 1 ? 's' : '') + ' found';

  const tableEl = document.getElementById('psiTable');
  if (!tableEl) return;
  if (items.length === 0) {
    tableEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;">No psionics match the current filters</div>';
    return;
  }

  const talents = items.filter(p => p.type === 'T');
  const disciplines = items.filter(p => p.type === 'D');
  let html = '';

  function renderPsiGroup(group, label, color) {
    if (!group.length) return '';
    let out = `<div style="font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${color};border-bottom:1px solid ${color}44;padding-bottom:5px;margin:16px 0 8px;">✦ ${label}</div>`;
    out += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:8px;">';
    group.forEach(p => {
      const globalIdx = PSIONIC_DB.indexOf(p);
      out += `<div class="panel panel-sm" style="cursor:pointer;border-left:3px solid ${color};" onclick="toggleSpellExpand(this)">
        <div style="display:flex;align-items:start;gap:6px;">
          <div style="flex:1;">
            <div style="font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:var(--text-primary);">${p.name}</div>
            <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);margin-top:3px;">📚 ${p.source}${p.page?' p.'+p.page:''}</div>
          </div>
          <button class="btn btn-primary btn-sm" style="padding:3px 8px;font-size:10px;flex-shrink:0;" onclick="event.stopPropagation();addPsionicToSheet(${globalIdx})" title="Add to sheet">➕ Add</button>
        </div>
        <div class="spell-desc-expand" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-dark);">
          <div style="font-family:'Crimson Text',serif;font-size:16px;color:var(--text-secondary);line-height:1.6;">${p.description||''}</div>
          ${p.focus ? `<div style="margin-top:6px;font-family:'Crimson Text',serif;font-size:17px;color:var(--accent-gold);font-style:italic;"><strong>Psychic Focus:</strong> ${p.focus}</div>` : ''}
          ${(p.modes||[]).map(m => `
            <div style="margin-top:8px;padding:8px;background:var(--bg-input);border-radius:4px;border:1px solid var(--border-dark);">
              <div style="font-family:'Cinzel',serif;font-size:11px;font-weight:700;color:${color};">${m.name}${m.cost?' <span style=\"font-size:10px;color:var(--text-muted);\">('+m.cost+')</span>':''}${m.concentration?' <span style=\"font-size:10px;color:#e67e22;\">[C ${m.concentration}]</span>':''}</div>
              <div style="font-family:'Crimson Text',serif;font-size:17px;color:var(--text-secondary);margin-top:4px;line-height:1.5;">${m.description}</div>
            </div>`).join('')}
        </div>
      </div>`;
    });
    out += '</div>';
    return out;
  }

  html += renderPsiGroup(talents, 'Psionic Talents', '#00bcd4');
  html += renderPsiGroup(disciplines, 'Psionic Disciplines', '#9c27b0');
  tableEl.innerHTML = html;
}


// ── Theme System ──
function applyTheme(name) {
  // Ak nie je toto auto-apply, vypni auto mode (manuálny výber témy)
  if (!window._applyingAutoTheme) {
    localStorage.setItem('dnd_seasonal_auto', 'off');
    // Aktualizuj stav checkboxu ak je viditeľný
    const tog = document.getElementById('seasonalAutoToggle');
    if (tog) tog.checked = false;
  }
  document.body.setAttribute('data-theme', name === 'default' ? '' : name);
  if (name === 'default') document.body.removeAttribute('data-theme');
  // Update active button
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === name);
  });
  // Handle animated themes
  const animThemes = { smoke: 'smoke', ember: 'ember', fairy: 'fairy', 'sakura-anim': 'sakura', 'solo-anim': 'solo', storm: 'storm', abyss: 'abyss', blizzard: 'blizzard', crimsonrain: 'crimsonrain', aurora: 'aurora', voidanim: 'voidanim', halloween: 'halloween', christmas: 'christmas', newyear: 'newyear', valentine: 'valentine', easter: 'easter', summer: 'summer', autumn: 'autumn', winterfrost: 'winterfrost', spring: 'spring', chineseny: 'chineseny', beltane: 'beltane', mermay: 'mermay', midsummer: 'midsummer', feast: 'feast', obsidian: 'obsidian', crimsonking: 'crimsonking', voidwalker: 'voidwalker', celestial: 'celestial', eldritch: 'eldritch', ascendant: 'ascendant', absolute: 'absolute', primordial: 'primordial', godslayer: 'godslayer', gionmatsuri: 'gionmatsuri', toronagashi: 'toronagashi', kagamibiraki: 'kagamibiraki', sepia_codex: 'sepia_codex', neon_dungeon: 'neon_dungeon', monochrome: 'monochrome', infected: 'infected', frozen_tomb: 'frozen_tomb', forge_of_ages: 'forge_of_ages', the_dreaming: 'the_dreaming' };
  if (animThemes[name]) {
    if (window._themeAnimStart) window._themeAnimStart(animThemes[name]);
  } else {
    if (window._themeAnimStop) window._themeAnimStop();
  }
  // Update quick theme button icon
  const icons = {default:'🏺',arcane:'🔮',nature:'🌿',shadow:'🌑',fire:'🔥',ice:'❄️',smoke:'🌫️',ember:'🪨',fairy:'🧚','sakura':'🌸','sakura-anim':'🌸','solo':'⚔️','solo-anim':'⚔️','eva01':'🤖','storm':'⛈️','abyss':'🩸','underdark':'🍄','paladin':'👑','bloodmoon':'🌕','void':'🌀','glacier':'🧊','ancientgold':'📜','blizzard':'❄️','crimsonrain':'🩸','aurora':'🌌','voidanim':'🌀','halloween':'🎃','christmas':'🎄','newyear':'🎆','valentine':'💝','easter':'🐣','summer':'☀️','autumn':'🍂','winterfrost':'🌨️','spring':'🌸','chineseny':'🏮','beltane':'🔥','mermay':'🌊','midsummer':'⚡','feast':'🍖','obsidian':'🖤','crimsonking':'♛','voidwalker':'🌌','celestial':'☀️','eldritch':'🐙','ascendant':'✨','absolute':'♾️','primordial':'🌋','godslayer':'⚔️','gionmatsuri':'🏮','toronagashi':'🪔','kagamibiraki':'🎋','sepia_codex':'🪶','neon_dungeon':'⚡','monochrome':'🎭','infected':'🍄','frozen_tomb':'🧊','forge_of_ages':'🔨','the_dreaming':'🌙'};
  const qBtn = document.getElementById('themeQuickBtn');
  if (qBtn) qBtn.textContent = icons[name] || '🎨';
  // Update background glow to match theme accent colors
  setTimeout(() => {
    const style = getComputedStyle(document.body);
    const amber = style.getPropertyValue('--accent-amber').trim() || '#b87a20';
    const red   = style.getPropertyValue('--accent-red').trim()   || '#8b1a1a';
    function hexToRgbArr(hex) {
      hex = hex.replace('#','');
      if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
      return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];
    }
    try {
      const [ar,ag,ab] = hexToRgbArr(amber);
      const [rr,rg,rb] = hexToRgbArr(red);
      document.body.style.setProperty('--bg-glow-top',    `rgba(${ar},${ag},${ab},0.10)`);
      document.body.style.setProperty('--bg-glow-bottom',  `rgba(${rr},${rg},${rb},0.07)`);
    } catch(e) {}
  }, 20);
  // Persist
  try { localStorage.setItem('dnd_theme', name); } catch(e) {}
  // Reset clock marks so they redraw with new theme colors
  setTimeout(() => {
    const cm = document.getElementById('clockMarks');
    const qm = document.getElementById('qtMarks');
    if (cm) cm.innerHTML = '';
    if (qm) qm.innerHTML = '';
    updateClock();
  }, 30);
  // Refresh rewards panel if open so exclusive theme chips update their active state
  setTimeout(() => {
    const panel = document.getElementById('achvRewardsPanel');
    if (panel && panel.offsetParent !== null && typeof renderRewardsPanel === 'function') {
      renderRewardsPanel();
    }
  }, 40);
}

function toggleSettingsPanel() {
  const panel = document.getElementById('settingsPanel');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  if (isOpen) {
    // Auto-switch to the tab that contains the currently active theme
    const activeTheme = document.body.getAttribute('data-theme') || 'default';
    const seasonalThemes = ['halloween','christmas','newyear','valentine','easter','summer','autumn','winterfrost','spring','chineseny','beltane','mermay','midsummer','feast','obsidian','crimsonking','voidwalker','celestial','eldritch','ascendant','absolute','kagamibiraki'];
    const animatedThemes = ['smoke','ember','fairy','sakura-anim','solo-anim','storm','abyss','blizzard','crimsonrain','aurora','voidanim'];
    if (seasonalThemes.includes(activeTheme)) {
      switchThemeCat('seasonal');
    } else if (animatedThemes.includes(activeTheme)) {
      switchThemeCat('animated');
    } else {
      switchThemeCat('static');
    }
  }
}

// Close settings panel when clicking outside
document.addEventListener('click', function(e) {
  const panel = document.getElementById('settingsPanel');
  const btn = document.getElementById('settingsGearBtn');
  if (panel && panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// Load saved theme on startup
// Ak je auto mode zapnutý, tému načíta seasonal IIFE neskôr — tu nič nerobíme
(function() {
  try {
    const seasonalAutoOff = localStorage.getItem('dnd_seasonal_auto') === 'off';
    if (seasonalAutoOff) {
      // Auto je vypnuté — načítaj manuálne uloženú tému
      const saved = localStorage.getItem('dnd_theme');
      if (saved && saved !== 'default') {
        const animThemes = ['smoke','ember','fairy','sakura-anim','solo-anim','storm','abyss','blizzard','crimsonrain','aurora','voidanim','halloween','christmas','newyear','valentine','easter','summer','autumn','winterfrost','spring','chineseny','beltane','mermay','midsummer','feast','gionmatsuri','toronagashi','kagamibiraki'];
        window._applyingAutoTheme = true;
        if (animThemes.includes(saved)) {
          setTimeout(() => { applyTheme(saved); window._applyingAutoTheme = false; }, 200);
        } else {
          applyTheme(saved);
          window._applyingAutoTheme = false;
        }
      }
    }
    // Ak auto nie je vypnuté, seasonal IIFE (nižšie) prevezme kontrolu
  } catch(e) {}
})();

// ── Animated Theme Engine ──
(function() {
  const canvas = document.getElementById('theme-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame = null;
  let currentAnim = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Smoke ──
  function createSmoke() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: 30 + Math.random() * 60,
      speedY: 0.3 + Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: 0,
      maxOpacity: 0.08 + Math.random() * 0.1,
      grow: 0.08 + Math.random() * 0.12,
      phase: 'in',
      life: 0,
      maxLife: 300 + Math.random() * 300,
      hue: 200 + Math.random() * 60,
    };
  }
  function drawSmoke() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length < 18) particles.push(createSmoke());
    particles.forEach((p, i) => {
      p.life++;
      p.x += p.speedX + Math.sin(p.life * 0.01) * 0.3;
      p.y -= p.speedY;
      p.size += p.grow;
      if (p.life < p.maxLife * 0.15) p.opacity = (p.life / (p.maxLife * 0.15)) * p.maxOpacity;
      else if (p.life > p.maxLife * 0.7) p.opacity = p.maxOpacity * (1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3));
      else p.opacity = p.maxOpacity;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, `hsla(${p.hue},15%,60%,${p.opacity})`);
      g.addColorStop(1, `hsla(${p.hue},10%,40%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      if (p.life >= p.maxLife || p.y < -p.size) particles.splice(i, 1);
    });
  }

  // ── Embers ──
  function createEmber() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 5,
      size: 1.5 + Math.random() * 3,
      speedY: 0.8 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 1.2,
      opacity: 0,
      life: 0,
      maxLife: 80 + Math.random() * 120,
      hue: 15 + Math.random() * 25,
      glow: 0.6 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2,
    };
  }
  function drawEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length < 60) for(let i=0;i<3;i++) particles.push(createEmber());
    particles.forEach((p, i) => {
      p.life++;
      p.wobble += 0.05;
      p.x += p.speedX + Math.sin(p.wobble) * 0.5;
      p.y -= p.speedY;
      if (p.life < 15) p.opacity = p.life / 15;
      else if (p.life > p.maxLife * 0.75) p.opacity = 1 - (p.life - p.maxLife * 0.75) / (p.maxLife * 0.25);
      else p.opacity = 1;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      const glowOp = p.opacity * p.glow * (0.7 + 0.3 * Math.sin(p.wobble * 2));
      g.addColorStop(0, `hsla(${p.hue+20},100%,90%,${p.opacity})`);
      g.addColorStop(0.3, `hsla(${p.hue},100%,60%,${glowOp * 0.8})`);
      g.addColorStop(1, `hsla(${p.hue},100%,40%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      if (p.life >= p.maxLife || p.y < -10) particles.splice(i, 1);
    });
  }

  // ── Fairy ──
  const fairyColors = ['#c090ff','#e0b8ff','#80d8ff','#b0ff80','#ffb8e8','#ffe080'];
  function createFirefly() {
    const color = fairyColors[Math.floor(Math.random() * fairyColors.length)];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      opacity: 0,
      life: 0,
      maxLife: 160 + Math.random() * 200,
      color,
      targetX: Math.random() * canvas.width,
      targetY: Math.random() * canvas.height,
      wobble: Math.random() * Math.PI * 2,
      trail: [],
    };
  }
  function drawFairy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length < 28) particles.push(createFirefly());
    particles.forEach((p, i) => {
      p.life++;
      p.wobble += 0.03;
      // Wander toward target with gentle noise
      const dx = p.targetX - p.x, dy = p.targetY - p.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 30) { p.targetX = Math.random() * canvas.width; p.targetY = Math.random() * canvas.height; }
      p.vx += (dx/dist) * 0.02 + (Math.random()-0.5)*0.08;
      p.vy += (dy/dist) * 0.02 + (Math.random()-0.5)*0.08;
      p.vx *= 0.97; p.vy *= 0.97;
      p.x += p.vx; p.y += p.vy;
      if (p.life < 30) p.opacity = p.life / 30;
      else if (p.life > p.maxLife - 30) p.opacity = (p.maxLife - p.life) / 30;
      else p.opacity = 0.8 + 0.2 * Math.sin(p.wobble * 3);

      // Trail
      p.trail.push({x:p.x, y:p.y});
      if (p.trail.length > 12) p.trail.shift();
      p.trail.forEach((t, ti) => {
        const alpha = (ti / p.trail.length) * p.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `,${alpha})`).replace('rgb','rgba').replace('#',`rgba(${parseInt(p.color.slice(1,3),16)},${parseInt(p.color.slice(3,5),16)},${parseInt(p.color.slice(5,7),16)},`);
        ctx.fill();
      });

      // Glow core
      const pulseSize = p.size * (1 + 0.3 * Math.sin(p.wobble * 4));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 5);
      const hex = p.color;
      const r = parseInt(hex.slice(1,3),16), gv = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      g.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
      g.addColorStop(0.2, `rgba(${r},${gv},${b},${p.opacity * 0.9})`);
      g.addColorStop(0.6, `rgba(${r},${gv},${b},${p.opacity * 0.3})`);
      g.addColorStop(1, `rgba(${r},${gv},${b},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseSize * 5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      if (p.life >= p.maxLife) particles.splice(i, 1);
    });
  }

  // ── Sakura Petals ──
  function createPetal() {
    const colors = ['#f090c0','#ffbfdf','#e0a0c8','#ffd0e8','#c870a0','#e0b8ff'];
    return {
      x: Math.random() * (canvas.width + 200) - 100,
      y: -20,
      size: 4 + Math.random() * 8,
      speedX: 0.5 + Math.random() * 1.5,
      speedY: 0.8 + Math.random() * 1.2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      opacity: 0,
      life: 0,
      maxLife: 400 + Math.random() * 400,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }
  function drawSakura() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length < 55) particles.push(createPetal());
    particles.forEach((p, i) => {
      p.life++;
      p.wobble += p.wobbleSpeed;
      p.rot += p.rotSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 1.2;
      p.y += p.speedY + Math.cos(p.wobble * 0.7) * 0.4;
      if (p.life < 20) p.opacity = p.life / 20;
      else if (p.life > p.maxLife - 30) p.opacity = (p.maxLife - p.life) / 30;
      else p.opacity = 0.65 + 0.25 * Math.sin(p.wobble * 2);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      // Draw petal shape
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      // Second petal lobe
      ctx.beginPath();
      ctx.ellipse(p.size * 0.5, -p.size * 0.2, p.size * 0.7, p.size * 0.4, -0.4, 0, Math.PI * 2);
      ctx.globalAlpha = p.opacity * 0.6;
      ctx.fill();
      ctx.restore();
      if (p.life >= p.maxLife || p.y > canvas.height + 30) particles.splice(i, 1);
    });
  }

  // ── Shadow Runes: Magical Rising Runes ──
  let soloTick = 0;
  const runeChars = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ','◈','◆','⬡','⬢','✦','⟁','⟐','⧖','⋈'];
  const soloColors = [
    {h:270,s:100,l:70},  // bright violet
    {h:285,s:90,l:65},   // purple
    {h:300,s:80,l:60},   // magenta-purple
    {h:255,s:100,l:75},  // periwinkle
    {h:310,s:70,l:80},   // pink-purple
  ];

  // Floating rune circles (magic circles in background)
  const magicCircles = [];
  function createMagicCircle() {
    return {
      x: 80 + Math.random() * (canvas.width - 160),
      y: 80 + Math.random() * (canvas.height - 160),
      radius: 40 + Math.random() * 80,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.004),
      opacity: 0,
      life: 0,
      maxLife: 500 + Math.random() * 600,
      segments: 6 + Math.floor(Math.random() * 4),
      hue: 265 + Math.random() * 45,
    };
  }

  function createRune() {
    const col = soloColors[Math.floor(Math.random() * soloColors.length)];
    const isLarge = Math.random() > 0.75;
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      char: runeChars[Math.floor(Math.random() * runeChars.length)],
      size: isLarge ? (22 + Math.random() * 26) : (10 + Math.random() * 14),
      speed: 0.35 + Math.random() * 0.7,
      opacity: 0,
      life: 0,
      maxLife: isLarge ? (280 + Math.random() * 220) : (180 + Math.random() * 200),
      hue: col.h,
      sat: col.s,
      lum: col.l,
      glow: isLarge ? 30 : 14,
      drift: (Math.random() - 0.5) * 0.25,
      wobble: Math.random() * Math.PI * 2,
      wobbleAmp: 0.4 + Math.random() * 0.8,
      spin: (Math.random() - 0.5) * 0.025,
      rot: Math.random() * Math.PI * 2,
      isLarge,
      // trail
      trail: [],
    };
  }

  function drawSolo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    soloTick++;

    // Deep void portal glow from center-bottom
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.85;
    const pulseScale = 0.04 + 0.015 * Math.sin(soloTick * 0.018);
    const portalG = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.65);
    portalG.addColorStop(0,   `rgba(100,0,180,${pulseScale * 1.4})`);
    portalG.addColorStop(0.35,`rgba(60,0,120,${pulseScale * 0.8})`);
    portalG.addColorStop(0.7, `rgba(20,0,50,${pulseScale * 0.3})`);
    portalG.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = portalG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw magic circles
    if (soloTick % 120 === 0 && magicCircles.length < 4) magicCircles.push(createMagicCircle());
    magicCircles.forEach((mc, mi) => {
      mc.life++;
      mc.rot += mc.rotSpeed;
      if (mc.life < 80) mc.opacity = (mc.life / 80) * 0.35;
      else if (mc.life > mc.maxLife - 80) mc.opacity = ((mc.maxLife - mc.life) / 80) * 0.35;
      else mc.opacity = 0.22 + 0.13 * Math.sin(mc.life * 0.02);

      ctx.save();
      ctx.translate(mc.x, mc.y);
      ctx.rotate(mc.rot);
      ctx.globalAlpha = mc.opacity;

      // Outer ring
      ctx.beginPath();
      ctx.arc(0, 0, mc.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${mc.hue},90%,60%)`;
      ctx.lineWidth = 0.8;
      ctx.shadowColor = `hsl(${mc.hue},100%,70%)`;
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, mc.radius * 0.65, 0, Math.PI * 2);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Polygon inscribed
      ctx.beginPath();
      for (let k = 0; k < mc.segments; k++) {
        const angle = (k / mc.segments) * Math.PI * 2;
        const px = Math.cos(angle) * mc.radius * 0.95;
        const py = Math.sin(angle) * mc.radius * 0.95;
        k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Rune marks at vertices
      ctx.font = `${mc.radius * 0.18}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `hsl(${mc.hue},90%,75%)`;
      ctx.shadowBlur = 8;
      for (let k = 0; k < mc.segments; k++) {
        const angle = (k / mc.segments) * Math.PI * 2;
        const px = Math.cos(angle) * mc.radius * 1.12;
        const py = Math.sin(angle) * mc.radius * 1.12;
        ctx.fillText(runeChars[k % runeChars.length], px, py);
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      if (mc.life >= mc.maxLife) magicCircles.splice(mi, 1);
    });

    // Rising runes
    if (particles.length < 55) particles.push(createRune());
    particles.forEach((p, i) => {
      p.life++;
      p.wobble += 0.022;
      p.rot += p.spin;
      p.x += p.drift + Math.sin(p.wobble) * p.wobbleAmp;
      p.y -= p.speed;

      if (p.life < 35) p.opacity = p.life / 35;
      else if (p.life > p.maxLife * 0.78) p.opacity = (p.maxLife - p.life) / (p.maxLife * 0.22);
      else p.opacity = 0.7 + 0.3 * Math.sin(p.wobble * 2.8);

      // Trail for large runes
      if (p.isLarge) {
        p.trail.push({x: p.x, y: p.y, op: p.opacity});
        if (p.trail.length > 8) p.trail.shift();
        p.trail.forEach((t, ti) => {
          const ta = (ti / p.trail.length) * t.op * 0.25;
          ctx.save();
          ctx.globalAlpha = ta;
          ctx.font = `${p.size * 0.7}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = `hsl(${p.hue},${p.sat}%,${p.lum}%)`;
          ctx.fillText(p.char, t.x, t.y);
          ctx.restore();
        });
      }

      // Main rune glyph
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Layered glow
      ctx.shadowColor = `hsl(${p.hue},100%,85%)`;
      ctx.shadowBlur = p.glow * 2;
      ctx.fillStyle = `hsl(${p.hue-10},${p.sat}%,${p.lum + 15}%)`;
      ctx.fillText(p.char, 0, 0);

      ctx.shadowBlur = p.glow;
      ctx.fillStyle = `hsl(${p.hue},${p.sat}%,${p.lum}%)`;
      ctx.fillText(p.char, 0, 0);

      ctx.shadowBlur = 0;
      ctx.restore();

      if (p.life >= p.maxLife || p.y < -40) particles.splice(i, 1);
    });
  }

  // ── Storm: Rain + Lightning ──
  let stormLightning = null;
  let stormFlashOpacity = 0;
  function createRaindrop() {
    return {
      x: Math.random() * (canvas.width + 100),
      y: -10,
      length: 15 + Math.random() * 25,
      speedY: 12 + Math.random() * 8,
      speedX: -3 - Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.5,
    };
  }
  function triggerLightning() {
    const x = 100 + Math.random() * (canvas.width - 200);
    const segs = [];
    let cx = x, cy = 0;
    while (cy < canvas.height * 0.8) {
      const nx = cx + (Math.random() - 0.5) * 80;
      const ny = cy + 40 + Math.random() * 60;
      segs.push({x1:cx,y1:cy,x2:nx,y2:ny});
      cx = nx; cy = ny;
    }
    stormLightning = {segs, life:0, maxLife: 12, branches: []};
    // branch
    if (segs.length > 2) {
      const bi = Math.floor(segs.length / 2);
      let bx = segs[bi].x2, by = segs[bi].y2;
      const bsegs = [];
      for (let k = 0; k < 3; k++) {
        const nx2 = bx + (Math.random()-0.5)*60;
        const ny2 = by + 30 + Math.random()*40;
        bsegs.push({x1:bx,y1:by,x2:nx2,y2:ny2});
        bx=nx2;by=ny2;
      }
      stormLightning.branches = bsegs;
    }
    stormFlashOpacity = 0.18;
  }
  let stormTick = 0;
  function drawStorm() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stormTick++;
    // Rain
    if (particles.length < 200) for(let i=0;i<6;i++) particles.push(createRaindrop());
    // Flash overlay
    if (stormFlashOpacity > 0) {
      ctx.fillStyle = `rgba(150,200,255,${stormFlashOpacity})`;
      ctx.fillRect(0,0,canvas.width,canvas.height);
      stormFlashOpacity = Math.max(0, stormFlashOpacity - 0.015);
    }
    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.speedX * 0.6, p.y + p.length);
      ctx.strokeStyle = `rgba(160,210,255,${p.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      if (p.y > canvas.height + 20 || p.x < -20) particles.splice(i,1);
    });
    // Lightning
    if (stormTick % (80 + Math.floor(Math.random()*120)) === 0 && !stormLightning) triggerLightning();
    if (stormLightning) {
      stormLightning.life++;
      const alpha = stormLightning.life < 4 ? stormLightning.life/4 : Math.max(0,1-(stormLightning.life-4)/(stormLightning.maxLife-4));
      const drawSegs = (segs, w, col) => {
        segs.forEach(s => {
          ctx.beginPath();
          ctx.moveTo(s.x1,s.y1);
          ctx.lineTo(s.x2,s.y2);
          ctx.strokeStyle = col;
          ctx.lineWidth = w;
          ctx.shadowColor = '#80c8ff';
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      };
      ctx.globalAlpha = alpha;
      drawSegs(stormLightning.segs, 2.5, '#e0f0ff');
      drawSegs(stormLightning.segs, 1, '#ffffff');
      drawSegs(stormLightning.branches, 1.5, '#c0d8ff');
      ctx.globalAlpha = 1;
      if (stormLightning.life >= stormLightning.maxLife) stormLightning = null;
    }
  }

  // ── Abyssal Blood: Rising Blooddrops + Veins ──
  function createBlooddrop() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 5,
      size: 3 + Math.random() * 7,
      speedY: 0.4 + Math.random() * 0.9,
      speedX: (Math.random()-0.5) * 0.4,
      opacity: 0,
      life: 0,
      maxLife: 200 + Math.random() * 200,
      wobble: Math.random() * Math.PI * 2,
      drip: Math.random() > 0.6,
    };
  }
  let abyssTick = 0;
  const veinPaths = [];
  function generateVein() {
    let x = Math.random() * canvas.width;
    const pts = [{x, y: canvas.height}];
    let cx2 = x;
    while (pts[pts.length-1].y > 0) {
      cx2 += (Math.random()-0.5)*60;
      pts.push({x: cx2, y: pts[pts.length-1].y - 40 - Math.random()*40});
    }
    return {pts, opacity:0, life:0, maxLife: 300+Math.random()*200, width:0.5+Math.random()*1.5};
  }
  function drawAbyss() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    abyssTick++;
    var W=canvas.width, H=canvas.height;
    var slowP=0.5+0.5*Math.sin(abyssTick*0.012);
    var midP =0.5+0.5*Math.sin(abyssTick*0.022);
    var fastP=0.5+0.5*Math.sin(abyssTick*0.045);

    // ── Deep abyss atmosphere — full screen dark red pulse ──
    var atmo=ctx.createRadialGradient(W*0.5,H*0.5,0,W*0.5,H*0.5,Math.max(W,H)*0.85);
    atmo.addColorStop(0,'rgba(100,0,0,'+(0.12+0.07*slowP)+')');
    atmo.addColorStop(0.5,'rgba(40,0,0,'+(0.06+0.04*midP)+')');
    atmo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=atmo; ctx.fillRect(0,0,W,H);

    // ── Dark vignette — crushing darkness from edges ──
    var vig=ctx.createRadialGradient(W*0.5,H*0.5,Math.min(W,H)*0.25,W*0.5,H*0.5,Math.max(W,H)*0.75);
    vig.addColorStop(0,'rgba(0,0,0,0)');
    vig.addColorStop(0.6,'rgba(0,0,0,'+(0.08+0.04*slowP)+')');
    vig.addColorStop(1,'rgba(0,0,0,'+(0.25+0.10*midP)+')');
    ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

    // ── Rolling dark mist layers from bottom ──
    for(var ml=0;ml<4;ml++){
      var mistY=H*(0.55+ml*0.12)+Math.sin(abyssTick*0.007+ml*1.8)*H*0.035;
      var mistH=H*0.20;
      var mistOp=(0.08+0.05*Math.sin(abyssTick*0.009+ml*2.1))*(1-ml*0.2);
      var xShift=Math.sin(abyssTick*0.005+ml*1.3)*W*0.06;
      var mist=ctx.createLinearGradient(0,mistY,0,mistY+mistH);
      mist.addColorStop(0,'rgba(0,0,0,0)');
      mist.addColorStop(0.3,'rgba(60,0,0,'+mistOp+')');
      mist.addColorStop(0.6,'rgba(80,0,0,'+(mistOp*1.3)+')');
      mist.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); ctx.translate(xShift,0);
      ctx.fillStyle=mist; ctx.fillRect(-W*0.1,mistY,W*1.2,mistH);
      ctx.restore();
    }

    // ── Vein paths — same as before but more frequent ──
    if (abyssTick % 90 === 0 && veinPaths.length < 8) veinPaths.push(generateVein());
    veinPaths.forEach(function(v, vi) {
      v.life++;
      if (v.life < 60) v.opacity = v.life/60 * 0.65;
      else if (v.life > v.maxLife-60) v.opacity = (v.maxLife-v.life)/60 * 0.65;
      else v.opacity = 0.4 + 0.25 * Math.sin(v.life*0.02);
      ctx.beginPath();
      ctx.moveTo(v.pts[0].x, v.pts[0].y);
      for (var k=1;k<v.pts.length;k++) ctx.lineTo(v.pts[k].x, v.pts[k].y);
      ctx.strokeStyle = 'rgba(200,0,0,'+v.opacity+')';
      ctx.lineWidth = v.width * (0.8 + 0.4*midP);
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 10 + 6*fastP;
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (v.life >= v.maxLife) veinPaths.splice(vi,1);
    });

    // ── Blooddrops — same as before ──
    if (particles.length < 35) particles.push(createBlooddrop());
    particles.forEach(function(p,i) {
      p.life++;
      p.wobble += 0.04;
      p.x += p.speedX + Math.sin(p.wobble)*0.3;
      p.y -= p.speedY;
      if (p.life < 20) p.opacity = p.life/20;
      else if (p.life > p.maxLife*0.8) p.opacity = (p.maxLife-p.life)/(p.maxLife*0.2);
      else p.opacity = 0.7 + 0.3*Math.sin(p.wobble*3);
      var g2 = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*2.5);
      g2.addColorStop(0,'rgba(255,20,20,'+p.opacity+')');
      g2.addColorStop(0.4,'rgba(180,0,0,'+(p.opacity*0.7)+')');
      g2.addColorStop(1,'rgba(80,0,0,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fillStyle = g2;
      ctx.shadowColor='#ff0000';
      ctx.shadowBlur=14+8*fastP;
      ctx.fill();
      ctx.shadowBlur=0;
      if (p.drip && p.size > 5) {
        ctx.beginPath();
        ctx.moveTo(p.x-p.size*0.3, p.y);
        ctx.quadraticCurveTo(p.x, p.y+p.size*2.5, p.x, p.y+p.size*2);
        ctx.quadraticCurveTo(p.x, p.y+p.size*2.5, p.x+p.size*0.3, p.y);
        ctx.fillStyle='rgba(180,0,0,'+(p.opacity*0.5)+')';
        ctx.fill();
      }
      if (p.life>=p.maxLife||p.y<-20) particles.splice(i,1);
    });

    // ── Heartbeat flash — sudden red pulse every ~4s ──
    var heartPhase=(abyssTick%240)/240;
    if(heartPhase<0.06){
      var hOp=0.08*(1-heartPhase/0.06);
      ctx.fillStyle='rgba(180,0,0,'+hOp+')';
      ctx.fillRect(0,0,W,H);
    } else if(heartPhase>0.08&&heartPhase<0.14){
      var hOp2=0.05*(1-(heartPhase-0.08)/0.06);
      ctx.fillStyle='rgba(140,0,0,'+hOp2+')';
      ctx.fillRect(0,0,W,H);
    }
  }

  // ── Blizzard ──
  let blizzardTick = 0;
  function createSnowflake() {
    return {
      x: Math.random() * canvas.width,
      y: -10,
      size: 1.5 + Math.random() * 4,
      speedY: 1.5 + Math.random() * 2.5,
      speedX: (Math.random() - 0.5) * 3,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      opacity: 0.4 + Math.random() * 0.6,
      life: 0,
      maxLife: 300 + Math.random() * 200,
    };
  }
  function drawBlizzard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blizzardTick++;
    // Wind streak background
    if (blizzardTick % 2 === 0) {
      ctx.fillStyle = 'rgba(180,220,255,0.012)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Snowflakes
    while (particles.length < 120) particles.push(createSnowflake());
    particles.forEach((p, i) => {
      p.life++;
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 1.5;
      p.y += p.speedY;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,230,255,${p.opacity})`;
      ctx.shadowColor = '#80d0ff';
      ctx.shadowBlur = p.size * 3;
      ctx.fill();
      ctx.shadowBlur = 0;
      if (p.y > canvas.height + 20 || p.life > p.maxLife) particles.splice(i, 1);
    });
    // Occasional wind gust flash
    if (blizzardTick % 90 === 0) {
      const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
      g.addColorStop(0, 'rgba(100,180,255,0)');
      g.addColorStop(0.5, 'rgba(100,180,255,0.04)');
      g.addColorStop(1, 'rgba(100,180,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ── Crimson Rain ──
  let crimsonTick = 0;
  function createRaindrop() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      length: 15 + Math.random() * 30,
      speedY: 8 + Math.random() * 6,
      speedX: -2 + Math.random() * -1,
      opacity: 0.3 + Math.random() * 0.5,
      life: 0,
      maxLife: 150,
    };
  }
  function drawCrimsonRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    crimsonTick++;
    // Dark red atmospheric glow
    const bg = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, 0, canvas.height);
    bg.addColorStop(0, `rgba(120,0,0,${0.03 + 0.01 * Math.sin(crimsonTick * 0.03)})`);
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Rain streaks
    while (particles.length < 80) particles.push(createRaindrop());
    particles.forEach((p, i) => {
      p.life++;
      p.x += p.speedX;
      p.y += p.speedY;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.speedX * (p.length / p.speedY), p.y - p.length);
      ctx.strokeStyle = `rgba(220,20,40,${p.opacity})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = '#ff0030';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (p.y > canvas.height + 40 || p.life > p.maxLife) particles.splice(i, 1);
    });
    // Lightning-like blood flash
    if (crimsonTick % 150 === 0) {
      ctx.fillStyle = 'rgba(180,0,20,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ── Aurora ──
  let auroraTick = 0;
  const auroraWaves = [];
  function createAuroraWave() {
    return {
      y: canvas.height * (0.1 + Math.random() * 0.5),
      width: canvas.width * (0.4 + Math.random() * 0.6),
      x: Math.random() * canvas.width,
      hue: Math.random() < 0.5 ? 150 : 270,
      speed: 0.003 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
      amplitude: 40 + Math.random() * 80,
      life: 0,
      maxLife: 600 + Math.random() * 400,
    };
  }
  function drawAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    auroraTick++;
    if (auroraWaves.length < 5) auroraWaves.push(createAuroraWave());
    auroraWaves.forEach((w, wi) => {
      w.life++;
      w.phase += w.speed;
      const fade = w.life < 80 ? w.life / 80 : w.life > w.maxLife - 80 ? (w.maxLife - w.life) / 80 : 1;
      const opacity = 0.08 * fade;
      for (let x = 0; x < canvas.width; x += 2) {
        const yOff = Math.sin(x * 0.006 + w.phase) * w.amplitude + Math.sin(x * 0.012 + w.phase * 1.3) * (w.amplitude * 0.4);
        const cy = w.y + yOff;
        const g = ctx.createLinearGradient(x, cy - 80, x, cy + 80);
        if (w.hue === 150) {
          g.addColorStop(0, `rgba(0,0,0,0)`);
          g.addColorStop(0.3, `rgba(30,255,140,${opacity})`);
          g.addColorStop(0.7, `rgba(100,80,255,${opacity * 0.6})`);
          g.addColorStop(1, `rgba(0,0,0,0)`);
        } else {
          g.addColorStop(0, `rgba(0,0,0,0)`);
          g.addColorStop(0.3, `rgba(150,60,255,${opacity})`);
          g.addColorStop(0.7, `rgba(0,200,120,${opacity * 0.5})`);
          g.addColorStop(1, `rgba(0,0,0,0)`);
        }
        ctx.fillStyle = g;
        ctx.fillRect(x, cy - 80, 2, 160);
      }
      // Stars
      if (w.life === 1) {
        for (let s = 0; s < 8; s++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.6, size: 0.5 + Math.random() * 1.5, twinkle: Math.random() * Math.PI * 2, isStar: true });
      }
      if (w.life >= w.maxLife) auroraWaves.splice(wi, 1);
    });
    // Draw stars
    particles.forEach(p => {
      if (!p.isStar) return;
      p.twinkle += 0.03;
      const o = 0.3 + 0.4 * Math.sin(p.twinkle);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,255,220,${o})`;
      ctx.fill();
    });
  }

  // ── Void Animated ──
  let voidTick = 0;
  function createVoidOrb() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { x = Math.random() * canvas.width; y = -20; }
    else if (edge === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
    else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + 20; }
    else { x = -20; y = Math.random() * canvas.height; }
    return {
      x, y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 2 + Math.random() * 6,
      color: Math.random() < 0.5 ? [80, 40, 255] : [180, 80, 255],
      life: 0,
      maxLife: 300 + Math.random() * 250,
      opacity: 0,
      twinkle: Math.random() * Math.PI * 2,
    };
  }
  function createVoidRune() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 8 + Math.random() * 18,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.008,
      color: Math.random() < 0.5 ? [100, 50, 255] : [200, 100, 255],
      life: 0,
      maxLife: 400 + Math.random() * 300,
      opacity: 0,
      twinkle: Math.random() * Math.PI * 2,
    };
  }
  const voidRunes = [];
  function drawVoidRune(r) {
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.rotate(r.angle);
    const [cr, cg, cb] = r.color;
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${r.opacity})`;
    ctx.lineWidth = 1;
    ctx.shadowColor = `rgba(${cr},${cg},${cb},0.9)`;
    ctx.shadowBlur = 10;
    // Simple rune shape — cross + diamond
    ctx.beginPath();
    ctx.moveTo(-r.size, 0); ctx.lineTo(r.size, 0);
    ctx.moveTo(0, -r.size); ctx.lineTo(0, r.size);
    ctx.moveTo(-r.size*0.6, -r.size*0.6); ctx.lineTo(r.size*0.6, -r.size*0.6);
    ctx.moveTo(-r.size*0.6, r.size*0.6); ctx.lineTo(r.size*0.6, r.size*0.6);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  function drawVoidAnim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    voidTick++;

    // Edge vignette — more visible
    const vignette = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.25, canvas.width/2, canvas.height/2, canvas.width*0.85);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, `rgba(15,0,50,${0.18 + 0.05 * Math.sin(voidTick * 0.015)})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Corner void blooms
    const corners = [[0,0],[canvas.width,0],[0,canvas.height],[canvas.width,canvas.height]];
    corners.forEach(([cx, cy], ci) => {
      const pulse = 0.10 + 0.05 * Math.sin(voidTick * 0.012 + ci * 1.2);
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280);
      cg.addColorStop(0, `rgba(70,20,200,${pulse})`);
      cg.addColorStop(0.5, `rgba(30,5,80,${pulse * 0.4})`);
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(cx - 280, cy - 280, 560, 560);
    });

    // Floating void orbs
    while (particles.length < 45) particles.push(createVoidOrb());
    particles.forEach((p, i) => {
      p.life++;
      p.twinkle += 0.025;
      p.x += p.vx;
      p.y += p.vy;
      if (p.life < 40) p.opacity = (p.life / 40) * 0.75;
      else if (p.life > p.maxLife - 40) p.opacity = ((p.maxLife - p.life) / 40) * 0.75;
      else p.opacity = 0.4 + 0.35 * Math.sin(p.twinkle);
      const [r, g, b] = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur = p.size * 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      if (p.life >= p.maxLife || p.x < -60 || p.x > canvas.width+60 || p.y < -60 || p.y > canvas.height+60)
        particles.splice(i, 1);
    });

    // Floating runes
    while (voidRunes.length < 8) voidRunes.push(createVoidRune());
    voidRunes.forEach((r, i) => {
      r.life++;
      r.twinkle += 0.018;
      r.angle += r.spinSpeed;
      if (r.life < 60) r.opacity = (r.life / 60) * 0.45;
      else if (r.life > r.maxLife - 60) r.opacity = ((r.maxLife - r.life) / 60) * 0.45;
      else r.opacity = 0.2 + 0.25 * Math.sin(r.twinkle);
      drawVoidRune(r);
      if (r.life >= r.maxLife) voidRunes.splice(i, 1);
    });

    // Slow rotating arcs — 3 of them, more visible
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(voidTick * 0.005);
    for (let i = 0; i < 3; i++) {
      const radius = canvas.height * 0.32 + i * 55;
      const pulse = 0.10 + 0.06 * Math.sin(voidTick * 0.018 + i * 1.3);
      ctx.beginPath();
      ctx.arc(0, 0, radius, i * 0.8, i * 0.8 + Math.PI * (0.8 + 0.3 * Math.sin(voidTick * 0.01 + i)));
      ctx.strokeStyle = `rgba(120,60,255,${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#8050ff';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    // Counter-rotating inner arc
    ctx.rotate(-voidTick * 0.012);
    const innerPulse = 0.08 + 0.05 * Math.sin(voidTick * 0.025);
    ctx.beginPath();
    ctx.arc(0, 0, canvas.height * 0.18, 0, Math.PI * 1.1);
    ctx.strokeStyle = `rgba(200,100,255,${innerPulse})`;
    ctx.lineWidth = 1;
    ctx.shadowColor = '#c060ff';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // ── Halloween ──
  let halloweenTick = 0;
  function drawHalloween() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    halloweenTick++;
    // Eerie orange fog at bottom
    const fog = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
    fog.addColorStop(0, 'rgba(0,0,0,0)');
    fog.addColorStop(1, `rgba(60,20,0,${0.12 + 0.04 * Math.sin(halloweenTick * 0.02)})`);
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Floating bats
    while (particles.length < 18) {
      particles.push({
        x: Math.random() * canvas.width, y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 1.2, vy: -(0.6 + Math.random() * 1.0),
        size: 6 + Math.random() * 10, flap: Math.random() * Math.PI * 2,
        flapSpeed: 0.12 + Math.random() * 0.1,
        life: 0, maxLife: 350 + Math.random() * 200, opacity: 0,
      });
    }
    particles.forEach((p, i) => {
      p.life++; p.flap += p.flapSpeed;
      p.x += p.vx + Math.sin(p.flap * 0.3) * 0.4;
      p.y += p.vy;
      if (p.life < 30) p.opacity = p.life / 30;
      else if (p.life > p.maxLife - 30) p.opacity = (p.maxLife - p.life) / 30;
      else p.opacity = 0.7;
      // Draw bat silhouette
      ctx.save(); ctx.translate(p.x, p.y);
      ctx.fillStyle = `rgba(20,5,0,${p.opacity})`;
      ctx.shadowColor = 'rgba(180,60,0,0.5)'; ctx.shadowBlur = 8;
      const w = p.size * (1 + 0.4 * Math.abs(Math.sin(p.flap)));
      ctx.beginPath();
      ctx.ellipse(-w, 0, w, p.size * 0.4, -0.4, 0, Math.PI * 2);
      ctx.ellipse(w, 0, w, p.size * 0.4, 0.4, 0, Math.PI * 2);
      ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
      ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
      if (p.y < -30 || p.life > p.maxLife) particles.splice(i, 1);
    });
    // Pulsing moon glow top-right
    const moonPulse = 0.08 + 0.03 * Math.sin(halloweenTick * 0.025);
    const moon = ctx.createRadialGradient(canvas.width * 0.82, canvas.height * 0.12, 0, canvas.width * 0.82, canvas.height * 0.12, 180);
    moon.addColorStop(0, `rgba(255,140,0,${moonPulse})`);
    moon.addColorStop(0.5, `rgba(180,80,0,${moonPulse * 0.4})`);
    moon.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = moon; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ── Christmas ──
  let christmasTick = 0;
  function drawChristmas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    christmasTick++;
    // Snow falling
    while (particles.filter(p => !p.isStar).length < 140) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() < 0.3 ? Math.random() * canvas.height : -10,
        vx: (Math.random() - 0.5) * 0.6, vy: 0.5 + Math.random() * 1.2,
        size: 1.5 + Math.random() * 4, wobble: Math.random() * Math.PI * 2,
        life: 0, opacity: 0.5 + Math.random() * 0.5,
      });
    }
    particles.forEach((p, i) => {
      if (p.isStar) return;
      p.life++; p.wobble += 0.018;
      p.x += p.vx + Math.sin(p.wobble) * 0.5; p.y += p.vy;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.shadowColor = '#c0f0ff'; ctx.shadowBlur = p.size * 3;
      ctx.fill(); ctx.shadowBlur = 0;
      if (p.y > canvas.height + 20) {
        p.x = Math.random() * canvas.width; p.y = -10;
        p.vx = (Math.random() - 0.5) * 0.6; p.vy = 0.5 + Math.random() * 1.2;
        p.wobble = Math.random() * Math.PI * 2;
      }
    });
    // Warm red glow at bottom
    const warmth = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
    warmth.addColorStop(0, 'rgba(0,0,0,0)');
    warmth.addColorStop(1, `rgba(80,10,10,${0.10 + 0.03 * Math.sin(christmasTick * 0.02)})`);
    ctx.fillStyle = warmth; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Twinkle stars
    if (christmasTick % 40 === 0 && particles.length < 100) {
      for (let s = 0; s < 3; s++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5, size: 1 + Math.random() * 2, twinkle: Math.random() * Math.PI * 2, isStar: true, color: Math.random() < 0.5 ? [255,80,80] : [80,255,120], life: 0, maxLife: 200 });
      }
    }
    particles.filter(p => p.isStar).forEach(p => {
      p.twinkle += 0.06; p.life++;
      const o = 0.3 + 0.5 * Math.abs(Math.sin(p.twinkle));
      const [r, g, b] = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${o})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.8)`; ctx.shadowBlur = 8;
      ctx.fill(); ctx.shadowBlur = 0;
    });
  }

  // ── New Year ──
  let newYearTick = 0;
  function drawNewYear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newYearTick++;
    // Fireworks
    if (newYearTick % 55 === 0) {
      const fx = canvas.width * (0.2 + Math.random() * 0.6);
      const fy = canvas.height * (0.1 + Math.random() * 0.4);
      const hue = Math.floor(Math.random() * 360);
      for (let s = 0; s < 28; s++) {
        const angle = (s / 28) * Math.PI * 2;
        const speed = 1.5 + Math.random() * 2.5;
        particles.push({
          x: fx, y: fy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 2, hue, life: 0, maxLife: 80 + Math.random() * 40,
          opacity: 1, gravity: 0.04, isFirework: true,
        });
      }
    }
    particles.forEach((p, i) => {
      if (!p.isFirework) return;
      p.life++; p.vy += p.gravity;
      p.x += p.vx; p.y += p.vy;
      p.opacity = 1 - p.life / p.maxLife;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.opacity})`;
      ctx.shadowColor = `hsla(${p.hue},100%,60%,0.8)`; ctx.shadowBlur = 6;
      ctx.fill(); ctx.shadowBlur = 0;
      if (p.life >= p.maxLife) particles.splice(i, 1);
    });
    // Gold glitter rain
    if (newYearTick % 3 === 0) {
      particles.push({
        x: Math.random() * canvas.width, y: -5,
        vx: (Math.random() - 0.5) * 1.5, vy: 1 + Math.random() * 2,
        size: 1 + Math.random() * 2, life: 0, maxLife: 200,
        opacity: 0.6 + Math.random() * 0.4, isGlitter: true,
        color: Math.random() < 0.5 ? [255,210,0] : [255,255,180],
      });
    }
    particles.forEach((p, i) => {
      if (!p.isGlitter) return;
      p.life++; p.x += p.vx; p.y += p.vy;
      p.opacity = (1 - p.life / p.maxLife) * 0.8;
      const [r, g, b] = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.6)`; ctx.shadowBlur = 4;
      ctx.fill(); ctx.shadowBlur = 0;
      if (p.y > canvas.height + 10) particles.splice(i, 1);
    });
  }

  // ── Valentine ──
  let valentineTick = 0;
  function drawValentine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    valentineTick++;
    // Floating hearts
    while (particles.filter(p => !p.isStar).length < 22) {
      particles.push({
        x: Math.random() * canvas.width, y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 0.5, vy: -(0.5 + Math.random() * 0.8),
        size: 8 + Math.random() * 16, wobble: Math.random() * Math.PI * 2,
        life: 0, maxLife: 400 + Math.random() * 200, opacity: 0,
        color: Math.random() < 0.6 ? [255,60,100] : [255,150,180],
      });
    }
    particles.forEach((p, i) => {
      if (p.isStar) return;
      p.life++; p.wobble += 0.015;
      p.x += p.vx + Math.sin(p.wobble) * 0.4; p.y += p.vy;
      if (p.life < 40) p.opacity = p.life / 40 * 0.7;
      else if (p.life > p.maxLife - 40) p.opacity = (p.maxLife - p.life) / 40 * 0.7;
      else p.opacity = 0.4 + 0.3 * Math.sin(p.wobble * 2);
      const [r, g, b] = p.color;
      const s = p.size;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.wobble * 0.5) * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.4);
      ctx.bezierCurveTo(s * 0.8, -s * 0.2, s * 1.0, -s * 0.8, 0, -s * 0.4);
      ctx.bezierCurveTo(-s * 1.0, -s * 0.8, -s * 0.8, -s * 0.2, 0, s * 0.4);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.7)`; ctx.shadowBlur = s * 1.5;
      ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
      if (p.y < -40 || p.life > p.maxLife) particles.splice(i, 1);
    });
    // Soft pink vignette
    const vg = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.3, canvas.width/2, canvas.height/2, canvas.width*0.8);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, `rgba(80,0,30,${0.08 + 0.03 * Math.sin(valentineTick * 0.02)})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ── Easter ──
  let easterTick = 0;
  function drawEaster() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    easterTick++;
    // Pastel floating bubbles / eggs
    while (particles.length < 30) {
      const hue = Math.floor(Math.random() * 360);
      particles.push({
        x: Math.random() * canvas.width, y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 0.5, vy: -(0.4 + Math.random() * 0.7),
        size: 5 + Math.random() * 12, hue,
        wobble: Math.random() * Math.PI * 2,
        life: 0, maxLife: 450 + Math.random() * 250, opacity: 0,
      });
    }
    particles.forEach((p, i) => {
      p.life++; p.wobble += 0.018;
      p.x += p.vx + Math.sin(p.wobble) * 0.5; p.y += p.vy;
      if (p.life < 40) p.opacity = p.life / 40 * 0.55;
      else if (p.life > p.maxLife - 40) p.opacity = (p.maxLife - p.life) / 40 * 0.55;
      else p.opacity = 0.3 + 0.25 * Math.sin(p.wobble * 1.5);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.75, p.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},70%,75%,${p.opacity})`;
      ctx.shadowColor = `hsla(${p.hue},80%,70%,0.7)`; ctx.shadowBlur = p.size * 2;
      ctx.fill(); ctx.shadowBlur = 0;
      if (p.y < -40 || p.life > p.maxLife) particles.splice(i, 1);
    });
    // Gentle spring light
    const spring = ctx.createRadialGradient(canvas.width*0.5, 0, 0, canvas.width*0.5, 0, canvas.height*0.8);
    spring.addColorStop(0, `rgba(120,230,140,${0.04 + 0.02 * Math.sin(easterTick * 0.02)})`);
    spring.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = spring; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ── Summer ──
  let summerTick = 0;
  function drawSummer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    summerTick++;
    // Lazy drifting light motes
    while (particles.length < 35) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: -(0.1 + Math.random() * 0.2),
        size: 1.5 + Math.random() * 4, wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.015,
        life: 0, maxLife: 500 + Math.random() * 300, opacity: 0,
        color: Math.random() < 0.5 ? [255,210,50] : [255,240,120],
      });
    }
    particles.forEach((p, i) => {
      p.life++; p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.3; p.y += p.vy;
      if (p.life < 60) p.opacity = p.life / 60 * 0.6;
      else if (p.life > p.maxLife - 60) p.opacity = (p.maxLife - p.life) / 60 * 0.6;
      else p.opacity = 0.25 + 0.35 * Math.abs(Math.sin(p.wobble));
      const [r, g, b] = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.8)`; ctx.shadowBlur = p.size * 4;
      ctx.fill(); ctx.shadowBlur = 0;
      if (p.y < -20 || p.life > p.maxLife) particles.splice(i, 1);
    });
    // Sun glow top center
    const sun = ctx.createRadialGradient(canvas.width/2, -20, 0, canvas.width/2, -20, canvas.height * 0.7);
    sun.addColorStop(0, `rgba(255,200,0,${0.07 + 0.025 * Math.sin(summerTick * 0.018)})`);
    sun.addColorStop(0.5, `rgba(255,140,0,${0.03})`);
    sun.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sun; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ── Autumn ──
  let autumnTick = 0;
  function drawAutumn() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    autumnTick++;
    // Falling leaves
    while (particles.length < 35) {
      const hue = 10 + Math.floor(Math.random() * 40);
      particles.push({
        x: Math.random() * canvas.width, y: -20,
        vx: (Math.random() - 0.5) * 1.2, vy: 0.8 + Math.random() * 1.5,
        size: 5 + Math.random() * 9, hue,
        spin: Math.random() * Math.PI * 2, spinSpeed: (Math.random() - 0.5) * 0.06,
        wobble: Math.random() * Math.PI * 2,
        life: 0, maxLife: 350 + Math.random() * 200, opacity: 0,
      });
    }
    particles.forEach((p, i) => {
      p.life++; p.wobble += 0.022; p.spin += p.spinSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.8; p.y += p.vy;
      if (p.life < 30) p.opacity = p.life / 30;
      else if (p.life > p.maxLife - 30) p.opacity = (p.maxLife - p.life) / 30;
      else p.opacity = 0.65;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.spin);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},80%,50%,${p.opacity})`;
      ctx.shadowColor = `hsla(${p.hue},90%,45%,0.6)`; ctx.shadowBlur = 6;
      ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
      if (p.y > canvas.height + 30 || p.life > p.maxLife) particles.splice(i, 1);
    });
    // Warm amber vignette
    const amber = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.25, canvas.width/2, canvas.height/2, canvas.width*0.85);
    amber.addColorStop(0, 'rgba(0,0,0,0)');
    amber.addColorStop(1, `rgba(50,20,0,${0.10 + 0.03 * Math.sin(autumnTick * 0.018)})`);
    ctx.fillStyle = amber; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ── Winter Frost ──
  let winterFrostTick = 0;
  function drawWinterFrost() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    winterFrostTick++;
    // Slow drifting snowflakes — bigger and more ornate than blizzard
    while (particles.length < 55) {
      particles.push({
        x: Math.random() * canvas.width, y: -10,
        vx: (Math.random() - 0.5) * 0.4, vy: 0.3 + Math.random() * 0.7,
        size: 2 + Math.random() * 5, wobble: Math.random() * Math.PI * 2,
        arms: Math.random() < 0.3 ? 8 : 6,
        life: 0, maxLife: 600 + Math.random() * 300,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    particles.forEach((p, i) => {
      p.life++; p.wobble += 0.012;
      p.x += p.vx + Math.sin(p.wobble) * 0.3; p.y += p.vy;
      // Draw snowflake arms
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.wobble * 0.3);
      ctx.strokeStyle = `rgba(200,230,255,${p.opacity})`;
      ctx.lineWidth = 0.8;
      ctx.shadowColor = '#a0d8ff'; ctx.shadowBlur = p.size * 2;
      for (let a = 0; a < p.arms; a++) {
        ctx.save(); ctx.rotate((a / p.arms) * Math.PI * 2);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -p.size);
        ctx.moveTo(0, -p.size * 0.5); ctx.lineTo(p.size * 0.3, -p.size * 0.7);
        ctx.moveTo(0, -p.size * 0.5); ctx.lineTo(-p.size * 0.3, -p.size * 0.7);
        ctx.stroke(); ctx.restore();
      }
      ctx.shadowBlur = 0; ctx.restore();
      if (p.y > canvas.height + 20) particles.splice(i, 1);
    });
    // Cold blue vignette
    const cold = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.3, canvas.width/2, canvas.height/2, canvas.width*0.85);
    cold.addColorStop(0, 'rgba(0,0,0,0)');
    cold.addColorStop(1, `rgba(5,20,50,${0.12 + 0.04 * Math.sin(winterFrostTick * 0.015)})`);
    ctx.fillStyle = cold; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Frost corner glows
    [[0,0],[canvas.width,0],[0,canvas.height],[canvas.width,canvas.height]].forEach(([cx,cy], ci) => {
      const pulse = 0.06 + 0.03 * Math.sin(winterFrostTick * 0.013 + ci);
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
      cg.addColorStop(0, `rgba(60,130,220,${pulse})`);
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cg; ctx.fillRect(cx-220, cy-220, 440, 440);
    });
  }

  function startAnim(type) {
    stopAnim();
    particles = [];
    currentAnim = type;
    function loop() {
      if (type === 'smoke') drawSmoke();
      else if (type === 'ember') drawEmbers();
      else if (type === 'fairy') drawFairy();
      else if (type === 'sakura') drawSakura();
      else if (type === 'solo') drawSolo();
      else if (type === 'storm') drawStorm();
      else if (type === 'abyss') drawAbyss();
      else if (type === 'blizzard') drawBlizzard();
      else if (type === 'crimsonrain') drawCrimsonRain();
      else if (type === 'aurora') drawAurora();
      else if (type === 'voidanim') drawVoidAnim();
      else if (type === 'halloween') drawHalloween();
      else if (type === 'christmas') drawChristmas();
      else if (type === 'newyear') drawNewYear();
      else if (type === 'valentine') drawValentine();
      else if (type === 'easter') drawEaster();
      else if (type === 'summer') drawSummer();
      else if (type === 'autumn') drawAutumn();
      else if (type === 'winterfrost') drawWinterFrost();
      else if (type === 'spring') drawSpring();
      else if (type === 'chineseny') drawChineseNY();
      else if (type === 'beltane') drawBeltane();
      else if (type === 'mermay') drawMermay();
      else if (type === 'midsummer') drawMidsummer();
      else if (type === 'feast') drawFeast();
      else if (type === 'obsidian') drawObsidian();
      else if (type === 'crimsonking') drawCrimsonKing();
      else if (type === 'voidwalker') drawVoidWalker();
      else if (type === 'celestial') drawCelestial();
      else if (type === 'eldritch') drawEldritch();
      else if (type === 'ascendant') drawAscendant();
      else if (type === 'absolute') drawAbsolute();
      else if (type === 'primordial') drawPrimordial();
      else if (type === 'godslayer') drawGodslayer();
      else if (type === 'gionmatsuri') drawGionMatsuri();
      else if (type === 'toronagashi') drawToroNagashi();
      else if (type === 'kagamibiraki') drawKagamiBiraki();
      else if (type === 'sepia_codex')   drawSepiaCodex();
      else if (type === 'neon_dungeon')  drawNeonDungeon();
      else if (type === 'monochrome')    drawMonochrome();
      else if (type === 'infected')      drawInfected();
      else if (type === 'frozen_tomb')   drawFrozenTomb();
      else if (type === 'forge_of_ages') drawForgeOfAges();
      else if (type === 'the_dreaming')  drawTheDreaming();
      animFrame = requestAnimationFrame(loop);
    }
    loop();
  }


  // ── Spring ──
  let springTick = 0;
  function drawSpring() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    springTick++;
    // Cherry blossom petals drifting sideways + up
    while (particles.length < 45) {
      const pinks = [[255,180,200],[255,160,190],[240,200,220],[255,200,215]];
      const col = pinks[Math.floor(Math.random()*pinks.length)];
      particles.push({
        x: Math.random() * canvas.width, y: canvas.height + 10,
        vx: (Math.random()-0.5)*0.8, vy: -(0.5 + Math.random()*1.0),
        size: 3 + Math.random()*7,
        spin: Math.random()*Math.PI*2, spinSpeed: (Math.random()-0.5)*0.05,
        wobble: Math.random()*Math.PI*2,
        life: 0, maxLife: 400+Math.random()*300, opacity: 0, color: col,
      });
    }
    particles.forEach((p,i) => {
      p.life++; p.wobble += 0.02; p.spin += p.spinSpeed;
      p.x += p.vx + Math.sin(p.wobble)*0.6; p.y += p.vy;
      if (p.life < 40) p.opacity = p.life/40*0.7;
      else if (p.life > p.maxLife-40) p.opacity = (p.maxLife-p.life)/40*0.7;
      else p.opacity = 0.5 + 0.2*Math.sin(p.wobble);
      const [r,g,b] = p.color;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.spin);
      // Petal shape
      ctx.beginPath();
      ctx.moveTo(0, p.size*0.5);
      ctx.bezierCurveTo(p.size*0.7,-p.size*0.1, p.size*0.9,-p.size*0.7, 0,-p.size*0.4);
      ctx.bezierCurveTo(-p.size*0.9,-p.size*0.7, -p.size*0.7,-p.size*0.1, 0,p.size*0.5);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.6)`; ctx.shadowBlur = p.size*1.5;
      ctx.fill(); ctx.shadowBlur=0; ctx.restore();
      if (p.y < -40 || p.life > p.maxLife) particles.splice(i,1);
    });
    // Soft green light from bottom
    const glow = ctx.createRadialGradient(canvas.width*0.5, canvas.height, 0, canvas.width*0.5, canvas.height, canvas.height*0.7);
    glow.addColorStop(0, `rgba(80,200,100,${0.05+0.02*Math.sin(springTick*0.02)})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // ── Chinese New Year ──
  let chinesenyTick = 0;
  function drawChineseNY() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chinesenyTick++;
    // Gold sparks + red paper confetti rising
    while (particles.length < 50) {
      const isGold = Math.random() < 0.6;
      particles.push({
        x: Math.random()*canvas.width, y: canvas.height+10,
        vx: (Math.random()-0.5)*1.5, vy: -(1.2+Math.random()*2.0),
        size: isGold ? 2+Math.random()*3 : 4+Math.random()*8,
        wobble: Math.random()*Math.PI*2,
        spin: Math.random()*Math.PI*2, spinSpeed: (Math.random()-0.5)*0.08,
        life: 0, maxLife: 200+Math.random()*200, opacity: 0,
        isGold, color: isGold ? [255,200,30] : (Math.random()<0.7?[220,20,20]:[255,180,0]),
      });
    }
    particles.forEach((p,i) => {
      p.life++; p.wobble += 0.025; p.spin += p.spinSpeed;
      p.x += p.vx + Math.sin(p.wobble)*0.7; p.y += p.vy;
      p.vy *= 0.99; // slow down
      if (p.life < 20) p.opacity = p.life/20*0.8;
      else if (p.life > p.maxLife-30) p.opacity = (p.maxLife-p.life)/30*0.8;
      else p.opacity = 0.6+0.2*Math.abs(Math.sin(p.wobble));
      const [r,g,b] = p.color;
      ctx.save(); ctx.translate(p.x,p.y);
      if (p.isGold) {
        // Spark dot with glow
        ctx.beginPath(); ctx.arc(0,0,p.size,0,Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.shadowColor = `rgba(255,210,0,0.9)`; ctx.shadowBlur = p.size*4;
        ctx.fill(); ctx.shadowBlur=0;
      } else {
        // Rectangular confetti
        ctx.rotate(p.spin);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fillRect(-p.size*0.5,-p.size*0.3,p.size,p.size*0.6);
      }
      ctx.restore();
      if (p.y < -40 || p.life > p.maxLife) particles.splice(i,1);
    });
    // Deep red warm glow bottom
    const warmth = ctx.createRadialGradient(canvas.width*0.5,canvas.height,0,canvas.width*0.5,canvas.height,canvas.height*0.8);
    warmth.addColorStop(0,`rgba(180,20,0,${0.10+0.03*Math.sin(chinesenyTick*0.018)})`);
    warmth.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = warmth; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Gold shimmer top
    const topGold = ctx.createLinearGradient(0,0,0,canvas.height*0.3);
    topGold.addColorStop(0,`rgba(200,140,0,${0.06+0.025*Math.sin(chinesenyTick*0.022)})`);
    topGold.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = topGold; ctx.fillRect(0,0,canvas.width,canvas.height*0.3);
  }

  // ── Beltane / May Day ──
  let beltaneTick = 0;
  function drawBeltane() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beltaneTick++;
    // Fire embers rising + flower petals mixed
    while (particles.length < 50) {
      const isEmber = Math.random() < 0.55;
      particles.push({
        x: canvas.width*0.3+Math.random()*canvas.width*0.4,
        y: canvas.height+10,
        vx: (Math.random()-0.5)*1.2, vy: -(0.8+Math.random()*1.8),
        size: isEmber ? 1.5+Math.random()*3.5 : 4+Math.random()*8,
        wobble: Math.random()*Math.PI*2,
        spin: Math.random()*Math.PI*2, spinSpeed: (Math.random()-0.5)*0.06,
        life: 0, maxLife: 250+Math.random()*250, opacity: 0,
        isEmber,
        color: isEmber
          ? (Math.random()<0.5?[255,140,20]:[255,200,60])
          : (Math.random()<0.5?[255,100,150]:[200,240,80]),
      });
    }
    particles.forEach((p,i) => {
      p.life++; p.wobble += 0.022; p.spin += p.spinSpeed;
      p.x += p.vx + Math.sin(p.wobble)*(p.isEmber?0.4:0.7); p.y += p.vy;
      if (p.life < 30) p.opacity = p.life/30*0.75;
      else if (p.life > p.maxLife-30) p.opacity = (p.maxLife-p.life)/30*0.75;
      else p.opacity = 0.5+0.25*Math.abs(Math.sin(p.wobble));
      const [r,g,b] = p.color;
      ctx.save(); ctx.translate(p.x,p.y);
      if (p.isEmber) {
        ctx.beginPath(); ctx.arc(0,0,p.size,0,Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.9)`; ctx.shadowBlur = p.size*3;
        ctx.fill(); ctx.shadowBlur=0;
      } else {
        ctx.rotate(p.spin);
        ctx.beginPath();
        ctx.moveTo(0,p.size*0.45);
        ctx.bezierCurveTo(p.size*0.65,-p.size*0.15,p.size*0.85,-p.size*0.65,0,-p.size*0.38);
        ctx.bezierCurveTo(-p.size*0.85,-p.size*0.65,-p.size*0.65,-p.size*0.15,0,p.size*0.45);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`; ctx.shadowBlur = p.size;
        ctx.fill(); ctx.shadowBlur=0;
      }
      ctx.restore();
      if (p.y < -40 || p.life > p.maxLife) particles.splice(i,1);
    });
    // Fire glow at bottom center
    const fire = ctx.createRadialGradient(canvas.width*0.5,canvas.height,0,canvas.width*0.5,canvas.height,canvas.height*0.6);
    fire.addColorStop(0,`rgba(200,80,0,${0.12+0.04*Math.sin(beltaneTick*0.025)})`);
    fire.addColorStop(0.5,`rgba(100,40,0,${0.05})`);
    fire.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = fire; ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // ── Mermay / Sea ──
  let merMayTick = 0;
  function drawMermay() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    merMayTick++;
    // Rising bubbles + sparkles
    while (particles.length < 45) {
      const isBubble = Math.random() < 0.65;
      particles.push({
        x: Math.random()*canvas.width,
        y: canvas.height+10,
        vx: (Math.random()-0.5)*0.6, vy: -(0.4+Math.random()*1.0),
        size: isBubble ? 3+Math.random()*10 : 1.5+Math.random()*3,
        wobble: Math.random()*Math.PI*2,
        life: 0, maxLife: 400+Math.random()*300, opacity: 0,
        isBubble,
        color: isBubble ? [40,200,230] : [180,130,255],
      });
    }
    particles.forEach((p,i) => {
      p.life++; p.wobble += 0.018;
      p.x += p.vx + Math.sin(p.wobble)*0.5; p.y += p.vy;
      if (p.life < 50) p.opacity = p.life/50*(p.isBubble?0.25:0.7);
      else if (p.life > p.maxLife-50) p.opacity = (p.maxLife-p.life)/50*(p.isBubble?0.25:0.7);
      else p.opacity = p.isBubble ? 0.15+0.1*Math.sin(p.wobble) : 0.5+0.3*Math.abs(Math.sin(p.wobble*2));
      const [r,g,b] = p.color;
      if (p.isBubble) {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${p.opacity*1.8})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // highlight
        ctx.beginPath(); ctx.arc(p.x-p.size*0.3,p.y-p.size*0.3,p.size*0.2,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity*1.2})`;
        ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.9)`; ctx.shadowBlur = p.size*3;
        ctx.fill(); ctx.shadowBlur=0;
      }
      if (p.y < -40 || p.life > p.maxLife) particles.splice(i,1);
    });
    // Deep blue undulation
    const depth = ctx.createLinearGradient(0,canvas.height*0.4,0,canvas.height);
    depth.addColorStop(0,'rgba(0,0,0,0)');
    depth.addColorStop(1,`rgba(0,30,80,${0.12+0.04*Math.sin(merMayTick*0.015)})`);
    ctx.fillStyle = depth; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Cyan shimmer top
    const shimmer = ctx.createRadialGradient(canvas.width*0.5,0,0,canvas.width*0.5,0,canvas.height*0.5);
    shimmer.addColorStop(0,`rgba(0,180,210,${0.06+0.025*Math.sin(merMayTick*0.02)})`);
    shimmer.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = shimmer; ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // ── Midsummer / Litha ──
  let midsummerTick = 0;
  function drawMidsummer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    midsummerTick++;
    // Golden fireflies + occasional lightning flash
    while (particles.length < 40) {
      particles.push({
        x: Math.random()*canvas.width, y: Math.random()*canvas.height,
        vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.3,
        size: 1.5+Math.random()*3.5,
        wobble: Math.random()*Math.PI*2, wobbleSpeed: 0.012+Math.random()*0.02,
        life: 0, maxLife: 500+Math.random()*400, opacity: 0,
        color: Math.random()<0.7 ? [255,230,60] : [80,180,255],
      });
    }
    // Lightning flash
    if (midsummerTick % 280 === 0) {
      ctx.fillStyle = 'rgba(180,210,255,0.09)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    particles.forEach((p,i) => {
      p.life++; p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble*0.7)*0.3; p.y += p.vy + Math.cos(p.wobble*0.5)*0.2;
      // wrap edges
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      if (p.life < 80) p.opacity = p.life/80*0.7;
      else if (p.life > p.maxLife-80) p.opacity = (p.maxLife-p.life)/80*0.7;
      else p.opacity = 0.3+0.4*Math.abs(Math.sin(p.wobble*1.5));
      const [r,g,b] = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.95)`; ctx.shadowBlur = p.size*5;
      ctx.fill(); ctx.shadowBlur=0;
      if (p.life > p.maxLife) particles.splice(i,1);
    });
    // Warm gold top glow (long summer day)
    const dayGlow = ctx.createRadialGradient(canvas.width*0.5,-50,0,canvas.width*0.5,-50,canvas.height*0.9);
    dayGlow.addColorStop(0,`rgba(240,190,30,${0.07+0.025*Math.sin(midsummerTick*0.016)})`);
    dayGlow.addColorStop(0.6,`rgba(60,100,200,${0.04})`);
    dayGlow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = dayGlow; ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // ── Midsummer Feast ──
  let feastTick = 0;
  function drawFeast() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    feastTick++;
    // Campfire embers + floating sparks
    while (particles.length < 55) {
      const type = Math.random();
      particles.push({
        x: canvas.width*0.2+Math.random()*canvas.width*0.6,
        y: canvas.height+5,
        vx: (Math.random()-0.5)*1.8, vy: -(0.6+Math.random()*2.2),
        size: type<0.4 ? 1.5+Math.random()*2.5 : type<0.75 ? 2+Math.random()*4 : 4+Math.random()*7,
        wobble: Math.random()*Math.PI*2,
        life: 0, maxLife: 150+Math.random()*200, opacity: 0,
        color: type<0.4
          ? [255,220,80]
          : type<0.75
            ? [255,140,30]
            : [200,50,10],
      });
    }
    particles.forEach((p,i) => {
      p.life++; p.wobble += 0.028;
      p.x += p.vx + Math.sin(p.wobble)*0.5; p.y += p.vy;
      p.vy *= 0.985;
      if (p.life < 20) p.opacity = p.life/20*0.85;
      else if (p.life > p.maxLife-20) p.opacity = (p.maxLife-p.life)/20*0.85;
      else p.opacity = 0.55+0.3*Math.abs(Math.sin(p.wobble));
      const [r,g,b] = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.95)`; ctx.shadowBlur = p.size*3.5;
      ctx.fill(); ctx.shadowBlur=0;
      if (p.y < -30 || p.life > p.maxLife) particles.splice(i,1);
    });
    // Warm campfire glow bottom center
    const campfire = ctx.createRadialGradient(canvas.width*0.5,canvas.height,0,canvas.width*0.5,canvas.height,canvas.height*0.75);
    campfire.addColorStop(0,`rgba(220,100,10,${0.14+0.05*Math.sin(feastTick*0.028)})`);
    campfire.addColorStop(0.4,`rgba(120,40,0,${0.06})`);
    campfire.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = campfire; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Night sky darkness at top
    const sky = ctx.createLinearGradient(0,0,0,canvas.height*0.35);
    sky.addColorStop(0,`rgba(0,0,10,${0.08+0.02*Math.sin(feastTick*0.012)})`);
    sky.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = sky; ctx.fillRect(0,0,canvas.width,canvas.height*0.35);
  }


  // ── Obsidian ──
  let obsidianTick = 0;
  function drawObsidian() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    obsidianTick++;
    // Very subtle dark dust motes
    while (particles.length < 25) {
      particles.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height,
        vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.2,
        size:1+Math.random()*2.5, wobble:Math.random()*Math.PI*2, wobbleSpeed:0.01+Math.random()*0.015,
        life:0, maxLife:400+Math.random()*400, opacity:0 });
    }
    particles.forEach(function(p,i) {
      p.life++; p.wobble+=p.wobbleSpeed; p.x+=p.vx+Math.sin(p.wobble)*0.2; p.y+=p.vy;
      if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0; if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
      if(p.life<60)p.opacity=p.life/60*0.25; else if(p.life>p.maxLife-60)p.opacity=(p.maxLife-p.life)/60*0.25; else p.opacity=0.1+0.15*Math.abs(Math.sin(p.wobble));
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle='rgba(120,120,120,'+p.opacity+')'; ctx.fill();
      if(p.life>p.maxLife) particles.splice(i,1);
    });
  }

  // ── Crimson King ──
  let crimsonKingTick = 0;
  var crimsonLightnings = [];
  function drawCrimsonKing() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    crimsonKingTick++;
    var W=canvas.width, H=canvas.height;
    var slowP=0.5+0.5*Math.sin(crimsonKingTick*0.012);
    var midP =0.5+0.5*Math.sin(crimsonKingTick*0.025);

    // ── Deep blood-red atmosphere — full coverage ──
    var atmo=ctx.createRadialGradient(W*0.5,H*0.3,0,W*0.5,H*0.3,Math.max(W,H)*0.9);
    atmo.addColorStop(0,'rgba(120,0,0,'+(0.18+0.08*slowP)+')');
    atmo.addColorStop(0.4,'rgba(60,0,0,'+(0.10+0.05*midP)+')');
    atmo.addColorStop(0.8,'rgba(20,0,0,0.05)');
    atmo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=atmo; ctx.fillRect(0,0,W,H);

    // ── Horizon blood glow from bottom ──
    var horiz=ctx.createLinearGradient(0,H*0.6,0,H);
    horiz.addColorStop(0,'rgba(0,0,0,0)');
    horiz.addColorStop(0.4,'rgba(160,0,0,'+(0.08+0.05*slowP)+')');
    horiz.addColorStop(0.8,'rgba(80,0,0,'+(0.12+0.06*midP)+')');
    horiz.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=horiz; ctx.fillRect(0,H*0.6,W,H*0.4);

    // ── Blood rain — fast angled drops ──
    while(particles.length<70){
      particles.push({
        x:Math.random()*W*1.3-W*0.15, y:-10-Math.random()*H,
        vx:-0.4-Math.random()*0.6, vy:6+Math.random()*8,
        len:18+Math.random()*30, width:0.5+Math.random()*1.2,
        life:0, maxLife:120+Math.random()*80, opacity:0
      });
    }
    ctx.save();
    particles.forEach(function(p,i){
      p.life++; p.x+=p.vx; p.y+=p.vy;
      if(p.life<15)p.opacity=p.life/15*0.7; else if(p.life>p.maxLife-15)p.opacity=(p.maxLife-p.life)/15*0.7; else p.opacity=0.4+0.25*Math.sin(p.life*0.1);
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(p.x+p.vx*2.5,p.y+p.len);
      ctx.strokeStyle='rgba(200,0,0,'+p.opacity+')';
      ctx.lineWidth=p.width;
      ctx.shadowColor='rgba(255,0,0,0.6)'; ctx.shadowBlur=3;
      ctx.stroke();
      if(p.y>H+40||p.life>p.maxLife) particles.splice(i,1);
    });
    ctx.shadowBlur=0; ctx.restore();

    // ── Crown glow — gold/red halo from top center ──
    var crownY=H*0.08;
    var crownR=Math.min(W,H)*(0.22+0.04*midP);
    var crown=ctx.createRadialGradient(W*0.5,crownY,0,W*0.5,crownY,crownR);
    crown.addColorStop(0,'rgba(220,80,0,'+(0.16+0.10*slowP)+')');
    crown.addColorStop(0.35,'rgba(180,20,0,'+(0.08+0.05*midP)+')');
    crown.addColorStop(0.7,'rgba(100,0,0,0.03)');
    crown.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=crown; ctx.fillRect(0,0,W,crownR*2);

    // ── Occasional blood splat flashes ──
    if(Math.random()<0.015){
      var sx=Math.random()*W, sy=Math.random()*H*0.6;
      var sg=ctx.createRadialGradient(sx,sy,0,sx,sy,40+Math.random()*60);
      sg.addColorStop(0,'rgba(255,0,0,0.18)');
      sg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=sg; ctx.fillRect(sx-80,sy-80,160,160);
    }
  }

  // ── Void Walker ──
  // ── Void Walker — spiral singularity pulling inward ──
  let voidWalkerTick = 0;
  function drawVoidWalker() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    voidWalkerTick++;
    var W=canvas.width, H=canvas.height, cx=W*0.5, cy=H*0.5;
    // Deep void background pulse
    var pulse=0.5+0.5*Math.sin(voidWalkerTick*0.018);
    var bg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.6);
    bg.addColorStop(0,'rgba(0,0,0,'+(0.35+0.12*pulse)+')');
    bg.addColorStop(0.4,'rgba(20,0,60,'+(0.08+0.04*pulse)+')');
    bg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // Spiral arms — draw as arcs rotating inward
    var spiralCount=3;
    ctx.save();
    ctx.translate(cx,cy);
    for(var s=0;s<spiralCount;s++){
      var baseAngle=voidWalkerTick*0.008+s*(Math.PI*2/spiralCount);
      ctx.beginPath();
      for(var i=0;i<120;i++){
        var t=i/120;
        var r=(1-t)*Math.min(W,H)*0.48;
        var a=baseAngle+t*Math.PI*5;
        var px2=Math.cos(a)*r, py2=Math.sin(a)*r*0.85;
        if(i===0) ctx.moveTo(px2,py2); else ctx.lineTo(px2,py2);
      }
      var op=0.18+0.10*Math.sin(voidWalkerTick*0.015+s);
      ctx.strokeStyle='rgba(120,20,255,'+op+')';
      ctx.lineWidth=1.5; ctx.stroke();
    }
    ctx.restore();
    // Central event horizon
    var eh=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.12+6*pulse);
    eh.addColorStop(0,'rgba(0,0,0,0.9)');
    eh.addColorStop(0.6,'rgba(60,0,140,'+(0.5+0.2*pulse)+')');
    eh.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=eh; ctx.fillRect(0,0,W,H);
    // Slow-falling star dust pulled toward center
    while(particles.length<30){
      var ang=Math.random()*Math.PI*2;
      var dist=Math.min(W,H)*(0.3+Math.random()*0.25);
      particles.push({angle:ang,dist:dist,speed:0.004+Math.random()*0.006,
        pullSpeed:0.15+Math.random()*0.2, size:1+Math.random()*2,
        life:0,maxLife:400+Math.random()*300,opacity:0});
    }
    particles.forEach(function(p,i){
      p.life++; p.angle+=p.speed; p.dist-=p.pullSpeed;
      if(p.dist<8){p.dist=Math.min(W,H)*(0.35+Math.random()*0.2); p.life=0;}
      var px3=cx+Math.cos(p.angle)*p.dist, py3=cy+Math.sin(p.angle)*p.dist*0.85;
      if(p.life<40)p.opacity=p.life/40*0.7; else if(p.life>p.maxLife-40)p.opacity=(p.maxLife-p.life)/40*0.7; else p.opacity=0.4+0.3*Math.sin(p.life*0.05);
      var grad=ctx.createRadialGradient(px3,py3,0,px3,py3,p.size*3);
      grad.addColorStop(0,'rgba(160,80,255,'+p.opacity+')');
      grad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=grad; ctx.fillRect(px3-p.size*3,py3-p.size*3,p.size*6,p.size*6);
      if(p.life>p.maxLife) particles.splice(i,1);
    });
  }

  // ── Celestial — divine light rays breaking through from above ──
  let celestialTick = 0;
  function drawCelestial() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    celestialTick++;
    var W=canvas.width, H=canvas.height;
    var pulse=0.5+0.5*Math.sin(celestialTick*0.016);
    var slowPulse=0.5+0.5*Math.sin(celestialTick*0.008);
    // Ambient heavenly glow top-center
    var sky=ctx.createRadialGradient(W*0.5,-H*0.1,0,W*0.5,-H*0.1,H*1.1);
    sky.addColorStop(0,'rgba(255,248,200,'+(0.12+0.06*slowPulse)+')');
    sky.addColorStop(0.3,'rgba(200,220,255,'+(0.06+0.03*pulse)+')');
    sky.addColorStop(0.7,'rgba(160,180,255,0.02)');
    sky.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
    // Light rays — crepuscular rays from top
    var rayCount=7;
    ctx.save();
    ctx.globalCompositeOperation='screen';
    for(var r=0;r<rayCount;r++){
      var rayAngle=-Math.PI*0.5+(-0.45+r*(0.9/(rayCount-1)));
      var rayPulse=0.5+0.5*Math.sin(celestialTick*0.012+r*1.1);
      var op2=(0.04+0.04*rayPulse)*(1-Math.abs(r-(rayCount-1)*0.5)/(rayCount*0.5+1));
      var rayLen=H*1.3;
      var spread=0.04+0.01*Math.sin(celestialTick*0.02+r);
      var x0=W*0.5+Math.cos(-Math.PI*0.5)*(-H*0.1);
      var y0=-H*0.1;
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x0+Math.cos(rayAngle-spread)*rayLen, y0+Math.sin(rayAngle-spread)*rayLen);
      ctx.lineTo(x0+Math.cos(rayAngle+spread)*rayLen, y0+Math.sin(rayAngle+spread)*rayLen);
      ctx.closePath();
      var rayGrad=ctx.createLinearGradient(x0,y0,x0+Math.cos(rayAngle)*rayLen,y0+Math.sin(rayAngle)*rayLen);
      rayGrad.addColorStop(0,'rgba(255,248,210,'+op2+')');
      rayGrad.addColorStop(0.5,'rgba(255,240,180,'+(op2*0.4)+')');
      rayGrad.addColorStop(1,'rgba(255,240,180,0)');
      ctx.fillStyle=rayGrad; ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
    ctx.restore();
    // Floating golden motes
    while(particles.length<25){
      particles.push({x:Math.random()*W,y:H+10,
        vx:(Math.random()-0.5)*0.5,vy:-(0.15+Math.random()*0.35),
        size:1+Math.random()*2.5,wobble:Math.random()*Math.PI*2,wobbleSpeed:0.01+Math.random()*0.012,
        life:0,maxLife:600+Math.random()*500,opacity:0,
        col:Math.random()<0.7?[255,240,160]:[200,215,255]});
    }
    particles.forEach(function(p,i){
      p.life++; p.wobble+=p.wobbleSpeed; p.x+=p.vx+Math.sin(p.wobble)*0.4; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.life<80)p.opacity=p.life/80*0.55; else if(p.life>p.maxLife-80)p.opacity=(p.maxLife-p.life)/80*0.55; else p.opacity=0.2+0.35*Math.abs(Math.sin(p.wobble));
      var grad2=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*4);
      grad2.addColorStop(0,'rgba('+p.col[0]+','+p.col[1]+','+p.col[2]+','+p.opacity+')');
      grad2.addColorStop(1,'rgba('+p.col[0]+','+p.col[1]+','+p.col[2]+',0)');
      ctx.fillStyle=grad2; ctx.fillRect(p.x-p.size*4,p.y-p.size*4,p.size*8,p.size*8);
      if(p.y<-20||p.life>p.maxLife) particles.splice(i,1);
    });
  }

  // ── Eldritch — Lovecraft: green mist + tentacles rising from below ──
  let eldritchTick = 0;
  // Slow-drifting fog blob state
  var eldritchBlobs = [];
  function _initEldritchBlob(W,H) {
    return {
      x: Math.random()*W, y: H*(0.2+Math.random()*0.7),
      vx: (Math.random()-0.5)*0.18, vy: (Math.random()-0.5)*0.06,
      rx: W*(0.18+Math.random()*0.22), ry: H*(0.10+Math.random()*0.12),
      phase: Math.random()*Math.PI*2, phaseSpeed: 0.003+Math.random()*0.004,
      life:0, maxLife:900+Math.random()*600, opacity:0,
      col: Math.random()<0.5 ? [0,60,20] : [20,80,40]
    };
  }
  function drawEldritch() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    eldritchTick++;
    var W=canvas.width,H=canvas.height;
    var t=eldritchTick;

    // Deep void ambient — dark purple-green from center
    var void1=ctx.createRadialGradient(W*0.5,H*0.55,0,W*0.5,H*0.55,W*0.65);
    void1.addColorStop(0,'rgba(10,30,15,'+(0.07+0.03*Math.sin(t*0.011))+')');
    void1.addColorStop(0.5,'rgba(5,15,8,0.04)');
    void1.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=void1; ctx.fillRect(0,0,W,H);

    // Corner darkness — deep creeping black-green from all four corners
    [[0,0],[W,0],[0,H],[W,H]].forEach(function(pt,ci){
      var cg=ctx.createRadialGradient(pt[0],pt[1],0,pt[0],pt[1],W*0.45);
      var op=0.08+0.04*Math.sin(t*0.009+ci*1.2);
      cg.addColorStop(0,'rgba(0,20,8,'+op+')');
      cg.addColorStop(0.5,'rgba(0,10,4,'+(op*0.4)+')');
      cg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=cg; ctx.fillRect(pt[0]-W*0.45,pt[1]-W*0.45,W*0.9,W*0.9);
    });

    // Slow horizontal fog bands rolling across
    for(var ml=0;ml<5;ml++){
      var bandY=H*(0.15+ml*0.17)+Math.sin(t*0.006+ml*1.8)*H*0.06;
      var bandH=H*(0.14+0.04*Math.sin(t*0.007+ml));
      var op2=(0.055+0.035*Math.sin(t*0.008+ml*2.3))*(1-ml*0.12);
      // Horizontal drift offset
      var xOff=Math.sin(t*0.004+ml*0.9)*W*0.08;
      var fog=ctx.createLinearGradient(0,bandY,0,bandY+bandH);
      fog.addColorStop(0,'rgba(0,0,0,0)');
      fog.addColorStop(0.3,'rgba(0,70,25,'+op2+')');
      fog.addColorStop(0.5,'rgba(5,90,30,'+(op2*1.35)+')');
      fog.addColorStop(0.7,'rgba(0,70,25,'+op2+')');
      fog.addColorStop(1,'rgba(0,0,0,0)');
      // Slight horizontal skew via transform
      ctx.save();
      ctx.translate(xOff,0);
      ctx.fillStyle=fog; ctx.fillRect(-Math.abs(xOff)-10,bandY,W+Math.abs(xOff)*2+20,bandH);
      ctx.restore();
    }

    // Drifting fog blobs — soft elliptical patches of glowing mist
    while(eldritchBlobs.length<10) eldritchBlobs.push(_initEldritchBlob(W,H));
    eldritchBlobs.forEach(function(b,bi){
      b.life++; b.phase+=b.phaseSpeed;
      b.x+=b.vx+Math.sin(b.phase*1.3)*0.12;
      b.y+=b.vy+Math.sin(b.phase)*0.07;
      if(b.x<-b.rx*2) b.x=W+b.rx; if(b.x>W+b.rx*2) b.x=-b.rx;
      if(b.y<0) b.y=H; if(b.y>H) b.y=0;
      // Fade in/out
      if(b.life<120) b.opacity=b.life/120*0.22;
      else if(b.life>b.maxLife-120) b.opacity=(b.maxLife-b.life)/120*0.22;
      else b.opacity=0.10+0.12*Math.abs(Math.sin(b.phase));
      // Elliptical radial gradient for soft blob
      ctx.save();
      ctx.translate(b.x,b.y);
      ctx.scale(1, b.ry/b.rx);
      var gr=ctx.createRadialGradient(0,0,0,0,0,b.rx);
      gr.addColorStop(0,'rgba('+b.col[0]+','+b.col[1]+','+b.col[2]+','+b.opacity+')');
      gr.addColorStop(0.5,'rgba('+b.col[0]+','+b.col[1]+','+b.col[2]+','+(b.opacity*0.4)+')');
      gr.addColorStop(1,'rgba('+b.col[0]+','+b.col[1]+','+b.col[2]+',0)');
      ctx.fillStyle=gr; ctx.fillRect(-b.rx,-b.rx,b.rx*2,b.rx*2);
      ctx.restore();
      if(b.life>b.maxLife) eldritchBlobs.splice(bi,1);
    });

    // Faint eye-like glow deep in the void — center, barely visible
    var eyeX=W*0.5+Math.sin(t*0.007)*W*0.04;
    var eyeY=H*0.5+Math.cos(t*0.005)*H*0.03;
    var eyeR=Math.min(W,H)*0.18;
    var eyeOp=0.04+0.025*Math.sin(t*0.013);
    var eye=ctx.createRadialGradient(eyeX,eyeY,0,eyeX,eyeY,eyeR);
    eye.addColorStop(0,'rgba(40,180,80,'+eyeOp+')');
    eye.addColorStop(0.3,'rgba(0,100,30,'+(eyeOp*0.5)+')');
    eye.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=eye; ctx.fillRect(eyeX-eyeR,eyeY-eyeR,eyeR*2,eyeR*2);
  }

  // ── Ascendant — dawn light, horizon glow, creeping morning mist ──
  let ascendantTick = 0;
  function drawAscendant() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ascendantTick++;
    var W=canvas.width,H=canvas.height;
    var pulse=0.5+0.5*Math.sin(ascendantTick*0.014);
    var slowP=0.5+0.5*Math.sin(ascendantTick*0.007);
    // Horizon glow — warm dawn colors at bottom third
    var horizon=ctx.createLinearGradient(0,H*0.45,0,H);
    horizon.addColorStop(0,'rgba(0,0,0,0)');
    horizon.addColorStop(0.3,'rgba(255,160,60,'+(0.05+0.03*slowP)+')');
    horizon.addColorStop(0.65,'rgba(255,100,30,'+(0.08+0.04*pulse)+')');
    horizon.addColorStop(0.85,'rgba(200,60,20,'+(0.06+0.03*slowP)+')');
    horizon.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=horizon; ctx.fillRect(0,H*0.45,W,H*0.55);
    // Sky brightening from top — cool purple-pink to warm amber
    var sky=ctx.createLinearGradient(0,0,0,H*0.6);
    sky.addColorStop(0,'rgba(80,40,120,'+(0.06+0.03*slowP)+')');
    sky.addColorStop(0.5,'rgba(200,100,80,'+(0.04+0.02*pulse)+')');
    sky.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.6);
    // Morning mist — slow horizontal bands near bottom
    for(var ml=0;ml<4;ml++){
      var mistY=H*(0.6+ml*0.1)+Math.sin(ascendantTick*0.007+ml*2.1)*H*0.025;
      var mistH=H*0.09;
      var mistOp=(0.07+0.04*Math.sin(ascendantTick*0.009+ml*1.7))*(1-ml*0.18);
      var mist=ctx.createLinearGradient(0,mistY,0,mistY+mistH);
      mist.addColorStop(0,'rgba(0,0,0,0)');
      mist.addColorStop(0.4,'rgba(255,200,150,'+mistOp+')');
      mist.addColorStop(0.6,'rgba(255,200,150,'+mistOp+')');
      mist.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=mist; ctx.fillRect(0,mistY,W,mistH);
    }
    // A few floating dawn motes
    while(particles.length<18){
      particles.push({x:Math.random()*W,y:H*(0.4+Math.random()*0.5),
        vx:(Math.random()-0.5)*0.4,vy:-(0.08+Math.random()*0.15),
        size:1+Math.random()*2,wobble:Math.random()*Math.PI*2,wobbleSpeed:0.008+Math.random()*0.01,
        life:0,maxLife:700+Math.random()*500,opacity:0});
    }
    particles.forEach(function(p,i){
      p.life++; p.wobble+=p.wobbleSpeed; p.x+=p.vx+Math.sin(p.wobble)*0.3; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H*0.9;
      if(p.life<100)p.opacity=p.life/100*0.45; else if(p.life>p.maxLife-100)p.opacity=(p.maxLife-p.life)/100*0.45; else p.opacity=0.15+0.3*Math.abs(Math.sin(p.wobble));
      var grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*4);
      grad.addColorStop(0,'rgba(255,200,120,'+p.opacity+')');
      grad.addColorStop(1,'rgba(255,200,120,0)');
      ctx.fillStyle=grad; ctx.fillRect(p.x-p.size*4,p.y-p.size*4,p.size*8,p.size*8);
      if(p.life>p.maxLife) particles.splice(i,1);
    });
  }

  // ── The Absolute — transcendent rainbow radiance, full-spectrum shifting light ──
  let absoluteTick = 0;
  function drawAbsolute() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    absoluteTick++;
    var W=canvas.width,H=canvas.height;
    var t=absoluteTick;
    var pulse=0.5+0.5*Math.sin(t*0.012);
    var slowP=0.5+0.5*Math.sin(t*0.006);

    // Slowly rotating hue base
    var hue=(t*0.25)%360;
    var h2=(hue+120)%360;
    var h3=(hue+240)%360;

    // Rainbow radial burst from center — three overlapping colour blooms
    [[hue,0.5,0.5],[h2,0.5,0.5],[h3,0.5,0.55]].forEach(function(d,i){
      var cx2=W*d[1]+Math.sin(t*0.008+i*2.1)*W*0.03;
      var cy2=H*d[2]+Math.cos(t*0.006+i*1.7)*H*0.02;
      var r=Math.min(W,H)*(0.5+0.1*Math.sin(t*0.009+i));
      var op=0.06+0.03*Math.sin(t*0.011+i*1.3);
      var g=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,r);
      g.addColorStop(0,'hsla('+d[0]+',100%,75%,'+op+')');
      g.addColorStop(0.4,'hsla('+d[0]+',100%,60%,'+(op*0.5)+')');
      g.addColorStop(1,'hsla('+d[0]+',100%,50%,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    });

    // Sweeping rainbow edge vignette — all 4 sides slowly colour-shift
    var edgeOp=0.10+0.06*slowP;
    var thick=H*0.28;
    // Top — one hue
    var gt=ctx.createLinearGradient(0,0,0,thick);
    gt.addColorStop(0,'hsla('+hue+',90%,65%,'+edgeOp+')');
    gt.addColorStop(1,'hsla('+hue+',90%,65%,0)');
    ctx.fillStyle=gt; ctx.fillRect(0,0,W,thick);
    // Bottom — offset hue
    var gb=ctx.createLinearGradient(0,H,0,H-thick);
    gb.addColorStop(0,'hsla('+h2+',90%,65%,'+edgeOp+')');
    gb.addColorStop(1,'hsla('+h2+',90%,65%,0)');
    ctx.fillStyle=gb; ctx.fillRect(0,H-thick,W,thick);
    // Left
    var gl=ctx.createLinearGradient(0,0,thick,0);
    gl.addColorStop(0,'hsla('+h3+',90%,65%,'+edgeOp+')');
    gl.addColorStop(1,'hsla('+h3+',90%,65%,0)');
    ctx.fillStyle=gl; ctx.fillRect(0,0,thick,H);
    // Right
    var gr=ctx.createLinearGradient(W,0,W-thick,0);
    gr.addColorStop(0,'hsla('+(hue+60)%360+',90%,65%,'+edgeOp+')');
    gr.addColorStop(1,'hsla('+(hue+60)%360+',90%,65%,0)');
    ctx.fillStyle=gr; ctx.fillRect(W-thick,0,thick,H);

    // Floating rainbow motes — shimmer particles with shifting hues
    while(particles.length<35){
      particles.push({x:Math.random()*W,y:Math.random()*H,
        vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.3,
        size:1+Math.random()*2.5,wobble:Math.random()*Math.PI*2,wobbleSpeed:0.008+Math.random()*0.014,
        life:0,maxLife:700+Math.random()*600,opacity:0,
        hueOffset:Math.random()*360});
    }
    particles.forEach(function(p,i){
      p.life++; p.wobble+=p.wobbleSpeed;
      p.x+=p.vx+Math.sin(p.wobble*0.7)*0.4; p.y+=p.vy+Math.cos(p.wobble)*0.25;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      if(p.life<100)p.opacity=p.life/100*0.6; else if(p.life>p.maxLife-100)p.opacity=(p.maxLife-p.life)/100*0.6; else p.opacity=0.2+0.4*Math.abs(Math.sin(p.wobble));
      var pH=(hue+p.hueOffset+t*0.15)%360;
      var gp=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*5);
      gp.addColorStop(0,'hsla('+pH+',100%,80%,'+p.opacity+')');
      gp.addColorStop(1,'hsla('+pH+',100%,70%,0)');
      ctx.fillStyle=gp; ctx.fillRect(p.x-p.size*5,p.y-p.size*5,p.size*10,p.size*10);
      if(p.life>p.maxLife) particles.splice(i,1);
    });
  }


  // ── Primordial ── magma bubbles + rising ash
  var primordialTick = 0;
  function drawPrimordial() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    primordialTick++;
    var W=canvas.width, H=canvas.height, t=primordialTick;
    var pulse=0.5+0.5*Math.sin(t*0.014);

    // 1. Deep magma edge vignette — bottom glows hottest
    var thick=H*0.35;
    var gb=ctx.createLinearGradient(0,H,0,H-thick);
    gb.addColorStop(0,'rgba(255,80,0,'+(0.13+0.07*pulse)+')');
    gb.addColorStop(0.5,'rgba(200,30,0,'+(0.07+0.03*pulse)+')');
    gb.addColorStop(1,'rgba(100,10,0,0)');
    ctx.fillStyle=gb; ctx.fillRect(0,H-thick,W,thick);

    var gl=ctx.createLinearGradient(0,0,thick*0.6,0);
    gl.addColorStop(0,'rgba(180,40,0,'+(0.08+0.04*pulse)+')');
    gl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gl; ctx.fillRect(0,0,thick*0.6,H);

    var gr2=ctx.createLinearGradient(W,0,W-thick*0.6,0);
    gr2.addColorStop(0,'rgba(180,40,0,'+(0.08+0.04*pulse)+')');
    gr2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gr2; ctx.fillRect(W-thick*0.6,0,thick*0.6,H);

    // 2. Rising magma blobs — spawn from bottom, drift up and fade
    while(particles.length < 40) {
      particles.push({
        type: Math.random()<0.7 ? 'blob' : 'ash',
        x: Math.random()*W,
        y: H + 20,
        size: Math.random()<0.7 ? (6+Math.random()*22) : (1.5+Math.random()*3),
        vx: (Math.random()-0.5)*0.6,
        vy: 0.4+Math.random()*0.9,
        life:0, maxLife: 180+Math.random()*220,
        wobble: Math.random()*Math.PI*2,
        hue: 10+Math.random()*30,
        opacity:0,
      });
    }
    particles.forEach(function(p,i){
      p.life++; p.wobble+=0.03;
      p.x+=p.vx+Math.sin(p.wobble)*0.5;
      p.y-=p.vy;
      var frac=p.life/p.maxLife;
      if(frac<0.1) p.opacity=frac/0.1;
      else if(frac>0.65) p.opacity=1-(frac-0.65)/0.35;
      else p.opacity=1;

      if(p.type==='blob'){
        var bOp=p.opacity*(0.12+0.06*Math.sin(p.wobble*2));
        var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
        g.addColorStop(0,'hsla('+(p.hue+20)+',100%,75%,'+bOp+')');
        g.addColorStop(0.4,'hsla('+p.hue+',100%,50%,'+(bOp*0.6)+')');
        g.addColorStop(1,'hsla('+p.hue+',80%,30%,0)');
        ctx.fillStyle=g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      } else {
        // ash — tiny grey/dark speck
        var aOp=p.opacity*0.25;
        ctx.fillStyle='rgba(80,40,20,'+aOp+')';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      }
      if(p.life>=p.maxLife||p.y<-p.size) particles.splice(i,1);
    });

    // 3. Crackling lava-crack lines near bottom — static random positions, pulse brightness
    var crackSeeds=[0.12,0.28,0.43,0.58,0.71,0.84];
    crackSeeds.forEach(function(s,i){
      var cx2=W*s, cy2=H*(0.85+0.1*Math.sin(t*0.008+i*1.4));
      var len=30+40*Math.sin(i*1.7+t*0.005);
      var op=0.3+0.3*Math.abs(Math.sin(t*0.02+i*0.9));
      ctx.strokeStyle='rgba(255,'+(80+60*Math.sin(t*0.03+i))+',0,'+op+')';
      ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(cx2-len,cy2);
      ctx.lineTo(cx2+len*0.3,cy2-12);
      ctx.lineTo(cx2+len,cy2+6);
      ctx.stroke();
    });
  }

  // ── Godslayer ── void cracks of light ripping through darkness
  var godslayerTick = 0;
  var godslayerCracks = [];
  function spawnCrack(W, H) {
    var side = Math.floor(Math.random()*4);
    var sx,sy,angle;
    if(side===0){sx=Math.random()*W;sy=0;angle=Math.PI/2+((Math.random()-0.5)*0.8);}
    else if(side===1){sx=W;sy=Math.random()*H;angle=Math.PI+((Math.random()-0.5)*0.8);}
    else if(side===2){sx=Math.random()*W;sy=H;angle=-Math.PI/2+((Math.random()-0.5)*0.8);}
    else{sx=0;sy=Math.random()*H;angle=(Math.random()-0.5)*0.8;}
    var segs=[];
    var cx2=sx,cy2=sy;
    var numSegs=5+Math.floor(Math.random()*8);
    for(var j=0;j<numSegs;j++){
      var len=30+Math.random()*80;
      var a=angle+((Math.random()-0.5)*0.7);
      var nx=cx2+Math.cos(a)*len, ny=cy2+Math.sin(a)*len;
      segs.push({x1:cx2,y1:cy2,x2:nx,y2:ny});
      cx2=nx; cy2=ny;
      if(Math.random()<0.35){
        var bLen=20+Math.random()*50;
        var bA=a+((Math.random()<0.5?1:-1)*(0.4+Math.random()*0.6));
        segs.push({x1:cx2,y1:cy2,x2:cx2+Math.cos(bA)*bLen,y2:cy2+Math.sin(bA)*bLen,branch:true});
      }
    }
    return {segs:segs,life:0,maxLife:80+Math.random()*120,opacity:0,width:0.5+Math.random()*1.5};
  }
  function drawGodslayer() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    godslayerTick++;
    var W=canvas.width,H=canvas.height,t=godslayerTick;
    var slowP=0.5+0.5*Math.sin(t*0.008);

    // 1. Deep purple/void edge vignette
    var thick=H*0.3;
    [[0,H,0,H-thick,'rgba(80,40,200,'],[0,0,0,thick,'rgba(60,20,160,'],[0,0,thick*0.5,0,'rgba(50,20,140,'],[W,0,W-thick*0.5,0,'rgba(50,20,140,']].forEach(function(d){
      var gg;
      if(d[0]===0&&d[1]===H){ gg=ctx.createLinearGradient(d[0],d[1],d[2],d[3]); }
      else if(d[0]===0&&d[1]===0&&d[2]===0){ gg=ctx.createLinearGradient(0,0,0,thick); }
      else{ gg=ctx.createLinearGradient(d[0],d[1],d[2],d[3]); }
      gg.addColorStop(0,d[4]+(0.10+0.05*slowP)+')');
      gg.addColorStop(1,d[4]+'0)');
      ctx.fillStyle=gg;
      if(d[1]===H) ctx.fillRect(0,H-thick,W,thick);
      else if(d[1]===0&&d[2]===0) ctx.fillRect(0,0,W,thick);
      else if(d[0]===0) ctx.fillRect(0,0,thick*0.5,H);
      else ctx.fillRect(W-thick*0.5,0,thick*0.5,H);
    });

    // 2. Spawn cracks occasionally
    if(Math.random()<0.025&&godslayerCracks.length<6) godslayerCracks.push(spawnCrack(W,H));

    // 3. Draw cracks
    godslayerCracks.forEach(function(c,ci){
      c.life++;
      var frac=c.life/c.maxLife;
      if(frac<0.15) c.opacity=frac/0.15;
      else if(frac>0.6) c.opacity=1-(frac-0.6)/0.4;
      else c.opacity=1;

      c.segs.forEach(function(s){
        if(s.branch){
          // branches dimmer
          ctx.shadowBlur=0;
          ctx.strokeStyle='rgba(200,180,255,'+(c.opacity*0.4)+')';
          ctx.lineWidth=c.width*0.5;
        } else {
          // main crack — bright white core with purple glow
          ctx.shadowColor='rgba(180,140,255,0.9)';
          ctx.shadowBlur=8;
          ctx.strokeStyle='rgba(255,255,255,'+(c.opacity*0.9)+')';
          ctx.lineWidth=c.width;
        }
        ctx.beginPath();
        ctx.moveTo(s.x1,s.y1);
        ctx.lineTo(s.x2,s.y2);
        ctx.stroke();
        ctx.shadowBlur=0;
      });
      if(c.life>=c.maxLife) godslayerCracks.splice(ci,1);
    });

    // 4. Drifting void motes — tiny purple/white particles floating
    while(particles.length<30){
      particles.push({
        x:Math.random()*W, y:Math.random()*H,
        vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.25,
        size:0.8+Math.random()*2,
        life:0, maxLife:500+Math.random()*500,
        wobble:Math.random()*Math.PI*2, wobbleSpeed:0.006+Math.random()*0.01,
        hue: Math.random()<0.5 ? 270 : 220,
        opacity:0,
      });
    }
    particles.forEach(function(p,i){
      p.life++; p.wobble+=p.wobbleSpeed;
      p.x+=p.vx+Math.sin(p.wobble*0.6)*0.3;
      p.y+=p.vy+Math.cos(p.wobble)*0.2;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      var frac=p.life/p.maxLife;
      if(frac<0.1) p.opacity=frac/0.1*0.7;
      else if(frac>0.8) p.opacity=(1-frac)/0.2*0.7;
      else p.opacity=0.2+0.5*Math.abs(Math.sin(p.wobble));
      var gp=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*4);
      gp.addColorStop(0,'hsla('+p.hue+',80%,90%,'+p.opacity+')');
      gp.addColorStop(1,'hsla('+p.hue+',60%,70%,0)');
      ctx.fillStyle=gp;
      ctx.fillRect(p.x-p.size*4,p.y-p.size*4,p.size*8,p.size*8);
      if(p.life>=p.maxLife) particles.splice(i,1);
    });
  }


  // ── Gion Matsuri — Kyoto festival: crimson lanterns, sparks, indigo night ──
  let gionTick = 0;
  function drawGionMatsuri() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gionTick++;
    var W = canvas.width, H = canvas.height;
    var slowP = 0.5 + 0.5 * Math.sin(gionTick * 0.012);
    var midP  = 0.5 + 0.5 * Math.sin(gionTick * 0.025);

    // Deep indigo night sky glow from top
    var sky = ctx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, H * 0.9);
    sky.addColorStop(0,   'rgba(40,5,80,'  + (0.18 + 0.06 * slowP) + ')');
    sky.addColorStop(0.4, 'rgba(15,2,40,'  + (0.08 + 0.03 * midP)  + ')');
    sky.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // Warm lantern ground glow from bottom
    var ground = ctx.createRadialGradient(W * 0.5, H, 0, W * 0.5, H, H * 0.6);
    ground.addColorStop(0,   'rgba(220,80,10,' + (0.20 + 0.08 * midP) + ')');
    ground.addColorStop(0.4, 'rgba(120,30,0,'  + (0.08 + 0.04 * slowP) + ')');
    ground.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);

    // Spawning lanterns + sparks
    while (particles.length < 55) {
      var isLantern = Math.random() < 0.18;
      particles.push({
        x: Math.random() * W,
        y: H + 10,
        vx: (Math.random() - 0.5) * (isLantern ? 0.4 : 1.2),
        vy: -(isLantern ? 0.3 + Math.random() * 0.5 : 0.8 + Math.random() * 1.8),
        size: isLantern ? 7 + Math.random() * 10 : 1.5 + Math.random() * 3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: isLantern ? 0.008 + Math.random() * 0.01 : 0.04 + Math.random() * 0.04,
        life: 0,
        maxLife: isLantern ? 500 + Math.random() * 400 : 80 + Math.random() * 100,
        opacity: 0,
        isLantern: isLantern,
        hue: isLantern
          ? (Math.random() < 0.6 ? 15 : 340) // orange-red or magenta-crimson lanterns
          : 20 + Math.random() * 30,           // orange-gold sparks
        glow: isLantern ? 1.0 : 0.7 + Math.random() * 0.3,
      });
    }

    particles.forEach(function(p, i) {
      p.life++;
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * (p.isLantern ? 0.6 : 0.4);
      p.y += p.vy;

      var frac = p.life / p.maxLife;
      if (frac < 0.12) p.opacity = frac / 0.12 * 0.9;
      else if (frac > 0.80) p.opacity = (1 - frac) / 0.20 * 0.9;
      else p.opacity = 0.7 + 0.2 * Math.abs(Math.sin(p.wobble));

      if (p.isLantern) {
        // Lantern body
        var lh = p.size * 1.6;
        var lw = p.size;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.wobble) * 0.08);
        ctx.globalAlpha = p.opacity;

        // Outer glow
        var lg = ctx.createRadialGradient(0, 0, 0, 0, 0, lw * 2.5);
        lg.addColorStop(0,   'hsla(' + p.hue + ',100%,65%,' + (p.opacity * 0.6) + ')');
        lg.addColorStop(0.5, 'hsla(' + p.hue + ',100%,40%,' + (p.opacity * 0.25) + ')');
        lg.addColorStop(1,   'hsla(' + p.hue + ',100%,20%,0)');
        ctx.beginPath(); ctx.arc(0, 0, lw * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = lg; ctx.fill();

        // Body shape
        ctx.beginPath();
        ctx.ellipse(0, 0, lw, lh * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ',100%,60%,' + p.opacity + ')';
        ctx.shadowColor = 'hsla(' + p.hue + ',100%,70%,0.9)';
        ctx.shadowBlur = lw * 3;
        ctx.fill();
        // Highlight stripe
        ctx.beginPath();
        ctx.ellipse(-lw * 0.2, -lh * 0.08, lw * 0.18, lh * 0.18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (p.opacity * 0.4) + ')';
        ctx.shadowBlur = 0;
        ctx.fill();
        // String above
        ctx.beginPath();
        ctx.moveTo(0, -lh * 0.5);
        ctx.lineTo(0, -lh * 0.5 - lw * 0.8);
        ctx.strokeStyle = 'rgba(200,150,80,' + (p.opacity * 0.6) + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.restore();
      } else {
        // Spark
        var sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
        sg.addColorStop(0,   'hsla(' + p.hue + ',100%,92%,' + p.opacity + ')');
        sg.addColorStop(0.3, 'hsla(' + p.hue + ',100%,65%,' + (p.opacity * 0.8) + ')');
        sg.addColorStop(1,   'hsla(' + p.hue + ',100%,40%,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.shadowColor = 'hsla(' + p.hue + ',100%,70%,0.9)';
        ctx.shadowBlur = p.size * 4;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      if (p.y < -60 || p.life >= p.maxLife) particles.splice(i, 1);
    });
  }

  // ── Toro Nagashi — floating paper lanterns on dark water, fireflies ──
  let toroTick = 0;
  function drawToroNagashi() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    toroTick++;
    var W = canvas.width, H = canvas.height;
    var slowP = 0.5 + 0.5 * Math.sin(toroTick * 0.010);
    var midP  = 0.5 + 0.5 * Math.sin(toroTick * 0.022);

    // Deep water darkness at bottom
    var water = ctx.createLinearGradient(0, H * 0.55, 0, H);
    water.addColorStop(0, 'rgba(0,8,20,0)');
    water.addColorStop(0.5, 'rgba(0,5,15,' + (0.10 + 0.04 * slowP) + ')');
    water.addColorStop(1,   'rgba(0,2,10,' + (0.16 + 0.06 * midP) + ')');
    ctx.fillStyle = water; ctx.fillRect(0, H * 0.55, W, H * 0.45);

    // Moonlight glow from top-right
    var moon = ctx.createRadialGradient(W * 0.78, H * 0.08, 0, W * 0.78, H * 0.08, H * 0.55);
    moon.addColorStop(0,   'rgba(200,220,255,' + (0.09 + 0.04 * slowP) + ')');
    moon.addColorStop(0.35,'rgba(130,160,220,' + (0.04 + 0.02 * midP)  + ')');
    moon.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = moon; ctx.fillRect(0, 0, W, H);

    // Spawn floating lanterns + fireflies + reflection ripples
    while (particles.length < 48) {
      var type = Math.random();
      var isLantern  = type < 0.22;
      var isFirefly  = type < 0.50 && !isLantern;
      particles.push({
        x: Math.random() * W,
        y: isLantern ? H * (0.55 + Math.random() * 0.38)   // floating on water
           : isFirefly ? Math.random() * H * 0.70           // fireflies anywhere upper
           : H * (0.55 + Math.random() * 0.44),             // reflection spark
        vx: isLantern  ? (Math.random() - 0.5) * 0.25
            : isFirefly ? (Math.random() - 0.5) * 0.55
            : (Math.random() - 0.5) * 0.15,
        vy: isLantern  ? -(0.04 + Math.random() * 0.10)     // very slow downstream drift
            : isFirefly ? (Math.random() - 0.5) * 0.40
            : (Math.random() - 0.5) * 0.08,
        size: isLantern ? 8 + Math.random() * 12
              : isFirefly ? 2 + Math.random() * 3
              : 1 + Math.random() * 2.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: isLantern ? 0.006 + Math.random() * 0.008
                     : isFirefly ? 0.025 + Math.random() * 0.03
                     : 0.02 + Math.random() * 0.025,
        life: 0,
        maxLife: isLantern  ? 700 + Math.random() * 600
                 : isFirefly ? 200 + Math.random() * 300
                 : 120 + Math.random() * 150,
        opacity: 0,
        isLantern: isLantern,
        isFirefly: isFirefly,
        hue: isLantern  ? (Math.random() < 0.55 ? 38 : Math.random() < 0.5 ? 15 : 55)
             : isFirefly ? 48 + Math.random() * 30
             : 42 + Math.random() * 20,
      });
    }

    particles.forEach(function(p, i) {
      p.life++;
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * (p.isLantern ? 0.3 : p.isFirefly ? 0.5 : 0.1);
      p.y += p.vy + (p.isFirefly ? Math.cos(p.wobble * 0.7) * 0.3 : 0);
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;

      var frac = p.life / p.maxLife;
      if (frac < 0.10) p.opacity = frac / 0.10 * 0.95;
      else if (frac > 0.82) p.opacity = (1 - frac) / 0.18 * 0.95;
      else p.opacity = p.isFirefly
        ? 0.4 + 0.55 * Math.abs(Math.sin(p.wobble * 1.4))
        : 0.75 + 0.20 * Math.abs(Math.sin(p.wobble));

      if (p.isLantern) {
        var lw = p.size, lh = p.size * 0.65;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.wobble) * 0.04);
        ctx.globalAlpha = p.opacity;

        // Water reflection glow beneath lantern
        var refG = ctx.createRadialGradient(0, lh * 2.5, 0, 0, lh * 2.5, lw * 3.5);
        refG.addColorStop(0, 'hsla(' + p.hue + ',100%,55%,' + (p.opacity * 0.22) + ')');
        refG.addColorStop(1, 'hsla(' + p.hue + ',100%,30%,0)');
        ctx.beginPath(); ctx.arc(0, lh * 2.5, lw * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = refG; ctx.fill();

        // Outer soft glow
        var og = ctx.createRadialGradient(0, 0, 0, 0, 0, lw * 3);
        og.addColorStop(0,   'hsla(' + p.hue + ',100%,65%,' + (p.opacity * 0.55) + ')');
        og.addColorStop(0.6, 'hsla(' + p.hue + ',100%,40%,' + (p.opacity * 0.18) + ')');
        og.addColorStop(1,   'hsla(' + p.hue + ',80%,20%,0)');
        ctx.beginPath(); ctx.arc(0, 0, lw * 3, 0, Math.PI * 2);
        ctx.fillStyle = og; ctx.fill();

        // Lantern box body
        ctx.beginPath();
        ctx.ellipse(0, 0, lw, lh, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ',100%,68%,' + p.opacity + ')';
        ctx.shadowColor = 'hsla(' + p.hue + ',100%,75%,1.0)';
        ctx.shadowBlur = lw * 2.5;
        ctx.fill();
        // Inner brighter core
        ctx.beginPath();
        ctx.ellipse(0, 0, lw * 0.55, lh * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,220,' + (p.opacity * 0.55) + ')';
        ctx.shadowBlur = 0;
        ctx.fill();
        // Horizontal bands
        for (var b = -1; b <= 1; b++) {
          ctx.beginPath();
          ctx.ellipse(0, b * lh * 0.28, lw * 0.95, lh * 0.06, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'hsla(' + (p.hue + 15) + ',100%,30%,' + (p.opacity * 0.5) + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        // Top and bottom caps
        ctx.beginPath(); ctx.ellipse(0, -lh, lw * 0.5, lh * 0.15, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ',80%,35%,' + p.opacity + ')'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(0,  lh, lw * 0.5, lh * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        // String
        ctx.beginPath(); ctx.moveTo(0, -lh * 1.15); ctx.lineTo(0, -lh * 1.15 - lw);
        ctx.strokeStyle = 'rgba(200,160,80,' + (p.opacity * 0.55) + ')';
        ctx.lineWidth = 0.8; ctx.stroke();
        // Tassel
        ctx.beginPath(); ctx.moveTo(0, lh * 1.15); ctx.lineTo(0, lh * 1.15 + lw * 0.7);
        ctx.strokeStyle = 'rgba(220,80,20,' + (p.opacity * 0.5) + ')';
        ctx.lineWidth = 0.9; ctx.stroke();

        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
        ctx.restore();
      } else if (p.isFirefly) {
        // Firefly glow
        var pulse = 0.6 + 0.4 * Math.abs(Math.sin(p.wobble * 1.3));
        var fg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4.5);
        fg.addColorStop(0,   'hsla(' + p.hue + ',100%,92%,' + (p.opacity * pulse) + ')');
        fg.addColorStop(0.25,'hsla(' + p.hue + ',100%,65%,' + (p.opacity * pulse * 0.7) + ')');
        fg.addColorStop(1,   'hsla(' + p.hue + ',100%,40%,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.shadowColor = 'hsla(' + p.hue + ',100%,80%,0.9)';
        ctx.shadowBlur = p.size * 5; ctx.fill(); ctx.shadowBlur = 0;
      } else {
        // Water reflection sparkle
        var rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        rg.addColorStop(0, 'hsla(' + p.hue + ',90%,85%,' + p.opacity + ')');
        rg.addColorStop(1, 'hsla(' + p.hue + ',80%,50%,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = rg; ctx.fill();
      }

      if (p.life >= p.maxLife) particles.splice(i, 1);
    });
  }

  // ── Kagami Biraki — New Year mochi ceremony: white, gold, red, pine snow ──
  let kagamiTick = 0;
  function drawKagamiBiraki() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    kagamiTick++;
    var W = canvas.width, H = canvas.height;
    var slowP = 0.5 + 0.5 * Math.sin(kagamiTick * 0.009);
    var midP  = 0.5 + 0.5 * Math.sin(kagamiTick * 0.021);

    // Clean winter dawn sky — blue-grey top
    var dawn = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    dawn.addColorStop(0, 'rgba(10,20,35,' + (0.15 + 0.05 * slowP) + ')');
    dawn.addColorStop(0.5,'rgba(5,12,25,' + (0.06 + 0.02 * midP) + ')');
    dawn.addColorStop(1,  'rgba(0,0,0,0)');
    ctx.fillStyle = dawn; ctx.fillRect(0, 0, W, H * 0.6);

    // Gold shimmer from center (sacred mirror reflection)
    var mirror = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, Math.min(W, H) * 0.55);
    mirror.addColorStop(0,   'rgba(220,185,50,'  + (0.10 + 0.06 * midP) + ')');
    mirror.addColorStop(0.3, 'rgba(160,120,20,'  + (0.04 + 0.03 * slowP) + ')');
    mirror.addColorStop(0.7, 'rgba(80,50,5,0.02)');
    mirror.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = mirror; ctx.fillRect(0, 0, W, H);

    // Red accent bottom (ceremonial cloth / sake cups)
    var redCloth = ctx.createLinearGradient(0, H * 0.75, 0, H);
    redCloth.addColorStop(0, 'rgba(0,0,0,0)');
    redCloth.addColorStop(0.6,'rgba(140,15,20,' + (0.06 + 0.03 * midP) + ')');
    redCloth.addColorStop(1, 'rgba(80,5,10,'   + (0.10 + 0.04 * slowP) + ')');
    ctx.fillStyle = redCloth; ctx.fillRect(0, H * 0.75, W, H * 0.25);

    // Snow + gold motes + red petals (plum blossom)
    while (particles.length < 55) {
      var roll = Math.random();
      var isSnow  = roll < 0.55;
      var isPlum  = roll < 0.72 && !isSnow;
      particles.push({
        x: Math.random() * (W + 60) - 30,
        y: isSnow ? -10 - Math.random() * H * 0.3
           : isPlum ? -15
           : Math.random() * H,
        vx: (Math.random() - 0.5) * (isSnow ? 0.4 : isPlum ? 0.7 : 0.2),
        vy: isSnow  ? 0.4 + Math.random() * 0.7
            : isPlum  ? 0.5 + Math.random() * 0.9
            : (Math.random() - 0.5) * 0.15,
        size: isSnow  ? 1.5 + Math.random() * 3.5
              : isPlum  ? 3 + Math.random() * 5
              : 1 + Math.random() * 2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: isSnow ? 0.012 + Math.random() * 0.015
                     : isPlum ? 0.018 + Math.random() * 0.025
                     : 0.008 + Math.random() * 0.012,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.04,
        life: 0,
        maxLife: isSnow  ? 500 + Math.random() * 400
                 : isPlum  ? 350 + Math.random() * 300
                 : 600 + Math.random() * 500,
        opacity: 0,
        isSnow: isSnow,
        isPlum: isPlum,
        hue: isPlum ? (Math.random() < 0.6 ? 345 : 320) : 50, // crimson or pink-plum
      });
    }

    particles.forEach(function(p, i) {
      p.life++;
      p.wobble += p.wobbleSpeed;
      p.spin   += p.spinSpeed;
      p.x += p.vx + Math.sin(p.wobble) * (p.isSnow ? 0.5 : p.isPlum ? 0.6 : 0.1);
      p.y += p.vy;
      if (p.x < -30) p.x = W + 20;
      if (p.x > W + 30) p.x = -20;

      var frac = p.life / p.maxLife;
      if (frac < 0.10) p.opacity = frac / 0.10 * 0.9;
      else if (frac > 0.80) p.opacity = (1 - frac) / 0.20 * 0.9;
      else p.opacity = p.isSnow ? 0.55 + 0.30 * Math.abs(Math.sin(p.wobble))
                      : p.isPlum ? 0.60 + 0.25 * Math.abs(Math.sin(p.wobble))
                      : 0.25 + 0.45 * Math.abs(Math.sin(p.wobble));

      if (p.isSnow) {
        // Snowflake — 6-pointed star
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.globalAlpha = p.opacity;
        ctx.strokeStyle = 'rgba(200,225,255,' + p.opacity + ')';
        ctx.shadowColor = 'rgba(180,210,255,0.8)';
        ctx.shadowBlur = p.size * 2.5;
        ctx.lineWidth = p.size > 2.5 ? 0.9 : 0.6;
        for (var arm = 0; arm < 6; arm++) {
          ctx.save();
          ctx.rotate(arm * Math.PI / 3);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -p.size);
          ctx.stroke();
          // tiny crossbar
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.3, -p.size * 0.55);
          ctx.lineTo( p.size * 0.3, -p.size * 0.55);
          ctx.stroke();
          ctx.restore();
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
      } else if (p.isPlum) {
        // Plum blossom petal
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.moveTo(0, p.size * 0.5);
        ctx.bezierCurveTo( p.size * 0.8, -p.size * 0.1,  p.size,      -p.size * 0.7, 0, -p.size * 0.4);
        ctx.bezierCurveTo(-p.size,      -p.size * 0.7,  -p.size * 0.8, -p.size * 0.1, 0,  p.size * 0.5);
        ctx.fillStyle = 'hsla(' + p.hue + ',90%,60%,' + p.opacity + ')';
        ctx.shadowColor = 'hsla(' + p.hue + ',90%,60%,0.6)';
        ctx.shadowBlur = p.size * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
      } else {
        // Gold mote
        var gm = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gm.addColorStop(0, 'rgba(240,210,100,' + p.opacity + ')');
        gm.addColorStop(1, 'rgba(200,160,40,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gm; ctx.fill();
      }

      if (p.y > H + 30 || p.life >= p.maxLife) particles.splice(i, 1);
    });
  }

  // ── Sepia Codex ──
  let sepiaTick = 0;
  function drawSepiaCodex() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sepiaTick++;
    var W = canvas.width, H = canvas.height;
    while (particles.length < 40) {
      particles.push({ x:Math.random()*W, y:Math.random()*H, size:0.8+Math.random()*2, vy:-(0.1+Math.random()*0.25), vx:(Math.random()-0.5)*0.15, opacity:0, maxOp:0.25+Math.random()*0.45, life:0, maxLife:200+Math.random()*150, isInk:Math.random()<0.3 });
    }
    var vg = ctx.createRadialGradient(W/2,H/2,H*0.1,W/2,H/2,H*0.7);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(25,14,4,0.5)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
    for (var i=particles.length-1;i>=0;i--) {
      var p=particles[i]; p.life++; p.x+=p.vx; p.y+=p.vy;
      p.opacity = (p.life<30?p.life/30:p.life>p.maxLife-30?(p.maxLife-p.life)/30:1)*p.maxOp;
      ctx.globalAlpha=p.opacity;
      if (p.isInk) { ctx.fillStyle='rgba(55,30,8,1)'; ctx.shadowBlur=0; }
      else { ctx.fillStyle='rgba(195,155,75,1)'; ctx.shadowColor='rgba(215,175,95,0.7)'; ctx.shadowBlur=5; }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.globalAlpha=1;
      if (p.life>=p.maxLife) particles.splice(i,1);
    }
  }

  // ── Neon Dungeon ──
  let neonTick = 0;
  function drawNeonDungeon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    neonTick++;
    var W=canvas.width, H=canvas.height, t=neonTick;
    var hues=[180,300,60,200,320];
    while (particles.length<55) {
      particles.push({ x:Math.random()*W, y:H+10, size:0.8+Math.random()*2, vy:-(0.4+Math.random()*0.9), vx:(Math.random()-0.5)*0.4, hue:hues[Math.floor(Math.random()*hues.length)], opacity:0, maxOp:0.6+Math.random()*0.4, life:0, maxLife:110+Math.random()*100, flicker:Math.random()*Math.PI*2 });
    }
    for (var i=particles.length-1;i>=0;i--) {
      var p=particles[i]; p.life++; p.x+=p.vx; p.y+=p.vy;
      var flkr=0.8+0.2*Math.sin(t*0.35+p.flicker);
      p.opacity=(p.life<20?p.life/20:p.life>p.maxLife-20?(p.maxLife-p.life)/20:1)*p.maxOp*flkr;
      ctx.globalAlpha=p.opacity;
      ctx.shadowColor='hsl('+p.hue+',100%,60%)'; ctx.shadowBlur=12;
      ctx.fillStyle='hsl('+p.hue+',100%,78%)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.globalAlpha=1;
      if (p.life>=p.maxLife) particles.splice(i,1);
    }
  }

  // ── Monochrome ──
  let monochromeTick = 0;
  function drawMonochrome() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    monochromeTick++;
    var W=canvas.width, H=canvas.height;
    while (particles.length<45) {
      particles.push({ x:Math.random()*W, y:Math.random()*H, size:0.5+Math.random()*2.2, vy:-(0.08+Math.random()*0.22), vx:(Math.random()-0.5)*0.12, brightness:140+Math.floor(Math.random()*115), opacity:0, maxOp:0.12+Math.random()*0.38, life:0, maxLife:220+Math.random()*160 });
    }
    for (var i=particles.length-1;i>=0;i--) {
      var p=particles[i]; p.life++; p.x+=p.vx; p.y+=p.vy;
      p.opacity=(p.life<40?p.life/40:p.life>p.maxLife-40?(p.maxLife-p.life)/40:1)*p.maxOp;
      var b=p.brightness;
      ctx.globalAlpha=p.opacity;
      ctx.shadowColor='rgb('+b+','+b+','+b+')'; ctx.shadowBlur=4;
      ctx.fillStyle='rgb('+b+','+b+','+b+')';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.globalAlpha=1;
      if (p.life>=p.maxLife) particles.splice(i,1);
    }
  }

  // ── Infected ──
  let infectedTick = 0;
  function drawInfected() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    infectedTick++;
    var W=canvas.width, H=canvas.height, t=infectedTick;
    while (particles.length<50) {
      particles.push({ x:Math.random()*W, y:H+10, size:1+Math.random()*3, vy:-(0.2+Math.random()*0.5), vx:(Math.random()-0.5)*0.4, hue:80+Math.random()*55, opacity:0, maxOp:0.4+Math.random()*0.5, life:0, maxLife:150+Math.random()*100, wobble:Math.random()*Math.PI*2, ws:0.02+Math.random()*0.04 });
    }
    for (var i=particles.length-1;i>=0;i--) {
      var p=particles[i]; p.life++; p.x+=p.vx+Math.sin(t*p.ws+p.wobble)*0.3; p.y+=p.vy;
      p.opacity=(p.life<25?p.life/25:p.life>p.maxLife-25?(p.maxLife-p.life)/25:1)*p.maxOp;
      ctx.globalAlpha=p.opacity;
      ctx.shadowColor='hsl('+p.hue+',90%,30%)'; ctx.shadowBlur=9;
      ctx.fillStyle='hsl('+p.hue+',78%,38%)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='hsl('+p.hue+',65%,55%)'; ctx.lineWidth=0.5;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*1.9,0,Math.PI*2); ctx.stroke();
      ctx.shadowBlur=0; ctx.globalAlpha=1;
      if (p.life>=p.maxLife) particles.splice(i,1);
    }
  }

  // ── Frozen Tomb ──
  let frozenTick = 0;
  function drawFrozenTomb() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frozenTick++;
    var W=canvas.width, H=canvas.height;
    while (particles.length<45) {
      particles.push({ x:Math.random()*W, y:-10, size:1+Math.random()*2.5, vy:0.2+Math.random()*0.4, vx:(Math.random()-0.5)*0.2, opacity:0, maxOp:0.35+Math.random()*0.5, life:0, maxLife:220+Math.random()*150, spin:Math.random()*Math.PI*2, ss:(Math.random()-0.5)*0.018 });
    }
    for (var i=particles.length-1;i>=0;i--) {
      var p=particles[i]; p.life++; p.x+=p.vx; p.y+=p.vy; p.spin+=p.ss;
      p.opacity=(p.life<30?p.life/30:p.life>p.maxLife-30?(p.maxLife-p.life)/30:1)*p.maxOp;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.spin); ctx.globalAlpha=p.opacity;
      ctx.strokeStyle='rgba(175,225,255,1)'; ctx.shadowColor='rgba(135,205,255,0.85)'; ctx.shadowBlur=7; ctx.lineWidth=0.8;
      for (var arm=0;arm<6;arm++) {
        ctx.save(); ctx.rotate(arm*Math.PI/3);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-p.size*2.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-p.size*0.5,-p.size*1.2); ctx.lineTo(p.size*0.5,-p.size*1.2); ctx.stroke();
        ctx.restore();
      }
      ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.restore();
      if (p.y>H+20||p.life>=p.maxLife) particles.splice(i,1);
    }
  }

  // ── Forge of Ages ──
  let forgeTick = 0;
  function drawForgeOfAges() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    forgeTick++;
    var W=canvas.width, H=canvas.height;
    while (particles.length<65) {
      particles.push({ x:W*0.25+Math.random()*W*0.5, y:H+5, size:0.8+Math.random()*2.2, vy:-(0.7+Math.random()*1.5), vx:(Math.random()-0.5)*0.9, hue:15+Math.random()*25, opacity:0, maxOp:0.7+Math.random()*0.3, life:0, maxLife:55+Math.random()*75 });
    }
    for (var i=particles.length-1;i>=0;i--) {
      var p=particles[i]; p.life++; p.x+=p.vx; p.y+=p.vy; p.vx+=(Math.random()-0.5)*0.06;
      var lr=p.life/p.maxLife;
      var hue=p.hue-lr*12, lgt=72-lr*42;
      p.opacity=(lr<0.15?lr/0.15:lr>0.75?(1-lr)/0.25:1)*p.maxOp;
      ctx.globalAlpha=p.opacity;
      ctx.shadowColor='hsl('+hue+',95%,'+(lgt+12)+'%)'; ctx.shadowBlur=11;
      ctx.fillStyle='hsl('+hue+',95%,'+lgt+'%)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.globalAlpha=1;
      if (p.life>=p.maxLife) particles.splice(i,1);
    }
  }

  // ── The Dreaming ──
  let dreamingTick = 0;
  function drawTheDreaming() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dreamingTick++;
    var W=canvas.width, H=canvas.height, t=dreamingTick;
    while (particles.length<55) {
      particles.push({ x:Math.random()*W, y:Math.random()*H, size:0.5+Math.random()*2, vx:(Math.random()-0.5)*0.14, vy:(Math.random()-0.5)*0.14, hue:200+Math.random()*145, opacity:0, maxOp:0.18+Math.random()*0.42, life:0, maxLife:260+Math.random()*200, drift:Math.random()*Math.PI*2, ds:0.005+Math.random()*0.012 });
    }
    var pulse=0.5+0.5*Math.sin(t*0.006);
    var nb=ctx.createRadialGradient(W*0.4,H*0.35,0,W*0.4,H*0.35,W*0.52);
    nb.addColorStop(0,'rgba(70,15,110,'+(0.035+0.025*pulse)+')'); nb.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=nb; ctx.fillRect(0,0,W,H);
    for (var i=particles.length-1;i>=0;i--) {
      var p=particles[i]; p.life++; p.drift+=p.ds;
      p.x+=p.vx+Math.sin(p.drift)*0.22; p.y+=p.vy+Math.cos(p.drift*0.7)*0.16;
      p.opacity=(p.life<60?p.life/60:p.life>p.maxLife-60?(p.maxLife-p.life)/60:1)*p.maxOp;
      ctx.globalAlpha=p.opacity;
      ctx.shadowColor='hsl('+p.hue+',75%,68%)'; ctx.shadowBlur=13;
      ctx.fillStyle='hsl('+p.hue+',65%,72%)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.globalAlpha=1;
      if (p.x<-5) p.x=W+5; if (p.x>W+5) p.x=-5;
      if (p.y<-5) p.y=H+5; if (p.y>H+5) p.y=-5;
      if (p.life>=p.maxLife) particles.splice(i,1);
    }
  }

  function stopAnim() {
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
    currentAnim = null;
  }

  window._themeAnimStart = startAnim;
  window._themeAnimStop = stopAnim;
})();

// ── Theme Category Tabs ──
function switchThemeCat(cat) {
  ['static','animated','seasonal','custom'].forEach(c => {
    const grid = document.getElementById('catGrid' + c.charAt(0).toUpperCase() + c.slice(1));
    const tab  = document.getElementById('catTab'  + c.charAt(0).toUpperCase() + c.slice(1));
    if (grid) grid.style.display = (c === cat) ? (c === 'custom' ? 'block' : 'grid') : 'none';
    if (tab)  tab.classList.toggle('active', c === cat);
  });
  const seasonalRow = document.getElementById('seasonalAutoRow');
  if (seasonalRow) seasonalRow.style.display = (cat === 'seasonal') ? 'flex' : 'none';
  // Sync toggle state
  if (cat === 'seasonal') {
    const tog = document.getElementById('seasonalAutoToggle');
    if (tog) tog.checked = (localStorage.getItem('dnd_seasonal_auto') !== 'off');
  }
  // Load saved custom values when opening custom tab
  if (cat === 'custom') loadCustomThemeValues();
}

// ── Seasonal Auto-Toggle ──
function toggleSeasonalAuto(enabled) {
  if (enabled) {
    localStorage.setItem('dnd_seasonal_auto', 'on');
    const seasonal = detectSeasonalTheme();
    if (seasonal) {
      window._applyingAutoTheme = true;
      applyTheme(seasonal);
      window._applyingAutoTheme = false;
      // Obnov auto flag (applyTheme ho mohol resetovať ak sme zabudli flag)
      localStorage.setItem('dnd_seasonal_auto', 'on');
      showToast('🎉 Sezónna téma: ' + seasonal.charAt(0).toUpperCase() + seasonal.slice(1));
    } else {
      showToast('📅 Žiadna sezónna téma pre dnešný dátum');
    }
  } else {
    localStorage.setItem('dnd_seasonal_auto', 'off');
    // Ulož aktuálnu tému ako manuálnu
    const current = document.body.getAttribute('data-theme') || 'default';
    localStorage.setItem('dnd_theme', current);
    showToast('🔕 Auto-sezónna téma vypnutá');
  }
}


const THEME_CYCLE = ['default','arcane','nature','shadow','fire','ice','sakura','solo','bloodmoon','void','glacier','ancientgold','underdark','paladin','eva01','smoke','ember','fairy','sakura-anim','solo-anim','storm','abyss','blizzard','crimsonrain','aurora','voidanim','halloween','christmas','newyear','valentine','easter','summer','autumn','winterfrost'];
function cycleTheme() {
  const current = document.body.getAttribute('data-theme') || 'default';
  const others = THEME_CYCLE.filter(t => t !== current);
  const next = others[Math.floor(Math.random() * others.length)];
  applyTheme(next);
  showToast('Téma: ' + next.charAt(0).toUpperCase() + next.slice(1));
}

// ── Auto Seasonal Theme Detection ──
function detectSeasonalTheme() {
  const now = new Date();
  const m = now.getMonth() + 1; // 1-12
  const d = now.getDate();

  // ── JANUÁR ──
  // New Year          Jan 1–7
  if (m === 1 && d <= 7)                             return 'newyear';
  // Kagami Biraki     Jan 8–19 (japonský sviatok ryžových koláčov)
  if (m === 1 && d >= 8 && d <= 19)                  return 'kagamibiraki';
  // Chinese New Year  Jan 20 – Feb 9
  if ((m === 1 && d >= 20) || (m === 2 && d <= 9))   return 'chineseny';

  // ── FEBRUÁR ──
  // Valentine         Feb 10–18
  if (m === 2 && d >= 10 && d <= 18)                 return 'valentine';
  // Winter Frost      Feb 19–28 (bridge do jari)
  if (m === 2 && d >= 19)                            return 'winterfrost';

  // ── MAREC ──
  // Winter Frost      Mar 1–9 (posledný ľad pred jarou)
  if (m === 3 && d <= 9)                             return 'winterfrost';
  // Spring            Mar 10 – Apr 4 (jar sa prebúdza)
  if ((m === 3 && d >= 10) || (m === 4 && d <= 4))   return 'spring';

  // ── APRÍL ──
  // Easter            Apr 5 – Apr 27 (pokrýva Veľkú noc ~Apr 13–20 každý rok)
  if (m === 4 && d >= 5 && d <= 27)                  return 'easter';
  // Spring petals     Apr 28 – May 14 (sakura season)
  if ((m === 4 && d >= 28) || (m === 5 && d <= 14))  return 'spring';

  // ── MÁJ ──
  // Mermay / Sea      May 15–31
  if (m === 5 && d >= 15)                            return 'mermay';

  // ── JÚN ──
  // Beltane fire      Jun 1–16
  if (m === 6 && d <= 16)                            return 'beltane';
  // Midsummer/Litha   Jun 17–26 (slnovrat)
  if (m === 6 && d >= 17 && d <= 26)                 return 'midsummer';
  // Midsummer Feast   Jun 27–30
  if (m === 6 && d >= 27)                            return 'feast';

  // ── JÚL ──
  // Midsummer Feast   Jul 1–14
  if (m === 7 && d <= 14)                            return 'feast';
  // Gion Matsuri      Jul 15–31 (kjótsky festival)
  if (m === 7 && d >= 15)                            return 'gionmatsuri';

  // ── AUGUST ──
  // Toro Nagashi      Aug 1–14 (festival plávajúcich lampášov)
  if (m === 8 && d <= 14)                            return 'toronagashi';
  // Summer peak       Aug 15–31 (vrchol leta)
  if (m === 8 && d >= 15)                            return 'summer';

  // ── SEPTEMBER ──
  // Summer end        Sep 1–14 (koniec leta)
  if (m === 9 && d <= 14)                            return 'summer';
  // Autumn            Sep 15 – Oct 14
  if ((m === 9 && d >= 15) || (m === 10 && d <= 14)) return 'autumn';

  // ── OKTÓBER ──
  // Halloween         Oct 15–31
  if (m === 10 && d >= 15)                           return 'halloween';

  // ── NOVEMBER ──
  // Winter Frost      Nov 1 – Dec 14
  if (m === 11 || (m === 12 && d <= 14))             return 'winterfrost';

  // ── DECEMBER ──
  // Christmas         Dec 15–31
  if (m === 12 && d >= 15)                           return 'christmas';

  return null;
}

(function() {
  try {
    // Pri úplne prvom otvorení (žiadny kľúč v localStorage) nastav auto na OFF
    // aby default téma zostala aktívna a user si sám vybral
    if (localStorage.getItem('dnd_seasonal_auto') === null) {
      localStorage.setItem('dnd_seasonal_auto', 'off');
    }

    const seasonalAutoOff = localStorage.getItem('dnd_seasonal_auto') === 'off';
    if (!seasonalAutoOff) {
      // Auto mode má prioritu — vždy aplikuj sezónnu tému pri loade
      const seasonal = detectSeasonalTheme();
      if (seasonal) {
        setTimeout(() => {
          window._applyingAutoTheme = true;
          applyTheme(seasonal);
          window._applyingAutoTheme = false;
          showToast('🎉 Sezónna téma: ' + seasonal.charAt(0).toUpperCase() + seasonal.slice(1));
        }, 800);
      }
    } else {
      // Auto je vypnuté — načítaj manuálne uloženú tému
      const saved = localStorage.getItem('dnd_theme');
      if (saved && saved !== 'default') {
        const animThemes = ['smoke','ember','fairy','sakura-anim','solo-anim','storm','abyss','blizzard','crimsonrain','aurora','voidanim','halloween','christmas','newyear','valentine','easter','summer','autumn','winterfrost','spring','chineseny','beltane','mermay','midsummer','feast','gionmatsuri','toronagashi','kagamibiraki'];
        window._applyingAutoTheme = true;
        if (animThemes.includes(saved)) {
          setTimeout(() => { applyTheme(saved); window._applyingAutoTheme = false; }, 200);
        } else {
          applyTheme(saved);
          window._applyingAutoTheme = false;
        }
      }
    }
  } catch(e) {}
})();


function toggleRankedFrame() {
  var enabled = localStorage.getItem('dnd_ranked_frame') !== 'off';
  enabled = !enabled;
  localStorage.setItem('dnd_ranked_frame', enabled ? 'on' : 'off');
  applyRankedFrame();
}

function applyRankedFrame() {
  var enabled = localStorage.getItem('dnd_ranked_frame') !== 'off';
  var wrapper = document.getElementById('portraitFrameWrapper');
  var btn = document.getElementById('rankedToggleBtn');
  var badge = document.getElementById('portraitRankBadge');
  var progress = document.getElementById('portraitRankProgress');
  if (!wrapper) return;
  var frame = wrapper.querySelector('.portrait-rank-frame');
  if (enabled) {
    if (frame) frame.style.display = '';
    if (badge) badge.style.display = '';
    if (progress) progress.style.display = '';
    if (btn) { btn.style.background = 'var(--accent-gold)'; btn.style.color = 'var(--bg-dark)'; btn.style.borderColor = 'var(--accent-gold-bright)'; }
  } else {
    if (frame) frame.style.display = 'none';
    if (badge) badge.style.display = 'none';
    if (progress) progress.style.display = 'none';
    if (btn) { btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = ''; }
  }
  _refreshRankGlowBtn();
}

// ── Rank Frame Glow Toggle ────────────────────────────────────
// Vypne/zapne len svietenie (box-shadow + animácie) okolo rámiku.
// Rámik (border), badge, rank label — všetko ostáva viditeľné.
// Funguje cez CSS triedu "rank-glow-off" na body.

function _isRankGlowOff() {
  return localStorage.getItem('dnd_rank_glow') === 'off';
}

function toggleRankGlow() {
  var off = _isRankGlowOff();
  localStorage.setItem('dnd_rank_glow', off ? 'on' : 'off');
  _applyRankGlowState();
  _refreshRankGlowBtn();
}

function _applyRankGlowState() {
  if (_isRankGlowOff()) {
    document.body.classList.add('rank-glow-off');
  } else {
    document.body.classList.remove('rank-glow-off');
  }
}

function _refreshRankGlowBtn() {
  var btn = document.getElementById('rankGlowToggleBtn');
  if (!btn) return;
  var off = _isRankGlowOff();
  btn.textContent = off ? '✦ Frame Glow: OFF' : '✦ Frame Glow: ON';
  if (off) {
    btn.style.background  = '';
    btn.style.borderColor = '';
    btn.style.color       = '';
    btn.style.opacity     = '0.55';
  } else {
    btn.style.background  = 'rgba(212,168,30,0.15)';
    btn.style.borderColor = 'rgba(212,168,30,0.5)';
    btn.style.color       = 'var(--accent-gold)';
    btn.style.opacity     = '1';
  }
  btn.title = off ? 'Frame glow vypnutý — klikni pre zapnutie' : 'Klikni pre vypnutie svietenia rámiku';
}

// Vlož button vedľa rankedToggleBtn — volá sa z applyRankedFrame aj init
function _injectRankGlowBtn() {
  var rankedBtn = document.getElementById('rankedToggleBtn');
  if (!rankedBtn) return;
  if (document.getElementById('rankGlowToggleBtn')) {
    _refreshRankGlowBtn();
    return;
  }
  var btn = document.createElement('button');
  btn.id = 'rankGlowToggleBtn';
  btn.className = 'btn btn-sm';
  btn.style.cssText = 'font-family:Cinzel,serif;letter-spacing:1px;';
  btn.onclick = toggleRankGlow;
  rankedBtn.parentNode.insertBefore(btn, rankedBtn.nextSibling);
  _refreshRankGlowBtn();
}

// Init
(function() {
  function _initRankGlow() {
    _applyRankGlowState();
    _injectRankGlowBtn();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(_initRankGlow, 400); });
  } else {
    setTimeout(_initRankGlow, 400);
  }
})();

// Init ranked frame state on load
(function() {
  // default is ON
  if (localStorage.getItem('dnd_ranked_frame') === null) {
    localStorage.setItem('dnd_ranked_frame', 'on');
  }
  setTimeout(applyRankedFrame, 150);
})();

function spinNum(id, delta, callback) {
  const el = document.getElementById(id);
  if (!el) return;
  const min = el.min !== '' ? parseFloat(el.min) : -Infinity;
  const max = el.max !== '' ? parseFloat(el.max) : Infinity;
  let val = (parseFloat(el.value) || 0) + delta;
  val = Math.min(max, Math.max(min, val));
  el.value = val;
  el.dispatchEvent(new Event('input', {bubbles: true}));
  if (callback) callback();
}

// ── Add Invocation to Sheet ──
function addInvocationToSheet(idx) {
  const inv = INVOCATION_DB[idx];
  if (!inv) return;
  const desc = [
    inv.prerequisites ? 'Prerequisite: ' + inv.prerequisites : '',
    inv.description || ''
  ].filter(Boolean).join('\n');
  showModal('Add Invocation', `
    <div style="margin-bottom:10px;font-family:'Cinzel',serif;font-size:13px;color:var(--accent-gold);">${inv.name}</div>
    <div class="field"><label>Add as</label>
      <select id="invAddTarget">
        <option value="class">Class Feature (Warlock)</option>
        <option value="feat">Feat / Ability</option>
        <option value="active">Active Ability</option>
      </select>
    </div>
    <div class="field"><label>Popis</label><textarea id="invAddDesc" rows="4">${desc}</textarea></div>
  `, [
    {label:'Zrušiť', action:'closeModal()', cls:'btn-silver'},
    {label:'➕ Add', action:`
      const keyMap = {class:'classFeatures',feat:'feats',active:'activeAbilities'};
      const target = document.getElementById('invAddTarget').value;
      const arrKey = keyMap[target];
      data[arrKey] = data[arrKey] || [];
      data[arrKey].push({
        name: '${inv.name.replace(/'/g,"\\'")}',
        source: '',
        desc: document.getElementById('invAddDesc').value,
        uses: '', recharge: ''
      });
      autoSave(); renderFeatures();
      showToast('${inv.name.replace(/'/g,"\\'")} pridané na sheet!');
      closeModal();
    `, cls:'btn-primary'}
  ]);
}

// ── Add Psionic to Sheet ──
function addPsionicToSheet(idx) {
  const p = PSIONIC_DB[idx];
  if (!p) return;

  let descParts = [];
  if (p.description) descParts.push(p.description);
  if (p.focus) descParts.push('Psychic Focus: ' + p.focus);
  if (p.modes && p.modes.length) {
    p.modes.forEach(m => {
      const costStr = m.cost ? ' (' + m.cost + ')' : '';
      const concStr = m.concentration ? ' [Conc. ' + m.concentration + ']' : '';
      descParts.push('• ' + m.name + costStr + concStr + ': ' + m.description);
    });
  }
  const fullDesc = descParts.join('\n\n');

  const isTalent = p.type === 'T';
  const defaultTarget = isTalent ? 'feat' : 'class';

  showModal('Add Psionic', `
    <div style="margin-bottom:10px;font-family:'Cinzel',serif;font-size:13px;color:var(--accent-gold);">${p.name} <span style="font-size:10px;color:var(--text-muted);">[${isTalent?'Talent':'Discipline'}]</span></div>
    <div class="field"><label>Add as</label>
      <select id="psiAddTarget">
        <option value="class" ${defaultTarget==='class'?'selected':''}>Class Feature (Mystic)</option>
        <option value="feat" ${defaultTarget==='feat'?'selected':''}>Feat / Talent</option>
        <option value="active">Active Ability</option>
      </select>
    </div>
    <div class="field"><label>Popis</label><textarea id="psiAddDesc" rows="6">${fullDesc.replace(/`/g,"'")}</textarea></div>
  `, [
    {label:'Zrušiť', action:'closeModal()', cls:'btn-silver'},
    {label:'➕ Add', action:`
      const keyMap = {class:'classFeatures',feat:'feats',active:'activeAbilities'};
      const target = document.getElementById('psiAddTarget').value;
      const arrKey = keyMap[target];
      data[arrKey] = data[arrKey] || [];
      data[arrKey].push({
        name: '${p.name.replace(/'/g,"\\'")}',
        source: '',
        desc: document.getElementById('psiAddDesc').value,
        uses: '', recharge: ''
      });
      autoSave(); renderFeatures();
      showToast('${p.name.replace(/'/g,"\\'")} pridané na sheet!');
      closeModal();
    `, cls:'btn-primary'}
  ]);
}


// ── Custom Theme ──
function applyCustomTheme() {
  const get = id => document.getElementById(id)?.value || '';
  const bgDark   = get('cpBgDark');
  const bgPanel  = get('cpBgPanel');
  const bgCard   = get('cpBgCard');
  const acGold   = get('cpAccentGold');
  const acBright = get('cpAccentBright');
  const acRed    = get('cpAccentRed');
  const txtPri   = get('cpTextPrimary');
  const txtSec   = get('cpTextSecondary');
  const border   = get('cpBorderGold');
  // Derive missing vars from the picked colors
  const b = document.body;
  b.setAttribute('data-theme','custom');
  const s = b.style;
  // backgrounds
  s.setProperty('--bg-deepest', shadeHex(bgDark, -0.2));
  s.setProperty('--bg-dark',    bgDark);
  s.setProperty('--bg-mid',     shadeHex(bgDark, 0.15));
  s.setProperty('--bg-panel',   bgPanel);
  s.setProperty('--bg-card',    bgCard);
  s.setProperty('--bg-input',   shadeHex(bgDark, 0.08));
  // borders
  s.setProperty('--border-dark',       shadeHex(border, -0.3));
  s.setProperty('--border-mid',        shadeHex(border, -0.1));
  s.setProperty('--border-gold',       border);
  s.setProperty('--border-gold-bright',acBright);
  // accents
  s.setProperty('--accent-gold',        acGold);
  s.setProperty('--accent-gold-bright', acBright);
  s.setProperty('--accent-amber',       shadeHex(acGold, -0.2));
  s.setProperty('--accent-red',         shadeHex(acRed, -0.3));
  s.setProperty('--accent-red-bright',  acRed);
  s.setProperty('--accent-crimson',     shadeHex(acRed, -0.4));
  s.setProperty('--accent-silver',      shadeHex(txtSec, -0.1));
  // text
  s.setProperty('--text-primary',   txtPri);
  s.setProperty('--text-secondary', txtSec);
  s.setProperty('--text-muted',     shadeHex(txtSec, -0.3));
  s.setProperty('--text-gold',      acGold);
  s.setProperty('--text-red',       acRed);
  // tabs
  s.setProperty('--tab-active',   bgPanel);
  s.setProperty('--tab-inactive', bgDark);
  // shadow
  const rgb = hexToRgb(acGold);
  s.setProperty('--shadow-gold', `0 0 20px rgba(${rgb},0.18)`);
  // save
  const saved = {bgDark,bgPanel,bgCard,acGold,acBright,acRed,txtPri,txtSec,border};
  localStorage.setItem('dnd_custom_theme', JSON.stringify(saved));
  localStorage.setItem('dnd_theme','custom');
  // update active button indicator
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  // Reset clock marks so they redraw with new theme colors
  setTimeout(() => {
    const cm = document.getElementById('clockMarks');
    const qm = document.getElementById('qtMarks');
    if (cm) cm.innerHTML = '';
    if (qm) qm.innerHTML = '';
    updateClock();
  }, 30);
}

function loadCustomThemeValues() {
  try {
    const saved = JSON.parse(localStorage.getItem('dnd_custom_theme') || 'null');
    if (!saved) return;
    const map = {cpBgDark:'bgDark',cpBgPanel:'bgPanel',cpBgCard:'bgCard',cpAccentGold:'acGold',cpAccentBright:'acBright',cpAccentRed:'acRed',cpTextPrimary:'txtPri',cpTextSecondary:'txtSec',cpBorderGold:'border'};
    Object.entries(map).forEach(([elId, key]) => {
      const el = document.getElementById(elId);
      if (el && saved[key]) el.value = saved[key];
    });
  } catch(e) {}
}

function resetCustomTheme() {
  const defaults = {cpBgDark:'#110e09',cpBgPanel:'#201a12',cpBgCard:'#261f15',cpAccentGold:'#d4a843',cpAccentBright:'#f0c060',cpAccentRed:'#c0392b',cpTextPrimary:'#e8dcc8',cpTextSecondary:'#b8a888',cpBorderGold:'#8a6a28'};
  Object.entries(defaults).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.value=val; });
  applyCustomTheme();
}

function shadeHex(hex, amount) {
  // amount: -1 to 1 (negative = darker, positive = lighter)
  try {
    let r = parseInt(hex.slice(1,3),16);
    let g = parseInt(hex.slice(3,5),16);
    let b = parseInt(hex.slice(5,7),16);
    if (amount > 0) {
      r = Math.round(r + (255-r)*amount);
      g = Math.round(g + (255-g)*amount);
      b = Math.round(b + (255-b)*amount);
    } else {
      r = Math.round(r * (1+amount));
      g = Math.round(g * (1+amount));
      b = Math.round(b * (1+amount));
    }
    r = Math.max(0,Math.min(255,r));
    g = Math.max(0,Math.min(255,g));
    b = Math.max(0,Math.min(255,b));
    return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  } catch(e) { return hex; }
}

function hexToRgb(hex) {
  try {
    const r=parseInt(hex.slice(1,3),16);
    const g=parseInt(hex.slice(3,5),16);
    const b=parseInt(hex.slice(5,7),16);
    return r+','+g+','+b;
  } catch(e) { return '180,130,40'; }
}

// ── Portrait Resize, Fit & Drag-to-Pan ──
(function() {
  var STORAGE_KEY_H   = 'dnd_portrait_height';
  var STORAGE_KEY_FIT = 'dnd_portrait_fit';
  var STORAGE_KEY_POS = 'dnd_portrait_pos';

  function getContainer() { return document.getElementById('photoContainer'); }
  function getRoot()      { return document.documentElement; }

  function applyHeight(h) {
    getRoot().style.setProperty('--portrait-height', h + 'px');
    localStorage.setItem(STORAGE_KEY_H, h);
  }
  function applyFit(fit) {
    getRoot().style.setProperty('--portrait-fit', fit);
    localStorage.setItem(STORAGE_KEY_FIT, fit);
    var btn = document.getElementById('portraitFitBtn');
    if (btn) btn.textContent = fit === 'cover' ? '⛶' : '⛶';
    btn && (btn.title = fit === 'cover' ? 'Aktuálne: Fill — klikni pre Contain' : 'Aktuálne: Contain — klikni pre Fill');
    btn && (btn.style.color = fit === 'cover' ? '' : 'var(--accent-gold-bright)');
  }
  function applyPos(px, py) {
    getRoot().style.setProperty('--portrait-pos-x', px);
    getRoot().style.setProperty('--portrait-pos-y', py);
    localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({x:px,y:py}));
    // Also persist into data object if available
    if (typeof data !== 'undefined') {
      data.photoPos = {x:px, y:py};
    }
  }

  // Load saved values
  window.addEventListener('DOMContentLoaded', function() {
    var savedH   = localStorage.getItem(STORAGE_KEY_H);
    var savedFit = localStorage.getItem(STORAGE_KEY_FIT);
    var savedPos = localStorage.getItem(STORAGE_KEY_POS);
    if (savedH)   getRoot().style.setProperty('--portrait-height', savedH + 'px');
    if (savedFit) applyFit(savedFit);
    if (savedPos) {
      try {
        var p = JSON.parse(savedPos);
        if (p && p.x && p.y) {
          getRoot().style.setProperty('--portrait-pos-x', p.x);
          getRoot().style.setProperty('--portrait-pos-y', p.y);
        }
      } catch(e) {}
    }

    // ── Setup resize drag (bottom handle) ──
    var handle = document.getElementById('portraitResizeHandle');
    if (handle) {
      var startY = 0, startH = 0, resizeDragging = false;

      handle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        e.preventDefault();
        resizeDragging = true;
        startY = e.clientY;
        var c = getContainer();
        startH = c ? c.getBoundingClientRect().height : 260;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ns-resize';
      });
      document.addEventListener('mousemove', function(e) {
        if (!resizeDragging) return;
        var delta = e.clientY - startY;
        var newH = Math.min(600, Math.max(120, startH + delta));
        applyHeight(Math.round(newH));
      });
      document.addEventListener('mouseup', function() {
        if (!resizeDragging) return;
        resizeDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      });
      handle.addEventListener('touchstart', function(e) {
        e.stopPropagation(); e.preventDefault();
        resizeDragging = true;
        startY = e.touches[0].clientY;
        var c = getContainer();
        startH = c ? c.getBoundingClientRect().height : 260;
      }, {passive: false});
      document.addEventListener('touchmove', function(e) {
        if (!resizeDragging) return;
        var delta = e.touches[0].clientY - startY;
        var newH = Math.min(600, Math.max(120, startH + delta));
        applyHeight(Math.round(newH));
      }, {passive: true});
      document.addEventListener('touchend', function() { resizeDragging = false; });
    }

    // ── Setup drag-to-pan on photo ──
    var container = getContainer();
    if (!container) return;

    var panDragging = false;
    var panStartX = 0, panStartY = 0;
    // Current position in percent
    var curX = 50, curY = 20;

    function initPosFromCSS() {
      var px = getComputedStyle(getRoot()).getPropertyValue('--portrait-pos-x').trim() || '50%';
      var py = getComputedStyle(getRoot()).getPropertyValue('--portrait-pos-y').trim() || '20%';
      curX = parseFloat(px) || 50;
      curY = parseFloat(py) || 20;
    }

    container.addEventListener('mousedown', function(e) {
      // Only drag when image is loaded; ignore handle, fit btn, overlay btns
      var img = document.getElementById('characterPhoto');
      if (!img || img.style.display === 'none') return;
      if (e.target.classList.contains('portrait-fit-btn') ||
          e.target.id === 'portraitFitBtn' ||
          e.target.classList.contains('portrait-resize-handle') ||
          e.target.classList.contains('portrait-hover-btn') ||
          e.target.closest('.portrait-hover-overlay') ||
          e.target.id === 'portraitResizeHandle') return;

      e.preventDefault();
      e.stopPropagation();
      panDragging = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      initPosFromCSS();
      container.classList.add('drag-active');
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
      if (!panDragging) return;
      var c = getContainer();
      var rect = c.getBoundingClientRect();
      // Sensitivity: 1px mouse = ~0.15% position shift (feels natural)
      var dx = (e.clientX - panStartX) / rect.width  * -12;
      var dy = (e.clientY - panStartY) / rect.height * -12;
      var nx = Math.min(100, Math.max(0, curX + dx));
      var ny = Math.min(100, Math.max(0, curY + dy));
      getRoot().style.setProperty('--portrait-pos-x', nx.toFixed(1) + '%');
      getRoot().style.setProperty('--portrait-pos-y', ny.toFixed(1) + '%');
    });

    document.addEventListener('mouseup', function(e) {
      if (!panDragging) return;
      panDragging = false;
      getContainer().classList.remove('drag-active');
      document.body.style.userSelect = '';
      // Save final position
      var px = getComputedStyle(getRoot()).getPropertyValue('--portrait-pos-x').trim();
      var py = getComputedStyle(getRoot()).getPropertyValue('--portrait-pos-y').trim();
      applyPos(px, py);
      if (typeof autoSave === 'function') autoSave();
    });

    // Touch pan
    container.addEventListener('touchstart', function(e) {
      var img = document.getElementById('characterPhoto');
      if (!img || img.style.display === 'none') return;
      if (e.target.closest('.portrait-hover-overlay') ||
          e.target.id === 'portraitResizeHandle') return;
      panDragging = true;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      initPosFromCSS();
      container.classList.add('drag-active');
    }, {passive: true});

    document.addEventListener('touchmove', function(e) {
      if (!panDragging) return;
      var c = getContainer();
      var rect = c.getBoundingClientRect();
      var dx = (e.touches[0].clientX - panStartX) / rect.width  * -12;
      var dy = (e.touches[0].clientY - panStartY) / rect.height * -12;
      var nx = Math.min(100, Math.max(0, curX + dx));
      var ny = Math.min(100, Math.max(0, curY + dy));
      getRoot().style.setProperty('--portrait-pos-x', nx.toFixed(1) + '%');
      getRoot().style.setProperty('--portrait-pos-y', ny.toFixed(1) + '%');
    }, {passive: true});

    document.addEventListener('touchend', function() {
      if (!panDragging) return;
      panDragging = false;
      getContainer().classList.remove('drag-active');
      var px = getComputedStyle(getRoot()).getPropertyValue('--portrait-pos-x').trim();
      var py = getComputedStyle(getRoot()).getPropertyValue('--portrait-pos-y').trim();
      applyPos(px, py);
      if (typeof autoSave === 'function') autoSave();
    });
  });

  // Exposed globals
  window.togglePortraitFit = function(e) {
    e.stopPropagation();
    var current = localStorage.getItem(STORAGE_KEY_FIT) || 'cover';
    applyFit(current === 'cover' ? 'contain' : 'cover');
  };
  window.handlePhotoClick = function(e) {
    // Only trigger file upload if not clicking on interactive children and no photo loaded (drag handles it when photo present)
    if (e.target.classList.contains('portrait-fit-btn') ||
        e.target.classList.contains('portrait-resize-handle') ||
        e.target.closest('.portrait-hover-overlay') ||
        e.target.id === 'portraitFitBtn' ||
        e.target.id === 'portraitResizeHandle' ||
        e.target.id === 'portraitDragHint') return;
    // If image is loaded, clicks are handled by drag (mousedown/mouseup), don't open file picker
    var img = document.getElementById('characterPhoto');
    if (img && img.style.display !== 'none') return;
    document.getElementById('photoInput').click();
  };
})();

// ── Calendar swipe-to-change-month ──
(function() {
  var swipeStartX = 0, swipeStartY = 0, swipeMoved = false;
  document.addEventListener('DOMContentLoaded', function() {
    var wrap = document.getElementById('calendarGridWrap');
    if (!wrap) return;
    wrap.addEventListener('touchstart', function(e) {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
      swipeMoved = false;
    }, {passive: true});
    wrap.addEventListener('touchmove', function(e) {
      swipeMoved = true;
    }, {passive: true});
    wrap.addEventListener('touchend', function(e) {
      if (!swipeMoved) return;
      var dx = e.changedTouches[0].clientX - swipeStartX;
      var dy = e.changedTouches[0].clientY - swipeStartY;
      // Only horizontal swipe (dx dominant, min 40px)
      if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 40) {
        if (dx < 0) changeMonth(1);
        else changeMonth(-1);
      }
    }, {passive: true});

    // Holiday collapse arrow toggle
    var det = document.getElementById('holidaysCollapse');
    var arr = document.getElementById('holidaysArrow');
    if (det && arr) {
      det.addEventListener('toggle', function() {
        arr.textContent = det.open ? '▲' : '▼';
      });
    }
  });
})();

