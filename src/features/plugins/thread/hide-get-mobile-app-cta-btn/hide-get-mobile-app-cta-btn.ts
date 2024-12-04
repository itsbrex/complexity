import hideGetMobileAppCtaBtnCss from "@/features/plugins/thread/hide-get-mobile-app-cta-btn/hide-get-mobile-app-cta-btn.css?inline";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { insertCss } from "@/utils/utils";

export function setupHideGetMobileAppCtaBtn() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["hide-get-mobile-app-cta-btn"]) return;

  insertCss({
    css: hideGetMobileAppCtaBtnCss,
    id: "hide-get-mobile-app-cta-btn",
  });
}
