import { routeLoader$ } from "@builder.io/qwik-city";
import { AxiosError } from "axios";
import { auth } from "~/api/auth";

export const useFlow = routeLoader$(async (ctx) => {
  const { flow: id } = Object.fromEntries(ctx.query.entries());
  const cookie = ctx.request.headers.get("cookie") ?? undefined;

  try {
    const { data: flow } = await auth.getLoginFlow({ id, cookie });

    return flow;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log("error!", err.message);
      // return err.message;
      return ctx.fail(err.status!, {
        id: "unknown",
        error: err,
      });
    }
    // ctx.sharedMap.set("error", err);
    return ctx.fail(500, {
      id: "unknown",
      error: err,
    });
  }
});
