import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { usePrevious } from "@uidotdev/usehooks";
import { useMemo } from "react";

import { PromptHistory } from "@/data/plugins/prompt-history/prompt-history.type";
import { promptHistoryQueries } from "@/services/indexed-db/prompt-history/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export function usePromptHistory({
  searchValue,
  enabled,
}: {
  searchValue: string;
  enabled: boolean;
}) {
  const previousSearchValue = usePrevious(searchValue);

  const query = useInfiniteQuery({
    queryKey: promptHistoryQueries.infinite({ searchTerm: searchValue })
      .queryKey,
    queryFn: (ctx) =>
      promptHistoryQueries.infinite({ searchTerm: searchValue }).queryFn(ctx),
    initialData: () => {
      return queryClient.getQueryData<
        InfiniteData<{
          items: PromptHistory[];
          total: number;
        }>
      >(
        promptHistoryQueries.infinite({ searchTerm: previousSearchValue ?? "" })
          .queryKey,
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages): number | undefined => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.items.length,
        0,
      );
      return totalFetched < lastPage.total ? allPages.length : undefined;
    },
    enabled,
  });

  const items = useMemo(() => {
    return query.data?.pages.flatMap((page) =>
      page.items.map((item) => ({
        id: item.id,
        prompt: item.prompt,
        createdAt: new Date(item.createdAt).toISOString(),
        keywords: item.prompt.split(" "),
      })),
    );
  }, [query.data]);

  return { ...query, items };
}
