import { useQuery } from "@tanstack/react-query";
import { LuLoader2 } from "react-icons/lu";

import { CommandEmpty, CommandGroup } from "@/components/ui/command";
import SpaceThreadItem from "@/features/plugins/command-menu/components/space-search-items/SpaceThreadItem";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SpaceThreadsSearchItems() {
  const { filter, spacethreadFilterSlug, spacethreadTitle } =
    useCommandMenuStore();

  const {
    data: spaceThreads,
    isLoading,
    isError,
  } = useQuery({
    ...pplxApiQueries.spaces._ctx.threads(spacethreadFilterSlug ?? ""),
    enabled: filter === "spaces-threads" && !!spacethreadFilterSlug,
  });

  if (filter !== "spaces-threads") return null;

  if (isLoading) {
    return (
      <div className="tw-flex tw-animate-pulse tw-items-center tw-justify-center tw-gap-2 tw-p-4 tw-text-sm tw-text-muted-foreground">
        <LuLoader2 className="tw-animate-spin" />
        <span>Loading threads for &quot;{spacethreadTitle}&quot;</span>
      </div>
    );
  }

  if (isError) {
    return (
      <CommandEmpty>
        Failed to fetch threads. Please try again later.
      </CommandEmpty>
    );
  }

  if (spaceThreads && !spaceThreads?.length) {
    return <CommandEmpty>No threads found in this space.</CommandEmpty>;
  }

  return (
    <CommandGroup heading="Complexity can only search in the 50 most recent threads.">
      {spaceThreads?.map((thread) => (
        <SpaceThreadItem key={thread.uuid} thread={thread} />
      ))}
    </CommandGroup>
  );
}
