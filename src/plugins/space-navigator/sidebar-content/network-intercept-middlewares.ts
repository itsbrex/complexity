import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parseWebSocketData } from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { PluginsStatesService } from "@/services/plugins-states";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

csLoaderRegistry.register({
  id: "plugin:spaceNavigator:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["spaceNavigator"]) return;

    networkInterceptMiddlewareManager.updateMiddleware({
      id: "invalidate-spaces",
      middlewareFn({ data, skip }) {
        if (data.type !== "network-intercept:fetchEvent") {
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

          const spaceMutationActions = [
            "create_collection",
            "delete_collection",
          ];

          const isSpaceMutationPayload = spaceMutationActions.includes(
            payload[0],
          );

          if (isSpaceMutationPayload) {
            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: pplxApiQueries.spaces.queryKey,
                exact: true,
              });
            }, 3000);
          }
        } else {
          if (data.event !== "request") return skip();

          if (
            data.payload.url.includes(
              "www.perplexity.ai/rest/collections/edit_collection",
            )
          ) {
            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: pplxApiQueries.spaces.queryKey,
                exact: true,
              });
            }, 3000);
          }
        }

        return skip();
      },
    });
  },
});
