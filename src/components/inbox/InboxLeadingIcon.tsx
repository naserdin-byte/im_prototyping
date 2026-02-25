import { NotificationVariant } from "@/types/inbox";

interface InboxLeadingIconProps {
  variant: NotificationVariant;
}

const iconConfig: Record<NotificationVariant, { bg: string; icon: string }> = {
  followers: { bg: "#00ABF4", icon: "/images/icon-followers.svg" },
  activity: { bg: "#FF3B76", icon: "/images/icon-bell.svg" },
  system: { bg: "#32364B", icon: "/images/icon-system.svg" },
};

export function InboxLeadingIcon({ variant }: InboxLeadingIconProps) {
  const config = iconConfig[variant];

  return (
    <div
      className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: config.bg }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.icon}
        alt={variant}
        className="h-[28px] w-[28px] brightness-0 invert"
      />
    </div>
  );
}
