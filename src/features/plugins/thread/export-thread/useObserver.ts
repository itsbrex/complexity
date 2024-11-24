import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";

const OBSERVER_ID = "cplx-thread-export-button";

export default function useObserver() {
  useSpaRouter();

  const navbarChildren = useGlobalDomObserverStore(
    (state) => state.threadComponents.navbarChildren,
  );

  return getPortalContainer(navbarChildren);
}

function getPortalContainer(navbarChildren: HTMLElement[] | null) {
  if (navbarChildren == null) return null;

  const $anchor = $(navbarChildren).last().children().first();

  if (!$anchor.length) return null;

  const $existingPortalContainer = $anchor.find(`.${OBSERVER_ID}`);

  if ($existingPortalContainer.length) return $existingPortalContainer[0];

  const $portalContainer = $("<div>").addClass(OBSERVER_ID).appendTo($anchor);

  return $portalContainer[0];
}
