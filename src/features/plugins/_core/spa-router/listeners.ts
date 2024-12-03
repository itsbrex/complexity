import { onMessage } from "webext-bridge/content-script";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { RouterEvent } from "@/features/plugins/_core/spa-router/spa-router.types";

onlyExtensionGuard();

export type DispatchEvents = {
  "spa-router:route-change": ({
    trigger,
    newUrl,
  }: {
    trigger: RouterEvent;
    newUrl: string;
  }) => void;
};

export function setupSpaRouterDispatchListeners() {
  onMessage("spa-router:route-change", ({ data: { trigger, newUrl } }) => {
    spaRouterStore.setState({ url: newUrl, trigger });
  });
}

type SpaRouterStore = {
  url: string;
  trigger: RouterEvent;
};

const spaRouterStore = createWithEqualityFn<SpaRouterStore>()(
  immer(
    (): SpaRouterStore => ({
      url: window.location.pathname,
      trigger: "push",
    }),
  ),
);

export const spaRouterStoreSubscribe = spaRouterStore.subscribe;

export const useSpaRouter = spaRouterStore;
