import { component$ } from "@builder.io/qwik";
import { FlowError } from "@ory/client";

interface UserErrorCardProps {
  error: FlowError;
  cardImage?: string;
  title: string;
  backUrl: string;
}

export const UserErrorCard = component$(
  ({ error, cardImage, title, backUrl }: UserErrorCardProps) => {
    return (
      <div class="card mx-auto mt-20 w-full max-w-md bg-base-300 shadow-xl">
        <figure>
          <img
            src={cardImage}
            hidden={cardImage == undefined}
            alt="Logo"
            class="mx-auto mt-4 h-24 w-24"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-2xl">{title}</h2>
          <p class="text-red-500">{error.error?.message}</p>
          {error.error?.hint && (
            <p class="text-gray-500">{error.error?.hint}</p>
          )}
          <pre class="text-sm overflow-scroll">
            {
              JSON.stringify(error, null, 4)
            }
          </pre>
          <div class="card-actions mt-4 justify-center">
            <a href={backUrl} class="btn btn-primary">
              Go back
            </a>
          </div>
        </div>
      </div>
    );
  },
);
