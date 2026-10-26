import { getTranslations } from "next-intl/server";
import { RibbonDivider } from "@/components/RibbonDivider";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { ABOUT_LINKS, PARTNER_LINKS, SERVICE_LINKS, TRIP_LINKS } from "@/data/nav";
import { CONTACT_EMAIL } from "@/data/placeholders";
import { BRAND } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { instagramUrl, mailtoUrl, whatsappUrl } from "@/lib/contact";

const linkCls = "inline-flex min-h-11 items-center text-base text-ink-red underline-offset-4 hover:underline";

export async function Footer() {
  const t = await getTranslations("common");
  const n = await getTranslations("nav");
  const mail = mailtoUrl();
  const company = [...ABOUT_LINKS, ...TRIP_LINKS, ...PARTNER_LINKS];

  return (
    <footer className="border-t border-ink-red/10 bg-cream-center px-5 pt-12 pb-28 lg:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <p className="font-display text-xl tracking-[0.3em] text-ink-red uppercase">{BRAND.name}</p>
          <p className="mt-3 text-base text-maroon">{t("footer.tagline")}</p>
          <RibbonDivider className="mt-5 w-40" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-crimson uppercase">{t("footer.servicesTitle")}</p>
          <ul className="mt-2">
            {SERVICE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {n(`items.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-crimson uppercase">{t("footer.companyTitle")}</p>
          <ul className="mt-2">
            {company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {n(`items.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-crimson uppercase">{t("footer.contactTitle")}</p>
          <ul className="mt-2">
            <li>
              <a href={whatsappUrl(t("whatsappMessage"))} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {t("footer.whatsapp")}
              </a>
            </li>
            <li>
              <a href={instagramUrl()} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {t("footer.instagram")}
              </a>
            </li>
            <li>
              {mail ? (
                <a href={mail} className={linkCls}>
                  {CONTACT_EMAIL}
                </a>
              ) : (
                <PlaceholderBadge what="contact email" />
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-ink-red/10 pt-6 text-base text-maroon">
        <p>
          © {BRAND.year} {BRAND.name}. {t("footer.rights")} · {t("footer.madeIn")}
        </p>
        <Link href="/privacy" className={linkCls}>
          {t("footer.privacy")}
        </Link>
      </div>
    </footer>
  );
}
