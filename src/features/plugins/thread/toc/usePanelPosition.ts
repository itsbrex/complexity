import { useWindowSize } from "@uidotdev/usehooks";
import debounce from "lodash/debounce";

import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { PANEL_WIDTH } from "@/features/plugins/thread/toc/Wrapper";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const DOM_OBSERVER_ID = "thread-navigation-toc-panel-position";

type UsePanelPosition = {
  position: { top: number; left: number };
  isFloating: boolean;
};

export function usePanelPosition(): UsePanelPosition | null {
  const { isMobile } = useIsMobileStore();

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

    const cleanup = () => {
      debouncedUpdate.cancel();
      DomObserver.destroy(DOM_OBSERVER_ID);
    };

    if (isMobile) {
      debouncedUpdate();
      return cleanup;
    }

    DomObserver.create(DOM_OBSERVER_ID, {
      target: $(DOM_SELECTORS.SIDEBAR)[0],
      config: {
        attributes: true,
        attributeFilter: ["class"],
      },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(debouncedUpdate, DOM_OBSERVER_ID),
    });

    return cleanup;
  }, [calculatePosition, isMobile, windowSize]);

  return panelPosition;
}
