"use client";

import { Check, Copy, MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { whatsappUrl } from "@/lib/contact";

type Strings = {
  refLabel: string;
  refHelp: string;
  whatsappCta: string;
  whatsappMessage: string; // contains {ref}
  noRef: string;
  copy: string;
  copied: string;
};

const REF = /^YF-[A-Z0-9]{6}$/;

function Inner({ strings }: { strings: Strings }) {
  const params = useSearchParams();
  const raw = params.get("ref") ?? "";
  const [copied, setCopied] = useState(false);

  if (!REF.test(raw)) {
    return <p className="rounded-2xl bg-cream-center p-5 text-base">{strings.noRef}</p>;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked; the code is still on screen */
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border-2 border-crimson bg-white p-6 text-center">
        <p className="text-sm font-semibold tracking-[0.3em] text-crimson uppercase">{strings.refLabel}</p>
        <p className="mt-3 font-mono text-3xl font-semibold tracking-widest text-ink-red" data-testid="reference-code">
          {raw}
        </p>
        <p className="mt-2 text-base text-maroon">{strings.refHelp}</p>
        <button
          type="button"
          onClick={copy}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-ink-red/60 px-5 text-base font-medium text-ink-red hover:bg-ink-red hover:text-cream"
        >
          {copied ? <Check aria-hidden="true" className="size-5" /> : <Copy aria-hidden="true" className="size-5" />}
          {copied ? strings.copied : strings.copy}
        </button>
      </div>
      <a
        href={whatsappUrl(strings.whatsappMessage.replace("{ref}", raw))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#1f8f4e] px-7 py-3.5 text-base font-semibold text-white hover:bg-[#177a40]"
      >
        <MessageCircle aria-hidden="true" className="size-6" />
        {strings.whatsappCta}
      </a>
    </div>
  );
}

export function ConfirmationPanel({ strings }: { strings: Strings }) {
  return (
    <Suspense fallback={null}>
      <Inner strings={strings} />
    </Suspense>
  );
}
