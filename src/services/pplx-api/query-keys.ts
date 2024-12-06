import { createQueryKeys } from "@lukemorales/query-key-factory";

import { PplxApiService } from "@/services/pplx-api/pplx-api";
import { Space } from "@/services/pplx-api/pplx-api.types";

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
  threadsSearch: (
    params: {
      searchValue?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) => {
    return {
      queryKey: [{ ...params }],
      queryFn: () => PplxApiService.debouncedFetchThreads(params),
    };
  },
  spaces: {
    queryKey: null,
    queryFn: PplxApiService.fetchSpaces,
    contextQueries: {
      files: (spaceUuid: Space["uuid"]) => ({
        queryKey: [{ spaceUuid }],
        queryFn: () => PplxApiService.fetchSpaceFiles(spaceUuid),
        contextQueries: {
          downloadUrl: (fileUuid: string) => ({
            queryKey: [{ fileUuid }],
            queryFn: () =>
              PplxApiService.fetchSpaceFileDownloadUrl({ spaceUuid, fileUuid }),
          }),
        },
      }),
      threads: (spaceSlug: Space["slug"]) => ({
        queryKey: [{ spaceSlug }],
        queryFn: () => PplxApiService.fetchSpaceThreads(spaceSlug),
      }),
    },
  },
});
