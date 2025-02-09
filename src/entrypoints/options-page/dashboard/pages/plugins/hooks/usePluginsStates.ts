import { useQuery } from "@tanstack/react-query";
import { useImmer } from "use-immer";

import { APP_CONFIG } from "@/app.config";
import useCplxFeatureFlags from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useCplxFeatureFlags";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { UserGroup } from "@/services/cplx-api/cplx-feature-flags.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import {
  initializePluginStates,
  PluginsStates,
  updatePluginStatesWithFeatureCompat,
  updatePluginStatesWithFeatureFlags,
} from "@/services/plugins-states/utils";

export default function usePluginsStates() {
  const { data: featureCompat, isLoading: isFetchingFeatureCompat } = useQuery({
    ...cplxApiQueries.featureCompat,
    retryOnMount: false, // important, without this the query will be refetching indefinitely if queryFn throws error
  });
  const { data: featureFlags, isLoading: isFetchingFeatureFlags } =
    useCplxFeatureFlags();
  const { latestVersion, isLoading: isLoadingLatestVersion } =
    useExtensionUpdate();

  const isLoading =
    isFetchingFeatureCompat || isFetchingFeatureFlags || isLoadingLatestVersion;

  const userGroup: UserGroup = "anon";

  const [pluginsStates, setPluginsStates] = useImmer<PluginsStates>(() =>
    initializePluginStates(),
  );

  useEffect(() => {
    setPluginsStates((draft) => {
      const withFeatureCompat = updatePluginStatesWithFeatureCompat(
        draft,
        featureCompat,
        APP_CONFIG.VERSION,
        latestVersion,
      );

      return updatePluginStatesWithFeatureFlags(
        withFeatureCompat,
        featureFlags,
        userGroup,
      );
    });
  }, [featureCompat, featureFlags, latestVersion, setPluginsStates]);

  return { pluginsStates, isLoading };
}
