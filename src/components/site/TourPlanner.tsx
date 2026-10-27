"use client";

import { ArrowDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { RequestForm } from "@/components/forms/RequestForm";
import { buttonClass } from "@/components/ui/ButtonLink";
import { DESTINATIONS } from "@/data/destinations";
import { DestinationPicker, type PickerGroup, type PickerLabels } from "./DestinationPicker";

/**
 * Destination picker + the tour request form.
 * Visitors can tick several places, and/or write any place in China in the
 * form itself. Ticked places are added to the form's destinations field.
 */
export function TourPlanner({
  groups,
  labels,
  summary,
  between,
  formHeading,
}: {
  groups: PickerGroup[];
  labels: PickerLabels;
  summary: { selected: string; continue: string };
  /** Static content (e.g. the Hong Kong / Macau note) rendered between picker and form. */
  between?: ReactNode;
  formHeading: ReactNode;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const names = selected
    .map((id) => DESTINATIONS.find((d) => d.id === id)?.name)
    .filter((n): n is string => Boolean(n));

  return (
    <>
      <DestinationPicker groups={groups} labels={labels} value={selected} onChange={toggle} />

      {names.length > 0 && (
        <div
          role="status"
          className="sticky bottom-20 z-20 mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 rounded-3xl border-2 border-crimson bg-white p-4 text-center shadow-xl sm:flex-row sm:justify-between sm:text-left lg:bottom-4"
        >
          <p className="text-base text-ink-red">
            <span className="font-semibold">{summary.selected}: </span>
            {names.join(", ")}
          </p>
          <a href="#request" className={buttonClass("primary", "shrink-0 !min-h-11 !px-5 !py-2")}>
            {summary.continue}
            <ArrowDown aria-hidden="true" className="size-5" />
          </a>
        </div>
      )}

      {between}
      <div id="request" className="mt-16 scroll-mt-24">
        {formHeading}
        <RequestForm formId="tour" pickedPlaces={names} />
      </div>
    </>
  );
}
