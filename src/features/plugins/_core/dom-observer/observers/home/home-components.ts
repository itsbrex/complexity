import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/home/observer-ids";
import { spaRouterStoreSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = {
  COMMON: "home-components-common",
  LANGUAGE_SELECTOR: "home-components-language-selector",
};

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID.COMMON);
  DomObserver.destroy(DOM_OBSERVER_ID.LANGUAGE_SELECTOR);
};

let previousLanguage = "";

CsLoaderRegistry.register({
  id: "coreDomObserver:homeComponents",
  loader: () => {
    setupHomeComponentsObserver(whereAmI());

    spaRouterStoreSubscribe(({ url }) => {
      setupHomeComponentsObserver(whereAmI(url));
    });
  },
  dependencies: ["messaging:spaRouter"],
});

function setupHomeComponentsObserver(location: ReturnType<typeof whereAmI>) {
  cleanup();

  if (location !== "home") return;

  DomObserver.create(DOM_OBSERVER_ID.COMMON, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        { callback: observeSlogan, id: `${DOM_OBSERVER_ID.COMMON}-slogan` },
        {
          callback: observeHomeBottomBar,
          id: `${DOM_OBSERVER_ID.COMMON}-bottom-bar`,
        },
      ]),
  });

  DomObserver.create(DOM_OBSERVER_ID.LANGUAGE_SELECTOR, {
    target: $(DOM_SELECTORS.HOME.LANGUAGE_SELECTOR)[0],
    config: { attributes: true, attributeFilter: ["aria-label"] },
    // onMutation: () => observeLanguageSelector(),
    onMutation: () =>
      CallbackQueue.getInstance().enqueue(
        () => observeLanguageSelector(),
        `${DOM_OBSERVER_ID.LANGUAGE_SELECTOR}-language-selector`,
      ),
  });
}

function observeSlogan() {
  const $slogan = $(DOM_SELECTORS.HOME.SLOGAN);

  if (!$slogan.length || $slogan.attr(OBSERVER_ID.SLOGAN)) return;

  $slogan.attr(OBSERVER_ID.SLOGAN, "true");

  globalDomObserverStore.getState().setHomeComponents({
    slogan: $slogan[0],
  });
}

function observeHomeBottomBar() {
  const $bottomBar = $(DOM_SELECTORS.HOME.BOTTOM_BAR);

  if (!$bottomBar.length || $bottomBar.attr(OBSERVER_ID.BOTTOM_BAR)) return;

  $bottomBar.attr(OBSERVER_ID.BOTTOM_BAR, "true");

  globalDomObserverStore.getState().setHomeComponents({
    bottomBar: $bottomBar[0],
  });
}

function observeLanguageSelector() {
  const ariaLabel =
    $(DOM_SELECTORS.HOME.LANGUAGE_SELECTOR).attr("aria-label") ?? "";

  if (!previousLanguage || ariaLabel === previousLanguage) {
    previousLanguage = ariaLabel;
    return;
  }

  window.location.reload();
}
