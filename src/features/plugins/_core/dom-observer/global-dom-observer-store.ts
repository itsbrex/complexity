import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { MessageBlock } from "@/utils/UiUtils.types";

export type GlobalDomObserverStore = {
  queryBoxes: {
    mainQueryBox: HTMLElement | null;
    mainModalQueryBox: HTMLElement | null;
    spaceQueryBox: HTMLElement | null;
    followUpQueryBox: HTMLElement | null;
  };
  setQueryBoxes: (
    newQueryBoxes: Partial<GlobalDomObserverStore["queryBoxes"]>,
  ) => void;
  threadComponents: {
    popper: HTMLElement | null;
    wrapper: HTMLElement | null;
    messageBlocks: MessageBlock[] | null;
  };
  setThreadComponents: (
    newThreadComponents: Partial<GlobalDomObserverStore["threadComponents"]>,
  ) => void;
};

export const globalDomObserverStore =
  createWithEqualityFn<GlobalDomObserverStore>()(
    subscribeWithSelector(
      immer(
        (set, get): GlobalDomObserverStore => ({
          queryBoxes: {
            mainQueryBox: null,
            mainModalQueryBox: null,
            spaceQueryBox: null,
            followUpQueryBox: null,
          },
          setQueryBoxes: (newQueryBoxes) => {
            Object.entries(newQueryBoxes).forEach(([key, value]) => {
              const currentKey =
                key as keyof GlobalDomObserverStore["queryBoxes"];

              if (value != null && value !== get().queryBoxes[currentKey]) {
                set({
                  queryBoxes: {
                    ...get().queryBoxes,
                    [currentKey]: value,
                  },
                });
              }
            });
          },
          threadComponents: {
            wrapper: null,
            popper: null,
            messageBlocks: null,
          },
          setThreadComponents: (newThreadComponents) => {
            Object.entries(newThreadComponents).forEach(([key, value]) => {
              const currentKey =
                key as keyof GlobalDomObserverStore["threadComponents"];

              if (
                value != null &&
                value !== get().threadComponents[currentKey]
              ) {
                set({
                  threadComponents: {
                    ...get().threadComponents,
                    [currentKey]: value,
                  },
                });
              }
            });
          },
        }),
      ),
    ),
  );

export const useGlobalDomObserverStore = globalDomObserverStore;
