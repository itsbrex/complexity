import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  handleSearchModeChange,
  populateDefaults,
  resetForceExternalSourcesOffOnRouteChange,
} from "@/plugins/_core/ui-groups/query-box/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

type SharedQueryBoxStore = {
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
