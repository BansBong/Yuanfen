import { getTranslations } from "next-intl/server";
import { RequestForm } from "@/components/forms/RequestForm";
import { Section } from "@/components/ui/Section";
import type { FormId } from "@/data/forms";
import type { Locale } from "@/i18n/routing";

/** Heading + reassurance + the multi-step request form. Anchor: #request */
export async function RequestSection({
  locale,
  formId,
  eyebrow,
  title,
  intro,
  showPriceNote = true,
}: {
  locale: Locale;
  formId: FormId;
  eyebrow?: string;
  title: string;
  intro?: string;
  showPriceNote?: boolean;
}) {
  const c = await getTranslations({ locale, namespace: "common" });
  return (
    <Section id="request" tone="blush" innerClassName="max-w-3xl">
      <header className="reveal mb-8 text-center">
        {eyebrow && <p className="text-sm font-semibold tracking-[0.3em] text-crimson uppercase">{eyebrow}</p>}
        <h2 className="mt-3 font-display text-2xl text-ink-red sm:text-3xl">{title}</h2>
        {intro && <p className="mt-4 text-base text-maroon sm:text-lg">{intro}</p>}
        {showPriceNote && (
          <>
            <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-base font-medium text-ink-red">{c("noPrices")}</p>
            <p className="mt-2 text-base font-medium text-crimson">{c("freeQuote")}</p>
          </>
        )}
      </header>
      <RequestForm formId={formId} />
    </Section>
  );
}
