import hideGetMobileAppCtaBtnCss from "@/plugins/hide-get-mobile-app-cta-btn/styles.css?inline";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { insertCss } from "@/utils/utils";

csLoaderRegistry.register({
  id: "plugin:hideGetMobileAppCtaBtn",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["hide-get-mobile-app-cta-btn"]) return;

    insertCss({
      css: hideGetMobileAppCtaBtnCss,
      id: "hide-get-mobile-app-cta-btn",
    });
  },
});
