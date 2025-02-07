import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type SettingsPageDomObserverStoreType = {
  $topNavWrapper: JQuery<HTMLElement> | null;
  resetStore: () => void;
};

export const settingsPageDomObserverStore =
  createWithEqualityFn<SettingsPageDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SettingsPageDomObserverStoreType => ({
          $topNavWrapper: null,
          resetStore: () => {
            set({
              $topNavWrapper: null,
            });
          },
        }),
      ),
    ),
  );

export const useSettingsPageDomObserverStore = settingsPageDomObserverStore;
