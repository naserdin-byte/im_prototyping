"use client";

import { InboxItem } from "@/types/inbox";
import { Avatar } from "./Avatar";
import { InboxLeadingIcon } from "./InboxLeadingIcon";
import { AlertBadge } from "./AlertBadge";

interface InboxCellProps {
  item: InboxItem;
  onPress?: (item: InboxItem) => void;
}

export function InboxCell({ item, onPress }: InboxCellProps) {
  const isNotification = item.type === "notification";
  const isDM = item.type === "dm";

  // Figma text styling rules:
  // - Notification cells: always H4-Medium(500) title + P1-Medium(500) message, both #000
  // - DM unread: H4-Medium(500) title #000 + P1-Medium(500) message #000
  // - DM read: H4-Regular(400) title #000 + P1-Regular(400) message rgba(0,0,0,0.48)
  const titleWeight =
    isNotification || item.isUnread ? "font-medium" : "font-normal";
  const messageWeight =
    isNotification || item.isUnread ? "font-medium" : "font-normal";
  const messageColor =
    isNotification || item.isUnread ? "text-black" : "text-black/48";

  return (
    <button
      className="flex w-full items-center py-2 pr-2 pl-4 text-left transition-colors active:bg-black/5"
      onClick={() => onPress?.(item)}
    >
      {/* Leading */}
      <div className="shrink-0 pr-3">
        {isNotification ? (
          <InboxLeadingIcon variant={item.variant} />
        ) : isDM ? (
          <Avatar
            src={item.avatar}
            alt={item.title}
            size={56}
            hasStoryRing={item.hasStoryRing}
            storyRead={item.storyRead}
            isOnline={item.isOnline}
          />
        ) : null}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-[2px]">
          {/* Title */}
          <span
            className={`block truncate text-[15px] leading-[1.3] text-black ${titleWeight}`}
          >
            {item.title}
          </span>

          {/* Message line */}
          <div className="flex items-center">
            <span
              className={`truncate text-[14px] leading-[1.3] ${messageWeight} ${messageColor}`}
            >
              {item.message}
            </span>
            {item.timestamp && (
              <span className="flex shrink-0 items-center gap-1 text-[14px] leading-[1.3] font-normal text-black/48">
                <span className="inline-block h-[2px] w-[2px] rounded-full bg-black/48" />
                {item.timestamp}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trailing badge */}
      {item.badgeCount && item.badgeCount > 0 && (
        <div className="shrink-0 pl-3">
          <div className="flex h-[42px] w-[42px] items-center justify-center">
            <AlertBadge count={item.badgeCount} />
          </div>
        </div>
      )}
    </button>
  );
}
