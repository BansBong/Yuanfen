"use client";

import { ChevronDown } from "lucide-react";
import type { Field } from "@/data/forms";
import type { Locale } from "@/i18n/routing";

type Value = string | string[] | boolean;

const INPUT =
  "min-h-14 w-full rounded-2xl border-2 bg-white px-4 py-3 text-lg text-maroon placeholder:text-ink-red/50 focus:border-crimson focus:outline-none focus-visible:ring-4 focus-visible:ring-crimson/20";

/** One question. Labels, help and errors are wired up with aria-* so screen readers announce them. */
export function FieldControl({
  formId,
  field,
  locale,
  value,
  error,
  errorText,
  optionalLabel,
  chooseLabel,
  onChange,
}: {
  formId: string;
  field: Field;
  locale: Locale;
  value: Value;
  error?: string;
  errorText?: string;
  optionalLabel: string;
  chooseLabel: string;
  onChange: (value: Value) => void;
}) {
  const id = `${formId}-${field.name}`;
  const helpId = field.help ? `${id}-help` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(" ") || undefined;
  const border = error ? "border-crimson" : "border-ink-red/30";
  const label = field.label[locale];

  const labelNode = (
    <>
      {label}
      {!field.required && field.type !== "checkbox" && (
        <span className="ml-2 text-base font-normal text-maroon/70">({optionalLabel})</span>
      )}
    </>
  );

  const meta = (
    <>
      {field.help && (
        <p id={helpId} className="mt-1.5 text-base text-maroon/80">
          {field.help[locale]}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="mt-1.5 text-base font-medium text-crimson">
          {errorText}
        </p>
      )}
    </>
  );

  // ---- choice groups (radio / checkbox chips) ----
  if (field.type === "chips" || field.type === "chips-multi") {
    const multi = field.type === "chips-multi";
    const selected = multi ? (value as string[]) : [value as string];
    return (
      <fieldset
        id={id}
        tabIndex={-1}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className="outline-none"
      >
        <legend className="mb-3 text-lg font-semibold text-ink-red">{labelNode}</legend>
        <div className="flex flex-wrap gap-3">
          {(field.options ?? []).map((o) => {
            const checked = selected.includes(o.value);
            return (
              <label key={o.value} className="cursor-pointer">
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={`${formId}-${field.name}`}
                  value={o.value}
                  checked={checked}
                  onChange={() => {
                    if (multi) {
                      const arr = value as string[];
                      onChange(checked ? arr.filter((v) => v !== o.value) : [...arr, o.value]);
                    } else {
                      onChange(checked && !field.required ? "" : o.value);
                    }
                  }}
                  className="peer sr-only"
                />
                <span
                  className={`inline-flex min-h-14 items-center rounded-full border-2 px-5 text-lg transition-colors peer-checked:border-ink-red peer-checked:bg-ink-red peer-checked:text-cream peer-focus-visible:ring-4 peer-focus-visible:ring-crimson/30 ${
                    error ? "border-crimson" : "border-ink-red/30"
                  } bg-white text-ink-red hover:border-ink-red/60`}
                >
                  {o.label[locale]}
                </span>
              </label>
            );
          })}
        </div>
        {meta}
      </fieldset>
    );
  }

  // ---- single checkbox ----
  if (field.type === "checkbox") {
    return (
      <div>
        <label className="flex cursor-pointer items-start gap-4">
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className="mt-1 size-7 shrink-0 accent-[#8b1a1a]"
          />
          <span className="text-lg leading-snug text-maroon">{labelNode}</span>
        </label>
        {meta}
      </div>
    );
  }

  // ---- label + control ----
  let control: React.ReactNode;
  if (field.type === "select") {
    control = (
      <div className="relative">
        <select
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`${INPUT} ${border} appearance-none pr-12`}
        >
          <option value="">{chooseLabel}</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label[locale]}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 size-6 -translate-y-1/2 text-ink-red" />
      </div>
    );
  } else if (field.type === "textarea") {
    control = (
      <textarea
        id={id}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        maxLength={field.max}
        placeholder={field.placeholder?.[locale]}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={`${INPUT} ${border} resize-y`}
      />
    );
  } else {
    const type = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
    control = (
      <input
        id={id}
        type={type}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        maxLength={field.max}
        min={field.type === "number" ? field.min : undefined}
        max={field.type === "number" ? field.maxValue : undefined}
        inputMode={field.type === "number" ? "numeric" : undefined}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder?.[locale]}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={`${INPUT} ${border}`}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-lg font-semibold text-ink-red">
        {labelNode}
      </label>
      {control}
      {meta}
    </div>
  );
}
