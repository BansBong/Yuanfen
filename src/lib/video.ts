/** Turns a public TikTok, Instagram or YouTube link into an official embed address. Returns null when the link can't be embedded. */
export type Platform = "tiktok" | "instagram" | "youtube";
export type ParsedVideo = { platform: Platform; embedUrl: string; ratio: string };

export function parseVideo(url: string): ParsedVideo | null {
  const tiktok = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (tiktok) return { platform: "tiktok", embedUrl: `https://www.tiktok.com/embed/v2/${tiktok[1]}`, ratio: "325 / 740" };

  const insta = url.match(/instagram\.com\/(?:[^/]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  if (insta) {
    const kind = insta[1] === "reels" ? "reel" : insta[1];
    return { platform: "instagram", embedUrl: `https://www.instagram.com/${kind}/${insta[2]}/embed`, ratio: "9 / 17" };
  }

  const short = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (short) return { platform: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${short[1]}`, ratio: "9 / 16" };
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/);
  if (yt) return { platform: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}`, ratio: "16 / 9" };

  return null;
}

export const PLATFORM_NAME: Record<Platform, string> = { tiktok: "TikTok", instagram: "Instagram", youtube: "YouTube" };
