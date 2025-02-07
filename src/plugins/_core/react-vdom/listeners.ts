import { onMessage } from "webext-bridge/window";

import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { getCookie, getReactFiberKey } from "@/utils/utils";

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
  "reactVdom:getCodeBlockContent": (params: {
    messageBlockIndex: number;
    codeBlockIndex: number;
  }) => {
    code: string;
    language: string;
  } | null;
  "reactVdom:triggerRewriteOption": (params: {
    messageBlockIndex: number;
    optionIndex?: number;
  }) => boolean;
  "reactVdom:syncNativeModelSelector": () => void;
};

export function setupReactVdomListeners() {
  onMessage("reactVdom:isMessageBlockInFlight", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL}"]`;

    const $el = $(selector);

    if (!$el.length) return false;

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

    if (error || status == null)
      return (
        $el.find(".prose > .animate-in.fade-in-25.duration-700").length > 0
      );

    return status.toLowerCase() !== "completed";
  });

  onMessage("reactVdom:getMessageModelPreferences", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

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
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

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
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER}"] div[dir="auto"]`;

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
      const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}"][data-index="${codeBlockIndex}"] pre`;

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

  onMessage(
    "reactVdom:triggerRewriteOption",
    ({ data: { messageBlockIndex, optionIndex } }) => {
      const selector = `div[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR}"] ${DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR_CHILD.REWRITE_BUTTON}`;

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

  onMessage("reactVdom:syncNativeModelSelector", () => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.PPLX_COMPONENTS_WRAPPER}"]:last > :first-child`;

    const $modelSelector = $(selector);

    if (!$modelSelector.length) return;

    const fiberNode = ($modelSelector[0] as any)[
      getReactFiberKey($modelSelector[0])
    ];

    if (fiberNode == null) return;

    const [items, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode,
        condition: (node) => node.return.return.memoizedProps.items != null,
        select: (node) =>
          node.return.return.memoizedProps.items as {
            onClick: () => void;
            value: "default" | "pro" | LanguageModelCode;
          }[],
      }),
    )();

    if (error || items == null) return;

    const searchMode = getCookie("pplx.search-mode");

    const item = items.find((item) => item.value === searchMode);

    if (item == null) return;

    item.onClick();
  });
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

  const tree = fiberNode.alternate ?? fiberNode;

  if (condition?.(tree)) return select?.(tree);

  return null;

  // return (
  //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //   findReactFiberNodeValue({
  //     fiberNode: tree.child,
  //     condition,
  //     select,
  //   }) ||
  //   findReactFiberNodeValue({
  //     fiberNode: tree.sibling,
  //     condition,
  //     select,
  //   })
  // );
}
