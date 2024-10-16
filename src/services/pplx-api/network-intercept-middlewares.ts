import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import { parseWebSocketData } from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export function setupPplxApiNetworkInterceptMiddlewares() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  const shouldInvalidatePplxUserSettings =
    pluginsEnableStates?.["queryBox:languageModelSelector"] === true ||
    pluginsEnableStates?.imageGenModelSelector === true;

  if (shouldInvalidatePplxUserSettings) {
    MiddlewareManager.addMiddleware({
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
}
