import { LuLoaderCircle } from "react-icons/lu";
import { useRoutes } from "react-router-dom";

import { Input } from "@/components/ui/input";
import PluginDetailsWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-details/PluginDetailsWrapper";
import { PluginSections } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginSections";
import { TagsFilter } from "@/entrypoints/options-page/dashboard/pages/plugins/components/TagsFilter";
import { useFilteredPlugins } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilteredPlugins";
import {
  usePluginContext,
  type PluginFilters,
} from "@/entrypoints/options-page/dashboard/pages/plugins/PluginContext";
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
    <div className="x-size-full">
      <h1 className="x-sr-only x-text-2xl x-font-bold">Plugins</h1>

      <div className="x-flex x-size-full x-flex-col x-gap-4 md:x-mt-0">
        <div className="x-ml-auto x-flex x-w-full x-flex-row-reverse x-gap-4 md:x-w-fit md:x-flex-row md:x-justify-end">
          <TagsFilter />
          <Input
            type="search"
            placeholder="Search plugins..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="x-ml-auto x-text-balance x-text-center x-text-sm x-text-muted-foreground md:x-text-left">
          A full page reload on Perplexity.ai is required when changing plugin
          settings.
        </div>

        {isFetchingFeatureFlags ? (
          <div className="x-m-auto x-flex x-size-max x-items-center x-gap-2">
            <LuLoaderCircle className="x-animate-spin" />
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
