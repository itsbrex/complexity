import { sendMessage } from "webext-bridge/content-script";

import DomObserver from "@/features/plugins/_core/dom-observer/DomObserver";
import {
  ExtendedCodeBlock,
  ExtendedMessageBlock,
  globalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/thread/observer-ids";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { DOM_INTERNAL_SELECTORS, DOM_SELECTORS } from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";
import { MessageBlock } from "@/utils/UiUtils.types";
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
        monitorThreadWrapperExistence.bind(null, {
          threadWrapper,
          location,
        }),
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

function monitorThreadWrapperExistence({
  threadWrapper,
  location,
}: {
  threadWrapper: Element;
  location: ReturnType<typeof whereAmI>;
}) {
  if (location !== "thread") return;

  if (!document.body.contains(threadWrapper)) {
    setupThreadComponentsObserver(location);
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

  observerMessageBlockBottomBar({ messageBlocks });

  const extendedMessageBlocks: ExtendedMessageBlock[] = await Promise.all(
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
  );

  observeCodeBlocks(extendedMessageBlocks);

  globalDomObserverStore.getState().setThreadComponents({
    messageBlocks: extendedMessageBlocks,
  });
}

function observerMessageBlockBottomBar({
  messageBlocks,
}: {
  messageBlocks: MessageBlock[];
}) {
  if (
    !globalDomObserverStore.getState().threadComponents
      .messageBlockBottomBarHeight
  ) {
    const $messageBlockBottomBars = messageBlocks[0].$wrapper.find(
      DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR,
    );

    if ($messageBlockBottomBars.length) {
      $(document.body).css({
        "--message-block-bottom-bar-height": `${$messageBlockBottomBars[0].offsetHeight - 1}px`,
      });

      globalDomObserverStore.getState().setThreadComponents({
        messageBlockBottomBarHeight:
          $messageBlockBottomBars[0].offsetHeight - 1,
      });
    }
  }

  globalDomObserverStore.getState().setThreadComponents({
    messageBlockBottomBars: messageBlocks.map(({ $wrapper }) => {
      const $bottomBar = $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR);

      if (!$bottomBar.length) return null;

      $bottomBar.addClass(
        DOM_INTERNAL_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR.slice(
          1,
        ),
      );

      return $bottomBar[0];
    }),
  });
}

async function observeCodeBlocks(messageBlocks: ExtendedMessageBlock[]) {
  const pluginsStates = PluginsStatesService.getCachedSync();

  const shouldObserve =
    pluginsStates.pluginsEnableStates?.["thread:betterCodeBlocks"];

  if (!shouldObserve) return;

  const codeBlocks = UiUtils.getCodeBlocks(messageBlocks);

  if (!codeBlocks.length) return;

  const extendedCodeBlocks: ExtendedCodeBlock[][] = await Promise.all(
    codeBlocks.map(
      async (messageBlock, messageBlockIndex) =>
        await Promise.all(
          messageBlock.map(async (codeBlock, codeBlockIndex) => ({
            ...codeBlock,
            isInFlight: UiUtils.isMessageBlockInFlight({
              messageBlocks,
              messageBlockIndex,
              codeBlockIndex,
            }),
          })),
        ),
    ),
  );

  globalDomObserverStore.getState().setThreadComponents({
    codeBlocks: extendedCodeBlocks,
  });
}

function observeNavbar() {
  const $navbar = $(DOM_SELECTORS.NAVBAR);

  if (!$navbar.length) return;

  const navbarHeight = $navbar[0].offsetHeight;

  $(document.body).css({
    "--navbar-height":
      navbarHeight != null && navbarHeight > 0
        ? `${navbarHeight - 1}px`
        : "53px",
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
