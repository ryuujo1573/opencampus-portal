import { component$ } from "@builder.io/qwik";
import { useSession } from "~/routes/layout";

export default component$(() => {
  const session = useSession();
  return (
    <div class="prose">
      <h3>You are logged in as:</h3>
      <pre>{JSON.stringify(session.value)}</pre>
    </div>
  );
});
