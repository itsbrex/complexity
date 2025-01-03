import alwaysHideRelatedQuestionsCss from "@/features/plugins/zen-mode/always-hide-related-questions.css?inline";
import alwaysHideVisualColsCss from "@/features/plugins/zen-mode/always-hide-visual-cols.css?inline";
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
      $(document.body).attr(
        "data-cplx-zen-mode",
        settings?.plugins["zenMode"].lastState.toString() ?? "false",
      );
    }

    if (settings?.plugins["zenMode"].alwaysHideRelatedQuestions) {
      insertCss({
        css: alwaysHideRelatedQuestionsCss,
        id: "always-hide-related-questions",
      });

      $(document.body).attr(
        "data-cplx-zen-mode-always-hide-related-questions",
        "true",
      );
    }

    if (settings?.plugins["zenMode"].alwaysHideVisualCols) {
      insertCss({
        css: alwaysHideVisualColsCss,
        id: "always-hide-visual-cols",
      });

      $(document.body).attr(
        "data-cplx-zen-mode-always-hide-visual-cols",
        "true",
      );
    }
  },
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
});
