"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { isValidEmail, submitWaitlist } from "@/lib/waitlist";

type Status = "idle" | "invalid" | "sending" | "failed" | "success";

export function WaitlistForm() {
    const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputId = useId();
  const msgId = useId();
  const t = useTranslations("comingSoon.waitlist");

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
        {t("success")}
      </p>
    );
  }

  const error = status === "invalid" ? t("invalid") : status === "failed" ? t("failed") : null;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-center text-sm font-medium tracking-wide">
        {t("title")}
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
          placeholder={t("placeholder")}
          aria-label={t("label")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? msgId : undefined}
          className="min-w-0 flex-1 rounded-full border border-ink-red/40 bg-white/70 px-5 py-3 text-base text-maroon placeholder:text-ink-red/55"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-ink-red px-6 py-3 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-maroon disabled:opacity-60"
        >
          {status === "sending" ? t("sending") : t("button")}
        </button>
      </div>
      <p id={msgId} role="alert" className="mt-2 min-h-5 text-center text-sm text-crimson">
        {error}
      </p>
    </form>
  );
}
