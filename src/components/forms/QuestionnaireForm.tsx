"use client";

import { Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { submitRequest } from "@/app/actions/submit-request";
import { buttonClass } from "@/components/ui/ButtonLink";
import { StarMarker } from "@/components/ui/StarMarker";
import { DESTINATIONS } from "@/data/destinations";
import { FORMS, type Field } from "@/data/forms";
import { tripBySlug } from "@/data/trips";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formSchema, initialValues, issuesToErrors, type FormValues } from "@/lib/forms/schema";
import { FieldControl } from "./FieldControl";

const FORM_ID = "inquiry" as const;

/** ?service=tour etc. pre-ticks the matching "type of assistance" boxes. */
const SERVICE_TO_ASSISTANCE: Record<string, string[]> = {
  tour: ["guide"],
  jastip: ["shopping"],
  medical: ["medical_appointment"],
  admission: ["education"],
};

const without = (obj: Record<string, string>, key: string) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));

/** The service inquiry questionnaire: every section on one page, one submit. */
export function QuestionnaireForm() {
  return (
    <Suspense fallback={<div className="min-h-96" aria-hidden="true" />}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const locale = useLocale() as Locale;
  const t = useTranslations("forms");
  const router = useRouter();
  const search = useSearchParams();
  const def = FORMS[FORM_ID];

  const [values, setValues] = useState<FormValues>(() => {
    const base = initialValues(FORM_ID);
    const services = (search.get("service") ?? "").split(",").flatMap((s) => SERVICE_TO_ASSISTANCE[s.trim()] ?? []);
    if (services.length) base.assistance = [...new Set(services)];

    const places: string[] = [];
    const trip = tripBySlug(search.get("trip") ?? "");
    if (trip) {
      places.push(...trip.route);
      base.requests = `${locale === "id" ? "Tertarik dengan trip" : "Interested in the trip"}: ${trip.name[locale]}`;
      if (!base.assistance || (base.assistance as string[]).length === 0) base.assistance = ["guide"];
    }
    const typed = (search.get("destinations") ?? "").slice(0, 400);
    if (typed) places.push(...typed.split(",").map((p) => p.trim()));
    const destination = search.get("destination");
    if (destination) places.push(DESTINATIONS.find((d) => d.id === destination)?.name ?? destination.slice(0, 80));
    base.destinations = [...new Set(places.filter(Boolean))].join(", ");
    return base;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const errText = (code?: string) => (code ? t(`errors.${code}` as "errors.required") : undefined);

  function setValue(name: string, value: string | string[] | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => without(e, name));
    setFormError(null);
  }

  const isVisible = (f: Field) => {
    if (!f.showWhen) return true;
    const v = values[f.showWhen.field];
    return Array.isArray(v) ? v.includes(f.showWhen.includes) : v === f.showWhen.includes;
  };

  function focusFirst(found: Record<string, string>) {
    const first = def.steps.flatMap((s) => s.fields).find((f) => found[f.name]);
    const id = first ? `${FORM_ID}-${first.name}` : found.consent ? `${FORM_ID}-consent` : null;
    if (id) requestAnimationFrame(() => document.getElementById(id)?.focus());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};

    const res = formSchema(FORM_ID).safeParse(values);
    if (!res.success) Object.assign(found, issuesToErrors(res.error));
    if (!consent) found.consent = "consent";

    if (Object.keys(found).length) {
      setErrors(found);
      setFormError(t("questionnaire.errorsSummary", { count: Object.keys(found).length }));
      focusFirst(found);
      return;
    }

    setStatus("sending");
    setFormError(null);
    try {
      const result = await submitRequest({
        formId: FORM_ID,
        locale,
        values,
        consent,
        hp,
        elapsedMs: Date.now() - startedAt.current,
      });
      if (result.ok) {
        router.push(`/request/confirmation?ref=${encodeURIComponent(result.reference)}`);
        return;
      }
      if (result.code === "validation" && result.errors) {
        setErrors(result.errors);
        setFormError(t("questionnaire.errorsSummary", { count: Object.keys(result.errors).length }));
        focusFirst(result.errors);
      } else {
        setFormError(t(`errors.${result.code === "failed" ? "submitFailed" : result.code}` as "errors.submitFailed"));
      }
    } catch {
      setFormError(t("errors.submitFailed"));
    }
    setStatus("idle");
  }

  const total = def.steps.length;

  return (
    <form onSubmit={submit} noValidate data-form={FORM_ID} className="space-y-8">
      {/* jump links */}
      <nav aria-label={t("questionnaire.jump")} className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-ink-red">{t("questionnaire.jump")}:</span>
        {def.steps.map((s, i) => (
          <a
            key={s.id}
            href={`#inq-${s.id}`}
            className="inline-flex min-h-9 items-center rounded-full border border-ink-red/25 bg-white/70 px-3 text-ink-red hover:bg-ink-red hover:text-cream"
          >
            {i + 1}. {s.title[locale].replace(/\s*\(.*\)$/, "")}
          </a>
        ))}
      </nav>
      <p className="text-sm text-maroon/80">{t("questionnaire.requiredNote")}</p>

      {def.steps.map((step, i) => (
        <section
          key={step.id}
          id={`inq-${step.id}`}
          aria-labelledby={`inq-${step.id}-title`}
          className="card-surface scroll-mt-24 rounded-3xl p-5 shadow-[0_24px_60px_-38px_rgba(122,15,18,0.55)] sm:p-8"
        >
          <header className="mb-6 flex items-center gap-4">
            <StarMarker n={i + 1} />
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-crimson uppercase">
                {t("questionnaire.sectionOf", { n: i + 1, total })}
              </p>
              <h2 id={`inq-${step.id}-title`} className="font-display text-xl text-ink-red sm:text-2xl">
                {step.title[locale]}
              </h2>
            </div>
          </header>
          <div className="grid gap-6 sm:grid-cols-2">
            {step.fields.filter(isVisible).map((f) => (
              <div key={f.name} className={f.width === "half" ? "" : "sm:col-span-2"}>
                <FieldControl
                  formId={FORM_ID}
                  field={f}
                  locale={locale}
                  value={values[f.name]}
                  error={errors[f.name]}
                  errorText={errText(errors[f.name])}
                  optionalLabel={t("optional")}
                  chooseLabel={t("choose")}
                  onChange={(v) => setValue(f.name, v)}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="card-surface rounded-3xl p-5 sm:p-8">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            id={`${FORM_ID}-consent`}
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (errors.consent) setErrors((er) => without(er, "consent"));
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${FORM_ID}-consent-error` : undefined}
            className="mt-1 size-7 shrink-0 accent-[#8b1a1a]"
          />
          <span className="text-base leading-snug text-maroon">
            {t.rich("consent", {
              privacy: (chunks) => (
                <Link href="/privacy" target="_blank" className="font-semibold text-crimson underline underline-offset-4">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {errors.consent && (
          <p id={`${FORM_ID}-consent-error`} role="alert" className="mt-1.5 text-base font-medium text-crimson">
            {t("errors.consent")}
          </p>
        )}

        {/* honeypot: hidden from people, tempting to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Leave this empty
            <input type="text" name="website_url" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
          </label>
        </div>

        {formError && (
          <p role="alert" className="mt-6 rounded-2xl border-2 border-crimson bg-crimson/5 p-4 text-base font-medium text-crimson">
            {formError}
          </p>
        )}

        <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "mt-6 w-full disabled:opacity-60 sm:w-auto")}>
          <Send aria-hidden="true" className="size-5" />
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        <p className="mt-4 text-sm text-maroon/80">{t("reassurance")}</p>
      </div>
    </form>
  );
}
