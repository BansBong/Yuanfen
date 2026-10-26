import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/coming-soon/Hero";
import { Hint } from "@/components/coming-soon/Hint";
import { Services } from "@/components/coming-soon/Services";
import { Waitlist } from "@/components/coming-soon/Waitlist";

export default async function ComingSoonPage({ params }: PageProps<"/coming-soon/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <Hero />
      <Hint />
      <Services />
      <Waitlist />
    </main>
  );
}
