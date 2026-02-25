interface AlertBadgeProps {
  count: number;
}

export function AlertBadge({ count }: AlertBadgeProps) {
  const label = count > 99 ? "99+" : String(count);
  return (
    <div className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#FE2C55] px-1">
      <span className="text-[12px] font-medium leading-[1.3] text-white">
        {label}
      </span>
    </div>
  );
}
