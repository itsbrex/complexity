import { useMemo } from "react";

import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import { PluginTagValues } from "@/data/plugins-data/plugins-tags";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";

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
  const { pluginsStates } = usePluginsStates();

  const filteredPlugins = useMemo(() => {
    return Object.values(PLUGINS_METADATA)
      .filter((plugin) => {
        const isHiddenFromDashboard =
          pluginsStates[plugin.id].isHiddenFromDashboard;
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
  }, [searchTerm, selectedTags, excludeTags, pluginsStates]);

  return filteredPlugins;
}
