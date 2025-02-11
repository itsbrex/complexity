import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export function getTParam() {
  const extensionLocalStorage = ExtensionLocalStorageService.getCachedSync();
  const cdnLastUpdated = extensionLocalStorage.cdnLastUpdated;

  const nowInMilliseconds = Date.now();
  const oneHourInMilliseconds = 1000 * 60 * 30;

  if (
    cdnLastUpdated == null ||
    nowInMilliseconds - cdnLastUpdated > oneHourInMilliseconds
  ) {
    ExtensionLocalStorageService.set((draft) => {
      draft.cdnLastUpdated = nowInMilliseconds;
    });
    return nowInMilliseconds;
  }

  return cdnLastUpdated;
}
