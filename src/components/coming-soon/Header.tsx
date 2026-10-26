"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { BRAND } from "@/data/site";
import { LanguageToggle } from "./LanguageToggle";

/** Transparent top bar that sits over each page's first section. */
export function Header() {
  const t = useTranslations("comingSoon");
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.35em] text-ink-red uppercase sm:text-base"
          aria-label={`${BRAND.name}, ${t("home")}`}
        >
          {BRAND.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3 sm:gap-6">
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
