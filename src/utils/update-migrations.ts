import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { compareVersions } from "@/utils/utils";

export const EXT_UPDATE_MIGRATIONS: Record<
  string,
  ({
    oldRawSettings,
    previousVersion,
  }: {
    oldRawSettings: ExtensionLocalStorage;
    previousVersion: string;
  }) => void
> = {
  "1.0.2.0": enableThemePreloader,
  "1.3.2.0": migrateSpaceNavigatorKey,
  "1.3.3.0": migrateSlashCommandMenuKey,
};

export function migrateSlashCommandMenuKey({
  oldRawSettings,
  previousVersion,
}: {
  oldRawSettings: ExtensionLocalStorage;
  previousVersion: string;
}) {
  if (compareVersions("1.3.3.0", previousVersion) <= 0) return;

  console.log("[ExtUpdateMigrations] Migrating slash command menu key");

  ExtensionLocalStorageService.set((draft) => {
    draft.plugins["queryBox:slashCommandMenu"] = {
      enabled:
        oldRawSettings.plugins["queryBox:slashCommandMenu:promptHistory"]
          .enabled,
      showTriggerButton:
        (
          oldRawSettings.plugins[
            "queryBox:slashCommandMenu:promptHistory"
          ] as any
        ).showTriggerButton ?? true,
    };
  });
}

export function migrateSpaceNavigatorKey({
  oldRawSettings,
  previousVersion,
}: {
  oldRawSettings: ExtensionLocalStorage;
  previousVersion: string;
}) {
  if (compareVersions("1.3.2.0", previousVersion) <= 0) return;

  console.log("[ExtUpdateMigrations] Migrating space navigator key");

  ExtensionLocalStorageService.set((draft) => {
    draft.plugins.spaceNavigator = (oldRawSettings.plugins as any)[
      "queryBox:spaceNavigator"
    ];
    delete (draft.plugins as any)["queryBox:spaceNavigator"];
  });
}

export async function enableThemePreloader({
  previousVersion,
  oldRawSettings,
}: {
  previousVersion: string;
  oldRawSettings: ExtensionLocalStorage;
}) {
  if (compareVersions("1.0.2.0", previousVersion) < 0) return;

  console.log("Theme preloader migration");

  const hasPermissions = await chrome.permissions.contains({
    permissions: ["scripting", "webNavigation"],
  });

  if (!hasPermissions) return;

  ExtensionLocalStorageService.set((draft) => {
    draft.preloadTheme = true;
  });
}
