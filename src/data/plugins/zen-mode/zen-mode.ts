import zenModeCss from "@/data/plugins/zen-mode/zen-mode.css?inline";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { insertCss } from "@/utils/utils";

export function setupZenMode() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["zenMode"]) return;

  insertCss({
    css: zenModeCss,
    id: "zen-mode",
  });
}
