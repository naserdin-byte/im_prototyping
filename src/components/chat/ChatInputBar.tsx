"use client";

import { useState, useRef } from "react";

interface ChatInputBarProps {
  onSend: (text: string) => void;
}

export function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hasText = text.trim().length > 0;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0" style={{ background: "#F5F5F5" }}>
      {/* Action Bar — horizontal scrollable emoji / quick-action pills (exported as 3x PNGs from Figma) */}
      <div
        className="scrollbar-ios flex gap-2 overflow-x-auto"
        style={{ padding: "12px 0 0 12px" }}
      >
        {actionBarItems.map((item) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={item.name}
            src={item.icon}
            alt={item.name}
            className="shrink-0"
            style={{ width: item.w1x, height: 32 }}
          />
        ))}
        {/* Right padding spacer */}
        <div className="shrink-0" style={{ width: 12 }} />
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2" style={{ padding: "8px 12px" }}>
        {/* Camera button */}
        <button className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icons/icon-camera-smile.svg"
            alt="Camera"
            style={{ width: 36, height: 36 }}
          />
        </button>

        {/* Text input pill */}
        <div
          className="flex flex-1 items-center"
          style={{
            height: 36,
            borderRadius: 22,
            background: "#FFFFFF",
            padding: "2px 12px 2px 12px",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="flex-1 border-none bg-transparent outline-none"
            style={{
              fontSize: 17,
              lineHeight: "1.3em",
              color: "#000",
              caretColor: "#00C8F8",
            }}
          />
        </div>

        {/* Right side: CTA icons or Send button (Figma: Icon/Paperplane_Fill) */}
        {hasText ? (
          <button onClick={handleSend} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icons/icon-send-button.png"
              alt="Send"
              style={{ width: 36, height: 36 }}
            />
          </button>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/images/icons/icon-input-cta.svg"
            alt=""
            className="shrink-0"
            style={{ width: 106, height: 26 }}
          />
        )}
      </div>
    </div>
  );
}

/** Action bar items — complete pill images exported from Figma at 3x */
const actionBarItems = [
  { name: "heart", icon: "/images/icons/action-heart.png", w1x: 52 },
  { name: "lol", icon: "/images/icons/action-lol.png", w1x: 52 },
  { name: "thumbsup", icon: "/images/icons/action-thumbsup.png", w1x: 52 },
  { name: "games", icon: "/images/icons/action-games.png", w1x: 93 },
  { name: "groupshot", icon: "/images/icons/action-groupshot.png", w1x: 122 },
];
