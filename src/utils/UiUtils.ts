import { DOM_INTERNAL_SELECTORS, DOM_SELECTORS } from "@/utils/dom-selectors";
import { CodeBlock, MessageBlock, QueryBoxType } from "@/utils/UiUtils.types";

export default class UiUtils {
  static isDarkTheme() {
    return $("html").attr("data-color-scheme") === "dark";
  }

  static getThreadWrapper() {
    return $(DOM_SELECTORS.THREAD.WRAPPER);
  }

  static getMessagesContainer() {
    let $messagesContainer = $(DOM_SELECTORS.THREAD.CONTAINER.NORMAL);

    if (!$messagesContainer.length) {
      $messagesContainer = $(DOM_SELECTORS.THREAD.CONTAINER.BRANCHED);
    }

    return $messagesContainer;
  }

  static getMessageBlocks(throwOnError = false): MessageBlock[] {
    const $messagesContainer = UiUtils.getMessagesContainer();

    // Cache selectors to avoid string concatenation in loop
    const textColSelector = `${DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL}:last`;
    const visualColSelector = `${DOM_SELECTORS.THREAD.MESSAGE.VISUAL_COL}:last`;
    const internalTextColClass =
      DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL.slice(1);
    const internalVisualColClass =
      DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.VISUAL_COL.slice(1);
    const internalBlockClass =
      DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK.slice(1);

    const children = $messagesContainer
      .children()
      .toArray()
      .filter(
        (child) =>
          $(child).find(DOM_SELECTORS.THREAD.MESSAGE.WRAPPER)?.length > 0,
      );

    const messageBlocks = [] as MessageBlock[];

    for (let i = 0; i < children.length; i++) {
      const $wrapper = $(children[i]);

      $wrapper.addClass(internalBlockClass).attr({ "data-index": i });

      const { $query, $answer, $answerHeading } =
        UiUtils.parseMessageBlock($wrapper);

      $query.addClass(
        DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY.slice(1),
      );
      $answer.addClass(
        DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER.slice(1),
      );
      $answerHeading.addClass(
        DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING.slice(
          1,
        ),
      );

      if (!$query.length || !$answer.length || !$answerHeading.length) {
        if (throwOnError) {
          throw new Error("Invalid message block");
        }
        continue;
      }

      // Cache jQuery lookups
      const $textCol = $wrapper.find(textColSelector);
      const $visualCol = $wrapper.find(visualColSelector);

      $textCol.addClass(internalTextColClass);
      $visualCol.addClass(internalVisualColClass);

      messageBlocks.push({
        $wrapper,
        $answerHeading,
        $query,
        $answer,
      });
    }

    return messageBlocks;
  }

  static parseMessageBlock($messageBlock: JQuery<Element>) {
    const $query = $messageBlock.find(
      DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY,
    );
    const $answer = $messageBlock.find(
      DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER,
    );
    const $answerHeading = $messageBlock.find(
      DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING,
    );

    return {
      $messageBlock,
      $query,
      $answer,
      $answerHeading,
    };
  }

  static getCodeBlocks(): CodeBlock[] {
    const internalCodeBlockClass =
      DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK.slice(1);

    const codeBlocks = $(
      DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.WRAPPER,
    ).toArray();

    const returnValue = [] as CodeBlock[];

    for (let i = 0; i < codeBlocks.length; i++) {
      const $codeBlock = $(codeBlocks[i]);

      $codeBlock.addClass(internalCodeBlockClass);

      const $pre = $codeBlock.find("pre");
      const $code = $pre.find("code");
      const $nativeHeader = $codeBlock.find(
        DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.NATIVE_HEADER,
      );
      const $nativeCopyButton = $codeBlock.find(
        DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.NATIVE_COPY_BUTTON,
      );

      if (
        !$pre.length ||
        !$code.length ||
        !$nativeHeader.length ||
        !$nativeCopyButton.length
      ) {
        continue;
      }

      returnValue.push({
        $wrapper: $codeBlock,
        $pre,
        $code,
        $nativeHeader,
        $nativeCopyButton,
      });
    }

    return returnValue;
  }

  static getActiveQueryBoxTextarea({
    type,
  }: {
    type?: QueryBoxType;
  } = {}): JQuery<HTMLTextAreaElement> {
    if (!type) return $(DOM_SELECTORS.QUERY_BOX.TEXTAREA.ARBITRARY);

    // Cache the parents lookup since it's used multiple times
    const $parents = $(
      `${DOM_SELECTORS.QUERY_BOX.SUBMIT_BUTTON}:last`,
    ).parents();

    let selector;

    switch (type) {
      case "main":
        selector = DOM_SELECTORS.QUERY_BOX.TEXTAREA.MAIN;
        break;
      case "main-modal":
        selector = DOM_SELECTORS.QUERY_BOX.TEXTAREA.MAIN_MODAL;
        break;
      case "space":
        selector = DOM_SELECTORS.QUERY_BOX.TEXTAREA.SPACE;
        break;
      case "follow-up":
        selector = DOM_SELECTORS.QUERY_BOX.TEXTAREA.FOLLOW_UP;
        break;
    }

    // Single DOM traversal instead of multiple .find() calls
    return $parents.find(selector) as JQuery<HTMLTextAreaElement>;
  }

  static getActiveQueryBox({ type }: { type?: QueryBoxType } = {}) {
    return UiUtils.getActiveQueryBoxTextarea({
      type,
    }).parents(DOM_SELECTORS.QUERY_BOX.WRAPPER);
  }

  static getProSearchToggle() {
    return $(DOM_SELECTORS.QUERY_BOX.PRO_SEARCH_TOGGLE);
  }

  static getStickyNavbar() {
    return $(DOM_SELECTORS.STICKY_NAVBAR);
  }

  static getWordOnCaret(element: HTMLTextAreaElement) {
    const text = element.value;
    const caret = element.selectionStart;

    if (!text || caret === undefined) {
      return {
        word: "",
        start: 0,
        end: 0,
        newText: "",
      };
    }

    // Find the start of the word
    let start = text.slice(0, caret).search(/\S+$/);
    if (start === -1) {
      start = caret;
    }

    // Find the end of the word
    let end = text.slice(caret).search(/\s/);
    if (end === -1) {
      end = text.length;
    } else {
      end += caret;
    }

    const word = text.slice(start, end);
    const newText = text.slice(0, start) + text.slice(end);

    return {
      word,
      start,
      end,
      newText,
    };
  }

  static setReactTextareaValue(
    textarea: HTMLTextAreaElement,
    newValue: string,
  ) {
    if (textarea == null) return;

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;

    if (nativeTextareaValueSetter) {
      nativeTextareaValueSetter.call(textarea, newValue);
    }

    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  static setReactInputValue(input: HTMLInputElement, newValue: string) {
    if (input == null) return;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, newValue);
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  static getMostVisibleElementIndex(elements: Element[]) {
    let maxVisiblePercentage = 0;
    let indexWithMaxVisible = -1;

    elements.forEach((element, index) => {
      const visiblePercentage = getVisiblePercentage(element);
      if (visiblePercentage > maxVisiblePercentage) {
        maxVisiblePercentage = visiblePercentage;
        indexWithMaxVisible = index;
      }
    });

    return indexWithMaxVisible;

    function getVisiblePercentage(element: Element) {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const windowWidth =
        window.innerWidth || document.documentElement.clientWidth;

      // Calculate the visible part of the element
      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, windowWidth) - Math.max(rect.left, 0),
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0),
      );
      const visibleArea = visibleWidth * visibleHeight;
      const totalArea = rect.width * rect.height;

      return (visibleArea / totalArea) * 100;
    }
  }
}
