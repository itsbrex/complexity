import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { FocusMode } from "@/data/plugins/better-focus-selector/focus-modes";
import { FocusWebRecency } from "@/data/plugins/better-focus-selector/focus-web-recency";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  handleSearchModeChange,
  populateDefaults,
  resetForceExternalSourcesOffOnRouteChange,
} from "@/plugins/_core/ui-groups/query-box/utils";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

type SharedQueryBoxStore = {
  selectedFocusMode: FocusMode["code"];
  setSelectedFocusMode: (focusMode: FocusMode["code"]) => void;
  selectedRecency: FocusWebRecency["value"];
  setSelectedRecency: (recency: FocusWebRecency["value"]) => void;
  isProSearchEnabled: boolean;
  setIsProSearchEnabled: (isProSearchEnabled: boolean) => void;
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
        isProSearchEnabled: false,
        setIsProSearchEnabled: async (isProSearchEnabled) => {
          set({ isProSearchEnabled });
        },
        selectedLanguageModel: "turbo",
        setSelectedLanguageModel: async (selectedLanguageModel) => {
          set({ selectedLanguageModel });
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
    populateDefaults();
    resetForceExternalSourcesOffOnRouteChange();
    handleSearchModeChange();
  },
});

export { sharedQueryBoxStore, useSharedQueryBoxStore };
