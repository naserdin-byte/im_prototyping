"use client";

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number;
}

interface BottomTabBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function BottomTabBar({ activeTab = "inbox", onTabChange }: BottomTabBarProps) {
  const tabs: TabItem[] = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "friends",
      label: "Friends",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15 3.12602C16.7252 3.57006 18 5.13616 18 7C18 8.86384 16.7252 10.4299 15 10.874M12 7C12 9.20914 10.2091 11 8 11C5.79086 11 4 9.20914 4 7C4 4.79086 5.79086 3 8 3C10.2091 3 12 4.79086 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "create",
      label: "",
      icon: (
        <div className="flex h-[36px] w-[44px] items-center justify-center rounded-[8px] bg-black">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      ),
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      activeIcon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" />
        </svg>
      ),
      badge: 12,
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="shrink-0 border-t border-black/5 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex h-[49px] items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCreate = tab.id === "create";

          return (
            <button
              key={tab.id}
              className={`relative flex flex-col items-center justify-center ${
                isCreate ? "px-1" : "min-w-[48px] gap-[2px] px-2"
              }`}
              onClick={() => onTabChange?.(tab.id)}
            >
              <div className={isActive && !isCreate ? "text-black" : isCreate ? "" : "text-black/40"}>
                {isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
              </div>
              {tab.label && (
                <span
                  className={`text-[10px] leading-[12px] ${
                    isActive ? "font-medium text-black" : "text-black/40"
                  }`}
                >
                  {tab.label}
                </span>
              )}
              {tab.badge && tab.badge > 0 && (
                <div className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#FE2C55] px-[4px]">
                  <span className="text-[10px] font-bold leading-none text-white">
                    {tab.badge}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
