import { useWindowSize } from "@uidotdev/usehooks";
import debounce from "lodash/debounce";

import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { useCanvasStore } from "@/plugins/canvas/store";
import { PANEL_WIDTH } from "@/plugins/thread-toc";
import { PluginsStatesService } from "@/services/plugins-states";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";

const DOM_OBSERVER_ID = "thread-navigation-toc-panel-position";

type UsePanelPosition = {
  position: { top: number; left: number };
  isFloating: boolean;
};

export function usePanelPosition(): UsePanelPosition | null {
  const isCanvasEnabled =
    PluginsStatesService.getCachedSync().pluginsEnableStates["thread:canvas"];
  const isCanvasOpen = useCanvasStore(
    (state) => state.selectedCodeBlockLocation != null,
  );
  const isCanvasListOpen = useCanvasStore((state) => state.isCanvasListOpen);

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
    const $fitContainer = $threadWrapper.children().first();
    const fitContainerOffset = $fitContainer.offset();

    const $stickyHeader = UiUtils.getStickyNavbar();
    const stickyHeaderHeight = $stickyHeader.height();

    if (
      threadWrapperWidth == null ||
      fitContainerOffset == null ||
      stickyHeaderHeight == null
    )
      return null;

    const { left } = fitContainerOffset;

    const panelRightEdge = left + threadWrapperWidth + PANEL_WIDTH + 75;
    const isFloating = panelRightEdge > window.innerWidth;

    const position = {
      top: stickyHeaderHeight + 40,
      left: threadWrapperWidth + left + 25,
    };

    return {
      position,
      isFloating:
        isFloating || (!!isCanvasEnabled && (isCanvasOpen || isCanvasListOpen)),
    };
  }, [threadWrapper, isCanvasOpen, isCanvasEnabled, isCanvasListOpen]);

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
  }, [calculatePosition, isMobile, windowSize, isCanvasOpen]);

  return panelPosition;
}
