import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/(internal)/admin/actions";
import type { AdminProfile } from "@/lib/admin/session";

const NAV = [
  { href: "/admin", label: "Inbox" },
  { href: "/admin/places", label: "Places" },
  { href: "/admin/profile", label: "My profile" },
  { href: "/admin/security", label: "Security" },
];

export function Avatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid place-items-center rounded-full bg-ink-red text-cream"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/** Top bar for all admin pages. */
export function AdminShell({
  profile,
  newCount,
  children,
}: {
  profile: AdminProfile;
  newCount?: number;
  children: React.ReactNode;
}) {
  const name = profile.display_name || "Admin";
  return (
    <div className="min-h-dvh bg-cream-center text-base text-maroon">
      <header className="sticky top-0 z-30 border-b border-ink-red/15 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/admin" className="font-display text-lg tracking-[0.25em] text-ink-red uppercase">
            Yuanfen <span className="text-sm tracking-widest text-crimson">Admin</span>
          </Link>
          <nav aria-label="Admin" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-medium text-ink-red hover:bg-ink-red/10"
              >
                {n.label}
                {n.href === "/admin" && newCount ? (
                  <span className="rounded-full bg-crimson px-2 py-0.5 text-sm font-semibold text-white">{newCount}</span>
                ) : null}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Avatar name={name} url={profile.avatar_url} />
            <span className="hidden font-medium text-ink-red sm:inline">{name}</span>
            <form action={signOut}>
              <button type="submit" className="min-h-11 rounded-full border-2 border-ink-red/50 px-4 font-medium text-ink-red hover:bg-ink-red hover:text-cream">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
