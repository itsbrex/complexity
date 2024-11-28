import { registerLocalThemesService } from "@/services/indexedDb/themes/themes";

export function registerProxyServices() {
  registerLocalThemesService();
}
