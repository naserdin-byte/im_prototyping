import { ChatContact, ChatMessage } from "@/types/chat";

export const chatContact: ChatContact = {
  id: "taoo425",
  name: "Taoo425",
  handle: "@taoo425",
  avatar: "/images/avatars/avatar-taoo425.png",
  streakCount: 3,
  isActive: true,
  stats: "36 videos · 227 followers",
  mutualInfo: "You both follow Mikcy and 29 others",
};

export const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "them",
    text: "Heyyyyy, did you see Taylor Swift is coming to our town next month?",
    timestamp: "9:16 PM",
  },
  {
    id: "m2",
    sender: "them",
    text: "I heard her new album is amazing and everyone's wristbands lit up!",
  },
  {
    id: "m3",
    sender: "them",
    text: "Her acoustic set was a real treat.",
  },
  {
    id: "m4",
    sender: "me",
    text: "Wowww! She always knows how to captivate her audience.",
  },
  {
    id: "m5",
    sender: "me",
    text: "Wanna buy ticket together?",
    timestamp: "9:20 PM",
  },
  {
    id: "m6",
    sender: "them",
    text: "Count me in plzz. But tickets are gonna sell out fast. We should set up a plan.",
  },
  {
    id: "m7",
    sender: "me",
    text: "Hahah, ok!",
    timestamp: "9:21 PM",
    isSeen: true,
  },
];
