import {
  allowWindowMessaging,
  sendMessage,
} from "webext-bridge/content-script";

import { CorePluginId, PLUGINS_METADATA } from "@/data/plugins/plugins-data";
import InternalWebSocketManager from "@/features/plugins/_core/web-socket/InternalWebSocketManager";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { injectMainWorldScript, insertCss } from "@/utils/utils";

import mermaidRendererPlugin from "@/features/plugins/_core/mermaid-renderer/index.main?script&module";
import networkInterceptPlugin from "@/features/plugins/_core/network-intercept/index.main?script&module";
import reactVdomPlugin from "@/features/plugins/_core/react-vdom/index.main?script&module";
import spaRouterPlugin from "@/features/plugins/_core/spa-router/index.main?script&module";
import jqueryExtensions from "@/utils/jquery.extensions?script&module";
import webextBridgeSetNamespace from "@/utils/webext-bridge?script&module";

export async function initCorePlugins() {
  await injectMainWorldScript({
    url: chrome.runtime.getURL(webextBridgeSetNamespace),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(jqueryExtensions),
    head: true,
    inject: true,
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(networkInterceptPlugin),
    head: true,
    inject: shouldEnableCorePlugin("networkIntercept"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(spaRouterPlugin),
    head: true,
    inject: shouldEnableCorePlugin("spaRouter"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(reactVdomPlugin),
    head: true,
    inject: shouldEnableCorePlugin("reactVdom"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(mermaidRendererPlugin),
    head: true,
    inject: shouldEnableCorePlugin("mermaidRenderer"),
  });

  if (shouldEnableCorePlugin("webSocket")) {
    InternalWebSocketManager.getInstance().handShake();
  }
}

function shouldEnableCorePlugin(corePluginId: CorePluginId) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates) return false;

  const shouldInject = Object.entries(pluginsEnableStates).some(
    ([pluginId, enabled]) => {
      if (!enabled) return false;

      const pluginMetadata = PLUGINS_METADATA[pluginId as PluginId];
      if (!pluginMetadata?.dependentCorePlugins) return false;

      return pluginMetadata.dependentCorePlugins.includes(corePluginId);
    },
  );

  return shouldInject;
}

CsLoaderRegistry.register({
  id: "plugins:core",
  loader: initCorePlugins,
  dependencies: ["cache:extensionLocalStorage"],
});

CsLoaderRegistry.register({
  id: "messaging:namespaceSetup",
  loader: () => {
    allowWindowMessaging("com.complexity");
  },
});

CsLoaderRegistry.register({
  id: "plugin:pplxThemeLoader",
  loader: async () => {
    const chosenThemeId = ExtensionLocalStorageService.getCachedSync().theme;
    const css = await getThemeCss(chosenThemeId);

    insertCss({
      css,
      id: "cplx-custom-theme",
    });

    if (ExtensionLocalStorageService.getCachedSync().preloadTheme)
      sendMessage("bg:removePreloadedTheme", undefined, "background");
  },
  dependencies: ["cache:extensionLocalStorage"],
});
