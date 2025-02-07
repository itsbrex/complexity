import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import {
  CplxPluginMetadata,
  UiGroup,
} from "@/data/plugins-data/plugins-data.types";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import { PluginsStatesService } from "@/services/plugins-states";

export function shouldEnableUiGroup({ uiGroup }: { uiGroup: UiGroup }) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  return Object.entries(PLUGINS_METADATA).some((entry) => {
    const [pluginId, pluginMetadata] = entry as [
      PluginId,
      CplxPluginMetadata[PluginId],
    ];

    const isPluginEnabled = pluginsEnableStates[pluginId];

    const haveUiGroupAsDirectDependency =
      pluginMetadata.uiGroup?.includes(uiGroup);

    const haveUiGroupAsChildDependency = pluginMetadata.uiGroup?.find(
      (dependency) => dependency.startsWith(uiGroup),
    );

    return (
      isPluginEnabled &&
      (haveUiGroupAsDirectDependency || haveUiGroupAsChildDependency)
    );
  });
}
