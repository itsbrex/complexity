import { createQueryKeys } from "@lukemorales/query-key-factory";

import { PplxApiService } from "@/services/pplx-api/pplx-api";

export const pplxApiQueries = createQueryKeys("pplxApi", {
  userSettings: {
    queryKey: null,
    queryFn: PplxApiService.fetchUserSettings,
  },
  auth: {
    queryKey: null,
    queryFn: PplxApiService.fetchAuthSession,
  },
  threadInfo: (threadSlug: string) => ({
    queryKey: [{ threadSlug }],
    queryFn: () => PplxApiService.fetchThreadInfo(threadSlug),
  }),
});
