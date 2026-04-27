import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Database, Filter, TrendingUp, Users, BookOpen, Activity } from "lucide-react";
import {
  RAW_POINTS, HISTOGRAM_BINS, BOXPLOT_STATS,
  DATASET_STATS, type StudyPoint, type BoxStats,
} from "../data/studyData";

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard({ h = "h-[300px]" }: { h?: string }) {
  return (
    <div className={`bg-white rounded-[24px] ${h} border border-[#c2c6d6]/10 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] animate-pulse`}>
      <div className="p-8 flex flex-col gap-4 h-full">
        <div className="h-4 bg-[#f2f3ff] rounded w-1/3" />
        <div className="flex-1 bg-[#f2f3ff] rounded-xl" />
      </div>
    </div>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
function HistTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-white text-[#131b2e] text-[11px] font-semibold px-3 py-2 rounded-lg shadow-lg border border-[#c2c6d6]/20">
      <div>Range: <span className="text-[#0058be]">{payload[0].payload.label}</span></div>
      <div>Observations: <span className="text-[#0058be]">{payload[0].value}</span></div>
    </div>
  );
}

// ─── Boxplot SVG ──────────────────────────────────────────────────────────────
function BoxPlotSVG({ stats, isLoading }: { stats: BoxStats[]; isLoading: boolean }) {
  if (isLoading) return <div className="h-[280px] bg-[#f2f3ff] animate-pulse rounded-xl" />;

  const PAD = 60;
  const W = 360;
  const H = 260;
  const CHART_H = H - 2 * PAD;
  // global min/max for scale
  const allVals = stats.flatMap(s => [s.min, s.max]);
  const domMin = Math.min(...allVals) - 0.1;
  const domMax = Math.max(...allVals) + 0.1;
  const scale = (v: number) => PAD + (1 - (v - domMin) / (domMax - domMin)) * CHART_H;
  const BOX_W = 48;
  const xs = [80, 180, 280];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[260px]">
      {/* Y-axis labels */}
      {[0, 0.5, 1.0, 1.5].map(v => (
        <g key={v}>
          <line x1={PAD} x2={W - 10} y1={scale(v)} y2={scale(v)} stroke="#f2f3ff" strokeWidth={1} />
          <text x={PAD - 8} y={scale(v) + 4} fontSize={9} textAnchor="end" fill="#727785">{v.toFixed(1)}</text>
        </g>
      ))}

      {stats.map((s, i) => {
        const x = xs[i];
        const yMin = scale(s.min);
        const yQ1 = scale(s.q1);
        const yMed = scale(s.median);
        const yQ3 = scale(s.q3);
        const yMax = scale(s.max);
        const half = BOX_W / 2;

        return (
          <g key={s.label}>
            {/* Whiskers */}
            <line x1={x} x2={x} y1={yMin} y2={yQ1} stroke={s.color} strokeWidth={1.5} strokeDasharray="3 2" />
            <line x1={x} x2={x} y1={yQ3} y2={yMax} stroke={s.color} strokeWidth={1.5} strokeDasharray="3 2" />
            <line x1={x - 10} x2={x + 10} y1={yMin} y2={yMin} stroke={s.color} strokeWidth={1.5} />
            <line x1={x - 10} x2={x + 10} y1={yMax} y2={yMax} stroke={s.color} strokeWidth={1.5} />
            {/* IQR Box */}
            <rect
              x={x - half} y={yQ3}
              width={BOX_W} height={Math.abs(yQ1 - yQ3)}
              fill={s.color} fillOpacity={0.12}
              stroke={s.color} strokeWidth={1.5}
              rx={4}
            />
            {/* Median line */}
            <line x1={x - half} x2={x + half} y1={yMed} y2={yMed} stroke={s.color} strokeWidth={2.5} />
            {/* Label */}
            <text x={x} y={H - 10} fontSize={11} textAnchor="middle" fontWeight="700" fill={s.color}>{s.label}</text>
            <text x={x} y={H - 2} fontSize={9} textAnchor="middle" fill="#727785">n={s.n}</text>
            {/* Median value */}
            <text x={x + half + 4} y={yMed + 4} fontSize={9} fill={s.color} fontWeight="700">{s.median.toFixed(2)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DataOverview() {
  const [trainFilter, setTrainFilter] = useState<"all" | "trained" | "untrained">("all");
  const [nutritionFilter, setNutritionFilter] = useState<"all" | "yes" | "no">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate an 800 ms load — gives visual feedback even with synchronous data
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Apply filters
  const filtered: StudyPoint[] = useMemo(() => {
    return RAW_POINTS.filter(p => {
      if (trainFilter === "trained"   && !p.trained) return false;
      if (trainFilter === "untrained" &&  p.trained) return false;
      if (nutritionFilter === "yes"   && !p.nutrition) return false;
      if (nutritionFilter === "no"    &&  p.nutrition) return false;
      return true;
    });
  }, [trainFilter, nutritionFilter]);

  // Histogram bins from filtered data
  const histBins = useMemo(() => {
    const bins = [
      { label: "< 0",     min: -Infinity, max: 0,        fill: "#ef4444" },
      { label: "0–0.2",   min: 0,         max: 0.2,      fill: "#f97316" },
      { label: "0.2–0.4", min: 0.2,       max: 0.4,      fill: "#eab308" },
      { label: "0.4–0.6", min: 0.4,       max: 0.6,      fill: "#22c55e" },
      { label: "0.6–0.8", min: 0.6,       max: 0.8,      fill: "#3b82f6" },
      { label: "0.8–1.0", min: 0.8,       max: 1.0,      fill: "#6366f1" },
      { label: "> 1.0",   min: 1.0,       max: Infinity, fill: "#0058be" },
    ];
    return bins.map(b => ({
      label: b.label, fill: b.fill,
      count: filtered.filter(p => p.g >= b.min && p.g < b.max).length,
    }));
  }, [filtered]);

  // Boxplot by class from filtered data
  const boxStats = useMemo(() => {
    function computeBox(
      vals: number[], label: string, color: string
    ) {
      if (vals.length === 0) return { label, n: 0, color, min: 0, q1: 0, median: 0, q3: 0, max: 0 };
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
    return [
      computeBox(filtered.filter(p => p.cls === "Low").map(p => p.g),    "Low",    "#ef4444"),
      computeBox(filtered.filter(p => p.cls === "Medium").map(p => p.g), "Medium", "#f59e0b"),
      computeBox(filtered.filter(p => p.cls === "High").map(p => p.g),   "High",   "#0058be"),
    ] as BoxStats[];
  }, [filtered]);

  // Summary
  const mean_g = filtered.length
    ? +(filtered.reduce((s, p) => s + p.g, 0) / filtered.length).toFixed(3)
    : 0;
  const pct_high = filtered.length
    ? +(filtered.filter(p => p.cls === "High").length / filtered.length * 100).toFixed(1)
    : 0;

  const filterBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
      active
        ? "bg-[#0058be] text-white shadow-sm"
        : "bg-[#f2f3ff] text-[#424754] hover:bg-[#e8eaff]"
    }`;

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#131b2e] tracking-tight mb-2">
          Dataset Overview
        </h1>
        <p className="text-[13px] text-[#424754] font-medium">
          {DATASET_STATS.n_studies} RCTs · {DATASET_STATS.n_observations} muscle-level observations · Hypertrophy effect size outcomes
        </p>
      </header>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#424754] uppercase tracking-widest">
          <Filter className="w-3.5 h-3.5" /> Filters
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#424754] uppercase tracking-widest">Training Status</span>
          {(["all", "trained", "untrained"] as const).map(v => (
            <button key={v} onClick={() => setTrainFilter(v)} className={filterBtn(trainFilter === v)}>
              {v === "all" ? "All" : v === "trained" ? "Trained" : "Untrained"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#424754] uppercase tracking-widest">Nutrition</span>
          {(["all", "yes", "no"] as const).map(v => (
            <button key={v} onClick={() => setNutritionFilter(v)} className={filterBtn(nutritionFilter === v)}>
              {v === "all" ? "All" : v === "yes" ? "Controlled" : "None"}
            </button>
          ))}
        </div>

        <span className="ml-auto text-[11px] text-[#727785] font-medium">
          Showing <span className="text-[#0058be] font-bold">{filtered.length}</span> / {DATASET_STATS.n_observations} obs
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: BookOpen,   label: "RCT Studies",        value: DATASET_STATS.n_studies,        unit: "papers",   color: "text-[#0058be]" },
          { icon: Database,   label: "Observations",       value: filtered.length,                unit: "muscle obs",color: "text-[#6366f1]" },
          { icon: TrendingUp, label: "Mean Hypertrophy Score",     value: mean_g,                         unit: "score",       color: "text-[#22c55e]" },
          { icon: Users,      label: "High Responders",    value: pct_high + "%",                 unit: "of filtered",color:"text-[#f59e0b]" },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase">{label}</span>
            </div>
            <div className={`text-3xl font-light tracking-tight ${color}`}>{value}</div>
            <div className="text-[10px] text-[#727785] font-medium mt-1">{unit}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Histogram */}
        {isLoading ? <SkeletonCard /> : (
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
            <h3 className="text-[13px] font-bold text-[#131b2e] mb-1">Distribution of Hypertrophy Scores</h3>
            <p className="text-[10px] text-[#727785] mb-6">Muscle growth effect size across all filtered observations</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={histBins} barCategoryGap="20%">
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#727785", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#727785" }} axisLine={false} tickLine={false} />
                <Tooltip content={<HistTooltip />} cursor={{ fill: "#f2f3ff" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {histBins.map((b, i) => <Cell key={i} fill={b.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {histBins.map(b => (
                <span key={b.label} className="flex items-center gap-1 text-[10px] text-[#727785] font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: b.fill }} />
                  {b.label}: {b.count}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Boxplot */}
        {isLoading ? <SkeletonCard /> : (
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
            <h3 className="text-[13px] font-bold text-[#131b2e] mb-1">Muscle Growth Score by Responder Class</h3>
            <p className="text-[10px] text-[#727785] mb-6">P5–P25–P50–P75–P95 per class (filtered data)</p>
            <BoxPlotSVG stats={boxStats} isLoading={false} />

            {/* Stats table */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {boxStats.map(s => (
                <div key={s.label} className="bg-[#f8f9ff] rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: s.color }}>{s.label}</div>
                  <div className="text-[13px] font-bold text-[#131b2e]">{s.median.toFixed(2)}</div>
                  <div className="text-[9px] text-[#727785]">median score</div>
                  <div className="text-[9px] text-[#727785]">IQR [{s.q1.toFixed(2)}–{s.q3.toFixed(2)}]</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Class Distribution Bar */}
      <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
        <h3 className="text-[13px] font-bold text-[#131b2e] mb-6">Responder Class Distribution (filtered)</h3>
        <div className="space-y-4">
          {[
            { label: "Low Responder",    cls: "Low",    color: "#ef4444", bg: "bg-[#fee2e2]" },
            { label: "Medium Responder", cls: "Medium", color: "#f59e0b", bg: "bg-[#fef3c7]" },
            { label: "High Responder",   cls: "High",   color: "#0058be", bg: "bg-[#dbeafe]" },
          ].map(({ label, cls, color, bg }) => {
            const n = filtered.filter(p => p.cls === cls).length;
            const pct = filtered.length ? (n / filtered.length * 100) : 0;
            return (
              <div key={cls}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] font-bold text-[#131b2e]">{label}</span>
                  <span className="text-[11px] font-bold" style={{ color }}>{n} obs ({pct.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-3 bg-[#f2f3ff] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Info row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#f2f3ff]">
          {[
            { label: "Trained Athletes",   value: DATASET_STATS.pct_trained + "%" },
            { label: "Untrained Subjects", value: DATASET_STATS.pct_untrained + "%" },
            { label: "Unique Studies",     value: DATASET_STATS.n_studies },
            { label: "Dataset Mean Score",    value: DATASET_STATS.mean_g },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-light text-[#0058be]">{value}</div>
              <div className="text-[10px] text-[#727785] font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Citation note */}
      <div className="flex items-start gap-3 bg-[#f2f3ff] rounded-2xl px-6 py-4 border border-[#dae2fd]">
        <Activity className="w-4 h-4 text-[#0058be] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#424754] font-medium leading-relaxed">
          <span className="font-bold text-[#131b2e]">Data source:</span> Systematic review of RCTs measuring muscle hypertrophy
          via muscle thickness (MT), cross-sectional area (CSA), or muscle volume using ultrasound/MRI.
          Effect sizes expressed as Hedges' g (corrected for small samples). STAT3013 2026.
        </p>
      </div>
    </div>
  );
}
