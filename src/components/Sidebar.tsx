import {
  BarChart2,
  Bell,
  Database,
  Dumbbell,
  FileText,
  Filter,
  FlaskConical,
  Gauge,
  HelpCircle,
  Library,
  LineChart,
  Microscope,
  MoreVertical,
  Search,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#f2f3ff] pt-6 px-4 pb-4 space-y-2 z-40">
      <div className="flex items-center gap-3 mb-10 px-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0058be]">
            TrainHyp
          </h1>
          <p className="text-[11px] text-[#424754] font-medium tracking-wide">
            Clinical ML Analytics
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <button
          onClick={() => setActivePage("overview")}
          className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            activePage === "overview"
              ? "bg-[#0058be]/10 text-[#0058be] font-semibold"
              : "text-[#424754] hover:bg-[#eaedff] hover:text-[#0058be]"
          }`}
        >
          <Database className={`w-5 h-5 ${activePage === "overview" ? "fill-[#0058be]/20" : ""}`} />
          <span className="text-sm">Data Overview</span>
        </button>
        <button
          onClick={() => setActivePage("volume")}
          className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            activePage === "volume"
              ? "bg-[#0058be]/10 text-[#0058be] font-semibold"
              : "text-[#424754] hover:bg-[#eaedff] hover:text-[#0058be]"
          }`}
        >
          <LineChart className="w-5 h-5" />
          <span className="text-sm">Volume vs Hypertrophy</span>
        </button>
        <button
          onClick={() => setActivePage("optimizer")}
          className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            activePage === "optimizer"
              ? "bg-[#0058be]/10 text-[#0058be] font-semibold"
              : "text-[#424754] hover:bg-[#eaedff] hover:text-[#0058be]"
          }`}
        >
          <Gauge className={`w-5 h-5 ${activePage === "optimizer" ? "fill-[#0058be]/20" : ""}`} />
          <span className="text-sm">Volume Optimizer</span>
        </button>
        <button
          onClick={() => setActivePage("study")}
           className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            activePage === "study"
              ? "bg-[#0058be]/10 text-[#0058be] font-semibold"
              : "text-[#424754] hover:bg-[#eaedff] hover:text-[#0058be]"
          }`}
        >
          <Microscope className={`w-5 h-5 ${activePage === "study" ? "fill-[#0058be]/20" : ""}`} />
          <span className="text-sm">Case Study</span>
        </button>
      </div>

      <div className="mt-auto space-y-1 pt-6 border-t border-[#c2c6d6]/20">
        <button
          className="flex w-full items-center gap-3 text-[#424754] px-4 py-2.5 rounded-xl hover:bg-[#eaedff] hover:text-[#0058be] transition-all duration-200 font-medium"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm">Documentation</span>
        </button>
        <button
          className="flex w-full items-center gap-3 text-[#424754] px-4 py-2.5 rounded-xl hover:bg-[#eaedff] hover:text-[#0058be] transition-all duration-200 font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Support</span>
        </button>
      </div>
    </nav>
  );
}
