import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";

const OBSERVER_ID = "cplx-thread-query-hover-container";

export function useObserver(): (Element | null)[] {
  const queryHoverContainers = useGlobalDomObserverStore(
    (state) => state.threadComponents.queryHoverContainers,
  );

  if (queryHoverContainers == null) return [];

  return queryHoverContainers.map((container) => {
    if (container == null) return null;

    const $existingPortalContainer = $(container).find(
      `div[data-cplx-component="${OBSERVER_ID}"]`,
    );

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    $(container).prepend($portalContainer);

    return $portalContainer[0];
  });
}
