import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { DOM_SELECTORS, INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function findTopNavWrapper() {
  const $topNavWrapper = $(DOM_SELECTORS.SETTINGS_PAGE.TOP_NAV_WRAPPER);

  if (!$topNavWrapper.length) return;

  if (
    $topNavWrapper.internalComponentAttr() ===
    INTERNAL_ATTRIBUTES.SETTINGS_PAGE.TOP_NAV_WRAPPER
  )
    return;

  $topNavWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SETTINGS_PAGE.TOP_NAV_WRAPPER,
  );

  settingsPageDomObserverStore.setState({
    $topNavWrapper,
  });
}
