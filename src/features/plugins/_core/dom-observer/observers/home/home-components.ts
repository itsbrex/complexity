import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/home/observer-ids";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { queueMicrotasks, whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = "home-components";

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID);
};

export function setupHomeComponentsObserver(
  location: ReturnType<typeof whereAmI>,
) {
  const settings = PluginsStatesService.getCachedSync()?.pluginsEnableStates;

  const shouldObserve = settings?.["home:customSlogan"];

  if (!shouldObserve) return;

  cleanup();

  if (location !== "home") return;

  DomObserver.create(DOM_OBSERVER_ID, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () => queueMicrotasks(observeSlogan),
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
