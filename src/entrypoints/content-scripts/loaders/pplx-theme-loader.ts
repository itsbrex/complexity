import { sendMessage } from "webext-bridge/content-script";

import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { insertCss } from "@/utils/utils";

export async function setupPplxThemeLoader() {
  const chosenThemeId = (await ExtensionLocalStorageService.get()).theme;
  const css = await getThemeCss(chosenThemeId);

  insertCss({
    css,
    id: "cplx-custom-theme",
  });

  sendMessage("bg:removePreloadedTheme", undefined, "background");
}
