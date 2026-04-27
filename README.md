# 🏋️ TrainHyp AI — Volume Optimizer

> **STAT3013 — Statistical Learning (2026)**  
> A clinical ML application predicting hypertrophic response to resistance training volume using an ensemble of interpretable AI models.

---

## 🚀 Quick Start

**Double-click `start.bat`** — it handles everything automatically:

1. Creates a Python virtual environment & installs dependencies
2. Installs Node.js dependencies (`npm install`)
3. Starts the **Backend (FastAPI)** → [http://localhost:8000](http://localhost:8000)
4. Starts the **Frontend (Vite)** → [http://localhost:3000](http://localhost:3000)

> **Prerequisites:**
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

1. **Analyses** a systematic review dataset of **69 RCTs** (199 muscle-level observations)
2. Runs a **4-model ensemble** (EBM-GAM · NGBoost · CatBoost · GPR) to predict **Hedges' g** hypertrophy effect sizes
3. Recommends **optimal weekly training volume** (sets/week) for an individual's clinical profile
4. Provides **probabilistic uncertainty estimates** and safety guardrails against out-of-distribution inputs

### Key Features

- 🎯 **Dose-Response Prediction** — sweep 1–50 sets/week with personalised curve
- 📊 **Responder Classification** — High / Medium / Low via CatBoost classifier
- ⚠️ **Safety Guardrails** — extrapolation warnings, uncertainty thresholds, OOD detection
- 📈 **SHAP Feature Importance** — dynamic feature contribution chart
- 🔄 **Graceful Fallback** — app works with demo data when backend is offline

---

## 📊 Application Pages

| Route | Page | Description |
|---|---|---|
| `/overview` | **Data Overview** | Dataset explorer — histogram, boxplot, interactive filters |
| `/volume` | **Volume vs Hypertrophy** | Scatter analysis — 199 observations, Pearson correlation |
| `/optimizer` | **Volume Optimizer** | Main AI tool — custom profile sliders, dose-response curve |
| `/case-study` | **Case Study** | Clinical report — pre-defined cases with full AI analysis |

> Navigation uses **React Router** with real URLs — back/forward buttons and bookmarks work as expected.

---

## 🗂️ Project Structure

```
pttk/
├── start.bat                       ← Double-click to launch everything
├── package.json                    # Frontend dependencies & scripts
├── tsconfig.json                   # TypeScript config (strict mode)
├── vite.config.ts                  # Vite build configuration
├── .env.example                    # Environment variable template
│
├── AI_ML/                          ← Backend (Python)
│   ├── main_fastapi.py             #   FastAPI server (CORS, routes)
│   ├── ai_engine.py                #   Ensemble inference engine
│   ├── requirements.txt            #   Python dependencies
│   ├── start_backend.bat           #   Standalone backend launcher
│   ├── backend_models/             #   Trained .pkl model files
│   │   ├── ebm_model.pkl           #     EBM-GAM regression
│   │   ├── ngb_model.pkl           #     NGBoost uncertainty
│   │   ├── catboost_clf.pkl        #     CatBoost classifier
│   │   ├── gpr_model.pkl           #     GPR OOD detection
│   │   ├── meta.pkl                #     Feature metadata & thresholds
│   │   ├── scaler.pkl              #     StandardScaler
│   │   └── imputer_*.pkl           #     Missing value imputers
│   ├── data_features.csv           #   Training dataset (199 obs)
│   ├── data_encoded.csv            #   Encoded dataset
│   └── NB01–NB06*.ipynb            #   Training notebooks
│
├── src/                            ← Frontend (React + TypeScript)
│   ├── main.tsx                    #   Entry point + ErrorBoundary
│   ├── App.tsx                     #   BrowserRouter + AnimatedRoutes
│   ├── config.ts                   #   API_BASE URL configuration
│   ├── types.ts                    #   TypeScript interfaces
│   ├── index.css                   #   Global styles + Tailwind v4
│   ├── components/
│   │   ├── Sidebar.tsx             #     Navigation (NavLink) + health badge
│   │   └── ErrorBoundary.tsx       #     Global error handler
│   ├── pages/
│   │   ├── DataOverview.tsx        #     Histogram + boxplot
│   │   ├── VolumeVsHypertrophy.tsx #     Scatter + correlation
│   │   ├── VolumeOptimizer.tsx     #     AI prediction + dose-response
│   │   └── CaseStudy.tsx           #     Clinical report
│   └── data/
│       ├── studyData.ts            #     199 observations (pre-processed)
│       └── test_cases.json         #     Case study definitions
│
└── public/
    └── docs/
        └── report.docx             ← Place report file here
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React **19** · Vite 6 · TypeScript (strict) · Tailwind CSS v4 |
| Routing | React Router v7 |
| Charts | Recharts 3 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| Backend | FastAPI · Uvicorn · Pydantic v2 |
| ML Models | EBM-GAM · NGBoost · CatBoost · GPR |
| Data | Pandas · NumPy · Scikit-learn · Joblib |
| Font | Inter (Google Fonts) |

---

## 🔐 Environment Variables

Copy `.env.example` → `.env.local` and configure:

```bash
# Required for Gemini API calls (if using AI features)
GEMINI_API_KEY=your_key_here

# Backend API URL — change when deploying to non-local server
# Default (if unset): http://localhost:8000
VITE_API_URL=http://localhost:8000
```

> **Note**: `VITE_API_URL` is used by the frontend to connect to the backend.  
> All API calls go through `src/config.ts` — no hardcoded URLs.

---

## 🔧 Development

### Frontend only
```bash
npm install
npm run dev          # → http://localhost:3000
```

### Backend only
```bash
cd AI_ML
pip install -r requirements.txt
uvicorn main_fastapi:app --host 0.0.0.0 --port 8000 --reload
```

### Type checking
```bash
npx tsc --noEmit     # TypeScript strict mode check
```

### Production build
```bash
npm run build        # Output → dist/
npm run preview      # Preview production build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API info |
| `GET` | `/api/v1/health` | Backend health check (model status) |
| `GET` | `/api/v1/model-info` | SHAP feature importance, thresholds |
| `POST` | `/api/v1/predict` | Full prediction (body: `UserInput` JSON) |

### Predict — Input Schema (13 features)

| Field | Type | Required | Description |
|---|---|---|---|
| `sets_week_all` | float | **Yes** | Total sets/week (0–60) |
| `age` | float | No | Age (15–70) |
| `sex_male` | float | No | 0 = female, 1 = male |
| `train_status_enc` | int | No | 0 = untrained, 2 = trained (**only 0 or 2**) |
| `weeks` | float | No | Intervention duration (1–52 weeks) |
| `upper_body` | int | No | 1 = upper, 0 = lower body |
| *...and 7 more* | | No | See `/docs` for full schema |

> Missing fields are auto-filled using **training data medians** (not zeros).

---

## 🧪 ML Model Pipeline

```
Input (13 features)
  │
  ├─→ EBM-GAM ──────→ Hedges' g prediction (primary)
  ├─→ CatBoost Clf ──→ Responder class (High/Medium/Low)
  ├─→ NGBoost ───────→ Uncertainty σ + 95% CI
  └─→ GPR ───────────→ OOD detection (σ_gpr)
  │
  └─→ Dose-Response Sweep (1–50 sets/week)
       + Safety Rules (4 checks)
       + P90 Cap (≤32 sets to avoid extrapolation)
       → Optimal recommendation + warnings
```

---

*STAT3013 Statistical Learning · 2026*
