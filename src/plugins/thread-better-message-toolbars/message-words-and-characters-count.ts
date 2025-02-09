import { sendMessage } from "webext-bridge/content-script";

import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

const MODEL_NAME_COMPONENT_SELECTOR = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT}"]`;

const createAnswerHeadingContainer = (content: string) => {
  return $(`<div>${content}</div>`)
    .addClass(
      "x-text-muted-foreground x-italic x-text-xs x-ml-4 x-text-right x-font-medium",
    )
    .internalComponentAttr(
      INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD
        .ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT,
    );
};

csLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:messageWordsAndCharactersCount",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:betterMessageToolbars"
      ];

    if (
      !pluginsEnableStates["thread:betterMessageToolbars"] ||
      !settings.wordsAndCharactersCount
    )
      return;

    const shouldDisplayTokensCount =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:betterMessageToolbars"
      ].tokensCount;

    threadMessageBlocksDomObserverStore.subscribe(
      (store) => store.messageBlocks,
      (messageBlocks) => {
        messageBlocks?.forEach(
          async (
            { nodes: { $answerHeading }, states: { isInFlight } },
            index,
          ) => {
            if (isInFlight) {
              $answerHeading.find(MODEL_NAME_COMPONENT_SELECTOR).remove();
              return;
            }

            const $existingBadge = $answerHeading.find(
              MODEL_NAME_COMPONENT_SELECTOR,
            );

            if ($existingBadge.length) {
              return;
            }

            const answer = await sendMessage(
              "reactVdom:getMessageContent",
              { index },
              "window",
            );

            if (answer == null) {
              return;
            }

            const answerWordsCount = answer.split(" ").length;
            const answerCharactersCount = answer.length;
            const answerTokensCount = Math.ceil(answer.length / 4);

            const answerWordsAndCharactersCountContainer =
              createAnswerHeadingContainer(
                `${t("common:misc.words")}: ${answerWordsCount}, ${t("common:misc.characters")}: ${answerCharactersCount}${shouldDisplayTokensCount ? `, tokens: ~${answerTokensCount}` : ""}`,
              );
            $answerHeading.append(answerWordsAndCharactersCountContainer);
          },
        );
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
});
