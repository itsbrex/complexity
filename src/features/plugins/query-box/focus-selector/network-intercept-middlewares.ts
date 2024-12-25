import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

CsLoaderRegistry.register({
  id: "plugin:queryBox:focusSelector:networkInterceptMiddleware",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (pluginsEnableStates?.["queryBox:focusSelector"])
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

          const isNewThread = ["home", "autosuggest", "modal"].includes(
            payload[2].query_source,
          );

          if (isPerplexityAskMessage && isNewThread) {
            const newPayload = [
              ...payload.slice(0, 2),
              {
                ...payload[2],
                search_focus:
                  sharedQueryBoxStore.getState().selectedFocusMode ??
                  payload[2].search_focus,
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
  },
  dependencies: ["cache:pluginsStates"],
});
