export interface ChatContact {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  streakCount?: number;
  isActive: boolean;
  stats: string;
  mutualInfo: string;
}

/** Emoji reactions available in the long-press picker */
export const REACTION_EMOJIS = ["❤️", "😂", "😡", "😭", "👍", "🤔", "🎉"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp?: string; // shown as centered timestamp label above this message
  isSeen?: boolean;   // "Seen" indicator below sender's message
  reaction?: ReactionEmoji; // emoji reaction shown below the bubble
}

/** Computed position within a consecutive group from the same sender */
export type BubblePosition = "single" | "top" | "middle" | "bottom";
