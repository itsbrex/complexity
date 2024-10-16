import { useMemo } from "react";

import {
  PLUGINS_METADATA,
  PluginTagValues,
} from "@/data/consts/plugins/plugins-data";
import { UserGroup } from "@/services/cplx-api/feature-flags/cplx-feature-flags.types";
import useCplxFeatureFlags from "@/services/cplx-api/feature-flags/useCplxFeatureFlags";

export function useFilteredPlugins(
  searchTerm: string,
  selectedTags: PluginTagValues[],
) {
  const userGroup: UserGroup = "anon";
  const { data: featureFlags } = useCplxFeatureFlags();

  const filteredPlugins = useMemo(() => {
    return Object.values(PLUGINS_METADATA)
      .filter((plugin) => {
        const isHiddenFromDashboard = featureFlags?.[userGroup]?.hide.includes(
          plugin.id,
        );
        const matchesSearch = plugin.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const hasTags = plugin.tags !== undefined && plugin.tags.length > 0;
        const matchesTags =
          selectedTags.length === 0 ||
          (hasTags && selectedTags.every((tag) => plugin.tags!.includes(tag)));

        return matchesSearch && matchesTags && !isHiddenFromDashboard;
      })
      .map((plugin) => plugin.id);
  }, [searchTerm, selectedTags, featureFlags, userGroup]);

  return filteredPlugins;
}
