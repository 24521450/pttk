import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DataOverview from "./pages/DataOverview";
import VolumeVsHypertrophy from "./pages/VolumeVsHypertrophy";
import VolumeOptimizer from "./pages/VolumeOptimizer";
import CaseStudy from "./pages/CaseStudy";

export default function App() {
  const [activePage, setActivePage] = useState("optimizer");

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] flex min-h-screen font-sans selection:bg-[#0058be]/20 tracking-tight">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header />

        <div key={activePage} className="page-enter flex-1 overflow-y-auto">
          {activePage === "overview" && <DataOverview />}
          {activePage === "volume" && <VolumeVsHypertrophy />}
          {activePage === "optimizer" && <VolumeOptimizer />}
          {activePage === "study" && <CaseStudy />}
        </div>
      </main>
    </div>
  );
}

