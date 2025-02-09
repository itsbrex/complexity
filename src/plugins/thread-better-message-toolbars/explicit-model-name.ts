import { sendMessage } from "webext-bridge/content-script";

import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

const MODEL_NAME_COMPONENT_SELECTOR = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING_MODEL_NAME}"]`;

const createModelBadge = (modelName: string) => {
  return $(`<div>${modelName.toLocaleUpperCase()}</div>`)
    .addClass(
      "x-font-mono x-animate-in x-fade-in x-border x-border-border/50 x-p-1 x-px-2 x-rounded-md x-text-xs x-bg-secondary x-font-medium",
    )
    .internalComponentAttr(
      INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD
        .ANSWER_HEADING_MODEL_NAME,
    );
};

const displayModelBadge = async ({
  $bottomBar,
  $answerHeading,
  isInFlight,
  index,
}: {
  $bottomBar: JQuery<HTMLElement>;
  $answerHeading: JQuery<HTMLElement>;
  isInFlight: boolean;
  index: number;
}) => {
  if (isInFlight) {
    $answerHeading.find(MODEL_NAME_COMPONENT_SELECTOR).remove();
    $answerHeading.find(":nth-child(2)").removeClass("x-hidden");
    return;
  }

  const $exisitingBadge = $answerHeading.find(MODEL_NAME_COMPONENT_SELECTOR);

  if (!$bottomBar.length || $exisitingBadge.length) return;

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
    return;
  }

  // Hide original model tooltip and the "Answer" text
  $bottomBar
    .find('div:has(>svg[data-icon="microchip"])')
    .parent()
    .addClass("x-hidden");
  $target.find(":nth-child(2)").addClass("x-hidden");

  const modelNameElement = createModelBadge(model.label);
  $target.append(modelNameElement);
};

function explicitModelName(messageBlocks: MessageBlock[]) {
  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();
  if (
    !pluginsEnableStates["thread:betterMessageToolbars"] ||
    !ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterMessageToolbars"
    ].explicitModelName
  )
    return;

  messageBlocks.forEach(
    (
      { nodes: { $answerHeading, $bottomBar }, states: { isInFlight } },
      index,
    ) => {
      displayModelBadge({ $bottomBar, $answerHeading, isInFlight, index });
    },
  );
}

csLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:explicitModelName",
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates["thread:betterMessageToolbars"] ||
      !settings.plugins["thread:betterMessageToolbars"].explicitModelName
    )
      return;

    threadMessageBlocksDomObserverStore.subscribe(
      (store) => store.messageBlocks,
      (messageBlocks) => {
        explicitModelName(messageBlocks ?? []);
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
  dependencies: [
    "cache:pluginsStates",
    "cache:extensionLocalStorage",
    "cache:languageModels",
  ],
});
