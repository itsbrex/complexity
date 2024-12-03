import { sendMessage } from "webext-bridge/content-script";

import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { ExtendedMessageBlock } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const OBSERVER_ID = "cplx-better-message-toolbars-display-explicit-model-name";

export function explicitModelName(messageBlocks: ExtendedMessageBlock[]) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["thread:betterMessageToolbars"]) return;

  messageBlocks.forEach(async ({ $wrapper, $answerHeading }, index) => {
    const $buttonBar = $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR);

    if (!$buttonBar.length || $buttonBar.attr(OBSERVER_ID)) return;

    $buttonBar.attr(OBSERVER_ID, "true");

    await sleep(200);

    const modelCode = await sendMessage(
      "reactVdom:getMessageDisplayModelCode",
      {
        index,
      },
      "window",
    );

    if (!modelCode || !isLanguageModelCode(modelCode)) return;

    const model = languageModels.find((model) => model.code === modelCode);

    if (!model) return;

    const modelName = model.label;

    const $target = $answerHeading.find('[color="super"]');

    if (!$target.length) return $buttonBar.removeAttr(OBSERVER_ID);

    $buttonBar
      .find('div:has(>svg[data-icon="microchip"])')
      .parent()
      .addClass("tw-hidden");

    $target.find(":nth-child(2)").addClass("tw-hidden");

    const modelNameElement = $(
      `<span>${modelName.toLocaleUpperCase()}</span>`,
    ).addClass(
      "tw-font-mono tw-animate-in tw-fade-in tw-border tw-border-border/50 tw-p-1 tw-px-2 tw-rounded-md tw-text-xs tw-bg-secondary",
    );

    $target.append(modelNameElement);
  });
}
