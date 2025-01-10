import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

csLoaderRegistry.register({
  id: "networkIntercept:languageModelSelector",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["queryBox:languageModelSelector"]) return;

    MiddlewareManager.updateMiddleware({
      id: "force-change-language-model",
      middlewareFn({ data, skip }) {
        if (data.type === "network-intercept:fetchEvent") {
          return skip();
        }

        const wsMessage = parseWebSocketData(data.payload.data);
        const payload = wsMessage.payload;

        const hasValidMessageStructure =
          wsMessage.messageId != null &&
          Array.isArray(payload) &&
          payload.length > 0 &&
          payload[0] != null;

        if (!hasValidMessageStructure) {
          return skip();
        }

        if (payload.length < 3) {
          return skip();
        }

        const isPerplexityAskMessage = payload[0] === "perplexity_ask";

        if (!isPerplexityAskMessage) return skip();

        const isRewriteMessage = payload[2].query_source == "retry";

        const settings = ExtensionLocalStorageService.getCachedSync();

        const newPayload = [
          ...payload.slice(0, 2),
          {
            ...payload[2],
            model_preference: !isRewriteMessage
              ? sharedQueryBoxStore.getState().selectedLanguageModel
              : payload[2].model_preference,
            timezone:
              settings.devMode &&
              settings.plugins["queryBox:languageModelSelector"].changeTimezone
                ? "America/Los_Angeles"
                : payload[2].timezone,
          },
        ];

        return encodeWebSocketData({
          type: "message",
          data: `${wsMessage.messageId}${JSON.stringify(newPayload)}`,
        });
      },
    });
  },
});
