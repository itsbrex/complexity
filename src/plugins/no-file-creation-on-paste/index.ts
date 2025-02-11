import { isHotkeyPressed } from "react-hotkeys-hook";

import {
  queryBoxesDomObserverStore,
  QueryBoxesDomObserverStoreType,
} from "@/plugins/_core/dom-observers/query-boxes/store";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

const OBSERVER_ID = "no-file-creation-on-paste";

function noFileCreationOnPaste(
  queryBoxes: QueryBoxesDomObserverStoreType["main"],
) {
  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();

  if (!pluginsEnableStates["queryBox:noFileCreationOnPaste"]) return;

  Object.values(queryBoxes).forEach(($queryBox) => {
    if ($queryBox == null || !$queryBox.length) return;

    const $textarea = $queryBox.find("textarea");

    if (!$textarea.length || $textarea.attr(OBSERVER_ID)) return;

    $textarea.attr(OBSERVER_ID, "true");

    $textarea.on("paste", (e) => {
      const clipboardEvent = e.originalEvent as ClipboardEvent;

      if (clipboardEvent.clipboardData && isHotkeyPressed(Key.Shift)) {
        if (clipboardEvent.clipboardData.types.includes("text/plain")) {
          e.stopImmediatePropagation();
        }
      }
    });
  });
}

csLoaderRegistry.register({
  id: "plugin:queryBox:noFileCreationOnPaste",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    queryBoxesDomObserverStore.subscribe(
      (store) => ({
        main: store.main,
        followUp: store.followUp,
      }),
      ({ main, followUp }) => {
        noFileCreationOnPaste({
          ...main,
          ...followUp,
        });
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
});
