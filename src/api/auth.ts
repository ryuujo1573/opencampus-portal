import { FrontendApi, Configuration } from "@ory/client";

export const auth = new FrontendApi(
  new Configuration({
    apiKey: import.meta.env.VITE_KRATOS_API_KEY,
    basePath: import.meta.env.VITE_KRATOS_PUBLIC_URL ?? "http://127.0.0.1:4433",
    baseOptions: {
      // Ensures that cookies are included in CORS requests:
      withCredentials: true,
    },
  }),
);
