import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { setupQueryBoxesObserver } from "@/features/plugins/_core/dom-observer/observers/query-boxes/query-boxes";
import { setupThreadComponentsObserver } from "@/features/plugins/_core/dom-observer/observers/thread/thread-components";
import { spaRouterStoreSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import setupCollapseEmptyThreadVisualCols from "@/features/plugins/collapse-empty-thread-visual-cols";
import { setupDragNDropFileToUploadInThread } from "@/features/plugins/drag-n-drop-file-to-upload-in-thread";
import { noFileCreationOnPaste } from "@/features/plugins/query-box/no-file-creation-on-paste";
import { whereAmI } from "@/utils/utils";

export function setupDomBasedPlugins() {
  globalDomObserverStore.subscribe(({ queryBoxes }) => {
    noFileCreationOnPaste(queryBoxes);
  });
}

export function setupRouteBasedPlugins() {
  const initCorePlugins = (location: ReturnType<typeof whereAmI>) => {
    setupQueryBoxesObserver(location);
    setupThreadComponentsObserver(location);
  };

  const initPlugins = (location: ReturnType<typeof whereAmI>) => {
    setupDragNDropFileToUploadInThread(location);
    setupCollapseEmptyThreadVisualCols(location);
  };

  initCorePlugins(whereAmI());
  initPlugins(whereAmI());

  spaRouterStoreSubscribe(({ url }) => {
    initCorePlugins(whereAmI(url));
    initPlugins(whereAmI(url));
  });
}
