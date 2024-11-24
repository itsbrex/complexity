import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const OBSERVER_ID = "cplx-thread-export-button";

export default function useObserver() {
  useSpaRouter();

  return (() => {
    const $navbar = $(DOM_SELECTORS.THREAD.NAVBAR);

    if (!$navbar.length) return;

    const $anchor = $navbar.find(".flex.items-center.gap-sm").last();

    if (!$anchor.length) return;

    const $existingPortalContainer = $anchor.find(`.${OBSERVER_ID}`);

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>")
      .addClass(OBSERVER_ID)
      .appendTo($anchor[0]);

    return $portalContainer[0];
  })();
}
