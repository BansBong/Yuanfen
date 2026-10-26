import { notFound } from "next/navigation";

// Any unknown path under /en or /id renders the localized not-found page.
export default function CatchAll() {
  notFound();
}
