import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionPermissionsService } from "@/services/extension-permissions/extension-permissions";

export function setupOptionPageListeners() {
  ExtensionLocalStorageService.initializeReactiveStore();
  ExtensionPermissionsService.setupReactiveListeners();

  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  $("html").attr("data-color-scheme", theme);
}
