"use client";

import Link from "next/link";
import { BRAND, NAV } from "@/data/site";
import { useLang } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";

/** Transparent top bar that sits over each page's first section. */
export function Header() {
  const { lang } = useLang();
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.35em] text-ink-red uppercase sm:text-base"
          aria-label={`${BRAND.name}, ${NAV.home[lang]}`}
        >
          {BRAND.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/about"
            className="rounded-full px-2 py-2 text-sm tracking-wide text-ink-red underline-offset-4 hover:underline"
          >
            {NAV.about[lang]}
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
