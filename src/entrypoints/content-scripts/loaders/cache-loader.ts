import { initializeLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { initializeBetterCodeBlocksOptions } from "@/services/indexed-db/better-code-blocks/better-code-blocks";
import { pluginsStatesQueries } from "@/services/plugins-states/query-keys";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export async function initCache() {
  await Promise.all([
    queryClient.prefetchQuery(pluginsStatesQueries.computed),
    queryClient.prefetchQuery(pplxApiQueries.spaces),
    initializeLanguageModels(),
    initializeBetterCodeBlocksOptions(),
  ]);
}
