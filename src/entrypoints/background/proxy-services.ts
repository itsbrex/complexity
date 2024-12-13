import { registerBetterCodeBlocksOptionsService } from "@/services/indexed-db/better-code-blocks/better-code-blocks";
import { registerLocalThemesService } from "@/services/indexed-db/themes/themes";
import { registerPplxThemePreloaderService } from "@/services/pplx-theme-preloader";

export function registerProxyServices() {
  registerPplxThemePreloaderService();
  registerLocalThemesService();
  registerBetterCodeBlocksOptionsService();
}
