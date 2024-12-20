import zenModeCss from "@/features/plugins/zen-mode/zen-mode.css?inline";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { insertCss } from "@/utils/utils";

CsLoaderRegistry.register({
  id: "plugin:zenMode",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["zenMode"]) return;

    insertCss({
      css: zenModeCss,
      id: "zen-mode",
    });
  },
  dependencies: ["cache:pluginsStates"],
});
