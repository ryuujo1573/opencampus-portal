import {
  $,
  component$,
  InputHTMLAttributes,
  JSXOutput,
  LabelHTMLAttributes,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";
import { BsCheck, BsPersonFill, BsShieldFill } from "@qwikest/icons/bootstrap";
import { getUrlForFlow } from "~/api/flow";
import { pruneObject } from "~/utils/common";
import { useFlow } from "./layout";
import { UiNodeInputAttributes } from "@ory/client";

interface ElementMixin {
  check: boolean;
  icon: JSXOutput;
  label: LabelHTMLAttributes<HTMLLabelElement>;
  input: InputHTMLAttributes<HTMLInputElement>;
}
const labelElementMapping: Record<number, Partial<ElementMixin> | undefined> = {
  1070002: {
    check: true,
    icon: <BsPersonFill />,
    label: {
      class:
        "input input-bordered relative flex items-center gap-2 data-[ok]:input-success data-[error]:input-error",
    },
    input: {
      placeholder: $localize`Uno Account`,
    },
  },
  1070001: {
    icon: <BsShieldFill />,
    label: {
      class: "input input-bordered relative flex items-center gap-2",
    },
    input: {
      placeholder: $localize`Credential`,
    },
  },
  1010022: {
    label: {
      class: "btn btn-outline btn-primary relative disabled:disabled",
      // class: "hidden",
      children: <>&gt; {$localize`ENTER`} &nbsp;</>,
    },
    input: {
      class: "hidden",
    },
  },
};

export default component$(() => {
  const formData = useStore<LoginForm>({ checks: {} }, { deep: true });
  const loading = useSignal(false);

  const loginFlow = useFlow();
  console.log(loginFlow.value.ui?.nodes.map((node) => node.attributes));
  if (loginFlow.value.error) {
    throw loginFlow.value.error;
  }

  type FieldName = ["identifier", "password"][number];
  type LoginForm = {
    [K in FieldName]?: string;
  } & {
    checks: Partial<Record<FieldName, number>>;
  };

  const login = $(async (uid: string, secret: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // fetch("", {
    //   method: "POST",
    //   body: new FormData(),
    // });
  });

  return (
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="card card-bordered h-auto w-auto border-base-content bg-base-100">
        <form
          class="card-body *:font-mono"
          // preventdefault:submit
          action={loginFlow.value.ui?.action}
          method={loginFlow.value.ui?.method}
          onSubmit$={async (e, form) => {
            const keys = ["identifier", "password"];
            const data = Object.fromEntries(
              keys.map((key) => [
                key,
                (form.elements.namedItem(key) as HTMLInputElement)?.value,
              ]),
            );

            console.log(formData);
            loading.value = true;
            console.log("lock");
            await login(data.account, data.password);
            console.log("unlock");
            loading.value = false;
          }}
        >
          <div class="group-focus card-title select-none pb-2">
            {$localize`UNO LOGIN`}
          </div>
          {loginFlow.value.ui?.nodes.map((node) => {
            const { node_type, ...rest } = node.attributes;
            const meta = node.meta;
            const id = meta.label?.id ?? 0;
            if (node_type == "input") {
              const attr = rest as UiNodeInputAttributes;
              const name = attr.name as FieldName;
              const setCheck = $((status?: number) => {
                if (status === undefined) {
                  delete formData.checks[name];
                  return;
                }
                formData.checks[name] = status;
              });
              const checkEquals = (val: number) => formData.checks[name] == val;
              return meta.label ? (
                <label
                  key={name}
                  {...labelElementMapping[id]?.label}
                  data-ok={checkEquals(2)}
                  data-error={checkEquals(3)}
                  // @ts-ignore
                  disabled={loading.value}
                >
                  {labelElementMapping[id]?.label?.children}
                  {labelElementMapping[id]?.icon}
                  <input
                    class="grow"
                    {...(attr as object)}
                    {...labelElementMapping[id]?.input}
                    onInput$={(
                      _,
                      el: HTMLInputElement & {
                        debounceTimeout: number | undefined;
                      },
                    ) => {
                      if (!labelElementMapping[id]?.check) {
                        return;
                      }
                      setCheck();
                      clearTimeout(el.debounceTimeout);

                      el.debounceTimeout = window.setTimeout(async () => {
                        console.log(
                          "on_check",
                          JSON.stringify(formData.checks),
                        );
                        formData.checks[name] = 1;
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1500 + Math.random() * 1000),
                        );
                        console.log("on_check_finished");
                        if (el.value.match(/a/g)) {
                          setCheck(2);
                        } else {
                          setCheck(3);
                        }
                      }, 500);
                    }}
                  ></input>

                  <span
                    class={[
                      "loading loading-ring loading-sm absolute right-4",
                      formData.checks[name] !== 1 && "hidden",
                    ]}
                  ></span>
                  {formData.checks[name] === 2 && (
                    <span class="absolute right-4">
                      <BsCheck />
                    </span>
                  )}
                </label>
              ) : (
                <input {...(attr as object)} />
              );
            }
          })}
          {loading.value && (
            <span class="loading loading-infinity loading-md self-center"></span>
          )}
          {/* <label class="label flex justify-start gap-2">
            <input
              type="checkbox"
              class="checkbox-primary checkbox checkbox-sm"
            />
            <span class="label-text">{$localize`Remember me`}</span>
          </label> */}
        </form>
      </div>
    </div>
  );
});

/**
 * inject flowId when GET
 * @param ctx QwikCity RequestEvent
 */
export const onGet: RequestHandler = (ctx) => {
  const {
    flow: flowId,
    aal,
    refresh,
    return_to = "/user",
    organization,
    via,
    login_challenge,
  } = Object.fromEntries(ctx.query.entries());
  if (flowId == null) {
    console.debug("missing flowId, initialize login flow");
    throw ctx.redirect(
      303,
      getUrlForFlow(
        "login",
        pruneObject({
          aal,
          refresh,
          return_to,
          organization,
          via,
          login_challenge,
        }),
      ),
    );
  }
};
