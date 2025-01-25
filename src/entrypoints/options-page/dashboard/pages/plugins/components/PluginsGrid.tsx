import { PluginCard } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginCard";
import { PluginLockdownOverlay } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginLockdownOverlay";
import useCplxFeatureFlags from "@/services/cplx-api/feature-flags/useCplxFeatureFlags";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

type PluginGridProps = {
  pluginIds: PluginId[];
};

export function PluginsGrid({ pluginIds }: PluginGridProps) {
  const { data: featureFlags } = useCplxFeatureFlags();

  return (
    <div className="x-grid x-gap-4 sm:x-grid-cols-2 xl:x-grid-cols-3 2xl:x-grid-cols-4">
      {pluginIds.map((pluginId) => {
        const isForceDisabled =
          featureFlags?.anon?.forceDisable.includes(pluginId);

        return (
          <div key={pluginId} className="x-relative">
            <PluginCard
              pluginId={pluginId}
              isForceDisabled={!!isForceDisabled}
            />
            {isForceDisabled && <PluginLockdownOverlay />}
          </div>
        );
      })}
    </div>
  );
}
