"use client";

import { LogIn, Menu, X } from "lucide-react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/icons";
import { ABOUT_LINKS, PARTNER_LINKS, SERVICE_LINKS, TRIP_LINKS } from "@/data/nav";
import { BRAND } from "@/data/site";
import { Link, usePathname } from "@/i18n/navigation";
import { DropdownMenu, type MenuItem } from "./DropdownMenu";
import { LanguageSwitch } from "./LanguageSwitch";

type NavLink = { key: string; href: string; icon: MenuItem["icon"] };

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const items = (links: readonly NavLink[]): MenuItem[] =>
    links.map((l) => ({ href: l.href, icon: l.icon, label: t(`items.${l.key}`) }));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const mobileSecondary = [TRIP_LINKS[0], TRIP_LINKS[1], ABOUT_LINKS[0], PARTNER_LINKS[0], PARTNER_LINKS[1], ABOUT_LINKS[1]];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-red/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-20">
        <Link
          href="/"
          aria-label={`${BRAND.name}, ${t("home")}`}
          className="font-display text-lg tracking-[0.3em] text-ink-red uppercase sm:text-xl"
        >
          {BRAND.name}
        </Link>

        {/* desktop */}
        <nav aria-label={t("mainNav")} className="hidden items-center gap-1 lg:flex">
          <DropdownMenu label={t("services")} items={items(SERVICE_LINKS)} />
          <DropdownMenu label={t("trips")} items={items(TRIP_LINKS)} />
          <DropdownMenu label={t("partnership")} items={items(PARTNER_LINKS)} />
          <DropdownMenu label={t("about")} items={items(ABOUT_LINKS)} />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/contact" className={buttonClass("primary", "hidden !min-h-11 !px-5 !py-2 lg:inline-flex")}>
            {t("contactButton")}
          </Link>
          <LanguageSwitch />
          <NextLink
            href="/login"
            className="hidden min-h-11 items-center gap-1.5 rounded-full px-3 text-base text-ink-red/80 hover:bg-ink-red/10 hover:text-ink-red lg:inline-flex"
          >
            <LogIn aria-hidden="true" className="size-5" />
            {t("login")}
          </NextLink>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink-red/60 px-4 text-base font-semibold text-ink-red lg:hidden"
          >
            <Menu aria-hidden="true" className="size-5" />
            {t("menu")}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-cream lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink-red/10 px-4">
            <span className="font-display text-lg tracking-[0.3em] text-ink-red uppercase">{BRAND.name}</span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink-red/60 px-4 text-base font-semibold text-ink-red"
            >
              <X aria-hidden="true" className="size-5" />
              {t("close")}
            </button>
          </div>

          <nav aria-label={t("mainNav")} className="flex flex-1 flex-col gap-6 px-4 py-6">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-crimson uppercase">{t("services")}</p>
              <ul className="grid gap-2">
                {items(SERVICE_LINKS).map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="flex min-h-16 items-center gap-4 rounded-2xl border border-ink-red/20 bg-white/60 px-4 text-xl font-medium text-ink-red"
                    >
                      <Icon name={i.icon} className="size-8 shrink-0 text-crimson" />
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-1">
              {items(mobileSecondary).map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="flex min-h-12 items-center gap-3 rounded-xl px-2 text-lg text-ink-red">
                    <Icon name={i.icon} className="size-6 shrink-0 text-crimson" />
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto grid gap-3">
              <Link href="/contact" className={buttonClass("primary", "w-full")}>
                <Icon name="message" className="size-6" />
                {t("contactButton")}
              </Link>
              <NextLink href="/login" className="inline-flex min-h-11 items-center justify-center gap-2 text-base text-ink-red/80">
                <LogIn aria-hidden="true" className="size-5" />
                {t("login")}
              </NextLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
