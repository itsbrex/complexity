import { isHotkeyPressed } from "react-hotkeys-hook";

import {
  globalDomObserverStore,
  GlobalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/query-boxes/observer-ids";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

function noFileCreationOnPaste(
  queryBoxes: GlobalDomObserverStore["queryBoxes"],
) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["queryBox:noFileCreationOnPaste"]) return;

  Object.values(queryBoxes).forEach((queryBox) => {
    if (!queryBox) return;

    const $textarea = $(queryBox).find("textarea");

    if (!$textarea.length) return;

    if (
      !$textarea.length ||
      $textarea.attr(OBSERVER_ID.NO_FILE_CREATION_ON_PASTE)
    )
      return;

    $textarea.attr(OBSERVER_ID.NO_FILE_CREATION_ON_PASTE, "true");

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

CsLoaderRegistry.register({
  id: "plugin:queryBox:noFileCreationOnPaste",
  loader: () => {
    globalDomObserverStore.subscribe(
      (state) => state.queryBoxes,
      (queryBoxes) => {
        noFileCreationOnPaste(queryBoxes);
      },
    );
  },
  dependencies: ["cache:pluginsStates"],
});
