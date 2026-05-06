// ═══════════════════════════════════════════
//  calendar.js - TIME & CALENDAR, WEATHER, HOLIDAYS
// ═══════════════════════════════════════════

//  TIME & CALENDAR
// ═══════════════════════════════════════════
// Calendar view state — tracks which month/year is DISPLAYED (separate from actual date)
const calView = { monthIdx: null, year: null };

// Default: Forgotten Realms calendar
const CALENDAR_PRESETS = {
  forgotten: {
    months: [
      {name:'Hammer',days:30},{name:'Alturiak',days:30},{name:'Ches',days:30},
      {name:'Tarsakh',days:30},{name:'Mirtul',days:30},{name:'Kythorn',days:30},
      {name:'Flamerule',days:30},{name:'Elesias',days:30},{name:'Eleint',days:30},
      {name:'Marpenoth',days:30},{name:'Uktar',days:30},{name:'Nightal',days:30}
    ],
    weekdays: 'First,Second,Third,Fourth,Fifth,Sixth,Seventh,Eighth,Ninth,Tenth',
    daysPerWeek: 10
  },
  greyhawk: {
    months: [
      {name:"Needfest",days:7},{name:"Fireseek",days:28},{name:"Readying",days:28},
      {name:"Coldeven",days:28},{name:"Growfest",days:7},{name:"Planting",days:28},
      {name:"Flocktime",days:28},{name:"Wealsun",days:28},{name:"Richfest",days:7},
      {name:"Reaping",days:28},{name:"Goodmonth",days:28},{name:"Harvester",days:28},
      {name:"Brewfest",days:7},{name:"Patchwall",days:28},{name:"Ready'reat",days:28},
      {name:"Sunsebb",days:28}
    ],
    weekdays: 'Starday,Sunday,Moonday,Godsday,Waterday,Earthday,Freeday',
    daysPerWeek: 7
  },
  standard: {
    months: [
      {name:'January',days:31},{name:'February',days:28},{name:'March',days:31},
      {name:'April',days:30},{name:'May',days:31},{name:'June',days:30},
      {name:'July',days:31},{name:'August',days:31},{name:'September',days:30},
      {name:'October',days:31},{name:'November',days:30},{name:'December',days:31}
    ],
    weekdays: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
    daysPerWeek: 7
  }
};

function initTimeData() {
  if (!data.timeData) {
    data.timeData = {
      hour: 6, minute: 0,
      day: 1, monthIdx: 0, year: 1490,
      season: 'Spring', weather: 'Clear',
      months: JSON.parse(JSON.stringify(CALENDAR_PRESETS.forgotten.months)),
      weekdays: CALENDAR_PRESETS.forgotten.weekdays,
      daysPerWeek: 10,
      timeLog: []
    };
  }
}

function getTimeStr() {
  initTimeData();
  const td = data.timeData;
  const h = String(td.hour).padStart(2,'0');
  const m = String(td.minute).padStart(2,'0');
  const month = td.months[td.monthIdx]?.name || 'Unknown';
  return `Day ${td.day}, ${month} ${td.year} — ${h}:${m}`;
}

function updateClock() {
  initTimeData();
  const td = data.timeData;
  const h = td.hour;
  const m = td.minute;
  // Digital
  const dc = document.getElementById('digitalClock');
  if (dc) dc.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
  // Hands
  const hourAngle = ((h % 12) / 12 * 360) + (m / 60 * 30);
  const minAngle = m / 60 * 360;
  const hh = document.getElementById('hourHand');
  const mh = document.getElementById('minuteHand');
  if (hh && mh) {
    const cx=100,cy=100;
    const hLen=42, mLen=60;
    const hr = (hourAngle - 90) * Math.PI / 180;
    const mr = (minAngle - 90) * Math.PI / 180;
    hh.setAttribute('x2', cx + Math.cos(hr)*hLen);
    hh.setAttribute('y2', cy + Math.sin(hr)*hLen);
    mh.setAttribute('x2', cx + Math.cos(mr)*mLen);
    mh.setAttribute('y2', cy + Math.sin(mr)*mLen);
  }
  // Period
  const period = document.getElementById('clockPeriod');
  if (period) {
    const labels = h>=5&&h<12?'MORNING':h>=12&&h<17?'AFTERNOON':h>=17&&h<21?'EVENING':'NIGHT';
    period.textContent = labels;
  }
  // Time of day
  const todEl = document.getElementById('timeOfDayLabel');
  if (todEl) {
    const descs = {5:'Dawn ☀',6:'Morning ☀',12:'Midday 🌞',17:'Afternoon 🌅',19:'Evening 🌆',21:'Night 🌙',0:'Midnight 🌑',3:'Witching Hour 🌑'};
    let label = 'Late Night 🌑';
    for (const [startH, lbl] of Object.entries(descs).sort((a,b)=>b[0]-a[0])) {
      if (h >= parseInt(startH)) { label = lbl; break; }
    }
    todEl.textContent = label;
  }
  // Build clock marks
  const marksEl = document.getElementById('clockMarks');
  if (marksEl && marksEl.children.length === 0) {
    for (let i=0;i<12;i++) {
      const angle = (i/12*360-90)*Math.PI/180;
      const r = i%3===0 ? 78 : 82;
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', 100+Math.cos(angle)*r);
      line.setAttribute('y1', 100+Math.sin(angle)*r);
      line.setAttribute('x2', 100+Math.cos(angle)*88);
      line.setAttribute('y2', 100+Math.sin(angle)*88);
      const cs = getComputedStyle(document.body);
      line.setAttribute('stroke', i%3===0 ? cs.getPropertyValue('--border-gold').trim() : cs.getPropertyValue('--border-dark').trim());
      line.setAttribute('stroke-width', i%3===0?'2':'1');
      marksEl.appendChild(line);
    }
  }
  // Sync floating TIME panel whenever clock updates
  if (typeof renderTimeTab === 'function') {
    const _drTime = document.getElementById('drContentTime');
    if (_drTime && _drTime.classList.contains('active')) renderTimeTab();
  }
}

function updateCalendar() {
  initTimeData();
  const td = data.timeData;
  // Sync view to actual date whenever we update (e.g. when day changes via +1/+7 buttons)
  calView.monthIdx = td.monthIdx;
  calView.year = td.year;
  // Update month display
  const monthNameEl = document.getElementById('currentMonthName');
  if (monthNameEl) monthNameEl.textContent = td.months[td.monthIdx]?.name || '—';
  // Year
  const calYearEl = document.getElementById('calYear');
  if (calYearEl && document.activeElement !== calYearEl) calYearEl.value = td.year;
  // Date display
  const dateEl = document.getElementById('currentDateDisplay');
  const weekdayEl = document.getElementById('currentWeekdayDisplay');
  const daysPerWeek = td.daysPerWeek || 7;
  const weekdays = (td.weekdays||'').split(',').map(s=>s.trim());
  // Calculate total days elapsed for weekday
  let totalDays = 0;
  for (let mi=0; mi<td.monthIdx; mi++) totalDays += (td.months[mi]?.days||30);
  totalDays += td.day - 1;
  const weekdayIdx = totalDays % daysPerWeek;
  const weekdayName = weekdays[weekdayIdx] || (weekdayIdx+1)+'-day';
  if (dateEl) dateEl.textContent = `${td.day} ${td.months[td.monthIdx]?.name||''}, ${td.year}`;
  if (weekdayEl) weekdayEl.textContent = weekdayName.toUpperCase();
  // Season/weather
  const seasonEl = document.getElementById('calSeason');
  const weatherEl = document.getElementById('calWeather');
  if (seasonEl) seasonEl.value = td.season || 'Spring';
  if (weatherEl) weatherEl.value = td.weather || 'Clear';
  // Calendar grid
  buildCalendarGrid();
  // Weather
  renderWeatherPanel();
  // daysPerWeek input
  const dpwEl = document.getElementById('daysPerWeek');
  if (dpwEl) dpwEl.value = td.daysPerWeek || 7;
  // weekday names
  const wnEl = document.getElementById('weekdayNames');
  if (wnEl) wnEl.value = td.weekdays || 'Sun,Mon,Tue,Wed,Thu,Fri,Sat';
  // month manager
  renderMonthManager();
  // time log
  renderTimeLog();
  // Sync floating TIME panel
  if (typeof renderTimeTab === 'function') {
    const _drTime2 = document.getElementById('drContentTime');
    if (_drTime2 && _drTime2.classList.contains('active')) renderTimeTab();
  }
}

function getHolidaysForMonth(monthIdx) {
  initTimeData();
  return (data.timeData.holidays||[]).filter(h => {
    const start = h.monthIdx;
    const end = h.endMonthIdx !== undefined ? h.endMonthIdx : start;
    return monthIdx >= start && monthIdx <= end;
  });
}

// ═══════════════════════════════════════════
//  WEATHER GENERATOR
// ═══════════════════════════════════════════
const WEATHER_TABLE = {
  Spring: [
    {w:25,icon:'⛅',desc:'Clear',windMin:0,windMax:10},
    {w:20,icon:'🌤',desc:'Partly Cloudy',windMin:5,windMax:20},
    {w:20,icon:'☁',desc:'Overcast',windMin:5,windMax:25},
    {w:15,icon:'🌧',desc:'Light Rain',windMin:10,windMax:30},
    {w:10,icon:'🌫',desc:'Morning Fog',windMin:0,windMax:8},
    {w:7,icon:'⛈',desc:'Thunderstorm',windMin:25,windMax:60},
    {w:3,icon:'🌨',desc:'Late Frost',windMin:10,windMax:35},
  ],
  Summer: [
    {w:30,icon:'☀',desc:'Sunny & Hot',windMin:0,windMax:10},
    {w:20,icon:'⛅',desc:'Clear with Breeze',windMin:5,windMax:20},
    {w:15,icon:'🌤',desc:'Partly Cloudy',windMin:5,windMax:15},
    {w:15,icon:'⛈',desc:'Afternoon Storm',windMin:20,windMax:70},
    {w:10,icon:'🌡',desc:'Scorching Heatwave',windMin:0,windMax:8},
    {w:8,icon:'🌧',desc:'Summer Rain',windMin:10,windMax:30},
    {w:2,icon:'🌪',desc:'Violent Storm',windMin:60,windMax:120},
  ],
  Autumn: [
    {w:25,icon:'🍂',desc:'Cool & Crisp',windMin:5,windMax:20},
    {w:20,icon:'☁',desc:'Grey Overcast',windMin:10,windMax:30},
    {w:20,icon:'🌧',desc:'Steady Rain',windMin:10,windMax:35},
    {w:15,icon:'🌫',desc:'Dense Fog',windMin:0,windMax:10},
    {w:10,icon:'🌬',desc:'Gusty Winds',windMin:30,windMax:70},
    {w:7,icon:'⛈',desc:'Autumn Storm',windMin:25,windMax:65},
    {w:3,icon:'❄',desc:'First Snow',windMin:10,windMax:30},
  ],
  Winter: [
    {w:20,icon:'❄',desc:'Snowfall',windMin:5,windMax:25},
    {w:20,icon:'🌨',desc:'Blizzard',windMin:30,windMax:90},
    {w:20,icon:'🥶',desc:'Bitter Cold & Clear',windMin:5,windMax:20},
    {w:15,icon:'☁',desc:'Overcast & Cold',windMin:5,windMax:20},
    {w:10,icon:'🌫',desc:'Freezing Fog',windMin:0,windMax:8},
    {w:10,icon:'⛅',desc:'Cold but Clear',windMin:0,windMax:15},
    {w:5,icon:'🌧',desc:'Freezing Rain',windMin:10,windMax:35},
  ]
};

function getSeasonKey() {
  initTimeData();
  const raw = data.timeData.season || 'Spring';
  // Strip emoji prefix, get first word
  return raw.replace(/^[^\w]+/,'').split(' ')[0] || 'Spring';
}

function getTempRange(seasonKey) {
  const defaults = {Spring:[5,18], Summer:[20,35], Autumn:[0,16], Winter:[-10,5]};
  const def = defaults[seasonKey] || [5,18];
  const minEl = document.getElementById('tempMin_' + seasonKey);
  const maxEl = document.getElementById('tempMax_' + seasonKey);
  const minVal = minEl ? parseInt(minEl.value) : NaN;
  const maxVal = maxEl ? parseInt(maxEl.value) : NaN;
  const tMin = isNaN(minVal) ? def[0] : minVal;
  const tMax = isNaN(maxVal) ? def[1] : maxVal;
  return [tMin, Math.max(tMin, tMax)];
}

function generateWeather() {
  initTimeData();
  const td = data.timeData;
  const seasonKey = getSeasonKey();
  const table = WEATHER_TABLE[seasonKey] || WEATHER_TABLE['Spring'];
  const total = table.reduce((s,e)=>s+e.w, 0);
  let r = Math.random() * total;
  let chosen = table[0];
  for (const entry of table) { r -= entry.w; if (r <= 0) { chosen = entry; break; } }
  const [tMin, tMax] = getTempRange(seasonKey);
  const midTemp = Math.round(tMin + Math.random() * (tMax - tMin));
  const wind = Math.round(chosen.windMin + Math.random() * (chosen.windMax - chosen.windMin));
  const windLabel = wind < 5 ? 'Calm' : wind < 20 ? 'Light Breeze' : wind < 40 ? 'Moderate Wind' : wind < 60 ? 'Strong Wind' : wind < 90 ? 'Gale' : 'Storm-force';
  td.weather = chosen.desc;
  td.weatherIcon = chosen.icon;
  td.weatherTemp = midTemp;
  td.weatherWind = wind;
  td.weatherWindLabel = windLabel;
  autoSave();
  renderWeatherPanel();
}

function getTempAtHour(midTemp, hour) {
  const amplitude = Math.max(3, Math.abs(midTemp) * 0.25 + 2);
  const angle = ((hour - 14) / 12) * Math.PI;
  return Math.round(midTemp + amplitude * Math.cos(angle) - amplitude * 0.2);
}

function renderWeatherPanel() {
  initTimeData();
  const td = data.timeData;
  const iconEl = document.getElementById('weatherIcon');
  const descEl = document.getElementById('weatherDesc');
  const windEl = document.getElementById('weatherWind');
  const tempEl = document.getElementById('weatherTemp');
  const tempNoteEl = document.getElementById('weatherTempNote');
  const hourEl = document.getElementById('weatherTempByHour');
  if (!iconEl) return;
  const icon = td.weatherIcon || '⛅';
  const desc = td.weather || 'Clear';
  const wind = td.weatherWind !== undefined ? td.weatherWind : 5;
  const windLabel = td.weatherWindLabel || 'Light Breeze';
  const midTemp = td.weatherTemp !== undefined ? td.weatherTemp : 15;
  iconEl.textContent = icon;
  descEl.textContent = desc;
  windEl.textContent = `💨 ${windLabel} (${wind} km/h)`;
  const hour = td.hour || 12;
  const currentTemp = getTempAtHour(midTemp, hour);
  const periodName = hour < 6 ? 'Night' : hour < 10 ? 'Morning' : hour < 14 ? 'Midday' : hour < 18 ? 'Afternoon' : hour < 22 ? 'Evening' : 'Night';
  const col = currentTemp > 30 ? '#e05030' : currentTemp > 20 ? '#e8a040' : currentTemp > 10 ? '#80c050' : currentTemp > 0 ? '#50b0e0' : '#80a0e8';
  if (tempEl) { tempEl.textContent = currentTemp + '°C'; tempEl.style.color = col; }
  if (tempNoteEl) tempNoteEl.textContent = periodName;
  if (hourEl) {
    const pts = [0,3,6,9,12,15,18,21];
    hourEl.innerHTML = pts.map(h => {
      const t = getTempAtHour(midTemp, h);
      const c = t > 25 ? '#e07030' : t > 15 ? '#c0a030' : t > 5 ? '#60a060' : '#60a0d0';
      const active = Math.floor(hour/3)*3 === h;
      return `<span style="color:${c};${active?'font-weight:900;color:var(--accent-gold);':''}">${String(h).padStart(2,'0')}h:${t}°</span>`;
    }).join('<span style="color:var(--border-dark);margin:0 2px;">·</span>');
  }
}

// ── DAY POPUP & NOTES ──
function showDayPopup(day, monthIdx, holidayName) {
  initTimeData();
  const td = data.timeData;
  const monthName = td.months[monthIdx]?.name || '';
  const noteKey = `${monthIdx}_${day}`;
  td.dayNotes = td.dayNotes || {};
  const existingNote = td.dayNotes[noteKey] || '';

  // Gather all holidays on this day
  const dayHolidays = (td.holidays||[]).filter(h => h.monthIdx === monthIdx && h.day === day);

  let holidayHtml = '';
  if (dayHolidays.length) {
    holidayHtml = dayHolidays.map(h => `
      <div style="background:rgba(80,40,120,0.2);border:1px solid #4a2a70;border-radius:5px;padding:7px 10px;margin-bottom:6px;">
        <div style="font-family:'IM Fell English',serif;font-size:16px;color:#c090ff;">★ ${h.name}</div>
        ${h.desc ? `<div style="font-size:16px;color:var(--text-muted);margin-top:3px;font-style:italic;">${h.desc}</div>` : ''}
      </div>`).join('');
  }

  const popupYear = calView.year !== null ? calView.year : td.year;
  showModal(`${day} ${monthName}`, `
    <div style="display:flex;gap:8px;margin-bottom:10px;">
      <button class="btn btn-primary btn-sm" onclick="setDateFromPopup(${day},${monthIdx},${popupYear});closeModal();" style="flex:1;">📅 Set as Current Date</button>
    </div>
    ${holidayHtml}
    <div class="field" style="margin-bottom:0;">
      <label>📝 Notes for this day</label>
      <textarea id="dayNoteInput" rows="4" placeholder="Quest reminder, event, encounter notes…" style="width:100%;resize:vertical;">${existingNote}</textarea>
    </div>
  `, [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'🗑 Clear Note', action:`deleteDayNote('${noteKey}');closeModal();`, cls:'btn-danger'},
    {label:'💾 Save Note', action:`saveDayNote('${noteKey}');closeModal();`, cls:'btn-primary'},
  ]);
}

function setDateFromPopup(day, monthIdx, year) {
  initTimeData();
  data.timeData.day = day;
  data.timeData.monthIdx = monthIdx;
  if (year !== undefined && !isNaN(year)) data.timeData.year = year;
  autoSave();
  updateCalendar();
  updateClock();
  showToast(`Date set to ${day} ${data.timeData.months[monthIdx]?.name||''} ${data.timeData.year} ✦`);
}

function saveDayNote(noteKey) {
  initTimeData();
  data.timeData.dayNotes = data.timeData.dayNotes || {};
  const val = document.getElementById('dayNoteInput')?.value?.trim();
  if (val) {
    data.timeData.dayNotes[noteKey] = val;
  } else {
    delete data.timeData.dayNotes[noteKey];
  }
  autoSave();
  buildCalendarGrid();
  showToast('Day note saved ✦');
}

function deleteDayNote(noteKey) {
  initTimeData();
  data.timeData.dayNotes = data.timeData.dayNotes || {};
  delete data.timeData.dayNotes[noteKey];
  autoSave();
  buildCalendarGrid();
  showToast('Note cleared');
}

// Also show notes in holiday list
function getDayNotesForMonth(monthIdx) {
  initTimeData();
  const td = data.timeData;
  td.dayNotes = td.dayNotes || {};
  const results = [];
  Object.entries(td.dayNotes).forEach(([key, note]) => {
    const [mi, d] = key.split('_').map(Number);
    if (mi === monthIdx) results.push({day: d, note});
  });
  return results.sort((a,b) => a.day - b.day);
}

function buildCalendarGrid() {
  initTimeData();
  const td = data.timeData;
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;
  // Use calView for display (which month/year is shown), fall back to actual date
  const vMonthIdx = calView.monthIdx !== null ? calView.monthIdx : td.monthIdx;
  const vYear = calView.year !== null ? calView.year : td.year;
  const daysPerWeek = Math.max(1, td.daysPerWeek || 7);
  const daysInMonth = td.months[vMonthIdx]?.days || 30;
  const cols = Math.min(daysPerWeek, 14);
  const weekdays = (td.weekdays||'').split(',').map(s=>s.trim());

  // Force grid display with explicit columns
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  grid.style.gap = '2px';
  grid.innerHTML = '';

  // ── Weekday header row ──
  for (let i = 0; i < cols; i++) {
    const hdr = document.createElement('div');
    const name = weekdays[i] || String(i + 1);
    // Abbreviate to max 3 chars
    hdr.textContent = name.length > 3 ? name.slice(0, 3) : name;
    hdr.title = name;
    hdr.style.cssText = 'font-family:Cinzel,serif;font-size:9px;font-weight:700;letter-spacing:0.5px;text-align:center;color:var(--text-muted);padding:3px 1px 4px;text-transform:uppercase;border-bottom:1px solid var(--border-dark);margin-bottom:1px;overflow:hidden;';
    grid.appendChild(hdr);
  }

  // Holidays for the VIEWED month — build per-day map supporting ranges
  const holidays = {}; // day -> holiday name
  getHolidaysForMonth(vMonthIdx).forEach(h => {
    const startDay = (h.monthIdx === vMonthIdx) ? h.day : 1;
    const endDay   = (h.endMonthIdx !== undefined)
      ? ((h.endMonthIdx === vMonthIdx) ? (h.endDay ?? h.day) : daysInMonth)
      : h.day;
    for (let d = startDay; d <= endDay; d++) {
      if (!holidays[d]) holidays[d] = h.name;
    }
  });

  // Calculate starting weekday offset for day 1 of viewed month
  let totalDaysBefore = 0;
  for (let mi = 0; mi < vMonthIdx; mi++) totalDaysBefore += (td.months[mi]?.days || 30);
  const startOffset = totalDaysBefore % daysPerWeek;

  // Empty cells before day 1
  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.style.cssText = 'display:block;';
    grid.appendChild(empty);
  }

  // Day number cells — isToday only if viewing the actual current month+year
  const isViewingCurrentMonth = (vMonthIdx === td.monthIdx && vYear === td.year);
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isViewingCurrentMonth && d === td.day;
    const isHoliday = !!holidays[d];
    const noteKey = `${vMonthIdx}_${d}`;
    const hasNote = !!(td.dayNotes && td.dayNotes[noteKey]);
    const cell = document.createElement('div');
    let cls = 'cal-cell cal-day';
    if (isToday) cls += ' cal-today';
    if (isHoliday) cls += ' cal-holiday';
    if (hasNote && !isHoliday) cls += ' cal-note';
    cell.className = cls;
    cell.textContent = d;
    cell.style.padding = '4px 2px';
    cell.style.fontSize = '11px';
    // Show dot indicator for notes
    if (hasNote) cell.style.position = 'relative';
    // Click: show day popup, do NOT change the main date
    cell.onclick = () => showDayPopup(d, vMonthIdx, isHoliday ? holidays[d] : null);
    grid.appendChild(cell);
  }

  renderHolidayList();
}

// ── HOLIDAYS ──
function _holidayModalBody(h) {
  // h = existing holiday object for edit, or defaults for add
  const td = data.timeData;
  const monthOpts = td.months.map((m,i)=>`<option value="${i}">${m.name}</option>`).join('');
  const fromMonthIdx = h ? h.monthIdx : td.monthIdx;
  const fromDay      = h ? h.day      : td.day;
  const hasRange     = h && (h.endMonthIdx !== undefined || h.endDay !== undefined);
  const toMonthIdx   = hasRange ? (h.endMonthIdx ?? h.monthIdx) : fromMonthIdx;
  const toDay        = hasRange ? (h.endDay ?? h.day)           : fromDay;
  const desc         = h ? (h.desc||'') : '';
  const name         = h ? (h.name||'').replace(/"/g,'&quot;') : '';

  // build selects with correct selected option
  function monthSel(id, selIdx) {
    return `<select id="${id}">${td.months.map((m,i)=>`<option value="${i}"${i===selIdx?' selected':''}>${m.name}</option>`).join('')}</select>`;
  }

  return `
    <div class="field"><label>Holiday Name</label>
      <input type="text" id="m_holName" value="${name}" placeholder="e.g. Midwinter Festival, Harvest Moon…">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <div class="field" style="margin:0;">
        <label style="font-size:10px;letter-spacing:1px;">★ FROM — Month</label>
        ${monthSel('m_holMonth', fromMonthIdx)}
      </div>
      <div class="field" style="margin:0;">
        <label style="font-size:10px;letter-spacing:1px;">Day</label>
        <input type="number" id="m_holDay" value="${fromDay}" min="1" max="99">
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
      <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:'Cinzel',serif;font-size:10px;letter-spacing:1px;color:var(--text-muted);">
        <input type="checkbox" id="m_holMulti" ${hasRange?'checked':''} onchange="
          document.getElementById('m_holRangeRow').style.display=this.checked?'grid':'none';
        " style="accent-color:#b080e8;width:13px;height:13px;">
        MULTI-DAY EVENT (set end date)
      </label>
    </div>
    <div id="m_holRangeRow" style="display:${hasRange?'grid':'none'};grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;padding:8px;background:rgba(80,40,120,0.1);border:1px solid #4a2a70;border-radius:4px;">
      <div class="field" style="margin:0;">
        <label style="font-size:10px;letter-spacing:1px;">✦ TO — Month</label>
        ${monthSel('m_holEndMonth', toMonthIdx)}
      </div>
      <div class="field" style="margin:0;">
        <label style="font-size:10px;letter-spacing:1px;">Day</label>
        <input type="number" id="m_holEndDay" value="${toDay}" min="1" max="99">
      </div>
    </div>
    <div class="field"><label>Description (optional)</label>
      <textarea id="m_holDesc" rows="4" placeholder="Describe what is celebrated, traditions, rituals, history…" style="width:100%;resize:vertical;min-height:80px;font-family:'Crimson Text',serif;font-size:15px;line-height:1.5;">${desc}</textarea>
    </div>
  `;
}

function _holidaySaveAction(idx) {
  // idx = -1 for new, else edit index
  return `
    (function(){
      const multi = document.getElementById('m_holMulti').checked;
      const obj = {
        name: document.getElementById('m_holName').value||'Holiday',
        monthIdx: parseInt(document.getElementById('m_holMonth').value)||0,
        day: parseInt(document.getElementById('m_holDay').value)||1,
        desc: document.getElementById('m_holDesc').value||''
      };
      if (multi) {
        obj.endMonthIdx = parseInt(document.getElementById('m_holEndMonth').value)||obj.monthIdx;
        obj.endDay = parseInt(document.getElementById('m_holEndDay').value)||obj.day;
      }
      data.timeData.holidays = data.timeData.holidays||[];
      if (${idx} === -1) { data.timeData.holidays.push(obj); }
      else { data.timeData.holidays[${idx}] = obj; }
      data.timeData.holidays.sort((a,b)=>a.monthIdx!==b.monthIdx?a.monthIdx-b.monthIdx:a.day-b.day);
      buildCalendarGrid();
      autoSave();
      closeModal();
      showToast(${idx===-1?'\'Holiday added ★\'':'\'Holiday updated ★\''});
    })()
  `;
}

function addHoliday() {
  initTimeData();
  showModal('Add Holiday / Festival', _holidayModalBody(null), [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'Add Holiday', action: _holidaySaveAction(-1), cls:'btn-primary'}
  ]);
}

function editHoliday(idx) {
  initTimeData();
  const h = data.timeData.holidays[idx];
  if (!h) return;
  showModal('Edit Holiday / Festival', _holidayModalBody(h), [
    {label:'Cancel', action:'closeModal()', cls:'btn-silver'},
    {label:'💾 Save Changes', action: _holidaySaveAction(idx), cls:'btn-primary'}
  ]);
}

function renderHolidayList() {
  initTimeData();
  const td = data.timeData;
  const container = document.getElementById('holidayList');
  if (!container) return;

  // Use the VIEWED month/year (calView), not the actual current date
  const vMonthIdx = calView.monthIdx !== null ? calView.monthIdx : td.monthIdx;
  const vYear = calView.year !== null ? calView.year : td.year;
  const isViewingCurrentMonth = (vMonthIdx === td.monthIdx && vYear === td.year);

  const monthHolidays = getHolidaysForMonth(vMonthIdx);
  const monthNotes = getDayNotesForMonth(vMonthIdx);

  let html = '';

  if (!monthHolidays.length && !monthNotes.length) {
    container.innerHTML = '<div style="font-size:16px;color:var(--text-muted);font-style:italic;">No holidays or notes this month.</div>';
    return;
  }

  // Holidays
  html += monthHolidays.map((h, i) => {
    const realIdx = (td.holidays||[]).indexOf(h);
    const isToday = isViewingCurrentMonth && td.day >= h.day &&
      (h.endMonthIdx === undefined ? td.day <= (h.endDay ?? h.day) && vMonthIdx === h.monthIdx :
        (vMonthIdx > h.monthIdx || td.day >= h.day) && (vMonthIdx < h.endMonthIdx || td.day <= (h.endDay ?? h.day)));
    const hasDesc = h.desc && h.desc.trim().length > 0;
    const hasRange = h.endMonthIdx !== undefined || h.endDay !== undefined;
    const startLabel = `${td.months[h.monthIdx]?.name||''} ${h.day}`;
    const endLabel   = hasRange ? ` – ${td.months[h.endMonthIdx ?? h.monthIdx]?.name||''} ${h.endDay ?? h.day}` : '';
    const hasExpandable = hasDesc;
    return `<details class="holiday-item-details" style="${isToday?'border-color:var(--accent-gold-bright);':''}">
      <summary class="holiday-item" style="${isToday?'border-color:var(--accent-gold-bright);background:rgba(var(--_accent-gold-rgb,180,130,40),0.15);':''}border:none;margin:0;cursor:${hasExpandable?'pointer':'default'};">
        <div class="holiday-dot" style="${isToday?'background:var(--accent-gold-bright);box-shadow:0 0 6px var(--shadow-gold);':''}"></div>
        <div class="holiday-name" style="flex:1;">${h.name}</div>
        <div class="holiday-day" style="white-space:nowrap;">${startLabel}${endLabel}</div>
        ${hasExpandable ? `<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">▼</span>` : ''}
        <button class="holiday-edit-btn" title="Edit" onclick="event.stopPropagation();event.preventDefault();editHoliday(${realIdx})"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="del-btn" onclick="event.stopPropagation();event.preventDefault();removeHoliday(${realIdx})">🗑</button>
      </summary>
      ${hasExpandable ? `<div style="padding:4px 8px 6px 24px;font-family:'Crimson Text',serif;font-size:12px;color:var(--text-secondary);font-style:italic;line-height:1.5;word-wrap:break-word;white-space:pre-wrap;">${h.desc}</div>` : ''}
    </details>`;
  }).join('');

  // Day Notes
  html += monthNotes.map(({day, note}) => {
    const noteKey = `${vMonthIdx}_${day}`;
    const isToday = isViewingCurrentMonth && day === td.day;
    const preview = note.length > 50 ? note.slice(0, 47) + '…' : note;
    return `<details class="holiday-item-details" style="${isToday?'border-color:var(--border-gold-bright);':'border-color:var(--border-mid);'}">
      <summary class="holiday-item" style="border-color:inherit;background:rgba(0,0,0,0.1);${isToday?'background:rgba(0,0,0,0.2);':''}border:none;margin:0;cursor:pointer;">
        <div class="holiday-dot" style="background:var(--accent-gold);box-shadow:0 0 4px var(--shadow-gold);flex-shrink:0;"></div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--accent-gold);">📝 Note</div>
          <div style="font-family:'Crimson Text',serif;font-size:12px;color:var(--text-secondary);font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${preview}</div>
        </div>
        <div class="holiday-day" style="flex-shrink:0;">Day ${day}</div>
        <span style="font-size:10px;color:var(--text-muted);margin-left:4px;flex-shrink:0;">▼</span>
        <button class="del-btn" onclick="event.stopPropagation();event.preventDefault();deleteDayNote('${noteKey}');renderHolidayList();">🗑</button>
      </summary>
      <div style="padding:4px 8px 6px 24px;font-family:'Crimson Text',serif;font-size:12px;color:var(--text-secondary);font-style:italic;line-height:1.5;word-wrap:break-word;white-space:pre-wrap;">${note}</div>
    </details>`;
  }).join('');

  container.innerHTML = html;
}

function removeHoliday(idx) {
  initTimeData();
  data.timeData.holidays.splice(idx, 1);
  buildCalendarGrid();
  autoSave();
}

function advanceTime(hours, minutes) {
  initTimeData();
  const td = data.timeData;
  let totalMin = td.hour*60 + td.minute + hours*60 + minutes;
  let daysAdvanced = Math.floor(totalMin / (24*60));
  totalMin = totalMin % (24*60);
  if (totalMin < 0) { totalMin += 24*60; daysAdvanced--; }
  td.hour = Math.floor(totalMin/60);
  td.minute = totalMin % 60;
  for (let i=0;i<daysAdvanced;i++) advanceDayInternal();
  for (let i=0;i>daysAdvanced;i--) advanceDayInternal(-1);
  updateClock();
  updateCalendar();
  // Sync floating TIME tab if open
  const timeTab = document.getElementById('drContentTime');
  if (timeTab?.classList.contains('active')) renderTimeTab();
  autoSave();
}

function advanceDayInternal(dir=1) {
  const td = data.timeData;
  td.day += dir;
  const daysInMonth = td.months[td.monthIdx]?.days || 30;
  if (td.day > daysInMonth) {
    td.day = 1;
    td.monthIdx++;
    if (td.monthIdx >= td.months.length) { td.monthIdx = 0; td.year++; }
  } else if (td.day < 1) {
    td.monthIdx--;
    if (td.monthIdx < 0) { td.monthIdx = td.months.length-1; td.year--; }
    td.day = td.months[td.monthIdx]?.days || 30;
  }
}

function setTimeManual() {
  initTimeData();
  const h = Math.max(0,Math.min(23,parseInt(document.getElementById('setHour').value)||0));
  const m = Math.max(0,Math.min(59,parseInt(document.getElementById('setMinute').value)||0));
  data.timeData.hour = h;
  data.timeData.minute = m;
  updateClock();
  autoSave();
}

function changeMonth(dir) {
  initTimeData();
  const months = data.timeData.months;
  const len = months.length;
  if (calView.monthIdx === null) calView.monthIdx = data.timeData.monthIdx;
  if (calView.year === null) calView.year = data.timeData.year;
  calView.monthIdx += dir;
  if (calView.monthIdx >= len) { calView.monthIdx = 0; calView.year++; }
  else if (calView.monthIdx < 0) { calView.monthIdx = len - 1; calView.year--; }
  updateCalendarView();
}

function changeYear(dir) {
  initTimeData();
  if (calView.year === null) calView.year = data.timeData.year;
  if (calView.monthIdx === null) calView.monthIdx = data.timeData.monthIdx;
  calView.year += dir;
  updateCalendarView();
}

// Sync view to actual date
function syncViewToDate() {
  initTimeData();
  calView.monthIdx = data.timeData.monthIdx;
  calView.year = data.timeData.year;
}

// Update only the calendar view display (month nav area + grid) without touching actual date
function updateCalendarView() {
  initTimeData();
  const td = data.timeData;
  const vMonthIdx = calView.monthIdx !== null ? calView.monthIdx : td.monthIdx;
  const vYear = calView.year !== null ? calView.year : td.year;

  const monthNameEl = document.getElementById('currentMonthName');
  if (monthNameEl) monthNameEl.textContent = (td.months[vMonthIdx]?.name || '—') + (vYear !== td.year ? ' ' + vYear : '');
  const calYearEl = document.getElementById('calYear');
  if (calYearEl && document.activeElement !== calYearEl) calYearEl.value = vYear;

  buildCalendarGrid();
  renderHolidayList();
}

function changeDay(dir) {
  initTimeData();
  for (let i=0;i<Math.abs(dir);i++) advanceDayInternal(dir>0?1:-1);
  updateCalendar(); updateClock(); autoSave();
}

function loadCalendarPreset(preset) {
  initTimeData();
  const p = CALENDAR_PRESETS[preset];
  if (!p) return;
  data.timeData.months = JSON.parse(JSON.stringify(p.months));
  data.timeData.weekdays = p.weekdays;
  data.timeData.daysPerWeek = p.daysPerWeek;
  data.timeData.monthIdx = Math.min(data.timeData.monthIdx, p.months.length-1);
  updateCalendar(); showToast('Calendar preset loaded ✦');
}

function addMonth() {
  initTimeData();
  data.timeData.months.push({name:'New Month', days:30});
  renderMonthManager();
  autoSave();
}

function renderMonthManager() {
  initTimeData();
  const container = document.getElementById('monthManagerList');
  if (!container) return;
  container.innerHTML = '';
  data.timeData.months.forEach((m,i) => {
    const div = document.createElement('div');
    div.className = 'month-manager-row';
    div.innerHTML = `
      <span style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-muted);width:24px;flex-shrink:0;">${i+1}.</span>
      <input type="text" value="${m.name||''}" placeholder="Month name…" style="flex:2;" oninput="data.timeData.months[${i}].name=this.value;updateCalendar();autoSave()">
      <input type="number" value="${m.days||30}" min="1" max="99" style="width:64px;text-align:center;" title="Days in month" oninput="data.timeData.months[${i}].days=parseInt(this.value)||30;updateCalendar();autoSave()">
      <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);">days</span>
      <button class="del-btn" onclick="data.timeData.months.splice(${i},1);data.timeData.monthIdx=Math.min(data.timeData.monthIdx,data.timeData.months.length-1);renderMonthManager();updateCalendar();autoSave()">🗑</button>
    `;
    container.appendChild(div);
  });
}

function addTimeLogEntry() {
  initTimeData();
  const noteEl = document.getElementById('timeLogNote');
  const catEl = document.getElementById('timeLogCat');
  const note = noteEl?.value?.trim() || '';
  const cat = catEl?.value || 'Other';
  data.timeData.timeLog = data.timeData.timeLog || [];
  data.timeData.timeLog.unshift({time: getTimeStr(), note: note, cat: cat});
  if (noteEl) noteEl.value = '';
  tlPage = 0;
  renderTimeLog();
  autoSave();
}

var tlPage = 0;
var TL_PER_PAGE = 10;

var TL_CAT_ICONS = {
  'Event':'⚔', 'Travel':'🗺', 'Rest':'🌙', 'Discovery':'🔍', 'NPC':'💬', 'Other':'📌',
  'Combat':'🛡', 'Spell':'✨', 'Inventory':'🎒', 'Condition':'⚡', 'Transaction':'💰'
};
var TL_CAT_COLORS = {
  'Event':'#5a2a2a', 'Travel':'#2a4a2a', 'Rest':'#2a2a5a',
  'Discovery':'#4a3a1a', 'NPC':'#3a2a4a', 'Other':'#3a3a3a',
  'Combat':'#4a2020', 'Spell':'#2a2a5a', 'Inventory':'#2a3a1a',
  'Condition':'#3a2a10', 'Transaction':'#1a3a2a'
};

// ── Central auto-log helper ──
// Called from any JS file to silently add a Time Log entry.
function _autoLog(note, cat) {
  try {
    initTimeData();
    data.timeData.timeLog = data.timeData.timeLog || [];
    data.timeData.timeLog.unshift({ time: getTimeStr(), note: note, cat: cat || 'Other', auto: true });
    // Keep log from growing unbounded (max 500 auto entries)
    if (data.timeData.timeLog.length > 500) data.timeData.timeLog.length = 500;
    // Persist IMMEDIATELY — autoSave() has 800ms debounce which can be lost on refresh
    localStorage.setItem('dnd5e_chronicle', JSON.stringify(data));
    // Refresh log panel whenever the container exists (visible or not — data is always fresh)
    const logEl = document.getElementById('timeLog');
    if (logEl) { tlPage = 0; renderTimeLog(); }
  } catch(e) { /* silently fail — never break game actions */ }
}

function clearTimeLog() {
  initTimeData();
  if (!confirm('Are you sure you want to clear the entire Time Log?')) return;
  data.timeData.timeLog = [];
  tlPage = 0;
  renderTimeLog();
  autoSave();
}

function renderTimeLog() {
  initTimeData();
  const container = document.getElementById('timeLog');
  const pagEl = document.getElementById('timeLogPagination');
  if (!container) return;

  const catFilter = document.getElementById('timeLogFilterCat')?.value || '';
  const search = (document.getElementById('timeLogSearch')?.value || '').toLowerCase();

  const all = data.timeData.timeLog || [];
  const filtered = all.filter((e, idx) => {
    if (catFilter && e.cat !== catFilter) return false;
    if (search) {
      const hay = ((e.note||'') + ' ' + (e.time||'') + ' ' + (e.cat||'')).toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const maxPage = Math.max(0, Math.ceil(total / TL_PER_PAGE) - 1);
  if (tlPage > maxPage) tlPage = maxPage;
  const paged = filtered.slice(tlPage * TL_PER_PAGE, (tlPage + 1) * TL_PER_PAGE);

  container.innerHTML = '';
  if (total === 0) {
    container.innerHTML = '<div style="color:var(--text-muted);font-size:15px;font-style:italic;padding:10px 0;">' + (all.length === 0 ? 'No entries.' : 'No entries match the filter.') + '</div>';
  } else {
    paged.forEach((e, pi) => {
      const realIdx = all.indexOf(e);
      const icon = TL_CAT_ICONS[e.cat] || '📌';
      const color = TL_CAT_COLORS[e.cat] || '#3a3a3a';
      const div = document.createElement('div');
      div.className = 'time-log-entry';
      div.style.borderLeft = '3px solid ' + color;
      div.style.paddingLeft = '8px';
      div.style.gap = '8px';
      div.style.alignItems = 'flex-start';
      div.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;flex:1;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span class="time-log-time">${e.time}</span>
            <span style="font-size:11px;padding:1px 6px;border-radius:3px;background:${color};color:var(--text-primary);font-family:'Cinzel',serif;letter-spacing:0.5px;">${icon} ${e.cat||'Other'}</span>
          </div>
          <div class="time-log-text" style="font-size:14px;">${e.note||'<em style="color:var(--text-muted)">—</em>'}</div>
        </div>
        <button class="del-btn" style="flex-shrink:0;margin-top:2px;" onclick="data.timeData.timeLog.splice(${realIdx},1);renderTimeLog();autoSave()">🗑</button>
      `;
      container.appendChild(div);
    });
  }

  // Pagination
  if (!pagEl) return;
  pagEl.innerHTML = '';
  if (total <= TL_PER_PAGE) return;
  const totalPages = Math.ceil(total / TL_PER_PAGE);

  const info = document.createElement('span');
  info.style.cssText = 'font-family:Cinzel,serif;font-size:11px;color:var(--text-muted);';
  info.textContent = (tlPage * TL_PER_PAGE + 1) + '–' + Math.min((tlPage+1)*TL_PER_PAGE, total) + ' / ' + total;

  const prev = document.createElement('button');
  prev.className = 'btn btn-silver btn-sm';
  prev.textContent = '‹';
  prev.disabled = tlPage === 0;
  prev.onclick = () => { tlPage--; renderTimeLog(); };

  const next = document.createElement('button');
  next.className = 'btn btn-silver btn-sm';
  next.textContent = '›';
  next.disabled = tlPage >= totalPages - 1;
  next.onclick = () => { tlPage++; renderTimeLog(); };

  pagEl.appendChild(prev);
  pagEl.appendChild(info);
  pagEl.appendChild(next);
}

// Sync season/weather selects on change
document.addEventListener('change', e => {
  if (e.target.id === 'calSeason') { initTimeData(); data.timeData.season = e.target.value; autoSave(); }
  if (e.target.id === 'calWeather') { initTimeData(); data.timeData.weather = e.target.value; autoSave(); }
  if (e.target.id === 'weekdayNames') { initTimeData(); data.timeData.weekdays = e.target.value; updateCalendar(); autoSave(); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'calYear') { if(calView.monthIdx===null)calView.monthIdx=data.timeData.monthIdx; const yr=parseInt(e.target.value); if(!isNaN(yr)&&String(e.target.value).length>=1){calView.year=yr; data.timeData.year=yr; autoSave();} updateCalendarView(); }
  if (e.target.id === 'daysPerWeek') { initTimeData(); data.timeData.daysPerWeek = parseInt(e.target.value)||7; updateCalendar(); autoSave(); }
  if (e.target.id === 'weekdayNames') { initTimeData(); data.timeData.weekdays = e.target.value; updateCalendar(); autoSave(); }
  if (e.target.id === 'foodCurrent'||e.target.id === 'foodMax'||e.target.id === 'waterCurrent'||e.target.id === 'waterMax'||e.target.id === 'rationNotes'||e.target.id === 'lastLongRest'||e.target.id === 'restNotes') autoSave();
});

// ═══════════════════════════════════════════
