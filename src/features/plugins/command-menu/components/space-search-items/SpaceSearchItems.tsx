import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CommandEmpty, CommandGroup } from "@/components/ui/command";
import { LoadingState } from "@/features/plugins/command-menu/components/space-search-items/LoadingState";
import { SpaceItem } from "@/features/plugins/command-menu/components/space-search-items/SpaceItem";
import { useCommandMenuStore } from "@/features/plugins/command-menu/store";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SpaceSearchItems() {
  const { filter } = useCommandMenuStore();

  const {
    data: spaces,
    isLoading: isLoadingSpaces,
    isError: isErrorSpaces,
  } = useQuery({
    ...pplxApiQueries.spaces,
    enabled: filter === "spaces",
    placeholderData: keepPreviousData,
  });

  if (filter !== "spaces") return null;

  return (
    <div
      className={cn("tw-transition-opacity", {
        "tw-opacity-50": isLoadingSpaces,
      })}
    >
      {!isLoadingSpaces && !isErrorSpaces && (
        <CommandEmpty>
          {t("plugin-command-menu:commandMenu.spaceSearch.empty")}
        </CommandEmpty>
      )}
      {isErrorSpaces ? (
        <CommandEmpty>
          {t("plugin-command-menu:commandMenu.spaceSearch.error")}
        </CommandEmpty>
      ) : (
        <CommandGroup>
          {isLoadingSpaces && <LoadingState />}
          {spaces?.map((space) => <SpaceItem key={space.uuid} space={space} />)}
        </CommandGroup>
      )}
    </div>
  );
}
