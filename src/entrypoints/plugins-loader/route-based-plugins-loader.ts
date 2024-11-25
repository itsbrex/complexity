import { setupQueryBoxesObserver } from "@/features/plugins/_core/dom-observer/observers/query-boxes/query-boxes";
import { setupThreadComponentsObserver } from "@/features/plugins/_core/dom-observer/observers/thread/thread-components";
import { spaRouterStoreSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import setupCollapseEmptyThreadVisualCols from "@/features/plugins/thread/collapse-empty-thread-visual-cols";
import { setupDragNDropFileToUploadInThread } from "@/features/plugins/thread/drag-n-drop-file-to-upload-in-thread";
import { whereAmI } from "@/utils/utils";

export function setupRouteBasedPlugins() {
  initCoreObservers(whereAmI());
  initPlugins(whereAmI());

  spaRouterStoreSubscribe(({ url }) => {
    initCoreObservers(whereAmI(url));
    initPlugins(whereAmI(url));
  });
}

function initCoreObservers(location: ReturnType<typeof whereAmI>) {
  setupQueryBoxesObserver(location);
  setupThreadComponentsObserver(location);
}

function initPlugins(location: ReturnType<typeof whereAmI>) {
  setupDragNDropFileToUploadInThread(location);
  setupCollapseEmptyThreadVisualCols(location);
}
