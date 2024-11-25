import { spaRouterStoreSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import { setupCollapseEmptyThreadVisualCols } from "@/features/plugins/thread/collapse-empty-thread-visual-cols/collapse-empty-thread-visual-cols";
import { setupDragNDropFileToUploadInThread } from "@/features/plugins/thread/drag-n-drop-file-to-upload-in-thread/drag-n-drop-file-to-upload-in-thread";
import { whereAmI } from "@/utils/utils";

export function setupRouteBasedPlugins() {
  initPlugins(whereAmI());

  spaRouterStoreSubscribe(({ url }) => {
    initPlugins(whereAmI(url));
  });
}

function initPlugins(location: ReturnType<typeof whereAmI>) {
  setupDragNDropFileToUploadInThread(location);
  setupCollapseEmptyThreadVisualCols(location);
}
