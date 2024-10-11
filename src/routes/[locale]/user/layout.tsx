import { type RequestHandler } from "@builder.io/qwik-city";
import { kratosAuth } from "~/middleware/kratos";

export const onRequest: RequestHandler = kratosAuth;
