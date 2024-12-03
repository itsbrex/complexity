import { useMemo } from "react";

import { PLUGINS_METADATA, PluginTagValues } from "@/data/plugins/plugins-data";
import { UserGroup } from "@/services/cplx-api/feature-flags/cplx-feature-flags.types";
import useCplxFeatureFlags from "@/services/cplx-api/feature-flags/useCplxFeatureFlags";

type UseFilteredPluginsParams = {
  searchTerm: string;
  selectedTags: PluginTagValues[];
  excludeTags: PluginTagValues[];
};

export function useFilteredPlugins({
  searchTerm,
  selectedTags,
  excludeTags,
}: UseFilteredPluginsParams) {
  const userGroup: UserGroup = "anon";
  const { data: featureFlags } = useCplxFeatureFlags();

  const filteredPlugins = useMemo(() => {
    return Object.values(PLUGINS_METADATA)
      .filter((plugin) => {
        const isHiddenFromDashboard = featureFlags?.[userGroup]?.hide.includes(
          plugin.id,
        );
        const matchesSearch = (plugin.title + plugin.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const hasTags = plugin.tags !== undefined && plugin.tags.length > 0;

        const matchesTags =
          selectedTags.length === 0 ||
          (hasTags && selectedTags.every((tag) => plugin.tags!.includes(tag)));

        const hasExcludedTags =
          hasTags && excludeTags.some((tag) => plugin.tags!.includes(tag));

        return (
          matchesSearch &&
          matchesTags &&
          !hasExcludedTags &&
          !isHiddenFromDashboard
        );
      })
      .map((plugin) => plugin.id);
  }, [searchTerm, selectedTags, excludeTags, featureFlags, userGroup]);

  return filteredPlugins;
}
