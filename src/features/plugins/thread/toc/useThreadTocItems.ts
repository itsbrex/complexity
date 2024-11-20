import debounce from "lodash/debounce";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ExtendedMessageBlock,
  useGlobalDomObserverStore,
} from "@/features/plugins/_core/dom-observer/global-dom-observer-store";

type TocItem = {
  id: string;
  title: string;
  element: JQuery<Element>;
  isActive?: boolean;
};

const DEBOUNCE_DELAY = 100;

export function useThreadTocItems() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intersectingIds = useRef(new Set<string>());
  const previousActiveId = useRef<string | null>(null);
  const isInitialized = useRef(false);
  const messageBlocksCache = useRef<ExtendedMessageBlock[]>([]);

  const updateActiveItem = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      let hasChanges = false;

      entries.forEach((entry) => {
        const wasIntersecting = intersectingIds.current.has(entry.target.id);
        if (entry.isIntersecting && !wasIntersecting) {
          intersectingIds.current.add(entry.target.id);
          hasChanges = true;
        } else if (!entry.isIntersecting && wasIntersecting) {
          intersectingIds.current.delete(entry.target.id);
          hasChanges = true;
        }
      });

      if (!hasChanges) return;

      const activeId = Array.from(intersectingIds.current)[0];
      if (
        activeId === previousActiveId.current ||
        (!activeId && intersectingIds.current.size === 0)
      )
        return;

      previousActiveId.current = activeId;
      setTocItems((prev) =>
        prev.map((item) => ({
          ...item,
          isActive: item.id === activeId,
        })),
      );
    },
    [],
  );

  const messageBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks,
  );

  const initializeTocItems = useCallback(() => {
    if (!messageBlocks) return;

    const hasBlocksChanged =
      messageBlocks.length !== messageBlocksCache.current.length ||
      messageBlocks.some(
        (block, idx) =>
          block.title !== messageBlocksCache.current[idx].title ||
          block.$wrapper.attr("id") !==
            messageBlocksCache.current[idx]?.$wrapper.attr("id"),
      );

    if (isInitialized.current && !hasBlocksChanged) return;

    messageBlocksCache.current = messageBlocks;

    const currentActiveId = previousActiveId.current;

    intersectingIds.current.clear();
    previousActiveId.current = null;
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(updateActiveItem, {
      threshold: 0,
      rootMargin: "-40% 0px -40% 0px",
    });

    const newItems = messageBlocks.map(({ $wrapper }, idx) => {
      const id = `toc-item-${idx}`;
      $wrapper.attr("id", id);
      observer.observe($wrapper[0]);
      return {
        id,
        title: messageBlocks[idx].title,
        element: $wrapper,
        isActive: id === currentActiveId,
      };
    });

    observerRef.current = observer;
    isInitialized.current = true;
    setTocItems(newItems);
  }, [updateActiveItem, messageBlocks]);

  const debouncedInit = useMemo(
    () => debounce(initializeTocItems, DEBOUNCE_DELAY),
    [initializeTocItems],
  );

  useEffect(() => {
    debouncedInit();

    return () => {
      debouncedInit.cancel();
      observerRef.current?.disconnect();
      isInitialized.current = false;
    };
  }, [debouncedInit, initializeTocItems]);

  return tocItems;
}
