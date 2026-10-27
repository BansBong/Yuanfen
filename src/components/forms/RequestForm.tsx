"use client";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { submitRequest } from "@/app/actions/submit-request";
import { buttonClass } from "@/components/ui/ButtonLink";
import { DESTINATIONS } from "@/data/destinations";
import { FORMS, type FormId } from "@/data/forms";
import { tripBySlug } from "@/data/trips";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { initialValues, issuesToErrors, stepSchema, type FormValues } from "@/lib/forms/schema";
import { FieldControl } from "./FieldControl";

type Prefill = Record<string, string | string[]>;

const without = (obj: Record<string, string>, key: string) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));

/** Reusable multi-step request form. Questions come from src/data/forms.ts. */
export function RequestForm({
  formId,
  prefill,
  pickedPlaces,
}: {
  formId: FormId;
  prefill?: Prefill;
  /** Names ticked in the destination picker (tour form). */
  pickedPlaces?: string[];
}) {
  return (
    <Suspense fallback={<div className="min-h-64" aria-hidden="true" />}>
      <FormInner formId={formId} prefill={prefill} pickedPlaces={pickedPlaces} />
    </Suspense>
  );
}

const splitPlaces = (text: string) =>
  text
    .split(/[,;\n]/)
    .map((p) => p.trim())
    .filter(Boolean);

/**
 * Apply the picker selection to the free-text field. Places the visitor typed
 * themselves are always kept; only places that were ticked and are now
 * unticked are removed.
 */
function mergePlaces(current: string, picked: string[], previouslyPicked: string[]): string {
  const removed = new Set(previouslyPicked.filter((p) => !picked.includes(p)).map((p) => p.toLowerCase()));
  const kept = splitPlaces(current).filter((p) => !removed.has(p.toLowerCase()));
  const have = new Set(kept.map((p) => p.toLowerCase()));
  return [...kept, ...picked.filter((p) => !have.has(p.toLowerCase()))].join(", ");
}

function FormInner({ formId, prefill, pickedPlaces }: { formId: FormId; prefill?: Prefill; pickedPlaces?: string[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("forms");
  const router = useRouter();
  const search = useSearchParams();
  const def = FORMS[formId];
  const total = def.steps.length;

  const [values, setValues] = useState<FormValues>(() => {
    const base = initialValues(formId);
    const trip = search.get("trip");
    const tripData = trip ? tripBySlug(trip) : undefined;
    if (tripData && "trip" in base) {
      base.trip = tripData.slug;
      if ("destinations" in base) base.destinations = tripData.route.join(", ");
    }
    const destination = search.get("destination");
    if (destination && "destinations" in base && !base.destinations) {
      base.destinations = DESTINATIONS.find((d) => d.id === destination)?.name ?? destination.slice(0, 100);
    }
    if (pickedPlaces?.length && "destinations" in base) {
      base.destinations = mergePlaces(String(base.destinations), pickedPlaces, []);
    }
    return { ...base, ...(prefill as FormValues | undefined) };
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  // Places ticked in the picker above arrive as a prop; merge them in whenever the selection changes.
  const pickedKey = (pickedPlaces ?? []).join("|");
  const [applied, setApplied] = useState<string[]>(pickedPlaces ?? []);
  if (pickedKey !== applied.join("|")) {
    setApplied(pickedPlaces ?? []);
    if ("destinations" in values) {
      setValues({ ...values, destinations: mergePlaces(String(values.destinations ?? ""), pickedPlaces ?? [], applied) });
    }
  }

  const startedAt = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    // Move focus to the new step heading, but never on first load.
    if (previousStep.current !== step) {
      previousStep.current = step;
      heading.current?.focus();
    }
  }, [step]);

  const current = def.steps[step];
  const last = step === total - 1;
  const errText = (code?: string) => (code ? t(`errors.${code}` as "errors.required") : undefined);

  function setValue(name: string, value: string | string[] | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => without(e, name));
    setFormError(null);
  }

  function focusFirstError(found: Record<string, string>, stepIndex: number) {
    const name = def.steps[stepIndex].fields.find((f) => found[f.name])?.name;
    if (name) requestAnimationFrame(() => document.getElementById(`${formId}-${name}`)?.focus());
  }

  function validateStep(stepIndex: number): boolean {
    const res = stepSchema(formId, stepIndex).safeParse(values);
    if (res.success) return true;
    const found = issuesToErrors(res.error);
    setErrors(found);
    focusFirstError(found, stepIndex);
    return false;
  }

  function next() {
    if (!validateStep(step)) return;
    setErrors({});
    setStep(step + 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!last) return next();
    if (!validateStep(step)) return;
    if (!consent) {
      setErrors({ consent: "consent" });
      requestAnimationFrame(() => document.getElementById(`${formId}-consent`)?.focus());
      return;
    }
    setStatus("sending");
    setFormError(null);
    try {
      const res = await submitRequest({
        formId,
        locale,
        values,
        consent,
        hp,
        elapsedMs: Date.now() - startedAt.current,
      });
      if (res.ok) {
        router.push(`/request/confirmation?ref=${encodeURIComponent(res.reference)}`);
        return;
      }
      if (res.code === "validation" && res.errors) {
        setErrors(res.errors);
        const bad = def.steps.findIndex((s) => s.fields.some((f) => res.errors?.[f.name]));
        if (bad >= 0) {
          setStep(bad);
          focusFirstError(res.errors, bad);
        }
        setFormError(t("errorsTitle"));
      } else {
        setFormError(t(`errors.${res.code === "failed" ? "submitFailed" : res.code}` as "errors.submitFailed"));
      }
    } catch {
      setFormError(t("errors.submitFailed"));
    }
    setStatus("idle");
  }

  const pct = Math.round(((step + 1) / total) * 100);

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label={current.title[locale]}
      className="rounded-3xl border border-ink-red/15 bg-white p-5 shadow-[0_24px_60px_-34px_rgba(122,15,18,0.55)] sm:p-8"
      data-form={formId}
    >
      {/* progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-base font-semibold text-ink-red">
          <span>{t("progress", { current: step + 1, total })}</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step + 1}
          aria-label={t("progress", { current: step + 1, total })}
          className="mt-2 h-3 overflow-hidden rounded-full bg-ink-red/10"
        >
          <div className="h-full rounded-full bg-gradient-to-r from-crimson to-maroon transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h3 ref={heading} tabIndex={-1} className="mb-6 font-display text-xl text-ink-red outline-none sm:text-2xl">
        {current.title[locale]}
      </h3>

      <div className="space-y-6">
        {current.fields.map((f) => (
          <FieldControl
            key={f.name}
            formId={formId}
            field={f}
            locale={locale}
            value={values[f.name]}
            error={errors[f.name]}
            errorText={errText(errors[f.name])}
            optionalLabel={t("optional")}
            chooseLabel={t("choose")}
            onChange={(v) => setValue(f.name, v)}
          />
        ))}

        {last && (
          <div>
            <label className="flex cursor-pointer items-start gap-4">
              <input
                id={`${formId}-consent`}
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (errors.consent) setErrors((e) => without(e, "consent"));
                }}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
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
              <p id={`${formId}-consent-error`} role="alert" className="mt-1.5 text-base font-medium text-crimson">
                {t("errors.consent")}
              </p>
            )}
          </div>
        )}

        {/* honeypot: hidden from people, tempting to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Leave this empty
            <input type="text" name="website_url" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
          </label>
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-6 rounded-2xl border-2 border-crimson bg-crimson/5 p-4 text-base font-medium text-crimson">
          {formError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setStep(step - 1);
            }}
            className={buttonClass("secondary")}
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            {t("back")}
          </button>
        ) : (
          <span />
        )}
        {last ? (
          <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "disabled:opacity-60")}>
            <Send aria-hidden="true" className="size-5" />
            {status === "sending" ? t("sending") : t("submit")}
          </button>
        ) : (
          <button type="submit" className={buttonClass("primary")}>
            {t("next")}
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        )}
      </div>
      <p className="mt-4 text-center text-base text-maroon/80">{t("reassurance")}</p>
    </form>
  );
}
