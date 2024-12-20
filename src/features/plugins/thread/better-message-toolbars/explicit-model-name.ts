import { sendMessage } from "webext-bridge/content-script";

import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  ExtendedMessageBlock,
  globalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import {
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS,
  DOM_SELECTORS,
} from "@/utils/dom-selectors";

const OBSERVER_ID = "cplx-better-message-toolbars-display-explicit-model-name";
const MODEL_NAME_COMPONENT_SELECTOR = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING_MODEL_NAME}"]`;

const handleInFlightMessage = ($answerHeading: JQuery<Element>) => {
  $answerHeading.find(MODEL_NAME_COMPONENT_SELECTOR).remove();
  $answerHeading.find(":nth-child(2)").removeClass("tw-hidden");
};

const createModelBadge = (modelName: string) => {
  return $(`<div>${modelName.toLocaleUpperCase()}</div>`)
    .addClass(
      "tw-font-mono tw-animate-in tw-fade-in tw-border tw-border-border/50 tw-p-1 tw-px-2 tw-rounded-md tw-text-xs tw-bg-secondary",
    )
    .internalComponentAttr(
      DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD
        .ANSWER_HEADING_MODEL_NAME,
    );
};

const displayModelBadge = async ({
  $wrapper,
  $answerHeading,
  isInFlight,
  index,
}: {
  $wrapper: JQuery<Element>;
  $answerHeading: JQuery<Element>;
  isInFlight: boolean;
  index: number;
}) => {
  if (isInFlight) {
    handleInFlightMessage($answerHeading);
    return;
  }

  const $buttonBar = $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR);
  if (!$buttonBar.length || $buttonBar.attr(OBSERVER_ID)) return;

  $buttonBar.attr(OBSERVER_ID, "true");
  await sleep(200);

  const modelCode = await sendMessage(
    "reactVdom:getMessageDisplayModelCode",
    { index },
    "window",
  );

  if (!modelCode || !isLanguageModelCode(modelCode)) return;

  const model = languageModels.find((model) => model.code === modelCode);
  if (!model) return;

  const $target = $answerHeading.find('[color="super"]');
  if (!$target.length) {
    $buttonBar.removeAttr(OBSERVER_ID);
    return;
  }

  // Hide original model tooltip and the "Answer" text
  $buttonBar
    .find('div:has(>svg[data-icon="microchip"])')
    .parent()
    .addClass("tw-hidden");
  $target.find(":nth-child(2)").addClass("tw-hidden");

  const modelNameElement = createModelBadge(model.label);
  $target.append(modelNameElement);
};

function explicitModelName(messageBlocks: ExtendedMessageBlock[]) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();
  if (
    !pluginsEnableStates?.["thread:betterMessageToolbars"] ||
    !ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterMessageToolbars"
    ].explicitModelName
  )
    return;

  messageBlocks.forEach(({ $wrapper, $answerHeading, isInFlight }, index) => {
    displayModelBadge({ $wrapper, $answerHeading, isInFlight, index });
  });
}

CsLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:explicitModelName",
  loader: () => {
    globalDomObserverStore.subscribe(
      (state) => state.threadComponents.messageBlocks,
      (messageBlocks) => {
        explicitModelName(messageBlocks ?? []);
      },
    );
  },
  dependencies: [
    "cache:pluginsStates",
    "cache:extensionLocalStorage",
    "cache:languageModels",
  ],
});
