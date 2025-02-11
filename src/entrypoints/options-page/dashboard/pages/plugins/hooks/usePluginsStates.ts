import { useQuery } from "@tanstack/react-query";
import { useImmer } from "use-immer";

import { APP_CONFIG } from "@/app.config";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import {
  initializePluginStates,
  PluginsStates,
  updatePluginStatesWithFeatureCompat,
} from "@/services/plugins-states/utils";

export default function usePluginsStates() {
  const { data: featureCompat, isLoading: isFetchingFeatureCompat } = useQuery({
    ...cplxApiQueries.featureCompat,
    staleTime: 1000,
    retryOnMount: false, // important, without this the query will be refetching indefinitely if queryFn throws error
  });
  const { latestVersion, isLoading: isLoadingLatestVersion } =
    useExtensionUpdate();

  const isLoading =
    !featureCompat &&
    !latestVersion &&
    (isFetchingFeatureCompat || isLoadingLatestVersion);

  const [pluginsStates, setPluginsStates] = useImmer<PluginsStates>(() =>
    initializePluginStates(),
  );

  useEffect(() => {
    setPluginsStates((draft) =>
      updatePluginStatesWithFeatureCompat(
        draft,
        featureCompat,
        APP_CONFIG.VERSION,
        latestVersion,
      ),
    );
  }, [featureCompat, latestVersion, setPluginsStates]);

  return { pluginsStates, isLoading };
}
