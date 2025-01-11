import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { UserErrorCard } from "~/components/user-error-card";
import { FlowError, GenericError } from "@ory/client";
import { isAxiosError } from "axios";
import { auth } from "~/api/auth";
import { useLocation } from "@builder.io/qwik-city";

function isOAuth2Error(query: URLSearchParams) {
  return query.get("error") !== null;
}

function isQuerySet(x: any): x is string {
  return typeof x === "string" && x.length > 0;
}

/**
 * Returns an error object, either from Ory Identities or an OAuth2 error.
 *
 * @param query the query parameters as received from the request
 * @returns a FlowError object
 */
async function fetchError(query: URLSearchParams): Promise<FlowError> {
  if (isOAuth2Error(query)) {
    return {
      id: decodeURIComponent(query.get("error")!),
      error: {
        status: "OAuth2 Error",
        id: decodeURIComponent(query.get("error")!),
        message: decodeURIComponent(
          query.get("error_description") || "No description provided",
        ),
        ...(query.get("error_hint")
          ? { hint: decodeURIComponent(query.get("error_hint")!) }
          : {}),
        code: 599, // Dummy code to trigger the full error screen
      },
    };
  } else if (isQuerySet(query.get("id"))) {
    const res = await auth.getFlowError({ id: query.get("id")! });

    if (res.status !== 200) {
      throw new Error("Unexpected Error");
    }

    return res.data;
  }

  throw new Error("No error was found");
}

export default component$(() => {
  const location = useLocation();
  const resource = useResource$<FlowError>(async ({ track }) => {
    const query = new URLSearchParams(location.url.search);
    console.log(query)
    track(() => query.toString());
    try {
      return await fetchError(query);
    } catch (err) {
      if (isAxiosError(err)) {
        return err.response?.data.error;
      } else {
        return {
          id: "Failed to fetch error details",
          error: {
            message: (err as GenericError).message,
            code: 500,
          },
        };
      }
    }
  });

  return (
    <Resource
      value={resource}
      onResolved={(value) => (
        <UserErrorCard
          error={value}
          title="An error occurred"
          backUrl={location.prevUrl?.toString() || "/login"}
        />
      )}
    ></Resource>
  );
});
