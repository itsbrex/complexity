import { THEME_REGISTRY } from "@/data/consts/plugins/themes/theme-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { insertCss } from "@/utils/utils";

export async function setupThemeLoader() {
  const chosenThemeId = ExtensionLocalStorageService.getCachedSync().theme;

  const chosenThemeKey = Object.keys(THEME_REGISTRY).find(
    (key) => THEME_REGISTRY[key].id === chosenThemeId,
  );

  if (!chosenThemeKey) return;

  insertCss({
    css: await THEME_REGISTRY[chosenThemeKey].css(),
    id: "cplx-custom-theme",
  });
}
