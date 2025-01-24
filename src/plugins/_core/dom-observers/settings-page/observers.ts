import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import { OBSERVER_ID } from "@/plugins/_core/dom-observers/settings-page/observer-ids";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = {
  TOP_NAV_WRAPPER: "settings-page-top-nav-wrapper",
};

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID.TOP_NAV_WRAPPER);
};

csLoaderRegistry.register({
  id: "coreDomObserver:settingsPage",
  loader: () => {
    setupSettingsPageComponentsObserver(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      setupSettingsPageComponentsObserver(whereAmI(url));
    });
  },
});

async function setupSettingsPageComponentsObserver(
  location: ReturnType<typeof whereAmI>,
) {
  cleanup();

  if (location !== "settings") return;

  DomObserver.create(DOM_OBSERVER_ID.TOP_NAV_WRAPPER, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: setupSettingsPageTopNavWrapperObserver,
          id: `${DOM_OBSERVER_ID.TOP_NAV_WRAPPER}`,
        },
      ]),
  });
}

function setupSettingsPageTopNavWrapperObserver() {
  const $topNavWrapper = $(DOM_SELECTORS.SETTINGS_PAGE.TOP_NAV_WRAPPER);

  if (!$topNavWrapper.length) return;

  if ($topNavWrapper.internalComponentAttr() === OBSERVER_ID.TOP_NAV_WRAPPER)
    return;

  $topNavWrapper.internalComponentAttr(OBSERVER_ID.TOP_NAV_WRAPPER);

  globalDomObserverStore.getState().setSettingsPageComponents({
    topNavWrapper: $topNavWrapper[0],
  });
}
