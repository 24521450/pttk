# Part 6 — Real-World Application

**Course:** STAT3013 — Statistical Learning (2026)
**Application:** TrainHyp AI — Training Volume Optimizer for Muscle Hypertrophy

---

## 6.1 Application Overview

### 6.1.1 Objective

TrainHyp AI is a clinical decision-support application designed to **personalize resistance training prescriptions** for muscle hypertrophy based on data-driven analysis and machine learning. The application addresses a fundamental question in exercise science: *"Given an individual's training profile, what is the optimal weekly training volume (sets per week) to maximize hypertrophic response?"*

Traditional volume recommendations rely on population-level guidelines (e.g., 10–20 sets/week per muscle group), which fail to account for individual variation in training status, recovery capacity, program design, and demographic factors. TrainHyp AI bridges this gap by leveraging a **4-model ensemble** trained on a systematic review dataset of **69 randomized controlled trials (RCTs)** encompassing **199 muscle-level observations**, measured via ultrasound and MRI.

### 6.1.2 Core Functionalities

The application delivers the following capabilities:

1. **Dataset Exploration** — Interactive visualization of the underlying systematic review data, enabling users to explore distributions, correlations, and subgroup patterns across the 199 observations.

2. **Volume–Hypertrophy Relationship Analysis** — Scatter analysis of weekly training volume versus Hedges' g effect size, with Pearson correlation computation, class-stratified coloring, and trend aggregation by volume bucket.

3. **AI-Powered Volume Optimization** — The primary feature: users input a 13-feature clinical profile (or select from pre-defined demo cases), and the ensemble model returns:
   - Predicted Hedges' g effect size (via EBM regression)
   - Responder classification (High / Medium / Low via CatBoost)
   - Optimal weekly sets recommendation (capped at P90 of training data)
   - Probabilistic uncertainty quantification (via NGBoost σ)
   - Out-of-distribution safety assessment (via GPR σ)
   - Full dose–response curve (1–50 sets/week sweep)

4. **Clinical Case Study Reports** — In-depth AI analysis of individual training profiles, generating full clinical reports with dose–response visualization, top predictive features, uncertainty estimates, and actionable clinical recommendations.

### 6.1.3 Target Users

- Exercise scientists and sports physiologists seeking evidence-based volume prescriptions
- Strength and conditioning coaches designing individualized training programs
- Academic researchers studying dose–response relationships in resistance training
- Students in statistical learning courses examining applied ML deployment

### 6.1.4 Scientific Foundation

The effect size metric used throughout the application is **Hedges' g**, a bias-corrected standardized mean difference particularly suitable for small-sample studies. The classification thresholds follow Cohen's conventions adapted for exercise science:

| Class | Hedges' g Range | Interpretation |
|---|---|---|
| Low Responder | g < 0.2 | Negligible to small hypertrophic effect |
| Medium Responder | 0.2 ≤ g < 0.8 | Small to moderate hypertrophic effect |
| High Responder | g ≥ 0.8 | Large hypertrophic effect |

---

## 6.2 System Architecture

### 6.2.1 High-Level Architecture

TrainHyp AI follows a **decoupled client–server architecture** with a React single-page application (SPA) frontend communicating with a Python FastAPI backend via RESTful HTTP endpoints. The system is designed with **graceful degradation**: the frontend remains fully functional with fallback data when the backend is unavailable.

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                              │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐  ┌────────────┐  │
│  │   Data      │  │  Volume vs   │  │  Volume    │  │   Case     │  │
│  │  Overview   │  │ Hypertrophy  │  │ Optimizer  │  │   Study    │  │
│  └─────┬──────┘  └──────┬───────┘  └─────┬──────┘  └─────┬──────┘  │
│        │                │                 │                │         │
│        └────────────────┼─────────────────┼────────────────┘         │
│                         │      HTTP/JSON  │                          │
└─────────────────────────┼─────────────────┼──────────────────────────┘
                          │                 │
              ┌───────────▼─────────────────▼───────────────┐
              │           FastAPI Backend (Python)           │
              │  ┌──────────────────────────────────────┐   │
              │  │         API Layer (3 endpoints)       │   │
              │  │  /health  │  /model-info  │  /predict │   │
              │  └──────────────────┬───────────────────┘   │
              │                     │                        │
              │  ┌──────────────────▼───────────────────┐   │
              │  │        TrainHypAI Engine              │   │
              │  │                                       │   │
              │  │  ┌─────────┐  ┌──────────────────┐   │   │
              │  │  │  Fill   │  │   Preprocessing  │   │   │
              │  │  │ Missing │──│  Scale + Impute   │   │   │
              │  │  └─────────┘  └────────┬─────────┘   │   │
              │  │                         │             │   │
              │  │    ┌────────────────────┼──────────┐  │   │
              │  │    │   4-Model Ensemble │          │  │   │
              │  │    │                    ▼          │  │   │
              │  │    │  ┌─────┐ ┌──────┐ ┌───────┐  │  │   │
              │  │    │  │ EBM │ │ NGB  │ │CatBst │  │  │   │
              │  │    │  │(reg)│ │(unc.)│ │(clf)  │  │  │   │
              │  │    │  └─────┘ └──────┘ └───────┘  │  │   │
              │  │    │  ┌─────┐                     │  │   │
              │  │    │  │ GPR │ (OOD detection)     │  │   │
              │  │    │  └─────┘                     │  │   │
              │  │    └──────────────────────────────┘  │   │
              │  │                    │                  │   │
              │  │    ┌───────────────▼──────────────┐   │   │
              │  │    │   Safety / Rule Engine       │   │   │
              │  │    │  4 rules: range, σ_ngb,      │   │   │
              │  │    │  σ_gpr, volume bounds        │   │   │
              │  │    └──────────────────────────────┘   │   │
              │  └──────────────────────────────────────┘   │
              │                                              │
              │  ┌──────────────────────────────────────┐   │
              │  │   Model Store (.pkl files × 28)       │   │
              │  │   ebm, ngb, catboost, gpr, scaler,    │   │
              │  │   imputers, meta, label_encoder        │   │
              │  └──────────────────────────────────────┘   │
              └──────────────────────────────────────────────┘
```

### 6.2.2 Data Flow — Prediction Pipeline

The prediction pipeline executes the following 8-step sequence when a user submits a clinical profile:

| Step | Process | Component | Output |
|---|---|---|---|
| 1 | **Input Reception** | FastAPI `UserInput` schema | Validated 13-feature payload |
| 2 | **Missing Value Imputation** | `_fill_missing()` using `train_medians` | Complete feature vector (no nulls) |
| 3 | **Preprocessing** | `StandardScaler` + `SimpleImputer` | `X_proc` (n×13) for ensemble, `X_gpr` (n×10) for GPR |
| 4 | **Regression** | EBM (ExplainableBoostingRegressor) | Predicted Hedges' g at current volume |
| 5 | **Classification** | CatBoost Classifier | Responder class (High / Medium / Low) |
| 6 | **Uncertainty** | NGBoost `pred_dist()` | σ_ngb (predictive standard deviation) |
| 7 | **OOD Detection** | GPR `predict(return_std=True)` | σ_gpr (posterior uncertainty) |
| 8 | **Dose–Response Sweep** | EBM over 1–50 sets/week | Full curve + optimal_sets (argmax within P90 cap) |

A critical design decision is the **P90 cap**: optimal sets are constrained to sets ≤ P90 of the training distribution (typically ≤ 32 sets/week). This prevents the EBM from recommending volumes in sparsely sampled regions where extrapolation is unreliable — only 5 observations in the dataset have sets ≥ 40.

### 6.2.3 API Contract

| Endpoint | Method | Purpose | Request | Response |
|---|---|---|---|---|
| `/api/v1/health` | GET | Server health check | — | `{status, models_loaded, n_features, optimal_sets, sets_p90}` |
| `/api/v1/model-info` | GET | SHAP feature importance | — | `{feature_importance[], feature_names[], class_mapping, sets_p90, uncertainty_threshold}` |
| `/api/v1/predict` | POST | Full prediction pipeline | 13-feature JSON body | `{responder_class, current_status, recommendation, confidence, warnings[], dose_response_curve}` |

The `/predict` endpoint only requires `sets_week_all` as mandatory; all other 12 features default to **training data medians** (not zeros) when omitted. This ensures robust behavior even with minimal user input: filling with zeros would produce pathological predictions (e.g., age=0 breaks the GPR kernel).

### 6.2.4 Graceful Degradation Strategy

The frontend implements a **three-tier fallback** mechanism:

1. **Online Mode** — Backend responds successfully: display real-time ensemble predictions with dose–response curves, uncertainty intervals, safety warnings, and dynamic SHAP feature importance.
2. **Fallback Mode** — Backend unreachable: display rule-based heuristic predictions using expected class from test cases, static feature importance values, and an informational banner `"Demo mode active: API unavailable"`.
3. **Error Mode** — React ErrorBoundary catches unhandled exceptions and displays a recovery UI with error details and a "Try Again" button.

The **Sidebar** component continuously monitors backend availability by polling `GET /api/v1/health` every 30 seconds, displaying a real-time status badge (Online / Connecting / Offline) with color-coded indicators.

---

## 6.3 Data Input Interface

### 6.3.1 Input Modes

The Volume Optimizer page provides two distinct input modes, selectable via a tab switcher:

**Mode 1: Demo Test Cases**

Five pre-defined clinical profiles are provided for immediate exploration without requiring domain knowledge. Each case card displays:
- Case identifier and expected responder class (color-coded badge)
- Descriptive title (e.g., *"Trained male, moderate volume, upper body"*)
- Clinical note explaining the profile's significance

The 5 test cases cover the full spectrum of the responder classification:

| Case | Description | Expected Class | Key Characteristics |
|---|---|---|---|
| 1 | Trained male, moderate volume, upper body | Medium | 18 sets/wk, 3 sessions, caloric surplus — most common profile |
| 2 | High frequency, high volume trained | High | 32 sets/wk, 8 sessions, 100% failure, no nutrition control |
| 3 | Untrained, very low volume | Low | 3 sets/wk, untrained (status=0), triggers undertraining warning |
| 4 | Long program, untrained, moderate volume | Medium | 18 sets/wk over 24 weeks, untrained initial status |
| 5 | Very high volume — potential overtraining | High | 45 sets/wk (near training data max=48), triggers GPR uncertainty |

**Mode 2: Custom Profile**

A fully interactive input form with 10 adjustable parameters organized into two categories:

*Categorical Variables (Dropdown selectors):*

| Parameter | Options | Encoded Value |
|---|---|---|
| Training Status | Untrained (Beginner) / Trained (Intermediate+) | 0 / 2 |
| Sex | Female / Male | 0 / 1 |
| Muscle Group Focus | Lower Body / Upper Body | 0 / 1 |
| Nutrition Control | None / Caloric Surplus | 0 / 1 |

*Continuous Variables (Slider controls with visual fill indicators):*

| Parameter | Unit | Range | Step | Default |
|---|---|---|---|---|
| Age | years | 15–70 | 1 | 22 |
| Weekly Sets (All) | sets | 1–50 | 1 | 18 |
| Sessions / Week | sessions | 1–14 | 1 | 3 |
| Rep Range (avg) | reps | 1–30 | 1 | 10 |
| % Sets to Failure | % | 0–100 | 5 | 22.5 |
| Rest Between Sets | minutes | 0.5–10 | 0.25 | 1.25 |
| Program Duration | weeks | 1–52 | 1 | 6 |

### 6.3.2 Input Validation

Input validation occurs at two levels:

1. **Frontend** — HTML range inputs enforce min/max/step constraints natively. Dropdown selectors restrict values to valid options only.
2. **Backend** — Pydantic `BaseModel` schema (`UserInput` class) enforces type constraints and value bounds via `Field(ge=, le=)` validators. Invalid requests receive HTTP 422 responses with detailed error messages.

### 6.3.3 Design Rationale

The slider-based interface was chosen over free-text inputs for several reasons:
- **Prevents out-of-range values** that would trigger safety warnings or model failures
- **Provides visual feedback** through gradient fill bars showing current position within the valid range
- **Reduces cognitive load** by showing the variable's plausible domain boundaries
- **Supports rapid iteration** — users can quickly adjust volume and observe the predicted effect change

Each slider displays the current numeric value alongside its label and unit, with min/max boundary labels at the track endpoints.

---

## 6.4 Statistical Dashboard & Data Visualization

### 6.4.1 Data Overview Page

The Data Overview page serves as the dataset explorer, providing comprehensive visualization of the underlying 199-observation systematic review dataset. It is organized into five sections:

**Summary Cards (4 metrics):**

| Metric | Source | Example Value |
|---|---|---|
| RCT Studies | Fixed: 69 | 69 papers |
| Observations | Filtered count from `RAW_POINTS` | 199 muscle obs |
| Mean Hedges' g | Computed: `Σg / n` over filtered data | ~0.39 ES |
| % High Responders | `count(cls="High") / n × 100` | ~35.7% |

**Filter Bar:**

Two interactive filter dimensions allow subgroup exploration:

- **Training Status** — All / Trained / Untrained (encoded from `trained` boolean)
- **Nutrition Control** — All / Controlled / None (encoded from `nutrition` boolean)

A counter displays `"Showing X / 199 obs"` to track active filter state. All downstream visualizations (histogram, boxplot, class distribution) reactively update via `useMemo` hooks.

**Histogram — Distribution of Hedges' g:**

A 7-bin bar chart (Recharts `BarChart`) displaying the frequency distribution of effect sizes across all filtered observations. Bins are color-coded from red (< 0) through orange, yellow, green, blue, indigo to deep blue (> 1.0), providing intuitive visual mapping from negative/negligible to large effects.

**Boxplot — Hedges' g by Responder Class:**

A custom SVG boxplot (not a library component) rendering P5–P25–P50–P75–P95 whisker-and-box diagrams for each responder class (Low / Medium / High). This is a hand-coded implementation using direct SVG drawing with:
- Dashed whisker lines from P5/P95 to Q1/Q3
- Filled IQR rectangle with rounded corners
- Bold median line
- Annotated median value labels and sample size (n=X)

**Responder Class Distribution:**

Horizontal progress bars showing the proportion of Low / Medium / High responders in the filtered dataset, with percentage and absolute count labels. A supplementary row displays fixed dataset-level statistics (% Trained, % Untrained, Unique Studies, Dataset Mean ES).

### 6.4.2 Volume vs. Hypertrophy Page

This page focuses on the primary research question: the relationship between training volume and hypertrophic response.

**Scatter Plot (199 observations):**

A full scatter visualization using Recharts `ScatterChart` with:
- X-axis: Sets per Week (domain: 0–52)
- Y-axis: Hedges' g (domain: −0.35 to 2.5)
- Point color: Responder class (Blue = High, Amber = Medium, Red = Low)
- Reference lines at g = 0, 0.2 (Small), 0.5 (Medium), 0.8 (Large) for Cohen's benchmarks
- Grid lines and custom tooltip showing sets, g, class, and training status per point

**Filters:**
- Class filter: All / High / Medium / Low
- Training status filter: All / Trained / Untrained

The **Pearson r** correlation coefficient is computed dynamically from the filtered data and displayed as a stat pill (e.g., `r = +0.31` for the full dataset).

**Feature–Outcome Correlation Table:**

A ranked horizontal bar chart displaying Pearson r correlations between 8 predictor features and Hedges' g, sorted by absolute magnitude:

| Feature | Pearson r | Interpretation |
|---|---|---|
| Sets / Week (All) | +0.31 | Strongest positive predictor |
| Sessions / Week | +0.20 | Moderate positive association |
| Program Duration (wks) | +0.15 | Weak positive effect |
| Sets / Week (Direct) | +0.14 | Weak positive effect |
| Rep Range | +0.01 | Negligible |
| Rest Between Sets | −0.01 | Negligible |
| % Sets to Failure | −0.04 | Negligible inverse |
| Age | −0.09 | Weak negative association |

Blue bars indicate positive correlations; red bars indicate negative. A text annotation notes: *"Sets/week shows the strongest positive correlation (r = +0.31). Percentage-to-failure shows a weak negative correlation, consistent with the dose–response model."*

**Volume Bucket Trend Summary:**

Three cards aggregating mean Hedges' g by volume range (Low: 1–10, Moderate: 11–25, High: 26–50 sets/week), providing a quick visual summary of the dose–response trend.

---

## 6.5 Prediction & Recommendation Screen

### 6.5.1 Prediction Output Layout

Upon running a prediction (via the "Run Prediction" button), the Volume Optimizer page displays results in a structured layout organized into four sections:

**Section A — Top Metrics Row (4 cards):**

| Card | Content | Source Model |
|---|---|---|
| **Predicted Hedges' g** | Numeric effect size (e.g., `0.452 ES`) | EBM regression |
| **Classification** | Responder badge (e.g., `MEDIUM RESPONDER`) | CatBoost classifier |
| **Optimal Sets** | Recommended sets/week (e.g., `22 / week`) + safe range | EBM dose–response argmax (P90-capped) |
| **Model Confidence** | Percentage (e.g., `95%`) + expected class match indicator | NGBoost σ threshold |

When in Demo mode, the "Expected Class Match" indicator shows whether the predicted class matches the test case's expected class (Yes/No), providing immediate model validation feedback.

**Section B — AI Insight Banner:**

A full-width card with decorative gradient background displaying:

- **Badge**: "AI Predicted Insight" (live) or "Demo Insight" (fallback)
- **Responder Insight**: Natural language description of the individual's hypertrophic profile (e.g., *"Cơ địa Medium Responder — cần volume vừa phải, nhất quán"*)
- **Recommendation**: Actionable volume adjustment advice generated by the rule engine:
  - If `current_sets / optimal_sets < 0.80`: *"Undertraining — tăng lên X sets/tuần"*
  - If `current_sets / optimal_sets > 1.20`: *"Overtraining risk — cân nhắc giảm volume"*
  - Otherwise: *"Optimal zone — tiếp tục duy trì"*
- **Match indicator**: A checkmark icon appears when predicted class matches expected class (demo mode)

**Section C — Dose–Response Curve:**

An interactive line chart (Recharts `LineChart`) plotting predicted Hedges' g across 1–50 sets/week for the current profile:

- **Blue curve**: Smoothed EBM predictions (3-point rolling mean)
- **Light blue shaded zone**: Safe training range (optimal_sets ± buffer)
- **Dashed vertical line**: Optimal sets position
- **Optimal dot**: White circle with blue border highlighting the peak
- **Tooltip**: Hover to see exact `sets → g` values
- **Y-axis labels**: Effect size scale with decimal precision
- **X-axis labels**: Sets/week from 0 to 30+

When the backend is online, the curve reflects **real model predictions**; the label indicates "Real data from EBM model · P90 cap: X sets". In fallback mode, a static placeholder curve is displayed.

**Section D — Feature Importance (SHAP):**

A horizontal bar chart displaying the top 5 features ranked by SHAP importance:

| Feature | SHAP Value | Relative Importance |
|---|---|---|
| `sets.week.all` | 0.42 | 100% |
| `train_status_enc` | 0.28 | 67% |
| `percentage.failure.all` | 0.21 | 50% |
| `has_nutrition_control` | 0.12 | 29% |
| `weeks` | 0.08 | 19% |

When the backend is online, SHAP values are fetched dynamically from `/api/v1/model-info`. Features matching the model's top-3 predictors for the current input are highlighted with a blue "KEY" badge. In fallback mode, hardcoded SHAP values are displayed.

### 6.5.2 Confidence Interval Display

When the backend returns a valid prediction, a 95% confidence interval panel appears below the "Run Prediction" button:

```
95% CI: ±0.357 (95% CI)
```

This is computed as `±1.96 × σ_ngb`, where `σ_ngb` is the NGBoost predictive standard deviation. This interval quantifies the **aleatoric + epistemic uncertainty** in the Hedges' g prediction, allowing users to assess prediction reliability.

### 6.5.3 NGBoost Probabilistic Output

The NGBoost model provides a **full predictive distribution** (Normal distribution parameterized by μ and σ) rather than a point estimate. This is used in three ways:

1. **Confidence level**: σ_ngb < threshold → "High confidence"; σ_ngb ≥ threshold → "Low confidence"
2. **95% CI width**: ±1.96σ displayed to the user
3. **Safety warning trigger**: σ_ngb exceeding the pre-computed threshold fires a high-uncertainty warning

### 6.5.4 Rule Engine Logic

The rule engine interprets the ensemble outputs into actionable recommendations through deterministic rules:

```
ratio = current_sets / optimal_sets

IF ratio < 0.80:
    → "Undertraining — increase to {optimal_sets} sets/week"
ELIF ratio > 1.20:
    → "Overtraining risk — consider reducing volume"
ELSE:
    → "Optimal zone — maintain current programming"
```

Additionally, the safe training range is computed as:
```
safe_min = max(1, optimal_sets - buffer)
safe_max = min(sets_p90, optimal_sets + buffer)
```
where `buffer` is a model-specific parameter stored in `meta.pkl`.

---

## 6.6 Out-of-Distribution (OOD) Warnings & Anomaly Detection

### 6.6.1 Safety Check Framework

TrainHyp AI implements a **4-rule safety engine** that evaluates every prediction request and generates human-readable warnings when the input may produce unreliable results. This is a critical feature for clinical applications where overconfident predictions on novel inputs can lead to harmful training prescriptions.

### 6.6.2 Safety Rules

**Rule 1 — Feature Range Extrapolation:**

Each input feature is checked against the training data's observed min/max range (stored in `meta.pkl['feature_ranges']`). If any feature value falls outside this range, the system warns:

```
⚠️ {feature}={value} outside training range [{min}, {max}] — result is extrapolation
```

*Rationale*: All four models were trained on data within these ranges. Predictions outside the convex hull of training data are extrapolations with unknown reliability. For example, if training data contains ages 18–65 and a user inputs age=70, the EBM's learned shape functions may produce arbitrary outputs.

**Rule 2 — NGBoost High Uncertainty:**

If the NGBoost predictive standard deviation exceeds a pre-computed threshold:

```
⚠️ High uncertainty (σ={value} > threshold {threshold})
```

The threshold is stored in `meta.pkl['uncertainty_threshold']` and represents a percentile cutoff (typically P75 or P90) of σ values observed on the training set. High σ indicates the model's parametric distribution is wide, meaning the point prediction is unreliable.

**Rule 3 — GPR Out-of-Distribution:**

The Gaussian Process Regressor operates on the 10 continuous features and produces posterior uncertainty σ_gpr. If this exceeds the OOD threshold:

```
⚠️ Input far from training distribution (GPR σ={value})
```

*Rationale*: GPR posterior variance increases monotonically with distance from training data in feature space. This provides a model-agnostic distance measure that complements the NGBoost uncertainty: NGBoost measures predictive spread, while GPR measures *input novelty*. An input may have low NGBoost σ (confident wrong prediction) but high GPR σ (novel input), making the combination more robust.

**Rule 4 — Training Volume Bounds:**

The user's current `sets_week_all` is compared against physiological boundaries defined in `meta.pkl['safety_rules']`:

```
IF sets < min_sets_junk_volume:
    ⚠️ {sets} sets/week too low (<{min}) — junk volume

IF sets > max_sets_physiological:
    ⚠️ {sets} sets/week very high (>{max}) — overtraining risk
```

*Rationale*: Extremely low volume (e.g., 1–2 sets/week) provides insufficient mechanical stimulus for measurable hypertrophy ("junk volume"). Extremely high volume (e.g., >45 sets/week) carries significant overtraining risk and is sparsely represented in the training data.

### 6.6.3 Warning Display

Warnings are rendered in two contexts:

1. **Volume Optimizer page**: A yellow-toned alert banner below the tab switcher, with each warning as a separate row prefixed by a shield icon.
2. **Case Study page**: Within the "Clinical Recommendation" section of the full report.

The warning system is **non-blocking**: predictions are always returned regardless of safety flags. Warnings are informational guardrails, not hard constraints, respecting the user's domain expertise while flagging potential concerns.

### 6.6.4 Fallback Mode Warning

When the backend is unreachable, a distinct orange banner informs the user:

```
Demo mode active: API unavailable. Showing intelligent fallback data.
```

This ensures users are never misled into treating fallback heuristics as model-generated predictions.

---

## 6.7 User Guide

### 6.7.1 Getting Started

**Prerequisites:**
- Python 3.10 or later (added to system PATH)
- Node.js 18 or later (added to system PATH)

**Quick Launch:**

Double-click `start.bat` in the project root. This batch script automatically:
1. Installs Python dependencies from `AI_ML/requirements.txt`
2. Installs Node dependencies via `npm install` (skipped if `node_modules/` exists)
3. Launches the FastAPI backend on `http://localhost:8000`
4. Launches the Vite frontend on `http://localhost:5173`

Two terminal windows will open — one green (backend) and one yellow (frontend). Keep both open during use.

**Manual Launch (alternative):**

```bash
# Terminal 1: Backend
cd AI_ML
pip install -r requirements.txt
python -m uvicorn main_fastapi:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Frontend
npm install
npm run dev
```

### 6.7.2 Navigating the Application

The left sidebar provides navigation to four pages:

| Icon | Page | Purpose |
|---|---|---|
| Database | **Data Overview** | Explore the 199-observation dataset |
| LineChart | **Volume vs Hypertrophy** | Analyze volume–ES relationships |
| Gauge | **Volume Optimizer** | Run AI predictions (main feature) |
| Microscope | **Case Study** | Generate clinical reports |

The sidebar also displays:
- **Backend status badge**: Green (Online), Red (Offline), or Amber (Connecting)
- **Documentation link**: Opens `report.docx` if placed in `public/docs/`

### 6.7.3 Running a Prediction (Volume Optimizer)

**Using Demo Cases (Recommended for first-time users):**

1. Ensure the "Demo Cases" tab is selected (default)
2. Browse the 5 pre-configured case cards — each shows a description and expected class
3. Click any case card to select it
4. The prediction runs automatically upon case selection
5. Review the results: metrics row → insight banner → dose–response curve → SHAP features

**Using Custom Profile:**

1. Switch to the "Custom Profile" tab
2. Configure your profile using the dropdowns and sliders:
   - Start with Training Status and Sex (most impactful categorical variables)
   - Adjust Weekly Sets — this is the primary predictor
   - Fine-tune remaining parameters as needed
3. Click the **"Run Prediction"** button
4. Wait for the backend response (loading spinner indicates processing)
5. Review the prediction output

### 6.7.4 Interpreting Results

**Hedges' g Value:**
- g ≈ 0: No measurable hypertrophic effect
- g ≈ 0.2: Small effect (detectable on ultrasound)
- g ≈ 0.5: Moderate effect (visible muscle growth)
- g ≈ 0.8+: Large effect (significant hypertrophy)

**Responder Class:**
- **Low Responder**: Focus on technique consistency and progressive overload; avoid excessive volume
- **Medium Responder**: Maintain moderate, consistent volume; periodize intensity
- **High Responder**: Can tolerate and benefit from higher training volumes; monitor recovery

**Dose–Response Curve:**
- The peak of the curve indicates the **optimal volume** for maximum hypertrophic response
- The shaded region shows the **safe training zone** (optimal ± buffer)
- Volumes beyond the curve's peak show diminishing or negative returns
- The curve is capped at P90 of training data to ensure recommendation reliability

**Safety Warnings:**
- ⚠️ warnings indicate the prediction may be less reliable
- Multiple simultaneous warnings suggest high-risk input — interpret results with caution
- The "Demo mode" banner means you are viewing heuristic fallbacks, not model predictions

### 6.7.5 Frequently Asked Questions

**Q: The sidebar shows "AI Engine Offline" — is the app broken?**
A: No. The frontend works independently with demo fallback data. To get real AI predictions, ensure the backend is running (check the green terminal window). Run `start.bat` again if needed.

**Q: Why does the dose–response curve sometimes show a flat line?**
A: In fallback mode (backend offline), a static placeholder curve is displayed. Connect the backend for real model-generated curves.

**Q: Can I enter values outside the slider ranges?**
A: No. The slider ranges are set to match the training data domain. Values outside these ranges would produce unreliable extrapolations.

**Q: What does "P90 cap" mean?**
A: The optimal recommendation is limited to the 90th percentile of weekly sets observed in the training data (typically ≤32 sets/week). This prevents the model from recommending extreme volumes where prediction reliability is low.

**Q: Why are some SHAP features highlighted with "KEY"?**
A: These are the top-3 most influential features for the current prediction, as identified by the ensemble model. They may differ from the global SHAP ranking depending on the individual's profile.

**Q: The prediction says "Undertraining" but I feel overtrained. Why?**
A: The model's recommendations are based on population-level data from 69 RCTs. Individual recovery capacity, sleep, stress, and other factors not captured in the 13-feature schema can significantly affect real-world response. Use the predictions as a starting point, not a prescription.

---

## 6.8 Technology Stack

### 6.8.1 Frontend Technologies

| Technology | Version | Role |
|---|---|---|
| **React** | 19.0.0 | UI component framework (functional components with hooks) |
| **Vite** | 6.2.0 | Build tool and development server (HMR-enabled) |
| **TypeScript** | 5.8.2 | Static type system for JavaScript |
| **Tailwind CSS** | 4.1.14 | Utility-first CSS framework (v4 with `@tailwindcss/vite` plugin) |
| **Recharts** | 3.8.1 | Declarative charting library (BarChart, ScatterChart, LineChart) |
| **Lucide React** | 0.546.0 | Icon library (tree-shakeable SVG icons) |
| **Motion** | 12.23.24 | Animation library (page transitions, micro-interactions) |
| **Inter** | — | Primary typeface via Google Fonts (weights: 300–800) |

**Key Frontend Patterns:**
- State-based routing (no React Router — single `activePage` state controls page rendering)
- `useMemo` for expensive computations (histogram bins, boxplot stats, Pearson r)
- `useCallback` for memoized event handlers
- `useEffect` with `AbortSignal.timeout` for health check polling
- Custom SVG rendering for boxplot (no external charting dependency)
- Error Boundary pattern (class component) for global error handling

### 6.8.2 Backend Technologies

| Technology | Version | Role |
|---|---|---|
| **FastAPI** | ≥0.100.0 | Async web framework with automatic OpenAPI docs |
| **Uvicorn** | ≥0.23.0 | ASGI server (production-capable with `--reload` for dev) |
| **Pydantic** | ≥2.0.0 | Request/response validation via Python type annotations |
| **Pandas** | ≥2.0.0 | DataFrame operations for feature engineering |
| **NumPy** | ≥1.24.0 | Numerical computing and array operations |
| **scikit-learn** | ≥1.3.0 | `StandardScaler`, `SimpleImputer`, `GaussianProcessRegressor` |
| **Joblib** | ≥1.3.0 | Model serialization/deserialization (.pkl files) |

### 6.8.3 Machine Learning Models

| Model | Library | Task | Output |
|---|---|---|---|
| **EBM** (Explainable Boosting Machine) | `interpret` ≥0.4.0 | Regression | Predicted Hedges' g |
| **NGBoost** | `ngboost` ≥0.4.0 | Probabilistic Regression | μ + σ (Normal distribution) |
| **CatBoost** | `catboost` ≥1.2 | Multiclass Classification | Responder class (0/1/2) |
| **GPR** (Gaussian Process Regression) | `scikit-learn` | OOD Detection | Posterior σ_gpr |

**Feature Schema (13 features):**

| Type | Features (Count) |
|---|---|
| Continuous (10) | `sets.week.all`, `sets.week.direct`, `frequency.direct`, `sessions.per.week`, `rep.range.all`, `interset.rest.min.all`, `percentage.failure.all`, `weeks`, `age`, `sex.male` |
| Binary (3) | `train_status_enc`, `upper_body`, `has_nutrition_control` |

### 6.8.4 Development & Deployment Infrastructure

| Component | Technology |
|---|---|
| Package Manager | npm (Node.js) + pip (Python) |
| Build System | Vite (frontend), Uvicorn (backend) |
| Source Control | Git + GitHub |
| Launcher | `start.bat` (Windows batch script, auto-installs + launches both services) |
| API Documentation | Swagger UI (auto-generated at `/docs` by FastAPI) |
| CORS | FastAPI `CORSMiddleware` (allows localhost:3000, localhost:5173) |
| Environment | `.env.example` template (Gemini API key placeholder — currently unused) |

### 6.8.5 Model Training Pipeline (Jupyter Notebooks)

The 6 training notebooks form a sequential pipeline:

| Notebook | Purpose | Output Artifacts |
|---|---|---|
| `NB01_EBM_GAM.ipynb` | Train EBM + GAM regression models | `ebm_model.pkl`, `gam_model.pkl`, feature importance plots |
| `NB02_NGBoost.ipynb` | Train NGBoost probabilistic regressor | `ngb_model.pkl`, `ngb_info.pkl`, uncertainty plots |
| `NB03_TabNet.ipynb` | Train TabNet deep learning model | `tabnet_model.zip`, `tabnet_info.pkl` |
| `NB04_CatBoost_GPR.ipynb` | Train CatBoost classifier + GPR | `catboost_clf.pkl`, `gpr_model.pkl`, `clf_info.pkl` |
| `NB05_SEM.ipynb` | Structural Equation Modeling analysis | `sem_results.pkl`, path diagram |
| `NB06_Integration.ipynb` | Export ensemble metadata + integrated evaluation | `meta.pkl`, `scaler.pkl`, `imputer_*.pkl`, `label_encoder.pkl`, comparison plots |

The final `meta.pkl` file contains all deployment-critical metadata: feature names, class mapping, training medians, feature ranges, SHAP importance scores, safety thresholds, and P90 volume cap.

---

*STAT3013 — Statistical Learning · 2026*
