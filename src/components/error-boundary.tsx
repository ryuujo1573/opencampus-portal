import {
  $,
  component$,
  Slot,
  useOnWindow,
  useSignal,
} from "@builder.io/qwik";

export const ErrorBoundary = component$((props) => {
  const wordWrap = useSignal(false);
  const error = useSignal<Error>();

  // useOn("error-boundary", qrl("/runtime", "ErrorBoundary", [error]));
  // const boundary = useErrorBoundary();

  useOnWindow(
    "load",
    $(() => {
      wordWrap.value = localStorage.getItem("wordWrap") == "true";
    }),
  );

  if (error.value)
    return (
      <>
        <div class={["prose m-6", wordWrap.value && "text-wrap"]}>
          <h1>Error. </h1>
          <label class="label justify-start gap-2">
            <input
              type="checkbox"
              class="toggle"
              checked={wordWrap.value}
              onChange$={(e, el) => {
                localStorage.setItem("wordWrap", String(el.checked));
                console.log(el.checked);
                wordWrap.value = el.checked;
              }}
            />
            <span class="label-text">Wrap</span>
          </label>
          <pre class={[wordWrap.value && "text-wrap"]}>
            {JSON.stringify(error, null, 4)}
          </pre>
        </div>
      </>
    );
  else return <Slot />;
});
