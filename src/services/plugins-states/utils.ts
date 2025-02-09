import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import { FeatureCompatibility } from "@/services/cplx-api/cplx-api.types";
import {
  CplxFeatureFlags,
  UserGroup,
} from "@/services/cplx-api/cplx-feature-flags.types";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import { ExtensionVersion } from "@/utils/ext-version";

export type PluginState = {
  isOutdated: boolean;
  isOnMaintenance: boolean; // if no publicly available newer version
  isForceDisabled: boolean;
  isHiddenFromDashboard: boolean;
};

export type PluginsStates = Record<PluginId, PluginState>;

export const initializePluginStates = (): PluginsStates => {
  return (Object.keys(PLUGINS_METADATA) as PluginId[]).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId]: {
        isOutdated: false,
        isOnMaintenance: false,
        isForceDisabled: false,
        isHiddenFromDashboard: false,
      } satisfies PluginState,
    }),
    {} as PluginsStates,
  );
};

export const isPluginOutdated = (
  currentVersion: string,
  requiredVersion: string | undefined,
): boolean => {
  if (!requiredVersion) return false;
  return new ExtensionVersion(currentVersion).isOlderThan(requiredVersion);
};

export const isUpdateAvail = (
  requiredVersion: string | undefined,
  latestAvailableVersion: string | undefined,
): boolean => {
  if (!requiredVersion || !latestAvailableVersion) return false;
  return new ExtensionVersion(latestAvailableVersion).isNewerThan(
    requiredVersion,
  );
};

export const updatePluginStatesWithFeatureCompat = (
  pluginsStates: PluginsStates,
  featureCompat: FeatureCompatibility | undefined,
  currentVersion: string,
  latestAvailableVersion: string | undefined,
): PluginsStates => {
  if (!featureCompat) return pluginsStates;

  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => {
      const isOutdated = isPluginOutdated(
        currentVersion,
        featureCompat[pluginId as PluginId],
      );

      return {
        ...acc,
        [pluginId as PluginId]: {
          ...pluginsStates[pluginId as PluginId],
          isOutdated,
          isOnMaintenance:
            isOutdated &&
            !isUpdateAvail(currentVersion, latestAvailableVersion),
        },
      };
    },

    { ...pluginsStates },
  );
};

export const updatePluginStatesWithFeatureFlags = (
  pluginsStates: PluginsStates,
  featureFlags: CplxFeatureFlags | undefined,
  userGroup: UserGroup,
): PluginsStates => {
  if (!featureFlags || !featureFlags[userGroup]) return pluginsStates;

  const groupFlags = featureFlags[userGroup];

  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId as PluginId]: {
        ...pluginsStates[pluginId as PluginId],
        isForceDisabled: groupFlags.forceDisable.includes(pluginId),
        isHiddenFromDashboard: groupFlags.hide.includes(pluginId),
      } satisfies PluginState,
    }),
    { ...pluginsStates },
  );
};

export const updatePluginStatesWithEnableStates = (
  pluginsStates: PluginsStates,
  localEnableStates: ExtensionLocalStorage["plugins"],
): Record<PluginId, boolean> => {
  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId as PluginId]:
        !isPluginLockedDown(pluginsStates, pluginId as PluginId) &&
        localEnableStates[pluginId as PluginId].enabled,
    }),
    {} as Record<PluginId, boolean>,
  );
};

function isPluginLockedDown(pluginsStates: PluginsStates, pluginId: PluginId) {
  return (
    pluginsStates[pluginId].isOutdated ||
    pluginsStates[pluginId].isOnMaintenance ||
    pluginsStates[pluginId].isForceDisabled ||
    pluginsStates[pluginId].isHiddenFromDashboard
  );
}
