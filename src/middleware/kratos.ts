import { type RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/api/auth";

export const kratosAuth: RequestHandler = async (ctx) => {
  const cookie = ctx.request.headers.get("cookie") ?? "";

  try {
    const { data: session } = await auth.toSession({
      cookie: cookie,
    });

    if (!session.active) {
      const { data: flow } = await auth.createBrowserLoginFlow();

      throw ctx.redirect(302, flow.request_url);
    }

    ctx.sharedMap.set("session", session);
    return ctx.next();
  } catch (e) {
    if (typeof e == "object" && e && "status" in e && e.status == 401) {
      const { data: flow } = await auth.createBrowserLoginFlow();
      console.debug("not logged in, redirect to %o", flow.request_url);

      throw ctx.redirect(302, flow.request_url);
    }
    throw e;
  }
};
