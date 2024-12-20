import styles from "@/features/plugins/thread/collapse-empty-thread-visual-cols/collapse-empty-thread-visual-cols.css?inline";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
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

CsLoaderRegistry.register({
  id: "plugin:thread:collapseEmptyThreadVisualCols",
  loader: () => {
    setupCollapseEmptyThreadVisualCols(whereAmI());
  },
  dependencies: ["cache:pluginsStates"],
});
