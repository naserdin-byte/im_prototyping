export type NotificationVariant = "followers" | "activity" | "system";

export interface InboxNotificationItem {
  id: string;
  type: "notification";
  variant: NotificationVariant;
  title: string;
  message: string;
  badgeCount?: number;
  timestamp?: string;
  isUnread: boolean;
}

export interface InboxDMItem {
  id: string;
  type: "dm";
  title: string;
  message: string;
  avatar: string;
  badgeCount?: number;
  timestamp?: string;
  isUnread: boolean;
  isOnline?: boolean;
  hasStoryRing?: boolean;
  storyRead?: boolean;
  /** Streak flame count — shows 🔥 icon + number next to name */
  streakCount?: number;
}

export type InboxItem = InboxNotificationItem | InboxDMItem;
