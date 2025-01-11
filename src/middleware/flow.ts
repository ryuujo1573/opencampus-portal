import type { RequestHandler } from "@builder.io/qwik-city";
import {
  FrontendApiCreateBrowserLoginFlowRequest,
  FrontendApiCreateBrowserRegistrationFlowRequest,
} from "@ory/client";
import { auth } from "~/api/auth";

type FlowType = keyof FlowMapping;
type FlowMapping = {
  login: FrontendApiCreateBrowserLoginFlowRequest;
  register: FrontendApiCreateBrowserRegistrationFlowRequest;
};

export const flowHOF =
  <F extends FlowType>(flowType: F, opt: FlowMapping[F]): RequestHandler =>
  async (ctx) => {
    if (ctx.query.has("flow")) {
      return ctx.next();
    }
    let flowId = undefined;
    switch (flowType) {
      case "login" as "login": {
        const { data } = await auth.createBrowserLoginFlow({
          ...opt,
        });
        flowId = data.id;
        break;
      }
      case "register": {
        const { data } = await auth.createNativeRegistrationFlow(opt);
        flowId = data.id;
        break;
      }
    }
    if (flowId) {
      ctx.url.searchParams.set("flow", flowId);
      ctx.redirect(303, ctx.url.toString());
    }
    return;
  };
