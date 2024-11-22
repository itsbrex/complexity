import { onMessage } from "webext-bridge/window";

import { DOM_INTERNAL_SELECTORS } from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { getReactFiberKey } from "@/utils/utils";

export type ReactVdomEvents = {
  "reactVdom:isMessageBlockInFlight": (params: {
    index: number;
  }) => boolean | null;
  "reactVdom:getMessageDisplayModelCode": (params: {
    index: number;
  }) => string | null;
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
    const selector = `${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK}[data-index="${index}"] ${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL}`;

    const $el = $(selector);

    if (!$el.length) return null;

    const [isInFlight, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          !!(
            node.memoizedProps.children[2].props != null &&
            node.memoizedProps.children[2].props.isEntryInFlight != null
          ),
        select: (node) =>
          node.memoizedProps.children[2].props.isEntryInFlight as boolean,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] isMessageBlockInFlight", error);

    if (error || isInFlight == null) return null;

    return isInFlight;
  });

  onMessage("reactVdom:getMessageDisplayModelCode", ({ data: { index } }) => {
    const selector = `${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK}[data-index="${index}"]`;

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

  onMessage(
    "reactVdom:getCodeFromCodeBlock",
    ({ data: { messageBlockIndex, codeBlockIndex } }) => {
      const selector = `${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK}[data-index="${messageBlockIndex}"] ${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}[data-index="${codeBlockIndex}"] pre`;

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

      if (error || error2 || code == null || language == null) return null;

      return {
        code,
        language,
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
