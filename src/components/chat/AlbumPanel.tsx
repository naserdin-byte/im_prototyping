"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

type AlbumTab = "all" | "videos" | "photos";

interface AlbumPanelProps {
  onSendPhotos: (photoSrcs: string[]) => void;
  onClose: () => void;
}

const springPanel = { type: "spring" as const, stiffness: 600, damping: 32 };

/** All gallery photos from Figma */
const GALLERY_PHOTOS = Array.from({ length: 15 }, (_, i) => ({
  id: `photo-${i + 1}`,
  src: `/images/gallery/photo-${String(i + 1).padStart(2, "0")}.png`,
}));

export function AlbumPanel({ onSendPhotos, onClose }: AlbumPanelProps) {
  const [activeTab, setActiveTab] = useState<AlbumTab>("all");
  /** Ordered list of selected photo IDs (order = selection order for numbering) */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = useCallback((photoId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      }
      if (prev.length >= 9) return prev; // TikTok limit
      return [...prev, photoId];
    });
  }, []);

  const handleSend = useCallback(() => {
    const srcs = selectedIds
      .map((id) => GALLERY_PHOTOS.find((p) => p.id === id)?.src)
      .filter(Boolean) as string[];
    if (srcs.length > 0) {
      onSendPhotos(srcs);
    }
  }, [selectedIds, onSendPhotos]);

  const tabs: { key: AlbumTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "videos", label: "Videos" },
    { key: "photos", label: "Photos" },
  ];

  return (
    <>
      {/* ── Dark backdrop overlay ── */}
      <motion.div
        initial={{ backgroundColor: "rgba(0,0,0,0)" }}
        animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        exit={{ backgroundColor: "rgba(0,0,0,0)" }}
        transition={{ duration: 0.15 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
        }}
        onClick={onClose}
      />

      {/* ── Album bottom sheet ── */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={springPanel}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 390,
          height: 639,
          background: "#FFFFFF",
          borderRadius: "12px 12px 0 0",
          zIndex: 11,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Grabber */}
        <div style={{ width: 390, height: 14, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icons/icon-grabber.svg"
            alt=""
            style={{ width: 390, height: 14 }}
            draggable={false}
          />
        </div>

        {/* Navigation Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: "4px 6px",
            flexShrink: 0,
          }}
        >
          {/* Title Container pill */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              padding: "0 12px 0 16px",
              height: 36,
              background: "rgba(0,0,0,0.05)",
              borderRadius: 999,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                lineHeight: "1.3em",
                color: "#000",
              }}
            >
              Recents
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icons/icon-chevron-down-fill.svg"
              alt=""
              style={{ width: 16, height: 16 }}
              draggable={false}
            />
          </div>
        </div>

        {/* Tab Bar — 390×40 */}
        <div
          style={{
            width: 390,
            height: 40,
            flexShrink: 0,
            position: "relative",
          }}
        >
          {/* Tabs row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 24,
              padding: "0 16px",
              width: 390,
              height: 40,
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 15,
                      lineHeight: "1.3em",
                      letterSpacing: "0.004em",
                      color: isActive ? "#000" : "rgba(0,0,0,0.48)",
                    }}
                  >
                    {tab.label}
                  </span>
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "#000",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {/* Separator line at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 0.5,
              background: "rgba(0,0,0,0.12)",
            }}
          />
        </div>

        {/* Photo Grid — fills remaining height, scrollable */}
        <div
          className="scrollbar-ios"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {/* Render rows of 3 */}
            {Array.from(
              { length: Math.ceil(GALLERY_PHOTOS.length / 3) },
              (_, rowIdx) => {
                const rowPhotos = GALLERY_PHOTOS.slice(
                  rowIdx * 3,
                  rowIdx * 3 + 3
                );
                return (
                  <div
                    key={rowIdx}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1.5,
                      width: 390,
                    }}
                  >
                    {rowPhotos.map((photo) => {
                      const selIndex = selectedIds.indexOf(photo.id);
                      const isSelected = selIndex >= 0;
                      // Each tile: fill width (≈129px), 129px height
                      const tileWidth = (390 - 1.5 * 2) / 3; // ~129px
                      return (
                        <button
                          key={photo.id}
                          onClick={() => toggleSelect(photo.id)}
                          style={{
                            position: "relative",
                            width: tileWidth,
                            height: 129,
                            padding: 0,
                            border: "none",
                            background: "#E0E0E0",
                            cursor: "pointer",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {/* Photo */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.src}
                            alt=""
                            draggable={false}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />

                          {/* Selected overlay */}
                          {isSelected && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(22, 24, 35, 0.3)",
                              }}
                            />
                          )}

                          {/* Checkbox — top right corner */}
                          <div
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              width: 24,
                              height: 24,
                            }}
                          >
                            {isSelected ? (
                              /* Selected: red circle with number */
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 20,
                                  background: "#FE2C55",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    lineHeight: "1.3em",
                                    letterSpacing: "0.007em",
                                    color: "#FFFFFF",
                                  }}
                                >
                                  {selIndex + 1}
                                </span>
                              </div>
                            ) : (
                              /* Unselected: semi-transparent circle with white border */
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 12,
                                  background: "rgba(0,0,0,0.25)",
                                  border: "1.5px solid #FFFFFF",
                                  boxSizing: "border-box",
                                }}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Send button — Figma: 350×52, absolute at (20, 567) → 20px from left, 20px from bottom */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.button
              key="send-btn"
              onClick={handleSend}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 700, damping: 35 }}
              style={{
                position: "absolute",
                left: 20,
                bottom: 20,
                width: 350,
                height: 52,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: 999,
                background: "#FE2C55",
                border: "none",
                cursor: "pointer",
                zIndex: 12,
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: "1.3em",
                  color: "#FFFFFF",
                }}
              >
                Send ({selectedIds.length})
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
