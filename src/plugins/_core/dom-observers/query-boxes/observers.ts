import throttle from "lodash/throttle";
import { sendMessage } from "webext-bridge/content-script";

import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import { OBSERVER_ID } from "@/plugins/_core/dom-observers/query-boxes/observer-ids";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { UiUtils } from "@/utils/ui-utils";
import { whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = {
  HOME: "query-boxes-home",
  COLLECTION: "query-boxes-collection",
  FOLLOW_UP: "query-boxes-follow-up",
  MODAL: "query-boxes-modal",
  REASONING_MODE_PREFERENCE: "query-boxes-reasoning-mode-preference",
};

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID.HOME);
  DomObserver.destroy(DOM_OBSERVER_ID.COLLECTION);
  DomObserver.destroy(DOM_OBSERVER_ID.FOLLOW_UP);
  DomObserver.destroy(DOM_OBSERVER_ID.MODAL);
  DomObserver.destroy(DOM_OBSERVER_ID.REASONING_MODE_PREFERENCE);
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
    "plugins:core",
    "messaging:spaRouter",
  ],
});

async function setupQueryBoxesObserver(location: ReturnType<typeof whereAmI>) {
  if (
    !shouldEnableCoreObserver({
      coreObserverName: "domObserver:queryBoxes",
    })
  )
    return;

  cleanup();

  DomObserver.create(DOM_OBSERVER_ID.REASONING_MODE_PREFERENCE, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueue(
        observeReasoningModePreference,
        DOM_OBSERVER_ID.REASONING_MODE_PREFERENCE,
      ),
  });

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

const observeReasoningModePreference = throttle(
  async () => {
    globalDomObserverStore.getState().setQueryBoxes({
      reasoningModePreferenceModelCode: await sendMessage(
        "reactVdom:getCopilotReasoningModeModelCode",
        undefined,
        "window",
      ),
    });
  },
  300,
  {
    leading: false,
    trailing: true,
  },
);
