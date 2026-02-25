export type InboxItemType = "notification" | "dm";

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
}

export type InboxItem = InboxNotificationItem | InboxDMItem;

export interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  isRead: boolean;
  bubble?: string;
}
