import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/query-boxes/observer-ids";
import { spaRouteChangeCompleteSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import UiUtils from "@/utils/UiUtils";
import { whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = {
  HOME: "query-boxes-home",
  COLLECTION: "query-boxes-collection",
  FOLLOW_UP: "query-boxes-follow-up",
  MODAL: "query-boxes-modal",
};

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID.HOME);
  DomObserver.destroy(DOM_OBSERVER_ID.COLLECTION);
  DomObserver.destroy(DOM_OBSERVER_ID.FOLLOW_UP);
  DomObserver.destroy(DOM_OBSERVER_ID.MODAL);
};

csLoaderRegistry.register({
  id: "coreDomObserver:queryBoxes",
  loader: () => {
    setupQueryBoxesObserver(whereAmI());
    spaRouteChangeCompleteSubscribe((url) => {
      setupQueryBoxesObserver(whereAmI(url));
    });
  },
  dependencies: [
    "cache:extensionLocalStorage",
    "cache:pluginsStates",
    "messaging:spaRouter",
  ],
});

async function setupQueryBoxesObserver(location: ReturnType<typeof whereAmI>) {
  const settings = PluginsStatesService.getCachedSync()?.pluginsEnableStates;

  const shouldObserve =
    settings?.["queryBox:languageModelSelector"] ||
    settings?.["spaceNavigator"] ||
    settings?.["queryBox:noFileCreationOnPaste"] ||
    settings?.["queryBox:slashCommandMenu:promptHistory"];

  if (!shouldObserve) return;

  cleanup();

  if (location === "home") {
    globalDomObserverStore.getState().setQueryBoxes({
      spaceQueryBox: null,
      followUpQueryBox: null,
    });

    DomObserver.create(DOM_OBSERVER_ID.HOME, {
      target: document.body,
      config: { childList: true, subtree: true },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          () => observeMainQueryBox(),
          DOM_OBSERVER_ID.HOME,
        ),
    });
  }

  if (location === "collection") {
    globalDomObserverStore.getState().setQueryBoxes({
      mainQueryBox: null,
      followUpQueryBox: null,
    });

    DomObserver.create(DOM_OBSERVER_ID.COLLECTION, {
      target: document.body,
      config: { childList: true, subtree: true },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          () => observeSpaceQueryBox(),
          DOM_OBSERVER_ID.COLLECTION,
        ),
    });
  }

  if (location === "thread") {
    globalDomObserverStore.getState().setQueryBoxes({
      mainQueryBox: null,
      spaceQueryBox: null,
    });

    DomObserver.create(DOM_OBSERVER_ID.FOLLOW_UP, {
      target: document.body,
      config: { childList: true, subtree: true },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          () => observeFollowUpQueryBox(),
          DOM_OBSERVER_ID.FOLLOW_UP,
        ),
    });
  }

  DomObserver.create(DOM_OBSERVER_ID.MODAL, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueue(
        () => observeMainModalQueryBox(),
        DOM_OBSERVER_ID.MODAL,
      ),
  });
}

function observeMainQueryBox() {
  const id = OBSERVER_ID.MAIN_QUERY_BOX;

  const $mainQueryBox = UiUtils.getActiveQueryBox({ type: "main" });

  if (!$mainQueryBox.length || $mainQueryBox.attr(id)) return;

  $mainQueryBox.attr(id, "true");

  globalDomObserverStore.getState().setQueryBoxes({
    mainQueryBox: $mainQueryBox[0],
  });
}

function observeMainModalQueryBox() {
  if ($(`[${OBSERVER_ID.MAIN_MODAL_QUERY_BOX}]`).length) return;

  const $mainModalQueryBox = UiUtils.getActiveQueryBox({
    type: "main-modal",
  });

  if (!$mainModalQueryBox.length) return;

  $mainModalQueryBox.attr(OBSERVER_ID.MAIN_MODAL_QUERY_BOX, "true");

  globalDomObserverStore.getState().setQueryBoxes({
    mainModalQueryBox: $mainModalQueryBox[0],
  });
}

function observeSpaceQueryBox() {
  if ($(`[${OBSERVER_ID.SPACE_QUERY_BOX}]`).length) return;

  const $spaceQueryBox = UiUtils.getActiveQueryBox({
    type: "space",
  });

  if (!$spaceQueryBox.length) return;

  $spaceQueryBox.attr(OBSERVER_ID.SPACE_QUERY_BOX, "true");

  globalDomObserverStore.getState().setQueryBoxes({
    spaceQueryBox: $spaceQueryBox[0],
  });
}

async function observeFollowUpQueryBox() {
  if ($(`[${OBSERVER_ID.FOLLOW_UP_QUERY_BOX}]`).length) return;

  const $followUpQueryBox = UiUtils.getActiveQueryBox({
    type: "follow-up",
  });

  // Assume that the follow up query box is always visible in a thread, loop until it's visible
  if (!$followUpQueryBox.length) {
    await sleep(200);
    CallbackQueue.getInstance().enqueue(
      observeFollowUpQueryBox,
      DOM_OBSERVER_ID.FOLLOW_UP,
    );
    return;
  }

  $followUpQueryBox.attr(OBSERVER_ID.FOLLOW_UP_QUERY_BOX, "true");

  globalDomObserverStore.getState().setQueryBoxes({
    followUpQueryBox: $followUpQueryBox[0],
  });
}
