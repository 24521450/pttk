"""
╔══════════════════════════════════════════════════════════════╗
║  ai_engine.py  —  TrainHyp AI Engine                        ║
║  STAT3013 | 2026                                             ║
║                                                              ║
║  Usage:                                                      ║
║    from ai_engine import TrainHypAI                          ║
║    ai = TrainHypAI('./backend_models/')                      ║
║    result = ai.predict(payload)                              ║
║                                                              ║
║  Requires:                                                   ║
║    pip install catboost ngboost interpret joblib             ║
║                pandas numpy scikit-learn                     ║
║                                                              ║
║  Feature schema (13 features):                               ║
║    CONT (10): sets.week.all, sets.week.direct,               ║
║               frequency.direct, sessions.per.week,           ║
║               rep.range.all, interset.rest.min.all,          ║
║               percentage.failure.all, weeks, age, sex.male   ║
║    BIN  ( 3): train_status_enc, upper_body,                  ║
║               has_nutrition_control                          ║
║                                                              ║
║  Key changes vs v1:                                          ║
║    - fill_missing uses train_medians (not 0 — 0 breaks model)║
║    - optimal_sets capped at sets_p90 from training data      ║
║    - added calibration info to response                      ║
╚══════════════════════════════════════════════════════════════╝
"""

import pandas as pd
import numpy as np
import joblib
import traceback
import warnings
warnings.filterwarnings('ignore')


class TrainHypAI:
    """
    AI Engine tích hợp cho TrainHyp.
    Load tất cả models một lần, predict nhiều lần (stateless).
    """

    def __init__(self, model_dir: str = './backend_models/'):
        """
        Load toàn bộ models vào RAM.
        Gọi hàm này 1 lần khi FastAPI server khởi động.
        """
        try:
            self.meta         = joblib.load(f'{model_dir}/meta.pkl')
            self.imputer_cont = joblib.load(f'{model_dir}/imputer_cont.pkl')
            self.imputer_bin  = joblib.load(f'{model_dir}/imputer_bin.pkl')
            self.scaler       = joblib.load(f'{model_dir}/scaler.pkl')
            self.ebm_model    = joblib.load(f'{model_dir}/ebm_model.pkl')
            self.ngb_model    = joblib.load(f'{model_dir}/ngb_model.pkl')
            self.clf_model    = joblib.load(f'{model_dir}/catboost_clf.pkl')
            self.gpr_model    = joblib.load(f'{model_dir}/gpr_model.pkl')
            print("🚀 [TrainHyp AI] All models loaded successfully.")
        except FileNotFoundError as e:
            raise FileNotFoundError(
                f"❌ Model file not found: {e}\n"
                "   Run NB01 → NB06 to generate .pkl files first."
            )

    # ──────────────────────────────────────────────────────────
    def _preprocess(self, df_input: pd.DataFrame):
        """
        DataFrame → numpy arrays.

        Returns:
            X_proc : (n, 13) — cho EBM, NGBoost, CatBoost
            X_gpr  : (n, 10) — chỉ continuous, cho GPR
        """
        cont_cols = self.meta['continuous_cols']
        bin_cols  = self.meta['categorical_cols']

        X_cont = self.scaler.transform(
            self.imputer_cont.transform(df_input[cont_cols]))
        X_bin  = self.imputer_bin.transform(df_input[bin_cols])

        return np.hstack((X_cont, X_bin)), X_cont

    def _fill_missing(self, df_input: pd.DataFrame) -> pd.DataFrame:
        """
        Điền giá trị thiếu bằng TRAIN MEDIANS (không dùng 0 — 0 là giá trị bất hợp lý).
        age=0 hoặc sets=0 sẽ phá hoàn toàn kết quả prediction.
        """
        train_medians = self.meta.get('train_medians', {})
        for col in self.meta['feature_names']:
            if col not in df_input.columns or pd.isna(df_input[col].iloc[0]):
                fallback = train_medians.get(col, 0)
                df_input[col] = fallback
        return df_input

    def _check_safety(self, df_input, sigma_ngb, sigma_gpr) -> list:
        """4 safety rules."""
        warnings_list = []

        # Rule 1: Feature ngoài training range (extrapolation)
        for feat, (fmin, fmax) in self.meta['feature_ranges'].items():
            if feat in df_input.columns:
                val = float(df_input[feat].iloc[0])
                if val < fmin or val > fmax:
                    warnings_list.append(
                        f"⚠️  {feat}={val:.2f} ngoài training range "
                        f"[{fmin:.2f},{fmax:.2f}] — kết quả là extrapolation"
                    )

        # Rule 2: NGBoost uncertainty cao
        if sigma_ngb > self.meta['uncertainty_threshold']:
            warnings_list.append(
                f"⚠️  Uncertainty cao (σ={sigma_ngb:.3f} > "
                f"threshold {self.meta['uncertainty_threshold']:.3f})"
            )

        # Rule 3: GPR OOD
        if sigma_gpr > self.meta.get('gpr_ood_threshold', 1.0):
            warnings_list.append(
                f"⚠️  Input xa training distribution (GPR σ={sigma_gpr:.3f})"
            )

        # Rule 4: Volume bounds (based on training data range)
        current_sets = float(df_input['sets.week.all'].iloc[0])
        min_sets     = self.meta['safety_rules']['min_sets_junk_volume']
        max_sets     = self.meta['safety_rules']['max_sets_physiological']

        if current_sets < min_sets:
            warnings_list.append(
                f"⚠️  {current_sets} sets/tuần quá thấp (<{min_sets}) — junk volume"
            )
        elif current_sets > max_sets:
            warnings_list.append(
                f"⚠️  {current_sets} sets/tuần rất cao (>{max_sets}) — overtraining risk"
            )

        return warnings_list

    # ──────────────────────────────────────────────────────────
    def predict(self, payload: dict) -> dict:
        """
        Main API: payload dict → full analysis JSON.

        Args:
            payload: dict với keys = feature_names trong meta.pkl.
                     Ví dụ: {'sets.week.all': 18, 'age': 25, ...}
                     Missing keys → filled with train_medians (không phải 0).
        """
        try:
            feature_cols = self.meta['feature_names']

            # 1. Build + fill missing
            df_input = pd.DataFrame([payload])
            df_input = self._fill_missing(df_input)
            df_input = df_input[feature_cols]

            # 2. Preprocess
            X_proc, X_gpr = self._preprocess(df_input)

            # 3. Current hedges_g (EBM — best regression model)
            current_g = float(self.ebm_model.predict(X_proc)[0])

            # 4. Responder class (CatBoost Classifier)
            class_idx  = int(self.clf_model.predict(X_proc)[0])
            class_name = self.meta['class_mapping'][class_idx]

            # 5. Uncertainty (NGBoost)
            dist_now  = self.ngb_model.pred_dist(X_proc)
            sigma_ngb = float(dist_now.scale[0])

            # 6. OOD detection (GPR)
            _, gpr_std = self.gpr_model.predict(X_gpr, return_std=True)
            sigma_gpr  = float(gpr_std[0])

            # 7. Dose-response sweep — vectorized (1→50)
            sets_range = np.arange(1, 51)
            df_sim     = pd.concat([df_input] * len(sets_range), ignore_index=True)
            df_sim['sets.week.all'] = sets_range.astype(float)

            X_sim_proc, _ = self._preprocess(df_sim)
            raw_preds      = self.ebm_model.predict(X_sim_proc)

            curve_smooth = (
                pd.Series(raw_preds)
                .rolling(3, center=True, min_periods=1)
                .mean()
                .values
            )

            # ── Cap optimal at P90 of training data to avoid extrapolation ──
            # Background: EBM may extrapolate upward for sets > 32 (P90)
            # because only 5 rows in training have sets ≥ 40.
            # Using P90 as practical upper limit ensures recommendation
            # stays in the densely sampled region.
            sets_p90    = int(self.meta.get('sets_p90', 32))
            in_range    = sets_range <= sets_p90
            preds_safe  = np.where(in_range, curve_smooth, np.nan)

            optimal_idx  = int(np.nanargmax(preds_safe))
            optimal_sets = int(sets_range[optimal_idx])
            optimal_g    = float(curve_smooth[optimal_idx])

            # 8. Safety check
            current_sets  = float(df_input['sets.week.all'].iloc[0])
            warnings_list = self._check_safety(df_input, sigma_ngb, sigma_gpr)

            # 9. Interpret status
            ratio = current_sets / max(optimal_sets, 1)
            if ratio < 0.80:
                insight = f"Undertraining — tăng lên {optimal_sets} sets/tuần"
            elif ratio > 1.20:
                insight = "Overtraining risk — cân nhắc giảm volume"
            else:
                insight = "Optimal zone — tiếp tục duy trì"

            confidence = (
                "High" if sigma_ngb < self.meta['uncertainty_threshold'] else "Low"
            )

            top_3 = sorted(
                self.meta['feature_importance'].items(),
                key=lambda kv: kv[1], reverse=True)[:3]

            safe_buf = self.meta['safety_rules']['safe_range_buffer']
            safe_min = max(1,  optimal_sets - safe_buf)
            safe_max = min(sets_p90, optimal_sets + safe_buf)

            # 10. Return
            return {
                "status": 200,
                "data": {
                    "responder_class":   class_name,
                    "responder_insight": (
                        f"Cơ địa {class_name} Responder — "
                        + {
                            "High":   "tăng cơ tốt ở volume cao",
                            "Medium": "cần volume vừa phải, nhất quán",
                            "Low":    "tập trung kỹ thuật + nhất quán",
                        }[class_name]
                    ),
                    "current_status": {
                        "sets_per_week":  int(current_sets),
                        "hedges_g":       round(current_g, 3),
                        "uncertainty":    round(sigma_ngb, 3),
                        "confidence_ci":  f"±{round(1.96*sigma_ngb, 3)} (95% CI)",
                    },
                    "recommendation": {
                        "optimal_sets":   optimal_sets,
                        "safe_range":     [safe_min, safe_max],
                        "optimal_g":      round(optimal_g, 3),
                        "insight":        insight,
                        "note":           (
                            f"Optimal within P90 training range "
                            f"(≤{sets_p90} sets) to avoid extrapolation."
                        ),
                    },
                    "confidence": {
                        "level":         confidence,
                        "sigma_ngb":     round(sigma_ngb, 3),
                        "sigma_gpr":     round(sigma_gpr, 3),
                        "threshold_ngb": round(self.meta['uncertainty_threshold'], 3),
                    },
                    "top_features": [f[0] for f in top_3],
                    "warnings":     warnings_list,
                    "dose_response_curve": {
                        "sets":     sets_range.tolist(),
                        "hedges_g": [round(float(v), 4) for v in curve_smooth],
                        "safe_region_max": sets_p90,
                    },
                },
            }

        except Exception as e:
            return {
                "status": 500,
                "error":  str(e),
                "trace":  traceback.format_exc(),
            }


# ══════════════════════════════════════════════════════════════
# STANDALONE TEST
# ══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    import json

    ai = TrainHypAI(model_dir='./backend_models/')

    # Test case: trained male, 18 sets/week
    test_payload = {
        "sets.week.all":           18.0,
        "sets.week.direct":         8.0,
        "frequency.direct":         2.0,
        "sessions.per.week":        4.0,
        "rep.range.all":           10.0,
        "interset.rest.min.all":    2.0,
        "percentage.failure.all": 100.0,
        "weeks":                    8.0,
        "age":                     25.0,
        "sex.male":                 1.0,
        "train_status_enc":         2,
        "upper_body":               1,
        "has_nutrition_control":    0,
    }

    print("\n" + "="*60)
    print("TEST — Trained Male, 18 sets/week")
    print("="*60)
    result = ai.predict(test_payload)
    print(json.dumps(result, indent=2, ensure_ascii=False))
