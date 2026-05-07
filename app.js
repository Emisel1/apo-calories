// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyV7zqAuAA6BaEj2DTMN3FnG2DJ_7Nu5d6i155JAvhPII68dyXRibVUY4YcQSGLHY5N/exec';
const TDEE       = 2876;
const OBJ_NORMAL = 2000;
const OBJ_SEANCE = 2200;
const OBJ_COURSE = 2400;

// ═══════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════
let allData = [
  {d:'16/02/2026',j:'Lun',s:'Muscu',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'17/02/2026',j:'Mar',s:'Muscu',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'18/02/2026',j:'Mer',s:'Repos',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'19/02/2026',j:'Jeu',s:'Muscu',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'20/02/2026',j:'Ven',s:'SW',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'21/02/2026',j:'Sam',s:'Repos',r:'O',k:2650,p:null,po:null,e:null,n:'Repas sortie'},
  {d:'22/02/2026',j:'Dim',s:'Repos',r:'O',k:2650,p:null,po:null,e:null,n:'Repas sortie'},
  {d:'23/02/2026',j:'Lun',s:'Muscu',r:'N',k:2430,p:null,po:null,e:null,n:''},
  {d:'24/02/2026',j:'Mar',s:'SW',r:'N',k:2500,p:null,po:null,e:null,n:''},
  {d:'25/02/2026',j:'Mer',s:'Course',r:'N',k:1850,p:null,po:null,e:null,n:'1h course'},
  {d:'26/02/2026',j:'Jeu',s:'Muscu — Pull',r:'O',k:2400,p:null,po:null,e:null,n:''},
  {d:'27/02/2026',j:'Ven',s:'Muscu — Push',r:'O',k:2550,p:null,po:null,e:null,n:''},
  {d:'28/02/2026',j:'Sam',s:'Repos',r:'O',k:2500,p:null,po:null,e:null,n:''},
  {d:'01/03/2026',j:'Dim',s:'Muscu — Legs',r:'O',k:2500,p:null,po:null,e:null,n:''},
  {d:'02/03/2026',j:'Lun',s:'Muscu',r:'N',k:2100,p:null,po:null,e:null,n:''},
  {d:'03/03/2026',j:'Mar',s:'SW',r:'N',k:2100,p:null,po:null,e:null,n:''},
  {d:'04/03/2026',j:'Mer',s:'Course',r:'N',k:2200,p:null,po:null,e:null,n:'1h course'},
  {d:'05/03/2026',j:'Jeu',s:'Muscu',r:'O',k:2500,p:null,po:null,e:null,n:''},
  {d:'06/03/2026',j:'Ven',s:'Muscu',r:'N',k:2300,p:null,po:null,e:null,n:''},
  {d:'07/03/2026',j:'Sam',s:'Repos',r:'N',k:2000,p:null,po:null,e:null,n:''},
  {d:'08/03/2026',j:'Dim',s:'Repos',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'09/03/2026',j:'Lun',s:'Muscu',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'10/03/2026',j:'Mar',s:'SW',r:'N',k:1900,p:null,po:null,e:null,n:''},
  {d:'11/03/2026',j:'Mer',s:'Course',r:'N',k:2100,p:null,po:null,e:null,n:'1h course'},
  {d:'12/03/2026',j:'Jeu',s:'Muscu',r:'N',k:1950,p:null,po:null,e:null,n:''},
  {d:'13/03/2026',j:'Ven',s:'Muscu',r:'N',k:2200,p:null,po:null,e:null,n:''},
  {d:'14/03/2026',j:'Sam',s:'SW',r:'N',k:2500,p:null,po:null,e:null,n:''},
  {d:'15/03/2026',j:'Dim',s:'Repos',r:'O',k:2300,p:null,po:null,e:null,n:''},
  {d:'16/03/2026',j:'Lun',s:'Muscu',r:'N',k:2000,p:null,po:null,e:null,n:''},
  {d:'17/03/2026',j:'Mar',s:'Muscu',r:'N',k:2200,p:null,po:null,e:null,n:''},
  {d:'18/03/2026',j:'Mer',s:'Course',r:'N',k:2100,p:null,po:null,e:null,n:'1h course'},
  {d:'19/03/2026',j:'Jeu',s:'Muscu',r:'N',k:2400,p:null,po:null,e:null,n:''},
  {d:'20/03/2026',j:'Ven',s:'SW',r:'N',k:2400,p:null,po:null,e:null,n:''},
  {d:'21/03/2026',j:'Sam',s:'Repos',r:'N',k:2200,p:null,po:null,e:null,n:''},
  {d:'22/03/2026',j:'Dim',s:'Repos',r:'N',k:2500,p:null,po:null,e:null,n:''},
  {d:'23/03/2026',j:'Lun',s:'Muscu',r:'N',k:2400,p:null,po:null,e:null,n:''},
  {d:'24/03/2026',j:'Mar',s:'SW',r:'N',k:1825,p:null,po:null,e:null,n:''},
  {d:'25/03/2026',j:'Mer',s:'Course',r:'N',k:1600,p:null,po:null,e:null,n:'1h course'},
  {d:'26/03/2026',j:'Jeu',s:'Muscu',r:'N',k:2000,p:null,po:null,e:null,n:''},
  {d:'27/03/2026',j:'Ven',s:'Muscu',r:'N',k:2300,p:null,po:null,e:null,n:''},
  {d:'28/03/2026',j:'Sam',s:'Repos',r:'N',k:3400,p:null,po:null,e:null,n:'Repas spécial'},
  {d:'29/03/2026',j:'Dim',s:'Repos',r:'N',k:1715,p:null,po:null,e:null,n:''},
  {d:'30/03/2026',j:'Lun',s:'Muscu',r:'N',k:2600,p:null,po:null,e:null,n:''},
  {d:'31/03/2026',j:'Mar',s:'SW',r:'N',k:1800,p:null,po:null,e:null,n:''},
  {d:'01/04/2026',j:'Mer',s:'Course',r:'N',k:2000,p:null,po:null,e:null,n:'1h course'},
  {d:'02/04/2026',j:'Jeu',s:'Muscu',r:'N',k:2100,p:null,po:null,e:null,n:''},
  {d:'03/04/2026',j:'Ven',s:'Muscu',r:'N',k:2100,p:null,po:null,e:null,n:''},
  {d:'04/04/2026',j:'Sam',s:'SW',r:'N',k:2100,p:null,po:null,e:null,n:''},
  {d:'05/04/2026',j:'Dim',s:'Repos',r:'N',k:2800,p:null,po:null,e:null,n:''},
  {d:'06/04/2026',j:'Lun',s:'Muscu',r:'N',k:1900,p:null,po:null,e:null,n:''},
];

// ═══════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════
function parseDate(s) { const [d,m,y] = s.split('/'); return new Date(+y, +m-1, +d); }
function fmtDate(date) { return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`; }
function dayName(date) { return ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][date.getDay()]; }
function sorted() { return [...allData].sort((a,b) => parseDate(a.d) - parseDate(b.d)); }

function getObj(seance) {
  if (!seance || seance === 'Repos') return OBJ_NORMAL;
  if (seance.includes('Course')) return OBJ_COURSE;
  return OBJ_SEANCE;
}

function movingAvg(data, i, w=7) {
  const sl = data.slice(Math.max(0, i-w+1), i+1);
  return Math.round(sl.reduce((a,x) => a+x.k, 0) / sl.length);
}

function kFmt(n) { return n?.toLocaleString('fr-FR') || '—'; }

function badge(k, seance) {
  const obj = getObj(seance);
  if (k <= obj) return { txt:'Objectif',   cls:'bg-green' };
  if (k <= TDEE) return { txt:'Acceptable', cls:'bg-yellow' };
  return              { txt:'Dépassement', cls:'bg-red' };
}

function getWebhook() { return localStorage.getItem('apo_webhook') || WEBHOOK_URL; }

// ═══════════════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════════════
function toast(msg, type='ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  setTimeout(() => t.className = '', 3000);
}

// ═══════════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════════
function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  document.querySelectorAll(`[data-tab="${name}"]`).forEach(b => b.classList.add('active'));

  if (name === 'graphique') { renderMainChart(); renderWeekBars(); }
  if (name === 'stats')     renderStatsTable();
  if (name === 'cycle')     window.renderCycleTab?.();
}

// ═══════════════════════════════════════════════════════════════════════
// DATA LOADING
// ═══════════════════════════════════════════════════════════════════════
async function loadDataFromSheets() {
  const url = getWebhook();
  if (!url) return;
  try {
    const res  = await fetch(url);
    const json = await res.json();
    if (!json.success) return;

    // Support both old format {data:[]} and new {calories:[], cycle:[]}
    const calories = json.calories || json.data || [];
    const cycle    = json.cycle    || [];

    if (calories.length > 0) {
      allData = calories.map(r => ({
        d:  r.date,
        j:  r.jour,
        s:  r.seance,
        r:  r.resto,
        k:  +r.kcal,
        p:  r.prot   ? +r.prot   : null,
        po: r.poids  ? +r.poids  : null,
        e:  r.energie ? +r.energie : null,
        n:  r.notes  || ''
      }));
    }

    if (cycle.length > 0) {
      window.cycleData = cycle.map(r => ({
        d:        r.date,
        phase:    r.phase,
        period:   r.period_active,
        mood:     r.mood,
        symptoms: r.symptoms || '',
        perf:     r.gym_perf ? +r.gym_perf : null,
        notes:    r.notes    || ''
      }));
      window.refreshCycle?.();
    }

    renderDashboard();
    toast('Données rechargées depuis Drive', 'ok');
  } catch(err) {
    console.warn('Could not load from sheets:', err);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function renderDashboard() {
  const s = sorted();
  if (!s.length) return;

  // Stats strip
  const last7 = s.slice(-7);
  const avg7  = Math.round(last7.reduce((a,x) => a+x.k, 0) / last7.length);
  const last  = s[s.length - 1];
  const total = s.length;
  const ok    = s.filter(x => x.k <= getObj(x.s)).length;
  const pct   = Math.round(ok / total * 100);

  document.getElementById('s-avg7').textContent = kFmt(avg7);
  const diff = avg7 - OBJ_NORMAL;
  document.getElementById('s-avg7-sub').textContent = diff <= 0 ? 'Dans l\'objectif' : `+${diff} kcal`;
  document.getElementById('s-avg7-sub').className   = 'stat-sub ' + (avg7 <= OBJ_SEANCE ? 'c-green' : avg7 <= TDEE ? 'c-orange' : 'c-red');

  document.getElementById('s-last').textContent = kFmt(last.k);
  const lb = badge(last.k, last.s);
  document.getElementById('s-last-sub').textContent = lb.txt;
  document.getElementById('s-last-sub').className   = 'stat-sub ' + (last.k <= getObj(last.s) ? 'c-green' : last.k <= TDEE ? 'c-orange' : 'c-red');

  document.getElementById('s-days').textContent = total;
  document.getElementById('s-days-sub').textContent = `${pct}% objectif`;
  document.getElementById('s-days-sub').className   = 'stat-sub ' + (pct >= 70 ? 'c-green' : pct >= 50 ? 'c-orange' : 'c-red');

  // Objectif du jour
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  document.getElementById('o-tdee').textContent = kFmt(TDEE);
  document.getElementById('o-obj').textContent  = kFmt(isWeekend ? OBJ_NORMAL : OBJ_SEANCE);
  document.getElementById('o-type').textContent = `kcal · ${isWeekend ? 'jour repos' : 'jour séance'}`;

  // Entries list (last 7)
  const recent = s.slice(-7).reverse();
  document.getElementById('entry-list').innerHTML = recent.map(e => {
    const b = badge(e.k, e.s);
    return `<div class="entry-row">
      <span class="entry-date">${e.d}</span>
      <div>
        <div class="entry-kcal">${kFmt(e.k)} kcal</div>
        <div class="entry-seance">${e.s || '—'}${e.r === 'O' ? ' · Restaurant' : ''}</div>
      </div>
      <span class="entry-badge ${b.cls}">${b.txt}</span>
    </div>`;
  }).join('');

  // Mini chart
  renderMiniChart(s.slice(-14));

  // Phase banner (cycle.js)
  window.renderCycleBanner?.();
}

// ═══════════════════════════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════════════════════════
let miniChart, mainChart;
let currentRange = 14;

function renderMiniChart(data) {
  const ctx = document.getElementById('miniChart').getContext('2d');
  if (miniChart) miniChart.destroy();
  miniChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(x => x.d.slice(0,5)),
      datasets: [
        {
          data: data.map(x => x.k),
          backgroundColor: data.map(x =>
            x.k <= getObj(x.s) ? 'rgba(30,132,73,.6)' :
            x.k <= TDEE        ? 'rgba(212,172,13,.6)' :
                                 'rgba(192,57,43,.6)'
          ),
          borderRadius: 5
        },
        {
          type: 'line',
          data: data.map((_,i) => movingAvg(data,i)),
          borderColor: '#8E44AD',
          borderWidth: 2,
          pointRadius: 0,
          tension: .4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw} kcal` } } },
      scales: {
        x: { ticks: { color: '#8A7A75', font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: '#8A7A75', font: { size: 9 } }, grid: { color: 'rgba(0,0,0,.04)' }, min: 1000, max: 3600 }
      }
    }
  });
}

function setRange(r) {
  currentRange = r;
  document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
  const ids = { 14:'r14', 30:'r30', 90:'r90', 9999:'rall' };
  if (ids[r]) document.getElementById(ids[r]).classList.add('active');
  renderMainChart();
}

function renderMainChart() {
  const s    = sorted();
  const data = currentRange >= 9999 ? s : s.slice(-currentRange);
  const ctx  = document.getElementById('myChart').getContext('2d');
  if (mainChart) mainChart.destroy();
  mainChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(x => x.d.slice(0,5)),
      datasets: [
        { label:'TDEE',       data: data.map(() => TDEE),           borderColor:'#C0392B', borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false, tension:0 },
        { label:'Objectif',   data: data.map(x => getObj(x.s)),     borderColor:'#E67E22', borderWidth:1.5, borderDash:[4,3], pointRadius:0, fill:false, tension:0 },
        { label:'Consommées', data: data.map(x => x.k),
          borderColor:'#7A9E87', backgroundColor:'rgba(122,158,135,.12)', borderWidth:2,
          pointRadius: 3,
          pointBackgroundColor: data.map(x => x.k <= getObj(x.s) ? '#1E8449' : x.k <= TDEE ? '#D4AC0D' : '#C0392B'),
          fill: true, tension: .3
        },
        { label:'Moy.7j', data: data.map((_,i) => movingAvg(data,i)), borderColor:'#8E44AD', borderWidth:2.5, pointRadius:0, fill:false, tension:.4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode:'index', intersect:false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(44,36,32,.92)',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,.8)',
          padding: 10,
          cornerRadius: 10,
          callbacks: { label: c => ` ${c.dataset.label}: ${c.raw} kcal` }
        }
      },
      scales: {
        x: { ticks: { color:'#8A7A75', font:{ size:10 }, maxTicksLimit:10 }, grid: { color:'rgba(0,0,0,.04)' } },
        y: { ticks: { color:'#8A7A75', font:{ size:10 } }, grid: { color:'rgba(0,0,0,.05)' }, min:1000, max:3800 }
      }
    }
  });
}

function renderWeekBars() {
  const s    = sorted();
  const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const avgs = days.map(d => {
    const ds = s.filter(x => x.j === d);
    return ds.length ? Math.round(ds.reduce((a,x) => a+x.k, 0) / ds.length) : 0;
  });
  const maxV = Math.max(...avgs, 1);
  document.getElementById('week-bars').innerHTML = avgs.map((v,i) => {
    const pct = Math.round((v / maxV) * 70);
    const clr = v <= OBJ_SEANCE ? 'var(--sage)' : v <= TDEE ? 'var(--orange)' : 'var(--red)';
    return `<div class="week-bar-wrap">
      <div class="week-val-lbl" style="color:${clr}">${v || '—'}</div>
      <div class="week-bar" style="height:${pct}px;background:${clr}"></div>
      <div class="week-day-lbl">${days[i]}</div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════════════
// STATS TABLE
// ═══════════════════════════════════════════════════════════════════════
function renderStatsTable() {
  const s = sorted();
  if (!s.length) { document.getElementById('stats-table').innerHTML = '<tr><td class="empty" colspan="2">Aucune donnée</td></tr>'; return; }

  const kcals     = s.map(x => x.k);
  const avg       = Math.round(kcals.reduce((a,b) => a+b, 0) / kcals.length);
  const avg7      = Math.round(s.slice(-7).reduce((a,x) => a+x.k, 0) / Math.min(7, s.length));
  const mn        = Math.min(...kcals);
  const mx        = Math.max(...kcals);
  const med       = kcals.slice().sort((a,b) => a-b)[Math.floor(kcals.length/2)];
  const okDays    = s.filter(x => x.k <= getObj(x.s)).length;
  const restoOk   = s.filter(x => x.r === 'O');
  const normalOk  = s.filter(x => x.r === 'N');
  const restoAvg  = restoOk.length  ? Math.round(restoOk.reduce((a,x)  => a+x.k, 0) / restoOk.length)  : 0;
  const normalAvg = normalOk.length ? Math.round(normalOk.reduce((a,x) => a+x.k, 0) / normalOk.length) : 0;
  const courseDays = s.filter(x => x.s?.includes('Course'));
  const courseAvg  = courseDays.length ? Math.round(courseDays.reduce((a,x) => a+x.k, 0) / courseDays.length) : 0;
  const defTotal   = kcals.reduce((a,b) => a+b, 0) - TDEE * s.length;
  const defAvg     = Math.round(defTotal / s.length);

  const rows = [
    ['sec', 'Calories — Vue globale'],
    ['Jours enregistrés', s.length],
    ['Moyenne globale', `${kFmt(avg)} kcal`],
    ['Moyenne 7 derniers jours', `${kFmt(avg7)} kcal`],
    ['Minimum', `${kFmt(mn)} kcal`],
    ['Maximum', `${kFmt(mx)} kcal`],
    ['Médiane', `${kFmt(med)} kcal`],
    ['sec', 'Respect des objectifs'],
    ['Jours objectif atteint', `${okDays} / ${s.length} (${Math.round(okDays/s.length*100)}%)`],
    ['Déficit cumulé total', `${kFmt(Math.abs(Math.round(defTotal)))} kcal`],
    ['Déficit moyen / jour', `${kFmt(Math.abs(defAvg))} kcal`],
    ['Perte théorique estimée', `~${Math.abs(defTotal/7700).toFixed(1)} kg`],
    ['sec', 'Impact restaurant'],
    ['Jours restaurant', restoOk.length],
    ['Moy. calories jour resto', `${kFmt(restoAvg)} kcal`],
    ['Moy. calories jour normal', `${kFmt(normalAvg)} kcal`],
    ['Surcoût restaurant', `+${kFmt(restoAvg - normalAvg)} kcal`],
    ['sec', 'Course'],
    ['Jours de course', courseDays.length],
    ['Moy. calories jour course', `${kFmt(courseAvg)} kcal`],
  ];

  document.getElementById('stats-table').innerHTML = `
    <colgroup><col width="60%"><col width="40%"></colgroup>
    ${rows.map(([l,v]) => l === 'sec'
      ? `<tr><td class="stats-section" colspan="2">${v}</td></tr>`
      : `<tr><td>${l}</td><td style="text-align:right;font-weight:600">${v}</td></tr>`
    ).join('')}`;
}

// ═══════════════════════════════════════════════════════════════════════
// FORM SUBMIT
// ═══════════════════════════════════════════════════════════════════════
async function handleSubmit() {
  const dateVal = document.getElementById('f-date').value;
  const seance  = document.getElementById('f-seance').value;
  const kcal    = parseInt(document.getElementById('f-kcal').value);
  const prot    = parseInt(document.getElementById('f-prot').value) || null;
  const resto   = document.getElementById('f-resto').value;
  const poids   = parseFloat(document.getElementById('f-poids').value) || null;
  const energie = parseInt(document.getElementById('f-energie').value) || null;
  const notes   = document.getElementById('f-notes').value;

  if (!dateVal)                   { toast('Choisis une date', 'err'); return; }
  if (!kcal || kcal<500 || kcal>6000) { toast('Calories invalides (500–6000)', 'err'); return; }

  const dateObj = new Date(dateVal);
  const dateFR  = fmtDate(dateObj);
  const jour    = dayName(dateObj);

  const existing = allData.find(x => x.d === dateFR);
  if (existing) Object.assign(existing, { j:jour, s:seance, r:resto, k:kcal, p:prot, po:poids, e:energie, n:notes });
  else allData.push({ d:dateFR, j:jour, s:seance, r:resto, k:kcal, p:prot, po:poids, e:energie, n:notes });

  renderDashboard();
  toast('Ajouté localement', 'ok');

  setLoading(true);
  try {
    const payload = {
      type:    'calories',
      date:    dateFR,
      jour:    jour,
      seance:  seance,
      resto:   resto,
      kcal:    kcal,
      prot:    prot,
      gluc:    null,
      lip:     null,
      poids:   poids,
      energie: energie,
      notes:   notes || ''
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

    toast(json.success ? 'Sauvegardé sur Google Drive' : (json.error || 'Erreur'), json.success ? 'ok' : 'err');
  } catch(err) {
    toast('Erreur réseau — données locales seulement', 'warn');
  } finally {
    setLoading(false);
  }
}

function setLoading(v) {
  const btn = document.getElementById('submit-btn');
  const txt = document.getElementById('btn-txt');
  btn.disabled = v;
  txt.innerHTML = v ? '<div class="spinner"></div> Sauvegarde…' : 'Enregistrer';
}

// ═══════════════════════════════════════════════════════════════════════
// INIT (called by auth.js after successful login)
// ═══════════════════════════════════════════════════════════════════════
function initApp() {
  // Set today's date in form
  document.getElementById('f-date').valueAsDate = new Date();

  // Seance change → update objective reminder
  document.getElementById('f-seance').addEventListener('change', function() {
    const obj = getObj(this.value);
    const txt = this.value.includes('Course') ? 'Jour de course — objectif +400 kcal' :
                this.value === 'Repos'         ? 'Jour de repos — objectif minimal' :
                                                 'Jour de séance — objectif +200 kcal vs repos';
    document.getElementById('obj-reminder-txt').textContent = `${txt} : ${kFmt(obj)} kcal`;
  });

  // Webhook config save
  const webhookInput = document.getElementById('webhook-url');
  if (webhookInput) {
    webhookInput.value = localStorage.getItem('apo_webhook') || WEBHOOK_URL;
    webhookInput.addEventListener('change', () => {
      localStorage.setItem('apo_webhook', webhookInput.value.trim());
      toast('URL sauvegardée', 'ok');
    });
  }

  // Enter key on add form
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('tab-ajouter').classList.contains('active')) {
      handleSubmit();
    }
  });

  // Load live data
  loadDataFromSheets();
  renderDashboard();
}
