import {
  queryBoxesDomObserverStore,
  QueryBoxesDomObserverStoreType,
} from "@/plugins/_core/dom-observers/query-boxes/store";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

const OBSERVER_ID = "submit-on-ctrl-enter";

function submitOnCtrlEnter(queryBoxes: QueryBoxesDomObserverStoreType["main"]) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates["queryBox:submitOnCtrlEnter"]) return;

  Object.values(queryBoxes).forEach((component) => {
    if (component == null || !(component instanceof HTMLElement)) return;

    const $textarea = $(component).find("textarea");

    if (!$textarea.length) return;

    if (!$textarea.length || $textarea.attr(OBSERVER_ID)) return;

    $textarea.attr(OBSERVER_ID, "true");

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
    queryBoxesDomObserverStore.subscribe(
      (store) => ({
        main: store.main,
        followUp: store.followUp,
      }),
      ({ main, followUp }) => {
        submitOnCtrlEnter({
          ...main,
          ...followUp,
        });
      },
    );
  },
  dependencies: ["cache:pluginsStates"],
});
