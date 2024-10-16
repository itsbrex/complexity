import {
  CplxFeatureFlags,
  UserGroup,
} from "@/services/cplx-api/feature-flags/cplx-feature-flags.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginId } from "@/services/extension-local-storage/extension-local-storage.types";
import { pluginsStatesQueries } from "@/services/plugins-states/query-keys";
import { errorWrapper } from "@/utils/error-wrapper";
import { queryClient } from "@/utils/ts-query-client";

export type PluginsStates = {
  pluginsEnableStates: Partial<Record<PluginId, boolean>> | null;
  pluginsHideFromDashboardStates: Partial<Record<PluginId, boolean>> | null;
};

export class PluginsStatesService {
  private static getDefaultPluginsStates(): PluginsStates {
    const localSettings = ExtensionLocalStorageService.getCachedSync();

    return {
      pluginsEnableStates: Object.fromEntries(
        Object.keys(localSettings.plugins).map((pluginId) => [
          pluginId,
          localSettings.plugins[pluginId as PluginId].enabled,
        ]),
      ),
      pluginsHideFromDashboardStates: null,
    };
  }

  private static async getFeatureFlags({ cache }: { cache: boolean }) {
    if (cache) {
      const cachedData = queryClient.getQueryData<CplxFeatureFlags>(
        cplxApiQueries.featureFlags.queryKey,
      );

      if (cachedData) {
        return cachedData;
      }
    }

    return await queryClient.fetchQuery({
      ...cplxApiQueries.featureFlags,
      gcTime: Infinity,
    });
  }

  static async get(
    { cache }: { cache: boolean } = { cache: true },
  ): Promise<PluginsStates> {
    const DEFAULT_RETURN = this.getDefaultPluginsStates();

    const localSettings = ExtensionLocalStorageService.getCachedSync();

    const userGroup: UserGroup = "anon"; // TODO: implement

    const [featureFlags, error] = await errorWrapper(() =>
      this.getFeatureFlags({ cache }),
    )();

    if (featureFlags == null || localSettings == null || error) {
      return DEFAULT_RETURN;
    }

    const pluginsEnableStates = Object.fromEntries(
      Object.keys(localSettings.plugins).map((pluginId) => {
        const locallyEnabled =
          localSettings.plugins[pluginId as PluginId].enabled;
        const isRemotelyDisabled = featureFlags[
          userGroup
        ]?.forceDisable.includes(pluginId as PluginId);

        const mergedState = !isRemotelyDisabled && locallyEnabled;
        return [pluginId, mergedState];
      }),
    );

    const pluginsHideFromDashboardStates = Object.fromEntries(
      Object.keys(localSettings.plugins).map((pluginId) => {
        const isHiddenFromDashboard = featureFlags[userGroup]?.hide?.includes(
          pluginId as PluginId,
        );

        return [pluginId, isHiddenFromDashboard];
      }),
    );

    return {
      pluginsEnableStates,
      pluginsHideFromDashboardStates,
    };
  }

  static getCachedSync(): PluginsStates {
    const DEFAULT_RETURN = this.getDefaultPluginsStates();

    const pluginsStates = queryClient.getQueryData<PluginsStates>(
      pluginsStatesQueries.computed.queryKey,
    );

    return pluginsStates ?? DEFAULT_RETURN;
  }
}
