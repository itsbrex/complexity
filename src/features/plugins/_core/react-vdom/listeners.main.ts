import { onMessage } from "webext-bridge/window";

import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { getReactFiberKey } from "@/utils/utils";

export type ReactVdomEvents = {
  "reactVdom:isMessageBlockInFlight": (params: {
    index: number;
  }) => boolean | null;
  "reactVdom:getMessageDisplayModelCode": (params: {
    index: number;
  }) => string | null;
  "reactVdom:getMessageContent": (params: { index: number }) => string | null;
  "reactVdom:getCodeFromCodeBlock": (params: {
    messageBlockIndex: number;
    codeBlockIndex: number;
  }) => {
    code: string;
    language: string;
  } | null;
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
          !!(node.memoizedProps.children[2].props.result.status != null),
        select: (node) =>
          node.memoizedProps.children[2].props.result.status as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] isMessageBlockInFlight", error);

    if (error || status == null) return null;

    return status.toLowerCase() !== "completed";
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
          node.memoizedProps.children[2].props.response.answer != null,
        select: (node) =>
          node.memoizedProps.children[2].props.response.answer as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageContent", error);

    if (error || answer == null) return null;

    return answer;
  });

  onMessage(
    "reactVdom:getCodeFromCodeBlock",
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
