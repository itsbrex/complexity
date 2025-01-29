import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import { OBSERVER_ID } from "@/plugins/_core/dom-observers/spaces-page/observer-ids";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = {
  COMMON: "spaces-page-components-common",
  SPACE_CARD: "spaces-page-components-space-card",
};

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID.COMMON);
  DomObserver.destroy(DOM_OBSERVER_ID.SPACE_CARD);
};

csLoaderRegistry.register({
  id: "coreDomObserver:spacesPage",
  dependencies: ["messaging:spaRouter"],
  loader: () => {
    setupSpacesPageComponentsObserver(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      setupSpacesPageComponentsObserver(whereAmI(url));
    });
  },
});

function setupSpacesPageComponentsObserver(
  location: ReturnType<typeof whereAmI>,
) {
  if (
    !shouldEnableCoreObserver({
      coreObserverName: "domObserver:spacesPage",
    })
  )
    return;

  cleanup();

  if (location !== "collections_page") return;

  DomObserver.create(DOM_OBSERVER_ID.COMMON, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: observeSpaceCard,
          id: DOM_OBSERVER_ID.SPACE_CARD,
        },
      ]),
  });
}

function observeSpaceCard() {
  const $spaceCard = $(DOM_SELECTORS.SPACES_PAGE.SPACE_CARD);

  if (!$spaceCard.length) return;

  const spaceCards = $spaceCard.toArray();

  spaceCards.forEach((spaceCard) => {
    const $spaceCard = $(spaceCard);

    if ($spaceCard.internalComponentAttr() === OBSERVER_ID.SPACE_CARD) return;

    $spaceCard.internalComponentAttr(OBSERVER_ID.SPACE_CARD);
  });

  globalDomObserverStore.getState().setSpacesPageComponents({
    spaceCards,
  });
}
