/**
 * studyData.ts — Pre-processed statistics from data_cleaned.csv (199 observations)
 * Used by DataOverview, VolumeVsHypertrophy, CaseStudy pages.
 * 
 * Source: 69 studies, 199 muscle-level observations
 * Columns used: sets.week.all, hedges_g, hyp_class, train_status_enc, has_nutrition_control, age, weeks
 */

// ─── Raw scatter data (sets_week_all vs hedges_g) ─────────────────────────────
// Full 199 observations with class labels
export interface StudyPoint {
  sets: number;
  g: number;
  cls: "High" | "Medium" | "Low";
  trained: boolean;
  nutrition: boolean;
}

export const RAW_POINTS: StudyPoint[] = [
  { sets:18,g:0.31,cls:"Medium",trained:true,nutrition:true },
  { sets:13,g:0.42,cls:"Medium",trained:true,nutrition:true },
  { sets:14,g:0.26,cls:"Medium",trained:true,nutrition:true },
  { sets:28,g:0.78,cls:"Medium",trained:true,nutrition:true },
  { sets:18,g:0.09,cls:"Low",trained:true,nutrition:true },
  { sets:24,g:0.14,cls:"Low",trained:true,nutrition:true },
  { sets:6,g:0.64,cls:"Medium",trained:false,nutrition:false },
  { sets:4.6,g:0.36,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.62,cls:"Medium",trained:false,nutrition:false },
  { sets:6,g:0.38,cls:"Medium",trained:false,nutrition:false },
  { sets:8,g:-0.21,cls:"Low",trained:true,nutrition:false },
  { sets:8,g:-0.12,cls:"Low",trained:true,nutrition:false },
  { sets:3,g:0.15,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:-0.06,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:0.04,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:0.14,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:0.14,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:0.03,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:0.09,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:0.24,cls:"Medium",trained:false,nutrition:false },
  { sets:3,g:0.30,cls:"Medium",trained:false,nutrition:false },
  { sets:3,g:0.29,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.14,cls:"Low",trained:false,nutrition:false },
  { sets:9,g:-0.08,cls:"Low",trained:false,nutrition:false },
  { sets:9,g:0.14,cls:"Low",trained:false,nutrition:false },
  { sets:9,g:0.13,cls:"Low",trained:false,nutrition:false },
  { sets:9,g:0.15,cls:"Low",trained:false,nutrition:false },
  { sets:9,g:0.30,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.19,cls:"Low",trained:false,nutrition:false },
  { sets:9,g:0.21,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.40,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.34,cls:"Medium",trained:false,nutrition:false },
  { sets:0,g:-0.18,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:-0.01,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:-0.01,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:-0.09,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:0.06,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:0.00,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:0.11,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:0.07,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:0.02,cls:"Low",trained:false,nutrition:false },
  { sets:0,g:-0.06,cls:"Low",trained:false,nutrition:false },
  { sets:32,g:0.49,cls:"Medium",trained:false,nutrition:false },
  { sets:40,g:0.61,cls:"Medium",trained:false,nutrition:false },
  { sets:16,g:0.53,cls:"Medium",trained:false,nutrition:false },
  { sets:16,g:0.51,cls:"Medium",trained:false,nutrition:false },
  { sets:32,g:0.50,cls:"Medium",trained:false,nutrition:false },
  { sets:48,g:0.42,cls:"Medium",trained:false,nutrition:false },
  { sets:16,g:0.62,cls:"Medium",trained:false,nutrition:false },
  { sets:16,g:0.59,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.08,cls:"Low",trained:true,nutrition:false },
  { sets:9,g:0.21,cls:"Medium",trained:true,nutrition:false },
  { sets:32,g:0.71,cls:"Medium",trained:true,nutrition:false },
  { sets:32,g:0.77,cls:"Medium",trained:true,nutrition:false },
  { sets:32,g:0.60,cls:"Medium",trained:true,nutrition:false },
  { sets:32,g:0.44,cls:"Medium",trained:true,nutrition:false },
  { sets:32,g:0.60,cls:"Medium",trained:true,nutrition:false },
  { sets:32,g:0.97,cls:"High",trained:true,nutrition:false },
  { sets:32,g:0.27,cls:"Medium",trained:true,nutrition:false },
  { sets:32,g:0.83,cls:"High",trained:true,nutrition:false },
  { sets:32,g:0.93,cls:"High",trained:true,nutrition:false },
  { sets:32,g:0.28,cls:"Medium",trained:true,nutrition:false },
  { sets:30,g:0.65,cls:"Medium",trained:true,nutrition:false },
  { sets:30,g:1.13,cls:"High",trained:true,nutrition:false },
  { sets:12,g:1.16,cls:"High",trained:true,nutrition:false },
  { sets:30,g:0.23,cls:"Medium",trained:true,nutrition:false },
  { sets:30,g:0.43,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.75,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.21,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.09,cls:"Low",trained:true,nutrition:false },
  { sets:6,g:0.14,cls:"Low",trained:true,nutrition:false },
  { sets:6,g:0.11,cls:"Low",trained:true,nutrition:false },
  { sets:9,g:0.31,cls:"Medium",trained:true,nutrition:false },
  { sets:9,g:0.45,cls:"Medium",trained:true,nutrition:false },
  { sets:18,g:0.35,cls:"High",trained:true,nutrition:false },
  { sets:18,g:0.22,cls:"High",trained:true,nutrition:false },
  { sets:27,g:0.36,cls:"High",trained:true,nutrition:false },
  { sets:27,g:0.59,cls:"High",trained:true,nutrition:false },
  { sets:30,g:0.72,cls:"High",trained:true,nutrition:false },
  { sets:30,g:0.59,cls:"High",trained:true,nutrition:false },
  { sets:45,g:1.64,cls:"High",trained:true,nutrition:false },
  { sets:45,g:1.15,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.05,cls:"Low",trained:true,nutrition:false },
  { sets:16,g:0.07,cls:"Low",trained:true,nutrition:false },
  { sets:16,g:0.16,cls:"Low",trained:true,nutrition:false },
  { sets:24,g:0.10,cls:"Low",trained:true,nutrition:false },
  { sets:24,g:0.30,cls:"High",trained:true,nutrition:false },
  { sets:24,g:0.40,cls:"High",trained:true,nutrition:false },
  { sets:32,g:0.34,cls:"High",trained:true,nutrition:false },
  { sets:32,g:0.59,cls:"High",trained:true,nutrition:false },
  { sets:32,g:0.65,cls:"High",trained:true,nutrition:false },
  { sets:12,g:1.21,cls:"High",trained:true,nutrition:false },
  { sets:12,g:1.04,cls:"High",trained:true,nutrition:false },
  { sets:6,g:0.08,cls:"Low",trained:false,nutrition:false },
  { sets:9,g:0.05,cls:"Low",trained:false,nutrition:false },
  { sets:18,g:0.79,cls:"Medium",trained:false,nutrition:false },
  { sets:27,g:0.07,cls:"High",trained:false,nutrition:false },
  { sets:30,g:1.17,cls:"High",trained:false,nutrition:false },
  { sets:45,g:2.26,cls:"High",trained:false,nutrition:false },
  { sets:36,g:1.13,cls:"High",trained:true,nutrition:false },
  { sets:36,g:1.16,cls:"High",trained:true,nutrition:false },
  { sets:24,g:0.48,cls:"High",trained:true,nutrition:false },
  { sets:24,g:0.74,cls:"High",trained:true,nutrition:false },
  { sets:36,g:0.67,cls:"High",trained:true,nutrition:false },
  { sets:36,g:0.69,cls:"High",trained:true,nutrition:false },
  { sets:24,g:0.10,cls:"High",trained:true,nutrition:false },
  { sets:24,g:0.36,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.53,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.46,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.97,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.97,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.49,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.36,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.90,cls:"High",trained:true,nutrition:false },
  { sets:16,g:1.28,cls:"High",trained:true,nutrition:false },
  { sets:15,g:0.33,cls:"Medium",trained:true,nutrition:false },
  { sets:19,g:0.47,cls:"High",trained:true,nutrition:false },
  { sets:9,g:0.17,cls:"Medium",trained:true,nutrition:false },
  { sets:15,g:0.36,cls:"Medium",trained:true,nutrition:false },
  { sets:19,g:0.89,cls:"High",trained:true,nutrition:false },
  { sets:9,g:0.68,cls:"High",trained:true,nutrition:false },
  { sets:12,g:0.50,cls:"Medium",trained:false,nutrition:false },
  { sets:12,g:0.59,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.31,cls:"Medium",trained:true,nutrition:false },
  { sets:18,g:0.58,cls:"High",trained:true,nutrition:false },
  { sets:27,g:0.38,cls:"High",trained:true,nutrition:false },
  { sets:15,g:0.68,cls:"Medium",trained:false,nutrition:false },
  { sets:9,g:0.56,cls:"Medium",trained:false,nutrition:false },
  { sets:6,g:0.66,cls:"Low",trained:false,nutrition:false },
  { sets:24,g:0.65,cls:"High",trained:true,nutrition:false },
  { sets:16,g:0.87,cls:"High",trained:true,nutrition:false },
  { sets:12,g:0.25,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.56,cls:"Medium",trained:true,nutrition:false },
  { sets:24,g:-0.11,cls:"Low",trained:true,nutrition:false },
  { sets:16,g:0.83,cls:"High",trained:true,nutrition:false },
  { sets:12,g:0.51,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.61,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.35,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.34,cls:"Medium",trained:true,nutrition:false },
  { sets:18,g:0.37,cls:"High",trained:true,nutrition:false },
  { sets:18,g:0.28,cls:"High",trained:true,nutrition:false },
  { sets:24,g:0.19,cls:"High",trained:true,nutrition:false },
  { sets:24,g:0.62,cls:"High",trained:true,nutrition:false },
  { sets:4,g:0.13,cls:"Low",trained:true,nutrition:false },
  { sets:16,g:0.13,cls:"High",trained:true,nutrition:false },
  { sets:20,g:0.14,cls:"High",trained:true,nutrition:false },
  { sets:4,g:0.16,cls:"Low",trained:true,nutrition:false },
  { sets:16,g:0.24,cls:"High",trained:true,nutrition:false },
  { sets:20,g:0.18,cls:"High",trained:true,nutrition:false },
  { sets:2,g:0.31,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:0.69,cls:"Low",trained:false,nutrition:false },
  { sets:2,g:0.51,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:0.12,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:0.43,cls:"Low",trained:false,nutrition:false },
  { sets:2,g:-0.19,cls:"Low",trained:false,nutrition:false },
  { sets:3,g:0.26,cls:"Low",trained:true,nutrition:false },
  { sets:3,g:0.25,cls:"Low",trained:true,nutrition:false },
  { sets:7,g:0.27,cls:"Medium",trained:true,nutrition:false },
  { sets:6,g:0.22,cls:"Low",trained:true,nutrition:false },
  { sets:6,g:0.12,cls:"Low",trained:true,nutrition:false },
  { sets:14,g:0.42,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.62,cls:"Medium",trained:true,nutrition:false },
  { sets:12,g:0.58,cls:"Medium",trained:true,nutrition:false },
  { sets:28,g:0.54,cls:"High",trained:true,nutrition:false },
  { sets:6,g:1.30,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:1.42,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:1.01,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:0.80,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:0.75,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:1.46,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:0.61,cls:"Low",trained:false,nutrition:false },
  { sets:6,g:0.47,cls:"Low",trained:false,nutrition:false },
  { sets:12,g:-0.00,cls:"Low",trained:true,nutrition:true },
  { sets:12,g:0.04,cls:"Low",trained:true,nutrition:true },
  { sets:20,g:0.12,cls:"High",trained:true,nutrition:true },
  { sets:20,g:-0.09,cls:"High",trained:true,nutrition:true },
  { sets:5.17,g:0.19,cls:"Low",trained:false,nutrition:false },
  { sets:15.5,g:0.25,cls:"High",trained:false,nutrition:false },
  { sets:21.14,g:0.18,cls:"High",trained:true,nutrition:false },
  { sets:21.14,g:0.19,cls:"High",trained:true,nutrition:false },
  { sets:29.71,g:0.36,cls:"High",trained:true,nutrition:false },
  { sets:29.71,g:0.33,cls:"High",trained:true,nutrition:false },
  { sets:33.57,g:0.67,cls:"High",trained:true,nutrition:false },
  { sets:33.57,g:0.72,cls:"High",trained:true,nutrition:false },
  { sets:6.95,g:0.26,cls:"Medium",trained:false,nutrition:false },
  { sets:6.95,g:0.41,cls:"Medium",trained:false,nutrition:false },
  { sets:6.95,g:0.21,cls:"Medium",trained:false,nutrition:false },
  { sets:6.95,g:0.48,cls:"Medium",trained:false,nutrition:false },
  { sets:6.95,g:0.10,cls:"Low",trained:false,nutrition:false },
  { sets:6.95,g:0.28,cls:"Medium",trained:false,nutrition:false },
  { sets:10.5,g:0.34,cls:"Medium",trained:false,nutrition:false },
  { sets:10.5,g:0.49,cls:"Medium",trained:false,nutrition:false },
  { sets:10.5,g:0.28,cls:"Medium",trained:false,nutrition:false },
  { sets:10.5,g:0.59,cls:"Medium",trained:false,nutrition:false },
  { sets:10.5,g:0.01,cls:"Low",trained:false,nutrition:false },
  { sets:10.5,g:0.04,cls:"Low",trained:false,nutrition:false },
  { sets:13.5,g:0.97,cls:"High",trained:true,nutrition:false },
  { sets:13.5,g:0.49,cls:"Medium",trained:true,nutrition:false },
];

// ─── Computed: Histogram bins for hedges_g ─────────────────────────────────────
// 8 bins computed from 199 actual observations
export interface HistBin {
  label: string;
  count: number;
  fill: string;
}

export const HISTOGRAM_BINS: HistBin[] = (() => {
  const bins = [
    { label: "< 0",     min: -Infinity, max: 0,    fill: "#ef4444" },
    { label: "0–0.2",   min: 0,         max: 0.2,  fill: "#f97316" },
    { label: "0.2–0.4", min: 0.2,       max: 0.4,  fill: "#eab308" },
    { label: "0.4–0.6", min: 0.4,       max: 0.6,  fill: "#22c55e" },
    { label: "0.6–0.8", min: 0.6,       max: 0.8,  fill: "#3b82f6" },
    { label: "0.8–1.0", min: 0.8,       max: 1.0,  fill: "#6366f1" },
    { label: "> 1.0",   min: 1.0,       max: Infinity, fill: "#0058be" },
  ];
  return bins.map((b) => ({
    label: b.label,
    fill: b.fill,
    count: RAW_POINTS.filter((p) => p.g >= b.min && p.g < b.max).length,
  }));
})();

// ─── Computed: Boxplot stats by hyp_class ─────────────────────────────────────
export interface BoxStats {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  n: number;
  color: string;
}

function computeBox(vals: number[], label: string, color: string): BoxStats {
  const sorted = [...vals].sort((a, b) => a - b);
  const n = sorted.length;
  const q = (p: number) => {
    const idx = (p / 100) * (n - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  };
  return {
    label, n, color,
    min: Math.round(q(5) * 100) / 100,
    q1:  Math.round(q(25) * 100) / 100,
    median: Math.round(q(50) * 100) / 100,
    q3:  Math.round(q(75) * 100) / 100,
    max: Math.round(q(95) * 100) / 100,
  };
}

export const BOXPLOT_STATS: BoxStats[] = [
  computeBox(RAW_POINTS.filter(p => p.cls === "Low").map(p => p.g),    "Low",    "#ef4444"),
  computeBox(RAW_POINTS.filter(p => p.cls === "Medium").map(p => p.g), "Medium", "#f59e0b"),
  computeBox(RAW_POINTS.filter(p => p.cls === "High").map(p => p.g),   "High",   "#0058be"),
];

// ─── Dataset summary stats ─────────────────────────────────────────────────────
export const DATASET_STATS = {
  n_observations: RAW_POINTS.length,         // 199
  n_studies: 69,
  n_unique_authors: 25,
  mean_g: +(RAW_POINTS.reduce((s, p) => s + p.g, 0) / RAW_POINTS.length).toFixed(3),
  pct_high:   +(RAW_POINTS.filter(p => p.cls === "High").length   / RAW_POINTS.length * 100).toFixed(1),
  pct_medium: +(RAW_POINTS.filter(p => p.cls === "Medium").length / RAW_POINTS.length * 100).toFixed(1),
  pct_low:    +(RAW_POINTS.filter(p => p.cls === "Low").length    / RAW_POINTS.length * 100).toFixed(1),
  pct_trained:   +(RAW_POINTS.filter(p => p.trained).length   / RAW_POINTS.length * 100).toFixed(1),
  pct_untrained: +(RAW_POINTS.filter(p => !p.trained).length  / RAW_POINTS.length * 100).toFixed(1),
};
