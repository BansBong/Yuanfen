"use client";

import { useId, useState } from "react";
import { COPY } from "@/data/site";
import { isValidEmail, submitWaitlist } from "@/lib/waitlist";
import { useLang } from "./LanguageProvider";

type Status = "idle" | "invalid" | "sending" | "failed" | "success";

export function WaitlistForm() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputId = useId();
  const msgId = useId();
  const t = COPY.waitlist;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const { ok } = await submitWaitlist(value);
      setStatus(ok ? "success" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-2xl border border-ink-red/25 bg-white/60 px-5 py-4 text-center text-sm leading-relaxed text-maroon"
      >
        {t.success[lang]}
      </p>
    );
  }

  const error = status === "invalid" ? t.invalid[lang] : status === "failed" ? t.failed[lang] : null;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-center text-sm font-medium tracking-wide">
        {t.title[lang]}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "sending") setStatus("idle");
          }}
          placeholder={t.placeholder[lang]}
          aria-label={t.label[lang]}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? msgId : undefined}
          className="min-w-0 flex-1 rounded-full border border-ink-red/40 bg-white/70 px-5 py-3 text-base text-maroon placeholder:text-ink-red/55"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-ink-red px-6 py-3 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-maroon disabled:opacity-60"
        >
          {status === "sending" ? t.sending[lang] : t.button[lang]}
        </button>
      </div>
      <p id={msgId} role="alert" className="mt-2 min-h-5 text-center text-sm text-crimson">
        {error}
      </p>
    </form>
  );
}
