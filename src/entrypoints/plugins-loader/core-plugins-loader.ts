import {
  CorePluginId,
  PLUGINS_METADATA,
} from "@/data/consts/plugins/plugins-data";
import InternalWebSocketManager from "@/features/plugins/_core/web-socket/InternalWebSocketManager";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginId } from "@/services/extension-local-storage/extension-local-storage.types";
import { injectMainWorldScript } from "@/utils/utils";

import networkInterceptPlugin from "@/features/plugins/_core/network-intercept/index.main?script&module";
import spaRouterPlugin from "@/features/plugins/_core/spa-router/index.main?script&module";
import webextBridgeSetNamespace from "@/utils/webext-bridge?script&module";

export async function initCorePlugins() {
  await injectMainWorldScript({
    url: chrome.runtime.getURL(webextBridgeSetNamespace),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(networkInterceptPlugin),
    head: true,
    inject: shouldInjectCorePlugin("networkIntercept"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(spaRouterPlugin),
    head: true,
    inject: shouldInjectCorePlugin("spaRouter"),
  });

  if (shouldInjectCorePlugin("webSocket")) {
    InternalWebSocketManager.getInstance().handShake();
  }
}

function shouldInjectCorePlugin(corePluginId: CorePluginId) {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const shouldInject = Object.entries(settings.plugins).some(
    ([pluginId, plugin]) => {
      if (!plugin.enabled) return false;

      const pluginMetadata = PLUGINS_METADATA[pluginId as PluginId];
      if (!pluginMetadata?.dependentCorePlugins) return false;

      return pluginMetadata.dependentCorePlugins.includes(corePluginId);
    },
  );

  return shouldInject;
}
