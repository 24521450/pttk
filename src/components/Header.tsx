import { Bell, Search, Settings } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="md:hidden flex justify-between items-center w-full px-6 h-16 bg-[#faf8ff] font-sans antialiased tracking-tight text-[#0058be] fixed top-0 z-50 bg-[#f2f3ff] shadow-sm">
        <div className="text-xl font-bold tracking-tight text-[#0058be]">
          TrainHyp
        </div>
        <div className="flex gap-3">
          <button className="text-[#424754] hover:text-[#0058be]">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-[#424754] hover:text-[#0058be]">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center w-full px-6 lg:px-10 h-20 bg-white sticky top-0 z-30">
        <div className="flex-1 max-w-[460px] mx-8">
          <div className="relative w-full group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#424754] group-focus-within:text-[#0058be] transition-colors" />
            <input
              type="text"
              placeholder="Search insights..."
              className="w-full bg-[#f8f9fc] border-none rounded-full py-2.5 pl-11 pr-4 text-[13px] font-medium text-[#131b2e] placeholder:text-[#424754] focus:bg-white focus:ring-1 focus:ring-[#0058be]/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto mr-4">
          <button className="text-[#424754] hover:text-[#0058be] transition-colors duration-200">
            <Bell className="w-5 h-5" fill="currentColor" />
          </button>
          <button className="text-[#424754] hover:text-[#0058be] transition-colors duration-200">
            <Settings className="w-5 h-5" fill="currentColor" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#d8e2ff] overflow-hidden ml-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c2c6d6]/20">
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=100&h=100"
              alt="User profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>
    </>
  );
}
