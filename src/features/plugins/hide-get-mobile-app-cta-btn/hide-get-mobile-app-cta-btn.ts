import hideGetMobileAppCtaBtnCss from "@/features/plugins/hide-get-mobile-app-cta-btn/hide-get-mobile-app-cta-btn.css?inline";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { insertCss } from "@/utils/utils";

csLoaderRegistry.register({
  id: "plugin:hideGetMobileAppCtaBtn",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["hide-get-mobile-app-cta-btn"]) return;

    insertCss({
      css: hideGetMobileAppCtaBtnCss,
      id: "hide-get-mobile-app-cta-btn",
    });
  },
  dependencies: ["cache:pluginsStates"],
});
