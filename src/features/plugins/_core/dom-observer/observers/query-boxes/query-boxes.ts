import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/query-boxes/observer-ids";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import UiUtils from "@/utils/UiUtils";
import { whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = "query-boxes";

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID);
};

export async function setupQueryBoxesObserver(
  location: ReturnType<typeof whereAmI>,
) {
  const settings = PluginsStatesService.getCachedSync()?.pluginsEnableStates;

  const shouldObserve =
    settings?.["queryBox:languageModelSelector"] ||
    settings?.["queryBox:noFileCreationOnPaste"];

  if (!shouldObserve) return;

  cleanup();

  DomObserver.create(DOM_OBSERVER_ID, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: observerFn.bind(null, location),
  });
}

function observerFn(location: ReturnType<typeof whereAmI>) {
  CallbackQueue.getInstance().enqueueArray([
    {
      callback: observeMainQueryBox.bind(null, location),
      id: `${DOM_OBSERVER_ID}-main-query-box`,
    },
    {
      callback: observeMainModalQueryBox,
      id: `${DOM_OBSERVER_ID}-main-modal-query-box`,
    },
    {
      callback: observeSpaceQueryBox.bind(null, location),
      id: `${DOM_OBSERVER_ID}-space-query-box`,
    },
    {
      callback: observeFollowUpQueryBox.bind(null, location),
      id: `${DOM_OBSERVER_ID}-follow-up-query-box`,
    },
  ]);
}

function observeMainQueryBox(location: ReturnType<typeof whereAmI>) {
  if (location !== "home") {
    globalDomObserverStore.getState().setQueryBoxes({
      mainQueryBox: null,
    });
    return;
  }

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

function observeSpaceQueryBox(location: ReturnType<typeof whereAmI>) {
  if (location !== "collection") {
    globalDomObserverStore.getState().setQueryBoxes({
      spaceQueryBox: null,
    });
    return;
  }

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

async function observeFollowUpQueryBox(location: ReturnType<typeof whereAmI>) {
  if (location !== "thread") {
    globalDomObserverStore.getState().setQueryBoxes({
      followUpQueryBox: null,
    });
    return;
  }

  if ($(`[${OBSERVER_ID.FOLLOW_UP_QUERY_BOX}]`).length) return;

  const $followUpQueryBox = UiUtils.getActiveQueryBox({
    type: "follow-up",
  });

  // Assume that the follow up query box is always visible in a thread, loop until it's visible
  if (!$followUpQueryBox.length) {
    await sleep(200);
    CallbackQueue.getInstance().enqueue(
      observeFollowUpQueryBox.bind(null, location),
      `${DOM_OBSERVER_ID}-follow-up-query-box`,
    );
    return;
  }

  $followUpQueryBox.attr(OBSERVER_ID.FOLLOW_UP_QUERY_BOX, "true");

  if (
    ExtensionLocalStorageService.getCachedSync()?.plugins[
      "queryBox:languageModelSelector"
    ].followUp.span
  ) {
    $followUpQueryBox.attr("cplx-data-span", "true");
  }

  globalDomObserverStore.getState().setQueryBoxes({
    followUpQueryBox: $followUpQueryBox[0],
  });
}
