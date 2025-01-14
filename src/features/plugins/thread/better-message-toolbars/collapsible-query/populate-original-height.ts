import {
  ExtendedMessageBlock,
  globalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

function populateOriginalHeight({
  messageBlocks,
}: {
  messageBlocks: ExtendedMessageBlock[];
}) {
  messageBlocks.forEach(({ $query }) => {
    const queryContainerOriginalHeight = $query.attr("original-height");
    if (queryContainerOriginalHeight == null) {
      const originalHeight = $query[0]?.getBoundingClientRect().height ?? 0;
      $query.attr("original-height", originalHeight);
      if (originalHeight > 300) {
        $query.attr("data-cplx-query-collapsed", "true");
      }
    }
  });
}

csLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:collapsibleQuery",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates?.["thread:betterMessageToolbars"] ||
      !settings.plugins["thread:betterMessageToolbars"].collapsibleQuery
    )
      return;

    globalDomObserverStore.subscribe(
      (state) => ({
        messageBlocks: state.threadComponents.messageBlocks,
      }),
      ({ messageBlocks }) => {
        populateOriginalHeight({
          messageBlocks: messageBlocks ?? [],
        });
      },
    );
  },
});
