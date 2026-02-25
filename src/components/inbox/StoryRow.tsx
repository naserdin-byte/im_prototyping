"use client";

import Image from "next/image";
import { StoryUser } from "@/types/inbox";

interface StoryRowProps {
  stories: StoryUser[];
  onStoryPress?: (story: StoryUser) => void;
}

export function StoryRow({ stories, onStoryPress }: StoryRowProps) {
  return (
    <div className="border-b border-black/5">
      <div className="flex flex-nowrap gap-2 overflow-x-auto px-3 pb-3 pt-2 scrollbar-hide">
        {stories.map((story, index) => (
          <button
            key={story.id}
            className="flex w-[80px] shrink-0 flex-col items-center"
            onClick={() => onStoryPress?.(story)}
          >
            {/* Bubble */}
            <div className="mb-1 min-h-[38px]">
              {story.bubble ? (
                <div className="relative rounded-xl border border-black/8 bg-white px-2 py-[5px] shadow-sm">
                  <span className="block whitespace-pre-line text-center text-[11px] leading-[14px] text-black">
                    {story.bubble}
                  </span>
                  <div className="absolute -bottom-[4px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rotate-45 border-b border-r border-black/8 bg-white" />
                </div>
              ) : null}
            </div>

            {/* Avatar with ring */}
            <div className="relative h-[72px] w-[72px]">
              {index === 0 ? (
                <div className="relative h-full w-full">
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full p-[2.5px]"
                    style={{
                      background: "linear-gradient(135deg, #20D5EC, #20D5EC)",
                    }}
                  >
                    <div className="h-full w-full rounded-full bg-white p-[2px]">
                      <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-200">
                        <Image
                          src={story.avatar}
                          alt={story.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-[1px] right-[2px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-[2px] border-white bg-[#20D5EC]">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M5.5 2.5V8.5M2.5 5.5H8.5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-full p-[2.5px]"
                  style={{
                    background: story.isRead
                      ? "rgba(0,0,0,0.12)"
                      : "linear-gradient(135deg, #20D5EC, #20D5EC)",
                  }}
                >
                  <div className="h-full w-full rounded-full bg-white p-[2px]">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-200">
                      <Image
                        src={story.avatar}
                        alt={story.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Name */}
            <span className="mt-[3px] w-full truncate text-center text-[11px] leading-[14px] text-black/60">
              {story.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
