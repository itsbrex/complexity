import DomObserver from "@/features/plugins/_core/dom-observer/DomObserver";
import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/thread/observer-ids";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";
import { queueMicrotasks, waitForElement, whereAmI } from "@/utils/utils";

const DOM_OBSERVER_ID = {
  COMMON: "thread-common",
  MESSAGE_BLOCKS: "thread-message-blocks",
};

const cleanup = () => {
  DomObserver.destroy(DOM_OBSERVER_ID.MESSAGE_BLOCKS);
  DomObserver.destroy(DOM_OBSERVER_ID.COMMON);
};

export async function setupThreadComponentsObserver(
  location: ReturnType<typeof whereAmI>,
) {
  const settings = PluginsStatesService.getCachedSync()?.pluginsEnableStates;

  const shouldObserve =
    settings?.imageGenModelSelector || settings?.["thread:toc"];

  if (!shouldObserve) return;

  if (location !== "thread") return cleanup();

  const threadWrapper = await waitForElement({
    selector: DOM_SELECTORS.THREAD.WRAPPER,
  });

  if (
    threadWrapper != null &&
    !$(threadWrapper).attr(OBSERVER_ID.THREAD_WRAPPER)
  ) {
    $(threadWrapper).attr(OBSERVER_ID.THREAD_WRAPPER, "true");
    globalDomObserverStore.getState().setThreadComponents({
      wrapper: (threadWrapper as HTMLElement | null) ?? null,
    });
  }

  DomObserver.create(DOM_OBSERVER_ID.COMMON, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () => queueMicrotasks(observePopper),
  });

  DomObserver.create(DOM_OBSERVER_ID.MESSAGE_BLOCKS, {
    target: threadWrapper ?? document.body,
    config: { childList: true, subtree: true },
    onMutation: () => queueMicrotasks(observeMessageBlocks),
  });
}

async function observeMessageBlocks() {
  const messageBlocks = UiUtils.getMessageBlocks();

  globalDomObserverStore.getState().setThreadComponents({
    messageBlocks,
  });
}

function observePopper() {
  const $wrapper = $(DOM_SELECTORS.THREAD.POPPER.DESKTOP);

  if (!$wrapper.length) return;

  if ($wrapper.attr(OBSERVER_ID.POPPER)) return;

  $wrapper.attr(OBSERVER_ID.POPPER, "true");

  globalDomObserverStore.getState().setThreadComponents({
    popper: $wrapper[0],
  });
}
