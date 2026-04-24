import { useState, useEffect, useMemo, useCallback } from "react";
import {
  CheckCircle2,
  SlidersHorizontal,
  AlertTriangle,
  Activity,
  Shield,
  TrendingUp,
  User,
} from "lucide-react";
import {
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import testCasesData from "../data/test_cases.json";
import type { PredictionResult, TestCase, BackendResponse } from "../types";

// ─── Fallback static curve (while no prediction yet) ────────────────────────
const STATIC_CURVE = [
  { x: 0, y: 0.05 }, { x: 5, y: 0.15 }, { x: 10, y: 0.35 },
  { x: 12, y: 0.45 }, { x: 15, y: 0.55 }, { x: 18, y: 0.60 },
  { x: 22, y: 0.55 }, { x: 25, y: 0.35 }, { x: 30, y: 0.15 }, { x: 35, y: 0.25 },
];

// ─── Feature importance type ─────────────────────────────────────────────────
interface ShapFeature {
  name: string;
  value: number;
  pct: number;
}

// ─── Fallback hardcoded SHAP (used when backend offline) ────────────────────
const SHAP_FALLBACK: ShapFeature[] = [
  { name: "sets.week.all",          value: 0.42, pct: 100 },
  { name: "train_status_enc",       value: 0.28, pct: 67  },
  { name: "percentage.failure.all", value: 0.21, pct: 50  },
  { name: "has_nutrition_control",  value: 0.12, pct: 29  },
  { name: "weeks",                  value: 0.08, pct: 19  },
];

// ─── Normalize feature name for comparison (dots ↔ underscores) ──────────────
function normalizeFeatureName(name: string): string {
  return name.replace(/\./g, "_").toLowerCase();
}

// ─── Default user profile (editable) ─────────────────────────────────────────
interface UserProfile {
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
  train_status_enc: number; // 0 = Untrained, 2 = Trained
  sex_male: number;         // 0 = Female, 1 = Male
  upper_body: number;       // 0 = Lower, 1 = Upper
  has_nutrition_control: number; // 0 = None, 1 = Caloric Surplus
}

const DEFAULT_PROFILE: UserProfile = {
  sets_week_all: 18,
  sets_week_direct: 4,
  frequency_direct: 1,
  sessions_per_week: 3,
  reps_week_all: 180,
  rep_range_all: 10,
  interset_rest_min_all: 1.25,
  percentage_failure_all: 22.5,
  weeks: 6,
  age: 22,
  failure_binary: 0,
  train_status_enc: 2,
  sex_male: 1,
  upper_body: 1,
  has_nutrition_control: 1,
};

// ─── Custom dot for optimal point ─────────────────────────────────────────────
const OptimalDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.isOptimal) {
    return <circle cx={cx} cy={cy} r={6} stroke="#0058be" strokeWidth={3} fill="white" />;
  }
  return null;
};

// ─── Build chart data from dose_response_curve ─────────────────────────────────
function buildCurveData(
  curve: PredictionResult["dose_response_curve"],
  optimalSets?: number
) {
  if (!curve) return STATIC_CURVE;
  return curve.sets.map((x, i) => ({
    x,
    y: curve.hedges_g[i],
    isOptimal: x === optimalSets,
  }));
}

// ─── Class badge colors ───────────────────────────────────────────────────────
function classBadgeStyle(cls: string) {
  if (cls === "High")   return "bg-[#d8e2ff] text-[#0058be]";
  if (cls === "Medium") return "bg-[#ffeed9] text-[#a04e00]";
  return "bg-[#131b2e] text-white";
}

// ─── Labeled Slider ───────────────────────────────────────────────────────────
interface SliderFieldProps {
  label: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  displayValue?: string;
}

function SliderField({ label, unit, value, min, max, step = 1, onChange, displayValue }: SliderFieldProps) {
  const pct = Math.min(((value - min) / (max - min)) * 100, 100);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-[#424754] tracking-wider uppercase">
          {label}{unit && <span className="normal-case tracking-normal opacity-80"> ({unit})</span>}
        </label>
        <span className="text-sm font-bold text-[#0058be]">{displayValue ?? value}</span>
      </div>
      {/* Track */}
      <div className="relative h-2 w-full">
        <div className="absolute inset-0 bg-[#dae2fd] rounded-full" />
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0058be] to-[#2170e4] rounded-full pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{ WebkitAppearance: "none" }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.18)] border-2 border-[#0058be] transition-transform hover:scale-110 pointer-events-none"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#c2c6d6] font-medium">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ─── Dropdown Field ───────────────────────────────────────────────────────────
interface DropdownFieldProps<T extends string | number> {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
}

function DropdownField<T extends string | number>({ label, value, options, onChange }: DropdownFieldProps<T>) {
  const current = options.find(o => o.value === value);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold text-[#424754] tracking-wider uppercase">{label}</label>
      <div className="relative">
        <select
          value={String(value)}
          onChange={(e) => {
            const raw = e.target.value;
            // try parse as number; if NaN, pass as string
            const num = Number(raw);
            onChange((isNaN(num) ? raw : num) as T);
          }}
          className="w-full h-12 bg-[#f2f3ff] border border-transparent rounded-xl px-4 pr-10 text-sm text-[#131b2e] font-semibold hover:bg-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0058be]/30 transition-colors cursor-pointer appearance-none"
        >
          {options.map(o => (
            <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#727785]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VolumeOptimizer() {
  const [activeTab, setActiveTab] = useState<"demo" | "custom">("demo");
  const [selectedCase, setSelectedCase] = useState<TestCase>(
    testCasesData.test_cases[0] as TestCase
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [shapFeatures, setShapFeatures] = useState<ShapFeature[]>(SHAP_FALLBACK);

  // ── Helper to update individual profile fields ──────────────────────────────
  const updateProfile = useCallback((key: keyof UserProfile, val: number) => {
    setUserProfile(prev => ({ ...prev, [key]: val }));
  }, []);

  // ── Parse real backend response into PredictionResult ──────────────────────
  const parseBackendResponse = (raw: BackendResponse): PredictionResult => {
    const d = raw.data;
    return {
      predicted_class:   d.responder_class,
      predicted_insight: d.recommendation.insight,
      responder_insight: d.responder_insight,
      confidence:        d.confidence.level === "High" ? 0.95 : 0.70,
      hedges_g:          d.current_status.hedges_g,
      optimal_sets:      d.recommendation.optimal_sets,
      safe_range:        d.recommendation.safe_range,
      optimal_g:         d.recommendation.optimal_g,
      sigma_ngb:         d.confidence.sigma_ngb,
      confidence_ci:     d.current_status.confidence_ci,
      top_features:      d.top_features,
      warnings:          d.warnings,
      dose_response_curve: d.dose_response_curve,
      isFallback:        false,
    };
  };

  // ── Build fallback PredictionResult when backend offline ────────────────────
  const buildFallback = (cls: string, desc: string, insight: string, sets: number): PredictionResult => ({
    predicted_class:   cls,
    predicted_insight: insight,
    responder_insight: `Cơ địa ${cls} Responder — ${
      cls === "High"   ? "tăng cơ tốt ở volume cao" :
      cls === "Medium" ? "cần volume vừa phải, nhất quán" :
                         "tập trung kỹ thuật + nhất quán"
    }`,
    confidence:        cls === "High" ? 0.95 : 0.89,
    hedges_g:          cls === "High" ? 0.85 : cls === "Medium" ? 0.45 : 0.20,
    optimal_sets:      Math.floor(sets * 0.8),
    safe_range:        null,
    optimal_g:         0,
    sigma_ngb:         0,
    confidence_ci:     "",
    top_features:      ["sets.week.all", "train_status_enc", "percentage.failure.all"],
    warnings:          [],
    dose_response_curve: null,
    isFallback:        true,
  });

  // ── Run prediction from Demo tab ──────────────────────────────────────────────
  const runDemoPrediction = async (tc: TestCase) => {
    setIsPredicting(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tc.request_body),
      });
      if (!response.ok) throw new Error("Backend error");
      const raw: BackendResponse = await response.json();
      if (raw.status === 500) throw new Error("Backend 500");
      setPredictionResult(parseBackendResponse(raw));
      setIsPredicting(false);
    } catch {
      setTimeout(() => {
        setPredictionResult(buildFallback(tc.expected_class, tc.description, tc.expected_insight, tc.request_body.sets_week_all));
        setIsPredicting(false);
      }, 600);
    }
  };

  // ── Run prediction from Custom tab ────────────────────────────────────────────
  const runCustomPrediction = async () => {
    setIsPredicting(true);
    const body = {
      sets_week_all:          userProfile.sets_week_all,
      sets_week_direct:       userProfile.sets_week_direct,
      frequency_direct:       userProfile.frequency_direct,
      sessions_per_week:      userProfile.sessions_per_week,
      reps_week_all:          userProfile.reps_week_all,
      rep_range_all:          userProfile.rep_range_all,
      interset_rest_min_all:  userProfile.interset_rest_min_all,
      percentage_failure_all: userProfile.percentage_failure_all,
      weeks:                  userProfile.weeks,
      age:                    userProfile.age,
      failure_binary:         userProfile.failure_binary,
      train_status_enc:       userProfile.train_status_enc,
      sex_male:               userProfile.sex_male,
      upper_body:             userProfile.upper_body,
      has_nutrition_control:  userProfile.has_nutrition_control,
    };
    try {
      const response = await fetch("http://localhost:8000/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Backend error");
      const raw: BackendResponse = await response.json();
      if (raw.status === 500) throw new Error("Backend 500");
      setPredictionResult(parseBackendResponse(raw));
      setIsPredicting(false);
    } catch {
      const cls = userProfile.sets_week_all >= 25 ? "High" : userProfile.sets_week_all >= 12 ? "Medium" : "Low";
      setTimeout(() => {
        setPredictionResult(buildFallback(cls, "Custom Profile", "Borderline optimal", userProfile.sets_week_all));
        setIsPredicting(false);
      }, 600);
    }
  };

  const handleCaseSelect = (tc: TestCase) => {
    setSelectedCase(tc);
    setPredictionResult(null);
    runDemoPrediction(tc);
  };

  // Auto-run on mount: fetch SHAP model-info + initial demo prediction
  useEffect(() => {
    // Fetch dynamic SHAP feature importance from backend
    fetch("http://localhost:8000/api/v1/model-info")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.feature_importance) && data.feature_importance.length > 0) {
          setShapFeatures(data.feature_importance);
        }
      })
      .catch(() => {
        // Backend offline → keep SHAP_FALLBACK (already set as default)
      });

    runDemoPrediction(selectedCase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived display values ────────────────────────────────────────────────────
  const activeProfile = activeTab === "demo" ? selectedCase.request_body : userProfile;

  // Chart: real curve from backend or static placeholder
  const curveData = useMemo(
    () => buildCurveData(predictionResult?.dose_response_curve ?? null, predictionResult?.optimal_sets),
    [predictionResult]
  );

  const zoneX1 = predictionResult?.safe_range
    ? predictionResult.safe_range[0]
    : predictionResult?.optimal_sets
    ? predictionResult.optimal_sets - 4
    : 8;
  const zoneX2 = predictionResult?.safe_range
    ? predictionResult.safe_range[1]
    : predictionResult?.optimal_sets
    ? predictionResult.optimal_sets + 4
    : 16;

  const yMax = predictionResult?.dose_response_curve
    ? Math.max(...predictionResult.dose_response_curve.hedges_g) * 1.2
    : 0.8;

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <header className="mb-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#0058be] tracking-tight mb-2">
          TrainHyp Dashboard
        </h1>
        <p className="text-[13px] text-[#424754] font-medium tracking-wide">
          Predict optimal training volume for muscle hypertrophy
        </p>
      </header>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-2 bg-[#f2f3ff] p-1.5 rounded-2xl w-fit">
        <button
          id="tab-demo"
          onClick={() => setActiveTab("demo")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${
            activeTab === "demo"
              ? "bg-white text-[#0058be] shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
              : "text-[#424754] hover:text-[#0058be]"
          }`}
        >
          <Activity className="w-4 h-4" />
          Demo Cases
        </button>
        <button
          id="tab-custom"
          onClick={() => setActiveTab("custom")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${
            activeTab === "custom"
              ? "bg-white text-[#0058be] shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
              : "text-[#424754] hover:text-[#0058be]"
          }`}
        >
          <User className="w-4 h-4" />
          Custom Profile
        </button>
      </div>

      {/* ── Demo Panel ── */}
      {activeTab === "demo" && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 mb-2">
          <h3 className="text-[13px] font-bold text-[#131b2e] mb-4 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0058be]" /> Demo Test Cases
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {(testCasesData.test_cases as TestCase[]).map((tc) => (
              <div
                key={tc.case_id}
                onClick={() => handleCaseSelect(tc)}
                className={`flex-shrink-0 w-[280px] p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedCase?.case_id === tc.case_id
                    ? "border-[#0058be] bg-[#f2f3ff] shadow-sm"
                    : "border-[#c2c6d6]/30 hover:border-[#0058be]/40 hover:bg-[#faf8ff]"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-[#424754] bg-white px-2 py-0.5 rounded shadow-sm border border-[#c2c6d6]/20">
                    Case #{tc.case_id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${classBadgeStyle(tc.expected_class)}`}>
                    {tc.expected_class}
                  </span>
                </div>
                <p className="text-[12px] font-semibold text-[#131b2e] leading-snug mb-2">
                  {tc.description}
                </p>
                <p className="text-[10px] text-[#727785] leading-relaxed line-clamp-2">{tc.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Banners ── */}
      {predictionResult?.isFallback && (
        <div className="flex items-center gap-2 bg-[#ffeed9] text-[#a04e00] px-4 py-3 rounded-xl border border-[#a04e00]/20 text-[12px] font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Demo mode active: API unavailable. Showing intelligent fallback data.</span>
        </div>
      )}

      {predictionResult && !predictionResult.isFallback && predictionResult.warnings.length > 0 && (
        <div className="bg-[#fff8e6] border border-[#e8a020]/30 rounded-xl px-5 py-4 space-y-1">
          {predictionResult.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-[12px] text-[#7a4800] font-medium">
              <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Clinical Profile ── */}
        <div className="xl:col-span-4 bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col gap-6 h-full">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#131b2e] tracking-tight">Clinical Profile</h3>
            <SlidersHorizontal className="w-5 h-5 text-[#727785]" />
          </div>

          {activeTab === "demo" ? (
            /* ── Demo mode: read-only summary ── */
            <div className="space-y-4 flex-1">
              {[
                { label: "Training Status", value: selectedCase.request_body.train_status_enc === 2 ? "Trained" : "Untrained" },
                { label: "Age", value: `${selectedCase.request_body.age} yrs` },
                { label: "Weekly Sets", value: `${selectedCase.request_body.sets_week_all} sets` },
                { label: "Reps / Week", value: `${selectedCase.request_body.reps_week_all}` },
                { label: "Nutrition", value: selectedCase.request_body.has_nutrition_control === 1 ? "Caloric Surplus" : "None" },
                { label: "Weeks", value: `${selectedCase.request_body.weeks} wks` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#f2f3ff] last:border-0">
                  <span className="text-[11px] font-bold text-[#424754] tracking-widest uppercase">{label}</span>
                  <span className="text-sm font-semibold text-[#131b2e]">{value}</span>
                </div>
              ))}
              <p className="text-[10px] text-[#727785] font-medium mt-2 leading-relaxed">
                Switch to <span className="text-[#0058be] font-bold">Custom Profile</span> tab to enter your own parameters.
              </p>
            </div>
          ) : (
            /* ── Custom mode: fully interactive ── */
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              <DropdownField
                label="Training Status"
                value={userProfile.train_status_enc}
                options={[
                  { label: "Untrained (Beginner)", value: 0 },
                  { label: "Trained (Intermediate+)", value: 2 },
                ]}
                onChange={(v) => updateProfile("train_status_enc", Number(v))}
              />

              <DropdownField
                label="Sex"
                value={userProfile.sex_male}
                options={[
                  { label: "Female", value: 0 },
                  { label: "Male", value: 1 },
                ]}
                onChange={(v) => updateProfile("sex_male", Number(v))}
              />

              <DropdownField
                label="Muscle Group Focus"
                value={userProfile.upper_body}
                options={[
                  { label: "Lower Body", value: 0 },
                  { label: "Upper Body", value: 1 },
                ]}
                onChange={(v) => updateProfile("upper_body", Number(v))}
              />

              <DropdownField
                label="Nutrition Control"
                value={userProfile.has_nutrition_control}
                options={[
                  { label: "None (No control)", value: 0 },
                  { label: "Caloric Surplus", value: 1 },
                ]}
                onChange={(v) => updateProfile("has_nutrition_control", Number(v))}
              />

              <SliderField
                label="Age"
                unit="years"
                value={userProfile.age}
                min={15}
                max={70}
                onChange={(v) => updateProfile("age", v)}
              />

              <SliderField
                label="Weekly Sets (All)"
                value={userProfile.sets_week_all}
                min={1}
                max={50}
                onChange={(v) => updateProfile("sets_week_all", v)}
              />

              <SliderField
                label="Sessions / Week"
                value={userProfile.sessions_per_week}
                min={1}
                max={14}
                onChange={(v) => updateProfile("sessions_per_week", v)}
              />

              <SliderField
                label="Rep Range (avg)"
                value={userProfile.rep_range_all}
                min={1}
                max={30}
                onChange={(v) => updateProfile("rep_range_all", v)}
              />

              <SliderField
                label="% Sets to Failure"
                unit="%"
                value={userProfile.percentage_failure_all}
                min={0}
                max={100}
                step={5}
                onChange={(v) => updateProfile("percentage_failure_all", v)}
              />

              <SliderField
                label="Rest Between Sets"
                unit="min"
                value={userProfile.interset_rest_min_all}
                min={0.5}
                max={10}
                step={0.25}
                onChange={(v) => updateProfile("interset_rest_min_all", v)}
              />

              <SliderField
                label="Program Duration"
                unit="weeks"
                value={userProfile.weeks}
                min={1}
                max={52}
                onChange={(v) => updateProfile("weeks", v)}
              />
            </div>
          )}

          {/* Run Button */}
          <div className="pt-4 border-t border-[#f2f3ff] flex-shrink-0 space-y-4">
            <button
              id="btn-run-prediction"
              onClick={() => activeTab === "demo" ? runDemoPrediction(selectedCase) : runCustomPrediction()}
              disabled={isPredicting}
              className={`w-full text-white font-bold text-[13px] py-3.5 rounded-xl transition-colors shadow-[0_4px_12px_rgba(0,88,190,0.2)] flex items-center justify-center gap-2 ${
                isPredicting ? "bg-[#c2c6d6] cursor-not-allowed" : "bg-[#0058be] hover:bg-[#004395]"
              }`}
            >
              {isPredicting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Predicting...
                </>
              ) : "Run Prediction"}
            </button>

            {predictionResult && !predictionResult.isFallback && predictionResult.confidence_ci && (
              <div className="bg-[#f2f3ff] rounded-xl px-4 py-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#0058be]" />
                <span className="text-[11px] text-[#424754] font-medium">
                  95% CI: <span className="text-[#0058be] font-bold">{predictionResult.confidence_ci}</span>
                </span>
              </div>
            )}

            <div>
              <h4 className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-3">Quick Notes</h4>
              <ul className="space-y-2">
                {[
                  "Prediction updates on Run",
                  "Based on training volume and profile",
                  "Research-based ensemble estimate",
                  "Use moderate volume for best response",
                ].map((note) => (
                  <li key={note} className="flex items-start gap-2 text-[11px] text-[#424754] font-medium leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-[#b7c8e1] flex-shrink-0 mt-1.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Right Column Group ── */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Top Metrics Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-opacity duration-300 ${
              !predictionResult ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Hedges' g */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4">Predicted Hedges' g</span>
              <div>
                <div className="flex items-end gap-1.5">
                  <span className="text-[44px] font-light tracking-tighter text-[#0058be] leading-none">
                    {predictionResult ? predictionResult.hedges_g.toFixed(2) : "--"}
                  </span>
                  <span className="text-sm text-[#727785] font-semibold mb-1">ES</span>
                </div>
                <p className="text-[10px] text-[#727785] font-medium mt-3 leading-tight">
                  Based on current<br />clinical profile
                </p>
              </div>
            </div>

            {/* Classification */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4">Classification</span>
              <div className="pb-2">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm ${
                    predictionResult ? classBadgeStyle(predictionResult.predicted_class) : "bg-[#f2f3ff] text-[#424754]"
                  }`}
                >
                  {predictionResult ? predictionResult.predicted_class + " Responder" : "Pending"}
                </span>
              </div>
            </div>

            {/* Optimal Sets */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between relative overflow-hidden">
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4 relative z-10">Optimal Sets</span>
              <div className="flex items-end gap-1.5 relative z-10 pb-1">
                <span className="text-[44px] font-light tracking-tighter text-[#131b2e] leading-none">
                  {predictionResult?.optimal_sets ?? "--"}
                </span>
                <span className="text-sm text-[#727785] font-semibold mb-1">/ week</span>
              </div>
              {predictionResult?.safe_range && (
                <p className="text-[10px] text-[#727785] font-medium mt-1 relative z-10">
                  Safe: {predictionResult.safe_range[0]}–{predictionResult.safe_range[1]}
                </p>
              )}
            </div>

            {/* Model Confidence */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4">Model Confidence</span>
              <div className="flex flex-col pb-1">
                <span className="text-[32px] font-light text-[#131b2e] tracking-tight leading-none mb-2">
                  {predictionResult ? (predictionResult.confidence * 100).toFixed(0) + "%" : "--"}
                </span>
                <span className="text-[10px] text-[#727785] font-medium mt-1">
                  Expected Class Match:{" "}
                  {predictionResult
                    ? activeTab === "demo"
                      ? predictionResult?.predicted_class === selectedCase.expected_class ? "Yes" : "No"
                      : "N/A (custom)"
                    : "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Insight Banner */}
          <div
            className={`transition-opacity duration-300 bg-[#fcfdff] rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 relative overflow-hidden ${
              !predictionResult ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#d8e2ff] rounded-full opacity-40 blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#d8e2ff]/50 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-5">
                  {predictionResult?.isFallback ? "Demo Insight" : "AI Predicted Insight"}
                </span>
                <h3 className="text-[28px] font-light tracking-tight text-[#0058be] mb-3 leading-tight max-w-xl">
                  {predictionResult
                    ? predictionResult.responder_insight || predictionResult.predicted_insight
                    : "Waiting for prediction..."}
                </h3>
                <p className="text-[13px] text-[#131b2e] mt-4 max-w-lg leading-relaxed font-medium">
                  Recommendation:{" "}
                  <span className="font-bold text-[#0058be]">{predictionResult?.predicted_insight}</span>
                  <br />
                  {activeTab === "demo"
                    ? `Based on case profile: ${selectedCase.description}.`
                    : `Based on custom profile: ${userProfile.train_status_enc === 2 ? "Trained" : "Untrained"}, ${userProfile.sets_week_all} sets/week.`}
                </p>
              </div>
              {activeTab === "demo" && predictionResult?.predicted_class === selectedCase.expected_class && (
                <div
                  className="hidden sm:flex h-16 w-16 bg-[#d8e2ff]/40 rounded-full items-center justify-center text-[#0058be]"
                  title="Matched Expected Class"
                >
                  <CheckCircle2 className="w-7 h-7 fill-[#0058be] text-white" strokeWidth={1} />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Split: Chart + Feature Importance */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 transition-opacity duration-300 ${
              !predictionResult ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Dose-Response Chart */}
            <div className="lg:col-span-7 bg-white rounded-[24px] p-7 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-[13px] font-bold text-[#131b2e] mb-1">
                    Predicted Hypertrophy Response Curve
                  </h4>
                  {predictionResult && !predictionResult.isFallback && (
                    <p className="text-[10px] text-[#727785]">
                      Real data from EBM model · P90 cap:{" "}
                      {predictionResult.dose_response_curve?.safe_region_max} sets
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 bg-[#fcfdff] rounded-2xl relative overflow-hidden h-[300px] flex items-end px-2 pt-6 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curveData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <XAxis type="number" dataKey="x" hide domain={[0, predictionResult?.dose_response_curve ? 50 : 40]} />
                    <YAxis type="number" dataKey="y" hide domain={[0, yMax]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white text-[#131b2e] text-[11px] font-semibold px-3 py-2 rounded-lg shadow-lg border border-[#c2c6d6]/20">
                            <div>{d.x} sets → Hedges' g: {(d.y as number).toFixed(3)}</div>
                          </div>
                        );
                      }}
                    />
                    <ReferenceArea x1={zoneX1} x2={zoneX2} ifOverflow="hidden" {...{ fill: "#f2f3ff", fillOpacity: 1 } as any} />
                    {predictionResult?.optimal_sets && (
                      <ReferenceLine
                        x={predictionResult.optimal_sets}
                        stroke="#0058be"
                        strokeDasharray="4 3"
                        strokeWidth={1.5}
                        ifOverflow="hidden"
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#0058be"
                      strokeWidth={5}
                      dot={<OptimalDot />}
                      activeDot={{ r: 4, fill: "#0058be" }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="absolute left-[33%] top-4 text-center text-[10px] font-bold text-[#0058be] z-10 pointer-events-none">
                  {predictionResult?.optimal_sets ? `Optimal Zone (${predictionResult.optimal_sets} sets)` : "Zone"}
                </div>

                <div className="absolute bottom-4 left-10 right-10 flex justify-between text-[11px] font-bold text-[#727785] z-10 pointer-events-none">
                  <span>0</span><span>10</span><span>20</span><span>30+</span>
                </div>
                <div className="absolute left-4 top-8 bottom-12 flex flex-col justify-between text-[11px] font-bold text-[#727785] z-10 pointer-events-none">
                  <span>{yMax.toFixed(1)} ES</span>
                  <span>{(yMax / 2).toFixed(1)} ES</span>
                  <span className="flex flex-col -mb-4"><span>0.0 ES</span></span>
                </div>
              </div>
            </div>

            {/* Feature Importance (SHAP) */}
            <div className="lg:col-span-5 bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
              <h4 className="text-[13px] font-bold text-[#131b2e] mb-8">Feature Importance (SHAP)</h4>

              <div className="flex flex-col gap-6">
                {shapFeatures.map((feat, idx) => {
                  const isTopFeature =
                    predictionResult?.top_features.some((tf) => {
                      const normFeat = normalizeFeatureName(feat.name);
                      const normTf = normalizeFeatureName(tf);
                      return normFeat === normTf || normFeat.startsWith(normTf.split("_")[0]);
                    }) ?? false;

                  return (
                    <div key={feat.name}>
                      <div className="flex justify-between items-end mb-2">
                        <span
                          className={`text-[12px] font-bold ${
                            isTopFeature && predictionResult && !predictionResult.isFallback
                              ? "text-[#0058be]"
                              : "text-[#131b2e]"
                          }`}
                        >
                          {feat.name}
                          {isTopFeature && predictionResult && !predictionResult.isFallback && (
                            <span className="ml-1 text-[9px] bg-[#d8e2ff] text-[#0058be] px-1.5 py-0.5 rounded font-bold uppercase">Key</span>
                          )}
                        </span>
                        <span className="text-[#727785] text-[11px] font-bold">{feat.value}</span>
                      </div>
                      <div className="w-full bg-[#f2f3ff] h-2 rounded-r-md overflow-hidden relative">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-r-md transition-all duration-500 ${
                            idx < 3 ? "bg-[#0058be]" : "bg-[#c2c6d6]"
                          }`}
                          style={{
                            width: `${feat.pct}%`,
                            opacity: isTopFeature && predictionResult && !predictionResult.isFallback ? 1 : idx < 3 ? 0.8 : 0.5,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {predictionResult && !predictionResult.isFallback && (
                <div className="mt-8 pt-5 border-t border-[#f2f3ff]">
                  <p className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-3">
                    Model Top Features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predictionResult.top_features.map((f) => (
                      <span key={f} className="text-[10px] bg-[#d8e2ff] text-[#0058be] px-2.5 py-1 rounded font-bold">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-center pb-2 pt-2">
        <p className="text-[10px] font-bold text-[#727785] tracking-widest uppercase">
          Based on EBM + NGBoost + CatBoost + GPR ensemble · STAT3013 2026
        </p>
      </div>
    </div>
  );
}
