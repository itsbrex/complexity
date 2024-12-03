import { QueryObserver } from "@tanstack/react-query";

import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionPermissionsService } from "@/services/extension-permissions/extension-permissions";
import { extensionPermissionsQueries } from "@/services/extension-permissions/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export function setupOptionPageListeners() {
  ExtensionLocalStorageService.initializeReactiveStore();

  ExtensionPermissionsService.setupReactiveListeners();

  const unsubscribeColorSchemeObserver = new QueryObserver(
    queryClient,
    extensionPermissionsQueries.permissions,
  ).subscribe(async (data) => {
    if (!data.data || data.isFetching) return;

    if (data.data.permissions?.some((p) => p === "cookies")) {
      const colorScheme = (
        await chrome.cookies.get({
          url: "https://www.perplexity.ai",
          name: "colorScheme",
        })
      )?.value;

      $("html").attr("data-color-scheme", colorScheme ?? "dark");

      unsubscribeColorSchemeObserver();
    } else {
      const devicePreferredColorScheme = window.matchMedia?.(
        "(prefers-color-scheme: dark)",
      )?.matches
        ? "dark"
        : "light";

      $("html").attr("data-color-scheme", devicePreferredColorScheme);
    }
  });
}
