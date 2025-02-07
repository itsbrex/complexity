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
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates["queryBox:noFileCreationOnPaste"]) return;

  Object.values(queryBoxes).forEach((component) => {
    if (component == null || !(component instanceof HTMLElement)) return;

    const $textarea = $(component).find("textarea");

    if (!$textarea.length) return;

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
  dependencies: ["cache:pluginsStates"],
});
