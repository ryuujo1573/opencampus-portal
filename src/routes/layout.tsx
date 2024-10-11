import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { onRequest } from "./[locale]/layout";
import type { Session } from "@ory/client";

export const onGet: RequestHandler = async (ctx) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  ctx.cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });

  // simple hack to detect locale and redirect.
  onRequest(ctx);
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useSession = routeLoader$(({ sharedMap }) => {
  return sharedMap.get("session") as Session | undefined;
});

export default component$(() => {
  return (
    <>
      <Slot />
    </>
  );
});
