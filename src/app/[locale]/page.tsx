import { setRequestLocale } from "next-intl/server";

// Real home content is added in the next step.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main className="p-8">Home ({locale})</main>;
}
