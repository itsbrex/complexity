import { GlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/query-boxes/observer-ids";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

export function noFileCreationOnPaste(
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

    $(document).off(
      "keydown.noFileCreationOnPaste keyup.noFileCreationOnPaste",
    );

    let isShiftKeyPressed = false;

    const handleKeyDown = (e: JQuery.TriggeredEvent) => {
      if (e.key === "Shift") isShiftKeyPressed = true;
    };

    const handleKeyUp = (e: JQuery.TriggeredEvent) => {
      if (e.key === "Shift") isShiftKeyPressed = false;
    };

    $(document).on("keydown.noFileCreationOnPaste", handleKeyDown);
    $(document).on("keyup.noFileCreationOnPaste", handleKeyUp);

    $textarea.on("paste", (e) => {
      const clipboardEvent = e.originalEvent as ClipboardEvent;

      if (clipboardEvent.clipboardData && isShiftKeyPressed) {
        if (clipboardEvent.clipboardData.types.includes("text/plain")) {
          e.stopImmediatePropagation();
        }
      }
    });
  });
}
