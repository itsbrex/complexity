import { sendMessage } from "webext-bridge/content-script";

import { removeInitializingIndicator } from "@/components/loading-indicator";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PplxApiService } from "@/services/pplx-api/pplx-api";

export function contentScriptGuard() {
  const removePreloadedTheme = () => {
    if (ExtensionLocalStorageService.getCachedSync().preloadTheme)
      sendMessage("bg:removePreloadedTheme", undefined, "background");
  };

  checkForMaintenance().catch(() => {
    removePreloadedTheme();
    removeInitializingIndicator();
  });

  try {
    ignoreInvalidPages();
    checkForExistingExtensionInstance();
  } catch (error) {
    removePreloadedTheme();
    removeInitializingIndicator();
    throw error;
  }
}

async function checkForMaintenance() {
  if ((await PplxApiService.fetchMaintenanceStatus()) != "null")
    throw new Error("Perplexity maintenance state detected, will not inject");
}

function ignoreInvalidPages() {
  const isCloudflareVerificationPage = $(document.body).hasClass("no-js");

  if (isCloudflareVerificationPage)
    throw new Error("Cloudflare verification page");
}

function checkForExistingExtensionInstance() {
  if ($(document.body).attr("data-cplx-injected")) {
    console.warn(
      "Complexity: Please only have one instance of the extension enabled",
    );
    throw new Error("Already injected");
  }

  $(document.body).attr("data-cplx-injected", "true");
}
