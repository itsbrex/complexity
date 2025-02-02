import { QueryClient } from "@tanstack/react-query";

import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export const queryClient = new QueryClient();

queryClient.setQueryDefaults(pplxApiQueries.spaces.queryKey, {
  staleTime: 10000,
});
