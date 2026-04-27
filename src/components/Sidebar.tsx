import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Database, FileText, Gauge, LineChart, Microscope, Wifi, WifiOff } from "lucide-react";
import { API_BASE } from "../config";

type HealthStatus = "checking" | "online" | "offline";

// ─── Backend health hook ───────────────────────────────────────────────────────
function useBackendHealth(): HealthStatus {
  const [status, setStatus] = useState<HealthStatus>("checking");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/health`, {
          signal: AbortSignal.timeout(3000),
        });
        setStatus(res.ok ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    };

    check();
    const interval = setInterval(check, 30_000); // re-check every 30 s
    return () => clearInterval(interval);
  }, []);

  return status;
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: HealthStatus }) {
  const cfg = {
    checking: {
      dot: "bg-[#f59e0b] animate-pulse",
      label: "Connecting…",
      text: "text-[#92400e]",
      bg: "bg-[#fef3c7]",
    },
    online: {
      dot: "bg-[#22c55e]",
      label: "AI Engine Online",
      text: "text-[#166534]",
      bg: "bg-[#dcfce7]",
    },
    offline: {
      dot: "bg-[#ef4444]",
      label: "AI Engine Offline",
      text: "text-[#991b1b]",
      bg: "bg-[#fee2e2]",
    },
  }[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${cfg.bg} transition-colors duration-500`}>
      {status === "online" ? (
        <Wifi className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.text}`} />
      ) : status === "offline" ? (
        <WifiOff className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.text}`} />
      ) : (
        <span className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} inline-block`} />
        </span>
      )}
      <span className={`text-[10px] font-bold tracking-wide ${cfg.text}`}>{cfg.label}</span>
      {status === "online" && (
        <span className="ml-auto w-2 h-2 rounded-full bg-[#22c55e] animate-pulse flex-shrink-0" />
      )}
    </div>
  );
}

// ─── Shared NavLink class helper ───────────────────────────────────────────────
const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
    isActive
      ? "bg-[#0058be]/10 text-[#0058be] font-semibold"
      : "text-[#424754] hover:bg-[#eaedff] hover:text-[#0058be]"
  }`;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const health = useBackendHealth();

  return (
    <nav
      aria-label="Main navigation"
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#f2f3ff] pt-6 px-4 pb-4 space-y-2 z-40"
    >
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

      <div className="flex-1 space-y-1" role="list">
        <NavLink to="/overview" className={navClass} end role="listitem">
          {({ isActive }) => (
            <>
              <Database className={`w-5 h-5 ${isActive ? "fill-[#0058be]/20" : ""}`} />
              <span className="text-sm">Data Overview</span>
            </>
          )}
        </NavLink>

        <NavLink to="/volume" className={navClass} role="listitem">
          {({ isActive }) => (
            <>
              <LineChart className={`w-5 h-5 ${isActive ? "fill-[#0058be]/20" : ""}`} />
              <span className="text-sm">Volume vs Hypertrophy</span>
            </>
          )}
        </NavLink>

        <NavLink to="/optimizer" className={navClass} role="listitem">
          {({ isActive }) => (
            <>
              <Gauge className={`w-5 h-5 ${isActive ? "fill-[#0058be]/20" : ""}`} />
              <span className="text-sm">Volume Optimizer</span>
            </>
          )}
        </NavLink>

        <NavLink to="/case-study" className={navClass} role="listitem">
          {({ isActive }) => (
            <>
              <Microscope className={`w-5 h-5 ${isActive ? "fill-[#0058be]/20" : ""}`} />
              <span className="text-sm">Case Study</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Backend health status */}
      <div className="mt-auto pt-4 space-y-3">
        <StatusBadge status={health} />

        <div className="border-t border-[#c2c6d6]/20 pt-3">
          <a
            href="/docs/report.docx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 text-[#424754] px-4 py-2.5 rounded-xl hover:bg-[#eaedff] hover:text-[#0058be] transition-all duration-200 font-medium"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Documentation</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
