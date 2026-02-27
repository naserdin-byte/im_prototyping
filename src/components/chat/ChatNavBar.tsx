import { ChatContact } from "@/types/chat";

export interface ChatNavBarProps {
  contact: ChatContact;
  onBack?: () => void;
}

/**
 * Chat page nav bar — 1:1 mapping of Figma node 1518-530243.
 *
 * Figma structure (layout_RVCS1K):
 *   <row w=390 h=56 alignItems=center>
 *     <back-area  padding="16 12 16 16"  hug × fill>   ← chevron 24×24
 *     <avatar+text  gap=8  fill × fill>
 *       <avatar 40×40>
 *       <text-col  justify-center  fill × hug>
 *         <name-row  gap=4  alignItems=center  hug>
 *           <name H3-Bold 17/1.3 #000>
 *           <streak-row  alignItems=center  hug>
 *             <flame 16×16>
 *             <count H4-Medium 15/1.3 #FF6613>
 *         <subtitle P3-Regular 12/1.3 rgba(0,0,0,0.48)>  ← only when active
 *     <right-area  padding="16 16 16 12"  gap=16  hug × fill>
 *       <flag 24×24>
 *       <ellipsis 24×24>
 */
export function ChatNavBar({ contact, onBack }: ChatNavBarProps) {
  return (
    <div
      className="shrink-0"
      style={{
        height: 56,
        background: "#F5F5F5",
        borderBottom: "0.5px solid rgba(0,0,0,0.12)",
      }}
    >
      {/* Main row — Figma: layout_RVCS1K, row, alignItems center, w=390 */}
      <div className="flex items-center" style={{ width: 390, height: 56 }}>
        {/* ── Back area — Figma: layout_QE6HXJ, padding 16 12 16 16, hug × fill ── */}
        <button
          onClick={onBack}
          className="flex shrink-0 items-center self-stretch"
          style={{ padding: "16px 12px 16px 16px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icons/icon-chevron-left.svg"
            alt="Back"
            width={24}
            height={24}
          />
        </button>

        {/* ── Avatar + Text area — Figma: layout_7KZZDB, row, gap 8, fill × fill ── */}
        <div
          className="flex flex-1 items-center self-stretch"
          style={{ gap: 8 }}
        >
          {/* Avatar 40×40 with optional online dot */}
          <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={contact.avatar}
              alt={contact.name}
              className="rounded-full object-cover"
              style={{ width: 40, height: 40 }}
            />
            {/* Inner stroke */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.05)" }}
            />
            {/* Online dot — Figma: 12×12, #1DD765, 2.5px #F8F8F8 stroke, content-box */}
            {contact.isActive && (
              <div
                className="absolute rounded-full"
                style={{
                  boxSizing: "content-box",
                  width: 12,
                  height: 12,
                  right: -3.5,
                  bottom: -3.5,
                  background: "#1DD765",
                  border: "2.5px solid #F8F8F8",
                }}
              />
            )}
          </div>

          {/* Text column — Figma: layout_IGCP5I, column, justify-center, fill × hug */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            {/* Name row — Figma: layout_961K6V, row, alignItems center, gap 4 */}
            <div className="flex items-center" style={{ gap: 4 }}>
              <span
                className="truncate"
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  lineHeight: "1.3em",
                  color: "#000000",
                }}
              >
                {contact.name}
              </span>
              {/* Streak — Figma: layout_3MFBQU, row, alignItems center */}
              {contact.streakCount != null && (
                <div className="flex shrink-0 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icons/icon-streak-flame.png"
                    alt=""
                    style={{ width: 16, height: 16 }}
                  />
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 15,
                      lineHeight: "1.3em",
                      letterSpacing: "0.004em",
                      color: "#FF6613",
                    }}
                  >
                    {contact.streakCount}
                  </span>
                </div>
              )}
            </div>

            {/* Subtitle — Figma: layout_GV1MEY, P3-Regular, only when active */}
            {contact.isActive && (
              <span
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: "1.3em",
                  letterSpacing: "0.013em",
                  color: "rgba(0,0,0,0.48)",
                }}
              >
                Active now
              </span>
            )}
          </div>
        </div>

        {/* ── Right icons — Figma: layout_WBADLP, padding 16 16 16 12, gap 16, hug × fill ── */}
        <div
          className="flex shrink-0 items-center self-stretch"
          style={{ padding: "16px 16px 16px 12px", gap: 16 }}
        >
          <button className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/icon-flag.svg" alt="Flag" width={24} height={24} />
          </button>
          <button className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/icon-ellipsis.svg" alt="More" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
