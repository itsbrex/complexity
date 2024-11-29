import { useWindowSize } from "@uidotdev/usehooks";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";

import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { PANEL_WIDTH } from "@/features/plugins/thread/toc/Wrapper";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const DOM_OBSERVER_ID = "thread-navigation-toc-panel-position";

type UsePanelPosition = {
  position: { top: number; left: number };
  isFloating: boolean;
};

export function usePanelPosition(): UsePanelPosition | null {
  const windowSize = useWindowSize();

  const [panelPosition, setPanelPosition] = useState<UsePanelPosition | null>(
    null,
  );

  const threadWrapper = useGlobalDomObserverStore(
    (state) => state.threadComponents.wrapper,
  );

  const calculatePosition = useCallback(() => {
    if (threadWrapper == null) return null;

    const $threadWrapper = $(threadWrapper).children().first();
    const threadWrapperWidth = $threadWrapper.width();
    const threadWrapperOffset = $threadWrapper.offset();

    if (threadWrapperWidth == null || threadWrapperOffset == null) return null;

    const { top, left } = threadWrapperOffset;
    const panelRightEdge = left + threadWrapperWidth + PANEL_WIDTH + 75;
    const isFloating = panelRightEdge > window.innerWidth;

    const position = {
      top: top + 25,
      left: threadWrapperWidth + left + 25,
    };

    return {
      position,
      isFloating,
    };
  }, [threadWrapper]);

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      setTimeout(() => setPanelPosition(calculatePosition()), 300);
    }, 100);

    DomObserver.create(DOM_OBSERVER_ID, {
      target: $(DOM_SELECTORS.SIDEBAR)[0],
      config: {
        attributes: true,
        attributeFilter: ["class"],
      },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(debouncedUpdate, DOM_OBSERVER_ID),
    });

    return () => {
      DomObserver.destroy(DOM_OBSERVER_ID);
      debouncedUpdate.cancel();
    };
  }, [calculatePosition, windowSize]);

  return panelPosition;
}
