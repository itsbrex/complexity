import { allowWindowMessaging } from "webext-bridge/content-script";

import { initCache } from "@/entrypoints/loaders/cache-loader";
import { setupCoreObservers } from "@/entrypoints/loaders/core-observers-loader";
import { initCorePlugins } from "@/entrypoints/loaders/core-plugins-loader";
import { setupCsUiPlugins } from "@/entrypoints/loaders/cs-ui-plugins-loader/setup-root";
import { setupDomBasedPlugins } from "@/entrypoints/loaders/dom-based-plugins-loader";
import { setupNetworkInterceptPlugins } from "@/entrypoints/loaders/network-intercept-plugins-loader";
import { setupRouteBasedPlugins } from "@/entrypoints/loaders/route-based-plugins-loader";
import { setupNetworkInterceptListeners } from "@/features/plugins/_core/network-intercept/listeners";
import { setupSpaRouterDispatchListeners } from "@/features/plugins/_core/spa-router/listeners";
import { setupThemeLoader } from "@/features/plugins/themes/theme-loader";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import {
  checkForExistingExtensionInstance,
  ignoreInvalidPages,
} from "@/utils/ignore-pages";

(async function () {
  ignoreInvalidPages();
  checkForExistingExtensionInstance();

  await initCoreModules();
  loadPlugins();
})();

async function initCoreModules() {
  await ExtensionLocalStorageService.get();
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
  setupNetworkInterceptPlugins();
  setupRouteBasedPlugins();
  setupDomBasedPlugins();

  setupCsUiPlugins();
}
