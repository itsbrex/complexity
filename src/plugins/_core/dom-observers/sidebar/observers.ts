import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import {
  findLibraryButtonWrapper,
  findSidebarWrapper,
  findSpaceButtonWrapper,
} from "@/plugins/_core/dom-observers/sidebar/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "coreDomObserver:sidebar",
  loader: () => {
    if (
      !shouldEnableCoreObserver({
        coreObserverId: "coreDomObserver:sidebar",
      })
    )
      return;

    observeSidebar();

    isMobileStore.subscribe(() => {
      observeSidebar();
    });
  },
});

async function observeSidebar() {
  DomObserver.create("sidebar:wrapper", {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: findSidebarWrapper,
          id: "sidebar:wrapper",
        },
        {
          callback: findSpaceButtonWrapper,
          id: "sidebar:spaceButtonWrapper",
        },
        {
          callback: findLibraryButtonWrapper,
          id: "sidebar:libraryButtonWrapper",
        },
      ]),
  });
}
