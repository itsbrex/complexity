import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parseWebSocketData } from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { PluginsStatesService } from "@/services/plugins-states";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

csLoaderRegistry.register({
  id: "networkIntercept:pplxApi",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    const shouldInvalidatePplxUserSettings =
      pluginsEnableStates?.["queryBox:languageModelSelector"] === true ||
      pluginsEnableStates?.imageGenModelSelector === true;

    if (shouldInvalidatePplxUserSettings) {
      networkInterceptMiddlewareManager.addMiddleware({
        id: "invalidate-pplx-user-settings",
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

          const firstPayloadItem = payload[0];

          const shouldInvalidateSettings =
            firstPayloadItem.status === "completed";

          if (shouldInvalidateSettings) {
            queryClient.invalidateQueries({
              queryKey: pplxApiQueries.userSettings.queryKey,
            });
          }

          return skip();
        },
      });
    }
  },
  dependencies: ["cache:pluginsStates"],
});
