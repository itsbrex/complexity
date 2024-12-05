import { LuLoader2 } from "react-icons/lu";
import { useRoutes } from "react-router-dom";

import { Input } from "@/components/ui/input";
import PluginDetailsWrapper from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/PluginDetailsWrapper";
import { PluginSections } from "@/features/options-page/dashboard/pages/plugins/components/PluginSections";
import { TagsFilter } from "@/features/options-page/dashboard/pages/plugins/components/TagsFilter";
import { useFilteredPlugins } from "@/features/options-page/dashboard/pages/plugins/hooks/useFilteredPlugins";
import {
  usePluginContext,
  type PluginFilters,
} from "@/features/options-page/dashboard/pages/plugins/PluginContext";
import useCplxFeatureFlags from "@/services/cplx-api/feature-flags/useCplxFeatureFlags";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

function PluginsListing() {
  const { settings } = useExtensionLocalStorage();
  const { isFetching: isFetchingFeatureFlags } = useCplxFeatureFlags();
  const [filters, setFilters] = usePluginContext();

  const filteredPluginIds = useFilteredPlugins({
    searchTerm: filters.searchTerm,
    selectedTags: filters.tags,
    excludeTags: filters.excludeTags,
  });

  const { favoritePluginIds, otherPluginIds } = usePluginCategories({
    filteredPluginIds,
    favoritePluginIds: settings?.favoritePluginIds,
  });

  const handleSearchChange = usePluginSearch(setFilters);

  return (
    <div className="tw-w-full">
      <h1 className="tw-sr-only tw-text-2xl tw-font-bold">Plugins</h1>

      <div className="tw-flex tw-flex-col tw-gap-4 md:tw-mt-0">
        <div className="tw-ml-auto tw-flex tw-w-full tw-flex-row-reverse tw-gap-4 md:tw-w-fit md:tw-flex-row md:tw-justify-end">
          <TagsFilter />
          <Input
            type="search"
            placeholder="Search plugins..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="tw-ml-auto tw-text-balance tw-text-center tw-text-sm tw-text-muted-foreground md:tw-text-left">
          A full page reload on Perplexity.ai is required when changing plugin
          settings.
        </div>

        {isFetchingFeatureFlags ? (
          <div className="tw-flex tw-items-center tw-gap-2">
            <LuLoader2 className="tw-animate-spin" />
            Fetching plugins...
          </div>
        ) : (
          <PluginSections
            favoritePluginIds={favoritePluginIds}
            otherPluginIds={otherPluginIds}
          />
        )}
      </div>
    </div>
  );
}

function usePluginCategories({
  filteredPluginIds,
  favoritePluginIds,
}: {
  filteredPluginIds: PluginId[];
  favoritePluginIds?: PluginId[];
}) {
  return useMemo(() => {
    const favorites = filteredPluginIds.filter((pluginId) =>
      favoritePluginIds?.includes(pluginId),
    );
    const others = filteredPluginIds.filter(
      (pluginId) => !favoritePluginIds?.includes(pluginId),
    );
    return { favoritePluginIds: favorites, otherPluginIds: others };
  }, [filteredPluginIds, favoritePluginIds]);
}

type SetFiltersFunction = (
  updater: (prev: PluginFilters) => PluginFilters,
) => void;

function usePluginSearch(setFilters: SetFiltersFunction) {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev: PluginFilters) => ({
        ...prev,
        searchTerm: e.target.value,
      }));
    },
    [setFilters],
  );
}

export default function PluginsPage() {
  return useRoutes([
    {
      path: ":pluginId/*",
      element: <PluginDetailsWrapper />,
    },
    {
      path: "*",
      element: <PluginsListing />,
    },
  ]);
}
