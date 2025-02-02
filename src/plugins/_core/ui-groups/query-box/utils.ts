import { QueryObserver } from "@tanstack/react-query";

import {
  FocusMode,
  isFocusModeCode,
} from "@/data/plugins/better-focus-selector/focus-modes";
import { fastLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import {
  isReasoningLanguageModelCode,
  isLanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PplxApiService } from "@/services/pplx-api";
import { PplxUserSettingsApiResponse } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";
import { getCookie, setCookie, whereAmI } from "@/utils/utils";

export function handleSearchModeChange() {
  sharedQueryBoxStore.subscribe(
    (store) => ({
      isProSearchEnabled: store.isProSearchEnabled,
      selectedLanguageModel: store.selectedLanguageModel,
    }),
    (
      { isProSearchEnabled, selectedLanguageModel },
      {
        isProSearchEnabled: previousIsProSearchEnabled,
        selectedLanguageModel: previousSelectedLanguageModel,
      },
    ) => {
      const isReasoningModel = isReasoningLanguageModelCode(
        selectedLanguageModel,
      );

      if (
        !isReasoningModel &&
        previousSelectedLanguageModel !== selectedLanguageModel
      ) {
        PplxApiService.setDefaultLanguageModel(selectedLanguageModel);
      }

      if (isReasoningModel) {
        if (!previousIsProSearchEnabled) {
          sharedQueryBoxStore.setState({
            isProSearchEnabled: true,
          });
          return;
        } else if (previousIsProSearchEnabled && !isProSearchEnabled) {
          console.log("hey");
          setCookie("pplx.search-mode", "default", 30);
          sharedQueryBoxStore.setState((state) => {
            const defaultLanguageModel =
              queryClient.getQueryData<PplxUserSettingsApiResponse>(
                pplxApiQueries.userSettings.queryKey,
              )?.default_model;

            if (
              !defaultLanguageModel ||
              !isLanguageModelCode(defaultLanguageModel)
            ) {
              state.selectedLanguageModel = "turbo";
            } else {
              if (isReasoningLanguageModelCode(defaultLanguageModel)) {
                state.selectedLanguageModel =
                  fastLanguageModels[0]?.code ?? "claude2";
              } else {
                state.selectedLanguageModel = defaultLanguageModel;
              }
            }
          });
          return;
        }

        if (isProSearchEnabled) {
          setCookie("pplx.search-mode", selectedLanguageModel, 30);
          return;
        }
      }

      if (isProSearchEnabled) {
        setCookie("pplx.search-mode", "pro", 30);
        return;
      }

      setCookie("pplx.search-mode", "default", 30);
    },
  );
}

export function resetForceExternalSourcesOffOnRouteChange() {
  spaRouteChangeCompleteSubscribe(() => {
    sharedQueryBoxStore.setState({
      forceExternalSourcesOff: false,
    });
  });
}

export function populateDefaults() {
  const searchMode = getCookie("pplx.search-mode");

  populateLanguageModelDefaults(searchMode);
  populateProSearchDefaults(searchMode);
  populateFocusModeDefaults();
}

function populateLanguageModelDefaults(searchMode: string | null) {
  const settings = ExtensionLocalStorageService.getCachedSync();

  if (
    settings.plugins["queryBox:languageModelSelector"]
      .respectDefaultSpaceModel &&
    whereAmI() === "collection"
  )
    return;

  if (searchMode == null || !isReasoningLanguageModelCode(searchMode)) {
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
  } else {
    sharedQueryBoxStore.setState((draft) => {
      if (!isReasoningLanguageModelCode(searchMode)) return;
      draft.selectedLanguageModel = searchMode;
    });
  }
}

function populateProSearchDefaults(searchMode: string | null) {
  sharedQueryBoxStore.setState((draft) => {
    if (searchMode == null) return;

    draft.isProSearchEnabled =
      searchMode === "pro" || isReasoningLanguageModelCode(searchMode);
  });
}

function populateFocusModeDefaults() {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const defaultFocusMode = settings?.plugins["queryBox:focusSelector"]
    .defaultFocusMode as FocusMode["code"];

  if (isFocusModeCode(defaultFocusMode)) {
    sharedQueryBoxStore.setState({ selectedFocusMode: defaultFocusMode });
  }
}
