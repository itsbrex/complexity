import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import { parseWebSocketData } from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";

export function setupBlockAnalyticEventsNetworkInterceptMiddleware() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (pluginsEnableStates?.blockAnalyticEvents === true)
    MiddlewareManager.addMiddleware({
      id: "block-analytic-events",
      priority: { position: "first" },
      middlewareFn({ data, stopPropagation, skip }) {
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

        const firstPayloadItem = payload[0];
        const shouldBlockAnalyticEvents =
          firstPayloadItem === "analytics_event";

        if (shouldBlockAnalyticEvents) {
          stopPropagation("");
        }

        return skip();
      },
    });
}
