import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";
import { LuHistory } from "react-icons/lu";

import { CommandGroup } from "@/components/ui/command";
import ClearAllButton from "@/features/plugins/query-box/prompt-history/ClearAllButton";
import PromptHistoryItem from "@/features/plugins/query-box/prompt-history/PromptHistoryItem";
import { usePromptHistory } from "@/features/plugins/query-box/prompt-history/usePromptHistory";
import { useSlashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { getPromptHistoryService } from "@/services/indexed-db/prompt-history/prompt-history";
import { promptHistoryQueries } from "@/services/indexed-db/prompt-history/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export default function PromptHistorySlashMenuItemsWrapper() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { isOpen, selectedValue } = useSlashCommandMenuStore();
  const searchValue = useDebounce(
    useSlashCommandMenuStore((state) => state.searchValue),
    200,
  );

  const { items, isFetching, hasNextPage, fetchNextPage } = usePromptHistory({
    searchValue,
    enabled: isOpen,
  });

  useResetSelectedValue({ items });

  const deleteItem = useCallback((id: string) => {
    getPromptHistoryService().delete(id);

    queryClient.invalidateQueries({
      queryKey: promptHistoryQueries.infinite._def,
    });
  }, []);

  useEffect(() => {
    if (items && selectedValue) {
      const lastFiveItems = items.slice(-3);
      const isBottomItems = lastFiveItems.some(
        (item) => item.id === selectedValue,
      );

      if (isBottomItems && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    }
  }, [selectedValue, items, hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.length > 0 &&
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !isFetching
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (items == null || items.length === 0) return null;

  return (
    <CommandGroup
      heading={
        <div className="tw-flex tw-items-center tw-gap-1 tw-text-muted-foreground">
          <LuHistory />
          <span>auto-saved prompts</span>
          <ClearAllButton />
        </div>
      }
    >
      {items.map((item) => (
        <PromptHistoryItem
          key={item.id}
          item={item}
          isHighlighted={selectedValue === item.id}
          onDelete={deleteItem}
        />
      ))}
      <div ref={loadMoreRef} className="tw-h-1" />
    </CommandGroup>
  );
}

function useResetSelectedValue({
  items,
}: {
  items: ReturnType<typeof usePromptHistory>["items"];
}) {
  const { selectedValue, setSelectedValue } = useSlashCommandMenuStore();
  useEffect(() => {
    const selectedValueIndex = items?.findIndex(
      (item) => item.id === selectedValue,
    );

    if (selectedValueIndex === -1) {
      setSelectedValue(items?.[0]?.id ?? "");
    }
  }, [items, selectedValue, setSelectedValue]);
}
