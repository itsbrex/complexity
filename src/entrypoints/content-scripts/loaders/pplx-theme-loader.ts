import { sendMessage } from "webext-bridge/content-script";

import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { insertCss } from "@/utils/utils";

export async function setupPplxThemeLoader() {
  const chosenThemeId = ExtensionLocalStorageService.getCachedSync().theme;
  const css = await getThemeCss(chosenThemeId);

  insertCss({
    css,
    id: "cplx-custom-theme",
  });

  if (ExtensionLocalStorageService.getCachedSync().preloadTheme)
    sendMessage("bg:removePreloadedTheme", undefined, "background");
}
