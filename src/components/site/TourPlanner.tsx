"use client";

import { useState, type ReactNode } from "react";
import { RequestForm } from "@/components/forms/RequestForm";
import { DestinationPicker, type PickerGroup, type PickerLabels } from "./DestinationPicker";

/**
 * Destination picker + the tour request form. Tapping a destination pre-fills
 * the form and scrolls to it.
 */
export function TourPlanner({
  groups,
  labels,
  between,
  formHeading,
}: {
  groups: PickerGroup[];
  labels: PickerLabels;
  /** Static content (e.g. the Hong Kong / Macau note) rendered between picker and form. */
  between?: ReactNode;
  formHeading: ReactNode;
}) {
  const [destination, setDestination] = useState<string | null>(null);

  function choose(id: string) {
    setDestination(id);
    const el = document.getElementById("request");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <>
      <DestinationPicker groups={groups} labels={labels} value={destination} onChange={choose} />
      {between}
      <div id="request" className="mt-16 scroll-mt-24">
        {formHeading}
        <RequestForm formId="tour" prefill={destination ? { destination } : undefined} />
      </div>
    </>
  );
}
