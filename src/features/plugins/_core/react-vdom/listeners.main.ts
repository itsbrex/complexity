import { onMessage } from "webext-bridge/window";

import { DOM_INTERNAL_SELECTORS } from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { getReactFiberKey } from "@/utils/utils";

export type ReactVdomEvents = {
  "reactVdom:isMessageBlockInFlight": (params: {
    index: number;
  }) => boolean | null;
};

export function setupReactVdomListeners() {
  onMessage("reactVdom:isMessageBlockInFlight", ({ data: { index } }) => {
    const selector = `${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.BLOCK}[data-index="${index}"] ${DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL}`;

    const $el = $(selector);

    if (!$el.length) return null;

    const [isInFlight, error] = errorWrapper(() => {
      return findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          !!(
            node?.memoizedProps?.children?.[2]?.props != null &&
            "isEntryInFlight" in node.memoizedProps.children[2].props
          ),
        select: (node) =>
          node.memoizedProps.children[2].props.isEntryInFlight as boolean,
      });
    })();

    if (error || isInFlight == null) return null;

    return isInFlight;
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
