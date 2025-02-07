import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import {
  CoreObserverId,
  CplxPluginMetadata,
} from "@/data/plugins-data/plugins-data.types";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import { PluginsStatesService } from "@/services/plugins-states";

export function shouldEnableCoreObserver({
  coreObserverId,
}: {
  coreObserverId: CoreObserverId;
}) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  return Object.entries(PLUGINS_METADATA).some((entry) => {
    const [pluginId, pluginMetadata] = entry as [
      PluginId,
      CplxPluginMetadata[PluginId],
    ];

    const isPluginEnabled = pluginsEnableStates[pluginId];

    const haveObserverAsDirectDependency =
      pluginMetadata.dependentDomObservers?.includes(coreObserverId);

    const haveObserverAsChildDependency =
      pluginMetadata.dependentDomObservers?.find((dependency) =>
        dependency.startsWith(coreObserverId),
      );

    return (
      isPluginEnabled &&
      (haveObserverAsDirectDependency || haveObserverAsChildDependency)
    );
  });
}
