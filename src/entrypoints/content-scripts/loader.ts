import { allowWindowMessaging } from "webext-bridge/content-script";

import { initializeLanguageModels } from "@/data/consts/plugins/query-box/language-model-selector/language-models";
import { initCorePlugins } from "@/entrypoints/plugins-loader/core-plugins-loader";
import { setupCsUiPlugins } from "@/entrypoints/plugins-loader/cs-ui-plugins-loader/setup-root";
import { setupDomBasedPlugins } from "@/entrypoints/plugins-loader/dom-based-plugins-loader";
import { setupNetworkInterceptPlugins } from "@/entrypoints/plugins-loader/network-intercept-plugins-loader";
import { setupRouteBasedPlugins } from "@/entrypoints/plugins-loader/route-based-plugins-loader";
import { setupNetworkInterceptListeners } from "@/features/plugins/_core/network-intercept/listeners";
import { setupSpaRouterDispatchListeners } from "@/features/plugins/_core/spa-router/listeners";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { pluginsStatesQueries } from "@/services/plugins-states/query-keys";
import {
  checkForExistingExtensionInstance,
  ignoreInvalidPages,
} from "@/utils/ignore-pages";
import { queryClient } from "@/utils/ts-query-client";

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
  await Promise.all([
    queryClient.prefetchQuery(pluginsStatesQueries.computed),
    initializeLanguageModels(),
  ]);

  setupCsUiPlugins();
  setupNetworkInterceptPlugins();
  setupRouteBasedPlugins();
  setupDomBasedPlugins();
}
