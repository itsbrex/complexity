import { QueryObserver } from "@tanstack/react-query";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import {
  FocusMode,
  isFocusModeCode,
} from "@/data/plugins/better-focus-selector/focus-modes";
import { FocusWebRecency } from "@/data/plugins/better-focus-selector/focus-web-recency";
import {
  isLanguageModelCode,
  LanguageModel,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PplxApiService } from "@/services/pplx-api";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

type SharedQueryBoxStore = {
  selectedFocusMode: FocusMode["code"];
  setSelectedFocusMode: (focusMode: FocusMode["code"]) => void;
  selectedRecency: FocusWebRecency["value"];
  setSelectedRecency: (recency: FocusWebRecency["value"]) => void;
  selectedLanguageModel: LanguageModel["code"];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel["code"],
  ) => void;
  forceExternalSourcesOff: boolean;
  setForceExternalSourcesOff: (forceExternalSourcesOff: boolean) => void;
};

const useSharedQueryBoxStore = createWithEqualityFn<SharedQueryBoxStore>()(
  subscribeWithSelector(
    immer(
      (set): SharedQueryBoxStore => ({
        selectedFocusMode: "internet",
        setSelectedFocusMode: (focusMode) => {
          set({ selectedFocusMode: focusMode });

          const settings = ExtensionLocalStorageService.getCachedSync();

          const persistMode = settings?.plugins["queryBox:focusSelector"].mode;

          if (persistMode === "persistent") {
            ExtensionLocalStorageService.set((draft) => {
              draft.plugins["queryBox:focusSelector"].defaultFocusMode =
                focusMode;
            });
          }
        },
        selectedRecency: "ALL",
        setSelectedRecency: (recency) => {
          set({ selectedRecency: recency });
        },
        selectedLanguageModel: "turbo",
        setSelectedLanguageModel: async (selectedLanguageModel) => {
          set({ selectedLanguageModel });
          await PplxApiService.setDefaultLanguageModel(selectedLanguageModel);
          queryClient.invalidateQueries({
            queryKey: pplxApiQueries.userSettings.queryKey,
          });
        },
        forceExternalSourcesOff: false,
        setForceExternalSourcesOff: (forceExternalSourcesOff) => {
          set({ forceExternalSourcesOff });
        },
      }),
    ),
  ),
);

const sharedQueryBoxStore = useSharedQueryBoxStore;

csLoaderRegistry.register({
  id: "plugin:queryBox:initSharedStore",
  dependencies: [
    "cache:extensionLocalStorage",
    "messaging:namespaceSetup",
    "cache:pluginsStates",
  ],
  loader: async () => {
    const pplxUserSettingsObserverRemove = new QueryObserver(
      queryClient,
      pplxApiQueries.userSettings,
    ).subscribe((data) => {
      if (!data.data) return;

      sharedQueryBoxStore.setState((state) => {
        state.selectedLanguageModel = isLanguageModelCode(
          data.data.default_model,
        )
          ? data.data.default_model
          : "turbo";
      });

      pplxUserSettingsObserverRemove();
    });

    const settings = ExtensionLocalStorageService.getCachedSync();

    const defaultFocusMode = settings?.plugins["queryBox:focusSelector"]
      .defaultFocusMode as FocusMode["code"];

    if (isFocusModeCode(defaultFocusMode)) {
      sharedQueryBoxStore.setState({ selectedFocusMode: defaultFocusMode });
    }

    spaRouteChangeCompleteSubscribe(() => {
      sharedQueryBoxStore.setState({
        forceExternalSourcesOff: false,
      });
    });
  },
});

export { sharedQueryBoxStore, useSharedQueryBoxStore };
