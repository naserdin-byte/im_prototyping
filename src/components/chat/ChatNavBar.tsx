import { ChatContact } from "@/types/chat";

export interface ChatNavBarProps {
  contact: ChatContact;
  onBack?: () => void;
}

export function ChatNavBar({ contact, onBack }: ChatNavBarProps) {
  return (
    <div
      className="relative shrink-0"
      style={{
        height: 56,
        background: "#F5F5F5",
        borderBottom: "0.5px solid rgba(0,0,0,0.12)",
      }}
    >
      {/* Left: Back + Avatar */}
      <div className="absolute left-0 top-0 flex h-full items-center">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center justify-center"
          style={{ width: 52, height: 56 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icons/icon-chevron-left.svg"
            alt="Back"
            width={24}
            height={24}
          />
        </button>

        {/* Avatar with online dot */}
        <div className="relative" style={{ width: 40, height: 40 }}>
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
          {/* Online dot */}
          {contact.isActive && (
            <div
              className="absolute"
              style={{
                width: 12,
                height: 12,
                right: -1,
                bottom: -1,
                borderRadius: "50%",
                background: "#1DD765",
                border: "2.5px solid #F8F8F8",
              }}
            />
          )}
        </div>
      </div>

      {/* Center: Name + streak + subtitle */}
      <div
        className="absolute flex flex-col justify-center"
        style={{ left: 100, top: 9, width: 198 }}
      >
        <div className="flex items-center gap-1">
          <span
            className="font-bold text-black"
            style={{ fontSize: 17, lineHeight: "1.3em" }}
          >
            {contact.name}
          </span>
          {contact.streakCount != null && (
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icons/icon-streak-flame.png"
                alt="Streak"
                width={16}
                height={16}
              />
              <span
                className="font-medium"
                style={{
                  fontSize: 15,
                  lineHeight: "1.3em",
                  color: "#FF6613",
                }}
              >
                {contact.streakCount}
              </span>
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 12,
            lineHeight: "1.3em",
            color: "rgba(0,0,0,0.48)",
            letterSpacing: "0.013em",
          }}
        >
          Active now
        </span>
      </div>

      {/* Right: Flag + Ellipsis */}
      <div
        className="absolute right-0 top-0 flex h-full items-center gap-4"
        style={{ paddingRight: 16 }}
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
  );
}
