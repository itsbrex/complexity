import { sendMessage } from "webext-bridge/content-script";

import DomObserver from "@/features/plugins/_core/dom-observer/DomObserver";
import {
  ExtendedMessageBlock,
  globalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
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

  cleanup();

  if (location !== "thread") return;

  const threadWrapper = await waitForElement({
    selector: DOM_SELECTORS.THREAD.WRAPPER,
    timeout: 200,
  });

  if (
    threadWrapper != null &&
    !$(threadWrapper).attr(OBSERVER_ID.THREAD_WRAPPER)
  ) {
    $(threadWrapper).attr(OBSERVER_ID.THREAD_WRAPPER, "true");
    globalDomObserverStore.getState().setThreadComponents({
      wrapper: (threadWrapper as HTMLElement | null) ?? null,
    });
  } else if (threadWrapper == null) {
    return setupThreadComponentsObserver(location);
  }

  queueMicrotasks(observePopper);
  queueMicrotasks(observeMessageBlocks);

  DomObserver.create(DOM_OBSERVER_ID.COMMON, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      queueMicrotasks(
        monitorThreadWrapperExistence.bind(null, threadWrapper),
        observePopper,
        observeNavbar,
      ),
  });

  DomObserver.create(DOM_OBSERVER_ID.MESSAGE_BLOCKS, {
    target: threadWrapper ?? document.body,
    config: { childList: true, subtree: true },
    onMutation: () => queueMicrotasks(observeMessageBlocks),
  });
}

function monitorThreadWrapperExistence(threadWrapper: Element) {
  if (!document.body.contains(threadWrapper)) {
    console.warn("threadWrapper has been removed, re-observing...");
    return setupThreadComponentsObserver("thread");
  }
}

async function observeMessageBlocks() {
  const pluginsStates = PluginsStatesService.getCachedSync();

  const shouldObserve =
    pluginsStates.pluginsEnableStates?.["thread:betterMessageToolbars"];

  if (!shouldObserve) return;

  const messageBlocks = UiUtils.getMessageBlocks();

  if (!messageBlocks.length) {
    await sleep(200);
    return queueMicrotasks(observeMessageBlocks);
  }

  globalDomObserverStore.getState().setThreadComponents({
    messageBlocks: await Promise.all(
      messageBlocks.map(
        async (block, index): Promise<ExtendedMessageBlock> => ({
          ...block,
          title: block.$query.find("textarea").text() || block.$query.text(),
          isInFlight: await sendMessage(
            "reactVdom:isMessageBlockInFlight",
            {
              index,
            },
            "window",
          ),
        }),
      ),
    ),
  });
}

function observeNavbar() {
  const $navbar = $(DOM_SELECTORS.NAVBAR);

  if (!$navbar.length) return;

  const navbarHeight = $navbar[0].offsetHeight;

  $(document.body).css({
    "--navbar-height":
      navbarHeight != null && navbarHeight > 0
        ? `${navbarHeight}px`
        : "3.375rem",
  });

  globalDomObserverStore.getState().setThreadComponents({
    navbar: $navbar[0],
    navbarHeight,
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
