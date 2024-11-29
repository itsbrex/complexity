import { BUILTIN_THEME_REGISTRY } from "@/data/plugins/themes/theme-registry";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { getLocalThemesService } from "@/services/indexed-db/themes/themes";
import { insertCss } from "@/utils/utils";

export async function setupThemeLoader() {
  const chosenThemeId = ExtensionLocalStorageService.getCachedSync().theme;

  const chosenThemeCss = await getThemeCss(chosenThemeId);

  insertCss({
    css: chosenThemeCss,
    id: "cplx-custom-theme",
  });
}

async function getThemeCss(themeId: Theme["id"]) {
  return getBuiltInThemeCss(themeId) || (await getLocalThemeCss(themeId)) || "";
}

function getBuiltInThemeCss(themeId: Theme["id"]) {
  return (
    BUILTIN_THEME_REGISTRY.find((theme) => theme.id === themeId)?.css ?? ""
  );
}

async function getLocalThemeCss(themeId: Theme["id"]) {
  return (await getLocalThemesService().get(themeId))?.css ?? "";
}
