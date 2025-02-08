import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const OBSERVER_ID = "cplx-thread-message-toolbar-extra-buttons-wrapper";

export function useObserver(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (state) => state.messageBlocks,
    deepEqual,
  );

  if (messageBlocks == null) return [];

  return messageBlocks.map((messageBlock) => {
    const $existingPortalContainer = messageBlock.nodes.$bottomBar.find(
      `div[data-cplx-component="${OBSERVER_ID}"]`,
    );

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    messageBlock.nodes.$bottomBar
      .find(
        DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR_CHILD
          .COPY_BUTTON,
      )
      .before($portalContainer);

    return $portalContainer[0];
  });
}
