# Geometry Sensitivity Test – Visual Figures
**اختبار الحساسية للهندسة في الأشكال البصرية**

An interactive research tool for measuring geometry sensitivity in visual figures for individuals aged **3–51 years**.

---

## Project Structure

```
geometry_test/
├── index.html              ← Main page (7 section cards + start banner)
├── css/
│   ├── main.css            ← Main page styles
│   ├── shared.css          ← Shared styles (progress bar, timer, coloring)
│   ├── practice-items.css
│   ├── topology.css
│   ├── euclidean.css
│   ├── geometric.css
│   ├── symmetry.css
│   ├── metric.css
│   ├── transform.css
│   └── experiments.css
├── js/
│   ├── geo-core.js         ← Shared library (timer, scores, section locking)
│   ├── app.js              ← Practice items logic
│   ├── topology.js
│   ├── euclidean.js
│   ├── geometric.js
│   ├── symmetry.js
│   ├── metric.js
│   ├── transform.js
│   └── experiments.js
└── sections/
    ├── intro-form.html     ← Participant data form
    ├── practice-items.html
    ├── topology.html
    ├── euclidean.html
    ├── geometric.html
    ├── symmetry.html
    ├── metric.html
    ├── transform.html
    ├── results.html        ← Full results page
    └── experiments.html    ← Research experiments (Exp 2 & 3)
```

---

## Test Sections

| # | Section (Arabic) | Domain | Items |
|---|-----------------|--------|-------|
| 1 | البنود التدريبية | Practice Items | 2 |
| 2 | الطوبولوجيا | Topology | 4 |
| 3 | الهندسة الإقليدية | Euclidean Geometry | 8 |
| 4 | الأشكال الهندسية | Geometrical Figures | 8 |
| 5 | التماثل والأشكال اليدوية | Symmetry & Chiral Figures | 8 |
| 6 | الخصائص المترية | Metric Properties | 8 |
| 7 | التحويلات الهندسية | Geometrical Transformations | 8 |

**Total:** 46 items (44 scored, excluding practice)

---

## Test Flow

```
index.html
  └─► intro-form.html       (Participant info: name, age, gender, education)
        └─► practice-items.html
              └─► topology.html
                    └─► euclidean.html
                          └─► geometric.html
                                └─► symmetry.html
                                      └─► metric.html
                                            └─► transform.html
                                                  └─► results.html
```

---

## Features

- **Section Locking** — Each section requires the previous one to be completed before access
- **Timer** — Measures time spent in each section
- **Color-coded Progress Bar** — Steps turn green (correct) or red (wrong) after each answer
- **Auto-advance** — Automatically moves to the next item 1 second after answering
- **Score Saving** — Saves scores and elapsed time to `localStorage`
- **Results Page** — Overall score, performance & time bar charts, print / copy to clipboard
- **Participant Profile** — View participant data and progress at any time
- **Data Reset** — Clear all data and restart the test

---

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — No frameworks
- **RTL Arabic UI** — Full Arabic interface (`lang="ar" dir="rtl"`)
- **Material Icons** — via jsDelivr CDN
- **localStorage** — Client-side session persistence

### localStorage Keys

| Key | Content |
|-----|---------|
| `geoParticipant` | Participant data (JSON) |
| `geoScores` | Score and time per section (JSON) |
| `geoDone` | Array of completed section keys |

---

## Running the Project

The tool runs entirely in the browser with no server required:

```bash
# Open directly in browser
open geometry_test/index.html
```

Or use a simple local server:

```bash
cd geometry_test
python -m http.server 8000
# Then open: http://localhost:8000
```

---

## License

Academic research tool — All rights reserved.

