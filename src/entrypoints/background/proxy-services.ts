import { registerBetterCodeBlocksFineGrainedOptionsService } from "@/services/indexed-db/better-code-blocks";
import { registerPinnedSpacesService } from "@/services/indexed-db/pinned-spaces";
import { registerPromptHistoryService } from "@/services/indexed-db/prompt-history";
import { registerLocalThemesService } from "@/services/indexed-db/themes";
import { registerPplxThemePreloaderService } from "@/services/pplx-theme-preloader";

export function registerProxyServices() {
  registerPplxThemePreloaderService();
  registerLocalThemesService();
  registerBetterCodeBlocksFineGrainedOptionsService();
  registerPromptHistoryService();
  registerPinnedSpacesService();
}
