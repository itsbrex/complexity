import { spaRouterStoreSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import { handlePromptSave } from "@/features/plugins/query-box/prompt-history/utils";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

csLoaderRegistry.register({
  id: "plugin:queryBox:promptHistory:listeners",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getCachedSync().pluginsEnableStates;
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates?.["queryBox:slashCommandMenu:promptHistory"] ||
      !settings.plugins["queryBox:slashCommandMenu:promptHistory"].trigger
        .onNavigation
    )
      return;

    // Soft navigation
    spaRouterStoreSubscribe((params) => {
      slashCommandMenuStore.getState().setIsOpen(false);

      if (params.state === "pending") {
        handlePromptSave({
          url: params.url,
          type: "soft",
        });
      }
    });

    // Hard navigation
    window.addEventListener("beforeunload", () => {
      handlePromptSave({ url: window.location.pathname, type: "hard" });
    });
  },
});
