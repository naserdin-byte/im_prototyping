import { InboxItem, InboxDMItem } from "@/types/inbox";
import { Avatar } from "./Avatar";
import { InboxLeadingIcon } from "./InboxLeadingIcon";
import { AlertBadge } from "./AlertBadge";

interface InboxCellProps {
  item: InboxItem;
  /** Called when a DM cell is tapped — passes the DM item for the chat page */
  onOpenChat?: (dm: InboxDMItem) => void;
}

export function InboxCell({ item, onOpenChat }: InboxCellProps) {
  const isNotification = item.type === "notification";
  const isDM = item.type === "dm";

  // Figma: unread → H4-Semibold (600) + P1-Semibold (600) in black
  //        read   → H4-Regular (400) + P1-Regular (400) in black/48
  const titleWeight =
    isNotification || item.isUnread ? "font-semibold" : "font-normal";
  const messageWeight =
    isNotification || item.isUnread ? "font-semibold" : "font-normal";
  const messageColor =
    isNotification || item.isUnread ? "text-black" : "text-black/48";

  const inner = (
    <>
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
          {/* Title + optional streak */}
          <div className="flex items-center gap-1">
            <span
              className={`truncate text-[15px] leading-[1.3] text-black ${titleWeight}`}
            >
              {item.title}
            </span>
            {isDM && item.streakCount != null && (
              <div className="flex shrink-0 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/icons/icon-streak-flame.png"
                  alt=""
                  style={{ width: 16, height: 16 }}
                />
                <span
                  className="font-medium"
                  style={{ fontSize: 15, lineHeight: "1.3em", color: "#FF6613" }}
                >
                  {item.streakCount}
                </span>
              </div>
            )}
          </div>

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
      {item.badgeCount != null && item.badgeCount > 0 && (
        <div className="shrink-0 pl-3">
          <div className="flex h-[42px] w-[42px] items-center justify-center">
            <AlertBadge count={item.badgeCount} />
          </div>
        </div>
      )}
    </>
  );

  const className = "flex w-full items-center py-2 pr-2 pl-4";

  if (isDM && onOpenChat) {
    return (
      <button
        onClick={() => onOpenChat(item)}
        className={`${className} cursor-pointer text-left active:bg-black/5`}
      >
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}
