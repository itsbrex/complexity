import { allowFocusModes } from "@/data/plugins/focus-selector/focus-web-recency";
import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

csLoaderRegistry.register({
  id: "plugin:queryBox:focusSelector:webRecency:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (
      !pluginsEnableStates?.["queryBox:focusSelector"] ||
      !pluginsEnableStates?.["queryBox:focusSelector:webRecency"]
    )
      return;

    MiddlewareManager.updateMiddleware({
      id: "force-change-focus-web-recency",
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

        const isSpaceThread = payload[2].query_source === "collection";

        if (isSpaceThread) return skip();

        const isWebFocus = allowFocusModes.includes(payload[2].search_focus);

        if (!isWebFocus) return skip();

        const overrideRecency = sharedQueryBoxStore.getState().selectedRecency;
        const isFollowUp = payload[2].query_source === "followup";

        const newPayload = [
          ...payload.slice(0, 2),
          {
            ...payload[2],
            search_recency_filter:
              overrideRecency === "ALL" ? null : overrideRecency,
            redo_search: isFollowUp ? true : payload[2].redo_search,
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
