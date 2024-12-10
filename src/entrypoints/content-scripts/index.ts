import "@/utils/jquery.extensions";

import { initCache } from "@/entrypoints/content-scripts/loaders/cache-loader";
import { setupCoreObservers } from "@/entrypoints/content-scripts/loaders/core-observers-loader";
import { initCorePlugins } from "@/entrypoints/content-scripts/loaders/core-plugins-loader";
import { setupCsUiPlugins } from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/setup-root";
import { setupDomBasedPlugins } from "@/entrypoints/content-scripts/loaders/dom-based-plugins-loader";
import { setupExtensionMessaging } from "@/entrypoints/content-scripts/loaders/extension-messaging-loader";
import { setupNetworkInterceptPlugins } from "@/entrypoints/content-scripts/loaders/network-intercept-plugins-loader";
import { setupOneTimeLoadPlugins } from "@/entrypoints/content-scripts/loaders/one-time-plugins-loader";
import { setupRouteBasedPlugins } from "@/entrypoints/content-scripts/loaders/route-based-plugins-loader";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { contentScriptGuard } from "@/utils/content-scripts-guard";
import { initializeDayjsLocale } from "@/utils/dayjs";
import { initializeI18next } from "@/utils/i18next";

(async function () {
  await contentScriptGuard();
  await initCoreModules();
  await initCache();

  setupCoreObservers();
  setupOneTimeLoadPlugins();
  setupNetworkInterceptPlugins();
  setupRouteBasedPlugins();
  setupDomBasedPlugins();
  setupCsUiPlugins();
})();

async function initCoreModules() {
  await Promise.all([
    ExtensionLocalStorageService.get(),
    initializeI18next(),
    initializeDayjsLocale(),
  ]);

  setupExtensionMessaging();
  initCorePlugins();
}
