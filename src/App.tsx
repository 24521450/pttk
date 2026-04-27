import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DataOverview from "./pages/DataOverview";
import VolumeVsHypertrophy from "./pages/VolumeVsHypertrophy";
import VolumeOptimizer from "./pages/VolumeOptimizer";
import CaseStudy from "./pages/CaseStudy";

/**
 * AnimatedRoutes — wraps Routes with a fade+slide animation triggered
 * each time the URL path changes (key={pathname} forces a remount).
 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter flex-1 overflow-y-auto">
      <Routes>
        <Route path="/" element={<Navigate to="/optimizer" replace />} />
        <Route path="/overview"   element={<DataOverview />} />
        <Route path="/volume"     element={<VolumeVsHypertrophy />} />
        <Route path="/optimizer"  element={<VolumeOptimizer />} />
        <Route path="/case-study" element={<CaseStudy />} />
        {/* Catch-all: redirect unknown paths to optimizer */}
        <Route path="*"           element={<Navigate to="/optimizer" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-screen font-sans selection:bg-[#0058be]/20 tracking-tight">
        <Sidebar />
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}
