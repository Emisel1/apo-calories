// ═══════════════════════════════════════════════════════════════════════
// CYCLE DATA & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════
window.cycleData = [];

const PHASES = [
  { name: 'Menstruelle',  days: [1,5],  color:'#C0392B', bg:'#FDEDEC', icon:'droplets',    tip:'Repos prioritaire. Mange chaud, évite l\'intensité max.' },
  { name: 'Folliculaire', days: [6,13], color:'#5D8A6E', bg:'#EAF4EE', icon:'sprout',       tip:'Énergie en hausse — parfait pour les séances lourdes.' },
  { name: 'Ovulation',    days: [14,16],color:'#D4AC0D', bg:'#FEFDE7', icon:'zap',          tip:'Pic de force. Bats tes records maintenant.' },
  { name: 'Lutéale',      days: [17,28],color:'#8E44AD', bg:'#F5EEF8', icon:'moon',         tip:'Énergie variable. Augmente les glucides si fatigue.' },
];

const MOODS = [
  { key:'Bien',      icon:'smile',      label:'Bien' },
  { key:'Irritable', icon:'frown',      label:'Irritable' },
  { key:'Anxieuse',  icon:'alert-circle',label:'Anxieuse' },
  { key:'Fatiguée',  icon:'battery-low',label:'Fatiguée' },
  { key:'Sereine',   icon:'sun',        label:'Sereine' },
];

const SYMPTOMS = ['Crampes','Ballonnements','Maux de tête','Seins sensibles','Acné','Fringales','Dos'];

// ═══════════════════════════════════════════════════════════════════════
// PHASE UTILS
// ═══════════════════════════════════════════════════════════════════════
function getCycleStart() {
  const stored = localStorage.getItem('apo_cycle_start');
  return stored ? new Date(stored) : null;
}

function setCycleStart(date) {
  localStorage.setItem('apo_cycle_start', date.toISOString());
}

function getCycleDay(date = new Date()) {
  const start = getCycleStart();
  if (!start) return null;
  const diff = Math.floor((date - start) / 86400000) + 1;
  return diff > 0 ? diff : null;
}

function getPhase(cycleDay) {
  if (!cycleDay) return null;
  const day = ((cycleDay - 1) % 28) + 1;
  return PHASES.find(p => day >= p.days[0] && day <= p.days[1]) || PHASES[3];
}

function getTodayPhase() {
  const day = getCycleDay();
  return day ? getPhase(day) : null;
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD BANNER
// ═══════════════════════════════════════════════════════════════════════
window.renderCycleBanner = function() {
  const wrap = document.getElementById('cycle-banner');
  if (!wrap) return;

  const phase = getTodayPhase();
  if (!phase) {
    wrap.innerHTML = `
      <div class="phase-banner" style="background:#F2F3F4;cursor:pointer" onclick="showTab('cycle')">
        <div class="phase-icon-wrap" style="background:#E8DDD9">
          <i data-lucide="calendar-heart" style="width:22px;height:22px;color:#7F8C8D"></i>
        </div>
        <div>
          <div class="phase-name" style="color:#2C2420">Suivi du cycle</div>
          <div class="phase-day" style="color:#7F8C8D">Configure ta date de dernières règles</div>
        </div>
      </div>`;
    lucide.createIcons({ nodes: [wrap] });
    return;
  }

  const day = getCycleDay();
  const cycDay = ((day - 1) % 28) + 1;
  wrap.innerHTML = `
    <div class="phase-banner" style="background:${phase.bg}">
      <div class="phase-icon-wrap" style="background:${phase.color}20">
        <i data-lucide="${phase.icon}" style="width:22px;height:22px;color:${phase.color}"></i>
      </div>
      <div>
        <div class="phase-name" style="color:${phase.color}">${phase.name}</div>
        <div class="phase-day" style="color:${phase.color}">Jour ${cycDay} sur 28</div>
        <div class="phase-tip" style="color:${phase.color}90">${phase.tip}</div>
      </div>
    </div>`;
  lucide.createIcons({ nodes: [wrap] });
};

// ═══════════════════════════════════════════════════════════════════════
// CYCLE TAB RENDERER
// ═══════════════════════════════════════════════════════════════════════
let activeCyclePanel = 'log';

window.renderCycleTab = function() {
  showCyclePanel(activeCyclePanel);
};

window.refreshCycle = function() {
  if (document.getElementById('tab-cycle')?.classList.contains('active')) {
    showCyclePanel(activeCyclePanel);
  }
  window.renderCycleBanner?.();
};

function showCyclePanel(name) {
  activeCyclePanel = name;
  document.querySelectorAll('.cycle-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cycle-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`cycle-panel-${name}`)?.classList.add('active');
  document.querySelector(`[data-cycle-tab="${name}"]`)?.classList.add('active');

  if (name === 'log')         renderCycleLog();
  if (name === 'calendar')    renderCycleCalendar();
  if (name === 'correlation') renderCorrelationChart();
}

// ═══════════════════════════════════════════════════════════════════════
// CYCLE LOG FORM
// ═══════════════════════════════════════════════════════════════════════
let selectedMood     = '';
let selectedSymptoms = new Set();
let isPeriodActive   = false;

function renderCycleLog() {
  const today    = new Date();
  const todayFR  = fmtDate(today);
  const existing = window.cycleData.find(e => e.d === todayFR);

  if (existing) {
    selectedMood     = existing.mood || '';
    selectedSymptoms = new Set((existing.symptoms || '').split(',').filter(Boolean));
    isPeriodActive   = existing.period === 'O';
  } else {
    selectedMood     = '';
    selectedSymptoms = new Set();
    isPeriodActive   = false;
  }

  const phase   = getTodayPhase();
  const day     = getCycleDay();
  const cycDay  = day ? ((day - 1) % 28) + 1 : null;
  const perfVal = existing?.perf ?? 5;

  document.getElementById('cycle-panel-log').innerHTML = `
    <div class="card" style="margin-top:14px">

      <!-- Date + phase info -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <div style="font-size:.72rem;color:var(--mid);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Date</div>
          <input type="date" id="cycle-date" value="${today.toISOString().slice(0,10)}"
            style="border:2px solid var(--border);border-radius:10px;padding:8px 12px;font-size:.9rem;color:var(--dark);background:var(--cream);outline:none;width:auto"
            onchange="onCycleDateChange(this.value)">
        </div>
        ${phase ? `
          <div style="text-align:right">
            <div style="font-size:.7rem;color:var(--mid);margin-bottom:2px">Phase actuelle</div>
            <div style="font-weight:700;color:${phase.color};font-size:.9rem">${phase.name}</div>
            <div style="font-size:.75rem;color:${phase.color}80">Jour ${cycDay} / 28</div>
          </div>` : ''}
      </div>

      <!-- Period toggle -->
      <div style="margin-bottom:14px">
        <div style="font-size:.71rem;font-weight:600;color:var(--mid);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Règles</div>
        <div class="period-toggle ${isPeriodActive ? 'active' : ''}" id="period-toggle" onclick="togglePeriod()">
          <div class="period-toggle-label">
            <i data-lucide="droplets"></i>
            <span>${isPeriodActive ? 'Règles actives aujourd\'hui' : 'Pas de règles aujourd\'hui'}</span>
          </div>
          <div class="toggle-switch"></div>
        </div>
      </div>

      <!-- Mood -->
      <div style="margin-bottom:14px">
        <div style="font-size:.71rem;font-weight:600;color:var(--mid);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Humeur</div>
        <div class="mood-tags" id="mood-tags">
          ${MOODS.map(m => `
            <div class="mood-tag ${selectedMood === m.key ? 'selected' : ''}" onclick="selectMood('${m.key}')" data-mood="${m.key}">
              <i data-lucide="${m.icon}"></i>${m.label}
            </div>`).join('')}
        </div>
      </div>

      <!-- Symptoms -->
      <div style="margin-bottom:14px">
        <div style="font-size:.71rem;font-weight:600;color:var(--mid);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Symptômes</div>
        <div class="symptom-chips" id="symptom-chips">
          ${SYMPTOMS.map(s => `
            <div class="symptom-chip ${selectedSymptoms.has(s) ? 'selected' : ''}" onclick="toggleSymptom('${s}')" data-symptom="${s}">
              ${s}
            </div>`).join('')}
        </div>
      </div>

      <!-- Gym performance -->
      <div style="margin-bottom:16px">
        <div style="font-size:.71rem;font-weight:600;color:var(--mid);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Performance à la salle</div>
        <div class="perf-slider-wrap">
          <input type="range" class="perf-slider" id="cycle-perf" min="1" max="10" value="${perfVal}" oninput="document.getElementById('perf-display').textContent=this.value">
          <div class="perf-labels"><span>Très mauvaise</span><span>Record</span></div>
          <div class="perf-value" id="perf-display">${perfVal}</div>
        </div>
      </div>

      <!-- Notes -->
      <div style="margin-bottom:16px">
        <div style="font-size:.71rem;font-weight:600;color:var(--mid);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Notes</div>
        <textarea id="cycle-notes" rows="2"
          style="width:100%;padding:11px 13px;border:2px solid var(--border);border-radius:11px;font-size:.9rem;color:var(--dark);background:var(--cream);outline:none;resize:vertical;transition:border-color .2s"
          onfocus="this.style.borderColor='var(--rose)'" onblur="this.style.borderColor='var(--border)'"
          placeholder="Comment tu te sens aujourd'hui…">${existing?.notes || ''}</textarea>
      </div>

      <button class="btn btn-rose" id="cycle-submit-btn" onclick="handleCycleSubmit()">
        <i data-lucide="save" style="width:17px;height:17px"></i>
        <span id="cycle-btn-txt">Enregistrer</span>
      </button>
    </div>`;

  lucide.createIcons({ nodes: [document.getElementById('cycle-panel-log')] });
}

function onCycleDateChange(val) {
  if (!val) return;
  const date    = new Date(val);
  const dateFR  = fmtDate(date);
  const existing = window.cycleData.find(e => e.d === dateFR);
  if (existing) {
    selectedMood     = existing.mood || '';
    selectedSymptoms = new Set((existing.symptoms || '').split(',').filter(Boolean));
    isPeriodActive   = existing.period === 'O';
    document.getElementById('cycle-perf').value = existing.perf ?? 5;
    document.getElementById('perf-display').textContent = existing.perf ?? 5;
    document.getElementById('cycle-notes').value = existing.notes || '';
  }
  refreshMoodUI();
  refreshSymptomUI();
  refreshPeriodUI();
}

function togglePeriod() {
  isPeriodActive = !isPeriodActive;
  // If activating period, update cycle start to selected date
  if (isPeriodActive) {
    const dateVal = document.getElementById('cycle-date').value;
    if (dateVal) setCycleStart(new Date(dateVal));
  }
  refreshPeriodUI();
  window.renderCycleBanner?.();
}

function refreshPeriodUI() {
  const toggle = document.getElementById('period-toggle');
  if (!toggle) return;
  const label = toggle.querySelector('.period-toggle-label span');
  if (isPeriodActive) {
    toggle.classList.add('active');
    label.textContent = 'Règles actives aujourd\'hui';
  } else {
    toggle.classList.remove('active');
    label.textContent = 'Pas de règles aujourd\'hui';
  }
}

function selectMood(key) {
  selectedMood = selectedMood === key ? '' : key;
  refreshMoodUI();
}

function refreshMoodUI() {
  document.querySelectorAll('.mood-tag').forEach(el => {
    el.classList.toggle('selected', el.dataset.mood === selectedMood);
  });
}

function toggleSymptom(s) {
  if (selectedSymptoms.has(s)) selectedSymptoms.delete(s);
  else selectedSymptoms.add(s);
  refreshSymptomUI();
}

function refreshSymptomUI() {
  document.querySelectorAll('.symptom-chip').forEach(el => {
    el.classList.toggle('selected', selectedSymptoms.has(el.dataset.symptom));
  });
}

// ═══════════════════════════════════════════════════════════════════════
// CYCLE SUBMIT
// ═══════════════════════════════════════════════════════════════════════
async function handleCycleSubmit() {
  const dateVal = document.getElementById('cycle-date').value;
  if (!dateVal) { toast('Choisis une date', 'err'); return; }

  const dateObj = new Date(dateVal);
  const dateFR  = fmtDate(dateObj);
  const perf    = parseInt(document.getElementById('cycle-perf').value);
  const notes   = document.getElementById('cycle-notes').value;
  const day     = getCycleDay(dateObj);
  const phase   = day ? getPhase(day)?.name || '' : '';

  const entry = {
    d:        dateFR,
    phase:    phase,
    period:   isPeriodActive ? 'O' : 'N',
    mood:     selectedMood,
    symptoms: [...selectedSymptoms].join(','),
    perf:     perf,
    notes:    notes
  };

  // Update local data
  const idx = window.cycleData.findIndex(e => e.d === dateFR);
  if (idx >= 0) window.cycleData[idx] = entry;
  else window.cycleData.push(entry);

  toast('Ajouté localement', 'ok');
  window.renderCycleBanner?.();

  // Save to Sheets
  const btn = document.getElementById('cycle-submit-btn');
  const txt = document.getElementById('cycle-btn-txt');
  btn.disabled = true;
  txt.innerHTML = '<div class="spinner"></div> Sauvegarde…';

  try {
    const payload = {
      type:           'cycle',
      date:           dateFR,
      phase:          phase,
      period_active:  isPeriodActive ? 'O' : 'N',
      mood:           selectedMood,
      symptoms:       [...selectedSymptoms].join(','),
      gym_perf:       perf,
      notes:          notes
    };

    const res = await fetch(getWebhook(), {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    let json;
    try { json = await res.json(); } catch(e) { json = { success: res.ok }; }
    toast(json.success ? 'Cycle sauvegardé sur Drive' : 'Erreur sauvegarde', json.success ? 'ok' : 'err');
  } catch(err) {
    toast('Erreur réseau — données locales seulement', 'warn');
  } finally {
    btn.disabled = false;
    txt.textContent = 'Enregistrer';
  }
}

// ═══════════════════════════════════════════════════════════════════════
// CYCLE CALENDAR
// ═══════════════════════════════════════════════════════════════════════
let calYear, calMonth;

function renderCycleCalendar() {
  const now = new Date();
  if (calYear === undefined) { calYear = now.getFullYear(); calMonth = now.getMonth(); }
  buildCalendar();
}

function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  buildCalendar();
}

function buildCalendar() {
  const wrap      = document.getElementById('cycle-panel-calendar');
  const firstDay  = new Date(calYear, calMonth, 1);
  const daysInMon = new Date(calYear, calMonth+1, 0).getDate();
  const startDow  = (firstDay.getDay() + 6) % 7; // Monday-first
  const today     = new Date();
  const monthName = firstDay.toLocaleDateString('fr-FR', { month:'long', year:'numeric' });

  // Build a map of cycle data for this month
  const dataMap = {};
  window.cycleData.forEach(e => { dataMap[e.d] = e; });

  const dayHeaders = ['Lu','Ma','Me','Je','Ve','Sa','Di'].map(d =>
    `<div class="cal-day-hdr">${d}</div>`).join('');

  const empties = Array(startDow).fill('<div class="cal-day empty"></div>').join('');

  const days = Array.from({ length: daysInMon }, (_, i) => {
    const d       = i + 1;
    const date    = new Date(calYear, calMonth, d);
    const dateFR  = fmtDate(date);
    const isToday = date.toDateString() === today.toDateString();
    const entry   = dataMap[dateFR];
    const cycDay  = getCycleDay(date);
    const phase   = cycDay ? getPhase(cycDay) : null;
    const bg      = phase ? `background:${phase.bg}` : '';
    const hasDot  = entry ? 'has-data' : '';

    return `<div class="cal-day ${isToday ? 'today' : ''} ${hasDot}" style="${bg}" title="${phase ? phase.name : ''}" onclick="calDayClick('${dateFR}')">
      <span style="font-size:.8rem">${d}</span>
    </div>`;
  }).join('');

  // Phase legend
  const legend = PHASES.map(p =>
    `<div style="display:flex;align-items:center;gap:5px;font-size:.72rem;color:var(--mid)">
      <div style="width:10px;height:10px;border-radius:50%;background:${p.color}"></div>${p.name}
    </div>`).join('');

  wrap.innerHTML = `
    <div class="card" style="margin-top:14px">
      <div class="cal-header">
        <button class="cal-nav-btn" onclick="calNav(-1)"><i data-lucide="chevron-left"></i></button>
        <span>${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>
        <button class="cal-nav-btn" onclick="calNav(1)"><i data-lucide="chevron-right"></i></button>
      </div>
      <div class="cal-grid">${dayHeaders}${empties}${days}</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">${legend}</div>
    </div>`;

  lucide.createIcons({ nodes: [wrap] });
}

function calDayClick(dateFR) {
  // Switch to log and pre-fill date
  showCyclePanel('log');
  const input = document.getElementById('cycle-date');
  if (input) {
    const [d,m,y] = dateFR.split('/');
    input.value = `${y}-${m}-${d}`;
    onCycleDateChange(input.value);
  }
  document.querySelector('[data-cycle-tab="log"]')?.click();
}

// ═══════════════════════════════════════════════════════════════════════
// CORRELATION CHART
// ═══════════════════════════════════════════════════════════════════════
let corrChart;

function renderCorrelationChart() {
  const wrap = document.getElementById('cycle-panel-correlation');
  const start = getCycleStart();

  const entriesWithPerf = window.cycleData.filter(e => e.perf && getCycleDay(parseDate(e.d)));

  if (entriesWithPerf.length < 3) {
    wrap.innerHTML = `
      <div class="card" style="margin-top:14px">
        <div class="card-title"><i data-lucide="activity"></i> Performance vs Cycle</div>
        <div class="corr-empty">
          <i data-lucide="bar-chart-2" style="width:36px;height:36px;color:var(--border);margin-bottom:10px"></i>
          <div>Enregistre au moins 3 séances avec une note de performance<br>pour voir la corrélation avec ton cycle.</div>
        </div>
      </div>`;
    lucide.createIcons({ nodes: [wrap] });
    return;
  }

  // Group by cycle day and average perf
  const byDay = {};
  entriesWithPerf.forEach(e => {
    const day = getCycleDay(parseDate(e.d));
    if (!day) return;
    const cycDay = ((day - 1) % 28) + 1;
    if (!byDay[cycDay]) byDay[cycDay] = [];
    byDay[cycDay].push(e.perf);
  });

  const days    = Object.keys(byDay).map(Number).sort((a,b) => a-b);
  const avgPerf = days.map(d => +(byDay[d].reduce((a,b) => a+b, 0) / byDay[d].length).toFixed(1));

  // Phase background bands for chart
  const phaseAnnotations = PHASES.map(p => ({
    type: 'box',
    xMin: p.days[0] - 0.5,
    xMax: p.days[1] + 0.5,
    backgroundColor: p.bg,
    borderColor: 'transparent',
  }));

  wrap.innerHTML = `
    <div class="card" style="margin-top:14px">
      <div class="card-title"><i data-lucide="activity"></i> Performance vs Cycle</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
        ${PHASES.map(p => `
          <div style="display:flex;align-items:center;gap:5px;font-size:.73rem">
            <div style="width:10px;height:10px;border-radius:3px;background:${p.color}"></div>
            <span style="color:${p.color};font-weight:600">${p.name}</span>
          </div>`).join('')}
      </div>
      <div id="correlationChartWrap"><canvas id="corrChart"></canvas></div>
    </div>`;

  lucide.createIcons({ nodes: [wrap] });

  const ctx = document.getElementById('corrChart').getContext('2d');
  if (corrChart) corrChart.destroy();

  // Draw phase bands as background rectangles manually
  const bgPlugin = {
    id: 'phaseBands',
    beforeDraw(chart) {
      const { ctx: c, chartArea, scales } = chart;
      if (!chartArea) return;
      PHASES.forEach(p => {
        const x1 = scales.x.getPixelForValue(p.days[0] - 0.5);
        const x2 = scales.x.getPixelForValue(p.days[1] + 0.5);
        c.save();
        c.fillStyle = p.bg;
        c.fillRect(Math.max(x1, chartArea.left), chartArea.top, Math.min(x2, chartArea.right) - Math.max(x1, chartArea.left), chartArea.height);
        c.restore();
      });
    }
  };

  corrChart = new Chart(ctx, {
    type: 'line',
    plugins: [bgPlugin],
    data: {
      labels: days,
      datasets: [{
        label: 'Performance moyenne',
        data: avgPerf,
        borderColor: '#C0392B',
        backgroundColor: 'rgba(192,57,43,.1)',
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: days.map(d => {
          const ph = getPhase(d);
          return ph ? ph.color : '#C0392B';
        }),
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        tension: .35,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(44,36,32,.92)',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,.85)',
          callbacks: {
            title: items => `Jour ${items[0].label} du cycle`,
            label: c => ` Performance : ${c.raw} / 10`
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Jour du cycle', color: '#7F8C8D', font: { size: 11 } },
          ticks: { color: '#8A7A75', font: { size: 10 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          min: 1,
          max: 28
        },
        y: {
          title: { display: true, text: 'Performance (1–10)', color: '#7F8C8D', font: { size: 11 } },
          ticks: { color: '#8A7A75', font: { size: 10 } },
          grid: { color: 'rgba(0,0,0,.05)' },
          min: 1,
          max: 10
        }
      }
    }
  });
}
