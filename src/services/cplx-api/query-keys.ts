import { createQueryKeys } from "@lukemorales/query-key-factory";

import { CplxApiService } from "@/services/cplx-api/cplx-api";

export const cplxApiQueries = createQueryKeys("cplxApi", {
  featureFlags: {
    queryKey: null,
    queryFn: CplxApiService.fetchFeatureFlags,
  },
  remoteLanguageModels: {
    queryKey: null,
    queryFn: CplxApiService.fetchLanguageModels,
  },
});
