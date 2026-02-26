"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { REACTION_EMOJIS, ReactionEmoji, ChatMessage, BubblePosition } from "@/types/chat";

interface ReactionPickerProps {
  /** The message being reacted to */
  message: ChatMessage;
  /** Bubble position for border-radius */
  position: BubblePosition;
  /** Full design height of the scaled viewport */
  designHeight: number;

  onSelectReaction: (emoji: ReactionEmoji) => void;
  onClose: () => void;
}

/** Context-menu items shown below the message */
const MENU_ITEMS: {
  label: string;
  icon: string;
  destructive?: boolean;
}[] = [
  { label: "Reply", icon: "/images/icons/icon-menu-reply.svg" },
  { label: "Forward", icon: "/images/icons/icon-menu-forward.svg" },
  { label: "Copy", icon: "/images/icons/icon-menu-copy.svg" },
  { label: "Delete for me", icon: "/images/icons/icon-menu-delete.svg", destructive: true },
  { label: "Report", icon: "/images/icons/icon-menu-report.svg", destructive: true },
];

/* ── Bubble border-radius helpers (same as MessageBubble) ── */
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

/** Shared spring presets — fast & snappy */
const springPop = { type: "spring" as const, stiffness: 700, damping: 35 };
const springGentle = { type: "spring" as const, stiffness: 600, damping: 32 };

export function ReactionPicker({
  message,
  position,
  designHeight,
  onSelectReaction,
  onClose,
}: ReactionPickerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isMe = message.sender === "me";

  // Close on tap on the dark backdrop only (not on child elements)
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    /* ── Backdrop ── */
    <motion.div
      ref={overlayRef}
      className="absolute inset-0 flex flex-col items-center"
      style={{
        zIndex: 100,
        justifyContent: "center",
        padding: "40px 24px",
        gap: 8,
      }}
      initial={{ backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.15 }}
      onClick={handleOverlayClick}
    >
      {/* ── Emoji picker panel ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -12 }}
        transition={springPop}
        style={{
          borderRadius: 24,
          background: "#FFFFFF",
          boxShadow: "0px 4px 24px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Segmented control: 😍 | AI-moji */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px 0",
            gap: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              background: "rgba(0,0,0,0.06)",
              padding: 2,
            }}
          >
            {/* Selected tab */}
            <div
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                background: "#FFFFFF",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
                fontSize: 14,
                fontWeight: 700,
                lineHeight: "1.3em",
                cursor: "pointer",
              }}
            >
              😍
            </div>
            {/* Unselected tab */}
            <div
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "1.3em",
                color: "rgba(0,0,0,0.5)",
                cursor: "pointer",
              }}
            >
              AI-moji
            </div>
          </div>
        </div>

        {/* Emoji row — staggered entrance */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 16px 10px",
          }}
        >
          {REACTION_EMOJIS.map((emoji, idx) => (
            <motion.button
              key={emoji}
              initial={{ opacity: 0, scale: 0, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                ...springPop,
                delay: 0.02 * idx,
              }}
              whileTap={{ scale: 1.35 }}
              onClick={() => onSelectReaction(emoji)}
              style={{
                width: 32,
                height: 32,
                fontSize: 26,
                lineHeight: "32px",
                textAlign: "center",
                border: "none",
                background:
                  message.reaction === emoji
                    ? "rgba(0,0,0,0.1)"
                    : "transparent",
                borderRadius: 8,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Message bubble clone ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={springGentle}
        style={{
          alignSelf: isMe ? "flex-end" : "flex-start",
          maxWidth: 260,
          padding: "10px 14px",
          borderRadius: isMe
            ? getSenderRadius(position)
            : getReceiverRadius(position),
          background: isMe ? "#00C8F8" : "#FFFFFF",
          color: isMe ? "#FFFFFF" : "#000000",
          fontSize: 16,
          lineHeight: "1.35em",
          wordBreak: "break-word",
          boxShadow: "0px 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        {message.text}
      </motion.div>

      {/* ── Context menu ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ ...springGentle, delay: 0.02 }}
        style={{
          alignSelf: isMe ? "flex-end" : "flex-start",
          width: 200,
          borderRadius: 12,
          background: "#FFFFFF",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          transformOrigin: isMe ? "top right" : "top left",
        }}
      >
        {MENU_ITEMS.map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg"
            style={{
              padding: 14,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {/* Icon — 20×20 */}
            <div
              style={{
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.icon}
                alt=""
                style={{
                  width: 20,
                  height: 20,
                  filter: item.destructive
                    ? "brightness(0) saturate(100%) invert(37%) sepia(90%) saturate(1700%) hue-rotate(345deg) brightness(97%) contrast(102%)"
                    : "none",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 16,
                lineHeight: "1.3em",
                fontWeight: item.destructive ? 500 : 600,
                color: item.destructive ? "#FF4C3A" : "#000000",
              }}
            >
              {item.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
