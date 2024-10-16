import { createQueryKeys } from "@lukemorales/query-key-factory";
import debounce from "lodash/debounce";

import { fetchExtensionLocalStorageData } from "@/services/extension-local-storage/extension-local-storage";
import { queryClient } from "@/utils/ts-query-client";

export const extensionLocalStorageQueries = createQueryKeys(
  "extensionLocalStorage",
  {
    data: {
      queryKey: null,
      queryFn: fetchExtensionLocalStorageData,
    },
  },
);

export const invalidateExtensionLocalStorageDataQuery = debounce(() => {
  queryClient.invalidateQueries({
    queryKey: extensionLocalStorageQueries.data.queryKey,
    exact: true,
  });
}, 0);
