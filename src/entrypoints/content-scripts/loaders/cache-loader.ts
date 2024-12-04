import { initializeLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { initializeBetterCodeBlocksOptions } from "@/services/indexed-db/better-code-blocks/better-code-blocks";
import { pluginsStatesQueries } from "@/services/plugins-states/query-keys";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export async function initCache() {
  queryClient.prefetchQuery(cplxApiQueries.versions);

  await Promise.all([
    queryClient.prefetchQuery(cplxApiQueries.changelog()),
    queryClient.prefetchQuery(pluginsStatesQueries.computed),
    queryClient.prefetchQuery(pplxApiQueries.spaces),
    initializeLanguageModels(),
    initializeBetterCodeBlocksOptions(),
  ]);
}
