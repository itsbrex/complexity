import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

export function setupLanguageModelSelectorNetworkInterceptMiddleware() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (pluginsEnableStates?.["queryBox:languageModelSelector"])
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

        const isRewriteMessage = payload[2].query_source == "retry";

        if (isPerplexityAskMessage && !isRewriteMessage) {
          const newPayload = [
            ...payload.slice(0, 2),
            {
              ...payload[2],
              model_preference:
                sharedQueryBoxStore.getState().selectedLanguageModel,
            },
          ];

          return encodeWebSocketData({
            type: "message",
            data: `${wsMessage.messageId}${JSON.stringify(newPayload)}`,
          });
        }

        return skip();
      },
    });
}
