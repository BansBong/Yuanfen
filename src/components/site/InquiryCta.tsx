import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";

/** Closing call to action on each service page: opens the inquiry questionnaire with the service pre-ticked. */
export async function InquiryCta({
  locale,
  service,
  id = "request",
}: {
  locale: Locale;
  service: "tour" | "jastip" | "medical" | "admission";
  id?: string;
}) {
  const s = await getTranslations({ locale, namespace: "services.common" });
  const c = await getTranslations({ locale, namespace: "common" });
  return (
    <Section id={id} tone="blush" innerClassName="max-w-2xl">
      <div className="reveal card-surface rounded-3xl p-8 text-center shadow-[0_24px_60px_-38px_rgba(122,15,18,0.55)]">
        <h2 className="text-gradient font-display text-2xl sm:text-3xl">{s("ctaTitle")}</h2>
        <p className="mt-3 text-base leading-relaxed text-maroon sm:text-lg">{s("ctaText")}</p>
        <p className="mt-3 text-base font-medium text-crimson">{c("freeQuote")}</p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href={`/inquiry?service=${service}`} icon="send">
            {s("ctaButton")}
          </ButtonLink>
        </div>
        <p className="mt-4 text-sm text-maroon/80">{c("noPrices")}</p>
      </div>
    </Section>
  );
}
