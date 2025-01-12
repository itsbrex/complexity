import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/sidebar/observer-ids";
import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { waitForElement } from "@/utils/utils";

const DOM_OBSERVER_ID = {
  WRAPPER: "sidebar-wrapper",
  SPACE_BUTTON_WRAPPER: "sidebar-space-button-wrapper",
};

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID.WRAPPER);
};

csLoaderRegistry.register({
  id: "coreDomObserver:sidebar",
  loader: () => {
    setupSidebarComponentsObserver();

    isMobileStore.subscribe(() => {
      setupSidebarComponentsObserver();
    });
  },
});

async function setupSidebarComponentsObserver() {
  const shouldObserver = true;

  if (!shouldObserver) return;

  cleanup();

  const sidebarWrapper = await waitForElement({
    selector: DOM_SELECTORS.SIDEBAR.WRAPPER,
    timeout: 200,
  });

  if (
    sidebarWrapper != null &&
    $(sidebarWrapper).internalComponentAttr() !== OBSERVER_ID.WRAPPER
  ) {
    $(sidebarWrapper).internalComponentAttr(OBSERVER_ID.WRAPPER);
    globalDomObserverStore.getState().setSidebarComponents({
      wrapper: (sidebarWrapper as HTMLElement | null) ?? null,
    });
  } else if (sidebarWrapper == null) {
    return setupSidebarComponentsObserver();
  }

  const observe = () => {
    CallbackQueue.getInstance().enqueueArray([
      {
        callback: setupSidebarWrapperObserver,
        id: `${DOM_OBSERVER_ID.WRAPPER}`,
      },
      {
        callback: setupSidebarSpaceButtonWrapperObserver,
        id: `${DOM_OBSERVER_ID.WRAPPER}-space-button-wrapper`,
      },
    ]);
  };

  DomObserver.create(DOM_OBSERVER_ID.WRAPPER, {
    target: sidebarWrapper,
    config: { childList: true, subtree: true },
    onMutation: observe,
  });
}

function setupSidebarWrapperObserver() {
  const sidebarWrapper =
    globalDomObserverStore.getState().sidebarComponents.wrapper;

  if (sidebarWrapper == null) return;

  const $sidebarWrapper = $(sidebarWrapper);

  const isOpen = $sidebarWrapper.hasClass("w-sideBarWidth");

  $sidebarWrapper.attr("data-state", isOpen ? "expanded" : "collapsed");
}

function setupSidebarSpaceButtonWrapperObserver() {
  const sidebarWrapper =
    globalDomObserverStore.getState().sidebarComponents.wrapper;

  if (sidebarWrapper == null) return;

  const $sidebarWrapper = $(sidebarWrapper);

  const $spaceButtonWrapper = $sidebarWrapper.find(
    DOM_SELECTORS.SIDEBAR.SPACE_BUTTON_WRAPPER,
  );

  const isOpen = $sidebarWrapper.hasClass("w-sideBarWidth");

  if (!isOpen && $spaceButtonWrapper.length) {
    $spaceButtonWrapper.internalComponentAttr(null);
    globalDomObserverStore.getState().setSidebarComponents({
      spaceButtonWrapper: null,
    });

    return;
  }

  if (
    !$spaceButtonWrapper.length ||
    $spaceButtonWrapper.internalComponentAttr() ===
      OBSERVER_ID.SPACE_BUTTON_WRAPPER
  )
    return;

  $spaceButtonWrapper.internalComponentAttr(OBSERVER_ID.SPACE_BUTTON_WRAPPER);

  globalDomObserverStore.getState().setSidebarComponents({
    spaceButtonWrapper: $spaceButtonWrapper[0] as HTMLElement | null,
  });
}
