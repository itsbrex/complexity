import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export default function useToolbars() {
  const messageBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks,
  );

  return useMemo(() => {
    if (!messageBlocks) return [];

    return messageBlocks.map((block) => {
      const $toolbar = block.$wrapper.find(
        DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR,
      );
      if (!$toolbar.length) return null;
      return $toolbar[0];
    });
  }, [messageBlocks]);
}
