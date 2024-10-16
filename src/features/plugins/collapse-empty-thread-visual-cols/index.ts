import styles from "@/features/plugins/collapse-empty-thread-visual-cols/collapse-empty-thread-visual-cols.css?inline";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

export default function setupCollapseEmptyThreadVisualCols(
  location: ReturnType<typeof whereAmI>,
) {
  if (
    !PluginsStatesService.getCachedSync()?.pluginsEnableStates
      ?.collapseEmptyThreadVisualCols
  )
    return;

  if (location !== "thread") return removeCss?.();

  removeCss = insertCss({
    css: styles,
    id: "cplx-collapse-empty-thread-visual-cols",
  });
}
