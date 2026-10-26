import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default async function NotFound() {
  const t = await getTranslations("common.notFound");
  return (
    <main className="mx-auto grid min-h-[60dvh] max-w-xl place-items-center px-5 py-24 text-center">
      <div>
        <h1 className="font-display text-4xl text-ink-red">{t("title")}</h1>
        <p className="mt-4 text-lg">{t("text")}</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/">{t("home")}</ButtonLink>
        </div>
      </div>
    </main>
  );
}
