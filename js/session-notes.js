// ═══════════════════════════════════════════
//  session-notes.js v3
//  • Save  = journal only
//  • Classify → preview → Save all
//  • Lemmatization: Silas/Silasa/Silasovi → one NPC
//  • Context: town vs NPC vs item vs animal
// ═══════════════════════════════════════════

var sessionNotesLocked = false;

// ── Panel controls ──────────────────────────────────────
function toggleSessionNotesPanel() {
  var panel = document.getElementById('sessionNotesPanel');
  if (!panel) return;
  var wasOpen = panel.classList.contains('open');
  panel.classList.toggle('open');
  if (!wasOpen) { snInit(); }
  if (typeof repositionPanels === 'function') repositionPanels();
}
function toggleSessionNotesLock() {
  sessionNotesLocked = !sessionNotesLocked;
  var btn = document.getElementById('snLockBtn');
  if (btn) {
    btn.textContent = sessionNotesLocked ? '🔒' : '🔓';
    btn.title = sessionNotesLocked ? 'Unlock panel' : 'Lock panel';
    btn.style.opacity = sessionNotesLocked ? '1' : '0.6';
  }
  if (typeof repositionPanels === 'function') repositionPanels();
}
document.addEventListener('click', function(e) {
  var panel = document.getElementById('sessionNotesPanel');
  var wrapper = document.getElementById('sessionNotesWrapper');
  if (!panel || !panel.classList.contains('open') || sessionNotesLocked) return;
  var fab = document.getElementById('fabMenu');
  if (fab && fab.contains(e.target)) return;
  if (wrapper && !wrapper.contains(e.target)) {
    panel.classList.remove('open');
    if (typeof repositionPanels === 'function') repositionPanels();
  }
});
function snInit() {
  var dateEl = document.getElementById('snSessionDate');
  if (dateEl && !dateEl.value) {
    var today = new Date();
    dateEl.value = today.toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric' });
  }
}

// ── Lemmatizer ────────────────────────────────────────
// Slovak case suffixes (longest first)
var SK_SUFFIXES = [
  // Common word suffixes for lemmatization (stemming)
  'ových','ovou','ovia','ovic','ového','ovym','ovom','ovi','ova','ove',
  'och','ach','iam','ami','iach','om','ou','ov','us','is','as','es',
  'e','a','i','y','u'
];
function skLemma(word) {
  if (!word || word.length < 4) return word.toLowerCase();
  var w = word.toLowerCase();
  for (var s = 0; s < SK_SUFFIXES.length; s++) {
    var suf = SK_SUFFIXES[s];
    if (w.endsWith(suf) && w.length - suf.length >= 3) return w.slice(0, w.length - suf.length);
  }
  return w;
}
function skTokensMatch(a, b) {
  if (a === b) return true;
  var la = skLemma(a), lb = skLemma(b);
  if (la === lb) return true;
  if (la.length >= 3 && lb.startsWith(la)) return true;
  if (lb.length >= 3 && la.startsWith(lb)) return true;
  return false;
}
function skNormalize(phrase) {
  return phrase.toLowerCase().split(/[\s,\/\-"']+/)
    .filter(function(t) { return t.length >= 3; }).map(skLemma);
}

// ── Entity signals ──────────────────────────────────────
var ENTITY_SIGNALS = {
  animal: ['dog','cat','horse','snake','wolf','bear','eagle','raven','deer','fox',
    'krysa','netopier','drak','griffon','wyvern','hydra','basilisk',
    'dog','cat','horse','snake','wolf','bear','eagle','raven','deer','fox',
    'rat','bat','dragon','spider','scorpion','boar','hawk','owl','toad',
    'animal','beast','herd','pack','creature','beast','animal','monster'],
  item: ['sword','shield','armor','bow','arrows','dagger','staff','ring','amulet',
    'potion','scroll','key','chest','box',
    'sword','shield','armor','bow','arrows','dagger','staff','ring','amulet',
    'potion','scroll','key','chest','box','magical','enchanted','item',
    'armor','artifact','artifact','relic','cursed','cursed','blessed'],
  place_strong: ['arrived in','arrived at','we arrived in','we reached','we entered',
    'arrived in','arrived at','entered the','we entered','we arrived',
    'city of','town of','village of','port of',
    'smrad z','reeks of','stinks like','smells like']
};

// ── Category keywords ──────────────────────────────────────
var SN_KEYWORDS = {
  location: [
    'city','town','village','settlement','castle','fortress','tower','temple',
    'cave','dungeon','cell','tomb','ruins','harbor','lighthouse',
    'tavern','inn','market','square','street','district','outskirts',
    'forest','mountain','river','lake','sea','bay','lagoon','cliffs','island',
    'road','bridge','tunnel','gate','ramparts','walls','estate','palace',
    'monastery','chapel','cemetery','cellar','warehouse','dock',
    'city','town','village','hamlet','settlement','outpost','fort','keep',
    'fortress','castle','tower','temple','shrine','cave','cavern','crypt',
    'tomb','ruins','harbor','port','lighthouse','tavern','inn','market',
    'plaza','district','forest','mountain','river','lake','sea','bay',
    'lagoon','cliffs','island','road','bridge','tunnel','gate','walls',
    'palace','manor','estate','monastery','chapel','cemetery','graveyard',
    'warehouse','docks','shipyard',
    'located','situated','lies','stands','surrounded','overlooking','nestled',
    'known for','notorious','infamous',
    'ruined','abandoned','haunted','cursed',
    'smells','stinks','reeks','noise','silence','darkness','fog','smoke'
  ],
  player: [
    'our party','our team','our group','our crew',
    'party','group','team','companion','ally','fellow','adventurer',
    'character','player','hero',
    'attacked','defended','saved','healed','killed','cast','used',
    'backstory','arc','character arc','motivation','flaw','bond',
    'joined','left','stayed','volunteered','refused'
  ],
  npc: [
    'merchant','king','queen','guard','priest','thief','knight','wizard',
    'innkeeper','murderer','boss','captain','commander','lord','lady',
    'duke','baron','villain','shopkeeper','blacksmith','healer','sage',
    'elder','chief','mayor','sheriff','sailor','pirate','ranger','hunter',
    'assassin','spy','scholar','alchemist','druid','cleric','paladin',
    'warlock','rogue','bard','monk','sorcerer',
    'said','told','asked','warned','offered','gave','hired','mentioned',
    'spoke to','talked to','whispered','shouted',
    'beard','scar','glass eye','cloak','armor',
    'smells of','reeks of',
    'seems nervous',
    'known as','called','alias',
    'obchodnik','kral','kralovna','strazca','knaz','zlodej','rytier',
    'sprievodca','hostinsky','vrah','kapitan','velitel','velitelka',
    'master','mayor','judge','guard','blacksmith','healer',
    'sailor','pirate','pirate','sorceress','hunter','hunter',
    'priest','priestess','shaman','bandit'
  ],
  quest: [
    'quest','task','mission','objective','reward','deliver','rescue',
    'find','bring','kill','investigate','complete',
    'warning','condition','note','must not','must','need to','have to',
    'goal','target','destination',
    'gp','gold','silver','coins',
    'wreck','shipwreck','ruins','vault',
    'map','treasure','hidden',
    'uloha','misia','zadanie','odmena','najdi','prines','zachran',
    'zabi','preskumaj','splnit','dorucit','nesmieme','nesmie',
    'condition','attention','warning','we must','I must','need to',
    'ciel','zlate','vrak','mapa','poklad','skryty'
  ],
  lore: [
    'history','legend','myth','prophecy','ancient',
    'realm','kingdom','empire',
    'faction','organization','guild','order','religion','god','deity',
    'artifact','ritual','arcane','divine','primal',
    'founded','built','ruled','centuries',
    'world','land',
    'historia','legenda','prorocstvo','mytus','starodavny','existoval',
    'centuries','world','land'
  ],
  general: []
};

// ── Live Index ───────────────────────────────────────────
function snBuildLiveIndex() {
  var idx = { npc: [], player: [], location: [] };
  (data.npcs || []).forEach(function(npc, i) {
    var lemmas = [];
    [npc.name, npc.role, npc.nickname, npc.alias, npc.keywords].forEach(function(v) {
      if (v) skNormalize(v).forEach(function(l) { lemmas.push(l); });
    });
    if (lemmas.length) idx.npc.push({ lemmas: lemmas, label: npc.name || '', idx: i });
  });
  (data.playerNotes || []).forEach(function(pn, i) {
    var lemmas = [];
    [pn.name, pn.player, pn.class, pn.keywords].forEach(function(v) {
      if (v) skNormalize(v).forEach(function(l) { lemmas.push(l); });
    });
    if (lemmas.length) idx.player.push({ lemmas: lemmas, label: pn.name || pn.player || '', idx: i });
  });
  (data.loreNotes || []).forEach(function(ln, i) {
    if (ln.category !== 'Location') return;
    var lemmas = [];
    [ln.title, ln.region].forEach(function(v) {
      if (v) skNormalize(v).forEach(function(l) { lemmas.push(l); });
    });
    if (lemmas.length) idx.location.push({ lemmas: lemmas, label: ln.title || '', idx: i });
  });
  return idx;
}
function snIndexMatch(lineLow, entryLemmas) {
  var ll = skNormalize(lineLow);
  return entryLemmas.some(function(el) { return ll.some(function(l) { return skTokensMatch(l, el); }); });
}
function snMatchKnownNPCs(line)      { var idx=snBuildLiveIndex(); return idx.npc.filter(function(e){return snIndexMatch(line.toLowerCase(),e.lemmas);}); }
function snMatchKnownPlayers(line)   { var idx=snBuildLiveIndex(); return idx.player.filter(function(e){return snIndexMatch(line.toLowerCase(),e.lemmas);}); }
function snMatchKnownLocations(line) { var idx=snBuildLiveIndex(); return idx.location.filter(function(e){return snIndexMatch(line.toLowerCase(),e.lemmas);}); }
function snGetRecognisedNames() {
  var idx = snBuildLiveIndex();
  return idx.npc.map(function(e){return{label:e.label,type:'npc'};})
    .concat(idx.player.map(function(e){return{label:e.label,type:'player'};}));
}
function snGetRecognisedLocations() {
  return (data.loreNotes||[]).filter(function(ln){return ln.category==='Location'&&ln.title;})
    .map(function(ln){return{label:ln.title};});
}

// ── Proper names (contextual, filters animals/items) ─
var NAME_BL = {'Quest':1,'Stretnutie':1,'Ciel':1,'Odmena':1,'Pozor':1,'Varovanie':1,
  'Podmienka':1,'Prichod':1,'Vyrazit':1,'Mesto':1,'Mestecko':1,'Dedina':1,'Osada':1,
  'Pevnost':1,'Hrobka':1,'Pristav':1,'Jaskyna':1,'Dungeon':1,'Ruiny':1,'Krcma':1,
  'Majak':1,'Sever':1,'Juh':1,'Vychod':1,'Zapad':1,'The':1,'And':1,'But':1,'For':1,
  'With':1,'This':1,'That':1,'There':1,'Forest':1,'Mountain':1,'River':1,'Temple':1,
  'Castle':1,'Ruins':1,'Harbor':1,'Tower':1,'Morska':1,'Morsky':1};

function snExtractNPCNamesFromLine(line, lineLow) {
  var low = lineLow || line.toLowerCase();
  var isItem   = ENTITY_SIGNALS.item.some(function(w){return low.includes(w);});
  var isAnimal = ENTITY_SIGNALS.animal.some(function(w){return low.includes(w);});
  var isPlace  = ENTITY_SIGNALS.place_strong.some(function(w){return low.includes(w);});
  var hasNPC   = SN_KEYWORDS.npc.some(function(w){return low.includes(w);});
  if ((isItem||isAnimal)&&!hasNPC) return [];
  if (isPlace&&!hasNPC) return [];

  var names=[]; var m;
  // Pattern 1: Name "Nickname"
  var re1=/([A-Z][a-z]+)\s+"([^"]+)"/g;
  while((m=re1.exec(line))!==null) if(!NAME_BL[m[1]]) names.push({name:m[1]+' "'+m[2]+'"',canonical:m[1],nickname:m[2]});
  // Pattern 2: Two capitalized words
  var re2=/\b([A-Z][a-z]{1,})\s+([A-Z][a-z]{2,})\b/g;
  while((m=re2.exec(line))!==null) {
    if(!NAME_BL[m[1]]&&!NAME_BL[m[2]]&&!names.some(function(n){return n.canonical===m[1];}))
      names.push({name:m[1]+' '+m[2],canonical:m[1],nickname:null});
  }
  // Pattern 3: Name after an interaction verb
  var re3=/(?:met|encountered|meeting with|spoke with|spoke with|said|said|told|met|spoke(?:\s+to)?|talked(?:\s+to)?|warned|hired|asked)\s+([A-Z][a-z]{2,})/g;
  while((m=re3.exec(line))!==null) {
    if(!NAME_BL[m[1]]&&!names.some(function(n){return skTokensMatch(n.canonical,m[1]);}))
      names.push({name:m[1],canonical:m[1],nickname:null});
  }
  return names;
}

// ── Session Entity Map — declension deduplication ────────
function snBuildSessionEntityMap(lines) {
  var map = {};
  lines.forEach(function(line) {
    var low = line.toLowerCase();
    snExtractNPCNamesFromLine(line, low).forEach(function(e) {
      var lemma = skLemma(e.canonical);
      var found = null;
      Object.keys(map).forEach(function(k){if(!found&&skTokensMatch(k,lemma))found=k;});
      if (found) {
        if(!map[found].lines.includes(line)) map[found].lines.push(line);
        if(e.name.length>map[found].bestName.length) map[found].bestName=e.name;
        if(e.nickname&&!map[found].nickname) map[found].nickname=e.nickname;
      } else {
        map[lemma]={bestName:e.name,canonical:e.canonical,nickname:e.nickname||null,lines:[line]};
      }
    });
  });
  return map;
}

// ── Extraction of place names ─────────────────────────────
function snExtractPlaceNames(line) {
  var low=line.toLowerCase(); var names=[]; var m;
  var re1=/(?:do|na|pri|v|vo|cez|okolo|in|at|to|into|from|near|toward)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g;
  while((m=re1.exec(line))!==null){var c=m[1].split(' ')[0];if(!NAME_BL[c]&&c.length>=4)names.push(m[1]);}
  if(SN_KEYWORDS.location.some(function(w){return low.includes(w);})){
    var SKIP={'Okolo':1,'Oproti':1,'Vedla':1,'Dalej':1,'Blizko':1,'Potom':1,'Predtym':1,'Around':1,'Before':1,'After':1,'Above':1,'Below':1,'Between':1};
    var re2=/\b([A-Z][a-z]{4,})\b/g;
    while((m=re2.exec(line))!==null){
      if(!SKIP[m[1]]&&!NAME_BL[m[1]]&&!names.some(function(n){return n.includes(m[1]);})) names.push(m[1]);
    }
  }
  return names.filter(function(v,i,a){return a.indexOf(v)===i;});
}

// ── Line classification (7 layers) ─────────────────────
function snClassifyLine(line) {
  var low=line.toLowerCase(); var idx=snBuildLiveIndex();
  var isItem  =ENTITY_SIGNALS.item.some(function(w){return low.includes(w);});
  var isAnimal=ENTITY_SIGNALS.animal.some(function(w){return low.includes(w);});
  var isPl    =ENTITY_SIGNALS.place_strong.some(function(w){return low.includes(w);});
  var hasNPC  =SN_KEYWORDS.npc.some(function(w){return low.includes(w);});

  if(idx.player.some(function(e){return snIndexMatch(low,e.lemmas);})) return 'player';
  if(idx.npc.some(function(e){return snIndexMatch(low,e.lemmas);})){
    if(isItem&&!hasNPC) return 'general';
    return 'npc';
  }
  if(idx.location.some(function(e){return snIndexMatch(low,e.lemmas);})) return 'location';
  if(isPl&&!hasNPC) return 'location';

  var extracted=snExtractNPCNamesFromLine(line,low);
  if(extracted.length>0){
    if((isItem||isAnimal)&&!hasNPC) return 'general';
    var hasLoc=SN_KEYWORDS.location.some(function(w){return low.includes(w);});
    var hasQst=SN_KEYWORDS.quest.some(function(w){return low.includes(w);});
    if(hasNPC&&!hasLoc) return 'npc';
    if(hasLoc&&!hasNPC) return 'location';
    if(!hasQst) return 'npc';
  }
  if(snExtractPlaceNames(line).length>0&&SN_KEYWORDS.location.some(function(w){return low.includes(w);})) return 'location';

  var W={npc:2.5,player:2,location:2,quest:1.5,lore:1};
  var S={npc:0,player:0,location:0,quest:0,lore:0};
  Object.keys(SN_KEYWORDS).forEach(function(cat){
    if(cat==='general') return;
    SN_KEYWORDS[cat].forEach(function(w){if(low.includes(w)) S[cat]+=(W[cat]||1);});
  });
  if(isItem||isAnimal) S.npc*=0.3;
  var max=Math.max(S.npc,S.player,S.location,S.quest,S.lore);
  if(max<1.5) return 'general';
  var order=['quest','location','player','npc','lore'];
  for(var i=0;i<order.length;i++){if(S[order[i]]===max) return order[i];}
  return 'general';
}

// ── UI helpers ───────────────────────────────────────────
function snSplitLines(text) {
  return text.split(/\n/).map(function(l){return l.replace(/^[\s\-\*\u2022\u00b7]+/,'').trim();}).filter(function(l){return l.length>1;});
}
function snUpdateCharCount() {
  var ta=document.getElementById('snRawInput'),el=document.getElementById('snCharCount');
  if(ta&&el) el.textContent=ta.value.length+' chars';
}
function snShowInput() {
  var pa=document.getElementById('snPreviewArea'),wa=document.getElementById('snWriteArea'),ar=document.getElementById('snActionsRow');
  if(pa)pa.style.display='none'; if(wa)wa.style.display='block'; if(ar)ar.style.display='flex';
}
function snShowMsg(msg,type) {
  var el=document.getElementById('snResultMsg'); if(!el) return;
  el.style.display='block';
  el.style.background=type==='success'?'rgba(50,120,60,0.2)':'rgba(160,100,20,0.2)';
  el.style.border=type==='success'?'1px solid #3a7a4a':'1px solid #8a6020';
  el.style.color=type==='success'?'#80d090':'#d0a040';
  el.textContent=msg; clearTimeout(el._t);
  el._t=setTimeout(function(){el.style.display='none';},5000);
}
function escSN(str){return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ── Hint ─────────────────────────────────────────────────
function snUpdateRecognisedHint() {
  var hint=document.getElementById('snRecognisedHint');
  if(!hint||typeof data==='undefined') return;
  var ta=document.getElementById('snRawInput'),text=ta?ta.value:'',low=text.toLowerCase();
  var kn=snGetRecognisedNames(),kl=snGetRecognisedLocations();

  if(!text.trim()){
    var all=kn.slice(0,5).concat(kl.slice(0,3).map(function(l){return{label:l.label,type:'location'};}));
    if(!all.length){hint.style.display='none';return;}
    var imap={'npc':'🧙','player':'🎲','location':'🗺️'};
    hint.innerHTML='<span class="sn-hint-label">Recognised:</span> '+all.map(function(n){return'<span class="sn-name-chip sn-chip-'+n.type+'">'+(imap[n.type]||'📌')+' '+n.label+'</span>';}).join('');
    hint.style.display='flex'; return;
  }

  var mNPC=kn.filter(function(n){var l=skNormalize(n.label),ll=skNormalize(low);return l.some(function(a){return ll.some(function(b){return skTokensMatch(a,b);});});});
  var mLoc=kl.filter(function(l){var f=l.label.toLowerCase().split(' ')[0];return f.length>=3&&low.includes(f);});
  var lines=snSplitLines(text),em=snBuildSessionEntityMap(lines);
  var newNPC=Object.values(em).filter(function(e){var cl=skLemma(e.canonical);return!mNPC.some(function(k){return skTokensMatch(skLemma(k.label.split(' ')[0]),cl);});});
  var ap=[];lines.forEach(function(l){snExtractPlaceNames(l).forEach(function(p){if(!ap.includes(p))ap.push(p);});});
  var np=ap.filter(function(p){return!mLoc.some(function(l){return l.label.toLowerCase().includes(p.toLowerCase().split(' ')[0]);});});

  var html='';
  if(mNPC.length) html+='<span class="sn-hint-label">Adding to:</span> '+mNPC.map(function(n){var icon=n.type==='player'?'🎲':'🧙',cls=n.type==='player'?'sn-chip-player':'sn-chip-match';return'<span class="sn-name-chip '+cls+'">'+icon+' '+n.label+' ✓ <span style="font-size:9px;opacity:.7;">+notes</span></span>';}).join('');
  if(mLoc.length) html+=mLoc.map(function(l){return'<span class="sn-name-chip sn-chip-location">🗺️ '+l.label+' ✓ <span style="font-size:9px;opacity:.7;">+lore</span></span>';}).join('');
  if(newNPC.length) html+=(html?'<span class="sn-hint-label" style="margin-left:6px;">New:</span>':'<span class="sn-hint-label">New:</span>')+newNPC.slice(0,4).map(function(e){return'<span class="sn-name-chip" style="border-color:#d0a04066;color:#d0a040;background:#d0a04011;">✨ '+e.bestName+' <span style="font-size:9px;opacity:.7;">NPC</span></span>';}).join('');
  if(np.length) html+=np.slice(0,3).map(function(p){return'<span class="sn-name-chip" style="border-color:#80d0a066;color:#80d0a0;background:#80d0a011;">📍 '+p+' <span style="font-size:9px;opacity:.7;">loc.</span></span>';}).join('');
  if(!html){hint.style.display='none';return;}
  hint.innerHTML=html; hint.style.display='flex';
}

// ── Categories ────────────────────────────────────────────
var SN_CAT={
  npc:     {icon:'🧙',label:'NPC',       color:'#80a0d0'},
  player:  {icon:'🎲',label:'Players',   color:'#80d0a0'},
  quest:   {icon:'📜',label:'Quest',     color:'#d0a040'},
  location:{icon:'🗺️', label:'Location', color:'#d08060'},
  lore:    {icon:'📚',label:'Lore',      color:'#a080d0'},
  general: {icon:'📌',label:'Other',     color:'#80c090'}
};

// ── Classify preview ───────────────────────────────────
var _snDragSrc = null; // currently dragged item element
if(!window._snTitles)   window._snTitles   = {}; // itemText → custom title
if(!window._snAssignTo) window._snAssignTo = {}; // itemText → {type,idx,label}

// Build a flat searchable index of all existing cards, optionally filtered by category type
function snBuildAssignIndex(catFilter) {
  var idx = [];
  // catFilter is the preview category: npc, player, quest, location, lore, general
  var showNPC      = !catFilter || catFilter==='npc';
  var showPlayer   = !catFilter || catFilter==='player';
  // location and lore both live in loreNotes (Lore & World tab) — show all loreNotes for both
  var showLoreTab  = !catFilter || catFilter==='location' || catFilter==='lore';
  var showQuest    = !catFilter || catFilter==='quest';
  var showGeneral  = !catFilter || catFilter==='general';

  if(showNPC)     (data.npcs||[]).forEach(function(c,i){ if(c.name) idx.push({type:'npc',idx:i,label:c.name,sub:c.role||''}); });
  if(showPlayer)  (data.playerNotes||[]).forEach(function(c,i){ if(c.name||c.player) idx.push({type:'player',idx:i,label:c.name||c.player,sub:c.class||''}); });
  if(showLoreTab) {
    (data.loreNotes||[]).forEach(function(c,i){
      if(!c.title) return;
      // Show with correct type so snSaveAll writes to the right field
      var t = c.category==='Location' ? 'location' : 'lore';
      var icon = c.category==='Location' ? '🗺️' : (c.category||'Lore');
      idx.push({type:t, idx:i, label:c.title, sub:icon});
    });
  }
  if(showQuest)   (data.quests||[]).forEach(function(c,i){ if(c.title) idx.push({type:'quest',idx:i,label:c.title,sub:c.status||''}); });
  if(showGeneral) (data.generalNotes||[]).forEach(function(c,i){ if(c.title) idx.push({type:'general',idx:i,label:c.title,sub:''}); });
  return idx;
}

function snAssignSearch(input, item, dropEl, catFilter) {
  var q = input.value.trim().toLowerCase();
  dropEl.innerHTML = '';
  if (!q) { dropEl.style.display='none'; return; }
  var results = snBuildAssignIndex(catFilter).filter(function(e){
    return e.label.toLowerCase().includes(q);
  }).slice(0, 8);
  if (!results.length) {
    dropEl.style.display = 'none';
    return;
  }
  var catIcon = {npc:'🧙',player:'🎲',location:'🗺️',quest:'📜',lore:'📚',general:'📌'};
  results.forEach(function(e) {
    var opt = document.createElement('div');
    opt.className = 'sn-assign-opt';
    opt.innerHTML = '<span style="opacity:.6;font-size:11px;margin-right:4px;">'+(catIcon[e.type]||'📌')+'</span>'
      + '<strong style="font-size:12px;">'+escSN(e.label)+'</strong>'
      + (e.sub ? '<span style="opacity:.5;font-size:11px;margin-left:5px;">'+escSN(e.sub)+'</span>' : '');
    opt.addEventListener('mousedown', function(ev) {
      ev.preventDefault();
      window._snAssignTo[item] = {type:e.type, idx:e.idx, label:e.label};
      input.value = e.label;
      dropEl.style.display = 'none';
      // Show assigned badge next to input
      var badge = input.parentElement.querySelector('.sn-assign-badge');
      if (badge) { badge.textContent = '→ '+e.label; badge.style.display='inline'; }
    });
    dropEl.appendChild(opt);
  });
  dropEl.style.display = 'block';
}

function snClearAssign(item, input, dropEl, badge) {
  delete window._snAssignTo[item];
  input.value = '';
  dropEl.style.display = 'none';
  if (badge) badge.style.display = 'none';
}

function snClassifyPreview() {
  var ta=document.getElementById('snRawInput');
  if(!ta||!ta.value.trim()){snShowMsg('⚠ Write some notes first!','warn');return;}
  var lines=snSplitLines(ta.value);
  if(!lines.length){snShowMsg('⚠ No lines found.','warn');return;}
  var g={npc:[],player:[],quest:[],location:[],lore:[],general:[]};
  lines.forEach(function(l){var c=snClassifyLine(l);g[c]=g[c]||[];g[c].push(l);});
  window._snClassified=g;
  window._snTitles={};
  window._snAssignTo={};
  window._snSectionOpen={};
  snRenderPreview();
  var pa=document.getElementById('snPreviewArea'),wa=document.getElementById('snWriteArea'),ar=document.getElementById('snActionsRow');
  if(pa)pa.style.display='block'; if(wa)wa.style.display='none'; if(ar)ar.style.display='none';
}

function snRenderPreview() {
  var listEl=document.getElementById('snPreviewList');
  if(!listEl||!window._snClassified) return;
  // Preserve open/closed state across re-renders
  if(!window._snSectionOpen) window._snSectionOpen={};
  listEl.innerHTML='';
  var cats=['player','npc','quest','location','lore','general'];
  cats.forEach(function(cat){
    var items=window._snClassified[cat]||[]; if(!items.length) return;
    var info=SN_CAT[cat];
    var isOpen=window._snSectionOpen[cat]===true; // default closed

    var sec=document.createElement('div');
    sec.className='sn-preview-section';
    sec.setAttribute('data-cat',cat);

    var catDiv=document.createElement('div');
    catDiv.className='sn-preview-cat';
    catDiv.setAttribute('data-cat',cat);
    catDiv.style.cssText='color:'+info.color+';cursor:pointer;user-select:none;display:flex;align-items:center;gap:6px;';
    catDiv.innerHTML=
      '<span class="sn-sec-chevron" style="font-size:9px;transition:transform .15s;display:inline-block;opacity:.6;'+(isOpen?'transform:rotate(90deg)':'')+'">'+'▶'+'</span>'
      +' '+info.icon+' '+info.label
      +' <span class="sn-sec-count" style="color:var(--text-muted);font-size:10px;">('+items.length+')</span>';

    var chevron=catDiv.querySelector('.sn-sec-chevron');
    var body=document.createElement('div');
    body.className='sn-preview-body';
    body.style.display=isOpen?'block':'none';

    catDiv.addEventListener('click',function(){
      var open=body.style.display==='none';
      body.style.display=open?'block':'none';
      chevron.style.transform=open?'rotate(90deg)':'';
      window._snSectionOpen[cat]=open;
    });

    sec.appendChild(catDiv);
    sec.appendChild(body);

    items.forEach(function(item){
      var opts=cats.map(function(c){return'<option value="'+c+'"'+(c===cat?' selected':'')+'>'+ SN_CAT[c].icon+' '+SN_CAT[c].label+'</option>';}).join('');
      var savedTitle=window._snTitles[item]||'';

      var row=document.createElement('div');
      row.className='sn-preview-item sn-preview-item-col';
      row.setAttribute('data-cat',cat);
      row.setAttribute('data-text',item);
      row.setAttribute('draggable','true');

      // Title row
      var titleRow=document.createElement('div');
      titleRow.className='sn-item-title-row';
      var titleInput=document.createElement('input');
      titleInput.type='text';
      titleInput.className='sn-item-title-input';
      titleInput.placeholder='Card name (optional)…';
      titleInput.value=savedTitle;
      titleInput.addEventListener('input',function(){
        window._snTitles[item]=titleInput.value;
      });
      // Stop drag when typing in input
      titleInput.addEventListener('mousedown',function(e){e.stopPropagation();});
      titleRow.appendChild(titleInput);
      row.appendChild(titleRow);

      // Assign-to row (search existing cards)
      var assignRow=document.createElement('div');
      assignRow.className='sn-assign-row';
      assignRow.style.cssText='position:relative;display:flex;align-items:center;gap:6px;margin:3px 0 4px;';

      var assignInput=document.createElement('input');
      assignInput.type='text';
      assignInput.className='sn-assign-input';
      assignInput.placeholder='Add to existing card…';
      assignInput.style.cssText='flex:1;font-size:11px;padding:3px 7px;height:24px;opacity:.75;';
      var existingAssign=window._snAssignTo[item];
      if(existingAssign) assignInput.value=existingAssign.label;

      var assignBadge=document.createElement('span');
      assignBadge.className='sn-assign-badge';
      assignBadge.style.cssText='font-size:10px;color:#80a0d0;display:'+(existingAssign?'inline':'none')+';white-space:nowrap;';
      assignBadge.textContent=existingAssign?('→ '+existingAssign.label):'';

      var assignClear=document.createElement('button');
      assignClear.type='button';
      assignClear.textContent='✕';
      assignClear.title='Clear assignment';
      assignClear.style.cssText='font-size:10px;padding:1px 5px;height:20px;opacity:.5;display:'+(existingAssign?'inline':'none')+';';

      var assignDrop=document.createElement('div');
      assignDrop.className='sn-assign-dropdown';
      assignDrop.style.cssText='display:none;position:absolute;top:26px;left:0;right:0;background:var(--color-background-primary,#1a1a1a);border:0.5px solid var(--color-border-secondary,#444);border-radius:6px;z-index:999;max-height:180px;overflow-y:auto;box-shadow:0 4px 12px rgba(0,0,0,.25);';

      assignInput.addEventListener('input',function(){
        snAssignSearch(assignInput,item,assignDrop,cat);
        if(!assignInput.value){ snClearAssign(item,assignInput,assignDrop,assignBadge); assignClear.style.display='none'; }
      });
      assignInput.addEventListener('focus',function(){
        if(assignInput.value) snAssignSearch(assignInput,item,assignDrop,cat);
      });
      assignInput.addEventListener('blur',function(){
        setTimeout(function(){assignDrop.style.display='none';},150);
      });
      assignInput.addEventListener('mousedown',function(e){e.stopPropagation();});
      assignClear.addEventListener('click',function(){
        snClearAssign(item,assignInput,assignDrop,assignBadge);
        assignClear.style.display='none';
      });
      assignDrop.addEventListener('mousedown',function(){ /* keep open */ });
      // Show clear btn when badge becomes visible (set by mousedown in dropdown)
      var assignObserver=new MutationObserver(function(){
        assignClear.style.display=assignBadge.style.display==='inline'?'inline':'none';
      });
      assignObserver.observe(assignBadge,{attributes:true,attributeFilter:['style']});

      assignRow.appendChild(assignInput);
      assignRow.appendChild(assignBadge);
      assignRow.appendChild(assignClear);
      assignRow.appendChild(assignDrop);
      row.appendChild(assignRow);

      // Content row
      var contentRow=document.createElement('div');
      contentRow.className='sn-item-content-row';
      var handle=document.createElement('span');
      handle.className='sn-drag-handle';
      handle.title='Drag onto another note to merge';
      handle.textContent='⠿';
      var textSpan=document.createElement('span');
      textSpan.className='sn-preview-text';
      textSpan.innerHTML=escSN(item);
      var sel=document.createElement('select');
      sel.className='sn-reclassify';
      sel.innerHTML=opts;
      sel.addEventListener('change',function(){snReclassify(sel);});

      // Delete button — removes item from preview entirely
      var delBtn=document.createElement('button');
      delBtn.type='button';
      delBtn.className='sn-preview-del';
      delBtn.title='Remove from preview';
      delBtn.textContent='🗑';
      delBtn.style.cssText='font-size:12px;padding:1px 4px;opacity:.45;background:none;border:none;cursor:pointer;flex-shrink:0;transition:opacity .15s;';
      delBtn.addEventListener('mouseenter',function(){delBtn.style.opacity='1';});
      delBtn.addEventListener('mouseleave',function(){delBtn.style.opacity='.45';});
      delBtn.addEventListener('click',function(e){
        e.stopPropagation();
        var arr=window._snClassified[cat]||[];
        var pos=arr.indexOf(item); if(pos!==-1) arr.splice(pos,1);
        delete window._snTitles[item];
        delete window._snAssignTo[item];
        snRenderPreview();
      });

      contentRow.appendChild(handle);
      contentRow.appendChild(textSpan);
      contentRow.appendChild(sel);
      contentRow.appendChild(delBtn);
      row.appendChild(contentRow);

      // Drag events
      row.addEventListener('dragstart',function(e){
        if(e.target===titleInput) {e.preventDefault();return;}
        _snDragSrc=row;
        row.classList.add('sn-dragging');
        e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData('text/plain',item);
      });
      row.addEventListener('dragend',function(){
        row.classList.remove('sn-dragging');
        document.querySelectorAll('.sn-preview-item').forEach(function(r){r.classList.remove('sn-drop-target');});
        _snDragSrc=null;
      });
      row.addEventListener('dragover',function(e){
        if(!_snDragSrc||_snDragSrc===row) return;
        e.preventDefault();
        e.dataTransfer.dropEffect='move';
        document.querySelectorAll('.sn-preview-item').forEach(function(r){r.classList.remove('sn-drop-target');});
        row.classList.add('sn-drop-target');
      });
      row.addEventListener('dragleave',function(){
        row.classList.remove('sn-drop-target');
      });
      row.addEventListener('drop',function(e){
        e.preventDefault();
        row.classList.remove('sn-drop-target');
        if(!_snDragSrc||_snDragSrc===row) return;
        var srcText=_snDragSrc.getAttribute('data-text');
        var tgtText=row.getAttribute('data-text');
        var srcCat=_snDragSrc.getAttribute('data-cat');
        var tgtCat=row.getAttribute('data-cat');
        // Keep title of target, discard source title
        if(window._snTitles[srcText]&&!window._snTitles[tgtText]){
          window._snTitles[tgtText]=window._snTitles[srcText];
        }
        delete window._snTitles[srcText];
        var sarr=window._snClassified[srcCat]||[];
        var si=sarr.indexOf(srcText); if(si!==-1) sarr.splice(si,1);
        var tarr=window._snClassified[tgtCat]||[];
        var ti=tarr.indexOf(tgtText);
        var merged=tgtText+'\n· · ·\n'+srcText;
        if(ti!==-1){
          tarr[ti]=merged;
          // Move title key to new merged text
          if(window._snTitles[tgtText]){window._snTitles[merged]=window._snTitles[tgtText];delete window._snTitles[tgtText];}
        }
        snRenderPreview();
        snShowMsg('✓ Merged into one note','success');
      });

      body.appendChild(row);
    });
    listEl.appendChild(sec);
  });
  // Update counts
  listEl.querySelectorAll('.sn-preview-section').forEach(function(sec){
    var cd=sec.querySelector('.sn-preview-cat');
    if(!cd) return;
    var cnt=sec.querySelectorAll('.sn-preview-item').length;
    var sp=cd.querySelector('.sn-sec-count'); if(sp) sp.textContent='('+cnt+')';
  });
}

function snReclassify(sel){
  if(!window._snClassified) return;
  var nCat=sel.value;
  // sel is inside contentRow which is inside row — walk up to find the actual row element
  var row=sel.parentElement;
  while(row && !row.getAttribute('data-text')) row=row.parentElement;
  if(!row) return;
  var oldCat=row.getAttribute('data-cat');
  var itemText=row.getAttribute('data-text');
  if(!oldCat||!itemText||nCat===oldCat) return;
  var arr=window._snClassified[oldCat]||[];
  var pos=arr.indexOf(itemText);
  if(pos!==-1) arr.splice(pos,1);
  window._snClassified[nCat]=window._snClassified[nCat]||[];
  window._snClassified[nCat].push(itemText);
  // Preserve the custom title across reclassify
  // (window._snTitles key is itemText, which doesn't change — no action needed)
  snRenderPreview();
}

// ── SAVE — JOURNAL ONLY ────────────────────────────────
function snSaveJournalOnly() {
  var ta=document.getElementById('snRawInput'),raw=ta?ta.value.trim():'';
  if(!raw){snShowMsg('⚠ Nothing to save!','warn');return;}
  var title=((document.getElementById('snSessionTitle')||{}).value||'').trim();
  var date=((document.getElementById('snSessionDate')||{}).value||'').trim();
  data.journal=data.journal||[];
  data.journal.unshift({title:title||('Session '+(data.journal.length+1)),date:date,content:raw,_open:true});
  if(typeof renderJournal==='function') renderJournal();
  if(typeof autoSave==='function') autoSave();
  snShowMsg('📖 Saved to journal!','success');
  if(ta) ta.value=''; snUpdateCharCount(); window._snClassified=null;
  var stEl=document.getElementById('snSessionTitle'); if(stEl) stEl.value='';
}

// ── SAVE ALL (after preview) ──────────────────────────
function snSaveAll() {
  var ta=document.getElementById('snRawInput'),raw=ta?ta.value.trim():'';
  if(!raw){snShowMsg('⚠ Nothing to save!','warn');return;}
  var title=((document.getElementById('snSessionTitle')||{}).value||'').trim();
  var date=((document.getElementById('snSessionDate')||{}).value||'').trim();
  if(!window._snClassified){
    window._snClassified={npc:[],player:[],quest:[],location:[],lore:[],general:[]};
    snSplitLines(raw).forEach(function(l){var c=snClassifyLine(l);window._snClassified[c]=window._snClassified[c]||[];window._snClassified[c].push(l);});
  }
  var cl=window._snClassified;
  ['npc','player','quest','location','lore','general'].forEach(function(k){cl[k]=cl[k]||[];});
  var counts={};

  // ── Apply manual assign-to overrides ────────────────────
  // For each item that has a forced assignment, merge it now and remove from cl
  var assignMap = window._snAssignTo || {};
  var tag = title ? '['+title+'] ' : '[Session] ';
  Object.keys(assignMap).forEach(function(itemText) {
    var a = assignMap[itemText];
    if(!itemText || !a || a.idx == null) return;
    var merged = false;
    if (a.type === 'npc' && data.npcs && data.npcs[a.idx]) {
      data.npcs[a.idx].notes = (data.npcs[a.idx].notes ? data.npcs[a.idx].notes+'\n\n' : '') + tag + itemText;
      merged = true;
    } else if (a.type === 'player' && data.playerNotes && data.playerNotes[a.idx]) {
      data.playerNotes[a.idx].notes = (data.playerNotes[a.idx].notes ? data.playerNotes[a.idx].notes+'\n\n' : '') + tag + itemText;
      merged = true;
    } else if (a.type === 'location' && data.loreNotes && data.loreNotes[a.idx]) {
      data.loreNotes[a.idx].content = (data.loreNotes[a.idx].content ? data.loreNotes[a.idx].content+'\n\n' : '') + tag + itemText;
      merged = true;
    } else if (a.type === 'quest' && data.quests && data.quests[a.idx]) {
      data.quests[a.idx].desc = (data.quests[a.idx].desc ? data.quests[a.idx].desc+'\n\n' : '') + tag + itemText;
      merged = true;
    } else if (a.type === 'lore' && data.loreNotes && data.loreNotes[a.idx]) {
      data.loreNotes[a.idx].content = (data.loreNotes[a.idx].content ? data.loreNotes[a.idx].content+'\n\n' : '') + tag + itemText;
      merged = true;
    } else if (a.type === 'general' && data.generalNotes && data.generalNotes[a.idx]) {
      data.generalNotes[a.idx].content = (data.generalNotes[a.idx].content ? data.generalNotes[a.idx].content+'\n\n' : '') + tag + itemText;
      merged = true;
    }
    if (merged) {
      // Remove item from all cl arrays so it won't create a new card
      ['npc','player','quest','location','lore','general'].forEach(function(k){
        var arr=cl[k]||[]; var i=arr.indexOf(itemText); if(i!==-1) arr.splice(i,1);
      });
      counts._merged = (counts._merged||0) + 1;
    }
  });

  // Re-render and save anything that was merged above
  if(counts._merged) {
    if(typeof renderNPCs==='function') renderNPCs();
    if(typeof renderPlayerNotes==='function') renderPlayerNotes();
    if(typeof renderLoreNotes==='function') renderLoreNotes();
    if(typeof renderQuests==='function') renderQuests();
    if(typeof renderGeneralNotes==='function') renderGeneralNotes();
    if(typeof autoSave==='function') autoSave();
  }

  // Helper: get custom title for an item text
  var snGetTitle=function(itemText,fallback){
    var t=(window._snTitles&&window._snTitles[itemText])||'';
    return t||fallback;
  };

  // Journal
  data.journal=data.journal||[];
  data.journal.unshift({title:title||('Session '+(data.journal.length+1)),date:date,content:snBuildJournalContent(raw,cl,title,date),_open:true});
  counts.journal=1; if(typeof renderJournal==='function') renderJournal();

  // NPC
  if(cl.npc.length){counts.npc=snSaveNPCs(cl.npc,title,snGetTitle);if(typeof renderNPCs==='function') renderNPCs();}

  // Players
  if(cl.player.length){counts.player=snSavePlayers(cl.player,title,snGetTitle);if(typeof renderPlayerNotes==='function') renderPlayerNotes();}

  // Quests
  if(cl.quest.length){
    data.quests=data.quests||[];
    cl.quest.forEach(function(l){
      var qtitle=snGetTitle(l, l.slice(0,60)+(l.length>60?'…':''));
      data.quests.unshift({title:qtitle,status:'Active',desc:l,reward:'',_open:false});
    });
    counts.quest=cl.quest.length; if(typeof renderQuests==='function') renderQuests();
  }

  // Locations
  if(cl.location.length){counts.location=snSaveLocations(cl.location,title,snGetTitle);if(typeof renderLoreNotes==='function') renderLoreNotes();}

  // Lore
  if(cl.lore.length){
    data.loreNotes=data.loreNotes||[];
    cl.lore.forEach(function(l){
      var ltitle=snGetTitle(l, title?'['+title+'] Lore':'Lore from session');
      data.loreNotes.unshift({title:ltitle,category:'History',content:l,region:'',_open:false});
    });
    counts.lore=cl.lore.length; if(typeof renderLoreNotes==='function') renderLoreNotes();
  }

  // Other
  if(cl.general.length){
    data.generalNotes=data.generalNotes||[];
    cl.general.forEach(function(l){
      var gtitle=snGetTitle(l, title?'['+title+'] Notes':'Notes from session');
      data.generalNotes.unshift({title:gtitle,category:'Other',content:l,tags:'session',_open:false});
    });
    counts.general=cl.general.length; if(typeof renderGeneralNotes==='function') renderGeneralNotes();
  }

  if(typeof autoSave==='function') autoSave();
  var parts=[];
  if(counts._merged) parts.push('🔗 '+counts._merged+' merged');
  if(counts.journal) parts.push('📖 Journal');
  if(counts.npc)     parts.push('🧙 '+counts.npc+' NPC');
  if(counts.player)  parts.push('🎲 '+counts.player+' Player');
  if(counts.quest)   parts.push('📜 '+counts.quest+' Quest');
  if(counts.location)parts.push('🗺️ '+counts.location+' Location');
  if(counts.lore)    parts.push('📚 '+counts.lore+' Lore');
  if(counts.general) parts.push('📌 '+counts.general+' Other');
  snShowMsg('✓ Saved: '+parts.join(', '),'success');
  if(ta) ta.value=''; snUpdateCharCount(); window._snClassified=null; window._snAssignTo={}; snShowInput();
  var stEl=document.getElementById('snSessionTitle'); if(stEl) stEl.value='';
}

// ── Smart NPC Save ───────────────────────────────────────
function snSaveNPCs(npcLines,sessionTitle,snGetTitle) {
  if(!npcLines.length) return 0;
  snGetTitle=snGetTitle||function(_,f){return f;};
  data.npcs=data.npcs||[]; var tag=sessionTitle?'['+sessionTitle+'] ':'[Session] '; var cnt=0;
  var em=snBuildSessionEntityMap(npcLines);
  Object.values(em).forEach(function(entity){
    var noteText=entity.lines.join('\n'),cL=skLemma(entity.canonical);
    var km=snMatchKnownNPCs(entity.lines[0]);
    if(km.length>0){var npc=data.npcs[km[0].idx];npc.notes=(npc.notes?npc.notes+'\n\n':'')+tag+noteText;cnt++;return;}
    var ei=-1;
    for(var i=0;i<data.npcs.length;i++){if(!data.npcs[i].name) continue;if(skNormalize(data.npcs[i].name).some(function(nl){return skTokensMatch(nl,cL);})){ei=i;break;}}
    if(ei>=0){data.npcs[ei].notes=(data.npcs[ei].notes?data.npcs[ei].notes+'\n\n':'')+tag+noteText;cnt++;}
    else{
      var role='';var rp=/\b(merchant|trader|captain|sailor|guard|priest|knight|wizard|innkeeper|pirate|bandit|lord|lady|baron|murderer|healer|blacksmith|hunter|shaman|warden|mayor|commander|merchant|captain|sailor|guard|priest|knight|wizard|innkeeper|pirate|baron|murderer|healer|blacksmith|hunter|shaman|elder|sage)\b/i;
      for(var ri=0;ri<entity.lines.length;ri++){var rm=entity.lines[ri].match(rp);if(rm){role=rm[1];break;}}
      // Try title by each source line (key in _snClassified), then fall back to noteText
      var npcName=entity.bestName;
      for(var li=0;li<entity.lines.length;li++){var t=snGetTitle(entity.lines[li],'');if(t){npcName=t;break;}}
      if(npcName===entity.bestName) npcName=snGetTitle(noteText, entity.bestName);
      data.npcs.unshift({name:npcName,role:role||'',location:'',attitude:'Unknown',notes:noteText,nickname:entity.nickname||'',_open:false});
      cnt++;
    }
  });
  var unattr=npcLines.filter(function(line){return snExtractNPCNamesFromLine(line).length===0;});
  if(unattr.length>0){
    var uTitle=snGetTitle(unattr.join('\n'), sessionTitle?'['+sessionTitle+'] NPC mentions':'NPC from session');
    data.npcs.unshift({name:uTitle,role:'Session notes',location:'',attitude:'Unknown',notes:unattr.join('\n'),_open:false});cnt++;
  }
  return cnt;
}

// ── Smart Player Save ────────────────────────────────────
function snSavePlayers(playerLines,sessionTitle,snGetTitle) {
  if(!playerLines.length) return 0;
  snGetTitle=snGetTitle||function(_,f){return f;};
  data.playerNotes=data.playerNotes||[]; var tag=sessionTitle?'['+sessionTitle+'] ':'[Session] '; var cnt=0;
  var buckets={},unattr=[];
  playerLines.forEach(function(line){
    var km=snMatchKnownPlayers(line);
    if(km.length>0){var k='__pn_'+km[0].idx;if(!buckets[k])buckets[k]={existingIdx:km[0].idx,lines:[]};buckets[k].lines.push(line);}
    else{
      var ex=snExtractNPCNamesFromLine(line);
      if(ex.length>0){
        var cL=skLemma(ex[0].canonical),ei=-1;
        for(var i=0;i<data.playerNotes.length;i++){var pn=data.playerNotes[i];if([pn.name,pn.player].filter(Boolean).some(function(f){return skNormalize(f).some(function(nl){return skTokensMatch(nl,cL);});})){ei=i;break;}}
        if(ei>=0){var k2='__pn_'+ei;if(!buckets[k2])buckets[k2]={existingIdx:ei,lines:[]};buckets[k2].lines.push(line);return;}
      }
      unattr.push(line);
    }
  });
  Object.values(buckets).forEach(function(b){if(!b.lines.length)return;var pn=data.playerNotes[b.existingIdx];if(pn){pn.notes=(pn.notes?pn.notes+'\n\n':'')+tag+b.lines.join('\n');cnt++;}});
  if(unattr.length>0){
    var uTitle=snGetTitle(unattr.join('\n'), sessionTitle?'['+sessionTitle+'] Party':'Party from session');
    data.playerNotes.unshift({name:uTitle,player:'',class:'',relation:'Ally',notes:unattr.join('\n'),secrets:'',keywords:'session',_open:false});cnt++;
  }
  return cnt;
}

// ── Smart Location Save ──────────────────────────────────
function snSaveLocations(locationLines,sessionTitle,snGetTitle) {
  if(!locationLines.length) return 0;
  snGetTitle=snGetTitle||function(_,f){return f;};
  data.loreNotes=data.loreNotes||[]; var cnt=0,tag=sessionTitle?'['+sessionTitle+'] ':'[Session] ';
  var lb={},unattr=[];
  locationLines.forEach(function(line){
    var km=snMatchKnownLocations(line);
    if(km.length>0){var k='__loc_'+km[0].idx;if(!lb[k])lb[k]={existingIdx:km[0].idx,lines:[]};lb[k].lines.push(line);return;}
    var pl=snExtractPlaceNames(line);
    if(pl.length>0){
      var pn=pl[0],pL=skLemma(pn.split(' ')[0]),ei=-1;
      for(var i=0;i<data.loreNotes.length;i++){var ln=data.loreNotes[i];if(ln.category!=='Location'||!ln.title)continue;if(skNormalize(ln.title).some(function(nl){return skTokensMatch(nl,pL);})){ei=i;break;}}
      var k2=ei>=0?('__loc_'+ei):('__new_'+pL);
      if(!lb[k2])lb[k2]={existingIdx:ei>=0?ei:null,placeName:pn,lines:[]};
      lb[k2].lines.push(line);
    }else{unattr.push(line);}
  });
  Object.values(lb).forEach(function(b){
    var nt=b.lines.join('\n');
    if(b.existingIdx!==null&&b.existingIdx>=0){var ln=data.loreNotes[b.existingIdx];ln.content=(ln.content?ln.content+'\n\n':'')+tag+nt;}
    else{
      var locTitle=snGetTitle(nt, b.placeName||(sessionTitle?'['+sessionTitle+'] Location':'Location from session'));
      // Also try each individual line as key
      if(!window._snTitles||!window._snTitles[nt]){
        for(var bi=0;bi<b.lines.length;bi++){var bt=snGetTitle(b.lines[bi],'');if(bt){locTitle=bt;break;}}
      }
      data.loreNotes.unshift({title:locTitle,category:'Location',content:nt,region:'',_open:false});
    }
    cnt++;
  });
  if(unattr.length>0){
    var uTitle=snGetTitle(unattr.join('\n'), sessionTitle?'['+sessionTitle+'] Locations':'Locations from session');
    data.loreNotes.unshift({title:uTitle,category:'Location',content:unattr.join('\n'),region:'',_open:false});cnt++;
  }
  return cnt;
}

// ── Journal builder ──────────────────────────────────────
function snBuildJournalContent(raw,cl,title,date) {
  var out='';
  if(title) out+='# '+title+'\n';
  if(date)  out+='📅 '+date+'\n';
  out+='\n## Raw Notes\n'+raw;
  var b=function(l){return '• '+l;};
  if((cl.npc     ||[]).length) out+='\n\n## 🧙 NPCs\n'       +cl.npc.map(b).join('\n');
  if((cl.player  ||[]).length) out+='\n\n## 🎲 Players\n'    +cl.player.map(b).join('\n');
  if((cl.quest   ||[]).length) out+='\n\n## 📜 Quests\n'     +cl.quest.map(b).join('\n');
  if((cl.location||[]).length) out+='\n\n## 🗺️ Locations\n'  +cl.location.map(b).join('\n');
  if((cl.lore    ||[]).length) out+='\n\n## 📚 Lore\n'       +cl.lore.map(b).join('\n');
  if((cl.general ||[]).length) out+='\n\n## 📌 Other\n'      +cl.general.map(b).join('\n');
  return out.trim();
}
