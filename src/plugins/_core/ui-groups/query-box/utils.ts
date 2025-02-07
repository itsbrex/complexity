import { QueryObserver } from "@tanstack/react-query";
import { sendMessage } from "webext-bridge/content-script";

import { fastLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import {
  isReasoningLanguageModelCode,
  isLanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { pplxCookiesStore } from "@/data/pplx-cookies-store";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { PplxApiService } from "@/services/pplx-api";
import { PplxUserSettingsApiResponse } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { queryClient } from "@/utils/ts-query-client";
import { getCookie, setCookie, whereAmI } from "@/utils/utils";

export function findToolbarPortalContainer(queryBox: HTMLElement): {
  leftContainer: HTMLElement | null;
  rightContainer: HTMLElement | null;
} {
  const $textareaWrapper = $(queryBox).find("textarea").parent();

  const $queryBoxComponentsWrapper = $textareaWrapper.parent();

  $queryBoxComponentsWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.COMPONENTS_WRAPPER,
  );

  const $toolbar = $queryBoxComponentsWrapper.find(">div:nth-child(2)");

  $toolbar
    .find(">div.flex:first-child")
    .internalComponentAttr(
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.PPLX_COMPONENTS_WRAPPER,
    );

  const $leftContainer = (() => {
    if (!$toolbar.length) return null;

    const $existingLeftContainer = $toolbar.find(
      `[data-cplx-component="${
        INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_LEFT_WRAPPER
      }"]`,
    );

    if ($existingLeftContainer.length) return $existingLeftContainer;

    const $newLeftContainer = $("<div>");

    $newLeftContainer.internalComponentAttr(
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_LEFT_WRAPPER,
    );

    $toolbar.prepend($newLeftContainer);

    return $newLeftContainer;
  })();

  const $rightContainer = (() => {
    if (!$toolbar.length) return null;

    const $existingRightContainer = $toolbar.find(
      `[data-cplx-component="${
        INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_RIGHT_WRAPPER
      }"]`,
    );

    if ($existingRightContainer.length) return $existingRightContainer;

    const $newRightContainer = $("<div>");

    $newRightContainer.internalComponentAttr(
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_RIGHT_WRAPPER,
    );

    $toolbar.append($newRightContainer);

    return $newRightContainer;
  })();

  return {
    leftContainer: $leftContainer?.[0] ?? null,
    rightContainer: $rightContainer?.[0] ?? null,
  };
}

export function handleSearchModeChange() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

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

export function syncNativeModelSelector() {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

  pplxCookiesStore.subscribe(
    (state) => state.cookies,
    () => {
      sendMessage("reactVdom:syncNativeModelSelector", undefined, "window");
    },
  );
}

export function populateDefaults() {
  const searchMode = getCookie("pplx.search-mode");

  populateLanguageModelDefaults(searchMode);
  populateProSearchDefaults(searchMode);
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
