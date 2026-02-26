"use client";

import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, BubblePosition } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  position: BubblePosition;
  showAvatar: boolean;
  contactAvatar: string;
  /** Called when the user long-presses the bubble */
  onLongPress?: (msgId: string) => void;
}

/**
 * Border radii from Figma design spec:
 * - Sender tail corner = bottom-right (BR), Receiver tail corner = bottom-left (BL)
 * - Tail corner = 0px on single/bottom (last in group)
 * - Continuation corner = 8px (connecting to adjacent same-sender bubble)
 * CSS order: top-left  top-right  bottom-right  bottom-left
 */
function getSenderRadius(pos: BubblePosition): string {
  switch (pos) {
    case "single": return "20px 20px 0px 20px";
    case "top":    return "20px 20px 8px 20px";
    case "middle": return "20px 8px 8px 20px";
    case "bottom": return "20px 8px 0px 20px";
  }
}

function getReceiverRadius(pos: BubblePosition): string {
  switch (pos) {
    case "single": return "20px 20px 20px 0px";
    case "top":    return "20px 20px 20px 8px";
    case "middle": return "8px 20px 20px 8px";
    case "bottom": return "8px 20px 20px 0px";
  }
}

const LONG_PRESS_MS = 500;

export function MessageBubble({
  message,
  position,
  showAvatar,
  contactAvatar,
  onLongPress,
}: MessageBubbleProps) {
  const isMe = message.sender === "me";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const movedRef = useRef(false);

  const startPress = useCallback(() => {
    movedRef.current = false;
    timerRef.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress(message.id);
      }
    }, LONG_PRESS_MS);
  }, [message.id, onLongPress]);

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMove = useCallback(() => {
    movedRef.current = true;
    cancelPress();
  }, [cancelPress]);

  // Prevent native context menu on long press (mobile)
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Also trigger long-press for desktop right-click
      if (onLongPress) {
        onLongPress(message.id);
      }
    },
    [message.id, onLongPress],
  );

  return (
    <div
      className={`flex w-full ${isMe ? "justify-end" : ""}`}
      style={{
        paddingLeft: isMe ? 0 : 12,
        paddingRight: isMe ? 12 : 0,
      }}
    >
      {/* Receiver avatar area — 30px wide, only shown on last bubble in group */}
      {!isMe && (
        <div className="shrink-0" style={{ width: 30, marginRight: 8 }}>
          {showAvatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={contactAvatar}
              alt=""
              className="rounded-full object-cover"
              style={{ width: 30, height: 30 }}
            />
          )}
        </div>
      )}

      {/* Bubble + reaction column */}
      <div className="flex flex-col" style={{ maxWidth: 260, alignItems: isMe ? "flex-end" : "flex-start" }}>
        {/* Bubble */}
        <div
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
          onTouchMove={handleMove}
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onContextMenu={handleContextMenu}
          style={{
            padding: "10px 14px",
            borderRadius: isMe ? getSenderRadius(position) : getReceiverRadius(position),
            background: isMe ? "#00C8F8" : "#FFFFFF",
            color: isMe ? "#FFFFFF" : "#000000",
            fontSize: 16,
            lineHeight: "1.35em",
            wordBreak: "break-word",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          {message.text}
        </div>

        {/*
          Reaction pill — Figma spec:
          - chat_container gap: -8px → pill overlaps bubble bottom by 8px
          - reaction_container: alignSelf stretch, alignItems flex-end (sender) / flex-start (receiver)
          - sender padding: 0 4px 0 0; receiver padding: 0 0 0 4px
          - Pill: borderRadius 100px, height 28px, padding 0 10px, bg rgba(0,0,0,0.05)
        */}
        <AnimatePresence>
          {message.reaction && (
            <motion.div
              key={message.reaction}
              initial={{ opacity: 0, scale: 0.3, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 6 }}
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              style={{
                marginTop: -8,
                position: "relative",
                zIndex: 1,
                alignSelf: "stretch",
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                paddingRight: isMe ? 4 : 0,
                paddingLeft: isMe ? 0 : 4,
                transformOrigin: isMe ? "right top" : "left top",
              }}
            >
              <div
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 100,
                  background: "rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 16, lineHeight: "18px", textAlign: "center" }}>
                  {message.reaction}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
