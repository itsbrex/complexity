import { setupHomeComponentsObserver } from "@/features/plugins/_core/dom-observer/observers/home/home-components";
import { setupQueryBoxesObserver } from "@/features/plugins/_core/dom-observer/observers/query-boxes/query-boxes";
import { setupThreadComponentsObserver } from "@/features/plugins/_core/dom-observer/observers/thread/thread-components";
import { spaRouterStoreSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import { whereAmI } from "@/utils/utils";

export function setupCoreObservers() {
  initCoreObservers(whereAmI());

  spaRouterStoreSubscribe(({ url }) => {
    initCoreObservers(whereAmI(url));
  });
}

function initCoreObservers(location: ReturnType<typeof whereAmI>) {
  setupQueryBoxesObserver(location);
  setupHomeComponentsObserver(location);
  setupThreadComponentsObserver(location);
}
