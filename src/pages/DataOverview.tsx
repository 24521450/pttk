import { BarChart2, Dumbbell, Filter, FlaskConical, Library, MoreVertical } from "lucide-react";

export default function DataOverview() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-[44px] font-bold text-[#131b2e] tracking-tight mb-2 leading-none">
            Data Overview
          </h2>
          <p className="text-[#424754] text-[15px] tracking-normal max-w-3xl">
            Comprehensive analysis of primary hypertrophy literature corpus. Based on 198 observations from 70 studies.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-2.5 rounded-2xl border border-[#c2c6d6]/20 flex flex-wrap gap-4 items-center shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] h-fit mb-2">
          <div className="flex items-center gap-2 pl-3 pr-2">
            <Filter className="w-[15px] h-[15px] text-[#424754]" />
            <span className="text-[11px] font-bold text-[#424754] uppercase tracking-widest">
              Filters
            </span>
          </div>
          <div className="flex gap-2 relative z-10 w-full sm:w-auto">
            <select className="bg-[#fcfdff] border border-[#f2f3ff] text-[13px] rounded-xl py-2 pl-3 pr-8 text-[#131b2e] appearance-none cursor-pointer flex-1 sm:flex-none font-medium max-w-[150px]">
              <option>Training Status</option>
            </select>
            <select className="bg-[#fcfdff] border border-[#f2f3ff] text-[13px] rounded-xl py-2 pl-3 pr-8 text-[#131b2e] appearance-none cursor-pointer flex-1 sm:flex-none font-medium max-w-[120px]">
              <option>Nutrition</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 relative overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute top-6 right-6 opacity-30">
             <div className="bg-[#d8e2ff] w-8 h-8 rounded-lg flex items-center justify-center p-1.5 opacity-90"><Library className="w-full h-full text-[#0058be]" /></div>
          </div>
          <p className="text-[13px] font-semibold text-[#131b2e] tracking-tight">
            Total Studies
          </p>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-[52px] font-bold text-[#0058be] tracking-tighter leading-none">
              70
            </span>
          </div>
          <div className="mt-3 flex items-center text-[10px] text-[#424754] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d8e2ff] mr-2"></span>
            Across 12 databases
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 relative overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute top-6 right-6 opacity-30">
            <div className="bg-[#d8e2ff] w-8 h-8 rounded-[8px] flex items-center justify-center p-1.5 opacity-90"><FlaskConical className="w-full h-full text-[#0058be]" /></div>
          </div>
          <p className="text-[13px] font-semibold text-[#131b2e] tracking-tight">
            Total Observations
          </p>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-[52px] font-bold text-[#0058be] tracking-tighter leading-none">
              198
            </span>
          </div>
          <div className="mt-3 flex items-center text-[10px] text-[#424754] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d8e2ff] mr-2"></span>
            Filtered datasets
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 relative overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute top-6 right-6 opacity-30">
            <div className="bg-[#d8e2ff] w-8 h-8 rounded border border-transparent flex flex-col justify-end p-1.5 gap-[2px] items-start opacity-90">
              <div className="flex gap-[2px] items-end h-full"> 
                 <div className="w-1.5 h-[60%] bg-[#0058be] rounded-[1px]"></div>
                 <div className="w-1.5 h-[100%] bg-[#0058be] rounded-[1px]"></div>
                 <div className="w-1.5 h-[30%] bg-[#0058be] rounded-[1px]"></div>
              </div>
            </div>
          </div>
          <p className="text-[13px] font-semibold text-[#131b2e] tracking-tight">
            Mean Hedges' g
          </p>
          <div className="flex items-end gap-3 mt-auto">
            <span className="text-[52px] font-bold text-[#0058be] tracking-tighter leading-none">
              0.42
            </span>
            <span className="text-[10px] text-[#a04e00] font-bold bg-[#ffeed9] px-1.5 py-0.5 rounded leading-tight shadow-sm mb-1">
              +0.05
            </span>
          </div>
          <div className="mt-2.5 flex items-center text-[10px] text-[#424754] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d8e2ff] mr-2"></span>
            Effect size metric
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 relative overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute top-6 right-6 opacity-30 rotate-45 transform">
            <div className="bg-[#d8e2ff] w-8 h-8 rounded-lg flex items-center justify-center p-[6px] opacity-90"><Dumbbell className="w-full h-full text-[#0058be]" /></div>
          </div>
          <p className="text-[13px] font-semibold text-[#131b2e] tracking-tight">
            Avg Sets/Week
          </p>
          <div className="flex items-start gap-1 mt-auto leading-none">
            <span className="text-[52px] font-bold text-[#0058be] tracking-tighter leading-none">
              12
            </span>
            <span className="text-[12px] text-[#131b2e] font-semibold tracking-tight mt-1">
              / muscle
            </span>
          </div>
          <div className="mt-[22px] flex items-center text-[10px] text-[#424754] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d8e2ff] mr-2"></span>
            Median volume
          </div>
        </div>
      </div>

      {/* Visualizations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Histogram Container */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col h-[400px]">
          <div className="p-7 pb-4 flex justify-between items-start">
            <div>
              <h3 className="text-[17px] font-bold text-[#131b2e] mb-1">
                Distribution of Hedges' g
              </h3>
              <p className="text-[13px] text-[#424754]">
                Frequency of effect sizes across all observations.
              </p>
            </div>
            <button className="text-[#131b2e] hover:text-[#0058be] transition-colors p-1 -mr-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Chart Area */}
          <div className="flex-1 bg-[#f2f3ff] mx-7 mb-7 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-end isolate">
            
            {/* Background Grid Lines (Subtle) */}
            <div className="absolute inset-0 flex flex-col justify-between pt-[44px] pb-8 px-5 opacity-[0.03] pointer-events-none z-0">
              <div className="w-full h-[2px] bg-[#001a42]"></div>
              <div className="w-full h-[2px] bg-[#001a42]"></div>
              <div className="w-full h-[2px] bg-[#001a42]"></div>
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-6 top-8 bottom-8 flex flex-col justify-between text-[11px] text-[#131b2e] font-semibold z-10 w-4 text-center">
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>

            {/* Histogram Bars */}
            <div className="w-full h-[85%] pl-10 pr-4 flex items-end justify-between gap-1.5 relative z-10">
              <div className="w-full bg-[#c3d5f3] rounded-t w-full h-[5%]"></div>
              <div className="w-full bg-[#9abced] rounded-t w-full h-[15%]"></div>
              <div className="w-full bg-[#6a9ae8] rounded-t w-full h-[45%]"></div>
              <div className="w-full bg-[#0058be] rounded-t w-full h-[90%] relative overflow-hidden shadow-sm"></div>
              <div className="w-full bg-[#2a77e8] rounded-t w-full h-[55%]"></div>
              <div className="w-full bg-[#7ca7eb] rounded-t w-full h-[35%]"></div>
              <div className="w-full bg-[#b8ceff] rounded-t w-full h-[10%]"></div>
              <div className="w-full bg-[#e2eafc] rounded-t w-full h-[3%]"></div>
            </div>
          </div>
        </div>

        {/* Boxplot Container */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_40px_-4px_rgba(19,27,46,0.04)] border border-[#c2c6d6]/10 flex flex-col h-[400px]">
          <div className="p-7 pb-4 flex justify-between items-start">
            <div>
              <h3 className="text-[17px] font-bold text-[#131b2e] mb-1">
                Hedges' g by Volume Category
              </h3>
              <p className="text-[13px] text-[#424754]">
                Variance and median effect size grouped by weekly volume.
              </p>
            </div>
            <button className="text-[#131b2e] hover:text-[#0058be] transition-colors p-1 -mr-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Chart Area */}
          <div className="flex-1 bg-[#f2f3ff] mx-7 mb-7 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-end isolate">
             {/* Background Grid Lines (Subtle) */}
            <div className="absolute inset-0 flex flex-col justify-between pt-[44px] pb-10 px-5 opacity-[0.03] pointer-events-none z-0">
              <div className="w-full h-[2px] bg-[#001a42]"></div>
              <div className="w-full h-[2px] bg-[#001a42]"></div>
              <div className="w-full h-[2px] bg-[#001a42]"></div>
            </div>

            <div className="w-full h-full flex justify-around items-end pb-8 relative z-10 group/chart">
              {/* Category 1: Low */}
              <div className="w-16 h-full flex flex-col items-center relative group-hover/chart:opacity-50 hover:!opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-[20%] top-[25%] w-px bg-[#424754]"></div>
                <div className="absolute top-[25%] w-5 h-[1.5px] bg-[#424754]"></div>
                <div className="absolute bottom-[20%] w-5 h-[1.5px] bg-[#424754]"></div>
                <div className="absolute top-[40%] bottom-[40%] w-9 bg-white border-2 border-[#0058be]/40 rounded-sm shadow-sm z-10 flex flex-col justify-center">
                  <div className="w-full h-[2.5px] bg-[#0058be] pointer-events-none"></div>
                </div>
                <span className="absolute -bottom-5 text-[10px] font-bold text-[#424754] uppercase text-center w-24">
                  Low (&lt;10)
                </span>
              </div>

              {/* Category 2: Moderate */}
              <div className="w-16 h-full flex flex-col items-center relative group-hover/chart:opacity-50 hover:!opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-[10%] top-[10%] w-px bg-[#424754]"></div>
                <div className="absolute top-[10%] w-5 h-[1.5px] bg-[#424754]"></div>
                <div className="absolute bottom-[10%] w-5 h-[1.5px] bg-[#424754]"></div>
                <div className="absolute top-[25%] bottom-[30%] w-9 bg-white border-2 border-[#0058be] rounded-sm shadow-sm z-10 flex flex-col justify-center">
                  <div className="w-full h-[3px] bg-[#0058be] pointer-events-none"></div>
                </div>
                <span className="absolute -bottom-5 text-[10px] font-bold text-[#424754] uppercase text-center w-32 tracking-wider">
                  Moderate (10-20)
                </span>
              </div>

              {/* Category 3: High */}
              <div className="w-16 h-full flex flex-col items-center relative group-hover/chart:opacity-50 hover:!opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-[15%] top-[15%] w-px bg-[#424754]"></div>
                <div className="absolute top-[15%] w-5 h-[1.5px] bg-[#424754]"></div>
                <div className="absolute bottom-[15%] w-5 h-[1.5px] bg-[#424754]"></div>
                <div className="absolute top-[35%] bottom-[30%] w-9 bg-white border-2 border-[#0058be]/40 rounded-sm shadow-sm z-10 flex flex-col justify-center">
                  <div className="w-full h-[2.5px] bg-[#0058be] pointer-events-none opacity-90"></div>
                </div>
                <span className="absolute -bottom-5 text-[10px] font-bold text-[#424754] uppercase text-center w-24 tracking-wider">
                  High (&gt;20)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
