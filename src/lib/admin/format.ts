import { FORMS, isFormId } from "@/data/forms";

/** Turn a request's `details` JSON into readable label/value rows using the form definition. */
export function formatDetails(type: string, details: Record<string, unknown>): { label: string; value: string }[] {
  const def = isFormId(type) ? FORMS[type] : undefined;
  const fields = def?.steps.flatMap((s) => s.fields) ?? [];

  return Object.entries(details)
    .filter(([key]) => key !== "consent")
    .map(([key, raw]) => {
      const field = fields.find((f) => f.name === key);
      const label = field?.label.en ?? key;
      const optionLabel = (v: string) => field?.options?.find((o) => o.value === v)?.label.en ?? v;
      const value = Array.isArray(raw)
        ? raw.map((v) => optionLabel(String(v))).join(", ")
        : typeof raw === "boolean"
          ? raw
            ? "Yes"
            : "No"
          : optionLabel(String(raw));
      return { label, value };
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
