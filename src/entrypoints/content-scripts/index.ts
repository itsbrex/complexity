import "@/utils/jquery.extensions";
import { allowWindowMessaging } from "webext-bridge/content-script";

import { initCache } from "@/entrypoints/content-scripts/loaders/cache-loader";
import { setupCoreObservers } from "@/entrypoints/content-scripts/loaders/core-observers-loader";
import { initCorePlugins } from "@/entrypoints/content-scripts/loaders/core-plugins-loader";
import { setupCsUiPlugins } from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/setup-root";
import { setupDomBasedPlugins } from "@/entrypoints/content-scripts/loaders/dom-based-plugins-loader";
import { setupNetworkInterceptPlugins } from "@/entrypoints/content-scripts/loaders/network-intercept-plugins-loader";
import { setupOneTimeLoadPlugins } from "@/entrypoints/content-scripts/loaders/one-time-plugins-loader";
import { setupRouteBasedPlugins } from "@/entrypoints/content-scripts/loaders/route-based-plugins-loader";
import { setupNetworkInterceptListeners } from "@/features/plugins/_core/network-intercept/listeners";
import { setupSpaRouterDispatchListeners } from "@/features/plugins/_core/spa-router/listeners";
import { setupThemeLoader } from "@/features/plugins/themes/theme-loader";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { contentScriptGuard } from "@/utils/content-scripts-guard";
import { initializeDayjsLocale } from "@/utils/dayjs";
import { initializeI18next } from "@/utils/i18next";

(async function () {
  await contentScriptGuard();
  await initCoreModules();
  loadPlugins();
})();

async function initCoreModules() {
  await Promise.all([
    ExtensionLocalStorageService.get(),
    initializeI18next(),
    initializeDayjsLocale(),
  ]);

  setupMessaging();
  initCorePlugins();

  function setupMessaging() {
    allowWindowMessaging("com.complexity");
    setupNetworkInterceptListeners();
    setupSpaRouterDispatchListeners();
  }
}

async function loadPlugins() {
  await initCache();

  setupCoreObservers();
  setupThemeLoader();
  setupOneTimeLoadPlugins();
  setupNetworkInterceptPlugins();
  setupRouteBasedPlugins();
  setupDomBasedPlugins();

  setupCsUiPlugins();
}
