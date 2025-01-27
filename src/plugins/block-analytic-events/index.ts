import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parseWebSocketData } from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "plugin:blockAnalyticEvents",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (pluginsEnableStates?.blockAnalyticEvents === true)
      networkInterceptMiddlewareManager.addMiddleware({
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
  },
  dependencies: ["cache:pluginsStates"],
});
