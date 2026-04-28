import { useState, useEffect } from "react";
import {
  Line, LineChart, ReferenceArea, ReferenceLine,
  ResponsiveContainer, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  CheckCircle2, AlertTriangle, BookOpen,
  User, TrendingUp, Shield, Activity,
} from "lucide-react";
import testCasesData from "../data/test_cases.json";
import type { TestCase, PredictionResult, BackendResponse } from "../types";
import { API_BASE } from "../config";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CLASS_COLOR: Record<string, string> = {
  High: "#0058be", Medium: "#f59e0b", Low: "#ef4444",
};

const CLASS_BG: Record<string, string> = {
  High: "bg-[#d8e2ff] text-[#0058be]",
  Medium: "bg-[#fef3c7] text-[#92400e]",
  Low: "bg-[#fee2e2] text-[#991b1b]",
};

const CLASS_NARRATIVE: Record<string, string> = {
  High: "This profile shows strong adaptation potential at elevated training volumes. The model predicts a large effect size, suggesting the subject's physiological capacity for hypertrophy is well-matched to their current programming.",
  Medium: "This profile demonstrates moderate hypertrophic response. Volume is a significant driver, but individual variation in recovery capacity and training history limits peak effect. Consistent programming is key.",
  Low: "This profile predicts a below-average hypertrophic response under current conditions. Contributing factors may include insufficient volume relative to training status, or unfavourable recovery conditions.",
};

// ─── Build chart data ─────────────────────────────────────────────────────────
function buildCurve(curve: PredictionResult["dose_response_curve"], optimalSets?: number) {
  if (!curve) return [];
  return curve.sets.map((x, i) => ({
    x, y: curve.hedges_g[i],
    isOptimal: x === optimalSets,
  }));
}

// ─── Optimal dot ──────────────────────────────────────────────────────────────
const OptimalDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.isOptimal)
    return <circle cx={cx} cy={cy} r={6} stroke="#0058be" strokeWidth={3} fill="white" />;
  return null;
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function CurveTip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white text-[11px] font-semibold px-3 py-2 rounded-lg shadow-lg border border-[#c2c6d6]/20">
      {d.x} sets → g = {(d.y as number).toFixed(3)}
    </div>
  );
}

// ─── Skeleton strip ───────────────────────────────────────────────────────────
function SkeletonBlock({ h = "h-32" }: { h?: string }) {
  return <div className={`bg-[#f2f3ff] animate-pulse rounded-2xl ${h} w-full`} />;
}

// ─── Parse backend ────────────────────────────────────────────────────────────
function parseBackend(raw: BackendResponse): PredictionResult {
  const d = raw.data;
  return {
    predicted_class:     d.responder_class,
    predicted_insight:   d.recommendation.insight,
    responder_insight:   d.responder_insight,
    confidence:          d.confidence.level === "High" ? 0.95 : 0.70,
    hedges_g:            d.current_status.hedges_g,
    optimal_sets:        d.recommendation.optimal_sets,
    safe_range:          d.recommendation.safe_range,
    optimal_g:           d.recommendation.optimal_g,
    sigma_ngb:           d.confidence.sigma_ngb,
    confidence_ci:       d.current_status.confidence_ci,
    top_features:        d.top_features,
    warnings:            d.warnings,
    dose_response_curve: d.dose_response_curve,
    isFallback:          false,
  };
}

function buildFallback(tc: TestCase): PredictionResult {
  const cls = tc.expected_class;
  return {
    predicted_class:     cls,
    predicted_insight:   tc.expected_insight,
    responder_insight:   `${cls} Responder Profile`,
    confidence:          cls === "High" ? 0.95 : 0.87,
    hedges_g:            cls === "High" ? 0.85 : cls === "Medium" ? 0.45 : 0.15,
    optimal_sets:        Math.round(tc.request_body.sets_week_all * 0.85),
    safe_range:          null,
    optimal_g:           0,
    sigma_ngb:           0,
    confidence_ci:       "",
    top_features:        ["sets.week.all", "train_status_enc", "percentage.failure.all"],
    warnings:            [],
    dose_response_curve: null,
    isFallback:          true,
  };
}

// ─── Profile field row ────────────────────────────────────────────────────────
function ProfileRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#f2f3ff] last:border-0">
      <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase">{label}</span>
      <span className="text-[12px] font-semibold text-[#131b2e]">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CaseStudy() {
  const cases = testCasesData.test_cases as TestCase[];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const tc = cases[selectedIdx];

  async function runPrediction(testCase: TestCase) {
    setIsPredicting(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testCase.request_body),
      });
      if (!res.ok) throw new Error("non-ok");
      const raw: BackendResponse = await res.json();
      if (raw.status === 500) throw new Error("500");
      setResult(parseBackend(raw));
    } catch (err) {
      console.error('[TrainHyp] CaseStudy predict failed:', err);
      setTimeout(() => setResult(buildFallback(testCase)), 500);
    } finally {
      setIsPredicting(false);
    }
  }

  useEffect(() => { runPrediction(cases[0]); }, []); // eslint-disable-line

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    runPrediction(cases[idx]);
  };

  // Chart data
  const curveData = buildCurve(result?.dose_response_curve ?? null, result?.optimal_sets);
  const yMax = result?.dose_response_curve
    ? Math.max(...result.dose_response_curve.hedges_g) * 1.2
    : 1.0;
  const zoneX1 = result?.safe_range ? result.safe_range[0] : (result?.optimal_sets ?? 15) - 4;
  const zoneX2 = result?.safe_range ? result.safe_range[1] : (result?.optimal_sets ?? 15) + 4;

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#131b2e] tracking-tight mb-2">
          Case Study
        </h1>
        <p className="text-[13px] text-[#424754] font-medium">
          In-depth AI analysis of individual training profiles — select a case to generate a full clinical report.
        </p>
      </header>

      {/* Fallback banner */}
      {result?.isFallback && (
        <div className="flex items-center gap-2 bg-[#ffeed9] text-[#a04e00] px-4 py-3 rounded-xl border border-[#a04e00]/20 text-[12px] font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Demo mode — backend offline. Showing expected class fallback.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Case Selector */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Case cards */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
            <h3 className="text-[11px] font-bold text-[#424754] uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0058be]" /> Select Case
            </h3>
            <div className="flex flex-col gap-3">
              {cases.map((c, idx) => (
                <div
                  key={c.case_id}
                  onClick={() => handleSelect(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedIdx === idx
                      ? "border-[#0058be] bg-[#f2f3ff]"
                      : "border-[#c2c6d6]/30 hover:border-[#0058be]/40 hover:bg-[#fafbff]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#424754]">Case #{c.case_id}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${CLASS_BG[c.expected_class]}`}>
                      {c.expected_class}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#131b2e] leading-snug">{c.description}</p>
                  <p className="text-[10px] text-[#727785] mt-1 leading-relaxed line-clamp-2">{c.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subject profile */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
            <h3 className="text-[11px] font-bold text-[#424754] uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0058be]" /> Subject Profile
            </h3>
            <div className="space-y-0.5">
              <ProfileRow label="Training Status" value={tc.request_body.train_status_enc === 2 ? "Trained" : "Untrained"} />
              <ProfileRow label="Age"             value={`${tc.request_body.age} yrs`} />
              <ProfileRow label="Sex"             value={tc.request_body.sex_male >= 0.5 ? "Male" : "Female"} />
              <ProfileRow label="Weekly Sets"     value={`${tc.request_body.sets_week_all} sets/wk`} />
              <ProfileRow label="Frequency"       value={`${tc.request_body.frequency_direct}×/wk`} />
              <ProfileRow label="Sessions/Wk"     value={tc.request_body.sessions_per_week} />
              <ProfileRow label="Rep Range"       value={`~${tc.request_body.rep_range_all} reps`} />
              <ProfileRow label="% to Failure"    value={`${tc.request_body.percentage_failure_all}%`} />
              <ProfileRow label="Rest (sets)"     value={`${tc.request_body.interset_rest_min_all} min`} />
              <ProfileRow label="Program Length"  value={`${tc.request_body.weeks} wks`} />
              <ProfileRow label="Nutrition"       value={tc.request_body.has_nutrition_control === 1 ? "Surplus" : "None"} />
              <ProfileRow label="Muscle Group"    value={tc.request_body.upper_body === 1 ? "Upper Body" : "Lower Body"} />
            </div>
          </div>
        </div>

        {/* Right: Clinical Report */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Loading state */}
          {isPredicting && (
            <div className="flex flex-col gap-5">
              <SkeletonBlock h="h-[100px]" />
              <SkeletonBlock h="h-[120px]" />
              <SkeletonBlock h="h-[320px]" />
            </div>
          )}

          {!isPredicting && result && (
            <>
              {/* Prediction Status banner */}
              <div className="bg-gradient-to-br from-[#0058be] to-[#2170e4] rounded-[24px] p-8 text-white relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full" />
                <div className="absolute -right-4 top-12 w-24 h-24 bg-white/10 rounded-full" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2 block">
                    {result.isFallback ? "Expected Classification" : "AI Prediction Result"}
                  </span>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded bg-white/20 ${
                      result.predicted_class === tc.expected_class ? "border border-white/40" : ""
                    }`}>
                      {result.predicted_class} Responder
                    </span>
                    {result.predicted_class === tc.expected_class && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Matches expected
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-light leading-snug tracking-tight mb-3 max-w-lg">
                    {result.responder_insight}
                  </h2>
                  <p className="text-[12px] opacity-80 leading-relaxed max-w-md">
                    {CLASS_NARRATIVE[result.predicted_class]}
                  </p>
                </div>
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: "Hedges' g",
                    value: result.hedges_g.toFixed(3),
                    sub: "Current ES",
                    icon: Activity,
                    color: "text-[#0058be]",
                  },
                  {
                    label: "Optimal Volume",
                    value: result.optimal_sets,
                    sub: "sets / week",
                    icon: TrendingUp,
                    color: "text-[#22c55e]",
                  },
                  {
                    label: "Confidence",
                    value: (result.confidence * 100).toFixed(0) + "%",
                    sub: "model certainty",
                    icon: Shield,
                    color: "text-[#6366f1]",
                  },
                  {
                    label: "Safe Range",
                    value: result.safe_range ? `${result.safe_range[0]}–${result.safe_range[1]}` : "N/A",
                    sub: "sets / week",
                    icon: CheckCircle2,
                    color: "text-[#f59e0b]",
                  },
                ].map(({ label, value, sub, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span className="text-[9px] font-bold text-[#424754] uppercase tracking-widest">{label}</span>
                    </div>
                    <div className={`text-2xl font-light tracking-tight ${color}`}>{value}</div>
                    <div className="text-[9px] text-[#727785] font-medium mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="bg-[#fff8e6] border border-[#e8a020]/30 rounded-xl px-5 py-4 space-y-1">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[#7a4800] font-medium">
                      <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      {w}
                    </div>
                  ))}
                </div>
              )}

              {/* Dose-response curve */}
              <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
                <h4 className="text-[13px] font-bold text-[#131b2e] mb-1">Dose–Response Curve</h4>
                <p className="text-[10px] text-[#727785] mb-6">
                  Predicted Hedges' g across 1–50 sets/week for this subject profile
                  {result.isFallback ? " (demo)" : " · EBM model · P90 cap applied"}
                </p>

                {result.dose_response_curve ? (
                  <div className="h-[260px] bg-[#fcfdff] rounded-2xl relative overflow-hidden px-2 pt-6 pb-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={curveData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                        <XAxis type="number" dataKey="x" hide domain={[0, 50]} />
                        <YAxis type="number" dataKey="y" hide domain={[0, yMax]} />
                        <Tooltip content={<CurveTip />} />
                        <ReferenceArea x1={zoneX1} x2={zoneX2} ifOverflow="hidden" {...{ fill: "#f2f3ff", fillOpacity: 1 } as any} />
                        {result.optimal_sets && (
                          <ReferenceLine x={result.optimal_sets} stroke="#0058be" strokeDasharray="4 3" strokeWidth={1.5} ifOverflow="hidden" />
                        )}
                        <Line
                          type="monotone" dataKey="y" stroke="#0058be" strokeWidth={4}
                          dot={<OptimalDot />} activeDot={{ r: 4, fill: "#0058be" }}
                          isAnimationActive={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="absolute left-[33%] top-2 text-[10px] font-bold text-[#0058be] z-10 pointer-events-none">
                      Optimal Zone ({result.optimal_sets} sets)
                    </div>
                    <div className="absolute bottom-3 left-10 right-10 flex justify-between text-[10px] font-bold text-[#727785] pointer-events-none">
                      <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[260px] bg-[#f2f3ff] rounded-2xl flex items-center justify-center">
                    <p className="text-[12px] text-[#727785] font-medium">
                      Connect backend to view real dose-response curve
                    </p>
                  </div>
                )}
              </div>

              {/* Clinical Recommendation */}
              <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
                <h4 className="text-[13px] font-bold text-[#131b2e] mb-5">Clinical Recommendation</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-[#f2f3ff] rounded-xl p-4">
                    <TrendingUp className="w-4 h-4 text-[#0058be] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-[#131b2e] mb-1">Volume Adjustment</div>
                      <p className="text-[11px] text-[#424754] leading-relaxed">{result.predicted_insight}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#f2f3ff] rounded-xl p-4">
                    <Shield className="w-4 h-4 text-[#6366f1] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-[#131b2e] mb-1">Top Predictive Features</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {result.top_features.map(f => (
                          <span key={f} className="text-[10px] bg-[#d8e2ff] text-[#0058be] px-2 py-0.5 rounded font-bold">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {result.confidence_ci && (
                    <div className="flex items-start gap-3 bg-[#f2f3ff] rounded-xl p-4">
                      <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-[#131b2e] mb-1">Uncertainty Estimate (NGBoost)</div>
                        <p className="text-[11px] text-[#424754]">
                          95% CI: <span className="font-bold text-[#0058be]">{result.confidence_ci}</span>
                          {" "}· σ = {result.sigma_ngb.toFixed(3)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
