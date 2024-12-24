import { registerBetterCodeBlocksFineGrainedOptionsService } from "@/services/indexed-db/better-code-blocks/better-code-blocks";
import { registerPromptHistoryService } from "@/services/indexed-db/prompt-history/prompt-history";
import { registerLocalThemesService } from "@/services/indexed-db/themes/themes";
import { registerPplxThemePreloaderService } from "@/services/pplx-theme-preloader";

export function registerProxyServices() {
  registerPplxThemePreloaderService();
  registerLocalThemesService();
  registerBetterCodeBlocksFineGrainedOptionsService();
  registerPromptHistoryService();
}
