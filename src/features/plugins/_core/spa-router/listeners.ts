import { onMessage } from "webext-bridge/content-script";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { RouterEvent } from "@/features/plugins/_core/spa-router/spa-router.types";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";

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

function setupSpaRouterDispatchListeners() {
  onMessage("spa-router:route-change", ({ data: { trigger, newUrl } }) => {
    spaRouterStore.setState({ url: newUrl, trigger });
  });
}

CsLoaderRegistry.register({
  id: "messaging:spaRouter",
  loader: setupSpaRouterDispatchListeners,
});

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
