"use client";

import Image from "next/image";
import { NavBar } from "./NavBar";
import { InboxCell } from "./InboxCell";
import { BottomTabBar } from "./BottomTabBar";
import { mockInboxItems } from "@/data/mock-inbox";

export function InboxPage() {
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-white">
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
          {mockInboxItems.map((item) => (
            <InboxCell key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
