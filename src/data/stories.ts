import type { Locale } from "@/i18n/routing";

/**
 * Real-world stories shown on /stories: videos (public TikTok, Instagram Reel or YouTube links) and photos.
 * Leave empty until real content exists; the page then shows its "Coming soon" state and stays out of search.
 *
 * Video:  { id: "guangzhou-market", kind: "video", url: "https://www.tiktok.com/@yuanfen.bridge/video/123…", service: "jastip",
 *           title: { en: "…", id: "…" }, caption: { en: "…", id: "…" } }
 * Photo:  { id: "canton-tower", kind: "photo", src: "/stories/canton-tower.jpg", width: 1200, height: 1500, service: "tour",
 *           title: { en: "…", id: "…" } }       (put the file in public/stories/)
 * Short links (vm.tiktok.com, instagr.am) can't be embedded: use the full address from the browser.
 */
export type StoryService = "tour" | "jastip" | "medical" | "admission";
type Text = Record<Locale, string>;

export type Story = { id: string; service: StoryService; title: Text; caption?: Text } & (
  | { kind: "video"; url: string }
  | { kind: "photo"; src: string; width: number; height: number }
);

export const STORIES: Story[] = [];
