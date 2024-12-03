import type { BridgeMessage } from "webext-bridge";

import type { AllEventHandlers } from "@/entrypoints/webext-bridge-imports";
import type { MaybePromise } from "@/types/utils.types";

export type AllEventHandlers = BackgroundEventHandlers &
  NetworkInterceptInterceptorsEventHandlers &
  SpaRouterCsUtilEventHandlers &
  SpaRouterDispatchEventHandlers &
  ReactVdomEventHandlers;

type MessageFunctions = {
  onMessage<K extends keyof AllEventHandlers>(
    event: K,
    callback: (
      data: Parameters<AllEventHandlers[K]>[0] extends undefined
        ? Omit<BridgeMessage<AllEventHandlers[K]>, "data">
        : BridgeMessage<AllEventHandlers[K]> & {
            data: Parameters<AllEventHandlers[K]>[0];
          },
    ) => MaybePromise<ReturnType<AllEventHandlers[K]>>,
  ): void;

  sendMessage<K extends keyof AllEventHandlers>(
    event: K,
    payload: Parameters<AllEventHandlers[K]>[0],
    target:
      | "content-script"
      | "background"
      | "popup"
      | "options"
      | "window"
      | `content-script@${number}`
      | `devtools@${number}`,
  ): Promise<ReturnType<AllEventHandlers[K]>>;
};

declare module "webext-bridge/content-script" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/background" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/popup" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/options" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/window" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/devtools" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}
