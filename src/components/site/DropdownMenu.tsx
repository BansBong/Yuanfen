"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { IconName } from "@/data/nav";
import { Icon } from "@/components/ui/icons";

export type MenuItem = { href: string; label: string; icon: IconName };

/** Desktop dropdown: click or hover to open, Escape / outside click / navigation to close. */
export function DropdownMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 items-center gap-1 rounded-full px-3 text-base font-medium text-ink-red hover:bg-ink-red/10"
      >
        {label}
        <ChevronDown aria-hidden="true" className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        id={menuId}
        hidden={!open}
        className="absolute left-0 top-full z-50 min-w-72 rounded-2xl border border-ink-red/15 bg-cream p-2 shadow-xl"
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-base text-ink-red hover:bg-ink-red/10"
            >
              <Icon name={item.icon} className="size-6 shrink-0 text-crimson" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
