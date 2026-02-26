"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NavBar } from "./NavBar";
import { InboxCell } from "./InboxCell";
import { BottomTabBar } from "./BottomTabBar";
import { mockNotificationItems, mockDMItems } from "@/data/mock-inbox";
import { InboxDMItem } from "@/types/inbox";

const DESIGN_WIDTH = 390;

interface InboxPageProps {
  onOpenChat?: (dm: InboxDMItem) => void;
}

export function InboxPage({ onOpenChat }: InboxPageProps) {
  const [layout, setLayout] = useState({ scale: 1, designHeight: 844 });

  useEffect(() => {
    const update = () => {
      const scale = window.innerWidth / DESIGN_WIDTH;
      const designHeight = window.innerHeight / scale;
      setLayout({ scale, designHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="h-dvh w-full overflow-hidden bg-black">
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
            <Image
              src="/images/skylight.png"
              alt="Stories"
              width={810}
              height={306}
              className="h-auto w-full"
              priority
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
