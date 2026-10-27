import { FORMS, isFormId } from "@/data/forms";
import { displayValue } from "./answers";

/** Turn a request's `details` JSON into readable label/value rows using the form definition. */
export function formatDetails(type: string, details: Record<string, unknown>): { label: string; value: string }[] {
  const def = isFormId(type) ? FORMS[type] : undefined;
  const fields = def?.steps.flatMap((s) => s.fields) ?? [];

  return Object.entries(details)
    .filter(([key]) => key !== "consent")
    .map(([key, raw]) => {
      const field = fields.find((f) => f.name === key);
      return { label: field?.label.en ?? key, value: displayValue(field, raw) };
    });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

/** Link a contact value to the best way of reaching it. */
export function contactHref(contact: string, kind: "email" | "phone" | "other"): string | null {
  if (kind === "email") return `mailto:${contact}`;
  if (kind === "phone") return `https://wa.me/${contact.replace(/[^\d]/g, "")}`;
  return null;
}
