# 🏋️ TrainHyp AI — Volume Optimizer

> **STAT3013 — Statistical Learning (2026)**  
> A clinical ML application predicting hypertrophic response to resistance training volume using an ensemble of interpretable AI models.

---

## 🚀 Quick Start

**Double-click `start.bat`** — it handles everything automatically:

1. Installs Python dependencies (`pip install`)
2. Installs Node dependencies (`npm install`)
3. Starts the **Backend** → [http://localhost:8000](http://localhost:8000)
4. Starts the **Frontend** → [http://localhost:5173](http://localhost:5173)

> **Requirements before first run:**
> - [Python 3.10+](https://www.python.org/downloads/) — must be added to PATH
> - [Node.js 18+](https://nodejs.org/) — must be added to PATH

---

## 📌 URLs

| Service | URL |
|---|---|
| Frontend App | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## 🧠 What Is This?

TrainHyp AI is a full-stack web application that:
1. Analyses a **systematic review dataset** of 69 RCTs (199 muscle-level observations)
2. Runs a **4-model ensemble** (EBM-GAM · NGBoost · CatBoost · GPR) to predict Hedges' g hypertrophy effect sizes
3. Recommends **optimal weekly training volume** (sets/week) for an individual's clinical profile
4. Provides **probabilistic uncertainty estimates** and safety guardrails against out-of-distribution inputs

---

## 📊 Application Pages

| Page | Description |
|---|---|
| **Data Overview** | Dataset explorer — histogram, boxplot, filters |
| **Volume vs Hypertrophy** | Scatter analysis — 199 real observations, Pearson r |
| **Volume Optimizer** | Main AI prediction — custom profile sliders, dose-response curve |
| **Case Study** | Clinical report — pick a case, get full AI analysis |

---

## 🗂️ Project Structure

```
pttk/
├── start.bat                   ← Run this to launch everything
├── AI_ML/
│   ├── main_fastapi.py         # FastAPI backend
│   ├── ai_engine.py            # Ensemble inference engine
│   ├── backend_models/         # Trained .pkl model files
│   ├── data_features.csv       # Training dataset (199 obs)
│   └── requirements.txt        # Python dependencies
├── src/
│   ├── pages/                  # React pages
│   ├── components/             # Sidebar, Header, ErrorBoundary
│   └── data/                   # studyData.ts, test_cases.json
└── public/
    └── docs/
        └── report.docx         ← Place report file here
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React **19** · Vite · TypeScript · Tailwind CSS v4 |
| Charts | Recharts |
| Backend | FastAPI (Python 3.10+) |
| ML Models | EBM-GAM · NGBoost · CatBoost · GPR |
| Font | Inter (Google Fonts) |

---

## 🔐 Environment Variables

```bash
# Copy .env.example → .env.local and fill in your key
GEMINI_API_KEY=your_key_here
```

---

*STAT3013 Statistical Learning · 2026*
