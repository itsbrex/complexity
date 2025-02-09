import { APP_CONFIG } from "@/app.config";
import {
  CplxVersions,
  FeatureCompatibility,
} from "@/services/cplx-api/cplx-api.types";
import { CplxFeatureFlags } from "@/services/cplx-api/cplx-feature-flags.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import {
  initializePluginStates,
  updatePluginStatesWithEnableStates,
  updatePluginStatesWithFeatureCompat,
  updatePluginStatesWithFeatureFlags,
} from "@/services/plugins-states/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

export class PluginsStatesService {
  static cachedEnableStates: Record<PluginId, boolean> | null = null;

  static getEnableStatesCachedSync(): Record<PluginId, boolean> {
    if (this.cachedEnableStates) return this.cachedEnableStates;

    const featureCompat = queryClient.getQueryData<FeatureCompatibility>(
      cplxApiQueries.featureCompat.queryKey,
    );

    const featureFlags = queryClient.getQueryData<CplxFeatureFlags>(
      cplxApiQueries.featureFlags.queryKey,
    );

    const cplxVersions = queryClient.getQueryData<CplxVersions>(
      cplxApiQueries.versions.queryKey,
    );

    const pluginsStates = initializePluginStates();

    const withFeatureCompat = updatePluginStatesWithFeatureCompat(
      pluginsStates,
      featureCompat,
      APP_CONFIG.VERSION,
      cplxVersions?.latest,
    );

    const withFeatureFlags = updatePluginStatesWithFeatureFlags(
      withFeatureCompat,
      featureFlags,
      "anon",
    );

    const withEnableStates = updatePluginStatesWithEnableStates(
      withFeatureFlags,
      ExtensionLocalStorageService.getCachedSync().plugins,
    );

    this.cachedEnableStates = withEnableStates;

    return withEnableStates;
  }
}

csLoaderRegistry.register({
  id: "cache:pluginsStates",
  dependencies: ["cache:extensionLocalStorage"],
  loader: async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        ...cplxApiQueries.versions,
        staleTime: 1000,
      }),
      queryClient.prefetchQuery({
        ...cplxApiQueries.featureCompat,
        gcTime: Infinity,
        staleTime: Infinity,
      }),
      queryClient.prefetchQuery({
        ...cplxApiQueries.featureFlags,
        gcTime: Infinity,
        staleTime: Infinity,
      }),
    ]);
  },
});
