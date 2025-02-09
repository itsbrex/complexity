import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

function populateOriginalHeight({
  messageBlocks,
}: {
  messageBlocks: MessageBlock[];
}) {
  messageBlocks.forEach(({ nodes: { $query } }) => {
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
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates["thread:betterMessageToolbars"] ||
      !settings.plugins["thread:betterMessageToolbars"].collapsibleQuery
    )
      return;

    threadMessageBlocksDomObserverStore.subscribe(
      (store) => ({
        messageBlocks: store.messageBlocks,
      }),
      ({ messageBlocks }) => {
        populateOriginalHeight({
          messageBlocks: messageBlocks ?? [],
        });
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
});
