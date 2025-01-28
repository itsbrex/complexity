import { pluginGuardsStore } from "@/components/plugins-guard/store";
import { allowFocusModes } from "@/data/plugins/better-focus-selector/focus-web-recency";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

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

    const unsub = pluginGuardsStore.subscribe(({ isOrgMember }) => {
      if (isOrgMember === true) {
        networkInterceptMiddlewareManager.removeMiddleware(
          "force-change-focus-web-recency",
        );
        unsub();
        return;
      }

      networkInterceptMiddlewareManager.updateMiddleware({
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

          const overrideRecency =
            sharedQueryBoxStore.getState().selectedRecency;
          const isFollowUp = ["followup", "retry", "rewrite"].includes(
            payload[2].query_source,
          );

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
    });
  },
});
