import { useMutation } from "@tanstack/react-query";

import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { invalidateExtensionLocalStorageDataQuery } from "@/services/extension-local-storage/query-keys";

export function useExtensionLocalStorageMutation() {
  return useMutation({
    mutationKey: ["updateExtensionLocalStorage"],
    mutationFn: ExtensionLocalStorageService.set,
    onSettled: () => {
      invalidateExtensionLocalStorageDataQuery();
    },
  });
}
