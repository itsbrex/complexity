import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const OBSERVER_ID = "cplx-better-message-copy-buttons";

type UseObserverReturn = (Element | null)[];

export function useObserver(): UseObserverReturn {
  const messageBlockBottomBars = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlockBottomBars,
  );

  if (messageBlockBottomBars == null) return [];

  return messageBlockBottomBars.map((bottomBar) => {
    if (bottomBar == null) return null;

    const $anchor = $(bottomBar).find(
      DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR_CHILD.COPY_BUTTON,
    );

    const $existingPortalContainer = $(bottomBar).find(
      `div[data-cplx-component="${OBSERVER_ID}"]`,
    );

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    $anchor.before($portalContainer);

    return $portalContainer[0];
  });
}
