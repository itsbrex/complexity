import { sendMessage } from "webext-bridge/content-script";

import { removeInitializingIndicator } from "@/components/loading-indicator";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export function contentScriptGuard() {
  const removePreloadedTheme = async () => {
    if ((await ExtensionLocalStorageService.get()).preloadTheme)
      sendMessage("bg:removePreloadedTheme", undefined, "background");
  };

  try {
    ignoreInvalidPages();
    checkForExistingExtensionInstance();
  } catch (error) {
    removePreloadedTheme();
    removeInitializingIndicator();
    throw error;
  }
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
