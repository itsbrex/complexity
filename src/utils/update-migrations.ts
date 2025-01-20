import { produce } from "immer";

import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { MaybePromise } from "@/types/utils.types";

type MigrationFn = ({
  oldRawSettings,
}: {
  oldRawSettings: ExtensionLocalStorage;
}) => MaybePromise<ExtensionLocalStorage>;

export const migrateSlashCommandMenuKey: MigrationFn = ({ oldRawSettings }) => {
  console.log("[ExtUpdateMigrations] Migrating slash command menu key");

  return produce(oldRawSettings, (draft) => {
    const isPromptHistoryEnabled =
      oldRawSettings.plugins["queryBox:slashCommandMenu:promptHistory"].enabled;

    draft.plugins["queryBox:slashCommandMenu"] = {
      enabled: isPromptHistoryEnabled,
      showTriggerButton: (
        oldRawSettings.plugins["queryBox:slashCommandMenu:promptHistory"] as any
      ).showTriggerButton,
    };
  });
};

export const migrateSpaceNavigatorKey: MigrationFn = ({ oldRawSettings }) => {
  console.log("[ExtUpdateMigrations] Migrating space navigator key");

  return produce(oldRawSettings, (draft) => {
    draft.plugins.spaceNavigator = (oldRawSettings.plugins as any)[
      "queryBox:spaceNavigator"
    ];
    delete (draft.plugins as any)["queryBox:spaceNavigator"];
  });
};

export const enableThemePreloader: MigrationFn = async ({ oldRawSettings }) => {
  console.log("[ExtUpdateMigrations] Theme preloader migration");

  const hasPermissions = await chrome.permissions.contains({
    permissions: ["scripting", "webNavigation"],
  });

  if (!hasPermissions) return oldRawSettings;

  return produce(oldRawSettings, (draft) => {
    draft.preloadTheme = true;
  });
};

export const EXT_UPDATE_MIGRATIONS: Record<string, MigrationFn> = {
  "1.0.2.0": enableThemePreloader,
  "1.3.2.0": migrateSpaceNavigatorKey,
  "1.3.3.0": migrateSlashCommandMenuKey,
};
