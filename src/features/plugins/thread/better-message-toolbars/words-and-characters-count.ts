import { sendMessage } from "webext-bridge/content-script";

import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import {
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS,
  DOM_SELECTORS,
} from "@/utils/dom-selectors";

const OBSERVER_ID =
  "cplx-better-message-toolbars-display-words-and-characters-count";
const MODEL_NAME_COMPONENT_SELECTOR = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT}"]`;

const handleInFlightMessage = ($answerHeading: JQuery<Element>) => {
  $answerHeading.find(MODEL_NAME_COMPONENT_SELECTOR).remove();
  $answerHeading.find(":nth-child(2)").removeClass("tw-hidden");
};

const createAnswerHeadingContainer = (content: string) => {
  return $(`<div>${content}</div>`)
    .addClass(
      "tw-text-muted-foreground tw-italic tw-text-xs tw-ml-4 tw-text-right tw-font-medium",
    )
    .internalComponentAttr(
      DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD
        .ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT,
    );
};

const createQueryHoverContainer = (content: string) => {
  return $(
    `<div><span>${content}</span><div class="mx-2xs h-4 border-l border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50  dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent"></div></div>`,
  )
    .addClass(
      "tw-ml-2 tw-text-muted-foreground tw-italic tw-text-xs tw-flex tw-items-center tw-gap-2 tw-font-medium",
    )
    .internalComponentAttr(
      DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD
        .QUERY_HOVER_CONTAINER,
    );
};

csLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:wordsAndCharactersCount",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();
    const settings =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:betterMessageToolbars"
      ];

    if (
      !pluginsEnableStates?.["thread:betterMessageToolbars"] ||
      !settings.wordsAndCharactersCount
    )
      return;

    const shouldDisplayTokensCount =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:betterMessageToolbars"
      ].tokensCount;

    globalDomObserverStore.subscribe(
      (state) => ({
        messageBlocks: state.threadComponents.messageBlocks,
        queryHoverContainers: state.threadComponents.queryHoverContainers,
      }),
      ({ messageBlocks, queryHoverContainers }) => {
        messageBlocks?.forEach(
          async ({ isInFlight, $answerHeading, $wrapper, $query }, index) => {
            if (isInFlight) {
              handleInFlightMessage($answerHeading);
              return;
            }

            const $buttonBar = $wrapper.find(
              DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR,
            );

            if (
              !$buttonBar.length ||
              !$buttonBar.is(":visible") ||
              $buttonBar.attr(OBSERVER_ID)
            ) {
              return;
            }

            $buttonBar.attr(OBSERVER_ID, "true");

            if ($answerHeading.find(MODEL_NAME_COMPONENT_SELECTOR).length > 0) {
              $buttonBar.removeAttr(OBSERVER_ID);
              return;
            }

            const answer = await sendMessage(
              "reactVdom:getMessageContent",
              { index },
              "window",
            );

            if (!$buttonBar.length || !$buttonBar.is(":visible")) {
              $buttonBar.removeAttr(OBSERVER_ID);
              return;
            }

            if (answer == null) {
              $buttonBar.removeAttr(OBSERVER_ID);
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

            const query = $query
              .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_TITLE)
              .text();
            const queryWordsCount = query.split(" ").length;
            const queryCharactersCount = query.length;
            const queryTokensCount = Math.ceil(query.length / 4);

            const $queryWordsAndCharactersCountContainer =
              createQueryHoverContainer(
                `${t("common:misc.words")}: ${queryWordsCount}, ${t("common:misc.characters")}: ${queryCharactersCount}${shouldDisplayTokensCount ? `, tokens: ~${queryTokensCount}` : ""}`,
              );

            if (
              queryHoverContainers == null ||
              queryHoverContainers[index] == null
            )
              return $buttonBar.removeAttr(OBSERVER_ID);

            $(queryHoverContainers[index]).prepend(
              $queryWordsAndCharactersCountContainer,
            );
          },
        );
      },
    );
  },
});
