"use client";

import { useState } from "react";
import { motion } from "motion/react";

type PanelTab = "favourite" | "emoji" | "stickers";

interface EmojiStickerPanelProps {
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker?: (stickerSrc: string) => void;
}

const springPanel = { type: "spring" as const, stiffness: 600, damping: 32 };

/**
 * Tab bar items — individual icons from Figma.
 * Each item maps to an optional panel tab.
 * SVG icons render at 24×24 inside a 36×36 button (6px padding).
 * PNG thumbnails render at 30×30 inside a 36×36 button (3px padding).
 */
const TAB_BAR_ITEMS: Array<{
  id: string;
  icon: string;
  tab?: PanelTab;
  isImage?: boolean; // true for PNG sticker thumbnails
}> = [
  { id: "search", icon: "/images/icons/icon-tab-search.svg" },
  { id: "favourite", icon: "/images/icons/icon-tab-star.svg", tab: "favourite" },
  { id: "emoji", icon: "/images/icons/icon-tab-emoji.svg", tab: "emoji" },
  {
    id: "sticker1",
    icon: "/images/icons/icon-tab-sticker1.png",
    tab: "stickers",
    isImage: true,
  },
  {
    id: "sticker2",
    icon: "/images/icons/icon-tab-sticker2.png",
    isImage: true,
  },
  {
    id: "sticker3",
    icon: "/images/icons/icon-tab-sticker3.png",
    isImage: true,
  },
];

// ── Emoji data from Figma ──
const RECENT_EMOJIS = ["😃", "😄", "😁", "😆", "😅"];
const ALL_EMOJIS = [
  "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "☺️",
  "😊", "😇", "🙂", "🙃", "😉", "😌", "🥰", "😋",
  "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎",
  "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕",
  "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢",
  "😭", "😤", "😠", "😡", "🤯", "😳", "🥵", "🥶",
  "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "😤",
];

// ── Sticker data — individual images exported from Figma ──
const RECENT_STICKERS = [
  "/images/stickers/sticker-r0.png",
  "/images/stickers/sticker-r1.png",
  "/images/stickers/sticker-r2.png",
];

const FAVOURITE_STICKERS = [
  "/images/stickers/sticker-f0.png",
  "/images/stickers/sticker-f1.png",
  "/images/stickers/sticker-f2.png",
  "/images/stickers/sticker-f3.png",
  "/images/stickers/sticker-f4.png",
  "/images/stickers/sticker-f5.png",
  "/images/stickers/sticker-f6.png",
];

const STICKER_SET_ROWS = [
  [
    "/images/stickers/sticker-s1-0.png",
    "/images/stickers/sticker-s1-1.png",
    "/images/stickers/sticker-s1-2.png",
    "/images/stickers/sticker-s1-3.png",
  ],
  [
    "/images/stickers/sticker-s2-0.png",
    "/images/stickers/sticker-s2-1.png",
    "/images/stickers/sticker-s2-2.png",
    "/images/stickers/sticker-s2-3.png",
  ],
  [
    "/images/stickers/sticker-s3-0.png",
    "/images/stickers/sticker-s3-1.png",
    "/images/stickers/sticker-s3-2.png",
    "/images/stickers/sticker-s3-3.png",
  ],
];

export function EmojiStickerPanel({ onSelectEmoji, onSelectSticker }: EmojiStickerPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>("emoji");

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 384, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={springPanel}
      style={{
        width: 390,
        overflow: "hidden",
        background: "#F5F5F5",
        flexShrink: 0,
      }}
    >
      <div
        className="flex flex-col"
        style={{ width: 390, height: 384, gap: 8 }}
      >
        {/* ── Tab Bar — real buttons with individual icons ── */}
        <div
          className="flex shrink-0 items-center"
          style={{ height: 52, padding: "8px 12px", gap: 20 }}
        >
          {TAB_BAR_ITEMS.map((item) => {
            const isActive = item.tab != null && item.tab === activeTab;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.tab) setActiveTab(item.tab);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: isActive ? "rgba(0,0,0,0.05)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: item.isImage ? 3 : 6,
                  cursor: item.tab ? "pointer" : "default",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt={item.id}
                  style={{
                    width: item.isImage ? 30 : 24,
                    height: item.isImage ? 30 : 24,
                    borderRadius: item.isImage ? 6 : 0,
                    objectFit: "cover",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* ── Content Area ── */}
        <div
          className="flex flex-1 flex-col"
          style={{
            background: "#FFFFFF",
            borderRadius: "12px 12px 0 0",
            gap: 12,
            overflow: "hidden",
          }}
        >
          {/* Grabber handle */}
          <div
            className="flex shrink-0 justify-center"
            style={{ paddingTop: 7, paddingBottom: 3 }}
          >
            <div
              style={{
                width: 32,
                height: 0,
                borderTop: "4px solid rgba(0,0,0,0.17)",
                borderRadius: 2,
              }}
            />
          </div>

          {/* Tab content — scrollable */}
          <div
            className="scrollbar-ios flex-1 overflow-y-auto"
            style={{ padding: "0 16px", minHeight: 0 }}
          >
            {activeTab === "emoji" && (
              <EmojiTabContent onSelectEmoji={onSelectEmoji} />
            )}
            {activeTab === "favourite" && (
              <FavouriteTabContent onSelectSticker={onSelectSticker} />
            )}
            {activeTab === "stickers" && (
              <StickerSetsTabContent onSelectSticker={onSelectSticker} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Emoji Tab ──
function EmojiTabContent({
  onSelectEmoji,
}: {
  onSelectEmoji: (emoji: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      {/* Recent used */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        <SectionLabel>Recent used</SectionLabel>
        <div className="flex" style={{ gap: 20 }}>
          {RECENT_EMOJIS.map((emoji, i) => (
            <button
              key={`recent-${i}`}
              onClick={() => onSelectEmoji(emoji)}
              className="flex items-center justify-center"
              style={{ width: 28, height: 50, fontSize: 28 }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* All Emojis */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        <SectionLabel>All Emojis</SectionLabel>
        <div className="flex flex-col" style={{ gap: 0 }}>
          {Array.from(
            { length: Math.ceil(ALL_EMOJIS.length / 8) },
            (_, rowIdx) => {
              const rowEmojis = ALL_EMOJIS.slice(rowIdx * 8, rowIdx * 8 + 8);
              return (
                <div
                  key={rowIdx}
                  className="flex justify-center"
                  style={{ gap: 20 }}
                >
                  {rowEmojis.map((emoji, i) => (
                    <button
                      key={`all-${rowIdx}-${i}`}
                      onClick={() => onSelectEmoji(emoji)}
                      className="flex items-center justify-center"
                      style={{ width: 28, height: 50, fontSize: 28 }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sticker Grid — 4-column layout matching Figma (space-between, 72×72 items) ──
function StickerGrid({
  stickers,
  onSelect,
  leadingElement,
}: {
  stickers: string[];
  onSelect?: (src: string) => void;
  /** Optional element inserted before the first sticker (e.g. "Add" button) */
  leadingElement?: React.ReactNode;
}) {
  // Build a flat list: optional leading element + sticker items
  const items: React.ReactNode[] = [];
  if (leadingElement) items.push(leadingElement);
  stickers.forEach((src, i) => {
    items.push(
      <button
        key={`${src}-${i}`}
        onClick={() => onSelect?.(src)}
        className="flex items-center justify-center"
        style={{ width: 72, height: 72, flexShrink: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Sticker ${i + 1}`}
          style={{ width: 72, height: 72, objectFit: "contain" }}
          draggable={false}
        />
      </button>,
    );
  });

  // Split into rows of 4
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += 4) {
    rows.push(items.slice(i, i + 4));
  }

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex"
          style={{
            gap: 0,
            justifyContent: row.length === 4 ? "space-between" : "flex-start",
          }}
        >
          {row.map((node, i) => (
            <div
              key={i}
              style={{ marginRight: row.length < 4 && i < row.length - 1 ? 24 : 0 }}
            >
              {node}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Favourite Tab ──
function FavouriteTabContent({
  onSelectSticker,
}: {
  onSelectSticker?: (src: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      {/* Recent used stickers */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        <SectionLabel>Recent used</SectionLabel>
        <StickerGrid stickers={RECENT_STICKERS} onSelect={onSelectSticker} />
      </div>

      {/* Favourites stickers — with leading "Add" button per Figma */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        <SectionLabel>Favourites</SectionLabel>
        <StickerGrid
          stickers={FAVOURITE_STICKERS}
          onSelect={onSelectSticker}
          leadingElement={
            <button
              className="flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                background: "rgba(0,0,0,0.05)",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icons/icon-plus.png"
                alt="Add"
                style={{ width: 28, height: 28, opacity: 0.48 }}
              />
            </button>
          }
        />
      </div>
    </div>
  );
}

// ── Sticker Sets Tab ──
function StickerSetsTabContent({
  onSelectSticker,
}: {
  onSelectSticker?: (src: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <div className="flex flex-col" style={{ gap: 12 }}>
        <SectionLabel>Sticker name</SectionLabel>
        <div className="flex flex-col" style={{ gap: 24 }}>
          {STICKER_SET_ROWS.map((row, rowIdx) => (
            <StickerGrid
              key={rowIdx}
              stickers={row}
              onSelect={onSelectSticker}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Shared section label ──
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 14,
        lineHeight: "1.3em",
        color: "rgba(0,0,0,0.48)",
        fontWeight: 400,
      }}
    >
      {children}
    </span>
  );
}
