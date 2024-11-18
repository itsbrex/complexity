import debounce from "lodash/debounce";
import { useCallback, useEffect, useRef, useState } from "react";

import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import UiUtils from "@/utils/UiUtils";
import { MessageBlock } from "@/utils/UiUtils.types";

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
  const messageBlocksCache = useRef<
    ReturnType<typeof UiUtils.getMessageBlocks>
  >([]);

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
      if (!activeId || activeId === previousActiveId.current) return;

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

    console.log(messageBlocks);

    const hasBlocksChanged =
      messageBlocks.length !== messageBlocksCache.current.length ||
      messageBlocks.some(
        (block, idx) =>
          getTocItemTitle(block.$query) !==
            getTocItemTitle(messageBlocksCache.current[idx]?.$query) ||
          block.$messageBlock.attr("id") !==
            messageBlocksCache.current[idx]?.$messageBlock.attr("id"),
      );

    if (isInitialized.current && !hasBlocksChanged) return;

    messageBlocksCache.current = messageBlocks;
    intersectingIds.current.clear();
    previousActiveId.current = null;
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(updateActiveItem, {
      threshold: 0,
      rootMargin: "-40% 0px -40% 0px",
    });

    const newItems = messageBlocks.map(({ $query, $messageBlock }, idx) => {
      const id = `toc-item-${idx}`;
      $messageBlock.attr("id", id);
      observer.observe($messageBlock[0]);
      return {
        id,
        title: getTocItemTitle($query),
        element: $messageBlock,
        isActive: false,
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

function getTocItemTitle($query: MessageBlock["$query"]) {
  return $query.find("textarea").text() || $query.text();
}
