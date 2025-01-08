import {
  globalDomObserverStore,
  GlobalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/query-boxes/observer-ids";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

function submitOnCtrlEnter(queryBoxes: GlobalDomObserverStore["queryBoxes"]) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["queryBox:submitOnCtrlEnter"]) return;

  Object.values(queryBoxes).forEach((queryBox) => {
    if (!queryBox) return;

    const $textarea = $(queryBox).find("textarea");

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
