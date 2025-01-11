type FlowType = keyof FlowMapping;
type FlowMapping = {
  login: {};
};

export const getUrlForFlow = <TFLow extends FlowType>(
  flowType: TFLow,
  opts?: FlowMapping[TFLow],
  baseUri: string = import.meta.env.VITE_KRATOS_PUBLIC_URL,
) =>
  new URL(
    `/self-service/${flowType}/browser${
      opts != undefined && Object.keys(opts).length
        ? "?" + new URLSearchParams(opts)
        : ""
    }`,
    baseUri,
  ).toString();
