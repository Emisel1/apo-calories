# Apo-Calories — Full Overhaul Design
*2026-05-07*

## Scope
Four deliverables on top of the existing single-file app:
1. Authentication (login gate)
2. UI redesign (responsive, professional)
3. Cycle tracker tab with Google Sheets persistence
4. End-to-end test (add entry → verify Sheet updated)

---

## 1. Authentication

### Approach
Client-side only (GitHub Pages = static hosting, no server).
Password hashed with SHA-256 via Web Crypto API — never stored plain.

### Credentials
- Username: `apolline`
- PIN: `030325`
- SHA-256 hash stored as constant in `auth.js`

### Session
- Login sets `sessionStorage.apo_auth = "1"` → clears on tab close
- "Se souvenir" checkbox → `localStorage.apo_auth = "1"` → persists
- Every page load checks for valid session before rendering app

### Login screen
- Full-page rose gradient (matches header)
- Centered card: 🌸 logo + title, username input, PIN input (type=password), submit button
- Wrong credentials → shake animation + error message
- No "forgot password" (personal app)

---

## 2. File Structure

Split the monolithic `index.html` into:

```
apo-calories/
├── index.html          # Shell: imports everything, auth gate
├── style.css           # All styles
├── auth.js             # Login logic + session check
├── app.js              # Calories tracking (existing logic, cleaned up)
├── cycle.js            # Cycle tracking logic
└── favicon.svg         # Fix the 404
```

GitHub Pages serves all files from repo root — no build step needed.

---

## 3. UI Redesign

### Layout
- **Desktop (>768px):** Sticky left sidebar (200px) + main content area (max 760px)
- **Mobile (<768px):** Bottom tab bar (fixed, 5 icons) — iOS app feel
- Max total width: 1080px, centered

### Icons
**Lucide Icons** via CDN (`unpkg.com/lucide@latest`) — crisp SVG strokes, no emoji anywhere in UI.
Nav, buttons, form labels, status indicators all use Lucide SVG icons.

### Visual changes
- Keep rose/sage/cream palette — it works
- Better card shadows (softer, layered)
- Micro-animations: tab transitions (fade+slide), form submit (pulse)
- Better empty states (clean SVG illustration + message)
- Loading skeleton instead of "Chargement…"
- Larger touch targets on mobile (min 44px)
- No emoji in UI — Lucide icons only throughout

### Navigation tabs (6 total)
1. 🏠 Accueil
2. ➕ Ajouter
3. 📈 Graphique
4. 📊 Stats
5. 🌸 Cycle *(new)*
6. ⚙️ Config

Profile tab merged into Config (static data, no need for own tab).

---

## 4. Cycle Tracker

### Daily log fields
| Field | Type |
|---|---|
| Date | date picker (auto = today) |
| Period active | toggle (🔴 on / off) |
| Mood | tags: 😊 Happy · 😤 Irritable · 😰 Anxious · 😴 Fatiguée · 🥰 Bien |
| Symptoms | checkboxes: Crampes · Ballonnements · Maux de tête · Seins · Acné · Fringales · Dos |
| Gym performance | 1–10 slider (labeled: 1=très mauvais, 10=record) |
| Notes | free text |

### Phase auto-calculation
From last period start date:
- Day 1–5: 🔴 Menstruelle
- Day 6–13: 🌱 Folliculaire
- Day 14–16: ⚡ Ovulation
- Day 17–28: 🌙 Lutéale
- Day 29+: ❓ Vérifier (prompt to log new period)

Average cycle = 28 days (configurable).

### Dashboard widget
Small banner below stats strip showing:
- Current phase name + icon + color
- Day N of cycle
- 1-line tip (e.g., "Phase lutéale — énergie peut baisser, mange +100–200 kcal si besoin")

### Cycle tab views
1. **Log** — form to add/edit today's entry
2. **Calendrier** — monthly view, each day colored by phase, dots for symptoms
3. **Corrélation** — line chart: x = cycle day (1–28), y = avg gym performance, color-coded by phase bands. Shows if she lifts better in follicular/ovulation vs luteal/menstrual.

---

## 5. Google Sheets Structure

### Existing sheet: `Calories` (unchanged columns)
date | jour | seance | resto | kcal | prot | gluc | lip | poids | energie | notes

### New sheet: `Cycle`
date | phase | period_active | mood | symptoms | gym_perf | notes

`symptoms` stored as comma-separated string (e.g. `"Crampes,Ballonnements"`).

### Apps Script updates
- `doGet` — returns both sheets: `{ calories: [...], cycle: [...] }`
- `doPost` — routes by `payload.type`: `"calories"` → Calories sheet, `"cycle"` → Cycle sheet
- No breaking changes to existing calorie write path

---

## 6. Google Sheets — Cycle Sheet Columns

| Col | Header | Type | Example |
|---|---|---|---|
| A | date | DD/MM/YYYY | 07/05/2026 |
| B | phase | string | Folliculaire |
| C | period_active | O/N | O |
| D | mood | string | Happy |
| E | symptoms | string | Crampes,Ballonnements |
| F | gym_perf | number 1–10 | 8 |
| G | notes | string | Bonne séance malgré fatigue |

---

## 7. End-to-End Test Plan

After implementation:
1. Open site → redirected to login
2. Enter `apolline` / `030325` → access granted
3. Navigate to ➕ Ajouter → add today's entry (2200 kcal, Muscu)
4. Playwright opens Google Sheets → verify new row in `Calories` tab
5. Navigate to 🌸 Cycle → add cycle entry (phase=Folliculaire, mood=Happy, gym_perf=8)
6. Playwright opens Google Sheets → verify new row in `Cycle` tab
7. Reload page → data loads from Drive, both entries visible

---

## 8. Credentials Summary (give to Apolline)

```
URL:       https://emisel1.github.io/apo-calories/
Username:  apolline
PIN:       030325
```
