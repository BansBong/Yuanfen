import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, detectLocale } from "@/i18n/detect";
import { isLocale } from "@/i18n/routing";
import { INDEXABLE, SERVE_FULL_SITE } from "@/lib/site-mode";

/**
 * Launch switch + locale routing.
 *
 * - /admin and /login: always served (team access), never indexed.
 * - coming-soon mode (production): every other URL is rewritten to the Coming
 *   Soon page in the visitor's language. The URL in the address bar is kept.
 * - live mode or a Vercel preview: the full site under /en and /id.
 *   Everything is noindex unless this is the live production site.
 */
const INTERNAL = /^\/(admin|login)(\/|$)/;
const COMING_SOON = /^\/coming-soon(\/|$)/;

function withHeaders(res: NextResponse, noindex: boolean) {
  if (noindex) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (INTERNAL.test(pathname)) {
    return withHeaders(NextResponse.next(), true);
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (!SERVE_FULL_SITE) {
    // Honour an explicit /en or /id prefix, otherwise detect.
    const locale = isLocale(first) ? first : detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/coming-soon/${locale}`;
    // Only the bare home URL is indexable; anything else is a duplicate of it.
    return withHeaders(NextResponse.rewrite(url), pathname !== "/");
  }

  // Full site from here on.
  if (COMING_SOON.test(pathname)) {
    if (INDEXABLE) {
      // Live: the Coming Soon page is retired.
      const url = req.nextUrl.clone();
      url.pathname = `/${detectLocale(req)}`;
      return NextResponse.redirect(url);
    }
    // Preview: keep it reachable so the team can still review it.
    return withHeaders(NextResponse.next(), true);
  }

  if (!isLocale(first)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${detectLocale(req)}${pathname === "/" ? "" : pathname}`;
    url.search = search;
    const res = NextResponse.redirect(url);
    return withHeaders(res, !INDEXABLE);
  }

  const res = NextResponse.next();
  // Remember an explicitly visited language.
  if (req.cookies.get(LOCALE_COOKIE)?.value !== first) {
    res.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return withHeaders(res, !INDEXABLE);
}

export const config = {
  // Skip Next internals, the OG image route, and anything with a file extension.
  matcher: ["/((?!api|_next|_vercel|og$|.*\\..*).*)"],
};
