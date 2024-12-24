import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";
import { parseWebSocketData } from "@/features/plugins/_core/network-intercept/web-socket-message-parser";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { getPromptHistoryService } from "@/services/indexed-db/prompt-history/prompt-history";
import { promptHistoryQueries } from "@/services/indexed-db/prompt-history/query-keys";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { queryClient } from "@/utils/ts-query-client";

CsLoaderRegistry.register({
  id: "plugin:queryBox:promptHistory:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates?.["queryBox:slashCommandMenu:promptHistory"] ||
      !settings.plugins["queryBox:slashCommandMenu:promptHistory"].trigger
        .onSubmit
    )
      return;

    MiddlewareManager.updateMiddleware({
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
