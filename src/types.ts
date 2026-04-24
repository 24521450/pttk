/**
 * types.ts — TrainHyp Shared TypeScript Interfaces
 * STAT3013 | 2026
 */

// ─── Dose-Response Curve ─────────────────────────────────────────────────────
export interface DoseResponseCurve {
  sets: number[];
  hedges_g: number[];
  safe_region_max: number;
}

// ─── Prediction Result (merged backend + fallback) ───────────────────────────
export interface PredictionResult {
  /** "High" | "Medium" | "Low" */
  predicted_class: string;
  /** Short recommendation insight text */
  predicted_insight: string;
  /** Full responder class description */
  responder_insight: string;
  /** 0–1 confidence number for display */
  confidence: number;
  /** Current hedges' g effect size */
  hedges_g: number;
  /** Recommended sets/week */
  optimal_sets: number;
  /** [min, max] safe set range */
  safe_range: [number, number] | null;
  /** hedges_g at optimal sets */
  optimal_g: number;
  /** NGBoost uncertainty sigma */
  sigma_ngb: number;
  /** "±0.357 (95% CI)" string */
  confidence_ci: string;
  /** Top 3 feature names */
  top_features: string[];
  /** Safety warnings from backend */
  warnings: string[];
  /** Full dose-response sweep */
  dose_response_curve: DoseResponseCurve | null;
  /** True when backend is offline and demo data is used */
  isFallback: boolean;
}

// ─── Test Case ───────────────────────────────────────────────────────────────
export interface RequestBody {
  sets_week_all: number;
  sets_week_direct: number;
  frequency_direct: number;
  sessions_per_week: number;
  reps_week_all: number;
  rep_range_all: number;
  interset_rest_min_all: number;
  percentage_failure_all: number;
  weeks: number;
  age: number;
  failure_binary: number;
  train_status_enc: number;
  sex_male: number;
  upper_body: number;
  has_nutrition_control: number;
}

export interface TestCase {
  case_id: number;
  description: string;
  expected_class: string;
  expected_insight: string;
  note: string;
  request_body: RequestBody;
}

export interface TestCasesData {
  api_endpoint: string;
  content_type: string;
  test_cases: TestCase[];
}

// ─── Backend Raw Response ─────────────────────────────────────────────────────
export interface BackendResponse {
  status: number;
  data: {
    responder_class: string;
    responder_insight: string;
    current_status: {
      sets_per_week: number;
      hedges_g: number;
      uncertainty: number;
      confidence_ci: string;
    };
    recommendation: {
      optimal_sets: number;
      safe_range: [number, number];
      optimal_g: number;
      insight: string;
      note: string;
    };
    confidence: {
      level: string;
      sigma_ngb: number;
      sigma_gpr: number;
      threshold_ngb: number;
    };
    top_features: string[];
    warnings: string[];
    dose_response_curve: DoseResponseCurve;
  };
}
