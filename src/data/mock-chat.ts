import { ChatContact, ChatMessage } from "@/types/chat";
import { InboxDMItem } from "@/types/inbox";

/**
 * Convert any InboxDMItem into a ChatContact for the chat page.
 * Fills in reasonable defaults for fields the inbox doesn't carry.
 */
export function dmItemToContact(item: InboxDMItem): ChatContact {
  const handle = `@${item.title.toLowerCase().replace(/\s+/g, "")}`;
  return {
    id: item.id,
    name: item.title,
    handle,
    avatar: item.avatar,
    streakCount: undefined,
    isActive: item.isOnline ?? false,
    stats: "",
    mutualInfo: "",
  };
}

/** Per-contact starter messages keyed by DM item id */
const contactMessages: Record<string, ChatMessage[]> = {
  dm1: [
    { id: "m1", sender: "them", text: "Heyyyyy, did you see Taylor Swift is coming to our town next month?", timestamp: "9:16 PM" },
    { id: "m2", sender: "them", text: "I heard her new album is amazing and everyone's wristbands lit up!" },
    { id: "m3", sender: "them", text: "Her acoustic set was a real treat." },
    { id: "m4", sender: "me",   text: "Wowww! She always knows how to captivate her audience." },
    { id: "m5", sender: "me",   text: "Wanna buy ticket together?", timestamp: "9:20 PM" },
    { id: "m6", sender: "them", text: "Count me in plzz. But tickets are gonna sell out fast. We should set up a plan." },
    { id: "m7", sender: "me",   text: "Hahah, ok!", timestamp: "9:21 PM", isSeen: true },
  ],
};

/** Generic fallback conversation for contacts without specific messages */
function generateFallbackMessages(contactName: string): ChatMessage[] {
  return [
    { id: "f1", sender: "them", text: `Hey! It's ${contactName} 👋`, timestamp: "2:30 PM" },
    { id: "f2", sender: "me",   text: "Hey! What's up?" },
    { id: "f3", sender: "them", text: "Not much, just wanted to say hi!" },
    { id: "f4", sender: "me",   text: "Good to hear from you 😊", isSeen: true },
  ];
}

/** Get initial messages for a given DM item */
export function getMessagesForContact(item: InboxDMItem): ChatMessage[] {
  return contactMessages[item.id] ?? generateFallbackMessages(item.title);
}
