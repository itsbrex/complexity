import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { QueryBoxType } from "@/data/plugins/query-box/types";

export type ScopedQueryBoxStoreType = {
  type: QueryBoxType;
};

export const createQueryBoxScopedStore = (
  initialState: ScopedQueryBoxStoreType,
) =>
  createWithEqualityFn<ScopedQueryBoxStoreType>()(
    subscribeWithSelector(
      immer(
        (set): ScopedQueryBoxStoreType => ({
          ...initialState,
        }),
      ),
    ),
  );
