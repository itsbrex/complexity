import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

csLoaderRegistry.register({
  id: "plugin:queryBox:focusSelector:forceDisableExternalSources:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["queryBox:focusSelector"]) return;

    MiddlewareManager.updateMiddleware({
      id: "force-disable-external-sources",
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

        const isFollowUp = ["followup", "retry", "rewrite"].includes(
          payload[2].query_source,
        );

        if (!isFollowUp) {
          return skip();
        }

        const isForceDisableExternalSources =
          sharedQueryBoxStore.getState().forceExternalSourcesOff;

        if (!isForceDisableExternalSources) {
          return skip();
        }

        const newPayload = [
          ...payload.slice(0, 2),
          {
            ...payload[2],
            sources:
              payload[2].sources != null
                ? payload[2].sources.filter(
                    (source: string) => source !== "web",
                  )
                : payload[2].sources,
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
