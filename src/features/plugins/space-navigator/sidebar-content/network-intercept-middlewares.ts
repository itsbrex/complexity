import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import { parseWebSocketData } from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";

csLoaderRegistry.register({
  id: "plugin:spaceNavigator:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["spaceNavigator"]) return;

    MiddlewareManager.updateMiddleware({
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
