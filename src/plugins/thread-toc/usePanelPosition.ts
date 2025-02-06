import { useWindowSize } from "@uidotdev/usehooks";
import debounce from "lodash/debounce";

import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { PANEL_WIDTH } from "@/plugins/thread-toc";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";

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

    const $threadWrapper = $(threadWrapper);
    const $children = $threadWrapper.children();

    const $firstChild = $children.first();
    const threadWrapperOffset = $firstChild.offset();
    if (!threadWrapperOffset) return null;

    const stickyHeaderHeight = UiUtils.getStickyNavbar().height();
    if (stickyHeaderHeight == null) return null;

    let threadWrapperWidth = 0;
    $children.each((_, child) => {
      const width = $(child).width();
      if (width != null) threadWrapperWidth += width;
    });
    if (threadWrapperWidth === 0) return null;

    const { left } = threadWrapperOffset;
    const panelRightEdge = left + threadWrapperWidth + PANEL_WIDTH + 75;

    return {
      position: {
        top: stickyHeaderHeight + 40,
        left: threadWrapperWidth + left + 50,
      },
      isFloating: panelRightEdge > window.innerWidth,
    };
  }, [threadWrapper]);

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      const newPanelPosition = calculatePosition();
      if (newPanelPosition == null) return;
      setPanelPosition(newPanelPosition);
    }, 100);

    debouncedUpdate();

    DomObserver.create(DOM_OBSERVER_ID, {
      target: $(DOM_SELECTORS.SIDEBAR.WRAPPER)[0],
      config: {
        attributes: true,
        attributeFilter: ["class"],
      },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(debouncedUpdate, DOM_OBSERVER_ID),
    });

    return () => {
      debouncedUpdate.cancel();
      DomObserver.destroy(DOM_OBSERVER_ID);
    };
  }, [calculatePosition, isMobile, windowSize]);

  return panelPosition;
}
