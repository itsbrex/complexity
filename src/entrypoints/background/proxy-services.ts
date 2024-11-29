import { registerBetterCodeBlocksOptionsService } from "@/services/indexed-db/better-code-blocks/better-code-blocks";
import { registerLocalThemesService } from "@/services/indexed-db/themes/themes";

export function registerProxyServices() {
  registerLocalThemesService();
  registerBetterCodeBlocksOptionsService();
}
