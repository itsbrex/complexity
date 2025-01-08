import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

csLoaderRegistry.register({
  id: "plugin:thread:customThreadContainerWidth",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["thread:customThreadContainerWidth"]) return;

    const { value } =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:customThreadContainerWidth"
      ];

    if (value < 1100) return;

    $(document.body).css("--thread-width", `${value}px`);
  },
});
