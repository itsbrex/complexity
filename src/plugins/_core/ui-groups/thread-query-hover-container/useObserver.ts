import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";

const OBSERVER_ID = "cplx-thread-query-hover-container";

export function useObserver(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (state) => state.messageBlocks,
    deepEqual,
  );

  if (messageBlocks == null) return [];

  return messageBlocks.map((messageBlock) => {
    const $existingPortalContainer =
      messageBlock.nodes.$queryHoverContainer.find(
        `div[data-cplx-component="${OBSERVER_ID}"]`,
      );

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    messageBlock.nodes.$queryHoverContainer.prepend($portalContainer);

    return $portalContainer[0];
  });
}
