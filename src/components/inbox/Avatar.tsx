interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  hasStoryRing?: boolean;
  storyRead?: boolean;
  isOnline?: boolean;
}

export function Avatar({
  src,
  alt,
  size = 56,
  hasStoryRing = false,
  storyRead = false,
  isOnline = false,
}: AvatarProps) {
  if (hasStoryRing) {
    // Figma: 64x64 outer, two rings visible:
    //   Ring 1: gradient (blue→cyan→green), ~3.5px
    //   Ring 2: white gap, ~2.5px
    //   Avatar: 52px
    return (
      <div
        className="relative flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: 64,
          height: 64,
          background: storyRead
            ? "rgba(0,0,0,0.12)"
            : "linear-gradient(135deg, rgba(0,148,255,1) 15%, rgba(32,213,236,1) 50%, rgba(0,255,163,1) 85%)",
          padding: "3.5px",
        }}
      >
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-white"
          style={{ padding: "2.5px" }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{ boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {isOnline && (
        <div className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full border-[2px] border-white bg-[#2AD566]" />
      )}
    </div>
  );
}
