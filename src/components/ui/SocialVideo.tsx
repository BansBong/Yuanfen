"use client";

import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import type { ParsedVideo } from "@/lib/video";

/**
 * Official TikTok / Instagram / YouTube player, loaded only after a tap: the page stays fast and the platform
 * sets no cookies until the visitor chooses to watch. Falls back to a plain link when the address can't be embedded.
 */
export function SocialVideo({
  video,
  watchUrl,
  platformName,
  title,
  playLabel,
  openLabel,
}: {
  video: ParsedVideo | null;
  watchUrl: string;
  platformName: string;
  title: string;
  playLabel: string;
  openLabel: string;
}) {
  const [playing, setPlaying] = useState(false);
  const ratio = video?.ratio ?? "9 / 16";

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-[#35070a]" style={{ aspectRatio: ratio }}>
        {video && playing ? (
          <iframe
            src={video.embedUrl}
            title={title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <div className="tone-dark bg-deep absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] text-crimson uppercase">{platformName}</p>
              {video ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={`${playLabel}: ${title}`}
                  className="mx-auto mt-4 grid size-16 place-items-center rounded-full bg-crimson text-cream shadow-lg transition-transform hover:scale-105"
                >
                  <Play aria-hidden="true" className="size-7 translate-x-0.5 fill-current" />
                </button>
              ) : null}
              <p className="mt-4 font-display text-lg leading-snug text-ink-red">{title}</p>
            </div>
          </div>
        )}
      </div>
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex min-h-11 items-center gap-2 text-base font-medium text-ink-red underline-offset-4 hover:underline"
      >
        {openLabel} {platformName}
        <ExternalLink aria-hidden="true" className="size-4" />
      </a>
    </div>
  );
}
