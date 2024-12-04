import { sendMessage } from "webext-bridge/content-script";

import { CallbackQueue } from "@/features/plugins/_core/dom-observer/callback-queue";
import { DomObserver } from "@/features/plugins/_core/dom-observer/dom-observer";
import {
  ExtendedCodeBlock,
  ExtendedMessageBlock,
  globalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/thread/observer-ids";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import {
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS,
  DOM_SELECTORS,
} from "@/utils/dom-selectors";
import UiUtils from "@/utils/UiUtils";
import { MessageBlock } from "@/utils/UiUtils.types";
import { waitForElement, whereAmI } from "@/utils/utils";

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
    settings?.imageGenModelSelector ||
    settings?.["thread:toc"] ||
    settings?.["thread:betterCodeBlocks"] ||
    settings?.["thread:betterMessageToolbars"] ||
    settings?.["thread:betterMessageCopyButtons"];

  if (!shouldObserve) return;

  cleanup();

  if (location !== "thread") return;

  const threadWrapper = await waitForElement({
    selector: DOM_SELECTORS.THREAD.WRAPPER,
    timeout: 200,
  });

  if (
    threadWrapper != null &&
    $(threadWrapper).internalComponentAttr() !== OBSERVER_ID.THREAD_WRAPPER
  ) {
    $(threadWrapper).internalComponentAttr(OBSERVER_ID.THREAD_WRAPPER);
    globalDomObserverStore.getState().setThreadComponents({
      wrapper: (threadWrapper as HTMLElement | null) ?? null,
    });
  } else if (threadWrapper == null) {
    return setupThreadComponentsObserver(location);
  }

  DomObserver.create(DOM_OBSERVER_ID.COMMON, {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: monitorThreadWrapperExistence.bind(null, {
            threadWrapper,
            location,
          }),
          id: `${DOM_OBSERVER_ID.COMMON}-monitor-thread-wrapper-existence`,
        },
        {
          callback: observePopper,
          id: `${DOM_OBSERVER_ID.COMMON}-observe-popper`,
        },
        {
          callback: observeThreadNavbar,
          id: `${DOM_OBSERVER_ID.COMMON}-observe-thread-navbar`,
        },
      ]),
  });

  DomObserver.create(DOM_OBSERVER_ID.MESSAGE_BLOCKS, {
    target: threadWrapper ?? document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: observeMessageBlocks,
          id: `${DOM_OBSERVER_ID.MESSAGE_BLOCKS}-observe-message-blocks`,
        },
      ]),
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
  const messageBlocks = UiUtils.getMessageBlocks();

  CallbackQueue.getInstance().enqueue(
    observerMessageBlockBottomBar.bind(null, { messageBlocks }),
    `${DOM_OBSERVER_ID.MESSAGE_BLOCKS}-observe-message-block-bottom-bar`,
  );

  const extendedMessageBlocks: ExtendedMessageBlock[] = await Promise.all(
    messageBlocks.map(
      async (block, index): Promise<ExtendedMessageBlock> => ({
        ...block,
        title: block.$query
          .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_TITLE)
          .text(),
        isInFlight:
          (await sendMessage(
            "reactVdom:isMessageBlockInFlight",
            {
              index,
            },
            "window",
          )) ?? false,
      }),
    ),
  );

  CallbackQueue.getInstance().enqueue(
    observeCodeBlocks.bind(null, extendedMessageBlocks),
    `${DOM_OBSERVER_ID.MESSAGE_BLOCKS}-observe-code-blocks`,
  );

  globalDomObserverStore.getState().setThreadComponents({
    messageBlocks: extendedMessageBlocks,
  });
}

function observerMessageBlockBottomBar({
  messageBlocks,
}: {
  messageBlocks: MessageBlock[];
}) {
  if (!messageBlocks.length) return;

  const $messageBlockBottomBars = messageBlocks[0].$wrapper.find(
    DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR,
  );

  if ($messageBlockBottomBars.length) {
    $(document.body).css({
      "--message-block-bottom-bar-height": `${$messageBlockBottomBars[0].offsetHeight - 1}px`,
    });

    globalDomObserverStore.getState().setThreadComponents({
      messageBlockBottomBarHeight: $messageBlockBottomBars[0].offsetHeight - 1,
    });
  }

  globalDomObserverStore.getState().setThreadComponents({
    messageBlockBottomBars: messageBlocks.map(({ $wrapper }) => {
      const $bottomBar = $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR);

      if (!$bottomBar.length) return null;

      $bottomBar.internalComponentAttr(
        DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD
          .BOTTOM_BAR,
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
            isInFlight: UiUtils.isCodeBlockInFlight({
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

function observeThreadNavbar() {
  const $navbar = $(DOM_SELECTORS.THREAD.NAVBAR);

  if (!$navbar.length) return;

  $navbar.internalComponentAttr(
    DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.NAVBAR,
  );

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
    navbarChildren: $navbar.find(">div").children().toArray(),
  });
}

function observePopper() {
  const $wrapper = $(DOM_SELECTORS.THREAD.POPPER.DESKTOP);

  if (!$wrapper.length) return;

  if ($wrapper.internalComponentAttr() === OBSERVER_ID.POPPER) return;

  $wrapper.internalComponentAttr(OBSERVER_ID.POPPER);

  globalDomObserverStore.getState().setThreadComponents({
    popper: $wrapper[0],
  });
}
