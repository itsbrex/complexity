import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type ThreadDomObserverStoreType = {
  $navbar: JQuery<HTMLElement> | null;
  $wrapper: JQuery<HTMLElement> | null;
  $popper: JQuery<HTMLElement> | null;
  resetStore: () => void;
};

export const threadDomObserverStore =
  createWithEqualityFn<ThreadDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): ThreadDomObserverStoreType => ({
          $navbar: null,
          $wrapper: null,
          $popper: null,
          resetStore: () => {
            set({
              $navbar: null,
              $wrapper: null,
              $popper: null,
            });
          },
        }),
      ),
    ),
  );

export const useThreadDomObserverStore = threadDomObserverStore;
