"use client";

interface NavBarProps {
  onFilterChange?: (filter: string) => void;
}

export function NavBar({ onFilterChange }: NavBarProps) {
  return (
    <div className="shrink-0 bg-white" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex h-[47px] items-center justify-between px-4">
        {/* Left - New message */}
        <button className="flex h-[32px] w-[32px] items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="black" strokeWidth="1.5" />
            <path d="M12 8V16M8 12H16" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Center - Title */}
        <div className="flex items-center gap-1">
          <h1 className="text-[17px] font-bold leading-[22px] text-black">
            Inbox
          </h1>
          <button className="flex items-center" onClick={() => onFilterChange?.("toggle")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 7L8 10L11 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Right - Search */}
        <button className="flex h-[32px] w-[32px] items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
