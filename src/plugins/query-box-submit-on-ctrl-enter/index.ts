import {
  globalDomObserverStore,
  GlobalDomObserverStore,
} from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/plugins/_core/dom-observers/query-boxes/observer-ids";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

function submitOnCtrlEnter(queryBoxes: GlobalDomObserverStore["queryBoxes"]) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["queryBox:submitOnCtrlEnter"]) return;

  Object.values(queryBoxes).forEach((component) => {
    if (component == null || !(component instanceof HTMLElement)) return;

    const $textarea = $(component).find("textarea");

    if (!$textarea.length) return;

    if (!$textarea.length || $textarea.attr(OBSERVER_ID.SUBMIT_ON_CTRL_ENTER))
      return;

    $textarea.attr(OBSERVER_ID.SUBMIT_ON_CTRL_ENTER, "true");

    $textarea.on("keydown", (e) => {
      if (e.key === "Enter") {
        if (e.ctrlKey || e.metaKey) return;
        e.stopPropagation();
      }
    });
  });
}

csLoaderRegistry.register({
  id: "plugin:queryBox:submitOnCtrlEnter",
  loader: () => {
    globalDomObserverStore.subscribe(
      (state) => state.queryBoxes,
      (queryBoxes) => {
        submitOnCtrlEnter(queryBoxes);
      },
    );
  },
  dependencies: ["cache:pluginsStates"],
});
