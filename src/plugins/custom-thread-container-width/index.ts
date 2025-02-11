import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "plugin:thread:customThreadContainerWidth",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["thread:customThreadContainerWidth"]) return;

    const { value } =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:customThreadContainerWidth"
      ];

    if (value < 1100) return;

    $(document.body).css("--thread-width", `${value}px`);
  },
});
