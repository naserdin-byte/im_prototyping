"use client";

import { useState } from "react";
import Image from "next/image";
import { NavBar } from "./NavBar";
import { InboxCell } from "./InboxCell";
import { mockInboxItems } from "@/data/mock-inbox";
import { InboxItem } from "@/types/inbox";

export function InboxPage() {
  const [items, setItems] = useState(mockInboxItems);

  const handleItemPress = (item: InboxItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, isUnread: false, badgeCount: 0 } : i
      )
    );
  };

  return (
    <div className="relative mx-auto flex h-dvh max-w-[430px] flex-col overflow-hidden bg-white">
      {/* Nav Bar */}
      <NavBar />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Story Row - responsive: always show full image */}
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

        {/* Inbox Items */}
        <div className="flex flex-col">
          {items.map((item) => (
            <InboxCell key={item.id} item={item} onPress={handleItemPress} />
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar - only tab icons, home indicator removed */}
      <div className="relative w-full shrink-0 overflow-hidden" style={{ aspectRatio: "390/49" }}>
        <Image
          src="/images/bottom-bar.png"
          alt="Tab bar"
          fill
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
