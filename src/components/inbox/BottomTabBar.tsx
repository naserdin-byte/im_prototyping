"use client";

interface BottomTabBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function BottomTabBar({ activeTab = "inbox", onTabChange }: BottomTabBarProps) {
  const tabs = ["home", "friends", "create", "inbox", "profile"];

  return (
    <div className="shrink-0 relative overflow-hidden bg-white" style={{ height: 49 }}>
      {/* Figma design image — only the tab bar portion (top 49px of 83px image) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/icons/bottom-elements.png"
        alt=""
        className="pointer-events-none absolute left-0 top-0"
        style={{ width: 390, height: 83 }}
        draggable={false}
      />
      {/* Invisible interactive overlay buttons */}
      <div className="absolute inset-0 z-10 flex items-center justify-around">
        {tabs.map((tabId) => (
          <button
            key={tabId}
            className="h-full flex-1"
            onClick={() => onTabChange?.(tabId)}
            aria-label={tabId}
          />
        ))}
      </div>
    </div>
  );
}
