export type SubmitResult =
  | { ok: true; reference: string }
  | {
      ok: false;
      /** "validation" carries per-field error codes; the rest are page-level. */
      code: "validation" | "rateLimited" | "notConfigured" | "failed";
      errors?: Record<string, string>;
    };

export type SubmitInput = {
  formId: string;
  locale: string;
  values: Record<string, unknown>;
  consent: boolean;
  /** Honeypot: real people leave it empty. */
  hp: string;
  /** Milliseconds between the form appearing and the submit click. */
  elapsedMs: number;
};
