import { sendMessage } from "webext-bridge/content-script";

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

const OBSERVER_ID =
  "cplx-better-message-toolbars-display-words-and-characters-count";
const MODEL_NAME_COMPONENT_SELECTOR = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT}"]`;

const handleInFlightMessage = ($answerHeading: JQuery<Element>) => {
  $answerHeading.find(MODEL_NAME_COMPONENT_SELECTOR).remove();
  $answerHeading.find(":nth-child(2)").removeClass("tw-hidden");
};

const createAnswerHeadingContainer = (content: string) => {
  return $(`<div>${content}</div>`)
    .addClass("tw-text-muted-foreground tw-italic tw-text-xs")
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
      "tw-ml-2 tw-text-muted-foreground tw-italic tw-text-xs tw-flex tw-items-center tw-gap-2",
    )
    .internalComponentAttr(
      DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD
        .QUERY_HOVER_CONTAINER,
    );
};

const displayWordsAndCharactersCount = async ({
  $wrapper,
  $answerHeading,
  $query,
  isInFlight,
  messageIndex,
}: {
  $wrapper: JQuery<Element>;
  $answerHeading: JQuery<Element>;
  $query: JQuery<Element>;
  isInFlight: boolean;
  messageIndex: number;
}) => {
  if (isInFlight) {
    handleInFlightMessage($answerHeading);
    return;
  }

  const $buttonBar = $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR);
  if (!$buttonBar.length || $buttonBar.attr(OBSERVER_ID)) return;

  $buttonBar.attr(OBSERVER_ID, "true");
  await sleep(200);

  const queryWordsCount = $query
    .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_TITLE)
    .text()
    .split(" ").length;
  const queryCharactersCount = $query
    .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_TITLE)
    .text().length;

  const queryWordsAndCharactersCountContainer = createQueryHoverContainer(
    `words: ${queryWordsCount}, characters: ${queryCharactersCount}`,
  );

  $query
    .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_HOVER_CONTAINER)
    .prepend(queryWordsAndCharactersCountContainer);

  const answer = await sendMessage(
    "reactVdom:getMessageContent",
    { index: messageIndex },
    "window",
  );

  if (answer == null) return;

  const answerWordsCount = answer.split(" ").length;
  const answerCharactersCount = answer.length;

  const answerWordsAndCharactersCountContainer = createAnswerHeadingContainer(
    `words: ${answerWordsCount}, characters: ${answerCharactersCount}`,
  );
  $answerHeading.append(answerWordsAndCharactersCountContainer);
};

function wordsAndCharactersCount(messageBlocks: ExtendedMessageBlock[]) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();
  if (
    !pluginsEnableStates?.["thread:betterMessageToolbars"] ||
    !ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterMessageToolbars"
    ].wordsAndCharactersCount
  )
    return;

  messageBlocks.forEach(
    ({ $wrapper, $answerHeading, $query, isInFlight }, index) => {
      displayWordsAndCharactersCount({
        $wrapper,
        $query,
        $answerHeading,
        isInFlight,
        messageIndex: index,
      });
    },
  );
}

CsLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:wordsAndCharactersCount",
  loader: () => {
    globalDomObserverStore.subscribe(
      (state) => state.threadComponents.messageBlocks,
      (messageBlocks) => {
        wordsAndCharactersCount(messageBlocks ?? []);
      },
    );
  },
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
});
