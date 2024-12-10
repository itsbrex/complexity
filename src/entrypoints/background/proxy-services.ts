import { registerBetterCodeBlocksOptionsService } from "@/services/indexed-db/better-code-blocks/better-code-blocks";
import { registerLocalThemesService } from "@/services/indexed-db/themes/themes";
import { registerPplxThemeLoaderService } from "@/services/pplx-theme-loader";

export function registerProxyServices() {
  registerPplxThemeLoaderService();
  registerLocalThemesService();
  registerBetterCodeBlocksOptionsService();
}
