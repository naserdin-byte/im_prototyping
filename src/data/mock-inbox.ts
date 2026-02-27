import { InboxNotificationItem, InboxDMItem } from "@/types/inbox";

export const mockNotificationItems: InboxNotificationItem[] = [
  {
    id: "n1",
    type: "notification",
    variant: "followers",
    title: "New Followers",
    message: "Rhianna started following you.",
    badgeCount: 9,
    isUnread: true,
  },
  {
    id: "n2",
    type: "notification",
    variant: "activity",
    title: "Activity",
    message: "Jaela liked your video.",
    badgeCount: 1,
    isUnread: false,
  },
  {
    id: "n3",
    type: "notification",
    variant: "system",
    title: "System notifications",
    message: "TikTok:Updates to your post performance",
    badgeCount: 1,
    timestamp: "1h",
    isUnread: false,
  },
];

/**
 * DM items — first 5 showcase every Figma cell state from node 1461-43968:
 *
 * dm1  unread + story + online + streak + badge  (all features)
 * dm2  story + online + streak                   (read, no badge)
 * dm3  online + streak                           (no story)
 * dm4  unread + streak + badge                   (no story, no online)
 * dm5  streak only                               (minimal)
 * dm6  unread + badge                            (no streak)
 * dm7  story (read ring)                         (read story)
 * dm8  normal                                    (plain cell)
 */
export const mockDMItems: InboxDMItem[] = [
  // ── State: unread + story + online + streak + badge ──
  {
    id: "dm1",
    type: "dm",
    title: "Taoo425",
    message: "Count me in plzz. But tickets are gonna sell out fast. We should set up a plan.",
    avatar: "/images/avatars/avatar-taoo425.png",
    badgeCount: 1,
    timestamp: "1h",
    isUnread: true,
    hasStoryRing: true,
    storyRead: false,
    isOnline: true,
    streakCount: 5,
  },
  // ── State: story + online + streak (read) ──
  {
    id: "dm2",
    type: "dm",
    title: "Tommy Tang",
    message: "Hey wanna hang out later?",
    avatar: "/images/avatars/avatar-tommy-story.png",
    timestamp: "30m",
    isUnread: false,
    hasStoryRing: true,
    storyRead: false,
    isOnline: true,
    streakCount: 3,
  },
  // ── State: online + streak ──
  {
    id: "dm3",
    type: "dm",
    title: "summer",
    message: "That song is stuck in my head 🎵",
    avatar: "/images/avatars/avatar-summer.png",
    timestamp: "4h",
    isUnread: false,
    isOnline: true,
    streakCount: 7,
  },
  // ── State: unread + streak + badge ──
  {
    id: "dm4",
    type: "dm",
    title: "July",
    message: "hello!!!",
    avatar: "/images/avatars/avatar-july.png",
    badgeCount: 1,
    timestamp: "2h",
    isUnread: true,
    streakCount: 3,
  },
  // ── State: streak only ──
  {
    id: "dm5",
    type: "dm",
    title: "pumpkin",
    message: "Hello how r u recently",
    avatar: "/images/avatars/avatar-pumpkin.png",
    timestamp: "8h",
    isUnread: false,
    streakCount: 2,
  },
  // ── State: unread + badge (no streak) ──
  {
    id: "dm6",
    type: "dm",
    title: "Alex",
    message: "Did you see the new episode?",
    avatar: "/images/avatars/alex.jpg",
    badgeCount: 3,
    timestamp: "3h",
    isUnread: true,
  },
  // ── State: story ring (read) ──
  {
    id: "dm7",
    type: "dm",
    title: "Megan",
    message: "Omg that's so funny lol 😂",
    avatar: "/images/avatars/megan.jpg",
    timestamp: "5h",
    isUnread: false,
    hasStoryRing: true,
    storyRead: true,
  },
  // ── State: normal (no features) ──
  {
    id: "dm8",
    type: "dm",
    title: "Joanna",
    message: "Are we still meeting tmr?",
    avatar: "/images/avatars/joanna.jpg",
    timestamp: "6h",
    isUnread: false,
  },
  // ── Additional items below ──
  {
    id: "dm9",
    type: "dm",
    title: "Tommy Tang",
    message: "Sent you a video",
    avatar: "/images/avatars/tommy.jpg",
    timestamp: "8h",
    isUnread: false,
    isOnline: true,
  },
  {
    id: "dm10",
    type: "dm",
    title: "summer",
    message: "The concert was amazing!! 🎶🔥",
    avatar: "/images/avatars/summer.jpg",
    timestamp: "12h",
    isUnread: false,
  },
  {
    id: "dm11",
    type: "dm",
    title: "Taoo425",
    message: "Check this out haha",
    avatar: "/images/avatars/taoo425.jpg",
    timestamp: "1d",
    isUnread: false,
    hasStoryRing: true,
    storyRead: false,
  },
  {
    id: "dm12",
    type: "dm",
    title: "July",
    message: "Happy birthday!! 🎂🎉",
    avatar: "/images/avatars/july.jpg",
    timestamp: "1d",
    isUnread: false,
  },
  {
    id: "dm13",
    type: "dm",
    title: "pumpkin",
    message: "Can you send me that recipe?",
    avatar: "/images/avatars/pumpkin.jpg",
    badgeCount: 2,
    timestamp: "2d",
    isUnread: true,
  },
  {
    id: "dm14",
    type: "dm",
    title: "Alex",
    message: "Let's plan the trip 🏖️",
    avatar: "/images/avatars/alex.jpg",
    timestamp: "3d",
    isUnread: false,
    isOnline: true,
  },
  {
    id: "dm15",
    type: "dm",
    title: "Megan",
    message: "Thanks for the help!",
    avatar: "/images/avatars/megan.jpg",
    timestamp: "3d",
    isUnread: false,
  },
  {
    id: "dm16",
    type: "dm",
    title: "Joanna",
    message: "I'll be there in 10 mins",
    avatar: "/images/avatars/joanna.jpg",
    timestamp: "5d",
    isUnread: false,
  },
];
