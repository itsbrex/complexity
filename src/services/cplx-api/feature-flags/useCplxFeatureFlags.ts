import { useQuery } from "@tanstack/react-query";

import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { whereAmI } from "@/utils/utils";

export default function useCplxFeatureFlags() {
  if (whereAmI() !== "unknown")
    throw new Error("Can not run this hook in content script");

  return useQuery({
    ...cplxApiQueries.featureFlags,
    retry: false,
    retryOnMount: false, // important, without this the query will be refetching indefinitely if queryFn throws error
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    gcTime: Infinity,
  });
}
