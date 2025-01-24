import { middlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parseWebSocketData } from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { getPromptHistoryService } from "@/services/indexed-db/prompt-history/prompt-history";
import { promptHistoryQueries } from "@/services/indexed-db/prompt-history/query-keys";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

csLoaderRegistry.register({
  id: "plugin:queryBox:promptHistory:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates?.["queryBox:slashCommandMenu"] ||
      !pluginsEnableStates?.["queryBox:slashCommandMenu:promptHistory"] ||
      !settings.plugins["queryBox:slashCommandMenu:promptHistory"].trigger
        .onSubmit
    )
      return;

    middlewareManager.updateMiddleware({
      id: "submit-prompt-tracker",
      async middlewareFn({ data, skip }) {
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

        const isRewriteMessage = payload[2].query_source == "retry";

        if (!isPerplexityAskMessage || isRewriteMessage) {
          return skip();
        }

        const promptString = payload[1];

        if (promptString.length < 1) {
          return skip();
        }

        await getPromptHistoryService().deduplicateAdd(promptString);

        queryClient.invalidateQueries({
          queryKey: promptHistoryQueries.list.queryKey,
          exact: true,
        });

        return skip();
      },
    });
  },
});
