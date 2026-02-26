"use client";

import { useState, useCallback } from "react";
import { InboxPage } from "@/components/inbox/InboxPage";
import { ChatPage } from "@/components/chat/ChatPage";
import { InboxDMItem } from "@/types/inbox";
import { ChatContact, ChatMessage } from "@/types/chat";
import { dmItemToContact, getMessagesForContact } from "@/data/mock-chat";

/** SPA state for the active chat */
interface ActiveChat {
  contact: ChatContact;
  messages: ChatMessage[];
}

export default function Home() {
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);

  const handleOpenChat = useCallback((dm: InboxDMItem) => {
    setActiveChat({
      contact: dmItemToContact(dm),
      messages: getMessagesForContact(dm),
    });
  }, []);

  const handleBack = useCallback(() => {
    setActiveChat(null);
  }, []);

  if (activeChat) {
    return (
      <ChatPage
        contact={activeChat.contact}
        initialMessages={activeChat.messages}
        onBack={handleBack}
      />
    );
  }

  return <InboxPage onOpenChat={handleOpenChat} />;
}
