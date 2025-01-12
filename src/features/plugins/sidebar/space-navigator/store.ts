import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

export type SpaceNavigatorSidebarStoreType = {
  isShown: boolean;
  setIsShown: (isShown: boolean) => void;
};

export const spaceNavigatorSidebarStore =
  createWithEqualityFn<SpaceNavigatorSidebarStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SpaceNavigatorSidebarStoreType => ({
          isShown: true,
          setIsShown: (isShown) => {
            set((state) => {
              state.isShown = isShown;
            });
          },
        }),
      ),
    ),
  );

export const useSpaceNavigatorSidebarStore = spaceNavigatorSidebarStore;
