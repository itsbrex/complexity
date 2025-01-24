import { pluginGuardsStore } from "@/components/plugins-guard/store";
import { middlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "plugin:queryBox:focusSelector:forceDisableExternalSources:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["queryBox:focusSelector"]) return;

    const unsub = pluginGuardsStore.subscribe(({ isOrgMember }) => {
      if (isOrgMember === true) {
        middlewareManager.removeMiddleware("force-disable-external-sources");
        unsub();
        return;
      }

      middlewareManager.updateMiddleware({
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
    });
  },
});
