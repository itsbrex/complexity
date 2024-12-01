import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";

import { CommandEmpty, CommandGroup } from "@/components/ui/command";
import { EmptyState } from "@/features/plugins/command-menu/components/thread-search-items/EmptyState";
import { LoadingState } from "@/features/plugins/command-menu/components/thread-search-items/LoadingState";
import { ThreadItem } from "@/features/plugins/command-menu/components/thread-search-items/ThreadItem";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function ThreadSearchItems() {
  const { searchValue, filter } = useCommandMenuStore();
  const debouncedValue = useDebounce(searchValue, 1000);

  const {
    data: threads,
    isFetching: isFetchingThreads,
    isLoading: isLoadingThreads,
    isError: isErrorThreads,
  } = useQuery({
    ...pplxApiQueries.threadsSearch({
      searchValue: debouncedValue,
      limit: debouncedValue.length > 0 ? 5 : undefined,
    }),
    enabled: filter === "threads",
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (filter !== "threads") return null;

  return (
    <div
      className={cn("tw-transition-opacity", {
        "tw-opacity-50": isFetchingThreads || isLoadingThreads,
      })}
    >
      {!isErrorThreads && !isLoadingThreads && (
        <EmptyState searchValue={searchValue} />
      )}
      {isErrorThreads ? (
        <CommandEmpty>
          Failed to fetch threads. Please try again later.
        </CommandEmpty>
      ) : (
        <CommandGroup
          heading={
            threads && threads.length > 0
              ? searchValue
                ? `${threads.length} latest thread(s) with the search term`
                : "Recent threads"
              : ""
          }
        >
          {isLoadingThreads && <LoadingState />}
          {threads?.map((thread) => (
            <ThreadItem key={thread.slug} thread={thread} />
          ))}
        </CommandGroup>
      )}
    </div>
  );
}
