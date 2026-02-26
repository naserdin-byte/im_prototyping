"use client";

interface NavBarProps {
  onFilterChange?: (filter: string) => void;
}

export function NavBar({ onFilterChange }: NavBarProps) {
  return (
    <div className="shrink-0 relative overflow-hidden bg-white" style={{ height: 44 }}>
      {/* Figma design image — only the nav bar portion (bottom 44px of 91px image) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/icons/top-elements.png"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0"
        style={{ width: 390, height: 91 }}
        draggable={false}
      />
      {/* Invisible interactive overlay buttons */}
      <div className="absolute inset-0 z-10 flex items-center justify-between px-4">
        <button className="flex h-[32px] w-[32px] items-center justify-center" aria-label="New message" />
        <button
          className="flex h-[32px] items-center gap-1 px-4"
          onClick={() => onFilterChange?.("toggle")}
          aria-label="Filter inbox"
        />
        <button className="flex h-[32px] w-[32px] items-center justify-center" aria-label="Search" />
      </div>
    </div>
  );
}
