"use client";

import { useState, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

export interface ChatInputBarHandle {
  insertText: (text: string) => void;
}

interface ChatInputBarProps {
  onSend: (text: string) => void;
  isEmojiPanelOpen?: boolean;
  onToggleEmojiPanel?: () => void;
}

export const ChatInputBar = forwardRef<ChatInputBarHandle, ChatInputBarProps>(
  function ChatInputBar({ onSend, isEmojiPanelOpen, onToggleEmojiPanel }, ref) {
    const [text, setText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const hasText = text.trim().length > 0;
    const showActionBar = !hasText && !isEmojiPanelOpen;

    useImperativeHandle(ref, () => ({
      insertText: (t: string) => {
        setText((prev) => prev + t);
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }
        });
      },
    }));

    const handleSend = useCallback(() => {
      const trimmed = text.trim();
      if (!trimmed) return;
      onSend(trimmed);
      setText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }, [text, onSend]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };

    const cameraIcon = hasText
      ? "/images/icons/icon-camera-typing.svg"
      : "/images/icons/icon-camera-smile.svg";

    const pillPadding = hasText ? "2px 4px" : "2px 12px 2px 4px";

    return (
      <div className="shrink-0" style={{ background: "#F5F5F5" }}>
        {showActionBar && (
          <div className="scrollbar-ios flex gap-2 overflow-x-auto" style={{ padding: "12px 0 0 12px" }}>
            {actionBarItems.map((item) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={item.name} src={item.icon} alt={item.name} className="shrink-0" style={{ width: item.w1x, height: 32 }} />
            ))}
            <div className="shrink-0" style={{ width: 12 }} />
          </div>
        )}

        <div style={{ padding: "8px 12px" }}>
          <div
            className="flex items-center"
            style={{ borderRadius: 22, background: "#FFFFFF", padding: pillPadding }}
          >
            {/* Camera */}
            <button
              className="shrink-0 self-stretch"
              style={{ display: "flex", alignItems: "flex-end", padding: "2px 0" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cameraIcon} alt="Camera" style={{ width: 36, height: 36 }} />
            </button>

            {/* Textarea */}
            <div className="min-w-0 flex-1" style={{ padding: "0 12px 0 8px" }}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (isEmojiPanelOpen) onToggleEmojiPanel?.(); }}
                placeholder="Message..."
                rows={1}
                className="w-full resize-none border-none bg-transparent outline-none"
                style={{ fontSize: 17, lineHeight: "1.3em", color: "#000", caretColor: "#00C8F8", overflow: "hidden", display: "block" }}
              />
            </div>

            {/* CTA */}
            {hasText ? (
              <div
                className="shrink-0 self-stretch"
                style={{ display: "flex", alignItems: "flex-end", padding: "2px 0" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={onToggleEmojiPanel}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/icons/icon-cta-emoji.svg" alt="Sticker" style={{ width: 26, height: 26 }} />
                  </button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={handleSend}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/icons/icon-send-button.png" alt="Send" style={{ width: 36, height: 36 }} />
                  </button>
                </div>
              </div>
            ) : isEmojiPanelOpen ? (
              <div className="flex shrink-0 items-center" style={{ gap: 14 }}>
                <button onClick={() => { onToggleEmojiPanel?.(); requestAnimationFrame(() => textareaRef.current?.focus()); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icons/icon-cta-keyboard.svg" alt="Keyboard" style={{ width: 26, height: 26 }} />
                </button>
                <button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icons/icon-cta-image.svg" alt="Image" style={{ width: 26, height: 26 }} />
                </button>
              </div>
            ) : (
              <div className="flex shrink-0 items-center" style={{ gap: 14 }}>
                <button onClick={onToggleEmojiPanel}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icons/icon-cta-emoji.svg" alt="Emoji" style={{ width: 26, height: 26 }} />
                </button>
                <button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icons/icon-cta-sticker.svg" alt="Image" style={{ width: 26, height: 26 }} />
                </button>
                <button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icons/icon-cta-mic.svg" alt="Mic" style={{ width: 26, height: 26 }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

const actionBarItems = [
  { name: "heart", icon: "/images/icons/action-heart.png", w1x: 52 },
  { name: "lol", icon: "/images/icons/action-lol.png", w1x: 52 },
  { name: "thumbsup", icon: "/images/icons/action-thumbsup.png", w1x: 52 },
  { name: "games", icon: "/images/icons/action-games.png", w1x: 93 },
  { name: "groupshot", icon: "/images/icons/action-groupshot.png", w1x: 122 },
  { name: "sharepost", icon: "/images/icons/action-sharepost.png", w1x: 118 },
];
