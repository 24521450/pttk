export default function Header() {
  return (
    <>
      {/* Mobile Header — title only */}
      <header className="md:hidden flex items-center w-full px-6 h-16 bg-[#f2f3ff] fixed top-0 z-50 shadow-sm">
        <div className="text-xl font-bold tracking-tight text-[#0058be]">TrainHyp</div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex justify-end items-center w-full px-6 lg:px-10 h-20 bg-white sticky top-0 z-30 border-b border-[#f2f3ff]">
        {/* SVG avatar — no external dependency */}
        <div
          className="w-9 h-9 rounded-full bg-[#d8e2ff] flex items-center justify-center shadow-[0_4px_12px_rgba(0,88,190,0.12)] border-2 border-white"
          title="STAT3013 — TrainHyp AI"
        >
          <svg viewBox="0 0 36 36" className="w-full h-full" aria-hidden="true">
            <circle cx="18" cy="18" r="18" fill="#d8e2ff" />
            <text
              x="18" y="23"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="#0058be"
              fontFamily="system-ui, sans-serif"
            >TH</text>
          </svg>
        </div>
      </header>
    </>
  );
}
