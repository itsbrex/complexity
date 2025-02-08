import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type SidebarDomObserverStoreType = {
  $wrapper: JQuery<HTMLElement> | null;
  $spaceButtonWrapper: JQuery<HTMLElement> | null;
  $libraryButtonWrapper: JQuery<HTMLElement> | null;
  resetStore: () => void;
};

export const sidebarDomObserverStore =
  createWithEqualityFn<SidebarDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SidebarDomObserverStoreType => ({
          $wrapper: null,
          $spaceButtonWrapper: null,
          $libraryButtonWrapper: null,
          resetStore: () => {
            set({
              $wrapper: null,
              $spaceButtonWrapper: null,
              $libraryButtonWrapper: null,
            });
          },
        }),
      ),
    ),
  );

export const useSidebarDomObserverStore = sidebarDomObserverStore;
