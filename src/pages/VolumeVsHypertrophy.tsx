import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, Tooltip, Cell } from "recharts";

const scatterData = [
  { x: 5, y: 0.1 },
  { x: 8, y: 0.25 },
  { x: 12, y: 0.38 },
  { x: 15, y: 0.45 },
  { x: 18, y: 0.52 },
  { x: 22, y: 0.55 },
  { x: 26, y: 0.51 },
  { x: 30, y: 0.48 },
  { x: 35, y: 0.42 },
];

const curveData = [
  { x: 0, y: 0.05 },
  { x: 5, y: 0.2 },
  { x: 10, y: 0.4 },
  { x: 15, y: 0.55 },
  { x: 20, y: 0.62 },
  { x: 25, y: 0.65 },
  { x: 30, y: 0.62 },
  { x: 35, y: 0.55 },
  { x: 40, y: 0.45 },
];

export default function VolumeVsHypertrophy() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full space-y-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-[44px] font-bold text-[#131b2e] tracking-tight mb-2 leading-none">
          Volume vs Hypertrophy
        </h1>
        <p className="text-[15px] text-[#424754] tracking-normal">
          Exploring the relationship between training volume and muscle hypertrophy
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
          <p className="text-[10px] text-[#424754] font-bold tracking-widest mb-4 uppercase">
            Correlation Strength
          </p>
          <div className="flex items-end gap-3">
            <h3 className="text-[44px] font-bold text-[#0058be] leading-none tracking-tight">0.68</h3>
            <span className="text-[10px] bg-[#d8e2ff] text-[#004395] px-2 py-1.5 rounded font-bold mb-1 leading-tight flex items-center">
              (Moderate-<br/>Strong)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
          <p className="text-[10px] text-[#424754] font-bold tracking-widest mb-4 uppercase">
            Best Volume Range
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-[44px] font-bold text-[#0058be] leading-none tracking-tight">12-20</h3>
            <span className="text-[11px] text-[#131b2e] font-semibold mb-1">
              sets/week
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
          <p className="text-[10px] text-[#424754] font-bold tracking-widest mb-4 uppercase">
            Mean Hedges' g
          </p>
          <div className="flex items-end gap-3">
            <h3 className="text-[44px] font-bold text-[#0058be] leading-none tracking-tight">0.42</h3>
            <span className="text-[10px] text-[#006b00] bg-[#e6f4e6] px-1.5 py-1 rounded font-bold mb-1.5 flex items-center shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} />
              +0.05
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
          <p className="text-[10px] text-[#424754] font-bold tracking-widest mb-4 uppercase">
            Number of Studies
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-[44px] font-bold text-[#0058be] leading-none tracking-tight">70</h3>
            <span className="text-xs text-[#131b2e] font-bold mb-1">n</span>
          </div>
        </div>
      </section>

      {/* Middle Grid: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Scatter Plot */}
        <section className="xl:col-span-2 bg-white rounded-[24px] p-8 relative shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
          <header className="mb-6">
            <h2 className="text-[17px] font-bold text-[#131b2e] mb-1">
              Sets per Week vs Hedges' g
            </h2>
            <p className="text-[13px] text-[#424754]">
              Scatter plot showing individual data points with a regression line
              and confidence band.
            </p>
          </header>
          
          <div className="bg-[#fcfdff] rounded-2xl h-[360px] p-6 relative flex items-center justify-center isolate border border-[#e2e7ff]/30 border-t-0 border-r-0 rounded-tl-none rounded-br-none border-l-2 border-b-2">
             {/* Simple background grid lines */}
             <div className="absolute inset-0 z-0">
               <div className="w-full h-full border-b border-r border-[#c2c6d6]/20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00MCAwaC0xdjQwaDFWMHptMCA0MGgtNDB2LTFoNDB2MXoiIGZpbGw9IiNjMmM2ZDYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')]"></div>
             </div>

            <ResponsiveContainer width="100%" height="100%" className="z-10 relative left-2">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                {/* Confidence Band Mock (Area) */}
                <XAxis type="number" dataKey="x" hide domain={[0, 40]} />
                <YAxis type="number" dataKey="y" hide domain={[0, 0.8]} />
                
                {/* Simulated Regression Path using SVG overlay for precise curve */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  <path 
                    d="M 10,100% L 100%,15%" 
                    fill="none" 
                    stroke="#d8e2ff" 
                    strokeWidth="32" 
                    opacity="0.5"
                    vectorEffect="non-scaling-stroke"
                  />
                   <path 
                    d="M 10,100% L 100%,15%" 
                    fill="none" 
                    stroke="#001a42" 
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke" 
                  />
                </svg>

                <Scatter name="Studies" data={scatterData}>
                   {scatterData.map((entry, index) => {
                     // Varying opacities to simulate density
                     const op= [0.9, 0.7, 0.4, 0.8, 0.6][index % 5];
                     const size = [80, 150, 60, 100, 120][index % 5];
                     return <Cell key={`cell-${index}`} fill="#0058be" opacity={op} className="mix-blend-multiply" style={{r: Math.sqrt(size/Math.PI)}} />;
                   })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            
            <div className="absolute bottom-1 right-2 text-[10px] text-[#424754] uppercase tracking-wide bg-[#fcfdff]/80">
              Sets / Week
            </div>
             <div className="absolute -left-3 top-1 text-[10px] text-[#424754] uppercase tracking-wide rotate-90 origin-left">
              Hedges' g
            </div>
          </div>
        </section>

        {/* Dose-Response Curve */}
        <section className="bg-white rounded-[24px] p-8 relative flex flex-col shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
          <header className="mb-6">
            <h2 className="text-[17px] font-bold text-[#131b2e] mb-1">
              Dose-Response Pattern
            </h2>
            <p className="text-[13px] text-[#424754]">
              Hypertrophy response peaking then plateauing.
            </p>
          </header>
          
          <div className="bg-[#fcfdff] rounded-2xl flex-1 relative flex flex-col items-center justify-center min-h-[300px] border border-[#e2e7ff]/30">
            {/* Optimal Range Highlight */}
            <div className="absolute top-0 bottom-0 left-[30%] w-[25%] bg-[#d8e2ff] opacity-60 z-0"></div>
            <span className="absolute top-4 left-[31%] text-[9px] font-bold text-[#0058be] z-10">Optimal Range</span>
            <span className="absolute top-10 right-4 text-[9px] font-bold text-[#131b2e] z-10">Plateau Region</span>

            <ResponsiveContainer width="100%" height="80%" className="z-10 mt-auto">
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                 <path d="M 0 100 Q 25 80 40 20 T 90 30 L 100 40" fill="none" stroke="#0058be" strokeWidth="6" />
               </svg>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Correlation Heatmap */}
        <section className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10">
          <header className="mb-6">
            <h2 className="text-[17px] font-bold text-[#131b2e] mb-1">
              Correlation Heatmap
            </h2>
          </header>
          
          <div className="bg-[#f2f3ff] rounded-xl p-6 shadow-none">
            <div className="grid grid-cols-6 gap-1.5 mb-2 text-[10px] text-[#424754] font-medium text-center">
              <div>sets</div>
              <div>reps</div>
              <div>% fail</div>
              <div>wks</div>
              <div>age</div>
              <div>g</div>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {/* Row 1 */}
              <div className="aspect-square bg-[#001a42] rounded flex items-center justify-center text-white text-[11px] font-bold">1</div>
              <div className="aspect-square bg-[#0058be] rounded"></div>
              <div className="aspect-square bg-[#2170e4] rounded opacity-70"></div>
              <div className="aspect-square bg-[#adc6ff] rounded opacity-50"></div>
              <div className="aspect-square bg-[#eaedff] rounded"></div>
              <div className="aspect-square bg-[#004395] rounded"></div>
              
              {/* Row 2 */}
              <div className="aspect-square bg-[#0058be] rounded"></div>
              <div className="aspect-square bg-[#001a42] rounded flex items-center justify-center text-white text-[11px] font-bold">1</div>
              <div className="aspect-square bg-[#adc6ff] rounded opacity-60"></div>
              <div className="aspect-square bg-[#eaedff] rounded"></div>
              <div className="aspect-square bg-[#faf8ff] rounded border border-[#c2c6d6]/20"></div>
              <div className="aspect-square bg-[#2170e4] rounded opacity-80"></div>
              
              {/* Row 3 */}
              <div className="aspect-square bg-[#2170e4] rounded opacity-70"></div>
              <div className="aspect-square bg-[#adc6ff] rounded opacity-60"></div>
              <div className="aspect-square bg-[#001a42] rounded flex items-center justify-center text-white text-[11px] font-bold">1</div>
              <div className="aspect-square bg-[#0058be] rounded opacity-90"></div>
              <div className="aspect-square bg-[#adc6ff] rounded opacity-40"></div>
              <div className="aspect-square bg-[#004395] rounded"></div>
            </div>
          </div>
        </section>

        {/* Subgroup Comparison */}
        <section className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col">
          <header className="mb-6">
            <h2 className="text-[17px] font-bold text-[#131b2e] mb-1">
              Subgroup Analysis
            </h2>
            <p className="text-[13px] text-[#424754]">
              Comparative effects across variables.
            </p>
          </header>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* Comparison 1 */}
            <div className="flex items-center justify-between bg-[#fcfdff] border border-[#f2f3ff] rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
              <span className="text-[12px] font-semibold text-[#131b2e]">Trained vs Untrained</span>
              <div className="flex items-center gap-3">
                <span className="bg-[#d8e2ff] text-[#0058be] px-3.5 py-1 rounded-[6px] text-xs font-bold leading-none">
                  0.45
                </span>
                <div className="w-10 h-1.5 bg-[#0058be] rounded-full"></div>
                <span className="text-[#c2c6d6] text-[10px] font-semibold uppercase">vs</span>
                <div className="w-8 h-1.5 bg-[#c2c6d6] rounded-full"></div>
                <span className="bg-[#eaedff] text-[#424754] px-3.5 py-1 rounded-[6px] text-xs font-semibold leading-none">
                  0.38
                </span>
              </div>
            </div>
            
            {/* Comparison 2 */}
            <div className="flex items-center justify-between bg-[#fcfdff] border border-[#f2f3ff] rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
              <span className="text-[12px] font-semibold text-[#131b2e]">Surplus vs Deficit</span>
               <div className="flex items-center gap-3">
                <span className="bg-[#d8e2ff] text-[#0058be] px-3.5 py-1 rounded-[6px] text-xs font-bold leading-none">
                  0.48
                </span>
                <div className="w-12 h-1.5 bg-[#0058be] rounded-full"></div>
                <span className="text-[#c2c6d6] text-[10px] font-semibold uppercase">vs</span>
                <div className="w-6 h-1.5 bg-[#c2c6d6] rounded-full"></div>
                <span className="bg-[#eaedff] text-[#424754] px-3.5 py-1 rounded-[6px] text-xs font-semibold leading-none">
                  0.32
                </span>
              </div>
            </div>

            {/* Comparison 3 */}
            <div className="flex items-center justify-between bg-[#fcfdff] border border-[#f2f3ff] rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
              <span className="text-[12px] font-semibold text-[#131b2e]">Failure vs Non-failure</span>
               <div className="flex items-center gap-3">
                <span className="bg-[#d8e2ff] text-[#0058be] px-3.5 py-1 rounded-[6px] text-xs font-bold leading-none">
                  0.41
                </span>
                <div className="w-10 h-1.5 bg-[#0058be] rounded-full"></div>
                <span className="text-[#c2c6d6] text-[10px] font-semibold uppercase">vs</span>
                <div className="w-9 h-1.5 bg-[#c2c6d6] rounded-full"></div>
                <span className="bg-[#eaedff] text-[#424754] px-3.5 py-1 rounded-[6px] text-xs font-semibold leading-none">
                  0.39
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="h-4"></div> {/* Bottom padding */}
    </div>
  );
}
