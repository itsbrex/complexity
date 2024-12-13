import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { compareVersions } from "@/utils/utils";

export async function enableThemePreloader({
  previousVersion,
}: {
  previousVersion: string;
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
