import { onMessage } from "webext-bridge/content-script";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  createWithEqualityFn,
  useStoreWithEqualityFn,
} from "zustand/traditional";

import { RouterEvent } from "@/features/plugins/_core/spa-router/spa-router.types";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";

onlyExtensionGuard();

export type DispatchEvents = {
  "spa-router:route-change": ({
    state,
    trigger,
    newUrl,
  }: {
    state: "pending" | "complete";
    trigger: RouterEvent;
    newUrl: string;
  }) => void;
};

function setupSpaRouterDispatchListeners() {
  onMessage(
    "spa-router:route-change",
    ({ data: { state, trigger, newUrl } }) => {
      spaRouterStore.setState({ state, url: newUrl, trigger });
    },
  );
}

CsLoaderRegistry.register({
  id: "messaging:spaRouter",
  loader: setupSpaRouterDispatchListeners,
});

type SpaRouterStore = {
  state: "pending" | "complete";
  url: string;
  trigger: RouterEvent;
};

const spaRouterStore = createWithEqualityFn<SpaRouterStore>()(
  subscribeWithSelector(
    immer(
      (): SpaRouterStore => ({
        state: "complete",
        url: window.location.href,
        trigger: "push",
      }),
    ),
  ),
);

export const spaRouterStoreSubscribe = spaRouterStore.subscribe;

export const spaRouteChangeCompleteSubscribe = (
  callback: (url: string) => void,
) => {
  return spaRouterStore.subscribe(
    (state) => ({ state: state.state, url: state.url }),
    ({ state, url }) => {
      if (state === "complete") callback(url);
    },
  );
};

export const useSpaRouter = <T = SpaRouterStore>(
  selector?: (state: SpaRouterStore) => T,
) => {
  return useStoreWithEqualityFn(
    spaRouterStore,
    selector ??
      ((state) =>
        ({
          url: state.url,
          trigger: state.trigger,
        }) as T),
  );
};
