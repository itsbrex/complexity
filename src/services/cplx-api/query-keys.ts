import { createQueryKeys } from "@lukemorales/query-key-factory";

import { CplxApiService } from "@/services/cplx-api/cplx-api";

export const cplxApiQueries = createQueryKeys("cplxApi", {
  versions: {
    queryKey: null,
    queryFn: CplxApiService.fetchVersions,
  },
  featureFlags: {
    queryKey: null,
    queryFn: () => CplxApiService.fetchFeatureFlags(),
  },
  remoteLanguageModels: {
    queryKey: null,
    queryFn: CplxApiService.fetchLanguageModels,
  },
  changelog: ({ version }: { version?: string } = {}) => ({
    queryKey: [{ version }],
    queryFn: () => CplxApiService.fetchChangelog({ version }),
  }),
});
