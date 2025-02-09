import { PluginCard } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginCard";
import { PluginLockDownOverlay } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginLockDownOverlay";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import { PluginsStates } from "@/services/plugins-states/utils";

type PluginGridProps = {
  pluginIds: PluginId[];
};

export function PluginsGrid({ pluginIds }: PluginGridProps) {
  const { pluginsStates } = usePluginsStates();

  return (
    <div className="x-grid x-gap-4 sm:x-grid-cols-2 xl:x-grid-cols-3 2xl:x-grid-cols-4">
      {pluginIds.map((pluginId) => {
        if (pluginsStates[pluginId].isHiddenFromDashboard) return null;

        const isLockedDown =
          pluginsStates[pluginId].isOutdated ||
          pluginsStates[pluginId].isOnMaintenance ||
          pluginsStates[pluginId].isForceDisabled;

        return (
          <div key={pluginId} className="x-relative">
            <PluginCard pluginId={pluginId} isForceDisabled={isLockedDown} />
            {isLockedDown && (
              <PluginLockDownOverlay
                text={getLockdownText(pluginId, pluginsStates)}
                subText={getLockdownSubText(pluginId, pluginsStates)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function getLockdownText(pluginId: PluginId, pluginsStates: PluginsStates) {
  const { isOutdated, isOnMaintenance, isForceDisabled } =
    pluginsStates[pluginId];

  if (isForceDisabled) return "This plugin is not available at the moment";
  if (isOnMaintenance) return "This plugin is on maintenance";
  if (isOutdated) return "This plugin is outdated";

  return "";
}

function getLockdownSubText(pluginId: PluginId, pluginsStates: PluginsStates) {
  const { isOutdated, isOnMaintenance, isForceDisabled } =
    pluginsStates[pluginId];

  if (isForceDisabled) return "Please check back later";
  if (isOnMaintenance) return "Please check back later";
  if (isOutdated) return "Please update the extension";

  return "";
}
