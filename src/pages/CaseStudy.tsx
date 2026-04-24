import { ArrowDown, PersonStanding, Lightbulb, Settings2, User } from "lucide-react";
import { Area, ComposedChart, Line, ReferenceArea, ResponsiveContainer, Scatter, XAxis, YAxis } from "recharts";

const curveData = [
  { x: 0, y: 0.05, ciLow: 0.02, ciHigh: 0.08 },
  { x: 5, y: 0.15, ciLow: 0.1, ciHigh: 0.2 },
  { x: 10, y: 0.35, ciLow: 0.25, ciHigh: 0.45 },
  { x: 12, y: 0.45, ciLow: 0.35, ciHigh: 0.55 },
  { x: 15, y: 0.48, ciLow: 0.38, ciHigh: 0.58 },
  { x: 20, y: 0.5, ciLow: 0.4, ciHigh: 0.6 },
  { x: 25, y: 0.52, ciLow: 0.41, ciHigh: 0.62 },
  { x: 30, y: 0.51, ciLow: 0.4, ciHigh: 0.61 },
  { x: 35, y: 0.5, ciLow: 0.38, ciHigh: 0.6 },
];

export default function CaseStudy() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#0058be] tracking-tight mb-2">
          TrainHyp Dashboard
        </h1>
        <p className="text-[13px] text-[#424754] tracking-wide uppercase">
          Applied case study: interpreting one training profile
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* Subject Profile */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <User className="w-5 h-5 text-[#0058be]" />
                <h3 className="text-xl font-bold text-[#131b2e] tracking-tight">Subject Profile</h3>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center py-2 border-b border-[#f2f3ff] last:border-0">
                  <span className="text-[11px] font-bold text-[#424754] tracking-widest uppercase">Experience</span>
                  <span className="text-sm font-semibold text-[#131b2e]">Trained</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f2f3ff] last:border-0">
                  <span className="text-[11px] font-bold text-[#424754] tracking-widest uppercase">Age</span>
                  <span className="text-sm font-semibold text-[#131b2e]">28</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f2f3ff] last:border-0">
                  <span className="text-[11px] font-bold text-[#424754] tracking-widest uppercase">Weekly Sets</span>
                  <span className="text-sm font-semibold text-[#131b2e]">12</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f2f3ff] last:border-0">
                  <span className="text-[11px] font-bold text-[#424754] tracking-widest uppercase">Nutrition</span>
                  <span className="text-[11px] font-bold text-[#131b2e] bg-[#f2f3ff] px-2.5 py-1 rounded">Surplus</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#f2f3ff] last:border-0">
                  <span className="text-[11px] font-bold text-[#424754] tracking-widest uppercase">Failure</span>
                  <span className="text-sm font-semibold text-[#131b2e]">Moderate</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#f2f3ff]">
              <p className="text-[10px] font-bold text-[#424754] tracking-widest uppercase">Study Duration</p>
              <p className="text-2xl font-bold text-[#0058be] mt-1">12 Weeks</p>
            </div>
          </div>

          {/* Shift Analysis */}
          <div className="bg-[#f2f3ff] rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-[11px] font-bold text-[#424754] tracking-widest uppercase mb-8">Shift Analysis</h3>
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-transparent ml-2 shadow-[0_2px_12px_-4px_rgba(19,27,46,0.04)] z-10">
                <p className="text-[11px] text-[#727785] font-semibold mb-1">Current Training Pattern</p>
                <p className="font-bold text-[#424754]">Moderate Volume</p>
              </div>

              {/* Connecting Line with Arrow */}
              <div className="absolute left-[26px] top-12 bottom-6 w-0.5 bg-gradient-to-b from-transparent via-[#0058be]/30 to-[#0058be] z-0"></div>
              <ArrowDown className="absolute left-4 bottom-[72px] w-5 h-5 text-[#0058be] z-20" />

              <div className="bg-[#e2e7ff] rounded-xl p-5 shadow-sm border-l-4 border-[#0058be] ml-2 z-10">
                <p className="text-[11px] text-[#0058be] mb-1 font-bold">Recommended Training Zone</p>
                <p className="font-bold text-[#131b2e]">High Volume Threshold</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Group */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
             <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4">Predicted Hedges' g</span>
              <div className="flex items-end gap-1.5 h-full">
                <span className="text-[42px] font-semibold tracking-tighter text-[#0058be] leading-none">0.45</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between relative overflow-hidden">
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#d0e1fb] rounded-full opacity-30 blur-2xl"></div>
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4 relative z-10">Classification</span>
              <div className="flex items-baseline gap-1.5 h-full pt-4 relative z-10 text-[#131b2e]">
                <span className="text-[28px] font-bold tracking-tight leading-none">HIGH</span>
                <span className="text-[13px] text-[#0058be] font-bold">Responder</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4">Recommended Sets</span>
              <div className="flex items-baseline gap-1.5 h-full pt-2">
                <span className="text-[42px] font-semibold tracking-tighter text-[#0058be] leading-none">12</span>
                <span className="text-xl text-[#727785] font-semibold mx-1 leading-none">-</span>
                <span className="text-[32px] font-semibold tracking-tighter text-[#0058be] leading-none">16</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#424754] tracking-widest uppercase mb-4">Confidence Int.</span>
              <div className="flex items-baseline gap-1 h-full pt-2">
                <span className="text-3xl font-bold tracking-tight text-[#131b2e] leading-none">0.35</span>
                <span className="text-[13px] text-[#727785] font-bold mx-0.5 leading-none px-0.5">to</span>
                <span className="text-3xl font-bold tracking-tight text-[#131b2e] leading-none">0.55</span>
              </div>
            </div>
          </div>

          {/* Hypertrophy Response Curve */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col flex-1 h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#131b2e] tracking-tight">Hypertrophy Response Curve</h3>
              <span className="text-[11px] font-bold bg-[#f2f3ff] px-3.5 py-1.5 rounded-full text-[#727785]">Model Prediction</span>
            </div>

             <div className="flex-1 w-full relative -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={curveData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <XAxis type="number" dataKey="x" hide domain={[0, 40]} />
                    <YAxis type="number" hide domain={[0, 0.8]} />
                    
                    {/* Shadowed Reference Area */}
                    <ReferenceArea x1={10} x2={16} ifOverflow="hidden" {...{ fill: "#f2f3ff" } as any} />
                    
                    {/* Confidence Interval Area */}
                    <Area 
                      type="monotone" 
                      dataKey="ciHigh" 
                      stroke="none" 
                      fill="#d8e2ff" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ciLow" 
                      stroke="none" 
                      fill="#ffffff" 
                      fillOpacity={1}
                    />

                    {/* Main Trend Line */}
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#0058be" 
                      strokeWidth={5} 
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                    />

                    {/* Target Data Point */}
                    <Scatter data={[{x: 12, y: 0.45}]} fill="#0058be">
                       <circle r="4.5" fill="#0058be" />
                    </Scatter>

                  </ComposedChart>
                </ResponsiveContainer>

                <div className="absolute left-[34%] top-4 w-[16%] text-center text-[9px] font-bold text-[#0058be] uppercase tracking-widest z-10">
                  Optimum Zone
                </div>

                <div className="absolute left-6 top-8 bottom-8 flex flex-col justify-between text-[10px] font-bold text-[#727785] z-10 pointer-events-none">
                  <span>0.6</span>
                  <span>0.3</span>
                  <span>0.0</span>
                </div>
            </div>
          </div>
          
          {/* Explanation Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <div className="bg-white rounded-[24px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 p-8 flex flex-col">
                 <h3 className="text-[11px] font-bold text-[#424754] tracking-widest uppercase mb-6">Prediction Determinants</h3>
                 <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[#131b2e] text-[13px] font-bold">sets.week.all</span>
                        <span className="text-[#0058be] text-sm font-bold">42%</span>
                      </div>
                      <div className="w-full bg-[#f2f3ff] h-1.5 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 bg-[#0058be] h-full w-[42%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[#131b2e] text-[13px] font-bold">nutrition</span>
                        <span className="text-[#0058be] text-sm font-bold opacity-80">28%</span>
                      </div>
                      <div className="w-full bg-[#f2f3ff] h-1.5 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 bg-[#0058be]/80 h-full w-[28%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[#131b2e] text-[13px] font-bold">train.status</span>
                        <span className="text-[#0058be] text-sm font-bold opacity-60">21%</span>
                      </div>
                      <div className="w-full bg-[#f2f3ff] h-1.5 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 bg-[#0058be]/60 h-full w-[21%] rounded-full"></div>
                      </div>
                    </div>
                 </div>
                 <p className="mt-8 text-[13px] text-[#424754] leading-relaxed font-medium">
                   The model identifies weekly set volume as the dominant driver for this specific profile. Given the subject's 'Trained' status and caloric surplus, the algorithm heavily weights the interaction between sustained mechanical tension (12+ sets) and available recovery resources, projecting an elevated hypertrophic response plateau.
                 </p>
              </div>

               <div className="bg-gradient-to-br from-[#f2f3ff] to-white rounded-[24px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 p-8 flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute -right-8 -bottom-8 opacity-[0.03]">
                      <Lightbulb className="w-48 h-48" />
                   </div>
                   <div className="w-12 h-12 rounded-full bg-[#0058be]/10 flex items-center justify-center text-[#0058be] mb-6 relative z-10">
                      <Settings2 className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold text-[#131b2e] tracking-tight mb-4 relative z-10">Clinical Takeaway</h3>
                   <p className="text-[#131b2e] text-[15px] leading-relaxed font-medium relative z-10">
                        For this profile, <span className="font-bold text-[#0058be]">moderate-to-high weekly volume</span> appears to maximize hypertrophy response, extending the threshold before plateau compared to untrained cohorts.
                    </p>
               </div>
          </div>

        </div>
      </div>
      <div className="h-4"></div>
    </div>
  );
}
