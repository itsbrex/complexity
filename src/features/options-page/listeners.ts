import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionPermissionsService } from "@/services/extension-permissions/extension-permissions";

export function setupOptionPageListeners() {
  ExtensionLocalStorageService.initializeReactiveStore();
  ExtensionPermissionsService.setupReactiveListeners();
}
