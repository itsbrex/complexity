import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export default function useToolbars() {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks,
    deepEqual,
  );

  return useMemo(() => {
    if (!messageBlocks) return [];

    return messageBlocks.map((block) => {
      const $toolbar = block.nodes.$wrapper.find(
        DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR,
      );
      if (!$toolbar.length) return null;
      return $toolbar[0];
    });
  }, [messageBlocks]);
}
