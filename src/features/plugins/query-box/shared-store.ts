import { QueryObserver } from "@tanstack/react-query";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import {
  isLanguageModelCode,
  LanguageModel,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { PplxApiService } from "@/services/pplx-api/pplx-api";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { extensionExec } from "@/types/hof";
import { queryClient } from "@/utils/ts-query-client";

type SharedQueryBoxStore = {
  selectedLanguageModel: LanguageModel["code"];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel["code"],
  ) => void;
};

const useSharedQueryBoxStore = createWithEqualityFn<SharedQueryBoxStore>()(
  subscribeWithSelector(
    immer(
      (set): SharedQueryBoxStore => ({
        selectedLanguageModel: "turbo",
        setSelectedLanguageModel: async (selectedLanguageModel) => {
          set({ selectedLanguageModel });
          await PplxApiService.setDefaultLanguageModel(selectedLanguageModel);
          queryClient.invalidateQueries({
            queryKey: pplxApiQueries.userSettings.queryKey,
          });
        },
      }),
    ),
  ),
);

const sharedQueryBoxStore = useSharedQueryBoxStore;

async function initSharedQueryBoxStore() {
  let firstTime = true;

  new QueryObserver(queryClient, pplxApiQueries.userSettings).subscribe(
    (data) => {
      if (data.data) {
        sharedQueryBoxStore.setState((state) => {
          if (firstTime)
            state.selectedLanguageModel = isLanguageModelCode(
              data.data.default_model,
            )
              ? data.data.default_model
              : "turbo";
        });

        firstTime = false;
      }
    },
  );
}

extensionExec(() => initSharedQueryBoxStore())();

export { initSharedQueryBoxStore, sharedQueryBoxStore, useSharedQueryBoxStore };
