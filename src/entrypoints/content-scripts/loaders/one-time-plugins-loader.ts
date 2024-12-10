import { setupZenMode } from "@/data/plugins/zen-mode/zen-mode";
import { setupHideGetMobileAppCtaBtn } from "@/features/plugins/thread/hide-get-mobile-app-cta-btn/hide-get-mobile-app-cta-btn";

export function setupOneTimeLoadPlugins() {
  setupHideGetMobileAppCtaBtn();
  setupZenMode();
}
