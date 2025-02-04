import { onMessage } from "webext-bridge/window";

import {
  FOCUS_MODES_NATIVE_VDOM_MAP,
  FocusMode,
  isFocusModeCode,
} from "@/data/plugins/better-focus-selector/focus-modes";
import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS,
  DOM_SELECTORS,
} from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { UiUtils } from "@/utils/ui-utils";
import { getReactFiberKey } from "@/utils/utils";

export type ReactVdomEvents = {
  "reactVdom:isMessageBlockInFlight": (params: {
    index: number;
  }) => boolean | null;
  "reactVdom:getMessageModelPreferences": (params: { index: number }) => {
    displayModel: LanguageModelCode;
  } | null;
  "reactVdom:getMessageDisplayModelCode": (params: {
    index: number;
  }) => string | null;
  "reactVdom:getMessageContent": (params: { index: number }) => string | null;
  "reactVdom:getMessageFocusMode": (params: {
    index: number;
  }) => FocusMode["code"] | null;
  "reactVdom:getCodeBlockContent": (params: {
    messageBlockIndex: number;
    codeBlockIndex: number;
  }) => {
    code: string;
    language: string;
  } | null;
  "reactVdom:setFocusMode": (params: { focusMode: FocusMode["code"] }) => void;
  "reactVdom:triggerRewriteOption": (params: {
    messageBlockIndex: number;
    optionIndex?: number;
  }) => boolean;
};

export function setupReactVdomListeners() {
  onMessage("reactVdom:isMessageBlockInFlight", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${index}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL}"]`;

    const $el = $(selector);

    if (!$el.length) return null;

    const [status, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          !!(node.memoizedProps.children[3].props.result.status != null),
        select: (node) =>
          node.memoizedProps.children[3].props.result.status as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] isMessageBlockInFlight", error);

    if (error || status == null) return null;

    return status.toLowerCase() !== "completed";
  });

  onMessage("reactVdom:getMessageModelPreferences", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

    const $el = $(selector).prev();

    if (!$el.length) return null;

    const [preferences, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.return.memoizedProps.result != null &&
          node.return.memoizedProps.result.mode != null &&
          node.return.memoizedProps.result.is_pro_reasoning_mode != null &&
          node.return.memoizedProps.result.display_model != null,
        select: (node) =>
          node.return.memoizedProps.result as {
            mode: string;
            is_pro_reasoning_mode: boolean;
            display_model: LanguageModelCode;
          },
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageModelPreferences", error);

    if (error || preferences == null) return null;

    return {
      // mode: preferences.mode,
      // isProReasoningMode: preferences.is_pro_reasoning_mode,
      displayModel: preferences.display_model,
    };
  });

  onMessage("reactVdom:getMessageDisplayModelCode", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

    const $el = $(selector).prev();

    if (!$el.length) return null;

    const [modelCode, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.return.memoizedProps.result.display_model != null,
        select: (node) =>
          node.return.memoizedProps.result.display_model as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageDisplayModelCode", error);

    if (error || modelCode == null) return null;

    return modelCode;
  });

  onMessage("reactVdom:getMessageContent", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${index}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER}"] div[dir="auto"]`;

    const $el = $(selector);

    if (!$el.length) return null;

    const [answer, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.memoizedProps.children[3].props.response.answer != null,
        select: (node) =>
          node.memoizedProps.children[3].props.response.answer as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageContent", error);

    if (error || answer == null) return null;

    return answer;
  });

  onMessage(
    "reactVdom:getCodeBlockContent",
    ({ data: { messageBlockIndex, codeBlockIndex } }) => {
      const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}"][data-index="${codeBlockIndex}"] pre`;

      const $el = $(selector);

      if (!$el.length) return null;

      const fiberNode = ($el[0] as any)[getReactFiberKey($el[0])];

      const [code, error] = errorWrapper(() =>
        findReactFiberNodeValue({
          fiberNode,
          condition: (node) =>
            node.memoizedProps.children[0].props.children[0] != null,
          select: (node) =>
            node.memoizedProps.children[0].props.children[0] as string,
        }),
      )();

      const [language, error2] = errorWrapper(() =>
        findReactFiberNodeValue({
          fiberNode,
          condition: (node) =>
            node.memoizedProps.children[0].props.className != null,
          select: (node) => {
            const language =
              node.memoizedProps.children[0].props.className.replace(
                /^language-/,
                "",
              );

            return language;
          },
        }),
      )();

      if (error || code == null) return null;

      return {
        code,
        language: error2 || language == null ? "text" : language,
      };
    },
  );

  onMessage("reactVdom:getMessageFocusMode", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

    const $el = $(selector).prev();

    if (!$el.length) return null;

    const [focusMode, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.return.memoizedProps.result.search_focus != null,
        select: (node) =>
          node.return.memoizedProps.result.search_focus as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageFocusMode", error);

    if (error || focusMode == null) return null;

    if (!isFocusModeCode(focusMode)) return null;

    return focusMode;
  });

  onMessage("reactVdom:setFocusMode", ({ data: { focusMode } }) => {
    if (!isFocusModeCode(focusMode)) {
      return;
    }

    const $activeQueryBox = UiUtils.getActiveQueryBox();

    if (!$activeQueryBox.length) {
      return;
    }
    function getFocusSelector() {
      const isIncognito =
        $activeQueryBox
          .find(
            `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.QUERY_BOX_CHILD.COMPONENTS_WRAPPER}"] > div:nth-child(2)`,
          )
          .find(DOM_SELECTORS.QUERY_BOX.INCOGNITO_TOGGLE).length > 0;

      return $activeQueryBox
        .find(
          `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.QUERY_BOX_CHILD.COMPONENTS_WRAPPER}"] > div:nth-child(2)`,
        )
        .find(
          `> span:nth-child(${isIncognito ? 3 : 2}) > button:has(svg[data-icon="bars-filter"]), > span:nth-child(${isIncognito ? 3 : 2}) > button:has(svg[data-icon="chevron-down"])`,
        );
    }

    const $focusSelector = getFocusSelector();

    if (!$focusSelector.length) {
      return;
    }

    const $wrapper = $focusSelector.parent();

    if (!$wrapper.length) {
      return;
    }

    const fiberNode = ($wrapper[0] as any)[getReactFiberKey($wrapper[0])];

    if (fiberNode == null) {
      return;
    }

    errorWrapper(() => {
      const index = FOCUS_MODES_NATIVE_VDOM_MAP.indexOf(focusMode);

      if (index === -1) return;

      fiberNode.return.return.memoizedProps.items[index].onClick();
    })();
  });

  onMessage(
    "reactVdom:triggerRewriteOption",
    ({ data: { messageBlockIndex, optionIndex } }) => {
      const selector = `div[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR}"] ${DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR_CHILD.REWRITE_BUTTON}`;

      const $rewriteButtonWrapper = $(selector).parent().parent();

      if (!$rewriteButtonWrapper.length) return false;

      const fiberNode = ($rewriteButtonWrapper[0] as any)[
        getReactFiberKey($rewriteButtonWrapper[0])
      ];

      if (fiberNode == null) return false;

      const [triggerRewriteOptionHandler, error] = errorWrapper(() =>
        findReactFiberNodeValue({
          fiberNode,
          condition: (node) => {
            const items = node.memoizedProps.children.props.items;
            const index = optionIndex ?? items.length - 1;
            return items[index].onClick != null;
          },
          select: (node) => {
            const items = node.memoizedProps.children.props.items;
            const index = optionIndex ?? items.length - 1;
            return items[index].onClick as () => void;
          },
        }),
      )();

      if (error || triggerRewriteOptionHandler == null) return false;

      triggerRewriteOptionHandler();

      return true;
    },
  );
}

function findReactFiberNodeValue<T>({
  fiberNode,
  condition,
  select,
}: {
  fiberNode: any;
  condition: (fiberNode: any) => boolean;
  select: (fiberNode: any) => T;
}): T | null {
  if (fiberNode == null) return null;

  if (condition?.(fiberNode)) return select?.(fiberNode);

  return (
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    findReactFiberNodeValue({
      fiberNode: fiberNode.child,
      condition,
      select,
    }) ||
    findReactFiberNodeValue({
      fiberNode: fiberNode.sibling,
      condition,
      select,
    })
  );
}
