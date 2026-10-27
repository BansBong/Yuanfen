import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/ButtonLink";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Trip } from "@/data/trips";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/** A fixed curated trip. "Request a quote" opens the tour form with the trip pre-selected. */
export async function TripCard({ trip, locale, compact = false }: { trip: Trip; locale: Locale; compact?: boolean }) {
  const t = await getTranslations({ locale, namespace: "trips" });
  return (
    <article className="flex h-full flex-col rounded-3xl card-surface p-6 shadow-[0_18px_40px_-28px_rgba(122,15,18,0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge
          status={trip.status}
          label={trip.status === "available" ? t("badgeAvailable") : t("badgeOnRequest")}
        />
        <PlaceholderBadge what="trip details" />
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug text-ink-red">{trip.name[locale]}</h3>

      <p className="mt-3 flex items-center gap-2 text-base font-medium text-maroon">
        <CalendarDays aria-hidden="true" className="size-5 shrink-0 text-crimson" />
        {t("days", { count: trip.days })}
      </p>
      <p className="mt-2 text-base text-maroon">
        <span className="font-semibold text-ink-red">{t("routeLabel")}: </span>
        {trip.route.join(" → ")}
      </p>

      {!compact && (
        <>
          <p className="mt-4 text-sm font-semibold tracking-[0.2em] text-crimson uppercase">{t("highlightsLabel")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-base text-maroon marker:text-crimson">
            {trip.highlights.map((h) => (
              <li key={h.en}>{h[locale]}</li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 text-base text-maroon">
            <Users aria-hidden="true" className="mt-1 size-5 shrink-0 text-crimson" />
            <span>
              <span className="font-semibold text-ink-red">{t("forWhoLabel")}: </span>
              {trip.forWho[locale]}
            </span>
          </p>
        </>
      )}

      <div className="mt-auto pt-6">
        <Link
          href={`/services/tour-guiding?trip=${trip.slug}#request`}
          className={buttonClass("primary", "w-full")}
        >
          {t("requestQuote")}
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      </div>
    </article>
  );
}
