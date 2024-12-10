import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionPermissionsService } from "@/services/extension-permissions/extension-permissions";
import { getPplxThemeLoaderService } from "@/services/pplx-theme-loader";
import { queryClient } from "@/utils/ts-query-client";

export function setupOptionPageListeners() {
  ExtensionLocalStorageService.initializeReactiveStore();
  ExtensionPermissionsService.setupReactiveListeners();

  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  $("html").attr("data-color-scheme", theme);

  queryClient.getMutationCache().subscribe(async ({ mutation, type }) => {
    const mutationKey = mutation?.options.mutationKey;

    if (!mutationKey) return;

    const isThemeMutation =
      mutationKey[0] === "customTheme" &&
      mutation.state.status === "success" &&
      type === "updated";

    const isExtensionLocalStorageMutation =
      mutationKey[0] === "updateExtensionLocalStorage" &&
      mutation.state.status === "success" &&
      type === "updated";

    if (isThemeMutation || isExtensionLocalStorageMutation) {
      getPplxThemeLoaderService().updateThemeConfigOptimistically();
    }
  });
}
