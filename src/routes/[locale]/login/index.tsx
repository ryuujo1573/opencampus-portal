import { component$, useSignal, useStore } from "@builder.io/qwik";
import { BsCheck, BsPersonFill, BsShieldFill } from "@qwikest/icons/bootstrap";

export default component$(() => {
  const accountChecking = useSignal(false);
  const formData = useStore<LoginForm>({ checks: {} }, { deep: true });

  type LoginForm = {
    account?: string;
    credential?: string;
    checks: Partial<Record<keyof LoginForm, boolean>>;
  };

  return (
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="card card-bordered h-auto w-auto border-base-content bg-base-100">
        <form
          class="card-body *:font-mono"
          preventdefault:submit
          onSubmit$={(e, form) => {
            const keys = ["account", "password"];
            const data = Object.fromEntries(
              keys.map((key) => [
                key,
                (form.elements.namedItem(key) as HTMLInputElement)?.value,
              ]),
            );

            console.log(data);
          }}
        >
          <div class="group-focus card-title select-none pb-2">
            {$localize`UNO LOGIN`}
          </div>
          <label
            class="input input-bordered flex items-center gap-2 data-[ok]:input-success"
            data-ok={formData.checks.account}
          >
            <BsPersonFill />
            <input
              type="text"
              class="grow"
              required
              name="account"
              placeholder={$localize`Uno Account`}
              onInput$={(
                _,
                el: HTMLInputElement & { debounceTimeout: number | undefined },
              ) => {
                accountChecking.value = true;
                clearTimeout(el.debounceTimeout);

                el.debounceTimeout = window.setTimeout(() => {
                  console.log("input mock check");
                  accountChecking.value = false;
                  formData.checks.account = true;
                }, 2000);
              }}
            />
            <span
              class={[
                "loading loading-ring loading-sm",
                !accountChecking.value && "hidden",
              ]}
            ></span>
            <span class={[, formData.checks.account !== true && "hidden"]}>
              <BsCheck />
            </span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <BsShieldFill />
            <input
              type="password"
              required
              class="grow"
              name="password"
              placeholder={$localize`Credential`}
            />
          </label>
          <label class="label flex justify-start gap-2">
            <input
              type="checkbox"
              class="checkbox-primary checkbox checkbox-sm"
            />
            <span class="label-texta">{$localize`Remember me`}</span>
          </label>
          <button type="submit" class="btn btn-outline btn-primary">
            &gt; {$localize`ENTER`}
          </button>
        </form>
      </div>
    </div>
  );
});
