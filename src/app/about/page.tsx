import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";
import { COPY } from "@/data/site";

export const metadata: Metadata = {
  title: COPY.about.metaTitle.id,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: COPY.about.metaTitle.id },
};

export default function AboutPage() {
  return (
    <main>
      <AboutContent />
    </main>
  );
}
