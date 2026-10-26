import { getRequestConfig } from "next-intl/server";
import { loadMessages } from "./messages";
import { isLocale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  return { locale, messages: await loadMessages(locale) };
});
