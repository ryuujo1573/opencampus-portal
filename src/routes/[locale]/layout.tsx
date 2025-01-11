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
    const acceptLocale = extractLangFromHeader(header);

    const query = ctx.query.toString();
    // ctx.locale(acceptLocale);
    const newUrl = `/${acceptLocale}${ctx.url.pathname}${ctx.url.search}`;
    console.debug(
      "[%s %o] there's no locale %o, forward to",
      ctx.method,
      ctx.url.href,
      locale,
      "/" + acceptLocale,
    );
    throw ctx.redirect(302, newUrl);
  }
};

export default component$(() => {
  useI18n();

  return <Slot />;
});
