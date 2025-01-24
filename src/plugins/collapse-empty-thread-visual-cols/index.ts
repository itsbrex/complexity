import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import styles from "@/plugins/collapse-empty-thread-visual-cols/styles.css?inline";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

function setupCollapseEmptyThreadVisualCols(
  location: ReturnType<typeof whereAmI>,
) {
  if (
    !PluginsStatesService.getCachedSync()?.pluginsEnableStates?.[
      "thread:collapseEmptyThreadVisualCols"
    ]
  )
    return;

  if (location !== "thread") return removeCss?.();

  removeCss = insertCss({
    css: styles,
    id: "cplx-collapse-empty-thread-visual-cols",
  });
}

csLoaderRegistry.register({
  id: "plugin:thread:collapseEmptyThreadVisualCols",
  loader: () => {
    setupCollapseEmptyThreadVisualCols(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      setupCollapseEmptyThreadVisualCols(whereAmI(url));
    });
  },
  dependencies: ["cache:pluginsStates"],
});
