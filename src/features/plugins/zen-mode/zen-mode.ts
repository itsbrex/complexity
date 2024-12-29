import zenModeCss from "@/features/plugins/zen-mode/zen-mode.css?inline";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
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

    const settings = ExtensionLocalStorageService.getCachedSync();

    if (settings?.plugins["zenMode"].persistent) {
      $("body").attr(
        "data-cplx-zen-mode",
        settings?.plugins["zenMode"].lastState.toString() ?? "false",
      );
    }

    if (settings?.plugins["zenMode"].alwaysHideRelatedQuestions) {
      $("body").attr(
        "data-cplx-zen-mode-always-hide-related-questions",
        "true",
      );
    }
  },
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
});
