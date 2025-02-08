import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import { DOM_SELECTORS, INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function findSidebarWrapper() {
  const $wrapper = $(DOM_SELECTORS.SIDEBAR.WRAPPER);

  if (!$wrapper.length) return;

  const isOpen = $wrapper.hasClass("w-sideBarWidth");

  $wrapper.attr("data-state", isOpen ? "expanded" : "collapsed");

  if ($wrapper.internalComponentAttr() === INTERNAL_ATTRIBUTES.SIDEBAR.WRAPPER)
    return;

  $wrapper.internalComponentAttr(INTERNAL_ATTRIBUTES.SIDEBAR.WRAPPER);

  sidebarDomObserverStore.setState({
    $wrapper,
  });
}

export function findSpaceButtonWrapper() {
  const $wrapper = sidebarDomObserverStore.getState().$wrapper;

  if ($wrapper == null) return;

  const $spaceButtonWrapper = $wrapper.find(
    DOM_SELECTORS.SIDEBAR.SPACE_BUTTON_WRAPPER,
  );

  const isOpen = $wrapper.hasClass("w-sideBarWidth");

  if (!isOpen && $spaceButtonWrapper.length) {
    $spaceButtonWrapper.internalComponentAttr(null);
    sidebarDomObserverStore.setState({
      $spaceButtonWrapper: null,
    });
    return;
  }

  if (
    !$spaceButtonWrapper.length ||
    $spaceButtonWrapper.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.SIDEBAR.SPACE_BUTTON_WRAPPER
  )
    return;

  $spaceButtonWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SIDEBAR.SPACE_BUTTON_WRAPPER,
  );

  sidebarDomObserverStore.setState({
    $spaceButtonWrapper,
  });
}

export function findLibraryButtonWrapper() {
  const $wrapper = sidebarDomObserverStore.getState().$wrapper;

  if ($wrapper == null) return;

  const $libraryButtonWrapper = $wrapper.find(
    DOM_SELECTORS.SIDEBAR.LIBRARY_BUTTON_WRAPPER,
  );

  if (!$libraryButtonWrapper.length) return;

  $libraryButtonWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SIDEBAR.LIBRARY_BUTTON_WRAPPER,
  );

  sidebarDomObserverStore.setState({
    $libraryButtonWrapper,
  });
}
