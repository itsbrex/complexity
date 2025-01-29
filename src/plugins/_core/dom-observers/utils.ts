import {
  CoreObserverId,
  CplxPluginMetadata,
  PLUGINS_METADATA,
} from "@/data/plugins/plugins-data";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import { PluginsStatesService } from "@/services/plugins-states";

export function shouldEnableCoreObserver({
  coreObserverName,
}: {
  coreObserverName: CoreObserverId;
}) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  return Object.entries(PLUGINS_METADATA).some((entry) => {
    const [pluginId, pluginMetadata] = entry as [
      PluginId,
      CplxPluginMetadata[PluginId],
    ];

    return (
      pluginsEnableStates[pluginId] &&
      pluginMetadata.dependentCorePlugins?.includes(coreObserverName)
    );
  });
}
