export default function Header() {
  return (
    <>
      {/* Mobile Header — title only */}
      <header className="md:hidden flex items-center w-full px-6 h-16 bg-[#f2f3ff] fixed top-0 z-50 shadow-sm">
        <div className="text-xl font-bold tracking-tight text-[#0058be]">TrainHyp</div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex items-center w-full px-6 lg:px-10 h-20 bg-white sticky top-0 z-30 border-b border-[#f2f3ff]" />
    </>
  );
}
