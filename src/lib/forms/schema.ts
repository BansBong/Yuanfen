import { z } from "zod";
import { FORMS, type Field, type FormId } from "@/data/forms";

/**
 * Validation built from src/data/forms.ts, so the client and the server can
 * never disagree. Error messages are codes ("required", "invalid", "tooLong")
 * that the UI translates.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidContact(value: string): boolean {
  const v = value.trim();
  if (EMAIL.test(v)) return true;
  const digits = v.replace(/[\s\-().]/g, "");
  return /^\+?\d{7,15}$/.test(digits);
}

function fieldSchema(f: Field): z.ZodType<unknown> {
  const req = !!f.required;

  switch (f.type) {
    case "text":
    case "textarea": {
      const max = f.max ?? (f.type === "textarea" ? 2000 : 200);
      let s = z.string().trim().max(max, { message: "tooLong" });
      if (req) s = s.min(1, { message: "required" });
      if (f.kind === "contact") {
        return s.refine((v) => (v === "" ? !req : isValidContact(v)), { message: "invalidContact" });
      }
      return s;
    }
    case "select":
    case "chips": {
      const allowed = new Set((f.options ?? []).map((o) => o.value));
      return z
        .string()
        .refine((v) => (v === "" ? !req : allowed.has(v)), { message: req ? "required" : "invalid" });
    }
    case "chips-multi": {
      const allowed = new Set((f.options ?? []).map((o) => o.value));
      return z
        .array(z.string())
        .max(20, { message: "invalid" })
        .refine((arr) => arr.every((v) => allowed.has(v)), { message: "invalid" })
        .refine((arr) => !req || arr.length > 0, { message: "required" });
    }
    case "date":
      return z
        .string()
        .refine((v) => (v === "" ? !req : /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))), {
          message: req ? "required" : "invalid",
        });
    case "number": {
      const min = f.min ?? 0;
      const max = f.maxValue ?? 1000;
      return z.string().refine(
        (v) => {
          if (v === "") return !req;
          const n = Number(v);
          return Number.isInteger(n) && n >= min && n <= max;
        },
        { message: req ? "required" : "invalid" },
      );
    }
    case "checkbox":
      return req ? z.literal(true, { message: "required" }) : z.boolean();
  }
}

export function stepSchema(formId: FormId, stepIndex: number) {
  const shape: Record<string, z.ZodType<unknown>> = {};
  for (const f of FORMS[formId].steps[stepIndex].fields) shape[f.name] = fieldSchema(f);
  return z.object(shape);
}

export function formSchema(formId: FormId) {
  const shape: Record<string, z.ZodType<unknown>> = {};
  for (const step of FORMS[formId].steps) {
    for (const f of step.fields) shape[f.name] = fieldSchema(f);
  }
  return z.object(shape);
}

export type FormValues = Record<string, string | string[] | boolean>;

/** The empty value for a field (what an untouched input holds). */
export function emptyValue(f: Field): string | string[] | boolean {
  if (f.type === "chips-multi") return [];
  if (f.type === "checkbox") return false;
  return "";
}

export function initialValues(formId: FormId): FormValues {
  const out: FormValues = {};
  for (const step of FORMS[formId].steps) for (const f of step.fields) out[f.name] = emptyValue(f);
  return out;
}

/** Flatten zod issues into { fieldName: errorCode }. */
export function issuesToErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
