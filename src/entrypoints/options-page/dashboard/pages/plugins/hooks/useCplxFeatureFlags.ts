import { useQuery } from "@tanstack/react-query";

import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { isInContentScript } from "@/utils/utils";

export default function useCplxFeatureFlags() {
  if (isInContentScript())
    throw new Error("Can not run this hook in content script");

  return useQuery({
    ...cplxApiQueries.featureFlags,
    staleTime: 1000,
    retryOnMount: false, // important, without this the query will be refetching indefinitely if queryFn throws error
  });
}
