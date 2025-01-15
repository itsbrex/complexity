import "@/utils/jquery.extensions";
import "@/entrypoints/content-scripts/loaders";

import { APP_CONFIG } from "@/app.config";
import { showInitializingIndicator } from "@/components/loading-indicator";
import { csUiRootCss } from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/CsUiRoot";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { contentScriptGuard } from "@/utils/content-scripts-guard";
import { insertCss } from "@/utils/utils";

$(() => {
  if (!APP_CONFIG.IS_DEV)
    insertCss({
      css: csUiRootCss,
      id: "cs-ui-root",
    });
  showInitializingIndicator();
});

contentScriptGuard();

csLoaderRegistry.executeAll();
