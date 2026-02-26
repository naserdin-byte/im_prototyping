"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { ChatNavBar } from "./ChatNavBar";
import { MessageBubble } from "./MessageBubble";
import { ChatInputBar, ChatInputBarHandle } from "./ChatInputBar";
import { ReactionPicker } from "./ReactionPicker";
import { EmojiStickerPanel } from "./EmojiStickerPanel";
import { useViewportScale } from "@/hooks/useViewportScale";
import { ChatContact, ChatMessage, BubblePosition, ReactionEmoji } from "@/types/chat";

const DESIGN_WIDTH = 390;

/**
 * Compute each message's position within consecutive same-sender groups.
 * A timestamp on a message starts a new visual section and breaks grouping.
 */
function computePositions(messages: ChatMessage[]): BubblePosition[] {
  return messages.map((msg, i) => {
    const prev = i > 0 ? messages[i - 1] : null;
    const next = i < messages.length - 1 ? messages[i + 1] : null;

    const sameSenderAsPrev =
      prev != null && prev.sender === msg.sender && !msg.timestamp;
    const sameSenderAsNext =
      next != null && next.sender === msg.sender && !next?.timestamp;

    if (!sameSenderAsPrev && !sameSenderAsNext) return "single";
    if (!sameSenderAsPrev && sameSenderAsNext) return "top";
    if (sameSenderAsPrev && sameSenderAsNext) return "middle";
    return "bottom";
  });
}

/** State for the long-press reaction picker overlay */
interface PickerState {
  msgId: string;
}

interface ChatPageProps {
  /** The contact to display — derived from the inbox selection */
  contact: ChatContact;
  /** Initial messages for this conversation */
  initialMessages: ChatMessage[];
  /** Called when user taps the back button */
  onBack: () => void;
}

export function ChatPage({ contact, initialMessages, onBack }: ChatPageProps) {
  const layout = useViewportScale();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<ChatInputBarHandle>(null);
  const prevHeightRef = useRef(layout.viewportHeight);

  // Reset messages when contact changes
  useEffect(() => {
    setMessages(initialMessages);
    setPicker(null);
    setShowEmojiPanel(false);
  }, [initialMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [initialMessages]);

  // Scroll to bottom when emoji panel opens/closes (messages area resizes)
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [showEmojiPanel]);

  // Scroll to bottom when viewport height shrinks (keyboard opened)
  useEffect(() => {
    const prev = prevHeightRef.current;
    prevHeightRef.current = layout.viewportHeight;
    // Only scroll when height *shrinks* (keyboard appeared), not when it grows
    if (layout.viewportHeight < prev) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  }, [layout.viewportHeight]);

  const handleSend = useCallback((text: string) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    const timeStr = `${h12}:${minutes} ${ampm}`;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text,
      timestamp: timeStr,
    };

    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.isSeen ? { ...m, isSeen: false } : m
      );
      return [...updated, newMsg];
    });
  }, []);

  /** Long-press callback from MessageBubble */
  const handleLongPress = useCallback(
    (msgId: string) => {
      setPicker({ msgId });
    },
    [],
  );

  /** Add or toggle reaction on the long-pressed message */
  const handleReaction = useCallback(
    (emoji: ReactionEmoji) => {
      if (!picker) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== picker.msgId) return m;
          // Toggle: tap same emoji again → remove reaction
          return { ...m, reaction: m.reaction === emoji ? undefined : emoji };
        }),
      );
      setPicker(null);
    },
    [picker],
  );

  /** Toggle the emoji & sticker panel */
  const handleToggleEmojiPanel = useCallback(() => {
    setShowEmojiPanel((prev) => !prev);
  }, []);

  /** Insert emoji from the panel into the text input */
  const handleEmojiSelect = useCallback((emoji: string) => {
    inputBarRef.current?.insertText(emoji);
  }, []);

  const positions = computePositions(messages);
  const pickerMsgIdx = picker ? messages.findIndex((m) => m.id === picker.msgId) : -1;
  const pickerMsg = pickerMsgIdx >= 0 ? messages[pickerMsgIdx] : null;
  const pickerPos = pickerMsgIdx >= 0 ? positions[pickerMsgIdx] : "single";

  return (
    <div
      style={{
        position: "fixed",
        top: layout.offsetTop,
        left: 0,
        width: "100%",
        height: layout.viewportHeight,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: DESIGN_WIDTH,
          height: layout.designHeight,
          transform: `scale(${layout.scale})`,
          transformOrigin: "top left",
          background: "#F5F5F5",
        }}
      >
        {/* Chat Nav Bar */}
        <ChatNavBar contact={contact} onBack={onBack} />

        {/* Messages area — min-h-0 is critical for flex child overflow scroll */}
        <div
          ref={scrollRef}
          className="scrollbar-ios flex-1 overflow-y-auto"
          style={{ minHeight: 0 }}
        >
          {/* Profile header */}
          <div className="flex flex-col items-center gap-4 pb-2 pt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={contact.avatar}
              alt={contact.name}
              className="rounded-full object-cover"
              style={{ width: 96, height: 96 }}
            />
            <div className="flex flex-col items-center gap-1">
              <span
                className="font-bold"
                style={{
                  fontSize: 20,
                  lineHeight: "1.25em",
                  color: "#202020",
                }}
              >
                {contact.name}
              </span>
              <div className="flex flex-col items-center gap-0.5">
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: "1.3em",
                    color: "rgba(0,0,0,0.65)",
                  }}
                >
                  {contact.handle}
                </span>
                {contact.stats && (
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: "1.3em",
                      color: "rgba(0,0,0,0.65)",
                    }}
                  >
                    {contact.stats}
                  </span>
                )}
                {contact.mutualInfo && (
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: "1.3em",
                      color: "rgba(0,0,0,0.65)",
                    }}
                  >
                    {contact.mutualInfo}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex flex-col" style={{ paddingBottom: 8 }}>
            {messages.map((msg, i) => {
              const pos = positions[i];
              const showAvatar =
                msg.sender === "them" &&
                (pos === "single" || pos === "bottom");

              // Figma spacing:
              // - 10px gap between groups (different sender or timestamp break)
              // - 4px gap within a group (consecutive same-sender)
              const isGroupContinuation =
                pos === "middle" || pos === "bottom";
              const gapTop = i === 0 ? 0 : isGroupContinuation ? 4 : 10;

              return (
                <div key={msg.id} style={{ marginTop: gapTop }}>
                  {/* Timestamp */}
                  {msg.timestamp && (
                    <div
                      className="flex justify-center"
                      style={{ padding: "8px 48px 4px" }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          lineHeight: "1.3em",
                          color: "rgba(0,0,0,0.48)",
                          letterSpacing: "0.013em",
                          textAlign: "center",
                        }}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  <MessageBubble
                    message={msg}
                    position={pos}
                    showAvatar={showAvatar}
                    contactAvatar={contact.avatar}
                    onLongPress={handleLongPress}
                  />

                  {/* Seen indicator */}
                  {msg.isSeen && (
                    <div
                      className="flex justify-end"
                      style={{ paddingRight: 12, paddingTop: 4 }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          lineHeight: "1.3em",
                          color: "rgba(0,0,0,0.48)",
                        }}
                      >
                        Seen
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Area — column: input bar + optional emoji panel */}
        <ChatInputBar
          ref={inputBarRef}
          onSend={handleSend}
          isEmojiPanelOpen={showEmojiPanel}
          onToggleEmojiPanel={handleToggleEmojiPanel}
        />

        {/* Emoji & Sticker Panel — slides up below input bar */}
        <AnimatePresence>
          {showEmojiPanel && (
            <EmojiStickerPanel
              key="emoji-panel"
              onSelectEmoji={handleEmojiSelect}
            />
          )}
        </AnimatePresence>

        {/* ── Reaction picker overlay ── */}
        <AnimatePresence>
          {picker && pickerMsg && (
            <ReactionPicker
              key="reaction-picker"
              message={pickerMsg}
              position={pickerPos}
              designHeight={layout.designHeight}
              onSelectReaction={handleReaction}
              onClose={() => setPicker(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
