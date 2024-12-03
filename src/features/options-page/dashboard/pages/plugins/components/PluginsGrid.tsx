import { PluginCard } from "@/features/options-page/dashboard/pages/plugins/components/PluginCard";
import { PluginLockdownOverlay } from "@/features/options-page/dashboard/pages/plugins/components/PluginLockdownOverlay";
import useCplxFeatureFlags from "@/services/cplx-api/feature-flags/useCplxFeatureFlags";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

type PluginGridProps = {
  pluginIds: PluginId[];
};

export function PluginsGrid({ pluginIds }: PluginGridProps) {
  const { data: featureFlags } = useCplxFeatureFlags();

  return (
    <div className="tw-grid tw-gap-4 sm:tw-grid-cols-2 xl:tw-grid-cols-3 2xl:tw-grid-cols-4">
      {pluginIds.map((pluginId) => (
        <div key={pluginId} className="tw-relative">
          <PluginCard pluginId={pluginId} />
          {featureFlags?.anon?.forceDisable.includes(pluginId) && (
            <PluginLockdownOverlay />
          )}
        </div>
      ))}
    </div>
  );
}
