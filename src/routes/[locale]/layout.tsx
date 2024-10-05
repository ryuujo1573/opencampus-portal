import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import {
  extractLang,
  extractLangFromHeader,
  useI18n,
} from "~/routes/[locale]/i18n-utils";

export const onRequest: RequestHandler = (ctx) => {
  const locale = extractLang(ctx.params.locale);
  console.log("locale", locale);
  ctx.locale(locale);
  if (!locale) {
    const header = ctx.request.headers.get("Accept-Language");
    // /[locale]/ is possible opt-out path
    console.log("[req header]", header);
    const acceptLocale = extractLangFromHeader(header);

    // ctx.locale(acceptLocale);
    const newUrl = `/${acceptLocale}${ctx.pathname}`;
    console.log("should go to", newUrl);
    throw ctx.redirect(301, newUrl);
  }
};

export default component$(() => {
  useI18n();
  return <Slot />;
});
