import { loadTranslations } from "@angular/localize";
import { $, component$, getLocale, useOnWindow } from "@builder.io/qwik";
import { allLocales } from "./i18n-utils";

export default component$(() => {
  const name = "Qwik";
  const locale = getLocale("unknown");
  useOnWindow(
    "qinit",
    $(() => {
      console.log("locale", locale);
    }),
  );

  return (
    <div class="card card-normal m-auto mt-16 w-1/3 bg-slate-200">
      <div class="card-body">
        <h1 class="card-title">{$localize`Hello from ${name}!`}</h1>
        <b>{$localize`current locale is ${locale}`}</b>
        <p>{$localize`Use the following links to change the translation.`}</p>
        <div class="flex justify-evenly">
          {allLocales.map(({ locale, localeName }) => {
            return (
              <a class="link" href={`/${locale}/`}>
                {localeName}
              </a>
            );
          })}
        </div>
        <p>
          {$localize`Translation is performed as part of the build step so translated strings are inlined into the application, there is no need to load or look them up at runtime. However, these advantages mean that the user cannot change the language without refreshing the page.`}
        </p>
      </div>
    </div>
  );
});
