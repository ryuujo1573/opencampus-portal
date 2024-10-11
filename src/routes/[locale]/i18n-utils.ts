import "@angular/localize/init";
import { loadTranslations } from "@angular/localize";
import { $, getLocale, useOnDocument, withLocale } from "@builder.io/qwik";
import type { RenderOptions } from "@builder.io/qwik/server";

interface LocalJson {
  readonly locale: string;
  // TODO: i18-extract integration
  readonly localeName: string;
  readonly translations: Parameters<typeof loadTranslations>[0];
}

export const loadAllTranslations = () => {
  return Object.values(
    import.meta.glob<true, string, { default: LocalJson }>("../../locales/*", {
      eager: true,
    }),
  ).map((mod) => mod.default);
};

interface LocaleDefinition {
  readonly locale: string;
  readonly localeName: string;
}

const locales = loadAllTranslations();

export const allLocales: LocaleDefinition[] = locales.map((data) => ({
  locale: data.locale,
  localeName: data.localeName,
}));

// Make sure it's obvious when the default locale was selected
const DEFAULT_LOCALE = "en";

/**
 * This file is left for the developer to customize to get the behavior they want for localization.
 */

/// Declare location where extra types will be stored.
const $localizeFn = $localize as any as {
  TRANSLATIONS: Record<string, any>;
  TRANSLATION_BY_LOCALE: Map<string, Record<string, any>>;
};

/**
 * This solution uses the `@angular/localize` package for translations, however out of the box
 * `$localize` works with a single translation only. This code adds support for multiple locales
 * concurrently. It does this by intercepting the `TRANSLATIONS` property read and returning
 * appropriate translation based on the current locale which is store in the `useEnvData('locale')`.
 */

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!$localizeFn.TRANSLATION_BY_LOCALE) {
  $localizeFn.TRANSLATION_BY_LOCALE = new Map([["", {}]]);
  Object.defineProperty($localize, "TRANSLATIONS", {
    get() {
      const locale = getLocale(DEFAULT_LOCALE);
      let translations = $localizeFn.TRANSLATION_BY_LOCALE.get(locale);
      if (!translations) {
        $localizeFn.TRANSLATION_BY_LOCALE.set(locale, (translations = {}));
      }
      return translations;
    },
  });
}

/**
 * Function used to load all translations variants.
 */
export function initTranslations() {
  console.log(locales);

  locales.forEach(({ translations, locale }) => {
    withLocale(locale, () => {
      console.log("[localize] loading %o", locale);
      loadTranslations(translations);
    });
  });
}

/**
 * Function used to examine the request and determine the locale to use.
 *
 * This function is meant to be used with `RenderOptions.locale` property
 *
 * @returns The locale to use which will be stored in the `useEnvData('locale')`.
 */
export function extractLang(locale: string) {
  return locale && allLocales.some((local) => local.locale == locale)
    ? locale
    : undefined;
}

export function extractLangFromHeader(acceptLanguage?: string | null): string {
  // TODO: simplify syntaxes
  return (
    acceptLanguage?.split(",").reduce((found, span) => {
      if (found) return found;
      const match = /([^;]+)(;.+)?/.exec(span);
      if (match) {
        const [, lang] = match;
        if (extractLang(lang) != undefined) {
          return lang;
        }
      }
      return "";
    }, "") || DEFAULT_LOCALE
  );
}

/**
 * Function used to determine the base URL to use for loading the chunks in the browser.
 *
 * The function returns `/build` in dev mode or `/build/<locale>` in prod mode.
 *
 * This function is meant to be used with `RenderOptions.base` property
 *
 * @returns The base URL to use for loading the chunks in the browser.
 */
export function extractBase({ serverData }: RenderOptions): string {
  if (import.meta.env.DEV) {
    return `${import.meta.env.BASE_URL}build`;
  } else {
    return `${import.meta.env.BASE_URL}build/` + serverData!.locale;
  }
}

export function useI18n() {
  if (import.meta.env.DEV) {
    // During development only, load all translations in memory when the app starts on the client.
    // eslint-disable-next-line
    useOnDocument("qinit", $(initTranslations));
  }
}

// We always need the translations on the server
if (import.meta.env.SSR) {
  initTranslations();
}
