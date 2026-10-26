import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/app/fonts";
import "@/app/globals.css";

// /login and /admin are for the team only: English UI, never indexed.
export const metadata: Metadata = {
  title: { default: "Yuanfen Admin", template: "%s | Yuanfen Admin" },
  robots: { index: false, follow: false },
  icons: { icon: "/icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh bg-cream text-lg text-maroon">{children}</body>
    </html>
  );
}
