"use client";

import { NavBar } from "./NavBar";
import { InboxCell } from "./InboxCell";
import { BottomTabBar } from "./BottomTabBar";
import { useViewportScale } from "@/hooks/useViewportScale";
import { mockNotificationItems, mockDMItems } from "@/data/mock-inbox";
import { InboxDMItem } from "@/types/inbox";

const DESIGN_WIDTH = 390;

interface InboxPageProps {
  onOpenChat?: (dm: InboxDMItem) => void;
}

export function InboxPage({ onOpenChat }: InboxPageProps) {
  const layout = useViewportScale();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: layout.viewportHeight,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div
        className="flex flex-col overflow-hidden bg-white"
        style={{
          width: DESIGN_WIDTH,
          height: layout.designHeight,
          transform: `scale(${layout.scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Nav Bar */}
        <NavBar />

        {/* Scrollable content */}
        <div className="scrollbar-ios flex-1 overflow-y-auto">
          {/* Story Row */}
          <div className="w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/skylight.png"
              alt="Stories"
              className="h-auto w-full"
            />
          </div>

          {/* Notification Items */}
          <div className="flex flex-col">
            {mockNotificationItems.map((item) => (
              <InboxCell key={item.id} item={item} />
            ))}
          </div>

          {/* DM Items */}
          <div className="flex flex-col">
            {mockDMItems.map((item) => (
              <InboxCell key={item.id} item={item} onOpenChat={onOpenChat} />
            ))}
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <BottomTabBar />
      </div>
    </div>
  );
}
