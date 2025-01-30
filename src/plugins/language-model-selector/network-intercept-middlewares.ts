import { produce } from "immer";

import { pluginGuardsStore } from "@/components/plugins-guard/store";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodeWebSocketData,
  parseWebSocketData,
} from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "networkIntercept:languageModelSelector",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

    const unsub = pluginGuardsStore.subscribe(({ hasActiveSub }) => {
      if (!hasActiveSub) return;

      unsub();

      networkInterceptMiddlewareManager.updateMiddleware({
        id: "force-change-language-model",
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

          const isRewriteMessage = payload[2].query_source == "retry";

          const settings = ExtensionLocalStorageService.getCachedSync();

          const newPayload = [
            ...payload.slice(0, 2),
            {
              ...payload[2],
              model_preference: !isRewriteMessage
                ? sharedQueryBoxStore.getState().selectedLanguageModel
                : payload[2].model_preference,
              timezone:
                settings.devMode &&
                settings.plugins["queryBox:languageModelSelector"]
                  .changeTimezone
                  ? "America/Los_Angeles"
                  : payload[2].timezone,
            },
          ];

          return encodeWebSocketData({
            type: "message",
            data: `${wsMessage.messageId}${JSON.stringify(newPayload)}`,
          });
        },
      });

      networkInterceptMiddlewareManager.updateMiddleware({
        id: "persist-reasoning-model",
        middlewareFn({ data, skip }) {
          if (
            data.type !== "network-intercept:fetchEvent" ||
            data.event !== "request"
          ) {
            return skip();
          }

          const isSaveSettingsRequest = data.payload.url.includes(
            "/rest/user/save-settings",
          );

          if (!isSaveSettingsRequest) return skip();

          const parsedPayload = JSON.parse(data.payload.data);

          const newPayload = produce(parsedPayload, (draft: any) => {
            draft.updated_settings.default_model =
              sharedQueryBoxStore.getState().selectedLanguageModel;
          });

          return JSON.stringify(newPayload);
        },
      });
    });
  },
});
