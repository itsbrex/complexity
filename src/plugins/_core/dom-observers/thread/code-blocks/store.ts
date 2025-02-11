import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";

type ThreadCodeBlocksDomObserverStoreType = {
  codeBlocksChunks: (CodeBlock | null)[][] | null;
  resetStore: () => void;
};

export const threadCodeBlocksDomObserverStore =
  createWithEqualityFn<ThreadCodeBlocksDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): ThreadCodeBlocksDomObserverStoreType => ({
          codeBlocksChunks: null,
          resetStore: () => {
            set({
              codeBlocksChunks: null,
            });
          },
        }),
      ),
    ),
  );

export const useThreadCodeBlocksDomObserverStore =
  threadCodeBlocksDomObserverStore;
