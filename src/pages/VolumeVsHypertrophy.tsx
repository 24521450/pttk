import { useState, useMemo, useEffect } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid, Cell,
} from "recharts";
import { TrendingUp, Info, ChevronDown } from "lucide-react";
import { RAW_POINTS, DATASET_STATS } from "../data/studyData";

// ─── Colour by class ──────────────────────────────────────────────────────────
const CLS_COLOR: Record<string, string> = {
  High: "#0058be",
  Medium: "#f59e0b",
  Low: "#ef4444",
};

// ─── Mean-g per sets bucket (for trend line) ──────────────────────────────────
function buildTrend(points: typeof RAW_POINTS) {
  const buckets: Record<number, number[]> = {};
  points.forEach(p => {
    const bucket = Math.round(p.sets / 5) * 5; // round to nearest 5
    if (!buckets[bucket]) buckets[bucket] = [];
    buckets[bucket].push(p.g);
  });
  return Object.entries(buckets)
    .map(([k, vals]) => ({
      x: Number(k),
      y: +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(3),
    }))
    .sort((a, b) => a.x - b.x);
}

// ─── Correlation table data ───────────────────────────────────────────────────
// Pre-computed (Pearson r) from the 199 data points
const CORRELATIONS = [
  { feature: "sets.week.all",          r: 0.31,  label: "Sets / Week (All)" },
  { feature: "sets.week.direct",       r: 0.14,  label: "Sets / Week (Direct)" },
  { feature: "sessions.per.week",      r: 0.20,  label: "Sessions / Week" },
  { feature: "percentage.failure.all", r: -0.04, label: "% Sets to Failure" },
  { feature: "weeks",                  r: 0.15,  label: "Program Duration (wks)" },
  { feature: "rep.range.all",          r: 0.01,  label: "Rep Range" },
  { feature: "age",                    r: -0.09, label: "Age" },
  { feature: "interset.rest.min.all",  r: -0.01, label: "Rest Between Sets" },
];

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ h = "h-[360px]" }: { h?: string }) {
  return (
    <div className={`bg-white rounded-[24px] ${h} border border-[#c2c6d6]/10 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] animate-pulse`}>
      <div className="p-8 flex flex-col gap-4 h-full">
        <div className="h-4 bg-[#f2f3ff] rounded w-1/3" />
        <div className="flex-1 bg-[#f2f3ff] rounded-xl" />
      </div>
    </div>
  );
}

// ─── Scatter custom tooltip ───────────────────────────────────────────────────
function ScatterTip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white text-[11px] font-semibold px-3 py-2 rounded-lg shadow-lg border border-[#c2c6d6]/20">
      <div>Sets/week: <span className="text-[#0058be]">{d.sets}</span></div>
      <div>Growth Score: <span className="text-[#0058be]">{d.g}</span></div>
      <div>Class: <span style={{ color: CLS_COLOR[d.cls] }}>{d.cls}</span></div>
      <div>Status: {d.trained ? "Trained" : "Untrained"}</div>
    </div>
  );
}

export default function VolumeVsHypertrophy() {
  const [clsFilter, setClsFilter] = useState<"all" | "High" | "Medium" | "Low">("all");
  const [trainFilter, setTrainFilter] = useState<"all" | "trained" | "untrained">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate an 800 ms load — gives visual feedback even with synchronous data
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => RAW_POINTS.filter(p => {
    if (clsFilter !== "all" && p.cls !== clsFilter) return false;
    if (trainFilter === "trained"   && !p.trained) return false;
    if (trainFilter === "untrained" &&  p.trained) return false;
    return true;
  }), [clsFilter, trainFilter]);

  const trend = useMemo(() => buildTrend(filtered), [filtered]);

  // Pearson r for filtered scatter
  const pearsonR = useMemo(() => {
    const n = filtered.length;
    if (n < 2) return 0;
    const mx = filtered.reduce((s, p) => s + p.sets, 0) / n;
    const my = filtered.reduce((s, p) => s + p.g, 0) / n;
    const num = filtered.reduce((s, p) => s + (p.sets - mx) * (p.g - my), 0);
    const den = Math.sqrt(
      filtered.reduce((s, p) => s + (p.sets - mx) ** 2, 0) *
      filtered.reduce((s, p) => s + (p.g - my) ** 2, 0)
    );
    return den === 0 ? 0 : +(num / den).toFixed(3);
  }, [filtered]);

  const filterBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
      active ? "bg-[#0058be] text-white shadow-sm" : "bg-[#f2f3ff] text-[#424754] hover:bg-[#e8eaff]"
    }`;

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#131b2e] tracking-tight mb-2">
          Volume vs Hypertrophy
        </h1>
        <p className="text-[13px] text-[#424754] font-medium">
          Relationship between weekly training volume and muscle growth (hypertrophy score)
        </p>
      </header>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total observations", value: filtered.length },
          { label: "Pearson r (sets vs score)", value: pearsonR > 0 ? `+${pearsonR}` : String(pearsonR) },
          { label: "Overall mean score", value: DATASET_STATS.mean_g },
          { label: "High responders", value: DATASET_STATS.pct_high + "%" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl px-4 py-2.5 shadow-[0_2px_12px_rgba(19,27,46,0.06)] border border-[#c2c6d6]/10 flex items-center gap-3">
            <span className="text-[10px] font-bold text-[#424754] uppercase tracking-widest">{label}</span>
            <span className="text-sm font-bold text-[#0058be]">{value}</span>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#424754] uppercase tracking-widest">Class</span>
          {(["all", "High", "Medium", "Low"] as const).map(v => (
            <button key={v} onClick={() => setClsFilter(v)} className={filterBtn(clsFilter === v)}>
              {v === "all" ? "All" : v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#424754] uppercase tracking-widest">Status</span>
          {(["all", "trained", "untrained"] as const).map(v => (
            <button key={v} onClick={() => setTrainFilter(v)} className={filterBtn(trainFilter === v)}>
              {v === "all" ? "All" : v === "trained" ? "Trained" : "Untrained"}
            </button>
          ))}
        </div>
      </div>

      {/* Scatter Plot */}
      {isLoading ? <Skeleton h="h-[420px]" /> : (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[13px] font-bold text-[#131b2e] mb-1">Sets/Week vs Muscle Growth Score (Scatter)</h3>
              <p className="text-[10px] text-[#727785]">
                {filtered.length} observations · Colour = Responder Class · r = {pearsonR > 0 ? "+" : ""}{pearsonR}
              </p>
            </div>
            {/* Legend */}
            <div className="flex gap-4">
              {Object.entries(CLS_COLOR).map(([cls, color]) => (
                <span key={cls} className="flex items-center gap-1.5 text-[10px] font-bold text-[#424754]">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
                  {cls}
                </span>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f2f3ff" />
              <XAxis
                type="number" dataKey="sets" name="Sets/Week"
                domain={[0, 52]}
                label={{ value: "Sets / Week", position: "insideBottom", offset: -10, fontSize: 11, fill: "#727785", fontWeight: 700 }}
                tick={{ fontSize: 10, fill: "#727785" }} axisLine={false} tickLine={false}
              />
              <YAxis
                type="number" dataKey="g" name="Hedges' g"
                domain={[-0.35, 2.5]}
                label={{ value: "Hedges' g", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#727785", fontWeight: 700 }}
                tick={{ fontSize: 10, fill: "#727785" }} axisLine={false} tickLine={false}
              />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1} />
              <ReferenceLine y={0.2} stroke="#c2c6d6" strokeDasharray="3 2" strokeWidth={1} label={{ value: "Small (0.2)", fontSize: 9, fill: "#c2c6d6" }} />
              <ReferenceLine y={0.5} stroke="#c2c6d6" strokeDasharray="3 2" strokeWidth={1} label={{ value: "Medium (0.5)", fontSize: 9, fill: "#c2c6d6" }} />
              <ReferenceLine y={0.8} stroke="#c2c6d6" strokeDasharray="3 2" strokeWidth={1} label={{ value: "Large (0.8)", fontSize: 9, fill: "#c2c6d6" }} />
              <Tooltip content={<ScatterTip />} />
              <Scatter data={filtered} fillOpacity={0.75}>
                {filtered.map((p, i) => (
                  <Cell key={i} fill={CLS_COLOR[p.cls]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Feature-outcome correlation table */}
      {isLoading ? <Skeleton h="h-[200px]" /> : (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[13px] font-bold text-[#131b2e]">
              Feature–Outcome Correlation (Pearson r with Hypertrophy Score)
            </h3>
            <div className="group relative">
              <Info className="w-4 h-4 text-[#c2c6d6] cursor-help" />
              <div className="absolute left-6 top-0 z-10 hidden group-hover:block bg-white rounded-xl shadow-xl border border-[#c2c6d6]/20 p-3 w-60 text-[10px] text-[#424754] font-medium leading-relaxed">
                Pearson r computed across all 199 observations. Positive = more → higher ES. Negative = inverse relationship.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {CORRELATIONS.sort((a, b) => Math.abs(b.r) - Math.abs(a.r)).map(({ label, r }) => {
              const pct = Math.abs(r) / 0.40 * 100; // scale to max expected r (~0.40)
              const positive = r >= 0;
              return (
                <div key={label} className="flex items-center gap-4">
                  <span className="text-[11px] font-semibold text-[#424754] w-44 flex-shrink-0">{label}</span>
                  <div className="flex-1 flex items-center gap-2">
                    {/* zero line in centre */}
                    <div className="flex-1 h-2 bg-[#f2f3ff] rounded-full overflow-hidden relative">
                      {positive ? (
                        <div
                          className="absolute left-0 top-0 h-full bg-[#0058be] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      ) : (
                        <div
                          className="absolute right-0 top-0 h-full bg-[#ef4444] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                    </div>
                    <span className={`text-[11px] font-bold w-12 text-right ${positive ? "text-[#0058be]" : "text-[#ef4444]"}`}>
                      {r > 0 ? "+" : ""}{r.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-2 text-[10px] text-[#727785] font-medium">
            <ChevronDown className="w-3 h-3 flex-shrink-0 mt-0.5" />
            Sets/week shows the strongest positive correlation (r = +0.31). Percentage-to-failure shows a weak negative correlation, consistent with the dose-response model.
          </div>
        </div>
      )}

      {/* Trend summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { range: "1–10 sets/wk",  label: "Low Volume",    g: trend.filter(t => t.x >= 1  && t.x <= 10).map(t => t.y), color: "#ef4444" },
          { range: "11–25 sets/wk", label: "Moderate Volume", g: trend.filter(t => t.x > 10 && t.x <= 25).map(t => t.y), color: "#f59e0b" },
          { range: "26–50 sets/wk", label: "High Volume",   g: trend.filter(t => t.x > 25).map(t => t.y),               color: "#0058be" },
        ].map(({ range, label, g, color }) => {
          const avg = g.length ? +(g.reduce((s, v) => s + v, 0) / g.length).toFixed(2) : null;
          return (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" style={{ color }} />
                <span className="text-[10px] font-bold text-[#424754] uppercase tracking-widest">{label}</span>
              </div>
              <div className="text-3xl font-light" style={{ color }}>
                {avg !== null ? avg : "—"}
              </div>
              <div className="text-[10px] text-[#727785] font-medium mt-1">mean growth score</div>
              <div className="text-[9px] text-[#c2c6d6] mt-0.5">{range}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
