# 🏋️ TrainHyp AI — Volume Optimizer

> **STAT3013 — Statistical Learning (2026)**
> A clinical ML application that predicts hypertrophic response to resistance training volume using an ensemble of interpretable AI models.

---

## 🧠 What Is This?

TrainHyp AI is a full-stack web application that:
1. Analyses a **systematic review dataset** of 69 RCTs (199 muscle-level observations)
2. Runs a **4-model ensemble** (EBM-GAM · NGBoost · CatBoost · GPR) to predict Hedges' g hypertrophy effect sizes
3. Recommends **optimal weekly training volume** (sets/week) for an individual's clinical profile
4. Provides **probabilistic uncertainty estimates** and safety guardrails against out-of-distribution inputs

---

## 🗂️ Project Structure

```
pttk/
├── AI_ML/                      # Python backend
│   ├── main_fastapi.py         # FastAPI entrypoint — REST API
│   ├── ai_engine.py            # Ensemble inference engine (loads .pkl models)
│   ├── backend_models/         # Trained model artefacts (.pkl files)
│   │   ├── ebm_model.pkl       # Explainable Boosting Machine (primary)
│   │   ├── ngb_model.pkl       # NGBoost (uncertainty quantification)
│   │   ├── catboost_clf.pkl    # CatBoost (responder classification)
│   │   ├── gpr_model.pkl       # Gaussian Process Regression
│   │   ├── meta.pkl            # SHAP feature importance + metadata
│   │   ├── scaler.pkl          # StandardScaler for continuous features
│   │   ├── imputer_cont.pkl    # Median imputer — continuous features
│   │   └── imputer_bin.pkl     # Median imputer — binary features
│   ├── data_features.csv       # 13-feature training dataset (199 obs)
│   ├── data_cleaned.csv        # Full cleaned dataset (all columns)
│   ├── requirements.txt        # Python dependencies
│   ├── start_backend.bat       # Windows one-click backend launcher
│   └── NB0*_*.ipynb            # Training notebooks (EBM, NGBoost, CatBoost, GPR)
│
├── src/
│   ├── pages/
│   │   ├── DataOverview.tsx        # Dataset statistics & visualisation
│   │   ├── VolumeVsHypertrophy.tsx # Scatter analysis & correlations
│   │   ├── VolumeOptimizer.tsx     # Main AI prediction interface
│   │   └── CaseStudy.tsx           # Per-case clinical report
│   ├── components/
│   │   ├── Sidebar.tsx             # Navigation
│   │   ├── Header.tsx              # Top bar
│   │   └── ErrorBoundary.tsx       # Global error fallback
│   ├── data/
│   │   ├── studyData.ts            # Pre-processed CSV data (TypeScript)
│   │   └── test_cases.json         # 5 benchmark prediction cases
│   └── types.ts                    # Shared TypeScript types
│
├── public/
│   └── docs/
│       └── report.docx             # ← Place your report file here
│
├── index.html                  # SEO meta + app entry
├── vite.config.ts              # Vite build config
└── package.json
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · Vite · TypeScript · Tailwind CSS v4 |
| **Charts** | Recharts (LineChart, BarChart, ScatterChart) |
| **Backend** | FastAPI (Python 3.10+) |
| **ML Models** | EBM-GAM (`interpret`) · NGBoost · CatBoost · GPR (`scikit-learn`) |
| **Uncertainty** | NGBoost probabilistic regression · GPR posterior variance |
| **Explainability** | SHAP (via EBM) · Feature importance from `meta.pkl` |

---

## 🚀 Quick Start

### Prerequisites
- **Python** 3.10+ (with pip)
- **Node.js** 18+

### Step 1 — Install Python dependencies *(first time only)*

```bash
cd "f:\class project\pttk\AI_ML"
pip install -r requirements.txt
```

> **Tip:** Use a virtual environment to avoid conflicts:
> ```bash
> python -m venv .venv
> .venv\Scripts\activate      # Windows
> pip install -r requirements.txt
> ```

### Step 2 — Start the backend

```bash
# Windows (one-click)
AI_ML\start_backend.bat

# Or manually
cd AI_ML
uvicorn main_fastapi:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at → **http://localhost:8000**
Interactive API docs → **http://localhost:8000/docs**

### Step 3 — Start the frontend

```bash
npm install          # first time only
npm run dev
```

Frontend runs at → **http://localhost:5173**

---

## 🌐 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/health` | GET | Backend health check + model info |
| `/api/v1/model-info` | GET | SHAP feature importance from `meta.pkl` |
| `/api/v1/predict` | POST | Run ensemble prediction for a user profile |

### Predict — Request Body (13 features)

```json
{
  "sets_week_all": 18,
  "sets_week_direct": 4,
  "frequency_direct": 1,
  "sessions_per_week": 3,
  "rep_range_all": 10,
  "interset_rest_min_all": 1.25,
  "percentage_failure_all": 22.5,
  "weeks": 6,
  "age": 22,
  "sex_male": 1,
  "train_status_enc": 2,
  "upper_body": 1,
  "has_nutrition_control": 1
}
```

### Predict — Response Summary

```json
{
  "status": 200,
  "data": {
    "responder_class": "High | Medium | Low",
    "current_status": { "sets_per_week": 18, "hedges_g": 0.45, "confidence_ci": "±0.70 (95%)" },
    "recommendation": { "optimal_sets": 22, "safe_range": [18, 26], "optimal_g": 0.55 },
    "confidence": { "level": "High", "sigma_ngb": 0.357 },
    "top_features": ["sets.week.all", "train_status_enc", "..."],
    "warnings": [],
    "dose_response_curve": { "sets": [1, 2, ..., 50], "hedges_g": [...] }
  }
}
```

---

## 📊 Application Pages

### 1. Data Overview
Interactive dataset explorer with:
- Hedges' g distribution histogram (real data from 199 obs)
- Boxplot by responder class (P5–P95)
- Filter by training status & nutrition control

### 2. Volume vs Hypertrophy
Scatter analysis showing:
- Sets/week vs Hedges' g for all 199 observations
- Pearson r computed live on filtered data
- Feature-outcome correlation bar chart

### 3. Volume Optimizer *(main feature)*
AI prediction interface with:
- **Demo mode**: 5 pre-built test cases from systematic review
- **Custom Profile**: 11 interactive sliders/dropdowns for personal input
- Real dose-response curve from EBM model sweep (1–50 sets)
- SHAP feature importance (dynamic from `meta.pkl`)
- NGBoost 95% confidence interval

### 4. Case Study
Clinical report generator:
- Select any of 5 benchmark cases
- Full API prediction with narrative interpretation
- Dose-response curve + safety zone + top features
- Clinical recommendation text

---

## 🔐 Environment Variables

```bash
# .env.local (not committed to git)
GEMINI_API_KEY=your_key_here
```

Copy `.env.example` → `.env.local` and fill in your key.

---

## 📚 Data & Models

- **Dataset:** 69 RCTs measuring muscle hypertrophy via MT/CSA/Volume (MRI/Ultrasound)
- **Effect size:** Hedges' g (small-sample corrected Cohen's d)
- **Responder classes:** Low (g < 0.2) · Medium (0.2 ≤ g < 0.8) · High (g ≥ 0.8)
- **Features:** 10 continuous + 3 binary = 13 model features
- **P90 cap:** Dose-response predictions capped at training data P90 to prevent extrapolation

---

*STAT3013 Statistical Learning · 2026*