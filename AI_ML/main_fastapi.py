"""
main_fastapi.py  —  FastAPI Server for TrainHyp AI Engine
STAT3013 | 2026

Cài đặt:
    pip install -r requirements.txt

Chạy:
    uvicorn main_fastapi:app --host 0.0.0.0 --port 8000 --reload
    hoặc: double-click start_backend.bat

Test:
    curl http://localhost:8000/api/v1/health
    curl -X POST http://localhost:8000/api/v1/predict \\
         -H "Content-Type: application/json" \\
         -d '{"sets_week_all": 18, "age": 25, "sex_male": 1.0, "train_status_enc": 2}'

Schema notes:
    sex_male         : 0.0 (nữ) hoặc 1.0 (nam) cho user cá nhân.
                       Training data là study-level proportion [0.27–1.0].
    train_status_enc : 0 (untrained) hoặc 2 (trained). Không dùng 1.
    Missing fields   : Được fill tự động bằng train_medians (không phải 0).
    reps_week_all    : Được chấp nhận nhưng không dùng bởi model (13-feature schema).
    failure_binary   : Được chấp nhận nhưng không dùng bởi model.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ai_engine import TrainHypAI

app = FastAPI(
    title="TrainHyp AI API",
    description=(
        "Predict optimal training volume for muscle hypertrophy.\n\n"
        "**Note**: Missing fields are filled with training data medians. "
        "`train_status_enc` accepts 0 (untrained) or 2 (trained) only."
    ),
    version="2.1.0",
)

# ── CORS: Allow React dev server (localhost:3000) to call the API ──────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_engine = TrainHypAI(model_dir='./backend_models/')


class UserInput(BaseModel):
    """13-feature input schema (after data cleaning)."""

    # Training variables
    sets_week_all:          float = Field(..., ge=0, le=60,
                                          description="Tổng sets/tuần [required]")
    sets_week_direct:       float = Field(None, ge=0, le=60,
                                          description="Sets direct/tuần")
    frequency_direct:       float = Field(None, ge=0, le=7,
                                          description="Tần suất direct/tuần")
    sessions_per_week:      float = Field(None, ge=0, le=14,
                                          description="Số buổi/tuần")
    rep_range_all:          float = Field(None, ge=1, le=30,
                                          description="Rep range trung bình")
    interset_rest_min_all:  float = Field(None, ge=0.5, le=10,
                                          description="Nghỉ giữa sets (phút)")
    percentage_failure_all: float = Field(None, ge=0, le=100,
                                          description="% sets đến failure")
    weeks:                  float = Field(None, ge=1, le=52,
                                          description="Số tuần can thiệp")

    # Subject variables
    age:                    float = Field(None, ge=15, le=70,
                                          description="Tuổi")
    sex_male:               float = Field(None, ge=0, le=1,
                                          description="0=nữ, 1=nam")
    train_status_enc:       int   = Field(None,
                                          description="0=untrained, 2=trained")
    upper_body:             int   = Field(None, ge=0, le=1,
                                          description="1=upper, 0=lower")
    has_nutrition_control:  int   = Field(None, ge=0, le=1,
                                          description="1=có KS dinh dưỡng")

    # ── Extra fields sent by frontend test_cases (ignored by 13-feature model) ──
    reps_week_all:          float = Field(None, ge=0,
                                          description="Total reps/week [frontend compat, not used by model]")
    failure_binary:         int   = Field(None, ge=0, le=1,
                                          description="Binary failure flag [frontend compat, not used by model]")


@app.get("/", tags=["info"])
def root():
    return {"message": "TrainHyp AI API v2.1", "features": 13,
            "docs": "/docs"}


@app.get("/api/v1/health", tags=["info"])
def health():
    return {
        "status":        "healthy",
        "models_loaded": True,
        "n_features":    len(ai_engine.meta.get("feature_names", [])),
        "optimal_sets":  ai_engine.meta.get("optimal_sets_week", "N/A"),
        "sets_p90":      ai_engine.meta.get("sets_p90", "N/A"),
    }


@app.get("/api/v1/model-info", tags=["info"])
def model_info():
    """
    Trả về thông tin model: feature importance (SHAP), feature names,
    class mapping, P90 cap, uncertainty threshold.
    Frontend dùng endpoint này để hiển thị SHAP chart dynamic.
    """
    feature_importance = ai_engine.meta.get("feature_importance", {})

    # Sort by importance descending, return top 10
    sorted_features = sorted(
        feature_importance.items(),
        key=lambda kv: abs(kv[1]),
        reverse=True
    )[:10]

    # Normalize pct relative to max value
    max_val = max(abs(v) for _, v in sorted_features) if sorted_features else 1

    return {
        "feature_importance": [
            {
                "name":  name,
                "value": round(float(val), 4),
                "pct":   round(abs(float(val)) / max_val * 100, 1),
            }
            for name, val in sorted_features
        ],
        "feature_names":        ai_engine.meta.get("feature_names", []),
        "class_mapping":        ai_engine.meta.get("class_mapping", {}),
        "sets_p90":             ai_engine.meta.get("sets_p90", 32),
        "optimal_sets_week":    ai_engine.meta.get("optimal_sets_week", "N/A"),
        "uncertainty_threshold": round(
            float(ai_engine.meta.get("uncertainty_threshold", 0.5)), 4
        ),
    }


@app.post("/api/v1/predict", tags=["prediction"])
def predict(user: UserInput):
    """
    Phân tích và gợi ý optimal training volume.

    Only `sets_week_all` is required.
    All other fields default to training data medians if not provided.

    Returns: hedges_g prediction, optimal sets, uncertainty, dose-response curve.
    """
    payload = {
        "sets.week.all":           user.sets_week_all,
        "sets.week.direct":        user.sets_week_direct,
        "frequency.direct":        user.frequency_direct,
        "sessions.per.week":       user.sessions_per_week,
        "rep.range.all":           user.rep_range_all,
        "interset.rest.min.all":   user.interset_rest_min_all,
        "percentage.failure.all":  user.percentage_failure_all,
        "weeks":                   user.weeks,
        "age":                     user.age,
        "sex.male":                user.sex_male,
        "train_status_enc":        user.train_status_enc,
        "upper_body":              user.upper_body,
        "has_nutrition_control":   user.has_nutrition_control,
    }

    result = ai_engine.predict(payload)

    if result["status"] == 500:
        raise HTTPException(status_code=500, detail=result["error"])

    return result
