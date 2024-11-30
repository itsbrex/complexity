import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";

const OBSERVER_ID = "cplx-thread-export-button";

export default function useObserver() {
  useSpaRouter();

  const { navbarChildren, messageBlocks } = useGlobalDomObserverStore(
    (state) => ({
      navbarChildren: state.threadComponents.navbarChildren,
      messageBlocks: state.threadComponents.messageBlocks,
    }),
  );

  const isAnyMessageBlockInFlight = useMemo(() => {
    return messageBlocks?.some((block) => block.isInFlight);
  }, [messageBlocks]);

  if (isAnyMessageBlockInFlight) {
    setTimeout(() => {
      $(`[data-cplx-component="${OBSERVER_ID}"]`).remove();
    }, 0);
    return null;
  }

  return getPortalContainer(navbarChildren);
}

function getPortalContainer(navbarChildren: HTMLElement[] | null) {
  if (navbarChildren == null) return null;

  const $anchor = $(navbarChildren).last().children().first();

  if (!$anchor.length) return null;

  const $existingPortalContainer = $anchor.find(
    `[data-cplx-component="${OBSERVER_ID}"]`,
  );

  if ($existingPortalContainer.length) return $existingPortalContainer[0];

  const $portalContainer = $("<div>")
    .internalComponentAttr(OBSERVER_ID)
    .appendTo($anchor);

  return $portalContainer[0];
}
